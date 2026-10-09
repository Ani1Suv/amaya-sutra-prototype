/* ---------- Sample catalogue (illustrative: names, prices, fits and stock are placeholders) ---------- */
const IMG = "assets/";
const SIZES = [
  { k: "S", label: "38" }, { k: "M", label: "40" }, { k: "L", label: "42" }, { k: "XL", label: "44" }, { k: "XXL", label: "46" }
];
const SIZE_CHART = [
  ["S", "38", "40", "14.5", "28.5"],
  ["M", "40", "42", "15", "29"],
  ["L", "42", "44", "15.5", "29.5"],
  ["XL", "44", "46", "16", "30"],
  ["XXL", "46", "48", "16.5", "30.5"]
];
const COLOURS = {
  "White":       "#F4F2EC",
  "Sky Blue":    "#CFE0F1",
  "Soft Pink":   "#F0D8DB",
  "Stone Grey":  "#B5B8BE",
  "Coral":       "#F4A48E",
  "Sand":        "#E8E1D2",
  "Navy":        "#1C2333",
  "Earth Brown": "#5E2C28",
  "Olive":       "#5A6136"
};
const CATEGORIES = {
  linen:  { name: "Linen Shirts",  intro: "Relaxed shirts in earthy and deep tones, for warm days and unhurried weekends." },
  formal: { name: "Formal Shirts", intro: "Crisp collars in pale, versatile shades for the office, meetings and occasions." },
  new:    { name: "New Arrivals",  intro: "The latest colours to join the Amaya Sutra collection." },
  all:    { name: "All Shirts",    intro: "The full Amaya Sutra collection of linen and formal shirts." }
};
const PRODUCTS = [
  { slug: "classic-white", name: "The Classic White Shirt", cat: "formal", family: "formal", colour: "White", price: 1799, fit: "Slim", sizes: ["S","M","L","XL","XXL"], isNew: false, rank: 1,
    desc: "A clean white shirt with a structured collar. The one to reach for first on a weekday, and the easiest to wear under a blazer." },
  { slug: "sky-blue", name: "The Sky Blue Formal Shirt", cat: "formal", family: "formal", colour: "Sky Blue", price: 1799, fit: "Slim", sizes: ["S","M","L","XL"], isNew: false, rank: 6,
    desc: "A pale sky blue that sits well with navy, grey and charcoal trousers. A straightforward choice for the working week." },
  { slug: "sand-linen", name: "The Sand Linen Shirt", cat: "linen", family: "linen", colour: "Sand", price: 2299, fit: "Relaxed", sizes: ["M","L","XL","XXL"], isNew: false, rank: 4,
    desc: "A sand-toned shirt from the Linen edit with a soft collar. Wear it open over a tee or buttoned with chinos." },
  { slug: "midnight-navy", name: "The Midnight Navy Shirt", cat: "linen", family: "linen", colour: "Navy", price: 2299, fit: "Regular", sizes: ["S","M","L","XL","XXL"], isNew: false, rank: 2,
    desc: "A deep navy shirt from the Linen edit. Dark enough for evenings, relaxed enough for the weekend." },
  { slug: "soft-pink", name: "The Soft Pink Shirt", cat: "formal", family: "formal", colour: "Soft Pink", price: 1799, fit: "Regular", sizes: ["S","M","L","XL","XXL"], isNew: false, rank: 3,
    desc: "A quiet pink formal shirt that adds warmth to grey and navy tailoring without drawing too much attention." },
  { slug: "earth-brown", name: "The Earth Brown Shirt", cat: "linen", family: "linen", colour: "Earth Brown", price: 2399, fit: "Regular", sizes: ["M","L","XL"], isNew: true, rank: 5,
    desc: "A rich brown shirt from the Linen edit. Pairs well with cream trousers, olive chinos and dark denim." },
  { slug: "olive-casual", name: "The Olive Casual Shirt", cat: "linen", family: "linen", colour: "Olive", price: 2199, fit: "Relaxed", sizes: ["S","M","L","XL","XXL"], isNew: true, rank: 8,
    desc: "An easy olive shirt for smart-casual days. Sleeves rolled, top button open." },
  { slug: "everyday-essential", name: "The Everyday Essential", cat: "formal", family: "everyday", colour: "Coral", price: 1499, fit: "Regular", sizes: ["S","M","L","XL","XXL"], isNew: false, rank: 7,
    desc: "A bright, friendly coral shirt that works tucked in for the office or untucked at the weekend." },
  { slug: "stone-grey", name: "The Stone Grey Formal Shirt", cat: "formal", family: "formal", colour: "Stone Grey", price: 1899, fit: "Slim", sizes: ["S","M","L","XL"], isNew: true, rank: 9,
    desc: "A cool grey formal shirt that pairs with almost any trouser colour. Understated and easy to style." }
];
/* Colour variants. Each colour is its own sibling product (own slug, sizes and photos).
   FAMILIES lists which slugs are colours of the same shirt, in swatch order. */
const FAMILIES = {
  formal:   ["classic-white", "sky-blue", "soft-pink", "stone-grey"],
  linen:    ["sand-linen", "midnight-navy", "earth-brown", "olive-casual"],
  everyday: ["everyday-essential"]
};
const variantsOf = p => (FAMILIES[p.family] || [p.slug]).map(s => PRODUCTS.find(q => q.slug === s)).filter(Boolean);
/* Product photography: see PRODUCT_IMAGES in images.js. A product with no photos shows a labelled
   "photo to come" tile in its own colour, never another colour's photo. */
const imagesOf = p => (typeof PRODUCT_IMAGES !== "undefined" && PRODUCT_IMAGES[p.slug]) || [];
const PRICE_BANDS = [
  { k: "lt1800", label: "Under ₹1,800", test: p => p.price < 1800 },
  { k: "1800-2200", label: "₹1,800 – ₹2,200", test: p => p.price >= 1800 && p.price <= 2200 },
  { k: "gt2200", label: "Over ₹2,200", test: p => p.price > 2200 }
];
const FITS = ["Slim", "Regular", "Relaxed"];
const INFO = {
  shipping: { title: "Shipping Policy", lead: "Delivery regions, timelines and charges will be published here once confirmed by Amaya Sutra.",
    items: ["Serviceable PIN codes and regions", "Dispatch and delivery timelines", "Shipping charges, if any", "Order tracking"] },
  returns: { title: "Returns & Exchanges", lead: "The returns and exchange policy is not yet confirmed. This page will explain eligibility, time windows and how to start a return.",
    items: ["Eligibility and condition of items", "Return or exchange window", "How to request a return", "Refund method and timing"] },
  privacy: { title: "Privacy Policy", lead: "The privacy policy will be provided by the client or their legal advisor before launch.",
    items: ["What information is collected", "How it is used and stored", "Cookies and analytics", "Contact for privacy requests"] },
  terms: { title: "Terms of Use", lead: "Terms of use will be provided by the client or their legal advisor before launch.",
    items: ["Use of the website", "Orders and pricing", "Intellectual property", "Governing law"] },
  contact: { title: "Contact", lead: "Contact details for Amaya Sutra and ARB Creations have not been supplied yet.",
    items: ["Customer care email: [to be confirmed]", "Phone / WhatsApp: [to be confirmed]", "Business address: [to be confirmed]", "Support hours: [to be confirmed]"] }
};
