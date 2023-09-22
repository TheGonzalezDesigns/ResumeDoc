import { query } from "./query";

/**
 * Inverts the provided text based on the given keywords.
 *
 * @param {string} text - The input text to be inverted.
 * @param {RegExp[]} keywords - The keywords to focus on while inverting.
 * @returns {Promise<string>} A promise that resolves to the inverted text.
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

  // Query the model to get the response
  const response = await query(prompt);

  return response;
};

/**
 * Inverts an array of text chunks based on the given keywords.
 *
 * @param {string[]} chunks - The array of text chunks to be inverted.
 * @param {RegExp[]} keywords - The keywords to focus on while inverting.
 * @returns {Promise<string[]>} A promise that resolves to an array of inverted text chunks.
 */
export const invert_chunks = async (
  chunks: string[],
  keywords: RegExp[]
): Promise<string[]> => {
  // Map each chunk to its inverted version
  return await Promise.all(
    chunks.map((chunk: string) => keyword_inversion(chunk, keywords))
  );
};
