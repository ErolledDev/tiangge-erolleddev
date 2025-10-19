# Maya Recurring Subscriptions Guide

Advanced guide for implementing auto-renewal subscriptions using Maya Vault and Firebase Cloud Scheduler.

## Table of Contents
1. [Overview](#overview)
2. [Maya Vault Basics](#maya-vault-basics)
3. [Architecture](#architecture)
4. [Implementation](#implementation)
5. [Scheduling Renewals](#scheduling-renewals)
6. [Security & Compliance](#security--compliance)
7. [Testing](#testing)
8. [Production Considerations](#production-considerations)

## Overview

Maya Vault enables storing payment methods securely for future charges without re-entering card details. This guide extends the basic integration to support automatic subscription renewals.

**Key Differences from One-Time Payments:**

| Feature | One-Time (Checkout) | Recurring (Vault) |
|---------|---------------------|-------------------|
| User Action | Required each time | Once (initial setup) |
| 3DS Authentication | Every payment | Initial only |
| Card Storage | No | Yes (tokenized) |
| Auto-Renewal | No | Yes |
| PCI Compliance | Standard | Enhanced (required) |
| Implementation Complexity | Low | Medium-High |

## Maya Vault Basics

### What is Maya Vault?

Maya Vault securely stores payment method tokens (card tokens) that can be charged repeatedly without the customer re-entering card details or completing 3DS authentication (after the first time).

### Payment Journeys

Maya Vault supports two journeys:

#### 1. Pay and Save
- Charges the customer AND saves the card
- Use for: First subscription payment
- Flow: Customer pays → Card saved → Future charges automated

#### 2. Save Only
- Saves card without charging (places PHP 10 temporary hold)
- Use for: Trial periods, future-only charges
- Flow: Customer authorizes → Card saved → Charge later

### Vault vs Checkout

| Aspect | Checkout (Basic) | Vault (Recurring) |
|--------|------------------|-------------------|
| Best For | One-time payments | Subscriptions |
| 3DS | Every time | Initial only |
| Customer Friction | Higher (repeated auth) | Lower (one-time) |
| Setup Complexity | Simple | Moderate |
| Requires Scheduler | No | Yes |

## Architecture

### Data Model Extensions

#### Firestore Collections

**`users/{userId}`** - Add vault fields:
```javascript
{
  // ... existing fields
  vaultEnabled: boolean,
  cardToken: string,           // Encrypted card token from Maya
  cardDetails: {                // Masked card info for display
    type: 'visa' | 'mastercard',
    lastFour: string,
    expiryMonth: string,
    expiryYear: string
  },
  autoRenew: boolean,
  nextBillingDate: Timestamp,
  subscriptionPlan: {
    id: string,
    name: string,
    amount: number,
    interval: 'monthly' | 'yearly'
  }
}
```

**`recurringPayments/{paymentId}`** - Track scheduled charges:
```javascript
{
  userId: string,
  cardToken: string,
  amount: number,
  currency: 'PHP',
  status: 'scheduled' | 'processing' | 'success' | 'failed',
  scheduledDate: Timestamp,
  executedDate: Timestamp | null,
  attempts: number,
  lastError: string | null,
  paymentId: string | null      // Maya payment ID after execution
}
```

### System Flow

```
[User Signs Up]
    ↓
[Select Plan + Enable Auto-Renew]
    ↓
[Create Vault Payment (Pay and Save)]
    ↓
[User Completes Payment + 3DS]
    ↓
[Maya Returns Card Token]
    ↓
[Store Token in Firestore (Encrypted)]
    ↓
[Set nextBillingDate]
    ↓
[Cloud Scheduler Triggers Daily]
    ↓
[Check Users with nextBillingDate = Today]
    ↓
[For Each: Charge via Vault API]
    ↓
[Update Firestore: Extend validDate]
    ↓
[Send Receipt Email]
```

## Implementation

### Step 1: Install Additional Dependencies

```bash
cd functions
npm install @google-cloud/scheduler node-cron
```

### Step 2: Update Maya Service for Vault

Add to `functions/src/services/mayaService.js`:

```javascript
const axios = require('axios');

class MayaService {
  // ... existing code ...

  getBaseUrl() {
    const config = functions.config().maya || {};
    const environment = config.environment || process.env.MAYA_ENVIRONMENT || 'sandbox';
    return environment === 'production'
      ? 'https://pg.maya.ph'
      : 'https://pg-sandbox.paymaya.com';
  }

  getSecretKey() {
    const config = functions.config().maya || {};
    return config.secret_key || process.env.MAYA_SECRET_KEY;
  }

  async createVaultPayment(params) {
    const { userId, amount, planName, buyerInfo, saveCard = true } = params;

    const requestBody = {
      totalAmount: {
        value: amount.toFixed(2),
        currency: 'PHP'
      },
      buyer: {
        firstName: buyerInfo.firstName,
        lastName: buyerInfo.lastName,
        contact: {
          phone: buyerInfo.phone || '',
          email: buyerInfo.email
        }
      },
      items: [{
        name: planName,
        quantity: 1,
        code: 'SUBSCRIPTION',
        description: `Subscription: ${planName}`,
        amount: {
          value: amount.toFixed(2)
        },
        totalAmount: {
          value: amount.toFixed(2),
          currency: 'PHP'
        }
      }],
      redirectUrl: {
        success: params.successUrl,
        failure: params.failureUrl,
        cancel: params.cancelUrl
      },
      requestReferenceNumber: `vault-${userId}-${Date.now()}`,
      metadata: {
        userId,
        saveCard: saveCard.toString()
      }
    };

    const auth = Buffer.from(this.getSecretKey() + ':').toString('base64');
    const baseUrl = this.getBaseUrl();

    try {
      const response = await axios.post(
        `${baseUrl}/payments/v1/payment-rrns`,
        requestBody,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        paymentId: response.data.paymentId,
        verificationUrl: response.data.verificationUrl,
        requestReferenceNumber: requestBody.requestReferenceNumber
      };
    } catch (error) {
      console.error('Vault Payment Creation Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async createRecurringPayment(cardToken, amount, requestReferenceNumber) {
    const requestBody = {
      totalAmount: {
        value: amount.toFixed(2),
        currency: 'PHP'
      },
      paymentTokenId: cardToken,
      requestReferenceNumber,
      metadata: {
        paymentType: 'RECURRING'
      }
    };

    const auth = Buffer.from(this.getSecretKey() + ':').toString('base64');
    const baseUrl = this.getBaseUrl();

    try {
      const response = await axios.post(
        `${baseUrl}/payments/v1/payment-tokens`,
        requestBody,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Recurring Payment Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async retrieveVaultPayment(paymentId) {
    const auth = Buffer.from(this.getSecretKey() + ':').toString('base64');
    const baseUrl = this.getBaseUrl();

    try {
      const response = await axios.get(
        `${baseUrl}/payments/v1/payments/${paymentId}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Retrieve Payment Error:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteCardToken(cardToken) {
    const auth = Buffer.from(this.getSecretKey() + ':').toString('base64');
    const baseUrl = this.getBaseUrl();

    try {
      await axios.delete(
        `${baseUrl}/payments/v1/payment-tokens/${cardToken}`,
        {
          headers: {
            'Authorization': `Basic ${auth}`
          }
        }
      );

      return { success: true };
    } catch (error) {
      console.error('Delete Token Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new MayaService();
```

### Step 3: Create Vault Payment Function

Add to `functions/src/payments.js`:

```javascript
exports.createVaultPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { plan, enableAutoRenew } = data;
  const userId = context.auth.uid;

  if (!plan || !plan.amount || !plan.name) {
    throw new functions.https.HttpsError('invalid-argument', 'Plan details required');
  }

  try {
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    const userData = userDoc.data();

    const successUrl = `${data.baseUrl || 'https://yourapp.com'}/payment/vault-success?ref=`;
    const failureUrl = `${data.baseUrl || 'https://yourapp.com'}/payment/failure`;
    const cancelUrl = `${data.baseUrl || 'https://yourapp.com'}/payment/cancel`;

    const vaultPayment = await mayaService.createVaultPayment({
      userId,
      amount: plan.amount,
      planName: plan.name,
      buyerInfo: {
        firstName: userData?.displayName?.split(' ')[0] || 'User',
        lastName: userData?.displayName?.split(' ')[1] || 'Customer',
        email: userData?.email || context.auth.token.email,
        phone: userData?.phone || ''
      },
      saveCard: enableAutoRenew,
      successUrl: successUrl + vaultPayment.requestReferenceNumber,
      failureUrl,
      cancelUrl
    });

    await admin.firestore().collection('paymentLogs').doc(vaultPayment.paymentId).set({
      userId,
      paymentId: vaultPayment.paymentId,
      requestReferenceNumber: vaultPayment.requestReferenceNumber,
      amount: plan.amount,
      currency: 'PHP',
      plan: plan.name,
      status: 'pending',
      vaultEnabled: enableAutoRenew,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      webhookReceived: false
    });

    return {
      success: true,
      verificationUrl: vaultPayment.verificationUrl,
      paymentId: vaultPayment.paymentId
    };
  } catch (error) {
    console.error('Create Vault Payment Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

exports.disableAutoRenew = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const userId = context.auth.uid;

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    const userDoc = await userRef.get();
    const userData = userDoc.data();

    if (userData?.cardToken) {
      await mayaService.deleteCardToken(userData.cardToken);
    }

    await userRef.update({
      autoRenew: false,
      cardToken: admin.firestore.FieldValue.delete(),
      cardDetails: admin.firestore.FieldValue.delete()
    });

    return { success: true, message: 'Auto-renewal disabled' };
  } catch (error) {
    console.error('Disable Auto-Renew Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});
```

### Step 4: Update Webhook Handler for Vault

Update `functions/src/webhooks.js`:

```javascript
exports.handleMayaWebhook = functions.https.onRequest(async (req, res) => {
  // ... existing IP verification ...

  const payload = req.body;
  console.log('Maya Webhook Received:', JSON.stringify(payload, null, 2));

  try {
    const { id, status, paymentTokenId, card } = payload;

    const paymentLogRef = admin.firestore().collection('paymentLogs').doc(id);
    const paymentLog = await paymentLogRef.get();

    if (!paymentLog.exists) {
      console.warn('Payment log not found for paymentId:', id);
      return res.status(200).send('OK');
    }

    const { userId, amount, plan, webhookReceived, vaultEnabled } = paymentLog.data();

    if (webhookReceived) {
      console.log('Webhook already processed for:', id);
      return res.status(200).send('OK');
    }

    await paymentLogRef.update({
      status,
      webhookReceived: true,
      completedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    if (status === 'PAYMENT_SUCCESS' || status === 'AUTHORIZED') {
      const validDate = new Date();
      validDate.setDate(validDate.getDate() + 30);

      const updateData = {
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
      };

      if (vaultEnabled && paymentTokenId) {
        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        updateData.vaultEnabled = true;
        updateData.cardToken = paymentTokenId;
        updateData.autoRenew = true;
        updateData.nextBillingDate = admin.firestore.Timestamp.fromDate(nextBillingDate);
        updateData.subscriptionPlan = {
          id: plan.toLowerCase().replace(/\s+/g, '-'),
          name: plan,
          amount,
          interval: 'monthly'
        };

        if (card) {
          updateData.cardDetails = {
            type: card.type || 'unknown',
            lastFour: card.lastFour || '****',
            expiryMonth: card.expiryMonth,
            expiryYear: card.expiryYear
          };
        }
      }

      await admin.firestore().collection('users').doc(userId).update(updateData);

      console.log('User upgraded to premium:', userId);
      if (vaultEnabled) {
        console.log('Auto-renewal enabled for user:', userId);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook Handler Error:', error);
    res.status(500).send('Internal Server Error');
  }
});
```

### Step 5: Create Recurring Charge Function

Create `functions/src/recurring.js`:

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const mayaService = require('./services/mayaService');

exports.processRecurringPayments = functions.pubsub
  .schedule('0 2 * * *')
  .timeZone('Asia/Manila')
  .onRun(async (context) => {
    console.log('Processing recurring payments...');

    const now = admin.firestore.Timestamp.now();
    const usersRef = admin.firestore().collection('users');

    const dueUsers = await usersRef
      .where('autoRenew', '==', true)
      .where('nextBillingDate', '<=', now)
      .get();

    console.log(`Found ${dueUsers.size} users due for renewal`);

    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    for (const doc of dueUsers.docs) {
      const userId = doc.id;
      const userData = doc.data();

      try {
        const { cardToken, subscriptionPlan } = userData;

        if (!cardToken || !subscriptionPlan) {
          throw new Error('Missing card token or subscription plan');
        }

        const requestReferenceNumber = `recurring-${userId}-${Date.now()}`;

        const payment = await mayaService.createRecurringPayment(
          cardToken,
          subscriptionPlan.amount,
          requestReferenceNumber
        );

        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        const validDate = new Date(userData.validDate.toDate());
        validDate.setDate(validDate.getDate() + 30);

        await usersRef.doc(userId).update({
          validDate: admin.firestore.Timestamp.fromDate(validDate),
          nextBillingDate: admin.firestore.Timestamp.fromDate(nextBillingDate),
          subscriptionHistory: admin.firestore.FieldValue.arrayUnion({
            transactionId: payment.id,
            amount: subscriptionPlan.amount,
            currency: 'PHP',
            plan: subscriptionPlan.name,
            purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
            status: 'success',
            type: 'recurring'
          })
        });

        await admin.firestore().collection('recurringPayments').add({
          userId,
          cardToken,
          amount: subscriptionPlan.amount,
          currency: 'PHP',
          status: 'success',
          scheduledDate: now,
          executedDate: admin.firestore.FieldValue.serverTimestamp(),
          attempts: 1,
          paymentId: payment.id
        });

        results.success++;
        console.log(`Successfully charged user: ${userId}`);
      } catch (error) {
        console.error(`Failed to charge user ${userId}:`, error);

        await admin.firestore().collection('recurringPayments').add({
          userId,
          cardToken: userData.cardToken,
          amount: userData.subscriptionPlan?.amount || 0,
          currency: 'PHP',
          status: 'failed',
          scheduledDate: now,
          executedDate: admin.firestore.FieldValue.serverTimestamp(),
          attempts: 1,
          lastError: error.message
        });

        results.failed++;
        results.errors.push({ userId, error: error.message });
      }
    }

    console.log('Recurring payments processed:', results);
    return results;
  });

exports.retryFailedPayments = functions.pubsub
  .schedule('0 14 * * *')
  .timeZone('Asia/Manila')
  .onRun(async (context) => {
    console.log('Retrying failed payments...');

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const failedPayments = await admin.firestore()
      .collection('recurringPayments')
      .where('status', '==', 'failed')
      .where('attempts', '<', 3)
      .where('executedDate', '>', admin.firestore.Timestamp.fromDate(oneDayAgo))
      .get();

    console.log(`Found ${failedPayments.size} failed payments to retry`);

    for (const doc of failedPayments.docs) {
      const paymentData = doc.data();
      const { userId, cardToken, amount } = paymentData;

      try {
        const requestReferenceNumber = `retry-${userId}-${Date.now()}`;

        const payment = await mayaService.createRecurringPayment(
          cardToken,
          amount,
          requestReferenceNumber
        );

        await doc.ref.update({
          status: 'success',
          attempts: admin.firestore.FieldValue.increment(1),
          paymentId: payment.id,
          lastError: null
        });

        const userRef = admin.firestore().collection('users').doc(userId);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        const validDate = new Date(userData.validDate.toDate());
        validDate.setDate(validDate.getDate() + 30);

        const nextBillingDate = new Date();
        nextBillingDate.setDate(nextBillingDate.getDate() + 30);

        await userRef.update({
          validDate: admin.firestore.Timestamp.fromDate(validDate),
          nextBillingDate: admin.firestore.Timestamp.fromDate(nextBillingDate),
          subscriptionHistory: admin.firestore.FieldValue.arrayUnion({
            transactionId: payment.id,
            amount,
            currency: 'PHP',
            plan: userData.subscriptionPlan.name,
            purchaseDate: admin.firestore.FieldValue.serverTimestamp(),
            status: 'success',
            type: 'recurring_retry'
          })
        });

        console.log(`Successfully retried payment for user: ${userId}`);
      } catch (error) {
        console.error(`Retry failed for user ${userId}:`, error);

        await doc.ref.update({
          attempts: admin.firestore.FieldValue.increment(1),
          lastError: error.message
        });

        if (paymentData.attempts + 1 >= 3) {
          await admin.firestore().collection('users').doc(userId).update({
            autoRenew: false
          });
          console.log(`Disabled auto-renewal for user ${userId} after 3 failed attempts`);
        }
      }
    }
  });
```

### Step 6: Export New Functions

Update `functions/index.js`:

```javascript
const admin = require('firebase-admin');
admin.initializeApp();

const payments = require('./src/payments');
const webhooks = require('./src/webhooks');
const recurring = require('./src/recurring');

exports.createPayment = payments.createPayment;
exports.createVaultPayment = payments.createVaultPayment;
exports.disableAutoRenew = payments.disableAutoRenew;
exports.getPaymentStatus = payments.getPaymentStatus;
exports.handleMayaWebhook = webhooks.handleMayaWebhook;
exports.processRecurringPayments = recurring.processRecurringPayments;
exports.retryFailedPayments = recurring.retryFailedPayments;
```

## Scheduling Renewals

### Cloud Scheduler Setup

1. **Enable Cloud Scheduler API:**
   ```bash
   gcloud services enable cloudscheduler.googleapis.com
   ```

2. **Deploy Functions:**
   ```bash
   firebase deploy --only functions
   ```

The `processRecurringPayments` function runs daily at 2 AM Manila time.
The `retryFailedPayments` function runs daily at 2 PM Manila time.

### Manual Testing

Test the scheduler function manually:

```bash
gcloud functions call processRecurringPayments --data '{}'
```

Or via HTTP callable for testing:

```javascript
exports.testRecurringPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Admin only');
  }

  const { userId } = data;

  // Force process single user
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  // ... process payment logic ...
});
```

## Security & Compliance

### PCI DSS Requirements

When handling card tokens:

1. **Never Log Card Details:**
   ```javascript
   console.log({ userId, amount }); // OK
   console.log({ cardToken }); // NEVER
   ```

2. **Encrypt Tokens at Rest:**
   Use Firestore security rules or encrypt tokens before storing.

3. **Limit Token Access:**
   Only backend functions should access card tokens.

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;

      // Prevent client from writing sensitive fields
      allow update: if request.auth != null
        && request.auth.uid == userId
        && !request.resource.data.diff(resource.data).affectedKeys().hasAny([
          'cardToken',
          'isPremium',
          'validDate'
        ]);
    }

    match /recurringPayments/{paymentId} {
      allow read: if request.auth != null
        && resource.data.userId == request.auth.uid;
      allow write: if false; // Only functions can write
    }
  }
}
```

### Environment Variables

Store sensitive keys securely:

```bash
firebase functions:config:set \
  maya.secret_key="YOUR_SECRET_KEY" \
  maya.public_key="YOUR_PUBLIC_KEY" \
  maya.environment="sandbox"
```

Never commit `.env` files or hardcode keys.

## Testing

### Test Vault Payment Flow

1. **Create Vault Payment:**
   ```javascript
   const createVaultPayment = httpsCallable(functions, 'createVaultPayment');
   const result = await createVaultPayment({
     plan: { name: '1 Month Premium', amount: 500 },
     enableAutoRenew: true,
     baseUrl: window.location.origin
   });
   window.location.href = result.data.verificationUrl;
   ```

2. **Complete Payment:**
   - Use test card: `5123456789012346`
   - Complete 3DS if prompted

3. **Verify Database:**
   ```javascript
   const userDoc = await admin.firestore().collection('users').doc(userId).get();
   const data = userDoc.data();
   console.log({
     vaultEnabled: data.vaultEnabled,
     cardToken: data.cardToken ? 'Present' : 'Missing',
     autoRenew: data.autoRenew,
     nextBillingDate: data.nextBillingDate?.toDate()
   });
   ```

4. **Test Recurring Charge:**
   ```javascript
   // Manually set nextBillingDate to past
   await admin.firestore().collection('users').doc(userId).update({
     nextBillingDate: admin.firestore.Timestamp.fromDate(new Date('2025-01-01'))
   });

   // Trigger scheduler
   await processRecurringPayments();
   ```

### Test Scenarios

| Scenario | Setup | Expected Result |
|----------|-------|-----------------|
| First Vault Payment | Enable auto-renew | Card saved, subscription active |
| Recurring Charge | Set nextBillingDate to past | Auto-charged, validDate extended |
| Failed Recurring | Use expired card | 3 retry attempts, then disabled |
| Cancel Subscription | Call disableAutoRenew | Card token deleted, auto-renew off |

## Production Considerations

### Monitoring & Alerts

1. **Set Up Monitoring:**
   ```bash
   # Cloud Functions dashboard
   gcloud logging read "resource.type=cloud_function"
   ```

2. **Create Alerts:**
   - Failed payment rate > 5%
   - Scheduler function failures
   - Webhook processing delays

3. **Track Metrics:**
   - Successful renewal rate
   - Churn rate (cancelled subscriptions)
   - Average revenue per user

### Error Handling

```javascript
async function chargeUser(userId, cardToken, amount) {
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await mayaService.createRecurringPayment(cardToken, amount, `ref-${Date.now()}`);
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt} failed for user ${userId}:`, error.message);

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      }
    }
  }

  throw lastError;
}
```

### Notification System

Send emails/SMS for:
- Successful renewal
- Failed payment (retry in 24h)
- Final failure (subscription cancelled)
- Upcoming renewal reminder (3 days before)

Example:

```javascript
async function sendRenewalNotification(userId, status) {
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  const { email, displayName } = userDoc.data();

  const subject = status === 'success'
    ? 'Subscription Renewed Successfully'
    : 'Payment Failed - Action Required';

  // Use SendGrid, Firebase Extensions, or similar
  await sendEmail({ to: email, subject, body: '...' });
}
```

### Subscription Management UI

Create frontend components for:

```typescript
// components/SubscriptionManager.tsx
export function SubscriptionManager() {
  const { user } = useAuth();
  const [autoRenew, setAutoRenew] = useState(false);

  const toggleAutoRenew = async () => {
    if (autoRenew) {
      await httpsCallable(functions, 'disableAutoRenew')({});
      setAutoRenew(false);
    } else {
      // Redirect to vault payment
    }
  };

  return (
    <div>
      <h2>Subscription</h2>
      <p>Status: {user.isPremium ? 'Active' : 'Inactive'}</p>
      <p>Valid Until: {user.validDate?.toDate().toLocaleDateString()}</p>

      {user.cardDetails && (
        <div>
          <p>Payment Method: {user.cardDetails.type} ****{user.cardDetails.lastFour}</p>
          <p>Expires: {user.cardDetails.expiryMonth}/{user.cardDetails.expiryYear}</p>
        </div>
      )}

      <label>
        <input
          type="checkbox"
          checked={autoRenew}
          onChange={toggleAutoRenew}
        />
        Auto-Renew
      </label>
    </div>
  );
}
```

### Performance Optimization

1. **Batch Processing:**
   Process renewals in batches to avoid timeouts:
   ```javascript
   const batchSize = 100;
   const batches = chunk(dueUsers.docs, batchSize);

   for (const batch of batches) {
     await Promise.all(batch.map(doc => processUser(doc)));
   }
   ```

2. **Rate Limiting:**
   Respect Maya API rate limits (check documentation).

3. **Caching:**
   Cache user data to reduce Firestore reads.

### Compliance Checklist

- [ ] PCI DSS compliance (if storing cards)
- [ ] GDPR compliance (data deletion)
- [ ] Clear subscription terms
- [ ] Easy cancellation process
- [ ] Transparent billing
- [ ] Receipt/invoice generation
- [ ] Dispute handling process

---

## Next Steps

1. Implement prorated billing for mid-cycle upgrades
2. Add annual subscription option with discount
3. Create admin dashboard for subscription management
4. Implement subscription analytics
5. Add dunning management (retry failed payments)

For support: [email protected]
