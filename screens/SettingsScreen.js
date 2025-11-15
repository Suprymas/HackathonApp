import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedText } from '../components/ThemedText';
import { supabase } from '../services/Supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'

export default function SettingsScreen({ navigation }) {


    return (
        <View style={styles.container}>
        {/* Header with coral background */}
        <View style={styles.header}>
            <View style={styles.headerContent}>
            <ThemedText style={styles.headerTitle} lightColor="#fff" darkColor="#fff">
                Settings
            </ThemedText>
            <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Profile')}>
                <Ionicons name="menu-outline" size={24} color="#fff" />
            </TouchableOpacity>
            </View>
        </View>
        </View>)
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
});