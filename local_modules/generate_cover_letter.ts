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

  const promptSections = [
    `Craft a compelling, clear, and highly personalized cover letter using this profile of my career: ${career_summary}`,
    "\n\nStrive to:",
  ];

  // Further improved prompt instructions
  const instructions = [
    `- Open with an exceptionally captivating paragraph that immediately grabs the reader's attention. Consider starting with a personal connection to ${company_name}'s mission or a brief anecdote that exemplifies your passion or suitability for the ${job_title}.`,
    `- Mention how you learned about the ${job_title} position at ${company_name} and if applicable, refer to a recent company milestone that excites you.`,
    `- Provide specific, measurable achievements, offering metrics or data to underscore the impact made in roles relevant to the ${job_title} at ${company_name}.`,
    `- Discuss experiences and projects that not only show understanding of ${non_technical_requirements} but also showcase soft skills like teamwork, leadership, and communication.`,
    `- Emphasize unique contributions, innovations, or methodologies that align with ${company_name}'s goals and the responsibilities of the ${job_title}.`,
    `- Include a concrete example that demonstrates your problem-solving abilities relevant to the ${job_title}.`,
    `- Integrate examples or anecdotes that indicate a strong cultural and philosophical fit with ${company_name}.`,
    `- Conclude with a compelling statement that expresses enthusiasm for the role at ${company_name} and details how your experience will contribute to the company's future.`,
    `- Include a polite call to action, indicating your eagerness to continue the conversation in an interview.`,
    `- Keep the language eloquent yet concise, avoiding unnecessary jargon. Highlight proficiency in ${technical_skills} and its relevance to ${company_name}.`,
    `- Return the cover letter as a JSON object with the following structure: { "salutation": "salutation line", "content": "all of the cover letter", "valediction": "valediction line, e.g. Sincerely, Yours Truly. Cheers, best regards, etc." }`,
  ];

  // Combine all sections for the final prompt
  promptSections.push(...instructions);
  const cover_letter_prompt = promptSections.join("\n");

  // Initialize variables for JSON parsing
  let cover_letter_json_str = await query(cover_letter_prompt, 4);
  let cover_letter_json = {};
  let flag = true;
  console.warn(cover_letter_json_str);
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
  console.error(cover_letter_json);
  return cover_letter_json.content;
};
