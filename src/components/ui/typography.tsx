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
    //   size: {
    //     default: 'h-9 px-4 py-2 has-[>svg]:px-3',
    //     sm: 'h-8 rounded-full gap-1.5 px-3 has-[>svg]:px-2.5',
    //     lg: 'h-10 rounded-full px-6 has-[>svg]:px-4',
    //     icon: 'size-9',
    //   },
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
}: React.ComponentProps<'button'> &
  VariantProps<typeof typographyVariants> & {
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
      className={cn(typographyVariants({ variant, className }))}
      {...props}
      onClick={handleClick} // <-- override click to inject spark
    />
  );
}

export { Typography, typographyVariants };
