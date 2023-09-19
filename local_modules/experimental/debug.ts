type bug = Record<string, any> | string | string[] | number;

export const debug = (data: bug, title: string = "") => {
  console.info(`[[Debugging]] | ${title}:`, data);
  throw "\nDebugging...\n";
};

export const log = (data: bug, title: string = "") => {
  console.info(`[[Logging]] | ${title}:`, data);
};
