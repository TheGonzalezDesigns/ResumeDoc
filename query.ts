import { summarize } from "./local_modules/summarize";
import { frame } from "./local_modules/frame";
import { validateContentType as cType } from "./local_modules/contentType";
import { query } from "./local_modules/query";
import { exec } from "child_process";
import path from "path";
import os from "os";

import clipboardy from "clipboardy";
const clip = clipboardy;

async function main(): Promise<void> {
  const iconPath = path.join(os.homedir(), "Pictures/ApplicationIcons/icon");
  exec(
    `notify-send -i "${iconPath}" "ResumeDoc" "The Doctor is ready."`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    }
  );
  console.time("mainExecution");

  try {
    const summaries = await Promise.all([
      summarize("./context/professional"),
      summarize("./context/queries"),
    ]);
    const [professionalBackground, careerQueryResponse] = summaries;

    let contentType = cType(3);

    let directive = `You are a resume expert. You will use the given context to answer the given query. Do not hallucinate, only use the facts given to you in this prompt. Answer in the first person as if you were Hugo Gonzalez.`;
    let frameQuery = `Generate a ${contentType} for the query given based on the professional background that makes me look a senior engineer in the field. This should be as accurate as possible. Please put your response between two quotes. Your awnser should be brief but hyper-relavent and under 75 words. Please do not overshare, an do not mention any unrelated information. Only use factual data that you know to be true or given to you that you can verify Only use factual data that you know to be true or given to you that you can verify. Make sure to curate your response to address every aspect of the given query. Your response must be natural and polished. You cant say things like 'The tools and technologies used are not explicitly stated here.' or any variation of it.`;

    const careerQueryResponsePrompt = await frame(
      directive,
      professionalBackground,
      careerQueryResponse,
      frameQuery
    );

    const answer = await query(careerQueryResponsePrompt);

    const removeQuotes = (str: string) => str.replace(/['"]+/g, "");

    const extractText = (str: string): string => {
      let matches = str.match(/("[^"]*"|'[^']*')/g);
      if (!matches) return "";
      matches = matches[0].match(/^\"(.*?)\"$/);
      if (!matches) return "";
      const extractedText = removeQuotes(matches[0]);
      return extractedText;
    };

    const extractedAnswer = extractText(answer);

    console.info("Answer: ", extractedAnswer);

    await clip.writeSync(extractedAnswer);

    exec(
      `notify-send -i "${iconPath}" "ResumeDoc" "Your prescription is ready 💊"`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );
  } catch (error) {
    exec(
      `notify-send -i "${iconPath}" "ResumeDoc" "The Doctor is ill."`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      }
    );
    console.error(error);
  }
  console.timeEnd("mainExecution");
}
main();
