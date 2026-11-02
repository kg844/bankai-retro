# Bankai Retro — Website Project (WEDE5020 Portfolio of Evidence)

## Student Information
- **Full Name:** Kgotso Tsotetsi
- **Student Number:** ST10516836
- **Subject Code:** WEDE5020

## Project Overview
Bankai Retro is a fictional Johannesburg-based small business that sources and sells
retro/vintage football kits. This repository contains the website built for Bankai Retro
as part of the WEDE5020 Portfolio of Evidence, moving the brand from an Instagram-only
presence to a full online store, which suits a small business building its online presence
(Business Partners, 2024; HOSTAFRICA, 2026). Retro football shirts sit inside the
"blokecore" football-fashion trend (FootyCult, 2026; Southtexasnews, 2025), so the site's
black, gold and green streetwear styling is built around that audience.

## Website Goals and Objectives
- Move Bankai Retro from a social-media-only presence to a browsable, order-ready website.
- Increase product page views and enquiry form submissions.
- Track overall online order volume once the business begins fulfilling orders via the site.
- Keep running costs low by hosting on a free platform, because a domain and paid hosting add
  ongoing costs for a small South African business (RegisterDomain.co.za, 2025).

## Key Features and Functionality
- Homepage with hero banner and featured kits.
- About Us page telling the brand's story.
- Products page with kits loaded dynamically, plus search, club/era filters, sorting and a
  gallery lightbox.
- Enquiry page with a validated form that replies with the cost and availability of the
  chosen kit, and an FAQ accordion.
- Contact page with two physical locations (market stall and matchday pop-up) on an
  interactive map, contact details, and a validated message form that builds an email.

## Timeline and Milestones
| Weeks | Milestone |
|---|---|
| 1–2 | Research and planning |
| 3–4 | HTML structure |
| 5–6 | CSS styling |
| 7–8 | JavaScript functionality and testing |

## Part 1 Details — Building the Foundation
Part 1 covers project initiation and planning. Completed for this submission:
- Website Project Proposal (two proposals submitted for approval; Bankai Retro selected
  to move forward with).
- Sitemap (`docs/sitemap.svg`).
- Low-fidelity wireframes for the homepage and products page (`docs/wireframe-homepage.svg`,
  `docs/wireframe-products.svg`).
- File and folder structure set up (see below).
- Basic, standards-compliant HTML structure created for all 5 required pages.

## Part 2 Details — CSS Styling and Responsive Design
Part 2 covers visual styling and responsive layout, built on top of the Part 1
HTML structure. Completed for this submission:
- External stylesheet (`css/style.css`) expanded with a CSS reset, a type scale, and a
  spacing scale (both set as custom properties on `:root`) for consistent sizing across
  all 5 pages.
- Layout built with Flexbox (header/nav) (MDN Web Docs, n.d.a) and CSS Grid (product grid,
  contact locations) (MDN Web Docs, n.d.c).
- Interactive states added with pseudo-classes: hover, focus-visible, and active styles for
  links, buttons, form fields, and product/location cards (MDN Web Docs, n.d.d).
- Responsive breakpoints at 768px (tablet) and 480px (mobile) using media queries
  (MDN Web Docs, n.d.e), with relative units (rem, %, minmax()) so type scale, navigation,
  and grids adapt down to mobile.
- Images set to scale responsively (`max-width: 100%; height: auto;`) ready for real
  product photos to replace the placeholder blocks.
- Colour scheme, typography (Oswald and Inter from Google Fonts) (Google, n.d.a) and premium streetwear feel from Part 1
  carried through and refined rather than replaced.

## Part 3 Details — Functionality, SEO and Deployment

### Interactive elements and dynamic content (JavaScript, `js/script.js`)
| Feature | Where | How it works |
|---|---|---|
| Dynamic product listings | Home, Products | The kit cards are written in the HTML, then rebuilt in JavaScript from `data/products.json`, loaded with `fetch` (AJAX) (MDN Web Docs, n.d.f), for search, filters and the lightbox. |
| Search, filter and sort | Products | Live search by name/club/year, club and era filters, "in stock only" toggle, and 5 sort orders. A results count is announced to screen readers. |
| Gallery with lightbox | Home, Products | Clicking a kit photo opens a modal viewer with previous/next buttons, arrow-key support, Escape to close, and keyboard focus kept inside the dialog. |
| Accordion | Enquiry | FAQ section that opens and closes with animated transitions. Content stays visible if JavaScript is off. |
| Interactive map | Contact | Leaflet map (Leaflet, n.d.) with OpenStreetMap tiles (OpenStreetMap contributors, n.d.), a marker and popup for each location, and "Show on map" buttons that zoom to a location. Pin positions are approximate. |
| Animations and transitions | All pages | Cards fade and slide in as they scroll into view, and hover/focus/accordion/lightbox transitions are done with CSS. Everything switches off when a visitor has "reduce motion" turned on. |
| Advanced DOM manipulation | All pages | Cards, options, error messages, the lightbox and the form replies are created with `createElement`/`textContent` and updated as the user interacts. |

### Forms and validation
- **`enquiry.html` (kit enquiry):** name, email, optional phone, kit, size, quantity, enquiry
  type and details. Once validated, the form fetches the product data and shows a reply with
  the estimated total, stock availability (in stock, limited, sold out) and whether the size
  would need to be sourced. Linking from a product card pre-selects that kit.
- **`contact.html` (general message):** name, email, optional phone, message type and message.
  Once validated, the details are compiled into an email addressed to
  `hello@bankairetro.co.za` (the recipient is set in `js/script.js`). The visitor can open it
  in their email app or copy the text.
- **HTML5 validation:** `required`, `type="email"`, `minlength`/`maxlength`, `min`/`max` and
  `pattern` attributes on every field.
- **JavaScript validation:** uses the browser's Constraint Validation API (MDN Web Docs, n.d.b) to show clear,
  field-specific error messages on submit and when leaving a field. Rules include a
  South African phone number format (e.g. 082 123 4567 or +27 82 123 4567), name characters,
  an email with a domain, quantity from 1 to 5, and a message of 10 to 1000 characters.
  Errors are linked to their fields for screen readers (`aria-describedby`, `aria-invalid`).
- **AJAX:** the enquiry form uses `fetch` to read `data/products.json` asynchronously and
  displays the reply without reloading the page.

### SEO
**Keyword research.** Following Google's SEO guidance (Google, n.d.b), the target phrases are: *retro football kits South Africa*, *vintage football
shirts Johannesburg*, *Kaizer Chiefs / Orlando Pirates retro kit*, *buy retro football kits*,
*custom football shirt order*. They are used in page titles, descriptions, headings, body text,
link text and image alt text.

**On-page SEO (implemented)**
- Unique, descriptive `<title>` and meta description on every page, plus Open Graph tags.
- One `<h1>` per page with `<h2>`/`<h3>` headings in order; sections labelled with `aria-labelledby`.
- Image optimisation: descriptive file names (e.g. `kaizer-chiefs-1996-home-retro-kit.jpg`),
  descriptive alt text, `width`/`height` set, and `loading="lazy"` (the first three images load
  straight away). The `<img>` tags are written directly in `index.html` and `products.html`,
  so they are visible in the page source and to search engines, and still show with JavaScript off.
- Clean, readable URLs (`products.html`, `enquiry.html`, `contact.html`) and links with
  descriptive text between all pages.
- Mobile-friendly: viewport tag and responsive layout (Part 2).
- Local business structured data (JSON-LD) on the home page.

**Off-page SEO (strategy)**
- *Backlinks:* link to the site from the Bankai Retro Instagram bio, and approach South African
  football and streetwear blogs, podcasts and market listings to feature the brand.
- *Social media:* share new kits and market-day posts on Instagram with a link to the matching
  page on the site.
- *Local SEO:* claim a Google Business Profile for the Braamfontein market stall, keep the
  address and trading hours the same everywhere, and use "Johannesburg" in page content.

**Additional SEO requests**
- `robots.txt` allows all crawlers and points to the sitemap.
- `sitemap.xml` lists all 5 pages (Sitemaps.org, n.d.). Update the address in both files once the live URL is known.
- **Page speed:** fonts load through `<link>` tags with `preconnect` and `display=swap` instead
  of a blocking CSS import, scripts are deferred, images are lazy-loaded, and the map library
  only loads on the Contact page.
- **Security:** `_headers` sets a Content Security Policy, `X-Frame-Options`,
  `X-Content-Type-Options`, a referrer policy and a permissions policy (applied on Netlify).
  User input is always written to the page with `textContent`, never `innerHTML`, and
  external links use `rel="noopener noreferrer"`.

### Kit photos
Product photos live in `images/` using the file names listed in `data/products.json`. Six
generated placeholder photos (one per kit, 600 × 600 JPEG) are included so the gallery,
lightbox and enquiry reply all show real images; swap them for photos of the actual shirts
when stock is photographed. If a photo is missing, a "Kit photo coming soon" placeholder is
shown instead.

### Screenshots
Evidence screenshots for every Part 3 requirement are in `screenshots/` (captured at
1440 × 900 on desktop and 375 × 812 on mobile):

| File | What it evidences |
|---|---|
| `01-home-desktop.png` | Homepage: hero banner and featured kits loaded dynamically from `data/products.json` |
| `02-products-desktop.png` | Products page: all kits built with JavaScript, plus the search and filter bar |
| `03-products-search.png` | Live search: typing "chiefs" filters the grid and updates the result count |
| `04-products-filters.png` | Club/era filters and sorting working together with the live results count |
| `05-products-lightbox.png` | Gallery lightbox: a kit photo opened larger in an overlay, with previous/next controls |
| `06-enquiry-desktop.png` | Enquiry page: form and FAQ accordion |
| `07-enquiry-accordion.png` | Accordion: the first FAQ item opened with a click |
| `08-enquiry-validation-errors.png` | JavaScript validation: field-specific error messages on the empty form |
| `09-enquiry-response.png` | AJAX enquiry reply: estimated cost, stock availability and sizing note |
| `10-contact-desktop.png` | Contact page: locations, interactive Leaflet map and message form |
| `11-contact-map-popup.png` | Interactive map: "Show on map" zoomed to a marker with its popup open |
| `12-about-desktop.png` | About Us page |
| `13-mobile-menu.png` | Mobile navigation: the menu button opened at 375 px wide |
| `14-seo-title-tags.png` | SEO: `<title>` tag in the page source (Home) |
| `15-seo-title-tags-products.png` | SEO: unique `<title>` tag on the Products page |
| `16-seo-meta-description.png` | SEO: meta description in the page source (Enquiry) |
| `17-seo-images-alt-text.png` | SEO: the `<img>` tags in the page source, with descriptive file names, alt text, width/height and loading attributes |
| `18-products-without-javascript.png` | Products page with JavaScript turned off: the kit cards, images, file names and alt text all come from the HTML |

### Repository and deployment
- GitHub repository: *add repository link here*
- Live website: *add Netlify or GitHub Pages link here* (free hosting, see RegisterDomain.co.za, 2025)
- Run locally with a local server (for example the VS Code Live Server extension), because
  browsers block `fetch` from files opened directly from disk.

## Sitemap
See `docs/sitemap.svg`. The site has 5 pages, all linked from a consistent navigation
menu: Home (`index.html`), About Us (`about.html`), Products (`products.html`),
Enquiry (`enquiry.html`), Contact (`contact.html`).

## File and Folder Structure
```
BankaiRetro/
├── index.html
├── about.html
├── products.html
├── enquiry.html
├── contact.html
├── robots.txt
├── sitemap.xml
├── _headers
├── css/
│   └── style.css
├── js/
│   └── script.js
├── data/
│   └── products.json
├── images/
│   └── (6 kit photos, .jpg)
├── screenshots/
│   └── (17 evidence screenshots, .png)
└── docs/
    ├── sitemap.svg
    ├── wireframe-homepage.svg
    └── wireframe-products.svg
```

## Part 2 Feedback and Corrections
The Part 2 marking sheet was reviewed and each area below was improved in Part 3. The
changelog records the same edits in more detail.

| Feedback area (Part 2 mark) | What was changed | Files |
|---|---|---|
| References (0/5) | Reference list rebuilt in one consistent IIE Harvard pattern, in alphabetical order, with a, b, c suffixes where an author has several undated sources. In-text citations added to the README so each one matches an entry in the list. New sources added for CSS, JavaScript, SEO and mapping. | `README.md` |
| Feedback from Part 1 (6/10) | The Part 1 referencing feedback (consistency and congruency) was applied across the whole list, and every change from the feedback is now written up with its reason in the changelog. | `README.md` |
| Media queries and breakpoints (6/10) | Width breakpoints expanded from 2 to 5 (1400px and up, 1024px, 768px, 480px, 360px), plus a touch-screen query (`pointer: coarse`) and a landscape-phone query. | `css/style.css` |
| Adjustment: navigation menu (4/5) | Below 769px the menu collapses into a menu button that opens and closes the links, supports the Escape key, and keeps the links visible if JavaScript is off. | `css/style.css`, `js/script.js`, all 5 pages |
| Adjustment: layout (4/5) | Product grid steps down from 3+ columns to 2 and then 1, the filter bar and forms stack, and the map height reduces on small screens. | `css/style.css` |
| Adjustment: typography (4/5) | Heading sizes now scale fluidly with `clamp()`, paragraphs are limited to a readable line length, headings use balanced wrapping, and small screens get tighter line height. | `css/style.css` |
| Adjustment: images (4/5) | Kit images use a square `aspect-ratio` with `object-fit: cover`, are lazy-loaded, and the lightbox image shrinks in landscape. Real kit photos replace the placeholders as they are added. | `css/style.css`, `js/script.js` |
| Pseudo-classes (7/10) | Added `:visited`, `:focus-within`, `:nth-child`, `:last-child`, `:last-of-type`, `:user-invalid`, `:disabled`, `::selection`, `::placeholder`, and `::before`/`::after` on top of the Part 2 hover, focus and active states. | `css/style.css` |
| Desktop styling: default styles, layout, decoration and colour (4/5 each) | Added a subtle kit-stripe pattern to the hero, a gold border on the footer, alternate card tints, and a larger content width on big screens. | `css/style.css` |
| README and changelog (4/5 each) | README now has a Part 3 section, this feedback table and detailed changelog entries for every version. | `README.md` |

## Changelog
- **v0.3.2** — Part 3 SEO and layout fixes.
  - Wrote the kit cards, with their `<img>` tags, file names and alt text, into `index.html`
    and `products.html`. Before this the images only existed after JavaScript ran, so they were
    missing from the page source. `js/script.js` still rebuilds the cards for search, filters and
    the lightbox, and skips the fade-in on the first render so the cards do not flash. If a kit
    changes, update `data/products.json` and the matching card in the HTML.
  - The first three images now load straight away and the rest stay lazy-loaded.
  - Product cards: the price row and enquiry link now line up across each row, even when a kit
    name or description wraps onto two lines.
  - Added a small gap under each page heading.
  - Evidence screenshots 02–05 and 17 retaken after the card changes, and a JavaScript-off
    screenshot added (`screenshots/18-products-without-javascript.png`).
- **v0.3.1** — Part 3 final polish: six generated placeholder kit photos added to `images/`
  (600 × 600 JPEG, file names matching `data/products.json`), 17 evidence screenshots added
  to `screenshots/`, and the Products and Contact page titles shortened.
- **v0.3** — Part 3: functionality, SEO, forms and Part 2 feedback corrections.
  - *Dynamic content:* added `data/products.json`. The Home and Products pages now build their
    kit cards in JavaScript with `fetch`, instead of hard-coded HTML.
  - *Products page:* added search, club and era filters, an in-stock toggle, five sort orders, a
    results count and a "no results" message.
  - *Interactive elements:* added a gallery lightbox, an FAQ accordion on the Enquiry page,
    scroll-in card animations (switched off for visitors who prefer reduced motion), and an
    interactive Leaflet map on the Contact page that replaces the map placeholder.
  - *Enquiry page:* rebuilt the form with kit, size and quantity fields. Added HTML5 and
    JavaScript validation, and a reply showing the total cost and availability.
  - *Contact page:* added a message form with validation that compiles the details into an
    email addressed to hello@bankairetro.co.za.
  - *SEO:* unique titles and meta descriptions, Open Graph tags, JSON-LD business data,
    descriptive headings, alt text and internal links, `robots.txt`, and `sitemap.xml`.
  - *Page speed:* moved Google Fonts from a CSS `@import` to `<link>` tags with `preconnect`,
    deferred scripts, and lazy-loaded images.
  - *Security:* added `_headers` (Content Security Policy and related headers). All user
    input is displayed with `textContent`.
  - *Feedback corrections (Part 2):* mobile menu button; breakpoints at 1400px, 1024px,
    768px, 480px and 360px plus touch and landscape queries; fluid heading sizes; extra
    pseudo-classes and pseudo-elements; hero stripe pattern and gold footer border; reference
    list rebuilt with in-text citations. See the feedback table above.
  - *Accessibility:* skip link, `aria-current` on the active menu link, visible form error
    styles, and keyboard support in the lightbox and menu.
- **v0.2** — Part 2: CSS styling and responsive design.
  - Expanded `css/style.css` with a CSS reset and a type scale and spacing scale stored as
    custom properties on `:root`.
  - Built layouts with Flexbox (header and navigation) and CSS Grid (product grid and
    contact locations).
  - Added hover, focus-visible and active states for links, buttons, form fields and cards
    (card lift with shadow, button press, gold focus ring on form fields).
  - Added responsive breakpoints at 768px and 480px, using relative units, and responsive
    image rules (`max-width: 100%; height: auto`).
  - No HTML structure changes.
- **v0.1** — Part 1: initial commit.
  - Created the file and folder structure, the sitemap and two wireframes (homepage and
    products page) in `docs/`.
  - Wrote basic HTML structure for all 5 pages, with starter CSS (colour palette, Oswald and
    Inter fonts, hero banner and product grid) and this README.

## References
Referencing style: IIE Harvard.

Business Partners, 2024. Here's how to effectively build your online presence as a
small business. [Online] Available at:
https://www.businesspartners.co.za/heres-how-to-effectively-build-your-online-presence-as-a-small-business/
[Accessed 17 August 2026].

FootyCult, 2026. What is Blokecore? The football-fashion trend taking over 2026.
[Online] Available at: https://footycult.com/journal/what-is-blokecore
[Accessed 17 August 2026].

Google, n.d.a. Google Fonts. [Online] Available at: https://fonts.google.com/
[Accessed 2 November 2026].

Google, n.d.b. SEO Starter Guide. [Online] Available at:
https://developers.google.com/search/docs/fundamentals/seo-starter-guide
[Accessed 2 November 2026].

HOSTAFRICA, 2026. South African SMEs: insights from the HOSTAFRICA SMB Lab. [Online]
Available at:
https://hostafrica.co.za/blog/south-africa-2/understanding-small-businesses-in-south-africa-insights-from-the-hostafrica-smb-lab/
[Accessed 17 August 2026].

Leaflet, n.d. Leaflet: an open-source JavaScript library for interactive maps. [Online]
Available at: https://leafletjs.com/ [Accessed 2 November 2026].

MDN Web Docs, n.d.a. Basic concepts of flexbox. [Online] Available at:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox
[Accessed 2 November 2026].

MDN Web Docs, n.d.b. Client-side form validation. [Online] Available at:
https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation
[Accessed 2 November 2026].

MDN Web Docs, n.d.c. CSS grid layout. [Online] Available at:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
[Accessed 2 November 2026].

MDN Web Docs, n.d.d. Pseudo-classes. [Online] Available at:
https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
[Accessed 2 November 2026].

MDN Web Docs, n.d.e. Using media queries. [Online] Available at:
https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries
[Accessed 2 November 2026].

MDN Web Docs, n.d.f. Using the Fetch API. [Online] Available at:
https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
[Accessed 2 November 2026].

OpenStreetMap contributors, n.d. Copyright and licence. [Online] Available at:
https://www.openstreetmap.org/copyright [Accessed 2 November 2026].

RegisterDomain.co.za, 2025. Cost of domain registration and hosting in South Africa.
[Online] Available at: https://www.registerdomain.co.za/blog/domain-hosting-costs-south-africa/
[Accessed 17 August 2026].

Sitemaps.org, n.d. Sitemaps XML format. [Online] Available at:
https://www.sitemaps.org/protocol.html [Accessed 2 November 2026].

Southtexasnews, 2025. Blokecore style scores big this summer as soccer jerseys
dominate street fashion. [Online] Available at:
https://www.southtexasnews.com/brenham_banner_press/news/blokecore-style-scores-big-this-summer-as-soccer-jerseys-dominate-street-fashion/article_f7050694-fec6-578e-832e-12a2801d92da.html
[Accessed 17 August 2026].
