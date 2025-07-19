'use client';
import React, { useMemo, useState } from 'react';
import { Button } from '../button';
import { Plan, PlanType } from '../landing/pricing';
import { useClerk } from '@clerk/nextjs';
import { showToast } from '../toast';
import {
  createSubscription,
  verifySubscriptionPayment,
} from '@/_backend/private/subscription/createSubscription';
import { Loader2 } from 'lucide-react';

const planNameIndex: Record<PlanType, number> = {
  mortal: 0,
  demigod: 1,
  deity: 2,
};

const StartPlanButton = ({ plan }: { plan: Plan }) => {
  const [subscribing, setSubscribing] = useState(false);
  const { user } = useClerk();
  const currentPlan = user?.publicMetadata.plan;

  const buttonText = useMemo(() => {
    const currentPlanName: PlanType = (currentPlan as PlanType) || 'mortal';
    if (planNameIndex[currentPlanName] > planNameIndex[plan.name]) {
      return 'Downgrade';
    } else if (planNameIndex[currentPlanName] < planNameIndex[plan.name]) {
      return 'Upgrade';
    } else if (planNameIndex[currentPlanName] === planNameIndex[plan.name]) {
      return 'Current';
    }
  }, [currentPlan, plan]);

  const onSubscribe = async () => {
    if (plan.name === 'mortal') {
      showToast({
        description:
          'To go on free plan just cancel current plan from settings/plans.',
      });
      return;
    }
    if (subscribing) return;
    setSubscribing(true);
    try {
      const response = await createSubscription({
        plan_id: plan.name,
      });
      if (!response?.isSuccess) {
        showToast({
          description: response?.message,
          type: response?.isSuccess ? 'success' : 'error',
        });
        setSubscribing(false);
        return;
      }
      console.log(response?.data);
      if (response?.data) {
        handleCreateSubscriptionResponse(response.data.sub_id);
      }
    } catch (error) {
      showToast({ description: `${error}`, type: 'error' });
      setSubscribing(false);
    } finally {
    }
  };

  const handleCreateSubscriptionResponse = (subscription_id: string) => {
    setSubscribing(() => true);
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      subscription_id,
      name: `bifrostflow ${plan.name} subscription`,
      currency: 'INR',
      description: `payment for bifrostflow ${plan.name} subscription by ${user?.id}`,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (rz_response: any) {
        console.log('rz_response', rz_response);

        try {
          const response = await verifySubscriptionPayment({
            razorpay_payment_id: rz_response.razorpay_payment_id,
            razorpay_signature: rz_response.razorpay_signature,
            razorpay_subscription_id: subscription_id,
          });
          if (!response?.isSuccess) {
            showToast({ description: response?.message, type: 'error' });
            return;
          }
          if (response.data?.status === 'created') {
          }
          window.location.reload();
          showToast({ description: response?.message, type: 'success' });
        } catch (error) {
          showToast({
            title: 'Failed to verify payment',
            description: `ERROR: ${error}`,
            type: 'error',
          });
        } finally {
          setSubscribing(false);
        }
      },
      theme: {
        color: 'oklch(62.3% 0.214 259.815)',
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <Button
      disabled={subscribing}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      variant={plan.button}
      onClick={onSubscribe}
      aria-describedby={`plan-${plan.name}`}
      className="z-90 relative mt-8 px-3.5 py-2.5 transition duration-200  sm:mt-10">
      {subscribing && <Loader2 className="animate-spin" />}
      {buttonText}
    </Button>
  );
};

export default StartPlanButton;
