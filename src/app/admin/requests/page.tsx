"use client";
import { useState } from "react";
import { Phone, CheckCircle, Trash2, MessageCircle, Clock } from "lucide-react";
import { MOCK_REQUESTS } from "@/lib/mock-data";
import { formatDate, getWhatsAppLink, timeAgo } from "@/lib/utils";
import { CATEGORIES } from "@/types";
import type { FarmerRequest } from "@/types";

export default function AdminRequests() {
  const [requests, setRequests] = useState<FarmerRequest[]>(MOCK_REQUESTS);

  const markResponded = (id: string) => setRequests(p => p.map(r => r.id === id ? { ...r, status: "responded" } : r));
  const del = (id: string) => { if (confirm("Delete request?")) setRequests(p => p.filter(r => r.id !== id)); };

  const pending   = requests.filter(r => r.status === "pending").length;
  const responded = requests.filter(r => r.status === "responded").length;

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Farmer Requests</h1>
        <p className="text-gray-500 text-sm">{pending} pending · {responded} responded</p>
      </div>

      {/* Pending first */}
      {requests.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-4xl mb-3">📋</p><p className="font-semibold text-gray-600">No requests yet</p></div>
      ) : (
        <div className="space-y-4">
          {["pending", "responded"].map(status => {
            const group = requests.filter(r => r.status === status);
            if (!group.length) return null;
            return (
              <div key={status}>
                <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-3 flex items-center gap-2">
                  {status === "pending" ? <span className="w-2 h-2 bg-amber-500 rounded-full" /> : <span className="w-2 h-2 bg-brand-500 rounded-full" />}
                  {status} ({group.length})
                </h2>
                <div className="space-y-3">
                  {group.map(req => (
                    <div key={req.id} className={`card p-5 border-l-4 ${req.status === "pending" ? "border-amber-400" : "border-brand-400"}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-gray-900">{req.name}</p>
                            {req.category && (
                              <span className={`badge-${req.category}`}>
                                {CATEGORIES.find(c => c.key === req.category)?.emoji} {req.category}
                              </span>
                            )}
                            <span className={req.status === "pending" ? "badge-pending" : "badge-responded"}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">{req.request_text}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <a href={`tel:${req.phone}`} className="flex items-center gap-1 text-brand-600 hover:underline font-medium">
                              <Phone size={11} /> {req.phone}
                            </a>
                            <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(req.created_at)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <a href={getWhatsAppLink(req.request_text.slice(0, 40), "Kenya")}
                            target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs bg-[#25D366] text-white px-3 py-2 rounded-lg font-semibold whitespace-nowrap">
                            <MessageCircle size={12} /> WhatsApp
                          </a>
                          {req.status === "pending" && (
                            <button onClick={() => markResponded(req.id)}
                              className="flex items-center gap-1 text-xs bg-brand-50 text-brand-700 border border-brand-200 px-3 py-2 rounded-lg font-medium hover:bg-brand-100 transition-all">
                              <CheckCircle size={12} /> Mark Done
                            </button>
                          )}
                          <button onClick={() => del(req.id)}
                            className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg font-medium hover:bg-red-100 transition-all">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
