import { profile_job } from "./local_modules/profile_job";
import { frame } from "./local_modules/frame";
import { notify } from "./local_modules/notify";
import { Document } from "local_modules/document";
import { refine_career_data } from "./local_modules/experimental/refinement";
import { meta_analysis } from "./local_modules/experimental/meta_analysis";
import { extract_career_chunks } from "./local_modules/analyze_career";

async function main(): Promise<void> {
  const legal_name = "Hugo_Gonzalez";
  notify("The Doctor is ready");
  console.time("mainExecution");

  try {
    const job_profile = await profile_job();

    // Step 1: Data Extraction & Refinement
    const raw_career_data = await extract_career_chunks(job_profile);
    console.info(raw_career_data);
    throw "bananas...";
    const refined_data = await refine_career_data(raw_career_data, job_profile);

    // Step 2: Analysis
    const analysis_result = metaAnalysis(
      refined_data,
      job_profile,
      raw_career_data
    );

    // Step 3: Content Framing
    // (Use the analysis_result as needed in your framing logic)
    const [professional_summary, cover_letter_content, skill_list] =
      await Promise.all([
        frame(legal_name, refined_data, job_profile, "resume query here"),
        frame(legal_name, refined_data, job_profile, "cover letter query here"),
        frame(legal_name, refined_data, job_profile, "skill list query here"),
      ]);

    // Step 4: Template Rendering
    const resume_template = new Document("./templates/resume.ejs");
    const cover_letter_template = new Document("./templates/cover_letter.ejs");

    // ... (rest of the template rendering logic remains the same)

    await Promise.all([
      resume.save(resume_content),
      cover_letter.save(cover_letter_full_content),
    ]);
    notify(`All content for ${content.fileName} is ready.`);
  } catch (error) {
    console.error("Error logs:", error);
    notify(`The Doctor is ill`);
  }

  console.timeEnd("mainExecution");
}

console.time("main");
main();
console.timeEnd("main");
