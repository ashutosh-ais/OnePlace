/* eslint-disable react-native/no-inline-styles */
import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import { Dimensions, StyleSheet, View, Animated } from 'react-native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
const CONFETTI_COUNT = 65;
const COLORS = [
  '#FFC700',
  '#FF3D00',
  '#00E676',
  '#2979FF',
  '#FF1744',
  '#AA00FF',
  '#FF4081',
];

const ConfettiParticle = ({ startX, startY }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Initialize random values once on mount
  const config = useRef({
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    size: Math.random() * 3 + 3.5, // Crisp elegant size (3.5px to 6.5px)
    shape: Math.random() > 0.45 ? 'circle' : 'square',
    spreadX: Math.random() * windowWidth, // Cover the entire width of the screen
    burstY: startY - (Math.random() * 250 + 200), // Shoot much higher up (closer to top of screen)
    fallY: windowHeight + 30,
    rotation: `${(Math.random() - 0.5) * 1440}deg`, // Spin faster
    delay: Math.random() * 80, // Very fast responsive delay
    durationUp: 200 + Math.random() * 100, // Faster upward burst
    durationDown: 650 + Math.random() * 150, // Faster gravity fall
  }).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: config.durationUp + config.durationDown,
      delay: config.delay,
      useNativeDriver: true,
    }).start();
  }, [animatedValue, config]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [startX, startX + (config.spreadX - startX) * 0.45, config.spreadX],
  });

  const translateY = animatedValue.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [startY, config.burstY, config.fallY],
  });

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', config.rotation],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.05, 0.75, 1],
    outputRange: [0, 1, 1, 0],
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: config.size,
          height: config.shape === 'square' ? config.size * 1.4 : config.size,
          backgroundColor: config.color,
          borderRadius: config.shape === 'circle' ? config.size / 2 : 1,
          opacity,
          transform: [
            { translateX },
            { translateY },
            { rotate },
          ],
        },
      ]}
    />
  );
};

const ConfettiEffect = forwardRef((props, ref) => {
  const [isEmitting, setIsEmitting] = useState(false);
  const [particles, setParticles] = useState([]);
  const startX = windowWidth / 2;
  const startY = windowHeight / 2;

  useImperativeHandle(ref, () => ({
    trigger: () => {
      setParticles(Array.from({ length: CONFETTI_COUNT }).map((_, i) => i));
      setIsEmitting(true);

      setTimeout(() => {
        setIsEmitting(false);
        setParticles([]);
      }, 1400);
    },
  }));

  return (
    <View
      style={[
        styles.container,
        { display: isEmitting ? 'flex' : 'none' },
      ]}
      pointerEvents="none"
    >
      {particles.map(i => (
        <ConfettiParticle key={i} startX={startX} startY={startY} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    zIndex: 99999,
    elevation: 99999,
  },
  particle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default ConfettiEffect;

