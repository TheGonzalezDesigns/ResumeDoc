import { OpenAI } from "langchain/llms/openai";

enum GPT {
  GPT3 = 3,
  GPT4 = 4,
}

// Define available models
const models = {
  3: "gpt-3.5-turbo",
  4: "gpt-3.5-turbo-16k-0613",
};

/**
 * Queries an OpenAI model and returns the generated response.
 *
 * @param {string} prompt - The prompt to be sent to the OpenAI model.
 * @param {GPT} modelType - The type of GPT model to be used (default is GPT3).
 * @returns {Promise<string>} A promise that resolves to the generated response from the OpenAI model.
 */
export const query = async (
  prompt: string,
  modelType: GPT = GPT.GPT3
): Promise<string> => {
  // Initialize the OpenAI model
  const model = new OpenAI({
    modelName: models[modelType],
    temperature: 0.9,
  });
  console.warn("Query:", prompt);
  // Query the model and return the response
  const res = await model.call(prompt);
  return res;
};
