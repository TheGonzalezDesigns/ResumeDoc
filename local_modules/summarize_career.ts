import { profile_job } from "./profile_job";
import { split_text } from "local_modules/text_splitter";
import { initialize_analysis } from "./chunk_analysis";
import { adaptive_chunking } from "./extract";
import { invert_chunks } from "./inversion";
export const summarize_career = async (): Promise<string> => {
  let summary = "";
  try {
    const job_profile = await profile_job();

    // Step 2: Text Splitting and Initial Chunking
    const filepath = "./context/professional/profile.txt";
    const raw_career_data = await Bun.file(filepath).text();
    const initial_chunks = await split_text(raw_career_data);

    // Initialize analysis with regex list and threshold
    const { regexList, threshold } = initialize_analysis(job_profile);

    // Step 3: Adaptive Chunking and Refinement
    const adapted_chunks: string[] = (
      await Promise.all(
        [...initial_chunks].map((initial_chunk) =>
          adaptive_chunking(initial_chunk, regexList, threshold)
        )
      )
    ).flat();

    // Remove duplicates from the adapted chunks
    const refined_chunks = Array.from(new Set(adapted_chunks));
    const inverted_chunks = await invert_chunks(refined_chunks, regexList);
  } catch (Error) {
    throw Error;
  }
  return summary;
};
