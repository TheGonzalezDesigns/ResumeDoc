import { query } from "./query";
import { extraction } from "./extract";

/**
 * Cleans up the provided cover letter content by removing common valedictions and placeholders.
 * @param {string} content - The cover letter content to be cleaned.
 * @returns {string} The cleaned-up cover letter content.
 */
const clean_up_content = (content: string): string => {
  const valedictions = [
    "Sincerely",
    "Yours Truly",
    "Kind Regards",
    "Best Regards",
    "Regards",
    "Thank you",
    "Thanks",
    "Yours Faithfully",
    "Yours Sincerely",
    "Warm Regards",
    "Appreciatively",
    "Best Wishes",
    "Respectfully",
    "Yours in Service",
    "Cheers",
  ];

  const escapedValedictions = valedictions.map((val) =>
    val.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
  );

  const cleanupPattern = new RegExp(
    `(${escapedValedictions.join("|")})\\s*\\[.*?\\][,.;!]*`,
    "gi"
  );

  let cleanedContent = content;
  let previousContent;
  do {
    previousContent = cleanedContent;
    cleanedContent = cleanedContent
      .replace(cleanupPattern, "")
      .replace(/\[.*?\]/g, "")
      .trim();
  } while (cleanedContent !== previousContent);

  return cleanedContent.replace(/[\s,.;]*$/, "");
};

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
  const technical_skills =
    job_profile.technical_skills?.join(", ") || "relevant technical skills";
  const responsibilities =
    job_profile.job_responsibilities || "the responsibilities";
  const non_technical_requirements =
    job_profile?.non_technical_requirements?.specific_industry_experience ||
    "industry-specific experiences";

  const promptSections = [
    `Craft a compelling, clear, and highly personalized cover letter using this profile of my career: ${career_summary}`,
    "\n\nStrive to:",
  ];

  const instructions = [
    `- Open with an exceptionally captivating paragraph. Mention a personal connection to ${company_name}'s mission or a brief anecdote for the ${job_title}.`,
    `- Mention how you learned about the ${job_title} position at ${company_name} and refer to a recent company milestone.`,
    `- Provide specific, measurable achievements for the ${job_title} at ${company_name}.`,
    `- Discuss experiences and projects showing understanding of ${non_technical_requirements} and soft skills.`,
    `- Emphasize unique contributions aligning with ${company_name}'s goals and the ${job_title}.`,
    `- Include a concrete example demonstrating problem-solving abilities.`,
    `- Integrate examples indicating a strong fit with ${company_name}.`,
    `- Conclude with a compelling statement expressing enthusiasm for the role at ${company_name}.`,
    `- Include a polite call to action.`,
    `- Keep language eloquent yet concise. Highlight proficiency in ${technical_skills}.`,
    `- Make no mention of any resume.`,
    `- Return the cover letter as a JSON object with the following structure: { "salutation": "salutation line", "content": "all of the cover letter", "valediction": "valediction line" }`,
  ];

  promptSections.push(...instructions);
  const cover_letter_prompt = promptSections.join("\n");

  let cover_letter_json_str = await query(cover_letter_prompt, 4);
  let cover_letter_json = { content: "" };

  while (true) {
    try {
      cover_letter_json = JSON.parse(cover_letter_json_str);
      break;
    } catch (_error) {
      cover_letter_json_str = await query(
        `Please fix the following JSON if it is invalid, only respond with the json and nothing else: ${cover_letter_json_str}`
      );
    }
  }

  const cover_letter_content: string = await query(
    `Remove any valedication or placeholders from this letter: ${cover_letter_json?.content}`
  );

  return clean_up_content(cover_letter_content) + ".";
};
