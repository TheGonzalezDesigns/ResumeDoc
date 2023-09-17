import { contextual_analysis } from "./fuzzy_match";

type job_profile_type = {
  technical_skill_array: string[];
  non_technical_skill_array: string[];
  career_achievements_array: string[];
  career_experience_array: string[];
  career_projects_array: string[];
};

type career_history_segment_type = {
  technical_skill_array: string[];
  non_technical_skill_array: string[];
  career_achievements_array: string[];
  career_experience_array: string[];
  career_projects_array: string[];
};

export function analyze_career(
  job_profile: job_profile_type,
  career_history_segments: career_history_segment_type[]
): career_history_segment_type[] {
  const relevant_segments: career_history_segment_type[] = [];
  const threshold = 5; // This threshold can be adjusted

  for (const segment of career_history_segments) {
    const score = contextual_analysis(
      job_profile.technical_skill_array,
      segment.technical_skill_array.join(" ")
    );
    if (score > threshold) {
      relevant_segments.push(segment);
    }
  }

  return relevant_segments;
}
