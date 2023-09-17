import { extraction_keys } from "../extract";

type AnalysisResult = {
  coverage_score: number;
  relevance_score: number;
  granularity_score: number;
};

export function meta_analysis(
  extracted_data: extraction_keys[],
  job_profile: extraction_keys,
  original_data_dump: string
): AnalysisResult {
  const coverage_score = compute_coverage(extracted_data, original_data_dump);
  const relevance_score = compute_relevance(extracted_data, job_profile);
  const granularity_score = compute_granularity(extracted_data);

  return {
    coverage_score: coverage_score,
    relevance_score: relevance_score,
    granularity_score: granularity_score,
  };
}

function compute_coverage(
  extracted_data: extraction_keys[],
  original_data_dump: string
): number {
  // Calculate the proportion of the original data dump that was successfully categorized.
  const total_words = original_data_dump.split(/\s+/).length;
  const extracted_words = extracted_data
    .map((data) => Object.values(data).join(" ").split(/\s+/).length)
    .reduce((a, b) => a + b, 0);

  return (extracted_words / total_words) * 100; // return as a percentage
}

function compute_relevance(
  extracted_data: extraction_keys[],
  job_profile: extraction_keys
): number {
  // Score how relevant the extracted data is to the job profile.
  const job_keywords = Object.values(job_profile).flat();
  let match_count = 0;

  for (const keyword of job_keywords) {
    for (const data of extracted_data) {
      for (const value of Object.values(data)) {
        if (value.includes(keyword)) {
          match_count++;
        }
      }
    }
  }

  return (match_count / job_keywords.length) * 100; // return as a percentage
}

function compute_granularity(extracted_data: extraction_keys[]): number {
  // Assess the granularity of the extracted data.
  const total_chunks = extracted_data.length;
  const total_words = extracted_data
    .map((data) => Object.values(data).join(" ").split(/\s+/).length)
    .reduce((a, b) => a + b, 0);

  return total_words / total_chunks; // return average words per chunk
}
