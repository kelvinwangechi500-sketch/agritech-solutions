// ── Categories ────────────────────────────────────────
export type Category = "livestock" | "vet" | "feeds" | "products";
export type ItemStatus = "available" | "sold";
export type ItemType = "product" | "service";

// ── Core Item (unified table for all categories) ──────
export interface Item {
  id: string;
  title: string;
  category: Category;
  type: ItemType;
  subcategory?: string;        // e.g. "cow", "sheep", "goat", "poultry"
  breed?: string;
  age?: number;
  weight?: number;
  price?: number;
  price_negotiable?: boolean;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  contact_phone?: string;
  status: ItemStatus;
  created_at: string;
  images?: ItemImage[];
  // vet-specific
  services_offered?: string;
  availability?: string;
  // feeds-specific
  feed_type?: string;
  quantity_available?: string;
  // products-specific
  product_type?: string;
  unit?: string;
}

export interface ItemImage {
  id: string;
  item_id: string;
  url: string;
  created_at: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  item_id?: string;
  message: string;
  created_at: string;
  item?: Pick<Item, "title" | "category">;
}

export interface FarmerRequest {
  id: string;
  name: string;
  phone: string;
  category?: Category;
  request_text: string;
  status: "pending" | "responded";
  created_at: string;
}

// ── Filter types ──────────────────────────────────────
export interface SearchFilters {
  query?: string;
  category?: Category | "all";
  subcategory?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  status?: ItemStatus;
}

// ── Category metadata ─────────────────────────────────
export interface CategoryMeta {
  key: Category;
  label: string;
  emoji: string;
  description: string;
  color: string;
  subcategories: string[];
}

export const CATEGORIES: CategoryMeta[] = [
  {
    key: "livestock",
    label: "Livestock",
    emoji: "🐄",
    description: "Cows, sheep, goats, poultry and more",
    color: "bg-green-50 text-green-700 border-green-200",
    subcategories: ["Cow", "Sheep", "Goat", "Poultry", "Pig", "Rabbit", "Other"],
  },
  {
    key: "vet",
    label: "Veterinary Services",
    emoji: "🩺",
    description: "Vets, clinics and animal health professionals",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    subcategories: ["General Practice", "Surgery", "Vaccination", "Dairy Health", "Livestock Vet", "Mobile Vet"],
  },
  {
    key: "feeds",
    label: "Animal Feeds",
    emoji: "🌾",
    description: "Quality feeds for all livestock types",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    subcategories: ["Dairy Meal", "Poultry Feed", "Pig Feed", "Sheep/Goat Feed", "Hay & Silage", "Mineral Supplements"],
  },
  {
    key: "products",
    label: "Livestock Products",
    emoji: "🥛",
    description: "Milk, hides, eggs, manure and more",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    subcategories: ["Milk", "Eggs", "Hides & Skins", "Manure", "Honey", "Meat", "Other"],
  },
];

export function getCategoryMeta(key: Category): CategoryMeta {
  return CATEGORIES.find((c) => c.key === key) ?? CATEGORIES[0];
}
