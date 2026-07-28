import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { createNewHabit } from '../../redux/Slice/HabitSlice';
import FocusAwareStatusBar from '../../components/FocusAwareStatusBar';
import withLoader from '../../hoc/withLoader';
import styles from './CreateHabit.styles';
import { X, Check } from 'lucide-react-native';
import { PRIMARY_OS } from '../../constants/color';
import { RFValue } from 'react-native-responsive-fontsize';

const SCHEDULE_TYPES = ['Every Day', 'Specific Days', 'X Times / Period', 'Custom'];

const CreateHabitWithoutHoc = ({ navigation, insets, setLoading }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector(state => state.habits);

  const [title, setTitle] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [scheduleType, setScheduleType] = useState('Every Day');

  const mainContainerStyles = {
    paddingTop: insets.top,
    paddingLeft: insets.left,
    paddingRight: insets.right,
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a habit name.');
      return;
    }
    if (!selectedCategoryId) {
      Alert.alert('Missing Field', 'Please select a category.');
      return;
    }

    setLoading(true);
    await dispatch(createNewHabit({ categoryId: selectedCategoryId, title: title.trim(), scheduleType }));
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
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Read 20 pages"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
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
                onPress={() => setScheduleType(type)}
              >
                <Text style={[styles.scheduleBtnText, scheduleType === type && styles.scheduleBtnTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <Text style={styles.label}>Reminders</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Text style={styles.addBtnText}>+ Add Reminder Time</Text>
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

export default withLoader(withSafeAreaInsets(CreateHabitWithoutHoc));
