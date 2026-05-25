# Portfolio — Mureed Sajjad

This repo contains a static frontend portfolio built with HTML, CSS, and vanilla JavaScript.

## What I changed (high-priority fixes)
- Performance: consolidated multiple `scroll` handlers into a single rAF-driven `ScrollManager` to reduce layout thrashing and improve scroll performance.
- Accessibility & Form:
  - Added ARIA attributes to the project modal (`role="dialog"`, `aria-modal`, `aria-hidden`) and implemented a keyboard focus trap and focus restore when opening/closing the modal.
  - Replaced the modal close trigger with an accessible button and wired it to JavaScript.
  - Improved form validation accessibility (`aria-invalid`, `aria-required`) and replaced the immediate success toast with an actual `fetch` POST to the configured endpoint (keeps existing `action`).
- Minor: small JS cleanup and centralized scroll/animation updates.

## How to preview locally
1. Open `index.html` in your browser (no build step required).

## Deploy options
- GitHub Pages
  1. Push this repo to GitHub.
  2. In repository settings → Pages, set the branch to `main` (or `gh-pages`) and the folder to `/`.
  3. Wait a minute; your site will be available at `https://<your-username>.github.io/<repo>/`.

- Netlify / Vercel
  1. Connect the repository and deploy the `main` branch.
  2. No build command is required for this static site.

## Next recommended steps
- Add automated tests or Lighthouse checks in CI for performance and accessibility metrics.
- Add a simple backend or integrate a production-ready form provider if you expect high volume.

## Files changed
- `script.js` — consolidated scroll handlers, added modal focus trap, improved form submit handling and accessibility.
- `index.html` — modal markup updated for ARIA and accessible close button.

If you want, I can:
- Run a lightweight Lighthouse audit and apply further tuning.
- Add a small CI workflow to run Lighthouse on every push.
