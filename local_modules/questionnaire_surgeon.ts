import { query } from "./query";

export type Script = string | string[];

export const questionnaire_surgeon = async (
  html_snippet: string
): Promise<Script> => {
  const script = `
  console.clear();
  console.info('Hey good looking');
  `;

  return await script;
};
