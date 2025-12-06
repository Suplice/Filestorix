export const xpThresholds: { [key: number]: number } = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
};

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
  let xpForCurrentLevel = xpThresholds[currentLevel] ?? 0;
  let nextLevel: number | null = currentLevel + 1;
  let xpForNextLevel = xpThresholds[nextLevel];

  if (xpForNextLevel === undefined) {
    nextLevel = null;
    xpForNextLevel = currentXp;
    if (xpForCurrentLevel > currentXp) xpForCurrentLevel = currentXp;
  }

  const xpInCurrentLevel = Math.max(0, currentXp - xpForCurrentLevel);
  const levelXpRange = Math.max(1, xpForNextLevel - xpForCurrentLevel);

  const progressPercentage = Math.min(
    100,
    Math.max(0, (xpInCurrentLevel / levelXpRange) * 100)
  );

  return {
    xpForCurrentLevel,
    xpForNextLevel,
    xpInCurrentLevel,
    progressPercentage,
    nextLevel,
  };
};
