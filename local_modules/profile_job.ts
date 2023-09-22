import { extract, extraction } from "./extract";
import { query } from "./query";

/**
 * Extracts details from a job profile and ensures the output is in a valid JSON format.
 *
 * @returns {Promise<extraction>} The extracted details in JSON format.
 */
export const profile_job = async (): Promise<extraction> => {
  const filepath = "./context/jobs/profile.txt";

  // Read the job description from a file.
  const description = await Bun.file(filepath).text();

  const prompt = `
    ...
    ${description}
  `; // Prompt remains unchanged for brevity

  // Query the API to get the extraction data.
  let data = await query(prompt);

  let extraction_result: extraction = {};
  let is_valid_json = true;

  // Try parsing the JSON until it's valid.
  do {
    try {
      extraction_result = JSON.parse(data);
      is_valid_json = false;
    } catch (error) {
      data = await query(
        `Please fix the following JSON if it is invalid, only respond with the json and nothing else: ${data}`
      );
    }
  } while (is_valid_json);

  return extraction_result;
};

/**
 * Provides a sample extraction for a job profile.
 *
 * @returns {Promise<extraction>} The sample extracted details in JSON format.
 */
export const _profile_job = async (): Promise<extraction> => {
  const extraction_string = `
  {
    ...
  }
  `; // Original JSON data remains unchanged for brevity

  // Parse the JSON string to an object.
  const extraction_result = JSON.parse(extraction_string);

  return await extraction_result;
};
