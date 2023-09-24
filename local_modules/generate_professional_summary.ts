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
    Create a concise, balanced, and highly relevant professional summary, using this profile of my career: ${career_summary}

    Please ensure to:
    - Include specific and quantifiable achievements, illustrating the impact and value brought to previous roles, relevant to a ${job_title}.
    - Detail experiences and skills with a high level of specificity and relevance to the role of a ${job_title}, focusing on ${technical_skills}.
    - Maintain a balanced and brief depiction of technical skills, soft skills, and achievements, avoiding unnecessary elongation and maintaining the reader’s interest.
    - Articulate clearly how past experiences and roles align with the requirements and objectives of the ${job_title} role at ${company_name} (if available), showcasing a deep understanding of the role and the company.
    - Customize the summary to reflect an understanding of and alignment with the company’s values, mission, and objectives, demonstrating a genuine interest and fit for the company and the role.
    
    The professional summary should maintain a smooth and eloquent flow, ensuring clarity, precision, and a high level of engagement for the reader.
`;
  console.error(job_profile);
  return await query(professional_summary_prompt);
};
