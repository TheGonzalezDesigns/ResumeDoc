import { query } from "./query";
import { split_text } from "./text_splitter";
import { analyze_chunk } from "./chunk_analysis";

// Define types
export type extraction = Record<string, any>;
export type extractions = extraction[];
export type extraction_keys = {
  [key: string]: string[];
};
export type meta = {
  raw_data: string;
  categories: extraction_keys;
};

/**
 * Extracts main categories from the given text.
 *
 * @param {string} text - The text to extract main categories from.
 * @returns {Promise<string[]>} A promise that resolves to an array of main categories.
 */
export const extract_main_categories = async (
  text: string
): Promise<string[]> => {
  const prompt = `...`; // Prompt remains unchanged for brevity

  let data = await query(prompt);
  let parsed_result: string[] = [];

  // Loop to ensure the result is a valid array of strings.
  while (true) {
    try {
      parsed_result = JSON.parse(data);

      // Validate if parsed result is an array of strings.
      if (
        !Array.isArray(parsed_result) ||
        !parsed_result.every((item) => typeof item === "string")
      ) {
        throw new Error("Result is not an array of strings");
      }

      break;
    } catch (err) {
      data = await query(`...`);
    }
  }

  return parsed_result;
};

/**
 * Extracts details related to the given category from the provided text.
 *
 * @param {string} category - The category to extract details for.
 * @param {string} text - The text to extract details from.
 * @returns {Promise<string[]>} A promise that resolves to an array of details related to the category.
 */
export const extract_details = async (
  category: string,
  text: string
): Promise<string[]> => {
  const prompt = `...`; // Prompt remains unchanged for brevity

  let data = await query(prompt);
  let parsed_result: string[] = [];

  // Loop to ensure the result is a valid array.
  while (true) {
    try {
      parsed_result = JSON.parse(data);

      // Validate if parsed result is an array.
      if (!Array.isArray(parsed_result)) {
        throw new Error("Result is not an array");
      }

      break;
    } catch (err) {
      data = await query(`...`);
    }
  }

  return parsed_result;
};

/**
 * Performs adaptive chunking of the given text based on the provided regex list and threshold.
 *
 * @param {string} text - The text to be chunked.
 * @param {RegExp[]} regex_list - The list of regular expressions to be used for chunk analysis.
 * @param {number} threshold - The threshold to accept a chunk.
 * @returns {Promise<string[]>} A promise that resolves to an array of accepted chunks.
 */
export const adaptive_chunking = async (
  text: string,
  regex_list: RegExp[],
  threshold: number
): Promise<string[]> => {
  let chunks_to_analyze = await split_text(text);
  const accepted_chunks: string[] = [];

  // Loop to analyze all the chunks.
  while (chunks_to_analyze.length > 0) {
    const chunk_analyses = await Promise.all(
      chunks_to_analyze.map((chunk) =>
        analyze_chunk(chunk, regex_list, threshold)
      )
    );
    chunks_to_analyze = [];

    // Evaluate each chunk based on its analysis.
    for (const analysis of chunk_analyses) {
      if (analysis.score >= threshold) {
        accepted_chunks.push(analysis.chunk);
      } else if (analysis.chunk.length > 100) {
        const sub_chunks = await split_text(analysis.chunk);
        chunks_to_analyze.push(...sub_chunks);
      }
    }
  }

  return accepted_chunks;
};
