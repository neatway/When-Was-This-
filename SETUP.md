# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install --legacy-peer-deps
```

The `--legacy-peer-deps` flag is needed due to React version compatibility.

## 2. Start Development Server

```bash
npm start
```

This will start the Expo development server and show a QR code.

## 3. Test on Your Device

### Android
1. Install the Expo Go app from the Play Store
2. Scan the QR code with the Expo Go app

### iOS
1. Install the Expo Go app from the App Store
2. Scan the QR code with your Camera app
3. Tap the notification to open in Expo Go

## 4. Configure Photo Data (Optional)

By default, the app uses local placeholder data with random images from Picsum.

To use your own photos:

1. Create a GitHub repository
2. Add photos to an `images/` folder (4:3 aspect ratio recommended)
3. Add `photos.json` to a `data/` folder
4. Update [constants/config.ts](constants/config.ts):

```typescript
export const config = {
  githubImagesBaseUrl: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/images/',
  githubPhotosJsonUrl: 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/photos.json',
  useLocalData: false, // Change to false
};
```

## Testing the App

### What to Test

1. **Slider Feel**: The most important interaction
   - Drag the slider and feel the haptic feedback
   - Every year should give light feedback
   - Every 10 years should feel stronger
   - 1950 and 2000 should have medium impact

2. **Gameplay Flow**:
   - Adjust the slider to guess a year
   - Tap "LOCK IN" to submit
   - Review the results (points, streak)
   - Swipe up to get the next photo

3. **Scoring**:
   - Exact guess = 5,000 points
   - Close guess maintains streak
   - 15+ years off breaks streak
   - Watch multiplier increase with streak

4. **Animations**:
   - Smooth fade between guess and reveal states
   - Score count-up animation
   - Photo transition when swiping
   - Streak fire emoji pulse

## Project Structure

```
app/
  _layout.tsx          → Font loading and navigation setup
  index.tsx            → Main game screen

components/
  PhotoCard.tsx        → Photo with gradient overlay
  YearSlider.tsx       → Slider with haptics (CORE COMPONENT)
  LockInButton.tsx     → Submit button
  ScoreDisplay.tsx     → Top bar
  RevealOverlay.tsx    → Results display
  SwipeHint.tsx        → Swipe indicator

hooks/
  usePhotos.ts         → Load and shuffle photos
  useGameState.ts      → Game logic

utils/
  scoring.ts           → Point calculation
  storage.ts           → Save high scores
```

## Troubleshooting

### Metro bundler won't start
```bash
npx expo start -c
```

### Fonts not loading
The app will show a loading spinner until fonts are loaded. If stuck:
1. Clear Expo cache: `npx expo start -c`
2. Restart the dev server

### Haptics not working
- Haptics only work on physical devices
- Make sure your device has haptic feedback enabled in settings
- iOS: Settings → Sounds & Haptics
- Android: Settings → Sound & vibration → Vibration

### Photos not loading
1. Check `constants/config.ts` - ensure `useLocalData: true` for development
2. Check network connection if using GitHub URLs
3. Check console for error messages

## Next Steps

1. ✅ Test the app on your device
2. 📸 Gather historical photos (public domain recommended)
3. 🎨 Customize colors in `constants/colors.ts` if desired
4. 🔧 Fine-tune haptic feedback in `components/YearSlider.tsx`
5. 📊 Test scoring system with different guesses
6. 🎯 Add more photos to `data/photos.json`

## Development Commands

```bash
# Start dev server
npm start

# Start with cache cleared
npx expo start -c

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run on web
npm run web
```

## Performance Tips

- Photos should be optimized (max 1920x1440 for 4:3)
- Use WebP format for smaller file sizes
- Keep description text concise (2 lines max)
- Test on lower-end devices for performance

---

**Most Important**: The slider is the heart of the game. Make sure the haptic feedback feels satisfying before doing anything else!
