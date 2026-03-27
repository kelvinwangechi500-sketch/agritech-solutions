import Link from "next/link";
import Image from "next/image";
import { MapPin, Scale, Clock, Tag } from "lucide-react";
import type { Item } from "@/types";
import { formatPrice, truncate, timeAgo } from "@/lib/utils";
import { getCategoryMeta } from "@/types";

interface Props { item: Item; }

const categoryBadge: Record<string, string> = {
  livestock: "badge-livestock",
  vet:       "badge-vet",
  feeds:     "badge-feeds",
  products:  "badge-products",
};

export default function ItemCard({ item }: Props) {
  const img     = item.images?.[0]?.url;
  const isSold  = item.status === "sold";
  const catMeta = getCategoryMeta(item.category);

  return (
    <div className={`card overflow-hidden group flex flex-col ${isSold ? "opacity-70" : ""}`}>
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden shrink-0">
        {img ? (
          <Image src={img} alt={item.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-50">
            <span className="text-5xl">{catMeta.emoji}</span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className={categoryBadge[item.category]}>
            {catMeta.emoji} {catMeta.label}
          </span>
        </div>
        {/* Status */}
        <div className="absolute top-2.5 right-2.5">
          {isSold
            ? <span className="badge-sold">● Sold</span>
            : <span className="badge-available">● Available</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-0.5">{item.subcategory ?? item.category}</p>
        <h3 className="font-display font-semibold text-gray-900 text-sm leading-snug mb-1.5 line-clamp-2">
          {item.title}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-1.5 mb-2.5">
          <span className="text-lg font-bold text-brand-700">{formatPrice(item.price)}</span>
          {item.price_negotiable && (
            <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-1.5 py-0.5 rounded-full">Neg.</span>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-1 mb-3 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={11} className="text-brand-500 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              {item.weight && <span className="flex items-center gap-1"><Scale size={11} />{item.weight}kg</span>}
              {item.age && <span>{item.age}yr{item.age !== 1 ? "s" : ""}</span>}
            </div>
            <span className="flex items-center gap-1"><Clock size={11} />{timeAgo(item.created_at)}</span>
          </div>
        </div>

        <Link href={`/item/${item.id}`}
          className="btn-primary w-full justify-center text-xs py-2 mt-auto">
          View Details
        </Link>
      </div>
    </div>
  );
}
