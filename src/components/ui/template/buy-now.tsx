'use client';
import React, { useState } from 'react';
import { Button } from '../button';
import { showToast } from '../toast';
import {
  createOrder,
  CreateOrderResponse,
  verifyPayment,
} from '@/_backend/private/payment/createOrder';
import { Loader2 } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { FlowTemplate } from '@/_backend/private/projects/getTemplates';
import TryNowButton from './try-now-button';

const dollerToPaise = (amountDlr: number) => {
  const dlrToRupee = amountDlr * 86;
  return dlrToRupee * 100;
};

const BuyNow = ({
  product,
  UIRole = 'page',
}: {
  product: FlowTemplate;
  UIRole?: 'card' | 'page';
}) => {
  const [makingPayment, setMakingPayment] = useState(false);

  const [isPurchased, setIsPurchased] = useState(product.is_purchased);
  const { user } = useClerk();
  const onPaymentHandler = async () => {
    if (makingPayment) return;
    setMakingPayment(true);
    const receipt = `${product.product_id}_${user?.id.split('_')[1]}`;
    console.log(receipt, receipt.length);
    try {
      const response = await createOrder({
        amount: dollerToPaise(product.price || 0),
        currency: 'INR',
        receipt: receipt,
      });
      if (!response?.isSuccess) {
        showToast({
          description: response?.message,
          type: response?.isSuccess ? 'success' : 'error',
        });
        return;
      }
      console.log(response?.data);
      if (response?.data) {
        handleOrderCreatyionResponse({
          key_id: response?.data?.key_id,
          order_id: response?.data?.order_id,
          receipt_id: response.data.receipt_id,
        });
      }
    } catch (error) {
      showToast({ description: `${error}`, type: 'error' });
    } finally {
      setMakingPayment(false);
    }
  };

  const handleOrderCreatyionResponse = (order: CreateOrderResponse) => {
    setMakingPayment(true);
    const options = {
      key: order.key_id,
      amount: dollerToPaise(product.price || 0),
      currency: 'INR',
      name: product.name,
      description: `Paymemnt for ${product.name}`,
      order_id: order.order_id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async function (rz_response: any) {
        console.log('rz_response', rz_response);

        try {
          const response = await verifyPayment({
            order_id: order.order_id,
            payment_id: rz_response.razorpay_payment_id,
            signature: rz_response.razorpay_signature,
            receipt_id: order.receipt_id,
          });
          if (!response?.isSuccess) {
            showToast({ description: response?.message, type: 'error' });
            return;
          }
          if (response.data?.status === 'captured') {
            setIsPurchased(true);
          }
          showToast({ description: response?.message, type: 'success' });
        } catch (error) {
          showToast({
            title: 'Failed to verify payment',
            description: `ERROR: ${error}`,
            type: 'error',
          });
        } finally {
          setMakingPayment(false);
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
  if (isPurchased || product.price === 0) {
    return <TryNowButton template={product} />;
  }
  if (UIRole === 'card') {
    return <TryNowButton template={product} UIRole="card" />;
  }
  return (
    <Button
      onClick={onPaymentHandler}
      disabled={makingPayment}
      variant={'secondary'}
      className="w-28">
      {makingPayment && <Loader2 className="animate-spin" />} Buy Now
    </Button>
  );
};

export default BuyNow;
