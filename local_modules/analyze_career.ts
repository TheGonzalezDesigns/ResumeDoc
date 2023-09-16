import { extraction, extractions } from "./extract";
import { get_relevant_career_chunks } from "./fuzzy_match";

export const extract_career_chunks = async (
  job_profile: extraction
): Promise<extractions> => {
  const profiled_career_chunks = await Bun.file(
    "./context/professional/career_chunks.json"
  ).json();
  const job_profile_keys = job_profile?.technical_skills;

  if (!Array.isArray(job_profile_keys) || job_profile_keys.length === 0)
    throw new Error(`Corrupt Keys: ${job_profile}`);
  console.info("job_profile:", job_profile);
  const relevant_career_chunks = get_relevant_career_chunks(
    profiled_career_chunks,
    job_profile_keys
  );
  return relevant_career_chunks;
};
