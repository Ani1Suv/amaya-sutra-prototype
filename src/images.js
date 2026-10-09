/* =====================================================================
   PHOTOGRAPHY MAP — every photo on the site is listed here.
   ---------------------------------------------------------------------
   Product photos: one list per colour variant (keyed by product slug).
   First photo = card image and main gallery image; second = card hover.
   Recommended: 1600 x 2000 px JPG (4:5), same light and backdrop per grid.
   Suggested file names:  assets/products/<slug>/front.jpg, three-quarter.jpg,
                          side.jpg, detail-collar.jpg, lifestyle.jpg
   Current photos: free Unsplash images (Unsplash Licence), chosen as stand-ins
   to show the layout. They are NOT Amaya Sutra products. See README for sources.
   A product with an empty list shows a labelled "photo to come" tile in its
   own colour. It never borrows another colour's photo.
   Each entry: { src: "path", view: "Front", alt: "description", pos: "center 30%" (optional) }
   ===================================================================== */
const PRODUCT_IMAGES = {
  "classic-white": [
    { src: "assets/products/classic-white/front.jpg", view: "Front", alt: "The Classic White Shirt, front view" },
    { src: "assets/products/classic-white/close-up.jpg", view: "Close-up", alt: "The Classic White Shirt, close-up" },
    { src: "assets/products/classic-white/detail-collar.jpg", view: "Collar detail", alt: "The Classic White Shirt, collar detail" },
  ],
  "sky-blue": [
    { src: "assets/products/sky-blue/front.jpg", view: "Front", alt: "The Sky Blue Formal Shirt, front view" },
    { src: "assets/products/sky-blue/three-quarter.jpg", view: "Three-quarter", alt: "The Sky Blue Formal Shirt, three-quarter view" },
    { src: "assets/products/sky-blue/detail-cuff.jpg", view: "Cuff detail", alt: "The Sky Blue Formal Shirt, cuff and sleeve detail" },
  ],
  "soft-pink": [
    { src: "assets/products/soft-pink/front.jpg", view: "Front", alt: "The Soft Pink Shirt, front view" },
    { src: "assets/products/soft-pink/close-up.jpg", view: "Close-up", alt: "The Soft Pink Shirt, close-up" },
  ],
  "stone-grey": [
    { src: "assets/products/stone-grey/front.jpg", view: "Front", alt: "The Stone Grey Formal Shirt, front view" },
    { src: "assets/products/stone-grey/close-up.jpg", view: "Close-up", alt: "The Stone Grey Formal Shirt, close-up" },
  ],
  "sand-linen": [
    { src: "assets/products/sand-linen/three-quarter.jpg", view: "Three-quarter", alt: "The Sand Linen Shirt, three-quarter view" },
    { src: "assets/products/sand-linen/close-up.jpg", view: "Close-up", alt: "The Sand Linen Shirt, close-up" },
    { src: "assets/products/sand-linen/flat-lay.jpg", view: "Flat lay", alt: "The Sand Linen Shirt, folded flat lay" },
  ],
  "midnight-navy": [
    { src: "assets/products/midnight-navy/front.jpg", view: "Front", alt: "The Midnight Navy Shirt, front view" },
    { src: "assets/products/midnight-navy/flat.jpg", view: "Flat", alt: "The Midnight Navy Shirt, shirt on a hanger" },
    { src: "assets/products/midnight-navy/close-up.jpg", view: "Close-up", alt: "The Midnight Navy Shirt, close-up" },
  ],
  "earth-brown": [
    { src: "assets/products/earth-brown/front.jpg", view: "Front", alt: "The Earth Brown Shirt, front view" },
    { src: "assets/products/earth-brown/lifestyle-street.jpg", view: "Styled", alt: "The Earth Brown Shirt, styled on a city street" },
    { src: "assets/products/earth-brown/lifestyle-city.jpg", view: "Styled", alt: "The Earth Brown Shirt, styled outdoors" },
    { src: "assets/products/earth-brown/side.jpg", view: "Side", alt: "The Earth Brown Shirt, side view by the lake" },
  ],
  "olive-casual": [
    { src: "assets/products/olive-casual/front.jpg", view: "Front", alt: "The Olive Casual Shirt, front view" },
    { src: "assets/products/olive-casual/close-up.jpg", view: "Close-up", alt: "The Olive Casual Shirt, close-up" },
    { src: "assets/products/olive-casual/fabric.jpg", view: "Fabric", alt: "The Olive Casual Shirt, fabric close-up" },
  ],
  "everyday-essential": [
    { src: "assets/products/everyday-essential/three-quarter.jpg", view: "Three-quarter", alt: "The Everyday Essential, three-quarter view" },
    { src: "assets/products/everyday-essential/side.jpg", view: "Side", alt: "The Everyday Essential, side view by the lake" },
    { src: "assets/products/everyday-essential/detail-pocket.jpg", view: "Pocket detail", alt: "The Everyday Essential, pocket detail" },
  ],
};

/* Section photography. Use null for "photo to come". */
const SITE_IMAGES = {
  collectionLinen:  { src: "assets/site/collection-linen.jpg", alt: "Man in a light linen shirt on a beach" },
  collectionFormal: { src: "assets/site/collection-formal.jpg", alt: "Man in a light blue formal shirt" },
  editorial:        { src: "assets/site/editorial-linen.jpg", alt: "Man in a linen shirt leaning on a hay bale" },
  occasions: {
    work:     { src: "assets/site/occasion-work.jpg", alt: "Man in a light blue shirt at an event", pos: "center 25%" },
    smart:    { src: "assets/site/occasion-smart.jpg", alt: "Man in a white linen shirt and sunglasses" },
    everyday: { src: "assets/site/occasion-everyday.jpg", alt: "Man in a white shirt by a window" }
  },
  story:            { src: "assets/site/story.jpg", alt: "Man in a cream shirt walking through a field" },
  about:            { src: "assets/site/about.jpg", alt: "Man in a white shirt against a yellow wall", pos: "center 40%" },
  megaFeature:      { src: "assets/site/menu-feature.jpg", alt: "Men in linen shirts walking along a coast" },
  mobileNavFeature: { src: "assets/site/mobile-menu.jpg", alt: "Men in linen shirts walking along a coast" },
  categories: {
    all:    { src: "assets/site/category-all.jpg", alt: "Man in an earth brown shirt by a lake", pos: "center 40%" },
    linen:  { src: "assets/site/category-linen.jpg", alt: "Men in linen shirts walking along a coast" },
    formal: { src: "assets/site/category-formal.jpg", alt: "Man in a sky blue formal shirt", pos: "center 30%" },
    new:    { src: "assets/site/category-new.jpg", alt: "Man in a casual shirt with a shoulder bag" }
  }
};
