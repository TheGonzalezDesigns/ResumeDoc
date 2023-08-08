import { summarize } from "./local_modules/summarize";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query"
import { validateContentType as cType } from "./local_modules/contentType"
import { Document } from "./local_modules/Document"

async function main(): Promise<void> {
  console.time('mainExecution');
  const summaries = await Promise.all([summarize("./context/professional"), summarize("./context/jobs")]);
  const [ professionalBackground, jobProfile ]  = summaries;
  const contentType = cType(parseInt(process.argv[2]));
  const directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were Hugo Gonzalez.` 
  const frameQuery = `Generate a ${contentType} for the job listing based on the professional background that makes me look a senior engineer in the field.`;
  const prompt = await frame(directive, professionalBackground, jobProfile, frameQuery);
  const res = await query(prompt);

  console.info(`Prompt: ${prompt}`);
  //console.info(`Response: ${res}`);

  const resumeFilePath = "~/Documents/Resumes/Tests/ProfessionalSummary.txt"
  const Resume = new Document(resumeFilePath)
  Resume.writeFile(res);

  console.timeEnd('mainExecution');
}
main();
