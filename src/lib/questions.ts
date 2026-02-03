// Question data and utilities for the DISC questionnaire
import odatItems from "../../docs/odat_items.json";

export type Question = {
  item_id: string;
  item_text: string;
  factor: string;
  color: string;
};

export type ResponseScale = {
  response_min: number;
  response_max: number;
  response_labels: string[];
};

export const questions: Question[] = odatItems.items;
export const responseScale: ResponseScale = odatItems.response_scale;
export const license = odatItems.license;
export const disclaimer = odatItems.disclaimer_text;

/**
 * Fisher-Yates shuffle algorithm to randomize questions
 */
export function shuffleQuestions(questionsToShuffle: Question[]): Question[] {
  const shuffled = [...questionsToShuffle];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Gets a shuffled copy of all questions
 */
export function getShuffledQuestions(): Question[] {
  return shuffleQuestions(questions);
}
