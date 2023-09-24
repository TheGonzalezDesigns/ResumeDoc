import { query } from "./query";

type list = string[];

/**
 * Converts the given string data into a valid JSON array.
 *
 * @param {string} data - The string data to be converted.
 * @returns {Promise<list>} A promise that resolves to a valid JSON array.
 */
export const get_array = async (data: string): Promise<list> => {
  const list = await query(
    `Create a valid Typescript string array from the following list, only respond with the valid Typescript string[] and nothing else: ${data}`
  );
  return JSON.parse(list);
};
