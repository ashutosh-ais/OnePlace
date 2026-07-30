/* eslint-disable react-native/no-inline-styles */
import React, { useMemo, useRef, useState } from 'react';
import { useTheme } from '../../theme/useTheme';

import {
  Activity,
  Apple,
  Bed,
  Bike,
  BookOpen,
  Brain,
  Briefcase,
  Calculator,
  Camera,
  Check,
  ChefHat,
  Code2,
  Coffee,
  Dog,
  DollarSign,
  Droplets,
  Dumbbell,
  Fish,
  Flame,
  Flower2,
  Footprints,
  Gamepad2,
  Globe,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  Home,
  Languages,
  Leaf,
  Moon,
  Mountain,
  Music,
  Palette,
  Pencil,
  Pill,
  Plane,
  Plus,
  Salad,
  ShoppingCart,
  Smile,
  Star,
  Sun,
  Target,
  Telescope,
  Timer,
  TreePine,
  Trophy,
  Tv,
  Users,
  Waves,
  Wind,
  X,
  Zap,
} from 'lucide-react-native';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { RFValue } from 'react-native-responsive-fontsize';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
import withLoader from '../../hoc/withLoader';
import { createNewCategory, editHabit } from '../../redux/Slice/HabitSlice';

// ─── Constants ─────────────────────────────────────────────────────────────

const SCHEDULE_TYPES = [
  'Every Day',
  'Specific Days of Week',
  'Specific Days of Month',
  'Some Days per Period',
];
const WEEK_DAYS = [
  { id: 'Mon', label: 'M' },
  { id: 'Tue', label: 'T' },
  { id: 'Wed', label: 'W' },
  { id: 'Thu', label: 'T' },
  { id: 'Fri', label: 'F' },
  { id: 'Sat', label: 'S' },
  { id: 'Sun', label: 'S' },
];

const PALETTE = [
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Violet
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#F59E0B', // Amber
  '#EAB308', // Yellow
  '#84CC16', // Lime
  '#22C55E', // Green
  '#10B981', // Emerald
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#0EA5E9', // Sky
  '#64748B', // Slate
  '#111827', // Near-black
];

const ICONS = [
  { name: 'Activity', Icon: Activity },
  { name: 'Dumbbell', Icon: Dumbbell },
  { name: 'BookOpen', Icon: BookOpen },
  { name: 'Coffee', Icon: Coffee },
  { name: 'Moon', Icon: Moon },
  { name: 'Sun', Icon: Sun },
  { name: 'Heart', Icon: Heart },
  { name: 'Zap', Icon: Zap },
  { name: 'Music', Icon: Music },
  { name: 'Camera', Icon: Camera },
  { name: 'Code2', Icon: Code2 },
  { name: 'Briefcase', Icon: Briefcase },
  { name: 'Globe', Icon: Globe },
  { name: 'Leaf', Icon: Leaf },
  { name: 'Star', Icon: Star },
  { name: 'Trophy', Icon: Trophy },
  { name: 'Flame', Icon: Flame },
  { name: 'Bike', Icon: Bike },
  { name: 'Brain', Icon: Brain },
  { name: 'Apple', Icon: Apple },
  { name: 'Droplets', Icon: Droplets },
  { name: 'Bed', Icon: Bed },
  { name: 'Pencil', Icon: Pencil },
  { name: 'Pill', Icon: Pill },
  { name: 'ShoppingCart', Icon: ShoppingCart },
  { name: 'Gamepad2', Icon: Gamepad2 },
  { name: 'Plane', Icon: Plane },
  { name: 'Home', Icon: Home },
  { name: 'Flower2', Icon: Flower2 },
  { name: 'Fish', Icon: Fish },
  { name: 'ChefHat', Icon: ChefHat },
  { name: 'Timer', Icon: Timer },
  { name: 'Target', Icon: Target },
  { name: 'Smile', Icon: Smile },
  { name: 'Handshake', Icon: Handshake },
  { name: 'Languages', Icon: Languages },
  { name: 'Calculator', Icon: Calculator },
  { name: 'Telescope', Icon: Telescope },
  { name: 'Palette', Icon: Palette },
  { name: 'Headphones', Icon: Headphones },
  { name: 'Tv', Icon: Tv },
  { name: 'Dog', Icon: Dog },
  { name: 'TreePine', Icon: TreePine },
  { name: 'Mountain', Icon: Mountain },
  { name: 'Wind', Icon: Wind },
  { name: 'Waves', Icon: Waves },
  { name: 'GraduationCap', Icon: GraduationCap },
  { name: 'DollarSign', Icon: DollarSign },
  { name: 'Users', Icon: Users },
  { name: 'Footprints', Icon: Footprints },
  { name: 'Salad', Icon: Salad },
];

// ─── Component ─────────────────────────────────────────────────────────────

const EditHabitWithoutHoc = ({ navigation, route, insets, setLoading }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.habits);
  const { habit } = route.params;

  // Parse the existing category_ids
  const initialCatIds = (() => {
    try {
      const parsed = JSON.parse(habit.category_id);
      return Array.isArray(parsed) ? parsed : [habit.category_id];
    } catch {
      return habit.category_id ? [habit.category_id] : [];
    }
  })();

  const initialDays = habit.schedule_value
    ? habit.schedule_value.split(',').filter(Boolean)
    : [];

  // Form state — seeded from existing habit
  const [title, setTitle] = useState(habit.title || '');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState(initialCatIds);
  // Handle legacy schedule types if needed
  const normalizedScheduleType =
    habit.schedule_type === 'Specific Days'
      ? 'Specific Days of Week'
      : habit.schedule_type || 'Every Day';

  const [scheduleType, setScheduleType] = useState(normalizedScheduleType);

  const isMonth = normalizedScheduleType === 'Specific Days of Month';
  const isPeriod = normalizedScheduleType === 'Some Days per Period';

  const [selectedDays, setSelectedDays] = useState(
    !isMonth && !isPeriod ? initialDays : [],
  );

  const [selectedMonthDays, setSelectedMonthDays] = useState(
    isMonth ? initialDays : [],
  );

  const initialPeriodParts =
    isPeriod && habit.schedule_value
      ? habit.schedule_value.split('/')
      : ['1', 'Week'];

  const [periodNumber, setPeriodNumber] = useState(initialPeriodParts[0]);
  const [periodType, setPeriodType] = useState(initialPeriodParts[1] || 'Week');
  const [targetQuantity, setTargetQuantity] = useState(
    String(habit.target_quantity || habit.targetQuantity || '1'),
  );
  const [unit, setUnit] = useState(habit.unit || 'Times');
  const [reminderTime, setReminderTime] = useState(habit.reminder_time || '');
  const [checklists, setChecklists] = useState(habit.checklists || []);
  const [selectedColor, setSelectedColor] = useState(
    habit.color || colors.primary,
  );
  const [selectedIcon, setSelectedIcon] = useState(habit.icon || 'Activity');

  // New category sheet
  const actionSheetRef = useRef(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const toggleCategory = catId => {
    setSelectedCategoryIds(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId],
    );
  };

  const toggleDay = dayId => {
    setSelectedDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId],
    );
  };

  const toggleMonthDay = dayId => {
    setSelectedMonthDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId],
    );
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }
    setLoading(true);
    await dispatch(createNewCategory(newCategoryName.trim()));
    setNewCategoryName('');
    actionSheetRef.current?.hide();
    setLoading(false);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return Alert.alert('Missing Field', 'Please enter a habit name.');
    }
    if (selectedCategoryIds.length === 0) {
      return Alert.alert(
        'Missing Field',
        'Please select at least one category.',
      );
    }
    if (scheduleType === 'Specific Days of Week' && selectedDays.length === 0) {
      return Alert.alert('Missing Field', 'Please select at least one day.');
    }
    if (
      scheduleType === 'Specific Days of Month' &&
      selectedMonthDays.length === 0
    ) {
      return Alert.alert(
        'Missing Field',
        'Please select at least one day in the month.',
      );
    }
    if (scheduleType === 'Some Days per Period' && !periodNumber) {
      return Alert.alert(
        'Missing Field',
        'Please enter a valid number of days.',
      );
    }
    if (scheduleType === 'Some Days per Period' && periodType === 'Week' && parseInt(periodNumber, 10) > 6) {
      return Alert.alert('Invalid Value', 'Please enter less than 7 days per week.');
    }
    if (scheduleType === 'Some Days per Period' && periodType === 'Month' && parseInt(periodNumber, 10) > 27) {
      return Alert.alert('Invalid Value', 'Please enter less than 28 days per month.');
    }

    let scheduleValue = '';
    if (scheduleType === 'Specific Days of Week') {
      scheduleValue = selectedDays.join(',');
    } else if (scheduleType === 'Specific Days of Month') {
      scheduleValue = selectedMonthDays.join(',');
    } else if (scheduleType === 'Some Days per Period') {
      scheduleValue = `${periodNumber}/${periodType}`;
    }

    setLoading(true);
    await dispatch(
      editHabit({
        habitId: habit.id,
        fields: {
          title: title.trim(),
          category_id: JSON.stringify(selectedCategoryIds),
          schedule_type: scheduleType,
          schedule_value: scheduleValue,
          target_quantity: parseInt(targetQuantity, 10) || 1,
          unit,
          reminder_time: reminderTime,
          checklists,
          color: selectedColor,
          icon: selectedIcon,
        },
      }),
    );
    setLoading(false);
    navigation.goBack();
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  const SelectedIconComponent =
    ICONS.find(i => i.name === selectedIcon)?.Icon || Activity;

  return (
    <KeyboardAvoidingView
      style={[styles.container, mainContainerStyles]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <FocusAwareStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="#FFFFFF"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <X color={colors.text} size={RFValue(22)} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={[styles.headerIcon, { backgroundColor: selectedColor }]}>
            <SelectedIconComponent color={colors.surface} size={RFValue(16)} />
          </View>
          <Text style={styles.headerTitle}>Edit Habit</Text>
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
          <Check color={selectedColor} size={RFValue(22)} />
        </TouchableOpacity>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) + RFValue(120) },
        ]}
      >
        {/* ── Name ─────────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Read 20 pages"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* ── Icon Picker ──────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Icon</Text>
          <FlatList
            data={ICONS}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.name}
            contentContainerStyle={styles.iconList}
            renderItem={({ item }) => {
              const isSelected = selectedIcon === item.name;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedIcon(item.name)}
                  style={[
                    styles.iconCell,
                    isSelected && {
                      backgroundColor: selectedColor,
                      borderColor: selectedColor,
                    },
                  ]}
                >
                  <item.Icon
                    color={isSelected ? colors.surface : colors.textSecondary}
                    size={RFValue(20)}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* ── Color Picker ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Theme Color</Text>
          <View style={styles.paletteGrid}>
            {PALETTE.map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.swatch,
                  { backgroundColor: color },
                  selectedColor === color && styles.swatchSelected,
                ]}
              >
                {selectedColor === color && (
                  <Check
                    color={colors.surface}
                    size={RFValue(14)}
                    strokeWidth={3}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Categories ───────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
              <Text style={[styles.addText, { color: selectedColor }]}>
                + New
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            keyboardShouldPersistTaps="handled"
            showsHorizontalScrollIndicator={false}
          >
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.chip,
                  selectedCategoryIds.includes(cat.id) && {
                    backgroundColor: selectedColor,
                    borderColor: selectedColor,
                  },
                ]}
                onPress={() => toggleCategory(cat.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategoryIds.includes(cat.id) &&
                      styles.chipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
            {categories.length === 0 && (
              <Text style={styles.subLabel}>
                No categories yet. Tap "+ New".
              </Text>
            )}
          </ScrollView>
        </View>

        {/* ── Schedule ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Scheduling Engine</Text>
          <View style={styles.scheduleGrid}>
            {SCHEDULE_TYPES.map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.scheduleBtn,
                  scheduleType === type && {
                    backgroundColor: `${selectedColor}18`,
                    borderColor: selectedColor,
                  },
                ]}
                onPress={() => {
                  setScheduleType(type);
                }}
              >
                <Text
                  style={[
                    styles.scheduleBtnText,
                    scheduleType === type && {
                      color: selectedColor,
                      fontFamily: BOLD,
                    },
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {scheduleType === 'Specific Days of Week' && (
            <View style={styles.daysRow}>
              {WEEK_DAYS.map(day => (
                <TouchableOpacity
                  key={day.id}
                  style={[
                    styles.dayCircle,
                    selectedDays.includes(day.id) && {
                      backgroundColor: selectedColor,
                      borderColor: selectedColor,
                    },
                  ]}
                  onPress={() => toggleDay(day.id)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDays.includes(day.id) && styles.dayTextActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {scheduleType === 'Specific Days of Month' && (
            <View style={styles.monthDaysGrid}>
              {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(
                dayNum => (
                  <TouchableOpacity
                    key={dayNum}
                    style={[
                      styles.monthDayCircle,
                      selectedMonthDays.includes(dayNum) && {
                        backgroundColor: selectedColor,
                        borderColor: selectedColor,
                      },
                    ]}
                    onPress={() => toggleMonthDay(dayNum)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        selectedMonthDays.includes(dayNum) &&
                          styles.dayTextActive,
                      ]}
                    >
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                ),
              )}
            </View>
          )}

          {scheduleType === 'Some Days per Period' && (
            <View style={styles.periodRow}>
              <View style={{ flex: 1, marginRight: RFValue(10) }}>
                <Text style={styles.subLabel}>Days</Text>
                <TextInput
                  style={styles.input}
                  placeholder="3"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  value={periodNumber}
                  onChangeText={setPeriodNumber}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.subLabel}>Per</Text>
                <View style={styles.periodToggle}>
                  <TouchableOpacity
                    style={[
                      styles.periodToggleBtn,
                      periodType === 'Week' && {
                        backgroundColor: selectedColor,
                      },
                    ]}
                    onPress={() => setPeriodType('Week')}
                  >
                    <Text
                      style={[
                        styles.periodToggleText,
                        periodType === 'Week' && styles.periodToggleTextActive,
                      ]}
                    >
                      Week
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.periodToggleBtn,
                      periodType === 'Month' && {
                        backgroundColor: selectedColor,
                      },
                    ]}
                    onPress={() => setPeriodType('Month')}
                  >
                    <Text
                      style={[
                        styles.periodToggleText,
                        periodType === 'Month' && styles.periodToggleTextActive,
                      ]}
                    >
                      Month
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* ── Target Goal ──────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Target Goal (Daily)</Text>
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <Text style={styles.subLabel}>Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="1"
                keyboardType="numeric"
                value={targetQuantity}
                onChangeText={setTargetQuantity}
              />
            </View>
            <View style={styles.twoThirdInput}>
              <Text style={styles.subLabel}>Unit (e.g., Litres, Pages)</Text>
              <TextInput
                style={styles.input}
                placeholder="Times"
                value={unit}
                onChangeText={setUnit}
              />
            </View>
          </View>
        </View>

        {/* ── Reminder ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Daily Reminder</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 08:00 AM (Optional)"
            placeholderTextColor={colors.textSecondary}
            value={reminderTime}
            onChangeText={setReminderTime}
          />
        </View>

        {/* ── Checklists ───────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.label}>Sub-tasks (Checklist)</Text>
          {checklists.map((item, index) => (
            <View key={index} style={styles.checklistRow}>
              <View
                style={[
                  styles.checklistBullet,
                  { backgroundColor: selectedColor },
                ]}
              />
              <TextInput
                style={[styles.input, styles.checklistInput]}
                placeholder={`Task ${index + 1}`}
                placeholderTextColor={colors.textSecondary}
                value={item.title}
                onChangeText={text => {
                  const next = [...checklists];
                  next[index] = { ...next[index], title: text };
                  setChecklists(next);
                }}
              />
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() =>
                  setChecklists(checklists.filter((_, i) => i !== index))
                }
              >
                <X color={colors.textSecondary} size={RFValue(18)} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[styles.addStepBtn, { borderColor: selectedColor }]}
            onPress={() =>
              setChecklists([...checklists, { title: '', isCompleted: false }])
            }
          >
            <Plus color={selectedColor} size={RFValue(16)} />
            <Text style={[styles.addStepText, { color: selectedColor }]}>
              Add Step
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Bar */}
      <View
        style={[
          styles.bottomBar,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: selectedColor }]}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

      {/* New Category Sheet */}
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.actionSheetContainer}
      >
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Create New Category</Text>
          <TextInput
            style={styles.actionSheetInput}
            placeholder="Category Name"
            placeholderTextColor={colors.textSecondary}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <TouchableOpacity
            style={[
              styles.actionSheetSaveBtn,
              { backgroundColor: selectedColor },
            ]}
            onPress={handleCreateCategory}
          >
            <Text style={styles.actionSheetSaveText}>Save Category</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </KeyboardAvoidingView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────────

const getStyles = colors =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: '5%',
      paddingVertical: RFValue(14),
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    headerBtn: {
      width: RFValue(36),
      height: RFValue(36),
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCenter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: RFValue(8),
    },
    headerIcon: {
      width: RFValue(28),
      height: RFValue(28),
      borderRadius: RFValue(14),
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontFamily: BOLD,
      fontSize: RFValue(16),
      color: colors.text,
    },
    content: {
      paddingHorizontal: '5%',
      paddingBottom: RFValue(120),
      paddingTop: RFValue(20),
    },
    section: { marginBottom: RFValue(26) },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: RFValue(10),
    },
    label: {
      fontFamily: BOLD,
      fontSize: RFValue(14),
      color: colors.text,
      marginBottom: RFValue(10),
    },
    subLabel: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.textSecondary,
      marginBottom: RFValue(6),
    },
    addText: { fontFamily: BOLD, fontSize: RFValue(12) },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RFValue(12),
      padding: RFValue(14),
      fontFamily: REGULAR,
      fontSize: RFValue(14),
      color: colors.text,
      backgroundColor: colors.background,
    },
    row: { flexDirection: 'row', alignItems: 'flex-end', gap: RFValue(10) },
    halfInput: { flex: 1 },
    twoThirdInput: { flex: 2 },

    // Icon picker
    iconList: { paddingBottom: RFValue(4), gap: RFValue(10) },
    iconCell: {
      width: RFValue(48),
      height: RFValue(48),
      borderRadius: RFValue(12),
      borderWidth: 1.5,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },

    // Color palette
    paletteGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: RFValue(10),
    },
    swatch: {
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      justifyContent: 'center',
      alignItems: 'center',
    },
    swatchSelected: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
      transform: [{ scale: 1.15 }],
    },

    // Category chips
    chip: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RFValue(20),
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(8),
      marginRight: RFValue(10),
    },
    chipText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.text,
    },
    chipTextActive: { color: colors.surface },

    // Schedule
    scheduleGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    scheduleBtn: {
      width: '48%',
      paddingVertical: RFValue(12),
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RFValue(10),
      alignItems: 'center',
      marginBottom: RFValue(10),
    },
    scheduleBtnText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.text,
    },
    daysRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: RFValue(12),
      paddingHorizontal: RFValue(4),
    },
    dayCircle: {
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.textSecondary,
    },
    dayTextActive: { color: colors.surface },
    monthDaysGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: RFValue(8),
      marginTop: RFValue(12),
      paddingHorizontal: RFValue(4),
    },
    monthDayCircle: {
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    periodRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: RFValue(12),
      paddingHorizontal: RFValue(4),
    },
    periodToggle: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    periodToggleBtn: {
      flex: 1,
      paddingVertical: RFValue(15),
      alignItems: 'center',
    },
    periodToggleBtnActive: {
      backgroundColor: colors.primary, // Note: In EditHabit this will be overridden by inline styles
    },
    periodToggleText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.textSecondary,
    },
    periodToggleTextActive: {
      color: colors.surface,
    },

    // Checklist
    checklistRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: RFValue(10),
      gap: RFValue(8),
    },
    checklistBullet: {
      width: RFValue(8),
      height: RFValue(8),
      borderRadius: RFValue(4),
    },
    checklistInput: { flex: 1, paddingVertical: RFValue(11) },
    removeBtn: { padding: RFValue(8) },
    addStepBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      paddingHorizontal: RFValue(14),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(20),
      borderWidth: 1.5,
      gap: RFValue(6),
      marginTop: RFValue(4),
    },
    addStepText: { fontFamily: BOLD, fontSize: RFValue(12) },

    // Bottom bar
    bottomBar: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: '5%',
      paddingTop: RFValue(15),
    },
    saveBtn: {
      borderRadius: RFValue(12),
      paddingVertical: RFValue(15),
      alignItems: 'center',
    },
    saveBtnText: {
      fontFamily: BOLD,
      fontSize: RFValue(14),
      color: colors.surface,
    },

    // ActionSheet
    actionSheetContainer: {
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingBottom: RFValue(30),
      backgroundColor: colors.surface,
    },
    actionSheetContent: { padding: RFValue(20) },
    actionSheetTitle: {
      fontFamily: BOLD,
      fontSize: RFValue(16),
      color: colors.text,
      marginBottom: RFValue(15),
    },
    actionSheetInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RFValue(12),
      padding: RFValue(15),
      fontFamily: REGULAR,
      fontSize: RFValue(14),
      color: colors.text,
      backgroundColor: colors.background,
      marginBottom: RFValue(15),
    },
    actionSheetSaveBtn: {
      borderRadius: RFValue(12),
      paddingVertical: RFValue(15),
      alignItems: 'center',
    },
    actionSheetSaveText: {
      fontFamily: BOLD,
      fontSize: RFValue(14),
      color: colors.surface,
    },
  });

export default withLoader(withSafeAreaInsets(EditHabitWithoutHoc));
