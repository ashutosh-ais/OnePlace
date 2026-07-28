import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  BLACK,
  GRAY9,
  INPUT_BORDER,
  PRIMARY_OS,
  WHITE,
} from '../constants/color';
import { BOLD, REGULAR } from '../constants/fontfamily';
import { HEIGHT } from '../constants/config';

// Generates an array of days for the current month dynamically from history
const generateMonthGrid = habits => {
  const days = [];
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  // Get total days in current month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDays = 35; // 5 weeks grid

  for (let i = 1; i <= totalDays; i++) {
    let status = 'empty';
    if (i <= totalDaysInMonth) {
      // Create date string YYYY-MM-DD
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
        i,
      ).padStart(2, '0')}`;

      // Count how many habits were completed on this date
      let completionsCount = 0;
      habits.forEach(habit => {
        if (
          habit.history &&
          habit.history.some(h => h.date.startsWith(dateStr))
        ) {
          completionsCount++;
        }
      });

      if (completionsCount === 0 && i <= today.getDate()) {
        status = 'missed';
      } else if (completionsCount > 0) {
        status = 'perfect'; // Simplified logic: if ANY habit completed, count as active day
      } else {
        status = 'empty'; // Future dates
      }
    }

    days.push({ day: i <= totalDaysInMonth ? i : '', status });
  }
  return days;
};

const MonthCalendar = ({ habits }) => {
  const grid = React.useMemo(() => generateMonthGrid(habits || []), [habits]);

  const getStatusColor = status => {
    switch (status) {
      case 'perfect':
        return PRIMARY_OS; // Green brand color
      case 'frozen':
        return '#F59E0B'; // Orange
      case 'missed':
        return '#EF4444'; // Red
      default:
        return '#F9FAFB'; // Empty gray
    }
  };

  const getTextColor = status => {
    return status === 'empty' ? GRAY9 : WHITE;
  };

  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  return (
    <View style={styles.container}>
      {/* Weekday Headers */}
      <View style={styles.row}>
        {weekDays.map((day, i) => (
          <View key={`header-${i}`} style={styles.headerCell}>
            <Text style={styles.headerText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Month Grid (5x7) */}
      <View style={styles.grid}>
        {grid.map((cell, i) => (
          <View
            key={`cell-${i}`}
            style={[
              styles.cell,
              { backgroundColor: getStatusColor(cell.status) },
            ]}
          >
            <Text
              style={[styles.cellText, { color: getTextColor(cell.status) }]}
            >
              {cell.day}
            </Text>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: PRIMARY_OS }]} />
          <Text style={styles.legendText}>Active</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Frozen</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>Missed</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    borderRadius: RFValue(12),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    padding: RFValue(16),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(10),
  },
  headerCell: {
    width: '13%',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: BOLD,
    fontSize: RFValue(12),
    color: BLACK,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: HEIGHT * 0.045,
    // aspectRatio: 1,
    height: HEIGHT * 0.045,
    borderRadius: HEIGHT * 0.045, // Make circular!
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2%',
  },
  cellText: {
    fontFamily: BOLD,
    fontSize: RFValue(12),
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: RFValue(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: RFValue(8),
  },
  dot: {
    width: RFValue(8),
    height: RFValue(8),
    borderRadius: RFValue(4),
    marginRight: RFValue(4),
  },
  legendText: {
    fontFamily: REGULAR,
    fontSize: RFValue(11),
    color: GRAY9,
  },
});

export default MonthCalendar;
