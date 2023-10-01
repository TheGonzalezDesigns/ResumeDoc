import ejs from "ejs";
import { Document } from "./local_modules/document";
import { profile_job } from "./local_modules/profile_job";
import { summarize_career } from "./local_modules/summarize_career";
import { generate_professional_summary } from "./local_modules/generate_professional_summary";
import { generate_cover_letter } from "./local_modules/generate_cover_letter";
import { generate_skill_list } from "./local_modules/generate_skill_list";
import { notify, err, success } from "./local_modules/notify";

interface Generated_content {
  professional_summary: string;
  skill_list: string[];
  cover_letter_content: string;
  file_name: string;
}

/**
 * Main function to generate a resume, cover letter, and skill list based on job and career profiles.
 *
 * @returns {Promise<void>} Resolves when all tasks are completed.
 */
export const generate_documents = async (
  description?: string
): Promise<void> => {
  const legal_name = "Hugo_Gonzalez";
  notify("The Doctor is ready");

  try {
    // Fetch job and career profiles
    const job_profile = await profile_job(!!description ? description : "");
    const company_name = job_profile.company_name;
    const career_profile = await summarize_career(job_profile);

    success(`This job at ${job_profile.company_name} is a good match!`);
    success("The Doctor is working on your prescription.");

    // Generate content: professional summary, skill list, and cover letter
    const [professional_summary, skill_list, cover_letter_content]: [
      string,
      string[],
      string
    ] = await Promise.all([
      generate_professional_summary(job_profile, career_profile),
      generate_skill_list(job_profile, career_profile),
      generate_cover_letter(job_profile, career_profile),
    ]);

    success("The pharmacy is ready with your prescription.");

    const file_name = company_name
      .replace(/,|\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/\.$/, "");

    // Verify if generated content is complete
    const content: Generated_content = {
      professional_summary: professional_summary,
      skill_list: skill_list,
      cover_letter_content: cover_letter_content,
      file_name: file_name,
    };

    if (content.skill_list.length < 5 || content.file_name === "") {
      throw Error("Incomplete Generation.");
    }

    // Generate final documents
    const resumeTemplate = new Document("./templates/resume.ejs");
    const resume_content = ejs.render(resumeTemplate.load(), content);
    const cover_letterTemplate = new Document("./templates/cover_letter.ejs");
    const cover_letter_full_content = ejs.render(cover_letterTemplate.load(), {
      cover_letter_content: content.cover_letter_content,
      company_name: company_name,
    });

    const resume = new Document(
      `./src/html/resumes/${legal_name}_Resume_${content.file_name}.html`
    );
    const cover_letter = new Document(
      `./src/html/cover_letters/${legal_name}_cover_letter_${content.file_name}.html`
    );

    // Save the generated documents
    await Promise.all([
      resume.save(resume_content),
      cover_letter.save(cover_letter_full_content),
    ]);

    success(`All content for ${content.file_name} is ready.`);
  } catch (error) {
    if (typeof error === "string") err(error);
    else {
      err("The Doctor is ill");
      console.error(error);
    }
  }
};
