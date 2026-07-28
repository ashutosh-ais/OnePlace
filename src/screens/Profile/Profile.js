import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { STYLES } from '../../constants/config';
import withLoader from '../../hoc/withLoader';
import styles from './Profile.styles';
import { ChevronRight, Dumbbell, Sunrise, BookOpen, Activity, Database, Plane, HeartPulse, Bell } from 'lucide-react-native';
import { GRAY9, PRIMARY_OS } from '../../constants/color';
import { RFValue } from 'react-native-responsive-fontsize';

const ProfileWithoutHoc = ({ insets }) => {
  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const templateIcons = [
    <Dumbbell color={PRIMARY_OS} size={RFValue(24)} />,
    <Sunrise color={PRIMARY_OS} size={RFValue(24)} />,
    <BookOpen color={PRIMARY_OS} size={RFValue(24)} />,
    <Activity color={PRIMARY_OS} size={RFValue(24)} />
  ];

  const settingsItems = [
    { name: 'Data Vault & Export', icon: <Database color={GRAY9} size={RFValue(20)} /> },
    { name: 'Seasonal & Travel Mode', icon: <Plane color={GRAY9} size={RFValue(20)} /> },
    { name: 'App Integrations (Health)', icon: <HeartPulse color={GRAY9} size={RFValue(20)} /> },
    { name: 'Notification Engine', icon: <Bell color={GRAY9} size={RFValue(20)} /> },
  ];

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
                  <View style={{ marginBottom: RFValue(8) }}>
                    {templateIcons[i]}
                  </View>
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
            {settingsItems.map((item, i) => (
              <TouchableOpacity key={i} style={[styles.menuItem, { flexDirection: 'row', alignItems: 'center' }]}>
                <View style={{ marginRight: RFValue(12) }}>
                  {item.icon}
                </View>
                <Text style={[styles.menuItemText, { flex: 1 }]}>{item.name}</Text>
                <ChevronRight color={GRAY9} size={RFValue(20)} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(ProfileWithoutHoc));
