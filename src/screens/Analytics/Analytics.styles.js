import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { HEIGHT } from '../../constants/config';
import { GREEN_SUCCESS } from '../../constants/color';
import { BOLD, SEMIBOLD, INTER } from '../../constants/fontfamily';

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: '5%', paddingVertical: HEIGHT * 0.02 },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(22), color: colors.text },
  content: { paddingHorizontal: '5%', paddingBottom: HEIGHT * 0.1 },
  mainScoreCard: {
    backgroundColor: colors.primary,
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
    color: colors.surface,
    marginVertical: 10,
  },
  insightText: {
    fontFamily: INTER,
    fontSize: RFValue(12),
    color: colors.surface,
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
    backgroundColor: colors.surface,
    width: '48%',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  statBoxTitle: { fontFamily: INTER, fontSize: RFValue(11), color: colors.textSecondary },
  statBoxValue: {
    fontFamily: BOLD,
    fontSize: RFValue(20),
    color: colors.text,
    marginTop: 5,
  },
  heatmapCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: HEIGHT * 0.03,
  },
  sectionTitle: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(16),
    color: colors.text,
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
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  catName: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
});

export default getStyles;
