import { useThemeToggle } from '@/hooks/theme-toggle';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeToggle();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 border rounded dark:border-white border-black">
      {theme === 'dark' ? 'Switch to Light 🌞' : 'Switch to Dark 🌙'}
    </button>
  );
}
