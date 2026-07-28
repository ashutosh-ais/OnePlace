/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { GRAY9, PRIMARY_OS } from '../../constants/color';
import { STYLES } from '../../constants/config';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import withLoader from '../../hoc/withLoader';
import styles from './Calendar.styles';

const CalendarWithoutHoc = ({ insets }) => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const { habits } = useSelector(state => state.habits);

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

  // Get habits completed on selected date
  const habitsOnSelectedDate = habits.filter(habit => {
    if (!habit.history) return false;
    return habit.history.some(
      entry =>
        entry.date.startsWith(selectedDate) && entry.status === 'completed',
    );
  });

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
            setSelectedDate(new Date().toISOString().split('T')[0])
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

          {habitsOnSelectedDate.length === 0 ? (
            <Text
              style={{
                fontFamily: REGULAR,
                color: GRAY9,
                fontSize: RFValue(12),
                marginTop: RFValue(10),
              }}
            >
              No habits completed on this date.
            </Text>
          ) : (
            habitsOnSelectedDate.map(habit => (
              <View key={habit.id} style={[styles.habitRow]}>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <Text style={styles.habitMeta}>
                    {habit.category_name || habit.category}
                  </Text>
                </View>
                <View
                  style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}
                >
                  <Text style={[styles.statusBadgeText, { color: '#065F46' }]}>
                    Done
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(CalendarWithoutHoc));
