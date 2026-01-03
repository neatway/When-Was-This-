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
    viewPreviousPhoto,
    returnToCurrent,
    getDisplayPhoto,
  } = useGameState(photos);

  const [animatedScore, setAnimatedScore] = useState(0);

  // Animation values
  const revealOpacity = useRef(new Animated.Value(0)).current;
  const photoTranslateY = useRef(new Animated.Value(0)).current;
  const photoOpacity = useRef(new Animated.Value(1)).current;

  const currentPhoto = getCurrentPhoto();
  const lastScore = getLastScore();
  const historyPhoto = getDisplayPhoto();
  const isViewingHistory = gameState.viewingHistoryIndex !== null;

  // Use history photo if viewing history, otherwise current photo
  const displayPhoto = historyPhoto?.photo || currentPhoto;

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
    // If viewing history, return to current with animation
    if (isViewingHistory) {
      // Animate current photo sliding up
      Animated.parallel([
        Animated.timing(photoTranslateY, {
          toValue: -screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(photoOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Return to current photo
        returnToCurrent();

        // Start next photo from below and slide up
        photoTranslateY.setValue(screenHeight);
        photoOpacity.setValue(0);

        Animated.parallel([
          Animated.spring(photoTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 28,
            stiffness: 85,
          }),
          Animated.timing(photoOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();

        // Set reveal based on guess state
        if (gameState.hasGuessed) {
          revealOpacity.setValue(1);
        } else {
          revealOpacity.setValue(0);
        }
      });
      return;
    }

    if (!gameState.hasGuessed) return;

    // Slide current photo up and fade out
    Animated.parallel([
      Animated.timing(photoTranslateY, {
        toValue: -screenHeight,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(photoOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Move to next photo
      nextPhoto();

      // Start next photo from below and slide up with spring
      photoTranslateY.setValue(screenHeight);
      photoOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(photoTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 28,
          stiffness: 85,
        }),
        Animated.timing(photoOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      revealOpacity.setValue(0);
    });
  };

  const handleSwipeDown = () => {
    if (gameState.history.length === 0) return;

    // Animate current photo sliding down
    Animated.parallel([
      Animated.timing(photoTranslateY, {
        toValue: screenHeight,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(photoOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Go to previous photo
      viewPreviousPhoto();

      // Start previous photo from above and slide down with spring
      photoTranslateY.setValue(-screenHeight);
      photoOpacity.setValue(0);

      Animated.parallel([
        Animated.spring(photoTranslateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 28,
          stiffness: 85,
        }),
        Animated.timing(photoOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Always show reveal for history
      revealOpacity.setValue(1);
    });
  };

  const swipeGesture = Gesture.Pan()
    .onEnd((event) => {
      // Swipe up - next photo or return to current
      if (event.velocityY < -300 && (gameState.hasGuessed || isViewingHistory)) {
        handleSwipeUp();
      }
      // Swipe down - view previous photo
      else if (event.velocityY > 300 && gameState.history.length > 0) {
        handleSwipeDown();
      }
    });

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (error || !displayPhoto) {
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

      <View style={styles.contentContainer}>
        <GestureDetector gesture={swipeGesture}>
          <Animated.View
            style={{
              transform: [{ translateY: photoTranslateY }],
              opacity: photoOpacity,
            }}
          >
            <PhotoCard imageUri={getImageUri(displayPhoto.filename)} />

            <Animated.View
              style={{
                opacity: revealOpacity,
                maxHeight: revealOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 350],
                }),
                overflow: 'hidden',
              }}
            >
              {isViewingHistory && historyPhoto ? (
                <RevealOverlay
                  correctYear={historyPhoto.photo.year}
                  userGuess={historyPhoto.userGuess}
                  pointsEarned={historyPhoto.pointsEarned}
                  multiplier={historyPhoto.multiplier}
                  streak={historyPhoto.streak}
                  description={historyPhoto.photo.description}
                />
              ) : (
                lastScore && (
                  <RevealOverlay
                    correctYear={displayPhoto.year}
                    userGuess={gameState.currentGuess}
                    pointsEarned={lastScore.totalPoints}
                    multiplier={lastScore.multiplier}
                    streak={gameState.currentStreak}
                    description={displayPhoto.description}
                  />
                )
              )}
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        <View pointerEvents={gameState.hasGuessed || isViewingHistory ? 'none' : 'auto'}>
          <YearSlider
            value={isViewingHistory ? historyPhoto!.userGuess : gameState.currentGuess}
            onValueChange={updateGuess}
            disabled={gameState.hasGuessed || isViewingHistory}
          />
          {!gameState.hasGuessed && !isViewingHistory && <LockInButton onPress={handleLockIn} />}
        </View>
      </View>

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
