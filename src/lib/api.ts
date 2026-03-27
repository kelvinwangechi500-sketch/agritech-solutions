import { supabase } from "./supabase";
import type { Item, Lead, FarmerRequest, SearchFilters } from "@/types";

// ── Items ─────────────────────────────────────────────

export async function getItems(filters?: SearchFilters): Promise<Item[]> {
  let q = supabase
    .from("items")
    .select("*, images(*)")
    .order("created_at", { ascending: false });

  if (filters?.category && filters.category !== "all")
    q = q.eq("category", filters.category);
  if (filters?.subcategory)
    q = q.ilike("subcategory", `%${filters.subcategory}%`);
  if (filters?.status)
    q = q.eq("status", filters.status);
  if (filters?.min_price)
    q = q.gte("price", filters.min_price);
  if (filters?.max_price)
    q = q.lte("price", filters.max_price);
  if (filters?.location)
    q = q.ilike("location", `%${filters.location}%`);
  if (filters?.query)
    q = q.or(
      `title.ilike.%${filters.query}%,description.ilike.%${filters.query}%,location.ilike.%${filters.query}%,subcategory.ilike.%${filters.query}%`
    );

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export async function getItemById(id: string): Promise<Item | null> {
  const { data, error } = await supabase
    .from("items")
    .select("*, images(*)")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function getFeaturedItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*, images(*)")
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(8);
  if (error) throw error;
  return data ?? [];
}

export async function getItemsByCategory(
  category: string,
  limit = 20
): Promise<Item[]> {
  const { data, error } = await supabase
    .from("items")
    .select("*, images(*)")
    .eq("category", category)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function createItem(
  item: Omit<Item, "id" | "created_at" | "images">
): Promise<Item> {
  const { data, error } = await supabase
    .from("items")
    .insert(item)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateItem(
  id: string,
  updates: Partial<Omit<Item, "id" | "created_at" | "images">>
): Promise<void> {
  const { error } = await supabase.from("items").update(updates).eq("id", id);
  if (error) throw error;
}

export async function deleteItem(id: string): Promise<void> {
  const { error } = await supabase.from("items").delete().eq("id", id);
  if (error) throw error;
}

// ── Images ────────────────────────────────────────────

export async function uploadItemImage(
  itemId: string,
  file: File
): Promise<string> {
  const ext  = file.name.split(".").pop();
  const path = `${itemId}/${Date.now()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("agritech-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadErr) throw uploadErr;

  const { data } = supabase.storage.from("agritech-images").getPublicUrl(path);

  const { error: dbErr } = await supabase
    .from("images")
    .insert({ item_id: itemId, url: data.publicUrl });
  if (dbErr) throw dbErr;

  return data.publicUrl;
}

export async function deleteImage(imageId: string, url: string): Promise<void> {
  const path = url.split("/agritech-images/")[1];
  if (path) await supabase.storage.from("agritech-images").remove([path]);
  await supabase.from("images").delete().eq("id", imageId);
}

// ── Leads ─────────────────────────────────────────────

export async function createLead(
  lead: Omit<Lead, "id" | "created_at" | "item">
): Promise<void> {
  const { error } = await supabase.from("leads").insert(lead);
  if (error) throw error;
}

export async function getAllLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*, item:items(title, category)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ── Farmer Requests ───────────────────────────────────

export async function createRequest(
  req: Omit<FarmerRequest, "id" | "created_at" | "status">
): Promise<void> {
  const { error } = await supabase
    .from("requests")
    .insert({ ...req, status: "pending" });
  if (error) throw error;
}

export async function getAllRequests(): Promise<FarmerRequest[]> {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateRequestStatus(
  id: string,
  status: "pending" | "responded"
): Promise<void> {
  const { error } = await supabase
    .from("requests")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

// ── Stats ─────────────────────────────────────────────

export async function getDashboardStats() {
  const [items, leads, requests] = await Promise.all([
    supabase.from("items").select("id, category, status"),
    supabase.from("leads").select("id"),
    supabase.from("requests").select("id, status"),
  ]);

  const allItems = items.data ?? [];
  return {
    totalItems:      allItems.length,
    availableItems:  allItems.filter((i) => i.status === "available").length,
    soldItems:       allItems.filter((i) => i.status === "sold").length,
    livestock:       allItems.filter((i) => i.category === "livestock").length,
    vet:             allItems.filter((i) => i.category === "vet").length,
    feeds:           allItems.filter((i) => i.category === "feeds").length,
    products:        allItems.filter((i) => i.category === "products").length,
    totalLeads:      (leads.data ?? []).length,
    totalRequests:   (requests.data ?? []).length,
    pendingRequests: (requests.data ?? []).filter((r) => r.status === "pending").length,
  };
}
