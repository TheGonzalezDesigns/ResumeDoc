type Chunk = {
  [key: string]: any;
};

const match_skills = (value: any, required_skill: string): boolean => {
  if (typeof value === "string") {
    return value.toLowerCase().includes(required_skill.toLowerCase());
  }

  if (Array.isArray(value)) {
    return value.some((element) => match_skills(element, required_skill));
  }

  if (typeof value === "object" && value !== null && value !== undefined) {
    return Object.values(value).some((subValue) =>
      match_skills(subValue, required_skill)
    );
  }

  return false;
};

const search_career_chunk = (
  careerChunk: Chunk,
  jobProfileKey: string
): boolean => {
  return Object.values(careerChunk).some((chunkValue) =>
    match_skills(chunkValue, jobProfileKey)
  );
};

export const get_relevant_career_chunks = (
  career_chunks: Chunk[],
  job_profile_keys: string[]
): Chunk[] => {
  return career_chunks.filter((chunk) =>
    job_profile_keys.some((key) => search_career_chunk(chunk, key))
  );
};
