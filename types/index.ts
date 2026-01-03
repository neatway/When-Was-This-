export interface Photo {
  id: string;
  filename: string;
  year: number;
  description: string;
}

export interface GameState {
  // Current session
  currentPhotoIndex: number;
  photos: Photo[];
  currentGuess: number;
  hasGuessed: boolean;
  sessionScore: number;
  currentStreak: number;
  bestStreakThisSession: number;
  photosCompleted: number;

  // Persisted (AsyncStorage)
  allTimeHighScore: number;
  allTimeBestStreak: number;
  totalPhotosAllTime: number;
}

export interface ScoreResult {
  basePoints: number;
  multiplier: number;
  totalPoints: number;
  streakBroken: boolean;
}
