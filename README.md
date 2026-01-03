# When Was This?

A TikTok-style historical photo guessing game built with React Native and Expo.

## Overview

When Was This? presents users with historical and pop culture photos. Players guess the year each photo was taken, earn points based on accuracy, and maintain streaks for consecutive close guesses. The game features an endless feed of photos with smooth swipe transitions.

## Features

- 🎯 Intuitive year slider with haptic feedback
- 🔥 Streak system with multipliers
- 📊 Score tracking with local persistence
- 🎨 Dark retro-modern design
- 📱 Smooth animations and transitions
- ♾️ Endless gameplay with shuffled photos

## Tech Stack

- **Framework**: Expo (managed workflow)
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Styling**: React Native StyleSheet
- **Haptics**: expo-haptics
- **Persistence**: AsyncStorage
- **Fonts**: Space Grotesk (via expo-google-fonts)
- **Gestures**: react-native-gesture-handler

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm or yarn
- Expo Go app on your mobile device (for testing)

### Installation

1. Clone the repository
```bash
cd when-was-this
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Start the development server
```bash
npm start
```

4. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

## Project Structure

```
when-was-this/
├── app/                      # Expo Router pages
│   ├── _layout.tsx          # Root layout with font loading
│   └── index.tsx            # Main game screen
├── components/              # React components
│   ├── PhotoCard.tsx        # Photo display with gradient
│   ├── YearSlider.tsx       # Custom slider with haptics
│   ├── LockInButton.tsx     # Primary action button
│   ├── ScoreDisplay.tsx     # Top bar with score/streak
│   ├── RevealOverlay.tsx    # Results after guess
│   └── SwipeHint.tsx        # Swipe up indicator
├── hooks/                   # Custom React hooks
│   ├── usePhotos.ts         # Photo data loading
│   └── useGameState.ts      # Game logic and state
├── utils/                   # Utility functions
│   ├── scoring.ts           # Point calculation
│   └── storage.ts           # AsyncStorage helpers
├── constants/               # App constants
│   ├── colors.ts            # Color palette
│   ├── typography.ts        # Font styles
│   └── config.ts            # App configuration
├── types/                   # TypeScript types
│   └── index.ts             # Type definitions
└── data/                    # Local data
    └── photos.json          # Photo metadata
```

## Configuration

### GitHub Photo Hosting

To use photos hosted on GitHub:

1. Create a GitHub repository for your photos
2. Add your photos to an `images/` folder
3. Add your `photos.json` to a `data/` folder
4. Update `constants/config.ts`:

```typescript
export const config = {
  githubImagesBaseUrl: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/images/',
  githubPhotosJsonUrl: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/photos.json',
  useLocalData: false, // Set to false to use GitHub data
};
```

### Photo Data Format

The `photos.json` file should follow this structure:

```json
{
  "photos": [
    {
      "id": "001",
      "filename": "moon-landing.jpg",
      "year": 1969,
      "description": "Neil Armstrong takes humanity's first steps on the Moon during Apollo 11."
    }
  ]
}
```

## Game Mechanics

### Scoring

- **Base Points**: 5,000 points for exact year, decreasing by 100 points per year of difference
- **Minimum**: 0 points (50+ years off)

### Streak System

- Maintained if guess is within 15 years of actual
- **Multipliers**:
  - 1 streak: 1.0x
  - 2 streak: 1.2x
  - 3 streak: 1.5x
  - 4+ streak: 2.0x

### Haptic Feedback

The year slider provides rich haptic feedback:
- Light tap for each year change
- Stronger tap every 10 years
- Medium impact at major milestones (1950, 2000)

## Development

### Running on Different Platforms

```bash
# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web
```

### Adding Photos

1. Add your photo to the `images/` folder in your GitHub repo
2. Update `data/photos.json` with the photo metadata
3. Ensure photos are 4:3 aspect ratio for best results

## Future Enhancements

- [ ] Ad integration (placeholder at line 213 in index.tsx)
- [ ] Social sharing
- [ ] Leaderboards
- [ ] Daily challenges
- [ ] Photo categories/themes
- [ ] Multiplayer mode

## Design System

### Colors

- Background: `#0a0a0a`
- Accent (Amber): `#F59E0B`
- Correct (Green): `#4ADE80`
- Incorrect (Red): `#EF4444`
- Streak (Orange): `#F97316`

### Typography

- Font: Space Grotesk
- Year Display: 48px / 64px (reveal)
- Score: 18px
- Description: 16px

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
