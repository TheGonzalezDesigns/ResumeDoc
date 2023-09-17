import { extraction } from "../extract";

export type chunk_score = {
  chunk: string;
  score: number;
};

export function analyze_chunk(
  chunk: string,
  job_profile: extraction
): chunk_score {
  // Extract all the important keywords from the job profile
  const job_keywords = job_profile.technical_skills.concat(
    job_profile.non_technical_skills
  );

  let match_count = 0;

  // Count the number of keywords that appear in the chunk
  for (const keyword of job_keywords) {
    const regex = new RegExp(`\\b${keyword}\\b`, "i"); // Match whole word, case-insensitive
    if (regex.test(chunk)) {
      match_count++;
    }
  }

  // For this example, the score is simply the count of matches.
  // This can be enhanced with more sophisticated scoring mechanisms if desired.
  const score = match_count;

  return {
    chunk: chunk,
    score: score,
  };
}

export function is_chunk_worthy(chunk_analysis: extraction) {
  const threshold = 0.7; // adjustable
  return chunk_analysis.score > threshold;
}
