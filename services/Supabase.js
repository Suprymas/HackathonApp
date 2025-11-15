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
export const uploadImage = async (uri, bucket, path) => {
  try {
    console.log('uploadImage', uri, bucket, path);

    // Get file extension from URI
    const ext = uri.split('.').pop().split('?')[0]; // Remove query params if any
    const fileName = `${path}_${Date.now()}.${ext}`;

    // For React Native, we need to use FormData or ArrayBuffer
    // Create a file object from URI
    const file = {
      uri: uri,
      name: fileName,
      type: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    };

    // Read the file as base64 if on React Native
    const response = await fetch(uri);
    const arrayBuffer = await response.arrayBuffer();

    // Upload to Supabase Storage using ArrayBuffer
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, arrayBuffer, {
        contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      throw error;
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log('Public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};