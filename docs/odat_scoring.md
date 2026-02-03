# ODAT Scoring Specification

## Factor Item Sets

Each DISC factor is measured by exactly 4 items.

| Factor | Color  | Item IDs          |
|--------|--------|-------------------|
| D      | Red    | D1, D2, D3, D4    |
| I      | Yellow | I1, I2, I3, I4    |
| S      | Green  | S1, S2, S3, S4    |
| C      | Blue   | C1, C2, C3, C4    |

## Scoring Rules

### Aggregation Method

Sum the response values for the 4 items belonging to each factor.

```
factor_score = sum(item_responses for items in factor)
```

### Score Ranges

Given response values from 1 to 5 and 4 items per factor:

| Metric     | Value |
|------------|-------|
| Minimum    | 4     |
| Maximum    | 20    |
| Midpoint   | 12    |

### Primary Type Determination

The primary type is the factor with the highest summed score.

```
primary_type = factor with max(factor_score)
primary_color = color_mapping[primary_type]
```

Color mapping:
- D -> Red
- I -> Yellow
- S -> Green
- C -> Blue

### Secondary Type Determination

The secondary type is the factor with the second highest summed score.

## Tie Policy

When two or more factors share the highest score:

1. Report the result as a blended type combining all tied factors
2. Display all tied colors in the result
3. Order tied factors alphabetically by factor letter (C, D, I, S)

Example: If D and I are both highest with score 18, report as "D/I" or "Red/Yellow blend"

When a tie exists for the secondary type:

1. Report all tied secondary factors
2. Order alphabetically by factor letter

## Missing Answer Policy

All 16 items must be answered before scoring can proceed.

- If any item response is missing, null, or outside the valid range (1 to 5), do not compute scores
- Display an error message prompting the user to complete all questions
- Do not impute or substitute missing values

Validation requirements:
- Total responses: 16
- Each response must be an integer from 1 to 5 inclusive
- Each item_id must have exactly one response

## Implementation Notes

### Response Validation

```
function isValidResponse(response) {
  return Number.isInteger(response) && response >= 1 && response <= 5
}
```

### Score Calculation

```
function calculateScores(responses) {
  const factors = {
    D: ['D1', 'D2', 'D3', 'D4'],
    I: ['I1', 'I2', 'I3', 'I4'],
    S: ['S1', 'S2', 'S3', 'S4'],
    C: ['C1', 'C2', 'C3', 'C4']
  }

  const scores = {}
  for (const [factor, items] of Object.entries(factors)) {
    scores[factor] = items.reduce((sum, id) => sum + responses[id], 0)
  }
  return scores
}
```

### Primary Type Selection

```
function getPrimaryType(scores) {
  const maxScore = Math.max(...Object.values(scores))
  const tied = Object.entries(scores)
    .filter(([_, score]) => score === maxScore)
    .map(([factor, _]) => factor)
    .sort()

  return tied.length === 1 ? tied[0] : tied.join('/')
}
```

## Score Interpretation Guidelines

Scores are relative within an individual's profile. A higher score in one factor compared to others indicates that factor is more prominent in the person's behavioral tendencies.

| Score Range | Interpretation        |
|-------------|-----------------------|
| 4 to 8      | Low tendency          |
| 9 to 12     | Moderate tendency     |
| 13 to 16    | Above average tendency|
| 17 to 20    | Strong tendency       |

These ranges are for guidance only. The primary diagnostic value is the relative ranking of the four factors within an individual's profile, not the absolute scores.
