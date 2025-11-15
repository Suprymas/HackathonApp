# Quick Start: Configure Supabase Backend

Follow these steps to get your Supabase backend up and running:

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project (if you don't have one)

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `HackathonApp` (or any name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** and wait 2-3 minutes

### 2. Get Your API Keys

1. In Supabase Dashboard → **Settings** (⚙️ icon) → **API**
2. Copy these two values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public key** (starts with `eyJ...`)

### 3. Create `.env` File

In your project root, create a `.env` file:

```bash
# In terminal, from project root:
touch .env
```

Then add your credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Replace with your actual values from Step 2!**

### 4. Set Up Database

1. In Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Open `supabase-setup.sql` from your project
4. Copy **ALL** the SQL code
5. Paste into SQL Editor
6. Click **"Run"** (or Cmd/Ctrl + Enter)

✅ This creates the `profiles` table and security policies

### 5. Create Storage Bucket

1. In Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. Set:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **Check this!**
4. Click **"Create bucket"**

### 6. Set Storage Policies

1. Click on the `avatars` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"** 4 times, using these:

**Policy 1 - Upload:**
- Name: `Users can upload their own avatar`
- Operation: `INSERT`
- Definition: `(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])`

**Policy 2 - Update:**
- Name: `Users can update their own avatar`
- Operation: `UPDATE`
- Definition: `(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])`

**Policy 3 - Delete:**
- Name: `Users can delete their own avatar`
- Operation: `DELETE`
- Definition: `(bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])`

**Policy 4 - View:**
- Name: `Anyone can view avatars`
- Operation: `SELECT`
- Definition: `(bucket_id = 'avatars')`

**OR** execute this in SQL Editor (easier):

```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

### 7. Restart Your App

```bash
# Stop current server (Ctrl+C), then:
npm start
# or
expo start
```

## ✅ Verify It Works

1. **Test Registration:**
   - Sign up a new user in your app
   - Check Supabase Dashboard → **Authentication** → **Users** (should see new user)
   - Check **Table Editor** → `profiles` (should see auto-created profile)

2. **Test Profile Update:**
   - Log in and go to Profile Settings
   - Update username, bio, upload avatar
   - Check `profiles` table - data should update
   - Check Storage → `avatars` - image should appear

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Check `.env` file has correct values, restart app |
| "permission denied" | Run SQL setup script again (Step 4) |
| Image upload fails | Make sure `avatars` bucket is **public** (Step 5) |
| No profile after signup | Check trigger was created (Step 4) |

## 📚 More Details

- Full guide: `CONFIGURE_SUPABASE.md`
- Technical details: `SUPABASE_SETUP.md`

---

**That's it! Your backend is ready.** 🎉

