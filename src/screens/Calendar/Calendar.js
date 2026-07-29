/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { GRAY9, PRIMARY_OS, BLACK, WHITE } from '../../constants/color';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import { FilePlus, Check } from 'lucide-react-native';
import { logHabitCompletion, undoHabitCompletion } from '../../redux/Slice/HabitSlice';
import withLoader from '../../hoc/withLoader';
import styles from './Calendar.styles';

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
              const pastelColors = [
                '#FEE2E2',
                '#FEF3C7',
                '#D1FAE5',
                '#DBEAFE',
                '#F3E8FF',
                '#FCE7F3',
              ];
              const bgIndex = habit.id ? habit.id % pastelColors.length : 0;
              const iconBg = pastelColors[bgIndex];

              return (
                <View key={habit.id} style={styles.cardContainer}>
                  <View
                    style={[
                      styles.cardIconWrapper,
                      { backgroundColor: iconBg },
                    ]}
                  >
                    <Text style={styles.cardIconText}>
                      {habit.title.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.cardMiddle}>
                    <Text style={styles.cardTitle}>{habit.title}</Text>
                    <Text style={styles.cardSubtitle}>
                      Streak: {habit.streak || 0} days
                    </Text>
                  </View>
                  <View style={styles.cardRight}>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.btnDoc]}
                      onPress={() =>
                        navigation.navigate('HabitDetail', { habit })
                      }
                    >
                      <FilePlus color={BLACK} size={RFValue(16)} />
                    </TouchableOpacity>

                    {!habit.isCompleted ? (
                      <TouchableOpacity
                        style={[styles.actionBtn, styles.btnCheck]}
                        onPress={() => {
                          dispatch(
                            logHabitCompletion({
                              id: habit.id,
                              metric: habit.targetQuantity || 1,
                              mood: 'Good',
                              notes: '',
                              dateStr: selectedDate,
                            }),
                          );
                        }}
                      >
                        <Check color={BLACK} size={RFValue(18)} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.actionBtn,
                          { backgroundColor: '#D1FAE5' },
                        ]}
                        onPress={() => {
                          dispatch(
                            undoHabitCompletion({
                              habitId: habit.id,
                              dateStr: selectedDate,
                            }),
                          );
                        }}
                      >
                        <Check color={'#065F46'} size={RFValue(18)} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(CalendarWithoutHoc));
