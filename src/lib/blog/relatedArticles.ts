import { CategorySlug } from "@/lib/calculators/types";
import { getPublishedPosts } from "./queries";
import { BlogPost } from "./types";

// Maps a calculator category to the blog category most likely to have
// genuinely relevant articles. Categories without a sensible mapping are
// omitted on purpose rather than pointed at an unrelated blog section.
const CALCULATOR_TO_BLOG_CATEGORY: Partial<Record<CategorySlug, string>> = {
  financial: "personal-finance",
  tax: "personal-finance",
  health: "health-fitness",
  math: "study-productivity",
  everyday: "study-productivity",
};

export async function getRelatedArticles(calculatorCategory: CategorySlug, max = 3): Promise<BlogPost[]> {
  const blogCategory = CALCULATOR_TO_BLOG_CATEGORY[calculatorCategory];
  if (!blogCategory) return [];
  return getPublishedPosts({ category: blogCategory, max }).catch(() => []);
}
