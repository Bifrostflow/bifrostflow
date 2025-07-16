'use client';
import { ProjectWithStatus } from '@/_backend/private/projects/getProjects';
import React from 'react';
import { useClerk } from '@clerk/nextjs';
import print from '@/lib/print';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import moment from 'moment';
import { Typography } from '../typography';

type Props = {
  item: ProjectWithStatus;
};

function ProjectCard({ item }: Props) {
  const { user } = useClerk();
  print(item);
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className="relative h-80 2xl:h-80 p-4 rounded-2xl w-2xs overflow-hidden shadow-lg bg-c-surface hover:bg-c-surface/90 group border-1 border-c-border/90 hover:border-c-secondary">
      <Link
        href={`/flow/${item.id}`}
        className="block h-full w-full relative z-10">
        {/* User Info */}
        <div className="relative z-20 flex flex-row items-center gap-4 mb-4">
          <Image
            height={32}
            width={32}
            alt="Avatar"
            src={user?.imageUrl || '/icon.png'}
            className="h-8 w-8 rounded-full border-2 object-cover"
          />
          <div className="flex flex-col">
            <p className="text-c-secondary font-semibold">{user?.fullName}</p>
            <p className="text-sm text-c-background-text/70">
              {moment(item.updated_at).local().fromNow()}
            </p>
          </div>
        </div>

        {/* Background Snapshot */}
        {item.snap_path && (
          <motion.div
            initial={{ scale: 1, translateY: 0 }}
            className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-90 blur-md group-hover:blur-none group-hover:scale-120 transition-all duration-500"
            style={{
              backgroundImage: `url(${item.snap_path})`,
            }}
          />
        )}

        {/* Title + Description */}
        <div className="z-20 flex flex-col gap-1 absolute bottom-1 left-1 text-c-background-text">
          <Typography
            variant={'h2'}
            className="group-hover:text-xl  text-c-secondary-variant transition-all duration-300 ease-in-out">
            {item.name}
          </Typography>
          <Typography
            variant={'p'}
            className="group-hover:hidden text-c-background-text/90">
            {item.description?.substring(0, 60)}
            {(item.description?.length || 0) > 60 ? '...' : ''}
          </Typography>
        </div>
      </Link>
    </motion.div>
  );
}

export default ProjectCard;
