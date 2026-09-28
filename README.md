# Chitral Taiz News — React + Tailwind Website

Full conversion of the original HTML design into a React + Tailwind CSS + JS
project, split into three parts:

1. **User Side (`/`)** — the public news site: hero story, category filters,
   search, news grid, sidebar (Most Read / PDF hub / E-paper), article
   detail modal, E-paper modal, footer. Same design as your HTML file.
2. **Admin Panel (`/admin`)** — protected dashboard with content stats and a
   full article management table (edit / delete).
3. **Editor Panel (`/editor/new` and `/editor/:id`)** — full-page form to
   create a new article or edit an existing one (title, category, author,
   image, video, PDF link, content, "NEW" badge toggle).

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Admin Login

Go to `/admin` (or click "Admin Publisher" in the top bar) — you'll be sent
to the login screen if not logged in.

- **Username:** `admin`
- **Password:** `ctn-admin-2026`

You can change these in `src/context/AuthContext.jsx`.

> ⚠️ This is a **front-end-only demo login** — there is no real backend, so
> it isn't secure for production use. For a real deployment, connect this
> to a proper authentication API/backend.

## How data works

There's no database yet — articles are stored in the browser's
`localStorage` (`src/context/ArticlesContext.jsx`), seeded from
`src/data/mockArticles.js` the first time the app runs. Anything you
publish or edit from the Editor panel is saved there and immediately
reflected on the public site and in Admin > Manage Articles.

To connect a real backend later, replace the functions inside
`ArticlesContext.jsx` (`addArticle`, `updateArticle`, `deleteArticle`,
`getArticle`) with API calls (e.g. `fetch`/`axios`) to your server.

## Rich text editor + pictures on Google Drive

The Editor panel has a full toolbar (bold, italic, underline, headings, lists,
quote, alignment, links, pictures, undo/redo). Pictures can be placed anywhere
inside the article and are uploaded straight to **your own Google Drive**
(folder "CTN News Images"), made viewable by visitors, and inserted by link.
Big photos are auto-resized (max 1600px) before upload.

### One-time Google setup (about 5 minutes)

1. Open https://console.cloud.google.com and create a project (e.g. "CTN Website").
2. **APIs & Services > Library** -> search **Google Drive API** -> **Enable**.
3. **APIs & Services > OAuth consent screen** -> User type **External** -> fill app
   name + your email -> under **Test users** add your own Gmail address.
4. **APIs & Services > Credentials > Create credentials > OAuth client ID** ->
   type **Web application** -> under **Authorized JavaScript origins** add
   `http://localhost:5173` (and your real domain once the site is online).
5. Copy the Client ID. In the project root copy `.env.example` to `.env` and paste it:

   ```
   VITE_GOOGLE_CLIENT_ID=1234567890-abc.apps.googleusercontent.com
   ```
6. Restart `npm run dev` (Vite only reads `.env` on start).

In the editor click **Picture > Connect Google Drive** once per session, then choose
or drag a picture. The app only sees files it created itself (`drive.file` scope).
You can also paste any Drive share link (set to "Anyone with the link") in the
"Image Link" tab.

Note: Google Drive links are fine for a small/medium site. If the site gets a lot
of traffic, Google may throttle Drive-hosted images; at that point move images to
a proper image host (Cloudinary, Cloudflare R2, your own hosting).

## Urdu news + Opinion / Articles

- In the Editor pick **English / اردو**. Urdu switches the title and the article body to right-to-left with a
  Nastaliq font (Noto Nastaliq Urdu). On the public site Urdu stories show right-to-left everywhere
  (hero, cards, sidebar, article popup). Type Urdu with the Windows Urdu keyboard (Win + Space).
- Stories in the **Opinion** and **Articles** categories never take the big slot on the front page. They have
  their own tabs (Opinion / Articles) and appear as small text lists in the right sidebar.

## Project Structure

```
src/
  components/     → shared public-site UI (Header, Ticker, HeroStory, NewsGrid, Sidebar, modals, Footer)
  pages/Home.jsx  → public user-side page, wires everything together
  admin/          → AdminLogin, AdminLayout, AdminDashboard, AdminArticles, ProtectedRoute
  editor/         → Editor.jsx (create/edit article form)
  lib/            → drive.js (Google Drive upload), html.js (sanitize / strip helpers)
  context/        → ArticlesContext (data), AuthContext (login), NotificationContext (toasts)
  data/           → mockArticles.js (seed data)
```

## Notes

- Tailwind + brand colors (`brand.red`, `brand.dark`, etc.) and fonts
  (Inter, Playfair Display) are configured in `tailwind.config.js`,
  matching the original design's Tailwind config.
- FontAwesome icons are loaded via CDN in `index.html`, same as the
  original file.
- Routing is handled with `react-router-dom`.
