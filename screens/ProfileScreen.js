import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';

export default function ProfileScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.profileCard}>
          <ThemedText type="subtitle">User Profile</ThemedText>
          <ThemedText style={styles.info}>Username: user123</ThemedText>
          <ThemedText style={styles.info}>Email: user@example.com</ThemedText>
        </ThemedView>
        <ThemedView style={styles.section}>
          <ThemedText type="subtitle">My Recipes</ThemedText>
          <ThemedText style={styles.emptyText}>Your recipes will appear here</ThemedText>
        </ThemedView>
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
  profileCard: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  info: {
    marginTop: 8,
  },
  section: {
    padding: 16,
  },
  emptyText: {
    marginTop: 8,
    opacity: 0.6,
  },
});
