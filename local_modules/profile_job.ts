import { extract, extraction } from "./extract";
import { query } from "./query";

export const profile_job = async (): Promise<extraction> => {
  const filepath = "./context/jobs/profile.txt";
  const description = await Bun.file(filepath).text();
  const prompt = `
    Please extract structured information from the given job post. Ensure you capture ALL relevant details. Follow the steps below:

    Step 1: Extract the job title.
    Step 2: List ALL technical skills mentioned.
    Step 3: Identify the company name.
    Step 4: Summarize the main job responsibilities.
    Step 5: Extract all non-technical requirements, including education and years of experience.
    Step 6: Capture the salary range.
    Step 7: Note any mentioned benefits. If 'benefits' are referenced but not detailed, indicate 'benefits: not specified'.
    Step 8: Identify the job location.

    The output should be in JSON format similar to this:
    {
      'job_title': 'Job Title Here',
      'technical_skills': ['Skill 1', 'Skill 2'],
      ...
    }

    Ensure thoroughness and accuracy in your extraction.
  `;
  const data = await query(prompt);

  const clean = await query(
    `Please fix the following JSON if it is invalid, only respond with the json and nothing else: ${data}`
  );
  const extraction = JSON.parse(clean);

  /*
  const extraction = await extract(
    [
      "job_title_string",
      "technical_skills_array",
      "company_name_string",
      "job_description_summary_string",
      "non_technical_requirements_array",
      "pay_array",
      "benefits_array",
      "location_string",
    ],
    description
  );
  */
  return extraction;
};
