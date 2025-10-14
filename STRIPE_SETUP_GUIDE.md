# Firebase Stripe Extension Setup Guide

## Issue
Your subscription plans are not showing because the Firebase Stripe extension hasn't synced your Stripe products to Firestore yet.

## Current Situation
- You have 3 active products in Stripe:
  - Premium (Monthly) - $7.00/month
  - Premium 3 months - $20.00/every 3 months
  - Premium 1year - $80.00/year
- The `products` collection doesn't exist in Firestore
- The extension needs to be properly configured to sync Stripe products

---

## Solution Steps

### Step 1: Verify Firebase Stripe Extension Configuration

1. Go to Firebase Console: https://console.firebase.google.com/project/dotkol/extensions
2. Find the **Run Payments with Stripe** extension
3. Click on it to view configuration
4. Check the following settings:

   **Critical Settings to Verify:**
   - **Stripe API Key**: Must be set (your Stripe Secret Key)
   - **Products and pricing plans collection**: Should be `products` (default)
   - **Customer details and subscriptions collection**: Should be `customers` (default)
   - **Sync new users to Stripe customers**: Recommended to enable
   - **Automatically delete Stripe customer objects**: Your choice

### Step 2: Reconfigure the Extension (If Needed)

If the collection names are different or the extension isn't configured properly:

1. In the Firebase Console Extensions page, click the **three dots** (⋮) next to your Stripe extension
2. Click **Reconfigure**
3. Set these values:
   - **Products collection**: `products`
   - **Customer collection**: `customers`
4. Save the configuration

### Step 3: Trigger Product Sync from Stripe

The Firebase Stripe extension automatically syncs products, but you need to trigger it:

**Option A: Create a Test Product (Recommended)**
1. Go to Stripe Dashboard: https://dashboard.stripe.com/test/products
2. Create a new test product with a price
3. Mark it as active
4. Wait 30-60 seconds
5. Check Firestore - the `products` collection should appear
6. Once confirmed working, you can delete the test product

**Option B: Use Stripe Webhooks**
1. The extension should have set up webhooks automatically
2. Go to: https://dashboard.stripe.com/test/webhooks
3. Find the webhook created by Firebase (should have your project URL)
4. Click on it and verify these events are enabled:
   - `product.created`
   - `product.updated`
   - `product.deleted`
   - `price.created`
   - `price.updated`
   - `price.deleted`

**Option C: Manual Sync (Last Resort)**
If automatic sync isn't working, you may need to:
1. Check the Firebase Functions logs for errors
2. Go to: https://console.firebase.google.com/project/dotkol/functions
3. Look for any errors related to the Stripe extension

### Step 4: Verify Products Collection in Firestore

After the sync:

1. Go to: https://console.firebase.google.com/project/dotkol/firestore/data
2. You should see a `products` collection
3. Each product should have:
   - `active`: true
   - `name`: Product name from Stripe
   - `description`: Product description
   - A `prices` subcollection with price details

Example structure:
```
products (collection)
  └─ prod_TEAmxKffGM8z4f (document)
      ├─ active: true
      ├─ name: "Premium"
      ├─ description: "1month premium access"
      └─ prices (subcollection)
          └─ price_xxxxx (document)
              ├─ active: true
              ├─ currency: "usd"
              ├─ unit_amount: 700
              ├─ interval: "month"
              └─ type: "recurring"
```

### Step 5: Update Firestore Security Rules

**IMPORTANT:** You must update your Firestore rules to allow public read access to products.

1. Go to: https://console.firebase.google.com/project/dotkol/firestore/rules
2. The rules should already be updated in your local `firestore.rules` file
3. Copy the entire content from `firestore.rules` in your project
4. Paste it into the Firebase Console rules editor
5. Click **Publish**

Key rules that must be present:
```javascript
// Stripe Products collection (Firebase Extension): Public read for active products
match /products/{productId} {
  allow read: if true;

  // Prices subcollection: Public read for active prices
  match /prices/{priceId} {
    allow read: if true;
  }
}

// Stripe Customers collection (Firebase Extension): Users can read/write their own customer data
match /customers/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;

  // Checkout sessions subcollection: Users can create their own checkout sessions
  match /checkout_sessions/{sessionId} {
    allow read, create: if request.auth != null && request.auth.uid == userId;
  }

  // Subscriptions subcollection: Users can read their own subscriptions
  match /subscriptions/{subscriptionId} {
    allow read: if request.auth != null && request.auth.uid == userId;
  }
}
```

---

## Troubleshooting

### Products Still Not Showing?

**Check 1: Extension Installation**
- Verify the Stripe extension is actually installed
- Go to: https://console.firebase.google.com/project/dotkol/extensions
- If not installed, install "Run Payments with Stripe" extension

**Check 2: Stripe API Mode**
- Make sure you're using the correct Stripe keys (Test vs Live)
- Your extension should be configured with Test keys for testing
- Products must exist in the same Stripe mode (test/live) as your keys

**Check 3: Stripe Products Configuration**
- In Stripe Dashboard, ensure products are:
  - Active (not archived)
  - Have at least one active price
  - Marked as "Recurring" for subscriptions

**Check 4: Extension Logs**
1. Go to: https://console.firebase.google.com/project/dotkol/functions
2. Look for functions starting with `ext-firestore-stripe-payments-`
3. Check logs for any errors
4. Common errors:
   - Invalid Stripe API key
   - Missing permissions
   - Webhook signature verification failed

**Check 5: Browser Console**
1. Open your app in the browser
2. Go to subscription page
3. Open Developer Tools (F12)
4. Check Console for errors
5. Check Network tab for failed requests

---

## Quick Test After Setup

Once products are synced to Firestore:

1. Refresh your application
2. Navigate to the subscription page
3. You should see your 3 products displayed:
   - Premium (Monthly) - $7.00/month
   - Premium 3 months - $20.00/every 3 months
   - Premium 1year - $80.00/year

---

## Common Issues and Solutions

### Issue: "Missing or insufficient permissions"
**Solution:** Update Firestore rules (Step 5 above)

### Issue: Extension not syncing products
**Solution:**
1. Check webhook configuration in Stripe
2. Manually trigger by creating a test product
3. Check extension configuration for correct API keys

### Issue: Products exist but not showing in app
**Solution:**
1. Check browser console for errors
2. Verify Firestore rules allow public read on `products` collection
3. Ensure products have `active: true` field

### Issue: Checkout not working
**Solution:**
1. Verify `customers` collection rules are set correctly
2. Check that user is authenticated before clicking subscribe
3. Verify Stripe webhook is receiving events

---

## Need More Help?

If products still don't appear after following all steps:

1. Check Firebase Functions logs for errors
2. Verify Stripe webhook is receiving events
3. Check browser console for JavaScript errors
4. Ensure you're using matching Stripe API keys (test/live mode)
5. Try creating a new product in Stripe to trigger a fresh sync

---

## Alternative: Manual Product Sync

If automatic sync continues to fail, you can manually create the products collection structure in Firestore, but this is NOT recommended as it won't stay in sync with Stripe. The extension should handle this automatically.
