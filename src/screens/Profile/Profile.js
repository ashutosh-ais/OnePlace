/* eslint-disable react-native/no-inline-styles */
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { STYLES } from '../../constants/config';
import withLoader from '../../hoc/withLoader';
import styles from './Profile.styles';

const ProfileWithoutHoc = ({ insets }) => {
  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  return (
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Gamification Level Card */}
        <View style={[styles.levelCard, STYLES.elevation]}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AM</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Alex Momentum</Text>
              <Text style={styles.userTitle}>Level 12 • Habit Scholar</Text>
            </View>
          </View>

          <View style={styles.xpContainer}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpText}>2,450 XP</Text>
              <Text style={styles.xpGoal}>3,000 XP to Lvl 13</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
          </View>
        </View>

        {/* Templates from SRS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Templates</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['75 Hard', 'Morning Routine', 'UPSC Prep', 'Weight Loss'].map(
              (template, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.templateCard, STYLES.elevation]}
                >
                  <Text style={styles.templateIcon}>📋</Text>
                  <Text style={styles.templateTitle}>{template}</Text>
                  <Text style={styles.templateSub}>Use Pack</Text>
                </TouchableOpacity>
              ),
            )}
          </ScrollView>
        </View>

        {/* System Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OnePlace Settings</Text>
          <View style={[styles.settingsMenu, STYLES.elevation]}>
            {[
              'Data Vault & Export',
              'Seasonal & Travel Mode',
              'App Integrations (Health)',
              'Notification Engine',
            ].map((item, i) => (
              <TouchableOpacity key={i} style={styles.menuItem}>
                <Text style={styles.menuItemText}>{item}</Text>
                <Text style={styles.menuArrow}>{'>'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(ProfileWithoutHoc));
