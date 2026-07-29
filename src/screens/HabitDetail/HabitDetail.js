import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import withLoader from '../../hoc/withLoader';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Snowflake,
  MessageSquare,
  Calendar as CalendarIcon,
  X,
} from 'lucide-react-native';
import {
  PRIMARY_OS,
  WHITE,
  GRAY9,
  INPUT_BORDER,
  BLACK,
} from '../../constants/color';
import { RFValue } from 'react-native-responsive-fontsize';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import { Calendar } from 'react-native-calendars';
import {
  logHabitCompletion,
  undoHabitCompletion,
} from '../../redux/Slice/HabitSlice';
import ActionSheet from 'react-native-actions-sheet';

const { width: WIDTH } = Dimensions.get('window');

const HabitDetailWithoutHoc = ({ navigation, route, insets, setLoading }) => {
  const routeHabit = route.params?.habit || {};
  const dispatch = useDispatch();
  const { habits } = useSelector(state => state.habits);
  const habit = habits.find(h => h.id === routeHabit.id) || routeHabit;
  const actionSheetRef = useRef(null);
  const [isBackfilling, setIsBackfilling] = useState(false);

  const mainContainerStyles = {
    flex: 1,
    backgroundColor: WHITE,
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const [optimisticMarks, setOptimisticMarks] = useState({});

  useEffect(() => {
    setOptimisticMarks({});
  }, [habit?.history]);

  // Build marked dates for the calendar based on history
  const markedDates = React.useMemo(() => {
    const marks = {};
    if (habit?.history) {
      habit.history.forEach(entry => {
        marks[entry.date.split('T')[0]] = {
          selected: true,
          selectedColor:
            entry.status === 'completed'
              ? PRIMARY_OS
              : entry.status === 'missed'
              ? '#EF4444'
              : '#3B82F6',
        };
      });
    }
    Object.assign(marks, optimisticMarks);
    return marks;
  }, [habit?.history, optimisticMarks]);

  const handleDayPress = React.useCallback(
    async dateObj => {
      const dateStr = dateObj.dateString;
      const currentlyCompleted =
        markedDates[dateStr]?.selected &&
        markedDates[dateStr]?.selectedColor === PRIMARY_OS;

      setIsBackfilling(true);
      try {
        if (currentlyCompleted) {
          setOptimisticMarks(prev => ({
            ...prev,
            [dateStr]: { selected: false },
          }));
          await dispatch(
            undoHabitCompletion({ habitId: habit?.id, dateStr }),
          ).unwrap();
        } else {
          setOptimisticMarks(prev => ({
            ...prev,
            [dateStr]: { selected: true, selectedColor: PRIMARY_OS },
          }));
          await dispatch(
            logHabitCompletion({
              id: habit?.id,
              metric: habit?.targetQuantity || 1,
              mood: 'Good',
              notes: '',
              dateStr,
            }),
          ).unwrap();
        }
      } catch (err) {
        console.error('Failed to backfill:', err);
      } finally {
        setIsBackfilling(false);
      }
    },
    [dispatch, habit?.id, habit?.targetQuantity, markedDates],
  );

  const CustomDay = React.useCallback(
    ({ date, state, marking }) => {
      const isSelected = marking?.selected;
      const isMarked = marking?.marked;
      const isToday = state === 'today';
      const isDisabled = state === 'disabled';

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!isDisabled) handleDayPress(date);
          }}
          style={styles.customDayWrapper}
        >
          <View
            style={[
              styles.customDay,
              isSelected && styles.customDaySelected,
              isToday && !isSelected && styles.customDayToday,
            ]}
          >
            <Text
              style={[
                styles.customDayText,
                isSelected && styles.customDayTextSelected,
                isToday && !isSelected && styles.customDayTextToday,
                isDisabled && styles.customDayTextDisabled,
              ]}
            >
              {date.day}
            </Text>
            {isMarked && (
              <View
                style={[
                  styles.customDayDot,
                  isSelected && styles.customDayDotSelected,
                ]}
              />
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [handleDayPress],
  );

  if (!habit) return null;

  return (
    <View style={mainContainerStyles}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft color={BLACK} size={RFValue(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Habit Detail</Text>
        <TouchableOpacity
          onPress={() => actionSheetRef.current?.show()}
          style={styles.backBtn}
        >
          <CalendarIcon color={BLACK} size={RFValue(20)} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Habit Header Info */}
        <View style={styles.titleSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>
              {habit.category_name || habit.category}
            </Text>
          </View>
          <Text style={styles.habitTitle}>{habit.title}</Text>
          <Text style={styles.scheduleText}>
            {habit.schedule_type || habit.scheduleType} • Target:{' '}
            {habit.target_quantity || habit.targetQuantity} {habit.unit}
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>
              {habit.streak || habit.currentStreak || 0}{' '}
              <Text style={styles.statSub}>Days</Text>
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Success Rate</Text>
            <Text style={styles.statValue}>
              {habit.consistencyScore || 100}
              <Text style={styles.statSub}>%</Text>
            </Text>
          </View>
        </View>

        {/* Vertical Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History</Text>
          <View style={styles.timelineContainer}>
            {habit.history &&
              habit.history.map((entry, index) => {
                const isLast = index === habit.history.length - 1;
                return (
                  <View key={index} style={styles.timelineRow}>
                    {/* Timeline Line & Icon */}
                    <View style={styles.timelineIndicator}>
                      {entry.status === 'completed' && (
                        <CheckCircle2 color={PRIMARY_OS} size={RFValue(24)} />
                      )}
                      {entry.status === 'missed' && (
                        <XCircle color="#EF4444" size={RFValue(24)} />
                      )}
                      {entry.status === 'frozen' && (
                        <Snowflake color="#3B82F6" size={RFValue(24)} />
                      )}
                      {!isLast && (
                        <View
                          style={[
                            styles.timelineLine,
                            entry.status === 'completed'
                              ? { backgroundColor: PRIMARY_OS }
                              : {},
                          ]}
                        />
                      )}
                    </View>

                    {/* Timeline Content */}
                    <View style={styles.timelineContent}>
                      <View style={styles.timelineHeaderRow}>
                        <Text style={styles.timelineDate}>
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            timeZone: 'UTC',
                          })}
                        </Text>
                        <Text style={styles.timelineStatus}>
                          {entry.status.charAt(0).toUpperCase() +
                            entry.status.slice(1)}
                        </Text>
                      </View>
                      {entry.status === 'completed' && (
                        <Text style={styles.timelineMetric}>
                          Metric: {entry.metric} {habit.unit}
                        </Text>
                      )}
                      {!!entry.notes && (
                        <View style={styles.notesBox}>
                          <MessageSquare color={GRAY9} size={RFValue(14)} />
                          <Text style={styles.notesText}>{entry.notes}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
          </View>
        </View>
      </ScrollView>

      {/* Backfill Calendar Action Sheet */}
      <ActionSheet
        ref={actionSheetRef}
        // gestureEnabled={true}
        containerStyle={styles.actionSheetContainer}
      >
        <ScrollView
          contentContainerStyle={styles.actionSheetScroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Backfill History</Text>
            <TouchableOpacity onPress={() => actionSheetRef.current?.hide()}>
              <X color={GRAY9} size={RFValue(24)} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>
            Tap any date to mark it as completed or undo a completion. Your
            streak will be automatically recalculated.
          </Text>

          <View style={styles.calendarCard}>
            <Calendar
              markedDates={markedDates}
              dayComponent={CustomDay}
              theme={{
                todayTextColor: PRIMARY_OS,
                arrowColor: PRIMARY_OS,
                textDayFontFamily: REGULAR,
                textMonthFontFamily: BOLD,
                textDayHeaderFontFamily: SEMIBOLD,
                calendarBackground: 'transparent',
              }}
            />
            {isBackfilling && (
              <View style={styles.actionSheetOverlay}>
                <ActivityIndicator size="large" color={PRIMARY_OS} />
              </View>
            )}
          </View>
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

const DAY_SIZE = Math.floor((WIDTH * 0.1) / 2) * 2;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: RFValue(15),
    borderBottomWidth: 1,
    borderColor: INPUT_BORDER,
  },
  backBtn: {
    padding: RFValue(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(16), color: BLACK },
  content: {
    paddingHorizontal: '5%',
    paddingBottom: RFValue(40),
    paddingTop: RFValue(20),
  },
  titleSection: { alignItems: 'center', marginBottom: RFValue(30) },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(6),
    borderRadius: RFValue(20),
    marginBottom: RFValue(12),
  },
  categoryText: {
    color: PRIMARY_OS,
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
  },
  habitTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(22),
    color: BLACK,
    marginBottom: RFValue(8),
    textAlign: 'center',
  },
  scheduleText: { fontFamily: REGULAR, fontSize: RFValue(13), color: GRAY9 },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(30),
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: RFValue(12),
    padding: RFValue(16),
    marginHorizontal: RFValue(5),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(11),
    color: GRAY9,
    marginBottom: RFValue(8),
  },
  statValue: { fontFamily: BOLD, fontSize: RFValue(24), color: BLACK },
  statSub: { fontSize: RFValue(14), color: GRAY9, fontFamily: REGULAR },
  section: { marginBottom: RFValue(30) },
  sectionTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: BLACK,
    marginBottom: RFValue(20),
  },
  timelineContainer: { marginLeft: RFValue(10) },
  timelineRow: { flexDirection: 'row', minHeight: RFValue(70) },
  timelineIndicator: {
    alignItems: 'center',
    width: RFValue(30),
    marginRight: RFValue(15),
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: INPUT_BORDER,
    marginVertical: RFValue(4),
  },
  timelineContent: {
    flex: 1,
    paddingBottom: RFValue(30),
    paddingTop: RFValue(2),
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(4),
  },
  timelineDate: { fontFamily: BOLD, fontSize: RFValue(14), color: BLACK },
  timelineStatus: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: GRAY9 },
  timelineMetric: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: PRIMARY_OS,
    marginBottom: RFValue(8),
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: RFValue(10),
    borderRadius: RFValue(8),
    marginTop: RFValue(10),
  },
  notesText: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: GRAY9,
    marginLeft: RFValue(8),
    flex: 1,
  },

  calendarCard: {
    backgroundColor: WHITE,
    borderRadius: RFValue(16),
    position: 'relative', // for overlay
  },
  actionSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(16),
    zIndex: 10,
  },
  customDayWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  customDay: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: WIDTH * 0.01,
  },
  customDaySelected: {
    backgroundColor: PRIMARY_OS,
    shadowColor: PRIMARY_OS,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  customDayToday: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: PRIMARY_OS,
  },
  customDayText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: BLACK,
  },
  customDayTextSelected: {
    color: WHITE,
  },
  customDayTextToday: {
    color: PRIMARY_OS,
  },
  customDayTextDisabled: {
    color: '#D1D5DB', // light gray
  },
  customDayDot: {
    width: RFValue(4),
    height: RFValue(4),
    borderRadius: RFValue(2),
    backgroundColor: PRIMARY_OS,
    marginTop: RFValue(2),
    position: 'absolute',
    bottom: RFValue(4),
  },
  customDayDotSelected: {
    backgroundColor: WHITE,
  },

  actionSheetContainer: {
    borderTopLeftRadius: RFValue(24),
    borderTopRightRadius: RFValue(24),
    paddingBottom: RFValue(20),
  },
  actionSheetScroll: { padding: RFValue(20) },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(8),
  },
  modalTitle: { fontFamily: BOLD, fontSize: RFValue(18), color: '#111827' },
  modalSubtitle: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: GRAY9,
    marginBottom: RFValue(20),
  },
});

export default withLoader(withSafeAreaInsets(HabitDetailWithoutHoc));
