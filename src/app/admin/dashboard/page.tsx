"use client";
import Link from "next/link";
import { ListChecks, Users, MessageSquare, TrendingUp, PlusCircle, ArrowRight, Clock } from "lucide-react";
import { MOCK_ITEMS, MOCK_LEADS, MOCK_REQUESTS } from "@/lib/mock-data";
import { formatPrice, formatDate, timeAgo } from "@/lib/utils";
import { CATEGORIES } from "@/types";

export default function AdminDashboard() {
  const available = MOCK_ITEMS.filter(i => i.status === "available").length;
  const sold      = MOCK_ITEMS.filter(i => i.status === "sold").length;
  const pending   = MOCK_REQUESTS.filter(r => r.status === "pending").length;

  const statsByCategory = CATEGORIES.map(c => ({
    ...c,
    count: MOCK_ITEMS.filter(i => i.category === c.key).length,
  }));

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">AgriTech Marketplace overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Items",  value: MOCK_ITEMS.length,    icon: ListChecks,    bg: "bg-brand-50",  text: "text-brand-600" },
          { label: "Available",    value: available,             icon: TrendingUp,    bg: "bg-blue-50",   text: "text-blue-600" },
          { label: "Leads",        value: MOCK_LEADS.length,    icon: Users,         bg: "bg-purple-50", text: "text-purple-600" },
          { label: "Requests",     value: MOCK_REQUESTS.length, icon: MessageSquare, bg: "bg-amber-50",  text: "text-amber-600" },
        ].map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl ${bg} ${text} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Items by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {statsByCategory.map(c => (
            <Link key={c.key} href={`/admin/items?category=${c.key}`}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-brand-50 transition-colors">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <p className="font-bold text-gray-900 text-lg">{c.count}</p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent items */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Items</h2>
            <Link href="/admin/items" className="text-xs text-brand-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {MOCK_ITEMS.slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-xl shrink-0">{CATEGORIES.find(c => c.key === item.category)?.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">{formatPrice(item.price)} · {item.location.split(",")[0]}</p>
                </div>
                <span className={item.status === "available" ? "badge-available" : "badge-sold"}>{item.status}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/items/new" className="btn-primary w-full justify-center text-sm py-2.5 mt-4">
            <PlusCircle size={15} /> Add New Item
          </Link>
        </div>

        {/* Recent requests */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Farmer Requests {pending > 0 && <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending}</span>}</h2>
            <Link href="/admin/requests" className="text-xs text-brand-600 hover:underline flex items-center gap-1">View all <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {MOCK_REQUESTS.map(req => (
              <div key={req.id} className="p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-800">{req.name}</p>
                  <span className={req.status === "pending" ? "badge-pending" : "badge-responded"}>{req.status}</span>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2">{req.request_text}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} />{timeAgo(req.created_at)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
