'use client';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const bifrostStyle = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
} as React.CSSProperties;

const bifrostClass =
  'bg-[linear-gradient(to_right,_theme(colors.green.700),_theme(colors.green.900))] text-white font-medium px-3 py-2 rounded-lg shadow-lg';

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      style={bifrostStyle}
      toastOptions={{
        classNames: { toast: bifrostClass },
        unstyled: true,
      }}
      {...props}
    />
  );
};

export { Toaster };
