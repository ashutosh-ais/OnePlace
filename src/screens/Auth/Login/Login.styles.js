import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { HEIGHT } from '../../../constants/config';
import { BOLD, SEMIBOLD, INTER } from '../../../constants/fontfamily';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: '8%',
    justifyContent: 'center',
    paddingBottom: HEIGHT * 0.1,
  },
  brandContainer: { marginBottom: HEIGHT * 0.04, alignItems: 'flex-start' },
  logoPlaceholder: {
    width: RFValue(50),
    height: RFValue(50),
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { fontFamily: BOLD, fontSize: RFValue(24), color: colors.surface },
  textContainer: { marginBottom: HEIGHT * 0.05 },
  title: {
    fontFamily: BOLD,
    fontSize: RFValue(28),
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: INTER,
    fontSize: RFValue(14),
    color: colors.textSecondary,
    lineHeight: RFValue(20),
  },
  inputWrapper: { marginBottom: HEIGHT * 0.05 },
  inputLabel: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: colors.text,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    height: RFValue(56),
    paddingHorizontal: 15,
  },
  inputContainerFocused: { borderColor: colors.primary, backgroundColor: colors.surface },
  countryCode: { fontFamily: SEMIBOLD, fontSize: RFValue(14), color: colors.text },
  divider: {
    width: 1,
    height: '40%',
    backgroundColor: colors.border,
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontFamily: INTER,
    fontSize: RFValue(15),
    color: colors.text,
    height: '100%',
  },
  button: {
    height: RFValue(56),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonInactive: { backgroundColor: '#E5E7EB' },
  buttonText: { fontFamily: SEMIBOLD, fontSize: RFValue(15), color: colors.surface },
});

export default getStyles;
