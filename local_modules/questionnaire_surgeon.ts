import { query } from "./query";
import { HTML_assistant, HTML_Type } from "./HTML_assistant";

export type Script = string | string[];

/**
 * Retrieve basic and legal information from a JSON file.
 */
const { basic_info, legal_info } = await Bun.file(
  "./context/personal/profile.json"
).json();
const basic_data = JSON.stringify(basic_info);
const legal_data = JSON.stringify(legal_info);

const instructions =
  "Instructions: Given the HTML snippet of a job application form below, generate JavaScript code that will automatically fill in the form fields when run in the console of the original webpage. Each form field should be filled based on the provided personal, legal, and basic information. Use the function `setValue(selector, value)` to set the value of text fields and the function `simulateClick(selector)` to trigger a click event for non-text fields like radio buttons. The generated code should be formatted such that each `setValue` or `simulateClick` function call corresponds to a single form field, with the selector argument matching the id attribute of the form field, and the value argument matching the respective piece of provided information. Compile all the function calls into a string, and place this string into a JSON object with the key 'code'. Return only this JSON object.";
const system_prompt = `As an HTML query expert, your task is to analyze the HTML snippet below and generate code to automatically fill out the forms.`;

/**
 * Main function to process HTML snippet and generate JavaScript code to interact with it.
 * @param {string} HTML_snippet - HTML content as a string.
 * @param {string} personal_summary - Personal summary of the user.
 * @returns {Promise<Script>} - JavaScript code as a string or array of strings.
 */
export const questionnaire_surgeon = async (
  HTML_snippet: string,
  personal_summary: string
): Promise<Script> => {
  const { types } = HTML_assistant(HTML_snippet);
  console.info("Types:", types);
  const generated_data = types.includes(HTML_Type.Generated)
    ? `Date Available: ${get_upcoming_monday()}`
    : "";

  const relevant_data_prompt = get_relevant_data_prompt(
    types,
    basic_data,
    legal_data,
    personal_summary,
    generated_data
  );
  console.info("relevant_data_prompt:", relevant_data_prompt);
  const prompt = `
  System: ${system_prompt}
  ${relevant_data_prompt}
  Instructions: ${instructions}
  HTML_snippet: ${HTML_snippet}
  `;
  console.info("Prompt:", prompt);
  const response = await query(prompt, 4);

  const { code: script } = JSON.parse(response);

  return script;
};

/**
 * Generate a prompt string based on the HTML types present.
 * @param {HTML_Type[]} types - Types of HTML elements.
 * @param {string} basic_data - Basic information as JSON string.
 * @param {string} legal_data - Legal information as JSON string.
 * @param {string} generated_data - Generated data like upcoming Monday date.
 * @returns {string} - Assembled prompt string.
 */
const get_relevant_data_prompt = (
  types: HTML_Type[],
  basic_data: string,
  legal_data: string,
  personal_data: string,
  generated_data: string
): string => {
  const relevant_prompt_data: string[] = [];

  if (types.includes(HTML_Type.Basic)) {
    relevant_prompt_data.push(`basic_info: ${basic_data}`);
  }
  if (types.includes(HTML_Type.Legal)) {
    relevant_prompt_data.push(`legal_info: ${legal_data}`);
  }
  if (types.includes(HTML_Type.Personal)) {
    relevant_prompt_data.push(`personal_info: ${personal_data}`);
  }
  if (types.includes(HTML_Type.Generated)) {
    relevant_prompt_data.push(`generated_info: ${generated_data}`);
  }

  return relevant_prompt_data.join("\n  ");
};

/**
 * Calculate the upcoming Monday date.
 * @returns {string} - The upcoming Monday date in MM/DD/YYYY format.
 */
const get_upcoming_monday = (): string => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysUntilMonday = (7 - dayOfWeek) % 7;
  const upcomingMonday = new Date(
    today.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000
  );
  const month = upcomingMonday.getMonth() + 1;
  const day = upcomingMonday.getDate();
  const year = upcomingMonday.getFullYear();

  return `${month}/${day}/${year}`;
};
