import { extraction_keys } from "../extract";
import { analyze_chunk, chunk_score } from "./chunk_analysis";

/**
 * Refines the raw career data to extract relevant segments in the context of a given job profile.
 *
 * @param raw_career_data - The raw career history data.
 * @param job_profile - The structured job profile to use as context.
 * @returns An array of refined, relevant career data segments.
 */
export async function refine_career_data(
  raw_career_data: string,
  job_profile: extraction_keys
): Promise<chunk_score[]> {
  const refined_data: chunk_score[] = [];

  // Step 1: Initial chunking
  const initial_chunks = raw_career_data.split("\n\n"); // Split by paragraphs, for instance

  // Step 2: Analyze each chunk and refine
  for (const chunk of initial_chunks) {
    const analysis_result = analyze_chunk(chunk, job_profile);

    if (analysis_result.score > 0.7) {
      // You can adjust this threshold
      refined_data.push(analysis_result);
    }
  }

  return refined_data;
}
