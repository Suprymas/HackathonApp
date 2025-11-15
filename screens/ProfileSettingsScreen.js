import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Image, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { supabase } from '../services/Supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function ProfileSettingsScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        setEmail(authUser.email || '');

        // Get user profile
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (error) throw error;

        if (profileData) {
          setUser(profileData);
          setUsername(profileData.username || '');
          setBio(profileData.bio || '');
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username is required');
      return;
    }

    try {
      setSaving(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        Alert.alert('Error', 'You must be logged in');
        return;
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          bio: bio.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', authUser.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle} lightColor="#fff" darkColor="#fff">
              Profile Settings
            </ThemedText>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText} lightColor="#999" darkColor="#999">
            Loading...
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle} lightColor="#fff" darkColor="#fff">
            Profile Settings
          </ThemedText>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          {user?.avatar_url ? (
            <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={50} color="#999" />
            </View>
          )}
          <TouchableOpacity style={styles.changeAvatarButton}>
            <ThemedText style={styles.changeAvatarText} lightColor="#C97D60" darkColor="#C97D60">
              Change Avatar
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Username */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.label} lightColor="#fff" darkColor="#fff">
            Username
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor="#999"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        {/* Email (read-only) */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.label} lightColor="#fff" darkColor="#fff">
            Email
          </ThemedText>
          <TextInput
            style={[styles.input, styles.inputDisabled]}
            value={email}
            editable={false}
            placeholderTextColor="#999"
          />
          <ThemedText style={styles.hintText} lightColor="#999" darkColor="#999">
            Email cannot be changed
          </ThemedText>
        </View>

        {/* Bio */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.label} lightColor="#fff" darkColor="#fff">
            Bio
          </ThemedText>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Tell us about yourself"
            placeholderTextColor="#999"
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <ThemedText style={styles.saveButtonText} lightColor="#fff" darkColor="#fff">
            {saving ? 'Saving...' : 'Save Changes'}
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#363636',
  },
  header: {
    backgroundColor: '#C97D60',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  changeAvatarButton: {
    padding: 8,
  },
  changeAvatarText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#C97D60',
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  inputDisabled: {
    backgroundColor: '#2C2C2E',
    color: '#999',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  hintText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#C97D60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

