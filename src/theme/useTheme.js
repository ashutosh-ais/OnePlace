import { useSelector } from 'react-redux';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from './Theme';
import { PRIMARY_OS } from '../constants/color';

export const useTheme = () => {
  const { themeColor, colorMode } = useSelector(state => state.theme);
  const systemScheme = useColorScheme();

  const isDark =
    colorMode === 'dark' || (colorMode === 'system' && systemScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  return {
    isDark,
    colors: {
      ...colors,
      primary: themeColor || PRIMARY_OS,
    },
  };
};
