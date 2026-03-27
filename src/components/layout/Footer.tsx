import Link from "next/link";
import { MapPin, Phone, MessageCircle, Mail } from "lucide-react";
import { CATEGORIES } from "@/types";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-xl">🌾</div>
              <div>
                <p className="font-display font-bold text-lg">AgriTech</p>
                <p className="text-[10px] text-amber-400 tracking-widest uppercase">Marketplace</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Kenya's agricultural marketplace connecting farmers, buyers and service providers across the country.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-3">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.key}>
                  <Link href={`/${cat.key === "vet" ? "vet-services" : cat.key}`}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <span>{cat.emoji}</span> {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {[["Home", "/"], ["Search", "/search"], ["Request an Item", "/request"], ["Admin Dashboard", "/admin/dashboard"]].map(([l, h]) => (
                <li key={h}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-100 mb-3">Contact</h4>
            <div className="space-y-2.5 text-sm text-gray-400">
              <div className="flex items-center gap-2"><MapPin size={14} className="text-brand-400 shrink-0" /> Meru County, Kenya</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-brand-400 shrink-0" /> +254 712 345 678</div>
              <div className="flex items-center gap-2"><Mail size={14} className="text-brand-400 shrink-0" /> info@agritechmarketplace.co.ke</div>
              <a href={`https://wa.me/254712345678`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#25D366] hover:text-green-300 transition-colors font-medium">
                <MessageCircle size={14} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} AgriTech Marketplace Kenya. All rights reserved.</p>
          <p>Built for Kenyan Farmers 🇰🇪</p>
        </div>
      </div>
    </footer>
  );
}
