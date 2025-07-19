'use server';

import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';
import { APIResponse } from '@/_backend/models/response';

export const cancelSubscription =
  async (): Promise<APIResponse<null> | null> => {
    const endpoint = `${url}/cancel-plan`;
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
        throw new Error('Failed to cancel plan.');
      }

      const json: APIResponse<null> = await res.json();
      return json;
    } catch (error) {
      console.error('Error cancelling plan', error);
      return null;
    }
  };
