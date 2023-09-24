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
    - Specific and quantifiable achievements or impacts relevant to the role of a ${job_title}, focusing on ${technical_skills}.
    - Experiences and achievements related to ${
      non_technical_requirements.specific_industry_experience ||
      "the specific industry"
    } that highlight the understanding and fulfillment of unique requirements and brand identities, if applicable.
    - Experiences in ${responsibilities} that demonstrate the ability to validate and optimize design ideas effectively.
    - Mention of establishing and promoting design guidelines, best practices, and standards, illustrating the commitment to quality and consistency in design.
    - A detailed showcase of experiences in designing marketing creative for various media, emphasizing the ability to create visually appealing and engaging materials.
    - A balanced mention of expertise in ${technical_skills} and other relevant technical skills, along with soft skills, showcasing versatility and comprehensive capability.
    
    The professional summary should:
    - Be tailored specifically to align with a role as a ${job_title}.
    - Clearly articulate the value and impact brought to previous roles.
    - Have a smooth and eloquent flow, maintaining clarity and precision.
    - Strictly maintain relevance to the job profile of a ${job_title}, avoiding overemphasis on unrelated roles or technical details.
`;
  return await query(professional_summary_prompt);
};
