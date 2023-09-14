import { profile_job } from "./local_modules/profile_job";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query";
import { validate_content_type as cType } from "./local_modules/content_type";
import ejs from "ejs";
import { notify } from "./local_modules/notify";
import { extract_career_chunks } from "./local_modules/analyze_career";

async function main(): Promise<void> {
  const legal_name = "Hugo_Gonzalez";
  notify("The Doctor is ready");
  console.time("mainExecution");

  try {
    const job_profile = await profile_job();
    const career_profile = await extract_career_chunks(job_profile);
    console.info(career_profile);
    let content_type = cType(0);

    let frame_query = `Generate a ${content_type} for the job listing based on the professional background that makes me look a senior engineer in the field.`;

    const resume_prompt = await frame(
      legal_name,
      career_profile,
      job_profile,
      frame_query
    );

    content_type = cType(1);

    frame_query = `Generate a ${content_type} for the job listing based on the professional background that makes me look a senior engineer in the field. Only provide the body of the letter, do not add a greeting nor closing. Keep it under 250 words while staying hyper-focused on making it seem like I'm the perfect candidate for the position given.`;

    const cover_letter_prompt = await frame(
      legal_name,
      career_profile,
      job_profile,
      frame_query
    );

    content_type = cType(2);

    frame_query = `Generate a ${content_type} for the job listing based on the professional background that makes me look a senior engineer in the field. Please format your response as an array of at least 10 skills. Each skill listed should be verbose and related to the job listing. Each skill should be impressive and prove I am a competent expert in the relevant field. Make sure the list is a javascript array`;

    const skill_list_prompt = await frame(
      legal_name,
      career_profile,
      job_profile,
      frame_query
    );

    const [professional_summary, cover_letter_content, skill_list] =
      await Promise.all([
        query(resume_prompt),
        query(cover_letter_prompt),
        query(skill_list_prompt),
      ]);

    interface Generated_content {
      professional_summary: string;
      skill_list: string[];
      cover_letter_content: string;
      fileName: string;
    }
    const removeQuotes = (str: string) => str.replace(/['"]+/g, "");

    const extractJSONArray = (str: string): string[] => {
      const regex = /^\[(.*)\]$/s;
      const matches = str.trim().match(regex);

      return matches ? JSON.parse(`[${matches[1]}]`) : [];
    };

    const extracted_skill_list = extractJSONArray(skill_list);

    const content: Generated_content = {
      professional_summary,
      skill_list: extracted_skill_list,
      cover_letter_content,
      fileName: job_profile.company_name_string,
    } as const;

    if (content.skill_list.length < 5 || content.fileName == "") {
      console.error("Malformed content:", content);
      throw Error("Incomplete Generation.");
    }

    // Populate the templates
    const resume_content = ejs.render("./templates/resume.ejs", {
      professional_summary: content.professional_summary,
      skill_list: content.skill_list,
    });

    const cover_letter_full_content = ejs.render(
      "./templates/cover_letter.ejs",
      {
        cover_letter_content: content.cover_letter_content,
      }
    );

    const resume = `./src/html/resumes/${legal_name}_Resume_${content.fileName}.html`;

    const cover_letter = `./src/html/cover_letters/${legal_name}__cover-_letter_${content.fileName}.html`;

    await Bun.write(resume, resume_content);
    await Bun.write(cover_letter, cover_letter_full_content);
    notify(`All content for ${content.fileName} is ready.`);
  } catch (error) {
    console.error("Error logs:", error);
    notify(`The Doctor is ill`);
  }

  console.timeEnd("mainExecution");
}
main();
