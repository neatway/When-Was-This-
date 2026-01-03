import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';
import { SwipeHint } from './SwipeHint';

interface RevealOverlayProps {
  correctYear: number;
  userGuess: number;
  pointsEarned: number;
  multiplier: number;
  streak: number;
  description: string;
}

export const RevealOverlay: React.FC<RevealOverlayProps> = ({
  correctYear,
  userGuess,
  pointsEarned,
  multiplier,
  streak,
  description,
}) => {
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const containerTranslateY = useRef(new Animated.Value(20)).current;
  const descriptionOpacity = useRef(new Animated.Value(0)).current;
  const descriptionTranslateY = useRef(new Animated.Value(10)).current;
  const pointsScale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Main content fade in and slide up
    Animated.parallel([
      Animated.timing(containerOpacity, {
        toValue: 1,
        duration: 200,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.timing(containerTranslateY, {
        toValue: 0,
        duration: 200,
        delay: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Points pop animation
    Animated.spring(pointsScale, {
      toValue: 1,
      delay: 150,
      tension: 300,
      friction: 10,
      useNativeDriver: true,
    }).start();

    // Description delayed fade in
    Animated.parallel([
      Animated.timing(descriptionOpacity, {
        toValue: 1,
        duration: 300,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(descriptionTranslateY, {
        toValue: 0,
        duration: 300,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const difference = Math.abs(correctYear - userGuess);
  const isClose = difference <= 15;
  const yearColor = isClose ? colors.correct : colors.incorrect;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ translateY: containerTranslateY }],
        },
      ]}
    >
      <Text style={[styles.correctYear, { color: yearColor }]}>
        {correctYear}
      </Text>

      <Text style={styles.userGuess}>
        You guessed {userGuess}
      </Text>

      <Animated.View
        style={[
          styles.pointsContainer,
          { transform: [{ scale: pointsScale }] },
        ]}
      >
        <Text style={styles.points}>
          +{pointsEarned.toLocaleString()} pts
        </Text>
        {multiplier > 1 && (
          <Text style={styles.multiplier}>
            {' '}×{multiplier.toFixed(1)}
          </Text>
        )}
      </Animated.View>

      <Animated.Text
        style={[
          styles.description,
          {
            opacity: descriptionOpacity,
            transform: [{ translateY: descriptionTranslateY }],
          },
        ]}
      >
        {description}
      </Animated.Text>

      <SwipeHint />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  correctYear: {
    fontSize: 64,
    fontWeight: '700',
    fontFamily: 'SpaceGrotesk_700Bold',
    marginBottom: 8,
  },
  userGuess: {
    fontSize: 18,
    color: colors.textSecondary,
    fontFamily: 'SpaceGrotesk_400Regular',
    marginBottom: 16,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  points: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  multiplier: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.streak,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  description: {
    fontSize: typography.description.fontSize,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: '90%',
    fontFamily: 'SpaceGrotesk_400Regular',
  },
});
