import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { extract, extraction, extractions } from "./extract";

const profile_career_chunk = async (
  career_chunk: string
): Promise<extraction> => {
  const extraction = await extract(
    [
      "technical_skill_array",
      "non_technical_skill_array",
      "career_achievements_array",
      "career_experience_array",
      "career_projects_array",
    ],
    career_chunk
  );
  return extraction;
};

export const profile_career = async (): Promise<extractions> => {
  // In this example, we use a `MapReduceDocumentsChain` specifically prompted to summarize a set of documents.
  const filepath = "./context/professional/profile.txt";
  const text = await Bun.file(filepath).text();
  console.info(`Summarizing ${filepath}...\n`);
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 4000 });
  const docs = await textSplitter.createDocuments([text]);
  //console.info("docs:", docs);
  const segments = [...docs].map((doc) => doc.pageContent);
  const profiled_career_chunks = await Promise.all(
    segments.map((career_chunk) => profile_career_chunk(career_chunk))
  );
  const extractions = [...segments].map((segment: string, i: number) => {
    const extraction = {
      profiled_career_chunk: profiled_career_chunks[i],
      segment: segment,
    };
    return extraction;
  });
  console.info("extractions:", extractions);
  return profiled_career_chunks;
};
