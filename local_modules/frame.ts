import { PromptTemplate } from "langchain/prompts";
import { extraction } from "./extract";

type profile = extraction | string;

export async function frame(
  directive: string,
  professionalBackground: profile,
  jobProfile: profile,
  query: string
): Promise<string> {
  const template =
    "Directive: {directive}\n Professional Background: {professionalBackground}\n Job profile: {jobProfile} \n Query: {query}";

  const promptTemplate = PromptTemplate.fromTemplate(template);

  const formattedPromptTemplate = await promptTemplate.format({
    directive,
    professionalBackground,
    jobProfile,
    query,
  });

  return formattedPromptTemplate;
}
