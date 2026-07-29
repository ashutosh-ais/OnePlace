import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../theme/useTheme';

import {
  Activity,
  ArrowLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  MessageSquare,
  Pencil,
  Snowflake,
  X,
  XCircle,
} from 'lucide-react-native';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Calendar } from 'react-native-calendars';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { PRIMARY_OS } from '../../constants/color';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import withLoader from '../../hoc/withLoader';
import {
  logHabitCompletion,
  undoHabitCompletion,
} from '../../redux/Slice/HabitSlice';
import { ICON_MAP } from '../../constants/icons';
import getStyles from './HabitDetail.styles';

const HabitDetailWithoutHoc = ({ navigation, route, insets }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const routeHabit = route.params?.habit || {};
  const dispatch = useDispatch();
  const { habits } = useSelector(state => state.habits);
  const habit = habits.find(h => h.id === routeHabit.id) || routeHabit;
  const actionSheetRef = useRef(null);
  const [isBackfilling, setIsBackfilling] = useState(false);

  // Habit theming
  const habitColor = habit?.color || PRIMARY_OS;
  const HabitIcon = ICON_MAP[habit?.icon] || Activity;

  const mainContainerStyles = {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const [optimisticMarks, setOptimisticMarks] = useState({});

  useEffect(() => {
    setOptimisticMarks({});
  }, [habit?.history]);

  // Build marked dates — use habit color for completed entries
  const markedDates = React.useMemo(() => {
    const marks = {};
    if (habit?.history) {
      habit.history.forEach(entry => {
        marks[entry.date.split('T')[0]] = {
          selected: true,
          selectedColor:
            entry.status === 'completed'
              ? habitColor
              : entry.status === 'missed'
              ? '#EF4444'
              : '#3B82F6',
        };
      });
    }
    Object.assign(marks, optimisticMarks);
    return marks;
  }, [habit?.history, optimisticMarks, habitColor]);

  const handleDayPress = React.useCallback(
    async dateObj => {
      const dateStr = dateObj.dateString;
      const currentlyCompleted =
        markedDates[dateStr]?.selected &&
        markedDates[dateStr]?.selectedColor === habitColor;

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
            [dateStr]: { selected: true, selectedColor: habitColor },
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
    [dispatch, habit?.id, habit?.targetQuantity, markedDates, habitColor],
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
    [handleDayPress, styles],
  );

  if (!habit) return null;

  return (
    <View style={mainContainerStyles}>
      <FocusAwareStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ArrowLeft color={colors.text} size={RFValue(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Habit Detail</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditHabit', { habit })}
            style={styles.backBtn}
          >
            <Pencil color={habitColor} size={RFValue(18)} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => actionSheetRef.current?.show()}
            style={styles.backBtn}
          >
            <CalendarIcon color={colors.text} size={RFValue(20)} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Habit Header Info */}
        <View style={styles.titleSection}>
          <View style={[styles.iconCircle, { backgroundColor: habitColor }]}>
            <HabitIcon color={colors.surface} size={RFValue(28)} />
          </View>
          <View
            style={[
              styles.categoryBadge,
              {
                backgroundColor: `${habitColor}18`,
                borderColor: `${habitColor}40`,
              },
            ]}
          >
            <Text style={[styles.categoryText, { color: habitColor }]}>
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
                        <CheckCircle2 color={habitColor} size={RFValue(24)} />
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
                              ? { backgroundColor: habitColor }
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
                          <MessageSquare
                            color={colors.textSecondary}
                            size={RFValue(14)}
                          />
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
              <X color={colors.textSecondary} size={RFValue(24)} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSubtitle}>
            Tap any date to mark it as completed or undo a completion. Your
            streak will be automatically recalculated.
          </Text>

          <View style={styles.calendarCard}>
            <Calendar
              key={`${colors.background}-${colors.primary}-${isDark ? 'dark' : 'light'}`}
              markedDates={markedDates}
              dayComponent={CustomDay}
              theme={{
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
                textDayFontFamily: REGULAR,
                textMonthFontFamily: BOLD,
                textDayHeaderFontFamily: SEMIBOLD,
                calendarBackground: 'transparent',
                monthTextColor: colors.text,
                dayTextColor: colors.text,
                textDisabledColor: colors.textSecondary,
              }}
            />
            {isBackfilling && (
              <View style={styles.actionSheetOverlay}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </View>
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(HabitDetailWithoutHoc));
