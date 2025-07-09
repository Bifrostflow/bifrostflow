import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import '@/components/ui/spark.css';

const typographyVariants = cva('', {
  variants: {
    variant: {
      h1: 'scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance',
      h2: 'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      inline_code:
        'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    },
  },
  defaultVariants: {
    variant: 'p',
    //   size: 'default',
  },
});

function Typography({
  className,
  variant,
  //   size,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof typographyVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="div"
      className={cn(typographyVariants({ variant, className }))}
      {...props} // <-- override click to inject spark
    />
  );
}

export { Typography, typographyVariants };
