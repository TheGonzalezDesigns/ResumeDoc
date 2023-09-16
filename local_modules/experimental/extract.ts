import { query } from "../query";
import { split_text } from "./text_splitter";
import { analyze_chunk } from "./chunk_analysis";
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
  const threshold = 0.7; // this can be adjusted
  const chunk_analysis = await analyze_chunk(text, job_profile);

  if (chunk_analysis.score < threshold) {
    // Split text into smaller chunks and analyze each recursively
    const chunks = await split_text(text); // use your existing text splitting method
    const all_chunks: string[] = [];
    for (const chunk of chunks) {
      const result = await adaptive_chunking(chunk, job_profile);
      all_chunks.push(...result);
    }
    return all_chunks;
  }

  return [text];
}
