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

    Please ensure to include:
    - Achievements and experiences that are relevant to the role of a ${job_title}, with a focus on ${technical_skills}.
    - Specific instances where skills related to ${technical_skills} and ${responsibilities} were applied to achieve successful outcomes.
    - Mention of any recognition or awards received for accomplishments in the field of ${job_title}.
    - Any contributions to significant projects or initiatives, particularly those related to ${responsibilities}.

    Strive for:
    - Clarity and precision in mentioning skills and achievements.
    - Relevance to the skills and responsibilities of a ${job_title}.
    - A smooth and eloquent flow in each sentence.
`;
  return await query(skills_section_prompt);
};
