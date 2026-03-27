"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ListChecks, PlusCircle, Users, MessageSquare, LogOut, Menu, X, TrendingUp } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/items",     icon: ListChecks,      label: "All Items" },
  { href: "/admin/items/new", icon: PlusCircle,      label: "Add Item" },
  { href: "/admin/leads",     icon: Users,           label: "Leads" },
  { href: "/admin/requests",  icon: MessageSquare,   label: "Requests" },
];

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname();
  return (
    <aside className="w-56 flex flex-col bg-gray-900 text-white min-h-screen">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-xl flex items-center justify-center text-lg">🌾</div>
          <div>
            <p className="font-display font-bold text-sm leading-tight">AgriTech</p>
            <p className="text-[10px] text-amber-400 uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/admin/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} onClick={onNav}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? "bg-brand-600 text-white" : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}>
              <Icon size={16} /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-700 space-y-0.5">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
          <TrendingUp size={16} /> View Site
        </Link>
        <Link href="/admin/login"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
          <LogOut size={16} /> Logout
        </Link>
      </div>
    </aside>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <SidebarContent />
      </div>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-xl">🌾</span><span className="font-display font-bold text-sm">AgriTech Admin</span></div>
        <button onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setOpen(false)}>
          <div className="w-56 h-full" onClick={e => e.stopPropagation()}>
            <SidebarContent onNav={() => setOpen(false)} />
          </div>
        </div>
      )}

      <main className="flex-1 p-4 sm:p-6 pt-16 lg:pt-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
