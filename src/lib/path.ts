import { env } from 'process';

export const url = env.BACKEND;
console.log({ url });

// const dev = true;
// export const url = dev
//   ? 'http://127.0.0.1:8000'
//   : 'https://bifrost-atdm.onrender.com';

// export const url = 'https://bifrost-atdm.onrender.com';
