type Chunk = {
  [key: string]: any;
};

const matchSkills = (value: any, requiredSkill: string): boolean => {
  if (typeof value === "string") {
    return value.toLowerCase().includes(requiredSkill.toLowerCase());
  }

  if (Array.isArray(value)) {
    return value.some((element) => matchSkills(element, requiredSkill));
  }

  if (typeof value === "object" && value !== null && value !== undefined) {
    return Object.values(value).some((subValue) =>
      matchSkills(subValue, requiredSkill)
    );
  }

  return false;
};

const searchCareerChunk = (
  careerChunk: Chunk,
  jobProfileKey: string
): boolean => {
  return Object.values(careerChunk).some((chunkValue) =>
    matchSkills(chunkValue, jobProfileKey)
  );
};

export const getRelevantCareerChunks = (
  careerChunks: Chunk[],
  jobProfileKeys: string[]
): Chunk[] => {
  return careerChunks.filter((chunk) =>
    jobProfileKeys.some((key) => searchCareerChunk(chunk, key))
  );
};
