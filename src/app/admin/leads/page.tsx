"use client";
import { useState } from "react";
import { Phone, Trash2, MessageCircle } from "lucide-react";
import { MOCK_LEADS } from "@/lib/mock-data";
import { formatDate, getWhatsAppLink } from "@/lib/utils";
import { CATEGORIES } from "@/types";
import type { Lead } from "@/types";

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const del = (id: string) => { if (confirm("Delete lead?")) setLeads(p => p.filter(l => l.id !== id)); };

  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Leads</h1>
        <p className="text-gray-500 text-sm">{leads.length} customer inquiries</p>
      </div>

      {leads.length === 0 ? (
        <div className="card p-12 text-center"><p className="text-4xl mb-3">📭</p><p className="font-semibold text-gray-600">No leads yet</p></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Customer", "Item", "Message", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-800">{lead.name}</p>
                      <a href={`tel:${lead.phone}`} className="text-xs text-brand-600 hover:underline flex items-center gap-1 mt-0.5">
                        <Phone size={10} /> {lead.phone}
                      </a>
                    </td>
                    <td className="px-4 py-4">
                      {lead.item ? (
                        <div>
                          <p className="text-gray-700 font-medium truncate max-w-[150px]">{lead.item.title}</p>
                          <span className={`badge-${lead.item.category} mt-1`}>{CATEGORIES.find(c => c.key === lead.item?.category)?.emoji} {lead.item.category}</span>
                        </div>
                      ) : <span className="text-gray-400 text-xs">General</span>}
                    </td>
                    <td className="px-4 py-4 max-w-[200px]">
                      <p className="text-gray-600 text-xs truncate">{lead.message}</p>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs whitespace-nowrap">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <a href={getWhatsAppLink(lead.item?.title ?? "your enquiry", "Kenya")}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs bg-[#25D366] text-white px-2.5 py-1.5 rounded-lg font-semibold">
                          <MessageCircle size={11} /> Reply
                        </a>
                        <button onClick={() => del(lead.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
