# CMS Expansion Plan — Key People, Partnerships & Service Providers

**Status:** Proposed — awaiting review
**Branch:** `cms/expand-key-people-network`
**Goal:** Let editors manage Key People, Partnerships, and Selected Service Providers through Decap CMS (`/admin/`), the same way they already manage Insights.

---

## 1. Why this is more than "add three collections"

The stated ask is small. The real work is paying down two hidden couplings that make the current content *look* file-based but behave code-bound. If we ignore them, the CMS would let editors "edit" records that don't actually control the page — the worst kind of CMS: one that lies.

We should fix the seams now, once, and leave a **repeatable pattern** so the next content type (services, licenses, locations, FAQ…) is cheap to add.

### Current data sources

| Section | Where it lives today | CMS-ready? |
|---|---|---|
| Insights / News | Content collection, markdown, per-locale files (`*.en.md`) | ✅ already in CMS |
| Key People | Split: structure in `src/content/team/*.yaml` **+** translatable `role`/`bio` in `src/i18n/{en,fr,it}.json` | ⚠️ partial |
| Partnerships | Hardcoded TS array in `src/data/network.ts` (`partnerships`) | ❌ |
| Selected Service Providers | Hardcoded TS array in `src/data/network.ts` (`providers`) | ❌ |

### Coupling A — Team editorial text is split across two files

`KeyPeople.astro` and `team/[slug].astro` render a member's role and bio from the **i18n JSON**, not the YAML:

```
p.role  →  t(`team.${slug}.role`, locale)   // src/i18n/{en,fr,it}.json
p.bio   →  t(`team.${slug}.bio`,  locale)   // src/i18n/{en,fr,it}.json
```

The YAML `role` field exists but is effectively dead for these views. So a team member is one logical record physically split across four files (1 YAML + 3 JSON). The CMS can't present that as one editable thing until we consolidate.

### Coupling B — Homepage layout is hardcoded, not data-driven

`KeyPeople.astro` builds the grid from literal slug arrays:

```js
const boardRows   = [ getPeople([...4 slugs]), getPeople([...5 slugs]), getPeople([...2 slugs]) ];
const advisorRows = [ getPeople([...5 slugs]) ];
```

Consequences today:
- The schema's `category` (`Partners`/`Advisors`/`Providers`) and `order` fields **do not drive** the homepage.
- Adding a member in the CMS would **not** make them appear — a developer must edit the arrays.

For the CMS to be truthful, homepage grouping must derive from `category` + `order`.

---

## 2. Guiding principles

1. **One source of truth per record.** A team member (or partner) is a single content file per locale. No editorial text stranded in i18n JSON.
2. **Data drives layout, code drives style.** Editors control *what appears and in what order* (via `category`/`order`); developers keep control of *how it looks* (grid math, responsive rules, honorific display). We make grouping data-driven but keep the presentation logic in the component.
3. **One i18n pattern everywhere.** Reuse the existing Decap `multiple_files` per-locale structure that Insights already uses, so every collection behaves identically in `/admin/` and every component reads localized content the same way.
4. **Additive & reversible.** Migrate data with throwaway, verified scripts; keep git history clean; no visual regressions. Each seam is independently testable.

---

## 3. Target architecture

### 3.1 Team collection becomes the whole record

Extend `src/content/team/` so each member is fully described by content files — add translatable `role` and `bio`. Follow the Insights convention: **one file per locale** (`gian-marco-gilardi.en.yaml/.md`, `.fr`, `.it`) with EN fallback via the same `src/i18n/content.ts` helper pattern.

- `content.config.ts` `team` schema gains `bio` (optional) and keeps `role`, both now sourced from content, not JSON.
- `KeyPeople.astro` + `team/[slug].astro` read `role`/`bio` from the collection.
- Delete the `team.<slug>.role` / `team.<slug>.bio` keys from the three JSON files.
- Homepage rows derived from `category` + `order` (grid-count logic stays in the component).

### 3.2 Network becomes content collections

Convert `src/data/network.ts` into content. **Decision point (see §6):** recommend **two collections** — `partnerships` and `providers` — mirroring the nav and keeping the CMS UX obvious. Each entry: `name`, `url`, `logo`, `order`, and per-locale `desc`. `NetworkPage.astro` reads via `getCollection()` instead of the static import.

### 3.3 CMS config gains matching collections

`public/admin/config.yml` gets `team`, `partnerships`, `providers` collections, all using `i18n: true` per-locale files like Insights. Image widgets point at the existing asset folders (`/images/team/`, `/images/network/`) so uploads land where the site already looks.

### 3.4 The reusable pattern (for future types)

Every future CMS-managed section follows the same three-step recipe:
1. **Model** it as a content collection with a Zod schema in `content.config.ts` (per-locale files for translatable text).
2. **Read** it in components via `getCollection()` + the shared localized-content helper; never hardcode ordering/membership in the component.
3. **Expose** it in `config.yml` mirroring the schema.

Documenting this recipe here is half the deliverable — it turns "add a CMS section" from a research task into a checklist.

---

## 4. Delivery plan — one PR, staged & tested per seam

### Stage 0 — Branch + this plan  ✅ (this commit)
Reviewer signs off on approach and the §6 decisions before code.

### Stage 1 — Key People (build & fully verify before Stage 2)
1. **Migration script (throwaway):** fold `team.<slug>.role/bio` from the 3 JSON files into per-locale team content files. Verify output by hand for a couple of members.
2. **Schema:** update `content.config.ts` team collection (add `bio`; role/bio now from content).
3. **Components:** `KeyPeople.astro` + `team/[slug].astro` read role/bio from collection; homepage rows derived from `category` + `order`.
4. **Cleanup:** remove migrated keys from `src/i18n/{en,fr,it}.json`.
5. **CMS:** add `team` collection to `config.yml`.
6. **Verify:** `npm run build` clean; diff rendered homepage + a team detail page against current (visual parity); load `/admin/`, confirm team members list and edit round-trips.

### Stage 2 — Partnerships / Providers
1. **Migrate** `network.ts` → per-locale collection files (`partnerships`, `providers`).
2. **Component:** `NetworkPage.astro` reads via `getCollection()`.
3. **CMS:** add both collections to `config.yml`.
4. **Verify:** `npm run build` clean; `/partnerships/` and `/providers/` render identically in all three locales; `/admin/` edit round-trips.

### Stage 3 — Docs
Update `CLAUDE.md` (CMS section) with the collection inventory + the §3.4 recipe.

---

## 5. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Visual regression** on homepage when moving from hardcoded rows to data-driven grouping (the row counts 4/5/2 are visually tuned). | Preserve the grid-count logic; snapshot/compare rendered HTML before & after; treat this as the highest-attention change. |
| **Lost translations** when consolidating i18n JSON → content files. | Scripted migration + manual spot-check; EN fallback preserved via existing `content.ts` helper. |
| **Editorial workflow (draft/review/publish)** interacts with per-locale files. | Mirror exactly the working Insights setup; no new i18n mechanics invented. |
| **Broken internal links / SEO** on team detail pages. | `trailingSlash: 'always'` respected; Person JSON-LD kept; no slug changes. |
| **Netlify Identity / git-gateway** permissions for new collections. | No backend change — new collections use the same git-gateway + editorial workflow already in use. |

---

## 6. Decisions for the reviewer

1. **Network: two collections (`partnerships` + `providers`) vs one `network` with a `kind` field?**
   Recommendation: **two** — clearer CMS UX, mirrors the nav, matches how the pages already split.
2. **Team i18n: per-locale files (`.en/.fr/.it`, like Insights) vs single file with nested locale objects?**
   Recommendation: **per-locale files** — consistent with Insights, plays natively with Decap `multiple_files` and editorial workflow.
3. **Homepage grouping: fully data-driven vs keep curated row structure?**
   Recommendation: derive membership/order from `category` + `order`; keep the responsive grid-count logic in the component (data decides *who*, code decides *how it's laid out*).
4. **Scope check:** anything else editors want to manage soon (services, licenses, locations, FAQ)? If yes, we bank the §3.4 pattern now and they become one-recipe follow-ups.

---

## 7. Out of scope (this PR)

- No redesign of any section; visual output unchanged.
- No new locales.
- No migration of other hardcoded content (services, licenses, locations, FAQ) — but the pattern established here makes them straightforward follow-ups.
