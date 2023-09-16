import { PromptTemplate } from "langchain/prompts";
import { extraction } from "./extract";

type profile = extraction | string;

export async function frame(
  legal_name: string,
  professional_background: profile,
  job_profile: profile,
  query: string
): Promise<string> {
  const directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were ${legal_name}.`;

  professional_background = JSON.stringify(professional_background);
  job_profile = JSON.stringify(job_profile);

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
