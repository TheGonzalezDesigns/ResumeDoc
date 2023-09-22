import { extraction } from "./extract";
import { query } from "./query";

/**
 * Asynchronously profiles a job by querying details about the job description.
 * The function focuses on extracting all possible details including technical skills, job title, company name, etc.
 *
 * @returns {Promise<extraction>} An object containing all extracted details from the job listing.
 * @throws {Error} Throws an error if the JSON data received is invalid.
 */
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
      // Attempt to parse the JSON data
      extraction = JSON.parse(data);
      flag = false;
    } catch (error) {
      // If JSON parsing fails, query for a corrected JSON
      data = await query(
        `Please fix the following JSON if it is invalid, only respond with the json and nothing else: ${data}`
      );
    }
  } while (flag);

  return extraction;
};

/**
 * A test function to provide a sample extraction.
 * This is for demonstration purposes and returns a hardcoded extraction object.
 *
 * @returns {Promise<extraction>} A hardcoded extraction object.
 */
export const _profile_job = async (): Promise<extraction> => {
  const extraction_string: string = `
{
  "job_title": "Back-End Rust Developer",
  "technical_skills": [
    "TypeScript",
    "Rust",
    "Node.js",
    "JavaScript",
    "RESTful",
    "WebSocket",
    "Git",
    "VSCode",
    "CI/CD",
    "Kubernetes",
    "AWS",
    "Web3",
    "GraphQL",
    "Go",
    "Python"
  ],
  "company_name": "BALANCED Media|Technology",
  "job_responsibilities": "The Back-End Rust Developer will be responsible for developing and maintaining a large Rust project. They will integrate with front-end developers to ensure the back-end meets requirements. The developer will also work on RESTful and WebSocket APIs, use development tools such as Git and VSCode, and have effective communication and teamwork skills. They should be a fast learner, proficient in code versioning tools and modern CI/CD pipelines, and have an understanding of server-side principles and networking protocols. The developer will collaborate closely with other developers, UX designers, product owners, and management to deliver scalable, efficient, and high-performing backend systems. Optional skills include experience with Kubernetes or other container orchestration systems, AWS or other cloud experience, Web3 technologies, GraphQL, and knowledge of other server-side languages like Go, Node.js, and Python.",
  "non_technical_requirements": "The candidate should have at least 2 years of experience and should be a proactive problem-solver with a proactive approach to challenges. They should possess effective communication and teamwork skills, be a fast learner, and have a positive attitude. The company encourages candidates who may not meet every single criterion to still apply. There are no specific educational qualifications mentioned.",
  "salary_range": "$80,000 - $95,000",
  "benefits": "Employee stock ownership plan, Paid time off, Profit sharing",
  "location": "Remote"
}
  `;
  // Parse the hardcoded extraction string into an object
  const extraction: extraction = JSON.parse(extraction_string);
  return extraction;
};
