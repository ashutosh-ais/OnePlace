import React, { Fragment, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { BOLD } from '../constants/fontfamily';
import { WHITE } from '../constants/color';

const withLoader = WrappedComponent => {
  const ComponentWithLoader = props => {
    const [loading, setLoading] = useState(false);

    return (
      <Fragment>
        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color={WHITE} />
            {/* <Text style={styles.loadingText}>Loading!</Text> */}
          </View>
        )}
        <WrappedComponent
          {...props}
          isLoading={loading}
          setLoading={setLoading}
        />
      </Fragment>
    );
  };

  return ComponentWithLoader;
};

const styles = StyleSheet.create({
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    fontFamily: BOLD,
  },
});

export default withLoader;
