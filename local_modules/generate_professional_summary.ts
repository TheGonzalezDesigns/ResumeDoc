import { query } from "./query";
import { extraction } from "./extract";

/**
 * Generates a professional summary based on the given job profile and career summary.
 *
 * @param {extraction} job_profile - The job profile containing various details like job title, company name, etc.
 * @param {string} career_summary - The career summary of the individual.
 * @returns {Promise<string>} A promise that resolves to a generated professional summary.
 */
export const generate_professional_summary = async (
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

  let promptSections = [
    `Create a concise and compelling professional summary using this career profile: ${career_summary}`,
    "\n\nFocus on:",
  ];

  promptSections.push(
    `- Providing specific, measurable achievements and metrics demonstrating the impact made in roles relevant to a ${job_title} at ${company_name}.`
  );
  promptSections.push(
    `- Emphasizing unique contributions and innovations that align with the role of ${responsibilities} and showing how they meet the requirements of the ${job_title}.`
  );
  promptSections.push(
    `- Illustrating experiences and projects that reveal a deep understanding of ${non_technical_requirements} and that are directly relevant to ${company_name}.`
  );
  promptSections.push(
    `- Reflecting alignment with the values and culture of ${company_name}, with examples or anecdotes indicating a strong fit with the company's mission and goals.`
  );
  promptSections.push(
    `- Concluding with a compelling statement expressing enthusiasm for the role at ${company_name} and detailing how the experience in ${non_technical_requirements} will contribute to the company's future.`
  );
  promptSections.push(
    `\n\nMake sure the summary is engaging, succinct, clear, and highly relevant. Avoid letter format, greetings, valedictions, and unnecessary details or jargon. Highlight proficiency in ${technical_skills} and its relevance to ${company_name}'s goals.`
  );

  const professional_summary_prompt = promptSections.join("\n");

  return await query(professional_summary_prompt, 4);
};
