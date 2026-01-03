import { useState, useEffect } from 'react';
import { GameState, Photo } from '../types';
import { calculateScore } from '../utils/scoring';
import { storage } from '../utils/storage';
import { gameConfig } from '../constants/config';

export const useGameState = (photos: Photo[]) => {
  const [gameState, setGameState] = useState<GameState>({
    currentPhotoIndex: 0,
    photos,
    currentGuess: gameConfig.defaultYear,
    hasGuessed: false,
    sessionScore: 0,
    currentStreak: 0,
    bestStreakThisSession: 0,
    photosCompleted: 0,
    allTimeHighScore: 0,
    allTimeBestStreak: 0,
    totalPhotosAllTime: 0,
  });

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Update photos when they change
  useEffect(() => {
    if (photos.length > 0) {
      setGameState((prev) => ({ ...prev, photos }));
    }
  }, [photos]);

  const loadPersistedData = async () => {
    const [highScore, bestStreak, totalPhotos] = await Promise.all([
      storage.getHighScore(),
      storage.getBestStreak(),
      storage.getTotalPhotos(),
    ]);

    setGameState((prev) => ({
      ...prev,
      allTimeHighScore: highScore,
      allTimeBestStreak: bestStreak,
      totalPhotosAllTime: totalPhotos,
    }));
  };

  const updateGuess = (year: number) => {
    if (!gameState.hasGuessed) {
      setGameState((prev) => ({ ...prev, currentGuess: year }));
    }
  };

  const lockInGuess = () => {
    if (gameState.hasGuessed || gameState.photos.length === 0) return;

    const currentPhoto = gameState.photos[gameState.currentPhotoIndex];
    const { totalPoints, streakBroken } = calculateScore(
      gameState.currentGuess,
      currentPhoto.year,
      gameState.currentStreak
    );

    const newStreak = streakBroken ? 0 : gameState.currentStreak + 1;
    const newScore = gameState.sessionScore + totalPoints;
    const newBestStreak = Math.max(gameState.bestStreakThisSession, newStreak);
    const newPhotosCompleted = gameState.photosCompleted + 1;

    setGameState((prev) => ({
      ...prev,
      hasGuessed: true,
      sessionScore: newScore,
      currentStreak: newStreak,
      bestStreakThisSession: newBestStreak,
      photosCompleted: newPhotosCompleted,
    }));

    // Update persisted data if records broken
    updatePersistedRecords(newScore, newStreak, newPhotosCompleted);

    return { totalPoints, streakBroken };
  };

  const nextPhoto = () => {
    const nextIndex = (gameState.currentPhotoIndex + 1) % gameState.photos.length;

    setGameState((prev) => ({
      ...prev,
      currentPhotoIndex: nextIndex,
      currentGuess: gameConfig.defaultYear,
      hasGuessed: false,
    }));
  };

  const updatePersistedRecords = async (
    score: number,
    streak: number,
    totalPhotos: number
  ) => {
    const updates: Promise<void>[] = [];

    if (score > gameState.allTimeHighScore) {
      updates.push(storage.setHighScore(score));
      setGameState((prev) => ({ ...prev, allTimeHighScore: score }));
    }

    if (streak > gameState.allTimeBestStreak) {
      updates.push(storage.setBestStreak(streak));
      setGameState((prev) => ({ ...prev, allTimeBestStreak: streak }));
    }

    updates.push(storage.setTotalPhotos(gameState.totalPhotosAllTime + 1));
    setGameState((prev) => ({
      ...prev,
      totalPhotosAllTime: prev.totalPhotosAllTime + 1,
    }));

    await Promise.all(updates);
  };

  const getCurrentPhoto = () => {
    if (gameState.photos.length === 0) return null;
    return gameState.photos[gameState.currentPhotoIndex];
  };

  const getLastScore = () => {
    if (!gameState.hasGuessed) return null;
    const currentPhoto = getCurrentPhoto();
    if (!currentPhoto) return null;

    return calculateScore(
      gameState.currentGuess,
      currentPhoto.year,
      gameState.currentStreak
    );
  };

  return {
    gameState,
    updateGuess,
    lockInGuess,
    nextPhoto,
    getCurrentPhoto,
    getLastScore,
  };
};
