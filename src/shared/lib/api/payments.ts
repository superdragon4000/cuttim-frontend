import {apiFetch} from './client';

export type PaymentCreateResponse = {
  id?: string;
  status?: string;
  confirmation?: {
    type?: string;
    confirmation_url?: string;
  };
};

export function createPayment(token: string, orderId: number) {
  return apiFetch<PaymentCreateResponse>('/payments/create', {
    method: 'POST',
    token,
    body: {orderId},
  });
}
