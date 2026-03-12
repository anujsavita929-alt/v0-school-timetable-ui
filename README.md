# School Timetable Management UIX

A modern, responsive web application for managing school timetables, built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui** components. Generated with help from **v0.dev**.

This project provides role-based
 access for different users (students, teachers, principals/admins) to view, manage, and interact with school schedules, students, teachers, and organizations.

![School Timetable Preview](https://via.placeholder.com/1200x600?text=School+Timetable+UI+Preview)  
*(Add a real screenshot here later – see instructions below)*

## Features

- **Role-based authentication**
  - Role selection screen
  - Login pages for diff erent roles (`/login/student`, `/login/teacher`, `/login/principal`, etc.)
- **User registration** (`/signup`)
- **Dashboard** – personalized view after login (`/dashboard`)
- **Timetable management** (`/timetable`)
  - View weekly/monthly schedules
  - (Potential) Create/edit periods, assign classes/teachers/rooms
- **Student & Teacher management** (`/students`, `/teachers`)
  - List, view details, possibly CRUD operations for admins
- **Organization/School setup** (`/organizations`)
- Clean, modern UI with:
  - shadcn/ui components (dialogs, tables, cards, forms, etc.)
  - Dark/light mode support (via next-themes)
  - Responsive design (mobile + desktop)
  - Form handling with react-hook-form + zod validation

## Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + tailwindcss-animate
- **UI Components**: shadcn/ui + Radix UI primitives
- **Icons**: lucide-react
- **Forms & Validation**: react-hook-form + zod
- **Date handling**: date-fns
- **Charts** (if used): recharts
- **Other**: sonner (toasts), cmdk (command palette), embla-carousel, vaul (drawers), etc.
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js ≥ 18.17 (recommended: 20.x or 22.x)
- pnpm (preferred) or npm/yarn

```bash
# Install pnpm globally (if not already)
npm install -g pnpm


Installation

Clone the repository

Bashgit clone https://github.com/anujsavita929-alt/v0-school-timetable-ui.git
cd v0-school-timetable-ui

Install dependencies

Bashpnpm install

Run development server

Bashpnpm dev
→ Open http://localhost:3000
You should see the role selection screen first.
Available Scripts
Bashpnpm dev     # Start dev server (localhost:3000)
pnpm build   # Build for production
pnpm start   # Run production build
pnpm lint    # Run ESLint (if configured)
Project Structure
textapp/
├── dashboard/           # Main dashboard after login
├── login/[role]/        # Dynamic login pages per role
├── organizations/       # School/organization management
├── role-selection/      # Choose role at start
├── signup/              # Registration page
├── students/            # Student list & management
├── teachers/            # Teacher list & management
├── timetable/           # Core timetable view & editor
├── globals.css
├── layout.tsx           # Root layout
└── page.tsx             # Landing / home page
components/              # shadcn/ui + custom components
hooks/                   # Custom React hooks
lib/                     # Utilities, cn helper, etc.
public/                  # Static assets
styles/                  # Additional global styles (if any)

