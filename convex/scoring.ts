// Scoring logic for DISC calculation (Convex-side)

const FACTOR_ITEMS: Record<string, string[]> = {
  D: ["D1", "D2", "D3", "D4"],
  I: ["I1", "I2", "I3", "I4"],
  S: ["S1", "S2", "S3", "S4"],
  C: ["C1", "C2", "C3", "C4"],
};

const COLOR_MAP: Record<string, string> = {
  D: "Red",
  I: "Yellow",
  S: "Green",
  C: "Blue",
};

export type Scores = {
  D: number;
  I: number;
  S: number;
  C: number;
};

export function calculateScores(responses: Record<string, number>): Scores {
  const scores: Scores = { D: 0, I: 0, S: 0, C: 0 };

  for (const [factor, items] of Object.entries(FACTOR_ITEMS)) {
    scores[factor as keyof Scores] = items.reduce(
      (sum, itemId) => sum + (responses[itemId] || 0),
      0
    );
  }

  return scores;
}

export function getPrimaryType(scores: Scores): string {
  const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C);
  const tied = (Object.entries(scores) as [keyof Scores, number][])
    .filter(([, score]) => score === maxScore)
    .map(([factor]) => factor)
    .sort();

  return tied.length === 1 ? tied[0] : tied.join("/");
}

export function getSecondaryType(scores: Scores, primaryType: string): string | undefined {
  const primaryFactors = primaryType.split("/");
  const remaining = (Object.entries(scores) as [keyof Scores, number][])
    .filter(([factor]) => !primaryFactors.includes(factor))
    .sort((a, b) => b[1] - a[1]);

  if (remaining.length === 0) {
    return undefined;
  }

  const maxSecondary = remaining[0][1];
  const secondaryTied = remaining
    .filter(([, score]) => score === maxSecondary)
    .map(([factor]) => factor)
    .sort();

  return secondaryTied.length === 1 ? secondaryTied[0] : secondaryTied.join("/");
}

export function getColorForFactor(factor: string): string {
  return COLOR_MAP[factor] || "Unknown";
}
