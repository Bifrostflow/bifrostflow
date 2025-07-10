import React from 'react';
import { Typography } from '../typography';
import { cn } from '@/lib/utils';
import getTemplates from '@/_backend/private/projects/getTemplates';
import AppTemplate from './app-template';
import ExploreMarketPlace from './explore-marketplace';

const AppTemplates = async () => {
  const data = await getTemplates();
  if (!data?.data) {
    return <p>No Data found</p>;
  }
  return (
    <section>
      <div>
        <div className="flex flex-row justify-start items-center gap-4">
          <Typography variant={'h2'}>Templates</Typography>
          <div className="border-b border-c-background-text/30 my-2 w-full" />
          <ExploreMarketPlace />
        </div>
      </div>
      <div className={cn('flex flex-row gap-4 my-4 flex-wrap')}>
        {data.data.map(res => {
          return <AppTemplate item={res} key={res.id} />;
        })}
      </div>
    </section>
  );
};

export default AppTemplates;
