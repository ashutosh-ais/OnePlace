/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useMemo, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../theme/useTheme';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { WIDTH } from '../../constants/config';
import { CheckCircle2, Circle, Flame } from 'lucide-react-native';
import {
  initializeDatabase,
  logHabitCompletion,
  undoHabitCompletion,
} from '../../redux/Slice/HabitSlice';
import { getHabitIconAndColor } from '../../constants/icons';
import withLoader from '../../hoc/withLoader';
import getStyles from './Calendar.styles';

const CalendarWithoutHoc = ({ insets, navigation }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0],
  );
  const [filter, setFilter] = useState('All'); // 'All' | 'Due'
  const { habits } = useSelector(state => state.habits);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      dispatch(initializeDatabase());
    }, [dispatch]),
  );

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  // Build marked dates
  const markedDates = {};
  habits.forEach(habit => {
    if (habit.history) {
      habit.history.forEach(entry => {
        if (entry.status === 'completed') {
          const dateStr = entry.date.split('T')[0];
          if (!markedDates[dateStr]) {
            markedDates[dateStr] = { marked: true, dotColor: colors.primary };
          }
        }
      });
    }
  });

  // Ensure selected date overrides or merges with marked
  if (markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: colors.primary,
    };
  } else {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: colors.primary,
    };
  }

  const isHabitScheduledForDate = (habit, dateStr) => {
    const scheduleType = habit.schedule_type || habit.scheduleType;
    const scheduleValue = habit.schedule_value || habit.scheduleValue || '';

    // Every Day (or no schedule type set) — always show
    if (!scheduleType || scheduleType === 'Every Day') return true;

    // Parse the date string (YYYY-MM-DD) safely using UTC to avoid timezone shifts
    const parts = dateStr.split('-');
    if (parts.length !== 3) return true;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const d = new Date(Date.UTC(year, month, day));

    // Specific Days of Week (legacy "Specific Days" and new "Specific Days of Week")
    if (
      scheduleType === 'Specific Days' ||
      scheduleType === 'Specific Days of Week'
    ) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[d.getUTCDay()];
      return scheduleValue.includes(dayName);
    }

    // Specific Days of Month — show only on selected day numbers
    if (scheduleType === 'Specific Days of Month') {
      const dayOfMonth = d.getUTCDate().toString();
      return scheduleValue.split(',').map(s => s.trim()).includes(dayOfMonth);
    }

    // Some Days per Period — always show (user decides day-by-day within the period)
    if (scheduleType === 'Some Days per Period') return true;

    // Default fallback — show
    return true;
  };

  const scheduledHabits = habits.filter(h =>
    isHabitScheduledForDate(h, selectedDate),
  );

  const allList = scheduledHabits.map(habit => {
    const isCompleted =
      habit.history &&
      habit.history.some(
        entry =>
          entry.date.startsWith(selectedDate) && entry.status === 'completed',
      );
    return { ...habit, isCompleted };
  });

  const dueList = allList.filter(h => !h.isCompleted);
  const displayList = filter === 'All' ? allList : dueList;

  const selectedDateObj = new Date(selectedDate);
  const displayDate = selectedDateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timeline</Text>
        <TouchableOpacity
          style={styles.todayBtn}
          onPress={() =>
            setSelectedDate(
              new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
                .toISOString()
                .split('T')[0],
            )
          }
        >
          <Text style={styles.todayBtnText}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.calendarCard}>
          <Calendar
            key={`${colors.background}-${colors.primary}-${isDark ? 'dark' : 'light'}`}
            current={selectedDate}
            markedDates={markedDates}
            dayComponent={({ date, state, marking }) => {
              const isSelected = marking?.selected;
              const isMarked = marking?.marked;
              const isToday = state === 'today';
              const isDisabled = state === 'disabled';

              return (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    if (!isDisabled) setSelectedDate(date.dateString);
                  }}
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
                </TouchableOpacity>
              );
            }}
            theme={{
              backgroundColor: colors.surface,
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textSecondary,
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.surface,
              todayTextColor: colors.primary,
              dayTextColor: colors.text,
              textDisabledColor: colors.border,
              dotColor: colors.primary,
              selectedDotColor: colors.surface,
              arrowColor: colors.primary,
              monthTextColor: colors.text,
            }}
          />
        </View>

        {/* Selected Date Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>{displayDate} Overview</Text>

          {/* Filter Chips */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.chip, filter === 'All' && styles.chipSelected]}
              onPress={() => setFilter('All')}
            >
              <Text
                style={[
                  styles.chipText,
                  filter === 'All' && styles.chipTextSelected,
                ]}
              >
                All ({allList.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, filter === 'Due' && styles.chipSelected]}
              onPress={() => setFilter('Due')}
            >
              <Text
                style={[
                  styles.chipText,
                  filter === 'Due' && styles.chipTextSelected,
                ]}
              >
                Due ({dueList.length})
              </Text>
            </TouchableOpacity>
          </View>

          {displayList.length === 0 ? (
            <Text style={styles.emptyText}>
              No habits {filter === 'Due' ? 'due' : 'scheduled'} for this date.
            </Text>
          ) : (
            displayList.map(habit => {
              const { habitColor, HabitIcon } = getHabitIconAndColor(habit);

              return (
                <TouchableOpacity
                  key={habit.id}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('HabitDetail', { habit })}
                  style={styles.habitCard}
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
                      <Text
                        style={[
                          styles.habitTitle,
                          habit.isCompleted && styles.habitTitleCompleted,
                        ]}
                        numberOfLines={2}
                      >
                        {habit.title}
                      </Text>
                      <Text style={styles.habitMeta} numberOfLines={1}>
                        {habit.category_name || habit.category || 'Habit'}{' '}
                        {habit.targetQuantity || habit.target_quantity
                          ? `• ${habit.targetQuantity || habit.target_quantity} ${habit.unit || ''}`
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

                    <TouchableOpacity
                      onPress={() => {
                        if (!habit.isCompleted) {
                          dispatch(
                            logHabitCompletion({
                              id: habit.id,
                              metric: habit.targetQuantity || habit.target_quantity || 1,
                              mood: 'Good',
                              notes: '',
                              dateStr: selectedDate,
                            }),
                          );
                        } else {
                          dispatch(
                            undoHabitCompletion({
                              habitId: habit.id,
                              dateStr: selectedDate,
                            }),
                          );
                        }
                      }}
                    >
                      {habit.isCompleted ? (
                        <CheckCircle2 color={habitColor} size={RFValue(24)} />
                      ) : (
                        <Circle color={`${habitColor}60`} size={RFValue(24)} />
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(CalendarWithoutHoc));
