import type { Metadata } from "next";
import CategoryPage from "@/components/marketplace/CategoryPage";
import { getCategoryMeta } from "@/types";

export const metadata: Metadata = {
  title: "Animal Feeds Kenya – Dairy Meal, Poultry Feed, Hay & More",
  description: "Buy quality animal feeds in Kenya. Dairy meal, poultry feed, hay, silage and mineral supplements. Delivered to your farm.",
};

export default function FeedsPage() {
  return <CategoryPage category="feeds" meta={getCategoryMeta("feeds")} />;
}
