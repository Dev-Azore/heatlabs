# 🌐 HEAT Labs Platform

HEAT Labs is an **interactive learning platform** built with **Next.js 14, Supabase, and TailwindCSS**.  
It provides hands-on labs in **Health, Education, Agriculture, and Technology**, with real-time progress tracking and an admin portal for content management.

---

## 🚀 Features

- **Landing Page** with hero, features, and CTA.
- **Auth System** (Email + Google + GitHub) via Supabase.
- **Student Dashboard**:
  - View Labs (Health, Education, Agriculture, Technology).
  - Explore Modules inside each Lab.
  - Complete interactive challenges (coded modules).
  - Track progress (via `upsert_user_progress` RPC).
- **Admin Portal**:
  - CRUD for Labs, Modules, and Posts.
  - Securely protected via **middleware** + Supabase RLS.
  - Upload images to Supabase Storage.
- **Dark/Light Mode** (default dark, toggleable).
- **Responsive UI** with Tailwind and reusable components.

---

## 📂 Project Structure

```bash
heatlabs/
 ├── app/                     # Next.js App Router pages
 │   ├── (public)/            # Landing, auth pages
 │   ├── (dashboard)/         # Student dashboard
 │   │   ├── labs/            # Labs index + details
 │   │   ├── modules/         # Module index + details
 │   │   └── posts/           # News/blog feed
 │   └── admin/               # Admin-only pages
 │       ├── labs/            # Manage labs
 │       ├── modules/         # Manage modules
 │       └── posts/           # Manage posts
 │
 ├── components/              # Reusable UI components
 ├── lib/                     # Supabase client & utilities
 ├── styles/                  # Global styles
 ├── public/                  # Static assets (icons, logos)
 ├── middleware.ts            # Protects /admin routes
 ├── package.json
 └── README.md                # Project documentation


🛠️ Tech Stack

Next.js 14 (App Router)

React 18

Supabase
 (Auth, DB, Storage, RLS)

TailwindCSS

TypeScript

⚙️ Setup Instructions

Clone the repo

git clone <repo-url>
cd heatlabs


Install dependencies

npm install


Environment variables
Copy .env.example → .env.local and add your Supabase credentials:

NEXT_PUBLIC_SUPABASE_URL=https://<......>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<......>


Run dev server

npm run dev


Open http://localhost:3000

🔐 Authentication & Roles

Users can sign up with Email, Google, or GitHub.

A profiles row is auto-created by a Supabase trigger.

Default role = student.

One user must be promoted to admin in profiles table.

Middleware Protection

/admin/* is protected by middleware.ts.

Unauthorized users are redirected:

Not logged in → /auth/login

Logged in but not admin → /dashboard

🧑‍💻 Admin Portal

Admins can:

Manage Labs (CRUD).

Manage Modules (CRUD).

Manage Posts (CRUD + upload cover images).

Images are stored in Supabase Storage:

lab-icons/ → icons for labs.

posts/ → post cover images.

📊 Database Schema (Supabase)

profiles → user info & role

labs → labs (Health, Education, Agriculture, Technology)

modules → modules inside labs

posts → dashboard feed

user_progress → track student progress

Includes:

Triggers (updated_at, profile on signup)

RPCs (get_my_role, is_admin_or_moderator, upsert_user_progress)

RLS policies for fine-grained access control

📞 Contact & Footer Info

Address: CBT Quarters, 700102, Kano State, Nigeria

GSM: (+234) 07061110002, (+234) 08103214013

Email: thetechtribe2025@gmail.com