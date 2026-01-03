import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Text,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/colors';
import { PhotoCard } from '../components/PhotoCard';
import { YearSlider } from '../components/YearSlider';
import { LockInButton } from '../components/LockInButton';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { RevealOverlay } from '../components/RevealOverlay';
import { usePhotos } from '../hooks/usePhotos';
import { useGameState } from '../hooks/useGameState';
import { gameConfig } from '../constants/config';

const { height: screenHeight } = Dimensions.get('window');

export default function GameScreen() {
  const { photos, loading, error, getImageUri } = usePhotos();
  const {
    gameState,
    updateGuess,
    lockInGuess,
    nextPhoto,
    getCurrentPhoto,
    getLastScore,
  } = useGameState(photos);

  const [animatedScore, setAnimatedScore] = useState(0);

  // Animation values
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const photoTranslateY = useRef(new Animated.Value(0)).current;
  const photoOpacity = useRef(new Animated.Value(1)).current;

  const currentPhoto = getCurrentPhoto();
  const lastScore = getLastScore();

  // Animate score count-up
  React.useEffect(() => {
    const duration = 500;
    const steps = 30;
    const increment = (gameState.sessionScore - animatedScore) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedScore(gameState.sessionScore);
        clearInterval(interval);
      } else {
        setAnimatedScore((prev) => prev + increment);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [gameState.sessionScore]);

  const handleLockIn = () => {
    lockInGuess();

    // Reveal expands and pushes slider down smoothly
    Animated.timing(revealOpacity, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false, // Can't use native driver with maxHeight
    }).start();
  };

  const handleSwipeUp = () => {
    if (!gameState.hasGuessed) return;

    // Slide current photo up and fade out
    Animated.parallel([
      Animated.timing(photoTranslateY, {
        toValue: -screenHeight,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(photoOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Move to next photo
      nextPhoto();

      // Reset animations
      photoTranslateY.setValue(0);
      photoOpacity.setValue(1);
      revealOpacity.setValue(0);
    });
  };

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      if (event.velocityY < -500 && gameState.hasGuessed) {
        handleSwipeUp();
      }
    });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !currentPhoto) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load photos</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      <ScoreDisplay
        streak={gameState.currentStreak}
        score={Math.round(animatedScore)}
      />

      <Animated.View
        style={[
          styles.contentContainer,
          {
            transform: [{ translateY: photoTranslateY }],
            opacity: photoOpacity,
          },
        ]}
      >
        <GestureDetector gesture={swipeGesture}>
          <View>
            <PhotoCard imageUri={getImageUri(currentPhoto.filename)} />

            <Animated.View
              style={{
                opacity: revealOpacity,
                maxHeight: revealOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 500],
                }),
                overflow: 'hidden',
              }}
            >
              {lastScore && (
                <RevealOverlay
                  correctYear={currentPhoto.year}
                  userGuess={gameState.currentGuess}
                  pointsEarned={lastScore.totalPoints}
                  multiplier={lastScore.multiplier}
                  streak={gameState.currentStreak}
                  description={currentPhoto.description}
                />
              )}
            </Animated.View>
          </View>
        </GestureDetector>

        <View pointerEvents={gameState.hasGuessed ? 'none' : 'auto'}>
          <YearSlider
            value={gameState.currentGuess}
            onValueChange={updateGuess}
            disabled={gameState.hasGuessed}
          />
          <LockInButton onPress={handleLockIn} />
        </View>
      </Animated.View>

      {/* TODO: AD PLACEMENT - show ad every 7 photos */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontFamily: 'SpaceGrotesk_400Regular',
  },
});
