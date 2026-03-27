"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, MessageCircle, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/types";

export default function Navbar() {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      {/* Top bar */}
      <div className="bg-brand-700 text-white text-xs py-1.5 text-center font-medium">
        🇰🇪 Kenya's #1 Agricultural Marketplace — Connecting Farmers to What They Need
      </div>

      <nav className="page-container">
        <div className="flex items-center gap-3 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-xl">🌾</div>
            <div className="hidden sm:block">
              <p className="font-display font-bold text-brand-800 text-base leading-tight">AgriTech</p>
              <p className="text-[10px] font-semibold text-amber-600 tracking-widest uppercase leading-tight">Marketplace</p>
            </div>
          </Link>

          {/* Search bar */}
          <form onSubmit={search} className="flex-1 max-w-2xl mx-2 sm:mx-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search livestock, feeds, vet services..."
                className="w-full pl-9 pr-20 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 bg-gray-50 focus:bg-white transition-all"
              />
              <button type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors">
                Search
              </button>
            </div>
          </form>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link href="/request"
              className="btn-secondary text-xs py-2 px-3">
              📋 Request Item
            </Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254712345678"}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-whatsapp text-xs py-2 px-3">
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 shrink-0">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Category nav */}
        <div className="hidden md:flex items-center gap-1 pb-2 overflow-x-auto">
          <Link href="/" className="text-xs font-medium text-gray-500 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-all whitespace-nowrap">
            All Items
          </Link>
          {CATEGORIES.map((cat) => (
            <Link key={cat.key} href={`/${cat.key === "vet" ? "vet-services" : cat.key}`}
              className="text-xs font-medium text-gray-600 hover:text-brand-700 px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-all whitespace-nowrap flex items-center gap-1.5">
              <span>{cat.emoji}</span> {cat.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1">
          {CATEGORIES.map((cat) => (
            <Link key={cat.key} href={`/${cat.key === "vet" ? "vet-services" : cat.key}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-all">
              <span className="text-xl">{cat.emoji}</span>
              <div>
                <p className="font-semibold">{cat.label}</p>
                <p className="text-xs text-gray-400">{cat.description}</p>
              </div>
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            <Link href="/request" onClick={() => setOpen(false)} className="btn-secondary w-full justify-center">
              📋 Request an Item
            </Link>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254712345678"}`}
              target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
