import { query } from "../query";
import { split_text } from "./text_splitter";
import { analyze_chunk, init_keywords } from "./chunk_analysis";
import { extraction } from "../extract";

export async function extract_main_categories(text: string): Promise<string[]> {
  const prompt = `Identify the main career categories from the following text: "${text}"`;
  return [await query(prompt)];
}

const threshold = 0.7; // This can be adjusted based on your requirements

export async function extract_details(
  category: string,
  text: string
): Promise<string[]> {
  const prompt = `Extract details related to the category "${category}" from the following text: "${text}"`;
  return [await query(prompt)];
}

export async function adaptive_chunking(
  text: string,
  job_profile: extraction
): Promise<string[]> {
  // Initialize the keywords and regex patterns for the provided job profile
  init_keywords(job_profile);

  // Start by splitting the text into initial chunks
  let chunksToAnalyze = await split_text(text);
  const acceptedChunks: string[] = [];

  while (chunksToAnalyze.length > 0) {
    // Bulk analyze all the current chunks
    const chunkAnalyses = await Promise.all(
      chunksToAnalyze.map((chunk) => analyze_chunk(chunk, job_profile))
    );

    // Clear out our current chunks
    chunksToAnalyze = [];

    // Process each chunk based on its analysis
    for (let i = 0; i < chunkAnalyses.length; i++) {
      if (chunkAnalyses[i].score >= threshold) {
        acceptedChunks.push(chunkAnalyses[i].chunk);
      } else {
        // If a chunk doesn't meet the threshold, split it further for analysis
        const subChunks = await split_text(chunkAnalyses[i].chunk);
        chunksToAnalyze.push(...subChunks);
      }
    }
  }

  return acceptedChunks;
}
