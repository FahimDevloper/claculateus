export type PostStatus = "draft" | "scheduled" | "published";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  featuredImageUrl?: string;
  category: string;
  tags: string[];
  authorName: string;
  authorBio?: string;
  status: PostStatus;
  scheduledFor?: number | null;
  publishedAt?: number | null;
  seoTitle?: string;
  seoDescription?: string;
  focusKeyword?: string;
  readingTimeMinutes: number;
  createdAt: number;
  updatedAt: number;
}

export interface BlogComment {
  id: string;
  authorUid: string;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface BlogCategoryMeta {
  slug: string;
  title: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategoryMeta[] = [
  { slug: "personal-finance", title: "Personal Finance", description: "Budgeting, saving, and making sense of money math." },
  { slug: "health-fitness", title: "Health & Fitness", description: "Nutrition, training, and body metrics explained." },
  { slug: "study-productivity", title: "Study & Productivity", description: "GPA, grades, time management, and study tips." },
  { slug: "guides", title: "Guides", description: "In-depth how-tos for getting the most out of Calculateus." },
  { slug: "product-updates", title: "Product Updates", description: "New calculators, features, and site improvements." },
];

export function getBlogCategory(slug: string): BlogCategoryMeta | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}
