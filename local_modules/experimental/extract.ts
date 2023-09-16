import { query } from "../query";
import { split_text } from "./text_splitter";

export async function extractMainCategories(text: string): Promise<string[]> {
  const prompt = `Identify the main career categories from the following text: "${text}"`;
  return [await query(prompt)];
}

export async function extractDetails(
  category: string,
  text: string
): Promise<string[]> {
  const prompt = `Extract details related to the category "${category}" from the following text: "${text}"`;
  return [await query(prompt)];
}

export async function adaptiveChunking(text: string): Promise<string[]> {
  const threshold = 0.7; // this can be adjusted
  const chunkAnalysis = await analyzeChunk(text);

  if (chunkAnalysis.score < threshold) {
    // Split text into smaller chunks and analyze each recursively
    const chunks = split_text(text); // use your existing text splitting method
    return chunks.flatMap((chunk: string) => adaptiveChunking(chunk));
  }

  return [text];
}
