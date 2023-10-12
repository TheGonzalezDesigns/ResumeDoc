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
type FormType = typeof VALID_FORM_TYPES[number];

/**
 * Represents a question item in the form.
 *
 * @property {string} question - The text of the question.
 * @property {FormType} form_type - The type of input for the question.
 * @property {string} input_css_id - The CSS ID for the input element.
 */
type form_question = {
  question: string;
  form_type: FormType;
  input_css_id: string;
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

  while (retry_count < max_retries) {
    try {
      const response = await query(prompt);
      const parsed_response = JSON.parse(response);

      if (
        Array.isArray(parsed_response) &&
        parsed_response.every(is_form_question)
      ) {
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
