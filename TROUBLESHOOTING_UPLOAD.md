# Troubleshooting Avatar Upload Issues

## Common Error: "StorageApiError" or "Failed to upload avatar image"

### Quick Fix Checklist

1. ✅ **Check if `avatars` bucket exists**
   - Go to Supabase Dashboard → Storage
   - Look for `avatars` bucket
   - If missing, create it (make it **Public**)

2. ✅ **Check Storage Policies**
   - Go to Storage → `avatars` → Policies tab
   - You should see 4 policies
   - If missing, run `storage-policies-fix.sql` in SQL Editor

3. ✅ **Verify bucket is Public**
   - Storage → `avatars` bucket
   - Should show "Public" badge
   - If not, edit bucket and check "Public bucket"

4. ✅ **Check `.env` file**
   - Make sure `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are set
   - Restart Expo server after changing `.env`

## Step-by-Step Fix

### Step 1: Create/Verify Storage Bucket

1. Go to Supabase Dashboard → **Storage**
2. If `avatars` bucket doesn't exist:
   - Click **"New bucket"**
   - Name: `avatars`
   - ✅ Check **"Public bucket"**
   - Click **"Create bucket"**

### Step 2: Fix Storage Policies

1. Go to Supabase Dashboard → **SQL Editor**
2. Open `storage-policies-fix.sql` from your project
3. Copy and paste all SQL into SQL Editor
4. Click **"Run"**
5. You should see "Success" message

### Step 3: Verify Policies

1. Go to Storage → `avatars` → **Policies** tab
2. You should see 4 policies:
   - ✅ Users can upload their own avatar
   - ✅ Users can update their own avatar
   - ✅ Users can delete their own avatar
   - ✅ Anyone can view avatars

### Step 4: Restart Your App

```bash
# Stop Expo server (Ctrl+C)
# Then restart:
npm start
# or
expo start
```

## Test Upload

1. Open your app
2. Go to Profile Settings
3. Try uploading an avatar
4. Check console logs for detailed error messages

## Common Error Messages

### "new row violates row-level security policy"
- **Problem:** Storage policies not set up correctly
- **Solution:** Run `storage-policies-fix.sql`

### "Bucket not found"
- **Problem:** `avatars` bucket doesn't exist
- **Solution:** Create bucket in Storage (make it public)

### "Invalid API key"
- **Problem:** `.env` file missing or incorrect
- **Solution:** Check `.env` file and restart Expo

### "Permission denied"
- **Problem:** User not authenticated or policies too restrictive
- **Solution:** 
  1. Make sure user is logged in
  2. Run `storage-policies-fix.sql` to fix policies

## File Path Format

The updated code uses folder structure:
- **Format:** `{userId}/{timestamp}.{ext}`
- **Example:** `eb85a5cb-1234-5678-90ab-cdef12345678/1699123456789.jpg`

This matches the Storage policies that check `(storage.foldername(name))[1]`.

## Still Not Working?

1. **Check Console Logs:**
   - Look for detailed error messages
   - Check if `uploadImage` function is being called
   - Verify file path format

2. **Test in Supabase Dashboard:**
   - Go to Storage → `avatars`
   - Try manually uploading a file
   - If this fails, bucket configuration is wrong

3. **Verify Authentication:**
   - Make sure user is logged in
   - Check Supabase Dashboard → Authentication → Users

4. **Check Network:**
   - Ensure device has internet connection
   - Try on different network

