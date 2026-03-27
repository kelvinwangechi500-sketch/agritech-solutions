"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { ItemImage } from "@/types";

interface Props { images: ItemImage[]; title: string; }

export default function ImageGallery({ images, title }: Props) {
  const [active,   setActive]   = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images.length) return (
    <div className="h-72 sm:h-96 bg-brand-50 rounded-2xl flex items-center justify-center">
      <span className="text-8xl">🌾</span>
    </div>
  );

  const prev = () => setActive(a => a === 0 ? images.length - 1 : a - 1);
  const next = () => setActive(a => a === images.length - 1 ? 0 : a + 1);

  return (
    <>
      <div className="relative h-72 sm:h-[420px] rounded-2xl overflow-hidden bg-gray-100 group">
        <Image src={images[active].url} alt={`${title} ${active + 1}`}
          fill className="object-cover" sizes="(max-width:768px) 100vw,60vw" priority />

        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={18} /></button>
            <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={18} /></button>
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">{active + 1} / {images.length}</div>
          </>
        )}
        <button onClick={() => setLightbox(true)} className="absolute top-3 right-3 w-8 h-8 bg-white/80 hover:bg-white rounded-lg flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all"><Expand size={14} /></button>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)}
              className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${i === active ? "border-brand-500" : "border-transparent opacity-60 hover:opacity-90"}`}>
              <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(false)}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <Image src={images[active].url} alt={title} width={1200} height={800}
              className="object-contain rounded-xl max-h-[85vh] w-full" />
            {images.length > 1 && (
              <>
                <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white"><ChevronLeft size={22} /></button>
                <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white"><ChevronRight size={22} /></button>
              </>
            )}
            <button onClick={() => setLightbox(false)} className="absolute top-2 right-2 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white"><X size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
}
