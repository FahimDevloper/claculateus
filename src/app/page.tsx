import { getAllCalculatorOverrides } from "@/lib/admin/calculatorOverrides";
import { getSiteSettings } from "@/lib/admin/siteSettings";
import { getTrendingCounts } from "@/lib/admin/analyticsEvents";
import Hero from "@/components/home/Hero";
import RecentlyViewed from "@/components/home/RecentlyViewed";
import CalculatorExplorer from "@/components/home/CalculatorExplorer";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import BlogHighlights from "@/components/home/BlogHighlights";
import Newsletter from "@/components/home/Newsletter";

export default async function Home() {
  const [overrides, settings, trendingCounts] = await Promise.all([
    getAllCalculatorOverrides(),
    getSiteSettings(),
    getTrendingCounts(),
  ]);

  return (
    <div>
      <Hero headline={settings.heroHeadline} subheadline={settings.heroSubheadline} />

      <RecentlyViewed />

      <CalculatorExplorer overrides={overrides} trendingCounts={trendingCounts} />

      <FeaturedCollections />

      <WhyChooseUs />
      <BlogHighlights />
      <Newsletter />
    </div>
  );
}
