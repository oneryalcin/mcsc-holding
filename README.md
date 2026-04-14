# MCSC Management

Corporate website for MCSC Management — a global sports advisory and management consulting firm based in Monaco, Milan, and Geneva.

Built with Astro 6, Tailwind CSS 4, and Decap CMS. Trilingual (English, French, Italian). Deployed on Netlify.

**Live site:** https://mcsc-holding.com

## Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `localhost:4321`        |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview production build locally            |

Node >= 22.12.0 required.

## Architecture

- **Astro 6** — static site generator, zero client-side JS by default
- **Tailwind CSS 4** — utility-first styling with brand tokens in `src/styles/global.css`
- **Decap CMS** — git-backed headless CMS at `/admin/`, authenticated via Netlify Identity
- **Formspree** — handles contact form submissions (no backend)
- **i18n** — three locales (EN default, FR, IT) with URL-based routing, JSON translation files, and per-locale Markdown content

## Project Structure

```
src/
├── pages/              Route-based pages (file path = URL)
│   ├── index.astro     English homepage
│   ├── fr/             French locale pages
│   └── it/             Italian locale pages
├── components/         Reusable Astro components
├── layouts/            Page shells (Layout, ArticleLayout)
├── content/
│   ├── insights/       Blog articles (Markdown, multilingual)
│   └── team/           Team members (YAML)
├── i18n/               Translation JSONs + locale utilities
└── styles/             Tailwind config + brand tokens

public/
├── admin/              Decap CMS config + entry point
└── images/uploads/     CMS media folder
```

## Content Management

Editors create and publish articles through Decap CMS at `/admin/`. The CMS uses an editorial workflow (draft -> review -> publish) and commits content directly to the GitHub repo via Netlify Git Gateway.

Articles support multilingual variants: `slug.en.md`, `slug.fr.md`, `slug.it.md`. Fields like `title`, `excerpt`, and `body` are translated per locale; fields like `coverImage` and `publishDate` are shared.

## Deploy Without Build Minutes

Build locally and upload to Netlify directly, bypassing their build pipeline:

```bash
npm run build && netlify deploy --dir=dist         # draft preview (shareable URL)
npm run build && netlify deploy --dir=dist --prod   # production deploy
```
