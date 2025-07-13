'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '../button';

const GoBack = () => {
  const router = useRouter();
  return (
    <Button
      variant={'outline_secondary'}
      className="w-28"
      onClick={router.back}>
      Close
    </Button>
  );
};

export default GoBack;
