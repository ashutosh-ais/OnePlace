import React, { useState, useCallback, useMemo } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import withLoader from '../../hoc/withLoader';
import getStyles from './Profile.styles';
import {
  CheckCircle2,
  Flame,
  Target,
  LogOut,
  ChevronRight,
  Palette,
  Moon,
} from 'lucide-react-native';
import { GRAY9, WHITE } from '../../constants/color';
import { RFValue } from 'react-native-responsive-fontsize';
import { authAction } from '../../redux/Slice/AuthSlice';
import { themeAction } from '../../redux/Slice/ThemeSlice';
import { getDBConnection, getUserStats, setUserActive } from '../../database/DatabaseHelper';
import { useTheme } from '../../theme/useTheme';
import { THEME_PALETTE } from '../../theme/Theme';

const ProfileWithoutHoc = ({ navigation, insets }) => {
  const dispatch = useDispatch();
  const { habits } = useSelector(state => state.habits);
  const { phone_number, user_id } = useSelector(state => state.auth);
  const { themeColor, colorMode } = useSelector(state => state.theme);
  const { colors, isDark } = useTheme();
  
  const styles = useMemo(() => getStyles(colors), [colors]);

  const [stats, setStats] = useState({
    totalHabits: 0,
    bestStreak: 0,
    totalCompletions: 0,
  });

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const avatarLabel = phone_number
    ? phone_number.slice(-4)
    : '----';

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        if (!user_id) return;
        try {
          const db = await getDBConnection();
          const s = await getUserStats(db, user_id);
          setStats(s);
        } catch (err) {
          console.error('Failed to load user stats:', err);
        }
      };
      loadStats();
    }, [user_id]),
  );

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out? Your data will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDBConnection();
              await setUserActive(db, null);
            } catch (err) {
              console.error('Logout DB error:', err);
            } finally {
              dispatch(authAction.logout());
              navigation.replace('Login');
            }
          },
        },
      ],
    );
  };

  const updateThemeInDB = async (field, value) => {
    try {
      const db = await getDBConnection();
      await db.executeSql(`UPDATE Users SET ${field} = ? WHERE id = ?`, [value, user_id]);
    } catch(e) {
      console.log('Error updating theme in DB', e);
    }
  };

  const handleColorSelect = (color) => {
    dispatch(themeAction.setThemeColor(color));
    updateThemeInDB('theme_color', color);
  };

  const handleModeSelect = (mode) => {
    dispatch(themeAction.setColorMode(mode));
    updateThemeInDB('color_mode', mode);
  };

  return (
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* User Identity Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLabel}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.phoneNumber}>+91 {phone_number || '----------'}</Text>
            <Text style={styles.memberSince}>OnePlace Member</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Target color={colors.primary} size={RFValue(18)} />
            </View>
            <Text style={styles.statNumber}>{stats.totalHabits}</Text>
            <Text style={styles.statLabel}>Habits</Text>
          </View>

          <View style={[styles.statCard, styles.statCardMiddle]}>
            <View style={styles.statIconWrap}>
              <Flame color="#F97316" size={RFValue(18)} />
            </View>
            <Text style={styles.statNumber}>{stats.bestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <CheckCircle2 color={colors.success} size={RFValue(18)} />
            </View>
            <Text style={styles.statNumber}>{stats.totalCompletions}</Text>
            <Text style={styles.statLabel}>Completions</Text>
          </View>
        </View>

        {/* Theme Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Application Theme</Text>
          <View style={styles.themeContainer}>
            <View style={styles.settingRow}>
              <View style={styles.settingLabelWrap}>
                <Palette color={colors.text} size={RFValue(18)} />
                <Text style={styles.settingLabel}>Theme Color</Text>
              </View>
              <View style={styles.colorPaletteRow}>
                {THEME_PALETTE.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => handleColorSelect(c)}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c },
                      themeColor === c && styles.colorSwatchActive
                    ]}
                  />
                ))}
              </View>
            </View>

            <View style={[styles.settingRow, styles.settingRowNoBorder]}>
              <View style={styles.settingLabelWrap}>
                <Moon color={colors.text} size={RFValue(18)} />
                <Text style={styles.settingLabel}>Appearance</Text>
              </View>
              <View style={styles.modeToggleRow}>
                {['system', 'light', 'dark'].map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => handleModeSelect(mode)}
                    style={[
                      styles.modeBtn,
                      colorMode === mode && { backgroundColor: colors.primary }
                    ]}
                  >
                    <Text style={[
                      styles.modeBtnText,
                      colorMode === mode && { color: WHITE }
                    ]}>
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* My Habits List */}
        {habits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Habits</Text>
            <View style={styles.habitList}>
              {habits.map(habit => (
                <TouchableOpacity
                  key={habit.id}
                  style={styles.habitRow}
                  onPress={() => navigation.navigate('HabitDetail', { habit })}
                >
                  <View style={styles.habitInfo}>
                    <Text style={styles.habitTitle} numberOfLines={1}>{habit.title}</Text>
                    <Text style={styles.habitMeta}>
                      {habit.category_name || 'Uncategorized'} • {habit.schedule_type}
                    </Text>
                  </View>
                  <View style={styles.habitRight}>
                    <View style={styles.streakBadge}>
                      <Flame color={WHITE} size={RFValue(11)} />
                      <Text style={styles.streakText}>{habit.streak || 0}</Text>
                    </View>
                    <ChevronRight color={colors.textSecondary} size={RFValue(16)} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No habits yet.</Text>
            <Text style={styles.emptySubText}>Create your first habit to get started!</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color={colors.danger} size={RFValue(18)} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(ProfileWithoutHoc));
