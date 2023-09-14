import { extractions } from "./extract";
import { get_relevant_career_chunks } from "./fuzzy_match";
import { profile_job } from "./profile_job";

export const extract_career_chunks = async (): Promise<extractions> => {
  const profiled_career_chunks = await Bun.file(
    "./context/professional/career_chunks.json"
  ).json();
  const job_profile = await profile_job();
  const job_profile_keys = job_profile?.technical_skills_array;

  if (!Array.isArray(job_profile_keys) || job_profile_keys.length === 0)
    throw new Error(`Corrupt Keys: ${job_profile}`);
  console.info("job_profile:", job_profile);
  const relevant_career_chunks = get_relevant_career_chunks(
    profiled_career_chunks,
    job_profile_keys
  );
  return relevant_career_chunks;
};
