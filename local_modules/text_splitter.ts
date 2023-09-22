import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// Split text into segments
export const split_text = async (text: string): Promise<string[]> => {
  // Calculate the chunk size and overlap
  const chunkSize = text.length / 10;
  const chunkOverlap = chunkSize / 10;

  // Create a text splitter instance with specified parameters
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize,
    chunkOverlap,
  });

  // Create documents and extract page content
  const docs = await textSplitter.createDocuments([text]);
  const segments = [...docs].map((doc) => doc.pageContent);

  return segments;
};
