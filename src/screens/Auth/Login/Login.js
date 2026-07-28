import { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';
import withLoader from '../../../hoc/withLoader';
import styles from './Login.styles';

const LoginWithoutHoc = ({ navigation, setLoading, insets }) => {
  const [phone, setPhone] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
    paddingBottom: insets.bottom,
  };

  const handleContinue = () => {
    if (phone.length < 10) return;
    Keyboard.dismiss();
    setLoading(true);

    // Simulate API Call for generating OTP
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTP', { phoneNumber: phone });
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, mainContainerStyles]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.brandContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>OP</Text>
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>OnePlace</Text>
          <Text style={styles.subtitle}>
            Enter your phone number to access your personal operating system.
          </Text>
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View
            style={[
              styles.inputContainer,
              isFocused && styles.inputContainerFocused,
            ]}
          >
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="00000 00000"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            phone.length === 10 ? styles.buttonActive : styles.buttonInactive,
          ]}
          activeOpacity={0.8}
          disabled={phone.length < 10}
          onPress={handleContinue}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withLoader(withSafeAreaInsets(LoginWithoutHoc));
