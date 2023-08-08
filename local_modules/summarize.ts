import { OpenAI } from "langchain/llms/openai";
import { loadSummarizationChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";

export async function summarize(filepath: string): Promise<string> {
  // In this example, we use a `MapReduceDocumentsChain` specifically prompted to summarize a set of documents.
  filepath = `${filepath}/profile.txt`;
  const text = fs.readFileSync(filepath, "utf8");
  const model = new OpenAI({ temperature: .5 });
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 4000 });
  const docs = await textSplitter.createDocuments([text]);

  const params = {
    type: "map_reduce" as const, 
    length: 2000 
  }

  // This convenience function creates a document chain prompted to summarize a set of documents.
  const chain = loadSummarizationChain(model, params);
  const res = await chain.call({
    input_documents: docs,
  });
  const { text: summary } = res
  return summary;
}

