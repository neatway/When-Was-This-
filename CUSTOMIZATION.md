# Customization Guide

Quick reference for customizing TimeGuessr to match your vision.

## Colors

Edit [constants/colors.ts](constants/colors.ts)

```typescript
export const colors = {
  background: '#0a0a0a',      // Main dark background
  surface: '#1a1a1a',         // Secondary surfaces
  accent: '#F59E0B',          // Buttons, slider thumb (AMBER)
  accentMuted: '#B45309',     // Pressed button state
  correct: '#4ADE80',         // Correct answer (GREEN)
  incorrect: '#EF4444',       // Wrong answer (RED)
  textPrimary: '#FFFFFF',     // Main text
  textSecondary: '#A1A1AA',   // Secondary text
  textMuted: '#525252',       // Muted text, disabled
  streak: '#F97316',          // Streak fire (ORANGE)
};
```

### Popular Color Schemes

**Retro Gaming** (current):
- Amber accent, dark background, warm feel

**Ocean Blue**:
- Change `accent` to `#3B82F6` (blue)
- Change `streak` to `#06B6D4` (cyan)

**Purple Vibes**:
- Change `accent` to `#A855F7` (purple)
- Change `streak` to `#EC4899` (pink)

**Monochrome**:
- Change `accent` to `#FFFFFF` (white)
- Change `streak` to `#D1D5DB` (gray)

## Typography

Edit [constants/typography.ts](constants/typography.ts)

```typescript
export const typography = {
  yearDisplay: {
    fontSize: 48,              // Year while guessing
    fontWeight: '700',
  },
  yearDisplayReveal: {
    fontSize: 64,              // Year after reveal
    fontWeight: '700',
  },
  score: {
    fontSize: 18,              // Top bar score
    fontWeight: '600',
  },
  description: {
    fontSize: 16,              // Photo description
    fontWeight: '400',
  },
  button: {
    fontSize: 18,              // LOCK IN button
    fontWeight: '700',
  },
};
```

### Font Family

To change from Space Grotesk to another Google Font:

1. Find your font at [Google Fonts](https://fonts.google.com/)
2. Install it: `npx expo install @expo-google-fonts/[font-name]`
3. Update [app/_layout.tsx](app/_layout.tsx):

```typescript
import { useFonts, YourFont_400Regular, YourFont_700Bold } from '@expo-google-fonts/your-font';

const [fontsLoaded] = useFonts({
  YourFont_400Regular,
  YourFont_700Bold,
});
```

4. Update all `fontFamily` references in components

## Game Settings

Edit [constants/config.ts](constants/config.ts)

```typescript
export const gameConfig = {
  minYear: 1900,              // Earliest year on slider
  maxYear: 2026,              // Latest year on slider
  defaultYear: 1960,          // Starting slider position
  streakThreshold: 15,        // Years within to maintain streak
  exactYearBonus: 5000,       // Points for exact guess
  penaltyPerYear: 100,        // Points lost per year off
};
```

### Make the game easier:
- Increase `streakThreshold` to 20 or 25
- Decrease `penaltyPerYear` to 50

### Make the game harder:
- Decrease `streakThreshold` to 10
- Increase `penaltyPerYear` to 150

### Change time period:
- For modern photos: `minYear: 1980, maxYear: 2026`
- For vintage only: `minYear: 1900, maxYear: 1970`

## Haptic Feedback

Edit [components/YearSlider.tsx](components/YearSlider.tsx) line 35-50

```typescript
const triggerHaptics = (year: number) => {
  // Every year - LIGHT tap
  if (year !== lastHapticYear.current) {
    Haptics.selectionAsync();
  }

  // Every 10 years - STRONGER tap
  if (year % 10 === 0) {
    if (year === 1950 || year === 2000) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }
};
```

### Haptic Options

**More aggressive**:
- Change yearly to `impactAsync(ImpactFeedbackStyle.Light)`
- Change 10-year to `ImpactFeedbackStyle.Medium`
- Change milestones to `ImpactFeedbackStyle.Heavy`

**More subtle**:
- Keep yearly as `selectionAsync()`
- Remove 10-year haptics
- Keep only milestone haptics

**Disable all**:
- Comment out the entire `triggerHaptics` function call

## Slider Appearance

Edit [components/YearSlider.tsx](components/YearSlider.tsx) styles section

```typescript
const styles = StyleSheet.create({
  thumb: {
    width: 28,                  // Thumb width
    height: 36,                 // Thumb height
    backgroundColor: colors.accent,
    borderRadius: 8,            // Corner roundness
    shadowOpacity: 0.3,         // Shadow strength
  },
  track: {
    height: 4,                  // Track thickness
    backgroundColor: colors.textMuted,
    borderRadius: 2,
  },
});
```

### Slider Variations

**Chunky slider**:
- `width: 40, height: 48`
- `borderRadius: 12`
- `track height: 6`

**Minimal slider**:
- `width: 20, height: 28`
- `borderRadius: 4`
- `track height: 2`

**Circular thumb**:
- `width: 36, height: 36`
- `borderRadius: 18` (half of width/height)

## Animation Timings

Edit [app/index.tsx](app/index.tsx)

```typescript
// Slider fade out
duration: 200              // Make faster: 150, slower: 300

// Reveal fade in
duration: 200, delay: 100  // Delay can be 0-300ms

// Photo swipe
duration: 300              // Make faster: 200, slower: 500
```

Edit [components/RevealOverlay.tsx](components/RevealOverlay.tsx)

```typescript
// Description fade delay
delay: 500                 // Show sooner: 300, later: 700
```

## Scoring Display

To change the multiplier values:

Edit [utils/scoring.ts](utils/scoring.ts)

```typescript
let multiplier = 1;
if (!streakBroken && streak >= 1) {
  if (streak === 1) multiplier = 1;
  else if (streak === 2) multiplier = 1.2;    // 20% bonus
  else if (streak === 3) multiplier = 1.5;    // 50% bonus
  else multiplier = 2;                        // 100% bonus
}
```

### Alternative Multiplier Systems

**More generous**:
```typescript
if (streak === 1) multiplier = 1.5;
else if (streak === 2) multiplier = 2;
else if (streak === 3) multiplier = 2.5;
else multiplier = 3;
```

**More aggressive**:
```typescript
if (streak >= 5) multiplier = 5;
else if (streak >= 3) multiplier = 3;
else multiplier = 1 + (streak * 0.5);
```

## Photo Card

Edit [components/PhotoCard.tsx](components/PhotoCard.tsx)

```typescript
const ASPECT_RATIO = 4 / 3;    // Change to 16/9 for widescreen

<LinearGradient
  colors={['transparent', colors.background]}
  locations={[0.6, 1]}         // Start gradient earlier: 0.4, later: 0.7
/>
```

## Swipe Sensitivity

Edit [app/index.tsx](app/index.tsx) line 90

```typescript
if (event.velocityY < -500 && gameState.hasGuessed) {
  // More sensitive: -300
  // Less sensitive: -800
}
```

## Common Customizations

### Remove streak system entirely
1. Comment out streak display in [components/ScoreDisplay.tsx](components/ScoreDisplay.tsx)
2. Set all multipliers to 1 in [utils/scoring.ts](utils/scoring.ts)

### Add sound effects
1. Install: `npx expo install expo-av`
2. Import Audio from 'expo-av'
3. Add sound files to assets
4. Play on events (lock in, reveal, swipe)

### Change photo shape
In [components/PhotoCard.tsx](components/PhotoCard.tsx):
```typescript
container: {
  borderRadius: 20,       // Add rounded corners
  overflow: 'hidden',
}
```

### Add confetti on high streaks
1. Install: `npm install react-native-confetti-cannon`
2. Trigger when streak >= 5
3. Place in [components/RevealOverlay.tsx](components/RevealOverlay.tsx)

---

**Tip**: Make small changes one at a time and test on device to see the impact!
