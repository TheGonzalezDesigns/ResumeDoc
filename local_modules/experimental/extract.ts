import { query } from "../query";
import { split_text } from "./text_splitter";
import { analyze_chunk } from "./chunk_analysis";
import { debug, log } from "./debug";

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
  regexList: RegExp[],
  threshold: number
): Promise<string[]> {
  // Start by splitting the text into initial chunks
  let chunksToAnalyze = await split_text(text);
  const acceptedChunks: string[] = [];
  let chunks = {
    original: text,
    split: chunksToAnalyze,
  };
  //debug(`<chunksToAnalyze>${JSON.stringify(chunks)}</chunksToAnalyze>`);
  while (chunksToAnalyze.length > 0) {
    // Bulk analyze all the current chunks
    const chunkAnalyses = await Promise.all(
      chunksToAnalyze.map((chunk) => analyze_chunk(chunk, regexList, threshold))
    );
    log(chunkAnalyses, "chunkAnalyses");

    // Clear out our current chunks
    chunksToAnalyze = [];

    // Process each chunk based on its analysis
    for (let i = 0; i < chunkAnalyses.length; i++) {
      if (chunkAnalyses[i].score >= threshold) {
        acceptedChunks.push(chunkAnalyses[i].chunk);
      } else {
        // If a chunk doesn't meet the threshold, split it further for analysis
        if (chunkAnalyses[i].chunk.length > 100) {
          const subChunks = await split_text(chunkAnalyses[i].chunk);
          chunksToAnalyze.push(...subChunks);
        }
      }
    }
  }

  return acceptedChunks;
}
