/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-shadow */
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
  TextInput,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Calendar } from 'react-native-calendars';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { PRIMARY_OS } from '../../constants/color';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import { Circle, Flame } from 'lucide-react-native';
import withLoader from '../../hoc/withLoader';
import {
  logHabitCompletion,
  undoHabitCompletion,
  toggleSubtask,
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
  const completeActionSheetRef = useRef(null);
  const [isBackfilling, setIsBackfilling] = useState(false);

  // States for completion modal
  const [metric, setMetric] = useState(
    habit?.target_quantity?.toString() || '1',
  );
  const [mood, setMood] = useState('Good');
  const [notes, setNotes] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);

  // Use the date passed from Dashboard; fall back to today if opened directly
  const todayStr = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .split('T')[0];
  const selectedDate = route.params?.selectedDate || todayStr;
  const isToday = selectedDate === todayStr;

  // Human-readable label for the selected date
  const selectedDateLabel = isToday
    ? 'Today'
    : new Date(
        selectedDate + 'T00:00:00', // force local parse
      ).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

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
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Habit Detail</Text>
          <Text
            style={[
              styles.scheduleText,
              { marginTop: RFValue(2), fontSize: RFValue(11) },
            ]}
          >
            {selectedDateLabel}
          </Text>
        </View>
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

          {/* Visual Schedule Render */}
          {!habit.schedule_type || habit.schedule_type === 'Every Day' ? (
            <Text style={styles.scheduleText}>
              Every Day • Target:{' '}
              {habit.target_quantity || habit.targetQuantity} {habit.unit}
            </Text>
          ) : (
            <>
              <Text style={styles.scheduleText}>
                Target: {habit.target_quantity || habit.targetQuantity}{' '}
                {habit.unit}
              </Text>

              <View style={styles.scheduleVisualContainer}>
                {(habit.schedule_type === 'Specific Days of Week' ||
                  habit.schedule_type === 'Specific Days') &&
                  ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
                    const isActive = (habit.schedule_value || '').includes(day);
                    return (
                      <View
                        key={day}
                        style={[
                          styles.scheduleDayCircle,
                          isActive && {
                            backgroundColor: habitColor,
                            borderColor: habitColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.scheduleDayText,
                            isActive && styles.scheduleDayActiveText,
                          ]}
                        >
                          {day[0]}
                        </Text>
                      </View>
                    );
                  })}

                {habit.schedule_type === 'Specific Days of Month' &&
                  (habit.schedule_value || '')
                    .split(',')
                    .map(d => d.trim())
                    .slice(0, 7)
                    .map((dayNum, i, arr) => (
                      <View
                        key={dayNum}
                        style={[
                          styles.scheduleDayCircle,
                          {
                            backgroundColor: habitColor,
                            borderColor: habitColor,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.scheduleDayText,
                            styles.scheduleDayActiveText,
                          ]}
                        >
                          {dayNum}
                        </Text>
                        {i === 6 &&
                          arr.length <
                            (habit.schedule_value || '').split(',').length && (
                            <Text
                              style={[
                                styles.scheduleDayText,
                                { marginLeft: 4 },
                              ]}
                            >
                              +
                            </Text>
                          )}
                      </View>
                    ))}

                {habit.schedule_type === 'Some Days per Period' && (
                  <View style={styles.schedulePeriodBadge}>
                    <Text style={styles.schedulePeriodText}>
                      {(habit.schedule_value || '').replace('/', ' times / ')}
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
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

        {/* Inline Checklist */}
        {habit.checklists && habit.checklists.length > 0 && (
          <View style={styles.checklistContainer}>
            {habit.checklists.map((item, idx) => {
              const currentCompleted =
                habit.checklist_progress &&
                habit.checklist_progress[selectedDate]
                  ? [...habit.checklist_progress[selectedDate]]
                  : [];
              const isChecked = currentCompleted.includes(idx);
              const isLast = idx === habit.checklists.length - 1;

              return (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  style={[
                    styles.checklistItem,
                    isLast && styles.checklistItemLast,
                  ]}
                  onPress={() => {
                    // Optimistic state calculation to avoid race conditions
                    let nextCompleted;
                    if (!isChecked) {
                      nextCompleted = [...currentCompleted, idx];
                    } else {
                      nextCompleted = currentCompleted.filter(i => i !== idx);
                    }

                    dispatch(
                      toggleSubtask({
                        habitId: habit.id,
                        dateStr: selectedDate,
                        subtaskIndex: idx,
                        isCompleted: !isChecked,
                      }),
                    );

                    // If all tasks are now complete and the habit wasn't fully completed for today yet
                    if (
                      nextCompleted.length === habit.checklists.length &&
                      !habit.is_completed_on_date
                    ) {
                      setTimeout(() => {
                        completeActionSheetRef.current?.show();
                      }, 150);
                    }
                  }}
                >
                  {isChecked ? (
                    <CheckCircle2 color={habitColor} size={RFValue(20)} />
                  ) : (
                    <Circle color={`${habitColor}60`} size={RFValue(20)} />
                  )}
                  <Text
                    style={[
                      styles.checklistText,
                      isChecked && styles.checklistTextCompleted,
                    ]}
                  >
                    {item.title || item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
              key={`${colors.background}-${colors.primary}-${
                isDark ? 'dark' : 'light'
              }`}
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

      {/* Complete Habit Action Sheet */}
      <ActionSheet
        ref={completeActionSheetRef}
        containerStyle={styles.actionSheetContainer}
        keyboardHandlerEnabled={true}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Complete Habit</Text>
            <TouchableOpacity
              onPress={() => completeActionSheetRef.current?.hide()}
              style={styles.sheetCloseBtn}
            >
              <X color={colors.textSecondary} size={RFValue(24)} />
            </TouchableOpacity>
          </View>

          <View style={styles.sheetContent}>
            {/* Habit Summary */}
            <View style={styles.habitItemContainer}>
              <View
                style={[
                  styles.habitIconBg,
                  { backgroundColor: `${habitColor}15` },
                ]}
              >
                <HabitIcon color={habitColor} size={RFValue(22)} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.habitItemTitle} numberOfLines={1}>
                  {habit.title}
                </Text>
                <Text style={styles.habitItemSub}>
                  {habit.category_name || habit.category}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Flame color="#EF4444" size={RFValue(14)} />
                <Text
                  style={{
                    fontFamily: BOLD,
                    fontSize: RFValue(14),
                    color: '#EF4444',
                    marginLeft: 4,
                  }}
                >
                  {habit.streak || habit.currentStreak || 0}
                </Text>
              </View>
            </View>

            {/* Metric Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Metric</Text>
              <View style={styles.metricInputContainer}>
                <TextInput
                  style={styles.metricInput}
                  value={metric}
                  onChangeText={setMetric}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
                <Text style={styles.metricUnit}>{habit.unit}</Text>
              </View>
            </View>

            {/* Mood Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mood</Text>
              <View style={styles.moodContainer}>
                {['Good', 'Neutral', 'Bad'].map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.moodBtn, mood === m && styles.moodBtnActive]}
                    onPress={() => setMood(m)}
                  >
                    <Text
                      style={[
                        styles.moodText,
                        mood === m && styles.moodTextActive,
                      ]}
                    >
                      {m}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Notes Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="How did it go?"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={styles.saveBtn}
              disabled={isCompleting}
              onPress={async () => {
                if (!metric) return;
                setIsCompleting(true);
                try {
                  await dispatch(
                    logHabitCompletion({
                      id: habit.id,
                      metric: Number(metric),
                      mood,
                      notes,
                      dateStr: selectedDate,
                    }),
                  ).unwrap();
                  completeActionSheetRef.current?.hide();
                } catch (err) {
                  console.error('Failed to log completion:', err);
                } finally {
                  setIsCompleting(false);
                }
              }}
            >
              {isCompleting ? (
                <ActivityIndicator color={colors.surface} />
              ) : (
                <Text style={styles.saveBtnText}>Save Completion</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ActionSheet>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(HabitDetailWithoutHoc));
