# 🌾 AgriTech Marketplace — Kenya's Agricultural Platform

A full-stack, production-ready agricultural marketplace built with **Next.js 15**, **Tailwind CSS**, and **Supabase**.

---

## 📁 Project Structure

```
agritech/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Homepage (hero, categories, featured, map)
│   │   ├── layout.tsx                  ← Root layout + global SEO
│   │   ├── globals.css                 ← Global styles
│   │   ├── not-found.tsx               ← 404 page
│   │   ├── search/page.tsx             ← Universal search page
│   │   ├── livestock/page.tsx          ← Livestock category
│   │   ├── vet-services/page.tsx       ← Veterinary services
│   │   ├── feeds/page.tsx              ← Animal feeds
│   │   ├── products/page.tsx           ← Livestock products
│   │   ├── item/[id]/page.tsx          ← Item detail page (all categories)
│   │   ├── request/page.tsx            ← Farmer request form
│   │   └── admin/
│   │       ├── layout.tsx              ← Admin sidebar layout
│   │       ├── page.tsx                ← Redirect to dashboard
│   │       ├── login/page.tsx          ← Admin login
│   │       ├── dashboard/page.tsx      ← Stats & overview
│   │       ├── items/
│   │       │   ├── page.tsx            ← Manage all items
│   │       │   ├── new/page.tsx        ← Add new item
│   │       │   └── [id]/page.tsx       ← Edit item
│   │       ├── leads/page.tsx          ← Customer inquiries
│   │       └── requests/page.tsx       ← Farmer requests
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx              ← Top navigation + search bar
│   │   │   └── Footer.tsx              ← Site footer
│   │   └── marketplace/
│   │       ├── ItemCard.tsx            ← Universal item card
│   │       ├── ItemGrid.tsx            ← Responsive grid with skeleton
│   │       ├── SearchFilters.tsx       ← Jumia-style filter bar
│   │       ├── CategoryPage.tsx        ← Reusable category page
│   │       ├── ImageGallery.tsx        ← Lightbox image gallery
│   │       ├── WhatsAppButton.tsx      ← Dynamic WhatsApp CTA
│   │       ├── InquiryForm.tsx         ← Lead capture form
│   │       └── MarketplaceMap.tsx      ← Leaflet map component
│   ├── lib/
│   │   ├── supabase.ts                 ← Supabase client
│   │   ├── api.ts                      ← All data access functions
│   │   ├── utils.ts                    ← Helpers: WhatsApp, formatting
│   │   └── mock-data.ts                ← Sample data (16 listings)
│   └── types/index.ts                  ← TypeScript types + category config
├── database/
│   └── schema.sql                      ← Full PostgreSQL schema + sample data
├── .env.example                        ← Environment variables template
├── next.config.js                      ← Security headers + image config
├── tailwind.config.ts                  ← Design system
└── README.md                           ← This file
```

---

## 🚀 Quick Start (VS Code / Local Dev)

### Requirements
- Node.js v18+: https://nodejs.org
- npm (comes with Node.js)
- VS Code: https://code.visualstudio.com

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Set up environment
```bash
# Windows (PowerShell)
Copy-Item .env.example .env.local

# Mac / Linux
cp .env.example .env.local
```
For local testing, you can leave Supabase values as placeholders — the app runs on **mock data by default**.

### Step 3 — Run dev server
```bash
npm run dev
```
Open **http://localhost:3000**

---

## 🌐 All Pages

| URL | Description |
|-----|-------------|
| `localhost:3000` | Homepage |
| `localhost:3000/search` | Search all listings |
| `localhost:3000/livestock` | Browse livestock |
| `localhost:3000/vet-services` | Vet services |
| `localhost:3000/feeds` | Animal feeds |
| `localhost:3000/products` | Livestock products |
| `localhost:3000/item/1` | Item detail + WhatsApp |
| `localhost:3000/request` | Farmer request form |
| `localhost:3000/admin/login` | Admin login |
| `localhost:3000/admin/dashboard` | Admin overview |
| `localhost:3000/admin/items` | Manage items |
| `localhost:3000/admin/items/new` | Add new listing |
| `localhost:3000/admin/leads` | View inquiries |
| `localhost:3000/admin/requests` | Farmer requests |

**Admin demo login:**
- Email: `admin@agritechmarketplace.co.ke`
- Password: `admin123`

---

## 🗄️ Supabase Setup (Production)

### 1. Create project
Go to https://supabase.com → New Project → Region: `eu-west-2` (closest to Kenya)

### 2. Run schema
Supabase Dashboard → **SQL Editor** → Paste contents of `database/schema.sql` → **Run**

### 3. Create storage bucket
Dashboard → **Storage** → **New Bucket**:
- Name: `agritech-images`
- Public: ✅ Yes
- Allowed MIME types: `image/jpeg, image/png, image/webp`
- Max size: `10MB`

### 4. Get API keys
Dashboard → **Settings** → **API**:
```
NEXT_PUBLIC_SUPABASE_URL      = Project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY = anon / public key
SUPABASE_SERVICE_ROLE_KEY     = service_role key (keep secret!)
```

### 5. Switch from mock to live data
In these two files, change `USE_MOCK = false`:
- `src/app/page.tsx`
- `src/app/item/[id]/page.tsx`
- `src/components/marketplace/CategoryPage.tsx`
- `src/app/search/page.tsx`

---

## 📱 WhatsApp Setup

Update your phone number in `.env.local`:
```
NEXT_PUBLIC_WHATSAPP_NUMBER=254712345678
```
Format: Kenya country code (254) + number without leading 0. No spaces, no `+`.

**Example message generated:**
> Hello, I'm interested in *Friesian Dairy Cow* located in *Nkubu, Meru County*. Is it still available?
> View listing: https://yoursite.com/item/2

---

## 🔐 Admin Authentication (Production)

The current login is demo-only. For production:

**1. Install auth helper:**
```bash
npm install @supabase/auth-helpers-nextjs
```

**2. Create admin user** in Supabase Dashboard → Authentication → Users → Add User

**3. Create `src/middleware.ts`:**
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  return res
}

export const config = { matcher: ['/admin/:path*'] }
```

**4. Update `src/app/admin/login/page.tsx`** — replace the demo login block with:
```typescript
const { error } = await supabase.auth.signInWithPassword({ email, password });
if (error) setError(error.message);
else router.push("/admin/dashboard");
```

---

## ☁️ Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: AgriTech Marketplace"
git remote add origin https://github.com/yourusername/agritech.git
git push -u origin main
```

### 2. Deploy
1. Go to https://vercel.com → **New Project**
2. Import your GitHub repository
3. Add all environment variables from `.env.local`
4. Click **Deploy**

### 3. Custom domain
Vercel → Project Settings → Domains → Add `agritechmarketplace.co.ke`

---

## ✏️ Customization Guide

| What to change | Where |
|---------------|-------|
| Platform name | `src/app/layout.tsx` → metadata |
| WhatsApp number | `.env.local` |
| Hero text | `src/app/page.tsx` → Hero section |
| Brand colors | `tailwind.config.ts` → `brand` colors |
| Category types | `src/types/index.ts` → `CATEGORIES` |
| Sample data | `src/lib/mock-data.ts` |
| Footer details | `src/components/layout/Footer.tsx` |
| Admin email | `.env.local` → `ADMIN_EMAIL` |

---

## 🛠️ VS Code Extensions (Recommended)

- **Tailwind CSS IntelliSense** — autocomplete for Tailwind classes
- **ES7+ React/Redux Snippets** — React code snippets
- **Prettier** — code formatting
- **Auto Rename Tag** — rename JSX tags together
- **TypeScript Hero** — TypeScript utilities

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Map | Leaflet.js + OpenStreetMap |
| Forms | React Hook Form + Zod |
| Hosting | Vercel |
| Icons | Lucide React |

---

## 🗺️ Platform Features Summary

| Feature | Status |
|---------|--------|
| ✅ Homepage with hero & categories | Done |
| ✅ Livestock marketplace | Done |
| ✅ Veterinary services | Done |
| ✅ Animal feeds | Done |
| ✅ Livestock products | Done |
| ✅ Universal search + filters | Done |
| ✅ Item detail pages | Done |
| ✅ WhatsApp integration | Done |
| ✅ Inquiry/lead forms | Done |
| ✅ Farmer request system | Done |
| ✅ Interactive map | Done |
| ✅ Admin dashboard | Done |
| ✅ Admin CRUD for items | Done |
| ✅ Admin leads management | Done |
| ✅ Admin requests management | Done |
| ✅ SEO optimization | Done |
| ✅ Mobile-first responsive | Done |
| ✅ Mock data (16 listings) | Done |
| ✅ Supabase integration ready | Done |

---

Built for Kenyan Farmers 🇰🇪 | AgriTech Marketplace
#   a g r i t e c h - s o l u t i o n s  
 