import { extraction } from "./extract";

export type chunk_score = {
  chunk: string;
  score: number;
};

/**
 * Initializes the analysis parameters based on the given job profile.
 *
 * @param {extraction} job_profile - The job profile containing technical and non-technical skills.
 * @returns {{regexList: RegExp[], threshold: number}} An object containing the regex list and threshold for chunk analysis.
 */
export const initialize_analysis = (
  job_profile: extraction
): { regex_list: RegExp[]; threshold: number } => {
  const tech_skills = job_profile.technical_skills ?? [];
  const non_tech_skills = job_profile.non_technical_skills ?? [];
  let regex_list: RegExp[] = [];
  const job_keywords = [...tech_skills, ...non_tech_skills];
  regex_list = job_keywords.map(
    (keyword) => new RegExp(`\\b${keyword}\\b`, "i")
  );
  const threshold_coefficient = 0.15;
  const threshold = threshold_coefficient * job_keywords.length;

  return {
    regex_list,
    threshold,
  };
};

/**
 * Analyzes a chunk of text for keyword matches based on the given regex list and threshold.
 *
 * @param {string} chunk - The text chunk to be analyzed.
 * @param {RegExp[]} regex_list - The list of regular expressions for keyword matching.
 * @param {number} threshold - The minimum score needed for a chunk to be accepted.
 * @returns {chunk_score} An object containing the chunk and its score.
 */
export const analyze_chunk = (
  chunk: string,
  regex_list: RegExp[],
  threshold: number
): chunk_score => {
  let match_count = 0;
  for (const regex of regex_list) {
    if (regex.test(chunk)) {
      match_count++;
      if (match_count >= threshold) break;
    }
  }
  return {
    chunk,
    score: match_count,
  };
};
