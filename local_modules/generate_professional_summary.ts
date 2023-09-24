import { query } from "./query";
import { extraction } from "./extract";

export const generate_professional_summary = async (
  job_profile: extraction,
  career_summary: string
): Promise<string> => {
  // Extract relevant details from the job and career profiles
  const job_title = job_profile.job_title;
  const company_name = job_profile.company_name;
  const technical_skills = job_profile.technical_skills.join(", ");
  const responsibilities = job_profile.job_responsibilities.join(", ");
  const non_technical_requirements =
    job_profile.non_technical_requirements.specific_industry_experience ||
    "industry-specific experiences";

  // Craft the professional summary prompt dynamically
  const professional_summary_prompt = `
    Craft a concise, clear, and highly personalized professional summary using this profile of my career: ${career_summary}

    Strive to:
    - Include specific and quantifiable achievements, demonstrating tangible impact made in previous roles, with examples relevant to a ${job_title} role at ${company_name}.
    - Emphasize unique contributions and innovations that are directly aligned with the responsibilities of ${responsibilities} and requirements of the ${job_title} role.
    - Detail experiences and projects that demonstrate a deep understanding of ${non_technical_requirements} and are highly relevant to ${company_name}, using clear and concise language.
    - Reflect on how the candidate’s approach, philosophy, or work ethic aligns with the culture and values of ${company_name}, providing specific insights or examples to showcase understanding and fit.
    - Conclude with a compelling and personalized statement, expressing genuine enthusiasm and alignment with the role at ${company_name}, and detailing the potential significant contribution to be made.

    Ensure the summary is eloquent, engaging, succinct, and highly relevant, avoiding any unnecessary details, redundancies, or jargon. Highlight the proficiency in ${technical_skills} and how it can be leveraged to meet the goals of ${company_name}.
`;
  console.error(job_profile);
  return await query(professional_summary_prompt, 4);
};
