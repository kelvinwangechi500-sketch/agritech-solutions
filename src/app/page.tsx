"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, Search, Star, Truck, Shield } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ItemGrid from "@/components/marketplace/ItemGrid";
import { CATEGORIES } from "@/types";
import { MOCK_ITEMS } from "@/lib/mock-data";
import type { Item } from "@/types";

const USE_MOCK = true;

export default function HomePage() {
  const [featured, setFeatured] = useState<Item[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (USE_MOCK) {
          setFeatured(MOCK_ITEMS.slice(0, 8));
        } else {
          const { getFeaturedItems } = await import("@/lib/api");
          setFeatured(await getFeaturedItems());
        }
      } finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <>
      <Navbar />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E\")" }} />

        <div className="page-container relative py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-sm font-medium mb-5">
              🇰🇪 <span className="text-white/90">Kenya's #1 Agricultural Platform</span>
            </div>
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
              AgriTech Marketplace
              <br />
              <span className="text-amber-300">Your One-Stop Agricultural</span>
              <br />Platform in Kenya
            </h1>
            <p className="text-brand-100 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Buy livestock, find vet services, order feeds and sell farm products — all in one place. Connecting farmers to what they need.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/search" className="btn-primary bg-amber-500 hover:bg-amber-600 shadow-none text-base py-3.5 px-7">
                Browse Marketplace <ArrowRight size={18} />
              </Link>
              <Link href="/request" className="inline-flex items-center justify-center gap-2 border-2 border-white/30 hover:border-white text-white font-semibold py-3.5 px-7 rounded-xl transition-all text-base">
                📋 Request an Item
              </Link>
            </div>

            <div className="flex flex-wrap gap-5">
              {[{ icon: Shield, label: "Verified Listings" }, { icon: Star, label: "Trusted Sellers" }, { icon: Truck, label: "Kenya-Wide" }].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm text-brand-200">
                  <Icon size={14} className="text-amber-300" /> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="page-container py-4">
          <div className="grid grid-cols-4 divide-x divide-gray-100 text-center">
            {[
              { value: "500+", label: "Listings" },
              { value: "4",    label: "Categories" },
              { value: "47",   label: "Counties" },
              { value: "1K+",  label: "Farmers" },
            ].map(({ value, label }) => (
              <div key={label} className="px-4 py-2">
                <p className="font-display font-extrabold text-xl sm:text-2xl text-brand-700">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ───────────────────────── */}
      <section className="page-container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => {
            const href = cat.key === "vet" ? "/vet-services" : `/${cat.key}`;
            const colors: Record<string, string> = {
              livestock: "from-green-50 to-green-100 border-green-200 hover:border-green-400",
              vet:       "from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400",
              feeds:     "from-amber-50 to-amber-100 border-amber-200 hover:border-amber-400",
              products:  "from-purple-50 to-purple-100 border-purple-200 hover:border-purple-400",
            };
            const countByCategory: Record<string, number> = { livestock: 5, vet: 3, feeds: 4, products: 4 };
            return (
              <Link key={cat.key} href={href}
                className={`card border bg-gradient-to-br ${colors[cat.key]} p-5 flex flex-col items-center text-center gap-3 transition-all hover:-translate-y-1`}>
                <span className="text-4xl sm:text-5xl">{cat.emoji}</span>
                <div>
                  <p className="font-display font-bold text-gray-900 text-sm sm:text-base">{cat.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{cat.description}</p>
                  <p className="text-xs font-semibold text-brand-600 mt-1">{countByCategory[cat.key]} listings →</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED LISTINGS ────────────────────── */}
      <section className="page-container pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Featured Listings</h2>
            <p className="text-gray-500 text-sm mt-1">Latest additions to the marketplace</p>
          </div>
          <Link href="/search" className="btn-secondary text-sm">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <ItemGrid items={featured} loading={loading} />
      </section>

      {/* ── REQUEST BANNER ───────────────────────── */}
      <section className="page-container pb-12">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-2">Can't find what you need?</h2>
            <p className="text-amber-100 text-sm sm:text-base max-w-md">
              Submit a request and we'll connect you with the right seller or service provider in Kenya.
            </p>
          </div>
          <Link href="/request"
            className="bg-white text-amber-600 font-bold px-8 py-3.5 rounded-xl hover:bg-amber-50 transition-all whitespace-nowrap text-sm shadow-lg shrink-0">
            📋 Request Now
          </Link>
        </div>
      </section>

      {/* ── MAP SECTION ──────────────────────────── */}
      <section className="page-container pb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title">📍 Listings Near You</h2>
        </div>
        <div className="card overflow-hidden p-1">
          <MapWrapper items={MOCK_ITEMS.filter(i => i.latitude && i.longitude)} />
        </div>
      </section>

      <Footer />
    </>
  );
}

function MapWrapper({ items }: { items: Item[] }) {
  const [Map, setMap] = useState<any>(null);
  useEffect(() => { import("@/components/marketplace/MarketplaceMap").then(m => setMap(() => m.default)); }, []);
  if (!Map) return <div className="h-80 flex items-center justify-center text-gray-400 text-sm">Loading map...</div>;
  return (
    <Map
      markers={items.map(i => ({ id: i.id, lat: i.latitude!, lng: i.longitude!, title: i.title, price: i.price, category: i.category }))}
      height="400px"
    />
  );
}
