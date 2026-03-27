"use client";
import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { SearchFilters, Category } from "@/types";
import { CATEGORIES } from "@/types";

interface Props {
  onFilter?: (f: SearchFilters) => void;
  initialFilters?: SearchFilters;
  showCategoryFilter?: boolean;
}

export default function SearchFilters({ onFilter, initialFilters, showCategoryFilter = true }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const [query,    setQuery]    = useState(initialFilters?.query    ?? params.get("q")        ?? "");
  const [category, setCategory] = useState<Category | "all">(initialFilters?.category ?? (params.get("category") as Category) ?? "all");
  const [location, setLocation] = useState(initialFilters?.location ?? params.get("location") ?? "");
  const [minPrice, setMinPrice] = useState(initialFilters?.min_price?.toString() ?? "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.max_price?.toString() ?? "");
  const [open,     setOpen]     = useState(false);

  const hasFilters = category !== "all" || location || minPrice || maxPrice;

  const apply = () => {
    const f: SearchFilters = {
      query:     query || undefined,
      category:  category !== "all" ? category : undefined,
      location:  location || undefined,
      min_price: minPrice ? Number(minPrice) : undefined,
      max_price: maxPrice ? Number(maxPrice) : undefined,
    };
    if (onFilter) {
      onFilter(f);
    } else {
      const p = new URLSearchParams();
      if (query)    p.set("q", query);
      if (category !== "all") p.set("category", category);
      if (location) p.set("location", location);
      if (minPrice) p.set("min", minPrice);
      if (maxPrice) p.set("max", maxPrice);
      router.push(`/search?${p.toString()}`);
    }
    setOpen(false);
  };

  const reset = () => {
    setQuery(""); setCategory("all"); setLocation(""); setMinPrice(""); setMaxPrice("");
    onFilter?.({});
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-4">
      {/* Main search row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            placeholder='Search e.g. "Dairy cow", "Chicken feed", "Vet Meru"'
            className="input pl-9" />
        </div>
        <button onClick={() => setOpen(!open)}
          className={`btn-secondary gap-1.5 shrink-0 ${hasFilters ? "border-brand-400 text-brand-700" : ""}`}>
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {hasFilters && <span className="w-2 h-2 bg-brand-500 rounded-full" />}
        </button>
        <button onClick={apply} className="btn-primary shrink-0">Search</button>
      </div>

      {/* Expanded filters */}
      {open && (
        <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {showCategoryFilter && (
            <div>
              <label className="label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Category | "all")} className="select">
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="label">Location</label>
            <input value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Meru, Nairobi..." className="input" />
          </div>

          <div>
            <label className="label">Min Price (KES)</label>
            <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              type="number" placeholder="0" className="input" />
          </div>

          <div>
            <label className="label">Max Price (KES)</label>
            <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              type="number" placeholder="Any" className="input" />
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex gap-2 justify-end">
            {hasFilters && (
              <button onClick={reset} className="btn-danger">
                <X size={14} /> Clear Filters
              </button>
            )}
            <button onClick={apply} className="btn-primary px-6">Apply Filters</button>
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {category !== "all" && (
            <span className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-medium px-3 py-1 rounded-full">
              {CATEGORIES.find(c => c.key === category)?.emoji} {CATEGORIES.find(c => c.key === category)?.label}
              <button onClick={() => setCategory("all")}><X size={10} /></button>
            </span>
          )}
          {location && (
            <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
              📍 {location} <button onClick={() => setLocation("")}><X size={10} /></button>
            </span>
          )}
          {(minPrice || maxPrice) && (
            <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full">
              💰 KES {minPrice || "0"} – {maxPrice || "∞"}
              <button onClick={() => { setMinPrice(""); setMaxPrice(""); }}><X size={10} /></button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
