import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/Supabase';

export default function FriendsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('groups'); // 'groups', 'friends', or 'feed'
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userAvatar, setUserAvatar] = useState('https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg'); // Default husky avatar

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

      // Get user profile for avatar
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();
      
      if (profile?.avatar_url) {
        setUserAvatar(profile.avatar_url);
      }

      // Mock data for groups - replace with actual data fetching
      const mockGroups = [
        {
          id: 1,
          name: 'Room 3A',
          icon: 'restaurant',
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
          posts: [
            { id: 4, title: 'Burger', date: '12.11.2025', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' },
            { id: 5, title: 'Spieße', date: '11.11.2025', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&fit=crop' },
            { id: 6, title: 'Banana-Toast', date: '10.11.2025', author: 'Mengmeng', image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=200&h=200&fit=crop' },
          ]
        }
      ];

      // Mock data for friends/chats - replace with actual data fetching
      const mockFriends = [
        {
          id: 1,
          name: 'lukas',
          avatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg',
          lastMessage: 'You: Hello!',
          unreadCount: 12,
          timestamp: '2:30 PM'
        },
        {
          id: 2,
          name: 'Justas',
          avatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg',
          lastMessage: 'You: Hello!',
          unreadCount: 0,
          timestamp: '1:15 PM'
        },
        {
          id: 3,
          name: 'Siebe',
          avatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg',
          lastMessage: 'You: Hello!',
          unreadCount: 0,
          timestamp: '12:00 PM'
        }
      ];

      // Mock data for notifications - replace with actual data fetching
      const mockNotifications = [
        {
          id: 1,
          author: { name: 'Mengmeng', avatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg' },
          type: 'comment', // 'like' or 'comment'
          targetType: 'recipe', // 'recipe' or 'story'
          targetId: 'recipe-1', // ID of the recipe or story
          message: 'add a comment to your recipe',
          targetImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
          timestamp: '2 hours ago'
        },
        {
          id: 2,
          author: { name: 'Mengmeng', avatar: 'https://i.pinimg.com/736x/c4/0c/67/c40c6735f15972c25e6d8ef722d6f1f2.jpg' },
          type: 'like',
          targetType: 'story',
          targetId: 'story-1', // ID of the recipe or story
          message: 'liked your story',
          targetImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=200&h=200&fit=crop',
          timestamp: '5 hours ago'
        }
      ];

      setGroups(mockGroups);
      setFriends(mockFriends);
      setNotifications(mockNotifications);

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderGroupsTab = () => {
    const filteredGroups = groups.filter(group => 
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <ScrollView style={styles.contentScroll}>
        {filteredGroups.map((group) => (
          <TouchableOpacity
            key={group.id}
            style={styles.groupCard}
            onPress={() => navigation.navigate('GroupChat', {
              groupId: group.id,
              groupName: group.name,
              groupIcon: group.icon,
            })}
          >
            <View style={styles.groupHeader}>
              <Ionicons 
                name={group.icon} 
                size={20} 
                color="#333" 
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
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderFriendsTab = () => {
    const filteredFriends = friends.filter(friend => 
      friend.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <ScrollView style={styles.contentScroll}>
        {filteredFriends.map((friend) => (
          <TouchableOpacity
            key={friend.id}
            style={styles.friendCard}
            onPress={() => navigation.navigate('GroupChat', {
              friendId: friend.id,
              friendName: friend.name,
              friendAvatar: friend.avatar,
              isDirectChat: true,
            })}
          >
            <Image source={{ uri: friend.avatar }} style={styles.friendAvatar} />
            <View style={styles.friendInfo}>
              <Text style={styles.friendName}>{friend.name}</Text>
              <Text style={styles.friendLastMessage}>{friend.lastMessage}</Text>
            </View>
            {friend.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>{friend.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderFeedTab = () => {
    const filteredNotifications = notifications.filter(notification => 
      notification.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <ScrollView style={styles.contentScroll}>
        {filteredNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={styles.notificationCard}
            onPress={() => {
              // Navigate to recipe or story detail based on targetType
              if (notification.targetType === 'recipe') {
                navigation.navigate('RecipeDetail', { recipeId: notification.targetId });
              } else if (notification.targetType === 'story') {
                // Navigate to story detail if needed
                console.log('Navigate to story:', notification.targetId);
              }
            }}
          >
            <Image 
              source={{ uri: notification.author.avatar }} 
              style={styles.notificationAvatar} 
            />
            <View style={styles.notificationContent}>
              <Text style={styles.notificationText}>
                <Text style={styles.notificationAuthorName}>{notification.author.name}</Text>
                {' '}
                <Text style={styles.notificationMessage}>{notification.message}</Text>
              </Text>
            </View>
            <Image 
              source={{ uri: notification.targetImage }} 
              style={styles.notificationThumbnail} 
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* Orange header with Social and user avatar */}
      <View style={styles.orangeBar}>
        <Text style={styles.messagesText}>Social</Text>
        <Image source={{ uri: userAvatar }} style={styles.userAvatar} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>
            Groups
          </Text>
          {activeTab === 'groups' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={[styles.tabText, activeTab === 'friends' && styles.activeTabText]}>
            Friends
          </Text>
          {activeTab === 'friends' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab('feed')}
        >
          <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>
            Feed
          </Text>
          {activeTab === 'feed' && <View style={styles.tabUnderline} />}
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Content Area */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          {activeTab === 'groups' && renderGroupsTab()}
          {activeTab === 'friends' && renderFriendsTab()}
          {activeTab === 'feed' && renderFeedTab()}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C2C2E', // Dark gray background
    paddingTop: 60,
  },
  orangeBar: {
    backgroundColor: '#CC684F', // Orange color
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
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3C',
    paddingHorizontal: 16,
    backgroundColor: '#2C2C2E',
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
    color: '#CC684F',
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: '#CC684F',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  contentScroll: {
    flex: 1,
    backgroundColor: '#2C2C2E',
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
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  friendAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  friendLastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  notificationAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  notificationAuthorName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
  },
  notificationThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
  },
});
