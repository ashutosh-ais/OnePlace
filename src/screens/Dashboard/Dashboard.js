/* eslint-disable react-native/no-inline-styles */
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Flame,
  Frown,
  LayoutGrid,
  List,
  Meh,
  Smile,
  Target,
  User,
  X,
} from 'lucide-react-native';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import { useTheme } from '../../theme/useTheme';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { GRAY9, PRIMARY_OS, WHITE } from '../../constants/color';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import withLoader from '../../hoc/withLoader';
import {
  initializeDatabase,
  logHabitCompletion,
  setDashboardView,
  undoHabitCompletion,
  toggleSubtask,
} from '../../redux/Slice/HabitSlice';
import ConfettiEffect from '../../components/ConfettiEffect';
import { getHabitIconAndColor } from '../../constants/icons';
import { HEIGHT, WIDTH } from '../../constants/config';

const isHabitScheduledForDate = (habit, dateStr) => {
  const scheduleType = habit.schedule_type || habit.scheduleType;
  const scheduleValue = habit.schedule_value || habit.scheduleValue || '';

  // Every Day (or no schedule type set) — always show
  if (!scheduleType || scheduleType === 'Every Day') return true;

  // Parse the date string (YYYY-MM-DD) safely using UTC to avoid timezone shifts
  const parts = dateStr.split('-');
  if (parts.length !== 3) return true;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  const d = new Date(Date.UTC(year, month, day));

  // Specific Days of Week (legacy "Specific Days" and new "Specific Days of Week")
  if (
    scheduleType === 'Specific Days' ||
    scheduleType === 'Specific Days of Week'
  ) {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[d.getUTCDay()];
    return scheduleValue.includes(dayName);
  }

  // Specific Days of Month — show only on selected day numbers
  if (scheduleType === 'Specific Days of Month') {
    const dayOfMonth = d.getUTCDate().toString();
    return scheduleValue.split(',').map(s => s.trim()).includes(dayOfMonth);
  }

  // Some Days per Period — always show (user decides day-by-day within the period)
  if (scheduleType === 'Some Days per Period') return true;

  // Default fallback — show
  return true;
};

const getStyles = colors =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: RFValue(20),
      paddingTop: RFValue(10),
      paddingBottom: RFValue(10),
    },
    greeting: { fontFamily: BOLD, fontSize: RFValue(20), color: colors.text },
    phoneText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(13),
      color: colors.primary,
      marginTop: RFValue(2),
    },
    dateText: {
      fontFamily: REGULAR,
      fontSize: RFValue(12),
      color: colors.textSecondary,
      marginTop: RFValue(4),
    },
    profileBtn: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      backgroundColor: `${colors.primary}18`,
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
      color: colors.textSecondary,
      marginBottom: RFValue(8),
    },
    dayNameTextSelected: {
      color: colors.text,
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
      color: colors.text,
    },
    dateNumTextSelected: {
      fontFamily: BOLD,
    },

    viewToggleContainer: {
      flexDirection: 'row',
      backgroundColor: colors.border,
      marginHorizontal: RFValue(20),
      borderRadius: WIDTH * 0.025,
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
    toggleBtnActive: { backgroundColor: colors.primary },
    toggleText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.textSecondary,
      marginLeft: RFValue(6),
    },
    toggleTextActive: { color: colors.surface },

    scrollContent: {
      paddingHorizontal: RFValue(20),
      paddingBottom: RFValue(100),
    },

    // Agenda View
    habitCard: {
      backgroundColor: colors.surface,
      borderRadius: WIDTH * 0.025,
      padding: WIDTH * 0.04,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: HEIGHT * 0.01,
      borderWidth: 1,
      borderColor: colors.border,
    },
    habitMain: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    habitDetails: {
      marginLeft: RFValue(12),
      flex: 1,
    },
    habitTitle: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.text,
      marginBottom: HEIGHT * 0.002,
    },
    habitTitleCompleted: {
      textDecorationLine: 'line-through',
      color: GRAY9,
    },
    habitMeta: {
      fontFamily: REGULAR,
      fontSize: RFValue(11),
      color: GRAY9,
    },
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
      backgroundColor: colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: HEIGHT * 0.013,
      paddingHorizontal: WIDTH * 0.025,
      borderRadius: WIDTH * 0.025,
      marginBottom: HEIGHT * 0.01,
      borderWidth: 1,
      borderColor: colors.border,
    },
    listContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    listTitle: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(13),
      color: colors.text,
      marginLeft: RFValue(10),
      flex: 1,
    },
    listStreakText: {
      fontFamily: BOLD,
      fontSize: RFValue(12),
      color: '#EF4444',
    },

    // Grid View
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    gridCard: {
      backgroundColor: colors.surface,
      width: '48%',
      borderRadius: WIDTH * 0.025,
      padding: RFValue(14),
      marginBottom: HEIGHT * 0.01,
      borderWidth: 1,
      borderColor: colors.border,
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
      color: colors.text,
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
      backgroundColor: colors.border,
    },

    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: RFValue(40),
    },
    emptyText: {
      fontFamily: REGULAR,
      fontSize: RFValue(14),
      color: colors.textSecondary,
      marginTop: RFValue(12),
      marginBottom: RFValue(16),
    },
    emptyBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: RFValue(20),
      paddingVertical: RFValue(10),
      borderRadius: RFValue(8),
    },
    emptyBtnText: {
      color: colors.surface,
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.surface,
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
    modalTitle: { fontFamily: BOLD, fontSize: RFValue(18), color: colors.text },
    modalSubtitle: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(14),
      color: colors.primary,
      marginBottom: RFValue(24),
    },
    modalSection: { marginBottom: RFValue(20) },
    modalLabel: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(14),
      color: colors.text,
      marginBottom: RFValue(8),
    },
    modalInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: WIDTH * 0.025,
      padding: RFValue(16),
      fontFamily: REGULAR,
      fontSize: RFValue(14),
      color: colors.text,
      backgroundColor: colors.background,
    },
    moodRow: { flexDirection: 'row', justifyContent: 'space-between' },
    moodBtn: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: RFValue(12),
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: WIDTH * 0.025,
      marginHorizontal: RFValue(4),
      backgroundColor: colors.background,
    },
    moodBtnActive: {
      borderColor: colors.primary,
      backgroundColor: `${colors.primary}15`,
    },
    moodText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.textSecondary,
      marginTop: RFValue(4),
    },
    moodTextActive: { color: colors.primary },
    saveBtn: {
      backgroundColor: colors.primary,
      borderRadius: WIDTH * 0.025,
      paddingVertical: RFValue(16),
      alignItems: 'center',
      marginTop: RFValue(10),
      marginBottom: RFValue(20),
    },
    saveBtnText: {
      fontFamily: BOLD,
      fontSize: RFValue(14),
      color: colors.surface,
    },
  });

// Mini Heatmap Component for Grid View
const MiniHeatmap = ({ history, styles, colors }) => {
  const getLocalISODate = d =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];

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
              isCompleted ? { backgroundColor: colors.primary } : {},
            ]}
          />
        );
      })}
    </View>
  );
};

const CircularProgressDate = ({
  date,
  isSelected,
  progress,
  onPress,
  styles,
  colors,
}) => {
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
        style={[
          styles.dayNameText,
          { color: isSelected ? colors.primary : colors.textSecondary },
          isSelected && { fontFamily: BOLD },
        ]}
      >
        {dayName}
      </Text>
      <View style={styles.svgWrapper}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track & Background Fill */}
          <SvgCircle
            stroke={colors.border}
            fill={isSelected ? colors.border : 'none'}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Theme Colored Progress */}
          <SvgCircle
            stroke={colors.primary}
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
              { color: isSelected ? colors.primary : colors.text },
              isSelected && { fontFamily: BOLD },
            ]}
          >
            {dateNum}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};



const DashboardWithoutHoc = ({ navigation, insets, setLoading }) => {
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const confettiRef = useRef(null);
  const { habits, dashboardView } = useSelector(state => state.habits);
  const { phone, phone_number } = useSelector(state => state.auth);
  const userPhone = phone || phone_number;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const [selectedDate, setSelectedDate] = useState(
    new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0],
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
        d =>
          new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0] === selectedDate,
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

  useFocusEffect(
    useCallback(() => {
      dispatch(initializeDatabase());
    }, [dispatch]),
  );



  const mainContainerStylesWithInsets = {
    flex: 1,
    backgroundColor: colors.background,
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
        metric: parseInt(metric, 10) || 1,
        mood,
        notes,
        dateStr: selectedDate,
      }),
    );
    setActiveHabit(null);
    
    const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
    if (selectedDate === todayStr) {
      setTimeout(() => {
        confettiRef.current?.trigger();
      }, 400);
    }
  };

  const handleToggleSubtask = (habit, subtaskIndex) => {
    const currentCompleted =
      habit.checklist_progress && habit.checklist_progress[selectedDate]
        ? [...habit.checklist_progress[selectedDate]]
        : [];

    const wasCompleted = currentCompleted.includes(subtaskIndex);

    // Build the optimistic next state BEFORE dispatching
    let nextCompleted;
    if (!wasCompleted) {
      nextCompleted = [...currentCompleted, subtaskIndex];
    } else {
      nextCompleted = currentCompleted.filter(i => i !== subtaskIndex);
    }

    dispatch(
      toggleSubtask({
        habitId: habit.id,
        dateStr: selectedDate,
        subtaskIndex,
        isCompleted: !wasCompleted,
      }),
    );

    if (
      habit.checklists &&
      nextCompleted.length === habit.checklists.length &&
      !habit.is_completed_on_date
    ) {
      // Pass a synthetic habit with the already-updated checklist_progress
      // so the modal shows all items checked (avoids stale Redux state)
      const habitWithUpdatedProgress = {
        ...habit,
        checklist_progress: {
          ...(habit.checklist_progress || {}),
          [selectedDate]: nextCompleted,
        },
      };
      setTimeout(() => {
        setActiveHabit(habitWithUpdatedProgress);
        setMetric(habit.targetQuantity ? habit.targetQuantity.toString() : '1');
        setMood('Good');
        setNotes('');
      }, 150);
    }
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
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header Area */}
      <View style={styles.header}>
        <View style={{ flex: 1, paddingRight: 10 }}>
          <Text style={styles.greeting} numberOfLines={1}>
            {getGreeting()}
          </Text>
          {userPhone ? (
            <Text style={styles.phoneText} numberOfLines={1}>
              {userPhone}
            </Text>
          ) : null}
          <Text style={styles.dateText}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => navigation.navigate('Profile')}
        >
          <User color={colors.primary} size={RFValue(20)} />
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
            const dateStr = new Date(
              date.getTime() - date.getTimezoneOffset() * 60000,
            )
              .toISOString()
              .split('T')[0];
            const isSelected = dateStr === selectedDate;
            const progress = getProgressForDate(dateStr);
            return (
              <CircularProgressDate
                key={i}
                date={date}
                isSelected={isSelected}
                progress={progress}
                styles={styles}
                colors={colors}
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
                    onPress={() =>
                      navigation.navigate('HabitDetail', { habit, selectedDate })
                    }
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

                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <View
                          style={[
                            styles.gridStreak,
                            {
                              backgroundColor: '#EF444415',
                              marginRight: RFValue(8),
                            },
                          ]}
                        >
                          <Flame color="#EF4444" size={RFValue(10)} />
                          <Text
                            style={[
                              styles.gridStreakText,
                              { color: '#EF4444', fontFamily: BOLD },
                            ]}
                          >
                            {habit.streak || 0}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => handleCheckboxTap(habit)}
                        >
                          {habit.is_completed_on_date ? (
                            <CheckCircle2
                              color={habitColor}
                              size={RFValue(20)}
                            />
                          ) : (
                            <Circle
                              color={`${habitColor}60`}
                              size={RFValue(20)}
                            />
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
                    <MiniHeatmap
                      history={habit.history}
                      styles={styles}
                      colors={colors}
                    />
                  </TouchableOpacity>
                );
              }

              if (dashboardView === 'list') {
                return (
                  <TouchableOpacity
                    key={habit.id}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('HabitDetail', { habit, selectedDate })
                    }
                    style={styles.listCard}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        flex: 1,
                        marginRight: RFValue(10),
                      }}
                    >
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

                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          backgroundColor: '#EF444415',
                          paddingHorizontal: RFValue(6),
                          paddingVertical: RFValue(2),
                          borderRadius: RFValue(6),
                          marginRight: RFValue(10),
                        }}
                      >
                        <Flame color="#EF4444" size={RFValue(12)} />
                        <Text
                          style={{
                            fontFamily: BOLD,
                            fontSize: RFValue(11),
                            color: '#EF4444',
                            marginLeft: 3,
                          }}
                        >
                          {habit.streak || 0}
                        </Text>
                      </View>

                      <TouchableOpacity
                        onPress={() => handleCheckboxTap(habit)}
                      >
                        {habit.is_completed_on_date ? (
                          <CheckCircle2 color={habitColor} size={RFValue(20)} />
                        ) : (
                          <Circle
                            color={`${habitColor}60`}
                            size={RFValue(20)}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              }

              // Default Agenda View
              const hasChecklists = habit.checklists && habit.checklists.length > 0;
              const completedSubtasks = habit.checklist_progress && habit.checklist_progress[selectedDate]
                ? habit.checklist_progress[selectedDate]
                : [];
              const numCompleted = completedSubtasks.length;
              const numTotal = hasChecklists ? habit.checklists.length : 0;

              return (
                <View key={habit.id} style={{ marginBottom: HEIGHT * 0.01 }}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('HabitDetail', { habit, selectedDate })}
                    style={[
                      styles.habitCard,
                      hasChecklists ? { marginBottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottomWidth: 0 } : {}
                    ]}
                  >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}
                  >
                    <View
                      style={{
                        width: WIDTH * 0.11,
                        height: WIDTH * 0.11,
                        borderRadius: WIDTH * 0.1,
                        backgroundColor: `${habitColor}20`,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <HabitIcon color={habitColor} size={WIDTH * 0.06} />
                    </View>

                    <View style={styles.habitDetails}>
                      <Text
                        style={[
                          styles.habitTitle,
                          habit.is_completed_on_date &&
                            styles.habitTitleCompleted,
                        ]}
                        numberOfLines={2}
                      >
                        {habit.title}
                      </Text>
                      <Text style={styles.habitMeta} numberOfLines={1}>
                        {habit.category_name || habit.category || 'Habit'}
                        {habit.target_quantity
                          ? ` • ${habit.target_quantity} ${habit.unit}`
                          : ''}
                        {hasChecklists ? ` • ${numCompleted}/${numTotal} Subtasks` : ''}
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
                      <Text
                        style={{
                          fontFamily: BOLD,
                          fontSize: RFValue(11),
                          color: '#EF4444',
                          marginLeft: 4,
                        }}
                      >
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

                {hasChecklists && (
                  <View style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderTopWidth: 0,
                    borderBottomLeftRadius: WIDTH * 0.025,
                    borderBottomRightRadius: WIDTH * 0.025,
                    paddingHorizontal: WIDTH * 0.04,
                    paddingBottom: WIDTH * 0.04,
                    paddingTop: 5,
                  }}>
                    {habit.checklists.map((chk, i) => {
                      const isChkCompleted = completedSubtasks.includes(i);
                      return (
                        <TouchableOpacity
                          key={i}
                          activeOpacity={0.7}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: RFValue(8),
                          }}
                          onPress={() => handleToggleSubtask(habit, i)}
                        >
                          {isChkCompleted ? (
                            <CheckCircle2 color={habitColor} size={RFValue(18)} />
                          ) : (
                            <Circle color={`${habitColor}60`} size={RFValue(18)} />
                          )}
                          <Text
                            style={{
                              marginLeft: RFValue(10),
                              fontFamily: REGULAR,
                              fontSize: RFValue(12),
                              color: isChkCompleted ? GRAY9 : colors.text,
                              textDecorationLine: isChkCompleted ? 'line-through' : 'none',
                            }}
                          >
                            {chk.title}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
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

                {/* Sub-tasks in modal are now just informational or can be interacted with, but main interaction is inline */}
                {activeHabit.checklists &&
                  activeHabit.checklists.length > 0 && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>
                        Checklist
                      </Text>
                      {activeHabit.checklists.map((chk, i) => {
                        const isChkCompleted = activeHabit.checklist_progress && activeHabit.checklist_progress[selectedDate] && activeHabit.checklist_progress[selectedDate].includes(i);
                        return (
                          <View
                            key={i}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              marginBottom: RFValue(8),
                            }}
                          >
                            {isChkCompleted ? (
                              <CheckCircle2 color={getHabitIconAndColor(activeHabit).habitColor} size={RFValue(18)} />
                            ) : (
                              <Circle color={GRAY9} size={RFValue(18)} />
                            )}
                            <Text
                              style={{
                                marginLeft: RFValue(8),
                                fontFamily: REGULAR,
                                fontSize: RFValue(13),
                                color: colors.text,
                              }}
                            >
                              {chk.title}
                            </Text>
                          </View>
                        );
                      })}
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

      <ConfettiEffect ref={confettiRef} />
    </View>
  );
};

const Dashboard = withLoader(withSafeAreaInsets(DashboardWithoutHoc));
export default Dashboard;
