'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '../button';
import { HeartIcon } from 'lucide-react';

const MarkFavourite = ({ template_id }: { template_id: string }) => {
  const [isFav, setIsFav] = useState(false);
  useEffect(() => {
    const favouriteTemplates =
      JSON.parse(localStorage.getItem('favourite_templates') || '[]') || [];
    setIsFav(favouriteTemplates.includes(template_id));
  }, [template_id]);
  return (
    <Button
      variant={'outline_secondary'}
      className="flex items-center gap-2"
      onClick={() => {
        if (isFav) {
          localStorage.setItem(
            'favourite_templates',
            JSON.stringify(
              (
                JSON.parse(
                  localStorage.getItem('favourite_templates') || '[]',
                ) || []
              ).filter((id: string) => id !== template_id),
            ),
          );
          setIsFav(false);
        } else {
          localStorage.setItem(
            'favourite_templates',
            JSON.stringify([
              ...(JSON.parse(
                localStorage.getItem('favourite_templates') || '[]',
              ) || []),
              template_id,
            ]),
          );
          setIsFav(true);
        }
      }}>
      {!isFav ? (
        <HeartIcon className="size-4" />
      ) : (
        <HeartIcon className="size-4" fill="var(--c-secondary-variant)" />
      )}
      <span className="ml-2">Mark as Favourite</span>
    </Button>
  );
};

export default MarkFavourite;
