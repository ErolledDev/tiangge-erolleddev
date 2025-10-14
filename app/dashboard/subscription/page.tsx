'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import SubscriptionManager from '@/components/SubscriptionManager';
import SubscriptionPlans from '@/components/SubscriptionPlans';
import { useToast } from '@/hooks/useToast';

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  useEffect(() => {
    const status = searchParams.get('subscription');
    if (status === 'success') {
      showToast('Subscription activated successfully!', 'success');
    } else if (status === 'canceled') {
      showToast('Subscription checkout was canceled', 'info');
    }
  }, [searchParams, showToast]);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Subscription Management
          </h1>
          <p className="text-gray-600">
            Manage your subscription and billing information
          </p>
        </div>

        <div className="mb-12">
          <SubscriptionManager />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Available Plans
          </h2>
          <p className="text-gray-600 text-center mb-8">
            Choose the plan that works best for you
          </p>
          <SubscriptionPlans />
        </div>
      </div>
    </div>
  );
}
