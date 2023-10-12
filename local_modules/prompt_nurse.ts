import { query } from "./query";

/**
 * Represents a question item in the form.
 *
 * @property {string} question - The text of the question.
 * @property {"button" | "checkbox" | "color" | "date" | "datetime-local" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset" | "search" | "submit" | "tel" | "text" | "time" | "url" | "week" | "datalist" | "output" | "progress" | "select" | "textarea"} form_type - The type of input for the question.
 * @property {string} input_css_id - The CSS ID for the input element.
 */
type FormQuestion = {
  question: string;
  form_type:
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
    | "datalist"
    | "output"
    | "progress"
    | "select"
    | "textarea";
  input_css_id: string;
};

/**
 * Extracts questions from an HTML snippet and returns them as an array of FormQuestion objects.
 *
 * @param {string} html_snippet - The HTML snippet from which to extract questions.
 * @returns {Promise<FormQuestion[]>} - A promise that resolves to an array of FormQuestion objects.
 */
export const extract_questions = async (
  html_snippet: string
): Promise<FormQuestion[]> => {
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
      return JSON.parse(response) as FormQuestion[];
    } catch (error) {
      retry_count++;
      console.warn(
        `Failed to parse response. Retrying... (${retry_count}/${max_retries})`
      );
    }
  }

  throw new Error(
    "Maximum retry attempts reached. Failed to parse the response."
  );
};
