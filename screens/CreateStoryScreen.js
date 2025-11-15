import React, { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedText } from '../components/ThemedText';
import { supabase } from '../services/Supabase';
import { Ionicons } from '@expo/vector-icons';

const REDDISH_BROWN = '#8B4513'; // Reddish-brown color from design

export default function CreateStoryScreen({ navigation }) {
  const [storyContent, setStoryContent] = useState('');
  const [storyImageUri, setStoryImageUri] = useState(null);
  const [showTextInput, setShowTextInput] = useState(false);
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
          allowsEditing: false,
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
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
    if (!storyImageUri) {
      Alert.alert('提示', '请先选择一张图片');
      return;
    }

    try {
      setCreatingStory(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('错误', '请先登录');
        return;
      }

      // Upload image to Supabase Storage
      const imageUrl = await uploadImageToSupabase(storyImageUri);

      // Save story to database
      const { data, error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          title: storyContent.trim() || null,
          image: imageUrl,
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
        <ThemedText style={styles.headerTitle}>Create new Story</ThemedText>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {storyImageUri ? (
        // Image Selected State - Full screen image with editing tools
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: storyImageUri }}
            style={styles.fullScreenImage}
            resizeMode="cover"
          />
          
          {/* Text Input Overlay (shown when showTextInput is true) */}
          {showTextInput && (
            <View style={styles.textInputOverlay}>
              <TextInput
                style={styles.storyTextInput}
                value={storyContent}
                onChangeText={setStoryContent}
                placeholder="Write your Inspiration..."
                placeholderTextColor="#666"
                multiline
                textAlignVertical="top"
                maxLength={256}
              />
            </View>
          )}

          {/* Editing Tools Bar */}
          <View style={styles.editingToolsBar}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => setShowTextInput(!showTextInput)}
              activeOpacity={0.7}
            >
              <Ionicons name="text" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => {
                // Sticker/Emoji functionality - placeholder
                Alert.alert('提示', '贴纸功能即将推出');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="happy" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => {
                // Tag/Mention functionality - placeholder
                Alert.alert('提示', '标签功能即将推出');
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="people" size={24} color="#fff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.toolButton}
              onPress={handleCreateStory}
              disabled={creatingStory}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={creatingStory ? "hourglass" : "arrow-forward"} 
                size={24} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Initial State - Background image with phone illustration and buttons
        <View style={styles.backgroundContainer}>
          <ImageBackground
            source={require('../assets/icon.png')}
            style={styles.backgroundImage}
            blurRadius={15}
            imageStyle={styles.backgroundImageStyle}
          >
            <View style={styles.overlay} />
            <View style={styles.initialContent}>
              {/* Phone Outline with Text */}
              <View style={styles.phoneOutline}>
                <View style={styles.phoneInner}>
                  <ThemedText style={styles.phoneText}>SHARE YOUR FOOD JOURNEY!</ThemedText>
                </View>
              </View>

              {/* Upload Image Button */}
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleImagePicker('library')}
                activeOpacity={0.8}
              >
                <Ionicons name="images" size={20} color="#fff" />
                <ThemedText style={styles.uploadButtonText}>Upload Image</ThemedText>
              </TouchableOpacity>

              {/* Take Photo Button */}
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleImagePicker('camera')}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={20} color="#fff" />
                <ThemedText style={styles.uploadButtonText}>Take Photo</ThemedText>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: REDDISH_BROWN,
  },
  header: {
    backgroundColor: REDDISH_BROWN,
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'left',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Initial State Styles
  backgroundContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageStyle: {
    opacity: 0.6,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  initialContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    zIndex: 1,
  },
  phoneOutline: {
    width: 200,
    height: 300,
    borderWidth: 3,
    borderColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  phoneInner: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  uploadButton: {
    backgroundColor: REDDISH_BROWN,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    marginBottom: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Image Selected State Styles
  imageContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  textInputOverlay: {
    position: 'absolute',
    bottom: 120,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    maxHeight: 200,
  },
  storyTextInput: {
    fontSize: 16,
    color: '#000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  editingToolsBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: REDDISH_BROWN,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  toolButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

