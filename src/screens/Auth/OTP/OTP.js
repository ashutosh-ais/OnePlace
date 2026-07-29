import { useRef, useState } from 'react';
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
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';
import withLoader from '../../../hoc/withLoader';
import styles from './OTP.styles';
import { authAction } from '../../../redux/Slice/AuthSlice';
import { getDBConnection, getUserByPhone, createUser, setUserActive } from '../../../database/DatabaseHelper';
import { initializeDatabase } from '../../../redux/Slice/HabitSlice';

const OTPWithoutHoc = ({ navigation, route, setLoading, insets }) => {
  const { phoneNumber } = route.params || { phoneNumber: '9999999999' };
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    // Auto-delete and move back
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
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
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
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
          disabled={otp.join('').length < 4}
          onPress={verifyOTP}
        >
          <Text style={styles.buttonText}>Verify & Start</Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity>
            <Text style={styles.resendLink}>Resend Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default withLoader(withSafeAreaInsets(OTPWithoutHoc));
