import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../constants/colors';
import { gameConfig } from '../constants/config';

interface YearSliderProps {
  value: number;
  onValueChange: (year: number) => void;
  disabled?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');
const SLIDER_PADDING = 32;
const TRACK_WIDTH = screenWidth - SLIDER_PADDING * 2;
const THUMB_WIDTH = 28;
const THUMB_HEIGHT = 36;
const { minYear, maxYear } = gameConfig;
const YEAR_RANGE = maxYear - minYear;

export const YearSlider: React.FC<YearSliderProps> = ({ value, onValueChange, disabled = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const lastHapticYear = useRef(value);
  const lastTenYear = useRef(Math.floor(value / 10) * 10);
  const thumbScale = useRef(new Animated.Value(1)).current;
  const yearScale = useRef(new Animated.Value(1)).current;

  const yearToPosition = (year: number): number => {
    const normalizedYear = Math.max(minYear, Math.min(maxYear, year));
    return ((normalizedYear - minYear) / YEAR_RANGE) * TRACK_WIDTH;
  };

  const positionToYear = (position: number): number => {
    const clampedPosition = Math.max(0, Math.min(TRACK_WIDTH, position));
    const year = Math.round(minYear + (clampedPosition / TRACK_WIDTH) * YEAR_RANGE);
    return Math.max(minYear, Math.min(maxYear, year));
  };

  const triggerHaptics = (year: number) => {
    // Every single year
    if (year !== lastHapticYear.current) {
      Haptics.selectionAsync();
      lastHapticYear.current = year;
    }

    const currentTenYear = Math.floor(year / 10) * 10;

    // Every 10 years
    if (currentTenYear !== lastTenYear.current) {
      if (year === 1950 || year === 2000) {
        // Medium impact at major milestones
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else if (year % 10 === 0) {
        // Light impact every 10 years
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      lastTenYear.current = currentTenYear;
    }
  };

  const handlePanResponderMove = (touchX: number) => {
    const newYear = positionToYear(touchX);
    if (newYear !== value) {
      triggerHaptics(newYear);
      onValueChange(newYear);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: (evt) => {
        if (disabled) return;
        setIsDragging(true);

        const touchX = evt.nativeEvent.locationX;
        handlePanResponderMove(touchX);

        Animated.spring(thumbScale, {
          toValue: 1.1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
        Animated.spring(yearScale, {
          toValue: 1.05,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
      },
      onPanResponderMove: (evt) => {
        if (disabled) return;
        const touchX = evt.nativeEvent.locationX;
        handlePanResponderMove(touchX);
      },
      onPanResponderRelease: () => {
        setIsDragging(false);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.spring(thumbScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
        Animated.spring(yearScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }).start();
      },
    })
  ).current;

  const renderTickMarks = () => {
    const ticks = [];
    for (let year = minYear; year <= maxYear; year += 10) {
      const position = yearToPosition(year);
      const isMajor = year === minYear || year === 1950 || year === 2000 || year === maxYear;

      ticks.push(
        <View
          key={year}
          style={[
            styles.tick,
            { left: position },
            isMajor ? styles.tickMajor : styles.tickMinor,
          ]}
        />
      );
    }
    return ticks;
  };

  const thumbPosition = yearToPosition(value);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.yearDisplay,
          { transform: [{ scale: yearScale }] },
        ]}
      >
        {value}
      </Animated.Text>

      <View style={styles.sliderContainer}>
        <View style={styles.track} pointerEvents="none">
          {renderTickMarks()}
        </View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              left: thumbPosition - THUMB_WIDTH / 2,
              transform: [{ scale: thumbScale }],
            },
          ]}
        />

        {/* Transparent overlay to capture all touches consistently */}
        <View
          style={styles.touchOverlay}
          {...panResponder.panHandlers}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  yearDisplay: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    fontFamily: 'SpaceGrotesk_700Bold',
  },
  sliderContainer: {
    width: TRACK_WIDTH,
    height: 40,
    position: 'relative',
  },
  track: {
    height: 4,
    backgroundColor: colors.textMuted,
    borderRadius: 2,
    position: 'absolute',
    top: 18,
    width: '100%',
  },
  tick: {
    position: 'absolute',
    backgroundColor: colors.textSecondary,
    top: -2,
  },
  tickMinor: {
    width: 1,
    height: 8,
  },
  tickMajor: {
    width: 2,
    height: 12,
    top: -4,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    backgroundColor: colors.accent,
    borderRadius: 8,
    top: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  touchOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.001)',
  },
});
