import { refine_career_data } from "./local_modules/experimental/refinement";
import { adaptive_chunking } from "./local_modules/experimental/extract";
import { profile_career_chunk } from "./local_modules/experimental/profile_career";
import { analyze_chunk } from "./local_modules/experimental/chunk_analysis";
import { meta_analysis } from "./local_modules/experimental/meta_analysis";
import { analyze_career } from "./local_modules/experimental/analyze_career";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query";
import ejs from "ejs";
import { notify } from "./local_modules/notify";
import { Document } from "local_modules/document";
import { profile_job } from "local_modules/profile_job";
import { split_text } from "local_modules/experimental/text_splitter";

type bug = Record<string, any> | string | string[];

const debug = (data: bug) => {
  console.info("Debugging:", data);
  throw "\nDebugging...\n";
};

async function main(): Promise<void> {
  const legal_name = "Hugo_Gonzalez";
  notify("The Doctor is ready");
  console.time("mainExecution");

  try {
    const job_profile = await profile_job();
    // Step 1: Text Splitting and Initial Chunking
    const filepath = "./context/professional/profile.txt";
    const raw_career_data = await Bun.file(filepath).text();
    const initial_chunks = await split_text(raw_career_data);

    // Step 2: Adaptive Chunking and Refinement
    const refined_chunks = [];
    for (const chunk of initial_chunks) {
      const adapted_chunks = await adaptive_chunking(chunk, job_profile);
      debug(adapted_chunks);
      const refined_data = await refine_career_data(
        adapted_chunks,
        job_profile
      );
      refined_chunks.push(...refined_data);
    }

    debug(refined_chunks);
    // Step 3: Career Profile Creation
    const profile_chunks = [];
    for (const refined_chunk of refined_chunks) {
      const chunk_profile = await profile_career_chunk(refined_chunk);
      profile_chunks.push(chunk_profile);
    }

    // Step 4: Chunk Analysis and Scoring
    const scored_chunks = [];
    for (const profile_chunk of profile_chunks) {
      const score = await analyze_chunk(profile_chunk, job_profile);
      scored_chunks.push({
        chunk: profile_chunk,
        score: score,
      });
    }

    // Step 5: Meta Analysis
    const analysis_result = metaAnalysis(
      scored_chunks,
      job_profile,
      raw_career_data
    );

    // Step 6: Career Profile Aggregation
    const aggregated_career_profile = analyze_career(
      job_profile,
      scored_chunks
    );

    // Step 7: Final Structuring and Framing
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

    await Promise.all([
      resume.save(resume_content),
      cover_letter.save(cover_letter_content),
    ]);

    notify(`All content for ${legal_name} is ready.`);
  } catch (error) {
    console.error("Error logs:", error);
    notify(`The Doctor is ill`);
  }

  console.timeEnd("mainExecution");
}

console.time("main");
main();
console.timeEnd("main");
