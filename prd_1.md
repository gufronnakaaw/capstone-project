# Product Requirements Document (PRD)

## Village Library Management Information System

**"Pengembangan Sistem Informasi Manajemen Perpustakaan Desa untuk Meningkatkan Pelayanan dan Akurasi Data Anggota Berbasis Web"**

> This document is written for an AI frontend coding agent. Scope covers **frontend only** for this phase — the backend will be integrated later. Use dummy/mock data structured so it can be swapped for real API calls with minimal refactor.

---

## 1. Project Summary

A web-based information system for a village library ("Perpustakaan Desa") that digitizes book & member management, borrowing/returning workflows, activity programs, and work-program (proker) tracking, with role-based access for Admin, Librarian (Pustakawan), and Member (User).

**Goals:**

- Improve service quality (faster borrow/return, clearer activity info).
- Improve data accuracy (books, members, transactions).
- Present the village library digitally — approachable, not corporate/generic SaaS-looking.

---

## 2. Current Tech State

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (already installed — build on top of it, don't fight it)
- **Data layer (this phase):** Local mock/dummy data (JSON or TS constants), structured to mirror a future REST/DB shape (i.e. `id`, `createdAt`, foreign-key-style references) so backend integration later is a drop-in replacement, not a rewrite.
- **Backend:** Not yet — planned for a future phase (out of scope here, but keep data-fetching logic isolated in a `lib/` or `services/` layer so it's easy to swap mock → real API).

---

## 3. Roles & Access

| Role                       | Description                       | Access                                                                                     |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------ |
| **Admin**                  | Full system control               | Manage users/roles, books, members, activities, proker, documentation photos, all reports  |
| **Pustakawan (Librarian)** | Day-to-day library operations     | Manage books, members, borrow/return transactions, view activities & proker (limited edit) |
| **User (Member)**          | Village resident / library member | View books, view own borrow history, view activities & proker, view documentation gallery  |

Auth is out of scope for the mock-data phase, but build the UI **as if role-based routing exists**: separate route groups/layouts for each role (e.g. `/admin/*`, `/pustakawan/*`, `/(member)/*` or `/dashboard/*`), with a mock "logged in as" role switcher for demo/dev purposes (e.g. a dropdown in a dev toolbar) so all three dashboards are reachable and testable without real auth.

---

## 4. Core Features & Pages

### 4.1 Landing / Public Home

- Hero section using **documentation photos as a slideshow or background** (see 4.6). This is the first impression — it should feel like a real village library, not a generic template.
- Quick stats (total books, total members, total activities — can be mock counters).
- Highlighted/recent activities (kegiatan) preview.
- Highlighted proker preview.
- CTA to become a member / login.

### 4.2 Kegiatan (Activities) Page

- List/grid of library activities/events. Use placeholder examples until real data is provided, e.g.:
  1. Gerakan Literasi Desa (Village Literacy Drive)
  2. Lomba Mendongeng Anak (Kids Storytelling Competition)
  3. Bedah Buku (Book Discussion Session)
  4. Donasi Buku (Book Donation Drive)
  5. Perpustakaan Keliling (Mobile Library Visit)
- Each activity card: title, date, short description, cover photo, optional detail page (`/kegiatan/[slug]`) with full description + photo gallery.
- Filter/sort by date (upcoming vs past) is a nice-to-have, not required for v1.

### 4.3 Books Page

- Table/grid view of the book catalog: title, author, category/genre, ISBN, stock/availability status, cover image.
- Search + filter (by category, availability).
- Book detail page/modal: full metadata + "borrow" action (visible to logged-in members; librarians see stock management instead).
- Admin/Pustakawan: CRUD actions (add/edit/delete book) via form/dialog.

### 4.4 Members (Anggota) Page

- Table of registered members: name, member ID, contact, join date, active borrow count, status (active/overdue).
- Member detail page: profile info + borrowing history.
- Admin/Pustakawan: CRUD actions (add/edit/delete member), and this is the page most tied to the "data accuracy" goal in the title — make validation states (duplicate ID, missing fields) visually clear even with mock data.

### 4.5 Proker (Work Program) Page

- List of the library's work programs/initiatives (e.g. annual programs, targets, progress).
- Each item: title, description, timeline/period, status (planned / ongoing / completed), progress indicator.
- Table or timeline/kanban-style layout — pick whichever fits the "eye-catching but tidy" direction (a simple status-grouped board reads less like a generic dashboard than a plain table).

### 4.6 Documentation Photos

- Photo gallery of library activities/documentation.
- Used in two ways:
  1. **Hero background/slideshow** on landing page (auto-rotating, subtle overlay so text stays readable — avoid the generic "dark gradient over stock photo" look; consider a duotone or warm-tint overlay matching the palette).
  2. **Dedicated gallery page**, optionally grouped by activity (linking back to 4.2).
- Use placeholder/mock images for now (e.g. via a placeholder image service or local assets) — structure the data so each photo has `id`, `url`, `caption`, `relatedActivityId`.

### 4.7 Borrow & Return (Pinjam & Kembali)

- Core transactional flow:
  - **Borrow:** member selects a book → confirms → transaction created (mock) with due date.
  - **Return:** librarian/admin marks a transaction as returned, with overdue detection (visual badge: on-time / due soon / overdue).
- A "My Loans" view for the User role (current borrows + history).
- A "Transactions" management view for Pustakawan/Admin (all active loans, search by member/book, mark returned).
- This is the most "app-like" interaction — prioritize clarity of state (borrowed, due soon, overdue, returned) with color-coded badges consistent with the overall palette (don't just default to red/yellow/green traffic-light colors if it clashes — tie badge colors to the chosen palette).

### 4.8 User (Member) Dashboard

- Overview: currently borrowed books + due dates, quick links to browse books, upcoming activities.
- Profile section (view/edit own info — mock).

### 4.9 Admin Dashboard

- Overview: key metrics (total books, total members, active loans, overdue count, upcoming activities/proker).
- Quick access to management pages (books, members, activities, proker, documentation, and in the future — user/role management).
- This is the page most likely to visually default to "generic admin template" — resist that. Reuse the same visual language (color, type, card style) as the public-facing pages rather than switching to a cold, purely utilitarian look.

### 4.10 Future/Unconfirmed Features

The following are known to be coming but not yet specified — leave clean extension points (e.g. sidebar nav items, route structure) but do not build them yet:

- (Placeholder — to be defined later by the user)

---

## 5. Design Direction

**Explicit goal: eye-catching, tidy, and NOT generic "AI-generated SaaS" look.** Concretely, that means:

- **Avoid:** default purple-to-blue gradients, glassmorphism-everywhere, generic rounded-xl cards with soft shadows and no personality, stock "hero + 3 feature cards" layout, Inter font at default weight with no hierarchy.
- **Aim for:** a palette and type pairing that feels like it belongs to a _village library_ — warm, human, a little literary — rather than a fintech dashboard. Suggested direction (adjust to taste, but commit to something specific rather than shadcn's default zinc/slate):
  - A grounded primary color (e.g. deep forest green or warm terracotta/clay) as the brand anchor, paired with a warm neutral background (cream/off-white, not pure white or pure gray) instead of the default slate palette.
  - One accent color used sparingly for CTAs/status (e.g. a mustard/amber), not a rainbow of pastel gradients.
  - Distinct typography: a serif or slab-serif for headings (library/literary feel) paired with a clean sans for body — avoid using the same default sans everywhere at the same weight.
  - Real visual hierarchy: vary spacing/size deliberately per section rather than uniform card grids everywhere.
- Use shadcn/ui components as the structural base but **restyle via Tailwind theme tokens (colors, radius, font)** rather than leaving shadcn defaults untouched — this is the single biggest lever against the "AI slop" look.
- Responsive by default (mobile-first), since village members may primarily access via phone.

---

## 6. Suggested Information Architecture

```
/                       → Landing (public)
/kegiatan               → Activities list
/kegiatan/[slug]        → Activity detail
/buku                   → Books catalog (public browse; borrow action gated)
/buku/[id]              → Book detail
/proker                 → Work program page
/galeri                 → Documentation photo gallery
/dashboard              → Member (User) dashboard
/dashboard/pinjaman     → My loans
/pustakawan             → Librarian dashboard
/pustakawan/buku        → Manage books
/pustakawan/anggota     → Manage members
/pustakawan/transaksi   → Manage borrow/return transactions
/admin                  → Admin dashboard
/admin/*                → Full management (books, members, activities, proker, galeri, and future: users/roles)
```

---

## 7. Data Model (Mock, backend-ready shape)

Keep mock data typed and centralized (e.g. `lib/mock-data/*.ts`) with shapes like:

- `Book`: id, title, author, category, isbn, coverUrl, stock, availableStock
- `Member`: id, name, memberCode, contact, joinDate, status
- `Loan`: id, bookId, memberId, borrowedAt, dueAt, returnedAt, status (`borrowed | due-soon | overdue | returned`)
- `Activity`: id, title, slug, date, description, coverPhotoId, photoIds
- `Proker`: id, title, description, period, status (`planned | ongoing | completed`), progress
- `Photo`: id, url, caption, relatedActivityId

---

## 8. Non-Functional Requirements

- Fully responsive (mobile, tablet, desktop).
- Fast perceived performance (use Next.js image optimization, loading skeletons — shadcn's `Skeleton` — instead of blank states).
- Clean component structure: reusable cards/badges/tables shared across role dashboards rather than duplicated per role.
- Accessible color contrast even with the warmer/less-default palette.

---

## 9. Out of Scope (this phase)

- Real authentication/authorization
- Real database/API integration
- Notifications (email/SMS reminders for due dates)
- Payment/fines handling (if applicable later)
