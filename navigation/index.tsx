import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme';

// Screen exports placeholder imports
import * as Screens from '../screens';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  MainTabs: undefined;
  GeneratedCourse: { courseId: string };
  Lesson: { courseId: string; lessonId: string };
  Quiz: { courseId: string };
  PracticeTests: { courseId: string };
  AvatarTeacherScreen: { courseId: string };
  Notifications: undefined;
  Settings: undefined;
};

export type MainTabsParamList = {
  Home: undefined;
  Courses: undefined;
  Tutor: undefined;
  Progress: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string = '';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Courses') iconName = focused ? 'book-open-page-variant' : 'book-open-page-variant-outline';
          else if (route.name === 'Tutor') iconName = focused ? 'robot' : 'robot-outline';
          else if (route.name === 'Progress') iconName = focused ? 'chart-box' : 'chart-box-outline';
          else if (route.name === 'Profile') iconName = focused ? 'account' : 'account-outline';

          return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Screens.HomeScreen} />
      <Tab.Screen name="Courses" component={Screens.CoursesScreen} />
      <Tab.Screen name="Tutor" component={Screens.TutorScreen} />
      <Tab.Screen name="Progress" component={Screens.ProgressScreen} />
      <Tab.Screen name="Profile" component={Screens.ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Splash" component={Screens.SplashScreen} />
      <Stack.Screen name="Onboarding" component={Screens.OnboardingScreen} />
      <Stack.Screen name="Auth" component={Screens.AuthScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="GeneratedCourse" component={Screens.GeneratedCourseScreen} />
      <Stack.Screen name="Lesson" component={Screens.LessonScreen} />
      <Stack.Screen name="Quiz" component={Screens.QuizScreen} />
      <Stack.Screen name="PracticeTests" component={Screens.PracticeTestsScreen} />
      <Stack.Screen name="AvatarTeacherScreen" component={Screens.AvatarTeacherScreen} />
      <Stack.Screen name="Notifications" component={Screens.NotificationsScreen} />
      <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
    </Stack.Navigator>
  );
}
