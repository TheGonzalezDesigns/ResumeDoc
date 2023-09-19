import { query } from "../query";
import { split_text } from "./text_splitter";
import { analyze_chunk } from "./chunk_analysis";
import { debug, log } from "./debug";

// Function to extract main categories from text
export async function extract_main_categories(text: string): Promise<string[]> {
  // Create a prompt for the main category extraction
  const prompt = `Identify the main career categories from the following text: "${text}"`;

  // Execute the query and return the result as an array
  return [await query(prompt)];
}

// Function to extract details related to a category from text
export async function extract_details(
  category: string,
  text: string
): Promise<string[]> {
  // Create a prompt for the category-specific details extraction
  const prompt = `Extract details related to the category "${category}" from the following text: "${text}"`;

  // Execute the query and return the result as an array
  return [await query(prompt)];
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
  const chunks = {
    original: text,
    split: chunks_to_analyze,
  };

  // While there are chunks left to analyze
  while (chunks_to_analyze.length > 0) {
    // Bulk analyze all the current chunks
    const chunk_analyses = await Promise.all(
      chunks_to_analyze.map((chunk) =>
        analyze_chunk(chunk, regex_list, threshold)
      )
    );

    // Log the chunk analyses for debugging
    log(chunk_analyses, "chunk_analyses");

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
