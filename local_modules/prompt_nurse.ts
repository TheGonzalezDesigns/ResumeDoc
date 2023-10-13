import { query } from "./query";

// Define the array of valid form types
const VALID_FORM_TYPES = [
  "button",
  "checkbox",
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "image",
  "month",
  "number",
  "password",
  "radio",
  "range",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "time",
  "url",
  "week",
  "datalist",
  "output",
  "progress",
  "select",
  "textarea",
] as const;

// Derive the TypeScript type from the array
type form_type = typeof VALID_FORM_TYPES[number];

/**
 * Represents a question item in the form.
 *
 * @property {string} question - The text of the question.
 * @property {form_type} form_type - The type of input for the question.
 * @property {string} input_css_id - The CSS ID for the input element.
 */
export type form_question = {
  question: string;
  form_type: form_type;
  input_css_id: string;
};

export type form_answer = {
  question: string;
  answer: string;
};

/**
 * Validates if the object is of type form_question
 *
 * @param {any} object - The object to validate.
 * @returns {boolean} - True if the object is of type form_question, false otherwise.
 */
const is_form_question = (object: any): object is form_question => {
  return (
    typeof object.question === "string" &&
    VALID_FORM_TYPES.includes(object.form_type) &&
    typeof object.input_css_id === "string"
  );
};

/**
 * Extracts questions from an HTML snippet and returns them as an array of form_question objects.
 *
 * @param {string} html_snippet - The HTML snippet from which to extract questions.
 * @returns {Promise<form_question[]>} - A promise that resolves to an array of form_question objects.
 */
export const extract_questions = async (
  html_snippet: string
): Promise<form_question[]> => {
  let max_retries = 3;
  let retry_count = 0;

  const prompt = `Extract and identify each question from the provided HTML snippet.
  Return the details in the following format:
  {
    "question": "Question text here",
    "form_type": "Type of input (e.g., text, radio)",
    "input_css_id": "ID of the HTML element to input or select the response"
  }
  Aggregate all the JSON objects into an array.

  HTML_snippet: ${html_snippet}
  `;
  console.time("extract_questions");
  while (retry_count < max_retries) {
    try {
      const response = await query(prompt, 4);
      if (!response) throw "No Response";
      const parsed_response = JSON.parse(response);
      console.time("is_form_question");
      if (
        Array.isArray(parsed_response) &&
        parsed_response.every(is_form_question)
      ) {
        console.timeEnd("is_form_question");
        console.timeEnd("extract_questions");
        return parsed_response;
      }

      throw new Error("Response does not match the form_question type.");
    } catch (error) {
      retry_count++;
      console.warn(
        `Failed to parse or validate response. Retrying... (${retry_count}/${max_retries})`
      );
    }
  }

  throw new Error(
    "Maximum retry attempts reached. Failed to parse or validate the response."
  );
};

/**
 * form_answer the questions based on relevant data.
 *
 * @param {form_question[]} questions - Array of questions to be answered.
 * @param {string} relevant_data_prompt - Relevant data as a string.
 * @returns {Promise<form_answer[]>} - A promise that resolves to an array of answers.
 */
export const answer_questions = async (
  questions: form_question[],
  relevant_data_prompt: string
): Promise<form_answer[]> => {
  // Parse the relevant data
  const relevant_data_lines = relevant_data_prompt.split("\n  ");
  const relevant_data: { [key: string]: string } = {};
  for (const line of relevant_data_lines) {
    const [key, value] = line.split(": ");
    if (key && value) {
      relevant_data[key] = value;
    }
  }

  // Initialize an array to store the answers
  const answers: form_answer[] = [];

  // Loop through each question to generate an answer
  for (const question of questions) {
    let answer: string = "";

    // Logic to generate an answer based on the question and relevant data
    // This is just a placeholder; replace with your actual logic
    if (question.form_type === "text" && relevant_data["basic_info"]) {
      answer = relevant_data["basic_info"];
    }

    // Add the question and answer to the answers array
    answers.push({ question: question.question, answer });
  }

  return answers;
};
