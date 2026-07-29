/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { GRAY9, PRIMARY_OS } from '../../constants/color';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import {
  Activity,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Coffee,
  Dumbbell,
  Flame,
  Heart,
  Moon,
  Smile,
  Target,
  Zap,
} from 'lucide-react-native';
import { logHabitCompletion, undoHabitCompletion } from '../../redux/Slice/HabitSlice';
import withLoader from '../../hoc/withLoader';
import styles from './Calendar.styles';

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

const getHabitIconAndColor = (habit) => {
  const bgIndex = habit.id ? Math.abs(habit.id) % PALETTE.length : 0;
  const habitColor = habit.color || PALETTE[bgIndex];

  let HabitIcon = ICON_MAP[habit.icon];
  if (!HabitIcon) {
    const titleLower = (habit.title || '').toLowerCase();
    const catLower = (habit.category_name || habit.category || '').toLowerCase();
    if (titleLower.includes('read') || titleLower.includes('book') || catLower.includes('read')) {
      HabitIcon = BookOpen;
    } else if (titleLower.includes('water') || titleLower.includes('health') || titleLower.includes('drink')) {
      HabitIcon = Heart;
    } else if (titleLower.includes('run') || titleLower.includes('walk') || titleLower.includes('gym') || titleLower.includes('workout') || titleLower.includes('fit')) {
      HabitIcon = Dumbbell;
    } else if (titleLower.includes('meditat') || titleLower.includes('mind') || titleLower.includes('sleep')) {
      HabitIcon = Smile;
    } else if (titleLower.includes('coffee') || titleLower.includes('tea')) {
      HabitIcon = Coffee;
    } else if (titleLower.includes('code') || titleLower.includes('work') || titleLower.includes('learn')) {
      HabitIcon = Zap;
    } else {
      HabitIcon = Target;
    }
  }

  return { habitColor, HabitIcon };
};

const CalendarWithoutHoc = ({ insets, navigation }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
  );
  const [filter, setFilter] = useState('All'); // 'All' | 'Due'
  const { habits } = useSelector(state => state.habits);
  const dispatch = useDispatch();

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
            markedDates[dateStr] = { marked: true, dotColor: PRIMARY_OS };
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
      selectedColor: PRIMARY_OS,
    };
  } else {
    markedDates[selectedDate] = { selected: true, selectedColor: PRIMARY_OS };
  }

  const isHabitScheduledForDate = (habit, dateStr) => {
    if (
      habit.schedule_type === 'Every Day' ||
      habit.scheduleType === 'Every Day'
    )
      return true;
    if (
      habit.schedule_type === 'Specific Days' ||
      habit.scheduleType === 'Specific Days'
    ) {
      const d = new Date(dateStr);
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayStr = days[d.getDay()];
      const val = habit.schedule_value || habit.scheduleValue || '';
      return val.includes(dayStr);
    }
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
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timeline</Text>
        <TouchableOpacity
          style={styles.todayBtn}
          onPress={() =>
            setSelectedDate(new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0])
          }
        >
          <Text style={styles.todayBtnText}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.calendarCard]}>
          <Calendar
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
                      isToday && !isSelected && { color: PRIMARY_OS },
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
              todayTextColor: PRIMARY_OS,
              arrowColor: PRIMARY_OS,
              textDayFontFamily: REGULAR,
              textMonthFontFamily: BOLD,
              textDayHeaderFontFamily: SEMIBOLD,
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
            <Text
              style={{
                fontFamily: REGULAR,
                color: GRAY9,
                fontSize: RFValue(12),
                marginTop: RFValue(10),
              }}
            >
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
                  style={styles.cardContainer}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View
                      style={{
                        width: RFValue(40),
                        height: RFValue(40),
                        borderRadius: RFValue(12),
                        backgroundColor: `${habitColor}20`,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: RFValue(12),
                      }}
                    >
                      <HabitIcon color={habitColor} size={RFValue(20)} />
                    </View>

                    <View style={styles.cardMiddle}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{habit.title}</Text>
                      <Text style={styles.cardSubtitle} numberOfLines={1}>
                        Streak: {habit.streak || 0} days
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#EF444415',
                        paddingHorizontal: RFValue(8),
                        paddingVertical: RFValue(3),
                        borderRadius: RFValue(8),
                        marginRight: RFValue(12),
                      }}
                    >
                      <Flame color="#EF4444" size={RFValue(12)} />
                      <Text style={{ fontFamily: BOLD, fontSize: RFValue(11), color: '#EF4444', marginLeft: 4 }}>
                        {habit.streak || 0}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      if (!habit.isCompleted) {
                        dispatch(
                          logHabitCompletion({
                            id: habit.id,
                            metric: habit.targetQuantity || 1,
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
