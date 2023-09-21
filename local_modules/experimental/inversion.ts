import { query } from "../query";

/**
 * Inverts the provided text based on the given keywords.
 * @param text The input text.
 * @param keywords The keywords to focus on.
 * @returns The inverted text.
 */
export const keyword_inversion = async (
  text: string,
  keywords: RegExp[]
): Promise<string> => {
  // Create a prompt for the model
  const prompt = `
    Construct a brief and focused sentence in the first person using ONLY the provided keywords ${keywords.join(
      ", "
    )} from the text "${text}".
  `;
  // Get the response from the model
  const response = await query(prompt);

  return response;
};

export const invert_chunks = async (
  chunks: string[],
  keywords: RegExp[]
): Promise<string[]> =>
  await Promise.all(
    chunks.map((chunk: string) => keyword_inversion(chunk, keywords))
  );
