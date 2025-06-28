import { testAuth } from '@/_backend/private/test';
export default async function Dashboard({}: { children: React.ReactNode }) {
  try {
    const data = await testAuth();
    console.log(data);
    return <div>Dashboard {!!data && 'woho'}</div>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_e) {
    return <h1>Error</h1>;
  }
}
