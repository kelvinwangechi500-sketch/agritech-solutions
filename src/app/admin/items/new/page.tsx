"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Upload, X, Loader2, CheckCircle } from "lucide-react";
import { CATEGORIES } from "@/types";

const schema = z.object({
  title:       z.string().min(4, "Title required"),
  category:    z.enum(["livestock","vet","feeds","products"]),
  type:        z.enum(["product","service"]),
  subcategory: z.string().optional(),
  breed:       z.string().optional(),
  age:         z.coerce.number().optional(),
  weight:      z.coerce.number().optional(),
  price:       z.coerce.number().optional(),
  price_negotiable: z.boolean().default(false),
  location:    z.string().min(3, "Location required"),
  latitude:    z.coerce.number().optional(),
  longitude:   z.coerce.number().optional(),
  contact_phone: z.string().optional(),
  description: z.string().min(20, "Description required (min 20 chars)"),
  status:      z.enum(["available","sold"]).default("available"),
  services_offered:   z.string().optional(),
  availability:       z.string().optional(),
  feed_type:          z.string().optional(),
  quantity_available: z.string().optional(),
  product_type:       z.string().optional(),
  unit:               z.string().optional(),
});

type F = z.infer<typeof schema>;

export default function NewItemPage() {
  const router = useRouter();
  const [success,       setSuccess]       = useState(false);
  const [previews,      setPreviews]      = useState<string[]>([]);
  const [selectedCat,   setSelectedCat]   = useState("livestock");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { category: "livestock", type: "product", status: "available", price_negotiable: false },
  });

  const category = watch("category");
  const catMeta  = CATEGORIES.find(c => c.key === category);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    Array.from(e.target.files ?? []).slice(0, 8).forEach(file => {
      const r = new FileReader();
      r.onload = ev => setPreviews(p => [...p, ev.target?.result as string].slice(0, 8));
      r.readAsDataURL(file);
    });
  };

  const onSubmit = async (data: F) => {
    await new Promise(r => setTimeout(r, 1000));
    setSuccess(true);
    setTimeout(() => router.push("/admin/items"), 1500);
  };

  if (success) return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <CheckCircle className="mx-auto text-brand-600 mb-4" size={52} />
      <h2 className="font-display font-bold text-2xl">Item Created!</h2>
      <p className="text-gray-500 mt-2">Redirecting...</p>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/items" className="btn-outline py-2 px-3"><ArrowLeft size={15} /></Link>
        <div>
          <h1 className="font-display font-bold text-2xl text-gray-900">Add New Item</h1>
          <p className="text-gray-500 text-sm">Fill in all details below</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Images */}
        <div className="card p-5">
          <h2 className="font-semibold text-gray-800 mb-3">Photos (up to 8)</h2>
          <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all">
            <Upload size={22} className="text-gray-400 mb-1.5" />
            <p className="text-sm text-gray-500">Click to upload images</p>
            <p className="text-xs text-gray-400">PNG, JPG, WebP up to 10MB</p>
            <input type="file" accept="image/*" multiple onChange={handleImages} className="hidden" />
          </label>
          {previews.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {previews.map((src, i) => (
                <div key={i} className="relative w-16 h-16 rounded-xl overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => setPreviews(p => p.filter((_, j) => j !== i))}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category & Type */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Category & Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select {...register("category")} className="select">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Subcategory</label>
              <select {...register("subcategory")} className="select">
                <option value="">Select...</option>
                {catMeta?.subcategories.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Type *</label>
            <div className="flex gap-3">
              {["product","service"].map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input {...register("type")} type="radio" value={t} className="accent-brand-600" />
                  <span className="text-sm font-medium capitalize">{t}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Basic Information</h2>
          <div>
            <label className="label">Title *</label>
            <input {...register("title")} className="input" placeholder="e.g. Premium Boran Bull" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* Livestock-specific */}
          {category === "livestock" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div><label className="label">Breed</label><input {...register("breed")} className="input" placeholder="e.g. Boran" /></div>
              <div><label className="label">Age (years)</label><input {...register("age")} type="number" className="input" /></div>
              <div><label className="label">Weight (kg)</label><input {...register("weight")} type="number" className="input" /></div>
            </div>
          )}

          {/* Vet-specific */}
          {category === "vet" && (
            <>
              <div><label className="label">Services Offered</label><textarea {...register("services_offered")} rows={2} className="textarea" placeholder="e.g. Vaccination, deworming, AI services..." /></div>
              <div><label className="label">Availability</label><input {...register("availability")} className="input" placeholder="e.g. Mon–Sat 8am–6pm" /></div>
            </>
          )}

          {/* Feeds-specific */}
          {category === "feeds" && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Feed Type</label><input {...register("feed_type")} className="input" placeholder="e.g. Dairy Meal" /></div>
              <div><label className="label">Stock Available</label><input {...register("quantity_available")} className="input" placeholder="e.g. 200 bags" /></div>
            </div>
          )}

          {/* Products-specific */}
          {category === "products" && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Product Type</label><input {...register("product_type")} className="input" placeholder="e.g. Dairy" /></div>
              <div><label className="label">Unit</label><input {...register("unit")} className="input" placeholder="e.g. Per litre" /></div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Price (KES)</label>
              <input {...register("price")} type="number" className="input" placeholder="Leave empty if by enquiry" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register("price_negotiable")} type="checkbox" className="w-4 h-4 accent-brand-600" />
                <span className="text-sm font-medium text-gray-700">Price Negotiable</span>
              </label>
            </div>
          </div>

          <div>
            <label className="label">Status</label>
            <select {...register("status")} className="select">
              <option value="available">Available</option>
              <option value="sold">Sold / Unavailable</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Location & Contact</h2>
          <div>
            <label className="label">Location *</label>
            <input {...register("location")} className="input" placeholder="e.g. Meru Town, Meru County" />
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Latitude (optional)</label><input {...register("latitude")} type="number" step="any" className="input" placeholder="e.g. 0.047" /></div>
            <div><label className="label">Longitude (optional)</label><input {...register("longitude")} type="number" step="any" className="input" placeholder="e.g. 37.649" /></div>
          </div>
          <div><label className="label">Contact Phone</label><input {...register("contact_phone")} className="input" placeholder="e.g. 0712 345 678" type="tel" /></div>
        </div>

        {/* Description */}
        <div className="card p-5">
          <label className="label text-base font-semibold text-gray-800">Description *</label>
          <textarea {...register("description")} rows={5} className="textarea mt-1"
            placeholder="Describe this item or service in detail. Include relevant information for buyers." />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5 text-base">
          {isSubmitting ? <><Loader2 size={17} className="animate-spin" /> Saving...</> : "Save Item"}
        </button>
      </form>
    </div>
  );
}
