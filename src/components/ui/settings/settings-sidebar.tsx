'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Typography } from '../typography';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { cn } from '@/lib/utils';

const options = [
  { label: 'Profile', path: 'profile', icon: 'user' },
  { label: 'Theme', path: 'theme', icon: 'sun' },
  { label: 'Accessibility', path: 'accessibility', icon: 'touchpad' },
  { label: 'Plans', path: 'plans', icon: 'dollar-sign' },
];

export default function SettingsSidebar({}) {
  const pathname = usePathname();

  return (
    <aside className="h-[70vh] w-full md:w-64 border-r-2 border-r-c-divider bg-c-primary rounded-xl text-c-on-primary">
      <div id="header" className="p-6 justify-center items-center flex ">
        <Typography variant={'h2'} className="font-bold mb-4 mr-2">
          Settings
        </Typography>
      </div>
      <ul className="flex flex-col">
        {options.map(opt => (
          <Link key={opt.path} href={`${opt.path}`} className="block">
            <li
              className={cn(
                'flex flex-row gap-4 justify-start items-center p-3 pl-5 text-c-on-surface transition-all duration-200 ease-linear',

                // Hover styles (remove border on hover)
                'hover:bg-c-on-primary/80 hover:text-c-primary hover:rounded-lg hover:m-1 hover:p-2 hover:pl-4 ',

                // Selected (active) styles
                pathname.includes(opt.path) &&
                  'bg-c-primary-variant text-c-on-primary-variant',
              )}>
              <DynamicIcon name={opt.icon as IconName} size={24} />
              <Typography variant={'h4'}>{opt.label}</Typography>
            </li>
          </Link>
        ))}
      </ul>
    </aside>
  );
}
