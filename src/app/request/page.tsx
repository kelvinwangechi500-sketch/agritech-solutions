"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CATEGORIES } from "@/types";

const schema = z.object({
  name:         z.string().min(2, "Name required"),
  phone:        z.string().min(9, "Valid phone required"),
  category:     z.string().optional(),
  request_text: z.string().min(20, "Please describe what you need (at least 20 characters)"),
});
type F = z.infer<typeof schema>;

export default function RequestPage() {
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: F) => {
    try {
      // In production: await createRequest(data)
      await new Promise(r => setTimeout(r, 1000));
      setSuccess(true);
      reset();
    } catch {
      alert("Failed. Please WhatsApp us directly.");
    }
  };

  return (
    <>
      <Navbar />
      <main className="page-container py-10">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="text-5xl block mb-3">📋</span>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-gray-900">Request What You Need</h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Can't find what you're looking for? Tell us what you need and we'll connect you with the right seller or provider in Kenya.
            </p>
          </div>

          {success ? (
            <div className="card p-8 text-center">
              <CheckCircle className="mx-auto text-brand-600 mb-4" size={52} />
              <h2 className="font-display font-bold text-2xl text-gray-900">Request Submitted!</h2>
              <p className="text-gray-500 mt-2 mb-6">We'll contact you within 24 hours with options that match your request.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setSuccess(false)} className="btn-outline">Submit Another</button>
                <Link href="/" className="btn-primary">Browse Marketplace</Link>
              </div>
            </div>
          ) : (
            <div className="card p-6 sm:p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Your Name *</label>
                    <input {...register("name")} className="input" placeholder="e.g. Samuel Kiiru" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label">Phone Number *</label>
                    <input {...register("phone")} className="input" placeholder="e.g. 0712 345 678" type="tel" />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label">Category (optional)</label>
                  <select {...register("category")} className="select">
                    <option value="">Select a category...</option>
                    {CATEGORIES.map(c => (
                      <option key={c.key} value={c.key}>{c.emoji} {c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">What do you need? *</label>
                  <textarea {...register("request_text")} rows={5} className="textarea"
                    placeholder="Describe in detail what you're looking for. E.g. 'Looking for a pregnant Friesian heifer, budget KES 90,000, located in Meru...'" />
                  {errors.request_text && <p className="text-red-500 text-xs mt-1">{errors.request_text.message}</p>}
                  <p className="text-xs text-gray-400 mt-1.5">The more detail you give, the better we can match you.</p>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3.5 text-base">
                  {isSubmitting ? <><Loader2 size={17} className="animate-spin" /> Submitting...</> : <><Send size={17} /> Submit Request</>}
                </button>
              </form>
            </div>
          )}

          {/* Alternative */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">Or reach us directly on WhatsApp:</p>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "254712345678"}?text=${encodeURIComponent("Hello, I'd like to request an item on AgriTech Marketplace.")}`}
              target="_blank" rel="noopener noreferrer"
              className="btn-whatsapp inline-flex text-sm py-3 px-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
