import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput, Image, Alert } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { supabase } from '../../services/Supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function AddNewFriendScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a username or email to search');
      return;
    }

    try {
      setLoading(true);
      
      // Search for users by username or email
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, email, avatar_url')
        .or(`username.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
        .limit(20);

      if (error) throw error;

      // Filter out current user
      const filtered = (data || []).filter(user => user.id !== currentUserId);
      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search for users');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId, friendName) => {
    try {
      // In a real app, you would create a friend request or add to friends table
      // For now, we'll just show a success message
      Alert.alert('Success', `Friend request sent to ${friendName}!`);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error adding friend:', error);
      Alert.alert('Error', 'Failed to add friend');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle} lightColor="#fff" darkColor="#fff">
            Add new friend
          </ThemedText>
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by username or email"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <ThemedText style={styles.searchButtonText} lightColor="#fff" darkColor="#fff">
            Search
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* Results */}
      <ScrollView style={styles.resultsContainer} contentContainerStyle={styles.resultsContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText} lightColor="#999" darkColor="#999">
              Searching...
            </ThemedText>
          </View>
        ) : searchResults.length === 0 && searchQuery ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText} lightColor="#999" darkColor="#999">
              No users found
            </ThemedText>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText} lightColor="#999" darkColor="#999">
              Enter a username or email to search for friends
            </ThemedText>
          </View>
        ) : (
          searchResults.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userCard}
              onPress={() => handleAddFriend(user.id, user.username)}
            >
              {user.avatar_url ? (
                <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={24} color="#999" />
                </View>
              )}
              <View style={styles.userInfo}>
                <ThemedText style={styles.username} lightColor="#fff" darkColor="#fff">
                  {user.username}
                </ThemedText>
                {user.email && (
                  <ThemedText style={styles.email} lightColor="#999" darkColor="#999">
                    {user.email}
                  </ThemedText>
                )}
              </View>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => handleAddFriend(user.id, user.username)}
              >
                <Ionicons name="person-add" size={20} color="#fff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
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
  searchSection: {
    padding: 20,
    backgroundColor: '#363636',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#C97D60',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#999',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#555',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#999',
  },
  addButton: {
    backgroundColor: '#C97D60',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

