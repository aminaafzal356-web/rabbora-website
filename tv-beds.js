/* =========================================================
   RABBORA LIVING — TV BEDS
   ---------------------------------------------------------
   Self-contained data + page logic for tv-beds.html. Loaded
   AFTER script.js (which still runs the shared header, mobile
   nav, search, dropdown, etc. — none of that is touched here).

   ===============================
   EDIT YOUR PRODUCTS HERE
   ===============================
   To change a product's name, price, description or image,
   edit the matching field below. To replace an image, just
   change the "image" path, e.g.:
     "image": "images/tv-beds/img-1.png"
   becomes:
     "image": "images/tv-beds/my-new-photo.jpg"
   No slugs, no auto-generated filenames.
   ========================================================= */

var TV_BED_PRODUCTS = 
[
  {
    "id": 1,
    "slug": "tv-bed-1",
    "name": "Chelsea TV Bed",
    "price": 599,
    "oldPrice": 689,
    "monthly": 50,
    "rating": 4,
    "reviews": 18,
    "badge": "New",
    "maxScreenSize": "Up to 32\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 32\", with a tailored handmade frame.",
    "description": "The Chelsea TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 32\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 32\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-1.png"
  },
  {
    "id": 2,
    "slug": "tv-bed-2",
    "name": "Hampton TV Bed",
    "price": 633,
    "oldPrice": null,
    "monthly": 53,
    "rating": 5,
    "reviews": 29,
    "badge": "Best Seller",
    "maxScreenSize": "Up to 40\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 40\", with a tailored handmade frame.",
    "description": "The Hampton TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 40\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 40\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-2.png"
  },
  {
    "id": 3,
    "slug": "tv-bed-3",
    "name": "Windsor TV Bed",
    "price": 667,
    "oldPrice": null,
    "monthly": 56,
    "rating": 5,
    "reviews": 40,
    "badge": null,
    "maxScreenSize": "Up to 43\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 43\", with a tailored handmade frame.",
    "description": "The Windsor TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 43\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 43\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-3.png"
  },
  {
    "id": 4,
    "slug": "tv-bed-4",
    "name": "Kensington TV Bed",
    "price": 701,
    "oldPrice": 791,
    "monthly": 58,
    "rating": 5,
    "reviews": 51,
    "badge": null,
    "maxScreenSize": "Up to 50\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 50\", with a tailored handmade frame.",
    "description": "The Kensington TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 50\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 50\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-4.png"
  },
  {
    "id": 5,
    "slug": "tv-bed-5",
    "name": "Mayfair TV Bed",
    "price": 735,
    "oldPrice": null,
    "monthly": 61,
    "rating": 4,
    "reviews": 62,
    "badge": "Best Seller",
    "maxScreenSize": "Up to 32\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 32\", with a tailored handmade frame.",
    "description": "The Mayfair TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 32\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 32\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-5.png"
  },
  {
    "id": 6,
    "slug": "tv-bed-6",
    "name": "Richmond TV Bed",
    "price": 769,
    "oldPrice": null,
    "monthly": 64,
    "rating": 5,
    "reviews": 73,
    "badge": "New",
    "maxScreenSize": "Up to 40\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 40\", with a tailored handmade frame.",
    "description": "The Richmond TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 40\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 40\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-6.png"
  },
  {
    "id": 7,
    "slug": "tv-bed-7",
    "name": "Cambridge TV Bed",
    "price": 803,
    "oldPrice": 893,
    "monthly": 67,
    "rating": 5,
    "reviews": 84,
    "badge": null,
    "maxScreenSize": "Up to 43\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 43\", with a tailored handmade frame.",
    "description": "The Cambridge TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 43\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 43\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-7.png"
  },
  {
    "id": 8,
    "slug": "tv-bed-8",
    "name": "Victoria TV Bed",
    "price": 837,
    "oldPrice": null,
    "monthly": 70,
    "rating": 5,
    "reviews": 95,
    "badge": "Best Seller",
    "maxScreenSize": "Up to 50\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 50\", with a tailored handmade frame.",
    "description": "The Victoria TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 50\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 50\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-8.png"
  },
  {
    "id": 9,
    "slug": "tv-bed-9",
    "name": "Oxford TV Bed",
    "price": 871,
    "oldPrice": null,
    "monthly": 73,
    "rating": 4,
    "reviews": 106,
    "badge": null,
    "maxScreenSize": "Up to 32\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 32\", with a tailored handmade frame.",
    "description": "The Oxford TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 32\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 32\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-9.png"
  },
  {
    "id": 10,
    "slug": "tv-bed-10",
    "name": "Chester TV Bed",
    "price": 905,
    "oldPrice": 995,
    "monthly": 75,
    "rating": 5,
    "reviews": 117,
    "badge": null,
    "maxScreenSize": "Up to 40\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 40\", with a tailored handmade frame.",
    "description": "The Chester TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 40\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 40\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-10.png"
  },
  {
    "id": 11,
    "slug": "tv-bed-11",
    "name": "Kingston TV Bed",
    "price": 939,
    "oldPrice": null,
    "monthly": 78,
    "rating": 5,
    "reviews": 128,
    "badge": "Best Seller",
    "maxScreenSize": "Up to 43\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 43\", with a tailored handmade frame.",
    "description": "The Kingston TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 43\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 43\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-11.png"
  },
  {
    "id": 12,
    "slug": "tv-bed-12",
    "name": "Brighton TV Bed",
    "price": 973,
    "oldPrice": null,
    "monthly": 81,
    "rating": 5,
    "reviews": 139,
    "badge": null,
    "maxScreenSize": "Up to 50\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 50\", with a tailored handmade frame.",
    "description": "The Brighton TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "sizes": [
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Built-in TV lift mechanism, fits screens up to 50\"",
      "Quiet, smooth-motion lift with remote control",
      "Integrated cable management to keep wiring out of sight",
      "Solid frame construction with tailored upholstery",
      "Sprung slatted base for a comfortable, breathable sleep surface"
    ],
    "tvInfo": "The lift mechanism accommodates televisions up to 50\" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.",
    "dimensions": {
      "Small Double": {
        "width": 136,
        "length": 206
      },
      "Double": {
        "width": 152,
        "length": 206
      },
      "King": {
        "width": 167,
        "length": 211
      },
      "Super King": {
        "width": 197,
        "length": 211
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/tv-beds/img-12.png"
  }
];

var TV_FABRIC_CATALOG = [
  { slug: "plush-grey", name: "Plush Grey", image: "img-34.jfif" },
  { slug: "plush-silver", name: "Plush Silver", image: "img-35.jfif" },
  { slug: "plush-steel", name: "Plush Steel", image: "img-36.jfif" },
  { slug: "coniston-charcoal", name: "Coniston Charcoal", image: "img-37.jfif" },
  { slug: "coniston-almond", name: "Coniston Almond", image: "img-105.jfif" },
  { slug: "plush-cream", name: "Plush Cream", image: "img-38.jfif" },
  { slug: "naples-silver", name: "Naples Silver", image: "img-39.jfif" },
  { slug: "naples-steel", name: "Naples Steel", image: "img-40.jfif" },
  { slug: "coniston-armour", name: "Coniston Armour", image: "img-101.jfif" },
  { slug: "plush-beige", name: "Plush Beige", image: "img-102.jfif" },
  { slug: "plush-black", name: "Plush Black", image: "img-104.jfif" },
  { slug: "plush-pink", name: "Plush Pink", image: "img-106.jfif" },
  { slug: "coniston-emerald", name: "Coniston Emerald", image: "img-107.jfif" },
  { slug: "coniston-pink", name: "Coniston Pink", image: "img-108.jfif" },
  { slug: "naples-black", name: "Naples Black", image: "img-109.jfif" },
  { slug: "naples-ivory", name: "Naples Ivory", image: "img-110.jfif" },
  { slug: "crushed-velvet-silver", name: "Crushed Velvet Silver", image: "img-111.jfif" },
  { slug: "crushed-velvet-black", name: "Crushed Velvet Black", image: "img-112.jfif" },
  { slug: "crushed-velvet-cream", name: "Crushed Velvet Cream", image: "img-113.jfif" },
  { slug: "crushed-velvet-mink", name: "Crushed Velvet Mink", image: "img-114.jfif" },
  { slug: "plush-mustard", name: "Plush Mustard", image: "img-115.jfif" },
  { slug: "plush-green", name: "Plush Green", image: "img-116.jfif" },
  { slug: "plush-turquoise", name: "Plush Turquoise", image: "img-117.jfif" },
  { slug: "coniston-blue", name: "Coniston Blue", image: "img-118.jfif" },
  { slug: "cream-boucle", name: "Cream Boucle", image: "img-119.jfif" },
  { slug: "pink-boucle", name: "Pink Boucle", image: "img-120.jfif" },
  { slug: "marble-oatmeal", name: "Marble Oatmeal", image: "img-121.jfif" },
  { slug: "marble-platinum", name: "Marble Platinum", image: "img-122.jfif" },
  { slug: "marble-silver", name: "Marble Silver", image: "img-123.jfif" }
];

var TV_BED_SIZE_DELTAS = {
  "Small Double": -50,
  "Double": 0,
  "King": 95,
  "Super King": 170
};

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

  var TV_PRODUCTS_BY_SLUG = {};
  TV_BED_PRODUCTS.forEach(function (p) {
    TV_PRODUCTS_BY_SLUG[p.slug] = p;
  });

  var tvState = {
    selectedSize: null,
    quantity: 1,
    imageIndex: 0,
    selectedFabric: null
  };

  /* ---- Product count (sort/filter dropdowns removed) ---- */
  function initToolbar() {
    var grid = document.getElementById("tvProductGrid");
    if (!grid) return;

    var countEl = document.getElementById("tvProductCount");
    var cards = qsa(".tv-product-card", grid);
    if (countEl) countEl.textContent = cards.length + (cards.length === 1 ? " Bed" : " Beds");
  }

  /* ---- Grid / list view toggle ---- */
  function initViewToggle() {
    var grid = document.getElementById("tvProductGrid");
    var gridBtn = document.getElementById("tvGridViewBtn");
    var listBtn = document.getElementById("tvListViewBtn");
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
    qsa(".tv-faq-item").forEach(function (item) {
      var toggle = qs(".tv-faq-item__toggle", item);
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
    var categoryView = document.getElementById("tvCategoryView");
    var detailView = document.getElementById("tvDetailView");
    var notFoundView = document.getElementById("tvNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("tvDetailBreadcrumbName");
    var mainImage = document.getElementById("tvGalleryMainImage");
    var thumbsWrap = document.getElementById("tvGalleryThumbs");
    var fabricsEl = document.getElementById("tvModalFabrics");
    var prevBtn = document.getElementById("tvGalleryPrev");
    var nextBtn = document.getElementById("tvGalleryNext");
    var screenSizeEl = document.getElementById("tvDetailScreenSize");
    var titleEl = document.getElementById("tvDetailTitle");
    var starsEl = document.getElementById("tvDetailStars");
    var reviewCountEl = document.getElementById("tvDetailReviewCount");
    var priceEl = document.getElementById("tvDetailPrice");
    var prevPriceEl = document.getElementById("tvDetailPrevPrice");
    var monthlyEl = document.getElementById("tvDetailMonthly");
    var descriptionEl = document.getElementById("tvDetailDescription");
    var tvInfoEl = document.getElementById("tvDetailTvInfo");
    var sizeOptionsEl = document.getElementById("tvSizeOptions");
    var featuresEl = document.getElementById("tvDetailFeatures");
    var dimensionsEl = document.getElementById("tvDetailDimensions");
    var deliveryEl = document.getElementById("tvDetailDelivery");
    var warrantyEl = document.getElementById("tvDetailWarranty");
    var returnsEl = document.getElementById("tvDetailReturns");
    var relatedGrid = document.getElementById("tvRelatedGrid");
    var qtyValueEl = document.getElementById("tvQtyValue");
    var qtyMinus = document.getElementById("tvQtyMinus");
    var qtyPlus = document.getElementById("tvQtyPlus");
    var addBtn = document.getElementById("tvAddToCart");
    var messageEl = document.getElementById("tvPurchaseMessage");

    var currentProduct = null;

    function currentSlug() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    function currentPrice(product) {
      var delta = tvState.selectedSize ? (TV_BED_SIZE_DELTAS[tvState.selectedSize] || 0) : 0;
      return Math.max(0, product.price + delta);
    }

    function renderGallery(product) {
      var images = product.gallery && product.gallery.length ? product.gallery : [product.image];
      mainImage.src = images[tvState.imageIndex] || images[0];
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
        if (index === tvState.imageIndex || (images.length <= 1 && index === 0)) img.classList.add("is-active");
        thumb.appendChild(img);
        thumb.addEventListener("click", function () {
          if (images.length > 1) {
            tvState.imageIndex = index;
            renderGallery(product);
          }
        });
        thumbsWrap.appendChild(thumb);
      });
      prevBtn.hidden = images.length < 2;
      nextBtn.hidden = images.length < 2;
    }

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.sizes.forEach(function (size) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tv-option-pill";
        btn.setAttribute("aria-pressed", String(tvState.selectedSize === size));
        btn.textContent = size;
        btn.addEventListener("click", function () {
          tvState.selectedSize = size;
          messageEl.textContent = "";
          qsa(".tv-option-pill", sizeOptionsEl).forEach(function (el) {
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
      prevPriceEl.textContent = product.oldPrice ? money(product.oldPrice) : "";
    }

    function renderDimensions(product) {
      var rows = product.sizes.map(function (size) {
        var d = product.dimensions[size];
        return "<tr><td>" + size + "</td><td>" + d.width + "</td><td>" + d.length + "</td></tr>";
      }).join("");
      dimensionsEl.innerHTML =
        "<thead><tr><th scope=\"col\">Size</th><th scope=\"col\">Width (cm)</th><th scope=\"col\">Length (cm)</th></tr></thead><tbody>" +
        rows + "</tbody>";
    }

    function renderRelated(product) {
      relatedGrid.innerHTML = "";
      var others = TV_BED_PRODUCTS.filter(function (p) { return p.slug !== product.slug; });
      var related = others.slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + money(p.oldPrice) + '</span>' : "";
        var card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="tv-beds.html#/' + p.slug + '">' +
              '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="tv-beds.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
            '<div class="product-card__rating">' +
              '<span class="product-card__stars" aria-hidden="true">' + stars(p.rating) + '</span>' +
              '<span class="product-card__review-count">(' + p.reviews + ')</span>' +
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
      if (descTag) descTag.setAttribute("content", product.name + " \u2014 " + product.shortInfo);
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/tv-beds/" + product.slug);

      breadcrumbName.textContent = product.name;
      screenSizeEl.textContent = "Fits TVs " + product.maxScreenSize.toLowerCase();
      titleEl.textContent = product.name;
      starsEl.textContent = stars(product.rating);
      reviewCountEl.textContent = "(" + product.reviews + ")";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;
      tvInfoEl.textContent = product.tvInfo;
      deliveryEl.textContent = product.delivery;
      warrantyEl.textContent = product.warranty;
      returnsEl.textContent = product.returns;

      featuresEl.innerHTML = "";
      product.features.forEach(function (feature) {
        var li = document.createElement("li");
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      tvState.imageIndex = 0;
      tvState.selectedSize = null;
      tvState.quantity = 1;
      qtyValueEl.textContent = "1";
      messageEl.textContent = "";
      messageEl.classList.remove("is-error");

      currentProduct = product;
      renderGallery(product);
      renderSizeOptions(product);
      renderPrice(product);
      renderDimensions(product);
      renderRelated(product);
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "TV Beds | Built-In Lift Mechanism Bed Frames | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) descTag.setAttribute("content", "Shop TV Beds at Rabbora Living. Handmade bed frames with a built-in television lift mechanism, available in multiple UK sizes with a 24-month warranty.");
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/tv-beds");
    }

    function showNotFound() {
      categoryView.hidden = true;
      detailView.hidden = true;
      notFoundView.hidden = false;
      document.title = "Bed Not Found | Rabbora Living";
    }

    function renderFabrics() {
      if (!fabricsEl) return;
      fabricsEl.innerHTML = "";

      TV_FABRIC_CATALOG.forEach(function (fabric, index) {
        var isSelected = tvState.selectedFabric === fabric.name;
        if (tvState.selectedFabric === null && index === 0) {
          tvState.selectedFabric = fabric.name;
          isSelected = true;
        }

        var swatchImagePath = fabric.image ? "images/" + fabric.image : "images/fabrics/" + fabric.slug + ".svg";

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "fabric-swatch";
        btn.setAttribute("aria-pressed", String(isSelected));
        btn.setAttribute("aria-label", "Select " + fabric.name);
        btn.innerHTML =
          '<span class="fabric-swatch__ring">' +
            '<img src="' + swatchImagePath + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" onerror="this.style.display=&#39;none&#39;; this.parentElement.classList.add(&#39;fabric-swatch__ring--fallback&#39;);" />' +
            '<span class="fabric-swatch__check" aria-hidden="true">' +
              '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span>' +
          '</span>' +
          '<span class="fabric-swatch__name">' + fabric.name + '</span>';

        btn.addEventListener("click", function () {
          var alreadySelected = tvState.selectedFabric === fabric.name;

          Array.prototype.forEach.call(fabricsEl.querySelectorAll(".fabric-swatch"), function (el) {
            el.setAttribute("aria-pressed", "false");
          });

          if (alreadySelected) {
            tvState.selectedFabric = null;
          } else {
            tvState.selectedFabric = fabric.name;
            btn.setAttribute("aria-pressed", "true");
          }
        });

        fabricsEl.appendChild(btn);
      });
    }

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      tvState.selectedFabric = null;
      renderDetail(product);
      renderFabrics();
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    function handleRoute() {
      var hash = window.location.hash;
      if (!hash || hash === "#") { showCategory(); return; }
      var slug = hash.replace(/^#\/?/, "");
      if (!slug) { showCategory(); return; }
      var product = TV_PRODUCTS_BY_SLUG[slug];
      if (product) { showDetail(product); } else { showNotFound(); }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        tvState.imageIndex = (tvState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        tvState.imageIndex = (tvState.imageIndex + 1) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (tvState.quantity > 1) {
          tvState.quantity -= 1;
          qtyValueEl.textContent = String(tvState.quantity);
        }
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        tvState.quantity += 1;
        qtyValueEl.textContent = String(tvState.quantity);
      });
    }

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!tvState.selectedSize) {
          messageEl.textContent = "Please select a size.";
          messageEl.classList.add("is-error");
          return;
        }
        var unitPrice = currentPrice(currentProduct);

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "tv-bed-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "tv-beds.html#/" + currentProduct.slug,
              image: currentProduct.image || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "TV Beds",
              variant: {
                size: tvState.selectedSize
              }
            },
            tvState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Basket clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + tvState.quantity + " \u00d7 " + currentProduct.name + " (" + tvState.selectedSize +
          ") to your basket \u2014 " + money(unitPrice * tvState.quantity) + ".";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initToolbar();
    initViewToggle();
    initFaq();
    initDetail();
  });
})();