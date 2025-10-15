'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getProducts, createCheckoutSession, formatPrice, StripeProduct } from '@/lib/stripe';
import { useToast } from '@/hooks/useToast';

export default function SubscriptionPlans() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState<StripeProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPriceId, setProcessingPriceId] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsList = await getProducts();
      setProducts(productsList.sort((a, b) => {
        const aPrice = a.prices[0]?.unit_amount || 0;
        const bPrice = b.prices[0]?.unit_amount || 0;
        return aPrice - bPrice;
      }));
    } catch (error) {
      console.error('Error loading products:', error);
      showToast('Failed to load subscription plans', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId: string) => {
    if (!user) {
      showToast('Please sign in to subscribe', 'error');
      return;
    }

    console.log('🚀 Starting subscription flow for price:', priceId);
    setProcessingPriceId(priceId);
    try {
      const successUrl = `${window.location.origin}/dashboard?subscription=success`;
      const cancelUrl = `${window.location.origin}/dashboard?subscription=canceled`;

      console.log('🔄 Creating checkout session...');
      const checkoutUrl = await createCheckoutSession(
        user.uid,
        priceId,
        successUrl,
        cancelUrl
      );

      console.log('✅ Checkout URL received, redirecting...');
      window.location.assign(checkoutUrl);
    } catch (error: any) {
      console.error('❌ Error creating checkout session:', error);
      const errorMessage = error?.message || 'Failed to start checkout process';
      showToast(errorMessage, 'error');
      setProcessingPriceId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No subscription plans available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-8">
      {products.map((product) => {
        const price = product.prices[0];
        if (!price) return null;

        const isPopular = product.name.toLowerCase().includes('3 months');

        return (
          <div
            key={product.id}
            className={`relative rounded-2xl border-2 p-8 ${
              isPopular
                ? 'border-blue-600 shadow-xl scale-105'
                : 'border-gray-200 hover:border-blue-300'
            } transition-all duration-300`}
          >
            {isPopular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-gray-600 text-sm mb-6">{product.description}</p>
              )}

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  ${(price.unit_amount / 100).toFixed(2)}
                </span>
                <span className="text-gray-600 ml-2">
                  {price.currency.toUpperCase()}
                </span>
                {price.interval && (
                  <div className="text-gray-600 text-sm mt-1">
                    per {price.interval_count && price.interval_count > 1
                      ? `${price.interval_count} ${price.interval}s`
                      : price.interval}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleSubscribe(price.id)}
                disabled={processingPriceId === price.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isPopular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processingPriceId === price.id ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Subscribe Now'
                )}
              </button>

              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">Premium features access</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">Priority support</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-gray-600">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
