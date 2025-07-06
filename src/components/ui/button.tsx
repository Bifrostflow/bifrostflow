import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { makeBurst } from '@/lib/spark-effect';
import '@/components/ui/spark.css';

const variantToColorMap: Record<string, string> = {
  default: '--spark',
  destructive: '--spark',
  secondary: '--spark',
  ghost: '--spark',
  outline: '--spark',
  outline_primary: '--spark',
  outline_secondary: '--spark',
  link: '--spark',
};

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:scale-[1.05] active:scale-[1.02] duration-100",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-c-primary to-c-primary-variant text-c-on-primary ',
        // 'bg-c-primary text-c-on-primary shadow-xs hover:bg-c-primary-variant',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        outline_primary:
          'border text-c-primary-variant bg-c-primary/10 shadow-xs hover:bg-c-primary/30 ',
        outline_secondary:
          'border text-c-secondary-variant bg-c-secondary/10 shadow-xs hover:bg-c-secondary/30',
        secondary:
          'bg-gradient-to-br from-c-secondary to-c-secondary-variant text-c-on-secondary shadow-xs hover:bg-c-secondary-variant',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline shadow-none',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-full px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const center = {
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY,
    };
    const color = variantToColorMap[variant ?? 'default'];
    makeBurst(center, color); // 👈 pass color

    props.onClick?.(e); // call parent onClick
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      onClick={handleClick} // <-- override click to inject spark
    />
  );
}

export { Button, buttonVariants };
