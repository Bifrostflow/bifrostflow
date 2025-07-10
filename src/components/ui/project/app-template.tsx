'use client';

import React from 'react';
import { Card, CardDescription, CardTitle } from '../card';
import Link from 'next/link';
import { FlowTemplate } from '@/_backend/private/projects/getTemplates';

type Props = {
  item: FlowTemplate;
};

function AppTemplate({ item }: Props) {
  return (
    <div>
      <Link href={`/templates/${item.id}`}>
        <Card className="w-[300px] h-[300px] flex justify-center items-center m-2 p-2 ">
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>
            {item.description.substring(0, 100)}...
          </CardDescription>
        </Card>
      </Link>
    </div>
  );
}

export default AppTemplate;
