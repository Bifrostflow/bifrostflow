'use client';
import React from 'react';
import { Button } from '../button';

const BuyNow = ({ price }: { price: number | null | undefined }) => {
  return (
    <Button variant={'secondary'} className="mt-2 w-28">
      Buy Now {price || 0}$
    </Button>
  );
};

export default BuyNow;
