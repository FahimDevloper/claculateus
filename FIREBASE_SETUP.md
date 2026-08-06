# Firebase setup checklist

The app is already wired up to your `calculateus` Firebase project (config in `.env.local`,
not committed to git). A few things need to be done **once, in the Firebase Console**, before
sign-in and cloud sync will actually work.

> ⚠️ **Confirmed blocker as of the last build:** Firestore itself isn't enabled yet on this
> project. The production build logged `PERMISSION_DENIED: Cloud Firestore API has not been used
> in project calculateus before or it is disabled`. This means favorites/history sync, the blog,
> and the admin panel can't read or write anything yet — sign-in works fine, but nothing
> Firestore-backed will until you complete **Step 2** below. This is normal for a brand-new
> project; it just needs the one-time "Create database" step.

## 1. Enable sign-in providers

Firebase Console → **Authentication** → **Sign-in method** → enable:
- **Email/Password**
- **Google**

Without this, sign-in attempts will fail with an `auth/operation-not-allowed` error.

## 2. Create the Firestore database (if you haven't already)

Firebase Console → **Firestore Database** → **Create database** → start in **Production mode**
→ pick a region close to your users.

## 3. Deploy the security rules

The rules file is at `firestore.rules` in the project root. It restricts each signed-in user to
their own `users/{uid}` document, makes published blog posts public-readable (drafts/scheduled
stay admin-only), and lets any signed-in user post a comment as themselves.

**Easiest way (Console):**
Firebase Console → **Firestore Database** → **Rules** tab → paste the contents of
`firestore.rules` → **Publish**.

**Or via CLI**, if you have Node installed locally:
```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # choose "Use an existing project" → calculateus
firebase deploy --only firestore:rules,firestore:indexes
```

## 3b. Blog admin access

Only the email(s) listed in `src/lib/admin/config.ts` (`ADMIN_EMAILS`) can access `/admin` and
publish posts — this list **must match** the email hardcoded in the `isAdmin()` function at the
top of `firestore.rules`, since the rules are the actual security boundary (the code-side check is
just for hiding the UI). It's currently set to your email. Sign up/sign in on the live site with
that email and you'll have admin access automatically — no extra setup needed.

## 3c. Composite indexes for the blog

The blog listing and category pages filter by `status` and sort by `publishedAt`, which needs a
composite index. `firestore.indexes.json` defines them — deploy with
`firebase deploy --only firestore:indexes`, or simpler: just visit `/blog` once after you've
published a post — if an index is missing, Firestore returns an error in the browser console
containing a direct link that creates the exact index needed with one click.

## 4. Authorized domains (for Google sign-in)

Firebase Console → **Authentication** → **Settings** → **Authorized domains**.
`localhost` is included by default. When you deploy, add your real domain
(`calculateus.com` and `www.calculateus.com`) here or Google sign-in will fail on production.

## 5. Environment variables on your host

`.env.local` is only used for local development and is not committed to git. When you deploy
(Vercel, Netlify, etc.), add the same variables from `.env.example` in that platform's project
settings / environment variables screen, using the values from `.env.local`.

## What's already wired up in the app

- Email/password and Google sign-in (optional — the site fully works without an account)
- Favorites, calculation history, and recently-viewed calculators sync to Firestore for signed-in
  users, with local `localStorage` as the instant, offline-friendly source of truth
- Firebase Analytics logs page views and calculator views (only runs in the browser, and only if
  analytics is supported)
- A full blog: `/blog` (listing + search + category filter), `/blog/[slug]` (article page with
  table of contents, reading progress bar, share/print, related posts, comments), category
  archives, an RSS feed at `/blog/rss.xml`, and blog posts included in `sitemap.xml`. Published
  posts render server-side for real SEO; drafts and scheduled posts stay private.
- An admin panel at `/admin` (dashboard, post list, editor with live Markdown preview and
  draft/scheduled/published states) — restricted to the email(s) in `src/lib/admin/config.ts`.
  "Scheduled" posts go live the next time anyone loads `/admin/posts` after their scheduled time
  (there's no server cron in this static-hosted setup) — fine for a solo-admin blog, worth knowing
  if you need publish-to-the-second precision later.
