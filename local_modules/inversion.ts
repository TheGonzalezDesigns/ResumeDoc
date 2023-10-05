import { query } from "./query";

/**
 * Inverts the provided text based on the given keywords.
 *
 * @param {string} text - The input text to be inverted.
 * @param {RegExp[]} keywords - The regular expressions representing keywords to focus on while inverting.
 * @returns {Promise<string>} A promise that resolves to the inverted text, focusing only on provided keywords.
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
 * @returns {Promise<string[]>} A promise that resolves to an array of inverted text chunks, each focusing only on provided keywords.
 */
export const invert_chunks = async (
  chunks: string[],
  keywords: RegExp[]
): Promise<string[]> => {
  const prompt = `
    You are an expert in keyword relevancy. Your job is to rewrite statements to remove any irrelevant information.
    For example if the keywords are ['Rust, DevOps'] and the statement is 'Proffessional Solidity dev with 5 years of experience in Rust and DevOps',
    An acceptable response would be "Expert software developer passionate about DevOps with specialization in Rust."
    An error response would be "Professional Solidity Engineer."
    From the text [${chunks.join(", ")}].
    Focus ONLY on the following keywords: [${keywords
      .map((k) => k.source)
      .join(", ")}].
    Reconstruct each sentence(s) in the first person and OMIT any topics or information that do not relate to the provided keywords.
    Each sentence should sound impressive, direct, and natural.
  `;

  const response = await query(prompt, 4);

  const inverted_chunks = [response].flat();

  return inverted_chunks;
};
