import { adaptive_chunking } from "./local_modules/experimental/extract";
import { profile_career_chunk } from "./local_modules/experimental/profile_career";
import {
  analyze_chunk,
  initialize_analysis,
} from "./local_modules/experimental/chunk_analysis";
import { notify } from "./local_modules/notify";
import { profile_job } from "local_modules/profile_job";
import { split_text } from "local_modules/experimental/text_splitter";
import { invert_chunks } from "./local_modules/experimental/inversion";
import { log, debug } from "./local_modules/experimental/debug";
// Main function
async function main(): Promise<void> {
  // Define the legal name for the profile
  const legal_name = "Hugo_Gonzalez";

  // Notify that the program is ready
  notify("The Doctor is ready");
  console.time("mainExecution");

  try {
    // Step 1: Profile Job Data
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
    log(inverted_chunks, "inverted_chunks");
    log(job_profile, "job_profile");
    if (inverted_chunks.length == 0) {
      throw "Bad Match";
    }
    // Notify that all content is ready
    notify(`All content for ${legal_name} is ready.`);
  } catch (error) {
    // Handle errors
    console.error("Error logs:", error);
    notify(`The Doctor is ill`);
  }

  // End the timer for main execution
  console.timeEnd("mainExecution");
}

// Start the main execution
console.time("main");
main();
console.timeEnd("main");
