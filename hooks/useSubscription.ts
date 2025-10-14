import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { subscribeToUserSubscriptions, StripeSubscription } from '@/lib/stripe';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<StripeSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToUserSubscriptions(user.uid, (subs) => {
      setSubscription(subs.length > 0 ? subs[0] : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const isPremium = subscription?.status === 'active' || subscription?.status === 'trialing';
  const isTrialing = subscription?.status === 'trialing';
  const isCanceled = subscription?.cancel_at_period_end === true;

  return {
    subscription,
    loading,
    isPremium,
    isTrialing,
    isCanceled,
    hasSubscription: subscription !== null
  };
}
