'use client';
import React, { useState } from 'react';
import { Typography } from '../typography';
import { useClerk } from '@clerk/nextjs';
import { Button } from '../button';
import { cancelSubscription } from '@/_backend/private/subscription/cancelSubscription';
import { showToast } from '../toast';
import { Loader2 } from 'lucide-react';

const CancelPlan = () => {
  const { user } = useClerk();
  const [cancelling, setCancelling] = useState(false);

  const onCancelHandler = async () => {
    if (cancelling) return;
    setCancelling(true);
    try {
      const response = await cancelSubscription();
      if (response?.isSuccess) {
        window.location.reload();
        showToast({ description: response.message });
      } else {
        showToast({ description: 'Failed to cancel.', type: 'error' });
      }
    } catch (error) {
      console.log(error);
      setCancelling(false);
    } finally {
      setCancelling(false);
    }
  };
  if (
    user &&
    user.publicMetadata &&
    typeof user.publicMetadata.plan === 'string' &&
    user.publicMetadata.plan === 'mortal'
  ) {
    return null;
  }

  return (
    <div className="flex flex-row gap-10 justify-start items-center">
      <Typography className="font-semibold">
        Current plan:{' '}
        <span className="capitalize">
          {user &&
          user.publicMetadata &&
          typeof user.publicMetadata.plan === 'string'
            ? user.publicMetadata.plan
            : 'mortal'}
        </span>
      </Typography>
      <Button
        onClick={onCancelHandler}
        disabled={cancelling}
        variant={'destructive'}>
        {cancelling && <Loader2 className="animate-spin" />}
        Cancel Plan
      </Button>
    </div>
  );
};

export default CancelPlan;
