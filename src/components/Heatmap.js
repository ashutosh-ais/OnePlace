import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { GRAY9, INPUT_BORDER, PRIMARY_OS } from '../constants/color';
import { REGULAR } from '../constants/fontfamily';

// Generates an array of 52 weeks dynamically based on habit history
const generateHeatmapData = (habits) => {
  const weeks = [];
  const today = new Date();
  
  // Go back 364 days
  for (let w = 51; w >= 0; w--) {
    const days = [];
    for (let d = 6; d >= 0; d--) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - (w * 7 + d));
      const dateStr = new Date(pastDate.getTime() - pastDate.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      
      // Count completions across all habits for this date
      let completionsCount = 0;
      habits.forEach(habit => {
        if (habit.history && habit.history.some(h => h.date.startsWith(dateStr))) {
          completionsCount++;
        }
      });
      
      days.push(completionsCount);
    }
    weeks.push(days);
  }
  return weeks;
};

const Heatmap = ({ habits }) => {
  const data = React.useMemo(() => generateHeatmapData(habits || []), [habits]);
  const scrollRef = useRef(null);

  // Scroll to the end (most recent data) on mount
  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [data]);

  const getColor = (count) => {
    if (count === 0) return '#F3F4F6'; // Gray
    if (count === 1) return '#D1FAE5'; // Light green
    if (count === 2) return '#6EE7B7'; 
    if (count === 3) return '#34D399'; 
    return PRIMARY_OS; // Dark green
  };

  return (
    <View style={styles.container}>
      {/* Scrollable Graph */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
      >
        <View style={styles.graphContainer}>
          {data.map((week, wIndex) => (
            <View key={`week-${wIndex}`} style={styles.weekColumn}>
              {week.map((dayCount, dIndex) => (
                <View 
                  key={`day-${wIndex}-${dIndex}`} 
                  style={[styles.dayBlock, { backgroundColor: getColor(dayCount) }]} 
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Legend */}
      <View style={styles.legendRow}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendColors}>
          <View style={[styles.dayBlock, { backgroundColor: getColor(0) }]} />
          <View style={[styles.dayBlock, { backgroundColor: getColor(1) }]} />
          <View style={[styles.dayBlock, { backgroundColor: getColor(2) }]} />
          <View style={[styles.dayBlock, { backgroundColor: getColor(3) }]} />
          <View style={[styles.dayBlock, { backgroundColor: getColor(4) }]} />
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: RFValue(15),
    backgroundColor: '#FFFFFF',
    borderRadius: RFValue(12),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  graphContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  weekColumn: {
    marginRight: RFValue(3),
  },
  dayBlock: {
    width: RFValue(10),
    height: RFValue(10),
    borderRadius: RFValue(2),
    marginBottom: RFValue(3),
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: RFValue(10),
  },
  legendText: {
    fontFamily: REGULAR,
    fontSize: RFValue(10),
    color: GRAY9,
    marginHorizontal: RFValue(4),
  },
  legendColors: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Heatmap;
