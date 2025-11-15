import React, { useState } from 'react';
import { StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function PublishRecipeScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    console.log("Creating new recipe...");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ThemedView style={styles.header}>
        <ThemedText type="title">Add a new recipe</ThemedText>
        <TouchableOpacity onPress={handleCreate} disabled={loading}>
          <ThemedText style={styles.saveButton}>{loading ? 'Adding Recipe...' : 'Add Recipe'}</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <ThemedText style={styles.label}>Name of recipe *</ThemedText>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter name"
        />
        <ThemedText style={styles.label}>Tags/category</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Choose tags"
          multiline
        />
        <ThemedText style={styles.label}>Preparation time</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={prepTime}
          onChangeText={setPrepTime}
          placeholder="Enter time"
          multiline
        />
        <ThemedText style={styles.label}>Ingredients *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={ingredients}
          onChangeText={setIngredients}
          placeholder="List ingredients"
          multiline
        />
        <ThemedText style={styles.label}>Preparation *</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Step-by-step instructions"
          multiline
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#81B29A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#81B29A',
  },
  saveButton: {
    color: '#007AFF',
    fontWeight: '600',
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 300,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 44,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
});