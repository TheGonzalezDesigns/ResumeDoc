import { query } from "../query";
import { split_text } from "./text_splitter";
import { analyze_chunk, init_keywords } from "./chunk_analysis";
import { extraction } from "../extract";

export async function extract_main_categories(text: string): Promise<string[]> {
  const prompt = `Identify the main career categories from the following text: "${text}"`;
  return [await query(prompt)];
}

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

  const chunksToAnalyze = [text];
  const acceptedChunks: string[] = [];

  while (chunksToAnalyze.length > 0) {
    const currentChunk = chunksToAnalyze.pop()!;
    const chunkAnalysis = await analyze_chunk(currentChunk, job_profile);

    if (chunkAnalysis.score >= threshold) {
      acceptedChunks.push(currentChunk);
    } else {
      const subChunks = await split_text(currentChunk);
      chunksToAnalyze.push(...subChunks);
    }
  }

  return acceptedChunks;
}
