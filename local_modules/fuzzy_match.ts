import { extraction, extractions } from "./extract";
export type entryArray = extractions | string[];
export type entry = string | extraction | extractions;

const matchSkills = (value: entry, requiredSkill: string) => {
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
  } else {
    if (typeof value === "string") {
      if (typeof value === "string" && value.includes(requiredSkill)) {
        return true;
      }
    }
  }
  return false;
};

export const search_career_chunk = (
  career_chunk: extraction,
  job_profile_key: string
): boolean => {
  for (const chunk_key in career_chunk)
    if (matchSkills(career_chunk[chunk_key], job_profile_key)) return true;
  return false;
};
export const get_relevant_career_chunks = (
  career_chunks: extractions,
  job_profile_keys: string[]
) => {
  return [...career_chunks].filter((chunk) => {
    for (const key in job_profile_keys)
      if (search_career_chunk(chunk, key)) return true;
    return false;
  });
};

/*
 * const relevantCareers = getRelevantCareerProfiles(careerProfileArray, jobProfile);
 * console.log(relevantCareers);
 */
