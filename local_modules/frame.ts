import { PromptTemplate } from "langchain/prompts";

export async function frame(directive: string, context: string, query: string): Promise<string> {
  const template = "{directive} {context} {query}.";

  const promptTemplate = PromptTemplate.fromTemplate(template);
  console.log(promptTemplate.inputVariables);
  // ['adjective', 'content']
  const formattedPromptTemplate = await promptTemplate.format({
    directive,
    context,
    query
  });

  return formattedPromptTemplate;
}

