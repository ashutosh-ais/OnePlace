import React, { useState, useCallback, useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View, Alert } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import withLoader from '../../hoc/withLoader';
import getStyles from './Profile.styles';
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Coffee,
  Dumbbell,
  Flame,
  Heart,
  LogOut,
  Moon,
  Palette,
  Smile,
  Target,
  Zap,
} from 'lucide-react-native';
import { WHITE } from '../../constants/color';
import { RFValue } from 'react-native-responsive-fontsize';
import { WIDTH } from '../../constants/config';
import { authAction } from '../../redux/Slice/AuthSlice';
import { themeAction } from '../../redux/Slice/ThemeSlice';
import {
  getDBConnection,
  getUserStats,
  setUserActive,
} from '../../database/DatabaseHelper';
import { useTheme } from '../../theme/useTheme';
import { THEME_PALETTE } from '../../theme/Theme';

const ICON_MAP = {
  Activity,
  Dumbbell,
  BookOpen,
  Coffee,
  Moon,
  Smile,
  Target,
  Award,
  Heart,
  Zap,
};

const PALETTE = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#F97316',
  '#6366F1',
];

const getHabitIconAndColor = habit => {
  const bgIndex = habit.id ? Math.abs(habit.id) % PALETTE.length : 0;
  const habitColor = habit.color || PALETTE[bgIndex];

  let HabitIcon = ICON_MAP[habit.icon];
  if (!HabitIcon) {
    const titleLower = (habit.title || '').toLowerCase();
    const catLower = (
      habit.category_name ||
      habit.category ||
      ''
    ).toLowerCase();
    if (
      titleLower.includes('read') ||
      titleLower.includes('book') ||
      catLower.includes('read')
    ) {
      HabitIcon = BookOpen;
    } else if (
      titleLower.includes('water') ||
      titleLower.includes('health') ||
      titleLower.includes('drink')
    ) {
      HabitIcon = Heart;
    } else if (
      titleLower.includes('run') ||
      titleLower.includes('walk') ||
      titleLower.includes('gym') ||
      titleLower.includes('workout') ||
      titleLower.includes('fit')
    ) {
      HabitIcon = Dumbbell;
    } else if (
      titleLower.includes('meditat') ||
      titleLower.includes('mind') ||
      titleLower.includes('sleep')
    ) {
      HabitIcon = Smile;
    } else if (titleLower.includes('coffee') || titleLower.includes('tea')) {
      HabitIcon = Coffee;
    } else if (
      titleLower.includes('code') ||
      titleLower.includes('work') ||
      titleLower.includes('learn')
    ) {
      HabitIcon = Zap;
    } else {
      HabitIcon = Target;
    }
  }

  return { habitColor, HabitIcon };
};

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

  const avatarLabel = phone_number ? phone_number.slice(-4) : '----';

  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        if (!user_id) return;
        try {
          const db = await getDBConnection();
          const s = await getUserStats(db, user_id);
          setStats(s);
        } catch (err) {
          console.log('Error loading stats:', err);
        }
      };
      loadStats();
    }, [user_id]),
  );

  const bestStreakValue =
    stats && stats.bestStreak !== undefined && stats.bestStreak !== 0
      ? stats.bestStreak
      : habits.length > 0
      ? Math.max(...habits.map(h => h.streak || 0), 0)
      : 0;

  const totalHabitsValue =
    stats && stats.totalHabits ? stats.totalHabits : habits.length;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const db = await getDBConnection();
              await setUserActive(db, null);
            } catch (err) {
              console.log('Error clearing active user:', err);
            }
            dispatch(authAction.logout());
          },
        },
      ],
      { cancelable: true },
    );
  };

  const updateThemeInDB = async (field, value) => {
    try {
      const db = await getDBConnection();
      await db.executeSql(`UPDATE Users SET ${field} = ? WHERE id = ?`, [
        value,
        user_id,
      ]);
    } catch (e) {
      console.log('Error updating theme in DB', e);
    }
  };

  const handleColorSelect = color => {
    dispatch(themeAction.setThemeColor(color));
    updateThemeInDB('theme_color', color);
  };

  const handleModeSelect = mode => {
    dispatch(themeAction.setColorMode(mode));
    updateThemeInDB('color_mode', mode);
  };

  return (
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* User Identity Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{avatarLabel}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.phoneNumber}>
              +91 {phone_number || '----------'}
            </Text>
            <Text style={styles.memberSince}>OnePlace Member</Text>
          </View>
        </View>

        {/* Stats Row (Full Background Watermark Icons) */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.bgIconWrap}>
              <Target
                color={colors.primary}
                size={RFValue(68)}
                strokeWidth={1.5}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{totalHabitsValue}</Text>
              <Text style={styles.statLabel}>Habits</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.bgIconWrap}>
              <Flame color="#EF4444" size={RFValue(68)} strokeWidth={1.5} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>{bestStreakValue}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.bgIconWrap}>
              <CheckCircle2
                color={colors.success}
                size={RFValue(68)}
                strokeWidth={1.5}
              />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statNumber}>
                {stats.totalCompletions || 0}
              </Text>
              <Text style={styles.statLabel}>Completions</Text>
            </View>
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
                {THEME_PALETTE.map(c => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => handleColorSelect(c)}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: c },
                      themeColor === c && styles.colorSwatchActive,
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
                {['system', 'light', 'dark'].map(mode => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => handleModeSelect(mode)}
                    style={[
                      styles.modeBtn,
                      colorMode === mode && { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modeBtnText,
                        colorMode === mode && { color: WHITE },
                      ]}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* My Habits List (Agenda View Tile Style) */}
        {habits.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Habits</Text>
            <View style={styles.habitList}>
              {habits.map(habit => {
                const { habitColor, HabitIcon } = getHabitIconAndColor(habit);
                return (
                  <TouchableOpacity
                    key={habit.id}
                    activeOpacity={0.8}
                    style={styles.habitCard}
                    onPress={() =>
                      navigation.navigate('HabitDetail', { habit })
                    }
                  >
                    <View style={styles.habitMain}>
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: `${habitColor}20` },
                        ]}
                      >
                        <HabitIcon color={habitColor} size={WIDTH * 0.06} />
                      </View>

                      <View style={styles.habitDetails}>
                        <Text style={styles.habitTitle} numberOfLines={1}>
                          {habit.title}
                        </Text>
                        <Text style={styles.habitMeta} numberOfLines={1}>
                          {habit.category_name || habit.category || 'Habit'}
                          {habit.schedule_type
                            ? ` • ${habit.schedule_type}`
                            : ''}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.habitRight}>
                      <View style={styles.streakBadge}>
                        <Flame color="#EF4444" size={RFValue(12)} />
                        <Text style={styles.streakText}>
                          {habit.streak || 0}
                        </Text>
                      </View>
                      <ChevronRight
                        color={colors.textSecondary}
                        size={RFValue(16)}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {habits.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No habits yet.</Text>
            <Text style={styles.emptySubText}>
              Create your first habit to get started!
            </Text>
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
