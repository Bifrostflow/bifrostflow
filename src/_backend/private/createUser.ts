import { url } from '@/lib/path';
import { auth } from '@clerk/nextjs/server';

export const createUser = async () => {
  const endpoint = `${url}/create-user`;
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
      return null;
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching project files:', error);
  }
};
