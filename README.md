# 3DEO — Geiger-mode Lidar Website

Static marketing site for 3DEO. Plain HTML/CSS/JS — no build step, no dependencies to install.

## Structure

```
index.html              Homepage
index-print.html        Print/PDF version of the homepage
css/
  site.css              Design system + global styles
  pages.css             Inner-page styles
js/
  site.js               Shared header, footer, nav, NDA modal, scroll reveals
  explorer.jsx          Point-cloud explorer (React, in-browser Babel)
  tweaks-panel.jsx      Design tweak panel (React, in-browser Babel)
assets/                 Logo + imagery
about/  industries/  point-clouds/  products/  resources/  technology/
                        Section pages (each links back with a relative ../ path)
```

Nested pages set `<body data-base="../">` so `site.js` can resolve shared
links and assets one level up. Keep that attribute if you move files around.

## Run locally

It's a static site, so any static server works:

```bash
# Python
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` mostly works, but a local
server is recommended so the in-browser JSX (`explorer.jsx`,
`tweaks-panel.jsx`) and relative links behave exactly as in production.

## Deploy with GitHub Pages

1. Push this folder to your repository.
2. In the repo: **Settings → Pages → Build and deployment**.
3. Source: **Deploy from a branch**. Branch: `main`, folder: `/ (root)`.
4. Save. Your site goes live at `https://<user>.github.io/<repo>/`.

A `.nojekyll` file is included so Pages serves every folder as-is.

## Notes

- Some imagery (`https://3deogw.com/assets/...`) and Google Fonts load from
  the web, so the live site needs an internet connection. To self-host them,
  download those files into `assets/` and update the references.
- Fonts: Archivo (display), Hanken Grotesk (body), IBM Plex Mono (labels).
