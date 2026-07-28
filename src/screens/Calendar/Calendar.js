/* eslint-disable react-native/no-inline-styles */
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { STYLES } from '../../constants/config';
import withLoader from '../../hoc/withLoader';
import styles from './Calendar.styles';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
// Dummy dates for current month
const DATES = Array.from({ length: 31 }, (_, i) => ({
  day: i + 1,
  status:
    Math.random() > 0.8
      ? 'missed'
      : Math.random() > 0.2
      ? 'completed'
      : 'frozen',
}));

const CalendarWithoutHoc = ({ insets }) => {
  const [selectedDate, setSelectedDate] = useState(24);

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return '#10B981'; // GREEN
      case 'missed':
        return '#EF4444'; // RED
      case 'frozen':
        return '#3B82F6'; // BLUE
      default:
        return '#E5E7EB';
    }
  };

  return (
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timeline</Text>
        <TouchableOpacity style={styles.todayBtn}>
          <Text style={styles.todayBtnText}>Today</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Calendar Card */}
        <View style={[styles.calendarCard, STYLES.elevation]}>
          <View style={styles.monthSelector}>
            <TouchableOpacity>
              <Text style={styles.arrowText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthText}>October 2026</Text>
            <TouchableOpacity>
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekdaysRow}>
            {WEEKDAYS.map(day => (
              <Text key={day} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.datesGrid}>
            {DATES.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateCell,
                  selectedDate === item.day && styles.dateCellSelected,
                ]}
                onPress={() => setSelectedDate(item.day)}
              >
                <Text
                  style={[
                    styles.dateText,
                    selectedDate === item.day && styles.dateTextSelected,
                  ]}
                >
                  {item.day}
                </Text>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Selected Date Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>
            October {selectedDate} Overview
          </Text>

          <View style={[styles.habitRow, STYLES.elevation]}>
            <View style={styles.habitInfo}>
              <Text style={styles.habitTitle}>Morning Meditation</Text>
              <Text style={styles.habitMeta}>Completed • 07:15 AM</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#D1FAE5' }]}>
              <Text style={[styles.statusBadgeText, { color: '#065F46' }]}>
                Done
              </Text>
            </View>
          </View>

          <View style={[styles.habitRow, STYLES.elevation]}>
            <View style={styles.habitInfo}>
              <Text style={styles.habitTitle}>Read 20 Pages</Text>
              <Text style={styles.habitMeta}>
                Frozen (Token Used) • Recovered streak
              </Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#DBEAFE' }]}>
              <Text style={[styles.statusBadgeText, { color: '#1E40AF' }]}>
                Frozen
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(CalendarWithoutHoc));
