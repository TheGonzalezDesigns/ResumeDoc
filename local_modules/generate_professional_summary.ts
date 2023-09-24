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
    - Include specific and quantifiable achievements, using examples or case studies, demonstrating tangible impact made in previous roles, particularly those relevant to a ${job_title} role at ${company_name}.
    - Highlight unique contributions, innovations, or approaches, ensuring they are directly aligned with the responsibilities and requirements of the ${job_title} role.
    - Detail experiences and projects that are highly relevant to ${company_name}, using clear, concise, and straightforward language.
    - Reflect on how the candidate’s approach, philosophy, or work ethic aligns with the culture and values of ${company_name}, providing insights to showcase understanding and fit.
    - Conclude with a compelling and personalized statement, expressing genuine enthusiasm, alignment with the role at ${company_name}, and the potential significant contribution to be made.

    Ensure the summary is eloquent, engaging, succinct, and highly relevant, avoiding any unnecessary details, redundancies, or jargon.
`;
  console.error(job_profile);
  return await query(professional_summary_prompt, 4);
};
