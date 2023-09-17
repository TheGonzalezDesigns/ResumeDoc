import { weighted_keyword_matching, contextual_analysis } from "./fuzzy_match";

export function analyze_career(job_profile, career_history_segments) {
  const keywords = job_profile.technical_skills; // extend this to include more from the job profile if needed
  let relevantSegments = [];

  for (const segment of career_history_segments) {
    const score = contextual_analysis(keywords, segment);
    if (score > 0) {
      relevantSegments.push(segment);
    }
  }

  return relevantSegments;
}
