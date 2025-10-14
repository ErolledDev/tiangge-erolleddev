'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  subscribeToUserSubscriptions,
  createPortalLink,
  StripeSubscription
} from '@/lib/stripe';
import { useToast } from '@/hooks/useToast';

export default function SubscriptionManager() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [subscriptions, setSubscriptions] = useState<StripeSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserSubscriptions(user.uid, (subs) => {
      setSubscriptions(subs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleManageSubscription = async () => {
    if (!user) return;

    setRedirecting(true);
    try {
      const returnUrl = `${window.location.origin}/dashboard`;
      const portalUrl = await createPortalLink(returnUrl);
      window.location.assign(portalUrl);
    } catch (error) {
      console.error('Error creating portal link:', error);
      showToast('Failed to open customer portal', 'error');
      setRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <svg className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-yellow-900 mb-1">
              No Active Subscription
            </h3>
            <p className="text-yellow-700">
              You don't have an active subscription. Subscribe to a plan to unlock premium features.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const subscription = subscriptions[0];
  const periodEnd = new Date(subscription.current_period_end * 1000);
  const isTrialing = subscription.status === 'trialing';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Active Subscription
          </h3>
          <div className="space-y-1">
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                subscription.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : subscription.status === 'trialing'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
              {subscription.role && (
                <span className="ml-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  {subscription.role}
                </span>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleManageSubscription}
          disabled={redirecting}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {redirecting ? 'Redirecting...' : 'Manage Subscription'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Plan</p>
            <p className="font-semibold text-gray-900">
              {subscription.prices[0]?.interval
                ? `${subscription.prices[0].currency.toUpperCase()} $${(subscription.prices[0].unit_amount / 100).toFixed(2)} / ${subscription.prices[0].interval}`
                : 'Custom Plan'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">
              {isTrialing ? 'Trial Ends' : subscription.cancel_at_period_end ? 'Ends On' : 'Renews On'}
            </p>
            <p className="font-semibold text-gray-900">
              {periodEnd.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {subscription.cancel_at_period_end && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-orange-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-orange-900 mb-1">
                  Subscription Canceled
                </p>
                <p className="text-sm text-orange-700">
                  Your subscription will end on {periodEnd.toLocaleDateString()}. You can reactivate it anytime before then.
                </p>
              </div>
            </div>
          </div>
        )}

        {isTrialing && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">
                  Trial Period Active
                </p>
                <p className="text-sm text-blue-700">
                  You're currently in a trial period. Your subscription will automatically start after the trial ends.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Need to update your payment method, view invoices, or cancel your subscription?
          <button
            onClick={handleManageSubscription}
            className="text-blue-600 hover:text-blue-700 font-semibold ml-1"
          >
            Manage your subscription
          </button>
        </p>
      </div>
    </div>
  );
}
