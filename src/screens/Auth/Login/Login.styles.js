import { StyleSheet } from 'react-native';
import { HEIGHT } from '../../../constants/config';
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
    backgroundColor: PRIMARY_OS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { fontFamily: BOLD, fontSize: RFValue(24), color: WHITE },
  textContainer: { marginBottom: HEIGHT * 0.05 },
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
    lineHeight: RFValue(20),
  },
  inputWrapper: { marginBottom: HEIGHT * 0.05 },
  inputLabel: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: BLACK,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    borderRadius: 14,
    height: RFValue(56),
    paddingHorizontal: 15,
  },
  inputContainerFocused: { borderColor: PRIMARY_OS, backgroundColor: WHITE },
  countryCode: { fontFamily: SEMIBOLD, fontSize: RFValue(14), color: BLACK },
  divider: {
    width: 1,
    height: '40%',
    backgroundColor: INPUT_BORDER,
    marginHorizontal: 12,
  },
  input: {
    flex: 1,
    fontFamily: INTER,
    fontSize: RFValue(15),
    color: BLACK,
    height: '100%',
  },
  button: {
    height: RFValue(56),
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
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
});
