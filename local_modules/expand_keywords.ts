import { query } from "./query";

export const expand_keywords = async (keywords: string[]) => {
  const prompt = `
    Given this list of keywords: ${keywords.join(" | ")}
    Augment the list by add synonyms to each keyword.
    Format the list as a string[]
  `;
  const response = await query(prompt);

  let parsed_result: string[] = [];
  let data: string = response;

  while (true) {
    try {
      parsed_result = JSON.parse(data);

      if (
        !Array.isArray(parsed_result) ||
        !parsed_result.every((item) => typeof item === "string")
      ) {
        throw new Error("Result is not an array of strings");
      }

      break;
    } catch (err) {
      data = await query(
        `Please fix the following JSON ensuring it's a valid array. Only respond with the json array and nothing else: ${data}`
      );
    }
  }
  return keywords;
};
