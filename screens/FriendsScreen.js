import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/Supabase';

export default function FriendsScreen() {
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'notification'
  const [groups, setGroups] = useState([]);
  const [notifications, setNotifications] = useState([]);
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

      // Mock data for groups/chats - replace with actual data fetching
      const mockGroups = [
        {
          id: 1,
          name: 'Room 3A',
          icon: 'restaurant',
          isHighlighted: false,
          posts: [
            { id: 1, title: 'Pizza', date: '14.11.2025', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop' },
            { id: 2, title: 'Toast', date: '13.11.2025', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop' },
            { id: 3, title: 'Burger', date: '12.11', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
          ]
        },
        {
          id: 2,
          name: 'Foodly',
          icon: 'restaurant-outline',
          isHighlighted: false,
          posts: [
            { id: 4, title: 'Burger', date: '12.11.2025', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
            { id: 5, title: 'Spieße', date: '11.11.2025', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop' },
            { id: 6, title: 'Banana-Toast', date: '10.11.2025', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&h=200&fit=crop' },
          ]
        }
      ];

      // Mock data for notifications - replace with actual data fetching
      const mockNotifications = [
        {
          id: 1,
          type: 'like',
          user: { name: 'Mengmeng', avatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg' },
          message: 'Mengmeng liked your story',
          thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop'
        },
        {
          id: 2,
          type: 'comment',
          user: { name: 'Mengmeng', avatar: 'https://i.pinimg.com/1200x/55/52/09/55520979a3c00a33bf50fe9c3db3e796.jpg' },
          message: 'Mengmeng add a comment to your recipe',
          thumbnail: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'
        }
      ];

      setGroups(mockGroups);
      setNotifications(mockNotifications);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderChatsTab = () => {
    return (
      <ScrollView style={styles.contentScroll}>
        {groups.map((group) => (
          <View key={group.id} style={[styles.groupCard, group.isHighlighted && styles.highlightedGroupCard]}>
            <View style={styles.groupHeader}>
              <Ionicons 
                name={group.icon} 
                size={20} 
                color={group.isHighlighted ? '#4A90E2' : '#333'} 
                style={styles.groupIcon}
              />
              <Text style={styles.groupName}>{group.name}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.postsScroll}>
              {group.posts.map((post) => (
                <View key={post.id} style={styles.postCard}>
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                  <Text style={styles.postTitle}>{post.title}</Text>
                  <View style={styles.postMeta}>
                    <Text style={styles.postDate}>{post.date}</Text>
                    <View style={styles.postAuthor}>
                      <Ionicons name="person" size={12} color="#666" />
                      <Text style={styles.postAuthorText}>{post.author}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
        {/* Single user card */}
        <View style={styles.userCard}>
          <Ionicons name="person" size={20} color="#333" style={styles.userIcon} />
          <Text style={styles.userName}>Mengmeng</Text>
        </View>
      </ScrollView>
    );
  };

  const renderNotificationTab = () => {
    return (
      <ScrollView style={styles.contentScroll}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <Image source={{ uri: notification.user.avatar }} style={styles.notificationAvatar} />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>{notification.message}</Text>
            </View>
            <Image source={{ uri: notification.thumbnail }} style={styles.notificationThumbnail} />
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Groups text */}
      <View style={styles.topHeader}>
        <Text style={styles.groupsText}>Groups</Text>
      </View>

      {/* Orange bar with Messages */}
      <View style={styles.orangeBar}>
        <Text style={styles.messagesText}>Messages</Text>
        <View style={styles.statusIndicator} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('chats')}
        >
          <Text style={[styles.tabText, activeTab === 'chats' && styles.activeTabText]}>
            Chats
          </Text>
          {activeTab === 'chats' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('notification')}
        >
          <View style={styles.tabWithBadge}>
            <Text style={[styles.tabText, activeTab === 'notification' && styles.activeTabText]}>
              Notification
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>M</Text>
            </View>
          </View>
          {activeTab === 'notification' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        activeTab === 'chats' ? renderChatsTab() : renderNotificationTab()
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  groupsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  orangeBar: {
    backgroundColor: '#D2691E', // Dark orange color
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messagesText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusIndicator: {
    width: 40,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 24,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#D2691E',
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#D2691E',
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -16,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contentScroll: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  groupCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  highlightedGroupCard: {
    borderWidth: 2,
    borderColor: '#4A90E2',
    borderStyle: 'dashed',
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIcon: {
    marginRight: 8,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  postsScroll: {
    marginHorizontal: -12,
  },
  postCard: {
    width: 120,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  postImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    padding: 8,
    paddingBottom: 4,
  },
  postMeta: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  postDate: {
    fontSize: 11,
    color: '#666',
    marginBottom: 4,
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  userIcon: {
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  notificationThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
