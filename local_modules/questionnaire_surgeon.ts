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

const instructions = `Instructions: Given the HTML snippet of a job application form below, generate JavaScript code that will automatically fill in the form fields when run in the console of the original webpage. Each form field should be filled based on the provided personal, legal, and basic information. Ensure that no text fields are left empty; if the information for a particular field is not provided, use a generic placeholder value. Use the function \`setValue(selector, value)\` to set the value of text fields and the function \`simulateClick(selector)\` to trigger a click event for non-text fields like radio buttons. For select fields, use the function \`setSelectValueByText(selector, text)\` to select an option based on its text, where \`text\` is the text of the option to be selected. When using the \`setValue\`, \`setSelectValueByText\`, and \`simulateClick\` functions, the \`selector\` argument should match the id attribute of the form field but with the '#' symbol. Inject your response into a JSON object, within the 'code' key, minified into one line. {"code": "..."}`;
const system_prompt = `As an HTML query expert, your task is to analyze the HTML snippet below and generate code to automatically fill out the forms.`;

const methods = `
try {
    /**
     * Sets the value of an input field or textarea, or simulates a click if the element is a radio button.
     * @param {string} selector - The selector for the input field, textarea, or radio button
     * @param {string} value - The value to be set
     */
    const setValue = (selector, value) => {
        const element = document.querySelector(selector);
        if (element) {
            if (element.type === 'radio') {
                simulateClick(selector);
            } else {
                const enforceTextareaValue = (textarea, value) => {
                    const enforceValue = () => {
                        if (textarea.value !== value) {
                            textarea.value = value;
                            const inputEvent = new Event('input', { bubbles: true });
                            textarea.dispatchEvent(inputEvent);
                            const changeEvent = new Event('change', { bubbles: true });
                            textarea.dispatchEvent(changeEvent);
                        }
                    };
                    const intervalId = setInterval(enforceValue, 100);  // Adjust interval as needed
                    // Optionally, store intervalId somewhere to clear it later if needed
                };

                if (element.tagName.toLowerCase() === 'textarea') {
                    enforceTextareaValue(element, value);
                } else {
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(element, value);
                    const inputEvent = new Event('input', { bubbles: true });
                    element.dispatchEvent(inputEvent);
                    const changeEvent = new Event('change', { bubbles: true });
                    element.dispatchEvent(changeEvent);
                }
            }
        } else {
            console.error('Element not found');
        }
        console.log(\`setValue: Set value of \${selector} to \${value}\`);
    };

    /**
     * Simulates a click event on a specified element
     * @param {string} selector - The selector for the element to be clicked
     */
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
        console.log(\`simulateClick: Simulated click on \${selector}\`);
    };

    /**
     * Sets the selected value of a select element based on the option index
     * @param {string} selector - The selector for the select element
     * @param {number} optionIndex - The index of the option to be selected
     */
    const setSelectValue = (selector, optionIndex) => {
        const selectElement = document.querySelector(selector);
        if (selectElement && selectElement.tagName.toLowerCase() === 'select') {
            const options = selectElement.options;
            if (options && optionIndex >= 0 && optionIndex < options.length) {
                selectElement.selectedIndex = optionIndex;
                const changeEvent = new Event('change', { bubbles: true });
                selectElement.dispatchEvent(changeEvent);
            } else {
                console.error('Invalid option index');
            }
        } else {
            console.error('Select element not found or invalid element type');
        }
        console.log(\`setSelectValue: Set value of \${selector} to option index \${optionIndex}\`);
    };

 /**
     * Check if the characters of \`query\` appear in order in the \`string\`.
     * @param {string} query - The query string
     * @param {string} string - The target string
     * @return {boolean} Whether the characters of \`query\` appear in order in the \`string\`.
     */
    const fuzzy_match = (query, string) => {
        let query_idx = 0;
        for (let char of string) {
            if (char == query[query_idx]) {
                query_idx += 1;
                if (query_idx == query.length) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * Perform a fuzzy search for \`query\` in \`data\`.
     * @param {string} query - The query string
     * @param {Array<string>} data - An array of strings to search within
     * @return {Array<string>} An array of matching strings
     */
    const fzf_search = (query, data) => {
        return data.filter(item => fuzzy_match(query, item));
    };

    /**
     * Sets the selected value of a select element based on the option text
     * @param {string} selector - The selector for the select element
     * @param {string} text - The text of the option to be selected
     */
    const setSelectValueByText = (selector, text) => {
        const selectElement = document.querySelector(selector);
        if (selectElement && selectElement.tagName.toLowerCase() === 'select') {
            const options = selectElement.options;
            let bestMatchIndex = -1;
            let bestMatchScore = 0;
            for (let i = 0; i < options.length; i++) {
                const optionText = options[i].textContent || options[i].innerText;
                if (fuzzy_match(text, optionText)) {
                    bestMatchIndex = i;
                    break;  // Exit the loop once a match is found
                }
            }
            if (bestMatchIndex !== -1) {
                setSelectValue(selector, bestMatchIndex);
            } else {
                console.error('No suitable option found');
            }
        } else {
            console.error('Select element not found or invalid element type');
        }
        console.log(\`setSelectValueByText: Set value of \${selector} to \${text}\`);
    };`;

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

  const clean_response = (str: string): string => str.replace(/\n/g, " ");

  let response = clean_response(await query(prompt, 4));

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
