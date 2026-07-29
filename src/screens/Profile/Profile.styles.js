import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { HEIGHT } from '../../constants/config';
import { WHITE } from '../../constants/color';
import { BOLD, SEMIBOLD, REGULAR } from '../../constants/fontfamily';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.02 },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(22), color: colors.text },
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
    backgroundColor: colors.surface,
    borderRadius: RFValue(14),
    padding: RFValue(14),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCardMiddle: {
    borderColor: colors.warning + '40', // 40 opacity
    backgroundColor: colors.warning + '10', // 10 opacity
  },
  statIconWrap: {
    marginBottom: RFValue(6),
  },
  statNumber: {
    fontFamily: BOLD,
    fontSize: RFValue(22),
    color: colors.text,
    marginBottom: RFValue(2),
  },
  statLabel: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(10),
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

  // ─── Habits List ─────────────────────────────────────────────────────────
  section: { marginBottom: RFValue(24) },
  sectionTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: colors.text,
    marginBottom: RFValue(12),
  },
  habitList: { gap: RFValue(10) },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: RFValue(12),
    padding: RFValue(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  habitInfo: { flex: 1, marginRight: RFValue(10) },
  habitTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(15),
    color: colors.text,
    marginBottom: RFValue(4),
  },
  habitMeta: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: colors.textSecondary,
  },
  habitRight: { flexDirection: 'row', alignItems: 'center' },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(2),
    borderRadius: RFValue(12),
    marginRight: RFValue(10),
  },
  streakText: {
    fontFamily: BOLD,
    color: WHITE,
    fontSize: RFValue(10),
    marginLeft: RFValue(4),
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: RFValue(30),
    backgroundColor: colors.surface,
    borderRadius: RFValue(12),
    borderWidth: 1,
    borderColor: colors.border,
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
    paddingVertical: RFValue(16),
    backgroundColor: colors.surface,
    borderRadius: RFValue(12),
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
