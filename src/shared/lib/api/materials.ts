import {apiFetch} from './client';

export type Material = {
  id: number;
  name: string;
  type: string;
  thickness: number;
  unit: string;
  pricePerSquareMm: number;
};

export function getMaterials() {
  return apiFetch<Material[]>('/materials');
}
