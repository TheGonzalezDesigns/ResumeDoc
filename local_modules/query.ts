import { OpenAI } from "langchain/llms/openai";
import openaiTokenCounter, { ModelType } from "openai-gpt-token-counter";

enum GPT {
  GPT3 = 3,
  GPT4 = 4,
}

const model_names = {
  3: "gpt-3.5-turbo",
  4: "gpt-3.5-turbo-16k-0613",
};

//export type ModelType = 'gpt-4' | 'gpt-4-0613' | 'gpt-4-32k' | 'gpt-4-32k-0613' | 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k' | 'gpt-3.5-turbo-0613' | 'gpt-3.5-turbo-16k-0613';

const temperature = 0.1;

const models = {
  3: new OpenAI({ modelName: model_names[3], temperature }),
  4: new OpenAI({ modelName: model_names[4], temperature }),
};

export const query = async (
  prompt: string,
  model_type: GPT = GPT.GPT3
): Promise<string> => {
  const model_name = model_names[model_type] as ModelType;

  // Count tokens in the prompt
  const tokenCount = openaiTokenCounter.text(prompt, model_name);

  // If token count is less than 4000, use GPT-3.5 model
  if (tokenCount < 4000) {
    model_type = GPT.GPT3;
  }

  const model = models[model_type];
  const res = await model.call(prompt);
  return res;
};
