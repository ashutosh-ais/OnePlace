import { StyleSheet } from 'react-native';
import { HEIGHT } from '../../constants/config';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  BLACK,
  WHITE,
  BACKGROUND,
  PRIMARY_OS,
  GRAY9,
  INPUT_BORDER,
} from '../../constants/color';
import { REGULAR, SEMIBOLD, BOLD } from '../../constants/fontfamily';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.02 },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(22), color: BLACK },
  content: {
    paddingHorizontal: '5%',
    paddingBottom: HEIGHT * 0.15,
  },

  // ─── User Card ───────────────────────────────────────────────────────────
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: RFValue(16),
    padding: RFValue(20),
    marginBottom: RFValue(20),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  avatar: {
    width: RFValue(56),
    height: RFValue(56),
    borderRadius: RFValue(28),
    backgroundColor: PRIMARY_OS,
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
    color: BLACK,
    marginBottom: RFValue(4),
  },
  memberSince: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: GRAY9,
  },

  // ─── Stats Row ──────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    marginBottom: RFValue(24),
    gap: RFValue(10),
  },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: RFValue(14),
    padding: RFValue(14),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: INPUT_BORDER,
  },
  statCardMiddle: {
    // visual emphasis for center card
    borderColor: '#FED7AA',
    backgroundColor: '#FFF7ED',
  },
  statIconWrap: {
    marginBottom: RFValue(6),
  },
  statNumber: {
    fontFamily: BOLD,
    fontSize: RFValue(22),
    color: BLACK,
    marginBottom: RFValue(2),
  },
  statLabel: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(10),
    color: GRAY9,
    textAlign: 'center',
  },

  // ─── Habits List ─────────────────────────────────────────────────────────
  section: { marginBottom: RFValue(24) },
  sectionTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: BLACK,
    marginBottom: RFValue(12),
  },
  habitList: {
    backgroundColor: WHITE,
    borderRadius: RFValue(14),
    borderWidth: 1,
    borderColor: INPUT_BORDER,
    overflow: 'hidden',
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: RFValue(16),
    paddingVertical: RFValue(14),
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER,
  },
  habitInfo: { flex: 1, marginRight: RFValue(12) },
  habitTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(14),
    color: BLACK,
    marginBottom: RFValue(3),
  },
  habitMeta: {
    fontFamily: REGULAR,
    fontSize: RFValue(11),
    color: GRAY9,
  },
  habitRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RFValue(8),
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F97316',
    borderRadius: RFValue(20),
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(3),
    gap: RFValue(3),
  },
  streakText: {
    fontFamily: BOLD,
    fontSize: RFValue(11),
    color: WHITE,
  },

  // ─── Empty State ─────────────────────────────────────────────────────────
  emptyState: {
    alignItems: 'center',
    paddingVertical: RFValue(40),
  },
  emptyText: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: BLACK,
    marginBottom: RFValue(8),
  },
  emptySubText: {
    fontFamily: REGULAR,
    fontSize: RFValue(13),
    color: GRAY9,
    textAlign: 'center',
  },

  // ─── Logout ──────────────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: RFValue(10),
    backgroundColor: '#FEF2F2',
    borderRadius: RFValue(14),
    paddingVertical: RFValue(16),
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: RFValue(8),
  },
  logoutText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(15),
    color: '#EF4444',
  },
});
