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
    "price": 299.0,
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
    "monthly": 62,
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
    "price": 299.0,
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
    "monthly": 24,
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
    "monthly": 58,
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
    "monthly": 24,
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
    "price": 299.0,
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
    "monthly": 24,
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
    "price": 349.0,
    "oldPrice": 420.0,
    "monthly": 29,
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
    "monthly": 24,
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
    "price": 399.0,
    "oldPrice": 499.0,
    "monthly": 33,
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
    "monthly": 54,
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
    "price": 299.0,
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
    "price": 299.0,
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
    "monthly": 62,
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
    "price": 299.0,
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
    "monthly": 62,
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
    "price": 399.0,
    "oldPrice": 499.0,
    "monthly": 33,
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
    "monthly": 37,
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
    "monthly": 62,
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
    "monthly": 32,
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
    "price": 299.0,
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
    "monthly": 24,
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
      return product.price + addons;
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
      var images = product.gallery && product.gallery.length ? product.gallery : [product.image];
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

    function renderPrice(product) {
      priceEl.textContent = money(currentPrice(product));
      prevPriceEl.textContent = product.oldPrice ? money(product.oldPrice) : "";
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
      bsState.selectedSize = null;
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
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        bsState.imageIndex = (bsState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        bsState.imageIndex = (bsState.imageIndex + 1) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (zoomBtn) {
      zoomBtn.addEventListener("click", function () {
        lightboxImage.src = mainImage.src;
        lightboxImage.alt = mainImage.alt;
        lightbox.hidden = false;
      });
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