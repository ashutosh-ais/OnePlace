import { useTheme } from '../../theme/useTheme';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { createRichHabit, createNewCategory } from '../../redux/Slice/HabitSlice';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import withLoader from '../../hoc/withLoader';
import { X, Check, Plus } from 'lucide-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';
const SCHEDULE_TYPES = ['Every Day', 'Specific Days', 'X Times / Period', 'Custom'];
const WEEK_DAYS = [{ id: 'Mon', label: 'M' }, { id: 'Tue', label: 'T' }, { id: 'Wed', label: 'W' }, { id: 'Thu', label: 'T' }, { id: 'Fri', label: 'F' }, { id: 'Sat', label: 'S' }, { id: 'Sun', label: 'S' }];

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
  
  // Rich Data Fields
  const [targetQuantity, setTargetQuantity] = useState('1');
  const [unit, setUnit] = useState('Times');
  const [reminderTime, setReminderTime] = useState('');
  const [checklists, setChecklists] = useState([]);

  // Category Creator
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
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

  const toggleCategory = (catId) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(d => d !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const handleCreate = async () => {
    if (!title.trim()) return Alert.alert('Missing Field', 'Please enter a habit name.');
    if (selectedCategoryIds.length === 0) return Alert.alert('Missing Field', 'Please select at least one category.');
    if (scheduleType === 'Specific Days' && selectedDays.length === 0) return Alert.alert('Missing Field', 'Please select at least one day.');

    const scheduleValue = scheduleType === 'Specific Days' ? selectedDays.join(',') : '';

    setLoading(true);
    await dispatch(createRichHabit({ 
      categoryId: JSON.stringify(selectedCategoryIds), 
      title: title.trim(), 
      scheduleType,
      scheduleValue,
      targetQuantity: parseInt(targetQuantity) || 1,
      unit,
      reminderTime,
      checklists
    }));
    setLoading(false);
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, mainContainerStyles]} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FocusAwareStatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <X color="#111827" size={RFValue(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Habit</Text>
        <TouchableOpacity onPress={handleCreate} style={styles.backBtn}>
          <Check color={colors.primary} size={RFValue(24)} />
        </TouchableOpacity>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Name Input */}
        <View style={styles.section}>
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Read 20 pages"
            placeholderTextColor="#9CA3AF"
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
          
          <ScrollView horizontal keyboardShouldPersistTaps="handled" showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.chip, selectedCategoryIds.includes(cat.id) && styles.chipActive]}
                onPress={() => toggleCategory(cat.id)}
              >
                <Text style={[styles.chipText, selectedCategoryIds.includes(cat.id) && styles.chipTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
            {categories.length === 0 && (
              <Text style={styles.subLabel}>No categories yet. Click "+ New" to add one.</Text>
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
                style={[styles.scheduleBtn, scheduleType === type && styles.scheduleBtnActive]}
                onPress={() => {
                  setScheduleType(type);
                  if (type !== 'Specific Days') setSelectedDays([]);
                }}
              >
                <Text style={[styles.scheduleBtnText, scheduleType === type && styles.scheduleBtnTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Specific Days Selector UI */}
          {scheduleType === 'Specific Days' && (
            <View style={styles.daysRow}>
              {WEEK_DAYS.map(day => (
                <TouchableOpacity
                  key={day.id}
                  style={[styles.dayCircle, selectedDays.includes(day.id) && styles.dayCircleActive]}
                  onPress={() => toggleDay(day.id)}
                >
                  <Text style={[styles.dayText, selectedDays.includes(day.id) && styles.dayTextActive]}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
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
            placeholderTextColor="#9CA3AF"
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
            <View key={index} style={[styles.row, { marginBottom: RFValue(10) }]}>
              <View style={[styles.dayCircle, { width: RFValue(24), height: RFValue(24), marginRight: RFValue(10) }]} />
              <TextInput
                style={[styles.input, { flex: 1, padding: RFValue(10) }]}
                placeholder={`Task ${index + 1}`}
                value={item.title}
                onChangeText={(text) => {
                  const newChecklists = [...checklists];
                  newChecklists[index].title = text;
                  setChecklists(newChecklists);
                }}
              />
              <TouchableOpacity style={{ padding: RFValue(10) }} onPress={() => {
                const newChecklists = checklists.filter((_, i) => i !== index);
                setChecklists(newChecklists);
              }}>
                <X color={colors.textSecondary} size={RFValue(18)} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => setChecklists([...checklists, { title: '', isCompleted: false }])}
          >
            <Plus color={colors.primary} size={RFValue(16)} />
            <Text style={styles.addBtnText}>Add Step</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Save Button */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleCreate}>
          <Text style={styles.saveBtnText}>Create Habit</Text>
        </TouchableOpacity>
      </View>

      <ActionSheet ref={actionSheetRef} containerStyle={styles.actionSheetContainer}>
        <View style={styles.actionSheetContent}>
          <Text style={styles.actionSheetTitle}>Create New Category</Text>
          <TextInput
            style={styles.actionSheetInput}
            placeholder="Category Name"
            placeholderTextColor="#9CA3AF"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
          />
          <TouchableOpacity style={styles.actionSheetSaveBtn} onPress={handleCreateCategory}>
            <Text style={styles.actionSheetSaveText}>Save Category</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </KeyboardAvoidingView>
  );
};

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', paddingVertical: RFValue(15), borderBottomWidth: 1, borderColor: colors.border },
  backBtn: { padding: RFValue(5), width: RFValue(40), alignItems: 'center' },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(16), color: colors.text },
  content: { paddingHorizontal: '5%', paddingBottom: RFValue(120), paddingTop: RFValue(20) },
  section: { marginBottom: RFValue(24) },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: RFValue(10) },
  label: { fontFamily: BOLD, fontSize: RFValue(14), color: colors.text, marginBottom: RFValue(10) },
  subLabel: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: colors.textSecondary, marginBottom: RFValue(6) },
  addText: { fontFamily: BOLD, fontSize: RFValue(12), color: colors.primary },
  input: { borderWidth: 1, borderColor: colors.border, borderRadius: RFValue(12), padding: RFValue(15), fontFamily: REGULAR, fontSize: RFValue(14), color: colors.text, backgroundColor: colors.background },
  row: { flexDirection: 'row', alignItems: 'center' },
  categoryCreatorRow: { flexDirection: 'row', alignItems: 'center' },
  catSaveBtn: { backgroundColor: colors.primary, padding: RFValue(12), borderRadius: RFValue(10), marginLeft: RFValue(8) },
  catCancelBtn: { backgroundColor: colors.border, padding: RFValue(12), borderRadius: RFValue(10), marginLeft: RFValue(8), borderWidth: 1, borderColor: colors.border },
  catScroll: { flexDirection: 'row' },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: RFValue(20), paddingHorizontal: RFValue(16), paddingVertical: RFValue(8), marginRight: RFValue(10) },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: colors.text },
  chipTextActive: { color: colors.surface },
  scheduleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  scheduleBtn: { width: '48%', paddingVertical: RFValue(12), borderWidth: 1, borderColor: colors.border, borderRadius: RFValue(10), alignItems: 'center', marginBottom: RFValue(10) },
  scheduleBtnActive: { backgroundColor: `${colors.primary}15`, borderColor: colors.primary },
  scheduleBtnText: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: colors.text },
  scheduleBtnTextActive: { color: colors.primary, fontFamily: BOLD },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: RFValue(10), paddingHorizontal: RFValue(5) },
  dayCircle: { width: RFValue(36), height: RFValue(36), borderRadius: RFValue(18), borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  dayCircleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayText: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: colors.textSecondary },
  dayTextActive: { color: colors.surface },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${colors.primary}15`, alignSelf: 'flex-start', paddingHorizontal: RFValue(12), paddingVertical: RFValue(8), borderRadius: RFValue(20), marginTop: RFValue(5) },
  addBtnText: { color: colors.primary, fontFamily: BOLD, fontSize: RFValue(12), marginLeft: RFValue(4) },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.border, paddingHorizontal: '5%', paddingTop: RFValue(15) },
  saveBtn: { backgroundColor: colors.primary, borderRadius: RFValue(12), paddingVertical: RFValue(15), alignItems: 'center' },
  saveBtnText: { fontFamily: BOLD, fontSize: RFValue(14), color: colors.surface },
  actionSheetContainer: { borderTopLeftRadius: RFValue(24), borderTopRightRadius: RFValue(24), paddingBottom: RFValue(30) },
  actionSheetContent: { padding: RFValue(20) },
  actionSheetTitle: { fontFamily: BOLD, fontSize: RFValue(16), color: colors.text, marginBottom: RFValue(15) },
  actionSheetInput: { borderWidth: 1, borderColor: colors.border, borderRadius: RFValue(12), padding: RFValue(15), fontFamily: REGULAR, fontSize: RFValue(14), color: colors.text, backgroundColor: colors.background, marginBottom: RFValue(15) },
  actionSheetSaveBtn: { backgroundColor: colors.primary, borderRadius: RFValue(12), paddingVertical: RFValue(15), alignItems: 'center' },
  actionSheetSaveText: { fontFamily: BOLD, fontSize: RFValue(14), color: colors.surface },
});

export default withLoader(withSafeAreaInsets(CreateHabitWithoutHoc));
