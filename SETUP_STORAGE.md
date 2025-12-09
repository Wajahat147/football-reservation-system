# 📂 SETUP SUPABASE STORAGE FOR PAYMENT PROOFS

To allow users to upload payment screenshots, you need to create a **Storage Bucket** in your Supabase dashboard.

---

## 🚀 STEP-BY-STEP INSTRUCTIONS:

### **1. Go to Supabase Storage**
1. Login to https://supabase.com
2. Select your project
3. Click on the **"Storage"** icon (folder icon) in the left sidebar

### **2. Create a New Bucket**
1. Click **"New Bucket"**
2. Enter the name: **payment-proofs** (Must be exact!)
3. Toggle **"Public bucket"** to **ON** 🟢
4. Click **"Save"** or **"Create bucket"**

### **3. Set Configurations**
1. Click on the three dots `...` next to your new bucket
2. Click **"Configuration"** (if available) or check the settings
3. Ensure **"Public bucket"** is enabled

---

## 🛡️ IMPORTANT: STORAGE POLICIES

For uploads to work securely, you need to add a "Policy" to allow uploads.

### **Option A: Allow Public Uploads (Easiest)**
1. In the **Storage** page, click **"Policies"** tab
2. Under "payment-proofs", click **"New policy"**
3. Choose **"For full customization"**
4. Enter name: **"Allow Public Uploads"**
5. For **"Allowed operations"**, check:
   - ✅ SELECT
   - ✅ INSERT
   - ✅ UPDATE
6. Click **"Review"** -> **"Save policy"**

### **Option B: Run SQL (Advanced)**
You can try running this in SQL Editor (may require admin privileges):

```sql
insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', true);

create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'payment-proofs' );

create policy "Public Upload"
on storage.objects for insert
with check ( bucket_id = 'payment-proofs' );
```

---

## ✨ THAT'S IT!

Once the bucket `payment-proofs` is created and public access is allowed, the image upload feature will work instantly! 📸
