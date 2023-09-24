import { query } from "./query";

/**
 * Inverts the provided text based on the given keywords.
 *
 * @param {string} text - The input text to be inverted.
 * @param {RegExp[]} keywords - The regular expressions representing keywords to focus on while inverting.
 * @returns {Promise<string>} - A promise that resolves to the inverted text, focusing only on provided keywords.
 */
export const keyword_inversion = async (
  text: string,
  keywords: RegExp[]
): Promise<string> => {
  const prompt = `
    From the text "${text}".
    Focus ONLY on the following keywords: ${keywords
      .map((k) => k.source)
      .join(", ")}.
    Reconstruct the sentence(s) in the first person and OMIT any topics or information that do not relate to the provided keywords.
  `;

  const response = await query(prompt);

  return response;
};

/**
 * Inverts an array of text chunks based on the given keywords.
 *
 * @param {string[]} chunks - The array of text chunks to be inverted.
 * @param {RegExp[]} keywords - The regular expressions representing keywords to focus on while inverting.
 * @returns {Promise<string[]>} - A promise that resolves to an array of inverted text chunks, each focusing only on provided keywords.
 */
export const invert_chunks = async (
  chunks: string[],
  keywords: RegExp[]
): Promise<string[]> => {
  return await Promise.all(
    chunks.map((chunk: string) => keyword_inversion(chunk, keywords))
  );
};
