import { extraction } from "../extract";

export type chunk_score = {
  chunk: string;
  score: number;
};

let regexList: RegExp[] = [];
let isInitialized = false;
let threshold: number;

function init_keywords(job_profile: extraction) {
  // Extract all the important keywords from the job profile
  const tech_skills = job_profile.technical_skills ?? [];
  const non_tech_skills = job_profile.non_technical_skills ?? [];

  const job_keywords = [...tech_skills, ...non_tech_skills];

  // Convert each keyword into a regex and add to the list
  for (const keyword of job_keywords) {
    regexList.push(new RegExp(`\\b${keyword}\\b`, "i"));
  }

  // Set threshold as a proportion of total keywords
  threshold = 0.7 * job_keywords.length;
}

export function analyze_chunk(
  chunk: string,
  job_profile: extraction
): chunk_score {
  // Initialize keywords and regex only if not initialized
  if (!isInitialized) {
    init_keywords(job_profile);
  }

  let match_count = 0;

  // Count the number of keywords that appear in the chunk
  for (const regex of regexList) {
    if (regex.test(chunk)) {
      match_count++;
      if (match_count >= threshold) break; // Early exit
    }
  }

  return {
    chunk: chunk,
    score: match_count,
  };
}

export function is_chunk_worthy(chunk_analysis: chunk_score): boolean {
  return chunk_analysis.score > threshold;
}
