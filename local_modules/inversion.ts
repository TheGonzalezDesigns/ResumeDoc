import { query } from "./query";

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
  From the text "${text}".
    Reconstruct the sentence(s) in the first person so that the text omits any topics or keywords that do not relate to the provided keywords: ${keywords.join(
      ", "
    )}
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
