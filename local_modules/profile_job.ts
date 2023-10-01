import { extraction } from "./extract";
import { query } from "./query";

/**
 * Profiles a job and extracts essential details based on the job description.
 *
 * @returns {Promise<extraction>} A promise that resolves to an extraction object containing detailed job profile information.
 * @throws {Error} Throws an error if the extraction fails.
 */
export const profile_job = async (
  description: string = ""
): Promise<extraction> => {
  const filepath = "./context/jobs/profile.txt";
  description =
    description.length > 1 ? description : await Bun.file(filepath).text();
  const prompt = `
    Given the job listing below, ensure a thorough and complete extraction of all details, especially focusing on capturing ALL technical skills, responsibilities, and non-technical requirements mentioned throughout the job description.

    Model the response after this schema:
    {
      job_title: "",
      technical_skills: [],
      non_technical_skills: [],
      company_name: "",
      job_responsibilities_summary: "",
      non_technical_requirements: {
        educational_qualifications: "",
        years_of_experience: "",
        specific_industry_experience: "",
      },
      salary_range: "",
      benefits: [],
      location: ""
    }

    1. Extract the exact job title.
    2. List EVERY technical skill mentioned, wherever it appears in the job description.
    3. List EVERY non technical skill mentioned, wherever it appears in the job description.
    4. Identify the exact company name.
    5. Provide a comprehensive summary of job responsibilities. Make sure no key aspect is omitted.
    6. Detail all non-technical requirements, including educational qualifications, years of experience, and any specific industry experiences.
    7. Specify the exact salary range.
    8. If 'benefits' are mentioned but aren't detailed, indicate 'benefits: not specified'. Otherwise, list them.
    9. Determine the job's location.

    Remember, accuracy and completeness are paramount. Ensure the output is in a valid JSON format without any errors or formatting issues.

    Job Listing:
    ${description}
  `;

  let data = await query(prompt);
  let extraction: extraction = {};

  while (true) {
    try {
      extraction = JSON.parse(data);
      break;
    } catch (error) {
      data = await query(
        `Please fix the following JSON if it is invalid, only respond with the json and nothing else: ${data}`
      );
    }
  }

  return extraction;
};
