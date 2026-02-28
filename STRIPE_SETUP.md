# Stripe Integration Setup Guide

**Status:** Needs real API keys for payment testing

---

## Quick Start (5 minutes)

1. **Create Stripe Account** (if you don't have one)
   - Go to https://stripe.com
   - Sign up for free

2. **Get Test API Keys**
   - Go to https://dashboard.stripe.com/apikeys
   - Make sure you're in **TEST mode** (toggle in top left)
   - Copy your keys:
     - **Secret Key** - Starts with `sk_test_`
     - **Publishable Key** - Starts with `pk_test_`

3. **Update `.env.local`**
   ```bash
   # Line 12 - Replace with your Secret Key
   STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE

   # Line 13 - Replace with your Publishable Key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
   ```

4. **Restart dev server**
   ```bash
   npm run dev
   ```

---

## Full Setup (15 minutes)

### Step 1: Get API Keys

1. Login to https://dashboard.stripe.com
2. Click **Developers** (left sidebar)
3. Click **API Keys**
4. Make sure **TEST MODE** is enabled (toggle top-left)
5. Copy these keys:
   - Secret Key (starts with `sk_test_`)
   - Publishable Key (starts with `pk_test_`)

### Step 2: Create Products & Prices

You need to create pricing IDs for the billing page to work:

1. Go to **Products** → **Add Product**
2. Create 4 products:

**Product 1: Pro Monthly**
- Name: `ResumeOps Pro - Monthly`
- Price: `$6.99/month` (recurring)
- Billing period: Monthly
- Copy the **Price ID** (starts with `price_`)

**Product 2: Pro Yearly**
- Name: `ResumeOps Pro - Yearly`
- Price: `$59.88/year` (recurring)
- Billing period: Yearly
- Copy the **Price ID**

**Product 3: Teams Monthly**
- Name: `ResumeOps Teams - Monthly`
- Price: `$15.99/month` (recurring)
- Copy the **Price ID**

**Product 4: Teams Yearly**
- Name: `ResumeOps Teams - Yearly`
- Price: `$167.88/year` (recurring)
- Copy the **Price ID**

### Step 3: Set Up Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `http://localhost:3000/api/stripe/webhook` (for local testing)
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing Secret** (starts with `whsec_`)

### Step 4: Update `.env.local`

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_PASTE_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PASTE_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_PASTE_YOUR_WEBHOOK_SECRET_HERE

# Stripe Price IDs from your products
NEXT_PUBLIC_STRIPE_PRO_MONTHLY_PRICE_ID=price_PASTE_PRO_MONTHLY_ID
NEXT_PUBLIC_STRIPE_PRO_YEARLY_PRICE_ID=price_PASTE_PRO_YEARLY_ID
NEXT_PUBLIC_STRIPE_TEAMS_MONTHLY_PRICE_ID=price_PASTE_TEAMS_MONTHLY_ID
NEXT_PUBLIC_STRIPE_TEAMS_YEARLY_PRICE_ID=price_PASTE_TEAMS_YEARLY_ID
```

### Step 5: Restart Server

```bash
npm run dev
```

---

## Testing with Stripe Test Cards

**Note:** Use these cards ONLY in TEST mode (not production)

| Card | Number | Status |
|------|--------|--------|
| Success | `4242 4242 4242 4242` | Successful charge |
| Declined | `4000 0000 0000 0002` | Declined charge |
| 3D Secure | `4000 0025 0000 3155` | Requires authentication |
| Wrong CVC | `4000 0000 0000 0127` | CVC check fails |

**Expiry:** Any future date (e.g., 12/25)
**CVC:** Any 3 digits (e.g., 123)

---

## Testing Payment Flow

1. **Start dev server:** `npm run dev`
2. **Sign up for account:** http://localhost:3000/signup
3. **Complete 3 free scans** to hit limit
4. **Click "Upgrade to Pro"** button
5. **Enter test card:** `4242 4242 4242 4242`
6. **Check results:**
   - Should redirect to `/billing`
   - Status should show "Pro" subscription active
   - Check Stripe Dashboard → Customers for new subscription

---

## For Local Webhook Testing (Advanced)

Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI (https://stripe.com/docs/stripe-cli)

# Then run:
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Copy the signing secret and add to .env.local
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

---

## Troubleshooting

**Error: "Invalid API Key"**
- Verify you copied the FULL key (very long string)
- Check you're in TEST mode, not LIVE mode
- Restart dev server after updating `.env.local`

**Error: "Product price not found"**
- Create the products in Stripe Dashboard
- Make sure price IDs are in `.env.local`
- Restart dev server

**Payment doesn't complete**
- Check Stripe Dashboard → Events for webhook failures
- Verify webhook is registered with correct URL
- Try using Stripe CLI for local testing

**Webhook not firing**
- Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Check Stripe Dashboard → Webhooks for delivery logs
- Look at app console for errors

---

## When Moving to Production

1. Switch to LIVE mode keys (starts with `sk_live_`, `pk_live_`)
2. Update webhook URL to production domain
3. Test with real payment methods (use small amount)
4. Monitor Stripe Dashboard for transactions

---

## Current Status

- ✅ Stripe SDK installed
- ✅ API routes configured
- ✅ Database tables ready
- ⏳ **Waiting for:** Real API keys to be added
- ⏳ **Waiting for:** Stripe products to be created

Once keys are added, payments will work immediately!
