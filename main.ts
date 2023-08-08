import { summarize } from "./local_modules/summarize";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query"
import { validateContentType as cType } from "./local_modules/contentType"
import { Document } from "./local_modules/Document"

async function main(): Promise<void> {
  console.time('mainExecution');
  const summaries = await Promise.all([summarize("./context/professional"), summarize("./context/jobs")]);
  const [ professionalBackground, jobProfile ]  = summaries;
  let contentType = cType(0);
  
  let directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were Hugo Gonzalez.` 
  let frameQuery = `Generate a ${contentType} for the job listing based on the professional background that makes me look a senior engineer in the field.`;
  
  const resumePrompt = await frame(directive, professionalBackground, jobProfile, frameQuery);
  
  contentType = cType(1);
  
  directive = `You are a cover letter expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were Hugo Gonzalez.` 
  frameQuery = `Generate a ${contentType} for the job listing based on the professional background that makes me look a senior engineer in the field. Only provide the body of the letter, do not add a greeting nor closing.`;
  
  const coverletterPrompt = await frame(directive, professionalBackground, jobProfile, frameQuery);


  contentType = cType(2);
  
  directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were Hugo Gonzalez.` 
  frameQuery = `Generate a ${contentType} for the job listing based on the professional background that makes me look a senior engineer in the field. Please format your response in unordered latex bullet points`;
  
  const skillListPrompt = await frame(directive, professionalBackground, jobProfile, frameQuery);
  

  const [professionalSummary, coverletterContent, skillList ] = await Promise.all([query(resumePrompt), query(coverletterPrompt), query(skillListPrompt)]);

  //console.info(`Prompt: ${prompt}`);
  //console.info(`Response: ${res}`);

  const resumeFilePath = "~/Documents/Resumes/Tests/ProfessionalSummary.txt"
  const resume = new Document(resumeFilePath);
  resume.writeFile(professionalSummary);

  const skillListFilePath = "~/Documents/Resumes/Tests/SkillList.txt"
  const skillListFile = new Document(skillListFilePath);
  skillListFile.writeFile(skillList);

  const coverletterFilePath = "~/Documents/Coverletters/Tests/Letter.txt";
  const coverletter = new Document(coverletterFilePath);
  coverletter.writeFile(coverletterContent);

  console.timeEnd('mainExecution');
}
main();
