import { useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { STYLES } from '../../constants/config';
import withLoader from '../../hoc/withLoader';
import styles from './HabitDetail.styles';

const HabitDetailWithoutHoc = ({ navigation, route, insets }) => {
  // In a real app, fetch habit details using route.params?.id
  const [checklist, setChecklist] = useState([
    { id: 1, title: 'Put on gym clothes', completed: true },
    { id: 2, title: 'Warm-up 10 mins', completed: false },
    { id: 3, title: 'Main workout', completed: false },
  ]);
  const [notes, setNotes] = useState('');

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const toggleChecklist = id => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  return (
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Habit Detail</Text>
        <TouchableOpacity>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Habit Header Info */}
        <View style={styles.titleSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>Health</Text>
          </View>
          <Text style={styles.habitTitle}>Morning Gym Session</Text>
          <Text style={styles.scheduleText}>3 times per week • 07:00 AM</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, STYLES.elevation]}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>
              14 <Text style={styles.statSub}>Days</Text>
            </Text>
          </View>
          <View style={[styles.statCard, STYLES.elevation]}>
            <Text style={styles.statLabel}>Success Rate</Text>
            <Text style={styles.statValue}>
              92<Text style={styles.statSub}>%</Text>
            </Text>
          </View>
          <View style={[styles.statCard, STYLES.elevation]}>
            <Text style={styles.statLabel}>Freeze Tokens</Text>
            <Text style={styles.statValue}>
              2 <Text style={styles.statSub}>Left</Text>
            </Text>
          </View>
        </View>

        {/* Smart Checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Checklist</Text>
          <View style={[styles.card, STYLES.elevation]}>
            {checklist.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.checklistItem}
                onPress={() => toggleChecklist(item.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    item.completed && styles.checkboxActive,
                  ]}
                />
                <Text
                  style={[
                    styles.checklistText,
                    item.completed && styles.checklistCompleted,
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Notes</Text>
          <TextInput
            style={[styles.noteInput, STYLES.elevation]}
            multiline
            placeholder="How did you feel today? Any blockers?"
            placeholderTextColor="#9CA3AF"
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      {/* Quick Complete Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <TouchableOpacity style={styles.completeBtn}>
          <Text style={styles.completeBtnText}>Mark as Completed</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default withLoader(withSafeAreaInsets(HabitDetailWithoutHoc));
