/* eslint-disable react-native/no-inline-styles */
import { ArrowLeft, Palette } from 'lucide-react-native';
import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-pell-rich-editor';
import { RFValue } from 'react-native-responsive-fontsize';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import DrawingCanvas from '../../components/DrawingCanvas/DrawingCanvas';
import { saveHabitNote, editHabitNote } from '../../redux/Slice/HabitSlice';
import { useTheme } from '../../theme/useTheme';
import getStyles from './CreateNote.styles';

const CreateNote = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const habit = route.params?.habit;
  const dateStr = route.params?.dateStr;
  const existingNote = route.params?.existingNote;

  const [title, setTitle] = useState(existingNote?.title || '');
  const [initialContent] = useState(existingNote?.content_html || '');
  const richText = useRef(null);
  const [isDrawingVisible, setIsDrawingVisible] = useState(false);

  const handleSave = async () => {
    const contentHtml = await richText.current?.getContentHtml();
    
    const isEmptyText = !contentHtml || contentHtml.replace(/<[^>]*>?/gm, '').trim().length === 0;
    const hasImage = contentHtml && contentHtml.includes('<img');
    const isEmptyTitle = !title || title.trim().length === 0;

    if (isEmptyTitle && isEmptyText && !hasImage) {
      Alert.alert('Empty Note', 'Please enter a title, some text, or draw an image before saving.');
      return;
    }
    
    if (existingNote) {
      dispatch(
        editHabitNote({
          noteId: existingNote.id,
          title,
          contentHtml,
        }),
      );
    } else {
      dispatch(
        saveHabitNote({
          habitId: habit?.id,
          dateStr,
          title,
          contentHtml,
        }),
      );
    }
    navigation.goBack();
  };

  const handleInsertImage = base64Url => {
    richText.current?.insertImage(base64Url);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <ArrowLeft color={colors.text} size={RFValue(24)} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{existingNote ? 'Edit Note' : 'New Note'}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.headerBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          <TextInput
            style={styles.titleInput}
            placeholder="Note Title"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />

          <View style={styles.editorContainer}>
            <RichToolbar
              style={styles.toolbar}
              editor={richText}
              iconTint={colors.textSecondary}
              selectedIconTint={colors.primary}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.alignLeft,
                actions.alignCenter,
                actions.alignRight,
                actions.undo,
                actions.redo,
              ]}
            />
            <RichEditor
              ref={richText}
              initialContentHTML={initialContent}
              style={styles.editor}
              placeholder="Write your note here..."
              editorStyle={{
                backgroundColor: colors.background,
                color: colors.text,
                placeholderColor: colors.textSecondary,
              }}
              useContainer={false}
            />
          </View>

          <View style={styles.drawBtnContainer}>
            <TouchableOpacity
              style={styles.drawBtn}
              onPress={() => setIsDrawingVisible(true)}
            >
              <Palette color={colors.primary} size={RFValue(18)} />
              <Text style={styles.drawBtnText}>Draw on Canvas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <DrawingCanvas
        visible={isDrawingVisible}
        onClose={() => setIsDrawingVisible(false)}
        onInsertImage={handleInsertImage}
      />
    </View>
  );
};

export default CreateNote;
