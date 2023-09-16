import { extract, extraction } from "./extract";
import { query } from "./query";

export const profile_job = async (): Promise<extraction> => {
  const filepath = "./context/jobs/profile.txt";
  const description = await Bun.file(filepath).text();
  const prompt = `
    Given the job listing below, ensure a thorough and complete extraction of all details. Especially focus on capturing ALL technical skills mentioned throughout the job description.

    1. Extract the exact job title.
    2. List EVERY technical skill mentioned, wherever it appears in the job description.
    3. Identify the exact company name.
    4. Provide a comprehensive summary of job responsibilities. Make sure no key aspect is omitted.
    5. Detail all non-technical requirements, including educational qualifications, years of experience, and any specific industry experiences.
    6. Specify the exact salary range.
    7. If 'benefits' are mentioned but aren't detailed, indicate 'benefits: not specified'. Otherwise, list them.
    8. Determine the job's location.

    Remember, accuracy, and completeness are paramount. Ensure the output is in a valid JSON format without any errors or formatting issues. If the JSON format is invalid, correct it before responding.

    Job Listing:
    ${description}
  `;
  let data = await query(prompt);

  let extraction: extraction = {};
  let flag = true;

  do {
    try {
      extraction = JSON.parse(data);
      flag = false;
    } catch (error) {
      data = await query(
        `Please fix the following JSON if it is invalid, only respond with the json and nothing else: ${data}`
      );
    }
  } while (flag);

  return extraction;
};
