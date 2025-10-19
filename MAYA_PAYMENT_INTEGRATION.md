# Maya (PayMaya) Payment Integration Guide

Complete guide for integrating Maya as a Stripe alternative for subscription payments in your SaaS application.

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Sandbox Setup](#sandbox-setup)
4. [API Keys Configuration](#api-keys-configuration)
5. [Integration Architecture](#integration-architecture)
6. [Implementation Steps](#implementation-steps)
7. [Testing Guide](#testing-guide)
8. [Production Migration](#production-migration)
9. [Troubleshooting](#troubleshooting)

## Overview

This integration uses Maya's Checkout API to enable subscription payments with the following flow:
1. User selects a subscription plan
2. Backend creates Maya checkout session
3. User redirects to Maya payment page
4. Maya processes payment
5. Webhook updates Firestore (`isPremium: true`, `validDate: +30 days`)

**Key Features:**
- Sandbox environment for risk-free testing
- Support for cards, e-wallets, and installments
- Webhook notifications for payment status
- Optional: Recurring payments via Maya Vault

## Prerequisites

### Required Accounts & Tools
- Firebase project with Firestore and Cloud Functions
- Maya Business Manager account (sandbox for testing)
- Node.js v14+ installed locally
- Firebase CLI: `npm install -g firebase-tools`

### Required Dependencies
```json
{
  "firebase-admin": "^12.0.0",
  "firebase-functions": "^5.0.0",
  "axios": "^1.6.0",
  "paymaya-node-sdk": "^1.0.0"
}
```

## Sandbox Setup

### API Endpoints

| Environment | API Base URL | Payment Page |
|-------------|-------------|--------------|
| Sandbox | `https://pg-sandbox.paymaya.com` | `https://payments-web-sandbox.paymaya.com` |
| Production | `https://pg.maya.ph` | `https://payments.maya.ph` |

### Test Credentials

Maya provides pre-configured sandbox merchants with different capabilities:

#### Party 1 - Basic Checkout
- **Public Key:** `pk-Z0OSzLvIcOI2UIvDhdTGVVfRSSeiGStnceqwUE7n0Ah`
- **Secret Key:** `sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl`
- **Services:** Checkout, Invoice

#### Party 2 - Full Features (Recommended)
- **Public Key:** `pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF`
- **Secret Key:** `sk-KfmfLJXFdV5t1inYN8lIOwSrueC1G27SCAklBqYCdrU`
- **Services:** Checkout, Vault, Invoice

### Test Payment Methods

#### Credit/Debit Cards

| Card Type | Number | Expiry | CVV | 3DS Password | Result |
|-----------|--------|--------|-----|--------------|--------|
| Mastercard | 5123456789012346 | 12/2025 | 111 | N/A | Success |
| Mastercard | 5453010000064154 | 12/2025 | 111 | secbarry1 | Success (3DS) |
| Visa | 4123450131001381 | 12/2025 | 123 | mctest1 | Success (3DS) |
| Visa | 4123450131000508 | 12/2025 | 111 | N/A | Success |

#### E-Wallets (Maya Wallet)

| Username | Password | OTP | Result |
|----------|----------|-----|--------|
| +639900100900 | Password@1 | 123456 | Success |
| +639900100916 | Password@1 | 123456 | Failed (Insufficient) |

## API Keys Configuration

### Step 1: Generate Keys (Production Only)
1. Log into Maya Business Manager:
   - Sandbox: https://manager-sandbox.paymaya.com
   - Production: https://manager.paymaya.com
2. Navigate to **Settings > API Keys**
3. Generate **Public Key** (client-side) and **Secret Key** (server-side)
4. For Vault (recurring), generate separate Vault API keys

### Step 2: Store in Firebase
```bash
# Set environment variables
firebase functions:config:set \
  maya.environment="sandbox" \
  maya.public_key="pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF" \
  maya.secret_key="sk-KfmfLJXFdV5t1inYN8lIOwSrueC1G27SCAklBqYCdrU"

# For production (later)
firebase functions:config:set \
  maya.environment="production" \
  maya.public_key="YOUR_PROD_PUBLIC_KEY" \
  maya.secret_key="YOUR_PROD_SECRET_KEY"
```

### Step 3: Local Testing (.env file)
Create `functions/.env` for local development:
```env
MAYA_ENVIRONMENT=sandbox
MAYA_PUBLIC_KEY=pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF
MAYA_SECRET_KEY=sk-KfmfLJXFdV5t1inYN8lIOwSrueC1G27SCAklBqYCdrU
```

## Integration Architecture

### Payment Flow Diagram
```
[User Selects Plan]
    ↓
[Frontend calls createPayment Cloud Function]
    ↓
[Function creates Maya Checkout via API]
    ↓
[Returns redirectUrl to frontend]
    ↓
[User redirects to Maya payment page]
    ↓
[User completes payment (Card/E-wallet)]
    ↓
[Maya processes transaction]
    ↓
[Webhook notifies Cloud Function]
    ↓
[Function updates Firestore: isPremium=true, validDate=+30d]
    ↓
[User redirects to success page]
```

### Database Schema (Firestore)

#### Collection: `users/{userId}`
```javascript
{
  uid: string,
  email: string,
  isPremium: boolean,
  validDate: Timestamp,
  subscriptionHistory: [{
    transactionId: string,
    amount: number,
    currency: string,
    plan: string,
    purchaseDate: Timestamp,
    status: 'success' | 'failed' | 'pending'
  }]
}
```

#### Collection: `paymentLogs/{paymentId}`
```javascript
{
  userId: string,
  checkoutId: string,
  requestReferenceNumber: string,
  amount: number,
  currency: string,
  status: string,
  createdAt: Timestamp,
  completedAt: Timestamp | null,
  webhookReceived: boolean
}
```

## Implementation Steps

### Step 1: Initialize Firebase Functions

```bash
# If not already done
firebase init functions

# Select JavaScript or TypeScript
# Install dependencies
cd functions
npm install firebase-admin firebase-functions axios paymaya-node-sdk
```

### Step 2: Create Maya Service Module

Create `functions/src/services/mayaService.js`:

```javascript
const sdk = require('paymaya-node-sdk');
const PaymayaSDK = sdk.PaymayaSDK;
const functions = require('firebase-functions');

class MayaService {
  constructor() {
    const config = functions.config().maya || {};
    const publicKey = config.public_key || process.env.MAYA_PUBLIC_KEY;
    const secretKey = config.secret_key || process.env.MAYA_SECRET_KEY;
    const environment = config.environment || process.env.MAYA_ENVIRONMENT || 'sandbox';

    const env = environment === 'production'
      ? PaymayaSDK.ENVIRONMENT.PRODUCTION
      : PaymayaSDK.ENVIRONMENT.SANDBOX;

    PaymayaSDK.initCheckout(publicKey, secretKey, env);

    this.Checkout = sdk.Checkout;
    this.Item = sdk.Item;
    this.ItemAmount = sdk.ItemAmount;
    this.Buyer = sdk.Buyer;
    this.Webhook = sdk.Webhook;
  }

  async createCheckout(params) {
    const { userId, amount, planName, buyerInfo, successUrl, failureUrl, cancelUrl } = params;

    const buyer = new this.Buyer();
    buyer.firstName = buyerInfo.firstName || 'User';
    buyer.lastName = buyerInfo.lastName || 'Customer';
    buyer.contact = {
      phone: buyerInfo.phone || '',
      email: buyerInfo.email || ''
    };

    const itemAmount = new this.ItemAmount();
    itemAmount.currency = 'PHP';
    itemAmount.value = amount.toFixed(2);

    const item = new this.Item();
    item.amount = itemAmount;
    item.totalAmount = itemAmount;
    item.name = planName;
    item.description = `Subscription: ${planName}`;

    const checkout = new this.Checkout();
    checkout.buyer = buyer;
    checkout.totalAmount = itemAmount;
    checkout.items = [item];
    checkout.requestReferenceNumber = `sub-${userId}-${Date.now()}`;
    checkout.redirectUrl = {
      success: successUrl || 'https://yourapp.com/payment/success',
      failure: failureUrl || 'https://yourapp.com/payment/failure',
      cancel: cancelUrl || 'https://yourapp.com/payment/cancel'
    };

    return new Promise((resolve, reject) => {
      checkout.execute((err, response) => {
        if (err) {
          console.error('Maya Checkout Error:', err);
          return reject(err);
        }
        resolve({
          checkoutId: response.checkoutId,
          redirectUrl: response.redirectUrl,
          requestReferenceNumber: checkout.requestReferenceNumber
        });
      });
    });
  }

  async retrieveCheckout(checkoutId) {
    const checkout = new this.Checkout();
    checkout.checkoutId = checkoutId;

    return new Promise((resolve, reject) => {
      checkout.retrieve((err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }

  async registerWebhook(callbackUrl, eventName = 'PAYMENT_SUCCESS') {
    const webhook = new this.Webhook();
    webhook.name = eventName;
    webhook.callbackUrl = callbackUrl;

    return new Promise((resolve, reject) => {
      webhook.register((err, response) => {
        if (err) return reject(err);
        resolve(response);
      });
    });
  }
}

module.exports = new MayaService();
```

### Step 3: Create Payment Cloud Functions

Create `functions/src/payments.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mayaService = require('./services/mayaService');

exports.createPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { plan } = data;
  const userId = context.auth.uid;

  if (!plan || !plan.amount || !plan.name) {
    throw new functions.https.HttpsError('invalid-argument', 'Plan details required');
  }

  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    const successUrl = `${data.baseUrl || 'https://yourapp.com'}/payment/success?ref=`;
    const failureUrl = `${data.baseUrl || 'https://yourapp.com'}/payment/failure`;
    const cancelUrl = `${data.baseUrl || 'https://yourapp.com'}/payment/cancel`;

    const checkout = await mayaService.createCheckout({
      userId,
      amount: plan.amount,
      planName: plan.name,
      buyerInfo: {
        firstName: userData?.displayName?.split(' ')[0] || 'User',
        lastName: userData?.displayName?.split(' ')[1] || 'Customer',
        email: userData?.email || context.auth.token.email,
        phone: userData?.phone || ''
      },
      successUrl: successUrl + checkout.requestReferenceNumber,
      failureUrl,
      cancelUrl
    });

    await admin.firestore().collection('paymentLogs').doc(checkout.checkoutId).set({
      userId,
      checkoutId: checkout.checkoutId,
      requestReferenceNumber: checkout.requestReferenceNumber,
      amount: plan.amount,
      currency: 'PHP',
      plan: plan.name,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      webhookReceived: false
    });

    return {
      success: true,
      redirectUrl: checkout.redirectUrl,
      checkoutId: checkout.checkoutId
    };
  } catch (error) {
    console.error('Create Payment Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.getPaymentStatus = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { checkoutId } = data;

  try {
    const status = await mayaService.retrieveCheckout(checkoutId);
    return { success: true, status };
  } catch (error) {
    console.error('Get Payment Status Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### Step 4: Create Webhook Handler

Create `functions/src/webhooks.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const SANDBOX_IPS = ['13.229.160.234', '3.1.199.75'];
const PRODUCTION_IPS = ['18.138.50.235', '3.1.207.200'];

exports.handleMayaWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const allowedIps = [...SANDBOX_IPS, ...PRODUCTION_IPS];

  if (!allowedIps.some(ip => clientIp.includes(ip))) {
    console.warn('Unauthorized webhook attempt from:', clientIp);
    return res.status(403).send('Forbidden');
  }

  const payload = req.body;
  console.log('Maya Webhook Received:', JSON.stringify(payload, null, 2));

  try {
    const { id, status, requestReferenceNumber } = payload;

    const paymentLogRef = admin.firestore().collection('paymentLogs').doc(id);
    const paymentLog = await paymentLogRef.get();

    if (!paymentLog.exists) {
      console.warn('Payment log not found for checkoutId:', id);
      return res.status(200).send('OK');
    }

    const { userId, amount, plan, webhookReceived } = paymentLog.data();

    if (webhookReceived) {
      console.log('Webhook already processed for:', id);
      return res.status(200).send('OK');
    }

    await paymentLogRef.update({
      status,
      webhookReceived: true,
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    if (status === 'PAYMENT_SUCCESS') {
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 30);

      await admin.firestore().collection('users').doc(userId).update({
        isPremium: true,
        validDate: admin.firestore.Timestamp.fromDate(validDate),
        subscriptionHistory: admin.firestore.FieldValue.arrayUnion({
          transactionId: id,
          amount,
          currency: 'PHP',
          plan,
          purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
          status: 'success'
        })
      });

      console.log('User upgraded to premium:', userId);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Handler Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
```

### Step 5: Export Functions

Update `functions/index.js`:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

const payments = require('./src/payments');
const webhooks = require('./src/webhooks');

exports.createPayment = payments.createPayment;
exports.getPaymentStatus = payments.getPaymentStatus;
exports.handleMayaWebhook = webhooks.handleMayaWebhook;
```

### Step 6: Frontend Integration

Create a payment component (e.g., `components/SubscriptionPayment.tsx`):

```typescript
'use client';

import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '@/hooks/useAuth';

const plans = [
  { id: '1month', name: '1 Month Premium', amount: 500, days: 30 },
  { id: '3months', name: '3 Months Premium', amount: 1350, days: 90 },
  { id: '1year', name: '1 Year Premium', amount: 4800, days: 365 }
];

export default function SubscriptionPayment() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async (plan: typeof plans[0]) => {
    if (!user) {
      setError('Please log in to purchase');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const functions = getFunctions();
      const createPayment = httpsCallable(functions, 'createPayment');

      const result = await createPayment({
        plan: {
          name: plan.name,
          amount: plan.amount
        },
        baseUrl: window.location.origin
      });

      const data = result.data as { success: boolean; redirectUrl: string };

      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setError('Failed to create payment');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <div key={plan.id} className="border rounded-lg p-6">
          <h3 className="text-xl font-bold">{plan.name}</h3>
          <p className="text-3xl font-bold mt-4">₱{plan.amount}</p>
          <p className="text-gray-600 mt-2">{plan.days} days access</p>
          <button
            onClick={() => handlePurchase(plan)}
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Purchase'}
          </button>
        </div>
      ))}
      {error && <p className="text-red-600 col-span-3">{error}</p>}
    </div>
  );
}
```

### Step 7: Deploy Functions

```bash
firebase deploy --only functions
```

Note the webhook URL: `https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/handleMayaWebhook`

### Step 8: Register Webhook

Run once to register webhook (create a script or use REST client):

```javascript
const axios = require('axios');

const SECRET_KEY = 'sk-KfmfLJXFdV5t1inYN8lIOwSrueC1G27SCAklBqYCdrU';
const WEBHOOK_URL = 'https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/handleMayaWebhook';

async function registerWebhook() {
  const auth = Buffer.from(SECRET_KEY + ':').toString('base64');

  const response = await axios.post(
    'https://pg-sandbox.paymaya.com/payments/v1/webhooks',
    {
      name: 'PAYMENT_SUCCESS',
      callbackUrl: WEBHOOK_URL
    },
    {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('Webhook registered:', response.data);
}

registerWebhook();
```

## Testing Guide

### Manual Testing Steps

1. **Start Local Development:**
   ```bash
   npm run dev
   firebase emulators:start
   ```

2. **Test Payment Flow:**
   - Navigate to subscription page
   - Select a plan
   - Click "Purchase"
   - Should redirect to Maya payment page
   - Use test card: `5123456789012346`, Expiry: `12/2025`, CVV: `111`
   - Complete payment
   - Verify redirect to success page

3. **Verify Database Updates:**
   ```javascript
   // Check Firestore
   await admin.firestore().collection('users').doc(userId).get();
   // Should show: isPremium: true, validDate: [30 days from now]
   ```

4. **Test Webhook:**
   ```bash
   # Use ngrok for local testing
   ngrok http 5001
   # Update webhook URL to ngrok URL
   ```

### Test Scenarios

| Scenario | Card | Expected Result |
|----------|------|-----------------|
| Successful Payment | 5123456789012346 | Payment success, user premium |
| 3DS Authentication | 5453010000064154 | 3DS prompt, then success |
| Failed Payment | Use e-wallet +639900100916 | Payment failed, no upgrade |
| Webhook Retry | Simulate 500 error | Maya retries up to 4 times |

### Common Test Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Webhook not received | Sandbox limitation | Use polling as fallback |
| CORS error | Missing headers | Add CORS config to function |
| Payment stuck | Network timeout | Implement status check |
| Duplicate webhook | Maya retry | Check `webhookReceived` flag |

## Production Migration

### Pre-Launch Checklist

- [ ] Test all payment flows in sandbox
- [ ] Verify webhook handling
- [ ] Test error scenarios
- [ ] Review security (HTTPS, IP whitelisting)
- [ ] Prepare production API keys
- [ ] Update environment variables
- [ ] Test with small real payment
- [ ] Set up monitoring/alerts

### Migration Steps

1. **Obtain Production Keys:**
   - Contact Maya Relationship Manager
   - Complete merchant onboarding
   - Receive production API keys

2. **Update Configuration:**
   ```bash
   firebase functions:config:set \
     maya.environment="production" \
     maya.public_key="YOUR_PROD_PUBLIC_KEY" \
     maya.secret_key="YOUR_PROD_SECRET_KEY"
   ```

3. **Update Webhook Registration:**
   ```bash
   # Re-register webhook with production URL
   # Use production base URL: https://pg.maya.ph
   ```

4. **Deploy:**
   ```bash
   firebase deploy --only functions
   ```

5. **Test with Real Payment:**
   - Make small test purchase
   - Verify complete flow
   - Check Firestore updates

6. **Monitor:**
   - Check Cloud Functions logs
   - Monitor webhook success rate
   - Track payment success/failure rates

### Production Configuration Differences

| Config | Sandbox | Production |
|--------|---------|------------|
| API URL | pg-sandbox.paymaya.com | pg.maya.ph |
| Payment Page | payments-web-sandbox.paymaya.com | payments.maya.ph |
| Webhook IPs | 13.229.160.234, 3.1.199.75 | 18.138.50.235, 3.1.207.200 |
| Test Cards | Accepted | Real cards only |

## Troubleshooting

### Common Errors

#### Error: PY0009 - Payment not found
**Cause:** Invalid checkout ID or expired session
**Solution:** Sessions expire after 30 minutes. Create new checkout.

#### Error: ECONNRESET
**Cause:** Network connectivity issue
**Solution:** Retry request with exponential backoff

#### Error: Webhook not firing
**Cause:** Sandbox webhook unreliability
**Solution:** Implement polling fallback with `getPaymentStatus`

#### Error: 403 Forbidden on webhook
**Cause:** IP not whitelisted
**Solution:** Verify Cloud Function IP matches Maya's allowed IPs

### Debug Tools

1. **Check Function Logs:**
   ```bash
   firebase functions:log
   ```

2. **Test Webhook Locally:**
   ```bash
   curl -X POST http://localhost:5001/YOUR-PROJECT/us-central1/handleMayaWebhook \
     -H "Content-Type: application/json" \
     -d '{"id":"test-123","status":"PAYMENT_SUCCESS"}'
   ```

3. **Verify Checkout Status:**
   ```javascript
   const status = await mayaService.retrieveCheckout('checkout-id');
   console.log(status);
   ```

### Support Resources

- **Maya Developer Portal:** https://developers.maya.ph
- **API Reference:** https://developers.maya.ph/reference
- **Email Support:** [email protected]
- **Sandbox Health:** https://developers.maya.ph/sandbox-health

### Performance Optimization

1. **Cache SDK Instance:** Initialize once, reuse
2. **Async Webhook Processing:** Return 200 immediately, process async
3. **Implement Retry Logic:** Handle transient failures
4. **Monitor Function Performance:** Set up Cloud Monitoring alerts

---

## Next Steps

1. Set up recurring subscriptions with Maya Vault
2. Implement refund handling
3. Add payment analytics dashboard
4. Set up automated subscription renewal reminders
5. Implement subscription cancellation flow

For recurring payments guide, see: [MAYA_RECURRING_SUBSCRIPTIONS.md](./MAYA_RECURRING_SUBSCRIPTIONS.md)
