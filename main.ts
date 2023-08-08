import { summarize } from "./local_modules/summarize";

async function main(): Promise<void> {
  const summary = await summarize("./local_modules/test.txt");
  console.log(summary);
}

main();
