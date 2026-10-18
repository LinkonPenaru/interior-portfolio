# Urvi G Eragola — Interior Architecture & Spatial Design Portfolio

A high-performance, editorial interior design portfolio and content management system built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Supabase**, designed specifically for interior designer Urvi G Eragola (Rachana Sansad's Academy of Architecture, Mumbai).

---

## 🏛️ Project Overview

This project includes both a public editorial portfolio and a secure, private administrative dashboard (`/admin`) allowing the designer to create, edit, reorder, publish, and delete projects without touching any code or requiring developer assistance.

All project photography, drawings, and metadata are **100% verified** from the designer's three physical drafting portfolios:
1. `Id kitchen.pdf` (10 pages)
2. `Id Master bedroom.pdf` (10 pages)
3. `Id (kids bedroom).pdf` (7 pages)

---

## 🛠️ Technology Stack

- **Frontend:** React 18 with Vite & TypeScript
- **Styling:** Tailwind CSS with custom editorial architectural theme & typography (`Cormorant Garamond` + `Plus Jakarta Sans`)
- **Backend & Database:** Supabase Free Tier (PostgreSQL with Row Level Security)
- **Authentication:** Supabase Auth (Email & Password with admin allowlist)
- **Storage:** Supabase Storage (`portfolio-images` public bucket) with client-side canvas compression/resizing
- **Routing:** React Router v6 (SPA with protected admin routes)
- **Icons:** Lucide React
- **Asset Processing:** High-resolution WebP optimization via Pillow/PyMuPDF
- **Deployment Target:** Cloudflare Pages (Free Tier static hosting with `_redirects` SPA rewrite)

---

## 📂 Project Structure

```
portflio/
├── public/
│   ├── favicon.svg                           # Minimalist architectural monogram favicon
│   ├── _redirects                            # Cloudflare Pages SPA rewrite configuration
│   ├── admin-dashboard-preview.png           # Automated screenshot of admin dashboard
│   ├── admin-editor-preview.png              # Automated screenshot of project editor
│   └── projects/
│       ├── manifest.json                     # Asset catalog linking images to PDF pages
│       ├── kitchen/                          # 10 optimized WebP sheets from Id kitchen.pdf
│       ├── master-bedroom/                   # 10 optimized WebP sheets from Id Master bedroom.pdf
│       └── kids-bedroom/                     # 7 optimized WebP sheets from Id (kids bedroom).pdf
├── supabase/
│   ├── migration.sql                         # Complete database schema, RLS policies & storage rules
│   └── seed.sql                              # Seed data for the 3 verified PDF projects
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx               # Admin navigation shell & header
│   │   │   ├── ProtectedRoute.tsx            # Route guard enforcing authentication & admin privileges
│   │   │   └── UnauthorizedNotice.tsx        # Screen shown when non-admin logs in
│   │   ├── layout/
│   │   │   ├── Navbar.tsx                    # Editorial header with responsive mobile drawer
│   │   │   ├── Footer.tsx                    # Minimal architectural footer with academic details
│   │   │   ├── Layout.tsx                    # Public shell layout
│   │   │   └── ScrollToTop.tsx               # Route change scroll reset
│   │   └── ui/
│   │       ├── ProjectCard.tsx               # Editorial project cards with hover zoom
│   │       ├── Lightbox.tsx                  # Fullscreen sheet inspector for drawings/scales
│   │       └── EmptyState.tsx                # Accessible fallback state
│   ├── context/
│   │   └── AuthContext.tsx                   # Supabase auth session, admin allowlist verification & demo fallback
│   ├── data/
│   │   └── projects.ts                       # Local fallback verified data store
│   ├── lib/
│   │   └── supabase.ts                       # Supabase client initialization & helper functions
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboardPage.tsx        # Metrics, search, filters, reordering, publish toggle & delete modal
│   │   │   ├── AdminLoginPage.tsx            # Email/password authentication & reset forms
│   │   │   └── ProjectEditorPage.tsx         # Comprehensive project editor with live modal preview
│   │   ├── HomePage.tsx                      # Hero, verified showcase, technical skills, CTA
│   │   ├── ProjectsPage.tsx                  # Filterable gallery of verified projects
│   │   ├── ProjectDetailPage.tsx             # Reusable detail template with drawing gallery & lightbox
│   │   ├── AboutPage.tsx                     # Academic background & drafting philosophy
│   │   ├── ContactPage.tsx                   # Inquiries form & privacy-safe contact channels
│   │   └── NotFoundPage.tsx                  # Architectural 404 error page
│   ├── services/
│   │   ├── projectService.ts                 # Full CRUD & reordering data layer with automatic fallback
│   │   └── storageService.ts                 # Image validation, client canvas resize, upload & deletion
│   ├── types/
│   │   └── project.ts                        # TypeScript interfaces & database row mappers
│   ├── App.tsx                               # Router configuration with public and admin routes
│   ├── index.css                             # Tailwind directives & typography styling
│   └── main.tsx                              # Application entry point
├── .env.example                              # Template for Supabase environment variables
├── Id kitchen.pdf                            # Original source PDF (preserved untouched)
├── Id Master bedroom.pdf                     # Original source PDF (preserved untouched)
├── Id (kids bedroom).pdf                     # Original source PDF (preserved untouched)
└── vite.config.ts                            # Vite build config with Rollup code-splitting chunks
```

---

## ⚡ Quick Start: Local Development

### Prerequisites
- Node.js (v18+ or v22+)
- npm (v9+ or v10+)

### Commands

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

> [!NOTE]
> If no `.env` file is present, the app automatically runs in **Local Demo Mode**, serving the 3 verified PDF projects from the local store and providing demo admin sign-in with credentials `admin@urvieragola.design` / `SecureStudio2026!`. All admin actions (creating, updating, publishing, reordering, deleting) function in memory and local storage.

3. **Build for production:**
   ```bash
   npm run build
   ```
   Compiles zero-warning production assets into `dist/` with chunked code splitting.

---

## 🔒 Supabase Setup Guide (Free Tier)

To connect this application to live Supabase backend services, follow these simple steps in the Supabase dashboard:

### Step 1: Create a Free Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project** and choose a project name (e.g. `urvi-portfolio`), strong database password, and free-tier region.

### Step 2: Run Database Migration
1. In the Supabase Dashboard, open the **SQL Editor** tab from the left sidebar.
2. Click **New Query**.
3. Open `supabase/migration.sql` in this repository, paste the entire contents into the SQL Editor, and click **Run**.
4. This creates:
   - `projects` table with strict UUID primary keys, JSONB gallery, metadata, and timestamps
   - `admin_users` allowlist table
   - `public.is_admin()` SECURITY DEFINER function
   - Strict Row Level Security (RLS) policies allowing public read of published projects, but restricting write/edit/delete exclusively to verified admins
   - Storage bucket `portfolio-images` with public read and admin-only upload/delete policies.

### Step 3: Seed Initial Verified Projects
1. In the **SQL Editor**, open another **New Query**.
2. Open `supabase/seed.sql` in this repository, paste its contents, and click **Run**.
3. This populates all 3 verified PDF projects (*Modern Contemporary Kitchen*, *Thematic Master Bedroom Suite*, and *A Sky Bedroom*) with full drawings, specifications, scales, and palettes into your PostgreSQL database.

### Step 4: Create Your First Admin Account
1. In the Supabase Dashboard, open **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your designer's email (e.g. `urvieragola@gmail.com`) and a secure password.
4. Uncheck "Auto Confirm User?" or ensure email is confirmed.
5. In the **SQL Editor**, run the following one-line query to grant this account administrative privileges:
   ```sql
   INSERT INTO public.admin_users (id, email)
   VALUES ('<PASTE-USER-UUID-HERE>', 'urvieragola@gmail.com')
   ON CONFLICT (id) DO NOTHING;
   ```
   *(Replace `<PASTE-USER-UUID-HERE>` with the User UID from Authentication -> Users).*

### Step 5: Configure Environment Variables
1. In the Supabase Dashboard, go to **Project Settings** -> **API**.
2. Copy your **Project URL** and **anon public API Key**.
3. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Fill in the values:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
5. Restart your Vite development server (`npm run dev`). The app is now connected to live Supabase!

---

## 🛡️ Security Architecture & Row Level Security (RLS)

1. **Anonymous Visitors:**
   - Can ONLY execute `SELECT` queries on `projects` WHERE `published = true`.
   - Cannot see draft projects.
   - Cannot `INSERT`, `UPDATE`, or `DELETE` any row.
   - Can read public images from `portfolio-images` storage bucket.
   - Cannot upload or delete storage files.

2. **Authenticated Non-Admins:**
   - Any user authenticated with Supabase who is **not** present in `admin_users` is denied `INSERT`, `UPDATE`, and `DELETE` at the database engine level via `public.is_admin()`.
   - The frontend displays an architectural `UnauthorizedNotice` warning them that their account lacks administrative clearance.

3. **Authorized Admins:**
   - Can view all projects (drafts and published).
   - Can create, edit, save drafts, publish/unpublish, reorder, and delete projects.
   - Can upload and delete storage assets.

---

## 🖼️ Image Upload & Client Optimization

- **Supported Formats:** JPEG, PNG, WebP.
- **Size Limit:** 5MB max upload.
- **Client-Side Canvas Optimization:** Prior to network upload, images larger than 2000px on the longest dimension are proportionally downscaled in the browser canvas and converted to quality 85% WebP, minimizing bandwidth usage on the Supabase Free tier.
- **Collision-Resistant Filenames:** `projects/${slug}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`.

---

## 🧪 Automated Testing

An automated Playwright test suite is included in `scratch/test_phase2_admin.py` that verifies:
1. Unauthorized redirect from `/admin` to `/admin/login`
2. Admin sign-in flow
3. Dashboard metrics & 3 verified PDF projects intact
4. Creating a new project draft
5. Draft isolation from public `/projects`
6. Publishing project & instant public visibility
7. Editing project details & persistence across reload
8. Deleting project with modal confirmation & toast notification
9. Admin sign-out
10. Route protection verification after sign-out.

To execute tests:
```bash
py scratch/test_phase2_admin.py
```
*(All 10 tests pass with 100% success).*

---

## 🔍 Verified Source Information

Every single project attribute is grounded in the provided physical drafting sheets:

| Project | Institution & Class | Source PDF | Verified Sheets | Verified Details |
| :--- | :--- | :--- | :--- | :--- |
| **Modern Contemporary Kitchen** | Rachana Sansad's Academy of Architecture, Mumbai (FYBVOC, Roll 14) | `Id kitchen.pdf` | 10 Sheets | Olive green matte cabinetry, copper hardware, green marble platform, appliance schedule (Samsung, KitchenAid, iBell; ₹5,45,883 total), 1:10 floor plans, 1:2 joinery details. |
| **Thematic Master Bedroom Suite** | Rachana Sansad's Academy of Architecture, Mumbai (FYBVOC, Roll 14) | `Id Master bedroom.pdf` | 10 Sheets | Character brief (Yumeko Jabami), 2BHK master plan (1:25), fluted crimson accent walls, Nero Marquina black marble bath, wood plank flooring, electrical looping with SB1/SB2/SB3 schedules. |
| **A Sky Bedroom** | Rachana Sansad's Academy of Architecture, Mumbai (FYBVOC, Roll 14) | `Id (kids bedroom).pdf` | 7 Sheets | Celestial cloud concept, cloud headboard/study desk, rainbow arch bookshelf, Amtico geometric blue tiles, Jaquar/Kohler sanitaryware, fiber-optic starry night ceiling. |
