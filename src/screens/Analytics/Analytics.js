import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import Heatmap from '../../components/Heatmap';
import MonthCalendar from '../../components/MonthCalendar';
import { BLACK, GRAY9, INPUT_BORDER, WHITE } from '../../constants/color';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import withLoader from '../../hoc/withLoader';

const AnalyticsWithoutHoc = ({ insets }) => {
  const { freezeTokens, habits } = useSelector(state => state.habits);

  const mainContainerStyles = {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  return (
    <View style={mainContainerStyles}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights & Analytics</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Annual Heatmap */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Annual Contribution</Text>
          <Heatmap habits={habits} />
        </View>

        {/* Custom Aesthetic Month Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <MonthCalendar habits={habits} />
        </View>

        {/* Metrics Grid (2x2 Flat Design) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statBoxTitle}>Total Completions</Text>
              <Text style={styles.statBoxValue}>823</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxTitle}>Longest Streak</Text>
              <Text style={styles.statBoxValue}>
                146 <Text style={styles.statUnit}>Days</Text>
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxTitle}>Perfect Weeks</Text>
              <Text style={styles.statBoxValue}>12</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statBoxTitle}>Freeze Tokens</Text>
              <Text style={styles.statBoxValue}>
                {freezeTokens} <Text style={styles.statUnit}>Left</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(15),
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(22),
    color: BLACK,
  },
  content: {
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(100),
  },
  section: {
    marginBottom: RFValue(24),
  },
  sectionTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: BLACK,
    marginBottom: RFValue(12),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: WHITE,
    borderRadius: RFValue(12),
    padding: RFValue(16),
    marginBottom: RFValue(12),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  statBoxTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(11),
    color: GRAY9,
    marginBottom: RFValue(6),
  },
  statBoxValue: {
    fontFamily: BOLD,
    fontSize: RFValue(22),
    color: BLACK,
  },
  statUnit: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: GRAY9,
  },
});

export default withLoader(withSafeAreaInsets(AnalyticsWithoutHoc));
