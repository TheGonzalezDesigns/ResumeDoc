import { query } from "./query";
import { extraction } from "./extract";

export const generate_professional_summary = async (
  job_profile: extraction,
  career_summary: string
): Promise<string> => {
  // Log the job_profile for debugging
  console.error(job_profile);

  // Extract relevant details from the job and career profiles
  const job_title = job_profile.job_title;
  const company_name = job_profile.company_name;
  const technical_skills = job_profile.technical_skills.join(", ");

  // Directly use job_responsibilities as it’s a string.
  const responsibilities = job_profile.job_responsibilities;

  // Directly use specific_industry_experience as it’s a string or fallback to a default string.
  const non_technical_requirements =
    job_profile.non_technical_requirements.specific_industry_experience ||
    "industry-specific experiences";

  // Craft the professional summary prompt dynamically
  const professional_summary_prompt = `
    Craft a concise, clear, and highly personalized professional summary using this profile of my career: ${career_summary}

    Strive to:
    - Include specific, quantifiable achievements and impact, with clear examples or case studies, particularly those that are most relevant to a ${job_title} role at ${company_name}.
    - Emphasize unique contributions, innovations, or approaches and explain how they are directly aligned with the responsibilities of ${responsibilities} and requirements of the ${job_title} role.
    - Detail experiences and projects that demonstrate a deep understanding of ${non_technical_requirements}, providing insights and examples that are highly relevant to ${company_name}.
    - Reflect on alignment with the culture and values of ${company_name}, providing insights or anecdotes that showcase a deep understanding and fit with the company’s mission and objectives.
    - Conclude with a compelling and personalized statement, expressing genuine enthusiasm and alignment with the role at ${company_name}, and detailing the specific contributions to be made.

    Ensure the summary is eloquent, engaging, succinct, and highly relevant, avoiding any unnecessary details, redundancies, or technical jargon. Explicitly highlight the proficiency in ${technical_skills} and how these skills can contribute to achieving the goals of ${company_name}.
  `;
  return await query(professional_summary_prompt, 4);
};
