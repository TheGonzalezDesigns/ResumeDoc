import { extraction } from "../extract";

export type chunk_score = {
  chunk: string;
  score: number;
};

let keywordSet: Set<RegExp> = new Set();
let isInitialized = false;

function init_keywords(job_profile: extraction) {
  // Extract all the important keywords from the job profile
  const job_keywords = [
    ...job_profile.technical_skills,
    ...job_profile.non_technical_skills,
  ];

  // Convert each keyword into a regex and add to the set
  for (const keyword of job_keywords) {
    keywordSet.add(new RegExp(`\\b${keyword}\\b`, "i"));
  }

  isInitialized = true;
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
  for (const regex of keywordSet) {
    if (regex.test(chunk)) {
      match_count++;
    }
  }

  return {
    chunk: chunk,
    score: match_count,
  };
}

export function is_chunk_worthy(chunk_analysis: chunk_score): boolean {
  const threshold = 0.7; // adjustable
  return chunk_analysis.score > threshold;
}
