import { OpenAI } from "langchain/llms/openai";

export async function query(prompt: string) {

  const model = new OpenAI({
    modelName: "gpt-4", 
    temperature: 0.9,
  });

  const res = await model.call(prompt);

  return res;
}

