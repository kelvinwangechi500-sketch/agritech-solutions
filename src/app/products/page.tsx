import type { Metadata } from "next";
import CategoryPage from "@/components/marketplace/CategoryPage";
import { getCategoryMeta } from "@/types";

export const metadata: Metadata = {
  title: "Livestock Products Kenya – Milk, Eggs, Hides, Manure",
  description: "Buy and sell livestock products in Kenya. Fresh milk, eggs, hides, manure, honey and more from verified farmers.",
};

export default function ProductsPage() {
  return <CategoryPage category="products" meta={getCategoryMeta("products")} />;
}
