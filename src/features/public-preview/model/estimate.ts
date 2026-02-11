export const demoMaterials = [
  {id: 1, name: 'Steel', type: 'AISI 304', pricePerSquareMm: 0.0022},
  {id: 2, name: 'Aluminum', type: '5052', pricePerSquareMm: 0.0018},
  {id: 3, name: 'Acrylic', type: 'Clear', pricePerSquareMm: 0.0012},
];

export function estimateAreaFromFile(fileName: string, bytes: number) {
  const seed = Math.max(1, Math.min(20, Math.ceil((bytes || 50000) / 20000)));
  const width = 80 + seed * 15;
  const height = 60 + seed * 12;
  return {
    fileName,
    width,
    height,
    areaMm2: width * height,
  };
}

export function calculateShipping(method: 'pickup' | 'courier' | 'express', city: string) {
  if (method === 'pickup') {
    return 0;
  }

  const c = city.trim().toLowerCase();
  const metro = ['moscow', 'saint petersburg', 'москва', 'санкт-петербург'].includes(c);

  if (method === 'express') {
    return metro ? 990 : 1290;
  }

  return metro ? 490 : 690;
}
