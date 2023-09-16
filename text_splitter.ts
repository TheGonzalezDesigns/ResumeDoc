import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const split_text = async (text: string): Promise<string[]> => {
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
  const docs = await textSplitter.createDocuments([text]);
  const segments = [...docs].map((doc) => doc.pageContent);
  return segments;
};
