import { refine_career_data } from "./local_modules/experimental/refinement";
import { adaptive_chunking } from "./local_modules/experimental/extract";
import { profile_career_chunk } from "./local_modules/experimental/profile_career";
import {
  analyze_chunk,
  initialize_analysis,
} from "./local_modules/experimental/chunk_analysis";
import { meta_analysis } from "./local_modules/experimental/meta_analysis";
import { analyze_career } from "./local_modules/experimental/analyze_career";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query";
import ejs from "ejs";
import { notify } from "./local_modules/notify";
import { Document } from "local_modules/document";
import { profile_job } from "local_modules/profile_job";
import { split_text } from "local_modules/experimental/text_splitter";

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
    let adapted_chunks: string[] = (
      await Promise.all(
        [...initial_chunks].map(async (initial_chunk) => {
          let chunks = await adaptive_chunking(
            initial_chunk,
            regexList,
            threshold
          );
          return chunks;
        })
      )
    ).flat();

    // Remove duplicates from the adapted chunks
    adapted_chunks = Array.from(new Set(adapted_chunks));

    const refined_chunks = [];

    // Refine each adapted chunk and collect the results
    for (const adapted_chunk of adapted_chunks) {
      const refined_data = await refine_career_data(adapted_chunk, job_profile);
      refined_chunks.push(...refined_data);
    }

    // Step 4: Career Profile Creation
    const profile_chunks = [];

    // Create career profiles for refined chunks
    for (const refined_chunk of refined_chunks) {
      const chunk_profile = await profile_career_chunk(refined_chunk);
      profile_chunks.push(chunk_profile);
    }

    // Step 5: Chunk Analysis and Scoring
    const scored_chunks = [];

    // Analyze each profile chunk and calculate scores
    for (const profile_chunk of profile_chunks) {
      const score = await analyze_chunk(profile_chunk, job_profile);
      scored_chunks.push({
        chunk: profile_chunk,
        score: score,
      });
    }

    // Step 6: Meta Analysis
    const analysis_result = metaAnalysis(
      scored_chunks,
      job_profile,
      raw_career_data
    );

    // Step 7: Career Profile Aggregation
    const aggregated_career_profile = analyze_career(
      job_profile,
      scored_chunks
    );

    // Step 8: Final Structuring and Framing
    const resume_content = frame(
      aggregated_career_profile,
      job_profile,
      "resume"
    );
    const cover_letter_content = frame(
      aggregated_career_profile,
      job_profile,
      "cover_letter"
    );

    // Save the results
    const resume = new Document(`./src/html/resumes/${legal_name}_Resume.html`);
    const cover_letter = new Document(
      `./src/html/cover_letters/${legal_name}_cover_letter.html`
    );

    // Save the generated resume and cover letter content to HTML files
    await Promise.all([
      resume.save(resume_content),
      cover_letter.save(cover_letter_content),
    ]);

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
