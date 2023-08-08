import { summarize } from "./local_modules/summarize";
import { frame } from "./local_modules/frame";

async function main(): Promise<void> {
  const summary = await summarize("./context/legacy/data.txt");
  const contentType = "Professional Summary";
  const directive = `You are a resume expert. You will use the given context to answer the given query. Do not halucinate, only use the facts given to you in this prompt.` 
  const query = `Generate a ${contentType} for the job listing`;
  const prompt = await frame(directive, summary, query);
  console.log(prompt);
}
main();

