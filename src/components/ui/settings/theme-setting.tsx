'use client';
import { DynamicIcon } from 'lucide-react/dynamic';
import { Typography } from '../typography';
import { useThemeToggle } from '@/hooks/theme-toggle';

export default function ThemeSettings() {
  const { theme, toggleTheme } = useThemeToggle();
  return (
    <div className="pb-4 md:pr-4 pt-2 flex gap-6 flex-col">
      <div className="rounded-xl p-4 hidden md:flex flex-row justify-start items-center">
        <Typography
          variant={'h2'}
          className="font-semibold text-c-primary pb-0">
          Theme
        </Typography>
      </div>
      {/* <div className="p-4 bg-red-800 sm:bg-blue-300 md:bg-pink-300 lg:bg-red-500 xl:bg-yellow-400"></div> */}
      <div className="bg-c-primary-variant/10 rounded-xl p-4 m-2 md:m-0">
        <button
          className="flex flex-row gap-4 cursor-pointer bg-c-secondary px-4 py-3 rounded-lg text-c-on-secondary"
          onClick={toggleTheme}>
          <DynamicIcon name={theme === 'light' ? 'moon' : 'sun'} size={28} />
          <Typography className="font-semibold">Change Theme</Typography>
        </button>
      </div>
    </div>
  );
}
