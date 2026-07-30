/* eslint-disable react-native/no-inline-styles */
import { Check, Plus, X } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
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
import {
  createNewCategory,
  createRichHabit,
} from '../../redux/Slice/HabitSlice';
import { useTheme } from '../../theme/useTheme';
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

const CreateHabitWithoutHoc = ({ navigation, insets, setLoading }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.habits);

  const [title, setTitle] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const actionSheetRef = useRef(null);
  const [scheduleType, setScheduleType] = useState('Every Day');

  // Specific Days Engine
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState([]);
  const [periodNumber, setPeriodNumber] = useState('1');
  const [periodType, setPeriodType] = useState('Week'); // Week or Month

  // Rich Data Fields
  const [targetQuantity, setTargetQuantity] = useState('1');
  const [unit, setUnit] = useState('Times');
  const [reminderTime, setReminderTime] = useState('');
  const [checklists, setChecklists] = useState([]);

  // Category Creator
  // const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    await dispatch(createNewCategory(newCategoryName.trim()));
    setNewCategoryName('');
    actionSheetRef.current?.hide();
    setLoading(false);
  };

  const toggleCategory = catId => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  const toggleDay = dayId => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const toggleMonthDay = dayId => {
    if (selectedMonthDays.includes(dayId)) {
      setSelectedMonthDays(selectedMonthDays.filter(d => d !== dayId));
    } else {
      setSelectedMonthDays([...selectedMonthDays, dayId]);
    }
  };

  const handleCreate = async () => {
    if (!title.trim())
      return Alert.alert('Missing Field', 'Please enter a habit name.');
    if (selectedCategoryIds.length === 0)
      return Alert.alert(
        'Missing Field',
        'Please select at least one category.',
      );
    if (scheduleType === 'Specific Days of Week' && selectedDays.length === 0)
      return Alert.alert('Missing Field', 'Please select at least one day.');
    if (scheduleType === 'Specific Days of Month' && selectedMonthDays.length === 0)
      return Alert.alert('Missing Field', 'Please select at least one day in the month.');
    if (scheduleType === 'Some Days per Period' && !periodNumber)
      return Alert.alert('Missing Field', 'Please enter a valid number of days.');

    let scheduleValue = '';
    if (scheduleType === 'Specific Days of Week') {
      scheduleValue = selectedDays.join(',');
    } else if (scheduleType === 'Specific Days of Month') {
      scheduleValue = selectedMonthDays.join(',');
    } else if (scheduleType === 'Some Days per Period') {
      scheduleValue = `${periodNumber}/${periodType}`;
    }

    setLoading(true);
    dispatch(
      createRichHabit({
        categoryId: JSON.stringify(selectedCategoryIds),
        title: title.trim(),
        scheduleType,
        scheduleValue,
        targetQuantity: parseInt(targetQuantity, 10) || 1,
        unit,
        reminderTime,
        checklists,
      }),
    );
    setLoading(false);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="#FFFFFF"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <X color="#111827" size={RFValue(24)} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Habit</Text>
          <TouchableOpacity onPress={handleCreate} style={styles.backBtn}>
            <Check color={colors.primary} size={RFValue(24)} />
          </TouchableOpacity>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 20) + RFValue(120) }]}
        >
          {/* Name Input */}
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

          {/* Categories Engine */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
                <Text style={styles.addText}>+ New</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              keyboardShouldPersistTaps="handled"
              showsHorizontalScrollIndicator={false}
              style={styles.catScroll}
            >
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.chip,
                    selectedCategoryIds.includes(cat.id) && styles.chipActive,
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
                  No categories yet. Click "+ New" to add one.
                </Text>
              )}
            </ScrollView>
          </View>

          {/* Advanced Scheduling Engine */}
          <View style={styles.section}>
            <Text style={styles.label}>Scheduling Engine</Text>
            <View style={styles.scheduleGrid}>
              {SCHEDULE_TYPES.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.scheduleBtn,
                    scheduleType === type && styles.scheduleBtnActive,
                  ]}
                  onPress={() => {
                    setScheduleType(type);
                  }}
                >
                  <Text
                    style={[
                      styles.scheduleBtnText,
                      scheduleType === type && styles.scheduleBtnTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Specific Days of Week UI */}
            {scheduleType === 'Specific Days of Week' && (
              <View style={styles.daysRow}>
                {WEEK_DAYS.map(day => (
                  <TouchableOpacity
                    key={day.id}
                    style={[
                      styles.dayCircle,
                      selectedDays.includes(day.id) && styles.dayCircleActive,
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

            {/* Specific Days of Month UI */}
            {scheduleType === 'Specific Days of Month' && (
              <View style={styles.monthDaysGrid}>
                {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map(dayNum => (
                  <TouchableOpacity
                    key={dayNum}
                    style={[
                      styles.monthDayCircle,
                      selectedMonthDays.includes(dayNum) && styles.dayCircleActive,
                    ]}
                    onPress={() => toggleMonthDay(dayNum)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        selectedMonthDays.includes(dayNum) && styles.dayTextActive,
                      ]}
                    >
                      {dayNum}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Some Days per Period UI */}
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
                        periodType === 'Week' && styles.periodToggleBtnActive,
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
                        periodType === 'Month' && styles.periodToggleBtnActive,
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

          {/* Metrics (Rich Data) */}
          <View style={styles.section}>
            <Text style={styles.label}>Target Goal (Daily)</Text>
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: RFValue(10) }}>
                <Text style={styles.subLabel}>Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  keyboardType="numeric"
                  value={targetQuantity}
                  onChangeText={setTargetQuantity}
                />
              </View>
              <View style={{ flex: 2 }}>
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

          {/* Reminders */}
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

          {/* Checklists */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Sub-tasks (Checklist)</Text>
            </View>
            {checklists.map((item, index) => (
              <View
                key={index}
                style={[styles.row, { marginBottom: RFValue(10) }]}
              >
                <View
                  style={[
                    styles.dayCircle,
                    {
                      width: RFValue(24),
                      height: RFValue(24),
                      marginRight: RFValue(10),
                    },
                  ]}
                />
                <TextInput
                  style={[styles.input, { flex: 1, padding: RFValue(10) }]}
                  placeholder={`Task ${index + 1}`}
                  placeholderTextColor={colors.textSecondary}
                  value={item.title}
                  onChangeText={text => {
                    const newChecklists = [...checklists];
                    newChecklists[index].title = text;
                    setChecklists(newChecklists);
                  }}
                />
                <TouchableOpacity
                  style={{ padding: RFValue(10) }}
                  onPress={() => {
                    const newChecklists = checklists.filter(
                      (_, i) => i !== index,
                    );
                    setChecklists(newChecklists);
                  }}
                >
                  <X color={colors.textSecondary} size={RFValue(18)} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() =>
                setChecklists([...checklists, { title: '', isCompleted: false }])
              }
            >
              <Plus color={colors.primary} size={RFValue(16)} />
              <Text style={styles.addBtnText}>Add Step</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
        >
          <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}>
            <Text style={styles.saveBtnText}>Create Habit</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.actionSheetContainer}
      >
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Create New Category</Text>
          <TextInput
            style={styles.actionSheetInput}
            placeholder="Category Name"
            placeholderTextColor="#9CA3AF"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <TouchableOpacity
            style={styles.actionSheetSaveBtn}
            onPress={handleCreateCategory}
          >
            <Text style={styles.actionSheetSaveText}>Save Category</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </View>
  );
};

const getStyles = colors =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: '5%',
      paddingVertical: RFValue(15),
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    backBtn: { padding: RFValue(5), width: RFValue(40), alignItems: 'center' },
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
    section: { marginBottom: RFValue(24) },
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
    addText: { fontFamily: BOLD, fontSize: RFValue(12), color: colors.primary },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RFValue(12),
      padding: RFValue(15),
      fontFamily: REGULAR,
      fontSize: RFValue(14),
      color: colors.text,
      backgroundColor: colors.background,
    },
    row: { flexDirection: 'row', alignItems: 'center' },
    categoryCreatorRow: { flexDirection: 'row', alignItems: 'center' },
    catSaveBtn: {
      backgroundColor: colors.primary,
      padding: RFValue(12),
      borderRadius: RFValue(10),
      marginLeft: RFValue(8),
    },
    catCancelBtn: {
      backgroundColor: colors.border,
      padding: RFValue(12),
      borderRadius: RFValue(10),
      marginLeft: RFValue(8),
      borderWidth: 1,
      borderColor: colors.border,
    },
    catScroll: { flexDirection: 'row' },
    chip: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: RFValue(20),
      paddingHorizontal: RFValue(16),
      paddingVertical: RFValue(8),
      marginRight: RFValue(10),
    },
    chipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    chipText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.text,
    },
    chipTextActive: { color: colors.surface },
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
    scheduleBtnActive: {
      backgroundColor: `${colors.primary}15`,
      borderColor: colors.primary,
    },
    scheduleBtnText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.text,
    },
    scheduleBtnTextActive: { color: colors.primary, fontFamily: BOLD },
    daysRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: RFValue(10),
      paddingHorizontal: RFValue(5),
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
    dayCircleActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
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
      marginTop: RFValue(10),
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
      marginTop: RFValue(10),
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
      backgroundColor: colors.primary,
    },
    periodToggleText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.textSecondary,
    },
    periodToggleTextActive: {
      color: colors.surface,
    },
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${colors.primary}15`,
      alignSelf: 'flex-start',
      paddingHorizontal: RFValue(12),
      paddingVertical: RFValue(8),
      borderRadius: RFValue(20),
      marginTop: RFValue(5),
    },
    addBtnText: {
      color: colors.primary,
      fontFamily: BOLD,
      fontSize: RFValue(12),
      marginLeft: RFValue(4),
    },
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
      backgroundColor: colors.primary,
      borderRadius: RFValue(12),
      paddingVertical: RFValue(15),
      alignItems: 'center',
    },
    saveBtnText: {
      fontFamily: BOLD,
      fontSize: RFValue(14),
      color: colors.surface,
    },
    actionSheetContainer: {
      borderTopLeftRadius: RFValue(24),
      borderTopRightRadius: RFValue(24),
      paddingBottom: RFValue(30),
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
      backgroundColor: colors.primary,
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

export default withLoader(withSafeAreaInsets(CreateHabitWithoutHoc));
