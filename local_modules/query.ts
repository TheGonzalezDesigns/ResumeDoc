import { OpenAI } from "langchain/llms/openai";

enum GPT {
  GPT3 = 3,
  GPT4 = 4,
}

const models = {
  3: "gpt-3.5-turbo",
  4: "gpt-4",
};

export const query = async (
  prompt: string,
  modelType: GPT = 3
): Promise<string> => {
  const model = new OpenAI({
    modelName: models[modelType],
    temperature: 0.9,
  });

  const res = await model.call(prompt);
  console.info({
    query: prompt,
    reply: res,
  });
  return res;
};
