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
  const responsibilities = job_profile.job_responsibilities;
  const non_technical_requirements = job_profile.non_technical_requirements;

  // Craft the professional summary prompt dynamically
  const professional_summary_prompt = `
    Craft a concise, clear, and highly personalized professional summary using this profile of my career: ${career_summary}

    Strive to:
    - Include specific and quantifiable achievements demonstrating tangible impact made in previous roles, particularly those relevant to a ${job_title} role at ${company_name}.
    - Highlight unique contributions, innovations, or approaches that set the candidate apart.
    - Detail specific experiences, projects, or technologies that align directly with the responsibilities and requirements of the ${job_title} role.
    - Express a genuine and deep alignment with ${company_name}’s values, mission, and objectives, providing specific examples or insights to showcase understanding and fit.
    - Conclude with a compelling and personalized statement expressing enthusiasm and alignment with the role at ${company_name}, and the potential contribution to be made.

    Ensure the summary is eloquent, engaging, succinct, and highly relevant, avoiding unnecessary details or redundancies.
`;
  console.error(job_profile);
  return await query(professional_summary_prompt);
};
