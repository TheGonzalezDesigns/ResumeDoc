import { extraction } from "../extract";

export type chunk_score = {
  chunk: string;
  score: number;
};

// Create a Set for faster keyword lookups
let keywordSet: Set<string> = new Set();
let regexList: RegExp[] = [];

function init_keywords(job_profile: extraction) {
  // Extract all the important keywords from the job profile
  const job_keywords = job_profile.technical_skills.concat(
    job_profile.non_technical_skills
  );

  keywordSet = new Set(job_keywords);
  regexList = Array.from(keywordSet).map(
    (keyword) => new RegExp(`\\b${keyword}\\b`, "i")
  );
}

export function analyze_chunk(
  chunk: string,
  job_profile: extraction
): chunk_score {
  // Initialize keywords and regex only if not initialized
  if (keywordSet.size === 0) {
    init_keywords(job_profile);
  }

  let match_count = 0;

  // Count the number of keywords that appear in the chunk
  for (const regex of regexList) {
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
