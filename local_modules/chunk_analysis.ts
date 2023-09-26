import { extraction } from "./extract";
import { expand_keywords } from "./expand_keywords";

export type chunk_score = {
  chunk: string;
  score: number;
};

/**
 * Initializes the analysis parameters based on the given job profile.
 *
 * @param {extraction} job_profile - The job profile containing technical and non-technical skills.
 * @returns {Promise<{regex_list: RegExp[], threshold: number}>} An object containing the regex list and threshold for chunk analysis.
 */
export const initialize_analysis = async (
  job_profile: extraction
): Promise<{ regex_list: RegExp[]; threshold: number }> => {
  const tech_skills = job_profile.technical_skills ?? [];
  const non_tech_skills = job_profile.non_technical_skills ?? [];

  // Filter out empty or null keywords
  const job_keywords = [...tech_skills, ...non_tech_skills].filter(Boolean);

  // Expand the keywords using a predefined function
  const expanded_keywords = await expand_keywords(job_keywords);

  // Escape special regex characters in keywords
  const escapeRegExp = (string: string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Split each keyword by various delimiters to get individual words
  const individual_words = expanded_keywords
    .map((keyword) => keyword.split(/[\s/._\&@#%^]+/))
    .flat();

  // Combine original phrases with their individual components
  const combined_keywords = [
    ...new Set([...expanded_keywords, ...individual_words]),
  ];

  // Create regex list based on combined keywords
  const regex_list: RegExp[] = combined_keywords.map(
    (word) => new RegExp(`\\b${escapeRegExp(word)}\\b`, "i")
  );

  // Calculate threshold based on the length of combined keywords
  const threshold_coefficient = 0.075;
  const threshold = threshold_coefficient * combined_keywords.length;

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
