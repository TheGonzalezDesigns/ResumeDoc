import { query } from "./query";
import { extraction } from "./extract";

export const generate_skill_list = async (
  job_profile: extraction,
  career_summary: string
): Promise<string> => {
  // Extract relevant details from the job and career profiles
  const job_title = job_profile.job_title;
  const technical_skills = job_profile.technical_skills.join(", ");

  // Craft the skills section prompt dynamically
  const skills_section_prompt = `
    Create ten sentences highlighting the skills and achievements, using this profile of my career: ${career_summary}

    Please ensure to:
    - Include specific, quantifiable achievements or impacts in each sentence to substantiate the claims.
    - Only mention skills, experiences, or technologies that have clear relevance to the role of a ${job_title}, focusing on ${technical_skills}.
    - Balance the mention of technical skills with the application of soft skills in achieving successful outcomes.
    - Tailor each sentence to closely align with the unique aspects and requirements of a ${job_title} role, focusing on the specific needs mentioned in the job profile.

    Strive for:
    - High specificity and quantification in mentioning skills and achievements.
    - Strict relevance to the skills and responsibilities of a ${job_title}.
    - A smooth and eloquent flow in each sentence, with a clear focus on applicability to the role.
`;
  return await query(skills_section_prompt);
};
