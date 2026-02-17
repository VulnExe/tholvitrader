# Migration Summary: Next.js to Vite React

This document outlines the migration of the Tholvitrader application from Next.js to a standard React application using Vite.

## 1. Project Setup
- **Build Tool**: Vite (replaced Next.js and Webpack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + PostCSS
- **Routing**: React Router DOM v6 (replaced Next.js App Router)

## 2. Key Changes

### Routing
- Replaced file-system routing (`app/page.tsx`) with explicit routing configuration in `src/App.tsx`.
- Replaced `next/navigation` hooks (`useRouter`, `usePathname`, `useSearchParams`) with `react-router-dom` hooks (`useNavigate`, `useLocation`, `useParams`).
- Replaced `next/link` with `react-router-dom`'s `<Link>` component.

### State Management & Data Fetching
- **Zustand Store**: Preserved `src/lib/store.ts` but removed `'use client'` directives as they are not needed in a client-side Vite app.
- **Supabase**: Updated `src/lib/supabase.ts` to use `import.meta.env.VITE_*` instead of `process.env.NEXT_PUBLIC_*`.
- **Environment Variables**: Created `.env` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

### Components
- Removed `'use client'` directives from all UI components since the entire app runs on the client.
- `Image` component from `next/image` replaced with standard `<img>` tags (or handled via CSS).

### Admin Dashboard
- Migrated all admin pages (`/admin/*`) to React components in `src/pages/admin/`.
- Updated store actions to return `{ success: boolean; error?: string }` objects for easier error handling in components.

## 3. How to Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

4.  **Preview Production Build**:
    ```bash
    npm run preview
    ```

## 4. Troubleshooting
- If you encounter Supabase errors, verify that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct in the `.env` file.
- If assets (images) are missing, ensure they are in the `public/` directory.
