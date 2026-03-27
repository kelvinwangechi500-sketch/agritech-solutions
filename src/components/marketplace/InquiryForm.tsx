"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import { createLead } from "@/lib/api";

const schema = z.object({
  name:    z.string().min(2, "Name required"),
  phone:   z.string().min(9, "Valid phone required"),
  message: z.string().min(5, "Message too short"),
});
type F = z.infer<typeof schema>;

export default function InquiryForm({ itemId, itemTitle }: { itemId: string; itemTitle: string }) {
  const [success, setSuccess] = useState(false);
  const [err, setErr]         = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<F>({
    resolver: zodResolver(schema),
    defaultValues: { message: `Hello, I'm interested in "${itemTitle}". Is it still available?` },
  });

  const onSubmit = async (data: F) => {
    setErr("");
    try {
      await createLead({ ...data, item_id: itemId });
      setSuccess(true);
      reset();
    } catch {
      setErr("Failed to send. Please use WhatsApp instead.");
    }
  };

  if (success) return (
    <div className="bg-brand-50 rounded-2xl p-6 text-center">
      <CheckCircle className="mx-auto text-brand-600 mb-3" size={40} />
      <h3 className="font-semibold text-brand-800 text-lg">Inquiry Sent!</h3>
      <p className="text-brand-600 text-sm mt-1">We'll contact you shortly.</p>
      <button onClick={() => setSuccess(false)} className="mt-3 text-xs text-brand-600 underline">Send another</button>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="label">Your Name *</label>
        <input {...register("name")} className="input" placeholder="e.g. John Mwangi" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label className="label">Phone Number *</label>
        <input {...register("phone")} className="input" placeholder="e.g. 0712 345 678" type="tel" />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>
      <div>
        <label className="label">Message *</label>
        <textarea {...register("message")} rows={3} className="textarea" />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>
      {err && <p className="text-red-500 text-sm bg-red-50 rounded-lg p-3">{err}</p>}
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center py-3">
        {isSubmitting ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <><Send size={15} /> Send Inquiry</>}
      </button>
    </form>
  );
}
