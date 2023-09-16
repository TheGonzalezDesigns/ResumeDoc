export function weightedKeywordMatching(
  keywords: string[],
  text: string
): number {
  const weights = {
    technical_skill: 1.5,
    non_technical_skill: 1,
    career_experience: 1,
    career_achievement: 1,
    career_projects: 1,
  };

  let score = 0;

  for (const keyword of keywords) {
    if (text.includes(keyword)) {
      score += weights[keyword] || 1;
    }
  }

  return score;
}

export function contextualAnalysis(keywords: string[], text: string): number {
  // Additional context analysis can be added here.
  return weightedKeywordMatching(keywords, text);
}
