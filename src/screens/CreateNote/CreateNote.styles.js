import { StyleSheet, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { BOLD, SEMIBOLD, REGULAR } from '../../constants/fontfamily';

const getStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(12),
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  headerBtn: {
    padding: RFValue(8),
  },
  headerTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: colors.text,
  },
  saveBtnText: {
    fontFamily: BOLD,
    fontSize: RFValue(14),
    color: colors.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: RFValue(16),
  },
  titleInput: {
    fontFamily: BOLD,
    fontSize: RFValue(20),
    color: colors.text,
    paddingVertical: RFValue(16),
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: RFValue(8),
  },
  editorContainer: {
    flex: 1,
    marginTop: RFValue(8),
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: RFValue(12),
    overflow: 'hidden',
  },
  editor: {
    flex: 1,
    backgroundColor: colors.background,
  },
  toolbar: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: RFValue(12),
    borderTopRightRadius: RFValue(12),
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  drawBtnContainer: {
    padding: RFValue(16),
    alignItems: 'center',
  },
  drawBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.primary}15`,
    paddingVertical: RFValue(12),
    paddingHorizontal: RFValue(24),
    borderRadius: RFValue(12),
    gap: RFValue(8),
  },
  drawBtnText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(14),
    color: colors.primary,
  },
});

export default getStyles;
