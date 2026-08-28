// src/navigation/AppNavigator.jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import InterviewScreen from '../screens/InterviewScreen';
import CareerScreen from '../screens/CareerScreen';
import CodingScreen from '../screens/CodingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ResumeScreen from '../screens/ResumeScreen';
import InterviewRoomScreen from '../screens/InterviewRoomScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom Tab Bar with NO profile duplicate (profile is ONLY at top right corner)
function CustomTabBar({ state, descriptors, navigation }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.bg }]}>
      <View style={[styles.tabBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        {/* Tab 0: Home */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, state.index === 0 && styles.tabIconActive]}>
            🏠
          </Text>
        </TouchableOpacity>

        {/* Tab 1: Career Roadmap (Analytics) */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('Career')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, state.index === 1 && styles.tabIconActive]}>
            📊
          </Text>
        </TouchableOpacity>

        {/* Center Floating (+) Quick Interview Button */}
        <TouchableOpacity
          style={[styles.centerPlusButton, { backgroundColor: '#ffffff' }]}
          onPress={() => navigation.navigate('Interview')}
          activeOpacity={0.85}
        >
          <Text style={styles.centerPlusText}>+</Text>
        </TouchableOpacity>

        {/* Tab 2: Resume ATS Scanner */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('ResumeTab')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, state.index === 2 && styles.tabIconActive]}>
            📄
          </Text>
        </TouchableOpacity>

        {/* Tab 3: Coding Practice Arena */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => navigation.navigate('Coding')}
          activeOpacity={0.7}
        >
          <Text style={[styles.tabIcon, state.index === 3 && styles.tabIconActive]}>
            💻
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      backBehavior="firstRoute"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Career" component={CareerScreen} />
      <Tab.Screen name="ResumeTab" component={ResumeScreen} />
      <Tab.Screen name="Coding" component={CodingScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { token } = useAuth();
  const { theme } = useTheme();

  if (token === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
        <Text style={{ fontSize: 44, marginBottom: 16 }}>🎯</Text>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ color: theme.subtext, marginTop: 14, fontSize: 13, fontWeight: '600' }}>Loading InterviewX...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        {token ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="Interview"
              component={InterviewScreen}
              options={{ animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
              name="InterviewRoom"
              component={InterviewRoomScreen}
              options={{ animation: 'slide_from_bottom', gestureEnabled: false }}
            />
            <Stack.Screen name="Resume" component={ResumeScreen} options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="Coding" component={CodingScreen} />
            <Stack.Screen name="Career" component={CareerScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
    paddingTop: 6,
    paddingHorizontal: 16,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 28,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabIcon: {
    fontSize: 20,
    opacity: 0.45,
  },
  tabIconActive: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  centerPlusButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  centerPlusText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#121214',
    lineHeight: 30,
  },
});
