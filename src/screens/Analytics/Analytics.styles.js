import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  BACKGROUND,
  BLACK,
  GRAY9,
  GREEN_SUCCESS,
  PRIMARY_OS,
  WHITE,
} from '../../constants/color';
import { HEIGHT } from '../../constants/config';
import { BOLD, INTER, SEMIBOLD } from '../../constants/fontfamily';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND },
  header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.02 },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(22), color: BLACK },
  content: { paddingHorizontal: '5%', paddingBottom: HEIGHT * 0.1 },
  mainScoreCard: {
    backgroundColor: PRIMARY_OS,
    borderRadius: 16,
    padding: 20,
    marginBottom: HEIGHT * 0.03,
  },
  mainScoreTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(14),
    color: 'rgba(255,255,255,0.8)',
  },
  mainScoreValue: {
    fontFamily: BOLD,
    fontSize: RFValue(40),
    color: WHITE,
    marginVertical: 10,
  },
  insightText: {
    fontFamily: INTER,
    fontSize: RFValue(12),
    color: WHITE,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: HEIGHT * 0.03,
  },
  statBox: {
    backgroundColor: WHITE,
    width: '48%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  statBoxTitle: { fontFamily: INTER, fontSize: RFValue(11), color: GRAY9 },
  statBoxValue: {
    fontFamily: BOLD,
    fontSize: RFValue(20),
    color: BLACK,
    marginTop: 5,
  },
  heatmapCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 20,
    marginBottom: HEIGHT * 0.03,
  },
  sectionTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(16),
    color: BLACK,
    marginBottom: 15,
  },
  heatmapGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  heatBlock: {
    width: 15,
    height: 15,
    borderRadius: 3,
    backgroundColor: GREEN_SUCCESS,
  },
  categorySection: { marginBottom: HEIGHT * 0.03 },
  catRow: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  catName: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: BLACK,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: PRIMARY_OS },
});
