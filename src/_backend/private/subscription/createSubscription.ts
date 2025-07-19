'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { APIResponse } from '@/_backend/models/response';

interface CreateSubscription {
  plan_id: string;
}

export interface CreateSubscriptionResponse {
  sub_id: string;
}

export const createSubscription = async (
  body: CreateSubscription,
): Promise<APIResponse<CreateSubscriptionResponse> | null> => {
  const endpoint = `${url}/start-subscription?plan_id=${body.plan_id}`;
  try {
    const { getToken } = await auth();
    const token = await getToken();

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to subscribe');
    }

    const json: APIResponse<CreateSubscriptionResponse> = await res.json();
    return json;
  } catch (error) {
    console.error('Error subscribing', error);
    return null;
  }
};

interface SubscriptionPaymentVerificationRequest {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}
interface VerifySubscriptionResponse {
  status: string;
}
export const verifySubscriptionPayment = async (
  body: SubscriptionPaymentVerificationRequest,
): Promise<APIResponse<VerifySubscriptionResponse> | null> => {
  const endpoint = `${url}/verify-subscription`;
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
      throw new Error('Failed to verifying subscription');
    }

    const json: APIResponse<VerifySubscriptionResponse> = await res.json();
    return json;
  } catch (error) {
    console.error('Error verifying subscription', error);
    return null;
  }
};
