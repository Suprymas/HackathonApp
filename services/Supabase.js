import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper function to upload image to Supabase Storage
export const uploadImage = async (uri, bucket, userId) => {
  try {
    console.log('uploadImage', uri, bucket, userId);

    // Get file extension from URI
    const ext = uri.split('.').pop().split('?')[0]; // Remove query params if any
    const timestamp = Date.now();
    // Use folder structure: {userId}/{filename} to match Storage policies
    const filePath = `${userId}/${timestamp}.${ext}`;

    // Read the file as ArrayBuffer for React Native
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    // Upload to Supabase Storage using ArrayBuffer
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, arrayBuffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        cacheControl: '3600',
        upsert: true, // Allow overwriting if file exists
      });

    if (error) {
      console.error('Supabase upload error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};
