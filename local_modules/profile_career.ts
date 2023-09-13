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

export const profile_career = async (): Promise<void> => {
  // In this example, we use a `MapReduceDocumentsChain` specifically prompted to summarize a set of documents.
  const filepath = "./context/professional/profile.txt";
  const text = await Bun.file(filepath).text();
  console.info(`Accessing ${filepath}...\n`);
  console.info(`Analyzing and restructuring your career history.`);
  const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 2000 });
  const docs = await textSplitter.createDocuments([text]);
  //console.info("docs:", docs);
  const segments = [...docs].map((doc) => doc.pageContent);
  const profiled_career_chunks = await Promise.all(
    segments.map((career_chunk) => profile_career_chunk(career_chunk))
  );
  await Bun.write(
    "./context/professional/career_chunks.json",
    JSON.stringify(profiled_career_chunks)
  );
  console.info(
    `Your career history can now be used to generate resumes and cover-letters.`
  );
};
