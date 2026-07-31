import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { BOLD, SEMIBOLD, REGULAR } from '../../constants/fontfamily';

const { height: HEIGHT } = Dimensions.get('window');

const getStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: RFValue(24),
    borderTopRightRadius: RFValue(24),
    height: HEIGHT * 0.85,
    paddingTop: RFValue(20),
    paddingBottom: RFValue(30),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
    marginBottom: RFValue(16),
  },
  title: {
    fontFamily: BOLD,
    fontSize: RFValue(16),
    color: colors.text,
  },
  closeBtn: {
    padding: RFValue(5),
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: RFValue(20),
    borderRadius: RFValue(12),
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  canvas: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: RFValue(20),
    paddingHorizontal: RFValue(20),
  },
  colorBtn: {
    width: RFValue(36),
    height: RFValue(36),
    borderRadius: RFValue(18),
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorBtnActive: {
    borderColor: colors.text,
  },
  actionBtn: {
    backgroundColor: `${colors.primary}15`,
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(12),
    borderRadius: RFValue(8),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: RFValue(20),
    marginTop: RFValue(20),
    gap: RFValue(12),
  },
  saveAsImageBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: RFValue(14),
    borderRadius: RFValue(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveAsImageBtnText: {
    fontFamily: BOLD,
    fontSize: RFValue(13),
    color: colors.primary,
  },
  insertBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: RFValue(14),
    borderRadius: RFValue(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  insertBtnText: {
    fontFamily: BOLD,
    fontSize: RFValue(13),
    color: colors.surface,
  },
});

export default getStyles;
