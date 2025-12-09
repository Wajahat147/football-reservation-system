# 🚀 Odoo Deployment Guide - Football Reservation System

## 📋 Pre-Deployment Checklist

### Files to Upload to Odoo:
- ✅ `index.html` - Homepage
- ✅ `grounds.html` - Browse grounds page
- ✅ `grounds.js` - Grounds functionality
- ✅ `booking.html` - Booking page
- ✅ `booking.js` - Booking functionality
- ✅ `owner-submit.html` - Ground submission page
- ✅ `owner-submit.js` - Submission functionality
- ✅ `admin.html` - Admin panel
- ✅ `admin.js` - Admin functionality
- ✅ `styles.css` - Main stylesheet
- ✅ `app.js` - Main app logic
- ✅ `supabase-config.js` - Database configuration
- ✅ `init-supabase.js` - Supabase initialization
- ✅ `otp-service.js` - OTP verification service
- ✅ `hero-bg.png` - Hero background image

### Files NOT to Upload:
- ❌ `.git` folder
- ❌ `.gitignore`
- ❌ `.vscode` folder
- ❌ `firebase-config.js` (not used)
- ❌ `schema.sql` and `schema-improved.sql` (already in Supabase)
- ❌ `start-server.bat` (local development only)
- ❌ `*.md` files (documentation)
- ❌ `styles-backup.css` and `styles-modern.css` (backups)

---

## 🎯 Step-by-Step Deployment on Odoo

### Step 1: Access Odoo Website Builder

1. Log in to your **Odoo account**
2. Go to **Website** app
3. Navigate to **Website → Configuration → Settings**

### Step 2: Enable Static File Hosting

1. In Odoo, go to **Website → Pages**
2. Create a new page or use existing structure
3. You'll need to upload files through Odoo's file manager

### Step 3: Upload HTML Files

#### Option A: Using Odoo Website Builder
1. Go to **Website → Pages → New**
2. For each HTML file:
   - Create a new page
   - Switch to **HTML/XML Editor** mode
   - Copy the content from your HTML files
   - Paste into Odoo's editor

#### Option B: Using Odoo File Manager (Recommended)
1. Go to **Website → Configuration → Media**
2. Upload all your files:
   - HTML files
   - CSS files
   - JavaScript files
   - Images

### Step 4: Upload CSS and JavaScript Files

1. Go to **Website → Configuration → Media**
2. Create folders for organization:
   ```
   /css/
   /js/
   /images/
   ```
3. Upload files to respective folders:
   - Upload `styles.css` to `/css/`
   - Upload all `.js` files to `/js/`
   - Upload `hero-bg.png` to `/images/`

### Step 5: Update File Paths in HTML

After uploading, you may need to update paths in your HTML files:

**Original paths:**
```html
<link rel="stylesheet" href="styles.css">
<script src="app.js"></script>
<img src="hero-bg.png">
```

**Update to Odoo paths:**
```html
<link rel="stylesheet" href="/web/content/css/styles.css">
<script src="/web/content/js/app.js"></script>
<img src="/web/content/images/hero-bg.png">
```

### Step 6: Configure Supabase CORS

1. Go to your **Supabase Dashboard**
2. Navigate to **Settings → API**
3. Under **URL Configuration**, add your Odoo domain:
   ```
   https://your-domain.odoo.com
   ```
4. Or use `*` for all domains (development only)

### Step 7: Test Your Deployment

1. Visit your Odoo website URL
2. Test all pages:
   - ✅ Homepage loads correctly
   - ✅ Browse Grounds page works
   - ✅ Booking system functions
   - ✅ Admin panel accessible
   - ✅ Ground submission works
3. Test Supabase connection:
   - Try viewing grounds
   - Test booking functionality
   - Verify admin operations

---

## 🔧 Alternative: Using Odoo's Static Website Module

If Odoo doesn't easily support custom HTML/CSS/JS, consider this approach:

### Method 1: Custom Module (Advanced)

Create a custom Odoo module:

1. Create module structure:
```
football_reservation/
├── __init__.py
├── __manifest__.py
├── controllers/
│   └── main.py
├── static/
│   ├── src/
│   │   ├── css/
│   │   │   └── styles.css
│   │   ├── js/
│   │   │   ├── app.js
│   │   │   ├── grounds.js
│   │   │   ├── booking.js
│   │   │   └── ...
│   │   └── img/
│   │       └── hero-bg.png
└── views/
    ├── index.xml
    ├── grounds.xml
    └── ...
```

2. Create `__manifest__.py`:
```python
{
    'name': 'Football Reservation System',
    'version': '1.0',
    'category': 'Website',
    'summary': 'Football Ground Booking System',
    'depends': ['website'],
    'data': [
        'views/index.xml',
        'views/grounds.xml',
        'views/booking.xml',
        'views/owner_submit.xml',
        'views/admin.xml',
    ],
    'assets': {
        'web.assets_frontend': [
            'football_reservation/static/src/css/styles.css',
            'football_reservation/static/src/js/*.js',
        ],
    },
    'installable': True,
    'application': True,
}
```

### Method 2: External Hosting + Odoo Integration (Easiest)

**Recommended if Odoo is complex:**

1. Host your static files on:
   - **GitHub Pages** (Free)
   - **Netlify** (Free)
   - **Vercel** (Free)
   
2. Embed in Odoo using iframe:
```html
<iframe src="https://your-site.github.io" width="100%" height="800px"></iframe>
```

---

## 🌐 Recommended: Deploy to GitHub Pages Instead

Since your project is pure HTML/CSS/JS, GitHub Pages might be easier:

### Quick GitHub Pages Setup:

1. **Push to GitHub:**
```bash
cd f:\football-reservation-system
git add .
git commit -m "Prepare for deployment"
git push origin main
```

2. **Enable GitHub Pages:**
   - Go to repository **Settings**
   - Scroll to **Pages**
   - Select **main** branch
   - Click **Save**

3. **Your site will be live at:**
```
https://your-username.github.io/football-reservation-system
```

---

## ⚙️ Odoo-Specific Configuration

### If Using Odoo Website Builder:

1. **Create Menu Items:**
   - Go to **Website → Configuration → Menus**
   - Add menu items for:
     - Home
     - Browse Grounds
     - List Your Ground
     - Admin

2. **Set Homepage:**
   - Go to **Website → Configuration → Settings**
   - Set your `index.html` as homepage

3. **Configure SEO:**
   - Add meta tags
   - Set page titles
   - Configure URLs

---

## 🔒 Security Checklist

Before going live:

- ✅ Verify Supabase RLS (Row Level Security) is enabled
- ✅ Check that only public API key is in code
- ✅ Test all forms for validation
- ✅ Ensure HTTPS is enabled on Odoo
- ✅ Test booking flow end-to-end
- ✅ Verify admin authentication works

---

## 📞 Need Help?

If you encounter issues:

1. **Odoo Documentation:** https://www.odoo.com/documentation
2. **Supabase CORS Issues:** Check Supabase dashboard settings
3. **File Upload Issues:** Use Odoo's media manager
4. **Path Issues:** Verify all file paths are correct

---

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Test all pages
2. ✅ Verify database connections
3. ✅ Test booking flow
4. ✅ Check mobile responsiveness
5. ✅ Monitor Supabase usage
6. ✅ Set up analytics (optional)

---

## 💡 Pro Tip

If Odoo proves too complex for static file hosting, I **strongly recommend** using:
- **Netlify** (Easiest, drag & drop)
- **Vercel** (Great for JS projects)
- **GitHub Pages** (Free, simple)

All three are FREE and much simpler for static websites!
