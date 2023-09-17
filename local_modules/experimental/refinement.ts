import { extraction_keys } from "../extract";
import { extract_main_categories, extract_details } from "./extract";
import { analyze_chunk, chunk_score } from "./chunk_analysis";
import { profile_career_chunk } from "./profile_career";

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
    const chunk_details = await profile_career_chunk(chunk);
    const analysis_result = await analyze_chunk(chunk_details, job_profile);

    if (analysis_result.is_relevant) {
      refined_data.push(analysis_result);
    }
  }

  return refined_data;
}
