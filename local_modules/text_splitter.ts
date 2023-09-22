import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

/**
 * Splits the given text into segments using the RecursiveCharacterTextSplitter from langchain.
 *
 * @param {string} text - The text to be split into segments.
 * @returns {Promise<string[]>} A promise that resolves to an array of text segments.
 */
export const split_text = async (text: string): Promise<string[]> => {
  // Calculate the chunk size and overlap based on the length of the text.
  const chunk_size = text.length / 10;
  const chunk_overlap = chunk_size / 10;

  // Create a text splitter instance with specified parameters.
  const text_splitter = new RecursiveCharacterTextSplitter({
    chunkSize: chunk_size,
    chunkOverlap: chunk_overlap,
  });

  // Create documents and extract page content.
  const docs = await text_splitter.createDocuments([text]);
  const segments = [...docs].map((doc) => doc.pageContent);

  return segments;
};
