// Path: lib/utils/xpUtils.ts (or similar)

// XP Thresholds matching the backend (Level -> Total XP required)
export const xpThresholds: { [key: number]: number } = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  // Add more levels if defined in the backend
};

// Helper function to get XP needed for the next level and current progress
export const getXpForNextLevel = (
  currentLevel: number,
  currentXp: number
): {
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  progressPercentage: number;
  nextLevel: number | null;
} => {
  let xpForCurrentLevel = xpThresholds[currentLevel] ?? 0; // XP needed to *reach* current level
  let nextLevel: number | null = currentLevel + 1;
  let xpForNextLevel = xpThresholds[nextLevel];

  // Handle reaching max defined level
  if (xpForNextLevel === undefined) {
    nextLevel = null; // No next level defined
    xpForNextLevel = currentXp; // Set next level threshold to current XP for 100% progress
    // Ensure xpForCurrentLevel is not higher than currentXp if at max level
    if (xpForCurrentLevel > currentXp) xpForCurrentLevel = currentXp;
  }

  // XP gained *since* reaching the current level
  const xpInCurrentLevel = Math.max(0, currentXp - xpForCurrentLevel);
  // Total XP range for the current level (or remaining XP if at max)
  const levelXpRange = Math.max(1, xpForNextLevel - xpForCurrentLevel); // Avoid division by zero

  // Percentage progress within the current level's range
  const progressPercentage = Math.min(
    100,
    Math.max(0, (xpInCurrentLevel / levelXpRange) * 100)
  );

  return {
    xpForCurrentLevel, // XP required to START this level (e.g., Level 4 starts at 500 XP)
    xpForNextLevel, // XP required to START the next level (e.g., Level 5 starts at 1000 XP)
    xpInCurrentLevel, // How much XP the user has earned *within* this level (currentXp - xpForCurrentLevel)
    progressPercentage, // Percentage towards next level
    nextLevel, // The next level number (or null if max)
  };
};
