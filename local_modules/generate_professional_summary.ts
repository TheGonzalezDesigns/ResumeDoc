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
    `Construct a succinct and impactful professional summary utilizing this career profile: ${career_summary}`,
    "\n\nPrioritize:",
  ];

  promptSections.push(
    `- Incorporating specific, quantifiable achievements, providing impactful metrics or data that substantiate the tangible contributions made in roles pertinent to a ${job_title} at ${company_name}.`
  );
  promptSections.push(
    `- Highlighting distinctive contributions, innovations, or methodologies and elucidating how they align with the responsibilities of ${responsibilities} and the requirements of the ${job_title}.`
  );
  promptSections.push(
    `- Detailing experiences and projects that manifest a profound understanding of ${non_technical_requirements}, offering insights and examples that are unequivocally relevant to ${company_name}.`
  );
  promptSections.push(
    `- Manifesting alignment with the ethos and culture of ${company_name}, furnishing concrete examples or anecdotes that demonstrate a robust fit with the company's objectives and mission.`
  );
  promptSections.push(
    `- Concluding with a persuasive statement, articulating enthusiasm for the role at ${company_name} and delineating how the proficiency in ${non_technical_requirements} will be instrumental in shaping the organization's future.`
  );
  promptSections.push(
    `\n\nEnsure the summary is engaging, eloquent, succinct, and pertinent. Avoid creating content in a letter format; refrain from using greetings, valedictions, and avoid unnecessary jargon or extraneous details. Explicitly illuminate proficiency in ${technical_skills} and elucidate its consequential relevance to achieving ${company_name}'s aspirations.`
  );

  const professional_summary_prompt = promptSections.join("\n");

  return await query(professional_summary_prompt, 4);
};
