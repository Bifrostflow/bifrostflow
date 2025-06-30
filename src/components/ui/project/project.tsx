'use client';
import { ProjectWithStatus } from '@/_backend/private/projects/getProjects';
import React from 'react';
import { Card, CardDescription, CardTitle } from '../card';
import Link from 'next/link';

type Props = {
  item: ProjectWithStatus;
};

function Project({ item }: Props) {
  return (
    <Link href={`/flow/${item.id}`}>
      <Card className="w-[150px] h-[150px] flex justify-center items-center m-2">
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </Card>
    </Link>
  );
}

export default Project;
