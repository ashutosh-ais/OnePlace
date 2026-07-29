import React, { useMemo, useState } from 'react';
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
import { ArrowRight, Phone, ShieldCheck, Sparkles } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import FocusAwareStatusBar from '../../../components/FocusAwareStatusBar';
import withLoader from '../../../hoc/withLoader';
import { useTheme } from '../../../theme/useTheme';
import getStyles from './Login.styles';

const LoginWithoutHoc = ({ navigation, setLoading, insets }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
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
    }, 1000);
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandContainer}>
          <View style={styles.logoPlaceholder}>
            <Sparkles color={colors.primary} size={RFValue(28)} />
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
            <Phone color={isFocused ? colors.primary : colors.textSecondary} size={RFValue(18)} />
            <Text style={styles.countryCode}>+91</Text>
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="00000 00000"
              placeholderTextColor={colors.textSecondary}
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
          <ArrowRight
            color={phone.length === 10 ? colors.surface : colors.textSecondary}
            size={RFValue(18)}
            style={styles.buttonIcon}
          />
        </TouchableOpacity>

        <View style={styles.footerBadge}>
          <ShieldCheck color={colors.textSecondary} size={RFValue(14)} />
          <Text style={styles.footerText}>Encrypted & Secure Login</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default withLoader(withSafeAreaInsets(LoginWithoutHoc));
