import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { WIDTH, HEIGHT } from '../../../constants/config';
import { BOLD, SEMIBOLD, INTER } from '../../../constants/fontfamily';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.02 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: RFValue(20), color: colors.text, fontFamily: BOLD },
  content: { flex: 1, paddingHorizontal: '8%', paddingTop: HEIGHT * 0.02 },
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
    lineHeight: RFValue(22),
    marginBottom: HEIGHT * 0.05,
  },
  boldText: { fontFamily: SEMIBOLD, color: colors.text },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: HEIGHT * 0.05,
  },
  otpInput: {
    width: WIDTH * 0.16,
    height: WIDTH * 0.16,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: RFValue(24),
    fontFamily: BOLD,
    color: colors.text,
  },
  otpInputFilled: { borderColor: colors.primary, backgroundColor: colors.surface },
  button: {
    height: RFValue(56),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: HEIGHT * 0.03,
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: { fontFamily: INTER, fontSize: RFValue(13), color: colors.textSecondary },
  resendLink: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: colors.primary,
  },
});

export default getStyles;
