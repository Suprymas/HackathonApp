# Supabase Backend Setup Guide

## 📊 Data Storage Locations

Based on the code in `ProfileSettingsScreen.js`, user data is saved to the following locations:

### 1. **User Information** → `profiles` table
- `username` - Username
- `bio` - User bio
- `avatar_url` - Avatar URL (points to image in Storage)
- `id` - User ID (linked to `auth.users` table)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### 2. **Photos** → Supabase Storage
- Bucket name: `avatars`
- File path format: `{userId}_{timestamp}.{ext}`
- Returns public URL after upload, saved in `profiles.avatar_url`

### 3. **Email** → Supabase Auth
- Email is stored in `auth.users` table
- Not saved in `profiles` table (can be retrieved from Auth)

## 🔄 Data Flow

```
User Operation Flow:
1. User selects photo → uploadImage() → Upload to Storage 'avatars' bucket → Returns public URL
2. User fills username, bio → handleSave() → Update profiles table
3. After successful save, data is stored in:
   - profiles table: username, bio, avatar_url
   - Storage: actual image file
```

## 🛠️ Backend Setup Steps

### Step 1: Execute SQL Script

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Copy all SQL statements from `supabase-setup.sql` file
5. Paste into SQL Editor and execute

This script will:
- ✅ Create `profiles` table
- ✅ Enable Row Level Security (RLS)
- ✅ Create RLS policies (users can only modify their own data)
- ✅ Create trigger (auto-create profile on user registration)
- ✅ Create auto-update timestamp trigger

### Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Check (allow public access)
4. Click **Create bucket**

### Step 3: Set Up Storage Policies

1. In Storage page, click on `avatars` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Use the following policies (or execute directly in SQL Editor):

#### Policy 1: Allow users to upload their own avatar
```sql
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: Allow users to update their own avatar
```sql
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 3: Allow users to delete their own avatar
```sql
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 4: Allow anyone to view avatars (public access)
```sql
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

### Step 4: Verify Setup

Execute the following SQL queries to verify:

```sql
-- Check if table exists
SELECT * FROM public.profiles LIMIT 1;

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Check if triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'profiles';
```

## 🔍 Data Flow in Code Explained

### Save Flow (ProfileSettingsScreen.js)

```javascript
// 1. Upload photo to Storage
if (avatarUri && avatarUri !== user?.avatar_url && !avatarUri.startsWith('http')) {
  avatarUrl = await uploadImage(avatarUri, 'avatars', authUser.id);
  // uploadImage function:
  // - Reads local image file
  // - Uploads to Supabase Storage 'avatars' bucket
  // - Returns public access URL
}

// 2. Update profiles table
await supabase
  .from('profiles')
  .update({
    username: username.trim(),
    bio: bio.trim(),
    avatar_url: avatarUrl,  // URL returned from Storage
    updated_at: new Date().toISOString(),
  })
  .eq('id', authUser.id);
```

### Read Flow

```javascript
// 1. Get user information from profiles table
const { data: profileData } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', authUser.id)
  .single();

// 2. avatar_url points to image in Storage
// Can be used directly in <Image> component
<Image source={{ uri: profileData.avatar_url }} />
```

## ⚠️ Important Notes

1. **Environment Variables Configuration**
   - Ensure `.env` file is configured with:
     ```
     EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
     EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

2. **Permission Issues**
   - If upload fails, check Storage bucket permission settings
   - Ensure RLS policies are correctly configured

3. **User Registration**
   - Trigger will automatically create profile for new users
   - If user exists but has no profile, need to manually create or modify code

4. **Image Size Limits**
   - Supabase Storage has default file size limits
   - Recommend compressing images on client side (code already sets quality: 0.8)

## 🐛 Common Issues

### Q: Getting "permission denied" when saving
**A:** Check if RLS policies are correctly set up, ensure user has permission to update their own profile

### Q: Image upload fails
**A:** 
- Check if Storage bucket exists and is public
- Check if Storage policies are correct
- Check network connection

### Q: User has no profile after registration
**A:** 
- Check if trigger was created successfully
- Can manually execute SQL to create:
  ```sql
  INSERT INTO public.profiles (id, username)
  VALUES (auth.uid(), 'user_' || substr(auth.uid()::text, 1, 8));
  ```

## 📝 Summary

After completing the above setup, the data flow is as follows:

1. **User Registration** → Trigger automatically creates `profiles` record
2. **User Edits Profile** → Upload image to Storage → Update `profiles` table
3. **Other Pages Read** → Read data from `profiles` table → Use `avatar_url` to display image

All data is stored in Supabase, with security guaranteed through RLS policies.

