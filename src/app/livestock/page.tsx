import type { Metadata } from "next";
import CategoryPage from "@/components/marketplace/CategoryPage";
import { getCategoryMeta } from "@/types";

export const metadata: Metadata = {
  title: "Livestock for Sale in Kenya – Cows, Sheep, Goats, Poultry",
  description: "Buy and sell livestock in Kenya. Cows, sheep, goats, poultry and more. Verified sellers, fair prices.",
};

export default function LivestockPage() {
  return <CategoryPage category="livestock" meta={getCategoryMeta("livestock")} />;
}
