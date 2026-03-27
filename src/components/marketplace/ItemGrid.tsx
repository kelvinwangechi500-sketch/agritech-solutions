import ItemCard from "./ItemCard";
import type { Item } from "@/types";

interface Props {
  items: Item[];
  loading?: boolean;
  emptyMessage?: string;
  emptyEmoji?: string;
}

export default function ItemGrid({ items, loading, emptyMessage = "No items found", emptyEmoji = "🔍" }: Props) {
  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="h-44 skeleton" />
          <div className="p-3.5 space-y-2.5">
            <div className="h-3 skeleton rounded w-1/3" />
            <div className="h-4 skeleton rounded w-4/5" />
            <div className="h-5 skeleton rounded w-2/5" />
            <div className="h-3 skeleton rounded w-3/5" />
            <div className="h-8 skeleton rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );

  if (!items.length) return (
    <div className="text-center py-20">
      <p className="text-5xl mb-4">{emptyEmoji}</p>
      <h3 className="font-semibold text-gray-700 text-lg">{emptyMessage}</h3>
      <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search terms</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item) => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
