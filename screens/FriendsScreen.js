import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { supabase } from '../services/Supabase';

export default function FriendsScreen() {
  const [friendships, setFriendships] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [strangers, setStrangers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);




  const loadData = async () => {
    try {
      setLoading(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user logged in');
        return;
      }
      setCurrentUserId(user.id);

      // Fetch all users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id); // Exclude current user

      if (usersError) {
        console.error('Error fetching users:', usersError);
        return;
      }


      // Fetch friendships (where current user is requester or addressee)
      const { data: friendshipsData, error: friendshipsError } = await supabase
        .from('friendships')
        .select(`
          id,
          requester_id,
          addressee_id,
          status,
          requester:requester_id(id, username),
          addressee:addressee_id(id, username)
        `)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

      if (friendshipsError) {
        console.error('Error fetching friendships:', friendshipsError);
        return;
      }

      setAllUsers(usersData || []);
      setFriendships(friendshipsData || []);

      // Filter out users who are already friends or have pending requests
      const friendUserIds = new Set();
      friendshipsData?.forEach(friendship => {
        if (friendship.requester_id === user.id) {
          friendUserIds.add(friendship.addressee_id);
        }
        if (friendship.addressee_id === user.id) {
          friendUserIds.add(friendship.requester_id);
        }
      });

      const availableStrangers = usersData?.filter(u => !friendUserIds.has(u.id)) || [];
      setStrangers(availableStrangers);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .insert({
          requester_id: currentUserId,
          addressee_id: userId,
          status: 'pending'
        });

      if (error) {
        console.error('Error adding friend:', error);
        return;
      }

      console.log('Friend request sent to:', userId);
      // Reload data to update lists
      loadData();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  // Get accepted friends - need to determine which user is the friend
  const acceptedFriends = friendships
    .filter(f => f.status === 'accepted')
    .map(f => {
      // If current user is the requester, return addressee; otherwise return requester
      if (f.requester_id === currentUserId) {
        return { id: f.addressee_id, username: f.addressee?.username };
      } else {
        return { id: f.requester_id, username: f.requester?.username };
      }
    });

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
              acceptedFriends.map((friend) => (
                <ThemedView key={friend.id} style={styles.friendCard}>
                  <ThemedText>{friend.username || 'Unknown'}</ThemedText>
                </ThemedView>
              ))
            )}
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Discover Users ({strangers.length})
            </ThemedText>
            {strangers.length === 0 ? (
              <ThemedText style={styles.emptyText}>No new users to discover</ThemedText>
            ) : (
              strangers.map((user) => (
                <ThemedView key={user.id} style={styles.userCard}>
                  <ThemedText>{user.username}</ThemedText>
                  <TouchableOpacity
                    onPress={() => handleAddFriend(user.id)}
                    style={styles.addButton}
                  >
                    <ThemedText style={styles.addButtonText}>Add Friend</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              ))
            )}
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
