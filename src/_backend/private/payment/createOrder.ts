'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { APIResponse } from '@/_backend/models/response';

interface CreateOrder {
  amount: number;
  currency: string;
  receipt: string;
}

export interface CreateOrderResponse {
  order_id: string;
  key_id: string;
  receipt_id: string;
}

export const createOrder = async (
  body: CreateOrder,
): Promise<APIResponse<CreateOrderResponse> | null> => {
  const endpoint = `${url}/create-order`;
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to create order');
    }

    const json: APIResponse<CreateOrderResponse> = await res.json();
    return json;
  } catch (error) {
    console.error('Error creating order', error);
    return null;
  }
};

interface PaymentVerificationRequest {
  order_id: string;
  payment_id: string;
  signature: string;
  receipt_id: string;
}
interface VerifyOrderResponse {
  status: string;
}
export const verifyPayment = async (
  body: PaymentVerificationRequest,
): Promise<APIResponse<VerifyOrderResponse> | null> => {
  const endpoint = `${url}/verify-payment`;
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to create project');
    }

    const json: APIResponse<VerifyOrderResponse> = await res.json();
    return json;
  } catch (error) {
    console.error('Error creating project', error);
    return null;
  }
};
