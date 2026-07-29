import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { HEIGHT, WIDTH } from '../../constants/config';
import { WHITE, GRAY9 } from '../../constants/color';
import { BOLD, SEMIBOLD, REGULAR } from '../../constants/fontfamily';

const getStyles = colors =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.02 },
    headerTitle: {
      fontFamily: BOLD,
      fontSize: RFValue(22),
      color: colors.text,
    },
    content: {
      paddingHorizontal: '5%',
      paddingBottom: HEIGHT * 0.15,
    },

    // ─── User Card ───────────────────────────────────────────────────────────
    userCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: RFValue(16),
      padding: RFValue(20),
      marginBottom: RFValue(20),
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatar: {
      width: RFValue(56),
      height: RFValue(56),
      borderRadius: RFValue(28),
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: RFValue(16),
    },
    avatarText: {
      color: WHITE,
      fontFamily: BOLD,
      fontSize: RFValue(16),
      letterSpacing: 1,
    },
    userInfo: { flex: 1 },
    phoneNumber: {
      fontFamily: BOLD,
      fontSize: RFValue(17),
      color: colors.text,
      marginBottom: RFValue(4),
    },
    memberSince: {
      fontFamily: REGULAR,
      fontSize: RFValue(12),
      color: colors.textSecondary,
    },

    // ─── Stats Row ──────────────────────────────────────────────────────────
    statsRow: {
      flexDirection: 'row',
      marginBottom: RFValue(24),
      gap: RFValue(10),
    },
    statCard: {
      flex: 1,
      height: RFValue(90),
      backgroundColor: colors.surface,
      borderRadius: WIDTH * 0.03,
      paddingVertical: HEIGHT * 0.04,
      paddingHorizontal: WIDTH * 0.01,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      position: 'relative',
    },
    bgIconWrap: {
      position: 'absolute',
      right: -RFValue(8),
      bottom: -RFValue(8),
      opacity: 0.25,
    },
    statContent: {
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1,
    },
    statNumber: {
      fontFamily: BOLD,
      fontSize: RFValue(22),
      color: colors.text,
      marginBottom: RFValue(2),
    },
    statLabel: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(11),
      color: colors.textSecondary,
      textAlign: 'center',
    },

    // ─── Theme Settings ──────────────────────────────────────────────────────
    themeContainer: {
      backgroundColor: colors.surface,
      borderRadius: RFValue(16),
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'column',
      padding: RFValue(16),
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingRowNoBorder: {
      borderBottomWidth: 0,
    },
    settingLabelWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: RFValue(12),
    },
    settingLabel: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(14),
      color: colors.text,
      marginLeft: RFValue(8),
    },
    colorPaletteRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: RFValue(4),
    },
    colorSwatch: {
      width: RFValue(36),
      height: RFValue(36),
      borderRadius: RFValue(18),
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorSwatchActive: {
      borderColor: colors.text,
    },
    modeToggleRow: {
      flexDirection: 'row',
      backgroundColor: colors.background,
      borderRadius: RFValue(8),
      padding: RFValue(4),
    },
    modeBtn: {
      flex: 1,
      paddingVertical: RFValue(8),
      borderRadius: RFValue(6),
      alignItems: 'center',
    },
    modeBtnText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.textSecondary,
    },

    // ─── Habits List (Agenda Tile Style) ───────────────────────────────────
    section: { marginBottom: RFValue(24) },
    sectionTitle: {
      fontFamily: BOLD,
      fontSize: RFValue(16),
      color: colors.text,
      marginBottom: RFValue(12),
    },
    habitCard: {
      backgroundColor: colors.surface,
      borderRadius: WIDTH * 0.025,
      padding: WIDTH * 0.04,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: HEIGHT * 0.01,
      borderWidth: 1,
      borderColor: colors.border,
    },
    habitMain: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    iconContainer: {
      width: WIDTH * 0.11,
      height: WIDTH * 0.11,
      borderRadius: WIDTH * 0.1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    habitDetails: {
      marginLeft: RFValue(12),
      flex: 1,
    },
    habitTitle: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(12),
      color: colors.text,
      marginBottom: HEIGHT * 0.002,
    },
    habitMeta: {
      fontFamily: REGULAR,
      fontSize: RFValue(11),
      color: GRAY9,
    },
    habitRight: { flexDirection: 'row', alignItems: 'center' },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#EF444415',
      paddingHorizontal: RFValue(8),
      paddingVertical: RFValue(3),
      borderRadius: RFValue(8),
      marginRight: RFValue(12),
    },
    streakText: {
      fontFamily: BOLD,
      fontSize: RFValue(11),
      color: '#EF4444',
      marginLeft: 4,
    },

    emptyState: {
      alignItems: 'center',
      paddingVertical: RFValue(30),
      backgroundColor: colors.surface,
      borderRadius: RFValue(12),
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: HEIGHT * 0.01,
    },
    emptyText: {
      fontFamily: SEMIBOLD,
      fontSize: RFValue(16),
      color: colors.text,
      marginBottom: RFValue(4),
    },
    emptySubText: {
      fontFamily: REGULAR,
      fontSize: RFValue(13),
      color: colors.textSecondary,
    },

    logoutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: HEIGHT * 0.015,
      backgroundColor: colors.surface,
      borderRadius: WIDTH * 0.02,
      borderWidth: 1,
      borderColor: colors.danger + '40',
    },
    logoutText: {
      fontFamily: BOLD,
      fontSize: RFValue(16),
      color: colors.danger,
      marginLeft: RFValue(8),
    },
  });

export default getStyles;
