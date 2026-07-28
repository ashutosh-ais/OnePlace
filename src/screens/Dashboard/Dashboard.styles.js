import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  BLACK,
  GRAY9,
  GREEN_SUCCESS,
  INPUT_BORDER,
  PRIMARY_OS,
  WHITE,
} from '../../constants/color';
import { HEIGHT, WIDTH } from '../../constants/config';
import { BOLD, INTER, SEMIBOLD } from '../../constants/fontfamily';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: HEIGHT * 0.02,
  },
  greeting: {
    fontFamily: BOLD,
    fontSize: RFValue(20),
    color: BLACK,
  },
  dateText: {
    fontFamily: INTER,
    fontSize: RFValue(12),
    color: GRAY9,
    marginTop: HEIGHT * 0.005,
  },
  profileBtn: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    backgroundColor: PRIMARY_OS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: WHITE,
    fontFamily: SEMIBOLD,
    fontSize: RFValue(14),
  },
  scrollContent: {
    paddingHorizontal: '5%',
    paddingBottom: HEIGHT * 0.1,
  },
  scoreCard: {
    backgroundColor: WHITE,
    borderRadius: RFValue(16),
    padding: RFValue(20),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: HEIGHT * 0.01,
    marginBottom: HEIGHT * 0.03,
  },
  scoreTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(14),
    color: BLACK,
  },
  scoreValue: {
    fontFamily: BOLD,
    fontSize: RFValue(36),
    color: PRIMARY_OS,
    marginVertical: HEIGHT * 0.005,
  },
  scoreMax: {
    fontSize: RFValue(18),
    color: GRAY9,
  },
  scoreSubtitle: {
    fontFamily: INTER,
    fontSize: RFValue(12),
    color: GREEN_SUCCESS,
  },
  scoreCircle: {
    width: RFValue(70),
    height: RFValue(70),
    borderRadius: RFValue(35),
    borderWidth: 4,
    borderColor: GREEN_SUCCESS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    fontFamily: BOLD,
    fontSize: RFValue(14),
    color: BLACK,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HEIGHT * 0.02,
  },
  sectionTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(16),
    color: BLACK,
  },
  seeAllText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: PRIMARY_OS,
  },
  habitCard: {
    backgroundColor: WHITE,
    borderRadius: RFValue(12),
    padding: RFValue(16),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: HEIGHT * 0.015,
  },
  habitMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: RFValue(24),
    height: RFValue(24),
    borderRadius: RFValue(6),
    borderWidth: 2,
    borderColor: INPUT_BORDER,
    marginRight: WIDTH * 0.04,
  },
  checkboxActive: {
    backgroundColor: GREEN_SUCCESS,
    borderColor: GREEN_SUCCESS,
  },
  habitTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(15),
    color: BLACK,
  },
  habitTitleCompleted: {
    textDecorationLine: 'line-through',
    color: GRAY9,
  },
  habitMeta: {
    fontFamily: INTER,
    fontSize: RFValue(11),
    color: GRAY9,
    marginTop: HEIGHT * 0.005,
  },
  streakBadge: {
    backgroundColor: '#FFF7ED', // Light orange
    paddingHorizontal: RFValue(10),
    paddingVertical: RFValue(4),
    borderRadius: RFValue(12),
  },
  streakText: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: '#EA580C',
  },
});
