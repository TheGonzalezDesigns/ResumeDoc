type Chunk = {
  [key: string]: any;
};

const log = (msg: string): void => {
  console.info(`EVENT: ${msg}\n`);
};

const matchSkills = (value: any, requiredSkill: string): boolean => {
  if (typeof value === "object") {
    if (Array.isArray(value)) {
      for (const element of value) {
        if (matchSkills(element, requiredSkill)) {
          return true;
        }
      }
    } else {
      for (const key in value) {
        if (matchSkills(value[key], requiredSkill)) {
          return true;
        }
      }
    }
  } else if (typeof value === "string") {
    if (value.toLowerCase().includes(requiredSkill.toLowerCase())) {
      //log(`${value} === ${requiredSkill}`);
      return true;
    } else {
      //log(`${value} !!! ${requiredSkill}`);
    }
  }
  return false;
};

const searchCareerChunk = (
  careerChunk: Chunk,
  jobProfileKey: string
): boolean => {
  for (const chunkKey in careerChunk) {
    if (matchSkills(careerChunk[chunkKey], jobProfileKey)) {
      return true;
    }
  }
  return false;
};

export const getRelevantCareerChunks = (
  careerChunks: Chunk[],
  jobProfileKeys: string[]
): Chunk[] => {
  const results: Chunk[] = [];
  for (const chunk of careerChunks) {
    for (const asset of jobProfileKeys) {
      //console.info(`chunk: ${JSON.stringify(chunk)} |>?<| key: ${asset}`);
      if (searchCareerChunk(chunk, asset)) {
        results.push(chunk);
        break; // Move to the next chunk once a match is found
      }
    }
  }
  return results;
};
