import { query } from "./query";

/**
 * Expands the given list of keywords by adding synonyms.
 *
 * @param {string[]} keywords - The list of keywords to be expanded.
 * @returns {Promise<string[]>} A promise that resolves to an array of expanded keywords.
 */
export const expand_keywords = async (
  keywords: string[]
): Promise<string[]> => {
  const prompt = `
    Given this list of keywords: ${keywords.join(" | ")}
    Augment the list by adding synonyms to each keyword.
    Format the list as a string[]
    Return a list twice the current size.
    Make sure each added keyword is relevant to the original set.
    Avoid including any generic terms.
  `;

  let data = await query(prompt);
  let parsed_result: string[] = [];

  while (true) {
    try {
      parsed_result = JSON.parse(data);

      if (
        !Array.isArray(parsed_result) ||
        !parsed_result.every((item) => typeof item === "string")
      ) {
        throw new Error("Result is not an array of strings");
      }

      break;
    } catch (err) {
      data = await query(
        `Please fix the following JSON ensuring it's a valid array. Only respond with the json array and nothing else: ${data}`
      );
    }
  }
  return parsed_result;
};
