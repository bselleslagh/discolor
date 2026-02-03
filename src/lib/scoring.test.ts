import { describe, it, expect } from "vitest";
import {
  isValidResponse,
  validateResponses,
  calculateScores,
  getPrimaryType,
  getPrimaryColor,
  getSecondaryType,
  getSecondaryColor,
  calculateDISCResult,
  getScoreInterpretation,
  scoreToPercentage,
  type Response,
} from "./scoring";

// Helper to create a full set of responses
function createResponses(values: Record<string, number>): Response[] {
  const items = [
    { itemId: "D1", factor: "D" },
    { itemId: "D2", factor: "D" },
    { itemId: "D3", factor: "D" },
    { itemId: "D4", factor: "D" },
    { itemId: "I1", factor: "I" },
    { itemId: "I2", factor: "I" },
    { itemId: "I3", factor: "I" },
    { itemId: "I4", factor: "I" },
    { itemId: "S1", factor: "S" },
    { itemId: "S2", factor: "S" },
    { itemId: "S3", factor: "S" },
    { itemId: "S4", factor: "S" },
    { itemId: "C1", factor: "C" },
    { itemId: "C2", factor: "C" },
    { itemId: "C3", factor: "C" },
    { itemId: "C4", factor: "C" },
  ];
  return items.map((item) => ({
    ...item,
    value: values[item.itemId] ?? 3,
  }));
}

describe("isValidResponse", () => {
  it("accepts valid values 1-5", () => {
    expect(isValidResponse(1)).toBe(true);
    expect(isValidResponse(2)).toBe(true);
    expect(isValidResponse(3)).toBe(true);
    expect(isValidResponse(4)).toBe(true);
    expect(isValidResponse(5)).toBe(true);
  });

  it("rejects invalid values", () => {
    expect(isValidResponse(0)).toBe(false);
    expect(isValidResponse(6)).toBe(false);
    expect(isValidResponse(-1)).toBe(false);
    expect(isValidResponse(1.5)).toBe(false);
  });
});

describe("validateResponses", () => {
  it("accepts valid complete responses", () => {
    const responses = createResponses({});
    expect(validateResponses(responses)).toBeNull();
  });

  it("rejects wrong number of responses", () => {
    const responses = createResponses({}).slice(0, 15);
    expect(validateResponses(responses)).toContain("Expected 16");
  });

  it("rejects invalid response values", () => {
    const responses = createResponses({ D1: 6 });
    expect(validateResponses(responses)).toContain("Invalid response value");
  });

  it("rejects duplicate items", () => {
    const responses = createResponses({});
    responses[0] = { ...responses[0] };
    responses.push({ itemId: "D1", factor: "D", value: 3 });
    // Remove one to keep count at 16
    responses.pop();
    responses.pop();
    responses.push({ itemId: "D1", factor: "D", value: 3 });
    expect(validateResponses(responses)).toContain("Duplicate");
  });
});

describe("calculateScores", () => {
  it("sums scores correctly for each factor", () => {
    const responses = createResponses({
      D1: 5,
      D2: 5,
      D3: 5,
      D4: 5,
      I1: 4,
      I2: 4,
      I3: 4,
      I4: 4,
      S1: 3,
      S2: 3,
      S3: 3,
      S4: 3,
      C1: 2,
      C2: 2,
      C3: 2,
      C4: 2,
    });

    const scores = calculateScores(responses);
    expect(scores.D).toBe(20);
    expect(scores.I).toBe(16);
    expect(scores.S).toBe(12);
    expect(scores.C).toBe(8);
  });

  it("handles minimum scores (all 1s)", () => {
    const responses = createResponses({
      D1: 1,
      D2: 1,
      D3: 1,
      D4: 1,
      I1: 1,
      I2: 1,
      I3: 1,
      I4: 1,
      S1: 1,
      S2: 1,
      S3: 1,
      S4: 1,
      C1: 1,
      C2: 1,
      C3: 1,
      C4: 1,
    });

    const scores = calculateScores(responses);
    expect(scores.D).toBe(4);
    expect(scores.I).toBe(4);
    expect(scores.S).toBe(4);
    expect(scores.C).toBe(4);
  });

  it("handles maximum scores (all 5s)", () => {
    const responses = createResponses({
      D1: 5,
      D2: 5,
      D3: 5,
      D4: 5,
      I1: 5,
      I2: 5,
      I3: 5,
      I4: 5,
      S1: 5,
      S2: 5,
      S3: 5,
      S4: 5,
      C1: 5,
      C2: 5,
      C3: 5,
      C4: 5,
    });

    const scores = calculateScores(responses);
    expect(scores.D).toBe(20);
    expect(scores.I).toBe(20);
    expect(scores.S).toBe(20);
    expect(scores.C).toBe(20);
  });
});

describe("getPrimaryType", () => {
  it("returns single factor when one is highest", () => {
    expect(getPrimaryType({ D: 20, I: 16, S: 12, C: 8 })).toBe("D");
    expect(getPrimaryType({ D: 8, I: 20, S: 12, C: 16 })).toBe("I");
    expect(getPrimaryType({ D: 8, I: 12, S: 20, C: 16 })).toBe("S");
    expect(getPrimaryType({ D: 8, I: 12, S: 16, C: 20 })).toBe("C");
  });

  it("returns tied factors alphabetically when scores are equal", () => {
    expect(getPrimaryType({ D: 20, I: 20, S: 12, C: 8 })).toBe("D/I");
    expect(getPrimaryType({ D: 20, I: 12, S: 20, C: 8 })).toBe("D/S");
    expect(getPrimaryType({ D: 8, I: 20, S: 20, C: 12 })).toBe("I/S");
    expect(getPrimaryType({ D: 20, I: 20, S: 20, C: 8 })).toBe("D/I/S");
    expect(getPrimaryType({ D: 20, I: 20, S: 20, C: 20 })).toBe("C/D/I/S");
  });
});

describe("getPrimaryColor", () => {
  it("returns correct color for single type", () => {
    expect(getPrimaryColor("D")).toBe("Red");
    expect(getPrimaryColor("I")).toBe("Yellow");
    expect(getPrimaryColor("S")).toBe("Green");
    expect(getPrimaryColor("C")).toBe("Blue");
  });

  it("returns blended colors for tied types", () => {
    expect(getPrimaryColor("D/I")).toBe("Red/Yellow");
    expect(getPrimaryColor("C/D/I/S")).toBe("Blue/Red/Yellow/Green");
  });
});

describe("getSecondaryType", () => {
  it("returns second highest factor", () => {
    expect(getSecondaryType({ D: 20, I: 16, S: 12, C: 8 }, "D")).toBe("I");
    expect(getSecondaryType({ D: 8, I: 20, S: 16, C: 12 }, "I")).toBe("S");
  });

  it("returns tied secondary factors alphabetically", () => {
    expect(getSecondaryType({ D: 20, I: 16, S: 16, C: 8 }, "D")).toBe("I/S");
  });

  it("returns undefined when all factors are primary", () => {
    expect(
      getSecondaryType({ D: 20, I: 20, S: 20, C: 20 }, "C/D/I/S")
    ).toBeUndefined();
  });
});

describe("getSecondaryColor", () => {
  it("returns correct color for secondary type", () => {
    expect(getSecondaryColor("I")).toBe("Yellow");
    expect(getSecondaryColor("I/S")).toBe("Yellow/Green");
  });

  it("returns undefined for undefined input", () => {
    expect(getSecondaryColor(undefined)).toBeUndefined();
  });
});

describe("calculateDISCResult", () => {
  it("calculates complete result", () => {
    const responses = createResponses({
      D1: 5,
      D2: 5,
      D3: 5,
      D4: 5,
      I1: 4,
      I2: 4,
      I3: 4,
      I4: 4,
      S1: 3,
      S2: 3,
      S3: 3,
      S4: 3,
      C1: 2,
      C2: 2,
      C3: 2,
      C4: 2,
    });

    const result = calculateDISCResult(responses);

    expect(result.scores).toEqual({ D: 20, I: 16, S: 12, C: 8 });
    expect(result.primaryType).toBe("D");
    expect(result.primaryColor).toBe("Red");
    expect(result.secondaryType).toBe("I");
    expect(result.secondaryColor).toBe("Yellow");
  });

  it("throws on invalid responses", () => {
    const responses = createResponses({}).slice(0, 15);
    expect(() => calculateDISCResult(responses)).toThrow();
  });
});

describe("getScoreInterpretation", () => {
  it("returns correct interpretation for score ranges", () => {
    expect(getScoreInterpretation(4)).toBe("Low tendency");
    expect(getScoreInterpretation(8)).toBe("Low tendency");
    expect(getScoreInterpretation(9)).toBe("Moderate tendency");
    expect(getScoreInterpretation(12)).toBe("Moderate tendency");
    expect(getScoreInterpretation(13)).toBe("Above average tendency");
    expect(getScoreInterpretation(16)).toBe("Above average tendency");
    expect(getScoreInterpretation(17)).toBe("Strong tendency");
    expect(getScoreInterpretation(20)).toBe("Strong tendency");
  });
});

describe("scoreToPercentage", () => {
  it("maps score range 4-20 to 0-100", () => {
    expect(scoreToPercentage(4)).toBe(0);
    expect(scoreToPercentage(12)).toBe(50);
    expect(scoreToPercentage(20)).toBe(100);
  });
});
