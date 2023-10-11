import { OpenAI } from "langchain/llms/openai";
import openaiTokenCounter, { ModelType } from "openai-gpt-token-counter";

/**
 * Enumeration for GPT models.
 * @enum {number}
 */
enum GPT {
  GPT3 = 3,
  GPT4 = 4,
}

/** Mapping of model types to model names. */
const model_names = {
  3: "gpt-3.5-turbo",
  4: "gpt-3.5-turbo-16k-0613",
};

/** Temperature setting for models. */
const temperature = 0.1;

/** Pre-initialized OpenAI models. */
const models = {
  3: new OpenAI({ modelName: model_names[3], temperature }),
  4: new OpenAI({ modelName: model_names[4], temperature }),
};

/**
 * Function to query the specified GPT model.
 * @async
 * @param {string} prompt - The prompt to be processed.
 * @param {GPT} model_type - The type of GPT model to use, default is GPT.GPT3.
 * @returns {Promise<string>} - The response from the model.
 */
export const query = async (
  prompt: string,
  model_type: GPT = GPT.GPT3
): Promise<string> => {
  let model_name = model_names[model_type] as ModelType;

  // Count tokens in the prompt
  const tokenCount = openaiTokenCounter.text(prompt, model_name);

  // If token count is less than 4000, use GPT-3.5 model
  if (tokenCount < 4000) {
    model_type = GPT.GPT3;
    model_name = model_names[model_type] as ModelType;
  }

  try {
    // Obtain the model instance and call it with the prompt
    const model = models[model_type];
    const res = await model.call(prompt);
    return res;
  } catch (error) {
    // If an error occurs, promote to the 16k model and retry
    model_type = GPT.GPT4;
    const model = models[model_type];
    const res = await model.call(prompt);
    return res;
  }
};
