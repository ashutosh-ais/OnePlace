import { StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { Dimensions } from 'react-native';

export const { width: WIDTH, height: HEIGHT } = Dimensions.get('window');

export const MyStatusBar = ({
  backgroundColor,
  barStyle,
  translucent = false,
}) => (
  <SafeAreaView>
    <StatusBar
      animated={true}
      translucent={translucent}
      backgroundColor={backgroundColor}
      barStyle={barStyle}
    />
  </SafeAreaView>
);

export const STYLES = StyleSheet.create({
  elevation: {
    shadowColor: '#1C1C1C',
    shadowOffset: { width: 2, height: 1.54 },
    shadowOpacity: 0.15,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export const STYLESCONFIG = StyleSheet.create({
  elevation: {
    shadowColor: '#1C1C1C',
    shadowOffset: { width: 2, height: 1.5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 2,
  },
});

export let mod = false;
