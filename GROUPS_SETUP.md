# Groups Feature Setup Guide

## 📋 Overview

This guide explains how to set up the Groups feature, which allows users to create groups and add friends to them.

## 🗄️ Database Setup

### Step 1: Execute SQL Script

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Copy all SQL statements from `groups-setup.sql` file
5. Paste into SQL Editor and execute

This script will create:
- ✅ `friends` table - Stores friend relationships
- ✅ `groups` table - Stores group information
- ✅ `group_members` table - Stores group membership
- ✅ Row Level Security (RLS) policies
- ✅ Auto-update triggers for timestamps
- ✅ Indexes for better performance

### Step 2: Create Storage Bucket for Group Images

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Configure:
   - **Name**: `group-images`
   - **Public bucket**: ✅ Check (allow public access)
4. Click **Create bucket**

### Step 3: Set Up Storage Policies

1. In Storage page, click on `group-images` bucket
2. Go to **Policies** tab
3. Click **New Policy** and create the following policies:

#### Policy 1: Allow users to upload group images
```sql
CREATE POLICY "Users can upload group images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'group-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 2: Allow users to update group images
```sql
CREATE POLICY "Users can update group images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'group-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 3: Allow users to delete group images
```sql
CREATE POLICY "Users can delete group images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'group-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Policy 4: Allow anyone to view group images
```sql
CREATE POLICY "Anyone can view group images"
ON storage.objects FOR SELECT
USING (bucket_id = 'group-images');
```

## 📱 Features

### Create Group Screen

The `AddNewGroupScreen` includes:

1. **Group Name Input**
   - Character limit: 50 characters
   - Real-time character count display (0/50)

2. **Group Description Input**
   - Character limit: 450 characters
   - Multi-line text input
   - Real-time character count display (0/450)

3. **Group Image Upload**
   - Tap the image placeholder to select an image
   - Images are uploaded to Supabase Storage
   - Square aspect ratio (1:1)

4. **Search Friends**
   - Search bar to filter friends list
   - Real-time filtering as you type

5. **Friends List**
   - Displays all accepted friends
   - Checkbox to select friends to add to group
   - Circular avatar images
   - Falls back to mock data if friends table doesn't exist

6. **Create Group Button**
   - Creates the group in the database
   - Adds creator as admin
   - Adds selected friends as members
   - Uploads group image to storage

## 🔄 Data Flow

### Creating a Group

```
User fills form → 
  Upload image (if selected) → 
  Create group record → 
  Add creator as admin member → 
  Add selected friends as members → 
  Show success message
```

### Loading Friends

```
Check friends table → 
  Get accepted friendships → 
  Load friend profiles → 
  Display in list
```

## 🧪 Testing

### Test Group Creation

1. Navigate to Create Group screen
2. Enter a group name (max 50 characters)
3. Optionally add a description (max 450 characters)
4. Optionally select a group image
5. Search and select friends to add
6. Tap "Create New Group"
7. Verify group appears in groups list

### Test Friends Loading

1. Ensure you have accepted friends in the `friends` table
2. Navigate to Create Group screen
3. Verify friends appear in the list
4. Test search functionality

## 📝 Notes

- If the `friends` or `groups` tables don't exist, the app will show mock data and display a warning message
- Friends are loaded from the `friends` table where status = 'accepted'
- Group creator is automatically added as an admin member
- Selected friends are added as regular members
- Group images are stored in the `group-images` storage bucket

## 🔍 Troubleshooting

### Friends not showing?

- Check if `friends` table exists and has data
- Verify friends have `status = 'accepted'`
- Check RLS policies allow reading friends
- App will fall back to mock data if table doesn't exist

### Group creation fails?

- Verify `groups` table exists (run `groups-setup.sql`)
- Check RLS policies allow creating groups
- Verify user is logged in
- Check console for error messages

### Image upload fails?

- Verify `group-images` bucket exists
- Check storage policies are set up correctly
- Verify user has permission to upload
- Check image file size (should be reasonable)

## 🎨 UI Design

The screen matches the design specification:
- Burnt orange header (#C97D60)
- Dark gray background (#363636)
- White input fields with rounded corners
- Character count indicators
- Image placeholder on the right of description
- Search bar with icon
- Friends list with avatars and checkboxes
- Large create button at bottom

