import React, { useState, useCallback } from 'react';
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
import styles from './Profile.styles';
import {
  CheckCircle2,
  Flame,
  Target,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { GRAY9, PRIMARY_OS, WHITE } from '../../constants/color';
import { RFValue } from 'react-native-responsive-fontsize';
import { authAction } from '../../redux/Slice/AuthSlice';
import { getDBConnection, getUserStats, setUserActive } from '../../database/DatabaseHelper';

const ProfileWithoutHoc = ({ navigation, insets }) => {
  const dispatch = useDispatch();
  const { habits } = useSelector(state => state.habits);
  const { phone_number, user_id } = useSelector(state => state.auth);

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

  // Compute avatar initials from last 4 digits of phone
  const avatarLabel = phone_number
    ? phone_number.slice(-4)
    : '----';

  // Load real stats from SQLite
  useFocusEffect(
    useCallback(() => {
      const loadStats = async () => {
        if (!user_id) {
          return;
        }
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
              // Clear persisted session from SQLite
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

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrap}>
              <Target color={PRIMARY_OS} size={RFValue(18)} />
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
              <CheckCircle2 color="#10B981" size={RFValue(18)} />
            </View>
            <Text style={styles.statNumber}>{stats.totalCompletions}</Text>
            <Text style={styles.statLabel}>Completions</Text>
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
                    <Text style={styles.habitTitle} numberOfLines={1}>
                      {habit.title}
                    </Text>
                    <Text style={styles.habitMeta}>
                      {habit.category_name || 'Uncategorized'} •{' '}
                      {habit.schedule_type}
                    </Text>
                  </View>
                  <View style={styles.habitRight}>
                    <View style={styles.streakBadge}>
                      <Flame color={WHITE} size={RFValue(11)} />
                      <Text style={styles.streakText}>
                        {habit.streak || 0}
                      </Text>
                    </View>
                    <ChevronRight color={GRAY9} size={RFValue(16)} />
                  </View>
                </TouchableOpacity>
              ))}
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

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut color="#EF4444" size={RFValue(18)} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(ProfileWithoutHoc));
