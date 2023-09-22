import { extraction } from "../extract";

export type chunk_score = {
  chunk: string;
  score: number;
};

// Initialize analysis with regex list and threshold
export const initialize_analysis = (job_profile: extraction) => {
  // Extract all the important keywords from the job profile
  const tech_skills = job_profile.technical_skills ?? [];
  const non_tech_skills = job_profile.non_technical_skills ?? [];

  let regexList: RegExp[] = [];
  let threshold: number;
  const job_keywords = [...tech_skills, ...non_tech_skills];

  // Convert each keyword into a regex and add to the list
  regexList = [...job_keywords].map(
    (keyword) => new RegExp(`\\b${keyword}\\b`, "i")
  );

  // Set threshold as a proportion of total keywords
  const threshold_coefficient = 0.15;
  threshold = threshold_coefficient * job_keywords.length;

  return {
    regexList,
    threshold,
  };
};

// Analyze a chunk of text for keyword matches
export const analyze_chunk = (
  chunk: string,
  regexList: RegExp[],
  threshold: number
): chunk_score => {
  let match_count = 0;

  // Count the number of keywords that appear in the chunk
  for (const regex of regexList) {
    if (regex.test(chunk)) {
      match_count++;
      if (match_count >= threshold) break; // Early exit if threshold is met
    }
  }

  return {
    chunk: chunk,
    score: match_count,
  };
};

// Check if a chunk is worthy based on its analysis
export function is_chunk_worthy(
  chunk_analysis: chunk_score,
  threshold: number
): boolean {
  return chunk_analysis.score > threshold;
}
