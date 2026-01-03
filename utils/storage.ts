import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  HIGH_SCORE: '@TimeGuessr:highScore',
  BEST_STREAK: '@TimeGuessr:bestStreak',
  TOTAL_PHOTOS: '@TimeGuessr:totalPhotos',
};

export const storage = {
  async getHighScore(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(KEYS.HIGH_SCORE);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error reading high score:', error);
      return 0;
    }
  },

  async setHighScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.HIGH_SCORE, score.toString());
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  },

  async getBestStreak(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(KEYS.BEST_STREAK);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error reading best streak:', error);
      return 0;
    }
  },

  async setBestStreak(streak: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.BEST_STREAK, streak.toString());
    } catch (error) {
      console.error('Error saving best streak:', error);
    }
  },

  async getTotalPhotos(): Promise<number> {
    try {
      const value = await AsyncStorage.getItem(KEYS.TOTAL_PHOTOS);
      return value ? parseInt(value, 10) : 0;
    } catch (error) {
      console.error('Error reading total photos:', error);
      return 0;
    }
  },

  async setTotalPhotos(count: number): Promise<void> {
    try {
      await AsyncStorage.setItem(KEYS.TOTAL_PHOTOS, count.toString());
    } catch (error) {
      console.error('Error saving total photos:', error);
    }
  },
};
