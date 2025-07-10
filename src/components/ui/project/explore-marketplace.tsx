'use client';
import React from 'react';
import { Button } from '../button';
import { showToast } from '../toast';

const ExploreMarketPlace = () => {
  return (
    <Button
      onClick={() => {
        showToast({
          title: 'Coming Soon...',
          description:
            'Marketplace is under development. Glad to see your interest! We will notify you when it is ready.',
          type: 'success',
        });
      }}>
      Explore Marketplace
    </Button>
  );
};

export default ExploreMarketPlace;
