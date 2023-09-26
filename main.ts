import ejs from "ejs";
import { Document } from "./local_modules/document";
import { profile_job } from "./local_modules/profile_job";
import { summarize_career } from "./local_modules/summarize_career";
import { generate_professional_summary } from "./local_modules/generate_professional_summary";
import { generate_cover_letter } from "./local_modules/generate_cover_letter";
import { generate_skill_list } from "./local_modules/generate_skill_list";
import { notify, err, success } from "./local_modules/notify";

interface GeneratedContent {
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
const main = async (): Promise<void> => {
  const legalName = "Hugo_Gonzalez";
  notify("The Doctor is ready");

  try {
    // Fetch job and career profiles
    const jobProfile = await profile_job();
    const companyName = jobProfile.company_name;
    const careerProfile = await summarize_career(jobProfile);

    success(`This job at ${jobProfile.company_name} is a good match!`);
    success("The Doctor is working on your prescription.");

    // Generate content: professional summary, skill list, and cover letter
    const [professionalSummary, skillList, coverLetterContent]: [
      string,
      string[],
      string
    ] = await Promise.all([
      generate_professional_summary(jobProfile, careerProfile),
      generate_skill_list(jobProfile, careerProfile),
      generate_cover_letter(jobProfile, careerProfile),
    ]);

    success("The pharmacy is ready with your prescription.");

    const fileName = companyName
      .replace(/,|\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/\.$/, "");

    // Verify if generated content is complete
    const content: GeneratedContent = {
      professional_summary: professionalSummary,
      skill_list: skillList,
      cover_letter_content: coverLetterContent,
      file_name: fileName,
    };

    if (content.skill_list.length < 5 || content.file_name === "") {
      throw Error("Incomplete Generation.");
    }

    // Generate final documents
    const resumeTemplate = new Document("./templates/resume.ejs");
    const resumeContent = ejs.render(resumeTemplate.load(), content);
    const coverLetterTemplate = new Document("./templates/cover_letter.ejs");
    const coverLetterFullContent = ejs.render(coverLetterTemplate.load(), {
      cover_letter_content: content.cover_letter_content,
      company_name: companyName,
    });

    const resume = new Document(
      `./src/html/resumes/${legalName}_Resume_${content.file_name}.html`
    );
    const coverLetter = new Document(
      `./src/html/cover_letters/${legalName}_cover_letter_${content.file_name}.html`
    );

    // Save the generated documents
    await Promise.all([
      resume.save(resumeContent),
      coverLetter.save(coverLetterFullContent),
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

main();
