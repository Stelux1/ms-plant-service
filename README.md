# MS Plant Service website

Static redesign of [msplantservice.nl](https://msplantservice.nl/): plain HTML, CSS and JavaScript with no build step.

- `site/index.html` is the page; `site/public/` holds the images, CSS, JS, 404 page, robots.txt and sitemap.xml, which are copied to the build unchanged
- `REDESIGN-NOTES.md` covers the audit of the current site, the redesign decisions, the open content questions and the deployment steps

## Run locally

```bash
npm install
npm run dev
```

## Deploy

`npm run build` uses Vite to build the site into `dist/`.

- **Shipvela:** framework "Vite / React (static)", build command `npm run build`, output directory `dist`.
- **Netlify, Vercel, Cloudflare Pages:** build command `npm run build`, output directory `dist`.

To send the quote form directly, set `data-endpoint` on the `<form>` in `site/index.html`. Without it, the form opens the visitor's email app.
