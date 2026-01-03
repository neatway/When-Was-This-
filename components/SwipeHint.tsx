import React, { useEffect, useRef } from 'react';
import { Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';

export const SwipeHint: React.FC = () => {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text style={[styles.hint, { opacity }]}>
      ↑ swipe up
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  hint: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
});
