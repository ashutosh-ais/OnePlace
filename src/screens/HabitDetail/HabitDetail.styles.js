import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { BOLD, SEMIBOLD, REGULAR } from '../../constants/fontfamily';

const { width: WIDTH } = Dimensions.get('window');
const DAY_SIZE = Math.floor((WIDTH * 0.1) / 2) * 2;

const getStyles = (colors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: '5%',
    paddingVertical: RFValue(15),
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  backBtn: {
    padding: RFValue(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: RFValue(4),
  },
  headerTitle: { fontFamily: BOLD, fontSize: RFValue(16), color: colors.text },
  content: {
    paddingHorizontal: '5%',
    paddingBottom: RFValue(40),
    paddingTop: RFValue(20),
  },
  titleSection: { alignItems: 'center', marginBottom: RFValue(30) },
  iconCircle: {
    width: RFValue(72),
    height: RFValue(72),
    borderRadius: RFValue(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: RFValue(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryBadge: {
    borderWidth: 1,
    paddingHorizontal: RFValue(12),
    paddingVertical: RFValue(6),
    borderRadius: RFValue(20),
    marginBottom: RFValue(12),
  },
  categoryText: {
    color: colors.primary,
    fontFamily: SEMIBOLD,
    fontSize: RFValue(12),
  },
  habitTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(22),
    color: colors.text,
    marginBottom: RFValue(8),
    textAlign: 'center',
  },
  scheduleText: { fontFamily: REGULAR, fontSize: RFValue(13), color: colors.textSecondary },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(30),
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: RFValue(12),
    padding: RFValue(16),
    marginHorizontal: RFValue(5),
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statLabel: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(11),
    color: colors.textSecondary,
    marginBottom: RFValue(8),
  },
  statValue: { fontFamily: BOLD, fontSize: RFValue(24), color: colors.text },
  statSub: { fontSize: RFValue(14), color: colors.textSecondary, fontFamily: REGULAR },
  section: { marginBottom: RFValue(30) },
  sectionTitle: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: colors.text,
    marginBottom: RFValue(20),
  },
  timelineContainer: { marginLeft: RFValue(10) },
  timelineRow: { flexDirection: 'row', minHeight: RFValue(70) },
  timelineIndicator: {
    alignItems: 'center',
    width: RFValue(30),
    marginRight: RFValue(15),
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: RFValue(4),
  },
  timelineContent: {
    flex: 1,
    paddingBottom: RFValue(30),
    paddingTop: RFValue(2),
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(4),
  },
  timelineDate: { fontFamily: BOLD, fontSize: RFValue(14), color: colors.text },
  timelineStatus: { fontFamily: SEMIBOLD, fontSize: RFValue(12), color: colors.textSecondary },
  timelineMetric: {
    fontFamily: SEMIBOLD,
    fontSize: RFValue(13),
    color: colors.primary,
    marginBottom: RFValue(8),
  },
  notesBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: RFValue(10),
    borderRadius: RFValue(8),
    marginTop: RFValue(10),
  },
  notesText: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: colors.textSecondary,
    marginLeft: RFValue(8),
    flex: 1,
  },

  calendarCard: {
    backgroundColor: colors.surface,
    borderRadius: RFValue(16),
    position: 'relative', // for overlay
  },
  actionSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(16),
    zIndex: 10,
  },
  customDayWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  customDay: {
    width: DAY_SIZE,
    height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: WIDTH * 0.01,
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
  customDayTextToday: {
    color: colors.primary,
  },
  customDayTextDisabled: {
    color: colors.border, // light gray
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

  actionSheetContainer: {
    borderTopLeftRadius: RFValue(24),
    borderTopRightRadius: RFValue(24),
    paddingBottom: RFValue(20),
    backgroundColor: colors.surface,
  },
  actionSheetScroll: { padding: RFValue(20) },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(8),
  },
  modalTitle: { fontFamily: BOLD, fontSize: RFValue(18), color: colors.text },
  modalSubtitle: {
    fontFamily: REGULAR,
    fontSize: RFValue(12),
    color: colors.textSecondary,
    marginBottom: RFValue(20),
  },
});

export default getStyles;
