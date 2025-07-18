import { cn } from '@/lib/utils';
import { Typography } from '../typography';
import PlanItem from '../plans/plan';

export interface Plan {
  name: 'mortal' | 'demigod' | 'deity';
  number_of_projects: number;
  amount: number; // DOLLAR
  marketplace_access: boolean;
  rest_endpoints: boolean;
  creator_access_marketplace: boolean;
  marketplace_discount: number;
  button: string;
  description: string;
  mini_description: string;
}

const plans: Plan[] = [
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
          return <PlanItem plan={plan} key={plan.name} />;
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
