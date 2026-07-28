import React, { useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { markHabitCompleted } from '../../redux/Slice/HabitSlice';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { BACKGROUND, WHITE, PRIMARY_OS, GRAY9, INPUT_BORDER } from '../../constants/color';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import { RFValue } from 'react-native-responsive-fontsize';
import withLoader from '../../hoc/withLoader';
import { CheckCircle2, Circle, Flame, Target, User } from 'lucide-react-native';

const DashboardWithoutHoc = ({ navigation, insets, setLoading }) => {
  const dispatch = useDispatch();
  const { habits, loading } = useSelector(state => state.habits);
  const { name } = useSelector(state => state.auth);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  const mainContainerStylesWithInsets = {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const handleComplete = id => {
    dispatch(markHabitCompleted(id));
  };

  return (
    <View style={mainContainerStylesWithInsets}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor={BACKGROUND} />

      {/* Header Area */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, {name || 'Alex'}</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <User color={PRIMARY_OS} size={RFValue(20)} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Smart Streak Card - Flat Design */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreInfo}>
            <Text style={styles.scoreTitle}>Consistency Score</Text>
            <Text style={styles.scoreValue}>
              96<Text style={styles.scoreMax}>/100</Text>
            </Text>
            <Text style={styles.scoreSubtitle}>Top 5% of users this week</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Target color={PRIMARY_OS} size={RFValue(32)} />
          </View>
        </View>

        {/* Section: Today's Habits */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Schedule</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See Timeline</Text>
          </TouchableOpacity>
        </View>

        {habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Target color={GRAY9} size={RFValue(48)} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No habits found</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('CreateHabit')}>
              <Text style={styles.emptyBtnText}>Create your first habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          habits.map(habit => (
            <TouchableOpacity
              key={habit.id}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('HabitDetail', { id: habit.id })}
              style={styles.habitCard}
            >
              <View style={styles.habitMain}>
                <TouchableOpacity onPress={() => handleComplete(habit.id)}>
                  {/* Using Lucide Icons for Checkbox */}
                  {habit.completed_today ? (
                    <CheckCircle2 color={PRIMARY_OS} size={RFValue(24)} />
                  ) : (
                    <Circle color={GRAY9} size={RFValue(24)} />
                  )}
                </TouchableOpacity>
                <View style={styles.habitDetails}>
                  <Text style={[styles.habitTitle, habit.completed_today && styles.habitTitleCompleted]}>
                    {habit.title}
                  </Text>
                  <Text style={styles.habitMeta}>
                    {habit.schedule_type || 'Daily'} • {habit.category_name}
                  </Text>
                </View>
              </View>
              <View style={styles.streakBadge}>
                <Flame color="#EF4444" size={RFValue(14)} />
                <Text style={styles.streakText}>{habit.streak}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(10),
    paddingBottom: RFValue(20),
  },
  greeting: {
    fontFamily: BOLD,
    fontSize: RFValue(22),
    color: '#111827',
  },
  dateText: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: GRAY9,
    marginTop: RFValue(4),
  },
  profileBtn: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    backgroundColor: '#E0E7FF', // Light blue tint
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(100),
  },
  scoreCard: {
    backgroundColor: WHITE,
    borderRadius: RFValue(16),
    padding: RFValue(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RFValue(24),
    // Removed all shadows for a crisp flat look
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  scoreInfo: { flex: 1 },
  scoreTitle: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: GRAY9, marginBottom: RFValue(4) },
  scoreValue: { fontFamily: BOLD, fontSize: RFValue(28), color: '#111827', marginBottom: RFValue(4) },
  scoreMax: { fontSize: RFValue(16), color: GRAY9 },
  scoreSubtitle: { fontFamily: REGULAR, fontSize: RFValue(11), color: PRIMARY_OS },
  scoreCircle: {
    width: RFValue(60),
    height: RFValue(60),
    borderRadius: RFValue(30),
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(16),
  },
  sectionTitle: { fontFamily: BOLD, fontSize: RFValue(16), color: '#111827' },
  seeAllText: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: PRIMARY_OS },
  habitCard: {
    backgroundColor: WHITE,
    borderRadius: RFValue(12),
    padding: RFValue(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RFValue(12),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  habitMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  habitDetails: { marginLeft: RFValue(12), flex: 1 },
  habitTitle: { fontFamily: SEMIBOLD, fontSize: RFValue(14), color: '#111827', marginBottom: RFValue(2) },
  habitTitleCompleted: { textDecorationLine: 'line-through', color: GRAY9 },
  habitMeta: { fontFamily: REGULAR, fontSize: RFValue(11), color: GRAY9 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(8),
  },
  streakText: { fontFamily: BOLD, fontSize: RFValue(11), color: '#EF4444', marginLeft: RFValue(4) },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: RFValue(40),
  },
  emptyText: {
    fontFamily: REGULAR,
    fontSize: RFValue(14),
    color: GRAY9,
    marginTop: RFValue(12),
    marginBottom: RFValue(16),
  },
  emptyBtn: {
    backgroundColor: PRIMARY_OS,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(10),
    borderRadius: RFValue(8),
  },
  emptyBtnText: {
    color: WHITE,
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
  },
});

const Dashboard = withLoader(withSafeAreaInsets(DashboardWithoutHoc));
export default Dashboard;
