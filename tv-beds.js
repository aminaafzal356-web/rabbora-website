/* =========================================================
   RABBORA LIVING — TV BEDS
   ---------------------------------------------------------
   Self-contained data + page logic for tv-beds.html. Loaded
   AFTER script.js (which still runs the shared header, mobile
   nav, search, dropdown, etc. — none of that is touched here).

   ===============================
   EDIT YOUR PRODUCTS HERE
   ===============================
   To change a product's name, price, description or images,
   edit the matching field below. Each product has an "images"
   array — the first entry is used as the card-grid photo and
   the gallery's main image. To replace an image, edit the
   matching path in the array, e.g.:
     "images/tv-beds/img-1.png"
   becomes:
     "images/tv-beds/my-new-photo.jpg"
   No slugs, no auto-generated filenames.
   ========================================================= */

console.log("[Rabbora] tv-beds.js loaded — real-images-v1 — 12 products, each with 3 real images (tv/img-1.png through tv/img-36.png). If this line does not appear in your browser console, or says something different, the live server is NOT running this file — re-upload it.");

var TV_BED_PRODUCTS = 
[
  {
    "id": 1,
    "slug": "tv-bed-1",
    "name": "2026 Bedflix Duke TV Bed Frame (3 Piece Headboard)",
    "price": 999,
    "oldPrice": 1399,
    "monthlyPrice": 84,
    "rating": 5,
    "reviewCount": 0,
    "badge": "29% Off",
    "maxScreenSize": "Up to 32\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 32\", with a tailored handmade frame.",
    "description": "The Chelsea TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-1.png",
      "tv/img-2.png",
      "tv/img-3.png"
    ]
  },
  {
    "id": 2,
    "slug": "tv-bed-2",
    "name": "2026 Bedflix Manhattan TV Bed Frame (27 to 43)",
    "price": 990,
    "oldPrice": 1399,
    "monthlyPrice": 83,
    "rating": 5,
    "reviewCount": 0,
    "badge": "29% Off",
    "maxScreenSize": "Up to 40\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 40\", with a tailored handmade frame.",
    "description": "The Hampton TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-4.png",
      "tv/img-5.png",
      "tv/img-6.png"
    ]
  },
  {
    "id": 3,
    "slug": "tv-bed-3",
    "name": "2026 Bedflix TV Bed Frame (27 to 43)",
    "price": 1099,
    "oldPrice": 1399,
    "monthlyPrice": 92,
    "rating": 5,
    "reviewCount": 0,
    "badge": "21% Off",
    "maxScreenSize": "Up to 43\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 43\", with a tailored handmade frame.",
    "description": "The Windsor TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-7.png",
      "tv/img-8.png",
      "tv/img-9.png"
    ]
  },
  {
    "id": 4,
    "slug": "tv-bed-4",
    "name": "2026 Bedflix Davinci TV Bed Frame (2 Piece Headboard)",
    "price": 999,
    "oldPrice": 1399,
    "monthlyPrice": 84,
    "rating": 0,
    "reviewCount": 0,
    "badge": "29% Off",
    "maxScreenSize": "Up to 50\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 50\", with a tailored handmade frame.",
    "description": "The Kensington TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-10.png",
      "tv/img-11.png",
      "tv/img-12.png"
    ]
  },
  {
    "id": 5,
    "slug": "tv-bed-5",
    "name": "Mayfair TV Bed",
    "price": 735,
    "oldPrice": null,
    "monthlyPrice": 61,
    "rating": 4,
    "reviewCount": 62,
    "badge": "Best Seller",
    "maxScreenSize": "Up to 32\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 32\", with a tailored handmade frame.",
    "description": "The Mayfair TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-13.png",
      "tv/img-14.png",
      "tv/img-15.png"
    ]
  },
  {
    "id": 6,
    "slug": "tv-bed-6",
    "name": "Richmond TV Bed",
    "price": 769,
    "oldPrice": null,
    "monthlyPrice": 64,
    "rating": 5,
    "reviewCount": 73,
    "badge": "New",
    "maxScreenSize": "Up to 40\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 40\", with a tailored handmade frame.",
    "description": "The Richmond TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-16.png",
      "tv/img-17.png",
      "tv/img-18.png"
    ]
  },
  {
    "id": 7,
    "slug": "tv-bed-7",
    "name": "Cambridge TV Bed",
    "price": 803,
    "oldPrice": 893,
    "monthlyPrice": 67,
    "rating": 5,
    "reviewCount": 84,
    "badge": null,
    "maxScreenSize": "Up to 43\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 43\", with a tailored handmade frame.",
    "description": "The Cambridge TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-19.png",
      "tv/img-20.png",
      "tv/img-21.png"
    ]
  },
  {
    "id": 8,
    "slug": "tv-bed-8",
    "name": "Victoria TV Bed",
    "price": 837,
    "oldPrice": null,
    "monthlyPrice": 70,
    "rating": 5,
    "reviewCount": 95,
    "badge": "Best Seller",
    "maxScreenSize": "Up to 50\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 50\", with a tailored handmade frame.",
    "description": "The Victoria TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-22.png",
      "tv/img-23.png",
      "tv/img-24.png"
    ]
  },
  {
    "id": 9,
    "slug": "tv-bed-9",
    "name": "Oxford TV Bed",
    "price": 871,
    "oldPrice": null,
    "monthlyPrice": 73,
    "rating": 4,
    "reviewCount": 106,
    "badge": null,
    "maxScreenSize": "Up to 32\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 32\", with a tailored handmade frame.",
    "description": "The Oxford TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-25.png",
      "tv/img-26.png",
      "tv/img-27.png"
    ]
  },
  {
    "id": 10,
    "slug": "tv-bed-10",
    "name": "Chester TV Bed",
    "price": 905,
    "oldPrice": 995,
    "monthlyPrice": 75,
    "rating": 5,
    "reviewCount": 117,
    "badge": null,
    "maxScreenSize": "Up to 40\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 40\", with a tailored handmade frame.",
    "description": "The Chester TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-28.png",
      "tv/img-29.png",
      "tv/img-30.png"
    ]
  },
  {
    "id": 11,
    "slug": "tv-bed-11",
    "name": "Kingston TV Bed",
    "price": 939,
    "oldPrice": null,
    "monthlyPrice": 78,
    "rating": 5,
    "reviewCount": 128,
    "badge": "Best Seller",
    "maxScreenSize": "Up to 43\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 43\", with a tailored handmade frame.",
    "description": "The Kingston TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-31.png",
      "tv/img-32.png",
      "tv/img-33.png"
    ]
  },
  {
    "id": 12,
    "slug": "tv-bed-12",
    "name": "Brighton TV Bed",
    "price": 973,
    "oldPrice": null,
    "monthlyPrice": 81,
    "rating": 5,
    "reviewCount": 139,
    "badge": null,
    "maxScreenSize": "Up to 50\"",
    "shortInfo": "Built-in lift mechanism fits TVs up to 50\", with a tailored handmade frame.",
    "description": "The Brighton TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "tv/img-34.png",
      "tv/img-35.png",
      "tv/img-36.png"
    ]
  }
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
    imageIndex: 0
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
    var imagePlaceholder = document.getElementById("tvDetailImagePlaceholder");
    var thumbsWrap = document.getElementById("tvGalleryThumbs");
    var prevBtn = document.getElementById("tvGalleryPrev");
    var nextBtn = document.getElementById("tvGalleryNext");
    var zoomBtn = document.getElementById("tvGalleryZoom");
    var lightbox = document.getElementById("tvLightbox");
    var lightboxImage = document.getElementById("tvLightboxImage");
    var lightboxClose = document.getElementById("tvLightboxClose");
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
      var images = (product.images && product.images.length) ? product.images : [];

      if (images.length === 0) {
        mainImage.hidden = true;
        mainImage.removeAttribute("src");
        if (imagePlaceholder) imagePlaceholder.hidden = false;
        thumbsWrap.innerHTML = "";
        prevBtn.hidden = true;
        nextBtn.hidden = true;
        if (zoomBtn) zoomBtn.hidden = true;
        return;
      }

      if (zoomBtn) zoomBtn.hidden = false;
      mainImage.hidden = false;
      if (imagePlaceholder) imagePlaceholder.hidden = true;
      mainImage.src = images[tvState.imageIndex] || images[0];
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
          var thumb = document.createElement("button");
          thumb.type = "button";
          thumb.className = "";
          thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
          var img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.loading = "lazy";
          img.onerror = function () { img.style.visibility = "hidden"; };
          if (index === tvState.imageIndex) img.classList.add("is-active");
          thumb.appendChild(img);
          thumb.addEventListener("click", function () {
            tvState.imageIndex = index;
            renderGallery(product);
          });
          thumbsWrap.appendChild(thumb);
        });
      }
      prevBtn.hidden = images.length < 2;
      nextBtn.hidden = images.length < 2;
    }

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.availableSizes.forEach(function (size) {
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
      var rows = product.availableSizes.map(function (size) {
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
              '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="tv-beds.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
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
      if (descTag) descTag.setAttribute("content", product.name + " \u2014 " + product.shortInfo);
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/tv-beds/" + product.slug);

      breadcrumbName.textContent = product.name;
      screenSizeEl.textContent = "Fits TVs " + product.maxScreenSize.toLowerCase();
      titleEl.textContent = product.name;
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
      monthlyEl.textContent = "or from \u00A3" + product.monthlyPrice + "/month";
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

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      renderDetail(product);
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
        var images = currentProduct.images && currentProduct.images.length ? currentProduct.images : [];
        if (images.length === 0) return;
        tvState.imageIndex = (tvState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.images && currentProduct.images.length ? currentProduct.images : [];
        if (images.length === 0) return;
        tvState.imageIndex = (tvState.imageIndex + 1) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (zoomBtn) {
      zoomBtn.addEventListener("click", function () {
        if (!currentProduct || !currentProduct.images || !currentProduct.images.length) return;
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
              image: (currentProduct.images && currentProduct.images[0]) || "",
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
          messageEl.classList.add("is-error");
          messageEl.textContent = "Sorry, something went wrong adding this to your cart. Please refresh and try again.";
          return;
        }

        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + tvState.quantity + " \u00d7 " + currentProduct.name + " (" + tvState.selectedSize +
          ") to your basket \u2014 " + money(unitPrice * tvState.quantity) + ".";
      });
    }
  }


  /* ---- Review data cleanup: no verified real reviews exist yet, so
     replace any star/count display with an honest "No reviews yet"
     message instead of showing invented numbers. Excludes the detail
     view's own rating element (.tv-detail__rating), which is
     populated separately by renderDetail() once a product is opened. ---- */
  function cleanupFakeRatings() {
    document.querySelectorAll(".product-card__rating:not(.tv-detail__rating)").forEach(function (el) {
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