import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-7xl mb-6">🌾</p>
      <h1 className="font-display font-bold text-3xl text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-gray-500 mb-8">This listing may have been removed or doesn't exist.</p>
      <Link href="/" className="btn-primary">← Back to Marketplace</Link>
    </div>
  );
}
