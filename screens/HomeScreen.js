import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import { ThemedText } from '../components/ThemedText';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding (16px padding on each side + 16px gap)

// Helper function to calculate card width more accurately
const getCardWidth = () => {
  const screenWidth = Dimensions.get('window').width;
  const padding = 16 * 2; // left and right padding
  const gap = 16; // gap between cards
  return (screenWidth - padding - gap) / 2;
};
const mockRecipes = [
  {
    id: 1,
    title: 'Pizza',
    description: 'Delicious homemade pizza with pineapple, chicken, and fresh cilantro',
    ingredients: 'Pizza dough, tomato sauce, mozzarella, pineapple, chicken, red onion, cilantro',
    prepTime: '30 min',
    instructions: 'Prepare dough, add toppings, bake at 200°C for 15 minutes',
    image_url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: '2025-11-14T10:00:00Z',
    updated_at: '2025-11-14T10:00:00Z',
    author: {
      id: 1,
      username: 'Mengmeng',
      email: 'mengmeng@example.com',
      first_name: 'Mengmeng',
      last_name: 'User',
    },
  },
  {
    id: 2,
    title: 'Pasta Carbonara',
    description: 'Classic Italian pasta dish',
    ingredients: 'Spaghetti, eggs, pancetta, parmesan, black pepper',
    prepTime: '20 min',
    instructions: 'Cook pasta, prepare sauce, combine and serve',
    image_url: '',
    visibility: 'public',
    created_at: '2025-11-13T15:30:00Z',
    updated_at: '2025-11-13T15:30:00Z',
    author: {
      id: 2,
      username: 'Chef',
      email: 'chef@example.com',
      first_name: 'Chef',
      last_name: 'Cook',
    },
  },
  {
    id: 3,
    title: 'Sushi Roll',
    description: 'Fresh salmon and avocado sushi',
    ingredients: 'Sushi rice, nori, salmon, avocado, cucumber',
    prepTime: '45 min',
    instructions: 'Prepare rice, roll with ingredients, slice and serve',
    image_url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    visibility: 'public',
    created_at: '2025-11-12T12:00:00Z',
    updated_at: '2025-11-12T12:00:00Z',
    author: {
      id: 1,
      username: 'Mengmeng',
      email: 'mengmeng@example.com',
      first_name: 'Mengmeng',
      last_name: 'User',
    },
  },
  {
    id: 4,
    title: 'Chocolate Cake',
    description: 'Rich and moist chocolate cake',
    ingredients: 'Flour, sugar, cocoa, eggs, butter, milk',
    prepTime: '60 min',
    instructions: 'Mix ingredients, bake at 180°C for 35 minutes',
    image_url: '',
    visibility: 'public',
    created_at: '2025-11-11T14:20:00Z',
    updated_at: '2025-11-11T14:20:00Z',
    author: {
      id: 3,
      username: 'Baker',
      email: 'baker@example.com',
      first_name: 'Baker',
      last_name: 'Sweet',
    },
  },
];
export default function FeedScreen() {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Uncomment to load from API
    // loadRecipes();
  }, []);



  // Mock stories data - you can replace this with actual API call
  const stories = Array.from({ length: 6 }, (_, i) => ({ id: i }));

  return (
    <View style={styles.outerContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {/* Stories Section */}
        <View style={styles.storiesSection}>
          <ThemedText style={styles.sectionTitle}>Stories</ThemedText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesScroll}
            contentContainerStyle={styles.storiesContent}
          >
            {stories.map((story, index) => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyCircle}
              >
                {index === 0 ? (
                  <ThemedText style={styles.addStoryIcon}>+</ThemedText>
                ) : (
                  <View style={styles.storyPlaceholder} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Recipes Section */}
        <View style={styles.recipesSection}>
          <ThemedText style={styles.sectionTitle}>Recipes</ThemedText>
          {loading ? (
            <ThemedText style={styles.loadingText}>Loading...</ThemedText>
          ) : error ? (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
              <TouchableOpacity onPress={loadRecipes} style={styles.retryButton}>
                <ThemedText style={styles.retryButtonText}>Retry</ThemedText>
              </TouchableOpacity>
            </View>
          ) : recipes.length === 0 ? (
            <ThemedText style={styles.emptyText}>No recipes yet. Create your first recipe!</ThemedText>
          ) : (
            <View style={styles.recipesGrid}>
              {recipes.map((recipe) => (
                <TouchableOpacity
                  key={recipe.id}
                  style={styles.recipeCard}
                  onPress={() => router.push(`/recipeDetail/${recipe.id}`)}
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
                        }).replace(/\./g, '/')}
                      </ThemedText>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.recipeAuthorRow}>
                      <View style={styles.authorAvatar}>
                        <ThemedText style={styles.avatarText}>
                          {recipe.author.username.charAt(0).toUpperCase()}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.authorName} lightColor="#000" darkColor="#000">
                        {recipe.author.username}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#DAA520', // Yellow background for the entire screen
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#DAA520', // Ensure container also has yellow background
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#DAA520', // Yellow background extends with content
    minHeight: '100%', // Ensure minimum height to fill screen
    paddingBottom: 100, // Extra padding at bottom to ensure yellow background shows
  },
  // Stories Section
  storiesSection: {
    backgroundColor: '#2C5F5F', // Dark teal/green
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  storiesScroll: {
    marginHorizontal: -16,
  },
  storiesContent: {
    paddingHorizontal: 16,
  },
  storyCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addStoryIcon: {
    fontSize: 32,
    color: '#666',
    fontWeight: '300',
  },
  storyPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E0E0E0',
  },
  // Recipes Section
  recipesSection: {
    backgroundColor: '#DAA520', // Mustard yellow
    paddingTop: 20,
    paddingBottom: 40, // Increased bottom padding for better scrolling
    paddingHorizontal: 16,
    flexGrow: 1, // Allow section to grow with content
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
    width: '100%',
  },
  recipeCard: {
    width: CARD_WIDTH,
    maxWidth: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
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
  errorContainer: {
    padding: 16,
    margin: 16,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#FFEBEB',
  },
  errorText: {
    color: '#c62828',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
