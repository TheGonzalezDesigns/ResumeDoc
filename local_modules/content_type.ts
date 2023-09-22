export enum content {
  professional_summary = 0,
  job_application_coverLetter = 1,
  technical_skill_list = 2,
  career_query = 3,
}

export const validate_content_type = (content_type: content): string => {
  switch (content_type) {
    case content.professional_summary:
      return "Professional Summary";
    case content.job_application_coverLetter:
      return "Job Application Cover Letter";
    case content.technical_skill_list:
      return "Technical Skill List";
    case content.career_query:
      return "Career query response";
    default:
      throw "No content_type selected.";
  }
};
