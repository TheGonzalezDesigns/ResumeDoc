type Chunk = {
  [key: string]: any;
};

const match_skills = (value: any, requiredSkill: string): boolean => {
  if (typeof value === "string") {
    return value.toLowerCase().includes(requiredSkill.toLowerCase());
  }

  if (Array.isArray(value)) {
    return value.some((element) => match_skills(element, requiredSkill));
  }

  if (typeof value === "object" && value !== null && value !== undefined) {
    return Object.values(value).some((subValue) =>
      match_skills(subValue, requiredSkill)
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
  careerChunks: Chunk[],
  jobProfileKeys: string[]
): Chunk[] => {
  return careerChunks.filter((chunk) =>
    jobProfileKeys.some((key) => search_career_chunk(chunk, key))
  );
};
