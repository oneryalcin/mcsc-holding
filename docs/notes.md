# MCSC Holding — Technical Project Plan

**Type:** Production static corporate site with editorial workflow
**Last updated:** March 2026

---

## 1. Project Overview

A production corporate website for MCSC Holding, a global sports advisory and governance firm with offices in Monaco, Milan, and Geneva. The site serves as the company's primary web presence. It is statically generated, multilingual (EN/FR/IT), with a CMS-driven editorial workflow for article publishing and a clear separation between developer-managed brand content and editor-managed editorial content.

---

## 2. Locked Tech Stack

| Layer | Technology | Cost | Purpose |
|---|---|---|---|
| **Framework** | Astro | Free | Static site generator, zero JS by default, native i18n routing, content collections with schema validation |
| **CMS** | Decap CMS (formerly Netlify CMS) | Free | Git-based, open-source CMS with native i18n (unlimited locales), browser-based editor UI for non-technical users |
| **CMS Auth** | Netlify Identity | Free | Simple email/password login for non-technical editors, no extra infrastructure, accepted long-term platform risk |
| **Contact Form** | Formspree (Free: 50 submissions/mo) | Free | HTML form action, no backend, email notifications. Sufficient for a corporate inquiry form at launch; upgrade path available |
| **Hosting** | Netlify | Free | Static hosting, SSL, CDN, auto-deploy from Git, build webhooks |
| **Styling** | Tailwind CSS | Free | Utility-first CSS, matches the design system |
| **Icons** | Lucide or Phosphor Icons | Free | Lightweight SVG icon sets |
| **Fonts** | Google Fonts or self-hosted | Free | Serif headings (Playfair Display), sans-serif body (Inter/DM Sans) |
| **Images** | Astro built-in image optimization | Free | `astro:assets` handles responsive images, format conversion, lazy loading. No external CDN needed at launch |
| **Repo** | GitHub | Free | Version control, content storage (Decap commits to repo), triggers Netlify deploys |

**Total monthly cost: £0**

> **Note on Cloudinary:** Not included at launch. Astro's built-in image optimization is sufficient for a static site with moderate image volume. Cloudinary can be added later if the editor needs heavy image management (many uploads, responsive art direction, transformations). This avoids an unnecessary external dependency and admin surface.

> **Note on Formspree limits:** The free tier allows 50 submissions/month. For a corporate inquiry form this is likely sufficient, but should be monitored. If volume grows, Formspree's paid tier ($10/mo) or Netlify Forms (included free up to 100/mo with Netlify hosting) are available alternatives.

---

## 3. Content Ownership Model

This is a critical distinction. Not everything on the site is editor-managed.

| Content area | Managed by | Where it lives | How it's updated |
|---|---|---|---|
| Brand copy (hero, about, pillars, locations, footer) | Developer | `src/i18n/en.json`, `fr.json`, `it.json` | Developer edits JSON, pushes to GitHub, site rebuilds |
| Nav structure and labels | Developer | i18n JSON files | Same |
| Insights & News articles | Marketing editor | `src/content/insights/` (Markdown via Decap CMS) | Editor uses `/admin/` UI, Decap commits to repo, auto-rebuild |
| Team Members | Developer (Phase 1), optionally CMS (Phase 2) | `src/content/team/` (Markdown/YAML) | Developer for now; CMS can be added when there's a real editing need |
| Images (brand) | Developer | `src/assets/images/` | Committed to repo |
| Images (editorial) | Marketing editor | `public/images/uploads/` via Decap | Uploaded through CMS media library |

**Why this split:** Most of the homepage is brand messaging that changes rarely and requires design awareness (layout, emphasis, visual balance). Putting it all in a CMS would create a false promise — the editor could change text but potentially break the visual design. Editorial content (articles) is genuinely dynamic and benefits from a CMS workflow.

> **Client communication point:** The marketing person can publish articles and manage editorial content independently. Brand copy changes (hero text, pillar descriptions, about section) require a developer to update. This should be set as an expectation upfront.

---

## 4. Site Architecture

### 4.1 URL Structure (i18n)

```
mcsc-holding.com/               → English (default)
mcsc-holding.com/fr/             → French
mcsc-holding.com/it/             → Italian
mcsc-holding.com/insights/       → Insights listing (EN)
mcsc-holding.com/insights/[slug] → Article detail page (EN)
mcsc-holding.com/fr/insights/    → Insights listing (FR)
mcsc-holding.com/fr/insights/[slug] → Article detail page (FR)
mcsc-holding.com/it/insights/    → etc.
mcsc-holding.com/admin/          → Decap CMS editor (not indexed)
```

**Decision (locked):** Insights articles get dedicated detail pages at `/insights/[slug]`. No "expand inline" option. Dedicated URLs are required for SEO, social sharing (Open Graph), ChatGPT search discoverability, and internal linking.

### 4.2 Single-Page Sections (anchor navigation on homepage)

```
/#home            → Hero
/#licenses        → Licenses & Authorizations
/#the-group       → Integrated Group. Clear Governance.
/#expertise       → Strategic Pillars
/#key-people      → Our Global Leadership
/#locations       → Office Locations
/#insights        → Insights & News (latest 3, with link to /insights/)
/#contact         → Contact Form
```

Navigation uses smooth scroll to anchors. Language switcher (EN | FR | IT) in the navbar.

---

## 5. Page Sections — Detailed Breakdown

### 5.1 Navigation Bar
- **Type:** Fixed/sticky header
- **Elements:** MCSC logo (left), nav links (center), language switcher EN | FR | IT (right)
- **Nav items:** HOME, THE GROUP, EXPERTISE, KEY PEOPLE, LOCATIONS, INSIGHTS, CONTACT
- **Behavior:** Dark background (#1a1f2e), gold accent for active link, hamburger menu on mobile
- **i18n:** Nav labels from JSON translation files
- **CMS:** No

### 5.2 Hero Section
- **Background:** Full-width stadium image with dark overlay
- **Headline:** "Focus on the game, we take care of the rest." — "we" in gold (#c4a44a)
- **Subtitle:** "Providing clear governance and strategic advisory..."
- **CTAs:** "EXPLORE EXPERTISE" (gold filled) → scrolls to #expertise; "GET IN TOUCH" (gold outline) → scrolls to #contact
- **Scroll indicator:** Down arrow at bottom
- **i18n:** All text from JSON
- **CMS:** No

### 5.3 Licenses & Authorizations
- **Layout:** Section title with underline, 4 items in a row
- **Items:** Authorization in Europe, FIFA Licensed 2024, SFAA Member, Transferroom Membership
- **i18n:** Labels from JSON
- **CMS:** No

### 5.4 The Group — "Integrated Group. Clear Governance."
- **Layout:** Two-column — text left, image right
- **Left:** Section label "THE GROUP" (gold), headline, body text, sub-links ("MCSC HOLDING" / "Who We Are")
- **Right:** B&W facility photo with "30+ YEARS OF LEGACY" badge overlay
- **Background:** Cream (#f5f0e8)
- **i18n:** All text from JSON
- **CMS:** No

### 5.5 Strategic Pillars (Expertise)
- **Layout:** Section label "EXPERTISE", title "Strategic Pillars", 4 equal cards
- **Cards:** Sports Mgmt, Image Rights, Advisory, Investments — each with icon, title, description
- **i18n:** From JSON
- **CMS:** No (could be added if pillars change frequently — unlikely)

### 5.6 Our Global Leadership (Key People)
- **Layout:** Dark navy background, filter tabs (PARTNERS | ADVISORS | PROVIDERS), 3 cards per row
- **Cards:** B&W portrait, name, title, quote
- **i18n:** Roles and quotes localized in content files
- **CMS:** No for Phase 1 (developer-managed YAML/Markdown). Can be promoted to CMS collection in Phase 2 if there's real editing demand.

### 5.7 Office Locations
- **Layout:** Cream background, static illustrated world map, 3 location pins
- **Locations:** Monaco (HQ), Milan, Geneva — with addresses
- **i18n:** Labels from JSON
- **CMS:** No

### 5.8 Insights & News (Homepage)
- **Layout:** 3 most recent article cards, "VIEW ALL POSTS" → links to `/insights/`
- **Cards:** Cover image, category + date, title, excerpt
- **CMS:** **YES — primary CMS use case**
- **Data source:** Astro content collection, fetched at build time, sorted by publishDate desc, limited to 3

### 5.9 Insights Listing Page (`/insights/`)
- **Layout:** All published articles, paginated or infinite scroll, filterable by category
- **CMS:** YES (same collection)

### 5.10 Insight Detail Page (`/insights/[slug]`)
- **Layout:** Article title, author/date/category metadata, cover image, full body (Markdown rendered to HTML)
- **SEO:** Per-article Open Graph, structured data (Article schema), canonical URL, hreflang
- **CMS:** YES

### 5.11 Contact Form
- **Fields:** Name, Email, Phone (optional), Subject dropdown, Message, consent checkbox (GDPR)
- **Backend:** Formspree
- **i18n:** Labels and placeholders from JSON
- **CMS:** No
- **Consent text:** "I agree that my data will be used to respond to my inquiry. See our Privacy Policy." (localized)

### 5.12 Footer
- **Layout:** Dark navy, 3 columns — logo/tagline/socials, explore links, contact info
- **i18n:** From JSON
- **CMS:** No

---

## 6. Decap CMS Setup

### 6.1 How It Works

Decap CMS is a single-page React app at `/admin/`. The editor logs in, edits content through a form-based UI, and on publish Decap commits to GitHub. Netlify detects the push and rebuilds the site.

```
Editor visits /admin/ → Authenticates → Edits content →
Decap commits to GitHub → Netlify auto-rebuilds → Site updates (~60s)
```

### 6.2 i18n Configuration

```yaml
# public/admin/config.yml
i18n:
  structure: multiple_files
  locales: [en, fr, it]
  default_locale: en
```

Each article produces per-locale files:
```
src/content/insights/nil-rights-european-football/
  ├── index.en.md
  ├── index.fr.md
  └── index.it.md
```

### 6.3 Content Collection — Insights (CMS-managed)

```yaml
- name: "insights"
  label: "Insights & News"
  folder: "src/content/insights"
  create: true
  i18n: true
  slug: "{{slug}}"
  fields:
    - { name: "title",       label: "Title",        widget: "string",   i18n: true }
    - { name: "category",    label: "Category",     widget: "select",   i18n: duplicate,
        options: ["News", "Events", "Insights"] }
    - { name: "publishDate", label: "Publish Date",  widget: "datetime", i18n: duplicate }
    - { name: "coverImage",  label: "Cover Image",   widget: "image",    i18n: duplicate }
    - { name: "excerpt",     label: "Excerpt",       widget: "text",     i18n: true }
    - { name: "body",        label: "Body",          widget: "markdown",  i18n: true }
```

### 6.4 Authentication

**Decision (locked):** Use **Decap CMS + Netlify Identity**.

**Rationale:** This is the simplest production path for a non-technical marketing editor. It provides an email/password login, requires no extra auth infrastructure, and keeps deployment fully static with no backend to maintain.

**Accepted risk:** Netlify Identity has long-term platform uncertainty despite continued support. That risk is accepted for launch in exchange for lower operational complexity. See **Section 13.1** for fallback planning.

### 6.5 Image Handling

- Editorial images uploaded via CMS go to `public/images/uploads/`
- Additional media files such as PDFs or downloadable documents can also be stored via CMS file fields if needed later
- Brand/design images managed by developer in `src/assets/images/`
- Brand/design images imported from `src/assets/images/` can be optimized with Astro's image pipeline (`<Image>`, WebP/AVIF conversion, responsive sizes, lazy loading)
- Editorial images stored in `public/images/uploads/` are served as static files and are **not** optimized by Astro automatically. If responsive optimization is needed later, move editorial images to a managed asset pipeline or add a dedicated image CDN.
- **Image guidelines for editor:** Max upload 2MB, aspect ratio 16:9 for cover images, minimum 1200px wide
- **Recommendation for video/multimedia:** Use external video hosting (YouTube, Vimeo, or similar) and store embed URLs in the CMS rather than committing large video files to the Git repo

---

## 7. Content Governance

### 7.1 Required Fields by Locale

| Field | EN | FR | IT |
|---|---|---|---|
| Title | Required | Required | Required |
| Excerpt | Required | Required | Required |
| Body | Required | Required | Optional (fallback to EN) |
| Cover Image | Required (shared across locales) | — | — |

### 7.2 Fallback Behavior

If a French or Italian translation is missing for an article, the site falls back to the English version for that field. Articles missing an English version are not published.

### 7.3 Draft vs Published

Decap CMS supports an editorial workflow with draft/review/ready states. Configuration:

```yaml
publish_mode: editorial_workflow
```

This means: editor saves a draft, and the CMS backend creates an unpublished editorial entry that can be reviewed before publication. In GitHub-backed setups this is typically represented via pull requests or unpublished branches, but the exact mechanics depend on the final CMS auth/backend choice.

### 7.4 Image Rules

- Cover images: 16:9 aspect ratio, minimum 1200×675px, max 2MB
- Team photos: 1:1 square crop, minimum 600×600px
- Formats: JPG or PNG (Astro converts to WebP/AVIF at build time)

### 7.5 Editorial Ownership

- **Article publishing:** Marketing editor via Decap CMS
- **Brand copy changes:** Requires developer (JSON files in codebase)
- **Design/layout changes:** Requires developer
- **Approval process:** If editorial_workflow is enabled, publishes go through a PR review step. Otherwise, publishes are immediate.

---

## 8. i18n Strategy

### 8.1 Two-Layer Approach

**Layer 1: Static UI strings** (developer-managed)
- Location: `src/i18n/en.json`, `fr.json`, `it.json`
- Covers: nav labels, buttons, section headings, form labels, footer text, all brand copy
- Example:
```json
{
  "nav.home": "Home",
  "nav.theGroup": "The Group",
  "hero.headline": "Focus on the game, <gold>we</gold> take care of the rest.",
  "cta.explore": "EXPLORE EXPERTISE",
  "cta.contact": "GET IN TOUCH"
}
```

**Layer 2: CMS content** (editor-managed)
- Location: `src/content/insights/` as per-locale Markdown files
- Managed via Decap CMS locale dropdown
- Fallback to English if translation missing

### 8.2 Language Switcher
- Navbar: `EN | FR | IT`, current language highlighted (gold)
- Switching changes URL prefix (`/`, `/fr/`, `/it/`)
- On article pages, switches to the same article in the other locale (or falls back to listing if translation doesn't exist)

---

## 9. SEO & Discoverability Architecture

### 9.1 Technical SEO

| Requirement | Implementation |
|---|---|
| **hreflang** | `<link rel="alternate" hreflang="en" href="...">` on every page, for all 3 locales + `x-default` |
| **Canonical URLs** | `<link rel="canonical">` on every page, per-locale |
| **XML Sitemap** | Auto-generated by `@astrojs/sitemap`, includes all locales and article pages |
| **robots.txt** | Allow all crawlers, reference sitemap, disallow `/admin/` |
| **Meta tags** | Per-page `<title>` and `<meta description>`, localized |
| **Open Graph** | Per-page OG title, description, image — especially on article detail pages for social sharing |
| **Twitter Card** | `summary_large_image` for articles |
| **Structured data (JSON-LD)** | See below |

### 9.2 Structured Data

| Schema | Where | Purpose |
|---|---|---|
| `Organization` | Homepage | Company name, logo, address(es), social profiles, founding date |
| `WebSite` | Homepage | Site name, URL, search action (optional) |
| `BreadcrumbList` | All pages | Navigation path for search features |
| `Article` | Insight detail pages | Title, author, date, category, image — critical for rich results and AI search citation |
| `ContactPage` | Dedicated `/contact` page only, if added later | Signals contact information to crawlers. If contact remains a homepage section, keep contact details within `Organization` structured data instead |

### 9.3 GEO — Generative Engine Optimization

There is no separate "GEO" technical standard. The things that improve visibility in Google AI Overviews, ChatGPT search, and Bing/Copilot answers are strong technical SEO + clear entity signals + citable content. Specifically:

**Crawler access:**
- Allow `OAI-SearchBot` in robots.txt (OpenAI's crawler for ChatGPT search — distinct from GPTBot)
- Allow `Googlebot`, `Bingbot`, and other major crawlers
- Do NOT block AI crawlers unless there's a deliberate business reason

**Entity clarity:**
- Consistent company name, legal entity, office addresses across all pages
- Leadership names and roles as visible, structured text (not just images)
- Licenses and authorizations as text, not just badge images
- Social profile links (LinkedIn, etc.) in structured data and footer

**Content designed for citation:**
- Article pages with clear headings, factual lead paragraphs, author/date/category
- Concise, non-vague copy that answers real questions (e.g., "What does MCSC Holding do?" should be answerable from the first paragraph of the about section)
- Avoid marketing-only language without substance — AI systems prioritize content that can be directly cited as a factual source

**Verification:**
- Register in Google Search Console
- Register in Bing Webmaster Tools
- Monitor appearance in AI features (Google SGE, ChatGPT search) over time

> **Source:** Google explicitly states AI features use the same foundational SEO best practices as normal Search, with no extra markup needed (developers.google.com/search/docs/appearance/ai-features). OpenAI states OAI-SearchBot is the crawler for ChatGPT search (developers.openai.com/api/docs/bots).

---

## 10. Legal & Compliance (EU/GDPR)

For a corporate site operating across Monaco, Italy, and Switzerland with EU-facing audiences, these are not optional.

### 10.1 Required Pages

| Page | Content |
|---|---|
| **Privacy Policy** | Data collection practices, cookies, form data retention, third-party services (Formspree, Netlify, Google Fonts if used), data subject rights, contact for DPO/privacy inquiries |
| **Cookie Policy** | What cookies are set (analytics, if any), purpose, duration, opt-out mechanism |
| **Legal Notice / Imprint** | Company legal entity name, registered office, registration number, responsible person |
| **Terms of Use** | (Optional but recommended) Site usage terms |

These pages should be localized (EN/FR/IT).

### 10.2 Cookie Consent

- If **no analytics** are used and no third-party tracking cookies are set, a cookie banner may not be strictly required (only essential cookies for site function)
- If **Google Analytics or similar** is added, a GDPR-compliant cookie consent banner is required before any tracking fires
- Recommendation: Use a lightweight solution like `cookie-consent.js` or `tarteaucitron.js`
- **Decision required:** Will analytics be used at launch? → This determines whether a cookie banner is needed

### 10.3 Contact Form Compliance

- Consent checkbox required: "I agree that my data will be processed to respond to my inquiry. See our Privacy Policy."
- Data retention: Define how long form submissions are stored in Formspree (Formspree retains submissions for 60 days on free tier by default)
- Do not collect unnecessary data

---

## 11. Design System Tokens

```
Colors:
  --navy:        #1a1f2e    (nav, footer, key people bg)
  --gold:        #c4a44a    (accent, labels, active states)
  --cream:       #f5f0e8    (section backgrounds)
  --white:       #ffffff    (card backgrounds, text on dark)
  --dark-text:   #1a1a1a    (body text on light)
  --light-text:  #8a8a8a    (subtle labels, dates)

Typography:
  --font-heading: "Playfair Display", serif
  --font-body:    "Inter" or "DM Sans", sans-serif
  --font-label:   uppercase, letter-spacing: 0.15em

Spacing:
  --section-padding: 80px–120px vertical
  --container-max:   1200px
  --card-gap:        24px–32px
```

---

## 12. Performance Budgets

Since the site is static and brand-led, Astro's zero-JS default should make performance easy — but targets should be explicit.

| Metric | Target |
|---|---|
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse SEO | 100 |
| Largest Contentful Paint (LCP) | < 2.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Interaction to Next Paint (INP) | < 200ms |
| Total page weight (homepage) | < 1.5MB |
| Max individual image size (served) | < 200KB for optimized brand images; editorial images should stay within practical responsive limits even though `public/` assets are not Astro-optimized |
| Client-side JavaScript | Near zero (only for mobile nav toggle, smooth scroll, language switcher) |
| Font loading | `font-display: swap`, preload critical fonts, max 2 font families |

---

## 13. Implementation Risks

### 13.1 Decap CMS Authentication (HIGH)

**Locked decision:** Use **Decap CMS + Netlify Identity** for launch.

**Risk:** Netlify Identity, the auth backend used for Decap CMS, was marked as deprecated by Netlify on February 28, 2025. A subsequent update (February 19, 2026) confirmed it continues as a supported option, but the deprecation notice remains and Netlify has stated it won't receive normal bugfix/support investment.

**Impact:** For a "set and forget" client site, this is the weakest part of the stack. If Netlify Identity breaks or is removed in the future, the CMS login stops working.

**Options:**

| Auth approach | Pros | Cons |
|---|---|---|
| **Netlify Identity** (default) | Simple setup, free, works today | Deprecated, uncertain long-term support |
| **External OAuth (GitHub)** | Editor logs in with GitHub account, no Netlify Identity needed | Requires editor to have a GitHub account — may not suit non-technical marketing person |
| **Decap Server** (self-hosted auth proxy) | Full control, no dependency on Netlify Identity | Requires hosting a small Node.js server (defeats "no backend" goal) |
| **Sveltia CMS** (Decap-compatible fork) | Drop-in replacement for Decap, actively maintained, supports GitHub/GitLab OAuth natively | Newer project, less battle-tested |

**Fallback plan:** If Netlify Identity is withdrawn or becomes unreliable in the future, migrate the auth layer to a GitHub-based OAuth flow or an alternative Decap-compatible CMS without changing the core content model.

### 13.2 Build Failures from CMS Edits (MEDIUM)

**Risk:** If an editor publishes malformed content (missing required field, broken Markdown), the Astro build could fail, and the site would stay on the previous version.

**Mitigation:**
- Astro content collections with Zod schemas catch malformed content at build time with clear error messages
- Decap CMS field validation (required fields, widget constraints) prevents most bad input
- Netlify keeps the previous deployment live if a build fails — no downtime
- Set up Netlify build failure notifications to a developer email/Slack

### 13.3 Free Tier Sustainability (LOW)

**Risk:** Netlify, Formspree, or other free tiers could change pricing or limits.

**Mitigation:**
- All choices have well-established free tiers that have been stable for years
- The stack is portable: Astro sites can deploy to Cloudflare Pages, Vercel, or any static host. Formspree can be swapped for Netlify Forms or any other form service. Content is in Git, not locked to any vendor.

---

## 14. Operational Recovery

### 14.1 Monitoring & Alerts

| Event | Notification |
|---|---|
| Build failure | Netlify email notification to developer (configure in Netlify deploy notifications) |
| Form submission | Email to designated client inbox via Formspree |
| Site downtime | Netlify status page; optionally UptimeRobot free tier for external monitoring |

### 14.2 Access & Roles

| Role | Access |
|---|---|
| Developer | GitHub repo (full), Netlify dashboard, Formspree account |
| Marketing editor | Decap CMS at `/admin/` (content editing only) |
| Client stakeholder | Read access to Netlify dashboard (optional) |

### 14.3 Rollback Procedure

Since every change (code or content) is a Git commit deployed by Netlify:
- **Code rollback:** Revert commit in GitHub, or use Netlify's "Deploy" tab to instantly publish any previous deployment
- **Content rollback:** Revert the CMS-generated commit in GitHub. Netlify redeploys automatically
- **Emergency:** Netlify allows locking a specific deploy so no new builds override it

### 14.4 Image Storage

- CMS-uploaded images live in the Git repo (`public/images/uploads/`)
- GitHub repos have a soft limit of ~1GB. For a corporate site with moderate image use, this is unlikely to be reached for years
- If it becomes an issue, migrate image storage to Cloudinary or Git LFS

### 14.5 Future Automation

- Future integrations via Zapier or similar automation tools are possible without changing the core stack
- A practical future workflow is: article published in CMS → site deploy succeeds → automation posts summary/link to LinkedIn Company Page
- Recommended trigger options for later: RSS feed from `/insights/`, deploy webhook, or a scheduled check for newly published articles
- Social publishing is intentionally **out of scope for launch** and should be treated as a Phase 2/3 operational automation, not part of the CMS core build

---

## 15. Build & Deploy Pipeline

```
Marketing editor at mcsc-holding.com/admin/
    │
    └── Saves/publishes content in Decap CMS
            │
            └── Decap commits Markdown files to GitHub
                    │
                    └── Netlify detects push → astro build
                          ├── Reads content from src/content/ (Astro content collections)
                          ├── Reads i18n JSON for UI strings
                          ├── Generates /en, /fr, /it pages + /insights/[slug] pages
                          ├── Generates sitemap.xml
                          └── Deploys to CDN (~60 seconds)
```

---

## 16. Implementation Phases

### Phase 1: Static English Prototype (Week 1) ✅ COMPLETE
- [x] Set up Astro project with Tailwind CSS v4
- [x] Configure Astro content collections with Zod schemas for insights and team
- [x] Implement all homepage sections (hero, licenses, group, pillars, key people, locations, insights, contact form, footer)
- [x] Match Figma design: colors (#1a1f2e navy, #c4a44a gold, #f5f0e8 cream), Playfair Display + DM Sans, layout, spacing
- [x] Build `/insights/` listing page and `/insights/[slug]` detail pages with 3 sample articles
- [x] Responsive design with mobile hamburger nav
- [x] Smooth scroll navigation
- [x] Deploy to Netlify (https://meek-sunburst-6f14a9.netlify.app)
- [ ] Lighthouse audit — hit performance targets

### Phase 2: i18n (Week 2) ✅ COMPLETE
- [x] Set up Astro i18n routing (`/`, `/fr/`, `/it/`)
- [x] Create JSON translation files for all static UI strings (EN/FR/IT)
- [x] Language switcher component with proper URL handling and active state
- [x] hreflang tags on all pages (all 3 locales + x-default)
- [x] Per-locale canonical URLs
- [x] Full FR and IT translations for all static UI strings
- [x] Locale-aware article content with EN fallback — if FR/IT translation exists and has content, serve it; otherwise fall back to English

### Phase 3: CMS Integration (Week 2–3) ✅ COMPLETE
- [x] Install and configure Decap CMS — `public/admin/index.html` + `config.yml`
- [x] Configure Netlify Identity + Git Gateway for CMS authentication
- [x] Define Insights collection with i18n (multiple_files structure, side-by-side locale editor)
- [x] Populate with 3+ sample articles in EN
- [x] Wire Astro components to read from content collections (insights + team)
- [x] Test full editor workflow: login → create article → publish → site rebuild ✅ verified
- [ ] Set up build failure notifications (Netlify deploy notifications)

### Phase 4: SEO, Forms & Legal (Week 3) ✅ MOSTLY COMPLETE
- [x] Structured data: Organization, WebSite (homepage), Article (detail pages) — JSON-LD
- [x] XML sitemap via `@astrojs/sitemap`
- [x] robots.txt (allow OAI-SearchBot, Googlebot, Bingbot; disallow /admin/)
- [x] Open Graph and Twitter Card meta for all pages
- [x] Contact form with name/email/phone/subject/message + GDPR consent checkbox (Formspree-ready)
- [x] Privacy Policy page (EN/FR/IT) — covers data collection, third-party services, GDPR rights
- [x] Legal Notice / Imprint page (EN/FR/IT) — placeholder fields for client registration details
- [ ] BreadcrumbList structured data
- [ ] Cookie consent banner (only needed if analytics are added)
- [ ] Set up Formspree with actual form ID (requires client email destination)
- [ ] Register in Google Search Console and Bing Webmaster Tools

### Phase 5: Polish & Go Live (Week 4) — PENDING
- [ ] Final Lighthouse audit (performance, accessibility, SEO)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, mobile)
- [ ] Custom domain setup + SSL
- [ ] Final content review with client
- [ ] Train marketing person on CMS editing (10-min walkthrough)
- [ ] Replace placeholder images with actual brand photography
- [ ] Fill in Legal Notice fields (registration number, responsible person)
- [ ] Launch
- [ ] Submit sitemap to Google Search Console and Bing Webmaster Tools

---

## 17. Open Decisions for Client

1. **Analytics:** Google Analytics, Plausible, Fathom, or none at launch? → Determines cookie banner requirement
2. **Contact form destination:** Which email address(es) receive Formspree submissions? → Need actual Formspree form ID
3. ~~**Insights detail pages:** Confirmed they need their own URLs.~~ ✅ DONE — `/insights/[slug]` with full markdown rendering
4. **Team member detail pages:** Do people get their own pages, or homepage-only display?
5. **Domain:** Has one been purchased? Where is DNS managed? → Currently on `meek-sunburst-6f14a9.netlify.app`
6. **Legal entity details:** Company registration number, registered office, responsible person — placeholder fields in `/legal` page need filling
7. ~~**Content readiness:** Who is providing FR and IT translations?~~ ✅ RESOLVED — CMS has side-by-side locale editor; articles fall back to EN if translation not provided
8. **Future automation:** Is LinkedIn auto-posting desired after launch?
9. **Brand images:** Replace placeholder stock photos with actual brand photography (stadium, facility, team portraits)

---

## 18. File Structure (Astro + Decap CMS)

```
mcsc-holding/
├── src/
│   ├── content/                       ← Astro content collections
│   │   ├── insights/                  ← CMS-managed articles
│   │   │   ├── nil-rights-european-football/
│   │   │   │   ├── index.en.md
│   │   │   │   ├── index.fr.md
│   │   │   │   └── index.it.md
│   │   │   └── monaco-summit-recap/
│   │   │       ├── index.en.md
│   │   │       ├── index.fr.md
│   │   │       └── index.it.md
│   │   └── team/                      ← Developer-managed (Phase 1)
│   │       ├── marcus-sterling.yaml
│   │       ├── elena-visconti.yaml
│   │       └── jean-paul-dupont.yaml
│   ├── content.config.ts              ← Zod schemas for all collections
│   ├── components/
│   │   ├── Navbar.astro
│   │   ├── Hero.astro
│   │   ├── Licenses.astro
│   │   ├── TheGroup.astro
│   │   ├── StrategicPillars.astro
│   │   ├── KeyPeople.astro
│   │   ├── Locations.astro
│   │   ├── InsightsNews.astro
│   │   ├── ContactForm.astro
│   │   ├── Footer.astro
│   │   ├── LanguageSwitcher.astro
│   │   └── SEO.astro                 ← Reusable head component (meta, OG, hreflang, JSON-LD)
│   ├── i18n/
│   │   ├── en.json
│   │   ├── fr.json
│   │   ├── it.json
│   │   └── utils.ts                  ← t() helper, locale detection
│   ├── layouts/
│   │   ├── Layout.astro              ← Base HTML shell
│   │   └── ArticleLayout.astro       ← Layout for insight detail pages
│   ├── pages/
│   │   ├── index.astro               ← EN homepage
│   │   ├── insights/
│   │   │   ├── index.astro           ← EN insights listing
│   │   │   └── [slug].astro          ← EN article detail
│   │   ├── privacy.astro             ← Privacy Policy (EN)
│   │   ├── legal.astro               ← Legal Notice (EN)
│   │   ├── fr/
│   │   │   ├── index.astro
│   │   │   ├── insights/
│   │   │   │   ├── index.astro
│   │   │   │   └── [slug].astro
│   │   │   ├── privacy.astro
│   │   │   └── legal.astro
│   │   └── it/
│   │       ├── index.astro
│   │       ├── insights/
│   │       │   ├── index.astro
│   │       │   └── [slug].astro
│   │       ├── privacy.astro
│   │       └── legal.astro
│   ├── assets/
│   │   └── images/                   ← Brand images (optimized by Astro at build)
│   └── styles/
│       └── global.css
├── public/
│   ├── admin/
│   │   ├── index.html                ← Decap CMS entry point
│   │   └── config.yml                ← CMS config (collections, fields, i18n)
│   ├── images/
│   │   └── uploads/                  ← CMS-uploaded editorial images
│   ├── robots.txt
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.js
├── package.json
└── .gitignore
```

---

## 19. Editor Experience (Marketing Person's View)

1. Go to `mcsc-holding.com/admin/`
2. Log in (method depends on auth decision — email/password or GitHub)
3. See a dashboard with the **Insights & News** collection
4. Click "New Insight"
5. Fill in: title, category (News/Events/Insights), date, upload cover image, write excerpt, write article body using rich text editor
6. Use the locale dropdown to switch to French → fill in French title, excerpt, body
7. Switch to Italian → fill in Italian version
8. Click **Publish** (or **Save Draft** if editorial workflow is enabled)
9. Site automatically rebuilds — article appears on the site within ~60 seconds

No Git, no code, no terminal. Just a browser.

---

## 20. Current Deployment

| Item | Value |
|---|---|
| **Staging URL** | https://meek-sunburst-6f14a9.netlify.app |
| **GitHub repo** | https://github.com/oneryalcin/mcsc-holding (private) |
| **CMS admin** | https://meek-sunburst-6f14a9.netlify.app/admin/ |
| **Auth** | Netlify Identity (invite-only) + Git Gateway |
| **Build** | `npm run build` → `dist/` |
| **Pages** | 24 (8 per locale: homepage, insights listing, 4 articles, privacy, legal) |
| **Fonts** | Playfair Display (headings), DM Sans (body) |

---

*Document version: 3.0 — 15 March 2026*
*Stack: Astro 6 + Tailwind v4 + Decap CMS + Formspree + Netlify*
*Monthly cost: £0*
