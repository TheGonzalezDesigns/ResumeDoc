import { summarize } from "./local_modules/summarize";
import { frame } from "./local_modules/frame";
import { query } from "./local_modules/query"
import { validateContentType as cType } from "./local_modules/contentType"
import { Document } from "./local_modules/Document"
import ejs from 'ejs';
import fs from 'fs';
import puppeteer from 'puppeteer';


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
  frameQuery = `Generate a ${contentType} for the job listing based on the professional background that makes me look a senior engineer in the field. Please format your response as an array of at least 10 skills. Each skill listed should be verbose and related to the job listing. Each skill should be impressive and prove I am a competent expert in the relevant field. Make sure the list is a javascript array`;
  
  const skillListPrompt = await frame(directive, professionalBackground, jobProfile, frameQuery);
  
  directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt.` 
  frameQuery = `Extract the name of the company from the job listing. Replace any space with hyphens. If you cannot find the name of the compnay, use the title of the job role instead. Only return the company name or the job role. Place the name or role in quoation marks. Remove any special characters from the name except for hyphens.`;
  
  const companyNamePrompt = await frame(directive, "Irrelevant", jobProfile, frameQuery);
  

  const [professionalSummary, coverletterContent, skillList, companyName ] = await Promise.all([query(resumePrompt), query(coverletterPrompt), query(skillListPrompt), query(companyNamePrompt)]);

  //console.info(`Prompt: ${prompt}`);
  //console.info(`Response: ${res}`);
 
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
  
  console.info(`All content for ${content.fileName} is ready.\n`)
  console.info(`------------------------------------------\n`)
  let latexCode = "";
  content.skillList.forEach(item => {
      latexCode += `{${item}}`;
  });
  console.log("Skill List in latex:\n", latexCode);

  // Load the templates
  const resumeTemplate = fs.readFileSync('./templates/resume.ejs', 'utf8');
  const coverLetterTemplate = fs.readFileSync('./templates/coverletter.ejs', 'utf8');

  // Populate the templates
  const populatedResume = ejs.render(resumeTemplate, {
      professionalSummary: content.professionalSummary,
      skillList: content.skillList
  });

  const populatedCoverLetter = ejs.render(coverLetterTemplate, {
      coverletterContent: content.coverletterContent
  });

  console.info("populatedResume: ", populatedResume);
  console.info("populatedCoverLetter: ", populatedCoverLetter);

  // The populatedResume and populatedCoverLetter now contain the HTML
  // You can then use Puppeteer or similar tools to convert them to PDF


  // ... [your existing code]

  // Function to convert an HTML string to a PDF

  async function htmlToPdf(html: string, outputPath: string) {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.setContent(html);
    await page.pdf({ path: outputPath, format: 'A4' });
    await browser.close();
  }


  // After populating the templates:
  await htmlToPdf(populatedResume, `./sandbox/${content.fileName}_resume.pdf`);
  await htmlToPdf(populatedCoverLetter, `./sandbox/${content.fileName}_coverletter.pdf`);



  /*
  const resumeFilePath = "~/Documents/Resumes/Tests/ProfessionalSummary.txt"
  const resume = new Document(resumeFilePath);
  resume.writeFile(professionalSummary);

  const skillListFilePath = "~/Documents/Resumes/Tests/SkillList.txt"
  const skillListFile = new Document(skillListFilePath);
  skillListFile.writeFile(skillList);

  const coverletterFilePath = "~/Documents/Coverletters/Tests/Letter.txt";
  const coverletter = new Document(coverletterFilePath);
  coverletter.writeFile(coverletterContent);
*/
  console.timeEnd('mainExecution');
}
main();
