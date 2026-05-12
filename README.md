# ToolVerse - Desktop Tool Marketplace

Modern SaaS-style marketplace for desktop tools using React + Vite + Tailwind + Supabase.

## Stack
- React + Vite
- TailwindCSS (v4)
- shadcn/ui style reusable components (`src/components/ui`)
- Supabase (Auth, Postgres, Storage)
- React Router
- Lucide Icons

## Features
- Dark modern homepage with hero, featured tools, and polished cards
- Google login via Supabase OAuth with persistent session
- Marketplace with category filters, search, and pagination
- Tool detail page with guides, changelog, version, and related tools
- Protected admin dashboard with create/edit/delete tools
- Thumbnail and downloadable file uploads to Supabase Storage
- SEO title/description handling and AdSense placeholder sections
- Responsive layout and reusable components

## Project Structure

```txt
src/
  app/router.jsx
  components/
    layout/
    marketplace/
    ui/
    ProtectedRoute.jsx
    Seo.jsx
  contexts/AuthContext.jsx
  data/categories.js
  hooks/useAuth.js
  lib/supabase.js
  pages/
    HomePage.jsx
    MarketplacePage.jsx
    ToolDetailPage.jsx
    AdminPage.jsx
  services/toolService.js
```

## Environment Variables
Copy `.env.example` to `.env` and set:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SUPABASE_REDIRECT_URL=http://localhost:5173
```

For production on Cloudflare Pages, set redirect URL to your domain, e.g.:
`https://toolverse.example.com`

## Supabase Setup
1. Create a Supabase project.
2. Enable Google OAuth in `Authentication > Providers`.
3. Add site URLs and redirect URLs:
   - `http://localhost:5173`
   - your Cloudflare domain
4. Run SQL in `supabase/schema.sql` in Supabase SQL editor.
5. Promote your user as admin:

```sql
update public.profiles set role = 'admin' where id = 'YOUR_USER_UUID';
```

## Development

```bash
npm install
npm run dev
```

## Deploy to Cloudflare Pages
1. Push project to GitHub.
2. In Cloudflare Pages: `Create project` from GitHub repo.
3. Build settings:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
4. Add environment variables in Pages settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_REDIRECT_URL`
5. Ensure `public/_redirects` is included for React Router SPA fallback.
6. Deploy.

## Notes
- Admin route is protected and checks `user.app_metadata.role === 'admin'` in UI. Database authorization is enforced by RLS on `profiles.role = 'admin'`.
- Replace placeholder images by uploading thumbnails from admin dashboard.
- AdSense zones are reserved in homepage/marketplace sections.

