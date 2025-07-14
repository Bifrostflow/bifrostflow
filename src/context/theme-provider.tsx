'use client';

import { useEffect, useState } from 'react';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark';
    const currentTheme = saved === 'light' ? 'light' : 'dark';
    setTheme(currentTheme);
    document.body.classList.toggle('dark', currentTheme === 'dark');
  }, []);

  return <>{children}</>;
}
