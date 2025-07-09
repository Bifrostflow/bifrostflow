import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type DrawerPositionType = 'left' | 'right' | 'bottom' | 'top' | 'center';

interface Props {
  position: DrawerPositionType;
  visible: boolean;
  onClose: (visible: boolean) => void;
  children: ReactNode;
  width?: string;
  height?: string;
}

const THRESHOLD = 120;

const initialVariants: Record<
  DrawerPositionType,
  { x?: number; y?: number; opacity?: number }
> = {
  bottom: { y: 1000, opacity: 0 },
  center: { y: 1000, opacity: 0 },
  left: { x: -1000, opacity: 0 },
  right: { x: 1000, opacity: 0 },
  top: { y: -1000, opacity: 0 },
};

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

const positionClasses: Record<DrawerPositionType, string> = {
  bottom: 'fixed bottom-0 left-0 w-full',
  top: 'fixed top-0 left-0 w-full',
  left: 'fixed top-0 left-0 h-full',
  right: 'fixed top-0 right-0 h-full',
  center: 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
};

const dragAxis: Record<DrawerPositionType, 'x' | 'y' | undefined> = {
  left: 'x',
  right: 'x',
  top: 'y',
  bottom: 'y',
  center: undefined,
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
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number; y: number } },
  ) => {
    const offset = info.offset;

    switch (position) {
      case 'left':
        if (offset.x < -THRESHOLD) onClose(false);
        break;
      case 'right':
        if (offset.x > THRESHOLD) onClose(false);
        break;
      case 'top':
        if (offset.y < -THRESHOLD) onClose(false);
        break;
      case 'bottom':
        if (offset.y > THRESHOLD) onClose(false);
        break;
      default:
        break;
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/10 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => onClose(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={initialVariants[position]}
            animate={animateVariants[position]}
            exit={initialVariants[position]}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag={dragAxis[position]}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={0.2} // magnetic effect
            onDragEnd={handleDragEnd}
            className={cn(
              'dark:bg-zinc-700 bg-white shadow-xl rounded-xl p-4 z-50 transition-all duration-100 ease-in',
              positionClasses[position],
              width ? width : 'w-fit',
              height ? height : 'h-fit',
              rest.className,
            )}>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Drawer;
