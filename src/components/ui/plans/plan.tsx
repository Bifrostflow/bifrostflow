'use client';
import React from 'react';
import { Plan } from '../landing/pricing';
import { Button } from '../button';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useClerk } from '@clerk/nextjs';
import { Typography } from '../typography';

export const PlanItem = ({ plan }: { plan: Plan }) => {
  const { user } = useClerk();
  return (
    <div
      key={plan.name}
      className="flex max-w-sm w-fit h-full justify-between bg-neutral-100 px-6 py-8 sm:mx-8 lg:mx-0 dark:bg-neutral-800 rounded-lg mt-2 shadow-lg">
      <div className="w-full">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col pt-0 mt-0">
              <h3
                id="tier-hobby"
                className="text-base font-semibold leading-7 text-neutral-700 dark:text-neutral-200 capitalize z-90 relative">
                {plan.name}
              </h3>
              <p className="mt-4">
                <span
                  className="z-90 relative inline-block text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-200"
                  style={{ opacity: 1, transform: 'none' }}>
                  {plan.amount ? `$${plan.amount}/mo` : 'Free'}
                </span>
              </p>
            </div>
            <div>
              {user?.publicMetadata.plan === plan.name ? (
                <div className="flex flex-row justify-center items-center bg-gradient-to-bl from-c-secondary to-c-secondary-variant px-2 py-1 rounded-full">
                  <Typography className="text-sm">Current</Typography>
                </div>
              ) : (
                <Button
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  variant={plan.button}
                  onClick={() => {}}
                  aria-describedby={`plan-${plan.name}`}
                  className="z-90 relative mt-8 px-3.5 py-2.5 transition duration-200  sm:mt-10">
                  {user?.username && !(user?.publicMetadata.plan === plan.name)
                    ? 'Upgrade'
                    : 'Get Started'}
                </Button>
              )}
            </div>
          </div>
          <p className="mt-6 w-fit  text-sm leading-7 text-neutral-600 dark:text-neutral-300">
            {plan.mini_description}
          </p>
        </div>
        <ul
          role="list"
          className="z-90 relative mt-2 w-full text-sm leading-6 text-neutral-600 sm:mt-4 dark:text-neutral-300 flex flex-col gap-4">
          <li className="flex flex-row gap-3">
            <CheckCircle2
              size={24}
              className={cn(
                'bg-c-surface rounded-full text-c-surface-text-muted/20',
                plan.number_of_projects
                  ? 'text-c-primary-variant bg-c-surface'
                  : '',
              )}
            />
            Create upto {plan.number_of_projects} Flows
          </li>
          <li className="flex flex-row gap-3">
            <CheckCircle2
              size={24}
              className={cn(
                'bg-c-surface rounded-full text-c-surface-text-muted/20',
                plan.rest_endpoints
                  ? 'text-c-primary-variant bg-c-surface'
                  : '',
              )}
            />
            REST endpoint for Flow {plan.rest_endpoints && `(Inactive)`}
          </li>
          <li className="flex flex-row gap-3">
            <CheckCircle2
              size={24}
              className={cn(
                'bg-c-surface rounded-full text-c-surface-text-muted/20',
                plan.marketplace_discount
                  ? 'text-c-primary-variant bg-c-surface'
                  : '',
              )}
            />
            Marketplace Discount{' '}
            {plan.marketplace_discount
              ? `${plan.marketplace_discount}%`
              : 'Zero'}{' '}
            {!!plan.marketplace_discount && `(Inactive)`}
          </li>
          <li className="flex flex-row gap-3">
            <CheckCircle2
              size={24}
              className={cn(
                'bg-c-surface rounded-full text-c-surface-text-muted/20',
                plan.creator_access_marketplace
                  ? 'text-c-primary-variant bg-c-surface'
                  : '',
              )}
            />
            Creator Marketplace Access{' '}
            {!!plan.creator_access_marketplace && `(Inactive)`}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PlanItem;
