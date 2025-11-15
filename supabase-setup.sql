-- ============================================
-- Supabase Backend Setup Guide
-- ============================================
-- Execute the following SQL statements in Supabase Dashboard SQL Editor
--
-- NOTE: Supabase may show a warning about "destructive operations" because
-- this script contains DROP TRIGGER statements. This is SAFE - the DROP
-- statements use "IF EXISTS" which means they only run if the triggers
-- already exist. This ensures the script can be run multiple times safely.
-- You can safely click "Run this query" when you see the warning.

-- ============================================
-- 1. Create profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- 2. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Create RLS policies
-- ============================================

-- Users can view all public profiles (for viewing other users' information)
CREATE POLICY "Users can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- ============================================
-- 4. Create trigger: Auto-create profile on user registration
-- ============================================
-- This function will automatically create an empty profile when a new user registers
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, created_at, updated_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger (safe: IF EXISTS prevents errors if trigger doesn't exist)
-- Note: Supabase may warn about DROP, but this is safe - it only removes the trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. Create auto-update trigger for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (safe: IF EXISTS prevents errors if trigger doesn't exist)
-- Note: Supabase may warn about DROP, but this is safe - it only removes the trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 6. Storage Bucket Setup (Manual operation in Supabase Dashboard)
-- ============================================
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Create a new bucket named "avatars"
-- 3. Set it as a Public bucket (public access)
-- 4. Set up the following policies:

-- Storage Policy SQL (Execute in Storage -> Policies):
-- 
-- Policy 1: Allow users to upload their own avatar
-- CREATE POLICY "Users can upload their own avatar"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'avatars' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
--
-- Policy 2: Allow users to update their own avatar
-- CREATE POLICY "Users can update their own avatar"
-- ON storage.objects FOR UPDATE
-- USING (
--   bucket_id = 'avatars' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
--
-- Policy 3: Allow users to delete their own avatar
-- CREATE POLICY "Users can delete their own avatar"
-- ON storage.objects FOR DELETE
-- USING (
--   bucket_id = 'avatars' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
--
-- Policy 4: Allow anyone to view avatars (since bucket is public)
-- CREATE POLICY "Anyone can view avatars"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'avatars');

-- ============================================
-- 7. Verify setup
-- ============================================
-- Execute the following queries to verify the table was created successfully:
-- SELECT * FROM public.profiles LIMIT 1;

-- Check if RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles';

