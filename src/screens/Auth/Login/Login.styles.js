import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { HEIGHT } from '../../../constants/config';
import { BOLD, SEMIBOLD, INTER } from '../../../constants/fontfamily';

const getStyles = colors =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.surface },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: '8%',
      justifyContent: 'center',
      paddingBottom: HEIGHT * 0.08,
      paddingTop: HEIGHT * 0.04,
    },
    brandContainer: { marginBottom: HEIGHT * 0.03, alignItems: 'flex-start' },
    logoPlaceholder: {
      width: RFValue(60),
      height: RFValue(60),
      borderRadius: 20,
      backgroundColor: `${colors.primary}18`,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: `${colors.primary}30`,
    },
    textContainer: { marginBottom: HEIGHT * 0.04 },
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
    },
    inputWrapper: { marginBottom: HEIGHT * 0.04 },
    inputLabel: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(13),
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
    inputContainerFocused: {
      borderColor: colors.primary,
      backgroundColor: colors.surface,
    },
    countryCode: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(14),
      color: colors.text,
      marginLeft: 6,
    },
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
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
    footerBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: HEIGHT * 0.04,
    },
    footerText: {
      fontFamily: INTER,
      fontSize: RFValue(11),
      color: colors.textSecondary,
      marginLeft: 6,
    },
  });

export default getStyles;
