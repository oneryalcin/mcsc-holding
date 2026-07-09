# CMS Expansion Plan — Key People, Partnerships & Service Providers

**Status:** Revised (v2) after adversarial review — awaiting final sign-off
**Branch:** `cms/expand-key-people-network`
**Goal:** Let editors manage Key People, Partnerships, and Selected Service Providers through Decap CMS (`/admin/`), the same way they already manage Insights — without regressing the rendered site.

> **v2 changelog.** v1 was reviewed by four independent adversarial passes (Opus, Sonnet, two Codex lanes). Three independently found the same build-breaking blocker. This revision fixes all confirmed findings. Key reversals from v1:
> - **Team i18n is now single-file field-level, NOT per-locale files.** v1's "mirror Insights (3 files/person)" would have caused duplicate `getStaticPaths` params (hard build failure) and locale-overwrite in the homepage lookup. Single-file i18n keeps one collection entry per person → no route collision, no merge helper.
> - **Homepage layout stays curated in code.** v1 claimed grouping could derive from `category`+`order` "with no regression." False — `order` encodes a *different* sequence than the rendered rows, and the 4/5/2 row-breaks aren't derivable. CMS now owns team *content*, not homepage *arrangement*.
> - **Three hidden couplings**, not two: the Insights `tags` widget is a third hardcoded copy of the team roster.
> - **Honest scope & testing:** the team migration is multi-hour with real regression risk; `/admin` round-trips are verifiable only on a Netlify deploy preview, not localhost.

---

## 1. Why this is more than "add three collections"

The ask looks small; the real work is paying down couplings that make the content *look* file-based but behave code-bound. If we ignore them the CMS would let editors "edit" records that don't control the page — the worst kind of CMS: one that lies. Fix the seams once, and leave a **repeatable, verified pattern** so the next content type is cheap.

### Current data sources (corrected)

| Section | Where it lives today | CMS-ready? |
|---|---|---|
| Insights / News | Content collection, markdown, per-locale files (`*.en.md`) | ✅ already in CMS |
| Key People | **Three** places: structure in `src/content/team/*.yaml`; translatable `role`/`bio` in `src/i18n/{en,fr,it}.json`; **and the roster is hardcoded a third time** as `select` options in `config.yml` `tags` (lines 36–52) | ⚠️ partial |
| Partnerships | Hardcoded TS array in `src/data/network.ts` (`partnerships`, 6 entries) | ❌ |
| Selected Service Providers | Hardcoded TS array in `src/data/network.ts` (`providers`, 1 entry) | ❌ |

### Coupling A — team editorial text is split across files

`KeyPeople.astro:57,79` and `team/[slug].astro:20-21` render role/bio from the **i18n JSON**, not the YAML:

```
role → t(`team.${slug}.role`, locale)   // src/i18n/{en,fr,it}.json
bio  → t(`team.${slug}.bio`,  locale)
```

The YAML `role` field exists but is dead for these views. One logical record is physically split across 4 files (1 YAML + 3 JSON). **Data completeness verified:** all 16 members have role+bio in all 3 locales (96/96) — the migration source is not lossy.

### Coupling B — homepage arrangement is hardcoded (and `order` disagrees with it)

`KeyPeople.astro:15-23` builds the grid from literal slug arrays. Critically, the schema's `order` field does **not** match this arrangement:

- Displayed board row 1: gian-marco(order 1), francesco-prazzo(2), francesco-bongarrà(**11**), paolo-zanazza(**8**)
- Sorting Partners by `order` produces a different sequence entirely; advisor `martina` (order 5) jumps from last to first.

So today `order` is populated with values that *look* authoritative but encode a different intent, and the 4/5/2 (board) / 5 (advisors) row-breaks are hand-tuned in the component. **Resolution (decided):** make the data authoritative by giving each member an editor-facing **`row`** (which visual row) + **`order`** (left-to-right position within that row), and **seed both by deriving them from the current rendered arrays** — so the layout stays pixel-identical *and* becomes CMS-controllable. The component then renders `category → row → order`; row length determines that row's column count (preserving 4/5/2). This is the human-meaningful semantics (seniority + deliberate grouping) made explicit in data rather than frozen in code. See §3.1.

### Coupling C — the Insights `tags` widget is a third roster copy

`config.yml:36-52` lists all 16 members as static `select` options for article tagging. Adding a member elsewhere won't make them taggable — a dev must hand-edit this list. Fixed by a `relation` widget (§3.3).

---

## 2. Guiding principles

1. **One source of truth per record.** A team member / partner is a single content file. No editorial text stranded in i18n JSON; no roster duplicated in `config.yml`.
2. **Data drives content; code drives arrangement.** Editors own *what a person says* (name, role, bio, image, honorific). Developers keep the *curated homepage layout* — because it's hand-tuned and rarely changes. We do **not** pretend the CMS re-arranges the homepage; that honesty is the point.
3. **Verify the CMS on-disk shape before coding against it.** Decap's i18n write format drives the Zod schema. We pin it with a `decap-server` spike, not by assuming (§4, Stage 1.0).
4. **Additive, reversible, regression-checked.** Migrate with throwaway scripts; gate every stage on `npm run build` + a `dist/` HTML diff (the site is fully static, so before/after HTML is a real parity check).

---

## 3. Target architecture

### 3.1 Team collection becomes the whole record (nested-locale-object fields)

Each member stays **one YAML file = one collection entry** (no proliferation). Translatable `role`/`bio` move out of i18n JSON into the file as **plain Decap `object` widgets with `en`/`fr`/`it` string subfields** — *not* Decap's i18n machinery.

> **Spike-verified (Stage 1.0 — DONE, evidence below).** We checked Decap v3's actual serializer (`getI18nFiles`/`getDataPath` in `decap-cms-core/src/lib/i18n.ts`) and parse-tested both shapes:
> - **Decap-native single-file i18n → rejected.** It nests *every* field under top-level locale keys (`en:`/`fr:`/`it:`), so `entry.data.name` becomes `undefined` — breaking all existing structural reads (`KeyPeople.astro`, 3× `[slug].astro`, `getStaticPaths`) — and triplicates `category`/`image`/`order`/`slug` on disk.
> - **Nested-object fields → chosen.** Structural fields (`name`, `slug`, `image`, `category`, `order`, `honorific`) stay top-level and **unchanged**; only `role`/`bio` become `{ en, fr, it }`, read as `person.data.role[locale]` with EN fallback. Trivial Zod extension, and it **matches the `desc: Record<Locale,string>` pattern already shipping in `src/data/network.ts`** — codebase-consistent, no new i18n mechanics.
> - **Tradeoff (accepted):** editors get grouped `en/fr/it` subfields, not the top-bar language-tab toggle Insights has (that toggle requires Decap i18n, whose cost is the structural rework + triplication above). Fine for rarely-edited team/network content.

This means the team collection needs **no `i18n:` config at all** and no locale-merge/dedup helper — one entry per person keeps `getStaticPaths` and the slug→person Map correct as-is.

Downstream (whatever the pinned shape):
- `content.config.ts` team schema: add `bio`; make `role`/`bio` optional so a blank locale falls back to EN.
- `KeyPeople.astro` + all three `team/[slug].astro` read role/bio from the collection via a tiny `localeField(person, 'role', locale)` accessor (EN fallback). **No `getLocalizedTeam` grouping helper needed** — single-file means one entry per person, so `getStaticPaths` and the slug→person Map stay correct as-is.
- Delete `team.<slug>.role/bio` keys from the 3 JSON files — **after** a repo-wide `grep 'team\.'` confirms nothing else references them.
- **Homepage arrangement becomes data-driven (schema gains `row` + `order`).** `KeyPeople.astro`'s hardcoded `boardRows`/`advisorRows` arrays are replaced by: group members by `category` → group by `row` → sort by `order`. `row`/`order` are **seeded from the current arrays** in the migration so rendered output is byte-identical, then editable in the CMS. The grid is **fully dynamic**: a row's column count = the number of members with that `row` value (so 4/5/2 today is preserved, and editors can add a new row or resize any row just by editing `row` values). Column count is emitted via inline `grid-template-columns` (not dynamic Tailwind classes, which JIT won't generate) so any row size renders correctly.

### 3.2 Network becomes two content collections

`partnerships` and `providers` (mirroring the nav/routes; §6.1). Each entry: `name`, `url`, `logo`, `order`, and translatable `desc` as a nested `{ en, fr, it }` object — the **same nested-object approach as team**, and identical to `desc` as it exists in `network.ts` today (so this migration is nearly shape-preserving). `NetworkPage.astro:15` swaps the static import for `getCollection()`, reads `desc[locale]` with EN fallback, and **sorts by `order`** (migration must populate `order` from current array position, else cards render in glob order). One entry per entity → no duplicate cards across the 6 locale routes (the risk Codex flagged for a per-locale-files approach).

### 3.3 CMS config gains matching collections + fixes Coupling C

`config.yml` gets `team`, `partnerships`, `providers` collections with the per-field i18n table from §3.1/3.2. Image widgets point at existing asset folders (`/images/team/`, `/images/network/`) so uploads land where the site already looks. The Insights `tags` `select` (lines 36–52) becomes a **`relation` widget** targeting the `team` collection (value = slug) — killing the third roster copy.

### 3.4 The reusable pattern (for future types)

Every future CMS-managed section follows the same recipe — now with the review lessons baked in:
1. **Model** as a content collection; translatable text via nested `{ en, fr, it }` object fields (verified shape — see §3.1), not Decap i18n machinery.
2. **Read** via `getCollection()` + `data.field[locale]` with EN fallback; **never** hardcode ordering/membership in the component unless it's genuinely curated — and if curated, *say so*.
3. **Expose** in `config.yml`; use `relation` widgets for cross-references, never duplicated `select` lists.
4. **Verify** with `npm run build` + `dist/` HTML diff locally, and a `/admin/` round-trip on a Netlify deploy preview.

---

## 4. Delivery plan — one PR, staged commits, tested per seam

The user chose one PR. Stage 1 is **fully verified (build + HTML diff + preview round-trip) before Stage 2 commits**, giving a commit-level rollback boundary.

### Stage 0 — Branch + this plan ✅
Sign-off on v2 before code.

### Stage 1 — Key People
- **1.0 Spike ✅ DONE:** pinned the on-disk shape from Decap v3 source + a parse test (no server/browser needed). Conclusion: **nested `{ en, fr, it }` object fields, no Decap i18n** (see §3.1). This is the shape reviewed and approved.
- **1.1 Normalize filenames** so filename == `slug` field: rename `cosimo-vestuti.yaml`→`cosimo-andrea-vestuti.yaml`, `nathan-cordero.yaml`→`nathan-cordero-di-montezemolo.yaml`. Routes key off `person.data.slug`, so this is route-neutral (no `_redirects` needed). Optionally align image basenames.
- **1.2 Migration script (throwaway):** (a) fold `team.<slug>.role/bio` (keyed by **slug field**, not filename — catches the two renamed files) from the 3 JSON files into each YAML as `{ en, fr, it }` objects; (b) **seed `row` + `order` for every member by deriving them from the current `boardRows`/`advisorRows` arrays** so layout is preserved exactly. Spot-check ≥3 members incl. both renamed ones.
- **1.3 Schema:** `content.config.ts` — add `role`/`bio` as `{en,fr?,it?}` objects (EN required, FR/IT optional for fallback), add `row` (number), keep `order` (now = position within row), drop the dead `quote` field. Confirm `category` values actually match the two rendered sections (Partners → "Board & Partners", Advisors → "Advisors"); reconcile if not.
- **1.4 Components:** `KeyPeople.astro` + 3× `team/[slug].astro` read role/bio from the collection via `person.data.role[locale]` (EN fallback). `boardRows`/`advisorRows` stay, with a comment marking them as curated.
- **1.5 CMS:** add `team` collection to `config.yml`; convert Insights `tags` → `relation` widget.
- **1.6 Cleanup:** `grep 'team\.'` repo-wide; delete migrated JSON keys only after confirming no other references.
- **1.7 Verify:** `npm run build` clean; `dist/` HTML diff for homepage + all 3 locales of one team detail page shows **zero** rendered change; push → confirm `/admin/` team list + edit round-trip on the Netlify **deploy preview**.

### Stage 2 — Partnerships / Providers (only after Stage 1 verified)
- **2.1 Migrate** `network.ts` → per-entity YAML in `partnerships/` + `providers/`, single-file i18n `desc`, `order` populated from array index.
- **2.2 Component:** `NetworkPage.astro` reads via `getCollection()`, `localeField` for `desc`, sort by `order`.
- **2.3 CMS:** add both collections to `config.yml`.
- **2.4 Verify:** build clean; `dist/` HTML diff for `/partnerships/` `/providers/` × 3 locales shows zero change; `/admin/` round-trip on preview.

### Stage 3 — Docs
Update `CLAUDE.md` CMS section with the collection inventory + the §3.4 recipe.

---

## 5. Effort & risk (honest)

**Effort:** Not the "~30 min" floated verbally in v1. Stage 1 is a **multi-hour** job: a spike + filename normalization + a 96-key migration into 16 files + component edits across 4 files + a `select`→`relation` swap + preview verification, all with real regression surface. Stage 2 is genuinely small (`NetworkPage` is already generic over `NetworkEntry[]`).

| Risk | Mitigation |
|---|---|
| **Wrong assumed Decap i18n shape** → schema/reader mismatch | RESOLVED by Stage 1.0 spike: nested-object fields verified against Decap v3 source + parse test before any schema code. |
| **Build break** from route/lookup collisions | Nested-object fields keep one entry per person/entity → no duplicate `getStaticPaths` params, no Map overwrite. Verified as an explicit build gate (1.7/2.4). |
| **Silent homepage reshuffle** | `row`/`order` are *seeded from the current arrays*, so the first render is byte-identical; HTML diff gate proves zero visual change before editors touch anything. |
| **Lost translations** in the JSON→YAML fold | Migration keyed by slug field; spot-check renamed members; EN fallback preserved; `grep` before deleting keys. |
| **`/admin` can't be tested on localhost** (git-gateway needs Netlify Identity) | Real pre-merge gate = `build` + `dist/` HTML diff; `/admin/` round-trip verified on the **deploy preview**, and optionally via `local_backend`+`decap-server` in the spike. |
| **Editor UX regression** (no drag-reorder for top-level entries; hand-typed `order` ints) | Accepted tradeoff, documented for editors; ordering changes are rare. |

---

## 6. Decisions (resolved)

1. **Network: two collections** (`partnerships` + `providers`) — clearer CMS UX, mirrors routes. ✅
2. **Team i18n: nested `{ en, fr, it }` object fields, no Decap i18n machinery** (Stage 1.0 spike outcome — Decap-native single-file i18n was rejected because it nests all fields per-locale and breaks structural reads; §3.1). One file per person → no route collision. ✅
3. **Homepage grouping: editor-controlled via `row` + `order` fields; exact layout preserved.** Schema gains `row` (visual row) + `order` (position within row), both seeded from the current arrays so output is byte-identical. Editors can re-rank, re-group, and **add new rows**; grid is fully dynamic (column count = members in that row). CMS also owns text/image/honorific + detail pages + tagging. ✅
4. **One PR, staged commits**, Stage 1 fully verified before Stage 2. ✅
5. **Open:** any other sections editors want soon (services, licenses, locations, FAQ)? If yes, they become §3.4-recipe follow-ups.

---

## 7. Out of scope (this PR)

- No redesign; rendered output must be byte-identical (enforced by the HTML-diff gate).
- No new locales; no slug renames that affect URLs (filename normalization in 1.1 is route-neutral).
- No migration of other hardcoded content (services, licenses, locations, FAQ) — but the §3.4 pattern makes them straightforward follow-ups.
