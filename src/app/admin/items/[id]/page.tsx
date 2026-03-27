"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { MOCK_ITEMS } from "@/lib/mock-data";
import { CATEGORIES } from "@/types";
import type { Item } from "@/types";

const schema = z.object({
  title:       z.string().min(4),
  category:    z.enum(["livestock","vet","feeds","products"]),
  type:        z.enum(["product","service"]),
  subcategory: z.string().optional(),
  breed:       z.string().optional(),
  age:         z.coerce.number().optional(),
  weight:      z.coerce.number().optional(),
  price:       z.coerce.number().optional(),
  price_negotiable: z.boolean().default(false),
  location:    z.string().min(3),
  latitude:    z.coerce.number().optional(),
  longitude:   z.coerce.number().optional(),
  contact_phone: z.string().optional(),
  description: z.string().min(10),
  status:      z.enum(["available","sold"]),
  services_offered:   z.string().optional(),
  availability:       z.string().optional(),
  feed_type:          z.string().optional(),
  quantity_available: z.string().optional(),
  product_type:       z.string().optional(),
  unit:               z.string().optional(),
});
type F = z.infer<typeof schema>;

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [item,    setItem]    = useState<Item | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<F>({ resolver: zodResolver(schema) });
  const category = watch("category");
  const catMeta  = CATEGORIES.find(c => c.key === category);

  // NEW
useEffect(() => {
  params.then(({ id }) => {
    const found = MOCK_ITEMS.find(i => i.id === id);
    if (found) {
      setItem(found);
      reset({ ...found });
    }
  });
}, []);
    if (found) {
      setItem(found);
      reset({
        title:              found.title,
        category:           found.category,
        type:               found.type,
        subcategory:        found.subcategory ?? "",
        breed:              found.breed ?? "",
        age:                found.age ?? undefined,
        weight:             found.weight ?? undefined,
        price:              found.price ?? undefined,
        price_negotiable:   found.price_negotiable ?? false,
        location:           found.location,
        latitude:           found.latitude ?? undefined,
        longitude:          found.longitude ?? undefined,
        contact_phone:      found.contact_phone ?? "",
        description:        found.description,
        status:             found.status,
        services_offered:   found.services_offered ?? "",
        availability:       found.availability ?? "",
        feed_type:          found.feed_type ?? "",
        quantity_available: found.quantity_available ?? "",
        product_type:       found.product_type ?? "",
        unit:               found.unit ?? "",
      });
    }
  }, [params.id, reset]);

  const onSubmit = async (data: F) => {
    await new Promise(r => setTimeout(r, 800));
    setSuccess(true);
    setTimeout(() => router.push("/admin/items"), 1200);
  };

  if (!item) return <div className="p-8 text-gray-400">Item not found.</div>;
  if (success) return (
    <div className="max-w-lg mx-auto mt-20 text-center">
      <CheckCircle className="mx-auto text-brand-600 mb-4" size={48} />
      <h2 className="font-display font-bold text-2xl">Changes Saved!</h2>
    </div>
  );

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/items" className="btn-outline py-2 px-3"><ArrowLeft size={15} /></Link>
        <h1 className="font-display font-bold text-2xl text-gray-900">Edit Item</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Category & Type</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
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
            <label className="label">Type</label>
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

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Details</h2>
          <div>
            <label className="label">Title</label>
            <input {...register("title")} className="input" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          {category === "livestock" && (
            <div className="grid grid-cols-3 gap-4">
              <div><label className="label">Breed</label><input {...register("breed")} className="input" /></div>
              <div><label className="label">Age (yrs)</label><input {...register("age")} type="number" className="input" /></div>
              <div><label className="label">Weight (kg)</label><input {...register("weight")} type="number" className="input" /></div>
            </div>
          )}
          {category === "vet" && (
            <>
              <div><label className="label">Services Offered</label><textarea {...register("services_offered")} rows={2} className="textarea" /></div>
              <div><label className="label">Availability</label><input {...register("availability")} className="input" /></div>
            </>
          )}
          {category === "feeds" && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Feed Type</label><input {...register("feed_type")} className="input" /></div>
              <div><label className="label">Quantity in Stock</label><input {...register("quantity_available")} className="input" /></div>
            </div>
          )}
          {category === "products" && (
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Product Type</label><input {...register("product_type")} className="input" /></div>
              <div><label className="label">Unit</label><input {...register("unit")} className="input" /></div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Price (KES)</label><input {...register("price")} type="number" className="input" /></div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register("price_negotiable")} type="checkbox" className="w-4 h-4 accent-brand-600" />
                <span className="text-sm font-medium text-gray-700">Negotiable</span>
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

        <div className="card p-5 space-y-4">
          <h2 className="font-semibold text-gray-800">Location & Contact</h2>
          <div><label className="label">Location</label><input {...register("location")} className="input" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Latitude</label><input {...register("latitude")} type="number" step="any" className="input" /></div>
            <div><label className="label">Longitude</label><input {...register("longitude")} type="number" step="any" className="input" /></div>
          </div>
          <div><label className="label">Contact Phone</label><input {...register("contact_phone")} className="input" /></div>
        </div>

        <div className="card p-5">
          <label className="label text-base font-semibold">Description</label>
          <textarea {...register("description")} rows={5} className="textarea mt-1" />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5">
          {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
