'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Label } from './label';

const checkboxVariants = cva(
  'peer border-2 data-[state=checked]:border-0   data-[state=checked]:text-primary-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] shadow-xs  outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-1-- ease-in-out',
  {
    variants: {
      variant: {
        primary:
          'border-c-primary data-[state=checked]:bg-c-primary data-[state=checked]:border-c-primary data-[state=checked]:bg-c-primary',
        secondary:
          'border-c-secondary data-[state=checked]:bg-c-secondary data-[state=checked]:border-c-secondary data-[state=checked]:bg-c-secondary',
        adaptive:
          'border-c-background-text data-[state=checked]:bg-c-background-text data-[state=checked]:border-c-background-text data-[state=checked]:bg-c-background-text',
      },
    },
    defaultVariants: {
      variant: 'adaptive',
    },
  },
);

function Checkbox({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> &
  VariantProps<typeof checkboxVariants> & {
    asChild?: boolean;
  }) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ variant, className }))}
      {...props}>
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none">
        <CheckIcon className="size-4" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
const CheckBoxField = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row justify-start items-center gap-3">
      {children}
    </div>
  );
};

export const AppCheckBox = ({
  text,
  variant,
  id,
}: { text: string; id: string } & VariantProps<typeof checkboxVariants> & {
    asChild?: boolean;
  }) => {
  return (
    <CheckBoxField>
      <Checkbox variant={variant} id={id} />
      <Label htmlFor={id}>{text}</Label>
    </CheckBoxField>
  );
};

export { Checkbox, CheckBoxField };
