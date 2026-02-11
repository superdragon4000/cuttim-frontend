'use client';

import {useEffect, useMemo, useState} from 'react';
import DxfParser from 'dxf-parser';

type Point = {x: number; y: number};

type DxfShape =
  | {kind: 'polyline'; points: Point[]; closed?: boolean}
  | {kind: 'circle'; center: Point; radius: number}
  | {kind: 'arc'; center: Point; radius: number; startAngle: number; endAngle: number};

type ParsedDxf = {
  bounds: {minX: number; minY: number; maxX: number; maxY: number};
  shapes: DxfShape[];
  unsupportedTypes: string[];
};

type RawEntity = {
  type?: string;
  shape?: boolean;
  closed?: boolean;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  center?: {x?: number; y?: number};
  vertices?: Array<{x?: number; y?: number}>;
  controlPoints?: Array<{x?: number; y?: number}>;
  majorAxisEndPoint?: {x?: number; y?: number};
  axisRatio?: number;
};

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function getArcPath(
  center: Point,
  radius: number,
  startAngleDeg: number,
  endAngleDeg: number,
): string {
  const start = {
    x: center.x + radius * Math.cos((startAngleDeg * Math.PI) / 180),
    y: center.y + radius * Math.sin((startAngleDeg * Math.PI) / 180),
  };
  const end = {
    x: center.x + radius * Math.cos((endAngleDeg * Math.PI) / 180),
    y: center.y + radius * Math.sin((endAngleDeg * Math.PI) / 180),
  };

  const delta = ((endAngleDeg - startAngleDeg) % 360 + 360) % 360;
  const largeArcFlag = delta > 180 ? 1 : 0;

  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

function parseDxfText(text: string): ParsedDxf {
  const parser = new DxfParser();
  const doc = parser.parseSync(text) as {entities?: RawEntity[]};
  const entities = doc.entities ?? [];

  const shapes: DxfShape[] = [];
  const unsupported = new Set<string>();

  for (const entity of entities) {
    if (entity.type === 'LINE' && (entity.vertices?.length ?? 0) >= 2) {
      const [a, b] = entity.vertices ?? [];
      if (!a || !b || !isNumber(a.x) || !isNumber(a.y) || !isNumber(b.x) || !isNumber(b.y)) {
        continue;
      }
      shapes.push({kind: 'polyline', points: [{x: a.x, y: a.y}, {x: b.x, y: b.y}]});
      continue;
    }

    if (entity.type === 'LWPOLYLINE' || entity.type === 'POLYLINE') {
      const vertices = (entity.vertices ?? [])
        .filter((v): v is {x: number; y: number} => typeof v.x === 'number' && typeof v.y === 'number')
        .map((v) => ({x: v.x, y: v.y}));
      if (vertices.length >= 2) {
        shapes.push({
          kind: 'polyline',
          points: vertices,
          closed: Boolean(entity.shape || entity.closed),
        });
      }
      continue;
    }

    if (entity.type === 'SPLINE') {
      const points = (entity.controlPoints ?? [])
        .filter((v): v is {x: number; y: number} => typeof v.x === 'number' && typeof v.y === 'number')
        .map((v) => ({x: v.x, y: v.y}));
      if (points.length >= 2) {
        shapes.push({kind: 'polyline', points});
      }
      continue;
    }

    if (
      entity.type === 'CIRCLE' &&
      entity.center &&
      isNumber(entity.center.x) &&
      isNumber(entity.center.y) &&
      isNumber(entity.radius)
    ) {
      shapes.push({
        kind: 'circle',
        center: {x: entity.center.x, y: entity.center.y},
        radius: entity.radius,
      });
      continue;
    }

    if (
      entity.type === 'ELLIPSE' &&
      entity.center &&
      isNumber(entity.center.x) &&
      isNumber(entity.center.y) &&
      entity.majorAxisEndPoint &&
      isNumber(entity.majorAxisEndPoint.x) &&
      isNumber(entity.majorAxisEndPoint.y) &&
      isNumber(entity.axisRatio)
    ) {
      const cx = entity.center.x;
      const cy = entity.center.y;
      const a = Math.hypot(entity.majorAxisEndPoint.x, entity.majorAxisEndPoint.y);
      const b = a * entity.axisRatio;
      const rotation = Math.atan2(entity.majorAxisEndPoint.y, entity.majorAxisEndPoint.x);
      const start = isNumber(entity.startAngle) ? entity.startAngle : 0;
      const end = isNumber(entity.endAngle) ? entity.endAngle : Math.PI * 2;
      const samples = 72;
      const points: Point[] = [];
      const delta = end - start;

      for (let i = 0; i <= samples; i++) {
        const t = start + (delta * i) / samples;
        const x = a * Math.cos(t);
        const y = b * Math.sin(t);
        const xr = x * Math.cos(rotation) - y * Math.sin(rotation);
        const yr = x * Math.sin(rotation) + y * Math.cos(rotation);
        points.push({x: cx + xr, y: cy + yr});
      }

      if (points.length >= 2) {
        shapes.push({kind: 'polyline', points});
      }
      continue;
    }

    if (
      entity.type === 'ARC' &&
      entity.center &&
      isNumber(entity.center.x) &&
      isNumber(entity.center.y) &&
      isNumber(entity.radius) &&
      isNumber(entity.startAngle) &&
      isNumber(entity.endAngle)
    ) {
      shapes.push({
        kind: 'arc',
        center: {x: entity.center.x, y: entity.center.y},
        radius: entity.radius,
        startAngle: entity.startAngle,
        endAngle: entity.endAngle,
      });
      continue;
    }

    if (entity.type) {
      unsupported.add(entity.type);
    }
  }

  const allPoints: Point[] = [];
  for (const shape of shapes) {
    if (shape.kind === 'polyline') {
      allPoints.push(...shape.points);
    }
    if (shape.kind === 'circle' || shape.kind === 'arc') {
      allPoints.push(
        {x: shape.center.x - shape.radius, y: shape.center.y - shape.radius},
        {x: shape.center.x + shape.radius, y: shape.center.y + shape.radius},
      );
    }
  }

  if (!allPoints.length) {
    throw new Error('No previewable entities found in DXF');
  }

  const minX = Math.min(...allPoints.map((p) => p.x));
  const minY = Math.min(...allPoints.map((p) => p.y));
  const maxX = Math.max(...allPoints.map((p) => p.x));
  const maxY = Math.max(...allPoints.map((p) => p.y));

  return {
    bounds: {minX, minY, maxX, maxY},
    shapes,
    unsupportedTypes: [...unsupported],
  };
}

export function DxfPreview({file}: {file: File | null}) {
  const [parsed, setParsed] = useState<ParsedDxf | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!file) {
        setParsed(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const text = await file.text();
        const result = parseDxfText(text);
        if (active) {
          setParsed(result);
        }
      } catch (e) {
        if (active) {
          setParsed(null);
          setError(e instanceof Error ? e.message : 'Failed to parse DXF');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [file]);

  const viewBox = useMemo(() => {
    if (!parsed) return '0 0 100 100';
    const {minX, minY, maxX, maxY} = parsed.bounds;
    const w = Math.max(1, maxX - minX);
    const h = Math.max(1, maxY - minY);
    const pad = Math.max(w, h) * 0.05;

    return `${minX - pad} ${-(maxY + pad)} ${w + pad * 2} ${h + pad * 2}`;
  }, [parsed]);

  return (
    <div className="space-y-2">
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-2">
        <svg
          viewBox={viewBox}
          className="h-64 w-full rounded-lg bg-[#0b0f14]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.2" />
            </pattern>
          </defs>
          <rect x="-100000" y="-100000" width="200000" height="200000" fill="url(#grid)" />

          {!parsed ? null : (
            <g stroke="#67e8f9" strokeWidth="0.7" fill="none">
              {parsed.shapes.map((shape, idx) => {
                if (shape.kind === 'polyline') {
                  const d = shape.points
                    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${-p.y}`)
                    .join(' ');
                  return (
                    <path
                      key={`p-${idx}`}
                      d={shape.closed ? `${d} Z` : d}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                }

                if (shape.kind === 'circle') {
                  return (
                    <circle
                      key={`c-${idx}`}
                      cx={shape.center.x}
                      cy={-shape.center.y}
                      r={shape.radius}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                }

                const d = getArcPath(
                  {x: shape.center.x, y: -shape.center.y},
                  shape.radius,
                  -shape.startAngle,
                  -shape.endAngle,
                );
                return <path key={`a-${idx}`} d={d} vectorEffect="non-scaling-stroke" />;
              })}
            </g>
          )}
        </svg>
      </div>

      {loading ? <p className="text-xs text-[var(--muted)]">Rendering DXF preview...</p> : null}
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
      {!file ? (
        <p className="text-xs text-[var(--muted)]">
          Upload a `.dxf` file to see geometry preview.
        </p>
      ) : null}
      {parsed ? (
        <p className="text-xs text-[var(--muted)]">
          Rendered entities: {parsed.shapes.length}
          {parsed.unsupportedTypes.length
            ? ` | Unsupported: ${parsed.unsupportedTypes.slice(0, 5).join(', ')}`
            : ''}
        </p>
      ) : null}
    </div>
  );
}
