import { query } from "./query";

export type Script = string | string[];

const { basic_info, legal_info } = await Bun.file(
  "./context/personal/profile.json"
).json();
const basic_data = JSON.stringify(basic_info);
const legal_data = JSON.stringify(basic_info);
const instructions = `The following is a snippet of html containing questions for a job application. This is a test, you can awnser in any way. Your job is to identify the questions, awnser them, then identify what kind of form each question is, so you can either type or select the appropriate response or option[s]; when you respond you have to come up with javascript code that leverages querSelectors to click or insert the correct response. The code you return should be executable and working if pasted into the console log of the page where this html snippet originated. For any form that is a button, radio button or not a text field, please use .click() instead of .checked = true. Only return the code and nothing else.`;
const system_prompt = `You are an expert in extracting queries from html, answering them according to the info below, and generating code that when executed will fill in the html forms accordingly.`;

export const questionnaire_surgeon = async (
  html_snippet: string,
  personal_summary: string
): Promise<Script> => {
  const prompt = `
  System: ${system_prompt}
  basic_info: ${basic_data}
  personal_summary: ${personal_summary}

  Instructions: ${instructions}

  html_snippet: ${html_snippet}
  `;

  const response = await query(prompt, 4);

  const reprompt = `
  Please extract the code from the following text and place it into this json object, as the value for the 'code' key, only return the JSON object:
  {
    code: ""
  }
  text: ${response}
  `;

  const formatted_response = await query(reprompt);

  const { code: script } = JSON.parse(formatted_response);

  return script;
};

const getUpcomingMonday = (): string => {
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
