import { query } from "./query";

const { basic_info } = await Bun.file("./context/personal/profile.json").json();
const personal_data = JSON.stringify(basic_info);
export type Script = string | string[];

export const questionnaire_surgeon = async (
  html_snippet: string
): Promise<Script> => {
  const prompt = `
  basic_info: ${personal_data}
  `;
  const script = `
  console.clear();
  console.info('Hey good looking');
  `;

  return await prompt;
};
