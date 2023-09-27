import { OpenAI } from "langchain/llms/openai";

enum GPT {
  GPT3 = 3,
  GPT4 = 4,
}

// Define available models
const model_names = {
  3: "gpt-3.5-turbo",
  4: "gpt-3.5-turbo-16k-0613",
};

const temperature = 0.1;

// Pre-initialize OpenAI models
const models = {
  3: new OpenAI({
    modelName: model_names[3],
    temperature,
  }),
  4: new OpenAI({
    modelName: model_names[4],
    temperature,
  }),
};

/**
 * Queries an OpenAI model and returns the generated response.
 *
 * @param {string} prompt - The prompt to be sent to the OpenAI model.
 * @param {GPT} model_type - The type of GPT model to be used (default is GPT3).
 * @returns {Promise<string>} A promise that resolves to the generated response from the OpenAI model.
 */
export const query = async (
  prompt: string,
  model_type: GPT = GPT.GPT3
): Promise<string> => {
  const model = models[model_type];
  const res = await model.call(prompt);
  return res;
};
