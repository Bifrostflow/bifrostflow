import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';

export const createUser = async () => {
  const endpoint = `${url}/create-user`;
  try {
    const { getToken } = await auth(); // 👈 SSR-safe
    const token = await getToken();
    console.log(token);
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch project files');
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching project files:', error);
  }
};
