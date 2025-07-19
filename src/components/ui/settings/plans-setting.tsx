'use client';
import CancelPlan from '../plans/cancel-plan';
import { Typography } from '../typography';

export default function PlansSettings() {
  return (
    <div className="pr-4 pt-2 flex gap-6 flex-col">
      <div className="rounded-xl p-4">
        <Typography
          variant={'h2'}
          className="font-semibold text-c-primary pb-0">
          Plans
        </Typography>
      </div>
      <div className="bg-c-primary-variant/10 rounded-xl p-4">
        <CancelPlan />
      </div>
    </div>
  );
}
