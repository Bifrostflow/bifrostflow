import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';

export type DrawerPositionType = 'left' | 'right' | 'bottom' | 'top' | 'center';

interface Props {
  position: DrawerPositionType;
  visible: boolean;
  onClose: (visible: boolean) => void;
  children: ReactNode;
  width?: string;
  height?: string;
}

// Start off-screen
const initialVariants: Record<
  DrawerPositionType,
  { x?: number; y?: number; opacity?: number }
> = {
  bottom: { y: 2000, opacity: 0 },
  center: { y: 2000, opacity: 0 },
  left: { x: -2000, opacity: 0 },
  right: { x: 2000, opacity: 0 },
  top: { y: -2000, opacity: 0 },
};

// Animate into view
const animateVariants: Record<
  DrawerPositionType,
  { x?: number; y?: number; opacity: number }
> = {
  bottom: { y: 0, opacity: 1 },
  top: { y: 0, opacity: 1 },
  left: { x: 0, opacity: 1 },
  right: { x: 0, opacity: 1 },
  center: { y: 0, opacity: 1 },
};

// Positioning classes
const positionClasses: Record<DrawerPositionType, string> = {
  bottom: 'fixed bottom-0 left-0 w-full',
  top: 'fixed top-0 left-0 w-full',
  left: 'fixed top-0 left-0 h-full',
  right: 'fixed top-0 right-0 h-full',
  center: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

function Drawer({
  onClose,
  position,
  visible,
  children,
  width,
  height,
  ...rest
}: React.ComponentProps<'div'> & Props) {
  return (
    <motion.div
      initial={initialVariants[position]}
      animate={visible ? animateVariants[position] : initialVariants[position]}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className={cn(
        'bg-c-surface shadow-xl rounded-xl p-4',
        positionClasses[position],
        width ? width : 'w-fit',
        height ? height : 'h-fit',
        position !== 'center'
          ? 'z-50'
          : 'fixed inset-0 m-auto flex justify-center items-center z-50',
        rest.className,
      )}>
      <Button onClick={() => onClose(false)}>Close</Button>
      {children}
    </motion.div>
  );
}

export default Drawer;
