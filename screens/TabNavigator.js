import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import your screen components
import HomeScreen from './HomeScreen';
// import PublishRecipeScreen from './screens/PublishRecipeScreen';
// import FriendsScreen from './screens/FriendsScreen';
// import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const Colors = {
  light: {
    tint: '#007AFF',
    background: '#fff',
    text: '#000',
    tabBar: '#f8f8f8',
  },
  dark: {
    tint: '#0A84FF',
    background: '#000',
    text: '#fff',
    tabBar: '#1c1c1c',
  },
};

export default function TabNavigator() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tab.Navigator
      id={"tabNavigator"}
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#8e8e93' : '#8e8e93',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colorScheme === 'dark' ? '#2c2c2e' : '#e5e5ea',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      {/*<Tab.Screen*/}
      {/*  name="PublishRecipe"*/}
      {/*  component={PublishRecipeScreen}*/}
      {/*  options={{*/}
      {/*    title: 'Publish Recipe',*/}
      {/*    tabBarIcon: ({ color, size }) => (*/}
      {/*      <Ionicons name="add-circle" size={size} color={color} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Tab.Screen*/}
      {/*  name="Friends"*/}
      {/*  component={FriendsScreen}*/}
      {/*  options={{*/}
      {/*    title: 'Friends',*/}
      {/*    tabBarIcon: ({ color, size }) => (*/}
      {/*      <Ionicons name="people" size={size} color={color} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<Tab.Screen*/}
      {/*  name="Profile"*/}
      {/*  component={ProfileScreen}*/}
      {/*  options={{*/}
      {/*    title: 'Profile',*/}
      {/*    tabBarIcon: ({ color, size }) => (*/}
      {/*      <Ionicons name="person" size={size} color={color} />*/}
      {/*    ),*/}
      {/*  }}*/}
      {/*/>*/}
    </Tab.Navigator>
  );
}