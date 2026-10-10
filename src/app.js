/* ---------- Amaya Sutra prototype: vanilla JS components + hash router ---------- */
(function () {
"use strict";

/* ---------- helpers ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const inr = n => "₹" + n.toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const bySlug = slug => PRODUCTS.find(p => p.slug === slug);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable: keep in memory */ } }
};

const ICON = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.2-3.6 4-5.3 7.5-5.3s6.3 1.7 7.5 5.3"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 8h14l-1 12.5H6L5 8z"/><path d="M9 8V6.5a3 3 0 016 0V8"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h11"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M15 5l-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 5l7 7-7 7"/></svg>',
  filter: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
  x: '<svg viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M1 1l8 8M9 1L1 9"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".6" fill="currentColor"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M13.5 20v-7h2.6l.4-3h-3V8.3c0-.9.3-1.5 1.6-1.5h1.5V4.2c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V10H8.2v3h2.5v7"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6v12M15 6v12"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="6" width="18" height="12" rx="3.5"/><path d="M10.5 9.5v5l4.2-2.5-4.2-2.5z" fill="currentColor"/></svg>'
};
const LOGO = '<svg role="img" aria-label="Amaya Sutra"><use href="#logo"/></svg>';

/* ---------- state ---------- */
const state = {
  cart: store.get("as-cart", []),
  filters: { cats: [], sizes: [], colours: [], prices: [], fits: [], q: "" },
  sort: "featured",
  shopCat: "all",
  buyNow: null   // { slug, size, qty } while a Buy Now checkout is open; the bag is left untouched
};
const emptyFilters = () => ({ cats: [], sizes: [], colours: [], prices: [], fits: [], q: "" });

/* ---------- cart ---------- */
const Cart = {
  count() { return state.cart.reduce((n, i) => n + i.qty, 0); },
  subtotal() { return state.cart.reduce((n, i) => n + i.qty * (bySlug(i.slug) ? bySlug(i.slug).price : 0), 0); },
  add(slug, size, qty = 1) {
    const hit = state.cart.find(i => i.slug === slug && i.size === size);
    if (hit) hit.qty = Math.min(10, hit.qty + qty); else state.cart.push({ slug, size, qty });
    this.save(true);
  },
  setQty(idx, qty) {
    if (qty < 1) state.cart.splice(idx, 1); else state.cart[idx].qty = Math.min(10, qty);
    this.save();
  },
  remove(idx) { state.cart.splice(idx, 1); this.save(); },
  save(bump) {
    state.cart = state.cart.filter(i => bySlug(i.slug));
    store.set("as-cart", state.cart);
    const c = $("#bagCount"); const n = this.count();
    c.textContent = n; c.hidden = n === 0;
    $("#bagBtn").setAttribute("aria-label", "Shopping bag, " + n + (n === 1 ? " item" : " items"));
    if (bump) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
    renderCartDrawer();
    if (currentView === "checkout") route();
  }
};

/* ---------- components ---------- */
function Header() {
  return `
  <div class="announce" role="note">Discover the Amaya Sutra collection <a href="#shop-new">See what's new</a></div>
  <header class="header" id="header">
    <div class="wrap header-inner">
      <button class="icon-btn menu-btn" data-act="menu" aria-label="Open menu" aria-controls="navDrawer">${ICON.menu}</button>
      <a class="logo" href="#home" aria-label="Amaya Sutra home">${LOGO}</a>
      <nav class="nav" aria-label="Main">
        <div class="nav-item" id="shopItem">
          <a href="#shop" data-nav="shop" aria-haspopup="true" aria-expanded="false" id="shopLink">Shop</a>
          ${MegaMenu()}
        </div>
        <a href="#shop-linen" data-nav="shop-linen">Linen Shirts</a>
        <a href="#shop-formal" data-nav="shop-formal">Formal Shirts</a>
        <a href="#shop-new" data-nav="shop-new">New Arrivals</a>
        <a href="#about" data-nav="about">About</a>
      </nav>
      <div class="tools">
        <button class="icon-btn" data-act="search" aria-label="Search">${ICON.search}</button>
        <a class="icon-btn acct" href="#account" aria-label="Account">${ICON.user}</a>
        <button class="icon-btn" id="bagBtn" data-act="cart" aria-label="Shopping bag" aria-controls="cartDrawer">${ICON.bag}<span class="bag-count" id="bagCount" hidden>0</span></button>
      </div>
    </div>
  </header>`;
}

function MegaMenu() {
  const colourLinks = Object.keys(COLOURS).map(c =>
    `<li><button data-act="shop-colour" data-colour="${esc(c)}"><span class="dot" style="background:${COLOURS[c]}"></span>${esc(c)}</button></li>`).join("");
  return `
  <div class="mega" id="mega" role="region" aria-label="Shop menu">
    <div class="wrap mega-inner">
      <div><h4 class="label">Collections</h4>
        <ul><li><a href="#shop">All Shirts</a></li><li><a href="#shop-linen">Linen Shirts</a></li><li><a href="#shop-formal">Formal Shirts</a></li><li><a href="#shop-new">New Arrivals</a></li></ul></div>
      <div><h4 class="label">Shop by colour</h4>
        <ul style="grid-template-columns:1fr 1fr;column-gap:24px">${colourLinks}</ul></div>
      <div class="mega-feature">
        ${Media(SITE_IMAGES.megaFeature)}
        <div><span class="label">The Linen edit</span><p>Deep and earthy tones for warm days and relaxed weekends.</p><a class="link-arrow" href="#shop-linen">Shop Linen →</a></div>
      </div>
    </div>
  </div>`;
}

function Footer() {
  return `
  <footer class="footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="#home" aria-label="Amaya Sutra home">${LOGO}</a>
          <p>Linen and formal shirts for contemporary men. Manufactured by ARB Creations.</p>
          <div class="socials">
            <a href="#" data-act="social" data-net="Instagram" aria-label="Instagram (placeholder)">${ICON.ig}</a>
            <a href="#" data-act="social" data-net="Facebook" aria-label="Facebook (placeholder)">${ICON.fb}</a>
            <a href="#" data-act="social" data-net="YouTube" aria-label="YouTube (placeholder)">${ICON.yt}</a>
          </div>
        </div>
        <div><h4>Shop</h4><ul>
          <li><a href="#shop">All Shirts</a></li><li><a href="#shop-linen">Linen Shirts</a></li>
          <li><a href="#shop-formal">Formal Shirts</a></li><li><a href="#shop-new">New Arrivals</a></li>
          <li><button data-act="size-guide">Size Guide</button></li></ul></div>
        <div><h4>About</h4><ul>
          <li><a href="#about">Our Story</a></li><li><a href="#info-contact">Contact</a></li><li><a href="#account">Account</a></li></ul></div>
        <div><h4>Help</h4><ul>
          <li><a href="#info-shipping">Shipping Policy</a></li><li><a href="#info-returns">Returns &amp; Exchanges</a></li>
          <li><a href="#info-privacy">Privacy Policy</a></li><li><a href="#info-terms">Terms of Use</a></li></ul></div>
        <div class="footer-contact"><h4>Contact</h4><ul>
          <li>Email: [to be confirmed]</li><li>Phone: [to be confirmed]</li><li>Address: [to be confirmed]</li>
          <li><span class="placeholder-tag">Placeholder</span></li></ul></div>
      </div>
      <div class="footer-base">
        <span>© 2026 Amaya Sutra. Manufactured by ARB Creations.</span>
        <span>Design concept. Names and prices are illustrative; photos are Unsplash stand-ins, not Amaya Sutra products.</span>
      </div>
    </div>
  </footer>`;
}

/* Image or a clearly labelled "photo to come" tile. Never falls back to another colour's photo. */
function Media(img, p, opts = {}) {
  const cls = opts.cls ? ` class="${opts.cls}"` : "";
  if (img && img.src) {
    return `<img${cls} src="${img.src}" alt="${opts.decorative ? "" : esc(img.alt || "")}"${opts.decorative ? ' aria-hidden="true"' : ""} loading="${opts.eager ? "eager" : "lazy"}"${img.pos ? ` style="object-position:${img.pos}"` : ""}>`;
  }
  const label = p ? `${p.colour} · photo to come` : "Photo to come";
  return `<div${opts.cls ? ` class="ph ${opts.cls}"` : ' class="ph"'} ${opts.decorative ? 'aria-hidden="true"' : `role="img" aria-label="${esc(label)}"`} style="--ph:${p ? COLOURS[p.colour] : "var(--sand)"}">${opts.small ? "" : `<span>${esc(label)}</span>`}</div>`;
}

/* Colour swatches: real buttons. On cards they switch the card to the sibling variant in place. */
function Swatches(p, origin) {
  const sibs = variantsOf(p);
  return `<div class="swatches" role="group" aria-label="Colours for ${esc(p.name)}">${sibs.map(q =>
    `<button type="button" class="sw-btn" data-act="card-colour" data-slug="${q.slug}" data-origin="${origin}" aria-pressed="${q === p}" aria-label="${esc(q.colour)}${q === p ? " (selected)" : ""}" title="${esc(q.colour)}"><span class="sw" style="background:${COLOURS[q.colour]}"></span></button>`).join("")}</div>`;
}

function ProductCard(p, opts = {}) {
  const origin = opts.origin || p.slug; // the card's slot in the grid stays stable while the variant changes
  const sizeBtns = SIZES.map(s => {
    const ok = p.sizes.includes(s.k);
    return `<button data-act="quick-add" data-slug="${p.slug}" data-size="${s.k}" ${ok ? "" : "disabled"} aria-label="Add ${esc(p.name)}, size ${s.k}, to bag${ok ? "" : " (unavailable)"}">${s.k}</button>`;
  }).join("");
  const imgs = imagesOf(p);
  return `
  <article class="card" data-origin="${origin}" data-slug="${p.slug}">
    <div class="card-visual">
    <a class="card-media" href="#product-${p.slug}" aria-label="${esc(p.name)}, ${esc(p.colour)}, ${inr(p.price)}">
      ${p.isNew ? '<span class="badge">New</span>' : ""}
      ${Media(imgs[0], p, { cls: "main", eager: opts.eager })}
      ${imgs[1] ? Media(imgs[1], p, { cls: "alt", decorative: true }) : ""}
    </a>
    <div class="quick" aria-label="Quick add ${esc(p.name)}"><span class="label">Quick add · select size</span><div class="quick-sizes">${sizeBtns}</div></div>
    <button class="card-plus" data-act="quickview" data-slug="${p.slug}" aria-label="Quick view ${esc(p.name)}">${ICON.plus}</button>
    </div>
    <div class="card-info"><a class="card-name" href="#product-${p.slug}">${esc(p.name)}</a><span class="price">${inr(p.price)}</span></div>
    <div class="card-meta"><span style="display:flex;gap:10px;align-items:center">${Swatches(p, origin)}<span class="card-colour" aria-live="polite">${esc(p.colour)}</span></span>
      <button class="card-quickview" data-act="quickview" data-slug="${p.slug}">Quick view</button></div>
  </article>`;
}

const ProductGrid = (list, opts) => `<div class="grid">${list.map((p, i) => ProductCard(p, { eager: opts && opts.eager && i < 4 })).join("")}</div>`;

function Newsletter() {
  return `
  <section class="newsletter" aria-labelledby="nlTitle">
    <div class="wrap nl-grid">
      <div><span class="label">Newsletter</span><h2 id="nlTitle" style="margin-top:12px">New colours and collections, first.</h2></div>
      <form class="nl-form" id="nlForm" novalidate>
        <label class="sr-only" for="nlEmail">Email address</label>
        <div class="nl-row"><input id="nlEmail" type="email" name="email" placeholder="Your email address" autocomplete="email"><button type="submit">Subscribe</button></div>
        <p class="nl-msg" id="nlMsg" role="status" aria-live="polite"></p>
        <p class="nl-fine">Collection updates from Amaya Sutra. In this prototype, no email address is stored or sent.</p>
      </form>
    </div>
  </section>`;
}

/* ---------- views ---------- */
function Home() {
  const featured = PRODUCTS.filter(p => p.rank <= 8).sort((a, b) => a.rank - b.rank);
  return `
  ${Hero()}

  <section class="section" id="collections" aria-labelledby="collTitle">
    <div class="wrap">
      <div class="section-head"><div><span class="label">Shop by collection</span><h2 id="collTitle">Two collections, one wardrobe.</h2></div></div>
      <div class="collections">
        <a class="coll coll--linen" href="#shop-linen">
          <div class="coll-media">${Media(SITE_IMAGES.collectionLinen)}</div>
          <div class="coll-body"><h3>Linen Shirts</h3><p>Relaxed shirts in earthy and deep tones, for warm days and unhurried weekends.</p><span class="link-arrow">Shop Linen →</span></div>
        </a>
        <a class="coll coll--formal" href="#shop-formal">
          <div class="coll-media">${Media(SITE_IMAGES.collectionFormal)}</div>
          <div class="coll-body"><h3>Formal Shirts</h3><p>Crisp collars in pale, versatile shades for the office and occasions.</p><span class="link-arrow">Shop Formal →</span></div>
        </a>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0" aria-labelledby="featTitle">
    <div class="wrap">
      <div class="section-head"><div><span class="label">The shirt edit</span><h2 id="featTitle">Featured shirts</h2></div><a class="link-arrow" href="#shop">View all ${PRODUCTS.length} shirts →</a></div>
      ${ProductGrid(featured)}
    </div>
  </section>

  <section class="section" style="padding-top:0" aria-labelledby="edTitle">
    <div class="wrap editorial">
      <div class="editorial-media">${Media(SITE_IMAGES.editorial)}</div>
      <div class="editorial-copy">
        <span class="label">Everyday refinement</span>
        <h2 id="edTitle">Made for the way you show up.</h2>
        <p>One good shirt can take you from a morning meeting to dinner with friends. Amaya Sutra keeps the lines clean and the colours considered, so getting dressed is the easy part of the day.</p>
        <ul class="editorial-points">
          <li><strong>Workday</strong><span>Pale formal shades with tailored trousers or a blazer.</span></li>
          <li><strong>After hours</strong><span>Sleeves turned once, top button open.</span></li>
          <li><strong>Weekend</strong><span>Deeper linen tones with denim or chinos.</span></li>
        </ul>
        <div><a class="btn btn-line" href="#shop">Shop Shirts</a></div>
      </div>
    </div>
  </section>

  <section class="section occasions" aria-labelledby="occTitle">
    <div class="wrap occ-grid">
      <div>
        <span class="label">Style &amp; occasion</span>
        <h2 id="occTitle" style="font-size:var(--t-xl);margin:14px 0 36px;color:#F5F1EA">One wardrobe, three settings.</h2>
        <ul class="occ-list" id="occList">
          ${[
            ["work", "At Work", "Soft pink, sky blue and classic white with tailored trousers. Tuck in, add a belt and you are set for the day.", "shop-formal", "Model in a soft pink formal shirt"],
            ["smart", "Smart Casual", "Midnight navy or earth brown, sleeves turned once, with chinos or dark denim.", "shop-linen", "Model in a midnight navy shirt"],
            ["everyday", "Everyday Essentials", "Easy colours that go with what you already own, for errands, travel and everything in between.", "shop", "Model in a coral shirt, smiling"]
          ].map((o, i) => `
          <li class="occ-row${i === 0 ? " on" : ""}" data-occ="${o[0]}">
            <button data-act="occ" data-occ="${o[0]}" data-href="#${o[3]}" aria-expanded="${i === 0}">
              <h3>${o[1]}</h3>
              ${Media(SITE_IMAGES.occasions[o[0]], null, { cls: "occ-thumb", decorative: true, small: true })}
              <span class="occ-desc">${o[2]}</span>
              <span class="occ-go">Shop the look →</span>
            </button>
          </li>`).join("")}
        </ul>
      </div>
      <figure class="occ-media" id="occMedia">
        ${["work", "smart", "everyday"].map((k, i) => Media(SITE_IMAGES.occasions[k], null, { cls: "occ-img" + (i === 0 ? " on" : "") }).replace(/^<(img|div)/, `<$1 data-occ="${k}"`)).join("")}
        <figcaption id="occCap">At Work</figcaption>
      </figure>
    </div>
  </section>

  <section class="section" aria-labelledby="storyTitle">
    <div class="wrap story">
      <div class="story-copy">
        <span class="label">About Amaya Sutra</span>
        <h2 id="storyTitle">A shirt label with a clear focus.</h2>
        <p>Amaya Sutra makes two kinds of shirt: linen and formal. The aim is simple. Good colours, clean collars and shirts that fit into a real week.</p>
        <p class="story-attr">Manufactured by ARB Creations</p>
        <div><a class="link-arrow" href="#about">Our Story →</a></div>
      </div>
      <div class="story-media">${Media(SITE_IMAGES.story)}</div>
    </div>
  </section>
  ${Newsletter()}`;
}


/* ---------- campaign slideshow (content lives in banners.js) ---------- */
const SCROLL_TARGETS = ["collections"];
function BannerLink(c, cls) {
  if (!c || !c.label) return "";
  const id = (c.href || "").replace("#", "");
  return SCROLL_TARGETS.includes(id)
    ? `<a class="btn ${cls}" href="#home" data-act="scroll" data-target="${id}">${esc(c.label)}</a>`
    : `<a class="btn ${cls}" href="${esc(c.href || "#shop")}">${esc(c.label)}</a>`;
}
function Hero() {
  const list = (typeof BANNERS !== "undefined" ? BANNERS : []).filter(Boolean);
  if (!list.length) return "";
  const n = list.length;
  const slides = list.map((b, i) => {
    const pic = b.image
      ? `<picture>${b.imageMobile ? `<source media="(max-width: 700px)" srcset="${esc(b.imageMobile)}">` : ""}<img src="${esc(b.image)}" alt="${esc(b.alt || "")}" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} style="--pos:${esc(b.position || "center")};--pos-m:${esc(b.positionMobile || b.position || "center")}"></picture>`
      : `<div class="ph ph-banner" role="img" aria-label="${esc(b.alt || "Campaign image")} (image to come)"><span>Campaign image to come · ${esc(b.eyebrow || b.id)}</span></div>`;
    const copy = b.showText === false ? "" : `
        <div class="slide-copy">
          ${b.eyebrow ? `<span class="label">${esc(b.eyebrow)}</span>` : ""}
          <h${i === 0 ? 1 : 2} class="slide-title">${esc(b.headline || "")}${b.headlineAccent ? ` <span class="accent">${esc(b.headlineAccent)}</span>` : ""}</h${i === 0 ? 1 : 2}>
          ${b.text ? `<p>${esc(b.text)}</p>` : ""}
          <div class="hero-cta">${BannerLink(b.cta, "btn-solid")}${BannerLink(b.cta2, "btn-line")}</div>
        </div>`;
    return `
      <div class="slide tone-${b.tone === "light" ? "light" : "dark"} align-${b.align === "right" ? "right" : "left"}${b.showText === false ? " no-copy" : ""}${i === 0 ? " is-active" : ""}"
        role="group" aria-roledescription="slide" aria-label="${i + 1} of ${n}: ${esc(b.eyebrow || b.headline || "")}" data-i="${i}" ${i === 0 ? "" : 'aria-hidden="true"'}>
        <div class="slide-media">${pic}</div>${copy}
      </div>`;
  }).join("");
  const ctrls = n > 1 ? `
      <div class="carousel-bar">
        <div class="carousel-dots" role="group" aria-label="Choose slide">
          ${list.map((b, i) => `<button class="c-dot" data-act="slide-go" data-i="${i}" aria-label="Slide ${i + 1}: ${esc(b.eyebrow || b.headline || "")}" aria-current="${i === 0}"><span class="c-dot-label">${esc(b.eyebrow || "Slide " + (i + 1))}</span><i></i></button>`).join("")}
        </div>
        <div class="carousel-btns">
          <button class="icon-btn" data-act="slide-toggle" id="slidePlay" aria-label="Pause slideshow">${ICON.pause}</button>
          <button class="icon-btn" data-act="slide-step" data-d="-1" aria-label="Previous slide">${ICON.left}</button>
          <button class="icon-btn" data-act="slide-step" data-d="1" aria-label="Next slide">${ICON.right}</button>
        </div>
      </div>` : "";
  return `
  <section class="hero carousel" id="hero" aria-roledescription="carousel" aria-label="Amaya Sutra campaigns">
    <div class="wrap">
      <div class="slides" id="slides" tabindex="0" aria-live="off">${slides}</div>
      ${ctrls}
    </div>
  </section>`;
}

const Carousel = {
  i: 0, timer: null, paused: false, hover: false, el: null,
  reduced: () => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  init() {
    this.el = $("#hero"); clearInterval(this.timer); this.i = 0;
    if (!this.el) return;
    const n = $$(".slide", this.el).length;
    if (n < 2) return;
    // Respect reduced motion: no autoplay, visitor moves slides manually.
    this.paused = !BANNER_SETTINGS.autoplay || this.reduced();
    this.syncPlay();
    this.el.addEventListener("mouseenter", () => { this.hover = true; this.dotProgress(); });
    this.el.addEventListener("mouseleave", () => { this.hover = false; this.restart(); });
    this.el.addEventListener("focusin", () => { this.hover = true; this.dotProgress(); });
    this.el.addEventListener("focusout", e => { if (!this.el.contains(e.relatedTarget)) { this.hover = false; this.restart(); } });
    $("#slides").addEventListener("keydown", e => {
      if (e.key === "ArrowRight") { e.preventDefault(); this.go(this.i + 1, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); this.go(this.i - 1, true); }
    });
    // swipe
    let x0 = null, y0 = 0;
    const vp = $("#slides");
    vp.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    vp.addEventListener("touchend", e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) this.go(this.i + (dx < 0 ? 1 : -1), true);
    }, { passive: true });
    this.go(0, false);
  },
  go(k, user) {
    const slides = $$(".slide", this.el); const n = slides.length;
    this.i = ((k % n) + n) % n;
    slides.forEach((s, j) => { const on = j === this.i; s.classList.toggle("is-active", on); if (on) s.removeAttribute("aria-hidden"); else s.setAttribute("aria-hidden", "true");
      $$("a, button", s).forEach(f => f.tabIndex = on ? 0 : -1); });
    $$(".c-dot", this.el).forEach((d, j) => d.setAttribute("aria-current", j === this.i));
    $("#slides").setAttribute("aria-live", user ? "polite" : "off");
    this.restart();
  },
  running() { return !this.paused && !this.hover && !document.hidden; },
  restart() {
    clearInterval(this.timer);
    this.dotProgress();
    if (this.running()) this.timer = setInterval(() => this.go(this.i + 1, false), BANNER_SETTINGS.interval || 6000);
  },
  dotProgress() {
    if (!this.el) return;
    this.el.style.setProperty("--interval", (BANNER_SETTINGS.interval || 6000) + "ms");
    this.el.classList.toggle("is-running", this.running());
    // restart the progress line animation on the active dot
    $$(".c-dot i", this.el).forEach(x => { x.style.animation = "none"; void x.offsetWidth; x.style.animation = ""; });
  },
  toggle() { this.paused = !this.paused; this.syncPlay(); this.restart(); },
  syncPlay() {
    const b = $("#slidePlay"); if (!b) return;
    b.innerHTML = this.paused ? ICON.play : ICON.pause;
    b.setAttribute("aria-label", this.paused ? "Play slideshow" : "Pause slideshow");
  }
};
document.addEventListener("visibilitychange", () => Carousel.el && document.contains(Carousel.el) && Carousel.restart());

/* --- collection page --- */
function CollectionBanner(cat) {
  const c = CATEGORIES[cat];
  const sub = [["all", "#shop", "All"], ["linen", "#shop-linen", "Linen"], ["formal", "#shop-formal", "Formal"], ["new", "#shop-new", "New"]]
    .map(s => `<a href="${s[1]}" class="${s[0] === cat ? "on" : ""}">${s[2]}</a>`).join("");
  return `
  <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><a href="#shop">Shop</a>${cat !== "all" ? `<span>/</span><span>${c.name}</span>` : ""}</nav>
  <div class="coll-banner">
    <div><span class="label">Collection</span><h1>${c.name}</h1><p>${c.intro}</p><div class="coll-subnav">${sub}</div></div>
    <div class="coll-banner-media">${Media(SITE_IMAGES.categories[cat], null, { eager: true })}</div>
  </div>`;
}

function baseList() {
  const c = state.shopCat;
  return PRODUCTS.filter(p => c === "all" ? true : c === "new" ? p.isNew : p.cat === c);
}

function FilterPanel(pre) {
  const base = baseList();
  const f = state.filters;
  const cnt = fn => base.filter(fn).length;
  const ck = (arr, v) => arr.includes(v) ? "checked" : "";
  const coloursHere = Object.keys(COLOURS).filter(c => base.some(p => p.colour === c));
  const catGroup = state.shopCat === "all" || state.shopCat === "new" ? `
    <div class="fgroup"><fieldset><legend>Collection</legend><div class="fopts">
      ${[["linen", "Linen Shirts"], ["formal", "Formal Shirts"]].map(c => `<label class="fopt"><input type="checkbox" data-f="cats" value="${c[0]}" ${ck(f.cats, c[0])}><span>${c[1]}<em>${cnt(p => p.cat === c[0])}</em></span></label>`).join("")}
    </div></fieldset></div>` : "";
  return `
    ${catGroup}
    <div class="fgroup"><fieldset><legend>Size</legend><div class="fsizes">
      ${SIZES.map(s => `<label><input type="checkbox" data-f="sizes" value="${s.k}" ${ck(f.sizes, s.k)}><span>${s.k}</span></label>`).join("")}
    </div></fieldset></div>
    <div class="fgroup"><fieldset><legend>Colour</legend><div class="fcolours">
      ${coloursHere.map(c => `<label><input type="checkbox" data-f="colours" value="${esc(c)}" ${ck(f.colours, c)}><span><i class="sw" style="background:${COLOURS[c]}"></i>${esc(c)}</span></label>`).join("")}
    </div></fieldset></div>
    <div class="fgroup"><fieldset><legend>Price</legend><div class="fopts">
      ${PRICE_BANDS.map(b => `<label class="fopt"><input type="checkbox" data-f="prices" value="${b.k}" ${ck(f.prices, b.k)}><span>${b.label}<em>${cnt(b.test)}</em></span></label>`).join("")}
    </div></fieldset></div>
    <div class="fgroup"><fieldset><legend>Fit <span class="placeholder-tag" style="margin-left:6px">Illustrative</span></legend><div class="fopts">
      ${FITS.map(x => `<label class="fopt"><input type="checkbox" data-f="fits" value="${x}" ${ck(f.fits, x)}><span>${x}<em>${cnt(p => p.fit === x)}</em></span></label>`).join("")}
    </div></fieldset></div>`;
}

function applyFilters() {
  const f = state.filters;
  let list = baseList().filter(p =>
    (!f.cats.length || f.cats.includes(p.cat)) &&
    (!f.sizes.length || f.sizes.some(s => p.sizes.includes(s))) &&
    (!f.colours.length || f.colours.includes(p.colour)) &&
    (!f.prices.length || PRICE_BANDS.filter(b => f.prices.includes(b.k)).some(b => b.test(p))) &&
    (!f.fits.length || f.fits.includes(p.fit)) &&
    (!f.q || matches(p, f.q)));
  const s = state.sort;
  list = list.slice().sort((a, b) =>
    s === "price-asc" ? a.price - b.price :
    s === "price-desc" ? b.price - a.price :
    s === "name" ? a.name.localeCompare(b.name) :
    s === "new" ? (b.isNew - a.isNew) || a.rank - b.rank :
    a.rank - b.rank);
  return list;
}

function matches(p, q) {
  const hay = (p.name + " " + p.colour + " " + p.cat + " " + CATEGORIES[p.cat].name + " " + p.fit).toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.includes(w));
}

function chipsHtml() {
  const f = state.filters, out = [];
  if (f.q) out.push(["q", f.q, `Search: “${esc(f.q)}”`]);
  f.cats.forEach(v => out.push(["cats", v, CATEGORIES[v].name]));
  f.sizes.forEach(v => out.push(["sizes", v, "Size " + v]));
  f.colours.forEach(v => out.push(["colours", v, v]));
  f.prices.forEach(v => out.push(["prices", v, PRICE_BANDS.find(b => b.k === v).label]));
  f.fits.forEach(v => out.push(["fits", v, v + " fit"]));
  if (!out.length) return "";
  return out.map(c => `<button class="chip" data-act="chip" data-f="${c[0]}" data-v="${esc(c[1])}" aria-label="Remove filter ${esc(c[2])}">${c[2]} ${ICON.x}</button>`).join("") +
    `<button class="chip-clear" data-act="clear-filters">Clear all</button>`;
}

function Shop(cat) {
  state.shopCat = cat;
  return `
  <div class="wrap">
    ${CollectionBanner(cat)}
    <div class="plp">
      <aside class="filters" aria-label="Filters" id="filtersDesk">${FilterPanel("d")}</aside>
      <div>
        <div class="plp-bar">
          <button class="filter-btn" data-act="filters" aria-controls="filterDrawer">${ICON.filter} Filter &amp; sort</button>
          <span class="plp-count" id="plpCount" aria-live="polite"></span>
          <label class="sort"><span class="label" style="letter-spacing:.12em">Sort</span>
            <select id="sortSel">
              ${[["featured", "Featured"], ["new", "Newest"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["name", "Name: A–Z"]]
                .map(o => `<option value="${o[0]}" ${state.sort === o[0] ? "selected" : ""}>${o[1]}</option>`).join("")}
            </select></label>
        </div>
        <span class="plp-count mob" id="plpCountMob"></span>
        <div class="chips" id="chips"></div>
        <div id="results"></div>
      </div>
    </div>
  </div>`;
}

function renderResults() {
  const list = applyFilters();
  const n = list.length, total = baseList().length;
  const label = n === total ? `${n} ${n === 1 ? "shirt" : "shirts"}` : `${n} of ${total} shirts`;
  if ($("#plpCount")) $("#plpCount").textContent = label;
  if ($("#plpCountMob")) $("#plpCountMob").textContent = label;
  $("#chips").innerHTML = chipsHtml();
  $("#results").innerHTML = n ? ProductGrid(list, { eager: true }) : `
    <div class="empty"><h3>No shirts match these filters.</h3><p>Try removing a size or colour, or clear all filters to see the full collection.</p>
    <button class="btn btn-line" data-act="clear-filters">Clear all filters</button></div>`;
  const showBtn = $("#filterShow"); if (showBtn) showBtn.textContent = `Show ${n} ${n === 1 ? "result" : "results"}`;
  syncPanels();
}
function syncPanels() {
  $$("input[data-f]").forEach(i => { i.checked = state.filters[i.dataset.f].includes(i.value); });
  const ms = $("#sortSelMob"); if (ms) ms.value = state.sort;
  const ds = $("#sortSel"); if (ds) ds.value = state.sort;
}

/* --- product page --- */
let pdp = { size: null, qty: 1, img: 0 };
let pdpCarry = null; // size/qty/scroll carried across a colour switch on the product page
function Gallery(p) {
  const imgs = imagesOf(p);
  const slides = imgs.length ? imgs : [null];
  return `
  <div class="gallery" data-slug="${p.slug}">
    <div class="thumbs" role="tablist" aria-label="${esc(p.colour)} images">
      ${slides.map((im, i) => `<button role="tab" data-act="gal" data-i="${i}" aria-current="${i === 0}" aria-label="${im ? esc(im.view) : "Photo to come"} view">${Media(im, p, { decorative: true, small: true })}</button>`).join("")}
    </div>
    <div>
      <div class="stage">
        <div class="stage-track" id="track" tabindex="0" aria-label="${esc(p.name)} image gallery, scroll for more views">
          ${slides.map((im, i) => `<figure>${Media(im, p, { eager: i === 0 })}<figcaption>${im ? esc(im.view) : ""}</figcaption></figure>`).join("")}
        </div>
        ${slides.length > 1 ? `<button class="stage-nav prev" data-act="gal-step" data-d="-1" aria-label="Previous image">${ICON.left}</button>
        <button class="stage-nav next" data-act="gal-step" data-d="1" aria-label="Next image">${ICON.right}</button>` : ""}
      </div>
      <div class="dots" id="dots">${slides.length > 1 ? slides.map((_, i) => `<span class="${i === 0 ? "on" : ""}"></span>`).join("") : ""}</div>
    </div>
  </div>`;
}

function SizeButtons(p, selected, act) {
  return SIZES.map(s => {
    const ok = p.sizes.includes(s.k);
    return `<button data-act="${act}" data-size="${s.k}" aria-pressed="${selected === s.k}" ${ok ? "" : 'disabled aria-label="' + s.k + ' unavailable in ' + esc(p.colour) + '"'}><b>${s.k}</b><small>${s.label}</small></button>`;
  }).join("");
}
function ColourOptions(p, act) {
  return variantsOf(p).map(q => `<button class="colour-opt" data-act="${act}" data-slug="${q.slug}" aria-pressed="${q === p}" aria-label="${esc(q.colour)}${q === p ? " (selected)" : ""}" title="${esc(q.colour)}">${Media(imagesOf(q)[0], q, { decorative: true, small: true })}<span class="colour-opt-dot" style="background:${COLOURS[q.colour]}"></span></button>`).join("");
}

function Product(slug) {
  const p = bySlug(slug);
  if (!p) return NotFound();
  // Carry the size over from the previous colour if this colour stocks it; otherwise say so.
  let sizeNote = "";
  pdp = { size: null, qty: 1, img: 0 };
  if (pdpCarry) {
    pdp.qty = pdpCarry.qty;
    if (pdpCarry.size && p.sizes.includes(pdpCarry.size)) pdp.size = pdpCarry.size;
    else if (pdpCarry.size) sizeNote = `Size ${pdpCarry.size} isn't available in ${p.colour}. Please choose another size.`;
  }
  const related = PRODUCTS.filter(q => q.cat === p.cat && q !== p).slice(0, 4);
  const sibs = variantsOf(p);
  return `
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><a href="#shop-${p.cat}">${CATEGORIES[p.cat].name}</a><span>/</span><span>${esc(p.name)}</span></nav>
    <div class="pdp">
      ${Gallery(p)}
      <div class="buy">
        <div class="buy-head">
          <span class="label">${CATEGORIES[p.cat].name}${p.isNew ? " · New" : ""}</span>
          <h1>${esc(p.name)}</h1>
          <div class="buy-price"><span class="price">${inr(p.price)}</span><small>Illustrative price</small></div>
        </div>
        <div>
          <div class="buy-row-label"><span>Colour: <strong id="pdpColour">${esc(p.colour)}</strong></span>${sibs.length > 1 ? `<span class="fine">${sibs.length} colours</span>` : ""}</div>
          <div class="colour-opts" role="group" aria-label="Choose colour">${ColourOptions(p, "pdp-colour")}</div>
        </div>
        <div>
          <div class="buy-row-label"><span>Size: <strong id="sizeLabel">${pdp.size ? pdp.size + " · " + SIZES.find(x => x.k === pdp.size).label : "Select a size"}</strong></span><button class="link-u fine" data-act="size-guide" style="color:var(--ink)">Size guide</button></div>
          <div class="size-opts" id="sizeOpts">${SizeButtons(p, pdp.size, "pdp-size")}</div>
          <p class="size-err" id="sizeErr" role="alert" ${sizeNote ? "" : "hidden"}>${sizeNote || "Please select a size to add this shirt to your bag."}</p>
        </div>
        <div class="buy-actions">
          <div class="qty" aria-label="Quantity"><button data-act="pdp-qty" data-d="-1" aria-label="Decrease quantity">${ICON.minus}</button><output id="pdpQty">${pdp.qty}</output><button data-act="pdp-qty" data-d="1" aria-label="Increase quantity">${ICON.plus}</button></div>
          <button class="btn btn-solid" data-act="pdp-add" data-slug="${p.slug}">Add to Bag · <span class="price">${inr(p.price)}</span></button>
          <button class="btn btn-line btn-buy" data-act="pdp-buy" data-slug="${p.slug}">Buy Now</button>
        </div>
        <form class="pin" id="pinForm" novalidate>
          <label for="pinIn" class="label" style="color:var(--ink)">Check delivery <span class="placeholder-tag" style="margin-left:6px">Demo</span></label>
          <div class="pin-row"><input id="pinIn" inputmode="numeric" maxlength="6" placeholder="6-digit PIN code" autocomplete="postal-code"><button type="submit">Check</button></div>
          <p class="pin-msg" id="pinMsg" aria-live="polite">Enter a PIN code to preview how delivery information will appear.</p>
        </form>
        <div class="acc">
          <details open><summary>Description</summary><div class="acc-body"><p>${esc(p.desc)}</p></div></details>
          <details><summary>Fabric &amp; care</summary><div class="acc-body">
            <p class="note"><span class="placeholder-tag">Placeholder</span> Fabric composition and care instructions to be confirmed by ARB Creations.</p>
            <dl><dt>Fabric</dt><dd>[Composition to be confirmed]</dd><dt>Weave</dt><dd>[To be confirmed]</dd><dt>Care</dt><dd>[Wash and iron instructions to be confirmed]</dd></dl></div></details>
          <details><summary>Fit</summary><div class="acc-body">
            <p class="note"><span class="placeholder-tag">Illustrative</span> Fit details are examples for this prototype.</p>
            <dl><dt>Fit</dt><dd>${p.fit}</dd><dt>Collar</dt><dd>[To be confirmed]</dd><dt>Model</dt><dd>[Height and size worn to be confirmed]</dd></dl>
            <p><button class="link-u" data-act="size-guide" style="color:var(--ink)">View the size guide</button></p></div></details>
          <details><summary>Shipping &amp; returns</summary><div class="acc-body">
            <p class="note"><span class="placeholder-tag">Placeholder</span> Policies have not been confirmed yet.</p>
            <p>Delivery timelines, shipping charges and the returns window will appear here once Amaya Sutra confirms them.</p>
            <p><a class="link-u" href="#info-shipping">Shipping policy</a> · <a class="link-u" href="#info-returns">Returns &amp; exchanges</a></p></div></details>
        </div>
      </div>
    </div>
    <section class="section" style="padding-top:24px" aria-labelledby="relTitle">
      <div class="section-head"><div><span class="label">You may also like</span><h2 id="relTitle" style="font-size:var(--t-xl)">More ${CATEGORIES[p.cat].name.toLowerCase()}</h2></div><a class="link-arrow" href="#shop-${p.cat}">View all →</a></div>
      ${ProductGrid(related)}
    </section>
  </div>`;
}

/* --- other pages --- */
function Checkout() {
  const buying = !!state.buyNow;
  const items = buying ? [state.buyNow] : state.cart;
  const subtotal = items.reduce((n, i) => n + i.qty * bySlug(i.slug).price, 0);
  if (!items.length) return `<div class="wrap page"><div class="empty"><span class="label">Checkout preview</span><h3>Your bag is empty.</h3><p>Add a shirt to preview the checkout flow.</p><a class="btn btn-solid" href="#shop">Shop Shirts</a></div></div>`;
  return `
  <div class="wrap page">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><span>Checkout preview</span></nav>
    <div class="page-hero" style="padding-bottom:32px"><div><span class="label">Demonstration only</span><h1>Checkout preview</h1></div>
      <div class="callout"><strong>Prototype</strong>This screen shows how checkout could be laid out. No payment is taken, no order is created and the fields below are disabled. The live store would use the Shopify or Wix checkout.</div></div>
    <div class="checkout" id="coWrap">
      <div>
        ${buying ? `<p class="buynow-note"><span class="placeholder-tag">Buy Now</span> Checking out this shirt only. Your bag is unchanged.</p>` : ""}
        <ol class="steps"><li class="done">${buying ? "Item" : "Bag"}</li><li class="on" aria-current="step">Details</li><li>Payment</li></ol>
        <div class="co-fields" aria-disabled="true">
          <label class="full">Email<input disabled placeholder="name@example.com"></label>
          <label>First name<input disabled placeholder="First name"></label>
          <label>Last name<input disabled placeholder="Last name"></label>
          <label class="full">Address<input disabled placeholder="House, street, area"></label>
          <label>City<input disabled placeholder="City"></label>
          <label>PIN code<input disabled placeholder="000000"></label>
        </div>
        <p class="fine" style="margin:14px 0 24px">Fields are disabled in this prototype so no personal information is collected.</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><button class="btn btn-solid" data-act="finish-preview">Finish preview</button><a class="btn btn-line" href="#shop">Continue shopping</a></div>
      </div>
      <aside class="summary" aria-label="Order summary">
        <h2 class="label" style="color:var(--ink)">${buying ? "Order summary" : "Bag summary"}</h2>
        ${items.map(i => { const p = bySlug(i.slug); return `<div class="line-item">${Media(imagesOf(p)[0], p, { decorative: true, small: true })}<div><div class="li-top"><span>${esc(p.name)}</span><span class="price">${inr(p.price * i.qty)}</span></div><div class="li-meta">${esc(p.colour)} · Size ${i.size} · Qty ${i.qty}</div></div></div>`; }).join("")}
        <div class="sub-row"><span>Subtotal</span><span>${inr(subtotal)}</span></div>
        <p class="fine">Shipping and taxes would be calculated by the store's checkout.</p>
      </aside>
    </div>
  </div>`;
}

function About() {
  const A = ABOUT;
  return `
  <div class="wrap page about">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><span>Our Story</span></nav>
    <header class="page-hero">
      <div><span class="label">${esc(A.eyebrow)}</span><h1>${esc(A.title)} <span class="accent">${esc(A.titleAccent)}</span></h1></div>
      <p class="about-intro">${esc(A.intro)}</p>
    </header>
    <div class="about-media">${Media(SITE_IMAGES.about, null, { eager: true })}</div>

    <section class="about-story" aria-label="Our story">
      <blockquote class="about-quote"><p>“${esc(A.quote)}”</p></blockquote>
      <div class="prose">${A.story.map(p => `<p>${esc(p)}</p>`).join("")}</div>
    </section>

    <section class="about-principles" aria-labelledby="prinTitle">
      <h2 id="prinTitle" class="about-h2">${esc(A.principlesTitle)}</h2>
      <ul class="principles">${A.principles.map(x => `<li><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></li>`).join("")}</ul>
    </section>

    <section class="about-process" aria-labelledby="procTitle">
      <div class="about-process-media">${Media(SITE_IMAGES.editorial)}</div>
      <div>
        <h2 id="procTitle" class="about-h2">${esc(A.processTitle)}</h2>
        <ol class="process">${A.process.map((x, i) => `<li><span class="process-n">${String(i + 1).padStart(2, "0")}</span><div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div></li>`).join("")}</ol>
      </div>
    </section>

    <section class="about-maker" aria-labelledby="makerTitle">
      <span class="story-attr">Manufacturer</span>
      <h2 id="makerTitle" class="about-h2">${esc(A.makerTitle)}</h2>
      <p>${esc(A.makerText)}</p>
    </section>

    <section class="about-close">
      <div><h2 class="about-h2">${esc(A.closingTitle)}</h2><p>${esc(A.closingText)}</p></div>
      <div class="hero-cta"><a class="btn btn-solid" href="#shop-linen">Shop Linen</a><a class="btn btn-line" href="#shop-formal">Shop Formal</a></div>
    </section>
    <p class="fine about-note">Sample brand story for this design concept. To be replaced with Amaya Sutra's own words.</p>
  </div>`;
}

function Info(key) {
  const d = INFO[key];
  if (!d) return NotFound();
  return `
  <div class="wrap page">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><span>${d.title}</span></nav>
    <div class="page-hero"><div><span class="label">Customer care</span><h1>${d.title}</h1></div></div>
    <div class="prose">
      <div class="callout"><strong>Placeholder</strong>${d.lead}</div>
      <h2>This page will cover</h2>
      <ul style="margin:0;padding-left:1.2em;display:grid;gap:8px">${d.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
      <p style="margin-top:12px"><a class="link-arrow" href="#shop">Back to shop →</a></p>
    </div>
  </div>`;
}

function Account() {
  return `
  <div class="wrap page">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="#home">Home</a><span>/</span><span>Account</span></nav>
    <div class="page-hero"><div><span class="label">Account</span><h1>Sign in</h1></div>
      <p style="color:var(--ink-2);max-width:44ch">Customer accounts, order history and saved addresses are handled by the store platform (Shopify or Wix) and are not part of this design prototype.</p></div>
    <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-solid" href="#shop">Continue shopping</a><button class="btn btn-line" data-act="cart">View bag</button></div>
  </div>`;
}

function NotFound() {
  return `<div class="wrap page"><div class="empty"><h3>This page could not be found.</h3><p>It may have moved, or the link may be incomplete.</p><a class="btn btn-solid" href="#home">Back to home</a></div></div>`;
}

/* ---------- overlays ---------- */
function renderCartDrawer() {
  const body = $("#cartBody"), foot = $("#cartFoot");
  const n = Cart.count();
  $("#cartTitle").textContent = n ? `Your bag (${n})` : "Your bag";
  if (!state.cart.length) {
    const sugg = PRODUCTS.filter(p => p.rank <= 2);
    body.innerHTML = `<div class="cart-empty"><h3>Your bag is empty.</h3><p>Start with a shirt from the collection.</p>
      <button class="btn btn-solid" data-act="continue" data-href="#shop">Shop Shirts</button>
      <div class="cart-suggest">${sugg.map(p => `<a href="#product-${p.slug}" data-act="continue" data-href="#product-${p.slug}">${Media(imagesOf(p)[0], p, { decorative: true, small: true })}<span>${esc(p.name)}</span><span class="price">${inr(p.price)}</span></a>`).join("")}</div></div>`;
    foot.hidden = true;
    return;
  }
  foot.hidden = false;
  body.innerHTML = state.cart.map((i, idx) => {
    const p = bySlug(i.slug);
    return `<div class="line-item">
      <a href="#product-${p.slug}" data-act="continue" data-href="#product-${p.slug}">${Media(imagesOf(p)[0], p, { small: true })}</a>
      <div><div class="li-top"><a href="#product-${p.slug}" data-act="continue" data-href="#product-${p.slug}">${esc(p.name)}</a><span class="price">${inr(p.price * i.qty)}</span></div>
      <div class="li-meta">${esc(p.colour)} · Size ${i.size} (${SIZES.find(s => s.k === i.size).label})</div>
      <div class="li-actions"><div class="qty sm" aria-label="Quantity for ${esc(p.name)}"><button data-act="cart-qty" data-i="${idx}" data-d="-1" aria-label="Decrease quantity">${ICON.minus}</button><output>${i.qty}</output><button data-act="cart-qty" data-i="${idx}" data-d="1" aria-label="Increase quantity">${ICON.plus}</button></div>
      <button class="li-remove" data-act="cart-remove" data-i="${idx}">Remove</button></div></div></div>`;
  }).join("");
  $("#cartSub").textContent = inr(Cart.subtotal());
}

function Overlays() {
  return `
  <div class="scrim" id="scrim" data-act="close"></div>
  <aside class="drawer" id="cartDrawer" role="dialog" aria-modal="true" aria-labelledby="cartTitle">
    <div class="drawer-head"><h2 id="cartTitle">Your bag</h2><button class="icon-btn" data-act="close" aria-label="Close bag">${ICON.close}</button></div>
    <div class="drawer-body" id="cartBody"></div>
    <div class="drawer-foot" id="cartFoot">
      <div class="sub-row"><span>Subtotal</span><span id="cartSub">₹0</span></div>
      <p class="fine">Prices are illustrative. Shipping and taxes would be calculated at checkout.</p>
      <button class="btn btn-solid btn-block" data-act="continue" data-href="#checkout">Checkout preview</button>
      <button class="btn btn-line btn-block" data-act="close">Continue shopping</button>
    </div>
  </aside>
  <aside class="drawer left" id="navDrawer" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drawer-head"><a class="logo" href="#home" data-act="continue" data-href="#home" aria-label="Amaya Sutra home" style="width:84px">${LOGO}</a><button class="icon-btn" data-act="close" aria-label="Close menu">${ICON.close}</button></div>
    <div class="drawer-body">
      <nav class="mobile-nav" aria-label="Mobile">
        ${[["#shop", "Shop all"], ["#shop-linen", "Linen Shirts"], ["#shop-formal", "Formal Shirts"], ["#shop-new", "New Arrivals"], ["#about", "About"]]
          .map(l => `<a href="${l[0]}" data-act="continue" data-href="${l[0]}">${l[1]}<span aria-hidden="true">→</span></a>`).join("")}
      </nav>
      <div class="mobile-nav-sub">
        <button data-act="search" style="display:flex;gap:10px;align-items:center;text-align:left">${ICON.search.replace("<svg", '<svg width="18" height="18"')} Search</button>
        <a href="#account" data-act="continue" data-href="#account" style="display:flex;gap:10px;align-items:center">${ICON.user.replace("<svg", '<svg width="18" height="18"')} Account</a>
        <button data-act="size-guide" style="text-align:left">Size guide</button>
      </div>
      <a class="mobile-nav-feature" href="#shop-linen" data-act="continue" data-href="#shop-linen">${Media(SITE_IMAGES.mobileNavFeature)}<span>The Linen edit →</span></a>
    </div>
  </aside>
  <aside class="drawer left" id="filterDrawer" role="dialog" aria-modal="true" aria-labelledby="filterTitle">
    <div class="drawer-head"><h2 id="filterTitle">Filter &amp; sort</h2><button class="icon-btn" data-act="close" aria-label="Close filters">${ICON.close}</button></div>
    <div class="drawer-body" id="filterDrawerBody"></div>
    <div class="drawer-foot"><button class="btn btn-solid btn-block" data-act="close" id="filterShow">Show results</button><button class="btn btn-line btn-block" data-act="clear-filters">Clear all</button></div>
  </aside>
  <div class="search-panel" id="searchPanel" role="dialog" aria-modal="true" aria-label="Search">
    <div class="wrap">
      <div class="search-top"><span aria-hidden="true" style="width:22px;display:block">${ICON.search}</span>
        <label class="sr-only" for="searchIn">Search shirts</label>
        <input id="searchIn" type="search" placeholder="Search shirts, colours, collections" autocomplete="off">
        <button class="icon-btn" data-act="close" aria-label="Close search">${ICON.close}</button></div>
      <div class="search-body">
        <div class="suggest"><span class="label" style="margin-right:6px">Try</span>${["Linen", "Formal", "White", "Navy", "Slim", "New"].map(s => `<button data-act="suggest" data-q="${s}">${s}</button>`).join("")}</div>
        <div id="searchMeta" class="fine" aria-live="polite"></div>
        <div class="search-results" id="searchResults"></div>
      </div>
    </div>
  </div>
  <div class="modal" id="modal" role="dialog" aria-modal="true" aria-label="Dialog"><div class="modal-box" id="modalBox"></div></div>
  <div class="toast" id="toast" role="status" aria-live="polite"></div>`;
}

let lastFocus = null;
function openLayer(id) {
  closeLayers(true);
  lastFocus = document.activeElement;
  const el = $("#" + id); el.classList.add("open");
  if (id !== "modal") $("#scrim").classList.add("open");
  document.body.classList.add("locked");
  setTimeout(() => { const f = id === "searchPanel" ? $("#searchIn") : el.querySelector("button, a, input"); if (f) f.focus({ preventScroll: true }); }, 60);
}
function closeLayers(silent) {
  $$(".drawer.open, .search-panel.open, .modal.open").forEach(e => e.classList.remove("open"));
  $("#scrim").classList.remove("open");
  document.body.classList.remove("locked");
  if (!silent && lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
}

function openModal(html, label) {
  $("#modalBox").innerHTML = `<button class="icon-btn modal-close" data-act="close" aria-label="Close">${ICON.close}</button>` + html;
  $("#modal").setAttribute("aria-label", label);
  openLayer("modal");
  $("#scrim").classList.add("open");
}

let qv = { slug: null, size: null };
function QuickView(slug, carrySize) {
  const p = bySlug(slug);
  const keep = carrySize && p.sizes.includes(carrySize) ? carrySize : null;
  qv = { slug, size: keep };
  const note = carrySize && !keep ? `Size ${carrySize} isn't available in ${p.colour}. Please choose another size.` : "";
  return `<div class="qv">
    <div class="qv-media">${Media(imagesOf(p)[0], p, { eager: true })}</div>
    <div class="qv-body">
      <div style="display:grid;gap:8px"><span class="label">${CATEGORIES[p.cat].name}${p.isNew ? " · New" : ""}</span><h2>${esc(p.name)}</h2><div class="buy-price"><span class="price">${inr(p.price)}</span><small>Illustrative price</small></div></div>
      <div><div class="buy-row-label"><span>Colour: <strong id="qvColour">${esc(p.colour)}</strong></span></div><div class="colour-opts" role="group" aria-label="Choose colour">${ColourOptions(p, "qv-colour")}</div></div>
      <div><div class="buy-row-label"><span>Size: <strong id="qvSizeLabel">${keep ? keep + " · " + SIZES.find(x => x.k === keep).label : "Select a size"}</strong></span><button class="link-u fine" data-act="size-guide" style="color:var(--ink)">Size guide</button></div>
        <div class="size-opts" id="qvSizes">${SizeButtons(p, keep, "qv-size")}</div><p class="size-err" id="qvErr" role="alert" ${note ? "" : "hidden"}>${note || "Please select a size."}</p></div>
      <div class="qv-actions"><button class="btn btn-solid btn-block" data-act="qv-add" data-slug="${p.slug}">Add ${esc(p.colour)} to Bag</button><button class="btn btn-line btn-block" data-act="qv-buy" data-slug="${p.slug}">Buy Now</button></div>
      <a class="link-arrow" href="#product-${p.slug}" data-act="continue" data-href="#product-${p.slug}" style="justify-self:start">View full details →</a>
    </div></div>`;
}

function SizeGuide() {
  return `<div class="size-guide">
    <span class="label">Size guide</span><h2>Finding your size</h2>
    <p class="note"><span class="placeholder-tag">Illustrative</span> Measurements are examples for this prototype and must be confirmed against ARB Creations' production specifications.</p>
    <div class="table-wrap"><table><thead><tr><th>Size</th><th>Label</th><th>Chest (in)</th><th>Collar (in)</th><th>Length (in)</th></tr></thead>
    <tbody>${SIZE_CHART.map(r => `<tr>${r.map((c, i) => i === 0 ? `<td><strong>${c}</strong></td>` : `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    <p class="fine">How to measure: chest around the fullest part, under the arms. Collar around the base of the neck, with one finger of ease.</p>
  </div>`;
}

let toastT;
function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2600);
}

function renderSearch() {
  const q = $("#searchIn").value.trim();
  const list = q ? PRODUCTS.filter(p => matches(p, q)) : PRODUCTS.filter(p => p.isNew);
  $("#searchMeta").innerHTML = q
    ? (list.length ? `${list.length} ${list.length === 1 ? "result" : "results"} for “${esc(q)}” · <button class="link-u" data-act="search-all" style="color:var(--ink)">See all in shop</button>` : `No shirts match “${esc(q)}”. Try a colour such as white or navy.`)
    : "New arrivals";
  $("#searchResults").innerHTML = list.slice(0, 5).map(p => `<a class="mini" href="#product-${p.slug}" data-act="continue" data-href="#product-${p.slug}">${Media(imagesOf(p)[0], p, { decorative: true, small: true })}<strong>${esc(p.name)}</strong><span class="price">${esc(p.colour)} · ${inr(p.price)}</span></a>`).join("");
}

/* ---------- router ---------- */
let currentView = "home";
function route() {
  const h = (location.hash || "#home").slice(1) || "home";
  let html = h === "home" ? Home() : "", view = h;
  if (h.startsWith("shop") && h !== lastShop) { if (!keepFilters) state.filters = emptyFilters(); }
  keepFilters = false; lastShop = h.startsWith("shop") ? h : null;
  if (h === "home") {}
  else if (h === "shop") { html = Shop("all"); view = "shop"; }
  else if (h.startsWith("shop-") && CATEGORIES[h.slice(5)]) html = Shop(h.slice(5));
  else if (h.startsWith("product-")) html = Product(h.slice(8));
  else if (h === "checkout") html = Checkout();
  else if (h === "about") html = About();
  else if (h === "account") html = Account();
  else if (h.startsWith("info-")) html = Info(h.slice(5));
  else if (h === "collections") { location.hash = "#home"; return; }
  else html = NotFound();
  if (view !== "checkout") state.buyNow = null;
  const prevView = currentView;
  currentView = view;
  $("#app").innerHTML = html;
  $$(".nav a[data-nav]").forEach(a => a.classList.toggle("active", a.dataset.nav === h));
  if (h.startsWith("shop")) {
    $("#filterDrawerBody").innerHTML = `<div class="fgroup"><h3>Sort</h3><select id="sortSelMob" class="sort" style="width:100%;padding:10px;border:1px solid var(--line-strong);background:var(--paper);border-radius:2px">
      ${[["featured", "Featured"], ["new", "Newest"], ["price-asc", "Price: low to high"], ["price-desc", "Price: high to low"], ["name", "Name: A–Z"]].map(o => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select></div>` + FilterPanel("m");
    renderResults();
  }
  const titles = { home: "Amaya Sutra · Linen & Formal Shirts", checkout: "Checkout preview · Amaya Sutra", about: "Our Story · Amaya Sutra", account: "Account · Amaya Sutra" };
  const p = h.startsWith("product-") && bySlug(h.slice(8));
  document.title = p ? p.name + " · Amaya Sutra" : h.startsWith("shop") ? CATEGORIES[state.shopCat].name + " · Amaya Sutra" : (titles[h] || "Amaya Sutra");
  if (pdpCarry && view.startsWith("product-")) {
    window.scrollTo({ top: pdpCarry.scrollY, behavior: "instant" });
    const b = $('.colour-opt[aria-pressed="true"]'); if (b) b.focus({ preventScroll: true });
  } else if (!(prevView === "checkout" && view === "checkout")) window.scrollTo({ top: 0, behavior: "instant" });
  pdpCarry = null;
  if (pendingScroll) { const t = document.getElementById(pendingScroll); pendingScroll = null; if (t) setTimeout(() => t.scrollIntoView({ behavior: "smooth" }), 30); }
  hideMega();
  if (view.startsWith("product-")) bindGallery();
  if (view === "home") Carousel.init(); else clearInterval(Carousel.timer);
}
let pendingScroll = null, keepFilters = false, lastShop = null;

function bindGallery() {
  const track = $("#track"); if (!track) return;
  track.addEventListener("scroll", () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== pdp.img) setImg(i, false);
  }, { passive: true });
}
function setImg(i, scroll = true) {
  const track = $("#track"); const n = track.children.length;
  i = (i + n) % n; pdp.img = i;
  if (scroll) track.scrollTo({ left: i * track.clientWidth, behavior: "smooth" });
  $$(".thumbs button").forEach((b, k) => b.setAttribute("aria-current", k === i));
  $$("#dots span").forEach((d, k) => d.classList.toggle("on", k === i));
}

/* ---------- mega menu ---------- */
let megaT;
function showMega() { clearTimeout(megaT); $("#mega").classList.add("open"); $("#shopLink").setAttribute("aria-expanded", "true"); }
function hideMega() { clearTimeout(megaT); const m = $("#mega"); if (m) m.classList.remove("open"); const l = $("#shopLink"); if (l) l.setAttribute("aria-expanded", "false"); }

/* ---------- events ---------- */
function go(href) { closeLayers(true); if (location.hash === href) route(); else location.hash = href; }

document.addEventListener("click", e => {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  const a = t.dataset.act;
  switch (a) {
    case "menu": openLayer("navDrawer"); break;
    case "cart": openLayer("cartDrawer"); break;
    case "search": openLayer("searchPanel"); renderSearch(); break;
    case "filters": openLayer("filterDrawer"); break;
    case "close": closeLayers(); break;
    case "continue": e.preventDefault(); if (t.dataset.href === "#checkout") state.buyNow = null; go(t.dataset.href); break;
    case "scroll": e.preventDefault(); { const el = document.getElementById(t.dataset.target); if (el) el.scrollIntoView({ behavior: "smooth" }); } break;
    case "quick-add": {
      e.preventDefault(); const p = bySlug(t.dataset.slug);
      Cart.add(p.slug, t.dataset.size); openLayer("cartDrawer"); break;
    }
    case "quickview": e.preventDefault(); openModal(QuickView(t.dataset.slug), "Quick view"); break;
    case "qv-colour": if (t.dataset.slug !== qv.slug) { openModal(QuickView(t.dataset.slug, qv.size), "Quick view"); const b = $('#modal .colour-opt[aria-pressed="true"]'); if (b) b.focus(); } break;
    case "card-colour": {
      // Swap this card to the chosen sibling variant in place: image, name, price, colour, links and quick add all follow.
      e.preventDefault();
      const card = t.closest(".card"), q = bySlug(t.dataset.slug);
      if (!card || !q || card.dataset.slug === q.slug) break;
      const wrap = document.createElement("div");
      wrap.innerHTML = ProductCard(q, { origin: card.dataset.origin, eager: true }).trim();
      const fresh = wrap.firstElementChild;
      card.replaceWith(fresh);
      const btn = fresh.querySelector('.sw-btn[aria-pressed="true"]'); if (btn) btn.focus({ preventScroll: true });
      break;
    }
    case "qv-size":
      qv.size = t.dataset.size;
      $$("#qvSizes button").forEach(b => b.setAttribute("aria-pressed", b === t));
      $("#qvSizeLabel").textContent = t.dataset.size + " · " + SIZES.find(s => s.k === qv.size).label; $("#qvErr").hidden = true; break;
    case "qv-add":
      if (!qv.size) { $("#qvErr").hidden = false; return; }
      Cart.add(qv.slug, qv.size); closeLayers(true); openLayer("cartDrawer"); break;
    case "size-guide": openModal(SizeGuide(), "Size guide"); break;
    case "pdp-colour": {
      if (location.hash === "#product-" + t.dataset.slug) break;
      pdpCarry = { size: pdp.size, qty: pdp.qty, scrollY: window.scrollY, focusSlug: t.dataset.slug };
      location.replace("#product-" + t.dataset.slug); // hashchange re-renders the page for the selected variant
      break;
    }
    case "pdp-size":
      pdp.size = t.dataset.size;
      $$("#sizeOpts button").forEach(b => b.setAttribute("aria-pressed", b === t));
      $("#sizeLabel").textContent = pdp.size + " · " + SIZES.find(s => s.k === pdp.size).label; $("#sizeErr").hidden = true; break;
    case "pdp-qty": pdp.qty = Math.max(1, Math.min(10, pdp.qty + Number(t.dataset.d))); $("#pdpQty").textContent = pdp.qty; break;
    case "pdp-add":
      if (!pdp.size) { $("#sizeErr").hidden = false; $("#sizeOpts").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      { const slug = $(".gallery") ? $(".gallery").dataset.slug : t.dataset.slug; // the variant currently shown
        Cart.add(slug, pdp.size, pdp.qty); openLayer("cartDrawer"); }
      break;
    case "pdp-buy": {
      // Buy Now: same size check as Add to Bag, then straight to checkout with this shirt only.
      if (!pdp.size) { $("#sizeErr").hidden = false; $("#sizeOpts").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      const slug = $(".gallery") ? $(".gallery").dataset.slug : t.dataset.slug;
      state.buyNow = { slug, size: pdp.size, qty: pdp.qty };
      go("#checkout"); break;
    }
    case "qv-buy":
      if (!qv.size) { $("#qvErr").hidden = false; return; }
      state.buyNow = { slug: qv.slug, size: qv.size, qty: 1 };
      go("#checkout"); break;
    case "gal": setImg(Number(t.dataset.i)); break;
    case "slide-go": Carousel.go(Number(t.dataset.i), true); break;
    case "slide-step": Carousel.go(Carousel.i + Number(t.dataset.d), true); break;
    case "slide-toggle": Carousel.toggle(); break;
    case "gal-step": setImg(pdp.img + Number(t.dataset.d)); break;
    case "cart-qty": { const i = Number(t.dataset.i); Cart.setQty(i, state.cart[i].qty + Number(t.dataset.d)); break; }
    case "cart-remove": { const p = bySlug(state.cart[Number(t.dataset.i)].slug); Cart.remove(Number(t.dataset.i)); toast(p.name + " removed from your bag"); break; }
    case "chip": {
      const f = t.dataset.f, v = t.dataset.v;
      if (f === "q") state.filters.q = ""; else state.filters[f] = state.filters[f].filter(x => x !== v);
      renderResults(); break;
    }
    case "clear-filters": state.filters = emptyFilters(); renderResults(); break;
    case "shop-colour": state.filters = emptyFilters(); state.filters.colours = [t.dataset.colour]; keepFilters = true; go("#shop"); break;
    case "suggest": $("#searchIn").value = t.dataset.q; renderSearch(); $("#searchIn").focus(); break;
    case "search-all": state.filters = emptyFilters(); state.filters.q = $("#searchIn").value.trim(); keepFilters = true; go("#shop"); break;
    case "occ": {
      const k = t.dataset.occ, row = t.closest(".occ-row");
      if (row.classList.contains("on")) { go(t.dataset.href); break; }
      $$(".occ-row").forEach(r => { const on = r === row; r.classList.toggle("on", on); r.querySelector("button").setAttribute("aria-expanded", on); });
      $$("#occMedia [data-occ]").forEach(i => i.classList.toggle("on", i.dataset.occ === k));
      $("#occCap").textContent = row.querySelector("h3").textContent; break;
    }
    case "finish-preview":
      $("#coWrap").innerHTML = `<div class="done-box" style="grid-column:1/-1"><span class="label">Preview complete</span><h2>That is the end of the checkout preview.</h2>
        <p style="color:var(--ink-2);max-width:60ch">No order has been placed and nothing has been charged. In the live store, this step would hand over to the Shopify or Wix checkout for payment and confirmation. ${state.buyNow ? "Your bag was not changed." : "Your bag has been kept so you can continue the demo."}</p>
        <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-solid" href="#shop">Continue shopping</a><a class="btn btn-line" href="#home">Back to home</a></div></div>`;
      window.scrollTo({ top: 0, behavior: "smooth" }); break;
    case "social": e.preventDefault(); toast(t.dataset.net + " link is a placeholder until the handle is confirmed"); break;
  }
});

document.addEventListener("change", e => {
  const i = e.target;
  if (i.matches("input[data-f]")) {
    const arr = state.filters[i.dataset.f];
    state.filters[i.dataset.f] = i.checked ? Array.from(new Set(arr.concat(i.value))) : arr.filter(x => x !== i.value);
    renderResults();
  }
  if (i.id === "sortSel" || i.id === "sortSelMob") { state.sort = i.value; renderResults(); }
});

document.addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.id === "nlForm") {
    const v = $("#nlEmail").value.trim(), m = $("#nlMsg");
    if (!v) { m.className = "nl-msg err"; m.textContent = "Enter your email address to subscribe."; $("#nlEmail").setAttribute("aria-invalid", "true"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { m.className = "nl-msg err"; m.textContent = "That email address doesn't look right. Check it and try again."; $("#nlEmail").setAttribute("aria-invalid", "true"); return; }
    $("#nlEmail").removeAttribute("aria-invalid");
    m.className = "nl-msg ok"; m.textContent = "Thank you. You're on the list for collection updates (prototype: nothing was sent).";
    e.target.reset();
  }
  if (e.target.id === "pinForm") {
    const v = $("#pinIn").value.trim(), m = $("#pinMsg");
    if (!/^[1-9][0-9]{5}$/.test(v)) { m.className = "pin-msg err"; m.textContent = "Enter a valid 6-digit PIN code."; return; }
    m.className = "pin-msg"; m.innerHTML = `PIN ${v}: delivery estimates will appear here in the live store. <span class="placeholder-tag">Demo</span>`;
  }
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if ($("#mega.open")) hideMega(); closeLayers(); }
  if (e.key === "Enter" && e.target.id === "searchIn" && e.target.value.trim()) {
    state.filters = emptyFilters(); state.filters.q = e.target.value.trim(); keepFilters = true; go("#shop");
  }
});
document.addEventListener("input", e => {
  if (e.target.id === "searchIn") renderSearch();
  if (e.target.id === "pinIn") e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6);
});

/* ---------- boot ---------- */
function boot() {
  $("#top").innerHTML = Header();
  $("#bottom").innerHTML = Footer();
  $("#layers").innerHTML = Overlays();
  const item = $("#shopItem");
  item.addEventListener("mouseenter", showMega);
  item.addEventListener("mouseleave", () => { megaT = setTimeout(hideMega, 120); });
  item.addEventListener("focusin", showMega);
  item.addEventListener("focusout", e => { if (!item.contains(e.relatedTarget)) hideMega(); });
  $("#shopLink").addEventListener("click", hideMega);
  const header = $("#header");
  window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 8), { passive: true });
  window.addEventListener("hashchange", () => {
    // in-page anchor "#collections" style links are handled via data-act="scroll"
    route();
  });
  Cart.save();
  route();
}
boot();
})();
