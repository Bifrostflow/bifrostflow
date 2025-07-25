import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2 py-1 text-sm font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden justify-center items-center bg-gradient-to-b',
  {
    variants: {
      variant: {
        default:
          'border-0 bg-gradient-to-b from-c-primary via-c-primary to-c-primary-variant text-c-on-primary [a&]:hover:bg-primary/90',
        secondary:
          'border-0 from-c-secondary via-c-secondary to-c-secondary-variant text-c-on-secondary [a&]:hover:bg-secondary/90',
        destructive:
          'border-0 from-destructive via-destructive to-red-600 text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        primary_outline:
          'border border-c-primary text-c-primary bg-transparent',
        secondary_outline:
          'border border-c-secondary text-c-secondary bg-transparent',
        destructive_outline:
          'border border-destructive text-destructive bg-transparent',
        outline_2:
          'border border-c-background-text text-c-background-text bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
