import {apiFetch} from './client';

export type ShippingMethod = 'pickup' | 'courier' | 'express';
export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'fabricated'
  | 'shipped'
  | 'completed'
  | 'canceled';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type OrderFile = {
  id: number;
  quantity: number;
  calculatedPrice: number;
  file: {
    id: number;
    originalName: string;
    width?: number;
    height?: number;
    areaMm2?: number;
  };
  material: {
    id: number;
    name: string;
    type: string;
  };
};

export type Order = {
  id: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number;
  shippingCost: number;
  trackingNumber?: string;
  created_at: string;
  files: OrderFile[];
};

export type PreviewResponse = {
  currency: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  items: Array<{
    fileId: number;
    fileName: string;
    materialId: number;
    materialName: string;
    quantity: number;
    width: number;
    height: number;
    areaMm2: number;
    lineTotal: number;
  }>;
};

export type CreateOrderPayload = {
  files: Array<{
    fileId: number;
    materialId: number;
    quantity: number;
  }>;
  shipping: {
    recipientName: string;
    recipientPhone: string;
    country: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    postalCode: string;
    method: ShippingMethod;
  };
  comment?: string;
  type?: 'laser' | '3d';
};

export function previewOrder(token: string, payload: CreateOrderPayload) {
  return apiFetch<PreviewResponse>('/orders/preview', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function createOrder(token: string, payload: CreateOrderPayload) {
  return apiFetch<Order>('/orders/create', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function getOrders(token: string, query?: Record<string, string | number | undefined>) {
  const url = new URL('/orders', 'http://dummy.local');
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });

  return apiFetch<Order[]>(url.pathname + url.search, {token});
}

export function updateOrderStatus(token: string, orderId: number, status: OrderStatus, managerComment?: string) {
  return apiFetch<Order>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    token,
    body: {status, managerComment},
  });
}

export function updateTracking(token: string, orderId: number, trackingNumber: string) {
  return apiFetch<Order>(`/orders/${orderId}/tracking`, {
    method: 'PATCH',
    token,
    body: {trackingNumber},
  });
}

export function updatePaymentStatus(token: string, orderId: number, paymentStatus: PaymentStatus) {
  return apiFetch<Order>(`/orders/${orderId}/payment-status`, {
    method: 'PATCH',
    token,
    body: {paymentStatus},
  });
}
