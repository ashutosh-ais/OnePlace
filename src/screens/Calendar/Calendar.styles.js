import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { WIDTH, HEIGHT } from '../../constants/config';
import { BOLD, SEMIBOLD, REGULAR, INTER } from '../../constants/fontfamily';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: HEIGHT * 0.02,
  },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(22), color: colors.text },
  todayBtn: {
    backgroundColor: `${colors.primary}18`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  todayBtnText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: colors.primary,
  },
  content: {
    paddingHorizontal: '5%',
    paddingBottom: HEIGHT * 0.1,
  },
  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 15,
    marginBottom: HEIGHT * 0.03,
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {
    fontFamily: REGULAR,
    fontSize: RFValue(16),
    color: colors.text,
  },
  arrowText: {
    fontSize: RFValue(18),
    color: colors.textSecondary,
    fontFamily: BOLD,
    paddingHorizontal: 10,
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  weekdayText: {
    width: '14%',
    textAlign: 'center',
    fontFamily: INTER,
    fontSize: RFValue(12),
    color: colors.textSecondary,
  },
  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 5,
  },
  dateCellSelected: { backgroundColor: colors.primary },
  dateText: { fontFamily: SEMIBOLD, fontSize: RFValue(14), color: colors.text },
  dateTextSelected: { color: colors.surface },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginTop: 4 },
  detailsSection: { marginTop: HEIGHT * 0.01 },
  sectionTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(16),
    color: colors.text,
    marginBottom: 15,
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 0.3,
    borderColor: colors.primary,
  },
  habitInfo: { flex: 1 },
  habitTitle: { fontFamily: SEMIBOLD, fontSize: RFValue(14), color: colors.text },
  habitMeta: {
    fontFamily: INTER,
    fontSize: RFValue(11),
    color: colors.textSecondary,
    marginTop: 4,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontFamily: SEMIBOLD, fontSize: RFValue(10) },

  // Custom Day Component Styles
  customDay: {
    width: WIDTH * 0.11,
    height: WIDTH * 0.11,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: WIDTH * 0.11,
  },
  customDaySelected: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  customDayToday: {
    backgroundColor: `${colors.primary}15`,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  customDayText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: colors.text,
  },
  customDayTextSelected: {
    color: colors.surface,
  },
  customDayTextDisabled: {
    color: colors.border,
  },
  customDayDot: {
    width: RFValue(4),
    height: RFValue(4),
    borderRadius: RFValue(2),
    backgroundColor: colors.primary,
    marginTop: RFValue(2),
    position: 'absolute',
    bottom: RFValue(4),
  },
  customDayDotSelected: {
    backgroundColor: colors.surface,
  },

  // Filter Chips
  filterRow: {
    flexDirection: 'row',
    marginTop: HEIGHT * 0.02,
    marginBottom: HEIGHT * 0.02,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: colors.text,
  },
  chipTextSelected: {
    color: colors.surface,
  },

  // Habit Card
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIconWrapper: {
    width: RFValue(48),
    height: RFValue(48),
    borderRadius: RFValue(24),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIconText: {
    fontSize: RFValue(24),
  },
  cardMiddle: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: REGULAR,
    fontSize: RFValue(13),
    color: '#9CA3AF',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    width: RFValue(36),
    height: RFValue(36),
    borderRadius: RFValue(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  btnDoc: {
    backgroundColor: '#FEF2F2',
  },
  btnCheck: {
    backgroundColor: '#FDE047', // using yellow instead of green to match brand, or light red as in prompt it said marks habit complete
  },
});

export default getStyles;
