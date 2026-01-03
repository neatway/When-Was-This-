// GitHub repository configuration
export const config = {
  // Format: https://raw.githubusercontent.com/[USERNAME]/[REPO]/main/images/
  githubImagesBaseUrl: 'https://raw.githubusercontent.com/neatway/When-Was-This-/main/images/',

  // Format: https://raw.githubusercontent.com/[USERNAME]/[REPO]/main/data/photos.json
  githubPhotosJsonUrl: 'https://raw.githubusercontent.com/neatway/When-Was-This-/main/data/photos.json',

  // Set to false to use GitHub images, true for local testing
  useLocalData: false,
} as const;

export const gameConfig = {
  minYear: 1900,
  maxYear: 2026,
  defaultYear: 1960,
  streakThreshold: 15, // Within 15 years to maintain streak
  exactYearBonus: 5000,
  penaltyPerYear: 100,
} as const;
