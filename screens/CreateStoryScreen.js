import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../components/ThemedText';
import { supabase } from '../services/Supabase';
import { Ionicons } from '@expo/vector-icons';

export default function CreateStoryScreen({ navigation }) {
  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyImageUri, setStoryImageUri] = useState(null);
  const [creatingStory, setCreatingStory] = useState(false);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
      Alert.alert(
        '权限需要',
        '需要相机和相册权限才能上传图片',
        [{ text: '确定' }]
      );
      return false;
    }
    return true;
  };

  const handleImagePicker = async (source) => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setStoryImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('错误', '选择图片时出错');
    }
  };

  const uploadImageToSupabase = async (imageUri) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('用户未登录');

      // Create a unique filename
      const timestamp = Date.now();
      const filename = `stories/${user.id}/${timestamp}.jpg`;
      
      // For Supabase, we need to convert to blob
      // Use XMLHttpRequest to read the file as blob
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function() {
          reject(new Error('Failed to load image'));
        };
        xhr.open('GET', imageUri);
        xhr.responseType = 'blob';
        xhr.send();
      });

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('food-images') // You may need to adjust this bucket name
        .upload(filename, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('food-images')
        .getPublicUrl(filename);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('图片上传失败，请检查网络连接和存储配置');
    }
  };

  const handleCreateStory = async () => {
    if (!storyContent.trim() && !storyImageUri) {
      Alert.alert('提示', '请至少添加图片或文字内容');
      return;
    }

    try {
      setCreatingStory(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('错误', '请先登录');
        return;
      }

      let imageUrl = null;
      if (storyImageUri) {
        // Upload image to Supabase Storage
        imageUrl = await uploadImageToSupabase(storyImageUri);
      }

      // Save story to database
      const { data, error } = await supabase
        .from('food_statuses')
        .insert({
          author_id: user.id,
          title: storyTitle.trim() || null,
          content: storyContent.trim() || null,
          image_url: imageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert('成功', 'Story 已发布！', [
        {
          text: '确定',
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error('Error creating story:', error);
      Alert.alert('错误', error.message || '发布 Story 时出错');
    } finally {
      setCreatingStory(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Create Your New Story</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Image Upload Section */}
        {storyImageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image
              source={{ uri: storyImageUri }}
              style={styles.previewImage}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={() => setStoryImageUri(null)}
            >
              <Ionicons name="close-circle" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.imageUploadSection}>
            <View style={styles.phoneOutline}>
              <ThemedText style={styles.phoneText}>SHARE YOUR FOOD JOURNEY!</ThemedText>
            </View>
            
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleImagePicker('library')}
              activeOpacity={0.8}
            >
              <Ionicons name="images" size={24} color="#fff" />
              <ThemedText style={styles.uploadButtonText}>Upload Image</ThemedText>
            </TouchableOpacity>

            <ThemedText style={styles.orText}>Or</ThemedText>

            <TouchableOpacity
              style={[styles.uploadButton, styles.cameraButton]}
              onPress={() => handleImagePicker('camera')}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={24} color="#fff" />
              <ThemedText style={styles.uploadButtonText}>Take Photo</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* Title Input */}
        <View style={styles.inputSection}>
          <View style={styles.inputHeader}>
            <ThemedText style={styles.inputLabel}>Title</ThemedText>
            <ThemedText style={styles.characterCount}>
              {storyTitle.length}/25
            </ThemedText>
          </View>
          <TextInput
            style={styles.titleInput}
            value={storyTitle}
            onChangeText={setStoryTitle}
            placeholder="Your title..."
            placeholderTextColor="#999"
            maxLength={25}
          />
        </View>

        {/* Content Input */}
        <View style={styles.inputSection}>
          <View style={styles.inputHeader}>
            <ThemedText style={styles.inputLabel}>Description</ThemedText>
            <ThemedText style={styles.characterCount}>
              {storyContent.length}/256
            </ThemedText>
          </View>
          <TextInput
            style={styles.contentInput}
            value={storyContent}
            onChangeText={setStoryContent}
            placeholder="Tap to write a Description..."
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
            maxLength={256}
          />
        </View>

        {/* Share Button */}
        <TouchableOpacity
          style={[
            styles.shareButton,
            (!storyContent.trim() && !storyImageUri) && styles.shareButtonDisabled
          ]}
          onPress={handleCreateStory}
          disabled={creatingStory || (!storyContent.trim() && !storyImageUri)}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.shareButtonText}>
            {creatingStory ? 'Sharing...' : 'Share Post →'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C5F5F',
  },
  header: {
    backgroundColor: '#2C5F5F',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  imageUploadSection: {
    padding: 20,
    alignItems: 'center',
  },
  phoneOutline: {
    width: 200,
    height: 300,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
  },
  phoneText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#2C5F5F',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 12,
    gap: 8,
  },
  cameraButton: {
    backgroundColor: '#1a4a4a',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    color: '#DAA520',
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  changeImageButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
  },
  inputSection: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  characterCount: {
    fontSize: 12,
    color: '#999',
  },
  titleInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    minHeight: 50,
  },
  contentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  shareButton: {
    backgroundColor: '#2C5F5F',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.5,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});

