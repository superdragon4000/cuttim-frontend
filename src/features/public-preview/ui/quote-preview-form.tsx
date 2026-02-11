'use client';

import {useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Card} from '@/shared/ui/card/ui';
import {Button} from '@/shared/ui/button/ui';
import {useAppDispatch, useAppSelector} from '@/shared/lib/hooks/redux';
import {updateQuote} from '@/app/store/slices/quote-slice';
import {calculateShipping, demoMaterials, estimateAreaFromFile} from '../model/estimate';
import {getMaterials, type Material} from '@/shared/lib/api/materials';
import {uploadFile} from '@/shared/lib/api/files';
import {
  createOrder,
  previewOrder,
  type CreateOrderPayload,
  type PreviewResponse,
} from '@/shared/lib/api/orders';
import {createPayment} from '@/shared/lib/api/payments';

type ShippingMethod = 'pickup' | 'courier' | 'express';

const initialShipping = {
  recipientName: 'Demo Client',
  recipientPhone: '+79990000000',
  country: 'Russia',
  city: 'Moscow',
  addressLine1: 'Lenina 1',
  addressLine2: '',
  postalCode: '101000',
};

export function QuotePreviewForm() {
  const t = useTranslations('preview');
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.accessToken);
  const user = useAppSelector((state) => state.auth.user);

  const [file, setFile] = useState<File | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [materialId, setMaterialId] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('courier');
  const [shipping, setShipping] = useState(initialShipping);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [lastPayload, setLastPayload] = useState<CreateOrderPayload | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);

  useEffect(() => {
    getMaterials()
      .then((res) => {
        setMaterials(res);
        if (res.length > 0) {
          setMaterialId(res[0].id);
        }
      })
      .catch(() => {
        setMaterials([]);
      });
  }, []);

  const geometry = useMemo(() => {
    if (!file) {
      return estimateAreaFromFile('demo-part.dxf', 48000);
    }
    return estimateAreaFromFile(file.name, file.size);
  }, [file]);

  const effectiveMaterials = materials.length ? materials : demoMaterials;
  const selectedMaterial =
    effectiveMaterials.find((m) => m.id === materialId) ?? effectiveMaterials[0];

  const guestSubtotal =
    geometry.areaMm2 * (selectedMaterial?.pricePerSquareMm ?? 0.001) * quantity;
  const guestShipping = calculateShipping(shippingMethod, shipping.city);
  const guestTotal = guestSubtotal + guestShipping;

  const onPreview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    dispatch(
      updateQuote({
        fileName: file?.name ?? geometry.fileName,
        materialId,
        quantity,
        shippingMethod,
      }),
    );

    if (!token || user?.role !== 'client') {
      setPreview(null);
      return;
    }

    if (!file) {
      setError('For real backend preview upload a DXF file first.');
      return;
    }

    setLoading(true);
    try {
      const uploaded = await uploadFile(file, token);
      const payload: CreateOrderPayload = {
        files: [{fileId: uploaded.id, materialId, quantity}],
        shipping: {
          ...shipping,
          method: shippingMethod,
        },
        comment: 'Created from frontend quote preview',
        type: 'laser',
      };

      const quote = await previewOrder(token, payload);
      setPreview(quote);
      setLastPayload(payload);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Preview failed');
    } finally {
      setLoading(false);
    }
  };

  const onCreateOrder = async () => {
    if (!token || !lastPayload) return;

    setLoading(true);
    setError(null);
    try {
      const order = await createOrder(token, lastPayload);
      setOrderId(order.id);

      const payment = await createPayment(token, order.id);
      const paymentUrl = payment.confirmation?.confirmation_url;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <form className="space-y-5" onSubmit={onPreview}>
          <label className="block text-sm">
            <span className="mb-2 block text-[var(--muted)]">DXF File</span>
            <input
              type="file"
              accept=".dxf"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-2 block text-[var(--muted)]">{t('material')}</span>
            <select
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
              value={materialId}
              onChange={(e) => setMaterialId(Number(e.target.value))}
            >
              {effectiveMaterials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} {m.type}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-[var(--muted)]">{t('quantity')}</span>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value || 1)))}
              />
            </label>

            <label className="block text-sm">
              <span className="mb-2 block text-[var(--muted)]">{t('shipping')}</span>
              <select
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value as ShippingMethod)}
              >
                <option value="pickup">Pickup</option>
                <option value="courier">Courier</option>
                <option value="express">Express</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
              placeholder="Recipient"
              value={shipping.recipientName}
              onChange={(e) => setShipping((s) => ({...s, recipientName: e.target.value}))}
            />
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
              placeholder="Phone"
              value={shipping.recipientPhone}
              onChange={(e) => setShipping((s) => ({...s, recipientPhone: e.target.value}))}
            />
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
              placeholder="City"
              value={shipping.city}
              onChange={(e) => setShipping((s) => ({...s, city: e.target.value}))}
            />
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
              placeholder="Address"
              value={shipping.addressLine1}
              onChange={(e) => setShipping((s) => ({...s, addressLine1: e.target.value}))}
            />
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
              placeholder="Postal code"
              value={shipping.postalCode}
              onChange={(e) => setShipping((s) => ({...s, postalCode: e.target.value}))}
            />
            <input
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-3 text-sm"
              placeholder="Country"
              value={shipping.country}
              onChange={(e) => setShipping((s) => ({...s, country: e.target.value}))}
            />
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : token ? 'Preview from backend' : t('cta')}
          </Button>

          {token && user?.role === 'client' && preview ? (
            <Button type="button" className="w-full" variant="outline" onClick={onCreateOrder} disabled={loading}>
              Create order and pay
            </Button>
          ) : null}
        </form>
      </Card>

      <Card className="space-y-4">
        <h3 className="text-lg font-semibold">{t('resultTitle')}</h3>
        <div className="space-y-2 text-sm text-[var(--muted)]">
          <p>File: {file?.name ?? 'demo-part.dxf'}</p>
          <p>
            Bounding box: {geometry.width} x {geometry.height} mm
          </p>
          <p>Area: {geometry.areaMm2.toFixed(0)} mm²</p>
          <p>
            Material: {selectedMaterial?.name} {selectedMaterial?.type}
          </p>
          <p>Quantity: {quantity}</p>
        </div>

        <div className="h-px bg-[var(--border)]" />

        <div className="space-y-2 text-sm">
          <p className="flex items-center justify-between">
            <span>Subtotal</span>
            <strong>{(preview?.subtotal ?? guestSubtotal).toFixed(2)} RUB</strong>
          </p>
          <p className="flex items-center justify-between">
            <span>Shipping</span>
            <strong>{(preview?.shippingCost ?? guestShipping).toFixed(2)} RUB</strong>
          </p>
          <p className="flex items-center justify-between text-base">
            <span>Total</span>
            <strong>{(preview?.total ?? guestTotal).toFixed(2)} RUB</strong>
          </p>
          {orderId ? <p className="text-emerald-300">Order #{orderId} created.</p> : null}
        </div>

        <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-3 text-xs text-[var(--muted)]">
          {!token
            ? 'Guest demo mode is active. Login as client to run real backend flow (/files/upload -> /orders/preview -> /orders/create -> /payments/create).'
            : user?.role !== 'client'
              ? 'Logged in as manager. Backend preview/create endpoints are client-only.'
              : 'Backend-connected mode is active.'}
        </p>
      </Card>
    </div>
  );
}
