import { extract_main_categories, extract_details } from "./extract";

export async function profile_career_chunk(career_chunk: string) {
  const main_categories = await extract_main_categories(career_chunk);
  const details = {};

  for (const category of main_categories) {
    details[category] = await extract_details(category, career_chunk);
  }

  return details;
}
