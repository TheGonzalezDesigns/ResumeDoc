import { query } from "./query";
import { extraction } from "./extract";

/**
 * Generates a cover letter based on the given job profile and career summary.
 *
 * @param {extraction} job_profile - The job profile containing various details like job title, company name, etc.
 * @param {string} career_summary - The career summary of the individual.
 * @returns {Promise<string>} A promise that resolves to a generated cover letter.
 */
export const generate_cover_letter = async (
  job_profile: extraction,
  career_summary: string
): Promise<string> => {
  const job_title = job_profile.job_title || "the role";
  const company_name = job_profile.company_name || "the company";
  const technical_skills = job_profile.technical_skills
    ? job_profile.technical_skills.join(", ")
    : "relevant technical skills";
  const responsibilities =
    job_profile.job_responsibilities || "the responsibilities";
  const non_technical_requirements =
    job_profile?.non_technical_requirements?.specific_industry_experience ||
    "industry-specific experiences";

  const promptSections: string[] = [
    `Craft a compelling, clear, and highly personalized cover letter using this profile of my career: ${career_summary}`,
    "\n\nStrive to:",
  ];

  // Add all your requirements to the prompt
  promptSections.push(
    `- Start with a strong opening paragraph that captures the reader's attention and sets the tone for the rest of the letter. Mention the interest in the ${job_title} position at ${company_name}.`
  );
  promptSections.push(
    `- Include specific and quantifiable achievements, providing metrics or data to demonstrate the tangible impact made in roles relevant to a ${job_title} position at ${company_name}.`
  );
  promptSections.push(
    `- Discuss experiences and projects that demonstrate a deep understanding of ${non_technical_requirements}, offering insights that are directly relevant to ${company_name}.`
  );
  promptSections.push(
    `- Highlight unique contributions, innovations, or methodologies, explaining how they align with the responsibilities of ${responsibilities} and the ${job_title} role requirements at ${company_name}.`
  );
  promptSections.push(
    `- Reflect on the alignment of the candidate's approach or philosophy with the culture and values of ${company_name}, providing concrete examples or anecdotes that indicate a strong fit with the company’s goals and mission.`
  );
  promptSections.push(
    `- Conclude with a compelling, personalized statement, expressing enthusiasm for the role at ${company_name}. In particular, detail how the candidate's ${non_technical_requirements} experience will contribute to shaping the future of the organization and align with its objectives.`
  );
  promptSections.push(
    `- Ensure the cover letter is eloquent, engaging, succinct, and highly relevant. Avoid unnecessary details, redundancies, or technical jargon. Clearly highlight proficiency in ${technical_skills} and how these skills can contribute to ${company_name}'s objectives.`
  );
  promptSections.push(
    `\n\nReturn the cover letter as a JSON object with the following structure: { "opening": "opening lines", "content": "main body of the cover letter", "closing": "closing lines" }`
  );

  const cover_letter_prompt: string = promptSections.join("\n");

  // Query to generate the JSON object
  let cover_letter_json_str: string = await query(cover_letter_prompt, 4);

  // Parse the returned JSON string
  let cover_letter_json: any = {};
  let flag: boolean = true;
  do {
    try {
      cover_letter_json = JSON.parse(cover_letter_json_str);
      flag = false;
    } catch (error) {
      cover_letter_json_str = await query(
        `Please fix the following JSON if it is invalid, only respond with the json and nothing else: ${cover_letter_json_str}`
      );
    }
  } while (flag);

  // Extract and return just the 'content' from the JSON object
  return cover_letter_json.content;
};
