# Amaya Sutra: website design prototype

A clickable, responsive design concept for the Amaya Sutra store. It is meant for client review before the real store is built on Shopify or Wix. It is not a production store: there is no backend, no real checkout and no payment.

## Run it

Option 1, no install: open `index.html` in Chrome, Safari, Edge or Firefox.

Option 2, local server (closer to a real website):

```bash
cd amaya-sutra-prototype
python3 -m http.server 8080
# then open http://localhost:8080
```

or, with Node installed: `npx serve .`

An internet connection is needed only for the two Google Fonts (Outfit and Manrope). Without it, the site falls back to system fonts.

## What's included

| Page | Link | Notes |
|---|---|---|
| Home | `#home` | Hero, collections, featured shirts, editorial, style and occasion, brand story, newsletter |
| Collection | `#shop`, `#shop-linen`, `#shop-formal`, `#shop-new` | Working filters (collection, size, colour, price, fit), sorting, filter chips, clear all, mobile filter drawer |
| Product | `#product-sky-blue` (and any other product) | Gallery, colour and size selection, size guide, quantity, add to bag, PIN code demo, accordions, related shirts |
| Checkout preview | `#checkout` | Clearly labelled demo. Fields are disabled; no data is collected and no order is created |
| Our Story | `#about` | Sample brand story (story, principles, how a shirt is made, ARB Creations). All text is in `src/about.js` |
| Policies and contact | `#info-shipping`, `#info-returns`, `#info-privacy`, `#info-terms`, `#info-contact` | Placeholder pages |
| Account | `#account` | Explains that accounts come from the store platform |

Also: mega menu (hover "Shop"), mobile menu drawer, search with live results, quick view, quick add (hover a product image on desktop), cart drawer with quantity, remove, subtotal and empty state. The bag is remembered in the browser between visits.

## Hosting on GitHub Pages

This is a plain static site, so there is no build step on GitHub. `index.html` is already built and committed. All paths are relative, so it works under a project URL such as `https://<username>.github.io/amaya-sutra-prototype/`.

- Pages source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
- `.nojekyll` stops GitHub's Jekyll processing, so files are served exactly as they are.
- The page carries `noindex` and `robots.txt` blocks crawlers, which keeps this client-review demo out of search engines.
- After editing `src/styles.css`, `src/data.js`, `src/app.js` or `src/shell.html`, run `python3 build.py` before committing. Edits to `src/banners.js`, `src/images.js` and `src/about.js` need no build.

## Changing the homepage slideshow

1. Export each banner from Photoshop as JPG: desktop 2400 × 1050 px (16:7), and optionally mobile 1080 × 1350 px (4:5). Keep the people in the middle 60% of the frame.
2. Put the files in `assets/banners/`.
3. Open `src/banners.js` in any text editor. Fill in `image` / `imageMobile`, and edit the headline, text and button labels. Copy or delete a `{ ... }` block to add or remove a slide.
4. Refresh `index.html`. No build step is needed for banner or photo changes.

If the artwork already has text in it, set `showText: false` for that slide. Use `tone: "light"` when the photo is dark, so the text turns ivory. Use `position` to choose which part of the photo stays in view.

## Adding photography

All photos are listed in `src/images.js`:
- `PRODUCT_IMAGES`: one list per colour variant (front, three-quarter, side, detail, lifestyle). The first photo is the card and gallery lead, and the second is the card hover image.
- `SITE_IMAGES`: collection cards, editorial, occasions, story, menus and collection banners.

Any empty slot shows a labelled "photo to come" tile in that product's colour. It never shows another colour's photo.

## Project structure

```
index.html          built page, open this
assets/             images and the traced logo (logo.svg)
src/styles.css      design tokens and all styles
src/banners.js      homepage slideshow content (edit freely)
src/images.js       every photo used on the site, per product colour
src/about.js        Our Story page text (edit freely)
src/data.js         sample product data and colour families (FAMILIES)
src/app.js          components (Header, MegaMenu, ProductCard, ProductGrid, CollectionBanner,
                    FilterPanel, Gallery, cart drawer, Newsletter, Footer) and the router
src/shell.html      page skeleton
build.py            rebuilds index.html after edits to styles.css, data.js or app.js: python3 build.py
```

## Placeholders needing client approval

- **Photography.** All photos are free Unsplash stand-ins (Unsplash Licence: free for commercial use, no permission needed). They show the layout only and are **not Amaya Sutra products**. Replace them with the client's own shoot before launch. Some colours have photos of one model only, plus close-up crops of that same photo.
- **Product names, prices, fits and size availability** are illustrative.
- **Fabric composition, care and fit details** are marked as placeholders on the product page.
- **Size guide measurements** are illustrative and must be checked against ARB Creations' specs.
- **Shipping, returns, privacy, terms, contact details and social links** are placeholders.
- **Brand story.** The Our Story page uses sample copy written for the concept (`src/about.js`). It avoids dates, places, numbers and certifications. Replace it with the client's own story.
- **Logo.** Traced to SVG from the supplied PNG. Ask for the original vector file if one exists.

## Photo sources (Unsplash)

| Used for | Unsplash page |
|---|---|
| Classic White: front, close-up | https://unsplash.com/photos/man-in-white-shirt-holding-a-suit-jacket-R1R5gxGM-h8 |
| Classic White: collar detail | https://unsplash.com/photos/man-in-white-button-up-shirt-GDebkNryTd4 |
| Sky Blue: front | https://unsplash.com/photos/a-man-with-a-beard-and-mustache-7ijNaKTWm5c |
| Sky Blue: three-quarter; Formal collection banner | https://unsplash.com/photos/a-man-with-his-arms-crossed-eJKT-xxSRoc |
| Sky Blue: cuff detail | https://unsplash.com/photos/a-man-wearing-a-blue-shirt-and-tan-pants-r77Buio2tds |
| Soft Pink | https://unsplash.com/photos/man-in-pink-shirt-and-jeans-standing-outdoors-HxH5-Q1JKgA |
| Stone Grey | https://unsplash.com/photos/man-in-blue-dress-shirt-and-black-denim-jeans-standing-near-brown-rock-during-daytime-jIPRAqxE6P8 |
| Sand Linen | https://unsplash.com/photos/man-in-white-dress-shirt-standing-near-green-plants-during-daytime-D_Y-BuWJvjw |
| Sand Linen: flat lay | https://unsplash.com/photos/a-pair-of-glasses-a-ball-of-yarn-a-pair-of-sunglasses-and-9Pspyy5lEMw |
| Midnight Navy | https://unsplash.com/photos/a-man-sitting-on-the-ground-with-his-hands-folded-oTICB74DTDg |
| Midnight Navy: hanger | https://unsplash.com/photos/a-blue-shirt-hanging-on-a-white-wall-vcTKFYNZop4 |
| Earth Brown: front | https://unsplash.com/photos/young-man-leaning-on-a-railing-by-a-lake-Vj2V70FAV9U |
| Earth Brown: street | https://unsplash.com/photos/man-in-brown-shirt-and-white-pants-holding-hat-6PZX63gD8zM |
| Earth Brown: city | https://unsplash.com/photos/man-standing-by-auto-rickshaw-in-front-of-ornate-building-hk4kt6j1Tn4 |
| Earth Brown: side; All Shirts banner | https://unsplash.com/photos/young-man-looking-out-over-a-lake-with-buildings-hRjU85idTMs |
| Olive Casual | https://unsplash.com/photos/man-with-braided-hair-in-green-shirt-looking-down-GOoIyNfMMnw |
| Olive Casual: fabric | https://unsplash.com/photos/olive-green-fabric-on-wood-9IjtuvMgH-k |
| Everyday Essential (coral) | https://unsplash.com/photos/man-in-pink-kurta-with-pen-in-pocket-gLkRkNGKPss |
| Everyday Essential: side | https://unsplash.com/photos/man-in-a-pink-kurta-with-a-pen-in-pocket-EY865prUQJg |
| Slide 1, Linen banner, menus | https://unsplash.com/photos/3-men-standing-on-brown-rocky-mountain-during-daytime-z8XC-0Yq0YE |
| Slide 2 | https://unsplash.com/photos/a-man-standing-on-a-balcony-KSa_bCZYE8o |
| Slide 3, New Arrivals banner | https://unsplash.com/photos/a-man-with-a-beard-sitting-in-front-of-a-building-nd-Gwe2ZECc |
| Linen collection card | https://unsplash.com/photos/man-standing-on-beach-during-daytime-IhuHLIxS_Tk |
| Formal collection card | https://unsplash.com/photos/a-man-standing-in-front-of-a-chandelier-oUr5WuLZByk |
| Editorial section | https://unsplash.com/photos/man-leaning-on-hay-bale-gEhcIMel6UI |
| Occasion: At Work | https://unsplash.com/photos/a-man-in-a-blue-shirt-standing-in-a-room-diVSZjvUpPc |
| Occasion: Smart Casual | https://unsplash.com/photos/man-in-white-dress-shirt-wearing-black-sunglasses-lg9R_2r-vAs |
| Occasion: Everyday | https://unsplash.com/photos/man-in-white-looks-at-ocean-view-cat-on-windowsill-2gGjVOXq1P4 |
| Brand story | https://unsplash.com/photos/a-man-walks-through-a-field-of-white-flowers-3EFV4iwKMvs |
| Our Story page | https://unsplash.com/photos/man-in-a-white-top-DapoPeuvfgM |
