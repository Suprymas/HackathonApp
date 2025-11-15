import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { supabase } from '../../services/Supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AddNewGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('restaurant');
  const [loading, setLoading] = useState(false);

  const groupIcons = [
    { name: 'restaurant', label: 'Restaurant' },
    { name: 'restaurant-outline', label: 'Restaurant Outline' },
    { name: 'cafe', label: 'Cafe' },
    { name: 'cafe-outline', label: 'Cafe Outline' },
    { name: 'wine', label: 'Wine' },
    { name: 'wine-outline', label: 'Wine Outline' },
    { name: 'pizza', label: 'Pizza' },
    { name: 'pizza-outline', label: 'Pizza Outline' },
    { name: 'ice-cream', label: 'Ice Cream' },
    { name: 'ice-cream-outline', label: 'Ice Cream Outline' },
  ];

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    try {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to create a group');
        return;
      }

      // In a real app, you would create the group in the database
      // For now, we'll just show a success message
      Alert.alert(
        'Success',
        `Group "${groupName}" created successfully!`,
        [
          {
            text: 'OK',
            onPress: () => {
              setGroupName('');
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error creating group:', error);
      Alert.alert('Error', 'Failed to create group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle} lightColor="#fff" darkColor="#fff">
            Add new group
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
        {/* Group Name Input */}
        <View style={styles.inputSection}>
          <ThemedText style={styles.label} lightColor="#fff" darkColor="#fff">
            Group Name
          </ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            placeholderTextColor="#999"
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        {/* Icon Selection */}
        <View style={styles.iconSection}>
          <ThemedText style={styles.label} lightColor="#fff" darkColor="#fff">
            Choose Icon
          </ThemedText>
          <View style={styles.iconGrid}>
            {groupIcons.map((icon) => (
              <TouchableOpacity
                key={icon.name}
                style={[
                  styles.iconButton,
                  selectedIcon === icon.name && styles.iconButtonSelected,
                ]}
                onPress={() => setSelectedIcon(icon.name)}
              >
                <Ionicons
                  name={icon.name}
                  size={32}
                  color={selectedIcon === icon.name ? '#fff' : '#999'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateGroup}
          disabled={loading}
        >
          <ThemedText style={styles.createButtonText} lightColor="#fff" darkColor="#fff">
            {loading ? 'Creating...' : 'Create Group'}
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
  inputSection: {
    marginBottom: 30,
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
  iconSection: {
    marginBottom: 30,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  iconButton: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconButtonSelected: {
    backgroundColor: '#C97D60',
    borderColor: '#fff',
  },
  createButton: {
    backgroundColor: '#C97D60',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

