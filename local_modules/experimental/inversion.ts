import { query } from "../query";

/**
 * Inverts the provided text based on the given keywords.
 * @param text The input text.
 * @param keywords The keywords to focus on.
 * @returns The inverted text.
 */
export async function keyword_inversion(
  text: string,
  keywords: string[]
): Promise<string> {
  // Create a prompt for the model
  const prompt = `
    Given the text "${text}", construct a concise sentence that prominently features the keywords ${keywords.join(
    ", "
  )} while excluding non-relevant parts.
  `;

  // Get the response from the model
  const response = await query(prompt);

  return response;
}
