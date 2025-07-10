'use client';
import { ProjectWithStatus } from '@/_backend/private/projects/getProjects';
import React from 'react';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
import { Typography } from '../typography';
import print from '@/lib/print';
type Props = {
  item: ProjectWithStatus;
};

function ProjectCard({ item }: Props) {
  const { user } = useClerk();
  print(item);
  return (
    <Link href={`/flow/${item.id}`}>
      <div className="rounded-md min-w-2xs max-w-2xs w-full group/card bg-c-surface">
        <div
          className={cn(
            'cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-sm mx-auto flex flex-col justify-between p-4 dark:border-2 dark:border-c-border',
          )}>
          {/* ✅ Scalable background image layer */}
          {item.snap_path && (
            <div
              className={cn(
                'absolute inset-0 bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover/card:scale-110 z-0',
              )}
              style={{
                backgroundImage: `url(${item.snap_path})`,
              }}></div>
          )}

          {/* ✅ Overlay gradient */}
          <div className="absolute inset-0 transition duration-300  bg-gradient-to-b from-transparent dark:via-black/50 hover:dark:via-transparent dark:to-black/90 via-transparent to-c-primary/90 opacity-60 z-10"></div>

          {/* ✅ Foreground content */}
          <div className="flex flex-row items-center space-x-4 z-20">
            <Image
              height="100"
              width="100"
              alt="Avatar"
              src={user?.imageUrl || '/icon.png'}
              className="h-10 w-10 rounded-full border-2 object-cover"
            />
            <div className="flex flex-col">
              <Typography variant={'p'}>{user?.fullName}</Typography>
              <p className="text-sm text-gray-400">
                {moment(item.updated_at).startOf('day').fromNow()}
              </p>
            </div>
          </div>

          <div className="text content flex gap-2 flex-col z-20">
            <Typography
              variant={'h3'}
              className="font-bold relative z-10 text-c-background-text">
              {item.name}
            </Typography>
            <Typography
              variant={'p'}
              className="font-normal text-sm relative z-10 text-c-background-text-muted">
              {item.description?.substring(0, 60)}...
            </Typography>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
