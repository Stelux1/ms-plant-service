# MS Plant Service website

Static redesign of [msplantservice.nl](https://msplantservice.nl/): plain HTML, CSS and JavaScript with no build step.

- `site/` is the deployable website (index, 404, robots.txt, sitemap.xml, assets)
- `REDESIGN-NOTES.md` covers the audit of the current site, the redesign decisions, the open content questions and the deployment steps

## Run locally

```bash
python3 -m http.server 4173 --directory site
```

Open http://localhost:4173.

## Deploy

`npm run build` copies `site/` to `dist/`. It has no dependencies.

- **Shipvela, Netlify, Vercel, Cloudflare Pages:** build command `npm run build`, output directory `dist`.
- **Any static host without a build step:** upload `site/` as is.

To send the quote form directly, set `data-endpoint` on the `<form>` in `site/index.html`. Without it, the form opens the visitor's email app.
