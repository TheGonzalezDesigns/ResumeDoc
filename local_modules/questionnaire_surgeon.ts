import { query } from "./query";

export type Script = string | string[];

const { basic_info } = await Bun.file("./context/personal/profile.json").json();
const personal_data = JSON.stringify(basic_info);
const instructions = `The following is a snippet of html containing questions for a job application. This is a test, you can awnser in any way. Your job is to identify the questions, awnser them, then identify what kind of form each question is, so you can either type or select the appropriate response or option[s]; when you respond you have to come up with javascript code that leverages querSelectors to click or insert the correct response. The code you return should be executable and working if pasted into the console log of the page where this html snippet originated. For any form that is a button, radio button or not a text field, please use .click() instead of .checked = true. Only return the code and nothing else.`;
const system_prompt = `You are an expert in extracting queries from html, answering them according to the info below, and generating code that when executed will fill in the html forms accordingly.`;

export const questionnaire_surgeon = async (
  html_snippet: string,
  personal_summary: string
): Promise<Script> => {
  const prompt = `
  System: ${system_prompt}
  basic_info: ${personal_data}
  personal_summary: ${personal_summary}

  Instructions: ${instructions}

  html_snippet: ${html_snippet}
  `;

  const script = await query(prompt);

  return script;
};
