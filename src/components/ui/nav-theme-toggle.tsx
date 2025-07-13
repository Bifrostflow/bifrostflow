import React from 'react';
import AppNavIconItem from './app-nav-icon-item';
import { useThemeToggle } from '@/hooks/theme-toggle';

const NavThemeToggle = () => {
  const { theme, toggleTheme } = useThemeToggle();
  return (
    <AppNavIconItem
      hoverLabel="Theme"
      iconName={theme !== 'dark' ? 'moon' : 'sun'}
      label="Theme"
      onClick={toggleTheme}
    />
  );
};

export default NavThemeToggle;
