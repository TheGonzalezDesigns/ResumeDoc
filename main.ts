import { summarize } from "./local_modules/summarize";
import { Document as document } from "./local_modules/document";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query"
import { validateContentType as cType } from "./local_modules/contentType"
import ejs from 'ejs';
import { exec } from 'child_process';
import path from 'path';
import os from 'os';

async function main(): Promise<void> {
  const iconPath = path.join(os.homedir(), 'Pictures/ApplicationIcons/icon');
  exec(`notify-send -i "${iconPath}" "ResumeDoc" "The Doctor is ready."`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });
  console.time('mainExecution');
  const summaries = await Promise.all([summarize("./context/professional"), summarize("./context/jobs")]);
  const [ professionalBackground, jobProfile ]  = summaries;
  let contentType = cType(0);
  
  let directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were Hugo Gonzalez.` 
  let frameQuery = `Generate a ${contentType} for the job listing based on the professional background that makes me look a senior engineer in the field.`;
  
  const resumePrompt = await frame(directive, professionalBackground, jobProfile, frameQuery);
  
  contentType = cType(1);
  
  directive = `You are a cover letter expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were Hugo Gonzalez.` 
  frameQuery = `Generate a ${contentType} for the job listing based on the professional background that makes me look a senior engineer in the field. Only provide the body of the letter, do not add a greeting nor closing. Keep it under 250 words while staying hyperfocused on making it seem like I'm the perfect candidate for the position given.`;
  
  const coverletterPrompt = await frame(directive, professionalBackground, jobProfile, frameQuery);


  contentType = cType(2);
  
  directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were Hugo Gonzalez.` 
  frameQuery = `Generate a ${contentType} for the job listing based on the professional background that makes me look a senior engineer in the field. Please format your response as an array of at least 10 skills. Each skill listed should be verbose and related to the job listing. Each skill should be impressive and prove I am a competent expert in the relevant field. Make sure the list is a javascript array`;
  
  const skillListPrompt = await frame(directive, professionalBackground, jobProfile, frameQuery);
  
  directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt.` 
  frameQuery = `Extract the name of the company from the job listing. Replace any space with hyphens. If you cannot find the name of the compnay, use the title of the job role instead. Only return the company name or the job role. Place the name or role in quoation marks. Remove any special characters from the name except for hyphens.`;
  
  const companyNamePrompt = await frame(directive, "Irrelevant", jobProfile, frameQuery);
  

  const [professionalSummary, coverletterContent, skillList, companyName ] = await Promise.all([query(resumePrompt), query(coverletterPrompt), query(skillListPrompt), query(companyNamePrompt)]);

  interface GeneratedContent {
      professionalSummary: string;
      skillList: string[];
      coverletterContent: string;
      fileName: string;
  }
  const removeQuotes = (str: string) => str.replace(/['"]+/g, '');

  const extractText = (str: string): string => {
    let matches = str.match(/("[^"]*"|'[^']*')/g);
    if (!matches) return "";
    matches = matches[0].match(/^\"(.*?)\"$/);
    if (!matches) return "";
    const extractedText = removeQuotes(matches[0])
    return extractedText; 
  }

  const extractedCompanyName = extractText(companyName)
  const extractJSONArray = (str: string): string[] => {
    const regex = /^\[(.*)\]$/s;
    const matches = str.trim().match(regex);

    return  matches ? JSON.parse(`[${matches[1]}]`) : [];
  };
  
  const extractedSkillList = extractJSONArray(skillList);

  const content: GeneratedContent = {
    professionalSummary,
    skillList: extractedSkillList,
    coverletterContent,
    fileName: extractedCompanyName
  } as const;

  if (content.skillList.length < 5 || content.fileName == "") throw Error("Incomplete Generation.");
  
  // Load the templates
  const resumeTemplate = new document('./templates/resume.ejs');
  const coverLetterTemplate = new document('./templates/coverletter.ejs');

  // Populate the templates
  const populatedResume = ejs.render(resumeTemplate.load(), {
      professionalSummary: content.professionalSummary,
      skillList: content.skillList
  });

  const populatedCoverLetter = ejs.render(coverLetterTemplate.load(), {
      coverletterContent: content.coverletterContent
  });

  const resume = new document(`./src/html/resumes/Hugo_Gonzalez_Resume_${content.fileName}.html`);
  const coverletter = new document(`./src/html/coverletters/Hugo_Gonzalez_Cover-Letter_${content.fileName}.html`);

  resume.save(populatedResume);
  coverletter.save(populatedCoverLetter);
  
  exec(`notify-send -i "${iconPath}" "ResumeDoc" "All content for ${content.fileName} is ready."`, (error, stdout, stderr) => {
      if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`stdout: ${stdout}`);
  });

  console.timeEnd('mainExecution');
}
main();
