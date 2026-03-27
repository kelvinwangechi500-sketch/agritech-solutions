import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Clock, ArrowLeft, Tag, Scale, Calendar, Stethoscope, Package } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ImageGallery from "@/components/marketplace/ImageGallery";
import WhatsAppButton from "@/components/marketplace/WhatsAppButton";
import InquiryForm from "@/components/marketplace/InquiryForm";
import { MOCK_ITEMS } from "@/lib/mock-data";
import { formatPrice, formatDate } from "@/lib/utils";
import { getCategoryMeta } from "@/types";
import type { Item } from "@/types";

const USE_MOCK = true;

async function getItem(id: string): Promise<Item | null> {
  if (USE_MOCK) return MOCK_ITEMS.find(i => i.id === id) ?? null;
  const { getItemById } = await import("@/lib/api");
  return getItemById(id);
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const item = await getItem(params.id);
  if (!item) return { title: "Item Not Found" };
  return {
    title: item.title,
    description: item.description.slice(0, 160),
    openGraph: {
      title: item.title,
      description: item.description.slice(0, 160),
      images: item.images?.[0] ? [{ url: item.images[0].url }] : [],
    },
  };
}

const categoryBadgeClass: Record<string, string> = {
  livestock: "badge-livestock", vet: "badge-vet", feeds: "badge-feeds", products: "badge-products",
};

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await getItem(params.id);
  if (!item) notFound();

  const isSold  = item.status === "sold";
  const catMeta = getCategoryMeta(item.category);
  const catHref = item.category === "vet" ? "/vet-services" : `/${item.category}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": item.type === "service" ? "Service" : "Product",
    name: item.title,
    description: item.description,
    offers: {
      "@type": "Offer",
      price: item.price ?? 0,
      priceCurrency: "KES",
      availability: isSold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Navbar />

      <main className="page-container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={catHref} className="hover:text-brand-600 transition-colors">{catMeta.label}</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{item.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left col */}
          <div className="lg:col-span-3 space-y-5">
            <ImageGallery images={item.images ?? []} title={item.title} />

            {/* Mobile title */}
            <div className="lg:hidden">
              <TitleBlock item={item} isSold={isSold} catMeta={catMeta} />
            </div>

            {/* Description */}
            <div className="card p-5">
              <h2 className="font-display font-semibold text-lg text-gray-900 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">{item.description}</p>
            </div>

            {/* Details grid */}
            <div className="card p-5">
              <h2 className="font-display font-semibold text-lg text-gray-900 mb-4">Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Category",    value: `${catMeta.emoji} ${catMeta.label}` },
                  item.subcategory ? { label: "Type",    value: item.subcategory }    : null,
                  item.breed       ? { label: "Breed",   value: item.breed }          : null,
                  item.age         ? { label: "Age",     value: `${item.age} yr${item.age !== 1 ? "s" : ""}` } : null,
                  item.weight      ? { label: "Weight",  value: `${item.weight} kg` } : null,
                  item.services_offered   ? { label: "Services", value: item.services_offered } : null,
                  item.availability       ? { label: "Availability", value: item.availability } : null,
                  item.feed_type          ? { label: "Feed Type",    value: item.feed_type }    : null,
                  item.quantity_available ? { label: "In Stock",     value: item.quantity_available } : null,
                  item.product_type       ? { label: "Product",      value: item.product_type } : null,
                  item.unit               ? { label: "Unit",         value: item.unit }         : null,
                  { label: "Listed", value: formatDate(item.created_at) },
                ].filter(Boolean).map((d) => (
                  <div key={d!.label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{d!.label}</p>
                    <p className="font-semibold text-gray-800 text-sm leading-snug">{d!.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sticky col */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="hidden lg:block">
                <TitleBlock item={item} isSold={isSold} catMeta={catMeta} />
              </div>

              {!isSold ? (
                <>
                  <div className="card p-5">
                    <p className="text-sm font-medium text-gray-600 mb-3 text-center">💬 Fastest response via WhatsApp:</p>
                    <WhatsAppButton itemName={item.title} location={item.location} itemId={item.id} className="w-full" />
                    {item.contact_phone && (
                      <a href={`tel:${item.contact_phone}`}
                        className="btn-secondary w-full justify-center mt-2 text-sm">
                        <Phone size={14} /> Call: {item.contact_phone}
                      </a>
                    )}
                  </div>
                  <div className="card p-5">
                    <h3 className="font-display font-semibold text-gray-900 mb-4">Send an Inquiry</h3>
                    <InquiryForm itemId={item.id} itemTitle={item.title} />
                  </div>
                </>
              ) : (
                <div className="card p-6 text-center">
                  <p className="text-4xl mb-3">😔</p>
                  <h3 className="font-semibold text-gray-700 text-lg">No longer available</h3>
                  <p className="text-gray-400 text-sm mt-1 mb-4">Check similar listings below.</p>
                  <Link href={catHref} className="btn-primary w-full justify-center">Browse {catMeta.label}</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function TitleBlock({ item, isSold, catMeta }: { item: Item; isSold: boolean; catMeta: ReturnType<typeof getCategoryMeta> }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={`badge-${item.category} shrink-0`}>{catMeta.emoji} {catMeta.label}</span>
        {isSold ? <span className="badge-sold shrink-0">● Sold</span> : <span className="badge-available shrink-0">● Available</span>}
      </div>
      <h1 className="font-display font-bold text-xl sm:text-2xl text-gray-900 leading-snug mt-2 mb-2">{item.title}</h1>
      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
        <MapPin size={13} className="text-brand-500" /> {item.location}
      </div>
      {item.price ? (
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-brand-700">{formatPrice(item.price)}</span>
          {item.price_negotiable && <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">Negotiable</span>}
          {item.unit && <span className="text-sm text-gray-400">/ {item.unit}</span>}
        </div>
      ) : (
        <p className="text-lg font-semibold text-gray-600">Contact for pricing</p>
      )}
    </div>
  );
}
