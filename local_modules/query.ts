import { OpenAI } from "langchain/llms/openai";

enum GPT {
  GPT3 = 3,
  GPT4 = 4,
}

const models = {
  3: "gpt-3.5-turbo",
  4: "gpt-4",
};

export async function query(prompt: string, modelType: GPT = 3) {
  const model = new OpenAI({
    modelName: models[modelType],
    temperature: 0.9,
  });

  const res = await model.call(prompt);

  return res;
}
