import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { WIDTH, HEIGHT } from '../../constants/config';
import { BOLD, SEMIBOLD, REGULAR, INTER } from '../../constants/fontfamily';
import { GRAY9 } from '../../constants/color';

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
    borderWidth: 1,
    borderColor: colors.border,
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
  customDayTextToday: {
    color: colors.primary,
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

  // Agenda View Habit Card Styles (No shadows or elevation)
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
  habitTitleCompleted: {
    textDecorationLine: 'line-through',
    color: GRAY9,
  },
  habitMeta: {
    fontFamily: REGULAR,
    fontSize: RFValue(11),
    color: GRAY9,
  },
  habitRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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

  emptyText: {
    fontFamily: REGULAR,
    color: GRAY9,
    fontSize: RFValue(12),
    marginTop: RFValue(10),
  },
});

export default getStyles;
