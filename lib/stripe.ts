import { db } from './firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  onSnapshot,
  doc
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';

export interface StripePrice {
  id: string;
  active: boolean;
  currency: string;
  unit_amount: number;
  interval?: 'day' | 'week' | 'month' | 'year';
  interval_count?: number;
  type: 'one_time' | 'recurring';
}

export interface StripeProduct {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  role?: string;
  images?: string[];
  prices: StripePrice[];
}

export interface StripeSubscription {
  id: string;
  status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid';
  role?: string;
  current_period_end: number;
  current_period_start: number;
  cancel_at_period_end: boolean;
  created: number;
  prices: StripePrice[];
  product: string;
}

export async function getProducts(): Promise<StripeProduct[]> {
  const productsQuery = query(
    collection(db, 'products'),
    where('active', '==', true)
  );

  const querySnapshot = await getDocs(productsQuery);
  const products: StripeProduct[] = [];

  for (const productDoc of querySnapshot.docs) {
    const productData = productDoc.data();
    const pricesSnapshot = await getDocs(
      query(
        collection(db, 'products', productDoc.id, 'prices'),
        where('active', '==', true)
      )
    );

    const prices: StripePrice[] = pricesSnapshot.docs.map(priceDoc => ({
      id: priceDoc.id,
      ...priceDoc.data()
    } as StripePrice));

    products.push({
      id: productDoc.id,
      ...productData,
      prices
    } as StripeProduct);
  }

  return products;
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  const checkoutSessionRef = await addDoc(
    collection(db, 'customers', userId, 'checkout_sessions'),
    {
      price: priceId,
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
    }
  );

  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(checkoutSessionRef, (snap) => {
      const data = snap.data();
      if (data?.error) {
        unsubscribe();
        reject(new Error(data.error.message));
      }
      if (data?.url) {
        unsubscribe();
        resolve(data.url);
      }
    });
  });
}

export function subscribeToUserSubscriptions(
  userId: string,
  callback: (subscriptions: StripeSubscription[]) => void
) {
  const subscriptionsQuery = query(
    collection(db, 'customers', userId, 'subscriptions'),
    where('status', 'in', ['trialing', 'active'])
  );

  return onSnapshot(subscriptionsQuery, (snapshot) => {
    const subscriptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as StripeSubscription));
    callback(subscriptions);
  });
}

export async function getActiveSubscription(userId: string): Promise<StripeSubscription | null> {
  const subscriptionsQuery = query(
    collection(db, 'customers', userId, 'subscriptions'),
    where('status', 'in', ['trialing', 'active'])
  );

  const snapshot = await getDocs(subscriptionsQuery);
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data()
  } as StripeSubscription;
}

export async function createPortalLink(returnUrl: string): Promise<string> {
  const functions = getFunctions();
  const createPortalLinkFunc = httpsCallable(
    functions,
    'ext-firestore-stripe-payments-createPortalLink'
  );

  const { data } = await createPortalLinkFunc({
    returnUrl,
    locale: 'auto'
  });

  return (data as { url: string }).url;
}

export function formatPrice(price: StripePrice): string {
  const amount = (price.unit_amount / 100).toFixed(2);
  const currency = price.currency.toUpperCase();

  if (price.type === 'recurring' && price.interval) {
    const intervalText = price.interval_count && price.interval_count > 1
      ? `${price.interval_count} ${price.interval}s`
      : price.interval;
    return `${currency} $${amount} / ${intervalText}`;
  }

  return `${currency} $${amount}`;
}
