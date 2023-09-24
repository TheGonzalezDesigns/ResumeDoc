import { query } from "./query";
import { extraction } from "./extract";

export const generate_skill_list = async (
  job_profile: extraction,
  career_summary: string
): Promise<string> => {
  // Extract relevant details from the job and career profiles
  const job_title = job_profile.job_title;
  const technical_skills = job_profile.technical_skills.join(", ");
  const responsibilities = job_profile.job_responsibilities;
  const non_technical_requirements = job_profile.non_technical_requirements;

  // Craft the skills section prompt dynamically
  const skills_section_prompt = `
    Create ten sentences highlighting the skills and achievements, using this profile of my career: ${career_summary}

    Please ensure to:
    - Include specific examples, quantifiable achievements, or impacts in each sentence to substantiate the claims.
    - Only mention skills, experiences, or technologies that are directly relevant to the role of a ${job_title}, focusing on ${technical_skills}.
    - Keep each sentence concise, clear, and to the point, avoiding unnecessary jargon or verbosity.
    - Ensure each sentence is tailored to align with the specific requirements and responsibilities of a ${job_title}.

    Strive for:
    - Clarity and precision in mentioning skills and achievements.
    - Relevance to the skills and responsibilities of a ${job_title}.
    - A smooth and eloquent flow in each sentence.
`;
  return await query(skills_section_prompt);
};
