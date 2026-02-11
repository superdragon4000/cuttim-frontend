export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'fabricated'
  | 'shipped'
  | 'completed'
  | 'canceled';

export type PaymentStatus = 'pending' | 'paid' | 'failed';

export type OrderItem = {
  id: number;
  quantity: number;
  calculatedPrice: number;
  file: {
    id: number;
    originalName: string;
    width?: number;
    height?: number;
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
  trackingNumber?: string;
  totalPrice: number;
  shippingCost: number;
  created_at: string;
  files: OrderItem[];
};
