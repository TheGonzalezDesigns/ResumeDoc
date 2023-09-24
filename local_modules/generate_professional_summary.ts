import { query } from "./query";
import { extraction } from "./extract";

export const generate_professional_summary = async (
  job_profile: extraction,
  career_summary: string
): Promise<string> => {
  // Extract relevant details from the job and career profiles
  const job_title = job_profile.job_title;
  const technical_skills = job_profile.technical_skills.join(", ");
  const responsibilities = job_profile.job_responsibilities;
  const non_technical_requirements = job_profile.non_technical_requirements;

  // Craft the professional summary prompt dynamically
  const professional_summary_prompt = `
    Create a concise, relevant, and detailed professional summary, using this profile of my career: ${career_summary}

    Please ensure to include:
    - Specific experiences relevant to the role of a ${job_title}, focusing on ${technical_skills}.
    - Any experiences related to ${
      non_technical_requirements.specific_industry_experience ||
      "the specific industry"
    } if applicable.
    - Experiences in ${responsibilities} to validate the effectiveness of design ideas.
    - Mention of establishing and promoting design guidelines, best practices, and standards.
    - Any experience in designing marketing creative for various media including static and video advertisements.
    - A mention of expertise in ${technical_skills} and other relevant technical skills.
    - The professional summary should be specifically tailored to align with a role as a ${job_title}.

    Avoid including:
    - Unnecessary technical details or skills that are not relevant to a ${job_title} role, unless they significantly enhance the profile.
    - Overemphasis on roles or experiences that do not align with ${job_title}.

    Strive for:
    - Clarity and precision in mentioning experiences and skills.
    - Relevance to the job profile of a ${job_title}.
    - A smooth and eloquent flow in the summary.
`;
  return await query(professional_summary_prompt);
};
