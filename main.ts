import { summarize } from "./local_modules/summarize";

async function main(): Promise<void> {
  const summary = await summarize("./context/legacy/data.txt");
  console.log(summary);
}

main();
