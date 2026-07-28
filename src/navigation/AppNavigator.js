import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getDBConnection, createTables } from '../database/DatabaseHelper';
import { initializeDatabase } from '../redux/Slice/HabitSlice';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/Auth/Login/Login';
import OTP from '../screens/Auth/OTP/OTP';
import TabNavigator from './TabNavigator';
import HabitDetail from '../screens/HabitDetail/HabitDetail';
import CreateHabit from '../screens/CreateHabit/CreateHabit';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const setupDB = async () => {
      const db = await getDBConnection();
      await createTables(db);
      dispatch(initializeDatabase());
    };
    setupDB();
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
        initialRouteName="Login" // Start here!
      >
        {/* Authentication Stack */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OTP" component={OTP} />

        {/* Core App Stack */}
        <Stack.Screen
          name="MainTabs"
          component={TabNavigator}
          options={{ animation: 'fade' }} // Smooth transition after OTP
        />

        {/* Inner OS Modules */}
        <Stack.Screen name="HabitDetail" component={HabitDetail} />
        <Stack.Screen
          name="CreateHabit"
          component={CreateHabit}
          options={{ animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
