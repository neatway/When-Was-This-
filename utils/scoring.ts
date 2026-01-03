import { ScoreResult } from '../types';
import { gameConfig } from '../constants/config';

export function calculateScore(
  guess: number,
  actual: number,
  streak: number
): ScoreResult {
  const difference = Math.abs(guess - actual);
  const basePoints = Math.max(
    0,
    gameConfig.exactYearBonus - difference * gameConfig.penaltyPerYear
  );

  const streakBroken = difference > gameConfig.streakThreshold;

  let multiplier = 1;
  if (!streakBroken && streak >= 1) {
    if (streak === 1) multiplier = 1;
    else if (streak === 2) multiplier = 1.2;
    else if (streak === 3) multiplier = 1.5;
    else multiplier = 2;
  }

  const totalPoints = Math.round(basePoints * multiplier);

  return { basePoints, multiplier, totalPoints, streakBroken };
}
