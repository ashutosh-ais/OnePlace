import { ScrollView, Text, View } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { STYLES } from '../../constants/config';
import withLoader from '../../hoc/withLoader';
import styles from './Analytics.styles';

const AnalyticsWithoutHoc = ({ insets }) => {
  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  return (
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights & Analytics</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Momentum Score Board */}
        <View style={[styles.mainScoreCard, STYLES.elevation]}>
          <Text style={styles.mainScoreTitle}>Lifetime Consistency</Text>
          <Text style={styles.mainScoreValue}>89%</Text>
          <Text style={styles.insightText}>
            "You haven't missed a Monday workout in 11 weeks. Don't break that
            today."
          </Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, STYLES.elevation]}>
            <Text style={styles.statBoxTitle}>Total Completed</Text>
            <Text style={styles.statBoxValue}>823</Text>
          </View>
          <View style={[styles.statBox, STYLES.elevation]}>
            <Text style={styles.statBoxTitle}>Longest Streak</Text>
            <Text style={styles.statBoxValue}>
              {/* eslint-disable-next-line react-native/no-inline-styles */}
              146 <Text style={{ fontSize: 12 }}>Days</Text>
            </Text>
          </View>
          <View style={[styles.statBox, STYLES.elevation]}>
            <Text style={styles.statBoxTitle}>Perfect Weeks</Text>
            <Text style={styles.statBoxValue}>12</Text>
          </View>
          <View style={[styles.statBox, STYLES.elevation]}>
            <Text style={styles.statBoxTitle}>Recoveries</Text>
            <Text style={styles.statBoxValue}>8</Text>
          </View>
        </View>

        {/* GitHub Style Heatmap Placeholder */}
        <View style={[styles.heatmapCard, STYLES.elevation]}>
          <Text style={styles.sectionTitle}>Annual Heatmap</Text>
          <View style={styles.heatmapGrid}>
            {/* Generating dummy heatmap blocks */}
            {Array.from({ length: 60 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.heatBlock,
                  { opacity: Math.max(0.2, Math.random()) }, // Simulating activity intensity
                ]}
              />
            ))}
          </View>
        </View>

        {/* Category Performance */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Category Streaks</Text>
          {['Fitness (28 Days)', 'Reading (16 Days)', 'Coding (142 Days)'].map(
            (cat, i) => (
              <View key={i} style={[styles.catRow, STYLES.elevation]}>
                <Text style={styles.catName}>{cat}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${Math.random() * 60 + 40}%` },
                    ]}
                  />
                </View>
              </View>
            ),
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(AnalyticsWithoutHoc));
