/* =====================================================================
   HOMEPAGE CAMPAIGN BANNERS — edit this file to change the slideshow.
   ---------------------------------------------------------------------
   To replace a banner image:
     1. Export from Photoshop as JPG (quality ~80):
          desktop  2400 x 1050 px  (16:7, keep people in the middle 60%)
          mobile   1080 x 1350 px  (4:5)
     2. Save into  assets/banners/  and put the file names below.
        Leave imageMobile as "" to reuse the desktop image on phones.
   To change words: edit headline / text / cta below. Keep headlines short.
   To add a slide: copy one { ... } block, paste it, edit it.
   To remove a slide: delete its { ... } block. Order here = order on site.
   Banner already has text baked into the artwork? Set  showText: false
   (the site's own headline and buttons are then hidden for that slide).
   ===================================================================== */
const BANNER_SETTINGS = {
  autoplay: true,      // false = only move when the visitor clicks
  interval: 6000       // milliseconds each slide stays on screen
};

const BANNERS = [
  {
    id: "linen",
    image: "assets/banners/linen-desktop.jpg",
    imageMobile: "assets/banners/linen-mobile.jpg",
    alt: "Group of men in white and cream linen shirts walking along a rocky coast",
    position: "center 55%",            // which part of the photo stays in view on desktop
    positionMobile: "center 25%",      // same, for phones
    tone: "dark",                      // "dark" text for light photos, "light" text for dark photos
    align: "left",                     // text on the "left" or "right" of the photo (desktop)
    showText: true,
    eyebrow: "The Linen Collection",
    headline: "Linen & Formal,",
    headlineAccent: "done right.",     // shown in the camel accent colour; leave "" for none
    text: "Relaxed linen shirts in sand, navy, earth and olive for warm days and slow weekends.",
    cta: { label: "Shop Linen", href: "#shop-linen" },
    cta2: { label: "Explore the Collection", href: "#collections" }
  },
  {
    id: "formal",
    image: "assets/banners/formal-desktop.jpg",
    imageMobile: "assets/banners/formal-mobile.jpg",
    alt: "Man in a light shirt and blazer on a balcony above a city skyline",
    position: "center 40%",
    positionMobile: "center 30%",
    tone: "dark",
    align: "right",
    showText: true,
    eyebrow: "Modern Formalwear",
    headline: "Sharp from the",
    headlineAccent: "first meeting.",
    text: "Clean collars in white, sky blue, soft pink and stone grey for the working week.",
    cta: { label: "Shop Formal", href: "#shop-formal" },
    cta2: { label: "View all shirts", href: "#shop" }
  },
  {
    id: "everyday",
    image: "assets/banners/everyday-desktop.jpg",
    imageMobile: "assets/banners/everyday-mobile.jpg",
    alt: "Man in a casual shirt with a shoulder bag in front of an old wall",
    position: "center 35%",
    positionMobile: "center 30%",
    tone: "dark",
    align: "left",
    showText: true,
    eyebrow: "Everyday Essentials",
    headline: "Easy shirts for",
    headlineAccent: "every day.",
    text: "Colours that work with what you already own, from errands to dinner plans.",
    cta: { label: "Shop Shirts", href: "#shop" },
    cta2: { label: "New Arrivals", href: "#shop-new" }
  }
];
