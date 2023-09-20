import { extraction_keys } from "../extract";
import { analyze_chunk, chunk_score } from "./chunk_analysis";
import { split_text } from "./text_splitter";

/**
 * Refines the raw career data to extract relevant segments in the context of a given job profile.
 *
 * @param raw_career_data - The raw career history data.
 * @param job_profile - The structured job profile to use as context.
 * @returns An array of refined, relevant career data segments.
 */
export async function refine_career_data(
  chunk: string,
  regexList: RegExp[],
  threshold: number
): Promise<chunk_score[]> {
  const refined_data: chunk_score[] = [];
  const chunks = await split_text(chunk);

  if (chunk.length > 50) {
    // Step 2: Analyze each chunk and refine
    for (const chunk of chunks) {
      const analysis_result = analyze_chunk(chunk, regexList, threshold);

      if (analysis_result.score > threshold * 1) {
        // You can adjust this threshold
        refined_data.push(analysis_result);
      }
    }
  }

  return refined_data;
}
