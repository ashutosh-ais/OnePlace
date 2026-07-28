import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { PRIMARY_OS } from '../constants/color';

const withLoader = WrappedComponent => {
  const HOC = props => {
    const [isLoading, setLoading] = useState(false);

    return (
      <View style={styles.container}>
        <WrappedComponent
          {...props}
          isLoading={isLoading}
          setLoading={setLoading}
        />

        {/* Sleek transparent overlay when loading */}
        {isLoading && (
          <View style={styles.loaderContainer}>
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color={PRIMARY_OS} />
            </View>
          </View>
        )}
      </View>
    );
  };
  return HOC;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // more opaque
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999, // extremely high z-index
    elevation: 99999,
  },
  loaderBox: {
    width: 80,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default withLoader;
