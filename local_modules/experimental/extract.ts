import { query } from "../query";
import { split_text } from "./text_splitter";
import { analyze_chunk } from "./chunk_analysis";
import { log } from "./debug";

// Function to extract main categories from text
export async function extract_main_categories(text: string): Promise<string[]> {
  // Create a more explicit prompt for the main category extraction with an instruction for JSON format
  const prompt = `Given the following text, identify the main career categories and list them as strings in a JSON array format. Avoid returning structured objects or nested arrays. Text: "${text}"`;

  let data = await query(prompt);
  let parsedResult: string[] = [];

  while (true) {
    try {
      // Attempt to parse the response
      parsedResult = JSON.parse(data);

      // Check if the parsed result is an array of strings
      if (
        !Array.isArray(parsedResult) ||
        !parsedResult.every((item) => typeof item === "string")
      ) {
        throw new Error("Result is not an array of strings");
      }

      // If successful and it's an array of strings, break out of the loop
      break;
    } catch (err) {
      // If there's an error (either parsing or not an array of strings), prompt for correction
      data = await query(
        `Please fix the following JSON ensuring it's a valid array of strings. Only respond with the json array and nothing else: ${data}`
      );
    }
  }

  return parsedResult;
}

// Function to extract details related to a category from text
export async function extract_details(
  category: string,
  text: string
): Promise<string[]> {
  // Create a prompt for the category-specific details extraction with an instruction for JSON format
  const prompt = `Given the category "${category}" and the text "${text}", extract relevant details about the category. Format the response as a valid Typescript String[]. Only respond with the array and nothing else.`;

  let data = await query(prompt);
  let parsedResult: string[] = [];
  //log(data, `/pre-parsed//:extracting ${category}`);

  while (true) {
    try {
      // Attempt to parse the response
      parsedResult = JSON.parse(data);

      // Check if the parsed result is an array
      if (!Array.isArray(parsedResult)) {
        throw new Error("Result is not an array");
      }

      // If successful and it's an array, break out of the loop
      break;
    } catch (err) {
      // If there's an error (either parsing or not an array), prompt for correction
      data = await query(
        `Please fix the following JSON ensuring it's a valid array. Only respond with the json array and nothing else: ${data}`
      );
    }
  }
  //log(parsedResult, `/parsed//:extracting ${category}`);
  return parsedResult;
}

// Function for adaptive chunking of text
export async function adaptive_chunking(
  text: string,
  regex_list: RegExp[],
  threshold: number
): Promise<string[]> {
  // Start by splitting the text into initial chunks
  let chunks_to_analyze = await split_text(text);
  const accepted_chunks: string[] = [];

  // While there are chunks left to analyze
  while (chunks_to_analyze.length > 0) {
    // Bulk analyze all the current chunks
    const chunk_analyses = await Promise.all(
      chunks_to_analyze.map((chunk) =>
        analyze_chunk(chunk, regex_list, threshold)
      )
    );

    // Clear the current chunks for reevaluation
    chunks_to_analyze = [];

    // Process each chunk based on its analysis
    for (let i = 0; i < chunk_analyses.length; i++) {
      if (chunk_analyses[i].score >= threshold) {
        // If the chunk meets the threshold, add it to accepted_chunks
        accepted_chunks.push(chunk_analyses[i].chunk);
      } else {
        // If a chunk doesn't meet the threshold and is long enough, split it further for analysis
        if (chunk_analyses[i].chunk.length > 100) {
          const sub_chunks = await split_text(chunk_analyses[i].chunk);
          chunks_to_analyze.push(...sub_chunks);
        }
      }
    }
  }

  // Return the accepted chunks
  return accepted_chunks;
}
