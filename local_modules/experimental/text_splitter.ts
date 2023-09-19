import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { log } from "./debug";

export const split_text = async (text: string): Promise<string[]> => {
  const chunkSize = text.length / 10;
  const chunkOverlap = chunkSize / 10;
  log({ chunkSize, textSize: text.length }, "chunkSize");
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });
  const docs = await textSplitter.createDocuments([text]);
  const segments = [...docs].map((doc) => doc.pageContent);
  return segments;
};
