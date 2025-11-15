import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { supabase } from '../services/Supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [stories, setStories] = useState([]);
  const [activeTab, setActiveTab] = useState('recipes');
  const [loading, setLoading] = useState(true);
  const [recipesLoading, setRecipesLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setError(null);
      setLoading(true);

      // Get current user from Supabase auth
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError) throw authError;

      if (authUser) {
        // Get user profile from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        setUser(profileData);
        loadRecipes(authUser.id);
        loadStories(authUser.id);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setError(error.message || 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const loadRecipes = async (userId) => {
    try {
      setRecipesLoading(true);

      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          author:author_id(id, username)
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRecipes(data || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
      setRecipes([]);
    } finally {
      setRecipesLoading(false);
    }
  };

  const loadStories = async (userId) => {
    try {
      setStoriesLoading(true);

      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          author:user_id(id, username)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setStories(data || []);
    } catch (error) {
      console.error('Error loading stories:', error);
      setStories([]);
    } finally {
      setStoriesLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Navigation will happen automatically via App.js auth listener
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  // Generate a profile ID based on user ID
  const getProfileId = () => {
    if (user?.id) {
      const shortId = user.id.substring(0, 8);
      return `1KGZ${shortId}`;
    }
    return '1KGZ123';
  };

  // Get join date
  const getJoinDate = () => {
    if (user?.created_at) {
      return new Date(user.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).replace(/\//g, '.');
    }
    return '14.11.25';
  };

  // Austria Flag Component (horizontal stripes: red-white-red)
  const AustriaFlag = () => (
    <View style={styles.flagContainer}>
      <View style={[styles.flagStripe, { backgroundColor: '#ED2939' }]} />
      <View style={[styles.flagStripe, { backgroundColor: '#FFFFFF' }]} />
      <View style={[styles.flagStripe, { backgroundColor: '#ED2939' }]} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with coral background */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle} lightColor="#fff" darkColor="#fff">
            Your profile
          </ThemedText>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="menu-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Content Section */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText} lightColor="#fff" darkColor="#fff">
              Loading...
            </ThemedText>
          </View>
        ) : user ? (
          <>
            <View style={styles.profileInfoContainer}>
              {/* Left side - User Information */}
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName} lightColor="#fff" darkColor="#fff">
                  {user.username}
                </ThemedText>
                <ThemedText style={styles.profileId} lightColor="#999" darkColor="#999">
                  Profile ID: {getProfileId()}
                </ThemedText>
                <ThemedText style={styles.bio} lightColor="#fff" darkColor="#fff">
                  {user.bio || 'I love food because you can eat it!'}
                </ThemedText>
                <View style={styles.joinInfo}>
                  <AustriaFlag />
                  <ThemedText style={styles.joinDate} lightColor="#fff" darkColor="#fff">
                    Joined: {getJoinDate()}
                  </ThemedText>
                </View>
              </View>

              {/* Right side - Profile Picture Placeholder */}
              <View style={styles.avatarContainer}>
                <View style={styles.avatarPlaceholder}>
                  {user.avatar_url ? (
                    <Image source={{ uri: user.avatar_url }} style={styles.avatarImage} />
                  ) : (
                    <Ionicons name="person" size={50} color="#999" />
                  )}
                </View>
              </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'recipes' && styles.tabActive]}
                onPress={() => setActiveTab('recipes')}
              >
                <ThemedText
                  style={[styles.tabText, activeTab === 'recipes' && styles.tabTextActive]}
                  lightColor={activeTab === 'recipes' ? '#C97D60' : '#666'}
                  darkColor={activeTab === 'recipes' ? '#C97D60' : '#999'}
                >
                  Your Recipe
                </ThemedText>
                {activeTab === 'recipes' && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'stories' && styles.tabActive]}
                onPress={() => setActiveTab('stories')}
              >
                <ThemedText
                  style={[styles.tabText, activeTab === 'stories' && styles.tabTextActive]}
                  lightColor={activeTab === 'stories' ? '#C97D60' : '#666'}
                  darkColor={activeTab === 'stories' ? '#C97D60' : '#999'}
                >
                  Your Stories
                </ThemedText>
                {activeTab === 'stories' && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            </View>

            {/* Content Grid */}
            <View style={styles.contentGrid}>
              {activeTab === 'recipes' ? (
                recipesLoading ? (
                  <View style={styles.loadingContainer}>
                    <ThemedText style={styles.loadingText} lightColor="#999" darkColor="#999">
                      Loading recipes...
                    </ThemedText>
                  </View>
                ) : recipes.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText} lightColor="#999" darkColor="#999">
                      No recipes yet. Create your first recipe!
                    </ThemedText>
                  </View>
                ) : (
                  recipes.map((recipe) => (
                    <TouchableOpacity
                      key={recipe.id}
                      style={styles.recipeCard}
                      activeOpacity={0.7}
                    >
                      {recipe.image_url ? (
                        <Image
                          source={{ uri: recipe.image_url }}
                          style={styles.recipeImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.recipeImagePlaceholder}>
                          <ThemedText style={styles.placeholderText}>No Image</ThemedText>
                        </View>
                      )}
                      <View style={styles.recipeCardContent}>
                        <View style={styles.recipeHeader}>
                          <ThemedText style={styles.recipeTitle} numberOfLines={1} lightColor="#000" darkColor="#000">
                            {recipe.title}
                          </ThemedText>
                          <ThemedText style={styles.recipeDate} lightColor="#666" darkColor="#666">
                            {new Date(recipe.created_at).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            }).replace(/\//g, '.')}
                          </ThemedText>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.recipeAuthorRow}>
                          <View style={styles.authorAvatar}>
                            <ThemedText style={styles.avatarText}>
                              {recipe.author?.username?.charAt(0).toUpperCase() || 'U'}
                            </ThemedText>
                          </View>
                          <ThemedText style={styles.authorName} lightColor="#000" darkColor="#000">
                            {recipe.author?.username || 'Unknown'}
                          </ThemedText>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )
              ) : (
                storiesLoading ? (
                  <View style={styles.loadingContainer}>
                    <ThemedText style={styles.loadingText} lightColor="#999" darkColor="#999">
                      Loading stories...
                    </ThemedText>
                  </View>
                ) : stories.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText} lightColor="#999" darkColor="#999">
                      No stories yet. Share your first story!
                    </ThemedText>
                  </View>
                ) : (
                  stories.map((story) => (
                    <TouchableOpacity
                      key={story.id}
                      style={styles.recipeCard}
                      activeOpacity={0.7}
                    >
                      {story.image ? (
                        <Image
                          source={{ uri: story.image }}
                          style={styles.recipeImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <View style={styles.recipeImagePlaceholder}>
                          <ThemedText style={styles.placeholderText}>No Image</ThemedText>
                        </View>
                      )}
                      <View style={styles.recipeCardContent}>
                        <ThemedText style={styles.storyContent} numberOfLines={2} lightColor="#000" darkColor="#000">
                          {story.title || ''}
                        </ThemedText>
                        <View style={styles.divider} />
                        <View style={styles.recipeAuthorRow}>
                          <View style={styles.authorAvatar}>
                            <ThemedText style={styles.avatarText}>
                              {story.author?.username?.charAt(0).toUpperCase() || 'U'}
                            </ThemedText>
                          </View>
                          <ThemedText style={styles.authorName} lightColor="#000" darkColor="#000">
                            {story.author?.username || 'Unknown'}
                          </ThemedText>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )
              )}
            </View>
          </>
        ) : (
          <View style={styles.errorContainer}>
            <ThemedText style={styles.errorText} lightColor="#fff" darkColor="#fff">
              {error || 'Failed to load user data'}
            </ThemedText>
          </View>
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
  menuButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    backgroundColor: '#363636',
    padding: 20,
    paddingBottom: 100,
  },
  profileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  userInfo: {
    flex: 1,
    marginRight: 20,
  },
  userName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    paddingTop: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  bio: {
    fontSize: 16,
    color: '#fff',
    marginTop: 12,
  },
  joinInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  flagContainer: {
    width: 24,
    height: 18,
    flexDirection: 'column',
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: 8,
  },
  flagStripe: {
    flex: 1,
  },
  joinDate: {
    fontSize: 14,
    color: '#fff',
  },
  avatarContainer: {
    width: 120,
    height: 120,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 16,
  },
  tab: {
    paddingBottom: 8,
    marginRight: 24,
  },
  tabActive: {},
  tabText: {
    fontSize: 18,
    fontWeight: '500',
  },
  tabTextActive: {
    fontWeight: '600',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#C97D60',
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  recipeCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#f0f0f0',
  },
  recipeImagePlaceholder: {
    width: '100%',
    height: CARD_WIDTH * 0.75,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
  },
  recipeCardContent: {
    padding: 12,
  },
  recipeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    flex: 1,
  },
  recipeDate: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  storyContent: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  recipeAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  emptyContainer: {
    width: '100%',
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});