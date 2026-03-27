"use client";
import { useEffect, useRef } from "react";

interface Marker { id: string; lat: number; lng: number; title: string; price?: number; category: string; }
interface Props { markers: Marker[]; center?: [number, number]; zoom?: number; height?: string; }

const EMOJI: Record<string, string> = { livestock: "🐄", vet: "🩺", feeds: "🌾", products: "🥛" };

export default function MarketplaceMap({ markers, center = [0.047, 37.649], zoom = 9, height = "380px" }: Props) {
  const ref        = useRef<HTMLDivElement>(null);
  const mapRef     = useRef<any>(null);

  useEffect(() => {
    if (!ref.current || mapRef.current) return;
    import("leaflet").then((L) => {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(ref.current!).setView(center, zoom);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      markers.forEach((m) => {
        if (!m.lat || !m.lng) return;
        const icon = L.divIcon({
          html: `<div style="background:#16a34a;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:14px;">${EMOJI[m.category] ?? "📍"}</span></div>`,
          className: "",
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -38],
        });

        const popup = L.popup({ maxWidth: 240 }).setContent(`
          <div style="font-family:Inter,sans-serif;padding:4px">
            <p style="font-weight:700;font-size:13px;margin:0 0 4px;color:#111">${m.title}</p>
            ${m.price ? `<p style="color:#16a34a;font-weight:700;font-size:15px;margin:0 0 8px">KES ${m.price.toLocaleString()}</p>` : ""}
            <a href="/item/${m.id}" style="display:inline-block;background:#16a34a;color:white;padding:6px 14px;border-radius:8px;font-size:12px;text-decoration:none;font-weight:600">View Details →</a>
          </div>
        `);
        L.marker([m.lat, m.lng], { icon }).addTo(map).bindPopup(popup);
      });
    });
    return () => { if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } };
  }, []);

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
      <div ref={ref} style={{ height, width: "100%" }} className="rounded-2xl z-0" />
    </>
  );
}
