import { summarize } from "./local_modules/summarize";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query"

async function main(): Promise<void> {
  console.time('mainExecution');
  const professionalBackground = await summarize("./context/professional");
  const jobProfile = await summarize("./context/jobs");
  const contentType = "Professional Summary";
  const directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt.` 
  const frameQuery = `Generate a ${contentType} for the job listing based on the professional background`;
  const prompt = await frame(directive, professionalBackground, jobProfile, frameQuery);
  const res = await query(prompt);

  console.info(`Prompt: ${prompt}`);
  console.info(`Response: ${res}`);

  console.timeEnd('mainExecution');

}
main();

