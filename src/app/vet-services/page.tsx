import type { Metadata } from "next";
import CategoryPage from "@/components/marketplace/CategoryPage";
import { getCategoryMeta } from "@/types";

export const metadata: Metadata = {
  title: "Veterinary Services Kenya – Find Vets Near You",
  description: "Find qualified veterinarians and animal health services near you in Kenya. Vaccination, treatment, AI services and more.",
};

export default function VetServicesPage() {
  return <CategoryPage category="vet" meta={getCategoryMeta("vet")} />;
}
