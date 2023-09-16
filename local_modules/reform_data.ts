import { query } from "./query";

type list = string[];

export const get_array = async (data: string): Promise<list> => {
  const list = await query(
    `Created a valid JSON array from the following list, only respond with the valid array and nothing else: ${data}`
  );
  /*
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
  */
  return JSON.parse(list);
};
