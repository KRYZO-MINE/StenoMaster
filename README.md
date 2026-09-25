# Steno Master

Rebuild in progress. See [plan.md](plan.md) for the complete audit, architecture, remaining phases and QA requirements.

## Current milestone
The original single-page site's embedded stylesheet and application script have been extracted into `css/main.css` and `js/main.js`. The script is deferred and retains its existing DOMContentLoaded initialization. An exact source snapshot is preserved in `archive/index.original.html.txt` as a non-executable text file.

This is a transitional extraction, not the completed multi-page or Tailwind implementation. Existing behavior and known limitations remain pending their planned migration.

## Run locally
From this directory run:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Then open http://127.0.0.1:8080 in a browser. Use the same origin and port to retain access to existing localStorage records. No packages are needed for this milestone.

## Data and integration limitations
- Enquiries and blog drafts are stored in the current browser and open an email draft; there is no shared backend or delivery confirmation.
- Certificate records are browser-local. The admin shortcut, UI and authorization logic have been removed from the public homepage; source snippets are preserved under archive/ for the planned separate administration page. No secure backend authentication is implemented.
- The chatbot uses preset keyword responses. Its launcher/minimize controls now work, and user message text is rendered literally.
- No real gallery images or resource files were supplied. Existing placeholders are retained for migration.
- Do not enter sensitive production data into the current prototype.

## Validation
The extraction was checked by reconstructing the original HTML byte for byte. JavaScript syntax is checked with `node --check js/main.js`. Responsive layouts and browser interactions have not yet been validated. The viewport checklist remains open in `plan.md`.

## Deployment
The eventual build will publish only static production output. Do not publish `archive/` or development documents. This transitional prototype is not production-ready.

## Photo and video gallery

Open `gallery.html`. It has its own compiled Tailwind stylesheet and feature scripts; the legacy application is not loaded on this page. The homepage navigation, Student Corner and footer link to it.

Add genuine media using [assets/gallery/README.md](assets/gallery/README.md). No media was supplied, so the initial public gallery is intentionally empty.

Install development dependencies with `npm ci`, then run `npm run build:css` after changing gallery classes/styles. The generated `css/gallery.css` is shipped with the site; Node is not needed on the static host. Build setup follows the [Tailwind CLI documentation](https://tailwindcss.com/docs/installation/tailwind-cli).

The gallery canonical/social URLs use `https://example.com` as an explicit placeholder. Replace it with the production origin before publishing.

### Gallery checks

Run `npm run test:gallery` with Google Chrome installed. Tests start their own loopback server, inject temporary media fixtures, exercise all 14 required viewport widths, and write screenshots/results under ignored `test-results/`. The public catalogue stays untouched. Gallery checks passed, including real test-video playback, keyboard/touch controls, no horizontal overflow, and navigation from the homepage. Automated tests use fallback fonts. This does not constitute a complete audit of the remaining legacy site.

## Homepage mobile fixes

`css/home.input.css` contains the compiled Tailwind entry and legacy-layout compatibility rules; `npm run build:css` now builds both public stylesheets. `js/home-ui.js` handles the short intro, accessible mobile menu, chat controls and certificate keyboard interactions.

Run `npm run test:home` (Google Chrome required) for the reported layout and scrolling regressions. The suite covers 320 through 1920px plus 471px, tab switching, Tailwind button styles, certificate lookup/viewer, actual mouse-wheel/touch scrolling and absence of public admin access. External fonts/icons/map are stubbed for deterministic tests.

The admin source snippets are preserved for a future separate page, not linked or loaded by the public site. Exclude the entire archive/ directory when deploying. The public contact email remains the institute contact address, not an exposed admin sign-in identifier.
