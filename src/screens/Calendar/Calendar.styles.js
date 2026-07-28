import { StyleSheet } from 'react-native';
import { HEIGHT } from '../../constants/config';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  BLACK,
  WHITE,
  BACKGROUND,
  PRIMARY_OS,
  GRAY9,
} from '../../constants/color';
import { INTER, SEMIBOLD, BOLD } from '../../constants/fontfamily';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: HEIGHT * 0.02,
  },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(22), color: BLACK },
  todayBtn: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  todayBtnText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: PRIMARY_OS,
  },
  content: { paddingHorizontal: '5%', paddingBottom: HEIGHT * 0.1 },
  calendarCard: {
    backgroundColor: WHITE,
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
  monthText: { fontFamily: SEMIBOLD, fontSize: RFValue(16), color: BLACK },
  arrowText: {
    fontSize: RFValue(18),
    color: GRAY9,
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
    color: GRAY9,
  },
  datesGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dateCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 5,
  },
  dateCellSelected: { backgroundColor: PRIMARY_OS },
  dateText: { fontFamily: SEMIBOLD, fontSize: RFValue(14), color: BLACK },
  dateTextSelected: { color: WHITE },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginTop: 4 },
  detailsSection: { marginTop: HEIGHT * 0.01 },
  sectionTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(16),
    color: BLACK,
    marginBottom: 15,
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: WHITE,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  habitInfo: { flex: 1 },
  habitTitle: { fontFamily: SEMIBOLD, fontSize: RFValue(14), color: BLACK },
  habitMeta: {
    fontFamily: INTER,
    fontSize: RFValue(11),
    color: GRAY9,
    marginTop: 4,
  },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusBadgeText: { fontFamily: SEMIBOLD, fontSize: RFValue(10) },
});
