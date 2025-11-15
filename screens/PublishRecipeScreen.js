import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { ThemedText } from '../components/ThemedText';

export default function PublishRecipeScreen() {
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [tags, setTags] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [preparationSteps, setPreparationSteps] = useState([
    { id: 1, description: '' },
  ]);
  const [mainImageUri, setMainImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, '']);
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleAddStep = () => {
    const newStepId = preparationSteps.length + 1;
    setPreparationSteps([...preparationSteps, { id: newStepId, description: '' }]);
  };

  const handleStepChange = (stepId, value) => {
    const newSteps = preparationSteps.map(step =>
      step.id === stepId ? { ...step, description: value } : step
    );
    setPreparationSteps(newSteps);
  };

  const handleStepImageChange = (stepId, imageUri) => {
    const newSteps = preparationSteps.map(step =>
      step.id === stepId ? { ...step, imageUri } : step
    );
    setPreparationSteps(newSteps);
  };

  const handleImagePicker = () => {
    // Placeholder for image picker - in a real app, you would use expo-image-picker
    Alert.alert('Image Picker', 'Image picker functionality will be implemented here');
  };

  const handlePost = async () => {
    if (!title || !ingredients.some(ing => ing.trim()) || !preparationSteps.some(step => step.description.trim())) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      Alert.alert('Success', 'Recipe created!', [
        {
          text: 'OK',
          onPress: () => {
            // Clear form after successful creation
            setTitle('');
            setStory('');
            setTags('');
            setIngredients(['']);
            setPreparationSteps([{ id: 1, description: '' }]);
            setMainImageUri(null);
          },
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTitle('');
            setStory('');
            setTags('');
            setIngredients(['']);
            setPreparationSteps([{ id: 1, description: '' }]);
            setMainImageUri(null);
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={styles.headerText}>Add a new recipe</ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main Image Upload Area */}
        <TouchableOpacity
          style={styles.mainImageContainer}
          onPress={handleImagePicker}
          activeOpacity={0.8}
        >
          {mainImageUri ? (
            <Image source={{ uri: mainImageUri }} style={styles.mainImage} resizeMode="cover" />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ThemedText style={styles.placeholderIcon}>🏔️☀️</ThemedText>
            </View>
          )}
        </TouchableOpacity>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {/* Name of recipe */}
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Name of recipe"
            placeholderTextColor="#999"
          />

          {/* Story behind this Dish */}
          <TextInput
            style={[styles.input, styles.textArea]}
            value={story}
            onChangeText={setStory}
            placeholder="Story behind this Dish"
            placeholderTextColor="#999"
            multiline
            textAlignVertical="top"
          />

          {/* Choose tags */}
          <TextInput
            style={styles.input}
            value={tags}
            onChangeText={setTags}
            placeholder="Choose tags"
            placeholderTextColor="#999"
          />

          {/* Ingredients Section */}
          <ThemedText style={styles.sectionLabel}>Ingredients</ThemedText>
          {ingredients.map((ingredient, index) => (
            <TextInput
              key={index}
              style={styles.input}
              value={ingredient}
              onChangeText={(value) => handleIngredientChange(index, value)}
              placeholder="Choose ingredients"
              placeholderTextColor="#999"
            />
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddIngredient}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.addButtonText}>Add extra ingredient</ThemedText>
          </TouchableOpacity>

          {/* Preparation Section */}
          <ThemedText style={styles.sectionLabel}>Preparation</ThemedText>
          {preparationSteps.map((step, index) => (
            <View key={step.id} style={styles.stepContainer}>
              <ThemedText style={styles.stepLabel}>{index + 1}. step</ThemedText>
              <TouchableOpacity
                style={styles.stepImageContainer}
                onPress={() => handleImagePicker()}
                activeOpacity={0.8}
              >
                {step.imageUri ? (
                  <Image
                    source={{ uri: step.imageUri }}
                    style={styles.stepImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.stepImagePlaceholder}>
                    <ThemedText style={styles.placeholderIcon}>🏔️☀️</ThemedText>
                  </View>
                )}
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={step.description}
                onChangeText={(value) => handleStepChange(step.id, value)}
                placeholder="description"
                placeholderTextColor="#999"
                multiline
                textAlignVertical="top"
              />
            </View>
          ))}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddStep}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.addButtonText}>Add extra steps</ThemedText>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.actionButtonText}>Delete</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.postButton]}
              onPress={handlePost}
              disabled={loading}
              activeOpacity={0.8}
            >
              <ThemedText style={styles.actionButtonText}>
                {loading ? 'Posting...' : 'Post'}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#2C2C2C',
  },
  header: {
    backgroundColor: '#CC684F',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 300,
  },
  mainImageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#E0E0E0',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#4A90E2',
    overflow: 'hidden',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    color: '#999',
  },
  contentSection: {
    backgroundColor: '#2C2C2C',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#000',
    minHeight: 44,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginTop: 8,
    marginBottom: 12,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  stepImageContainer: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#E0E0E0',
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  stepImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#CC684F',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#CC684F',
  },
  postButton: {
    backgroundColor: '#CC684F',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});