# Image Audit — Physio-Vertige

Exhaustive audit of every image rendered on the public site.
Date: 2026-04-29

---

## Homepage / src/app/(public)/page.tsx

### 1. Hero illustration (line 193)
- Rendered: `<Image src={heroImageUrl} ...>` — conditionally shown if URL set
- Source: `site_settings.home_hero_image_url`
- Current admin: /admin/site-settings -> Hero (Accueil) card -> ImagePicker
- Alt text: `site_settings.home_hero_image_alt` (editable in same card)
- Status: **[ALREADY-EDITABLE]**

### 2. Anatomy diagram (line 267)
- Rendered: `<Image src={anatomyDiagramUrl} ...>` — conditionally shown if URL set
- Source: `site_settings.home_anatomy_diagram_url`
- Current admin: /admin/site-settings -> Section Anatomie card -> ImagePicker
- Alt text: hardcoded in JSX as "Labyrinthe membraneux — schema anatomique du systeme vestibulaire..."
- Caption: `site_settings.home_anatomy_caption` (editable)
- Status: **[NEEDS-EDITING]** — alt text is hardcoded, should read from `site_settings.home_anatomy_diagram_alt` or similar

### 3. Mini-bio portrait (line 336)
- Rendered: `<Image src={settings.aboutImageUrl} ...>` — conditionally shown
- Source: `site_settings.about_image_url`
- Current admin: /admin/site-settings -> Mini-bio / Portrait card -> ImagePicker
- Alt text: `site_settings.about_image_alt` (editable in same card)
- Status: **[ALREADY-EDITABLE]**

---

## Le Physiotherapeute / src/app/(public)/le-physiotherapeute/page.tsx

### 4. Therapist portrait (line 86)
- Rendered: `<Image src={aboutImageUrl} fill ...>` — conditionally shown
- Source: `site_settings.about_image_url` (same as mini-bio above)
- Current admin: /admin/site-settings -> Mini-bio / Portrait card -> ImagePicker
- Alt text: `site_settings.about_image_alt`
- Status: **[ALREADY-EDITABLE]**

---

## Blog Article / src/app/(public)/blog/[slug]/page.tsx

### 5. Author avatar — article header (line 175)
- Rendered: `<Image src={settings.aboutImageUrl} ...>` — 40x40 circle
- Source: `site_settings.about_image_url` (same portrait)
- Current admin: /admin/site-settings -> Mini-bio / Portrait card
- Status: **[ALREADY-EDITABLE]**

### 6. Author avatar — bio box (line 218)
- Rendered: `<Image src={settings.aboutImageUrl} ...>` — 64x64 circle
- Source: `site_settings.about_image_url` (same portrait)
- Current admin: /admin/site-settings -> Mini-bio / Portrait card
- Status: **[ALREADY-EDITABLE]**

### 7. Blog cover image (OG + JSON-LD only, NOT visually rendered)
- Used at: line 41 (openGraph.images), line 75 (Article schema image)
- Source: `blog_posts.cover_image_url` (per blog post)
- Current admin: /admin/blog -> edit article -> ImagePicker "Couverture"
- Status: **[ALREADY-EDITABLE]** — note: this image is NOT visually displayed on any page, only in social previews and structured data

---

## Testimonial Carousel / src/components/public/testimonial-carousel.tsx

### 8. Testimonial author avatars (line 39)
- Rendered: `<Image src={url} ...>` in AuthorAvatar component — 32x32, `unoptimized`
- Source: `testimonials.author_avatar_url` (per testimonial row)
- Current admin: /admin/testimonials -> edit testimonial -> ImagePicker "Avatar"
- Fallback: initial letter circle if no avatar URL
- Note: Google review avatars come from Google CDN — privacy reasons, leave as-is
- Status: **[ALREADY-EDITABLE]**

---

## Cabinet / src/app/(public)/cabinet/page.tsx

### (no images)
- Verified: No `<Image>`, `<img>`, or background-image in this page
- Status: **N/A** — no images on this page

---

## Contact / src/app/(public)/contact/page.tsx

### (no images — iframe only)
- Verified: No `<Image>` or `<img>` tags
- Contains a Google Maps `<iframe>` embed (line 109), configured via `site_settings.google_maps_embed_url`
- Current admin: /admin/site-settings -> Identity card -> URL embed Google Maps
- Status: **N/A** — no images, iframe URL already editable

---

## Vertiges Traites (index) / src/app/(public)/vertiges-traites/page.tsx

### (no images)
- Verified: Uses ConditionCard which is text-only (no images)
- The `services.image_url` column exists in the schema but is NOT rendered anywhere on the public condition list page
- Status: **N/A** — no images on this page

---

## Vertiges Traites (detail) / src/app/(public)/vertiges-traites/[slug]/page.tsx

### (no images)
- Verified: No `<Image>`, `<img>`, or background-image in the condition detail page
- The page is entirely text-based (long description, symptoms, causes, protocol, session info)
- `services.image_url` column exists in schema and is editable in /admin/services, but is NOT rendered on the public page
- Status: **N/A** — no images on these pages currently

---

## Blog List / src/app/(public)/blog/page.tsx

### (no images)
- Verified: No `<Image>` or `<img>` tags — blog list is text-only cards
- `blog_posts.cover_image_url` is NOT rendered visually on the list page
- Status: **N/A** — no images on this page

---

## Mentions Legales / src/app/(public)/mentions-legales/page.tsx

### (no images)
- Verified: Markdown body, no images
- Status: **N/A**

---

## Politique de Confidentialite / src/app/(public)/politique-de-confidentialite/page.tsx

### (no images)
- Verified: Markdown body, no images
- Status: **N/A**

---

## Header / src/components/public/header.tsx

### (no images)
- Logo: Text-based ("Physio-Vertige" in `<Link>` with font-heading styling, line 34)
- Hamburger menu: Inline SVG path (system icon)
- Status: **[SYSTEM]** — text logo, no image

---

## Footer / src/components/public/footer.tsx

### (no images)
- Logo: Text-based ("Physio-Vertige" as text, line 43)
- Icons: lucide-react MapPin, Mail, Phone (system icons)
- Status: **[SYSTEM]** — text branding, no images

---

## Cross-cutting: OG Default Image

### 9. Default OG image (metadata, not visually rendered)
- Used by: root layout.tsx sets `openGraph` metadata; individual pages can override with `pages.og_image_url`
- Source: `site_settings.default_og_image_url`
- Current admin: /admin/site-settings -> SEO & Google card -> ImagePicker "OG Image"
- Per-page OG: /admin/pages/[id] -> Metadonnees -> ImagePicker "OG Image"
- Note: The root layout does NOT dynamically inject the default OG image from settings — it's static metadata. Individual pages CAN set their own via `pages.og_image_url`, but the global fallback in layout.tsx does NOT read from DB.
- Status: **[NEEDS-EDITING]** — the `defaultOgImageUrl` field is editable in admin but is NOT actually wired to the root layout metadata. The root `openGraph` in layout.tsx has no `images` property at all.

---

## Cross-cutting: Favicon

### (no custom favicon found)
- No `icon.png`, `icon.ico`, `favicon.ico`, or `apple-icon.png` in `src/app/` or `public/`
- Next.js will show a default favicon
- Status: **[SYSTEM]** — leave as-is per instructions

---

## Services admin image field (NOT rendered publicly)

### services.image_url
- Schema: `services.image_url` column exists
- Admin: /admin/services -> edit service -> ImagePicker "Image du service"
- Public rendering: **NOWHERE** — neither the condition list page nor the condition detail page renders this field
- Status: **[ORPHAN]** — field is editable in admin but not rendered on the public site. Should either be rendered on condition pages or documented as reserved for future use.

---

## Page sections imageUrl field

### page_sections.image_url
- Schema: `page_sections.image_url` column exists
- Admin: The page editor section forms have an `imageUrl` state variable, but only the "image" field type in SectionForm renders an ImagePicker for it
- Public rendering: None of the current 17 section types use `page_sections.image_url` — all images go through `site_settings` instead
- Status: **[ORPHAN]** — the column exists but is not used by any current section type

---

## Summary

| # | Image | Location | Source | Admin route | Status |
|---|-------|----------|--------|------------|--------|
| 1 | Hero illustration | Homepage line 193 | site_settings.home_hero_image_url | /admin/site-settings -> Hero | [ALREADY-EDITABLE] |
| 2 | Anatomy diagram | Homepage line 267 | site_settings.home_anatomy_diagram_url | /admin/site-settings -> Anatomie | [NEEDS-EDITING] alt text hardcoded |
| 3 | Mini-bio portrait | Homepage line 336 | site_settings.about_image_url | /admin/site-settings -> Mini-bio | [ALREADY-EDITABLE] |
| 4 | Therapist portrait | Bio page line 86 | site_settings.about_image_url | /admin/site-settings -> Mini-bio | [ALREADY-EDITABLE] |
| 5 | Author avatar (header) | Blog article line 175 | site_settings.about_image_url | /admin/site-settings -> Mini-bio | [ALREADY-EDITABLE] |
| 6 | Author avatar (bio box) | Blog article line 218 | site_settings.about_image_url | /admin/site-settings -> Mini-bio | [ALREADY-EDITABLE] |
| 7 | Blog cover (OG only) | Blog article meta | blog_posts.cover_image_url | /admin/blog -> article -> Cover | [ALREADY-EDITABLE] |
| 8 | Testimonial avatars | Carousel line 39 | testimonials.author_avatar_url | /admin/testimonials -> Avatar | [ALREADY-EDITABLE] |
| 9 | Default OG image | Root layout meta | site_settings.default_og_image_url | /admin/site-settings -> SEO | [NEEDS-EDITING] not wired |
| — | services.image_url | NOT rendered | services.image_url | /admin/services -> ImagePicker | [ORPHAN] |
| — | page_sections.image_url | NOT rendered | page_sections.image_url | /admin/pages section forms | [ORPHAN] |

---

## Gaps requiring fixes

### Gap 1: Anatomy diagram alt text hardcoded
- **File**: `src/app/(public)/page.tsx` line 269
- **Current**: `alt="Labyrinthe membraneux — schema anatomique du systeme vestibulaire (vestibule en orange, cochlee en vert)"`
- **Should be**: Read from `site_settings` (new column) or from `homeAnatomyCaption` as a dual-purpose field
- **FIX PLAN**: Add `homeAnatomyDiagramAlt` column to `site_settings`, expose in /admin/site-settings -> Anatomie card, read in homepage. Fallback to current hardcoded string.

### Gap 2: Default OG image not wired to root layout
- **File**: `src/app/layout.tsx` line 27-35
- **Current**: The `openGraph` object has no `images` property. `site_settings.default_og_image_url` is editable in admin but never read by the root layout.
- **Should be**: Root layout reads `defaultOgImageUrl` from settings and sets it as `openGraph.images`.
- **FIX PLAN**: Make `layout.tsx` a server component that fetches `getSiteSettings()` and dynamically exports metadata with `openGraph.images`. This requires converting from static `export const metadata` to `export async function generateMetadata()`.

### Gap 3: services.image_url not rendered on public pages
- **Issue**: Each service has an `imageUrl` field editable in admin, but no public page renders it. The condition cards and condition detail pages are text-only.
- **FIX PLAN**: This is a design decision, not a bug. The condition cards and detail pages were intentionally designed as text-focused. If Arnaud later wants images on condition pages, the field and admin form already exist. **No code change needed** — document as "reserved for future use."

### Gap 4: page_sections.image_url not used
- **Issue**: The column exists on `page_sections` but no section type reads from it. All images go via `site_settings`.
- **FIX PLAN**: Same as Gap 3 — this column was designed for future use by custom section types. The current section types that have images (hero, anatomy, mini-bio) all use `site_settings` columns instead. **No code change needed** — leave as-is.
