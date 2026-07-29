import {
  Activity,
  Award,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  Circle,
  Coffee,
  Dumbbell,
  Flame,
  Frown,
  Heart,
  LayoutGrid,
  List,
  Meh,
  Moon,
  Smile,
  Target,
  User,
  X,
  Zap,
} from 'lucide-react-native';
import React, { useEffect, useState, useRef } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import {
  BACKGROUND,
  BLACK,
  GRAY9,
  INPUT_BORDER,
  PRIMARY_OS,
  WHITE,
} from '../../constants/color';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import withLoader from '../../hoc/withLoader';
import {
  logHabitCompletion,
  setDashboardView,
  undoHabitCompletion,
} from '../../redux/Slice/HabitSlice';

const isHabitScheduledForDate = (habit, dateStr) => {
  if (habit.schedule_type === 'Every Day' || habit.scheduleType === 'Every Day')
    return true;
  if (
    habit.schedule_type === 'Specific Days' ||
    habit.scheduleType === 'Specific Days'
  ) {
    const d = new Date(dateStr);
    const todayIndex = d.getDay();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const todayStr = days[todayIndex];
    const val = habit.schedule_value || habit.scheduleValue || '';
    return val.includes(todayStr);
  }
  return true;
};

// Mini Heatmap Component for Grid View
const MiniHeatmap = ({ history }) => {
  const getLocalISODate = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];

  // Generate last 7 days array
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return getLocalISODate(d);
  });

  return (
    <View style={styles.miniHeatmapRow}>
      {last7Days.map((dateStr, i) => {
        const isCompleted =
          history && history.some(h => h.date.startsWith(dateStr));
        return (
          <View
            key={i}
            style={[
              styles.miniBlock,
              isCompleted ? { backgroundColor: PRIMARY_OS } : {},
            ]}
          />
        );
      })}
    </View>
  );
};

const CircularProgressDate = ({ date, isSelected, progress, onPress }) => {
  const size = RFValue(44);
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress || 0) * circumference;

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = days[date.getDay()];
  const dateNum = date.getDate();

  return (
    <TouchableOpacity onPress={onPress} style={styles.dateItem}>
      <Text
        style={[styles.dayNameText, isSelected && styles.dayNameTextSelected]}
      >
        {dayName}
      </Text>
      <View style={styles.svgWrapper}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <SvgCircle
            stroke="#E5E7EB"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <SvgCircle
            stroke="#FDE047"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        <View style={styles.dateNumWrapper}>
          <Text
            style={[
              styles.dateNumText,
              isSelected && styles.dateNumTextSelected,
            ]}
          >
            {dateNum}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

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

const DashboardWithoutHoc = ({ navigation, insets, setLoading }) => {
  const dispatch = useDispatch();
  const { habits, loading, dashboardView } = useSelector(state => state.habits);
  const { name } = useSelector(state => state.auth);

  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
  );
  const scrollRef = useRef(null);

  // Generate Dates: start of current month minus 5 days, to today + 5 days
  const dashboardDates = React.useMemo(() => {
    const dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    startDate.setDate(startDate.getDate() - 5);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 5);

    let current = new Date(startDate);
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);

  // Scroll to selected date initially
  useEffect(() => {
    if (scrollRef.current) {
      const index = dashboardDates.findIndex(
        d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0] === selectedDate,
      );
      if (index > -1) {
        setTimeout(() => {
          scrollRef.current?.scrollTo({
            x: index * RFValue(55),
            animated: true,
          });
        }, 300);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activeHabit, setActiveHabit] = useState(null); // The habit being completed
  const [metric, setMetric] = useState('');
  const [mood, setMood] = useState('Good');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  const mainContainerStylesWithInsets = {
    flex: 1,
    backgroundColor: BACKGROUND,
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const handleCheckboxTap = habit => {
    if (habit.is_completed_on_date) {
      dispatch(
        undoHabitCompletion({ habitId: habit.id, dateStr: selectedDate }),
      );
    } else {
      setActiveHabit(habit);
      setMetric(habit.targetQuantity ? habit.targetQuantity.toString() : '1');
      setMood('Good');
      setNotes('');
    }
  };

  const handleSaveCompletion = () => {
    if (!activeHabit) return;
    dispatch(
      logHabitCompletion({
        id: activeHabit.id,
        metric: parseInt(metric) || 1,
        mood,
        notes,
        dateStr: selectedDate,
      }),
    );
    setActiveHabit(null);
  };

  // Filter habits for the selected date
  const habitsForDate = habits.filter(h =>
    isHabitScheduledForDate(h, selectedDate),
  );
  const displayedHabits = habitsForDate.map(habit => {
    const isCompleted =
      habit.history &&
      habit.history.some(
        h => h.date.startsWith(selectedDate) && h.status === 'completed',
      );
    return { ...habit, is_completed_on_date: isCompleted };
  });

  // Calculate completion for the top horizontal scroll
  const getProgressForDate = dateStr => {
    const scheduled = habits.filter(h => isHabitScheduledForDate(h, dateStr));
    if (scheduled.length === 0) return 0;
    const completed = scheduled.filter(
      h =>
        h.history &&
        h.history.some(
          hx => hx.date.startsWith(dateStr) && hx.status === 'completed',
        ),
    );
    return completed.length / scheduled.length;
  };

  return (
    <View style={mainContainerStylesWithInsets}>
      <FocusAwareStatusBar
        barStyle="dark-content"
        backgroundColor={BACKGROUND}
      />

      {/* Header Area */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning, {name || 'Alex'}</Text>
          <Text style={styles.dateText}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <User color={PRIMARY_OS} size={RFValue(20)} />
        </TouchableOpacity>
      </View>

      {/* Horizontal Timeline */}
      <View style={styles.timelineContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.timelineScroll}
        >
          {dashboardDates.map((date, i) => {
            const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
            const isSelected = dateStr === selectedDate;
            const progress = getProgressForDate(dateStr);
            return (
              <CircularProgressDate
                key={i}
                date={date}
                isSelected={isSelected}
                progress={progress}
                onPress={() => setSelectedDate(dateStr)}
              />
            );
          })}
        </ScrollView>
      </View>

      {/* Triple View Toggle */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            dashboardView === 'agenda' && styles.toggleBtnActive,
          ]}
          onPress={() => dispatch(setDashboardView('agenda'))}
        >
          <CalendarCheck
            color={dashboardView === 'agenda' ? WHITE : GRAY9}
            size={RFValue(16)}
          />
          <Text
            style={[
              styles.toggleText,
              dashboardView === 'agenda' && styles.toggleTextActive,
            ]}
          >
            Agenda
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            dashboardView === 'list' && styles.toggleBtnActive,
          ]}
          onPress={() => dispatch(setDashboardView('list'))}
        >
          <List
            color={dashboardView === 'list' ? WHITE : GRAY9}
            size={RFValue(16)}
          />
          <Text
            style={[
              styles.toggleText,
              dashboardView === 'list' && styles.toggleTextActive,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleBtn,
            dashboardView === 'grid' && styles.toggleBtnActive,
          ]}
          onPress={() => dispatch(setDashboardView('grid'))}
        >
          <LayoutGrid
            color={dashboardView === 'grid' ? WHITE : GRAY9}
            size={RFValue(16)}
          />
          <Text
            style={[
              styles.toggleText,
              dashboardView === 'grid' && styles.toggleTextActive,
            ]}
          >
            Grid
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {displayedHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Target color={GRAY9} size={RFValue(48)} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No habits found</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('CreateHabit')}
            >
              <Text style={styles.emptyBtnText}>Create your first habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={dashboardView === 'grid' ? styles.gridContainer : null}>
            {displayedHabits.map(habit => {
              const { habitColor, HabitIcon } = getHabitIconAndColor(habit);

              if (dashboardView === 'grid') {
                return (
                  <TouchableOpacity
                    key={habit.id}
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('HabitDetail', { habit })}
                    style={styles.gridCard}
                  >
                    <View style={styles.gridHeaderRow}>
                      <View
                        style={{
                          width: RFValue(32),
                          height: RFValue(32),
                          borderRadius: RFValue(10),
                          backgroundColor: `${habitColor}20`,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <HabitIcon color={habitColor} size={RFValue(16)} />
                      </View>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={[styles.gridStreak, { backgroundColor: '#EF444415', marginRight: RFValue(8) }]}>
                          <Flame color="#EF4444" size={RFValue(10)} />
                          <Text style={[styles.gridStreakText, { color: '#EF4444', fontFamily: BOLD }]}>
                            {habit.streak || 0}
                          </Text>
                        </View>

                        <TouchableOpacity onPress={() => handleCheckboxTap(habit)}>
                          {habit.is_completed_on_date ? (
                            <CheckCircle2 color={habitColor} size={RFValue(20)} />
                          ) : (
                            <Circle color={`${habitColor}60`} size={RFValue(20)} />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.gridTitle,
                        habit.is_completed_on_date &&
                          styles.habitTitleCompleted,
                      ]}
                      numberOfLines={2}
                    >
                      {habit.title}
                    </Text>
                    {/* Dynamic Mini-Heatmap */}
                    <MiniHeatmap history={habit.history} />
                  </TouchableOpacity>
                );
              }

              if (dashboardView === 'list') {
                return (
                  <TouchableOpacity
                    key={habit.id}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('HabitDetail', { habit })
                    }
                    style={[styles.listCard, { paddingVertical: RFValue(10) }]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                      <View
                        style={{
                          width: RFValue(34),
                          height: RFValue(34),
                          borderRadius: RFValue(10),
                          backgroundColor: `${habitColor}20`,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: RFValue(10),
                        }}
                      >
                        <HabitIcon color={habitColor} size={RFValue(16)} />
                      </View>

                      <Text
                        style={[
                          styles.listTitle,
                          habit.is_completed_on_date &&
                            styles.habitTitleCompleted,
                        ]}
                        numberOfLines={1}
                      >
                        {habit.title}
                      </Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF444415', paddingHorizontal: RFValue(6), paddingVertical: RFValue(2), borderRadius: RFValue(6), marginRight: RFValue(10) }}>
                        <Flame color="#EF4444" size={RFValue(12)} />
                        <Text style={{ fontFamily: BOLD, fontSize: RFValue(11), color: '#EF4444', marginLeft: 3 }}>
                          {habit.streak || 0}
                        </Text>
                      </View>

                      <TouchableOpacity onPress={() => handleCheckboxTap(habit)}>
                        {habit.is_completed_on_date ? (
                          <CheckCircle2 color={habitColor} size={RFValue(20)} />
                        ) : (
                          <Circle color={`${habitColor}60`} size={RFValue(20)} />
                        )}
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              }

              // Default Agenda View
              return (
                <TouchableOpacity
                  key={habit.id}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate('HabitDetail', { habit })}
                  style={styles.habitCard}
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

                    <View style={styles.habitDetails}>
                      <Text
                        style={[
                          styles.habitTitle,
                          habit.is_completed_on_date &&
                            styles.habitTitleCompleted,
                        ]}
                        numberOfLines={1}
                      >
                        {habit.title}
                      </Text>
                      <Text style={styles.habitMeta} numberOfLines={1}>
                        {habit.category_name || habit.category || 'Habit'}{' '}
                        {habit.target_quantity
                          ? `• ${habit.target_quantity} ${habit.unit}`
                          : ''}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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

                    <TouchableOpacity onPress={() => handleCheckboxTap(habit)}>
                      {habit.is_completed_on_date ? (
                        <CheckCircle2 color={habitColor} size={RFValue(24)} />
                      ) : (
                        <Circle color={`${habitColor}60`} size={RFValue(24)} />
                      )}
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Completion Modal */}
      <Modal
        visible={!!activeHabit}
        transparent
        animationType="slide"
        onRequestClose={() => setActiveHabit(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Habit</Text>
              <TouchableOpacity onPress={() => setActiveHabit(null)}>
                <X color={GRAY9} size={RFValue(24)} />
              </TouchableOpacity>
            </View>

            {activeHabit && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalSubtitle}>{activeHabit.title}</Text>

                {/* Sub-tasks Checklist execution */}
                {activeHabit.checklists &&
                  activeHabit.checklists.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>
                        Checklist (Optional for now)
                      </Text>
                      {activeHabit.checklists.map((chk, i) => (
                        <View
                          key={i}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginBottom: RFValue(8),
                          }}
                        >
                          <Circle color={GRAY9} size={RFValue(18)} />
                          <Text
                            style={{
                              marginLeft: RFValue(8),
                              fontFamily: REGULAR,
                              fontSize: RFValue(13),
                              color: BLACK,
                            }}
                          >
                            {chk.title}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>
                    How many {activeHabit.unit || 'times'}?
                  </Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    value={metric}
                    onChangeText={setMetric}
                  />
                </View>

                <View style={styles.modalSection}>
                  <Text style={styles.modalLabel}>How did it feel?</Text>
                  <View style={styles.moodRow}>
                    <TouchableOpacity
                      style={[
                        styles.moodBtn,
                        mood === 'Great' && styles.moodBtnActive,
                      ]}
                      onPress={() => setMood('Great')}
                    >
                      <Smile
                        color={mood === 'Great' ? PRIMARY_OS : GRAY9}
                        size={RFValue(24)}
                      />
                      <Text
                        style={[
                          styles.moodText,
                          mood === 'Great' && styles.moodTextActive,
                        ]}
                      >
                        Great
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.moodBtn,
                        mood === 'Good' && styles.moodBtnActive,
                      ]}
                      onPress={() => setMood('Good')}
                    >
                      <Meh
                        color={mood === 'Good' ? PRIMARY_OS : GRAY9}
                        size={RFValue(24)}
                      />
                      <Text
                        style={[
                          styles.moodText,
                          mood === 'Good' && styles.moodTextActive,
                        ]}
                      >
                        Good
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.moodBtn,
                        mood === 'Bad' && styles.moodBtnActive,
                      ]}
                      onPress={() => setMood('Bad')}
                    >
                      <Frown
                        color={mood === 'Bad' ? PRIMARY_OS : GRAY9}
                        size={RFValue(24)}
                      />
                      <Text
                        style={[
                          styles.moodText,
                          mood === 'Bad' && styles.moodTextActive,
                        ]}
                      >
                        Bad
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveCompletion}
                >
                  <Text style={styles.saveBtnText}>Save Completion</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(10),
    paddingBottom: RFValue(10),
  },
  greeting: { fontFamily: BOLD, fontSize: RFValue(22), color: '#111827' },
  dateText: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: GRAY9,
    marginTop: RFValue(4),
  },
  profileBtn: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Timeline Styles
  timelineContainer: {
    marginBottom: RFValue(15),
  },
  timelineScroll: {
    paddingHorizontal: RFValue(20),
  },
  dateItem: {
    alignItems: 'center',
    marginRight: RFValue(15),
  },
  dayNameText: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: GRAY9,
    marginBottom: RFValue(8),
  },
  dayNameTextSelected: {
    color: BLACK,
    fontFamily: SEMIBOLD,
  },
  svgWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNumWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateNumText: {
    fontFamily: REGULAR,
    fontSize: RFValue(14),
    color: BLACK,
  },
  dateNumTextSelected: {
    fontFamily: BOLD,
  },

  viewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: RFValue(20),
    borderRadius: RFValue(12),
    padding: RFValue(4),
    marginBottom: RFValue(20),
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: RFValue(8),
    borderRadius: RFValue(8),
  },
  toggleBtnActive: { backgroundColor: PRIMARY_OS },
  toggleText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: GRAY9,
    marginLeft: RFValue(6),
  },
  toggleTextActive: { color: WHITE },

  scrollContent: {
    paddingHorizontal: RFValue(20),
    paddingBottom: RFValue(100),
  },

  // Agenda View
  habitCard: {
    backgroundColor: WHITE,
    borderRadius: RFValue(12),
    padding: RFValue(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RFValue(12),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  habitMain: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  habitDetails: { marginLeft: RFValue(12), flex: 1 },
  habitTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(14),
    color: '#111827',
    marginBottom: RFValue(2),
  },
  habitTitleCompleted: { textDecorationLine: 'line-through', color: GRAY9 },
  habitMeta: { fontFamily: REGULAR, fontSize: RFValue(11), color: GRAY9 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(8),
  },
  streakText: {
    fontFamily: BOLD,
    fontSize: RFValue(11),
    color: '#EF4444',
    marginLeft: RFValue(4),
  },

  // List View
  listCard: {
    backgroundColor: WHITE,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: RFValue(12),
    borderBottomWidth: 1,
    borderColor: INPUT_BORDER,
  },
  listContent: { flexDirection: 'row', alignItems: 'center' },
  listTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: '#111827',
    marginLeft: RFValue(10),
  },
  listStreakText: { fontFamily: BOLD, fontSize: RFValue(12), color: '#EF4444' },

  // Grid View
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    backgroundColor: WHITE,
    width: '48%',
    borderRadius: RFValue(12),
    padding: RFValue(14),
    marginBottom: RFValue(12),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    justifyContent: 'space-between',
  },
  gridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  gridTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(13),
    color: BLACK,
    marginBottom: RFValue(15),
    minHeight: RFValue(36),
  },
  gridStreak: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(2),
    borderRadius: RFValue(6),
  },
  gridStreakText: {
    fontFamily: BOLD,
    fontSize: RFValue(10),
    color: '#EF4444',
    marginLeft: RFValue(2),
  },
  miniHeatmapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: RFValue(5),
  },
  miniBlock: {
    width: RFValue(12),
    height: RFValue(12),
    borderRadius: RFValue(3),
    backgroundColor: '#F3F4F6',
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: RFValue(40),
  },
  emptyText: {
    fontFamily: REGULAR,
    fontSize: RFValue(14),
    color: GRAY9,
    marginTop: RFValue(12),
    marginBottom: RFValue(16),
  },
  emptyBtn: {
    backgroundColor: PRIMARY_OS,
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(10),
    borderRadius: RFValue(8),
  },
  emptyBtnText: { color: WHITE, fontFamily: SEMIBOLD, fontSize: RFValue(12) },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: WHITE,
    borderTopLeftRadius: RFValue(24),
    borderTopRightRadius: RFValue(24),
    padding: RFValue(20),
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(8),
  },
  modalTitle: { fontFamily: BOLD, fontSize: RFValue(18), color: '#111827' },
  modalSubtitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(14),
    color: PRIMARY_OS,
    marginBottom: RFValue(24),
  },
  modalSection: { marginBottom: RFValue(20) },
  modalLabel: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(14),
    color: '#111827',
    marginBottom: RFValue(8),
  },
  modalInput: {
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: RFValue(12),
    padding: RFValue(16),
    fontFamily: REGULAR,
    fontSize: RFValue(14),
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
  moodBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: RFValue(12),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: RFValue(12),
    marginHorizontal: RFValue(4),
    backgroundColor: '#F9FAFB',
  },
  moodBtnActive: { borderColor: PRIMARY_OS, backgroundColor: '#EFF6FF' },
  moodText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: GRAY9,
    marginTop: RFValue(4),
  },
  moodTextActive: { color: PRIMARY_OS },
  saveBtn: {
    backgroundColor: PRIMARY_OS,
    borderRadius: RFValue(12),
    paddingVertical: RFValue(16),
    alignItems: 'center',
    marginTop: RFValue(10),
    marginBottom: RFValue(20),
  },
  saveBtnText: { fontFamily: BOLD, fontSize: RFValue(14), color: WHITE },
});

const Dashboard = withLoader(withSafeAreaInsets(DashboardWithoutHoc));
export default Dashboard;
