import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../constants/colors';
import { typography, spacing } from '../constants/typography';

interface ScoreDisplayProps {
  streak: number;
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ streak, score }) => {
  const streakScale = useRef(new Animated.Value(1)).current;
  const prevStreak = useRef(streak);

  useEffect(() => {
    // Animate streak when it increases
    if (streak > prevStreak.current && streak > 0) {
      Animated.sequence([
        Animated.spring(streakScale, {
          toValue: 1.3,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
        Animated.spring(streakScale, {
          toValue: 1.0,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
      ]).start();
    }
    prevStreak.current = streak;
  }, [streak]);

  const streakColor = streak > 0 ? colors.streak : colors.textMuted;

  return (
    <View style={styles.container}>
      <View style={styles.streakContainer}>
        <Text style={styles.streakLabel}>Streak:</Text>
        <Animated.Text
          style={[
            styles.streakText,
            { color: streakColor },
            { transform: [{ scale: streakScale }] },
          ]}
        >
          {streak}
        </Animated.Text>
      </View>

      <Text style={styles.scoreText}>
        {score.toLocaleString()} pts
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.screenPadding,
    paddingBottom: spacing.base,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakLabel: {
    fontSize: typography.score.fontSize,
    fontWeight: typography.score.fontWeight,
    color: colors.textSecondary,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  streakText: {
    fontSize: typography.score.fontSize,
    fontWeight: typography.score.fontWeight,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
  scoreText: {
    fontSize: typography.score.fontSize,
    fontWeight: typography.score.fontWeight,
    color: colors.textPrimary,
    fontFamily: 'SpaceGrotesk_600SemiBold',
  },
});
