/* =========================================================
   RABBORA LIVING — STORAGE BEDS WITH DRAWERS
   ---------------------------------------------------------
   Self-contained data + page logic for drawer-beds.html.
   Loaded AFTER script.js (which still runs the shared header,
   mobile nav, search, dropdown, wishlist hearts, etc. — none
   of that is touched or duplicated here).

   ===============================
   EDIT YOUR PRODUCTS HERE
   ===============================
   Every field below was taken directly from the product cards
   already in drawer-beds.html — nothing here was invented. To
   change a product's name, price, description or image, edit
   the matching field. There is no separate "size", "features"
   or "dimensions" data for these products anywhere in the
   project yet, so the detail view below only shows what's
   genuinely known and hides those sections rather than
   guessing at values.
   ========================================================= */

(function () {
  "use strict";

  var SD_PRODUCTS_LIST = [
    {
      "slug": "storage-drawer-1",
      "name": "Rabbora Lyon Storage Bed",
      "description": "A sophisticated and practical storage bed designed to bring elegant character to the bedroom while providing comfortable sleeping and convenient drawer storage.",
      "image": "images/storage-drawers/img-1.png",
      "images": [
        "drawar/1.jfif",
        "drawar/2.jfif",
        "drawar/3.jfif"
      ],
            "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "21% off",
      "rating": 4,
      "reviews": 22,
      "price": 294.0,
      "oldPrice": 380.0,
      "monthly": 25,
      "drawers": 2,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-2",
      "name": "Rabbora Mona Lisa Storage Bed",
      "description": "An elegant bedroom centrepiece combining graceful styling and comfortable sleeping with practical drawer storage for everyday convenience.",
      "image": "images/storage-drawers/img-2.png",
      "images": [
        "drawar/4.jfif",
        "drawar/5.jfif",
        "drawar/6.jfif"
      ],
            "shortInfo": "4 spacious drawers built into a tailored, handmade frame.",
      "badge": "21% off",
      "rating": 5,
      "reviews": 31,
      "price": 294.0,
      "oldPrice": 380.0,
      "monthly": 25,
      "drawers": 4,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-3",
      "name": "Rabbora Art Deco Storage Bed",
      "description": "A refined Art Deco-inspired design created to add sophisticated character to the bedroom while offering comfortable sleeping and useful drawer storage.",
      "image": "images/storage-drawers/img-3.png",
      "images": [
        "drawar/7.jfif",
        "drawar/8.jfif",
        "drawar/9.jfif"
      ],
            "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "21% off",
      "rating": 5,
      "reviews": 40,
      "price": 294.0,
      "oldPrice": 380.0,
      "monthly": 25,
      "drawers": 2,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-4",
      "name": "Rabbora Golden Skyline Storage Bed",
      "description": "A striking bedroom design created to make an elegant statement while combining comfortable sleeping with the practical convenience of drawer storage.",
      "image": "images/storage-drawers/img-4.png",
      "images": [
        "drawar/10.jfif",
        "drawar/11.jfif",
        "drawar/12.jfif"
      ],
            "shortInfo": "4 spacious drawers built into a tailored, handmade frame.",
      "badge": "20% off",
      "rating": 5,
      "reviews": 49,
      "price": 394.0,
      "oldPrice": 499.0,
      "monthly": 34,
      "drawers": 4,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-5",
      "name": "Rabbora Dover Designer Storage Bed",
      "description": "A stylish designer storage bed created to bring refined bedroom character together with comfortable sleeping and convenient drawer storage.",
      "image": "images/storage-drawers/img-5.png",
      "images": [
        "drawar/13.jfif",
        "drawar/14.jfif",
        "drawar/15.jfif"
      ],
            "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "25% off",
      "rating": 4,
      "reviews": 58,
      "price": 294.0,
      "oldPrice": 400.0,
      "monthly": 25,
      "drawers": 2,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-6",
      "name": "Rabbora Brooklyn Storage Bed",
      "description": "A clean and contemporary storage bed designed to give the bedroom a sophisticated appearance while providing comfortable sleeping and practical drawer storage.",
      "image": "images/storage-drawers/img-6.png",
      "images": [
        "drawar/16.jfif",
        "drawar/17.jfif",
        "drawar/18.jfif"
      ],
            "shortInfo": "4 spacious drawers built into a tailored, handmade frame.",
      "badge": "21% off",
      "rating": 5,
      "reviews": 67,
      "price": 304.0,
      "oldPrice": 380.0,
      "monthly": 25,
      "drawers": 4,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-7",
      "name": "Rabbora Mayfair Storage Bed",
      "description": "A refined bedroom centrepiece designed to bring timeless elegance and comfortable sleeping together with the everyday practicality of drawer storage.",
      "image": "images/storage-drawers/img-7.png",
      "images": [
        "drawar/19.jfif",
        "drawar/20.jfif",
        "drawar/21.jfif"
      ],
            "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "21% off",
      "rating": 5,
      "reviews": 76,
      "price": 304.0,
      "oldPrice": 380.0,
      "monthly": 25,
      "drawers": 2,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-8",
      "name": "Rabbora Toronto Lux Storage Bed",
      "description": "A premium-looking storage bed created to bring sophisticated character and comfortable sleeping together with convenient drawer storage for a well-organised bedroom.",
      "image": "images/storage-drawers/img-8.png",
      "images": [
        "drawar/22.jfif",
        "drawar/23.jfif",
        "drawar/24.jfif"
      ],
            "shortInfo": "4 spacious drawers built into a tailored, handmade frame.",
      "badge": "20% off",
      "rating": 5,
      "reviews": 85,
      "price": 404.0,
      "oldPrice": 499.0,
      "monthly": 34,
      "drawers": 4,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-9",
      "name": "Rabbora Virginia Storage Bed",
      "description": "A versatile and elegant storage bed designed to provide comfortable everyday sleeping while helping keep the bedroom organised with convenient drawer storage.",
      "image": "images/storage-drawers/img-9.png",
      "images": [
        "drawar/25.jfif",
        "drawar/26.jfif",
        "drawar/27.jfif"
      ],
      "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "19% off",
      "rating": 4,
      "reviews": 94,
      "price": 304.0,
      "oldPrice": 370.0,
      "monthly": 25,
      "drawers": 2,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    },
    {
      "slug": "storage-drawer-10",
      "name": "Rabbora Kensington Storage Bed",
      "description": "A refined storage bed offering a comfortable, well-proportioned frame with the everyday practicality of built-in drawer storage.",
      "image": "images/storage-drawers/img-9.png",
      "images": [
        "drawar/28.jfif",
        "drawar/29.jfif",
        "drawar/30.jfif"
      ],
      "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "19% off",
      "rating": 4,
      "reviews": 0,
      "price": 299.0,
      "oldPrice": 370.0,
      "monthly": 25,
      "drawers": 2,
      "warranty": "24-month warranty",
      "delivery": "Handmade to order, delivered boxed for home assembly"
    }
  ];

  var SD_PRODUCTS = {};
  SD_PRODUCTS_LIST.forEach(function (p) {
    SD_PRODUCTS[p.slug] = p;
  });

var SD_FABRIC_COLLECTIONS = [
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

var SD_FABRIC_COLLECTIONS_FLAT = [];
SD_FABRIC_COLLECTIONS.forEach(function (collection) {
  collection.fabrics.forEach(function (fabric) {
    SD_FABRIC_COLLECTIONS_FLAT.push(fabric);
  });
});

  function money(v) {
    return "\u00A3" + v.toFixed(2);
  }

  function stars(n) {
    var full = Math.round(n);
    return "\u2605\u2605\u2605\u2605\u2605".slice(0, full) + "\u2606\u2606\u2606\u2606\u2606".slice(0, 5 - full);
  }

  // Size options for every Storage Drawer bed, as supplied by the site
  // owner. No size-specific prices exist, so the size does not change
  // the price (same as Bed Frames and Solid Base Ottomans).
  var SD_SIZE_KEYS = ["Single", "Small Double", "Double", "King", "Super King"];
  var SD_SIZE_LABELS = ["Single 3ft", "Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"];

  // Price of each size, per bed (site owner's Rabbora price list,
  // 26 Sep 2026). "storage-drawer-10" (Kensington) has no size prices
  // yet, so every size keeps that bed's single price.
  var SD_SIZE_PRICES = {
    "storage-drawer-1": { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 } /* Lyon */,
    "storage-drawer-2": { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 } /* Mona Lisa */,
    "storage-drawer-3": { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 } /* Art Deco */,
    "storage-drawer-4": { "Single": 394, "Small Double": 444, "Double": 414, "King": 524, "Super King": 564 } /* Golden Skyline */,
    "storage-drawer-5": { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 484 } /* Dover */,
    "storage-drawer-6": { "Single": 304, "Small Double": 394, "Double": 404, "King": 454, "Super King": 490 } /* Brooklyn */,
    "storage-drawer-7": { "Single": 304, "Small Double": 394, "Double": 404, "King": 454, "Super King": 490 } /* Mayfair */,
    "storage-drawer-8": { "Single": 404, "Small Double": 455, "Double": 455, "King": 475, "Super King": 525 } /* Toronto Lux */,
    "storage-drawer-9": { "Single": 304, "Small Double": 384, "Double": 394, "King": 434, "Super King": 454 } /* Virginia */
  };
  // Old (original / "was") price for each size, same layout as SD_SIZE_PRICES
  // above. Single 3ft is not listed: it keeps its existing old price. The
  // other sizes are worked out from their existing sale price:
  //   Small Double 21% off -> old = sale / 0.79
  //   Double       28% off -> old = sale / 0.72
  //   King         29% off -> old = sale / 0.71
  //   Super King   29% off -> old = sale / 0.71
  // Any number here can be changed in VS Code; a size left out shows the
  // page's old price exactly as before.
  var SD_SIZE_OLD_PRICES = {
    "storage-drawer-1": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 } /* Lyon */,
    "storage-drawer-2": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 } /* Mona Lisa */,
    "storage-drawer-3": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 } /* Art Deco */,
    "storage-drawer-4": { "Small Double": 562.03, "Double": 575, "King": 738.03, "Super King": 794.37 } /* Golden Skyline */,
    "storage-drawer-5": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 681.69 } /* Dover */,
    "storage-drawer-6": { "Small Double": 498.73, "Double": 561.11, "King": 639.44, "Super King": 690.14 } /* Brooklyn */,
    "storage-drawer-7": { "Small Double": 498.73, "Double": 561.11, "King": 639.44, "Super King": 690.14 } /* Mayfair */,
    "storage-drawer-8": { "Small Double": 575.95, "Double": 631.94, "King": 669.01, "Super King": 739.44 } /* Toronto Lux */,
    "storage-drawer-9": { "Small Double": 486.08, "Double": 547.22, "King": 611.27, "Super King": 639.44 } /* Virginia */,
    "storage-drawer-10": { "Small Double": 378.48, "Double": 415.28, "King": 421.13, "Super King": 421.13 } /* Kensington: one price for every size */
  };


  function sdSizePrice(product, size) {
    // A product loaded from the backend API carries its own size prices.
    if (product && size && product.sizePrices && typeof product.sizePrices[size] === "number") return product.sizePrices[size];
    var prices = product && SD_SIZE_PRICES[product.slug];
    if (prices && size && typeof prices[size] === "number") return prices[size];
    return product.price;
  }

  // The stored oldPrice is the original price of the Single size (the
  // "from" price). It is only shown for Single (or before a size is
  // chosen) on beds with size prices, and only when it is higher.
  function sdValidOldPrice(product, size, sizePrice) {
    // Small Double / Double / King / Super King: old price from the list above.
    var listedOld = (product && size && size !== "Single" && SD_SIZE_OLD_PRICES[product.slug])
      ? SD_SIZE_OLD_PRICES[product.slug][size] : null;
    if (typeof listedOld === "number") return listedOld > sizePrice ? listedOld : null;
    if (product && product.sizeOldPrices) {
      // Product from the backend API: each size has its own compare-at price.
      var apiOldPrice = size ? product.sizeOldPrices[size] : product.oldPrice;
      return (apiOldPrice && apiOldPrice > sizePrice) ? apiOldPrice : null;
    }
    if (!product || !product.oldPrice || product.oldPrice <= sizePrice) return null;
    if (SD_SIZE_PRICES[product.slug] && size && size !== "Single") return null;
    return product.oldPrice;
  }

  var sdState = {
    selectedSize: null,
    imageIndex: 0,
    quantity: 1,
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

  function initDetail() {
    var categoryView = document.getElementById("sdCategoryView");
    var detailView = document.getElementById("sdDetailView");
    var notFoundView = document.getElementById("sdNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("sdDetailBreadcrumbName");
    var mainImage = document.getElementById("sdGalleryMainImage");
    var imagePlaceholder = document.getElementById("sdDetailImagePlaceholder");
    var thumbsWrap = document.getElementById("sdGalleryThumbs");
    var prevBtn = document.getElementById("sdGalleryPrev");
    var nextBtn = document.getElementById("sdGalleryNext");
    var drawerCountEl = document.getElementById("sdDetailDrawerCount");
    var titleEl = document.getElementById("sdDetailTitle");
    var starsEl = document.getElementById("sdDetailStars");
    var reviewCountEl = document.getElementById("sdDetailReviewCount");
    var priceEl = document.getElementById("sdDetailPrice");
    var prevPriceEl = document.getElementById("sdDetailPrevPrice");
    var monthlyEl = document.getElementById("sdDetailMonthly");
    var badgeBannerEl = document.getElementById("sdDetailBadgeBanner");
    var descriptionEl = document.getElementById("sdDetailDescription");
    var storageInfoEl = document.getElementById("sdDetailStorageInfo");
    var sizeOptionsBlock = document.getElementById("sdSizeOptions") ? document.getElementById("sdSizeOptions").closest(".bb-modal__fabrics") : null;
    var fabricsEl = document.getElementById("sdModalFabrics");
    var ottomanStorageEl = document.getElementById("sdOttomanStorageOptions");
    var ottomanStorageMsg = document.getElementById("sdOttomanStorageMessage");
    var footstoolEl = document.getElementById("sdFootstoolOptions");
    var footstoolMsg = document.getElementById("sdFootstoolMessage");
    var headboardCustomEl = document.getElementById("sdHeadboardCustomOptions");
    var headboardCustomMsg = document.getElementById("sdHeadboardCustomMessage");
    var customRequestEl = document.getElementById("sdCustomRequest");
    var assemblyEl = document.getElementById("sdAssemblyOptions");
    var assemblyMsg = document.getElementById("sdAssemblyMessage");
    var deliveryDelayEl = document.getElementById("sdDeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("sdDeliveryDelayMessage");
    var delayDateWrap = document.getElementById("sdDelayDateWrap");
    var delayDateInput = document.getElementById("sdDelayDate");
    var featuresBlock = document.getElementById("sdDetailFeatures") ? document.getElementById("sdDetailFeatures").closest(".bb-modal__features") : null;
    var dimensionsBlock = document.getElementById("sdDetailDimensions") ? document.getElementById("sdDetailDimensions").closest(".bb-modal__features") : null;
    var deliveryEl = document.getElementById("sdDetailDelivery");
    var warrantyEl = document.getElementById("sdDetailWarranty");
    var returnsEl = document.getElementById("sdDetailReturns");
    var relatedGrid = document.getElementById("sdRelatedGrid");
    var qtyValueEl = document.getElementById("sdQtyValue");
    var qtyMinus = document.getElementById("sdQtyMinus");
    var qtyPlus = document.getElementById("sdQtyPlus");
    var addBtn = document.getElementById("sdAddToCart");
    var buyNowBtn = document.getElementById("sdBuyNow");
    var messageEl = document.getElementById("sdPurchaseMessage");

    var currentProduct = null;

    function currentSlug() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    function renderGallery(product) {
      // Each drawer bed has its own set of real photos in product.images,
      // matching the same array-of-paths pattern used on the Mattresses
      // page. Falls back to the single card image only if that array is
      // ever empty, with prev/next and thumbs hidden in that case.
      var images = product.images && product.images.length ? product.images : [product.image];
      mainImage.src = images[sdState.imageIndex] || images[0];
      mainImage.alt = "";
      mainImage.onerror = function () {
        mainImage.hidden = true;
        if (imagePlaceholder) imagePlaceholder.hidden = false;
      };
      mainImage.onload = function () {
        mainImage.hidden = false;
        if (imagePlaceholder) imagePlaceholder.hidden = true;
      };

      thumbsWrap.innerHTML = "";
      if (images.length > 1) {
        images.forEach(function (src, index) {
          // Same structure as the Mattresses gallery: each thumbnail is a
          // button wrapping the image, so the shared .bb-modal__thumb /
          // .bb-modal__thumb img / .bb-modal__thumb.is-active CSS (already
          // defined in this stylesheet) sizes, clips and highlights it
          // the same way it does there.
          var thumb = document.createElement("button");
          thumb.type = "button";
          thumb.className = "bb-modal__thumb" + (index === sdState.imageIndex ? " is-active" : "");
          thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);

          var img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.loading = "lazy";
          img.onerror = function () { thumb.style.visibility = "hidden"; };
          thumb.appendChild(img);

          thumb.addEventListener("click", function () {
            sdState.imageIndex = index;
            renderGallery(product);
          });
          thumbsWrap.appendChild(thumb);
        });
      }
      if (prevBtn) prevBtn.hidden = images.length < 2;
      if (nextBtn) nextBtn.hidden = images.length < 2;
    }

    function renderRelated(product) {
      if (!relatedGrid) return;
      relatedGrid.innerHTML = "";
      var others = SD_PRODUCTS_LIST.filter(function (p) { return p.slug !== product.slug; });
      var sameDrawers = others.filter(function (p) { return p.drawers === product.drawers; });
      var rest = others.filter(function (p) { return p.drawers !== product.drawers; });
      var related = sameDrawers.concat(rest).slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + "</span>" : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + money(p.oldPrice) + "</span>" : "";
        var card = document.createElement("article");
        card.className = "product-card";
        card.dataset.slug = p.slug;
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="storage-drawers.html#/' + p.slug + '">' +
              '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            "</a>" + badgeHtml +
            '<button type="button" class="product-card__wishlist" data-slug="' + p.slug + '" aria-label="Add to wishlist" aria-pressed="false">' +
              '<svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true">' +
                '<path d="M10 17s-6.5-3.9-8.2-8.1C.6 6 2 3 5.1 3c1.9 0 3.4 1.1 4.9 3 1.5-1.9 3-3 4.9-3 3.1 0 4.5 3 3.3 5.9C16.5 13.1 10 17 10 17z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" />' +
              "</svg>" +
            "</button>" +
          "</div>" +
          '<div class="product-card__body">' +
            '<a href="storage-drawers.html#/' + p.slug + '" class="product-card__name">' + p.name + "</a>" +
            '<div class="product-card__rating">' +
              '<span class="product-card__no-reviews">No reviews yet</span>' +
            "</div>" +
            '<div class="product-card__price-row">' +
              '<span class="product-card__price">' + money(p.price) + "</span>" + prevHtml +
            "</div>" +
          "</div>";
        relatedGrid.appendChild(card);
      });

      // The wishlist hearts on these dynamically-added related cards
      // need their saved state reflected too, same as any other page.
      if (window.RabboraWishlist) {
        window.RabboraWishlist.syncButtons(relatedGrid);
      }
    }

    // Fabric Colour — updated to the current, real Rabbora Fabric
    // Samples collection (95 colours across 10 groups, the same
    // verified real fabric/*.jfif paths already used on Blanket Boxes,
    // Sofas, Bed Frames, Ottoman Beds, Solid Base Ottoman and High
    // Headboard Beds), replacing the old 29-colour catalog with broken
    // image paths.
    function renderFabrics() {
      if (!fabricsEl) return;
      fabricsEl.innerHTML = "";

      SD_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl2 = document.createElement("p");
        titleEl2.className = "bb-modal__fabric-collection-title";
        titleEl2.textContent = collection.name;
        groupEl.appendChild(titleEl2);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric) {
          var isSelected = sdState.selectedFabric === fabric.name;
          if (sdState.selectedFabric === null && collection === SD_FABRIC_COLLECTIONS[0] && fabric === collection.fabrics[0]) {
            sdState.selectedFabric = fabric.name;
            isSelected = true;
          }

          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(isSelected));
          btn.setAttribute("aria-label", "Select " + fabric.name);
          btn.innerHTML =
            '<span class="fabric-swatch__ring">' +
              '<img src="' + fabric.image + '" alt="' + fabric.name + ' fabric option" class="fabric-swatch__image" loading="lazy" width="56" height="56" />' +
              '<span class="fabric-swatch__check" aria-hidden="true">' +
                '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
              '</span>' +
            '</span>' +
            '<span class="fabric-swatch__name">' + fabric.name + '</span>';

          btn.addEventListener("click", function () {
            var alreadySelected = sdState.selectedFabric === fabric.name;

            Array.prototype.forEach.call(fabricsEl.querySelectorAll(".fabric-swatch"), function (el) {
              el.setAttribute("aria-pressed", "false");
            });

            if (alreadySelected) {
              sdState.selectedFabric = null;
            } else {
              sdState.selectedFabric = fabric.name;
              btn.setAttribute("aria-pressed", "true");
            }
          });

          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricsEl.appendChild(groupEl);
      });
    }

    // Assembly is the only new option with a confirmed real price
    // (£59.00) — every other new option stays £0 since no genuine
    // price data exists for them anywhere in the project.
    function currentPrice(product) {
      return sdSizePrice(product, sdState.selectedSize) + (sdState.assembly === "yes" ? ASSEMBLY_PRICE : 0);
    }

    var sizeOptionsEl = document.getElementById("sdSizeOptions");

    // ---- Selected-size price (shown directly below the size buttons) ----
    // Always the price of the size that is currently selected; nothing
    // while no size is selected. The crossed-out price is only shown
    // when the product data has a real original price higher than it.
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
        sizePriceRow.className = "bb-modal__price-row";
        sizePriceRow.setAttribute("data-size-price", "");
        sizePriceRow.setAttribute("aria-live", "polite");
        sizePriceRow.style.marginTop = "0.75rem";
        sizePriceRow.innerHTML =
          '<span class="bb-modal__price"></span>' +
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
      if (!sizeOptionsEl) return;
      sizeOptionsEl.innerHTML = "";
      // Sizes from the backend API when the product came from it;
      // otherwise the fixed SD_SIZE_KEYS / SD_SIZE_LABELS as before.
      var sizeKeys = product.availableSizes || SD_SIZE_KEYS;
      var sizeLabels = product.availableSizeLabels || SD_SIZE_LABELS;
      sizeKeys.forEach(function (size, index) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mt-option-pill";
        btn.setAttribute("aria-pressed", String(sdState.selectedSize === size));
        btn.textContent = sizeLabels[index];
        btn.addEventListener("click", function () {
          sdState.selectedSize = size;
          if (messageEl && messageEl.classList.contains("is-error")) {
            messageEl.textContent = "";
            messageEl.classList.remove("is-error");
          }
          Array.prototype.forEach.call(sizeOptionsEl.querySelectorAll(".mt-option-pill"), function (el) {
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
      var sizePrice = sdSizePrice(product, sdState.selectedSize);
      var validOldPrice = sdValidOldPrice(product, sdState.selectedSize, sizePrice);
      prevPriceEl.textContent = validOldPrice ? money(validOldPrice) : "";
      renderSelectedSizePrice(sdState.selectedSize, sizePrice, validOldPrice);
      // Price area: size label, old price, "% off" and monthly amount.
      rbUpdatePriceArea({
        priceEl: priceEl, prevEl: prevPriceEl, monthlyEl: monthlyEl,
        finalPrice: currentPrice(product), sizePrice: sizePrice, oldPrice: validOldPrice,
        sizeKey: sdState.selectedSize, sizeOptions: sizeOptionsEl, sizeRow: sizePriceRow,
        money: money
      });
    }

    // Shared helper for the five new single-select option groups —
    // each is a plain group of .mt-option-pill buttons where exactly
    // one choice can be active at a time.
    function initRadioPillGroup(container, stateKey, messageEl2, onSelect) {
      if (!container) return;
      Array.prototype.forEach.call(container.querySelectorAll(".mt-option-pill"), function (btn) {
        btn.addEventListener("click", function () {
          sdState[stateKey] = btn.dataset.value;
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
        sdState.customRequest = customRequestEl.value;
      });
    }

    if (delayDateInput) {
      delayDateInput.addEventListener("change", function () {
        sdState.deliveryDate = delayDateInput.value;
      });
    }

    function renderDetail(product) {
      document.title = product.name + " | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) {
        descTag.setAttribute("content", product.name + " \u2014 " + product.shortInfo);
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) {
        canonicalTag.setAttribute("href", "https://rabbora.co.uk/storage-drawers/" + product.slug);
      }

      breadcrumbName.textContent = product.name;
      if (drawerCountEl) drawerCountEl.textContent = product.drawers + (product.drawers === 1 ? " Drawer" : " Drawers");
      titleEl.textContent = product.name;
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      if (badgeBannerEl) {
        if (product.badge) {
          badgeBannerEl.textContent = "\u26A1 " + product.badge;
          badgeBannerEl.hidden = false;
        } else {
          badgeBannerEl.hidden = true;
        }
      }
      descriptionEl.textContent = product.shortInfo;
      if (storageInfoEl) {
        storageInfoEl.textContent = product.drawers + " drawers built into the sides of the frame, giving side-access storage without disturbing the mattress.";
      }

      // Sizes come from SD_SIZE_KEYS / SD_SIZE_LABELS above. No feature
      // list or dimensions data exists for these products yet, so that
      // section stays hidden until real data is added.
      if (sizeOptionsBlock) sizeOptionsBlock.hidden = false;
      if (featuresBlock) featuresBlock.hidden = true;
      if (dimensionsBlock) dimensionsBlock.hidden = true;

      if (deliveryEl) deliveryEl.textContent = product.delivery;
      if (warrantyEl) warrantyEl.textContent = product.warranty;
      if (returnsEl) returnsEl.textContent = "30-day easy returns on unused, unassembled beds";

      sdState.imageIndex = 0;
      sdState.selectedSize = null;
      renderSizeOptions(product);
      sdState.quantity = 1;
      sdState.selectedFabric = null;
      renderFabrics();
      if (qtyValueEl) qtyValueEl.textContent = "1";
      if (messageEl) {
        messageEl.textContent = "";
        messageEl.classList.remove("is-error");
      }

      sdState.ottomanStorage = null;
      sdState.footstoolBlanketBox = null;
      sdState.headboardCustom = null;
      sdState.customRequest = "";
      sdState.assembly = null;
      sdState.deliveryDelay = null;
      sdState.deliveryDate = "";
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

      renderPrice(product);

      currentProduct = product;
      renderGallery(product);
      renderRelated(product);
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "Storage Beds With Drawers | Practical Bedroom Storage | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) {
        descTag.setAttribute("content", "Shop storage beds with drawers at Rabbora Living. Handmade bed frames with built-in drawer storage, available in multiple UK sizes with a 24-month warranty.");
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/storage-drawers");
    }

    function showNotFound() {
      categoryView.hidden = true;
      detailView.hidden = true;
      notFoundView.hidden = false;
      document.title = "Bed Not Found | Rabbora Living";
    }

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      renderDetail(product);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    // ---- Backend Product Detail API ----
    // The detail view first asks the backend for the product. Only the
    // name, images, sizes, size prices, compare-at prices and (where this
    // page shows them) dimensions come from the API. They are merged ON TOP
    // of a copy of the existing product object from this file, so every
    // frontend-only field stays exactly as it is. If the API fails, is
    // unreachable, returns 404 or sends unexpected data, the original
    // product object from this file is used exactly as before.
    // Address from api-config.js (window.RabboraApi), which must load
    // before this file: GET <API_URL>/products/slug/<slug>.
    var RB_API_PRODUCT_URL = window.RabboraApi && typeof window.RabboraApi.url === "function"
      ? window.RabboraApi.url("/products/slug/")
      : null;
    if (!RB_API_PRODUCT_URL) {
      console.warn(
        "[Rabbora Storage Drawers] api-config.js is not loaded, so product details come from this file only. " +
        "Add <script src=\"api-config.js\"></script> before storage-drawers.js."
      );
    }
    var RB_API_TIMEOUT_MS = 4000;
    var rbApiCache = {};
    var rbApiRouteId = 0;

    function rbApiIsValid(apiProduct, slug) {
      if (!apiProduct || apiProduct.slug !== slug) return false;
      if (typeof apiProduct.name !== "string" || !apiProduct.name.trim()) return false;
      if (!Array.isArray(apiProduct.images) || apiProduct.images.length === 0) return false;
      if (!Array.isArray(apiProduct.variants) || apiProduct.variants.length === 0) return false;
      var imagesOk = apiProduct.images.every(function (img) {
        return img && typeof img.image_url === "string" && img.image_url.trim() !== "";
      });
      var variantsOk = apiProduct.variants.every(function (v) {
        return v &&
          typeof v.option_value === "string" && v.option_value !== "" &&
          typeof v.option_label === "string" && v.option_label !== "" &&
          typeof v.price === "number" && isFinite(v.price) && v.price > 0;
      });
      return imagesOk && variantsOk;
    }

    // Shallow copy, so the original product object in this file is never
    // changed (grid cards, related products and the fallback keep using it).
    function rbApiCopy(baseProduct) {
      var copy = {};
      Object.keys(baseProduct).forEach(function (key) { copy[key] = baseProduct[key]; });
      return copy;
    }

    // Size data from the API variants, in the API's sort order. When
    // needDimensions is true, every size must end up with a width/length
    // (API value, or this file's existing value) or null is returned.
    function rbApiSizeData(baseProduct, apiProduct, needDimensions) {
      var variants = apiProduct.variants.slice().sort(function (a, b) {
        return (a.sort_order || 0) - (b.sort_order || 0);
      });
      var data = {
        sizes: [], labels: [], labelMap: {}, sizePrices: {}, sizeOldPrices: {}, dimensions: {},
        images: apiProduct.images.map(function (img) { return img.image_url; })
      };
      var baseDims = baseProduct.dimensions && typeof baseProduct.dimensions === "object" ? baseProduct.dimensions : {};
      Object.keys(baseDims).forEach(function (size) { data.dimensions[size] = baseDims[size]; });
      var ok = true;
      variants.forEach(function (v) {
        data.sizes.push(v.option_value);
        data.labels.push(v.option_label);
        data.labelMap[v.option_value] = v.option_label;
        data.sizePrices[v.option_value] = v.price;
        data.sizeOldPrices[v.option_value] =
          (typeof v.compare_at_price === "number" && v.compare_at_price > v.price) ? v.compare_at_price : null;
        if (typeof v.width_cm === "number" && typeof v.length_cm === "number") {
          data.dimensions[v.option_value] = { width: v.width_cm, length: v.length_cm };
        }
        var d = data.dimensions[v.option_value];
        if (needDimensions && !(d && typeof d.width === "number" && typeof d.length === "number")) ok = false;
      });
      if (!ok) return null;
      // Base (no size selected) price: this page's own base price when one
      // of the API sizes has exactly that price (so the page shows the same
      // "from" price as before); otherwise the API product price (its
      // lowest size). The crossed-out price is that size's compare-at price.
      var baseVariant = null;
      if (typeof baseProduct.price === "number") {
        baseVariant = variants.filter(function (v) { return Math.abs(v.price - baseProduct.price) < 0.001; })[0] || null;
      }
      if (baseVariant) {
        data.price = baseVariant.price;
      } else {
        data.price = (typeof apiProduct.price === "number" && isFinite(apiProduct.price) && apiProduct.price > 0)
          ? apiProduct.price : variants[0].price;
        baseVariant = variants.filter(function (v) { return Math.abs(v.price - data.price) < 0.001; })[0] || variants[0];
      }
      data.oldPrice = data.sizeOldPrices[baseVariant.option_value];
      // Some pages keep the crossed-out price on their first size even when
      // another size is the base price; the page showed it before a size
      // was chosen, so the first size's compare-at price is used then.
      if (!data.oldPrice) {
        var firstOld = data.sizeOldPrices[variants[0].option_value];
        data.oldPrice = (firstOld && firstOld > data.price) ? firstOld : null;
      }
      return data;
    }

    // Page-specific merge: which API values go into which fields this
    // page already reads.
    function rbApiMerge(baseProduct, apiProduct) {
      var d = rbApiSizeData(baseProduct, apiProduct, false);
      if (!d) return null;
      var merged = rbApiCopy(baseProduct);
      merged.name = apiProduct.name;
      // Gallery photos from the API; "image" (card photo, also used by the
      // cart) is kept from this file.
      merged.images = d.images;
      merged.availableSizes = d.sizes;
      merged.availableSizeLabels = d.labels;
      merged.sizePrices = d.sizePrices;
      merged.sizeOldPrices = d.sizeOldPrices;
      merged.price = d.price;
      merged.oldPrice = d.oldPrice;
      return merged;
    }

    // Resolves with the merged API product, or null when the original
    // product object should be used instead. Never rejects.
    function rbApiFetch(baseProduct, slug) {
      if (rbApiCache[slug]) return Promise.resolve(rbApiCache[slug]);
      if (typeof fetch !== "function" || !RB_API_PRODUCT_URL) return Promise.resolve(null);
      var controller = typeof AbortController === "function" ? new AbortController() : null;
      var timeoutId = controller ? window.setTimeout(function () { controller.abort(); }, RB_API_TIMEOUT_MS) : null;
      return fetch(RB_API_PRODUCT_URL + encodeURIComponent(slug), {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller ? controller.signal : undefined
      })
        .then(function (response) {
          if (!response.ok) return null;
          return response.json().catch(function () { return null; });
        })
        .then(function (data) {
          var apiProduct = data && data.success === true ? data.product : null;
          if (!rbApiIsValid(apiProduct, slug)) return null;
          var merged = rbApiMerge(baseProduct, apiProduct);
          if (merged) rbApiCache[slug] = merged;
          return merged;
        })
        .catch(function () { return null; })
        .then(function (result) {
          if (timeoutId) window.clearTimeout(timeoutId);
          return result;
        });
    }

    function handleRoute() {
      var slug = currentSlug();
      if (!slug) {
        rbApiRouteId++;
        showCategory();
        return;
      }
      var product = SD_PRODUCTS[slug];
      if (!product) {
        rbApiRouteId++;
        showNotFound();
        return;
      }
      // Only the newest route may render (ignores late answers).
      var requestId = ++rbApiRouteId;
      rbApiFetch(product, slug).then(function (apiProduct) {
        if (requestId !== rbApiRouteId) return;
        showDetail(apiProduct || product);
      });
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.images && currentProduct.images.length ? currentProduct.images : [currentProduct.image];
        sdState.imageIndex = (sdState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.images && currentProduct.images.length ? currentProduct.images : [currentProduct.image];
        sdState.imageIndex = (sdState.imageIndex + 1) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (sdState.quantity > 1) {
          sdState.quantity -= 1;
          qtyValueEl.textContent = String(sdState.quantity);
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        sdState.quantity += 1;
        qtyValueEl.textContent = String(sdState.quantity);
      });
    }

    // Shared validation for both Add to Basket and Buy Now — each
    // required option shows its own inline message right next to that
    // option (not just one generic message at the bottom), checked
    // top-to-bottom in the order they appear on the page.
    function validateRequiredOptions() {
      if (!sdState.selectedSize) {
        messageEl.textContent = "Please select a size.";
        messageEl.classList.add("is-error");
        sizeOptionsEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!sdState.ottomanStorage) {
        ottomanStorageMsg.textContent = "Please select an option.";
        ottomanStorageEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!sdState.footstoolBlanketBox) {
        footstoolMsg.textContent = "Please select an option.";
        footstoolEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!sdState.headboardCustom) {
        headboardCustomMsg.textContent = "Please select an option.";
        headboardCustomEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!sdState.assembly) {
        assemblyMsg.textContent = "Please select an option.";
        assemblyEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!sdState.deliveryDelay) {
        deliveryDelayMsg.textContent = "Please select an option.";
        deliveryDelayEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      return true;
    }

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!validateRequiredOptions()) return;

        var unitPrice = currentPrice(currentProduct);

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "storage-drawer-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "storage-drawers.html#/" + currentProduct.slug,
              image: currentProduct.image || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "Storage Beds With Drawers",
              variant: {
                size: sdState.selectedSize,
                fabric: sdState.selectedFabric || null,
                ottomanStorage: sdState.ottomanStorage,
                footstoolBlanketBox: sdState.footstoolBlanketBox,
                headboardHeight: sdState.headboardCustom,
                customRequest: sdState.customRequest || null,
                assembly: sdState.assembly,
                assemblyPrice: sdState.assembly === "yes" ? ASSEMBLY_PRICE : 0,
                deliveryDelay: sdState.deliveryDelay,
                deliveryDate: sdState.deliveryDelay === "yes" ? (sdState.deliveryDate || null) : null
              }
            },
            sdState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Basket clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        if (messageEl) {
          messageEl.classList.remove("is-error");
          messageEl.textContent =
            "Added " + sdState.quantity + " \u00d7 " + currentProduct.name + " to your basket \u2014 " +
            money(unitPrice * sdState.quantity) + ".";
        }
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!validateRequiredOptions()) return;
        if (messageEl) {
          messageEl.classList.remove("is-error");
          messageEl.textContent = "Taking you to checkout for " + sdState.quantity + " item(s)...";
        }
      });
    }

    // Fullscreen lightbox on the gallery image.
    var zoomBtn = document.getElementById("sdGalleryZoom");
    var lightbox = document.getElementById("sdLightbox");
    var lightboxImage = document.getElementById("sdLightboxImage");
    var lightboxClose = document.getElementById("sdLightboxClose");
    if (zoomBtn && lightbox && lightboxImage) {
      zoomBtn.addEventListener("click", function () {
        lightboxImage.src = mainImage.src;
        lightboxImage.alt = mainImage.alt;
        lightbox.hidden = false;
      });
    }
    if (lightboxClose && lightbox) {
      lightboxClose.addEventListener("click", function () {
        lightbox.hidden = true;
      });
    }
    if (lightbox) {
      lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) lightbox.hidden = true;
      });
    }
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && lightbox && !lightbox.hidden) lightbox.hidden = true;
    });
  }


  /* ---- Review data cleanup: no verified real reviews exist yet, so
     replace any star/count display with an honest "No reviews yet"
     message instead of showing invented numbers. Excludes the detail
     view's own rating element (.bb-modal__rating), which is populated
     separately by renderDetail() once a product is opened. ---- */
  function cleanupFakeRatings() {
    document.querySelectorAll(".product-card__rating:not(.bb-modal__rating)").forEach(function (el) {
      el.innerHTML = '<span class="product-card__no-reviews">No reviews yet</span>';
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cleanupFakeRatings();
    initDetail();
  });
})();