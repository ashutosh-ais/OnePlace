/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  Home,
  Calendar as CalendarIcon,
  Plus,
  BarChart2,
  User,
} from 'lucide-react-native';

import Dashboard from '../screens/Dashboard/Dashboard';
import Calendar from '../screens/Calendar/Calendar';
import Analytics from '../screens/Analytics/Analytics';
import Profile from '../screens/Profile/Profile';
import { PRIMARY_OS, GRAY9, WHITE, INPUT_BORDER } from '../constants/color';
import { SEMIBOLD } from '../constants/fontfamily';
import { WIDTH } from '../constants/config';

const Tab = createBottomTabNavigator();

// Custom Floating Add Button for Tab Bar with periodic pop animation
const CustomAddButton = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Periodically pop every 3 seconds
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.18,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearInterval(interval);
  }, [scaleAnim]);

  return (
    <TouchableOpacity
      style={styles.addBtnContainer}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[styles.addBtn, { transform: [{ scale: scaleAnim }] }]}
      >
        <Plus color={WHITE} size={RFValue(24)} strokeWidth={2.5} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const TabNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: PRIMARY_OS,
        tabBarInactiveTintColor: GRAY9,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        animation: 'shift',
        tabBarIcon: ({ color, size }) => {
          size = RFValue(20);
          if (route.name === 'Home') return <Home color={color} size={size} />;
          if (route.name === 'Timeline')
            return <CalendarIcon color={color} size={size} />;
          if (route.name === 'Analytics')
            return <BarChart2 color={color} size={size} />;
          if (route.name === 'Profile')
            return <User color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Dashboard} />
      <Tab.Screen name="Timeline" component={Calendar} />

      {/* Intercept the middle button to open CreateHabit via Stack Navigator */}
      <Tab.Screen
        name="Create"
        component={View}
        options={{
          tabBarLabel: () => null, // hide label for the middle button
          tabBarButton: props => (
            <CustomAddButton
              onPress={() => navigation.navigate('CreateHabit')}
            />
          ),
        }}
      />

      <Tab.Screen name="Analytics" component={Analytics} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: INPUT_BORDER,
    height: RFValue(60),
    paddingBottom: RFValue(8),
    paddingTop: RFValue(8),
    elevation: 0, // No shadow
    shadowOpacity: 0, // No shadow
  },
  tabLabel: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(9),
    marginTop: RFValue(4),
  },
  addBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    width: WIDTH * 0.155,
    height: WIDTH * 0.155,
    borderRadius: WIDTH * 0.155,
    backgroundColor: PRIMARY_OS,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: WHITE,
    top: -3,
  },
});

export default TabNavigator;
