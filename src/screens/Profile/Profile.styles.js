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
  WARNING_ORANGE,
} from '../../constants/color';
import { INTER, SEMIBOLD, BOLD } from '../../constants/fontfamily';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.02 },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(22), color: BLACK },
  content: { paddingHorizontal: '5%', paddingBottom: HEIGHT * 0.1 },
  levelCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: HEIGHT * 0.03,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: PRIMARY_OS,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { color: WHITE, fontFamily: BOLD, fontSize: RFValue(20) },
  userInfo: { flex: 1 },
  userName: { fontFamily: BOLD, fontSize: RFValue(18), color: BLACK },
  userTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
    color: WARNING_ORANGE,
    marginTop: 4,
  },
  xpContainer: { marginTop: 10 },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpText: { fontFamily: BOLD, fontSize: RFValue(14), color: PRIMARY_OS },
  xpGoal: { fontFamily: INTER, fontSize: RFValue(12), color: GRAY9 },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: PRIMARY_OS },
  section: { marginBottom: HEIGHT * 0.03 },
  sectionTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(16),
    color: BLACK,
    marginBottom: 15,
  },
  templateCard: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    width: RFValue(130),
  },
  templateIcon: { fontSize: RFValue(24), marginBottom: 10 },
  templateTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: BLACK,
    marginBottom: 5,
  },
  templateSub: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(10),
    color: PRIMARY_OS,
  },
  settingsMenu: {
    backgroundColor: WHITE,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: INPUT_BORDER,
  },
  menuItemText: { fontFamily: INTER, fontSize: RFValue(14), color: BLACK },
  menuArrow: { fontFamily: SEMIBOLD, fontSize: RFValue(14), color: GRAY9 },
});
