import { extraction } from "./extract";
import { split_text } from "./text_splitter";
import { initialize_analysis } from "./chunk_analysis";
import { adaptive_chunking } from "./extract";
import { invert_chunks } from "./inversion";

/**
 * Summarizes a career based on the job profile and raw career data.
 *
 * @param {extraction} job_profile - The job profile containing technical and non-technical skills.
 * @returns {Promise<string>} A promise that resolves to a summarized career text.
 * @throws {Error} Throws an error if any step in the process fails.
 */
export const summarize_career = async (
  job_profile: extraction
): Promise<string> => {
  let summary = "";

  try {
    // Step 1: Load Raw Career Data
    const filepath = "./context/professional/profile.txt";
    const raw_career_data = await Bun.file(filepath).text();

    // Step 2: Text Splitting and Initial Chunking
    const initial_chunks = await split_text(raw_career_data);

    // Step 3: Initialize Analysis Parameters
    const { regex_list, threshold } = await initialize_analysis(job_profile);

    // Step 4: Adaptive Chunking and Refinement
    const adapted_chunks: string[] = (
      await Promise.all(
        initial_chunks.map((initial_chunk) =>
          adaptive_chunking(initial_chunk, regex_list, threshold)
        )
      )
    ).flat();

    // Remove duplicates from the adapted chunks
    const refined_chunks = Array.from(new Set(adapted_chunks));

    if (refined_chunks.length === 0) {
      throw "This job is a bad match.";
    }

    // Step 5: Invert and Join Chunks
    const inverted_chunks = await invert_chunks(refined_chunks, regex_list);
    summary = inverted_chunks.join(". ");
  } catch (error) {
    throw error;
  }

  return summary;
};
