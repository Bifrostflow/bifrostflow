'use client';

import React from 'react';
import Link from 'next/link';
import { FlowTemplate } from '@/_backend/private/projects/getTemplates';
import { motion } from 'framer-motion';
import Image from 'next/image';
import moment from 'moment';
import { Typography } from '../typography';
import { Button } from '../button';
import BuyNow from '../template/buy-now';
import { cn } from '@/lib/utils';

type Props = {
  item: FlowTemplate;
};

function AppTemplate({ item }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative h-80 p-4 rounded-2xl min-w-2xs max-w-2xs w-full overflow-hidden shadow-lg bg-c-surface hover:bg-c-surface/90 group border-1 border-c-border/90 hover:border-c-primary-variant">
      <div className="block h-full w-full relative z-10">
        {/* User Info */}
        <div className="relative z-20 flex flex-row items-center gap-4 mb-4">
          <Image
            height={32}
            width={32}
            alt="Avatar"
            src={'/icon.png'}
            className="h-8 w-8 rounded-full border-2 border-c-primary object-cover"
          />
          <div className="flex flex-col">
            <p className="text-c-primary-variant border-c-primary-variant font-semibold capitalize">
              {item.createdBy}
            </p>
            <p className="text-sm text-c-background-text/70">
              {moment(item.createdAt).local().fromNow()}
            </p>
          </div>
        </div>
        {/* Title + Description */}
        <div className="z-20 flex flex-col gap-1 absolute bottom-1 left-1 text-c-background-text">
          <Typography
            variant={'h2'}
            className="text-c-primary-variant border-c-primary-variant">
            {item.name}
          </Typography>
          <Typography variant={'p'} className="text-c-background-text/90">
            {item.description?.substring(0, 60)}
            {(item.description?.length || 0) > 60 ? '...' : ''}
          </Typography>
          <Typography
            className={cn(
              'font-semibold',
              !!item.price
                ? 'text-shadow-c-surface-text-muted'
                : 'text-c-secondary',
            )}>
            Price: {!!item.price ? `$${item.price}` : 'Free'}
          </Typography>
          <div className="flex flex-row justify-between items-center mt-2">
            <Link href={`/templates/${item.id}`}>
              <Button variant={'default'} className="">
                View Template
              </Button>
            </Link>
            <BuyNow product={item} UIRole="card" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default AppTemplate;
