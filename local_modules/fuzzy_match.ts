type Chunk = {
  [key: string]: any;
};

const matchSkills = async (
  value: any,
  requiredSkill: string
): Promise<boolean> => {
  if (typeof value === "string") {
    return value.toLowerCase().includes(requiredSkill.toLowerCase());
  }

  if (Array.isArray(value)) {
    const results = await Promise.all(
      value.map((element) => matchSkills(element, requiredSkill))
    );
    return results.some((res) => res);
  }

  if (typeof value === "object" && value !== null && value !== undefined) {
    const results = await Promise.all(
      Object.values(value).map((subValue) =>
        matchSkills(subValue, requiredSkill)
      )
    );
    return results.some((res) => res);
  }

  return false;
};

const searchCareerChunk = async (
  careerChunk: Chunk,
  jobProfileKey: string
): Promise<boolean> => {
  const results = await Promise.all(
    Object.values(careerChunk).map((chunkValue) =>
      matchSkills(chunkValue, jobProfileKey)
    )
  );
  return results.some((res) => res);
};

export const getRelevantCareerChunks = async (
  careerChunks: Chunk[],
  jobProfileKeys: string[]
): Promise<Chunk[]> => {
  const chunkResults = await Promise.all(
    careerChunks.map((chunk) =>
      Promise.all(jobProfileKeys.map((key) => searchCareerChunk(chunk, key)))
    )
  );
  return careerChunks.filter((_, index) =>
    chunkResults[index].some((res) => res)
  );
};
