import { profile_job } from "./profile_job";
import { split_text } from "local_modules/text_splitter";
import { analyze_chunk, initialize_analysis } from "./chunk_analysis";
import { adaptive_chunking } from "./experimental/extract";
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
    log(refined_chunks, "adapted_chunks");
    // Step 4: Career Profile Creation
    const profile_chunks = await Promise.all(
      [...refined_chunks].map(async (refined_chunk) => {
        const chunk_profile = await profile_career_chunk(refined_chunk);
        return chunk_profile;
      })
    );
    // Step 5: Chunk Analysis and Scoring
    const scored_chunks = [...profile_chunks].map((profile_chunk) => {
      const analysis = analyze_chunk(
        profile_chunk.raw_data,
        regexList,
        threshold
      );
      return {
        chunk: profile_chunk.raw_data,
        score: analysis.score,
      };
    });
    //log(scored_chunks, "scored_chunks");
    //log(adapted_chunks, "adapted_chunks");
    const inverted_chunks = await invert_chunks(refined_chunks, regexList);
  } catch (Error) {
    throw Error;
  }
  return summary;
};
