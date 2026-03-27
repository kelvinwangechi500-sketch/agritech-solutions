"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SearchFilters from "@/components/marketplace/SearchFilters";
import ItemGrid from "@/components/marketplace/ItemGrid";
import { MOCK_ITEMS } from "@/lib/mock-data";
import type { Item, SearchFilters as SF } from "@/types";

const USE_MOCK = true;

function SearchContent() {
  const params  = useSearchParams();
  const [items,   setItems]   = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [total,   setTotal]   = useState(0);

  const runSearch = async (f: SF = {}) => {
    setLoading(true);
    try {
      if (USE_MOCK) {
        let r = [...MOCK_ITEMS];
        if (f.query)    r = r.filter(i => `${i.title} ${i.description} ${i.location} ${i.subcategory}`.toLowerCase().includes(f.query!.toLowerCase()));
        if (f.category && f.category !== "all") r = r.filter(i => i.category === f.category);
        if (f.location) r = r.filter(i => i.location.toLowerCase().includes(f.location!.toLowerCase()));
        if (f.min_price) r = r.filter(i => (i.price ?? 0) >= f.min_price!);
        if (f.max_price) r = r.filter(i => (i.price ?? 0) <= f.max_price!);
        if (f.status)   r = r.filter(i => i.status === f.status);
        setItems(r); setTotal(r.length);
      } else {
        const { getItems } = await import("@/lib/api");
        const data = await getItems(f);
        setItems(data); setTotal(data.length);
      }
    } finally { setLoading(false); }
  };

  useEffect(() => {
    runSearch({
      query:    params.get("q")        ?? undefined,
      category: (params.get("category") as any) ?? undefined,
      location: params.get("location") ?? undefined,
      min_price: params.get("min") ? Number(params.get("min")) : undefined,
      max_price: params.get("max") ? Number(params.get("max")) : undefined,
    });
  }, [params.toString()]);

  const q = params.get("q");

  return (
    <>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">
          {q ? `Results for "${q}"` : "Browse All Listings"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{loading ? "Searching..." : `${total} item${total !== 1 ? "s" : ""} found`}</p>
      </div>

      <SearchFilters
        onFilter={runSearch}
        initialFilters={{
          query:    params.get("q")        ?? undefined,
          category: (params.get("category") as any) ?? "all",
          location: params.get("location") ?? undefined,
        }}
      />

      <div className="mt-6">
        <ItemGrid items={items} loading={loading}
          emptyMessage={q ? `No results for "${q}"` : "No items match your filters"}
          emptyEmoji="🔍" />
      </div>
    </>
  );
}

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="page-container py-8">
        <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading search...</div>}>
          <SearchContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
