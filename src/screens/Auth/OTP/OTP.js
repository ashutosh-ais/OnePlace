import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { ArrowLeft, ArrowRight, Lock, RefreshCw } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';
import {
  createUser,
  getDBConnection,
  getUserByPhone,
  setUserActive,
} from '../../../database/DatabaseHelper';
import withLoader from '../../../hoc/withLoader';
import { authAction } from '../../../redux/Slice/AuthSlice';
import { initializeDatabase } from '../../../redux/Slice/HabitSlice';
import { useTheme } from '../../../theme/useTheme';
import getStyles from './OTP.styles';

const OTPWithoutHoc = ({ navigation, route, setLoading, insets }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const { phoneNumber } = route.params || { phoneNumber: '9999999999' };
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  // Auto-focus first input on screen load so keyboard automatically opens
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Auto-delete and move back
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const db = await getDBConnection();

      // Find existing user or create a new one
      let user = await getUserByPhone(db, phoneNumber);
      let userId;
      if (user) {
        userId = user.id;
      } else {
        userId = await createUser(db, phoneNumber);
      }

      // Persist session in SQLite so next app open auto-logs in
      await setUserActive(db, userId);

      // Store identity in Redux
      dispatch(
        authAction.setAuth({
          isLoggedIn: true,
          user_id: userId,
          phone_number: phoneNumber,
        }),
      );

      // Load this user's habits
      await dispatch(initializeDatabase()).unwrap();

      // Replace the stack so user can't go back to OTP screen
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, mainContainerStyles]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FocusAwareStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.surface}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.8}
        >
          <ArrowLeft color={colors.text} size={RFValue(20)} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.brandContainer}>
          <View style={styles.iconBadge}>
            <Lock color={colors.primary} size={RFValue(28)} />
          </View>
        </View>

        <Text style={styles.title}>Verify Account</Text>
        <Text style={styles.subtitle}>
          We've sent a 4-digit verification code to{' '}
          <Text style={styles.boldText}>+91 {phoneNumber}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => (inputRefs.current[index] = ref)}
              style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              autoFocus={index === 0}
              onChangeText={val => handleOtpChange(val, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            otp.join('').length === 4
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          activeOpacity={0.8}
          disabled={otp.join('').length < 4}
          onPress={verifyOTP}
        >
          <Text style={styles.buttonText}>Verify & Start</Text>
          <ArrowRight
            color={otp.join('').length === 4 ? colors.surface : colors.textSecondary}
            size={RFValue(18)}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity style={styles.resendLinkRow}>
            <RefreshCw color={colors.primary} size={RFValue(12)} style={styles.resendIcon} />
            <Text style={styles.resendLink}>Resend Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default withLoader(withSafeAreaInsets(OTPWithoutHoc));
