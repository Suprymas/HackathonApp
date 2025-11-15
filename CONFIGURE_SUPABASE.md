# How to Configure Supabase Backend

This guide will walk you through setting up your Supabase backend step by step.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com) if you don't have one)
- Your React Native/Expo project (already set up)

## Step 1: Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: Your project name (e.g., "HackathonApp")
   - **Database Password**: Create a strong password (save it securely)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for the project to be created

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon in the left sidebar)
2. Click **API** in the settings menu
3. You'll see:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)
4. Copy both values - you'll need them in the next step

## Step 3: Configure Environment Variables

1. In your project root directory, create a `.env` file:
   ```bash
   touch .env
   ```

2. Add your Supabase credentials to `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

   Replace:
   - `your_project_url_here` with your Project URL from Step 2
   - `your_anon_key_here` with your anon/public key from Step 2

   Example:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
   ```

3. **Important**: Add `.env` to your `.gitignore` file to keep your keys secure:
   ```bash
   echo ".env" >> .gitignore
   ```

## Step 4: Set Up Database Tables

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the `supabase-setup.sql` file from your project
4. Copy **ALL** the SQL code from that file
5. Paste it into the SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned" - this means it worked!

This creates:
- ✅ `profiles` table
- ✅ Row Level Security (RLS) policies
- ✅ Auto-create profile trigger on user registration
- ✅ Auto-update timestamp trigger

## Step 5: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **"New bucket"**
3. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ **Check this box** (important!)
4. Click **"Create bucket"**

## Step 6: Set Up Storage Policies

1. In Storage, click on the `avatars` bucket you just created
2. Go to the **"Policies"** tab
3. Click **"New Policy"**
4. For each policy below, click **"New Policy"** and use the template:

### Policy 1: Allow users to upload avatars
- **Policy name**: `Users can upload their own avatar`
- **Allowed operation**: `INSERT`
- **Policy definition**: 
  ```sql
  (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  ```

### Policy 2: Allow users to update avatars
- **Policy name**: `Users can update their own avatar`
- **Allowed operation**: `UPDATE`
- **Policy definition**:
  ```sql
  (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  ```

### Policy 3: Allow users to delete avatars
- **Policy name**: `Users can delete their own avatar`
- **Allowed operation**: `DELETE`
- **Policy definition**:
  ```sql
  (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
  ```

### Policy 4: Allow public viewing
- **Policy name**: `Anyone can view avatars`
- **Allowed operation**: `SELECT`
- **Policy definition**:
  ```sql
  (bucket_id = 'avatars')
  ```

**Alternative**: You can also execute these policies directly in SQL Editor:
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

## Step 7: Verify Setup

### Test Database
1. Go to **SQL Editor** in Supabase
2. Run this query:
   ```sql
   SELECT * FROM public.profiles LIMIT 1;
   ```
   Should return empty result (no error = success!)

3. Check RLS is enabled:
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public' AND tablename = 'profiles';
   ```
   Should show `rowsecurity = true`

### Test Storage
1. Go to **Storage** → `avatars` bucket
2. You should see the bucket exists and is marked as "Public"

## Step 8: Restart Your App

1. Stop your Expo development server (Ctrl+C)
2. Restart it:
   ```bash
   npm start
   ```
   or
   ```bash
   expo start
   ```

3. The app will now use your Supabase backend!

## Testing the Setup

1. **Test Registration**:
   - Try signing up a new user
   - Check in Supabase Dashboard → **Authentication** → **Users** - you should see the new user
   - Check **Table Editor** → `profiles` - a profile should be automatically created

2. **Test Profile Update**:
   - Log in and go to Profile Settings
   - Update username, bio, and upload an avatar
   - Check `profiles` table - data should be updated
   - Check Storage → `avatars` bucket - image should be uploaded

## Troubleshooting

### "Invalid API key" error
- Check your `.env` file has the correct values
- Make sure you're using the **anon/public** key, not the service_role key
- Restart your Expo server after changing `.env`

### "permission denied" when saving profile
- Check RLS policies are created (Step 4)
- Verify the user is logged in

### Image upload fails
- Check Storage bucket `avatars` exists and is public
- Check Storage policies are set up (Step 6)
- Check network connection

### User has no profile after registration
- Check the trigger was created (Step 4)
- You can manually create a profile in SQL Editor:
  ```sql
  INSERT INTO public.profiles (id, username)
  VALUES ('user-uuid-here', 'username');
  ```

## Next Steps

Your Supabase backend is now configured! The app can:
- ✅ Register and authenticate users
- ✅ Store user profiles (username, bio, avatar)
- ✅ Upload and store images
- ✅ Read user data securely

For more details, see `SUPABASE_SETUP.md` in your project.

