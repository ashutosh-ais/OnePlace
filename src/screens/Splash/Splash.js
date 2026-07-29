import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { getDBConnection, createTables, getActiveUser } from '../../database/DatabaseHelper';
import { authAction } from '../../redux/Slice/AuthSlice';
import { themeAction } from '../../redux/Slice/ThemeSlice';
import { initializeDatabase } from '../../redux/Slice/HabitSlice';
import { PRIMARY_OS, WHITE } from '../../constants/color';
import { BOLD, REGULAR } from '../../constants/fontfamily';
import { RFValue } from 'react-native-responsive-fontsize';

const Splash = ({ navigation }) => {
  const dispatch = useDispatch();

  // Animation values
  const scale = useRef(new Animated.Value(0.3)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Step 1: Pop-in animation for the logo
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          tension: 80,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Step 2: Fade in subtitle after logo pops
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Step 3: While animating, check for persisted session
    const checkSession = async () => {
      try {
        const db = await getDBConnection();
        await createTables(db);

        const activeUser = await getActiveUser(db);

        // Wait a minimum of 1.8s for the splash to feel intentional
        await new Promise(resolve => setTimeout(resolve, 1800));

        if (activeUser) {
          // Restore session to Redux
          dispatch(
            authAction.setAuth({
              isLoggedIn: true,
              user_id: activeUser.id,
              phone_number: activeUser.phone_number,
            }),
          );
          // Restore theme settings
          dispatch(
            themeAction.setThemeFromDB({
              themeColor: activeUser.theme_color,
              colorMode: activeUser.color_mode,
            })
          );
          // Load their data
          await dispatch(initializeDatabase()).unwrap();
          navigation.replace('MainTabs');
        } else {
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Splash session check error:', error);
        navigation.replace('Login');
      }
    };

    checkSession();
  }, [dispatch, navigation, opacity, scale, subtitleOpacity]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale }], opacity },
        ]}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>OP</Text>
        </View>
        <Text style={styles.brandName}>OnePlace</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: subtitleOpacity }]}>
        Your Personal Operating System
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: RFValue(16),
  },
  logoCircle: {
    width: RFValue(80),
    height: RFValue(80),
    borderRadius: RFValue(40),
    backgroundColor: PRIMARY_OS,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: RFValue(20),
    shadowColor: PRIMARY_OS,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  logoText: {
    color: WHITE,
    fontFamily: BOLD,
    fontSize: RFValue(28),
    letterSpacing: 1,
  },
  brandName: {
    fontFamily: BOLD,
    fontSize: RFValue(32),
    color: '#111827',
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: REGULAR,
    fontSize: RFValue(13),
    color: '#9CA3AF',
    letterSpacing: 0.3,
  },
});

export default Splash;
