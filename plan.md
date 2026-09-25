# Steno Master rebuild plan

Status: implementation started; full rebuild and responsive QA are not complete.

## Objective and constraints
Convert the existing single-file site into a static, mobile-first, accessible multi-page website using HTML5, compiled Tailwind CSS and vanilla JavaScript. Preserve useful content, course details, student resources, stories, certificate lookup, enquiry and local management workflows. Keep #C8102E, #0A0A0A, white, Cinzel and Outfit. Do not invent facts, images, achievements or backend services.

## Audit (25 September 2026)
The project contains only index.html (approximately 4,786 lines); no build setup, local assets, tests or repository instructions were supplied.

- One embedded stylesheet and one application script mix all features. Inline styles and event handlers are widespread.
- Six course variants cover Hindi/English Beginner, Intermediate and Professional, with prerequisites and 30–120 WPM practice ranges.
- Student Corner contains resources, awards/functions/placements, a student story submission/feed and certificate lookup. Preserve these when separating pages.
- Storage keys: sm_certs, sm_blogs, sm_resources, sm_student_corner and sm_inquiries. All data is local to the visitor's browser, not a shared database.
- Seed content includes three certificate records, one approved story, seven resource descriptions and six gallery descriptions. Resource URLs are placeholders; gallery image URLs are empty. No genuine image, audio, PDF or video files were supplied. Do not substitute fake media.
- Enquiry and story submission save locally and open a mailto draft; they cannot confirm receipt or publish across devices.
- Certificate lookup renders an SVG and prints by replacing the document body and reloading. Preserve lookup/preview/print while replacing this destructive print implementation later.
- Admin has local record creation/deletion, blog moderation, resource/gallery cataloguing and CSV export. The Google-looking login only checks an email; its password is ignored. It is not Google authentication or access control. Replace misleading login with clearly identified local management; production administration requires server-side authentication.
- Chatbot uses keyword replies, not AI. Its launcher/minimize buttons have no listeners. User messages are interpolated into HTML, as are multiple local-storage fields: replace with safe DOM rendering.
- Responsive defects include 320px grid minimums plus padding, nonwrapping tabs/buttons, fixed panel heights, narrow form rows and oversized headings. html/body overflow-x:hidden conceals problems.
- Accessibility defects include clickable divs/icons, missing labels and dialog focus management, hidden panels remaining keyboard-accessible, missing reduced-motion handling, and navigation hidden until scrolling.
- Invalid CSS includes font-size:0.7amp and an invalid grid template in the admin certificate form. Tutorial rendering is missing. Course CTA matching does not match the enquiry options.
- SEO has a homepage title/description but lacks independent page metadata, canonical/social tags and structured data.
- External dependencies: Google Fonts, Font Awesome CDN, Google Maps iframe and existing social/contact links. No Tailwind installation yet.

## Architecture
Public pages: index.html, about.html, courses.html, gallery.html, blogs.html, enquiry.html, contact.html, certificate.html, 404.html, resources.html and blog/cleared-stenographer-grade-c.html (existing story only).

Use build-time shared header/footer templates so delivered HTML includes crawlable navigation and content without JavaScript. Use relative asset links compatible with GitHub Pages subpaths. Compile Tailwind locally and ship generated CSS, without a production CDN runtime. Keep custom components/animation CSS small. Feature modules must guard absent elements.

Target modules: main.js, navigation.js, courses.js, resources.js, gallery.js, blogs.js, enquiry.js, certificate.js, chatbot.js, storage.js and admin.js. Keep shared data separate from rendering. Retain existing storage keys or explicitly migrate without clearing user records.

## Ordered implementation

### 1. Audit
- [x] Read the supplied brief and existing HTML, stylesheet, script, content and integrations.
- [x] Inventory working features, placeholders, security limitations and responsive defects.

### 2. Architecture
- [x] Document pages, module boundaries, static deployment and content preservation.
- [ ] Add build scripts, shared templates, content data and compiled Tailwind.
- [ ] Define backend adapter contracts; keep unavailable services explicitly unavailable.

### 3. Initial extraction (first implementation milestone)
- [x] Preserve an exact source snapshot outside deployable output.
- [x] Extract embedded CSS and JavaScript into separate files without changing feature behavior.
- [x] Verify reconstruction against the snapshot and JavaScript syntax.
- [x] Document how to run the current site and distinguish this transition from the finished architecture.
- [ ] Subsequently split the extracted application into feature modules and remove inline handlers/styles.

### 4. Mobile-first foundation
- [ ] Build brand tokens, containers, typography, cards, buttons and forms with Tailwind.
- [ ] Build shared accessible navigation/footer; active page, ESC close, touch targets and reduced motion.
- [ ] Verify 320–768px first, then extend to desktop. Fix overflow causes without body/html clipping.

### 5. Dedicated pages
- [ ] Home: concise hero, factual statistics, institute intro and course/gallery/blog/resource/contact previews.
- [ ] About: preserve background and teaching approach; no new factual claims.
- [ ] Courses: all six variants, eligibility/prerequisites, features and preselected enquiry CTAs.
- [ ] Resources: preserve catalogue; mark unavailable files honestly.
- [x] Gallery: dedicated photo/video page, type/category filters, genuine-media catalogue, empty states and accessible viewer. Actual media has not been supplied.
- [ ] Blogs and existing story page: search/categories, date/excerpt, readable article and appropriate related/navigation states.
- [ ] Enquiry: required name/mobile/email/course/contact preference/message; preserve useful existing fields as appropriate.
- [ ] Contact: existing address/phone/email/social links/map/hours.
- [ ] Certificate: validated lookup, loading/result states, viewport-fitting preview and PDF print.
- [ ] 404: home/courses/contact recovery links.

### 6. Functionality and data safety
- [ ] Safe DOM rendering for user/storage data; schema validation and storage failure handling.
- [ ] Gallery filters and lightbox previous/next/ESC/focus return.
- [ ] Blog search/filter and story draft flow; no false publishing claims.
- [ ] Indian mobile/email validation, inline errors, loading/failure states and duplicate prevention.
- [ ] Honest enquiry email draft fallback until a real endpoint exists; never imply delivery confirmation.
- [ ] Certificate completed/incomplete/unknown states; printing must preserve page/event state.
- [ ] Keyword chatbot open/close, Enter send, wrapping, typing state and accessible input.
- [ ] Local management migration, safe CSV export and content edits; no imitation Google login or client-side secrets.

### 7. SEO
- [ ] Unique title, description, canonical placeholder, H1, Open Graph and social metadata for each page.
- [ ] EducationalOrganization, breadcrumbs and BlogPosting using supplied facts only.
- [ ] Production origin configuration, sitemap and robots appropriate to final deployment.

### 8. Accessibility
- [ ] Keyboard/touch navigation, labels, errors, focus visibility, modal focus containment/return and contrast.
- [ ] Reduced motion, semantic headings and usable content without animation.

### 9. Performance and documentation
- [ ] Compiled/minified Tailwind, page-specific scripts, appropriate lazy loading and stable image dimensions.
- [ ] Deployment instructions, asset/content editing, backend limitations and environment configuration.
- [ ] Keep source archive and development tools out of published output.

### 10. Final QA (must actually run before completion)
- [ ] Every public page at widths 320, 360, 375, 390, 414, 430, 480, 640, 768, 820, 1024, 1280, 1440 and 1920.
- [ ] Required dimensions: 320x800, 360x800, 375x812, 390x844, 414x896, 430x932, 768x1024, 1024x768, 1280x800, 1440x900 and 1920x1080.
- [ ] Assert no horizontal overflow on pages and open menus/chat/dialogs; inspect screenshots visually.
- [ ] Exercise all course/filter/search/form/certificate/chat/admin workflows, keyboard and touch interactions.
- [ ] Check console errors, internal links, metadata, no-JS behavior and static subpath hosting.
- [ ] Fix failures and record actual results; never mark unrun checks as passed.

## External inputs for production readiness
Actual media/resource files, confirmation of seed certificate/story/achievement records, production domain and a real enquiry/certificate/admin service are not supplied. Continue frontend work independently; preserve supplied text and distinguish demo/local records from authoritative production data. Do not invent missing inputs.

## First milestone validation
- PASS: source reconstruction is byte-for-byte identical to the original snapshot.
- PASS: extracted CSS and JavaScript exactly match their original embedded blocks.
- PASS: node --check js/main.js.
- PASS: referenced local CSS/JS files exist and embedded blocks are removed.
- NOT RUN: browser interaction, visual, responsive and accessibility tests. These remain required before completion.


## Gallery milestone - 25 September 2026

- Added gallery.html and linked it from the homepage navigation, Student Corner and footer. The legacy navigation handler now allows independent-page links.
- Added compiled Tailwind styling (css/gallery.input.css -> css/gallery.css), scoped navigation, gallery rendering and an editable public catalogue in js/gallery-data.js. No framework or production Tailwind CDN is used.
- Added photo/video type filters, category filters, lazy image previews, native video playback, error messages, dialog Previous/Next, arrow-key navigation, Escape close and focus restoration. Videos do not autoplay and are removed on close.
- Reads valid image/video records from existing sm_student_corner storage without changing records; empty placeholder records are not presented as photographs. Local data is still browser-specific.
- Public media catalogue remains empty because no real media was supplied. Add files and catalogue entries using assets/gallery/README.md. No fake photos or test clips are published.
- Gallery metadata is provided; example.com canonical/social URLs must be configured before deployment. Other pages still use the legacy architecture.

### Gallery verification actually performed
- PASS: npm run build:css; JavaScript syntax checks; local asset/link/fragment existence checks.
- PASS: npm run test:gallery in headless Chrome with software rendering. All 14 required widths (320, 360, 375, 390, 414, 430, 480, 640, 768, 820, 1024, 1280, 1440, 1920); 109 page-overflow and dialog-fit assertions.
- PASS: empty and populated layouts, mobile navigation/Escape, media and category filtering/reset, touch filtering, legacy storage data, malformed-storage fallback, duplicate/unsafe-URL rejection and literal rendering of HTML-like titles.
- PASS: actual playback of a synthetic test video, cleanup after close, next/previous/arrow keys/Escape/focus return, subpath hosting, no-JavaScript fallback and homepage Gallery navigation. Zero console errors in the final run.
- Screenshots inspected: 320px empty page, 1440px populated page and 320px open viewer. A character-encoding defect found visually was fixed and the suite rerun; corrected mobile screenshots inspected. Fonts were blocked in automated tests to keep them deterministic; fallback-font layouts were tested.
- Test media is injected only in browser routes. Test reports/screenshots are in ignored test-results/, and the regression script is tests/gallery.cjs. The test expects locally installed Google Chrome.
- This verification covers the new gallery; it does not complete the original site's whole-project QA checklist or certify real media codecs/files that have not been supplied.

## Public homepage fixes - 25 September 2026

Completed the six screenshot-reported issues:
- Removed the floating admin shortcut, admin login/dashboard and moderation modal from index.html. Removed the admin authorization/management block from public js/main.js. Preserved source snippets in archive/admin-markup.html.txt and archive/admin-logic.js.txt for a later separate admin page; no new admin page or authentication is implemented in this milestone. Keep archive/ out of deployment as documented.
- Removed the footer admin identity and added Designed by Kryzo-Mine linking to https://github.com/Kryzo-Mine on both public pages. The institute's public contact email remains in its contact information and enquiry destination.
- Replaced oversized nonwrapping intro animation with a short, wrapping brand introduction; reduced-motion users skip the overlay. Navigation remains visible and the mobile menu supports buttons and Escape.
- Replaced fixed minimum card tracks with mobile-first minmax(0, 1fr) grids. Course cards stack on phones and grow with content, allowing page wheel/touch scrolling; horizontal Shift scrolling is unnecessary to reach clipped cards. Removed root overflow-x clipping.
- Aligned and wrapped Student Corner tabs, styled sub-tab buttons using compiled Tailwind, and fixed missing sub-pane visibility rules so only the selected category is shown.
- Stacked certificate label/input/button on narrow screens. Converted preview to a native accessible dialog with Escape/focus restoration and wrapping actions. Print no longer replaces the document body.
- Added compatible responsive layouts for resource cards, forms, contact/about/footer and the chatbot; connected previously unwired chat controls. Text entered in chat is rendered literally.

Validation: npm run build:css; node --check for updated scripts; npm run test:home (148 layout checks at all 14 brief widths plus screenshot width 471px, no page JavaScript exceptions); npm run test:gallery (109 layout/dialog checks, zero console errors). Actual wheel, Shift-scroll overflow and touchscreen swipe checks passed over the course area. Certificate search/Enter/preview/Escape, student tabs, menu, designer link and absence of public admin controls passed. Mobile intro, Student Corner and certificate screenshots visually inspected after fixes. External fonts/icons/map were stubbed in homepage automation; fallback-font layouts were tested. This is scoped remediation, not completion of the full multi-page rebuild or backend work.
