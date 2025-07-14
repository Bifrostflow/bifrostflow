// import React from 'react';
// import { motion } from 'framer-motion';
// import { cn } from '@/lib/utils';

// function Features() {
//   return (
// <div
//   className={cn(
//     'transition-all w-full relative flex h-[100vh] flex-col items-center justify-start bg-transparent text-white overflow-hidden',
//   )}></div>
//   );
// }

// export default Features;

import { cn } from '@/lib/utils';
import { Button } from '../button';
import { CheckCircle2 } from 'lucide-react';
import { Typography } from '../typography';

const plans = [
  {
    name: 'mortal',
    number_of_projects: 5,
    amount: 0, // DOLLAR
    marketplace_access: true,
    rest_endpoints: false,
    creator_access_marketplace: false,
    marketplace_discount: 0,
    button: 'outline_primary',
    description:
      'Begin your journey. Ideal for brave mortals ready to step into the realms of creation — no cost, no fear.',
    mini_description:
      'For fearless creators ready to begin their journey into the realms.',
  },

  {
    name: 'demigod',
    number_of_projects: 20,
    amount: 10,
    marketplace_access: true,
    rest_endpoints: true,
    creator_access_marketplace: false,
    marketplace_discount: 5,
    button: 'default',
    description:
      'For those destined to rise. Unlock hidden powers, forge more projects, and command the battlefield like a true demigod.',
    mini_description:
      'Unleash hidden powers and build with the strength of a rising legend.',
  },

  {
    name: 'deity',
    number_of_projects: 50,
    amount: 25,
    marketplace_access: true,
    rest_endpoints: true,
    creator_access_marketplace: true,
    marketplace_discount: 15,
    description:
      'Rule the realms. Full control, creator access, and divine powers at your command — this plan is made for gods.',
    mini_description:
      'Wield divine control — rule, create, and conquer across all realms.',
    button: 'gold',
  },
];

export default function Pricing() {
  return (
    <div
      id="plans"
      className={cn(
        'transition-all w-full min-h-[50vh] py-20 flex-col justify-center items-center text-c-background-text overflow-hidden ',
      )}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:flex-wrap justify-center items-center gap-3 md:gap-5 md:py-10">
        {plans.map(plan => {
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
                      <Button
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        variant={plan.button}
                        onClick={() => {}}
                        aria-describedby={`paln-${plan.name}`}
                        className="z-90 relative mt-8 px-3.5 py-2.5 transition duration-200  sm:mt-10">
                        Get Started
                      </Button>
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
        })}
      </div>
      <div className="z-90 relative text-center p-10">
        <Typography>
          These (Inactive) features are currently under development and will be
          available soon.
        </Typography>
      </div>
    </div>
  );
}
