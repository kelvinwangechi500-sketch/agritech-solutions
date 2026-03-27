import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getWhatsAppLink(
  itemName: string,
  location: string,
  itemId?: string
): string {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254712345678";
  const url   = itemId
    ? `\n\nView listing: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/item/${itemId}`
    : "";
  const msg = encodeURIComponent(
    `Hello, I'm interested in *${itemName}* located in *${location}*. Is it still available?${url}`
  );
  return `https://wa.me/${phone}?text=${msg}`;
}

export function formatPrice(price?: number | null): string {
  if (!price) return "Contact for price";
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + "…" : str;
}
