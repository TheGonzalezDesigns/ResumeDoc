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
  const job_title = job_profile.job_title;
  const company_name = job_profile.company_name;
  const technical_skills = job_profile.technical_skills;
  const responsibilities = job_profile.job_responsibilities;
  const non_technical_requirements =
    job_profile.non_technical_requirements.specific_industry_experience ||
    "industry-specific experiences";

  const professional_summary_prompt = `
    Craft a concise, clear, and highly personalized professional summary using this profile of my career: ${career_summary}

    Strive to:
    - Detail specific, quantifiable achievements, using metrics or statistics where possible, demonstrating tangible impact made in previous roles relevant to a ${job_title} role at ${company_name}.
    - Emphasize distinctive contributions and innovations and elucidate how they are directly aligned with the responsibilities of ${responsibilities} and requirements of the ${job_title} role.
    - Discuss experiences and projects, focusing on those that showcase a profound understanding of ${non_technical_requirements}, and are highly pertinent to ${company_name}.
    - Delve into how the candidate’s philosophy or approach to design and work aligns with the culture and values of ${company_name}, providing specific insights or examples that showcase understanding and fit with the company’s mission and objectives.
    - Conclude with a compelling and personalized statement, expressing genuine enthusiasm and alignment with the role at ${company_name}, detailing the unique and significant contributions to be made.

    Ensure the summary is eloquent, engaging, succinct, and highly relevant, omitting any unnecessary details, redundancies, or technical jargon. Explicitly highlight the proficiency in ${technical_skills} and illustrate how these skills can be pivotal in fulfilling the aspirations of ${company_name}.
  `;

  return await query(professional_summary_prompt, 4);
};
