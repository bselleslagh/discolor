// DISC Scoring Logic
// Based on the OSPP DISC Assessment Test scoring specification

export const FACTOR_ITEMS: Record<string, string[]> = {
  D: ["D1", "D2", "D3", "D4"],
  I: ["I1", "I2", "I3", "I4"],
  S: ["S1", "S2", "S3", "S4"],
  C: ["C1", "C2", "C3", "C4"],
};

export const COLOR_MAP: Record<string, string> = {
  D: "Red",
  I: "Yellow",
  S: "Green",
  C: "Blue",
};

export const FACTOR_NAMES: Record<string, string> = {
  D: "Dominance",
  I: "Influence",
  S: "Steadiness",
  C: "Conscientiousness",
};

export type Factor = "D" | "I" | "S" | "C";

export type Scores = {
  D: number;
  I: number;
  S: number;
  C: number;
};

export type Response = {
  itemId: string;
  factor: string;
  value: number;
};

export type DISCResult = {
  scores: Scores;
  primaryType: string;
  primaryColor: string;
  secondaryType?: string;
  secondaryColor?: string;
};

/**
 * Validates a single response value
 */
export function isValidResponse(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

/**
 * Validates all responses before scoring
 * Returns an error message or null if valid
 */
export function validateResponses(responses: Response[]): string | null {
  if (responses.length !== 16) {
    return `Expected 16 responses, got ${responses.length}`;
  }

  const itemIds = new Set<string>();
  for (const response of responses) {
    if (!isValidResponse(response.value)) {
      return `Invalid response value ${response.value} for item ${response.itemId}`;
    }
    if (itemIds.has(response.itemId)) {
      return `Duplicate response for item ${response.itemId}`;
    }
    itemIds.add(response.itemId);
  }

  // Check all required items are present
  const allItems = Object.values(FACTOR_ITEMS).flat();
  for (const itemId of allItems) {
    if (!itemIds.has(itemId)) {
      return `Missing response for item ${itemId}`;
    }
  }

  return null;
}

/**
 * Calculates DISC scores from responses
 */
export function calculateScores(responses: Response[]): Scores {
  const responseMap: Record<string, number> = {};
  for (const r of responses) {
    responseMap[r.itemId] = r.value;
  }

  const scores: Scores = { D: 0, I: 0, S: 0, C: 0 };

  for (const [factor, items] of Object.entries(FACTOR_ITEMS)) {
    scores[factor as Factor] = items.reduce(
      (sum, itemId) => sum + (responseMap[itemId] || 0),
      0
    );
  }

  return scores;
}

/**
 * Determines the primary type(s) - the factor(s) with the highest score
 * Returns tied factors alphabetically sorted and joined with /
 */
export function getPrimaryType(scores: Scores): string {
  const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C);
  const tied = (Object.entries(scores) as [Factor, number][])
    .filter(([, score]) => score === maxScore)
    .map(([factor]) => factor)
    .sort();

  return tied.join("/");
}

/**
 * Gets the color(s) for the primary type
 */
export function getPrimaryColor(primaryType: string): string {
  const factors = primaryType.split("/");
  const colors = factors.map((f) => COLOR_MAP[f]);
  return colors.join("/");
}

/**
 * Determines the secondary type(s) - the factor(s) with the second highest score
 * Excludes the primary type factors
 */
export function getSecondaryType(scores: Scores, primaryType: string): string | undefined {
  const primaryFactors = primaryType.split("/");
  const remaining = (Object.entries(scores) as [Factor, number][])
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

  return secondaryTied.join("/");
}

/**
 * Gets the color(s) for the secondary type
 */
export function getSecondaryColor(secondaryType: string | undefined): string | undefined {
  if (!secondaryType) return undefined;
  const factors = secondaryType.split("/");
  const colors = factors.map((f) => COLOR_MAP[f]);
  return colors.join("/");
}

/**
 * Full DISC calculation from responses
 */
export function calculateDISCResult(responses: Response[]): DISCResult {
  const validationError = validateResponses(responses);
  if (validationError) {
    throw new Error(validationError);
  }

  const scores = calculateScores(responses);
  const primaryType = getPrimaryType(scores);
  const primaryColor = getPrimaryColor(primaryType);
  const secondaryType = getSecondaryType(scores, primaryType);
  const secondaryColor = getSecondaryColor(secondaryType);

  return {
    scores,
    primaryType,
    primaryColor,
    secondaryType,
    secondaryColor,
  };
}

/**
 * Gets score interpretation based on the scoring spec
 */
export function getScoreInterpretation(score: number): string {
  if (score >= 17) return "Strong tendency";
  if (score >= 13) return "Above average tendency";
  if (score >= 9) return "Moderate tendency";
  return "Low tendency";
}

/**
 * Calculates percentage for visualization (score range is 4-20)
 */
export function scoreToPercentage(score: number): number {
  // Map 4-20 to 0-100
  return Math.round(((score - 4) / 16) * 100);
}
