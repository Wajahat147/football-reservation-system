# 🏟️ HOW TO ADD SAMPLE GROUNDS TO YOUR DATABASE

I've created **20 realistic ground listings** for you across major Pakistani cities!

---

## 📊 GROUNDS INCLUDED:

### **Islamabad (4 grounds):**
- Islamabad Club - Futsal Arena (F-7)
- Capital Sports Complex (F-10)
- Blue Area Football Ground
- I-14 Community Ground

### **Rawalpindi (3 grounds):**
- Rawalpindi Sports Arena (Saddar)
- Bahria Town Football Complex
- Satellite Town Ground

### **Lahore (4 grounds):**
- DHA Sports Complex
- Gulberg Football Arena
- Johar Town Sports Ground
- Model Town Football Club

### **Karachi (4 grounds):**
- Clifton Sports Arena
- DHA Karachi Football Ground
- Gulshan-e-Iqbal Ground
- Bahria Town Karachi Arena

### **Faisalabad (2 grounds):**
- Faisalabad Sports Complex
- Lyallpur Football Ground

### **Multan (2 grounds):**
- Multan Cricket Stadium - Football Arena
- Cantt Football Ground

### **Peshawar (2 grounds):**
- Peshawar Sports Arena
- University Town Ground

---

## 🚀 HOW TO ADD THEM:

### **Step 1: Open Supabase**
1. Go to: https://supabase.com
2. Login to your account
3. Select your project

### **Step 2: Open SQL Editor**
1. Click **"SQL Editor"** in left sidebar
2. Click **"New query"**

### **Step 3: Copy & Paste**
1. Open the file: `sample-grounds.sql`
2. Copy ALL the content
3. Paste into Supabase SQL Editor

### **Step 4: Run the Script**
1. Click **"Run"** button (or press Ctrl+Enter)
2. Wait for completion
3. You should see: "Success. No rows returned"

### **Step 5: Verify**
Run this query to check:
```sql
SELECT COUNT(*) FROM grounds WHERE status = 'verified';
```

You should see **20** grounds!

---

## ✅ WHAT'S INCLUDED IN EACH GROUND:

- ✅ Ground Name
- ✅ Location (specific area)
- ✅ City
- ✅ Ground Type (Futsal, 5-a-side, 7-a-side, 11-a-side)
- ✅ Price Per Hour (PKR 4,000 - 15,000)
- ✅ Owner Name
- ✅ Owner Email
- ✅ Owner Phone
- ✅ Facilities (Floodlights, Parking, etc.)
- ✅ Status: "verified" (pre-approved)
- ✅ Rating (4.2 - 4.9 stars)

---

## 🎯 AFTER ADDING:

### **Grounds will appear:**
1. ✅ On "Browse Grounds" page
2. ✅ Available for booking immediately
3. ✅ In admin "Verified Grounds" tab
4. ✅ Searchable by city/type

### **Users can:**
1. ✅ View all ground details
2. ✅ See prices and facilities
3. ✅ Book time slots
4. ✅ See ratings

---

## 📝 CUSTOMIZATION:

### **To modify grounds:**
1. Edit `sample-grounds.sql` file
2. Change names, prices, locations
3. Run updated script in Supabase

### **To add more grounds:**
1. Copy one of the existing entries
2. Modify the details
3. Add to the SQL file
4. Run in Supabase

---

## 💡 TIPS:

- **Prices vary by type:**
  - Futsal: PKR 4,000 - 6,500
  - 5-a-side: PKR 4,000 - 5,000
  - 7-a-side: PKR 6,000 - 8,500
  - 11-a-side: PKR 10,000 - 15,000

- **All grounds have:**
  - Realistic locations in Pakistan
  - Common facilities
  - Good ratings (4.2+)
  - Professional owner details

- **Status is "verified":**
  - Grounds appear immediately
  - No admin approval needed
  - Ready for booking

---

## 🔧 TROUBLESHOOTING:

### **If you get an error:**
1. Check if `grounds` table exists
2. Verify column names match
3. Make sure you're connected to correct database

### **If grounds don't appear:**
1. Hard refresh website (Ctrl+Shift+R)
2. Check Supabase table browser
3. Verify status = 'verified'

---

## 🎉 RESULT:

After running the script, your website will have:
- ✅ 20 professional ground listings
- ✅ Across 7 major cities
- ✅ 4 different ground types
- ✅ Ready for immediate booking
- ✅ Realistic prices and facilities

---

**Just run the SQL script in Supabase and you're done!** 🚀
