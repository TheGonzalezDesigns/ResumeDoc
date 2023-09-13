import { query } from "./query";

export type extraction = Record<string, any>;
export type extractions = extraction[];

export const extract = async (
  extraction_args: string[],
  data: string
): Promise<extraction> => {
  const type_description = "We are only concerned with strings for types.";
  const format_instructions = "Format the response as a valid JSON object.";
  const encoding_instructions =
    "Fncapsulate the response within a set of triple single quotation marks, e.g. ''' ... '''.";
  const extraction_instructions = `Fxtract only data that is precisely related to [${[
    ...extraction_args,
  ].join(" | ")}].
  `;
  const promptTemplate = `
    Your goal is to extract structured information from the user's input that matches the form described below.
    When extracting information please make sure it matches the type information exactly.\n\n
    Be extremely thorough in your extraction but do not add any attributes that do not appear in the schema shown below.\n\n
    Type Description: ${type_description}\n\n
    Format instructions: ${format_instructions}\n\n
    Encoding instructions: ${encoding_instructions}\n\n
    Extraction instructions: ${extraction_instructions}\n\n
    Extract from:
    \`\`\`
    ${data}
    \`\`\`
    \n\n
  `;
  const reply = await query(promptTemplate);
  const clean = await query(
    `Please fix the following JSON if it is invalid, only respond with the json and nothing else: ${reply}`
  );
  const response = `
  ${promptTemplate}
  -----------------------------------------------------------------------------------------------------------
  \n\n
  reply:
  ${reply}
  \n\n
  clean:
  ${clean}
  `;
  const final_extraction = JSON.parse(clean);
  return final_extraction;
};
