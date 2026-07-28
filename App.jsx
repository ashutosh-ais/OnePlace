import 'react-native-gesture-handler'; // Must be at the very top for navigation
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  return (
    // Provider injects Redux state into the app
    <Provider store={store}>
      {/* SafeAreaProvider handles notches and system bars seamlessly */}
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
