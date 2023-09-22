import { extraction } from "./extract";

type profile = extraction | string;

export const frame = (
  legal_name: string,
  professional_background: profile,
  job_profile: profile,
  query: string,
  content_type: string
): string => {
  const directive = `As a ${content_type} specialist, respond to the query based on the information provided. Stick to the facts presented and answer as if you are ${legal_name}.`;
  if (typeof job_profile !== "string")
    job_profile = JSON.stringify(job_profile);

  return `Refactored Prompt: "Task: ${directive}\nExperience: ${professional_background}\nRole: ${job_profile}\nQuestion: ${query}"`;
};
