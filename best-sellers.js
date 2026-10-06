/* =========================================================
   RABBORA LIVING — TV BEDS
   ---------------------------------------------------------
   Self-contained data + page logic for best-sellers.html. Loaded
   AFTER script.js (which still runs the shared header, mobile
   nav, search, dropdown, etc. — none of that is touched here).

   ===============================
   EDIT YOUR PRODUCTS HERE
   ===============================
   To change a product's name, price, description or image,
   edit the matching field below. To replace an image, just
   change the "image" path, e.g.:
     "image": "images/img-1.jfif"
   becomes:
     "image": "images/my-new-photo.jpg"
   No slugs, no auto-generated filenames.
   ========================================================= */

var BS_PRODUCTS = [
  {
    "id": 1,
    "slug": "art-deco-bed-style",
    "name": "Rabbora Manhattan Slatted Ottoman Bed",
    "price": 249.0,
    "oldPrice": 429.0,
    "monthly": 21,
    "rating": 5,
    "reviews": 156,
    "badge": "Best Seller",
    "image": "slatted/img-1.jfif",
    "description": "One of our most popular designs, handmade to order on a solid, supportive frame and finished with tailored upholstery."
  },
  {
    "id": 2,
    "slug": "kendal-butterfly-wingback-bed",
    "name": "Rabbora Duke High & Wide Headboard Bed",
    "price": 799.0,
    "oldPrice": 1000.0,
    "monthly": 67,
    "rating": 5,
    "reviews": 88,
    "badge": null,
    "image": "high/1.jfif",
    "description": "A striking wingback silhouette, handmade to order on a solid, supportive frame and finished with tailored upholstery."
  },
  {
    "id": 3,
    "slug": "empire-bed-frame-ottoman-storage",
    "name": "Rabbora Solid Ottoman Bed",
    "price": 249.0,
    "oldPrice": 429.0,
    "monthly": 21,
    "rating": 5,
    "reviews": 172,
    "badge": null,
    "image": "solid/1.jfif",
    "description": "A considered frame with the option of built-in ottoman storage, handmade to order and finished with tailored upholstery."
  },
  {
    "id": 4,
    "slug": "orlando-bed-frame-ottoman-storage",
    "name": "Rabbora Lyon Storage Bed",
    "price": 294.0,
    "oldPrice": 380.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 308,
    "badge": "New",
    "image": "drawar/1.jfif",
    "description": "A refined bed frame with the option of built-in ottoman storage, handmade to order and finished with tailored upholstery."
  },
  {
    "id": 5,
    "slug": "best-seller-5",
    "name": "Rabbora Milan Slatted Wingback Ottoman Bed",
    "price": 259.0,
    "oldPrice": 420.0,
    "monthly": 22,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/img-7.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 6,
    "slug": "best-seller-6",
    "name": "Rabbora Las Vegas High Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthly": 63,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/5.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 7,
    "slug": "best-seller-7",
    "name": "Rabbora Luxury Solid Ottoman Bed",
    "price": 259.0,
    "oldPrice": 420.0,
    "monthly": 22,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/4.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 8,
    "slug": "best-seller-8",
    "name": "Rabbora Mona Lisa Storage Bed",
    "price": 294.0,
    "oldPrice": 380.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/4.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 9,
    "slug": "best-seller-9",
    "name": "Rabbora Athens Slatted Designer Ottoman Bed",
    "price": 289.0,
    "oldPrice": 400.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/img-12.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 10,
    "slug": "best-seller-10",
    "name": "Rabbora Athena High Headboard Bed",
    "price": 699.0,
    "oldPrice": 900.0,
    "monthly": 59,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/9.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 11,
    "slug": "best-seller-11",
    "name": "Rabbora Premium Ottoman Bed",
    "price": 289.0,
    "oldPrice": 400.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/7.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 12,
    "slug": "best-seller-12",
    "name": "Rabbora Art Deco Storage Bed",
    "price": 294.0,
    "oldPrice": 380.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/7.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 13,
    "slug": "best-seller-13",
    "name": "Rabbora Empire Slatted Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/img-17.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 14,
    "slug": "best-seller-14",
    "name": "Rabbora Chicago High Headboard Bed",
    "price": 449.0,
    "oldPrice": 480.0,
    "monthly": 38,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/13.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 15,
    "slug": "best-seller-15",
    "name": "Rabbora Classic Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/10.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 16,
    "slug": "best-seller-16",
    "name": "Rabbora Golden Skyline Storage Bed",
    "price": 394.0,
    "oldPrice": 499.0,
    "monthly": 34,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/10.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 17,
    "slug": "best-seller-17",
    "name": "Rabbora Art Deco Slatted Ottoman Bed",
    "price": 252.0,
    "oldPrice": 420.0,
    "monthly": 21,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/img-22.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 18,
    "slug": "best-seller-18",
    "name": "Rabbora Model Square Hotel Bed",
    "price": 649.0,
    "oldPrice": 1000.0,
    "monthly": 55,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/17.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 19,
    "slug": "best-seller-19",
    "name": "Rabbora Elegant Ottoman Bed",
    "price": 252.0,
    "oldPrice": 420.0,
    "monthly": 21,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/13.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 20,
    "slug": "best-seller-20",
    "name": "Rabbora Dover Designer Storage Bed",
    "price": 294.0,
    "oldPrice": 400.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/13.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 21,
    "slug": "best-seller-21",
    "name": "Rabbora Orlando Slatted Ottoman Bed",
    "price": 306.59,
    "oldPrice": 420.0,
    "monthly": 26,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/img-30.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 22,
    "slug": "best-seller-22",
    "name": "Rabbora Starlight Luxury Bed",
    "price": 599.0,
    "oldPrice": 900.0,
    "monthly": 50,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/20.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 23,
    "slug": "best-seller-23",
    "name": "Rabbora Comfort Ottoman Bed",
    "price": 299.0,
    "oldPrice": 444.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/16.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 24,
    "slug": "best-seller-24",
    "name": "Rabbora Brooklyn Storage Bed",
    "price": 304.0,
    "oldPrice": 380.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/16.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 25,
    "slug": "best-seller-25",
    "name": "Rabbora Kendal Slatted Wingback Bed",
    "price": 299.0,
    "oldPrice": 444.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/img-35.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 26,
    "slug": "best-seller-26",
    "name": "Rabbora DaVinci Tall Headboard Bed",
    "price": 749.0,
    "oldPrice": 900.0,
    "monthly": 63,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/24.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 27,
    "slug": "best-seller-27",
    "name": "Rabbora Signature Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/19.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 28,
    "slug": "best-seller-28",
    "name": "Rabbora Mayfair Storage Bed",
    "price": 304.0,
    "oldPrice": 380.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/19.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 29,
    "slug": "best-seller-29",
    "name": "Rabbora Teddy Orlando Slatted Ottoman Bed",
    "price": 306.59,
    "oldPrice": 420.0,
    "monthly": 26,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/34.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 30,
    "slug": "best-seller-30",
    "name": "Rabbora Geneva High & Wide Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthly": 63,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/28.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 31,
    "slug": "best-seller-31",
    "name": "Rabbora Modern Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/22.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 32,
    "slug": "best-seller-32",
    "name": "Rabbora Toronto Lux Storage Bed",
    "price": 404.0,
    "oldPrice": 499.0,
    "monthly": 34,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/22.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 33,
    "slug": "best-seller-33",
    "name": "Rabbora Park Lane Ambassador Slatted Bed",
    "price": 449.0,
    "oldPrice": 600.0,
    "monthly": 38,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/38.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 34,
    "slug": "best-seller-34",
    "name": "Rabbora Bahamas Wide Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthly": 63,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/32.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 35,
    "slug": "best-seller-35",
    "name": "Rabbora Prestige Ottoman Bed",
    "price": 389.0,
    "oldPrice": 499.0,
    "monthly": 33,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/25.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 36,
    "slug": "best-seller-36",
    "name": "Rabbora Virginia Storage Bed",
    "price": 304.0,
    "oldPrice": 370.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/25.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 37,
    "slug": "best-seller-37",
    "name": "Rabbora Brooklyn Slatted Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "slatted/40.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 38,
    "slug": "best-seller-38",
    "name": "Rabbora Riviera High Headboard Bed",
    "price": 549.0,
    "oldPrice": 900.0,
    "monthly": 46,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "high/35.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 39,
    "slug": "best-seller-39",
    "name": "Rabbora Deluxe Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "solid/28.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 40,
    "slug": "best-seller-40",
    "name": "Rabbora Kensington Storage Bed",
    "price": 299.0,
    "oldPrice": 370.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "drawar/28.jfif",
    "description": "Add a short product description here once real product details are available."
  }
];

var BS_FABRIC_COLLECTIONS = [
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

var BS_FABRIC_COLLECTIONS_FLAT = [];
BS_FABRIC_COLLECTIONS.forEach(function (collection) {
  collection.fabrics.forEach(function (fabric) {
    BS_FABRIC_COLLECTIONS_FLAT.push(fabric);
  });
});
(function () {
  "use strict";

  function qs(sel, scope) {
    return (scope || document).querySelector(sel);
  }
  function qsa(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }
  function money(v) {
    return "\u00A3" + v.toFixed(2);
  }
  function stars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }


  /* ---- Sizes for each Best Seller ----
     Best Sellers re-lists beds from other ranges. Each entry below is
     copied exactly from that bed's own page: its sizes, the size labels
     and the price of every size (ottoman-beds.js, high-headboard-beds.js,
     solid-base-ottomans.js, storage-drawers.js). "prices: null" means that
     page has no per-size prices for the bed, so every size costs the
     bed's own price. */
  var BS_SIZE_OPTIONS = {
    "art-deco-bed-style": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 249, "Small Double": 388, "Double": 429, "King": 459, "Super King": 499 } }, /* ottoman-beds.js — chelsea-slatted-ottoman-bed */
    "kendal-butterfly-wingback-bed": { sizes: ["Double", "King", "Super King"], labels: ["Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Double": 799, "King": 849, "Super King": 899 } }, /* high-headboard-beds.js — high-headboard-bed-1 */
    "empire-bed-frame-ottoman-storage": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 249, "Small Double": 388, "Double": 429, "King": 459, "Super King": 499 } }, /* solid-base-ottomans.js — solid-ottoman-bed-1 */
    "orlando-bed-frame-ottoman-storage": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 } }, /* storage-drawers.js — storage-drawer-1 */
    "best-seller-5": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 259, "Small Double": 359, "Double": 399, "King": 439, "Super King": 469 } }, /* ottoman-beds.js — hampton-slatted-ottoman-bed */
    "best-seller-6": { sizes: ["Small Double", "Double", "King", "Super King"], labels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Small Double": 749, "Double": 799, "King": 849, "Super King": 899 } }, /* high-headboard-beds.js — high-headboard-bed-2 */
    "best-seller-7": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 259, "Small Double": 359, "Double": 399, "King": 439, "Super King": 469 } }, /* solid-base-ottomans.js — solid-ottoman-bed-2 */
    "best-seller-8": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 } }, /* storage-drawers.js — storage-drawer-2 */
    "best-seller-9": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 289, "Small Double": 367.5, "Double": 399, "King": 439, "Super King": 469 } }, /* ottoman-beds.js — monaco-ottoman-bed */
    "best-seller-10": { sizes: ["Small Double", "Double", "King", "Super King"], labels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Small Double": 699, "Double": 749, "King": 799, "Super King": 849 } }, /* high-headboard-beds.js — high-headboard-bed-3 */
    "best-seller-11": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 289, "Small Double": 367.5, "Double": 399, "King": 439, "Super King": 469 } }, /* solid-base-ottomans.js — solid-ottoman-bed-3 */
    "best-seller-12": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 } }, /* storage-drawers.js — storage-drawer-3 */
    "best-seller-13": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 } }, /* ottoman-beds.js — windsor-slatted-ottoman-bed */
    "best-seller-14": { sizes: ["Small Double", "Double", "King", "Super King"], labels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Small Double": 449, "Double": 489, "King": 529, "Super King": 549 } }, /* high-headboard-beds.js — high-headboard-bed-4 */
    "best-seller-15": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 } }, /* solid-base-ottomans.js — solid-ottoman-bed-4 */
    "best-seller-16": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 394, "Small Double": 444, "Double": 414, "King": 524, "Super King": 564 } }, /* storage-drawers.js — storage-drawer-4 */
    "best-seller-17": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 252, "Small Double": 383.99, "Double": 449, "King": 489, "Super King": 529 } }, /* ottoman-beds.js — kensington-slatted-ottoman-bed */
    "best-seller-18": { sizes: ["Small Double", "Double", "King", "Super King"], labels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Small Double": 649, "Double": 699, "King": 799, "Super King": 849 } }, /* high-headboard-beds.js — high-headboard-bed-5 */
    "best-seller-19": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 252, "Small Double": 383.99, "Double": 449, "King": 489, "Super King": 529 } }, /* solid-base-ottomans.js — solid-ottoman-bed-5 */
    "best-seller-20": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 484 } }, /* storage-drawers.js — storage-drawer-5 */
    "best-seller-21": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 306.59, "Small Double": 409, "Double": 449, "King": 489, "Super King": 539 } }, /* ottoman-beds.js — mayfair-ottoman-bed */
    "best-seller-22": { sizes: ["Small Double", "Double", "King", "Super King"], labels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Small Double": 599, "Double": 649, "King": 699, "Super King": 749 } }, /* high-headboard-beds.js — high-headboard-bed-6 */
    "best-seller-23": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 299, "Small Double": 409, "Double": 439, "King": 459, "Super King": 509 } }, /* solid-base-ottomans.js — solid-ottoman-bed-6 */
    "best-seller-24": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 304, "Small Double": 394, "Double": 404, "King": 454, "Super King": 490 } }, /* storage-drawers.js — storage-drawer-6 */
    "best-seller-25": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 299, "Small Double": 409, "Double": 439, "King": 459, "Super King": 509 } }, /* ottoman-beds.js — richmond-slatted-ottoman-bed */
    "best-seller-26": { sizes: ["Double", "King", "Super King"], labels: ["Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Double": 749, "King": 799, "Super King": 829 } }, /* high-headboard-beds.js — high-headboard-bed-7 */
    "best-seller-27": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 299, "Small Double": 369, "Double": 399, "King": 419, "Super King": 479 } }, /* solid-base-ottomans.js — solid-ottoman-bed-7 */
    "best-seller-28": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 304, "Small Double": 394, "Double": 404, "King": 454, "Super King": 490 } }, /* storage-drawers.js — storage-drawer-7 */
    "best-seller-29": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 306.59, "Small Double": 439, "Double": 489, "King": 509, "Super King": 559 } }, /* ottoman-beds.js — cambridge-slatted-ottoman-bed */
    "best-seller-30": { sizes: ["Small Double", "Double", "King", "Super King"], labels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Small Double": 749, "Double": 799, "King": 849, "Super King": 899 } }, /* high-headboard-beds.js — high-headboard-bed-8 */
    "best-seller-31": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 299, "Small Double": 409, "Double": 429, "King": 459, "Super King": 499 } }, /* solid-base-ottomans.js — solid-ottoman-bed-8 */
    "best-seller-32": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 404, "Small Double": 455, "Double": 455, "King": 475, "Super King": 525 } }, /* storage-drawers.js — storage-drawer-8 */
    "best-seller-33": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 449, "Small Double": 589, "Double": 599, "King": 649, "Super King": 699 } }, /* ottoman-beds.js — victoria-ottoman-bed */
    "best-seller-34": { sizes: ["Double", "King", "Super King"], labels: ["Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Double": 749, "King": 799, "Super King": 849 } }, /* high-headboard-beds.js — high-headboard-bed-9 */
    "best-seller-35": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 389, "Small Double": 439, "Double": 449, "King": 499, "Super King": 549 } }, /* solid-base-ottomans.js — solid-ottoman-bed-9 */
    "best-seller-36": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Single": 304, "Small Double": 384, "Double": 394, "King": 434, "Super King": 454 } }, /* storage-drawers.js — storage-drawer-9 */
    "best-seller-37": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 299, "Small Double": 369, "Double": 399, "King": 419, "Super King": 479 } }, /* ottoman-beds.js — oxford-slatted-ottoman-bed */
    "best-seller-38": { sizes: ["Small Double", "Double", "King", "Super King"], labels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: { "Small Double": 549, "Double": 599, "King": 659, "Super King": 699 } }, /* high-headboard-beds.js — high-headboard-bed-10 */
    "best-seller-39": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"], prices: { "Single": 289, "Small Double": 409, "Double": 425, "King": 459, "Super King": 485 } }, /* solid-base-ottomans.js — solid-ottoman-bed-10 */
    "best-seller-40": { sizes: ["Single", "Small Double", "Double", "King", "Super King"], labels: ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"], prices: null } /* storage-drawers.js — storage-drawer-10 */
  };

  // Old (original / "was") price for each size. Single 3ft is not listed:
  // it keeps its existing old price. The other sizes are worked out from
  // their existing sale price:
  //   Small Double 21% off -> old = sale / 0.79
  //   Double       28% off -> old = sale / 0.72
  //   King         29% off -> old = sale / 0.71
  //   Super King   29% off -> old = sale / 0.71
  // Any number here can be changed in VS Code; a size left out shows the
  // page's old price exactly as before.
  var BS_SIZE_OLD_PRICES = {
    "art-deco-bed-style": { "Small Double": 491.14, "Double": 595.83, "King": 646.48, "Super King": 702.82 },
    "kendal-butterfly-wingback-bed": { "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 },
    "empire-bed-frame-ottoman-storage": { "Small Double": 491.14, "Double": 595.83, "King": 646.48, "Super King": 702.82 },
    "orlando-bed-frame-ottoman-storage": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 },
    "best-seller-5": { "Small Double": 454.43, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
    "best-seller-6": { "Small Double": 948.1, "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 },
    "best-seller-7": { "Small Double": 454.43, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
    "best-seller-8": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 },
    "best-seller-9": { "Small Double": 465.19, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
    "best-seller-10": { "Small Double": 884.81, "Double": 1040.28, "King": 1125.35, "Super King": 1195.77 },
    "best-seller-11": { "Small Double": 465.19, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
    "best-seller-12": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 },
    "best-seller-13": { "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 },
    "best-seller-14": { "Small Double": 568.35, "Double": 679.17, "King": 745.07, "Super King": 773.24 },
    "best-seller-15": { "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 },
    "best-seller-16": { "Small Double": 562.03, "Double": 575, "King": 738.03, "Super King": 794.37 },
    "best-seller-17": { "Small Double": 486.06, "Double": 623.61, "King": 688.73, "Super King": 745.07 },
    "best-seller-18": { "Small Double": 821.52, "Double": 970.83, "King": 1125.35, "Super King": 1195.77 },
    "best-seller-19": { "Small Double": 486.06, "Double": 623.61, "King": 688.73, "Super King": 745.07 },
    "best-seller-20": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 681.69 },
    "best-seller-21": { "Small Double": 517.72, "Double": 623.61, "King": 688.73, "Super King": 759.15 },
    "best-seller-22": { "Small Double": 758.23, "Double": 901.39, "King": 984.51, "Super King": 1054.93 },
    "best-seller-23": { "Small Double": 517.72, "Double": 609.72, "King": 646.48, "Super King": 716.9 },
    "best-seller-24": { "Small Double": 498.73, "Double": 561.11, "King": 639.44, "Super King": 690.14 },
    "best-seller-25": { "Small Double": 517.72, "Double": 609.72, "King": 646.48, "Super King": 716.9 },
    "best-seller-26": { "Double": 1040.28, "King": 1125.35, "Super King": 1167.61 },
    "best-seller-27": { "Small Double": 467.09, "Double": 554.17, "King": 590.14, "Super King": 674.65 },
    "best-seller-28": { "Small Double": 498.73, "Double": 561.11, "King": 639.44, "Super King": 690.14 },
    "best-seller-29": { "Small Double": 555.7, "Double": 679.17, "King": 716.9, "Super King": 787.32 },
    "best-seller-30": { "Small Double": 948.1, "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 },
    "best-seller-31": { "Small Double": 517.72, "Double": 595.83, "King": 646.48, "Super King": 702.82 },
    "best-seller-32": { "Small Double": 575.95, "Double": 631.94, "King": 669.01, "Super King": 739.44 },
    "best-seller-33": { "Small Double": 745.57, "Double": 831.94, "King": 914.08, "Super King": 984.51 },
    "best-seller-34": { "Double": 1040.28, "King": 1125.35, "Super King": 1195.77 },
    "best-seller-35": { "Small Double": 555.7, "Double": 623.61, "King": 702.82, "Super King": 773.24 },
    "best-seller-36": { "Small Double": 486.08, "Double": 547.22, "King": 611.27, "Super King": 639.44 },
    "best-seller-37": { "Small Double": 467.09, "Double": 554.17, "King": 590.14, "Super King": 674.65 },
    "best-seller-38": { "Small Double": 694.94, "Double": 831.94, "King": 928.17, "Super King": 984.51 },
    "best-seller-39": { "Small Double": 517.72, "Double": 590.28, "King": 646.48, "Super King": 683.1 },
    "best-seller-40": { "Small Double": 378.48, "Double": 415.28, "King": 421.13, "Super King": 421.13 }
  };


  function bsSizeInfo(product) {
    return (product && BS_SIZE_OPTIONS[product.slug]) || null;
  }

  // Price of one size (before add-ons), copied from the bed's own page.
  // With no size selected, or no per-size prices, this is product.price.
  function bsSizePrice(product, size) {
    var info = bsSizeInfo(product);
    if (info && info.prices && size && typeof info.prices[size] === "number") return info.prices[size];
    return product.price;
  }


  /* ---- Detail gallery images for each Best Seller ----
     Best Sellers entries only store one image. Each list below is the
     full photo set of the SAME bed on its own page (same name and
     price), copied exactly: Slatted Ottoman beds from ottoman-beds.js
     ("images"), High Headboard beds from high-headboard-beds.js
     ("gallery"), Solid Base beds from solid-base-ottomans.js ("images")
     and Storage Drawer beds from storage-drawers.js ("images").
     The first photo of every list is the Best Sellers card image. */
  var BS_GALLERY_IMAGES = {
    "art-deco-bed-style": ["slatted/img-1.jfif", "slatted/img-6.jfif", "slatted/img-5.jfif", "slatted/img-4.jfif", "slatted/img-2.jfif"],
    "kendal-butterfly-wingback-bed": ["high/1.jfif", "high/2.jfif", "high/3.jfif", "high/4.jfif"],
    "empire-bed-frame-ottoman-storage": ["solid/1.jfif", "solid/2.jfif", "solid/3.jfif"],
    "orlando-bed-frame-ottoman-storage": ["drawar/1.jfif", "drawar/2.jfif", "drawar/3.jfif"],
    "best-seller-5": ["slatted/img-7.jfif", "slatted/img-8.jfif", "slatted/img-9.jfif", "slatted/img-10.jfif", "slatted/img-3.jfif"],
    "best-seller-6": ["high/5.jfif", "high/6.jfif", "high/7.jfif", "high/8.jfif"],
    "best-seller-7": ["solid/4.jfif", "solid/5.jfif", "solid/6.jfif"],
    "best-seller-8": ["drawar/4.jfif", "drawar/5.jfif", "drawar/6.jfif"],
    "best-seller-9": ["slatted/img-12.jfif", "slatted/img-15.jfif", "slatted/img-13.jfif", "slatted/img-11.jfif", "slatted/img-14.jfif"],
    "best-seller-10": ["high/9.jfif", "high/10.jfif", "high/11.jfif", "high/12.jfif"],
    "best-seller-11": ["solid/7.jfif", "solid/8.jfif", "solid/9.jfif"],
    "best-seller-12": ["drawar/7.jfif", "drawar/8.jfif", "drawar/9.jfif"],
    "best-seller-13": ["slatted/img-17.jfif", "slatted/img-19.jfif", "slatted/img-18.jfif", "slatted/img-12.jfif"],
    "best-seller-14": ["high/13.jfif", "high/14.jfif", "high/15.jfif", "high/16.jfif"],
    "best-seller-15": ["solid/10.jfif", "solid/11.jfif", "solid/12.jfif"],
    "best-seller-16": ["drawar/10.jfif", "drawar/11.jfif", "drawar/12.jfif"],
    "best-seller-17": ["slatted/img-22.jfif", "slatted/img-24.jfif", "slatted/img-25.jfif", "slatted/img-26.jfif", "slatted/img-23.jfif"],
    "best-seller-18": ["high/17.jfif", "high/18.jfif", "high/19.jfif"],
    "best-seller-19": ["solid/13.jfif", "solid/14.jfif", "solid/15.jfif"],
    "best-seller-20": ["drawar/13.jfif", "drawar/14.jfif", "drawar/15.jfif"],
    "best-seller-21": ["slatted/img-30.png", "slatted/img-28.png", "slatted/img-29.png", "slatted/img-31.png", "slatted/img-27.png"],
    "best-seller-22": ["high/20.jfif", "high/21.jfif", "high/22.jfif", "high/23.jfif"],
    "best-seller-23": ["solid/16.jfif", "solid/17.jfif", "solid/18.jfif"],
    "best-seller-24": ["drawar/16.jfif", "drawar/17.jfif", "drawar/18.jfif"],
    "best-seller-25": ["slatted/img-35.png", "slatted/img-34.png", "slatted/img-33.png", "slatted/img-32.png", "slatted/img-36.png"],
    "best-seller-26": ["high/24.jfif", "high/25.jfif", "high/26.jfif", "high/27.jfif"],
    "best-seller-27": ["solid/19.jfif", "solid/20.jfif", "solid/21.jfif"],
    "best-seller-28": ["drawar/19.jfif", "drawar/20.jfif", "drawar/21.jfif"],
    "best-seller-29": ["slatted/34.png", "slatted/35.png", "slatted/36.png", "slatted/37.png"],
    "best-seller-30": ["high/28.jfif", "high/29.jfif", "high/30.jfif", "high/31.jfif"],
    "best-seller-31": ["solid/22.jfif", "solid/23.jfif", "solid/24.jfif"],
    "best-seller-32": ["drawar/22.jfif", "drawar/23.jfif", "drawar/24.jfif"],
    "best-seller-33": ["slatted/38.png", "slatted/39.png", "slatted/img-37.png", "slatted/img-39.png"],
    "best-seller-34": ["high/32.jfif", "high/33.jfif", "high/34.jfif"],
    "best-seller-35": ["solid/25.jfif", "solid/26.jfif", "solid/27.jfif"],
    "best-seller-36": ["drawar/25.jfif", "drawar/26.jfif", "drawar/27.jfif"],
    "best-seller-37": ["slatted/40.png", "slatted/41.png", "slatted/43.png", "slatted/42.png"],
    "best-seller-38": ["high/35.jfif", "high/36.jfif", "high/37.jfif"],
    "best-seller-39": ["solid/28.jfif", "solid/29.jfif", "solid/30.jfif"],
    "best-seller-40": ["drawar/28.jfif", "drawar/29.jfif", "drawar/30.jfif"]
  };

  function bsGalleryImages(product) {
    if (!product) return [];
    var list = BS_GALLERY_IMAGES[product.slug];
    if (list && list.length) return list;
    return product.gallery && product.gallery.length ? product.gallery : [product.image];
  }

  var BS_PRODUCTS_BY_SLUG = {};
  BS_PRODUCTS.forEach(function (p) {
    BS_PRODUCTS_BY_SLUG[p.slug] = p;
  });

  var bsState = {
    selectedSize: null,
    quantity: 1,
    imageIndex: 0,
    selectedFabric: null,
    ottomanStorage: null,
    footstoolBlanketBox: null,
    headboardCustom: null,
    customRequest: "",
    assembly: null,
    deliveryDelay: null,
    deliveryDate: ""
  };

  var ASSEMBLY_PRICE = 59;

  /* ---- Product count (sort/filter dropdowns removed) ---- */
  function initToolbar() {
    var grid = document.getElementById("bsProductGrid");
    if (!grid) return;

    var countEl = document.getElementById("bsProductCount");
    var pagination = document.getElementById("bsPagination");
    var pagePrevBtn = document.getElementById("bsPagePrev");
    var pageNextBtn = document.getElementById("bsPageNext");
    var pageButtons = qsa(".mt-pagination__page", pagination);
    var cards = qsa(".bs-product-card", grid);

    var PAGE_SIZE = 12;
    var currentPage = 1;

    function renderPagination(totalPages) {
      if (!pagination) return;
      pageButtons.forEach(function (btn) {
        var page = parseInt(btn.dataset.page, 10);
        btn.hidden = page > totalPages;
        btn.classList.toggle("is-active", page === currentPage);
        btn.setAttribute("aria-current", page === currentPage ? "page" : "false");
      });
      if (pagePrevBtn) pagePrevBtn.disabled = currentPage <= 1;
      if (pageNextBtn) pageNextBtn.disabled = currentPage >= totalPages;
      pagination.hidden = totalPages <= 1;
    }

    function applyPage() {
      var totalPages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      var startIndex = (currentPage - 1) * PAGE_SIZE;
      var pageItems = cards.slice(startIndex, startIndex + PAGE_SIZE);

      cards.forEach(function (card) {
        card.hidden = pageItems.indexOf(card) === -1;
      });

      if (countEl) {
        var from = startIndex + 1;
        var to = Math.min(startIndex + PAGE_SIZE, cards.length);
        countEl.textContent = "Showing " + from + "\u2013" + to + " of " + cards.length + " beds";
      }

      renderPagination(totalPages);
    }

    if (pagePrevBtn) {
      pagePrevBtn.addEventListener("click", function () {
        if (currentPage > 1) { currentPage -= 1; applyPage(); if (grid.scrollIntoView) grid.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    }
    if (pageNextBtn) {
      pageNextBtn.addEventListener("click", function () {
        currentPage += 1; applyPage(); if (grid.scrollIntoView) grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    pageButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentPage = parseInt(btn.dataset.page, 10);
        applyPage();
        if (grid.scrollIntoView) grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    applyPage();
  }

  /* ---- Grid / list view toggle ---- */
  function initViewToggle() {
    var grid = document.getElementById("bsProductGrid");
    var gridBtn = document.getElementById("bsGridViewBtn");
    var listBtn = document.getElementById("bsListViewBtn");
    if (!grid || !gridBtn || !listBtn) return;

    gridBtn.addEventListener("click", function () {
      grid.classList.remove("is-list-view");
      gridBtn.classList.add("is-active");
      gridBtn.setAttribute("aria-pressed", "true");
      listBtn.classList.remove("is-active");
      listBtn.setAttribute("aria-pressed", "false");
    });

    listBtn.addEventListener("click", function () {
      grid.classList.add("is-list-view");
      listBtn.classList.add("is-active");
      listBtn.setAttribute("aria-pressed", "true");
      gridBtn.classList.remove("is-active");
      gridBtn.setAttribute("aria-pressed", "false");
    });
  }

  /* ---- FAQ accordion (category + detail page instances) ---- */
  function initFaq() {
    qsa(".bs-faq-item").forEach(function (item) {
      var toggle = qs(".bs-faq-item__toggle", item);
      if (!toggle) return;
      toggle.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        item.classList.toggle("is-open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ---- Detail view: one reusable component for all 12 products ---- */
  function initDetail() {
    var categoryView = document.getElementById("bsCategoryView");
    var detailView = document.getElementById("bsDetailView");
    var notFoundView = document.getElementById("bsNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("bsDetailBreadcrumbName");
    var mainImage = document.getElementById("bsGalleryMainImage");
    var thumbsWrap = document.getElementById("bsGalleryThumbs");
    var fabricsEl = document.getElementById("bsModalFabrics");
    var ottomanStorageEl = document.getElementById("bsOttomanStorageOptions");
    var ottomanStorageMsg = document.getElementById("bsOttomanStorageMessage");
    var footstoolEl = document.getElementById("bsFootstoolOptions");
    var footstoolMsg = document.getElementById("bsFootstoolMessage");
    var headboardCustomEl = document.getElementById("bsHeadboardCustomOptions");
    var headboardCustomMsg = document.getElementById("bsHeadboardCustomMessage");
    var customRequestEl = document.getElementById("bsCustomRequest");
    var assemblyEl = document.getElementById("bsAssemblyOptions");
    var assemblyMsg = document.getElementById("bsAssemblyMessage");
    var deliveryDelayEl = document.getElementById("bsDeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("bsDeliveryDelayMessage");
    var delayDateWrap = document.getElementById("bsDelayDateWrap");
    var delayDateInput = document.getElementById("bsDelayDate");
    var prevBtn = document.getElementById("bsGalleryPrev");
    var nextBtn = document.getElementById("bsGalleryNext");
    var zoomBtn = document.getElementById("bsGalleryZoom");
    var lightbox = document.getElementById("bsLightbox");
    var lightboxImage = document.getElementById("bsLightboxImage");
    var lightboxClose = document.getElementById("bsLightboxClose");
    var screenSizeEl = document.getElementById("bsDetailEyebrow");
    var titleEl = document.getElementById("bsDetailTitle");
    var starsEl = document.getElementById("bsDetailStars");
    var reviewCountEl = document.getElementById("bsDetailReviewCount");
    var priceEl = document.getElementById("bsDetailPrice");
    var prevPriceEl = document.getElementById("bsDetailPrevPrice");
    var monthlyEl = document.getElementById("bsDetailMonthly");
    var descriptionEl = document.getElementById("bsDetailDescription");
    var deliveryEl = document.getElementById("bsDetailDelivery");
    var warrantyEl = document.getElementById("bsDetailWarranty");
    var returnsEl = document.getElementById("bsDetailReturns");
    var relatedGrid = document.getElementById("bsRelatedGrid");
    var qtyValueEl = document.getElementById("bsQtyValue");
    var qtyMinus = document.getElementById("bsQtyMinus");
    var qtyPlus = document.getElementById("bsQtyPlus");
    var addBtn = document.getElementById("bsAddToCart");
    var messageEl = document.getElementById("bsPurchaseMessage");

    var currentProduct = null;

    function currentSlug() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    function currentPrice(product) {
      var addons = bsState.assembly === "yes" ? ASSEMBLY_PRICE : 0;
      return bsSizePrice(product, bsState.selectedSize) + addons;
    }

    // Shared helper for the five new single-select option groups — each
    // is a plain group of .mt-option-pill buttons where exactly one
    // choice can be active at a time.
    function initRadioPillGroup(container, stateKey, messageEl2, onSelect) {
      if (!container) return;
      Array.prototype.forEach.call(container.querySelectorAll(".mt-option-pill"), function (btn) {
        btn.addEventListener("click", function () {
          bsState[stateKey] = btn.dataset.value;
          Array.prototype.forEach.call(container.querySelectorAll(".mt-option-pill"), function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          if (messageEl2) messageEl2.textContent = "";
          if (onSelect) onSelect(btn.dataset.value);
        });
      });
    }

    initRadioPillGroup(ottomanStorageEl, "ottomanStorage", ottomanStorageMsg);
    initRadioPillGroup(footstoolEl, "footstoolBlanketBox", footstoolMsg);
    initRadioPillGroup(headboardCustomEl, "headboardCustom", headboardCustomMsg);
    initRadioPillGroup(assemblyEl, "assembly", assemblyMsg, function () {
      if (currentProduct) renderPrice(currentProduct);
    });
    initRadioPillGroup(deliveryDelayEl, "deliveryDelay", deliveryDelayMsg, function (value) {
      if (delayDateWrap) delayDateWrap.hidden = value !== "yes";
    });

    if (customRequestEl) {
      customRequestEl.addEventListener("input", function () {
        bsState.customRequest = customRequestEl.value;
      });
    }

    if (delayDateInput) {
      delayDateInput.addEventListener("change", function () {
        bsState.deliveryDate = delayDateInput.value;
      });
    }

    function renderGallery(product) {
      var images = bsGalleryImages(product);
      mainImage.src = images[bsState.imageIndex] || images[0];
      mainImage.alt = product.name;

      // When only one real photo exists for this product, show it
      // repeated across a few thumbnail slots so the gallery strip has
      // its normal shape — using only the real, existing image.
      var thumbImages = images.length > 1 ? images : [images[0], images[0], images[0]];

      thumbsWrap.innerHTML = "";
      thumbImages.forEach(function (src, index) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "";
        thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
        var img = document.createElement("img");
        img.src = src;
        img.alt = "";
        img.loading = "lazy";
        if (index === bsState.imageIndex || (images.length <= 1 && index === 0)) img.classList.add("is-active");
        thumb.appendChild(img);
        thumb.addEventListener("click", function () {
          if (images.length > 1) {
            bsState.imageIndex = index;
            renderGallery(product);
          }
        });
        thumbsWrap.appendChild(thumb);
      });
      prevBtn.hidden = images.length < 2;
      nextBtn.hidden = images.length < 2;
    }

    var sizeBlockEl = document.getElementById("bsSizeBlock");
    var sizeOptionsEl = document.getElementById("bsSizeOptions");
    var sizeMessageEl = document.getElementById("bsSizeMessage");

    // ---- Selected-size price (shown directly below the size buttons) ----
    // Always the price of the size that is currently selected; nothing
    // while no size is selected. The crossed-out price is only shown for
    // the size the stored oldPrice belongs to (no price difference) and
    // only when it is higher than the price.
    // ---- Price area: selected size, current price, crossed-out old
    // price, "% off" and monthly amount ----
    // Same presentation on every product page. Nothing here changes a
    // price: every number comes from this page's existing price logic.
    // - Old price: only the real old/compare-at price of the selected size
    //   (API compare_at_price, or this file's own fallback rule). None ->
    //   no crossed-out price and no "% off".
    // - Paid add-ons (e.g. Assembly): the old price belongs to the size
    //   price only, so it stays on the size-price line and is not shown
    //   next to the final price while an add-on is included.
    // - "% off" = round((old - price) / old * 100), from real prices only.
    // - Monthly = final displayed price / 12, rounded up to the next whole
    //   pound (the rule every existing "or from £X/month" value follows,
    //   e.g. £249 -> £21). Add-ons included. No finance provider named.
    function rbDiscountPercent(oldPrice, price) {
      if (!oldPrice || !price || oldPrice <= price) return null;
      var pct = Math.round(((oldPrice - price) / oldPrice) * 100);
      return pct > 0 ? pct : null;
    }

    function rbMonthlyAmount(price) {
      // In pence, so e.g. 300 / 12 stays exactly 25.
      return Math.ceil(Math.round(price * 100) / 1200);
    }

    // "% off" text beside a crossed-out price (created once, by script,
    // so no HTML/CSS file has to change).
    function rbDiscountEl(container, afterEl) {
      if (!container) return null;
      var el = container.querySelector("[data-rb-discount]");
      if (!el) {
        el = document.createElement("span");
        el.setAttribute("data-rb-discount", "");
        el.style.marginLeft = "0.5rem";
        el.style.fontSize = "0.8rem";
        el.style.fontWeight = "600";
        if (afterEl && afterEl.parentNode === container) {
          container.insertBefore(el, afterEl.nextSibling);
        } else {
          container.appendChild(el);
        }
      }
      return el;
    }

    // Label of the size button that is currently selected, exactly as it
    // appears on the button (e.g. "Double 4ft 6\"").
    function rbSelectedSizeLabel(sizeOptionsContainer) {
      if (!sizeOptionsContainer) return "";
      var btn = sizeOptionsContainer.querySelector('[aria-pressed="true"], .is-active');
      return btn ? btn.textContent.trim() : "";
    }

    // "Selected: Double 4ft 6"" line just above the size buttons.
    function rbRenderSizeLabel(sizeOptionsContainer, sizeKey) {
      if (!sizeOptionsContainer || !sizeOptionsContainer.parentNode) return;
      var labelEl = sizeOptionsContainer.previousElementSibling;
      if (!labelEl || !labelEl.hasAttribute("data-rb-size-label")) {
        labelEl = document.createElement("p");
        labelEl.setAttribute("data-rb-size-label", "");
        labelEl.setAttribute("aria-live", "polite");
        labelEl.style.margin = "0 0 0.5rem";
        labelEl.style.fontSize = "0.85rem";
        labelEl.style.fontWeight = "600";
        sizeOptionsContainer.parentNode.insertBefore(labelEl, sizeOptionsContainer);
      }
      function update() {
        var label = sizeKey ? (rbSelectedSizeLabel(sizeOptionsContainer) || String(sizeKey)) : "";
        labelEl.textContent = label ? "Selected: " + label : "";
        labelEl.hidden = !label;
      }
      update();
      // When a product first opens, the price is drawn just before its
      // size buttons are, so read the button label again once they exist.
      setTimeout(update, 0);
    }

    // o = { priceEl, prevEl, monthlyEl, finalPrice, sizePrice, oldPrice,
    //       sizeKey, sizeOptions, sizeRow, money, noSizeLabel }
    function rbUpdatePriceArea(o) {
      var validOld = (o.oldPrice && o.oldPrice > o.sizePrice) ? o.oldPrice : null;
      var hasAddons = Math.round(o.finalPrice * 100) !== Math.round(o.sizePrice * 100);

      // Main (final) price: crossed-out old price + "% off" only while no
      // paid add-on is included.
      var mainOld = (validOld && !hasAddons) ? validOld : null;
      if (o.prevEl) {
        o.prevEl.textContent = mainOld ? o.money(mainOld) : "";
        var mainPctEl = rbDiscountEl(o.prevEl.parentNode, o.prevEl);
        var mainPct = rbDiscountPercent(mainOld, o.finalPrice);
        if (mainPctEl) mainPctEl.textContent = mainPct ? mainPct + "% off" : "";
      }

      // Monthly amount from the final displayed price. Pages without a
      // monthly line get one right under the main price row.
      var monthlyEl = o.monthlyEl;
      if (!monthlyEl && o.priceEl && o.priceEl.parentNode && o.priceEl.parentNode.parentNode) {
        var row = o.priceEl.parentNode;
        monthlyEl = row.nextElementSibling && row.nextElementSibling.hasAttribute("data-rb-monthly")
          ? row.nextElementSibling : null;
        if (!monthlyEl) {
          monthlyEl = document.createElement("p");
          monthlyEl.className = "product-card__monthly bb-modal__monthly";
          monthlyEl.setAttribute("data-rb-monthly", "");
          row.parentNode.insertBefore(monthlyEl, row.nextSibling);
        }
      }
      if (monthlyEl && typeof o.finalPrice === "number" && isFinite(o.finalPrice) && o.finalPrice > 0) {
        monthlyEl.textContent = "or from £" + rbMonthlyAmount(o.finalPrice) + "/month";
      }

      // Size-price line (below the size buttons): selected size, size
      // price, its real old price and "% off".
      if (o.sizeRow) {
        var rowPctEl = rbDiscountEl(o.sizeRow, null);
        var rowPct = o.sizeKey ? rbDiscountPercent(validOld, o.sizePrice) : null;
        if (rowPctEl) rowPctEl.textContent = rowPct ? rowPct + "% off" : "";
        if (!o.noSizeLabel) rbRenderSizeLabel(o.sizeOptions, o.sizeKey);
      }
    }

    var sizePriceRow = null;
    function renderSelectedSizePrice(sizeKey, sizePrice, oldPrice) {
      if (!sizeOptionsEl || !sizeOptionsEl.parentNode) return;
      if (!sizePriceRow) {
        sizePriceRow = document.createElement("div");
        sizePriceRow.className = "bs-detail__price-row";
        sizePriceRow.setAttribute("data-size-price", "");
        sizePriceRow.setAttribute("aria-live", "polite");
        sizePriceRow.style.marginTop = "0.75rem";
        sizePriceRow.innerHTML =
          '<span class="bs-detail__price"></span>' +
          '<span class="product-card__price-prev"></span>';
      }
      if (sizeOptionsEl.nextSibling !== sizePriceRow) {
        sizeOptionsEl.parentNode.insertBefore(sizePriceRow, sizeOptionsEl.nextSibling);
      }
      if (!sizeKey) {
        sizePriceRow.style.display = "none";
        return;
      }
      sizePriceRow.style.display = "";
      sizePriceRow.children[0].textContent = money(sizePrice);
      sizePriceRow.children[1].textContent =
        (oldPrice && oldPrice > sizePrice) ? money(oldPrice) : "";
    }

    function renderSizeOptions(product) {
      if (!sizeBlockEl || !sizeOptionsEl) return;
      var info = bsSizeInfo(product);
      sizeOptionsEl.innerHTML = "";
      if (sizeMessageEl) sizeMessageEl.textContent = "";
      if (!info) {
        sizeBlockEl.hidden = true;
        return;
      }
      sizeBlockEl.hidden = false;
      info.sizes.forEach(function (size, index) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "bs-option-pill";
        btn.setAttribute("aria-pressed", String(bsState.selectedSize === size));
        btn.textContent = info.labels[index] || size;
        btn.addEventListener("click", function () {
          bsState.selectedSize = size;
          if (sizeMessageEl) sizeMessageEl.textContent = "";
          qsa(".bs-option-pill", sizeOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          renderPrice(product);
        });
        sizeOptionsEl.appendChild(btn);
      });
    }

    function renderPrice(product) {
      priceEl.textContent = money(currentPrice(product));
      var sizePrice = bsSizePrice(product, bsState.selectedSize);
      // The stored oldPrice belongs to the first (cheapest) size only.
      var info = bsSizeInfo(product);
      var isBaseSize = !bsState.selectedSize || !info || !info.prices || bsState.selectedSize === info.sizes[0];
      var validOldPrice = (isBaseSize && product.oldPrice && product.oldPrice > sizePrice) ? product.oldPrice : null;
      // Small Double / Double / King / Super King: old price from
      // BS_SIZE_OLD_PRICES (Single keeps its existing old price).
      var listedOld = (bsState.selectedSize && bsState.selectedSize !== "Single" && BS_SIZE_OLD_PRICES[product.slug])
        ? BS_SIZE_OLD_PRICES[product.slug][bsState.selectedSize] : null;
      if (typeof listedOld === "number") validOldPrice = listedOld > sizePrice ? listedOld : null;
      prevPriceEl.textContent = validOldPrice ? money(validOldPrice) : "";
      renderSelectedSizePrice(bsSizeInfo(product) ? bsState.selectedSize : null, sizePrice, validOldPrice);
      // Price area: size label, old price, "% off" and monthly amount.
      rbUpdatePriceArea({
        priceEl: priceEl, prevEl: prevPriceEl, monthlyEl: monthlyEl,
        finalPrice: currentPrice(product), sizePrice: sizePrice, oldPrice: validOldPrice,
        sizeKey: bsSizeInfo(product) ? bsState.selectedSize : null, sizeOptions: sizeOptionsEl, sizeRow: sizePriceRow,
        money: money
      });
    }

    function renderRelated(product) {
      relatedGrid.innerHTML = "";
      var others = BS_PRODUCTS.filter(function (p) { return p.slug !== product.slug; });
      var related = others.slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + money(p.oldPrice) + '</span>' : "";
        var card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="best-sellers.html#/' + p.slug + '">' +
              '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="best-sellers.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
            '<div class="product-card__rating">' +
              '<span class="product-card__no-reviews">No reviews yet</span>' +
            '</div>' +
            '<div class="product-card__price-row">' +
              '<span class="product-card__price">' + money(p.price) + '</span>' + prevHtml +
            '</div>' +
          '</div>';
        relatedGrid.appendChild(card);
      });
    }

    function renderDetail(product) {
      document.title = product.name + " | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) descTag.setAttribute("content", product.name + " \u2014 " + product.description);
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/best-sellers.html#/" + product.slug);

      breadcrumbName.textContent = product.name;
      screenSizeEl.textContent = "Best Seller";
      titleEl.textContent = product.name;
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;
      deliveryEl.textContent = "Free Mainland UK delivery. Delivery charges may vary for selected UK regions and remote postcodes.";
      warrantyEl.textContent = "24 month warranty";
      returnsEl.textContent = "Easy returns";

      bsState.imageIndex = 0;
      var sizeInfo = bsSizeInfo(product);
      bsState.selectedSize = (sizeInfo && sizeInfo.defaultSize) || null;
      bsState.quantity = 1;
      qtyValueEl.textContent = "1";
      messageEl.textContent = "";
      messageEl.classList.remove("is-error");

      bsState.ottomanStorage = null;
      bsState.footstoolBlanketBox = null;
      bsState.headboardCustom = null;
      bsState.customRequest = "";
      bsState.assembly = null;
      bsState.deliveryDelay = null;
      bsState.deliveryDate = "";
      [ottomanStorageEl, footstoolEl, headboardCustomEl, assemblyEl, deliveryDelayEl].forEach(function (group) {
        if (!group) return;
        Array.prototype.forEach.call(group.querySelectorAll(".mt-option-pill"), function (el) {
          el.setAttribute("aria-pressed", "false");
        });
      });
      [ottomanStorageMsg, footstoolMsg, headboardCustomMsg, assemblyMsg, deliveryDelayMsg].forEach(function (msg) {
        if (msg) msg.textContent = "";
      });
      if (customRequestEl) customRequestEl.value = "";
      if (delayDateInput) delayDateInput.value = "";
      if (delayDateWrap) delayDateWrap.hidden = true;

      currentProduct = product;
      renderGallery(product);
      renderSizeOptions(product);
      renderPrice(product);
      renderRelated(product);
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "Best Sellers | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) descTag.setAttribute("content", "Shop our best-selling handmade beds at Rabbora Living, available in multiple UK sizes and fabrics with a 24-month warranty.");
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/best-sellers.html");
    }

    function showNotFound() {
      categoryView.hidden = true;
      detailView.hidden = true;
      notFoundView.hidden = false;
      document.title = "Bed Not Found | Rabbora Living";
    }

    // Fabric Colour — updated to the current, real Rabbora Fabric
    // Samples collection (95 colours across 10 groups, the same
    // verified real fabric/*.jfif paths used throughout the site),
    // replacing the old catalog with broken image paths.
    function renderFabrics() {
      if (!fabricsEl) return;
      fabricsEl.innerHTML = "";

      BS_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl2 = document.createElement("p");
        titleEl2.className = "bb-modal__fabric-collection-title";
        titleEl2.textContent = collection.name;
        groupEl.appendChild(titleEl2);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric) {
          var isSelected = bsState.selectedFabric === fabric.name;
          if (bsState.selectedFabric === null && collection === BS_FABRIC_COLLECTIONS[0] && fabric === collection.fabrics[0]) {
            bsState.selectedFabric = fabric.name;
            isSelected = true;
          }

          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(isSelected));
          btn.setAttribute("aria-label", "Select " + fabric.name);
          btn.innerHTML =
            '<span class="fabric-swatch__ring">' +
              '<img src="' + fabric.image + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" />' +
              '<span class="fabric-swatch__check" aria-hidden="true">' +
                '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</span>' +
            '</span>' +
            '<span class="fabric-swatch__name">' + fabric.name + '</span>';

          btn.addEventListener("click", function () {
            var alreadySelected = bsState.selectedFabric === fabric.name;

            Array.prototype.forEach.call(fabricsEl.querySelectorAll(".fabric-swatch"), function (el) {
              el.setAttribute("aria-pressed", "false");
            });

            if (alreadySelected) {
              bsState.selectedFabric = null;
            } else {
              bsState.selectedFabric = fabric.name;
              btn.setAttribute("aria-pressed", "true");
            }
          });

          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricsEl.appendChild(groupEl);
      });
    }

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      bsState.selectedFabric = null;
      renderDetail(product);
      renderFabrics();
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    function handleRoute() {
      var hash = window.location.hash;
      if (!hash || hash === "#") { showCategory(); return; }
      var slug = hash.replace(/^#\/?/, "");
      if (!slug) { showCategory(); return; }
      var product = BS_PRODUCTS_BY_SLUG[slug];
      if (product) { showDetail(product); } else { showNotFound(); }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = bsGalleryImages(currentProduct);
        bsState.imageIndex = (bsState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = bsGalleryImages(currentProduct);
        bsState.imageIndex = (bsState.imageIndex + 1) % images.length;
        renderGallery(currentProduct);
      });
    }

    function openLightbox() {
      if (!lightbox || !lightboxImage) return;
      lightboxImage.src = mainImage.src;
      lightboxImage.alt = mainImage.alt;
      lightbox.hidden = false;
    }

    if (zoomBtn) {
      zoomBtn.addEventListener("click", openLightbox);
    }

    // Clicking the main photo itself also opens it full screen.
    if (mainImage) {
      mainImage.style.cursor = "zoom-in";
      mainImage.addEventListener("click", openLightbox);
    }

    if (lightboxClose) lightboxClose.addEventListener("click", function () { lightbox.hidden = true; });
    if (lightbox) {
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) lightbox.hidden = true;
      });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox && !lightbox.hidden) lightbox.hidden = true;
    });

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (bsState.quantity > 1) {
          bsState.quantity -= 1;
          qtyValueEl.textContent = String(bsState.quantity);
        }
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        bsState.quantity += 1;
        qtyValueEl.textContent = String(bsState.quantity);
      });
    }

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;

        // Each required new option shows its own inline message right
        // next to that option (not just one generic message at the
        // bottom), checked top-to-bottom in the order they appear.
        if (bsSizeInfo(currentProduct) && !bsState.selectedSize) {
          if (sizeMessageEl) sizeMessageEl.textContent = "Please select a size.";
          sizeOptionsEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!bsState.ottomanStorage) {
          ottomanStorageMsg.textContent = "Please select an option.";
          ottomanStorageEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!bsState.footstoolBlanketBox) {
          footstoolMsg.textContent = "Please select an option.";
          footstoolEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!bsState.headboardCustom) {
          headboardCustomMsg.textContent = "Please select an option.";
          headboardCustomEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!bsState.assembly) {
          assemblyMsg.textContent = "Please select an option.";
          assemblyEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!bsState.deliveryDelay) {
          deliveryDelayMsg.textContent = "Please select an option.";
          deliveryDelayEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        var unitPrice = currentPrice(currentProduct);

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "best-sellers.html#/" + currentProduct.slug,
              image: currentProduct.image || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "Best Sellers",
              variant: {
                size: bsSizeInfo(currentProduct) ? bsState.selectedSize : null,
                fabric: bsState.selectedFabric || null,
                ottomanStorage: bsState.ottomanStorage,
                footstoolBlanketBox: bsState.footstoolBlanketBox,
                headboardHeight: bsState.headboardCustom,
                customRequest: bsState.customRequest || null,
                assembly: bsState.assembly,
                assemblyPrice: bsState.assembly === "yes" ? ASSEMBLY_PRICE : 0,
                deliveryDelay: bsState.deliveryDelay,
                deliveryDate: bsState.deliveryDelay === "yes" ? (bsState.deliveryDate || null) : null
              }
            },
            bsState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Basket clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + bsState.quantity + " \u00d7 " + currentProduct.name +
          " to your basket \u2014 " + money(unitPrice * bsState.quantity) + ".";
      });
    }
  }

  /* ---- Review data cleanup: no verified real reviews exist yet, so
     replace any star/count display with an honest "No reviews yet"
     message instead of showing invented numbers. Excludes the detail
     view's own rating element (.bs-detail__rating), which is
     populated separately by renderDetail() once a product is opened. ---- */
  function cleanupFakeRatings() {
    document.querySelectorAll(".product-card__rating:not(.bs-detail__rating)").forEach(function (el) {
      el.innerHTML = '<span class="product-card__no-reviews">No reviews yet</span>';
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cleanupFakeRatings();
    initToolbar();
    initViewToggle();
    initFaq();
    initDetail();
  });
})();