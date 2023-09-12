import { extract, extraction } from "./extract";

export const profile_job = async (): Promise<extraction> => {
  const filepath = "./context/jobs/profile.txt";
  const description = await Bun.file(filepath).text();
  const extraction = await extract(
    [
      "job_title_string",
      "technical_skills_array",
      "company_name_string",
      "job_description_summary_string",
      "non_technical_requirements_array",
      "pay_array",
      "benefits_array",
      "location_string",
    ],
    description
  );
  return extraction;
};
