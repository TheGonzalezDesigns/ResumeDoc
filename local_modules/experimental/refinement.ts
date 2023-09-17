export async function refineExtraction(text: string, iterations: number = 3) {
  let currentText = text;
  for (let i = 0; i < iterations; i++) {
    currentText = await profileCareerChunk(currentText);
  }

  return currentText;
}
