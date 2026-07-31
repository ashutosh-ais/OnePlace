import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Splash from '../screens/Splash/Splash';
import Login from '../screens/Auth/Login/Login';
import OTP from '../screens/Auth/OTP/OTP';
import TabNavigator from './TabNavigator';
import HabitDetail from '../screens/HabitDetail/HabitDetail';
import CreateHabit from '../screens/CreateHabit/CreateHabit';
import EditHabit from '../screens/EditHabit/EditHabit';
import CreateNote from '../screens/CreateNote/CreateNote';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // animation: 'slide_from_right',
        }}
        initialRouteName="Splash"
      >
        {/* Startup */}
        <Stack.Screen
          name="Splash"
          component={Splash}
          // options={{ animation: 'none' }}
        />

        {/* Authentication Stack */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OTP" component={OTP} />

        {/* Core App Stack */}
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          // options={{ animation: 'fade' }}
        />

        {/* Inner OS Modules */}
        <Stack.Screen name="HabitDetail" component={HabitDetail} />
        <Stack.Screen
          name="CreateHabit"
          component={CreateHabit}
          // options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="EditHabit"
          component={EditHabit}
          // options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="CreateNote" component={CreateNote} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
