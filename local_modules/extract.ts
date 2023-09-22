import { query } from "./query";
import { split_text } from "./text_splitter";
import { analyze_chunk } from "./chunk_analysis";

/**
 * Extracts main categories from the given text.
 * @param {string} text - The text to extract main categories from.
 * @returns {Promise<string[]>} - A promise that resolves to an array of main categories.
 */
export const extract_main_categories = async (
  text: string
): Promise<string[]> => {
  // Construct a prompt for extracting main categories in JSON array format.
  const prompt = `Given the following text, identify the main career categories and list them as strings in a JSON array format. Avoid returning structured objects or nested arrays. Text: "${text}"`;

  let data = await query(prompt);
  let parsedResult: string[] = [];

  // Loop to ensure the result is a valid array of strings.
  while (true) {
    try {
      parsedResult = JSON.parse(data); // Attempt to parse the response.

      // Validate if parsed result is an array of strings.
      if (
        !Array.isArray(parsedResult) ||
        !parsedResult.every((item) => typeof item === "string")
      ) {
        throw new Error("Result is not an array of strings");
      }

      break; // Exit the loop if the result is a valid array of strings.
    } catch (err) {
      // Prompt for correction if the result is not a valid array of strings.
      data = await query(
        `Please fix the following JSON ensuring it's a valid array of strings. Only respond with the json array and nothing else: ${data}`
      );
    }
  }

  return parsedResult;
};

/**
 * Extracts details related to the given category from the provided text.
 * @param {string} category - The category to extract details for.
 * @param {string} text - The text to extract details from.
 * @returns {Promise<string[]>} - A promise that resolves to an array of details related to the category.
 */
export const extract_details = async (
  category: string,
  text: string
): Promise<string[]> => {
  // Construct a prompt for extracting category-specific details in array format.
  const prompt = `Given the category "${category}" and the text "${text}", extract relevant details about the category. Format the response as a valid Typescript String[]. Only respond with the array and nothing else.`;

  let data = await query(prompt);
  let parsedResult: string[] = [];

  // Loop to ensure the result is a valid array.
  while (true) {
    try {
      parsedResult = JSON.parse(data); // Attempt to parse the response.

      // Validate if parsed result is an array.
      if (!Array.isArray(parsedResult)) {
        throw new Error("Result is not an array");
      }

      break; // Exit the loop if the result is a valid array.
    } catch (err) {
      // Prompt for correction if the result is not a valid array.
      data = await query(
        `Please fix the following JSON ensuring it's a valid array. Only respond with the json array and nothing else: ${data}`
      );
    }
  }

  return parsedResult;
};

/**
 * Performs adaptive chunking of the given text based on the provided regex list and threshold.
 * @param {string} text - The text to be chunked.
 * @param {RegExp[]} regex_list - The list of regular expressions to be used for chunk analysis.
 * @param {number} threshold - The threshold to accept a chunk.
 * @returns {Promise<string[]>} - A promise that resolves to an array of accepted chunks.
 */
export const adaptive_chunking = async (
  text: string,
  regex_list: RegExp[],
  threshold: number
): Promise<string[]> => {
  let chunks_to_analyze = await split_text(text); // Initial splitting of the text into chunks.
  const accepted_chunks: string[] = [];

  // Loop to analyze all the chunks.
  while (chunks_to_analyze.length > 0) {
    // Bulk analysis of the current chunks.
    const chunk_analyses = await Promise.all(
      chunks_to_analyze.map((chunk) =>
        analyze_chunk(chunk, regex_list, threshold)
      )
    );
    chunks_to_analyze = []; // Clear the current chunks for reevaluation.

    // Evaluate each chunk based on its analysis.
    for (const analysis of chunk_analyses) {
      if (analysis.score >= threshold) {
        // Accept the chunk if it meets the threshold.
        accepted_chunks.push(analysis.chunk);
      } else if (analysis.chunk.length > 100) {
        // Split the chunk further for analysis if it doesn't meet the threshold and is long enough.
        const sub_chunks = await split_text(analysis.chunk);
        chunks_to_analyze.push(...sub_chunks);
      }
    }
  }

  return accepted_chunks;
};
