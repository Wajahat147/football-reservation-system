# 📧 Email OTP Setup Guide

## Current Status
Your OTP system is working but showing OTPs on the website instead of sending actual emails. To send real emails, you need to set up an email service.

## 🎯 Recommended Solution: EmailJS (FREE & Easy)

EmailJS is the easiest way to send emails from your website without a backend server.

### Step 1: Sign Up for EmailJS

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Click **"Sign Up Free"**
3. Create an account (100 emails/month free)

### Step 2: Add Email Service

1. After logging in, go to **"Email Services"**
2. Click **"Add New Service"**
3. Choose your email provider:
   - **Gmail** (easiest)
   - Outlook
   - Yahoo
   - Or any other
4. Connect your email account
5. Copy the **Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template

1. Go to **"Email Templates"**
2. Click **"Create New Template"**
3. Use this template:

**Subject:**
```
Your OTP Code - Football Reservation System
```

**Body:**
```html
Hello,

Your OTP code for {{purpose}} is:

{{otp_code}}

This code will expire in {{expiry_minutes}} minutes.

If you didn't request this code, please ignore this email.

Best regards,
Football Reservation System
```

4. Save the template
5. Copy the **Template ID** (e.g., `template_xyz789`)

### Step 4: Get Your Public Key

1. Go to **"Account"** → **"General"**
2. Find your **Public Key** (e.g., `abc123XYZ`)
3. Copy it

### Step 5: Update Your Code

1. Open `index.html`, `booking.html`, and `owner-submit.html`
2. Add EmailJS script in the `<head>` section (before closing `</head>`):

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
<script>
    emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual public key
</script>
```

3. Open `otp-service.js`
4. Find the commented section (around line 62)
5. Uncomment and update:

```javascript
// OPTION 1: Using EmailJS (Recommended - Free & Easy)
try {
    const serviceID = 'service_abc123'; // Your Service ID
    const templateID = 'template_xyz789'; // Your Template ID
    const publicKey = 'abc123XYZ'; // Your Public Key (already initialized in HTML)

    const templateParams = {
        to_email: email,
        otp_code: otp,
        purpose: purposeText,
        expiry_minutes: this.OTP_EXPIRY_MINUTES
    };

    await emailjs.send(serviceID, templateID, templateParams);
    return true;
} catch (error) {
    console.error('EmailJS error:', error);
    throw error;
}
```

6. Comment out or remove the temporary notification code (lines 90-150)

### Step 6: Test

1. Go to your booking or owner-submit page
2. Enter an email address
3. Click "Send OTP"
4. Check your email inbox!

---

## 🔧 Alternative: Supabase Edge Functions (More Advanced)

If you want more control, you can use Supabase Edge Functions:

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Create Edge Function

```bash
supabase functions new send-otp-email
```

### Step 3: Write Function Code

In `supabase/functions/send-otp-email/index.ts`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const { email, otp, purpose, expiryMinutes } = await req.json()

  // Use Resend, SendGrid, or any email service
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'noreply@yourdomain.com',
      to: email,
      subject: 'Your OTP Code',
      html: `Your OTP for ${purpose} is: <strong>${otp}</strong><br>Valid for ${expiryMinutes} minutes.`
    })
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Step 4: Deploy

```bash
supabase functions deploy send-otp-email
```

### Step 5: Update Code

In `otp-service.js`, uncomment OPTION 2 and use it.

---

## 📊 Comparison

| Feature | EmailJS | Supabase Edge Functions |
|---------|---------|------------------------|
| Setup Time | 5 minutes | 30+ minutes |
| Free Tier | 100 emails/month | Unlimited |
| Difficulty | Easy | Advanced |
| Backend Needed | No | Yes |
| Recommended For | Quick setup | Production apps |

---

## 🎯 Quick Start (Recommended)

**For now, use EmailJS:**
1. Takes only 5 minutes
2. No backend needed
3. 100 free emails/month is enough for testing
4. Can upgrade later if needed

**Your current setup:**
- OTP shows on screen (works for testing)
- To send real emails, follow EmailJS steps above
- Takes 5 minutes to set up!

---

## 📞 Need Help?

If you get stuck:
1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Make sure you've added the EmailJS script to your HTML
3. Verify your Service ID, Template ID, and Public Key are correct
4. Check browser console for errors

---

## ✅ After Setup

Once EmailJS is configured:
1. OTPs will be sent to actual email addresses
2. Remove the on-screen notification
3. Users will receive professional emails
4. System is ready for production!
