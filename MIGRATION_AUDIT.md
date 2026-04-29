# Migration Audit — Hardcoded Editorial Content & Static Images

Generated: 2026-04-29

---

## public/ — Static Assets Inventory

| File | Classification | Action |
|------|---------------|--------|
| `public/images/hero-vestibular-system.jpg` | **EDITORIAL IMAGE** | MIGRATE to UploadThing. Currently referenced ONLY in `src/db/seed.ts` (as a placeholder URL). The live site reads `site_settings.home_hero_image_url` from DB — but if no UploadThing URL was seeded, this static file may be the fallback. Upload to UT, insert `media` row, update `site_settings.home_hero_image_url`. |
| `public/file.svg` | SYSTEM (Next.js default scaffold) | LEAVE — unused, can delete later |
| `public/globe.svg` | SYSTEM (Next.js default scaffold) | LEAVE — unused, can delete later |
| `public/next.svg` | SYSTEM (Next.js default scaffold) | LEAVE — unused, can delete later |
| `public/vercel.svg` | SYSTEM (Next.js default scaffold) | LEAVE — unused, can delete later |
| `public/window.svg` | SYSTEM (Next.js default scaffold) | LEAVE — unused, can delete later |

**No favicon found.** The site has no custom favicon — only the default Next.js one. Not an editorial image; skip for now.

---

## src/app/(public)/page.tsx — Homepage

### Text
- [HARDCODED-EDITORIAL] H1: `"Retrouvez votre equilibre."` → MIGRATE to `site_settings.home_hero_h1`
- [HARDCODED-EDITORIAL] Hero subhead: `"Physiotherapie vestibulaire specialisee a Morges. Arnaud Canadas vous accompagne pour traiter vos vertiges avec une approche experte et rassurante."` → MIGRATE to `site_settings.home_hero_subhead`
- [HARDCODED-EDITORIAL] Condition section eyebrow: `"Diagnostic"` → MIGRATE to `site_settings.home_conditions_eyebrow`
- [HARDCODED-EDITORIAL] Condition section H2: `"Quel type de vertige avez-vous ?"` → MIGRATE to `site_settings.home_conditions_h2`
- [HARDCODED-EDITORIAL] Condition section body: `"Chaque vertige a une cause specifique et un traitement adapte. Identifiez votre situation et decouvrez comment je peux vous aider."` → MIGRATE to `site_settings.home_conditions_body`
- [HARDCODED-EDITORIAL] Anatomy section eyebrow: `"Comprendre"` → MIGRATE to `site_settings.home_anatomy_eyebrow`
- [HARDCODED-EDITORIAL] Anatomy section H2: `"L'oreille interne, votre centre de l'equilibre"` → MIGRATE to `site_settings.home_anatomy_h2`
- [HARDCODED-EDITORIAL] Anatomy body P1: `"Au coeur de chaque oreille interne se trouvent deux systemes..."` → MIGRATE to `site_settings.home_anatomy_body` (combine both paragraphs as markdown or newline-separated)
- [HARDCODED-EDITORIAL] Anatomy body P2: `"Comprendre quelle structure est en cause..."` → (same field, second paragraph)
- [HARDCODED-EDITORIAL] Process section eyebrow: `"Prise en charge"` → MIGRATE to `site_settings.home_process_eyebrow`
- [HARDCODED-EDITORIAL] Process section H2: `"Comment se deroule votre traitement ?"` → MIGRATE to `site_settings.home_process_h2`
- [HARDCODED-EDITORIAL] Inline CTA title: `"Pret a retrouver votre equilibre ?"` → MIGRATE to `site_settings.home_inline_cta_title`
- [HARDCODED-EDITORIAL] Inline CTA description: `"Un bilan vestibulaire permet d'identifier la cause de vos vertiges..."` → MIGRATE to `site_settings.home_inline_cta_description`
- [HARDCODED-EDITORIAL] Testimonials eyebrow: `"Temoignages"` → MIGRATE to `site_settings.home_testimonials_eyebrow`
- [HARDCODED-EDITORIAL] Testimonials H2: `"Ce que disent nos patients"` → MIGRATE to `site_settings.home_testimonials_h2`
- [HARDCODED-EDITORIAL] About mini-bio eyebrow: `"Votre therapeute"` → MIGRATE to `site_settings.home_about_eyebrow`
- [HARDCODED-EDITORIAL] About mini-bio H2: `"Arnaud Canadas"` → MIGRATE to `site_settings.home_about_h2`
- [HARDCODED-EDITORIAL] About mini-bio body: `"Physiotherapeute specialise en reeducation vestibulaire, Arnaud Canadas accompagne depuis plus de 10 ans..."` → MIGRATE to `site_settings.home_about_body`
- [HARDCODED-EDITORIAL] Blog teaser eyebrow: `"Blog"` → MIGRATE to `site_settings.home_blog_eyebrow`
- [HARDCODED-EDITORIAL] Blog teaser H2: `"Comprendre les vertiges"` → MIGRATE to `site_settings.home_blog_h2`
- [HARDCODED-EDITORIAL] FAQ section eyebrow: `"FAQ"` → MIGRATE to `site_settings.home_faq_eyebrow`
- [HARDCODED-EDITORIAL] FAQ section H2: `"Questions frequentes"` → MIGRATE to `site_settings.home_faq_h2`
- [HARDCODED-EDITORIAL] Final CTA title: `"Prendre rendez-vous"` → MIGRATE to `site_settings.home_final_cta_title`
- [HARDCODED-EDITORIAL] Final CTA description: `"N'hesitez pas a me contacter pour toute question ou pour fixer un rendez-vous."` → MIGRATE to `site_settings.home_final_cta_description`
- [SYSTEM] Button labels: "Prendre rendez-vous", "Comprendre mes vertiges", "Comprendre vos vertiges", "Lire ma bio complete", "Tous les articles" → LEAVE
- [SYSTEM] "Voir tous les avis sur Google" → LEAVE
- [SYSTEM] Breadcrumbs → LEAVE
- [SYSTEM] JSON-LD structured data strings → LEAVE (generated from DB values already)

### Images
- [DB-DRIVEN] Hero image: reads `settings.homeHeroImageUrl` from DB → OK (already DB-driven). **BUT**: the seed file used a local path `/images/hero-vestibular-system.jpg` — needs to be re-seeded with an UploadThing URL after uploading.
- [DB-DRIVEN] Anatomy diagram: reads `settings.homeAnatomyDiagramUrl` from DB → OK. Alt text reads `settings.homeAnatomyCaption` → OK.
- [DB-DRIVEN] About portrait: reads `settings.aboutImageUrl` from DB → OK. Alt text reads `settings.aboutImageAlt` → OK.

---

## src/components/public/process-timeline.tsx

### Text
- [HARDCODED-EDITORIAL] Step 1 title: `"Evaluation"` → MIGRATE
- [HARDCODED-EDITORIAL] Step 1 description: `"Bilan complet : tests oculomoteurs, manoeuvres positionnelles..."` → MIGRATE
- [HARDCODED-EDITORIAL] Step 2 title: `"Diagnostic"` → MIGRATE
- [HARDCODED-EDITORIAL] Step 2 description: `"Identification precise du type de vertige..."` → MIGRATE
- [HARDCODED-EDITORIAL] Step 3 title: `"Traitement"` → MIGRATE
- [HARDCODED-EDITORIAL] Step 3 description: `"Manoeuvres de repositionnement, reeducation vestibulaire..."` → MIGRATE
- [HARDCODED-EDITORIAL] Step 4 title: `"Suivi"` → MIGRATE
- [HARDCODED-EDITORIAL] Step 4 description: `"Programme d'exercices a domicile..."` → MIGRATE

**Recommended approach**: Store as `site_settings.home_process_steps` (jsonb array of `{title, description}`). The component receives the steps as props from the homepage.

### Images
- None.

---

## src/components/public/trust-strip.tsx

### Text
- [HARDCODED-EDITORIAL] Stat 1: value `"10+"`, label `"Ans d'experience"` → MIGRATE
- [HARDCODED-EDITORIAL] Stat 2: value `"1 000+"`, label `"Patients traites"` → MIGRATE
- [HARDCODED-EDITORIAL] Stat 3: value `"RCC"`, label `"Conventionne LAMal"` → MIGRATE
- [HARDCODED-EDITORIAL] Stat 4: value `"1-3"`, label `"Seances pour VPPB"` → MIGRATE

**Note**: TrustStrip is currently NOT rendered anywhere (no imports found). It exists as a component but is unused. Include it in the migration anyway so Arnaud can decide whether to enable it.

**Recommended approach**: Store as `site_settings.trust_stats` (jsonb array of `{icon, value, label}`). The `icon` field stores the lucide icon name as a string.

### Images
- None.

---

## src/components/public/cta-block.tsx

### Text
- [HARDCODED-EDITORIAL] Default title: `"Vous reconnaissez ces symptomes ?"` → This is a default prop, overridden by callers. Each usage site passes its own copy. The defaults serve as reasonable fallbacks.
- [HARDCODED-EDITORIAL] Default description: `"Prenez rendez-vous avec Arnaud Canadas pour un bilan vestibulaire complet."` → Same — default prop.
- [SYSTEM] Button labels: "Prendre rendez-vous", "Formulaire de contact" → LEAVE

**Action**: The CTA copy is already passed as props from page components. Once the page-level strings are migrated to DB, the CTABlock component itself needs no changes — it just renders what it receives.

### Images
- None.

---

## src/components/public/header.tsx

### Text
- [HARDCODED-EDITORIAL] `conditions` array: 8 items with slug + label (e.g. `"VPPB (vertige positionnel)"`, `"Nevrite vestibulaire"`, etc.) → These labels duplicate the `services.title` from DB. **MIGRATE**: Read services from DB and pass to Header, or accept as props from layout.
- [SYSTEM] Nav links: "Vertiges traites", "Le physiotherapeute", "Blog", "Contact" → LEAVE (navigation)
- [SYSTEM] Logo text: "Physio-Vertige" → LEAVE (brand identity, could later come from `site_settings.siteName` but low priority)
- [SYSTEM] "Voir toutes les conditions" → LEAVE
- [SYSTEM] "Prendre rendez-vous" → LEAVE
- [SYSTEM] "Ouvrir le menu" → LEAVE
- [HARDCODED-EDITORIAL] Phone number: `tel:+41772747144` (hardcoded twice) → MIGRATE: should read from `site_settings.phone`

### Images
- None. Logo is text-only.

---

## src/components/public/footer.tsx

### Text
- [HARDCODED-EDITORIAL] Brand description: `"Physiotherapie vestibulaire specialisee a Morges. Traitement des vertiges et troubles de l'equilibre."` → MIGRATE to `site_settings.footer_description`
- [HARDCODED-EDITORIAL] Service area text: `"Zone de couverture : Morges, Lausanne, Nyon, Vevey, Canton de Vaud"` → MIGRATE to `site_settings.footer_service_area`
- [HARDCODED-EDITORIAL] `conditionLinks` array: 8 items with labels → Same issue as header — should come from DB `services` table.
- [HARDCODED-EDITORIAL] Contact details: address `"Rue de Couvaloup 16\n1110 Morges"`, email `"info@physio-vertige.ch"`, phone `"+41 77 274 71 44"` → MIGRATE: should read from `site_settings` (phone, email, address already exist in `site_settings`).
- [HARDCODED-EDITORIAL] Google Maps link: `"https://maps.google.com/?q=Rue+de+Couvaloup+16+1110+Morges"` → Derive from address or store as `site_settings.google_maps_url`
- [SYSTEM] Column headers: "Vertiges traites", "Navigation", "Contact" → LEAVE
- [SYSTEM] Nav links: "Le physiotherapeute", "Blog", "Contact", "Mentions legales", "Politique de confidentialite" → LEAVE
- [SYSTEM] Copyright: "(c) 2026 Physio-Vertige — Arnaud Canadas. Tous droits reserves." → LEAVE (auto-generated year + brand)

### Images
- None.

---

## src/components/public/condition-card.tsx

### Text
- [SYSTEM] "En savoir plus" → LEAVE
- All other text (title, shortDescription, heroHook) comes from DB via props → OK

### Images
- None.

---

## src/components/public/testimonial-carousel.tsx

### Text
- [SYSTEM] "Avis Google" badge → LEAVE
- [SYSTEM] "Voir tous les avis sur Google" → LEAVE
- All testimonial content comes from DB → OK

### Images
- [DB-DRIVEN] Author avatars: `t.authorAvatarUrl` from DB → OK (Google CDN URLs, leave as-is per instructions)
- Default avatar fallback is a colored circle with initial → SYSTEM, LEAVE

---

## src/components/public/booking-sticky-mobile.tsx

### Text
- [SYSTEM] "Prendre rendez-vous" → LEAVE
- [HARDCODED-EDITORIAL] Phone number: `tel:+41772747144` → MIGRATE: should read from site_settings.phone

### Images
- None.

---

## src/components/public/contact-form.tsx

### Text
- [SYSTEM] All form labels, validation messages, button text → LEAVE
- [SYSTEM] RGPD consent text → LEAVE (legal, not editorial)

### Images
- None.

---

## src/components/public/callout.tsx

### Text
- All text is passed via props (title, children) → OK, no hardcoded editorial content.

### Images
- None.

---

## src/components/public/faq-accordion.tsx

### Text
- All FAQ content comes from DB → OK

### Images
- None.

---

## src/components/public/markdown-renderer.tsx

### Text
- No hardcoded editorial text — renders markdown from DB → OK

### Images
- No hardcoded images.

---

## src/app/(public)/le-physiotherapeute/page.tsx

### Text
- [HARDCODED-EDITORIAL] Eyebrow: `"Le physiotherapeute"` → MIGRATE to `site_settings.bio_eyebrow`
- [HARDCODED-EDITORIAL] H1: `"Arnaud Canadas"` → MIGRATE to `site_settings.bio_h1`
- [HARDCODED-EDITORIAL] Subtitle: `"Physiotherapeute vestibulaire specialise"` → MIGRATE to `site_settings.bio_subtitle`
- [HARDCODED-EDITORIAL] Bio paragraph 1: `"Passionne par la physiotherapie vestibulaire..."` → MIGRATE to `site_settings.bio_content` (markdown, all paragraphs)
- [HARDCODED-EDITORIAL] Bio paragraph 2: `"Apres ma formation en physiotherapie..."` → (same field)
- [HARDCODED-EDITORIAL] Bio paragraph 3: `"Je recois mes patients au sein du cabinet partage..."` → (same field)
- [HARDCODED-EDITORIAL] Qualifications H2: `"Qualifications"` → MIGRATE as part of bio_content or separate `site_settings.bio_qualifications` (jsonb array of strings)
- [HARDCODED-EDITORIAL] Qualification items (4 items): `"Diplome en physiotherapie"`, `"Formation specialisee en reeducation vestibulaire"`, etc. → MIGRATE to `site_settings.bio_qualifications` (jsonb string array)
- [SYSTEM] Breadcrumb → LEAVE
- [SYSTEM] "Prendre rendez-vous" button → LEAVE
- [SYSTEM] Phone number `tel:+41772747144` → MIGRATE (same as header/footer)
- [SYSTEM] JSON-LD → LEAVE (reads from constants, acceptable)

### Images
- [DB-DRIVEN] Portrait: reads `settings.aboutImageUrl` / `settings.aboutImageAlt` from DB → OK

---

## src/app/(public)/contact/page.tsx

### Text
- [HARDCODED-EDITORIAL] Eyebrow: `"Contact"` → Low priority, but MIGRATE to `site_settings.contact_eyebrow`
- [HARDCODED-EDITORIAL] H1: `"Prendre rendez-vous"` → MIGRATE to `site_settings.contact_h1`
- [HARDCODED-EDITORIAL] Intro: `"N'hesitez pas a me contacter pour toute question ou pour fixer un rendez-vous..."` → MIGRATE to `site_settings.contact_intro`
- [HARDCODED-EDITORIAL] Address: `"Rue de Couvaloup 16\n1110 Morges"` → Already in `site_settings.address` — just need to READ it.
- [HARDCODED-EDITORIAL] Phone: `"+41 77 274 71 44"` → Already in `site_settings.phone` — just need to READ it.
- [HARDCODED-EDITORIAL] Email: `"info@physio-vertige.ch"` → Already in `site_settings.email` — just need to READ it.
- [HARDCODED-EDITORIAL] Hours: `"Lundi - Vendredi : 08h00 - 19h00\nSur rendez-vous uniquement"` → MIGRATE to `site_settings.opening_hours_text`
- [HARDCODED-EDITORIAL] Google Maps embed URL → MIGRATE to `site_settings.google_maps_embed_url`
- [SYSTEM] Sidebar labels: "Adresse", "Telephone", "Email", "Horaires" → LEAVE

### Images
- [HARDCODED] Google Maps iframe embed → Not an image file; the embed URL should come from DB. Classify as editorial config, not image migration.

---

## src/app/(public)/cabinet/page.tsx

### Text
- [HARDCODED-EDITORIAL] Eyebrow: `"Cabinet"` → MIGRATE to `site_settings.cabinet_eyebrow`
- [HARDCODED-EDITORIAL] H1: `"Cabinet partage a Morges"` → MIGRATE to `site_settings.cabinet_h1`
- [HARDCODED-EDITORIAL] Body (3 paragraphs): `"Je recois mes patients..."`, `"Le cabinet est equipe..."`, `"Facilement accessible..."` → MIGRATE to `site_settings.cabinet_body` (markdown)
- [HARDCODED-EDITORIAL] "Lien vers le site du cabinet" section title + TODO text → MIGRATE to `site_settings.cabinet_link_title` and `site_settings.cabinet_link_url`
- [HARDCODED-EDITORIAL] Address: `"Rue de Couvaloup 16, 1110 Morges"` → Read from `site_settings.address`
- [SYSTEM] Breadcrumb → LEAVE
- [SYSTEM] "Prendre rendez-vous" button → LEAVE
- [SYSTEM] Phone number → MIGRATE (read from DB)

### Images
- None currently. Arnaud may want to add cabinet photos later — the DB fields will support that through page_sections or a future field.

---

## src/app/(public)/vertiges-traites/page.tsx

### Text
- [HARDCODED-EDITORIAL] Eyebrow: `"Conditions traitees"` → MIGRATE to `site_settings.conditions_list_eyebrow`
- [HARDCODED-EDITORIAL] H1: `"Vertiges traites a Morges"` → MIGRATE to `site_settings.conditions_list_h1`
- [HARDCODED-EDITORIAL] Intro: `"Chaque vertige a une cause specifique et un traitement adapte. Selectionnez votre condition pour en savoir plus."` → MIGRATE to `site_settings.conditions_list_intro`
- [HARDCODED-EDITORIAL] CTA title: `"Besoin d'un avis ?"` → MIGRATE to `site_settings.conditions_list_cta_title`
- [HARDCODED-EDITORIAL] CTA description: `"Contactez Arnaud Canadas pour une evaluation vestibulaire complete a Morges."` → MIGRATE to `site_settings.conditions_list_cta_description`
- [SYSTEM] Breadcrumbs → LEAVE

### Images
- None.

---

## src/app/(public)/vertiges-traites/[slug]/page.tsx

### Text
- [HARDCODED-EDITORIAL] "Qu'est-ce que {title} ?" H2 template → LEAVE (system-generated from DB title)
- [HARDCODED-EDITORIAL] "Symptomes typiques" H2 → LEAVE (section heading tied to data structure)
- [HARDCODED-EDITORIAL] "Causes & declencheurs" H2 → LEAVE
- [HARDCODED-EDITORIAL] "Comment Arnaud Canadas vous aide" H2 → This is editorial — MIGRATE to `services.protocol_h2` or keep as convention. **Borderline** — it references the therapist's name. MIGRATE to a `site_settings.condition_protocol_h2` template field.
- [HARDCODED-EDITORIAL] "A quoi ressemble une seance ?" H2 → LEAVE (section heading)
- [HARDCODED-EDITORIAL] "Combien de seances faut-il ?" H2 → LEAVE (section heading)
- [HARDCODED-EDITORIAL] "Questions frequentes" H2 → LEAVE (section heading)
- [HARDCODED-EDITORIAL] "Temoignages de patients" H2 → LEAVE (section heading)
- [HARDCODED-EDITORIAL] "Conditions associees" H2 → LEAVE (section heading)
- [HARDCODED-EDITORIAL] CTA title: `"Prendre rendez-vous"` → MIGRATE (or reuse site_settings final CTA fields)
- [HARDCODED-EDITORIAL] CTA description: `"Commencez votre traitement des aujourd'hui. Arnaud Canadas vous accueille a Morges."` → MIGRATE to `site_settings.condition_cta_description`
- [SYSTEM] "En savoir plus" → LEAVE
- [SYSTEM] Breadcrumbs, JSON-LD → LEAVE
- [SYSTEM] "Prendre rendez-vous", "Formulaire de contact" buttons → LEAVE
- [HARDCODED-EDITORIAL] Phone number `tel:+41772747144` → MIGRATE (read from DB)
- All condition content (title, heroHook, longDescription, symptoms, causes, protocol, sessionDescription, sessionCount) → Already in DB via `services` table → OK

### Images
- None currently (condition pages have no hero images). The `services.imageUrl` field exists but isn't rendered on the public condition page. Consider rendering it if populated.

---

## src/app/(public)/blog/page.tsx

### Text
- [HARDCODED-EDITORIAL] Eyebrow: `"Blog"` → MIGRATE to `site_settings.blog_list_eyebrow`
- [HARDCODED-EDITORIAL] H1: `"Comprendre les vertiges"` → MIGRATE to `site_settings.blog_list_h1`
- [HARDCODED-EDITORIAL] Intro: `"Articles, conseils et actualites sur les vertiges et la reeducation vestibulaire."` → MIGRATE to `site_settings.blog_list_intro`
- [SYSTEM] "Aucun article pour le moment." → LEAVE
- All blog post data comes from DB → OK

### Images
- None (blog cards don't show cover images in the list; they could, but that's a feature request, not a migration).

---

## src/app/(public)/blog/[slug]/page.tsx

### Text
- [HARDCODED-EDITORIAL] Author bio subtitle: `"Physiotherapeute specialise en reeducation vestibulaire"` → MIGRATE to `site_settings.author_bio_subtitle`
- [HARDCODED-EDITORIAL] Author bio body: `"Arnaud Canadas accompagne depuis plus de 10 ans les patients souffrant de vertiges et troubles de l'equilibre..."` → MIGRATE to `site_settings.author_bio_body`
- [HARDCODED-EDITORIAL] Author byline under avatar: `"Physiotherapeute vestibulaire"` → MIGRATE to `site_settings.author_byline`
- [SYSTEM] "Articles lies" H2 → LEAVE
- [SYSTEM] "Voir la bio complete" → LEAVE
- [SYSTEM] "de lecture" → LEAVE
- [SYSTEM] Breadcrumbs, JSON-LD → LEAVE
- [HARDCODED-EDITORIAL] Final CTA title/description → Same as other CTA blocks, reuse site_settings fields

### Images
- [DB-DRIVEN] Author avatar (2 instances): reads `settings.aboutImageUrl` → OK
- Blog cover images: already in DB (`blogPosts.coverImageUrl`) but not rendered on the article page itself. Not a migration issue.

---

## src/app/(public)/mentions-legales/page.tsx

### Text
- [HARDCODED-EDITORIAL] ALL content: editor name, address, phone, email, hosting info, IP notice, liability notice → MIGRATE to `site_settings.mentions_legales_content` (markdown, full page body)
- [SYSTEM] Breadcrumb → LEAVE

### Images
- None.

---

## src/app/(public)/politique-de-confidentialite/page.tsx

### Text
- [HARDCODED-EDITORIAL] ALL content: data collection, usage, retention, rights, cookies, contact info → MIGRATE to `site_settings.politique_confidentialite_content` (markdown, full page body)
- [SYSTEM] Breadcrumb → LEAVE

### Images
- None.

---

## src/app/layout.tsx — Root Layout

### Text
- [SYSTEM] Metadata: title template, descriptions, OG tags → These reference the brand name and generic descriptions. **Borderline**. The `site_settings.siteName` and `site_settings.tagline` already exist. Consider reading them for metadata generation. Low priority.
- [SYSTEM] Google verification: `"google14c1f8e9a76f78b5"` → Already have `site_settings.googleVerification` in DB but it's not being read in root layout. Wire it up.

### Images
- [DB-DRIVEN] OG image: `site_settings.defaultOgImageUrl` exists in DB but is NOT being used in root layout metadata. Wire it up.

---

## Summary — Phone Number Hardcoded Across Multiple Components

The phone number `+41 77 274 71 44` / `tel:+41772747144` is hardcoded in these locations:
1. `header.tsx` (line 101, 164) — client component, needs props from layout
2. `footer.tsx` (line 105-109)
3. `booking-sticky-mobile.tsx` (line 9)
4. `cta-block.tsx` (lines 29, 66) — used in 5+ locations across pages
5. `le-physiotherapeute/page.tsx` (line 133)
6. `contact/page.tsx` (line 63-66)
7. `cabinet/page.tsx` (line 73)
8. `vertiges-traites/[slug]/page.tsx` (line 155)

All should read from `site_settings.phone` (already in DB). This requires:
- Server components: call `getSiteSettings()` and pass phone as prop
- Client components (header, booking-sticky, cta-block): receive phone as prop from parent server component or layout

---

## Summary — Fields to Add to `site_settings` Table

### Homepage sections (22 new fields)
- `home_hero_h1` (text)
- `home_hero_subhead` (text)
- `home_conditions_eyebrow` (text)
- `home_conditions_h2` (text)
- `home_conditions_body` (text)
- `home_anatomy_eyebrow` (text)
- `home_anatomy_h2` (text)
- `home_anatomy_body` (text — markdown, multi-paragraph)
- `home_process_eyebrow` (text)
- `home_process_h2` (text)
- `home_process_steps` (jsonb — array of `{title, description}`)
- `home_inline_cta_title` (text)
- `home_inline_cta_description` (text)
- `home_testimonials_eyebrow` (text)
- `home_testimonials_h2` (text)
- `home_about_eyebrow` (text)
- `home_about_h2` (text)
- `home_about_body` (text)
- `home_blog_eyebrow` (text)
- `home_blog_h2` (text)
- `home_faq_eyebrow` (text)
- `home_faq_h2` (text)

### CTA fields (4 new fields)
- `home_final_cta_title` (text)
- `home_final_cta_description` (text)
- `condition_cta_description` (text) — used on /vertiges-traites/[slug]
- `conditions_list_cta_title` (text) — used on /vertiges-traites
- `conditions_list_cta_description` (text)

### Bio page (5 new fields)
- `bio_eyebrow` (text)
- `bio_h1` (text)
- `bio_subtitle` (text)
- `bio_content` (text — markdown)
- `bio_qualifications` (jsonb — string array)

### Blog fields (6 new fields)
- `blog_list_eyebrow` (text)
- `blog_list_h1` (text)
- `blog_list_intro` (text)
- `author_bio_subtitle` (text)
- `author_bio_body` (text)
- `author_byline` (text)

### Contact page (4 new fields)
- `contact_eyebrow` (text)
- `contact_h1` (text)
- `contact_intro` (text)
- `opening_hours_text` (text)
- `google_maps_embed_url` (text)

### Cabinet page (4 new fields)
- `cabinet_eyebrow` (text)
- `cabinet_h1` (text)
- `cabinet_body` (text — markdown)
- `cabinet_link_url` (text)

### Conditions list page (3 new fields)
- `conditions_list_eyebrow` (text)
- `conditions_list_h1` (text)
- `conditions_list_intro` (text)

### Footer (2 new fields)
- `footer_description` (text)
- `footer_service_area` (text)

### Legal pages (2 new fields)
- `mentions_legales_content` (text — markdown)
- `politique_confidentialite_content` (text — markdown)

### Trust strip (1 new field)
- `trust_stats` (jsonb — array of `{icon, value, label}`)

### Google Maps (1 new field)
- `google_maps_url` (text) — for the footer link

**TOTAL: ~54 new fields on site_settings**

This exceeds the 20-field threshold. **Recommendation**: Keep the existing `site_settings` fields (identity, images, SEO — ~20 fields), and create a new `home_content` jsonb column or a `content_blocks` table for the homepage editorial sections. Alternatively, group into:
- `site_settings` — identity, contact, images, SEO (existing + footer/legal)
- Add the per-page editorial text as a single jsonb column `page_content` on the existing `pages` table rows

**Preferred approach**: Use the existing `pages` + `page_sections` tables. Each page already has rows (home, le-physiotherapeute, contact, cabinet, etc.). Store the editorial text in `page_sections.content` jsonb. This avoids bloating `site_settings` and uses the page editor infrastructure we already built.

---

## Summary — Image Migration Checklist

| Current Source | DB Field | Status |
|---|---|---|
| `public/images/hero-vestibular-system.jpg` | `site_settings.home_hero_image_url` | Field exists in DB. Need to upload file to UploadThing and set URL. |
| Anatomy diagram | `site_settings.home_anatomy_diagram_url` | Field exists. Currently NULL if not seeded — need initial upload. |
| Arnaud portrait | `site_settings.about_image_url` | Field exists. Currently NULL if not seeded — need initial upload. |
| OG default image | `site_settings.default_og_image_url` | Field exists. Not wired into root layout `metadata.openGraph.images`. |
| Blog cover images | `blog_posts.cover_image_url` | Already in DB, already uses UploadThing URLs → OK |
| Service hero images | `services.image_url` | Field exists in DB, editable in admin. Not rendered on public condition pages yet. |
| Testimonial author avatars | external Google CDN URLs | LEAVE as-is per instructions |

**Only 1 file on disk needs UploadThing migration**: `public/images/hero-vestibular-system.jpg`

The anatomy diagram, portrait, and OG image don't currently have files on disk — they're either NULL in DB or were uploaded directly via the admin ImagePicker. If they're NULL, Arnaud will upload them via admin after migration.

---

## Components with NO editorial content (confirmed clean)

- `src/components/public/markdown-renderer.tsx` — pure renderer
- `src/components/public/table-of-contents.tsx` — pure renderer
- `src/components/public/faq-accordion.tsx` — all data from DB
- `src/components/public/callout.tsx` — all data from props
- `src/app/sign-in/`, `src/app/sign-up/` — Clerk pages, not editorial
