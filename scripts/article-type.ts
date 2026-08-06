export interface DraftArticle {
  title: string;
  excerpt: string;
  category: string; // blog category slug
  tags: string[];
  calcSlug: string; // calculator this article links to
  cat6: string; // calculator category, used for the hero image
  seoTitle: string;
  seoDescription: string;
  contentMarkdown: string;
}
