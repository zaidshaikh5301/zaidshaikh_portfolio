# Portfolio — Mohamad Zaid A. Shaikh

A hand-crafted personal portfolio for a fresher frontend / React developer.
Plain HTML5, CSS3 and vanilla JavaScript. **No frameworks, no build step, no
dependencies.**

Open `index.html` in a browser and it works. Deploy the folder as-is.

---

## Quick start

```bash
# Option A — just open it
start index.html          # Windows
open  index.html          # macOS

# Option B — a local server (recommended; clipboard + form behave best over http)
npx serve .
# or: python -m http.server 8000
```

Then visit <http://localhost:8000>.

> Opening the file directly via `file://` still works, with one caveat: the
> copy-to-clipboard button falls back to `document.execCommand` because the
> async Clipboard API needs a secure context. A local server avoids that.

---

## File structure

```
portfolio/
├── index.html                 # the whole page — semantic HTML + inline theme bootstrap
├── css/
│   └── style.css              # design tokens, layout, components, motion, print
├── js/
│   └── main.js                # nav, theme toggle, scroll spy, filter, form, clipboard
├── assets/
│   ├── images/
│   │   ├── favicon.svg
│   │   ├── zaid_profile.jpg                    # hero photo (used)
│   │   ├── codebitapi.png                      # CodeBit API screenshot (used)
│   │   ├── project-codebit.svg                 # TODO: replace with a real screenshot
│   │   ├── project-noor-tailor.svg             # TODO: replace with a real screenshot
│   │   ├── project-taskflow.svg                # TODO: replace with a real screenshot
│   │   ├── project-foodies.svg                 # TODO: replace with a real screenshot
│   │   ├── profile.svg                         # unused leftover, safe to delete
│   │   └── project-codebit-api.svg             # unused leftover, safe to delete
│   └── resume.pdf                              # TODO: replace with your real resume
├── tools/
│   └── build-placeholder-resume.ps1            # optional dev helper, safe to delete
└── README.md
```

Everything is referenced with **relative paths** (`css/style.css`, not `/css/style.css`),
so the site works from a subdirectory (GitHub Pages project sites, Netlify
sub-paths) as well as from a root domain. There is nothing to configure.

---

## Design system

| Token | Value | Why |
| --- | --- | --- |
| Accent | `#b8410e` light / `#fb923c` dark | A warm vermilion — deliberately not the default purple/blue tech-portfolio gradient. |
| Neutrals | Warm stone ramp (`#faf9f7` → `#191917`) | Warmer and less clinical than pure grey. |
| Body font | Inter | Excellent legibility at small sizes. |
| Display font | Plus Jakarta Sans | Geometric headings with real weight. |
| Radius | `12px` cards, `999px` buttons | Consistent, restrained. |

Light and dark values are declared **once per token** using the CSS
`light-dark()` function, which resolves against `color-scheme`. Switching
themes is therefore a single attribute change with no duplicated CSS.

Theme priority:

1. Explicit user choice → saved in `localStorage` under `theme`
2. No saved choice → follows `prefers-color-scheme`
3. The theme is applied by a tiny inline script in `<head>` **before first
   paint**, so there is no white flash on load.

**Browser support:** `light-dark()` requires Chrome 123+, Edge 123+,
Safari 17.5+ or Firefox 120+ (2023–2024). On older browsers the page still
renders and every feature works, but light/dark falls back to the OS
setting only. If you need to support older browsers, replace the
`light-dark(a, b)` values in `css/style.css` with a duplicated
`@media (prefers-color-scheme: dark)` block.

---

## TODO — what you need to replace

Work top to bottom; the site is fully functional and shippable before you
start, but a recruiter will notice these gaps.

### 1. Real links (highest priority)

| What | Where | Currently |
| --- | --- | --- |
| GitHub profile URL | `index.html` — hero icon link, `sameAs` in the JSON-LD | `href="#"` |
| CodeBit — live demo | `index.html` — CodeBit card, "Live Demo" | `href="#"` |
| CodeBit — repository | `index.html` — CodeBit card, "GitHub" | `href="#"` |
| CodeBit API — live demo | `index.html` — CodeBit API card, "Live Demo" | `href="#"` |
| CodeBit API — repository | `index.html` — CodeBit API card, "GitHub" | `href="#"` |
| CodeBit API — Swagger URL | `index.html` — CodeBit API card, "API Docs" | `href="#"` |
| Noor Tailor — live demo | `index.html` — Noor Tailor card, "Live Demo" | `href="#"` |
| Noor Tailor — repository | `index.html` — Noor Tailor card, "GitHub" | `href="#"` |
| TaskFlow — repository | `index.html` — TaskFlow card, "GitHub" | `href="#"` |
| TaskFlow — live demo | `index.html` — TaskFlow card | *no button yet* |
| Foodies — live demo | `index.html` — Foodies card, "Live Demo" | `href="#"` |
| Foodies — repository | `index.html` — Foodies card, "GitHub" | `href="#"` |

Search the file for `href="#"` to find every one. There is a
`<!-- TODO: add link -->` comment above each.

> **Use forward slashes in every `src` and `href` path.** Windows lets you
> write `assets\images\photo.jpg`, but that 404s on GitHub Pages, Netlify and
> Wasmer, which all run on Linux.

### 2. Images

| What | Replace this file with |
| --- | --- |
| `assets/images/project-codebit.svg` | A real screenshot, **16:9**, ~1600×900. |
| `assets/images/project-noor-tailor.svg` | A screenshot of the storefront. |
| `assets/images/project-taskflow.svg` | A screenshot of the TaskFlow board. |
| `assets/images/project-foodies.svg` | A screenshot of the Foodies menu / cart. |

Already done: `zaid_profile.jpg` (hero photo) and `codebitapi.png`
(CodeBit API Swagger view) are in place and referenced. Two placeholder SVGs
are now unused and can be deleted: `profile.svg` and `project-codebit-api.svg`.

A 1200×630 PNG or JPG named `assets/images/og-image.png` will make the
Open Graph / Twitter preview render instead of showing nothing. The `<meta>`
tags already point at it; the file just doesn't exist yet.

Write real, descriptive `alt` text for every image. The placeholders say what
the image is a placeholder *for*; the real ones should say what the image
*shows*.

### 3. Resume

Overwrite `assets/resume.pdf` with your real PDF. Same filename, nothing else
to change. The current file is a generated one-page placeholder so the
download button isn't a 404.

### 4. Contact form endpoint

The form currently validates, then hands the message to the visitor's mail
app via a pre-filled `mailto:` link. It works, but a hosted endpoint is
better because it never leaves the browser.

1. Create a free form at <https://formspree.io> and point it at
   `zaidshaikh3543@gmail.com`.
2. In `index.html`, set both attributes on the `<form id="contact-form">`:

   ```html
   action="https://formspree.io/f/xxxxxxxx"
   method="post"
   data-endpoint="https://formspree.io/f/xxxxxxxx"
   ```

   `data-endpoint` is what the JavaScript reads; `action` is the no-JS
   fallback. Both are marked with a `TODO` comment.

### 5. Domain and share image

Search `index.html` for `https://example.com/`. It appears in the
`<link rel="canonical">`, the `og:url` tag and the JSON-LD `url`. Replace all
of them with your real domain once you have one.

### 6. Optional

- **`assets/images/favicon.svg`** — currently a "Z" monogram. Swap for your own mark.
- **`tools/build-placeholder-resume.ps1`** — only used to generate the placeholder
  PDF. Safe to delete once you have your own resume.

---

## Features

**Navigation**
- Sticky header with a blur + border once you scroll
- Active-section highlighting via `IntersectionObserver`
- Mobile hamburger menu: closes on link click, on `Escape`, on outside click
  and on resize to desktop; `aria-expanded` kept in sync

**Projects**
- Filter by `All / React / Full Stack / Backend` via each card's `data-tags`
  (All 5, React 3, Full Stack 4, Backend 1)
- `aria-pressed` on the filter buttons, live result count via `role="status"`
- Cards animate in; hidden with the `hidden` attribute, not `display: none`
- Five cards: the top three are featured, the last two use
  `.project-card--compact` and sit side by side on desktop
- Every card carries a status pill (`--done` / `--wip`) in both themes, and
  project buttons have `aria-label`s naming the project, because a screen
  reader otherwise meets five identical "GitHub" links in a row

**Contact**
- Client-side validation with inline, `aria-describedby`-linked error messages
- Real submission when an endpoint is configured; `mailto:` handoff when not
- Success / error messaging, disabled-while-sending state
- Copy-to-clipboard on the email address, with a `execCommand` fallback for
  `file://` and older browsers

**Motion**
- Fade-and-rise on scroll, one-shot (each element stops being observed once shown)
- Hover states on cards, buttons, links and social icons
- Smooth anchor scrolling
- Everything collapses under `prefers-reduced-motion: reduce`

**Print**
- `Ctrl+P` / `Cmd+P` produces a clean, light-themed, single-column resume —
  the nav, buttons and filters are dropped.

---

## Accessibility

- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`
- Exactly one `h1`; headings descend logically (`h1` → `h2` → `h3`)
- Skip-to-content link as the first tab stop
- `aria-label` on every icon-only link and button; `aria-current` on the active nav link
- `:focus-visible` outline on all interactive elements, never removed without a replacement
- `aria-pressed` on the filter buttons, `aria-expanded` on the hamburger
- `role="status"` / `aria-live="polite"` for filter results and form feedback
- `prefers-reduced-motion` respected
- Colour contrast meets WCAG AA in both themes (`#b8410e` on `#faf9f7` ≈ 4.9:1)

## SEO & performance

- Title, meta description, canonical, Open Graph and Twitter card tags
- `Person` JSON-LD schema (name, job title, contact, location, education, skills)
- `favicon.svg` + `apple-touch-icon`
- Fonts preconnected, `display=swap`, with a full system-font fallback stack
- SVG sprite: icons defined once, referenced with `<use>`
- Project images `loading="lazy"`; the hero photo is `fetchpriority="high"`
  because lazy-loading an above-the-fold image would hurt LCP
- Single CSS file, single JS file, no unused rules, no third-party scripts
- Targets Lighthouse 90+ in Performance, Accessibility, Best Practices and SEO

## Browser support

Chrome / Edge 123+, Safari 17.5+, Firefox 120+ (see `light-dark()` note above).
Everything degrades gracefully: with JavaScript disabled, the page is fully
readable, the mobile menu is expanded inline, the scroll-reveal content is
visible, and the form falls back to its `action`.

---

## Deploying

### GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

Then **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`**.
Live at `https://<you>.github.io/<repo>/`. No build command, no `index.html`
moving required — relative paths make it work under a subpath.

### Netlify

Drag the folder onto <https://app.netlify.com/drop>. No build settings needed.
Or connect the repo and leave Build command empty, Publish directory `.`.

### Wasmer

```bash
wasmer login
wasmer deploy
```

When prompted, choose **Static** and the project root. No `Dockerfile` is
required.

### Any static host

Upload the folder contents. That's it — there is nothing to compile.

---

## Licence

Personal portfolio. Use it, adapt it, ship it.
