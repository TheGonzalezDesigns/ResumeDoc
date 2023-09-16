import { extract_main_categories, extract_details } from "./extract";

type extraction_keys = {
  [key: string]: string[];
};

export async function profile_career_chunk(
  career_chunk: string
): Promise<extraction_keys> {
  const mainCategories = await extract_main_categories(career_chunk);

  const extraction: extraction_keys = {};

  for (const category of mainCategories) {
    extraction[category] = await extract_details(category, career_chunk);
  }

  return extraction;
}
