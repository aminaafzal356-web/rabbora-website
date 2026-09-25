/* =========================================================
   RABBORA LIVING — BED FRAMES
   ---------------------------------------------------------
   Self-contained product data + detail-page logic for
   bed-frames.html. Loaded AFTER script.js (which
   handles the shared header, mobile nav, search, wishlist
   count, cart count — none of that is duplicated here).

   ===============================
   PRODUCT DATA
   ===============================
   These 30 entries are real Rabbora products (name, price,
   oldPrice, badge and image) pulled from the Slatted Ottoman
   Beds, Solid Base Ottomans, High Headboard Beds and TV Beds
   ranges, so this hub page showcases real, currently-listed
   beds rather than placeholders. "description"/"features" are
   still generic filler text — real per-product copy for these
   wasn't available/requested when this data was populated.
   ========================================================= */

var BF_PRODUCTS = [
  {
    slug: "bed-frame-1",
    name: "Rabbora Manhattan Slatted Ottoman Bed",
    price: 249.0,
    oldPrice: 429.0,
    badge: "42% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-1.jfif",
    images: ["slatted/img-1.jfif", "slatted/img-6.jfif", "slatted/img-5.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-2",
    name: "Rabbora Milan Slatted Wingback Ottoman Bed",
    price: 259.0,
    oldPrice: 420.0,
    badge: "38% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-7.jfif",
    images: ["slatted/img-7.jfif", "slatted/img-8.jfif", "slatted/img-9.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-3",
    name: "Rabbora Athens Slatted Designer Ottoman Bed",
    price: 289.0,
    oldPrice: 400.0,
    badge: "28% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-12.jfif",
    images: ["slatted/img-12.jfif", "slatted/img-15.jfif", "slatted/img-13.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-4",
    name: "Rabbora Empire Slatted Ottoman Bed",
    price: 289.0,
    oldPrice: 420.0,
    badge: "31% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-17.jfif",
    images: ["slatted/img-17.jfif", "slatted/img-19.jfif", "slatted/img-18.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-5",
    name: "Rabbora Art Deco Slatted Ottoman Bed",
    price: 252.0,
    oldPrice: 420.0,
    badge: "40% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-22.jfif",
    images: ["slatted/img-22.jfif", "slatted/img-24.jfif", "slatted/img-25.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-6",
    name: "Rabbora Orlando Slatted Ottoman Bed",
    price: 306.59,
    oldPrice: 420.0,
    badge: "27% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-30.png",
    images: ["slatted/img-30.png", "slatted/img-28.png", "slatted/img-29.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-7",
    name: "Rabbora Kendal Slatted Wingback Bed",
    price: 299.0,
    oldPrice: 444.0,
    badge: "33% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-35.png",
    images: ["slatted/img-35.png", "slatted/img-34.png", "slatted/img-33.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-8",
    name: "Rabbora Teddy Orlando Slatted Ottoman Bed",
    price: 306.59,
    oldPrice: 420.0,
    badge: "27% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/34.png",
    images: ["slatted/34.png", "slatted/35.png", "slatted/36.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-9",
    name: "Rabbora Park Lane Ambassador Slatted Bed",
    price: 449.0,
    oldPrice: 600.0,
    badge: "25% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/38.png",
    images: ["slatted/38.png", "slatted/39.png", "slatted/img-37.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-10",
    name: "Rabbora Solid Ottoman Bed",
    price: 249.0,
    oldPrice: 429.0,
    badge: "42% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/1.jfif",
    images: ["solid/1.jfif", "solid/2.jfif", "solid/3.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-11",
    name: "Rabbora Luxury Solid Ottoman Bed",
    price: 259.0,
    oldPrice: 420.0,
    badge: "38% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/4.jfif",
    images: ["solid/4.jfif", "solid/5.jfif", "solid/6.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-12",
    name: "Rabbora Premium Ottoman Bed",
    price: 289.0,
    oldPrice: 400.0,
    badge: "28% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/7.jfif",
    images: ["solid/7.jfif", "solid/8.jfif", "solid/9.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-13",
    name: "Rabbora Classic Ottoman Bed",
    price: 289.0,
    oldPrice: 420.0,
    badge: "31% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/10.jfif",
    images: ["solid/10.jfif", "solid/11.jfif", "solid/12.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-14",
    name: "Rabbora Elegant Ottoman Bed",
    price: 252.0,
    oldPrice: 420.0,
    badge: "40% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/13.jfif",
    images: ["solid/13.jfif", "solid/14.jfif", "solid/15.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-15",
    name: "Rabbora Comfort Ottoman Bed",
    price: 299.0,
    oldPrice: 444.0,
    badge: "33% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/16.jfif",
    images: ["solid/16.jfif", "solid/17.jfif", "solid/18.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-16",
    name: "Rabbora Signature Ottoman Bed",
    price: 299.0,
    oldPrice: 420.0,
    badge: "29% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/19.jfif",
    images: ["solid/19.jfif", "solid/20.jfif", "solid/21.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-17",
    name: "Rabbora Modern Ottoman Bed",
    price: 299.0,
    oldPrice: 420.0,
    badge: "29% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/22.jfif",
    images: ["solid/22.jfif", "solid/23.jfif", "solid/24.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-18",
    name: "Rabbora Prestige Ottoman Bed",
    price: 389.0,
    oldPrice: 499.0,
    badge: "22% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/25.jfif",
    images: ["solid/25.jfif", "solid/26.jfif", "solid/27.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-19",
    name: "Rabbora Duke High & Wide Headboard Bed",
    price: 799.0,
    oldPrice: 1000.0,
    badge: "20% off",
    rating: 5,
    reviewCount: 0,
    image: "high/1.jfif",
    images: ["high/1.jfif", "high/2.jfif", "high/3.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-20",
    name: "Rabbora Las Vegas High Headboard Bed",
    price: 749.0,
    oldPrice: 1000.0,
    badge: "25% off",
    rating: 5,
    reviewCount: 0,
    image: "high/5.jfif",
    images: ["high/5.jfif", "high/6.jfif", "high/7.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-21",
    name: "Rabbora Athena High Headboard Bed",
    price: 699.0,
    oldPrice: 900.0,
    badge: "22% off",
    rating: 5,
    reviewCount: 0,
    image: "high/9.jfif",
    images: ["high/9.jfif", "high/10.jfif", "high/11.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-22",
    name: "Rabbora Chicago High Headboard Bed",
    price: 349.0,
    oldPrice: 420.0,
    badge: "17% off",
    rating: 5,
    reviewCount: 0,
    image: "high/13.jfif",
    images: ["high/13.jfif", "high/14.jfif", "high/15.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-23",
    name: "Rabbora Model Square Hotel Bed",
    price: 649.0,
    oldPrice: 1000.0,
    badge: "35% off",
    rating: 5,
    reviewCount: 0,
    image: "high/17.jfif",
    images: ["high/17.jfif", "high/18.jfif", "high/19.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-24",
    name: "Rabbora Starlight Luxury Bed",
    price: 599.0,
    oldPrice: 900.0,
    badge: "33% off",
    rating: 5,
    reviewCount: 0,
    image: "high/20.jfif",
    images: ["high/20.jfif", "high/21.jfif", "high/22.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-25",
    name: "Rabbora DaVinci Tall Headboard Bed",
    price: 749.0,
    oldPrice: 900.0,
    badge: "17% off",
    rating: 5,
    reviewCount: 0,
    image: "high/24.jfif",
    images: ["high/24.jfif", "high/25.jfif", "high/26.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-26",
    name: "Rabbora Geneva High & Wide Headboard Bed",
    price: 749.0,
    oldPrice: 1000.0,
    badge: "25% off",
    rating: 5,
    reviewCount: 0,
    image: "high/28.jfif",
    images: ["high/28.jfif", "high/29.jfif", "high/30.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-27",
    name: "Rabbora Milano TV Bed",
    price: 999,
    oldPrice: 1399,
    badge: "29% Off",
    rating: 5,
    reviewCount: 0,
    image: "tv/img-1.jfif",
    images: ["tv/img-1.jfif", "tv/img-22.png", "tv/img-23.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-28",
    name: "Rabbora Monaco TV Bed",
    price: 990,
    oldPrice: 1399,
    badge: "29% Off",
    rating: 5,
    reviewCount: 0,
    image: "tv/img-2.jfif",
    images: ["tv/img-2.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-29",
    name: "Rabbora Windsor TV Bed",
    price: 1099,
    oldPrice: 1399,
    badge: "21% Off",
    rating: 5,
    reviewCount: 0,
    image: "tv/img-3.jfif",
    images: ["tv/img-3.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-30",
    name: "Rabbora Kensington TV Bed",
    price: 999,
    oldPrice: 1399,
    badge: "29% Off",
    rating: 5,
    reviewCount: 0,
    image: "tv/img-4.jfif",
    images: ["tv/img-4.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  }
];

var BF_FABRIC_COLLECTIONS = [
    {
      name: "Plush",
      fabrics: [
        { slug: "plush-grey", name: "Plush Grey", image: "fabric/plush-grey.jfif" },
        { slug: "plush-silver", name: "Plush Silver", image: "fabric/plush-silver.jfif" },
        { slug: "plush-steel", name: "Plush Steel", image: "fabric/plush-steel.jfif" },
        { slug: "plush-cream", name: "Plush Cream", image: "fabric/plush-cream.jfif" },
        { slug: "plush-beige", name: "Plush Beige", image: "fabric/plush-beige.jfif" },
        { slug: "plush-black", name: "Plush Black", image: "fabric/plush-black.jfif" },
        { slug: "plush-pink", name: "Plush Pink", image: "fabric/plush-pink.jfif" },
        { slug: "plush-mustard", name: "Plush Mustard", image: "fabric/plush-mustard.jfif" },
        { slug: "plush-green", name: "Plush Green", image: "fabric/plush-green.jfif" },
        { slug: "plush-turquoise", name: "Plush Turquoise", image: "fabric/plush-turquoise.jfif" },
        { slug: "plush-royal-blue", name: "Plush Royal Blue", image: "fabric/plush-royal-blue.jfif" },
        { slug: "plush-white", name: "Plush White", image: "fabric/plush-white.jfif" },
        { slug: "plush-baby-pink", name: "Plush Baby Pink", image: "fabric/plush-baby-pink.jfif" },
        { slug: "plush-ice-silver", name: "Plush Ice Silver", image: "fabric/plush-ice-sliver.jfif" },
        { slug: "plush-pebble", name: "Plush Pebble", image: "fabric/plush-pebble.jfif" },
        { slug: "plush-mocca", name: "Plush Mocca", image: "fabric/plush-mocca.jfif" },
        { slug: "plush-emerald-green", name: "Plush Emerald Green", image: "fabric/plush-emerald-green.jfif" },
        { slug: "plush-duck-egg", name: "Plush Duck Egg", image: "fabric/plush-duck-egg.jfif" },
        { slug: "plush-camel", name: "Plush Camel", image: "fabric/plush-camel.jfif" },
        { slug: "plush-teal", name: "Plush Teal", image: "fabric/plush-teal.jfif" },
        { slug: "plush-plum", name: "Plush Plum", image: "fabric/plush-plum.jfif" }
      ]
    },
    {
      name: "Coniston",
      fabrics: [
        { slug: "coniston-charcoal", name: "Coniston Charcoal", image: "fabric/coniston-charcoal.jfif" },
        { slug: "coniston-almond", name: "Coniston Almond", image: "fabric/coniston-almond.jfif" },
        { slug: "coniston-armour", name: "Coniston Armour", image: "fabric/coniston-armour.jfif" },
        { slug: "coniston-emerald", name: "Coniston Emerald", image: "fabric/coniston-emerald.jfif" },
        { slug: "coniston-pink", name: "Coniston Pink", image: "fabric/coniston-pink.jfif" },
        { slug: "coniston-blue", name: "Coniston Blue", image: "fabric/coniston-blue.jfif" }
      ]
    },
    {
      name: "Naples",
      fabrics: [
        { slug: "naples-silver", name: "Naples Silver", image: "fabric/naples-silver.jfif" },
        { slug: "naples-steel", name: "Naples Steel", image: "fabric/naples-steel.jfif" },
        { slug: "naples-black", name: "Naples Black", image: "fabric/naples-black.jfif" },
        { slug: "naples-ivory", name: "Naples Ivory", image: "fabric/naples-ivory.jfif" },
        { slug: "naples-pearl-blue", name: "Naples Pearl Blue", image: "fabric/naples-pearl-blue.jfif" },
        { slug: "naples-cream", name: "Naples Cream", image: "fabric/naples-cream.jfif" },
        { slug: "naples-sand", name: "Naples Sand", image: "fabric/naples-sand.jfif" },
        { slug: "naples-mink", name: "Naples Mink", image: "fabric/naples-mink.jfif" },
        { slug: "naples-seal-grey", name: "Naples Seal Grey", image: "fabric/naples-seal-grey.jfif" },
        { slug: "naples-slate-grey", name: "Naples Slate Grey", image: "fabric/naples-slate-grey.jfif" },
        { slug: "naples-charcoal", name: "Naples Charcoal", image: "fabric/naples-charcoal.jfif" },
        { slug: "naples-blue", name: "Naples Blue", image: "fabric/naples-blue.jfif" },
        { slug: "naples-plum", name: "Naples Plum", image: "fabric/naples-plum.jfif" }
      ]
    },
    {
      name: "Crushed Velvet",
      fabrics: [
        { slug: "crushed-velvet-silver", name: "Crushed Velvet Silver", image: "fabric/crushed-velvet-silver.jfif" },
        { slug: "crushed-velvet-black", name: "Crushed Velvet Black", image: "fabric/crushed-velvet-black.jfif" },
        { slug: "crushed-velvet-cream", name: "Crushed Velvet Cream", image: "fabric/crushed-velvet-cream.jfif" },
        { slug: "crushed-velvet-mink", name: "Crushed Velvet Mink", image: "fabric/crushed-velvet-mink.jfif" },
        { slug: "crushed-velvet-white", name: "Crushed Velvet White", image: "fabric/crushed-white.jfif" },
        { slug: "crushed-velvet-grey", name: "Crushed Velvet Grey", image: "fabric/crushed-grey.jfif" },
        { slug: "crushed-velvet-camel", name: "Crushed Velvet Camel", image: "fabric/crushed-camel.jfif" },
        { slug: "crushed-velvet-gold", name: "Crushed Velvet Gold", image: "fabric/crushed-gold.jfif" },
        { slug: "crushed-velvet-teal", name: "Crushed Velvet Teal", image: "fabric/crushed-teal.jfif" },
        { slug: "crushed-velvet-denim", name: "Crushed Velvet Denim", image: "fabric/crushed-denim.jfif" },
        { slug: "crushed-velvet-hot-pink", name: "Crushed Velvet Hot Pink", image: "fabric/crushed-hot-pink.jfif" },
        { slug: "crushed-velvet-purple", name: "Crushed Velvet Purple", image: "fabric/crushed-purple.jfif" },
        { slug: "crushed-velvet-plum", name: "Crushed Velvet Plum", image: "fabric/crushed-plum.jfif" },
        { slug: "crushed-velvet-baby-pink", name: "Crushed Velvet Baby Pink", image: "fabric/crushed-baby-pink.jfif" }
      ]
    },
    {
      name: "Chenille",
      fabrics: [
        { slug: "chenille-cream", name: "Chenille Cream", image: "fabric/chenille-cream.jfif" },
        { slug: "chenille-mink", name: "Chenille Mink", image: "fabric/chenille-mink.jfif" },
        { slug: "chenille-chocolate", name: "Chenille Chocolate", image: "fabric/chenille-chocolate.jfif" },
        { slug: "chenille-steel", name: "Chenille Steel", image: "fabric/chenille-steel.jfif" },
        { slug: "chenille-charcoal", name: "Chenille Charcoal", image: "fabric/chenille-charcoal.jfif" },
        { slug: "chenille-duck-egg", name: "Chenille Duck Egg", image: "fabric/chenille-duck-egg.jfif" },
        { slug: "chenille-teal", name: "Chenille Teal", image: "fabric/chenille-teal.jfif" },
        { slug: "chenille-purple", name: "Chenille Purple", image: "fabric/chenille-purple.jfif" },
        { slug: "chenille-plum", name: "Chenille Plum", image: "fabric/chenille-plum.jfif" },
        { slug: "chenille-red", name: "Chenille Red", image: "fabric/chenille-red.jfif" },
        { slug: "chenille-black", name: "Chenille Black", image: "fabric/chenille-black.jfif" }
      ]
    },
    {
      name: "Linoso",
      fabrics: [
        { slug: "linoso-sand", name: "Linoso Sand", image: "fabric/linoso-sand.jfif" },
        { slug: "linoso-silver", name: "Linoso Silver", image: "fabric/linoso-silver.jfif" },
        { slug: "linoso-slate-grey", name: "Linoso Slate Grey", image: "fabric/linoso-slate-grey.jfif" },
        { slug: "linoso-charcoal", name: "Linoso Charcoal", image: "fabric/linoso-charcoal.jfif" },
        { slug: "linoso-truffle", name: "Linoso Truffle", image: "fabric/linoso-truffle.jfif" },
        { slug: "linoso-black", name: "Linoso Black", image: "fabric/linoso-black.jfif" },
        { slug: "linoso-midnight-blue", name: "Linoso Midnight Blue", image: "fabric/linoso-midnight-blue.jfif" },
        { slug: "linoso-plum", name: "Linoso Plum", image: "fabric/linoso-plum.jfif" }
      ]
    },
    {
      name: "Boucle",
      fabrics: [
        { slug: "boucle-granite", name: "Boucle Granite", image: "fabric/boucle-granite.jfif" },
        { slug: "boucle-dove", name: "Boucle Dove", image: "fabric/boucle-dove.jfif" },
        { slug: "boucle-ivory", name: "Boucle Ivory", image: "fabric/boucle-ivory.jfif" },
        { slug: "boucle-truffle", name: "Boucle Truffle", image: "fabric/boucle-truffle.jfif" }
      ]
    },
    {
      name: "Naples Alternative",
      fabrics: [
        { slug: "grey-naples", name: "Grey Naples", image: "fabric/plush-grey.jfif" },
        { slug: "sand-naples", name: "Sand Naples", image: "fabric/naples-sand.jfif" },
        { slug: "silver-naples", name: "Silver Naples", image: "fabric/Naples-Silver.jfif" },
        { slug: "black-naples", name: "Black Naples", image: "fabric/Naples-Black.jfif" },
        { slug: "brown-naples", name: "Brown Naples", image: "fabric/naple-brown.jfif" },
        { slug: "cream-naples", name: "Cream Naples", image: "fabric/naples-cream.jfif" }
      ]
    },
    {
      name: "Additional Colours",
      fabrics: [
        { slug: "dove", name: "Dove", image: "fabric/dove.jfif" },
        { slug: "ivory", name: "Ivory", image: "fabric/ivory.jfif" },
        { slug: "latte", name: "Latte", image: "fabric/latte.jfif" },
        { slug: "mink", name: "Mink", image: "fabric/mink.jfif" },
        { slug: "truffle", name: "Truffle", image: "fabric/truffle.jfif" },
        { slug: "saffron", name: "Saffron", image: "fabric/saffron.jfif" },
        { slug: "powder", name: "Powder", image: "fabric/powder.jfif" },
        { slug: "sky", name: "Sky", image: "fabric/sky.jfif" },
        { slug: "marine", name: "Marine", image: "fabric/marrine.jfif" }
      ]
    },
    {
      name: "Marble",
      fabrics: [
        { slug: "marble-oatmeal", name: "Marble Oatmeal", image: "fabric/marble-oatmeal.jfif" },
        { slug: "marble-platinum", name: "Marble Platinum", image: "fabric/marble-platinum.jfif" },
        { slug: "marble-silver", name: "Marble Silver", image: "fabric/marble-silver.jfif" }
      ]
    }
  ];

(function () {
  "use strict";

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  var BF_PRODUCTS_BY_SLUG = {};
  BF_PRODUCTS.forEach(function (p) { BF_PRODUCTS_BY_SLUG[p.slug] = p; });

  function bfMoney(value) {
    return "\u00A3" + Number(value).toFixed(2);
  }

  function renderStars(rating) {
    var full = Math.round(rating);
    var out = "";
    for (var i = 0; i < 5; i++) out += i < full ? "\u2605" : "\u2606";
    return out;
  }

  /**
   * Reviews are stored per-product in localStorage, following the same
   * pattern as the existing Cart/Wishlist stores elsewhere on this site
   * (a plain JSON array under one key per product), but self-contained
   * here since no shared review store exists yet.
   */
  var BF_REVIEWS_STORAGE_PREFIX = "rabboraReviews:bedframe:";

  function getStoredReviews(slug) {
    try {
      var raw = window.localStorage.getItem(BF_REVIEWS_STORAGE_PREFIX + slug);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveReview(slug, review) {
    var reviews = getStoredReviews(slug);
    reviews.push(review);
    try {
      window.localStorage.setItem(BF_REVIEWS_STORAGE_PREFIX + slug, JSON.stringify(reviews));
      return true;
    } catch (err) {
      return false;
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    var categoryView = document.getElementById("bfCategoryView");
    var detailView = document.getElementById("bfDetailView");
    var notFoundView = document.getElementById("bfNotFoundView");

    var mainImage = document.getElementById("bfGalleryMainImage");
    var imagePlaceholder = document.getElementById("bfDetailImagePlaceholder");
    var galleryPrev = document.getElementById("bfGalleryPrev");
    var galleryNext = document.getElementById("bfGalleryNext");
    var thumbsWrap = document.getElementById("bfGalleryThumbs");
    var fabricsEl = document.getElementById("bfModalFabrics");
    var sizeEl = document.getElementById("bfSizeOptions");

    var qtyValueEl = document.getElementById("bfQtyValue");
    var qtyMinus = document.getElementById("bfQtyMinus");
    var qtyPlus = document.getElementById("bfQtyPlus");
    var addBtn = document.getElementById("bfAddToCart");
    var buyNowBtn = document.getElementById("bfBuyNow");
    var messageEl = document.getElementById("bfPurchaseMessage");

    var ottomanStorageEl = document.getElementById("bfOttomanStorageOptions");
    var ottomanStorageMsg = document.getElementById("bfOttomanStorageMessage");
    var footstoolEl = document.getElementById("bfFootstoolOptions");
    var footstoolMsg = document.getElementById("bfFootstoolMessage");
    var headboardCustomEl = document.getElementById("bfHeadboardCustomOptions");
    var headboardCustomMsg = document.getElementById("bfHeadboardCustomMessage");
    var customRequestEl = document.getElementById("bfCustomRequest");
    var assemblyEl = document.getElementById("bfAssemblyOptions");
    var assemblyMsg = document.getElementById("bfAssemblyMessage");
    var deliveryDelayEl = document.getElementById("bfDeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("bfDeliveryDelayMessage");
    var delayDateWrap = document.getElementById("bfDelayDateWrap");
    var delayDateInput = document.getElementById("bfDelayDate");

    var currentProduct = null;
    var quantity = 1;
    var selectedFabric = null;
    var selectedFabricSlug = null;
    var selectedFabricImage = null;
    var selectedSize = null;
    var imageIndex = 0;
    var ottomanStorage = null;
    var footstoolBlanketBox = null;
    var headboardCustom = null;
    var customRequest = "";
    var assembly = null;
    var deliveryDelay = null;
    var deliveryDate = "";

    var ASSEMBLY_PRICE = 59;

    function getProductImages(product) {
      if (Array.isArray(product.images) && product.images.length) return product.images;
      return product.image ? [product.image] : [];
    }

    function renderThumbs(product) {
      if (!thumbsWrap) return;
      var images = getProductImages(product).filter(function (src) {
        return src && src.indexOf("PUT-IMAGE-HERE") === -1;
      });
      thumbsWrap.innerHTML = "";

      if (images.length === 0) {
        if (galleryPrev) galleryPrev.hidden = true;
        if (galleryNext) galleryNext.hidden = true;
        for (var i = 0; i < 3; i++) {
          var ph = document.createElement("span");
          ph.className = "bb-modal__thumb so-image-placeholder";
          ph.setAttribute("aria-hidden", "true");
          thumbsWrap.appendChild(ph);
        }
        return;
      }

      if (images.length < 2) {
        if (galleryPrev) galleryPrev.hidden = true;
        if (galleryNext) galleryNext.hidden = true;
      } else {
        if (galleryPrev) galleryPrev.hidden = false;
        if (galleryNext) galleryNext.hidden = false;
      }

      images.forEach(function (src, index) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "bb-modal__thumb" + (index === imageIndex ? " is-active" : "");
        thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
        thumb.innerHTML = '<img src="' + src + '" alt="" loading="lazy" />';
        thumb.addEventListener("click", function () {
          imageIndex = index;
          renderImage(product);
        });
        thumbsWrap.appendChild(thumb);
      });
    }

    function renderImage(product) {
      var images = getProductImages(product).filter(function (src) {
        return src && src.indexOf("PUT-IMAGE-HERE") === -1;
      });
      var hasRealImage = images.length > 0;
      if (hasRealImage) {
        mainImage.src = images[imageIndex] || images[0];
        mainImage.alt = "";
        mainImage.hidden = false;
        imagePlaceholder.hidden = true;
        mainImage.onerror = function () {
          mainImage.hidden = true;
          imagePlaceholder.hidden = false;
        };
      } else {
        mainImage.hidden = true;
        mainImage.src = "";
        imagePlaceholder.hidden = false;
      }
      renderThumbs(product);
    }

    function renderFabrics() {
      if (!fabricsEl) return;
      fabricsEl.innerHTML = "";

      // Same real fabric collections/paths as the working Blanket Box and
      // Sofa fabric selectors, grouped under their collection headings
      // since there are now 95 real colours rather than the old 29-item
      // flat placeholder list.
      BF_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl = document.createElement("p");
        titleEl.className = "bb-modal__fabric-collection-title";
        titleEl.textContent = collection.name;
        groupEl.appendChild(titleEl);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric, index) {
          var isSelected = selectedFabric === fabric.name;
          if (selectedFabric === null && collection === BF_FABRIC_COLLECTIONS[0] && index === 0) {
            selectedFabric = fabric.name;
            selectedFabricSlug = fabric.slug;
            selectedFabricImage = fabric.image;
            isSelected = true;
          }

          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(isSelected));
          btn.setAttribute("aria-label", "Select " + fabric.name);
          btn.innerHTML =
            '<span class="fabric-swatch__ring">' +
              '<img src="' + fabric.image + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" onerror="this.style.display=&#39;none&#39;; this.parentElement.classList.add(&#39;fabric-swatch__ring--fallback&#39;);" />' +
              '<span class="fabric-swatch__check" aria-hidden="true">' +
                '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</span>' +
            '</span>' +
            '<span class="fabric-swatch__name">' + fabric.name + '</span>';

          btn.addEventListener("click", function () {
            var alreadySelected = selectedFabric === fabric.name;

            Array.prototype.forEach.call(fabricsEl.querySelectorAll(".fabric-swatch"), function (el) {
              el.setAttribute("aria-pressed", "false");
            });

            if (alreadySelected) {
              selectedFabric = null;
              selectedFabricSlug = null;
              selectedFabricImage = null;
            } else {
              selectedFabric = fabric.name;
              selectedFabricSlug = fabric.slug;
              selectedFabricImage = fabric.image;
              btn.setAttribute("aria-pressed", "true");
            }
          });

          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricsEl.appendChild(groupEl);
      });
    }

    function renderSizeOptions(product) {
      if (!sizeEl) return;
      sizeEl.innerHTML = "";
      var sizes = product.sizes || [];
      if (sizes.length === 0) {
        sizeEl.closest(".bb-modal__fabrics").hidden = true;
        return;
      }
      sizeEl.closest(".bb-modal__fabrics").hidden = false;

      selectedSize = sizes[0];

      sizes.forEach(function (size) {
        var pill = document.createElement("button");
        pill.type = "button";
        pill.className = "mt-option-pill" + (size === selectedSize ? " is-active" : "");
        pill.textContent = size;
        pill.addEventListener("click", function () {
          selectedSize = size;
          Array.prototype.forEach.call(sizeEl.querySelectorAll(".mt-option-pill"), function (el) {
            el.classList.remove("is-active");
          });
          pill.classList.add("is-active");
        });
        sizeEl.appendChild(pill);
      });
    }

    var reviewsSummaryEl = document.getElementById("bfReviewsSummary");
    var reviewsListEl = document.getElementById("bfReviewsList");
    var reviewForm = document.getElementById("bfReviewForm");
    var reviewNameInput = document.getElementById("bfReviewName");
    var reviewCommentInput = document.getElementById("bfReviewComment");
    var reviewMessageEl = document.getElementById("bfReviewMessage");
    var reviewStarsInputEl = document.getElementById("bfReviewStarsInput");
    var selectedReviewRating = 0;

    function updateReviewStarButtons() {
      if (!reviewStarsInputEl) return;
      qsa(".mt-detail__review-star", reviewStarsInputEl).forEach(function (btn) {
        var value = Number(btn.getAttribute("data-value"));
        var isFilled = value <= selectedReviewRating;
        btn.setAttribute("aria-pressed", String(isFilled));
        btn.classList.toggle("is-filled", isFilled);
      });
    }

    function renderReviews(product) {
      var starsEl = document.getElementById("bfDetailStars");
      var reviewCountEl = document.getElementById("bfDetailReviewCount");
      var reviews = getStoredReviews(product.slug);

      if (reviews.length === 0) {
        if (starsEl) starsEl.textContent = "";
        if (reviewCountEl) reviewCountEl.textContent = "No reviews yet";
        if (reviewsSummaryEl) reviewsSummaryEl.textContent = "";
        if (reviewsListEl) {
          reviewsListEl.innerHTML = "";
          var emptyMsg = document.createElement("p");
          emptyMsg.className = "mt-detail__reviews-empty";
          emptyMsg.textContent = "No reviews yet. Be the first to review this bed frame.";
          reviewsListEl.appendChild(emptyMsg);
        }
        return;
      }

      var total = reviews.reduce(function (sum, r) { return sum + r.rating; }, 0);
      var avg = total / reviews.length;
      var roundedAvg = Math.round(avg);

      if (starsEl) starsEl.textContent = renderStars(roundedAvg);
      if (reviewCountEl) reviewCountEl.textContent = "(" + reviews.length + ")";

      if (reviewsSummaryEl) {
        reviewsSummaryEl.textContent =
          avg.toFixed(1) + " out of 5 \u00b7 " + reviews.length + " review" + (reviews.length === 1 ? "" : "s");
      }

      if (reviewsListEl) {
        reviewsListEl.innerHTML = "";
        reviews.slice().reverse().forEach(function (r) {
          var item = document.createElement("div");
          item.className = "mt-detail__review-item";

          var head = document.createElement("div");
          head.className = "mt-detail__review-item-head";

          var starsSpan = document.createElement("span");
          starsSpan.className = "mt-detail__review-item-stars";
          starsSpan.setAttribute("aria-hidden", "true");
          starsSpan.textContent = renderStars(r.rating);

          var nameSpan = document.createElement("span");
          nameSpan.className = "mt-detail__review-item-name";
          nameSpan.textContent = r.name;

          var dateSpan = document.createElement("span");
          dateSpan.className = "mt-detail__review-item-date";
          dateSpan.textContent = new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

          head.appendChild(starsSpan);
          head.appendChild(nameSpan);
          head.appendChild(dateSpan);

          var commentP = document.createElement("p");
          commentP.className = "mt-detail__review-item-comment";
          commentP.textContent = r.comment;

          item.appendChild(head);
          item.appendChild(commentP);
          reviewsListEl.appendChild(item);
        });
      }
    }

    if (reviewStarsInputEl) {
      qsa(".mt-detail__review-star", reviewStarsInputEl).forEach(function (btn) {
        btn.addEventListener("click", function () {
          selectedReviewRating = Number(btn.getAttribute("data-value"));
          updateReviewStarButtons();
          if (reviewMessageEl) {
            reviewMessageEl.textContent = "";
            reviewMessageEl.classList.remove("is-error");
          }
        });
      });
    }

    if (reviewForm) {
      reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!currentProduct) return;

        var name = reviewNameInput.value.trim();
        var comment = reviewCommentInput.value.trim();

        if (!name) {
          reviewMessageEl.textContent = "Please enter your name.";
          reviewMessageEl.classList.add("is-error");
          reviewNameInput.focus();
          return;
        }
        if (!selectedReviewRating) {
          reviewMessageEl.textContent = "Please select a star rating.";
          reviewMessageEl.classList.add("is-error");
          return;
        }
        if (!comment) {
          reviewMessageEl.textContent = "Please write a short review.";
          reviewMessageEl.classList.add("is-error");
          reviewCommentInput.focus();
          return;
        }

        var review = {
          name: name,
          rating: selectedReviewRating,
          comment: comment,
          date: Date.now()
        };

        var ok = saveReview(currentProduct.slug, review);

        reviewForm.reset();
        selectedReviewRating = 0;
        updateReviewStarButtons();

        if (!ok) {
          reviewMessageEl.textContent = "Sorry, something went wrong saving your review. Please try again.";
          reviewMessageEl.classList.add("is-error");
          return;
        }

        reviewMessageEl.classList.remove("is-error");
        reviewMessageEl.textContent = "Thank you \u2014 your review has been added.";
        renderReviews(currentProduct);
      });
    }

    // Assembly is the only new option with a confirmed real price
    // (£59.00) — every other new option stays £0 since no genuine
    // price data exists for them anywhere in the project.
    function currentPrice(product) {
      return product.price + (assembly === "yes" ? ASSEMBLY_PRICE : 0);
    }

    function renderPrice(product) {
      var priceEl = document.getElementById("bfDetailPrice");
      if (priceEl) priceEl.textContent = bfMoney(currentPrice(product));
    }

    // Shared helper for the five new single-select option groups — each
    // is a plain group of .mt-option-pill buttons using this page's own
    // .is-active convention (matching the existing Size selector),
    // where exactly one choice can be active at a time.
    function initRadioPillGroup(container, setter, messageEl2, onSelect) {
      if (!container) return;
      Array.prototype.forEach.call(container.querySelectorAll(".mt-option-pill"), function (btn) {
        btn.addEventListener("click", function () {
          setter(btn.dataset.value);
          Array.prototype.forEach.call(container.querySelectorAll(".mt-option-pill"), function (el) {
            el.classList.remove("is-active");
          });
          btn.classList.add("is-active");
          if (messageEl2) messageEl2.textContent = "";
          if (onSelect) onSelect(btn.dataset.value);
        });
      });
    }

    initRadioPillGroup(ottomanStorageEl, function (v) { ottomanStorage = v; }, ottomanStorageMsg);
    initRadioPillGroup(footstoolEl, function (v) { footstoolBlanketBox = v; }, footstoolMsg);
    initRadioPillGroup(headboardCustomEl, function (v) { headboardCustom = v; }, headboardCustomMsg);
    initRadioPillGroup(assemblyEl, function (v) { assembly = v; }, assemblyMsg, function () {
      if (currentProduct) renderPrice(currentProduct);
    });
    initRadioPillGroup(deliveryDelayEl, function (v) { deliveryDelay = v; }, deliveryDelayMsg, function (value) {
      if (delayDateWrap) delayDateWrap.hidden = value !== "yes";
    });

    if (customRequestEl) {
      customRequestEl.addEventListener("input", function () {
        customRequest = customRequestEl.value;
      });
    }

    if (delayDateInput) {
      delayDateInput.addEventListener("change", function () {
        deliveryDate = delayDateInput.value;
      });
    }

    function renderDetail(product) {
      document.title = product.name + " | Non-Storage Bed Frames | Rabbora Living";

      var eyebrowEl = document.getElementById("bfDetailEyebrow");
      if (eyebrowEl) eyebrowEl.textContent = "Non-Storage Bed Frame";

      document.getElementById("bfDetailTitle").textContent = product.name;
      document.getElementById("bfDetailBreadcrumbName").textContent = product.name;

      renderPrice(product);
      var prevPriceEl = document.getElementById("bfDetailPrevPrice");
      if (prevPriceEl) prevPriceEl.textContent = product.oldPrice ? bfMoney(product.oldPrice) : "";
      document.getElementById("bfDetailDescription").textContent = product.description || "";

      var featuresEl = document.getElementById("bfDetailFeatures");
      if (featuresEl) {
        featuresEl.innerHTML = "";
        (product.features || []).forEach(function (feature) {
          var li = document.createElement("li");
          li.textContent = feature;
          featuresEl.appendChild(li);
        });
      }

      quantity = 1;
      if (qtyValueEl) qtyValueEl.textContent = "1";
      if (messageEl) {
        messageEl.textContent = "";
        messageEl.classList.remove("is-error");
      }

      selectedReviewRating = 0;
      updateReviewStarButtons();
      if (reviewForm) reviewForm.reset();
      if (reviewMessageEl) {
        reviewMessageEl.textContent = "";
        reviewMessageEl.classList.remove("is-error");
      }
      renderReviews(product);
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
    }

    function showNotFound() {
      categoryView.hidden = true;
      detailView.hidden = true;
      notFoundView.hidden = false;
      document.title = "Product Not Found | Rabbora Living";
    }

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      selectedFabric = null;
      selectedFabricSlug = null;
      selectedFabricImage = null;
      imageIndex = 0;

      ottomanStorage = null;
      footstoolBlanketBox = null;
      headboardCustom = null;
      customRequest = "";
      assembly = null;
      deliveryDelay = null;
      deliveryDate = "";
      [ottomanStorageEl, footstoolEl, headboardCustomEl, assemblyEl, deliveryDelayEl].forEach(function (group) {
        if (!group) return;
        Array.prototype.forEach.call(group.querySelectorAll(".mt-option-pill"), function (el) {
          el.classList.remove("is-active");
        });
      });
      [ottomanStorageMsg, footstoolMsg, headboardCustomMsg, assemblyMsg, deliveryDelayMsg].forEach(function (msg) {
        if (msg) msg.textContent = "";
      });
      if (customRequestEl) customRequestEl.value = "";
      if (delayDateInput) delayDateInput.value = "";
      if (delayDateWrap) delayDateWrap.hidden = true;
      if (messageEl) {
        messageEl.textContent = "";
        messageEl.classList.remove("is-error");
      }

      currentProduct = product;
      renderDetail(product);
      renderSizeOptions(product);
      renderFabrics();
      renderImage(product);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    function currentSlugFromHash() {
      var hash = window.location.hash;
      if (!hash || hash === "#") return null;
      return hash.replace(/^#\/?/, "") || null;
    }

    function handleRoute() {
      // Defensive: always release the mobile-menu scroll lock and close
      // the drawer on every route change (see blanket-boxes.js for the
      // full explanation of why this matters).
      document.body.style.overflow = "";
      var mobileDrawer = document.getElementById("mobileNav");
      var mobileOverlay = document.getElementById("mobileNavOverlay");
      var hamburgerBtn = document.getElementById("hamburgerBtn");
      if (mobileDrawer && mobileDrawer.classList.contains("is-open")) {
        mobileDrawer.classList.remove("is-open");
        mobileDrawer.setAttribute("aria-hidden", "true");
        if (mobileOverlay) mobileOverlay.classList.remove("is-visible");
        if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", "false");
      }

      var slug = currentSlugFromHash();
      if (!slug) { showCategory(); return; }

      var product = BF_PRODUCTS_BY_SLUG[slug];
      if (!product) { showNotFound(); return; }

      showDetail(product);
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (quantity > 1) { quantity -= 1; qtyValueEl.textContent = String(quantity); }
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        quantity += 1; qtyValueEl.textContent = String(quantity);
      });
    }

    if (galleryPrev) {
      galleryPrev.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = getProductImages(currentProduct).filter(function (src) {
          return src && src.indexOf("PUT-IMAGE-HERE") === -1;
        });
        if (images.length < 2) return;
        imageIndex = (imageIndex - 1 + images.length) % images.length;
        renderImage(currentProduct);
      });
    }
    if (galleryNext) {
      galleryNext.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = getProductImages(currentProduct).filter(function (src) {
          return src && src.indexOf("PUT-IMAGE-HERE") === -1;
        });
        if (images.length < 2) return;
        imageIndex = (imageIndex + 1) % images.length;
        renderImage(currentProduct);
      });
    }

    function hasCartStore() {
      return !!(window.RabboraCart && typeof window.RabboraCart.add === "function");
    }

    // Each required new option shows its own inline message right next
    // to that option (not just one generic message at the bottom),
    // checked top-to-bottom in the order they appear. This page has
    // never enforced a Size requirement, so that behaviour is left
    // unchanged here.
    function validateRequiredOptions() {
      if (!ottomanStorage) {
        ottomanStorageMsg.textContent = "Please select an option.";
        ottomanStorageEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!footstoolBlanketBox) {
        footstoolMsg.textContent = "Please select an option.";
        footstoolEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!headboardCustom) {
        headboardCustomMsg.textContent = "Please select an option.";
        headboardCustomEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!assembly) {
        assemblyMsg.textContent = "Please select an option.";
        assemblyEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!deliveryDelay) {
        deliveryDelayMsg.textContent = "Please select an option.";
        deliveryDelayEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      return true;
    }

    function addCurrentToCart() {
      if (!currentProduct) return;
      if (!validateRequiredOptions()) return;

      if (!hasCartStore()) {
        console.error(
          "[Rabbora Cart] window.RabboraCart is not available on this page. " +
          "Check that <script src=\"cart-data.js\"></script> is present and loads before this script."
        );
        if (messageEl) {
          messageEl.textContent = "Sorry, something went wrong adding this to your cart. Please refresh and try again.";
          messageEl.classList.add("is-error");
        }
        return;
      }

      var unitPrice = currentPrice(currentProduct);

      window.RabboraCart.add({
        id: currentProduct.slug,
        slug: currentProduct.slug,
        name: currentProduct.name,
        image: currentProduct.image,
        price: unitPrice,
        variant: {
          size: selectedSize || "",
          fabric: selectedFabric || "",
          fabricSlug: selectedFabricSlug || "",
          fabricImage: selectedFabricImage || "",
          ottomanStorage: ottomanStorage,
          footstoolBlanketBox: footstoolBlanketBox,
          headboardHeight: headboardCustom,
          customRequest: customRequest || null,
          assembly: assembly,
          assemblyPrice: assembly === "yes" ? ASSEMBLY_PRICE : 0,
          deliveryDelay: deliveryDelay,
          requiredDeliveryDate: deliveryDelay === "yes" ? (deliveryDate || null) : null
        },
        url: "bed-frames.html#/" + currentProduct.slug
      }, quantity);

      if (messageEl) {
        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + quantity + " \u00d7 " + currentProduct.name +
          (selectedSize ? " (" + selectedSize + ")" : "") +
          " to your basket \u2014 " + bfMoney(unitPrice * quantity) + ".";
      }
    }

    if (addBtn) {
      addBtn.addEventListener("click", addCurrentToCart);
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!validateRequiredOptions()) return;
        addCurrentToCart();
        window.location.href = "cart.html";
      });
    }
  });
})();