import { extract_main_categories, extract_details } from "./extract";
import { extraction_keys, meta } from "../extract";
import { debug, log } from "../experimental/debug";

export async function profile_career_chunk(
  career_chunk: string
): Promise<meta> {
  const main_categories = await extract_main_categories(career_chunk);
  //log(main_categories, `main_categories`);
  // Create an empty extraction object
  const extraction: extraction_keys = {};

  // Use Promise.all to extract details for each category in parallel
  await Promise.all(
    main_categories.map(async (category) => {
      extraction[category] = await extract_details(category, career_chunk);
      log(
        { category, extraction: extraction[category] },
        `profiling ${category}`
      );
    })
  );

  const meta_extraction: meta = {
    raw_data: career_chunk,
    categories: extraction,
  };

  return meta_extraction;
}
