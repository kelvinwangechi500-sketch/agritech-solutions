"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PlusCircle, Pencil, Trash2, Eye, Search } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";
import { CATEGORIES } from "@/types";
import type { Item, Category } from "@/types";

export default function AdminItems() {
  const [items,    setItems]    = useState<Item[]>(MOCK_ITEMS);
  const [filter,   setFilter]   = useState<Category | "all">("all");
  const [query,    setQuery]    = useState("");

  const displayed = items.filter(i => {
    const matchCat = filter === "all" || i.category === filter;
    const matchQ   = !query || i.title.toLowerCase().includes(query.toLowerCase()) || i.location.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQ;
  });

  const toggleStatus = (id: string) => setItems(p => p.map(i => i.id === id ? { ...i, status: i.status === "available" ? "sold" : "available" } : i));
  const handleDelete = (id: string) => { if (confirm("Delete this item?")) setItems(p => p.filter(i => i.id !== id)); };

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">All Items</h1>
          <p className="text-gray-500 text-sm">{displayed.length} of {items.length} items</p>
        </div>
        <Link href="/admin/items/new" className="btn-primary text-sm py-2.5"><PlusCircle size={15} /> Add Item</Link>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search items..." className="input pl-9" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("all")} className={`text-xs px-3 py-2 rounded-lg font-medium border transition-all ${filter === "all" ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-200"}`}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.key} onClick={() => setFilter(c.key)}
              className={`text-xs px-3 py-2 rounded-lg font-medium border transition-all ${filter === c.key ? "bg-brand-600 text-white border-brand-600" : "bg-white text-gray-600 border-gray-200"}`}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Item", "Category", "Price", "Location", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayed.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        {item.images?.[0] ? (
                          <Image src={item.images[0].url} alt={item.title} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">{CATEGORIES.find(c => c.key === item.category)?.emoji}</div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 truncate max-w-[180px]">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.subcategory ?? item.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge-${item.category}`}>{CATEGORIES.find(c => c.key === item.category)?.emoji} {item.category}</span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-brand-700 whitespace-nowrap">{formatPrice(item.price)}</td>
                  <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate">{item.location.split(",")[0]}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(item.id)}
                      className={`cursor-pointer ${item.status === "available" ? "badge-available" : "badge-sold"}`}>
                      ● {item.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(item.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/item/${item.id}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-all"><Eye size={14} /></Link>
                      <Link href={`/admin/items/${item.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Pencil size={14} /></Link>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p className="font-medium">No items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
