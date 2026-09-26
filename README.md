# Steno Master

Responsive static website for **Steno Master**, a Hindi and English shorthand training institute at Lahoria Chowk, Hisar. The site includes course information, student resources, certificate lookup, enquiry flow, a media gallery and an SEO-focused shorthand blog.

## Public pages

- `index.html` — homepage, courses, Student Corner, certificate lookup, about, contact and enquiry
- `gallery.html` — filterable photo/video gallery with an accessible media viewer
- `blog/index.html` — shorthand and stenography article directory
- `blog/english-shorthand-beginners.html` — beginner Pitman shorthand guide
- `blog/hindi-shorthand-practice.html` — Hindi shorthand speed and accuracy plan
- `blog/stenographer-exam-preparation.html` — stenographer skill-test strategy

## Technology

- Semantic HTML5
- Compiled Tailwind CSS for the responsive homepage/gallery layers
- Custom CSS for the long-form blog layout
- Vanilla JavaScript
- Browser `localStorage` for demo records
- Playwright-based responsive checks

No framework or server runtime is required after the CSS is built.

## Local development

Install dependencies:

```bash
npm ci
```

Build the Tailwind stylesheets:

```bash
npm run build:css
```

Serve the project from its root directory. One option is:

```bash
python -m http.server 8080 --bind 127.0.0.1
```

Open `http://127.0.0.1:8080/`. Use an HTTP server instead of opening the HTML files directly so relative URLs, media and browser storage behave consistently.

## Project structure

```text
StenoMaster/
├── assets/
│   ├── blog/             # Optimized editorial blog images
│   └── gallery/          # Published gallery media and editing guide
├── blog/                 # Blog index, articles and article stylesheet
├── css/
│   ├── gallery.input.css # Tailwind source for gallery.html
│   ├── gallery.css       # Generated gallery stylesheet
│   ├── home.input.css    # Tailwind source for index.html
│   ├── home.css          # Generated homepage stylesheet
│   ├── main.css          # Core legacy-compatible components
│   └── site-nav.css      # Shared navigation treatment
├── js/                   # Homepage, navigation and gallery scripts/data
├── tests/                # Responsive browser regression checks
├── index.html
├── gallery.html
├── robots.txt
└── sitemap.xml
```

## Brand system

The primary accent is `#E21D3F`, with `#BE123C` for darker hover states. The main typography uses Cinzel for display headings and Outfit for interface/body text. Keep white-on-red controls at accessible contrast and preserve visible keyboard focus styles when changing colors.

After editing either Tailwind input file, run `npm run build:css`; do not hand-edit the generated `home.css` or `gallery.css` output.

## Blog publishing

Each article contains:

- a unique title and meta description;
- canonical, Open Graph and Twitter metadata;
- `BlogPosting` and `BreadcrumbList` JSON-LD;
- a visible publication date matching the structured data;
- two local, dimensioned and lazy-loaded editorial images;
- a contents list, useful headings, internal links, FAQs and an enquiry CTA.

The current blog images are original AI-generated illustrations, compressed for web delivery, and are labelled as illustrative in their captions and alt text. They must not be described as photographs of actual Steno Master students or campus events. Replace them with genuine, consented institute photography when available.

When adding an article:

1. Copy an existing article file and give it a descriptive URL slug.
2. Write a unique title, description, H1 and useful article body.
3. Add accurate image alt text and fixed `width`/`height` attributes.
4. Update canonical/OG/Twitter URLs and `BlogPosting` data.
5. Add the article to `blog/index.html` and `sitemap.xml`.
6. Validate the JSON-LD with Google's Rich Results Test after deployment.

The `keywords` meta tag is included for completeness and non-Google consumers; useful content, crawlable links, titles, descriptions and structured data remain the primary on-page SEO work.

## SEO configuration

Canonical URLs, social URLs, the sitemap and robots file currently use:

```text
https://kryzo-mine.github.io/StenoMaster/
```

This matches the repository's GitHub Pages path. If the site moves to a custom domain, replace this origin in every HTML file, `sitemap.xml` and `robots.txt` before deployment. Keep canonical URLs self-referential and consistent with internal links and the sitemap.

The homepage uses `WebSite` and `EducationalOrganization` structured data. The gallery uses `CollectionPage`; the blog directory uses `Blog`; and article pages use `BlogPosting` plus breadcrumbs. Structured claims are limited to information visible on the site.

## Gallery content

Public gallery entries live in `js/gallery-data.js`. Add genuine media under `assets/gallery/`, then follow `assets/gallery/README.md` for the catalogue format. Do not publish temporary fixtures, generated “campus” images or third-party media without permission.

The gallery supports type/category filters, keyboard navigation, Escape-to-close, touch controls, lazy image loading and native video playback. Videos should include captions when they contain speech.

## Data and functional limitations

This is a static frontend. Enquiries and blog drafts are saved in the visitor's browser and open an email draft; the website cannot confirm delivery. Certificate records are also browser-local and are not an authoritative public verification service.

The chatbot uses preset keyword responses, not an AI service. The public admin shortcut and insecure client-side admin screen were removed. Archived snippets are retained only as reference for a future authenticated backend and must not be published as an admin system.

Do not store sensitive or production-only information in browser storage.

## Validation

Build and syntax checks:

```bash
npm run build:css
node --check js/main.js
node --check js/home-ui.js
node --check js/gallery.js
```

Responsive browser checks (Google Chrome required):

```bash
npm run test:home
npm run test:gallery
```

The automated suites cover phone, tablet and desktop widths, horizontal overflow, navigation, Student Corner panels, certificate interactions, course scrolling, chatbot safety and gallery viewer controls. Generated screenshots/reports are written to ignored `test-results/`.

## Deployment

The deployable static site needs the HTML files plus `assets/`, `blog/`, `css/`, `js/`, `robots.txt` and `sitemap.xml`. Development-only directories such as `node_modules/`, `tests/`, `test-results/`, `archive/` and planning documents should not be included in the published artifact.

Before launch:

- confirm the final production origin and update SEO URLs if needed;
- add genuine gallery media;
- run both responsive test commands;
- validate structured data and social-card previews;
- submit `sitemap.xml` in Google Search Console;
- connect a real backend before claiming that enquiries, certificates or admin changes are shared across devices.

## Credits

Website design and development credit: [Kryzo-Mine](https://github.com/Kryzo-Mine).
