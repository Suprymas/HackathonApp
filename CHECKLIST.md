# Setup Checklist - Is Everything Ready?

Use this checklist to verify that your ProfileSettingsScreen can save data.

## ✅ Frontend Code Status

- [x] **ProfileSettingsScreen.js** - Complete and ready
  - ✅ Loads user profile from Supabase
  - ✅ Uploads avatar images
  - ✅ Saves username, bio, avatar_url
  - ✅ Error handling implemented

- [x] **Supabase.js** - Service file ready
  - ✅ Supabase client configured
  - ✅ uploadImage function implemented

- [x] **App.js** - Authentication ready
  - ✅ Auth state management
  - ✅ Session handling

## ⚠️ Backend Configuration (You Need to Complete)

### Step 1: Supabase Project
- [ ] Created Supabase project at [app.supabase.com](https://app.supabase.com)
- [ ] Project is active and running

### Step 2: Environment Variables
- [ ] Created `.env` file in project root
- [ ] Added `EXPO_PUBLIC_SUPABASE_URL` (your project URL)
- [ ] Added `EXPO_PUBLIC_SUPABASE_ANON_KEY` (your anon key)
- [ ] Restarted Expo server after creating `.env`

**To check:** Look for `.env` file in your project root. If it doesn't exist, create it!

### Step 3: Database Setup
- [ ] Executed `supabase-setup.sql` in Supabase SQL Editor
- [ ] `profiles` table created successfully
- [ ] RLS policies created
- [ ] Triggers created

**To verify:** Run this in Supabase SQL Editor:
```sql
SELECT * FROM public.profiles LIMIT 1;
```
Should return empty result (no error = success!)

### Step 4: Storage Bucket
- [ ] Created `avatars` bucket in Storage
- [ ] Bucket is set to **Public**
- [ ] Storage policies created (4 policies)

**To verify:** Go to Storage → `avatars` bucket should exist and be marked "Public"

### Step 5: App Restart
- [ ] Stopped Expo server
- [ ] Restarted with `npm start` or `expo start`

## 🧪 Test It Now!

1. **Test Registration:**
   - Sign up a new user in your app
   - Check Supabase Dashboard → Authentication → Users (should see new user)
   - Check Table Editor → `profiles` (should see auto-created profile)

2. **Test Profile Settings:**
   - Log in to your app
   - Go to Profile Settings
   - Update username, bio
   - Upload an avatar
   - Click "Save Changes"
   - ✅ Should see "Profile updated successfully!" alert
   - Check Supabase Dashboard → `profiles` table (data should be updated)
   - Check Storage → `avatars` bucket (image should appear)

## 🐛 If It's Not Working

### Error: "Invalid API key" or connection fails
- ❌ **Problem:** `.env` file missing or incorrect
- ✅ **Solution:** 
  1. Create `.env` file in project root
  2. Add your Supabase URL and key
  3. Restart Expo server

### Error: "permission denied" when saving
- ❌ **Problem:** RLS policies not set up
- ✅ **Solution:** Run `supabase-setup.sql` again in SQL Editor

### Error: Image upload fails
- ❌ **Problem:** Storage bucket or policies not set up
- ✅ **Solution:** 
  1. Create `avatars` bucket (make it public)
  2. Add 4 storage policies (see QUICK_START.md)

### Error: "relation 'profiles' does not exist"
- ❌ **Problem:** Database table not created
- ✅ **Solution:** Run `supabase-setup.sql` in SQL Editor

## 📝 Summary

**Frontend:** ✅ **READY** - All code is complete

**Backend:** ⚠️ **YOU NEED TO CONFIGURE:**
1. Create Supabase project
2. Add `.env` file with credentials
3. Run SQL setup script
4. Create Storage bucket
5. Set Storage policies
6. Restart app

Once you complete the backend steps above, everything will work! 🎉

