import { summarize } from "./local_modules/summarize";
import { frame } from "./local_modules/frame";

async function main(): Promise<void> {
  const professionalBackground = await summarize("./context/professional");
  const jobProfile = await summarize("./context/jobs");
  const contentType = "Professional Summary";
  const directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt.` 
  const query = `Generate a ${contentType} for the job listing based on the professional background`;
  const prompt = await frame(directive, professionalBackground, jobProfile, query);
  console.log(prompt);
}
main();

