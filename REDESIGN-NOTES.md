# MS Plant Service: redesign notes

Audit date: 6 November 2026 · Live site: https://msplantservice.nl/ · New build: `site/`

---

## 1. What's wrong with the current site (fix these first)

| # | Severity | Issue | Impact |
|---|---|---|---|
| 1 | **Critical** | **The homepage is broken.** `msplantservice.nl/` renders WordPress's "Empty Blog" template with a search box, an empty category dropdown, "Recent Comments" and a calendar. The real Home page (ID 27965) exists but isn't set as the front page. | Every visitor and Google see an empty blog. *Quick fix in WP: Settings → Reading → "A static page" → Homepage = "Home".* |
| 2 | **Critical** | **Certificates on the site expired on 2 July 2026.** Both the ISO 9001 (Q-29567/0) and SCC-P (CC-00054/0) PDFs say "Valid until 02 July 2026". | Procurement teams check this. Upload the renewed certificates (the new site shows registration numbers only, no expiry date, until you have them). |
| 3 | High | **Every URL returns 200** (soft-404). `/this-does-not-exist/`, `/sitemap.xml` and `/robots.txt` all return the empty homepage. | Google sees endless duplicate pages; there's no sitemap or robots.txt. |
| 4 | High | **Dutch homepage `/nl/home-2/` returns 404**, and its title is "Startseite" (German). | The NL language switcher leads to an error page. |
| 5 | High | **Broken/duplicate internal links:** buttons point to `/aboutt-us/` (typo), `/about-us/`, `/our-services/`, `/contact/`, while the real pages live at `/about-us-your-partner-in-piping/` etc. | Wasted crawl budget, duplicate content. |
| 6 | High | **Viewport hack:** a script forces `width=1700` / `width=1920` on laptops and tablets, plus `maximum-scale=1` blocks zoom. | Tiny text on tablets; accessibility failure (WCAG 1.4.4). |
| 7 | Medium | **Copy errors:** "industrian endeavor", "Safety is at the **our** of our operations", "Your trusted partner for piping **project**". The same "trusted partner" paragraph appears 4× (twice on the Projects page). | Looks unprofessional to engineering buyers. |
| 8 | Medium | **Projects page has no projects.** It repeats the About text; the real site photos are buried. | The strongest sales asset (proof of work) is missing. |
| 9 | Medium | **Empty social links** (Facebook / LinkedIn / Instagram have no URL) and the footer email link has no `href`. | Dead clicks. |
| 10 | Medium | Footer lists "Chamber of Commerce (ICO): 54474892". IČO is the Slovak company ID, not a Chamber of Commerce number. | Confusing for Dutch clients. |
| 11 | Medium | Server runs **PHP 7.4** (end of life since Nov 2022) and exposes `xmlrpc.php`. | Security risk. Ask the host to move to PHP 8.2+ and disable XML-RPC. |
| 12 | Low | Meta description is the 5-word tagline; no structured data; generic image alts ("Untitled-2"). | Weak search snippets. |

---

## 2. What the redesign does (`site/`)

**Layout:** a single, fast landing page with eight clear sections:
Hero → Who we are → Services → How we work → Projects → Why us / Safety → Certifications → FAQ → Contact.

**Design system**
- Brand red `#E5322B` and navy `#344A85` (taken from the logo), with a deep navy `#0B1426` for contrast sections. Red is used only for actions, so the quote button always stands out.
- IBM Plex Sans for text and IBM Plex Mono for technical labels (registration numbers, step numbers). It reads like an engineering spec sheet, which suits the audience.
- Real site photography everywhere (no stock except the existing safety image), converted to WebP at 800 px and 1600 px widths. Images went from ~0.9 MB JPEGs to 50–230 KB each.

**Copy:** rewritten to be short, specific and buyer-focused. Every claim is from your existing site or certificates. Typos and duplicate paragraphs are gone.

**Features added (all dependency-free, 8 KB of unminified JavaScript)**
1. **Quote request form** with service chips, project location and target start date. Validates inline. Without a backend it opens the visitor's email app with a structured enquiry; set `data-endpoint` on the form (Formspree, WP REST or a serverless function) to send directly.
2. **Project gallery** with category filters (Pipe racks / Pumps & valves / Process piping) and a full-screen lightbox: keyboard arrows, swipe on mobile.
3. **Certificate viewer:** click a certificate thumbnail to open the full document.
4. **Mobile action bar:** Call / Email / Request a quote, always one tap away.
5. **Sticky header** that switches from transparent to white, with section highlighting as you scroll.
6. **FAQ accordion** (native `<details>`, works without JS).
7. Subtle scroll reveal; disabled automatically for users who prefer reduced motion.

**SEO built in**
- Title (61 chars) and meta description (157 chars) targeting "piping contractor oil gas petrochemical".
- One H1, logical H2/H3 structure, descriptive alt text on every image.
- JSON-LD: `Organization` (KvK, IČO, address, both certifications as credentials, service catalogue), `WebSite`, `FAQPage` (eligible for FAQ rich results).
- Open Graph / Twitter cards, canonical URL, `robots.txt`, `sitemap.xml`, a real `404.html`.
- Preloaded hero image, lazy-loaded everything else, width/height on all images (no layout shift).

---

## 3. What I need from you (to finish properly)

1. **Renewed ISO 9001 and SCC-P certificates** (PDF). This is the most urgent.
2. **3–6 real project case studies:** client or sector, location, scope (e.g. "120 m DN200 carbon steel, 40 spools"), duration, and one result. Even anonymised ("Tank terminal, Rotterdam area") is fine.
3. **Dutch office address** (if any). Right now only the Bratislava address from the certificate is shown.
4. **Social profile URLs**, or confirm we should remove the icons.
5. **Confirm these lines in the copy**, which follow from your service list but aren't stated word for word on the old site: "Cost and change control", "ITPs and hold points", "Pressure & leak testing", "Handover & MDR dossiers", and the FAQ answer that each service can be contracted separately.
6. **Real numbers, if you have them:** years in business, projects completed, team size, inches/metres welded. We'll add a stats strip. I left it out rather than invent figures.
7. Team photo or founder photo + a 2-line bio. B2B buyers hire people.

---

## 4. Suggestions to make it look even cleaner

- **Shoot 10–15 new photos** on the next job: a welder at work, the prefab shop, a team shot in PPE, a finished line with tags. People + process beat empty pipe racks.
- **Vector logo (SVG).** The current logo is a 532×192 PNG; it looks soft on retina screens. A simplified mark (just the gear + "MS") would also make a sharper favicon.
- **Drop the stock refinery/hard-hat image** once you have your own safety photo.
- Keep the palette disciplined: navy + white + one red accent. Avoid adding the orange `#F7941D` from the old theme.

---

## 5. Features worth adding next (each under a day)

| Feature | Why | Effort |
|---|---|---|
| **Dutch version** (`/nl/`) with `hreflang` | You're on a `.nl` domain and Dutch buyers search in Dutch ("leidingbouw", "piping aannemer", "prefab leidingwerk"). Biggest SEO win available. | ½–1 day |
| **One page per service** (`/services/prefabrication/` etc.) | Each ranks for its own search terms; the home page can only rank for one. | ½ day |
| **Case-study pages** with photo galleries | Proof of work; long-tail SEO ("pump station piping Rotterdam"). | 2 h each |
| **Drawing upload on the quote form** (isometrics, P&IDs) | Faster, more accurate quotes. Needs a form backend (Formspree Pro, or WP). | 2 h |
| **Careers / "Werken bij" page** | Welders and fitters are scarce; the site can recruit too. | 2 h |
| **Google Business Profile + reviews** | Shows in Maps and local search. | 1 h |
| **LinkedIn company page** with project posts | Where your buyers (project managers, procurement) actually are. | Ongoing |
| **Privacy-friendly analytics** (Plausible or GA4 with consent banner) | See which pages bring quote requests. | 1 h |

---

## 6. How to put it live

**Option A, static hosting (recommended, fastest, cheapest):** upload `site/` to Netlify, Cloudflare Pages or Vercel and point the domain. Add the form endpoint (Netlify Forms works out of the box with a `netlify` attribute). Set up 301 redirects from the old URLs:

```
/our-services-mechanical-and-piping-projects/  →  /#services
/projects/                                      →  /#projects
/about-us-your-partner-in-piping/               →  /#about
/contact-piping-solutions/                      →  /#contact
/nl/*                                           →  /   (until the NL version exists)
```

**Option B, keep WordPress:** use `site/` as the design reference and rebuild it in the current theme (or a lightweight block theme). At minimum, fix items 1–6 in section 1 today. Fix #1 takes two minutes.

**Preview locally:**

```bash
cd "/Users/luka/ms plant service " && python3 -m http.server 4173 --directory site
```
Then open http://localhost:4173.

---

## 7. Premium pass (applied 6 Nov 2026; previous version kept in `site-v1-backup/`)

Applied in code: larger, lighter headlines with tighter letter-spacing; more whitespace between sections; red limited to buttons plus thin accent rules; one colour grade on every photo so the phone shots look like a single set; a subtle film-grain texture on the hero; a dark glass header when scrolling; numbered service cards with thinner icons; gallery captions that appear on hover; partner badges in greyscale until hovered; a full-width "Our standard" statement band with gentle parallax.

Still needs real assets (these matter more than any code):
1. **Professional photo/video shoot.** About €800–1,500 for a half day on site: people at work, the prefab shop, drone footage of a finished install. A 10-second muted video loop in the hero is the biggest single upgrade.
2. **Vector (SVG) logo**, ideally a simplified version. The PNG is the least premium element on the page.
3. **Hard numbers and named clients/sectors** (years, projects, metres installed, logos of clients you may show).
4. **Case-study pages** with a short story: problem → what we did → result.
