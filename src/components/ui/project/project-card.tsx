/* eslint-disable @next/next/no-img-element */
'use client';
import { ProjectWithStatus } from '@/_backend/private/projects/getProjects';
import React from 'react';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/lib/utils';
import moment from 'moment';
import Link from 'next/link';
import Image from 'next/image';
type Props = {
  item: ProjectWithStatus;
};

function ProjectCard({ item }: Props) {
  const { user } = useClerk();
  return (
    <Link href={`/flow/${item.id}`}>
      <div className="min-w-2xs w-full group/card ">
        <div
          className={cn(
            'cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl  max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4 border-2 border-c-border',
            'bg-center bg-no-repeat bg-cover bg-[url("/test-ss.png")]',
          )}>
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black bg-gradient-to-b from-transparent via-transparent to-black/90 opacity-60"></div>
          <div className="flex flex-row items-center space-x-4 z-10">
            <Image
              height="100"
              width="100"
              alt="Avatar"
              src={user?.imageUrl || '/icon.png'}
              className="h-10 w-10 rounded-full border-2 object-cover"
            />
            <div className="flex flex-col">
              <p className="font-normal text-base text-gray-50 relative z-10">
                {user?.fullName}
              </p>
              <p className="text-sm text-gray-400">
                {moment(item.updated_at).startOf('day').fromNow()}
              </p>
            </div>
          </div>
          <div className="text content">
            <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
              {item.name}
            </h1>
            <p className="font-normal text-sm text-gray-50 relative z-10 my-4">
              {item.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProjectCard;
