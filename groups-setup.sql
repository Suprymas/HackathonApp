-- ============================================
-- Groups and Friends Database Setup
-- ============================================
-- Execute the following SQL statements in Supabase Dashboard SQL Editor
--
-- This script creates tables for:
-- 1. Friends relationships
-- 2. Groups
-- 3. Group members

-- ============================================
-- 1. Create friends table
-- ============================================
CREATE TABLE IF NOT EXISTS public.friends (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  friend_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, friend_id)
);

-- ============================================
-- 2. Create groups table
-- ============================================
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- 3. Create group_members table
-- ============================================
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(group_id, user_id)
);

-- ============================================
-- 4. Enable Row Level Security (RLS)
-- ============================================
ALTER TABLE public.friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. Create RLS policies for friends table
-- ============================================

-- Users can view their own friendships
CREATE POLICY "Users can view their own friendships"
  ON public.friends
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can insert their own friend requests
CREATE POLICY "Users can insert their own friend requests"
  ON public.friends
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own friend requests or accept requests sent to them
CREATE POLICY "Users can update their own friendships"
  ON public.friends
  FOR UPDATE
  USING (auth.uid() = user_id OR auth.uid() = friend_id)
  WITH CHECK (auth.uid() = user_id OR auth.uid() = friend_id);

-- Users can delete their own friendships
CREATE POLICY "Users can delete their own friendships"
  ON public.friends
  FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================
-- 6. Create RLS policies for groups table
-- ============================================

-- Users can view all groups (or groups they're members of)
CREATE POLICY "Users can view all groups"
  ON public.groups
  FOR SELECT
  USING (true);

-- Users can create groups
CREATE POLICY "Users can create groups"
  ON public.groups
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Users can update groups they created
CREATE POLICY "Users can update groups they created"
  ON public.groups
  FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Users can delete groups they created
CREATE POLICY "Users can delete groups they created"
  ON public.groups
  FOR DELETE
  USING (auth.uid() = created_by);

-- ============================================
-- 7. Create RLS policies for group_members table
-- ============================================

-- Users can view members of groups
CREATE POLICY "Users can view group members"
  ON public.group_members
  FOR SELECT
  USING (true);

-- Users can add themselves to groups (or group creators can add members)
CREATE POLICY "Users can add group members"
  ON public.group_members
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
  );

-- Group creators can update member roles
CREATE POLICY "Group creators can update members"
  ON public.group_members
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
  );

-- Users can leave groups, or group creators can remove members
CREATE POLICY "Users can remove group members"
  ON public.group_members
  FOR DELETE
  USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
  );

-- ============================================
-- 8. Create auto-update triggers for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_friends_updated_at ON public.friends;
CREATE TRIGGER set_friends_updated_at
  BEFORE UPDATE ON public.friends
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_groups_updated_at ON public.groups;
CREATE TRIGGER set_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- 9. Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON public.friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON public.friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON public.friends(status);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON public.group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON public.groups(created_by);

-- ============================================
-- 10. Storage Bucket Setup for Group Images
-- ============================================
-- 1. Go to Supabase Dashboard -> Storage
-- 2. Create a new bucket named "group-images"
-- 3. Set it as a Public bucket (public access)
-- 4. Set up the following policies:

-- Storage Policy SQL (Execute in Storage -> Policies):
-- 
-- Policy 1: Allow users to upload group images
-- CREATE POLICY "Users can upload group images"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'group-images' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
--
-- Policy 2: Allow users to update group images
-- CREATE POLICY "Users can update group images"
-- ON storage.objects FOR UPDATE
-- USING (
--   bucket_id = 'group-images' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
--
-- Policy 3: Allow users to delete group images
-- CREATE POLICY "Users can delete group images"
-- ON storage.objects FOR DELETE
-- USING (
--   bucket_id = 'group-images' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );
--
-- Policy 4: Allow anyone to view group images (since bucket is public)
-- CREATE POLICY "Anyone can view group images"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'group-images');

-- ============================================
-- 11. Verify setup
-- ============================================
-- Execute the following queries to verify the tables were created successfully:
-- SELECT * FROM public.friends LIMIT 1;
-- SELECT * FROM public.groups LIMIT 1;
-- SELECT * FROM public.group_members LIMIT 1;

-- Check if RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables 
-- WHERE schemaname = 'public' AND tablename IN ('friends', 'groups', 'group_members');

