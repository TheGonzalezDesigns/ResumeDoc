import { extraction_keys } from "./profile_career";

// Define the weights for each category
const category_weights: { [key: string]: number } = {
  technical_skill_array: 1.5,
  non_technical_skill_array: 1,
  career_achievements_array: 1,
  career_experience_array: 1,
  career_projects_array: 1,
};

/**
 * Compute a matching score based on the given keywords and text.
 * Each keyword is weighted based on its category.
 *
 * @param extracted_details - The details extracted from the career profile.
 * @param text - The text to be analyzed.
 * @returns A matching score.
 */
export function weighted_keyword_matching(
  extracted_details: extraction_keys,
  text: string
): number {
  let score = 0;

  // Iterate over each category in the extracted details
  for (const category in extracted_details) {
    // Ensure the category is a valid key in our category_weights
    if (category_weights.hasOwnProperty(category)) {
      const weight =
        category_weights[category as keyof typeof category_weights];
      // Iterate over each keyword in the category
      for (const keyword of extracted_details[
        category as keyof extraction_keys
      ]) {
        if (text.includes(keyword)) {
          score += weight;
        }
      }
    }
  }

  return score;
}

/**
 * Compute a contextual analysis score based on the given keywords and text.
 *
 * @param extracted_details - The details extracted from the career profile.
 * @param text - The text to be analyzed.
 * @returns A contextual analysis score.
 */
export function contextual_analysis(
  extracted_details: extraction_keys,
  text: string
): number {
  // Additional context analysis can be added here.
  return weighted_keyword_matching(extracted_details, text);
}
