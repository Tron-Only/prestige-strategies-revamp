# M-Pesa Daraja API Setup Guide

## Current Status

✅ **Test Mode Enabled** - Payments are simulated locally for development
🔄 **Production Ready** - Code is ready for real M-Pesa integration

---

## Test Mode (Current Setup)

Your `.env` has `MPESA_TEST_MODE=true` which:
- ✅ Bypasses real M-Pesa API calls
- ✅ Simulates successful payments instantly
- ✅ Creates enrollments automatically
- ✅ Lets you test the entire flow locally

### Testing the Flow:
1. Sign in with Google
2. Enter any phone number (format: 0712345678)
3. Payment completes instantly
4. You're enrolled and redirected to course player

---

## Production Setup (When You Get PayBill)

### Step 1: Get Your PayBill Number

Contact Safaricom or your bank to get:
- **Business PayBill Number** (e.g., 123456)
- **Till Number** (alternative to PayBill)

### Step 2: Register for Daraja API (Production)

1. Go to: https://developer.safaricom.co.ke/
2. Log in to your account
3. Create a **new Production app** (not sandbox)
4. Select product: **"Lipa Na M-Pesa Online"**
5. You'll get:
   - Consumer Key
   - Consumer Secret
   - Your actual Business Shortcode
   - Passkey for your shortcode

### Step 3: Update `.env` for Production

```env
# M-Pesa Daraja API Configuration
MPESA_ENVIRONMENT=production
MPESA_CONSUMER_KEY=<your-production-consumer-key>
MPESA_CONSUMER_SECRET=<your-production-consumer-secret>
MPESA_SHORTCODE=<your-paybill-number>
MPESA_PASSKEY=<your-production-passkey>
MPESA_CALLBACK_URL=https://yourdomain.com/api/payments/callback.php

# Testing Mode (DISABLE in production!)
MPESA_TEST_MODE=false
```

### Step 4: Configure Callback URL in Daraja

In your Daraja production app settings:
1. Set **Validation URL**: `https://yourdomain.com/api/payments/callback.php`
2. Set **Confirmation URL**: `https://yourdomain.com/api/payments/callback.php`

### Step 5: Test with Real Money

⚠️ **Important**: Test with small amounts first (e.g., KES 10)

1. Set `MPESA_TEST_MODE=false` in `.env`
2. Create a test course with price KES 10
3. Try the enrollment flow with your own phone
4. Check if:
   - STK Push appears on your phone
   - Payment completes
   - Enrollment is created
   - You get redirected to course player

### Step 6: Monitor Logs

Check M-Pesa callback logs:
```bash
tail -f public/logs/mpesa_callbacks.log
```

This shows all payment confirmations from Safaricom.

---

## Sandbox Testing (Alternative)

If you want to test with Safaricom sandbox (before production):

### Get Sandbox Credentials

1. In your Daraja portal, go to your "prestige-strategies" app
2. Click on **"M-PESA EXPRESS Sandbox"** product
3. Look for **"Test Credentials"** section
4. You should see:
   - Lipa Na M-Pesa Online Shortcode
   - Lipa Na M-Pesa Online Passkey

### Update `.env` with Sandbox Credentials

```env
MPESA_ENVIRONMENT=sandbox
MPESA_CONSUMER_KEY=eixGX7qnAbu3UT4vGrksmvflDate5pWd45sGjXSrd4XqXTmG
MPESA_CONSUMER_SECRET=Ifvs9llKl5xl2Um76D7jaidwNPnUB3RvWksaqewRwK6sPXCLVGwxrmfA2BVZikHB
MPESA_SHORTCODE=<shortcode-from-test-credentials>
MPESA_PASSKEY=<passkey-from-test-credentials>
MPESA_TEST_MODE=false
```

### Test with Sandbox Phone Number

Safaricom provides test phone numbers for sandbox:
- **Test Phone**: 254708374149

⚠️ **Note**: Sandbox callback won't work on localhost. You need ngrok (see below).

---

## Testing Callbacks Locally (ngrok)

M-Pesa callbacks can't reach `localhost`. Use ngrok:

### 1. Install ngrok
```bash
# Download from https://ngrok.com/download
# Or install via snap
snap install ngrok
```

### 2. Start ngrok
```bash
ngrok http 8001
```

### 3. Update `.env`
Copy the HTTPS URL from ngrok (e.g., `https://abc123.ngrok.io`)
```env
MPESA_CALLBACK_URL=https://abc123.ngrok.io/api/payments/callback.php
```

### 4. Test Payment
Now M-Pesa can send callbacks to your local server through ngrok!

---

## Troubleshooting

### "Payment failed" error
- Check if `MPESA_TEST_MODE=true` (should work)
- Check PHP error logs: `tail -f /tmp/php_errors.log`
- Check M-Pesa logs: `tail -f public/logs/mpesa_callbacks.log`

### "Invalid credentials" (400 error)
- Verify Consumer Key and Secret are correct
- Check if you're using the right environment (sandbox vs production)
- Make sure your Daraja app is activated

### STK Push not appearing on phone
- Verify phone number format: 254XXXXXXXXX
- Check if shortcode and passkey match your app
- Ensure you're using production credentials for real phones

### Payment completes but no enrollment
- Check if callback URL is reachable
- Check `public/logs/mpesa_callbacks.log` for callback data
- Verify database has payment and enrollment records

---

## Testing Checklist

### Local Testing (Test Mode)
- [x] `MPESA_TEST_MODE=true` in `.env`
- [ ] Sign in with Google works
- [ ] Enter phone number (any format)
- [ ] Payment completes instantly
- [ ] Enrollment created
- [ ] Redirected to course player
- [ ] Can watch videos

### Production Testing
- [ ] `MPESA_TEST_MODE=false` in `.env`
- [ ] Real M-Pesa credentials configured
- [ ] Callback URL is publicly accessible
- [ ] Test with small amount (KES 10)
- [ ] STK Push appears on phone
- [ ] Enter M-Pesa PIN
- [ ] Payment completes
- [ ] Enrollment created
- [ ] Can access course

---

## Support

If you encounter issues:

1. **Check test script**: `php test_mpesa.php`
2. **Check logs**: `tail -f public/logs/mpesa_callbacks.log`
3. **Safaricom Support**: Email API-Support@safaricom.co.ke
4. **Daraja Documentation**: https://developer.safaricom.co.ke/APIs

---

## Summary

**Current**: Test mode enabled, all features work locally ✅
**Production**: Need real PayBill + production Daraja credentials
**Timeline**: Can deploy without M-Pesa, enable later when ready
