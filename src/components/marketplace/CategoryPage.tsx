"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchFilters from "@/components/marketplace/SearchFilters";
import ItemGrid from "@/components/marketplace/ItemGrid";
import { MOCK_ITEMS } from "@/lib/mock-data";
import type { Item, Category, SearchFilters as SF, CategoryMeta } from "@/types";

const USE_MOCK = true;

interface Props { category: Category; meta: CategoryMeta; }

export default function CategoryPage({ category, meta }: Props) {
  const [items,   setItems]   = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (f?: SF) => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        let r = MOCK_ITEMS.filter(i => i.category === category);
        if (f?.query)    r = r.filter(i => `${i.title} ${i.description} ${i.location}`.toLowerCase().includes(f.query!.toLowerCase()));
        if (f?.location) r = r.filter(i => i.location.toLowerCase().includes(f.location!.toLowerCase()));
        if (f?.min_price) r = r.filter(i => (i.price ?? 0) >= f.min_price!);
        if (f?.max_price) r = r.filter(i => (i.price ?? 0) <= f.max_price!);
        setItems(r);
      } else {
        const { getItems } = await import("@/lib/api");
        setItems(await getItems({ ...f, category }));
      }
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <Navbar />

      {/* Category hero */}
      <div className={`border-b border-gray-100 bg-gradient-to-r ${
        category === "livestock" ? "from-green-50 to-green-100" :
        category === "vet"       ? "from-blue-50 to-blue-100"   :
        category === "feeds"     ? "from-amber-50 to-amber-100" :
                                   "from-purple-50 to-purple-100"
      }`}>
        <div className="page-container py-8">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{meta.emoji}</span>
            <div>
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900">{meta.label}</h1>
              <p className="text-gray-600 text-sm mt-0.5">{meta.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {meta.subcategories.map(sub => (
                  <span key={sub}
                    onClick={() => load({ subcategory: sub })}
                    className="text-xs font-medium px-2.5 py-1 rounded-full bg-white border border-gray-200 cursor-pointer hover:border-brand-400 hover:text-brand-700 transition-all">
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="page-container py-8">
        <div className="mb-6">
          <p className="text-gray-500 text-sm">{items.length} listing{items.length !== 1 ? "s" : ""} available</p>
        </div>
        <SearchFilters onFilter={(f) => load(f)} showCategoryFilter={false} />
        <div className="mt-6">
          <ItemGrid items={items} loading={loading}
            emptyMessage={`No ${meta.label.toLowerCase()} listed yet`}
            emptyEmoji={meta.emoji} />
        </div>
      </main>
      <Footer />
    </>
  );
}
