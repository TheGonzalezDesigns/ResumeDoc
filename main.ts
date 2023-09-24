import ejs from "ejs";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query";
import { Document } from "./local_modules/document";
import { get_array } from "./local_modules/reform_data";
import { profile_job } from "./local_modules/profile_job";
import { summarize_career } from "./local_modules/summarize_career";
import { generate_professional_summary } from "./local_modules/generate_professional_summary";
import {
  validate_content_type as cType,
  content,
} from "./local_modules/content_type";
import { notify, err, success } from "./local_modules/notify";

interface Generated_content {
  professional_summary: string;
  skill_list: string[];
  cover_letter_content: string;
  fileName: string;
}

/**
 * Constructs a prompt stack for generating content.
 * @param {string} job_title - The title of the job.
 * @param {string} content_type - The type of content to be generated.
 * @param {string} fine_tuned - Fine-tuned specific instructions.
 * @returns {string} - The constructed prompt stack.
 */
const stack = (
  job_title: string,
  content_type: string,
  fine_tuned: string
): string => {
  const base = `Base-Prompt: "Craft a ${job_title} ${content_type} for the Job Listing Based on Your Expertise."`;
  const instructions = fine_tuned.length
    ? `Specific-Instructions: ${fine_tuned}`
    : "";
  return `${base} ${instructions}`;
};

const yell = (call: string) => {
  console.error(
    "--------------------------------------------------------------------------------------------------------------------------------"
  );
  console.error(call);
  throw "Testing...";
};

/**
 * Main function to generate a resume, cover letter, and skill list based on job and career profiles.
 * @returns {Promise<void>}
 */
const main = async (): Promise<void> => {
  const legal_name = "Hugo_Gonzalez";
  notify("The Doctor is ready");

  try {
    // Fetch job and career profiles
    const job_profile = await profile_job();
    //console.error(job_profile);
    const career_profile = await summarize_career(job_profile);

    const professional_summary = await generate_professional_summary(
      job_profile,
      career_profile
    );

    yell(professional_summary);
    const reframe = (content_type: content, prompt: string = "") =>
      frame(
        legal_name,
        career_profile,
        job_profile,
        stack(job_title, cType(content_type), prompt),
        cType(content_type)
      );
    /*
    // Generate resume content
    const [professional_summary, cover_letter_content, skill_list] =
      await Promise.all([
        query(reframe(0)),
        query(
          reframe(
            1,
            "Submit the main content of the letter only, excluding salutations or closings. Limit to 250 words, emphasizing suitability for the specified role"
          )
        ),
        query(
          reframe(
            2,
            "Provide an array of 10 or more skills relevant to the job. Each skill should clearly demonstrate your expertise. Format as a JavaScript array."
          )
        ),
      ]);

    const extracted_skill_list = await get_array(skill_list);
    const content: Generated_content = {
      professional_summary,
      skill_list: extracted_skill_list,
      cover_letter_content,
      fileName: job_profile.company_name,
    };

    if (content.skill_list.length < 5 || content.fileName === "") {
      throw Error("Incomplete Generation.");
    }

    // Generate final documents
    const resume_template = new Document("./templates/resume.ejs");
    const resume_content = ejs.render(resume_template.load(), content);
    const cover_letter_template = new Document("./templates/cover_letter.ejs");
    const cover_letter_full_content = ejs.render(cover_letter_template.load(), {
      cover_letter_content: content.cover_letter_content,
    });

    const resume = new Document(
      `./src/html/resumes/${legal_name}_Resume_${content.fileName}.html`
    );
    const cover_letter = new Document(
      `./src/html/cover_letters/${legal_name}_cover_letter_${content.fileName}.html`
    );
    await Promise.all([
      resume.save(resume_content),
      cover_letter.save(cover_letter_full_content),
    ]);
    success(`All content for ${content.fileName} is ready.`);
*/
  } catch (error) {
    err("The Doctor is ill");
    if (typeof error === "string") err(error);
    else console.error(error);
  }
};

main();
