import { extract_main_categories, extract_details } from "./extract";
import { extraction_keys, meta } from "../extract";

export async function profile_career_chunk(
  career_chunk: string
): Promise<meta> {
  const main_categories = await extract_main_categories(career_chunk);
  // Create an empty extraction object
  const extraction: extraction_keys = {};

  // Use Promise.all to extract details for each category in parallel
  await Promise.all(
    main_categories.map(async (category) => {
      extraction[category] = await extract_details(category, career_chunk);
    })
  );

  const meta_extraction: meta = {
    raw_data: career_chunk,
    categories: extraction,
  };

  return meta_extraction;
}
