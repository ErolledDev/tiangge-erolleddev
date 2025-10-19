# Maya Payment Quick Start Guide

Get Maya payments working in your app in under 30 minutes using sandbox credentials.

## Prerequisites

- Firebase project with Firestore and Cloud Functions initialized
- Node.js installed locally
- Firebase CLI: `npm install -g firebase-tools`

## Step 1: Install Dependencies (5 minutes)

```bash
cd functions
npm install firebase-admin firebase-functions axios paymaya-node-sdk
```

## Step 2: Configure Environment (2 minutes)

Create `functions/.env`:

```env
MAYA_ENVIRONMENT=sandbox
MAYA_PUBLIC_KEY=pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF
MAYA_SECRET_KEY=sk-KfmfLJXFdV5t1inYN8lIOwSrueC1G27SCAklBqYCdrU
```

Or set Firebase config:

```bash
firebase functions:config:set \
  maya.environment="sandbox" \
  maya.public_key="pk-eo4sL393CWU5KmveJUaW8V730TTei2zY8zE4dHJDxkF" \
  maya.secret_key="sk-KfmfLJXFdV5t1inYN8lIOwSrueC1G27SCAklBqYCdrU"
```

## Step 3: Create Maya Service (5 minutes)

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
  }

  async createCheckout({ userId, amount, planName, buyerInfo, successUrl, failureUrl, cancelUrl }) {
    const buyer = new this.Buyer();
    buyer.firstName = buyerInfo.firstName || 'User';
    buyer.lastName = buyerInfo.lastName || 'Customer';
    buyer.contact = { phone: buyerInfo.phone || '', email: buyerInfo.email || '' };

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
    checkout.redirectUrl = { success: successUrl, failure: failureUrl, cancel: cancelUrl };

    return new Promise((resolve, reject) => {
      checkout.execute((err, response) => {
        if (err) return reject(err);
        resolve({
          checkoutId: response.checkoutId,
          redirectUrl: response.redirectUrl,
          requestReferenceNumber: checkout.requestReferenceNumber
        });
      });
    });
  }
}

module.exports = new MayaService();
```

## Step 4: Create Cloud Functions (8 minutes)

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

  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    const baseUrl = data.baseUrl || 'https://yourapp.com';

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
      successUrl: `${baseUrl}/payment/success`,
      failureUrl: `${baseUrl}/payment/failure`,
      cancelUrl: `${baseUrl}/payment/cancel`
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

    return { success: true, redirectUrl: checkout.redirectUrl, checkoutId: checkout.checkoutId };
  } catch (error) {
    console.error('Create Payment Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

Create `functions/src/webhooks.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const SANDBOX_IPS = ['13.229.160.234', '3.1.199.75'];

exports.handleMayaWebhook = functions.https.onRequest(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!SANDBOX_IPS.some(ip => clientIp.includes(ip))) {
    console.warn('Unauthorized webhook from:', clientIp);
    return res.status(403).send('Forbidden');
  }

  const { id, status } = req.body;
  console.log('Webhook received:', { id, status });

  try {
    const paymentLogRef = admin.firestore().collection('paymentLogs').doc(id);
    const paymentLog = await paymentLogRef.get();

    if (!paymentLog.exists || paymentLog.data().webhookReceived) {
      return res.status(200).send('OK');
    }

    const { userId, amount, plan } = paymentLog.data();

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

      console.log('User upgraded:', userId);
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});
```

Update `functions/index.js`:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

const payments = require('./src/payments');
const webhooks = require('./src/webhooks');

exports.createPayment = payments.createPayment;
exports.handleMayaWebhook = webhooks.handleMayaWebhook;
```

## Step 5: Deploy Functions (3 minutes)

```bash
firebase deploy --only functions
```

Note your webhook URL: `https://YOUR-REGION-YOUR-PROJECT.cloudfunctions.net/handleMayaWebhook`

## Step 6: Frontend Integration (5 minutes)

Add to your payment page:

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

async function handlePurchase(plan: { name: string; amount: number }) {
  const functions = getFunctions();
  const createPayment = httpsCallable(functions, 'createPayment');

  try {
    const result = await createPayment({
      plan,
      baseUrl: window.location.origin
    });

    const data = result.data as { success: boolean; redirectUrl: string };
    if (data.success) {
      window.location.href = data.redirectUrl;
    }
  } catch (error) {
    console.error('Payment error:', error);
  }
}

// Usage
<button onClick={() => handlePurchase({ name: '1 Month Premium', amount: 500 })}>
  Buy Now - ₱500
</button>
```

## Step 7: Test Payment (2 minutes)

1. Click "Buy Now" button
2. You'll redirect to Maya payment page
3. Use test card: `5123456789012346`
4. Expiry: `12/2025`, CVV: `111`
5. Complete payment
6. Check Firestore: `users/{userId}` should have `isPremium: true`

## Test Cards

| Card Number | Expiry | CVV | Result |
|-------------|--------|-----|--------|
| 5123456789012346 | 12/2025 | 111 | Success |
| 4123450131000508 | 12/2025 | 111 | Success |

## Common Issues

### Webhook not firing in sandbox
Sandbox webhooks can be unreliable. Add polling fallback:

```javascript
// Poll payment status after redirect
async function checkPaymentStatus(checkoutId) {
  const getStatus = httpsCallable(functions, 'getPaymentStatus');
  const result = await getStatus({ checkoutId });
  return result.data.status;
}
```

### CORS errors
Ensure your Cloud Function allows CORS if calling from browser.

### Payment stuck
Sessions expire after 30 minutes. Create new checkout if expired.

## What's Next?

- **Webhook Registration**: Register your webhook URL with Maya (see full guide)
- **Production**: Get production keys and update config
- **Recurring**: Implement auto-renewal with Maya Vault (see MAYA_RECURRING_SUBSCRIPTIONS.md)
- **Monitoring**: Set up Cloud Functions logging and alerts

## Support

- Full Guide: [MAYA_PAYMENT_INTEGRATION.md](./MAYA_PAYMENT_INTEGRATION.md)
- Maya Docs: https://developers.maya.ph
- Email: [email protected]

---

**Total Time:** ~30 minutes to live sandbox payments!
