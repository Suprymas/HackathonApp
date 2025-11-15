import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { supabase } from '../services/Supabase';

// Mock data
const MOCK_FRIENDSHIPS = [
  {
    id: 1,
    requester_id: 'current-user',
    addressee_id: 'user-1',
    status: 'accepted',
    addressee: {
      id: 'user-1',
      username: 'sarah_baker'
    }
  },
  {
    id: 2,
    requester_id: 'current-user',
    addressee_id: 'user-2',
    status: 'accepted',
    addressee: {
      id: 'user-2',
      username: 'chef_mike'
    }
  },
  {
    id: 3,
    requester_id: 'current-user',
    addressee_id: 'user-3',
    status: 'pending',
    addressee: {
      id: 'user-3',
      username: 'foodie_emma'
    }
  },
  {
    id: 4,
    requester_id: 'current-user',
    addressee_id: 'user-4',
    status: 'accepted',
    addressee: {
      id: 'user-4',
      username: 'pasta_lover'
    }
  }
];

const MOCK_USERS = [
  { id: 'user-5', username: 'healthy_eats' },
  { id: 'user-6', username: 'dessert_queen' },
  { id: 'user-7', username: 'grill_master' },
  { id: 'user-8', username: 'vegan_chef' },
  { id: 'user-9', username: 'soup_expert' },
  { id: 'user-10', username: 'breakfast_club' }
];

export default function FriendsScreen() {
  const [friendships, setFriendships] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    console.log("loadData");

    // Simulate API delay
    setTimeout(() => {
      setFriendships(MOCK_FRIENDSHIPS);
      setUsers(MOCK_USERS);
      setCurrentUserId('current-user');
      setLoading(false);
    }, 500);
  };

  const handleAddFriend = async (userId) => {
    console.log("Adding friend:", userId);

    // Create new friendship with pending status
    const newFriendship = {
      id: Date.now(),
      requester_id: currentUserId,
      addressee_id: userId,
      status: 'pending',
      addressee: users.find(u => u.id === userId)
    };

    // Add to friendships
    setFriendships([...friendships, newFriendship]);

    // Remove from available users
    setUsers(users.filter(u => u.id !== userId));
  };

  const acceptedFriends = friendships.filter(f => f.status === 'accepted');

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Friends</ThemedText>
      </ThemedView>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ThemedText>Loading...</ThemedText>
        ) : (
          <>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              My Friends ({acceptedFriends.length})
            </ThemedText>
            {acceptedFriends.length === 0 ? (
              <ThemedText style={styles.emptyText}>No friends yet</ThemedText>
            ) : (
              acceptedFriends.map((friendship) => (
                <ThemedView key={friendship.id} style={styles.friendCard}>
                  <ThemedText>{friendship.addressee?.username || 'Unknown'}</ThemedText>
                </ThemedView>
              ))
            )}
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Discover Users
            </ThemedText>
            {users.map((user) => (
              <ThemedView key={user.id} style={styles.userCard}>
                <ThemedText>{user.username}</ThemedText>
                <TouchableOpacity
                  onPress={() => handleAddFriend(user.id)}
                  style={styles.addButton}
                >
                  <ThemedText style={styles.addButtonText}>Add Friend</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            ))}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    padding: 16,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    padding: 16,
    paddingBottom: 8,
  },
  friendCard: {
    padding: 16,
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    margin: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyText: {
    padding: 16,
    opacity: 0.6,
  },
});