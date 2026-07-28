import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert, StyleSheet } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { createRichHabit, createNewCategory } from '../../redux/Slice/HabitSlice';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import withLoader from '../../hoc/withLoader';
import { X, Check, Plus } from 'lucide-react-native';
import { PRIMARY_OS, WHITE, GRAY9, INPUT_BORDER, BLACK } from '../../constants/color';
import { RFValue } from 'react-native-responsive-fontsize';
import { BOLD, REGULAR, SEMIBOLD } from '../../constants/fontfamily';

const SCHEDULE_TYPES = ['Every Day', 'Specific Days', 'X Times / Period', 'Custom'];
const WEEK_DAYS = [{ id: 'Mon', label: 'M' }, { id: 'Tue', label: 'T' }, { id: 'Wed', label: 'W' }, { id: 'Thu', label: 'T' }, { id: 'Fri', label: 'F' }, { id: 'Sat', label: 'S' }, { id: 'Sun', label: 'S' }];

const CreateHabitWithoutHoc = ({ navigation, insets, setLoading }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.habits);

  const [title, setTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
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
    setIsCreatingCategory(false);
    setLoading(false);
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
    if (!selectedCategoryId) return Alert.alert('Missing Field', 'Please select a category.');
    if (scheduleType === 'Specific Days' && selectedDays.length === 0) return Alert.alert('Missing Field', 'Please select at least one day.');

    const scheduleValue = scheduleType === 'Specific Days' ? selectedDays.join(',') : '';

    setLoading(true);
    await dispatch(createRichHabit({ 
      categoryId: selectedCategoryId, 
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
    <View style={[styles.container, mainContainerStyles]}>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <X color="#111827" size={RFValue(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Habit</Text>
        <TouchableOpacity onPress={handleCreate} style={styles.backBtn}>
          <Check color={PRIMARY_OS} size={RFValue(24)} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
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
            {!isCreatingCategory && (
              <TouchableOpacity onPress={() => setIsCreatingCategory(true)}>
                <Text style={styles.addText}>+ New</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {isCreatingCategory ? (
            <View style={styles.categoryCreatorRow}>
              <TextInput
                style={[styles.input, { flex: 1, padding: RFValue(10) }]}
                placeholder="Category Name"
                value={newCategoryName}
                onChangeText={setNewCategoryName}
                autoFocus
              />
              <TouchableOpacity style={styles.catSaveBtn} onPress={handleCreateCategory}>
                <Check color={WHITE} size={RFValue(18)} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.catCancelBtn} onPress={() => setIsCreatingCategory(false)}>
                <X color={GRAY9} size={RFValue(18)} />
              </TouchableOpacity>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.chip, selectedCategoryId === cat.id && styles.chipActive]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                >
                  <Text style={[styles.chipText, selectedCategoryId === cat.id && styles.chipTextActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
              {categories.length === 0 && (
                <Text style={styles.subLabel}>No categories yet. Click "+ New" to add one.</Text>
              )}
            </ScrollView>
          )}
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
                <X color={GRAY9} size={RFValue(18)} />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity 
            style={styles.addBtn}
            onPress={() => setChecklists([...checklists, { title: '', isCompleted: false }])}
          >
            <Plus color={PRIMARY_OS} size={RFValue(16)} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: '5%', paddingVertical: RFValue(15), borderBottomWidth: 1, borderColor: INPUT_BORDER },
  backBtn: { padding: RFValue(5), width: RFValue(40), alignItems: 'center' },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(16), color: BLACK },
  content: { paddingHorizontal: '5%', paddingBottom: RFValue(120), paddingTop: RFValue(20) },
  section: { marginBottom: RFValue(24) },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: RFValue(10) },
  label: { fontFamily: BOLD, fontSize: RFValue(14), color: BLACK, marginBottom: RFValue(10) },
  subLabel: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: GRAY9, marginBottom: RFValue(6) },
  addText: { fontFamily: BOLD, fontSize: RFValue(12), color: PRIMARY_OS },
  input: { borderWidth: 1, borderColor: INPUT_BORDER, borderRadius: RFValue(12), padding: RFValue(15), fontFamily: REGULAR, fontSize: RFValue(14), color: BLACK, backgroundColor: '#F9FAFB' },
  row: { flexDirection: 'row', alignItems: 'center' },
  categoryCreatorRow: { flexDirection: 'row', alignItems: 'center' },
  catSaveBtn: { backgroundColor: PRIMARY_OS, padding: RFValue(12), borderRadius: RFValue(10), marginLeft: RFValue(8) },
  catCancelBtn: { backgroundColor: '#F3F4F6', padding: RFValue(12), borderRadius: RFValue(10), marginLeft: RFValue(8), borderWidth: 1, borderColor: INPUT_BORDER },
  catScroll: { flexDirection: 'row' },
  chip: { borderWidth: 1, borderColor: INPUT_BORDER, borderRadius: RFValue(20), paddingHorizontal: RFValue(16), paddingVertical: RFValue(8), marginRight: RFValue(10) },
  chipActive: { backgroundColor: PRIMARY_OS, borderColor: PRIMARY_OS },
  chipText: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: BLACK },
  chipTextActive: { color: WHITE },
  scheduleGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  scheduleBtn: { width: '48%', paddingVertical: RFValue(12), borderWidth: 1, borderColor: INPUT_BORDER, borderRadius: RFValue(10), alignItems: 'center', marginBottom: RFValue(10) },
  scheduleBtnActive: { backgroundColor: '#EFF6FF', borderColor: PRIMARY_OS },
  scheduleBtnText: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: BLACK },
  scheduleBtnTextActive: { color: PRIMARY_OS, fontFamily: BOLD },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: RFValue(10), paddingHorizontal: RFValue(5) },
  dayCircle: { width: RFValue(36), height: RFValue(36), borderRadius: RFValue(18), borderWidth: 1, borderColor: INPUT_BORDER, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' },
  dayCircleActive: { backgroundColor: PRIMARY_OS, borderColor: PRIMARY_OS },
  dayText: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: GRAY9 },
  dayTextActive: { color: WHITE },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', alignSelf: 'flex-start', paddingHorizontal: RFValue(12), paddingVertical: RFValue(8), borderRadius: RFValue(20), marginTop: RFValue(5) },
  addBtnText: { color: PRIMARY_OS, fontFamily: BOLD, fontSize: RFValue(12), marginLeft: RFValue(4) },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: WHITE, borderTopWidth: 1, borderColor: INPUT_BORDER, paddingHorizontal: '5%', paddingTop: RFValue(15) },
  saveBtn: { backgroundColor: PRIMARY_OS, borderRadius: RFValue(12), paddingVertical: RFValue(15), alignItems: 'center' },
  saveBtnText: { fontFamily: BOLD, fontSize: RFValue(14), color: WHITE },
});

export default withLoader(withSafeAreaInsets(CreateHabitWithoutHoc));
