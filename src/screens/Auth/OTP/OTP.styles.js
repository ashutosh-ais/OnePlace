import { StyleSheet } from 'react-native';
import { HEIGHT, WIDTH } from '../../../constants/config';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  BLACK,
  WHITE,
  PRIMARY_OS,
  GRAY9,
  INPUT_BORDER,
} from '../../../constants/color';
import { INTER, SEMIBOLD, BOLD } from '../../../constants/fontfamily';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: WHITE },
  header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.02 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backArrow: { fontSize: RFValue(20), color: BLACK, fontFamily: BOLD },
  content: { flex: 1, paddingHorizontal: '8%', paddingTop: HEIGHT * 0.02 },
  title: {
    fontFamily: BOLD,
    fontSize: RFValue(28),
    color: BLACK,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: INTER,
    fontSize: RFValue(14),
    color: GRAY9,
    lineHeight: RFValue(22),
    marginBottom: HEIGHT * 0.05,
  },
  boldText: { fontFamily: SEMIBOLD, color: BLACK },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: HEIGHT * 0.05,
  },
  otpInput: {
    width: WIDTH * 0.16,
    height: WIDTH * 0.16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 14,
    textAlign: 'center',
    fontSize: RFValue(24),
    fontFamily: BOLD,
    color: BLACK,
  },
  otpInputFilled: { borderColor: PRIMARY_OS, backgroundColor: WHITE },
  button: {
    height: RFValue(56),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: HEIGHT * 0.03,
  },
  buttonActive: {
    backgroundColor: PRIMARY_OS,
    shadowColor: PRIMARY_OS,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonInactive: { backgroundColor: '#E5E7EB' },
  buttonText: { fontFamily: SEMIBOLD, fontSize: RFValue(15), color: WHITE },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendText: { fontFamily: INTER, fontSize: RFValue(13), color: GRAY9 },
  resendLink: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: PRIMARY_OS,
  },
});
