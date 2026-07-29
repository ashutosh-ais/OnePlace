import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { WIDTH, HEIGHT } from '../../../constants/config';
import { BOLD, SEMIBOLD, INTER } from '../../../constants/fontfamily';

const getStyles = colors =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.015 },
    backBtn: {
      width: RFValue(40),
      height: RFValue(40),
      borderRadius: RFValue(20),
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: { flex: 1, paddingHorizontal: '8%', paddingTop: HEIGHT * 0.01 },
    brandContainer: { marginBottom: HEIGHT * 0.025, alignItems: 'flex-start' },
    iconBadge: {
      width: RFValue(56),
      height: RFValue(56),
      borderRadius: 18,
      backgroundColor: `${colors.primary}18`,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
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
      marginBottom: HEIGHT * 0.04,
    },
    boldText: { fontFamily: SEMIBOLD, color: colors.text },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: HEIGHT * 0.04,
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
    otpInputFilled: {
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },
    button: {
      height: RFValue(56),
      borderRadius: 14,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: HEIGHT * 0.03,
    },
    buttonActive: {
      backgroundColor: colors.primary,
    },
    buttonInactive: { backgroundColor: colors.border },
    buttonText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(15),
      color: colors.surface,
    },
    buttonIcon: { marginLeft: 8 },
    resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    resendText: {
      fontFamily: INTER,
      fontSize: RFValue(13),
      color: colors.textSecondary,
    },
    resendLinkRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    resendIcon: { marginRight: 4 },
    resendLink: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(13),
      color: colors.primary,
    },
  });

export default getStyles;
