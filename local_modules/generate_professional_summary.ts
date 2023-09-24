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
  const technical_skills = job_profile.technical_skills;

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
    - Detail specific, quantifiable achievements, using metrics or statistics where possible, demonstrating tangible impact made in previous roles relevant to a ${job_title} role at ${company_name}.
    - Emphasize distinctive contributions and innovations and elucidate how they are directly aligned with the responsibilities of ${responsibilities} and requirements of the ${job_title} role.
    - Discuss experiences and projects, focusing on those that showcase a profound understanding of ${non_technical_requirements}, and are highly pertinent to ${company_name}.
    - Delve into how the candidate’s philosophy or approach to design and work aligns with the culture and values of ${company_name}, providing specific insights or examples that showcase understanding and fit with the company’s mission and objectives.
    - Conclude with a compelling and personalized statement, expressing genuine enthusiasm and alignment with the role at ${company_name}, detailing the unique and significant contributions to be made.

    Ensure the summary is eloquent, engaging, succinct, and highly relevant, omitting any unnecessary details, redundancies, or technical jargon. Explicitly highlight the proficiency in ${technical_skills} and illustrate how these skills can be pivotal in fulfilling the aspirations of ${company_name}.
  `;
  return await query(professional_summary_prompt, 4);
};
