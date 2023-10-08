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
  "Instructions: Given the HTML snippet of a job application form below, generate JavaScript code that will automatically fill in the form fields when run in the console of the original webpage. Each form field should be filled based on the provided personal, legal, and basic information. Use the function `setValue(selector, value)` to set the value of text fields and the function `simulateClick(selector)` to trigger a click event for non-text fields like radio buttons. When using the `setValue` and `simulateClick` functions, the `selector` argument should match the id attribute of the form field but with the '#' symbol. Inject your response into a JSON object, within the 'code' key, minified into one line. {\"code\": \"...\"}";
const system_prompt = `As an HTML query expert, your task is to analyze the HTML snippet below and generate code to automatically fill out the forms.`;

const methods = `
try {
const setValue = (selector, value) => {
    const inputElement = document.querySelector(selector);
    if (inputElement) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
        nativeInputValueSetter.call(inputElement, value);
        
        const inputEvent = new Event('input', { bubbles: true });
        inputElement.dispatchEvent(inputEvent);
        
        const changeEvent = new Event('change', { bubbles: true });
        inputElement.dispatchEvent(changeEvent);
    } else {
        console.error('Input element not found');
    }
};

const simulateClick = (selector) => {
    const element = document.querySelector(selector);
    if (element) {
        const clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        });
        element.dispatchEvent(clickEvent);
    } else {
        console.error('Element not found');
    }
};
`;

const script_tail = `
} catch(e) {
  console.error('Script Failed:', e)
}
`;

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
  let response = await query(prompt, 4);
  console.info("SUR-RES:", response);

  const extractCodeValue = (str: string) => {
    const regex = /"code"\s*:\s*"((?:[^"\\]|\\.)*)"/;
    const match = str.match(regex);
    return match ? match[1] : null;
  };

  while (true) {
    try {
      // Extract the script code using regex instead of JSON.parse
      const script = extractCodeValue(response);
      if (!script) throw new Error("Failed to extract code using regex.");

      console.info("PS-script:", script);
      return methods + "\n" + script + script_tail;
    } catch (err) {
      console.error("Failed to parse/extract res:", err);
      console.info("Fixing response.");
      response = await query(
        `Please return a fixed version of the following JSON: ${response}`
      );
      console.info("FR:", response);
    }
  }
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
