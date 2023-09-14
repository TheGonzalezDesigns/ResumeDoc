import { PromptTemplate } from "langchain/prompts";
import { extraction } from "./extract";

type profile = extraction | string;

export async function frame(
  directive: string,
  professional_background: profile,
  job_profile: profile,
  query: string
): Promise<string> {
  const template =
    "Directive: {directive}\n Professional Background: {professional_background}\n Job profile: {job_profile} \n Query: {query}";

  const prompt_template = PromptTemplate.fromTemplate(template);

  const formatted_prompt_template = await prompt_template.format({
    directive,
    professional_background,
    job_profile,
    query,
  });

  return formatted_prompt_template;
}
