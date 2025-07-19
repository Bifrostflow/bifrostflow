'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { APIResponse } from '@/_backend/models/response';

interface CreateOrder {
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
    console.log(res);
    if (!res.ok) {
      console.log('RESP:::', res);
      return {
        data: await res.json(),
        isSuccess: false,
        error: '',
        message: 'failed response',
      };
    }

    const json: APIResponse<CreateOrderResponse> = await res.json();
    return json;
  } catch (error) {
    console.log('ERROR: ', error);
    console.error('Error creating order', error);
    return {
      data: null,
      error: null,
      isSuccess: false,
      message: 'Something gone wrong...' + error,
    };
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
