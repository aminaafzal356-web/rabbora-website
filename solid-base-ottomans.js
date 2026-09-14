/* =========================================================
   RABBORA LIVING — SOLID OTTOMAN BEDS
   ---------------------------------------------------------
   Self-contained data + page logic for solid-base-ottomans.html.
   Loaded AFTER search-index.js and script.js.

   ==========================================
   PRODUCT DATA — EDIT ONLY HERE
   ==========================================
   45 products. For each one, edit only these 5 fields when you
   have real product info ready:

     image  -> product photo path, e.g. "images/solid-ottoman-beds/img-1.png"
               (leave "" to keep the "Add image" placeholder)
     name   -> product name shown on the card and detail page
     price  -> base price (number, no £ sign)
     size   -> the UK size label shown to customers, e.g. "Double 4'6ft"
     slug   -> used to build this product's URL
               (solid-base-ottomans.html#/<slug>) — keep unique per product

   Nothing else in this file needs to change when you update these.
   ========================================================= */

var SOLID_OTTOMAN_PRODUCTS = 
[
  {
    "id": 1,
    "slug": "solid-ottoman-bed-1",
    "name": "Chelsea Solid Ottoman Bed",
    "price": 429,
    "oldPrice": 489,
    "monthly": 36,
    "rating": 5,
    "reviews": 15,
    "badge": "New",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Chelsea Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/1.jfif",
      "solid/2.jfif",
      "solid/3.jfif"
    ]
  },
  {
    "id": 2,
    "slug": "solid-ottoman-bed-2",
    "name": "Hampton Solid Ottoman Bed",
    "price": 446,
    "oldPrice": null,
    "monthly": 37,
    "rating": 5,
    "reviews": 24,
    "badge": "Best Seller",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Hampton Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/4.jfif",
      "solid/5.jfif",
      "solid/6.jfif"
    ]
  },
  {
    "id": 3,
    "slug": "solid-ottoman-bed-3",
    "name": "Windsor Solid Ottoman Bed",
    "price": 463,
    "oldPrice": null,
    "monthly": 39,
    "rating": 4,
    "reviews": 33,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Windsor Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/7.jfif",
      "solid/8.jfif",
      "solid/9.jfif"
    ]
  },
  {
    "id": 4,
    "slug": "solid-ottoman-bed-4",
    "name": "Kensington Solid Ottoman Bed",
    "price": 480,
    "oldPrice": 540,
    "monthly": 40,
    "rating": 5,
    "reviews": 42,
    "badge": null,
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Kensington Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/10.jfif",
      "solid/11.jfif",
      "solid/12.jfif"
    ]
  },
  {
    "id": 5,
    "slug": "solid-ottoman-bed-5",
    "name": "Mayfair Solid Ottoman Bed",
    "price": 497,
    "oldPrice": null,
    "monthly": 41,
    "rating": 5,
    "reviews": 51,
    "badge": null,
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Mayfair Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/13.jfif",
      "solid/14.jfif",
      "solid/15.jfif"
    ]
  },
  {
    "id": 6,
    "slug": "solid-ottoman-bed-6",
    "name": "Richmond Solid Ottoman Bed",
    "price": 514,
    "oldPrice": null,
    "monthly": 43,
    "rating": 4,
    "reviews": 60,
    "badge": "Best Seller",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Richmond Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/16.jfif",
      "solid/17.jfif",
      "solid/18.jfif"
    ]
  },
  {
    "id": 7,
    "slug": "solid-ottoman-bed-7",
    "name": "Cambridge Solid Ottoman Bed",
    "price": 531,
    "oldPrice": 591,
    "monthly": 44,
    "rating": 5,
    "reviews": 69,
    "badge": null,
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Cambridge Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/19.jfif",
      "solid/20.jfif",
      "solid/21.jfif"
    ]
  },
  {
    "id": 8,
    "slug": "solid-ottoman-bed-8",
    "name": "Victoria Solid Ottoman Bed",
    "price": 548,
    "oldPrice": null,
    "monthly": 46,
    "rating": 5,
    "reviews": 78,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Victoria Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/22.jfif",
      "solid/23.jfif",
      "solid/24.jfif"
    ]
  },
  {
    "id": 9,
    "slug": "solid-ottoman-bed-9",
    "name": "Oxford Solid Ottoman Bed",
    "price": 565,
    "oldPrice": null,
    "monthly": 47,
    "rating": 4,
    "reviews": 87,
    "badge": null,
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Oxford Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/25.jfif",
      "solid/26.jfif",
      "solid/27.jfif"
    ]
  },
  {
    "id": 10,
    "slug": "solid-ottoman-bed-10",
    "name": "Chester Solid Ottoman Bed",
    "price": 582,
    "oldPrice": 642,
    "monthly": 48,
    "rating": 5,
    "reviews": 96,
    "badge": "Best Seller",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Chester Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/28.jfif",
      "solid/29.jfif",
      "solid/30.jfif"
    ]
  },
  {
    "id": 11,
    "slug": "solid-ottoman-bed-11",
    "name": "Kingston Solid Ottoman Bed",
    "price": 599,
    "oldPrice": null,
    "monthly": 50,
    "rating": 5,
    "reviews": 105,
    "badge": "New",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Kingston Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/31.jfif",
      "solid/32.jfif",
      "solid/33.jfif"
    ]
  },
  {
    "id": 12,
    "slug": "solid-ottoman-bed-12",
    "name": "Brighton Solid Ottoman Bed",
    "price": 616,
    "oldPrice": null,
    "monthly": 51,
    "rating": 4,
    "reviews": 114,
    "badge": null,
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Brighton Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/34.jfif",
      "solid/35.jfif",
      "solid/36.jfif"
    ]
  },
  {
    "id": 13,
    "slug": "solid-ottoman-bed-13",
    "name": "Lancaster Solid Ottoman Bed",
    "price": 633,
    "oldPrice": 693,
    "monthly": 53,
    "rating": 5,
    "reviews": 123,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Lancaster Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/37.jfif",
      "solid/38.jfif",
      "solid/39.jfif"
    ]
  },
  {
    "id": 14,
    "slug": "solid-ottoman-bed-14",
    "name": "Bristol Solid Ottoman Bed",
    "price": 650,
    "oldPrice": null,
    "monthly": 54,
    "rating": 5,
    "reviews": 132,
    "badge": "Best Seller",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Bristol Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/40.jfif",
      "solid/41.jfif",
      "solid/42.jfif"
    ]
  },
  {
    "id": 15,
    "slug": "solid-ottoman-bed-15",
    "name": "Soho Solid Ottoman Bed",
    "price": 667,
    "oldPrice": null,
    "monthly": 56,
    "rating": 4,
    "reviews": 141,
    "badge": null,
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Soho Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/43.jfif",
      "solid/44.jfif",
      "solid/45.jfif"
    ]
  },
  {
    "id": 16,
    "slug": "solid-ottoman-bed-16",
    "name": "Belgravia Solid Ottoman Bed",
    "price": 684,
    "oldPrice": 744,
    "monthly": 57,
    "rating": 5,
    "reviews": 150,
    "badge": "New",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Belgravia Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/46.jfif",
      "solid/47.jfif",
      "solid/48.jfif"
    ]
  },
  {
    "id": 17,
    "slug": "solid-ottoman-bed-17",
    "name": "Fulham Solid Ottoman Bed",
    "price": 701,
    "oldPrice": null,
    "monthly": 58,
    "rating": 5,
    "reviews": 159,
    "badge": null,
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Fulham Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/49.jfif",
      "solid/50.jfif",
      "solid/51.jfif"
    ]
  },
  {
    "id": 18,
    "slug": "solid-ottoman-bed-18",
    "name": "Chiswick Solid Ottoman Bed",
    "price": 718,
    "oldPrice": null,
    "monthly": 60,
    "rating": 4,
    "reviews": 168,
    "badge": "Best Seller",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Chiswick Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/52.jfif",
      "solid/53.jfif",
      "solid/54.jfif"
    ]
  },
  {
    "id": 19,
    "slug": "solid-ottoman-bed-19",
    "name": "Greenwich Solid Ottoman Bed",
    "price": 735,
    "oldPrice": 795,
    "monthly": 61,
    "rating": 5,
    "reviews": 17,
    "badge": null,
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Greenwich Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/55.jfif",
      "solid/56.jfif",
      "solid/57.jfif"
    ]
  },
  {
    "id": 20,
    "slug": "solid-ottoman-bed-20",
    "name": "Camden Solid Ottoman Bed",
    "price": 752,
    "oldPrice": null,
    "monthly": 63,
    "rating": 5,
    "reviews": 26,
    "badge": null,
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Camden Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/58.jfif",
      "solid/59.jfif",
      "solid/60.jfif"
    ]
  },
  {
    "id": 21,
    "slug": "solid-ottoman-bed-21",
    "name": "Notting Hill Solid Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthly": 36,
    "rating": 4,
    "reviews": 35,
    "badge": "New",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Notting Hill Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/61.jfif",
      "solid/62.jfif",
      "solid/63.jfif"
    ]
  },
  {
    "id": 22,
    "slug": "solid-ottoman-bed-22",
    "name": "Marylebone Solid Ottoman Bed",
    "price": 446,
    "oldPrice": 506,
    "monthly": 37,
    "rating": 5,
    "reviews": 44,
    "badge": "Best Seller",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Marylebone Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/64.jfif",
      "solid/65.jfif",
      "solid/66.jfif"
    ]
  },
  {
    "id": 23,
    "slug": "solid-ottoman-bed-23",
    "name": "Highgate Solid Ottoman Bed",
    "price": 463,
    "oldPrice": null,
    "monthly": 39,
    "rating": 5,
    "reviews": 53,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Highgate Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/67.jfif",
      "solid/68.jfif",
      "solid/69.jfif"
    ]
  },
  {
    "id": 24,
    "slug": "solid-ottoman-bed-24",
    "name": "Hampstead Solid Ottoman Bed",
    "price": 480,
    "oldPrice": null,
    "monthly": 40,
    "rating": 4,
    "reviews": 62,
    "badge": null,
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Hampstead Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/70.jfif",
      "solid/71.jfif",
      "solid/72.jfif"
    ]
  },
  {
    "id": 25,
    "slug": "solid-ottoman-bed-25",
    "name": "Clapham Solid Ottoman Bed",
    "price": 497,
    "oldPrice": 557,
    "monthly": 41,
    "rating": 5,
    "reviews": 71,
    "badge": null,
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Clapham Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/73.jfif",
      "solid/74.jfif",
      "solid/75.jfif"
    ]
  },
  {
    "id": 26,
    "slug": "solid-ottoman-bed-26",
    "name": "Islington Solid Ottoman Bed",
    "price": 514,
    "oldPrice": null,
    "monthly": 43,
    "rating": 5,
    "reviews": 80,
    "badge": "Best Seller",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Islington Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/76.jfif",
      "solid/77.jfif",
      "solid/78.jfif"
    ]
  },
  {
    "id": 27,
    "slug": "solid-ottoman-bed-27",
    "name": "Shoreditch Solid Ottoman Bed",
    "price": 531,
    "oldPrice": null,
    "monthly": 44,
    "rating": 4,
    "reviews": 89,
    "badge": null,
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Shoreditch Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/79.jfif",
      "solid/80.jfif",
      "solid/81.jfif"
    ]
  },
  {
    "id": 28,
    "slug": "solid-ottoman-bed-28",
    "name": "Southbank Solid Ottoman Bed",
    "price": 548,
    "oldPrice": 608,
    "monthly": 46,
    "rating": 5,
    "reviews": 98,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Southbank Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/82.jfif",
      "solid/83.jfif",
      "solid/84.jfif"
    ]
  },
  {
    "id": 29,
    "slug": "solid-ottoman-bed-29",
    "name": "Kew Solid Ottoman Bed",
    "price": 565,
    "oldPrice": null,
    "monthly": 47,
    "rating": 5,
    "reviews": 107,
    "badge": null,
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Kew Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/85.jfif",
      "solid/86.jfif",
      "solid/87.jfif"
    ]
  },
  {
    "id": 30,
    "slug": "solid-ottoman-bed-30",
    "name": "Putney Solid Ottoman Bed",
    "price": 582,
    "oldPrice": null,
    "monthly": 48,
    "rating": 4,
    "reviews": 116,
    "badge": "Best Seller",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Putney Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/88.jfif",
      "solid/89.jfif",
      "solid/90.jfif"
    ]
  },
  {
    "id": 31,
    "slug": "solid-ottoman-bed-31",
    "name": "Wimbledon Solid Ottoman Bed",
    "price": 599,
    "oldPrice": 659,
    "monthly": 50,
    "rating": 5,
    "reviews": 125,
    "badge": "New",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Wimbledon Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/91.jfif",
      "solid/92.jfif",
      "solid/93.jfif"
    ]
  },
  {
    "id": 32,
    "slug": "solid-ottoman-bed-32",
    "name": "Dulwich Solid Ottoman Bed",
    "price": 616,
    "oldPrice": null,
    "monthly": 51,
    "rating": 5,
    "reviews": 134,
    "badge": null,
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Dulwich Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/94.jfif",
      "solid/95.jfif",
      "solid/96.jfif"
    ]
  },
  {
    "id": 33,
    "slug": "solid-ottoman-bed-33",
    "name": "Ealing Solid Ottoman Bed",
    "price": 633,
    "oldPrice": null,
    "monthly": 53,
    "rating": 4,
    "reviews": 143,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Ealing Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/97.jfif",
      "solid/98.jfif",
      "solid/99.jfif"
    ]
  },
  {
    "id": 34,
    "slug": "solid-ottoman-bed-34",
    "name": "Harrow Solid Ottoman Bed",
    "price": 650,
    "oldPrice": 710,
    "monthly": 54,
    "rating": 5,
    "reviews": 152,
    "badge": "Best Seller",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Harrow Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/100.jfif",
      "solid/101.jfif",
      "solid/102.jfif"
    ]
  },
  {
    "id": 35,
    "slug": "solid-ottoman-bed-35",
    "name": "Barnet Solid Ottoman Bed",
    "price": 667,
    "oldPrice": null,
    "monthly": 56,
    "rating": 5,
    "reviews": 161,
    "badge": null,
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Barnet Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/103.jfif",
      "solid/104.jfif",
      "solid/105.jfif"
    ]
  },
  {
    "id": 36,
    "slug": "solid-ottoman-bed-36",
    "name": "Enfield Solid Ottoman Bed",
    "price": 684,
    "oldPrice": null,
    "monthly": 57,
    "rating": 4,
    "reviews": 170,
    "badge": "New",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Enfield Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/106.jfif",
      "solid/107.jfif",
      "solid/108.jfif"
    ]
  },
  {
    "id": 37,
    "slug": "solid-ottoman-bed-37",
    "name": "Bromley Solid Ottoman Bed",
    "price": 701,
    "oldPrice": 761,
    "monthly": 58,
    "rating": 5,
    "reviews": 19,
    "badge": null,
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Bromley Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/109.jfif",
      "solid/110.jfif",
      "solid/111.jfif"
    ]
  },
  {
    "id": 38,
    "slug": "solid-ottoman-bed-38",
    "name": "Croydon Solid Ottoman Bed",
    "price": 718,
    "oldPrice": null,
    "monthly": 60,
    "rating": 5,
    "reviews": 28,
    "badge": "Best Seller",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Croydon Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": [
      "solid/112.jfif",
      "solid/113.jfif",
      "solid/114.jfif"
    ]
  },
  {
    "id": 39,
    "slug": "solid-ottoman-bed-39",
    "name": "Sutton Solid Ottoman Bed",
    "price": 735,
    "oldPrice": null,
    "monthly": 61,
    "rating": 4,
    "reviews": 37,
    "badge": null,
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Sutton Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": []
  },
  {
    "id": 40,
    "slug": "solid-ottoman-bed-40",
    "name": "Merton Solid Ottoman Bed",
    "price": 752,
    "oldPrice": 812,
    "monthly": 63,
    "rating": 5,
    "reviews": 46,
    "badge": null,
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Merton Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": []
  },
  {
    "id": 41,
    "slug": "solid-ottoman-bed-41",
    "name": "Lewisham Solid Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthly": 36,
    "rating": 5,
    "reviews": 55,
    "badge": "New",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "The Lewisham Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Single 3ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 105,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": []
  },
  {
    "id": 42,
    "slug": "solid-ottoman-bed-42",
    "name": "Hackney Solid Ottoman Bed",
    "price": 446,
    "oldPrice": null,
    "monthly": 37,
    "rating": 4,
    "reviews": 64,
    "badge": "Best Seller",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "The Hackney Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Small Double 4ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 136,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": []
  },
  {
    "id": 43,
    "slug": "solid-ottoman-bed-43",
    "name": "Canary Wharf Solid Ottoman Bed",
    "price": 463,
    "oldPrice": 523,
    "monthly": 39,
    "rating": 5,
    "reviews": 73,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "The Canary Wharf Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Double 4'6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 152,
      "length": 206
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": []
  },
  {
    "id": 44,
    "slug": "solid-ottoman-bed-44",
    "name": "Bermondsey Solid Ottoman Bed",
    "price": 480,
    "oldPrice": null,
    "monthly": 40,
    "rating": 5,
    "reviews": 82,
    "badge": null,
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "The Bermondsey Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a King 5ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 167,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": []
  },
  {
    "id": 45,
    "slug": "solid-ottoman-bed-45",
    "name": "Peckham Solid Ottoman Bed",
    "price": 497,
    "oldPrice": null,
    "monthly": 41,
    "rating": 4,
    "reviews": 91,
    "badge": null,
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "The Peckham Solid Ottoman Bed pairs a reinforced solid base with generous gas-lift ottoman storage beneath the mattress, in a Super King 6ft frame. Handmade to order, it's designed to bring maximum support and hidden storage to a modern bedroom.",
    "features": [
      "Reinforced solid base for maximum support",
      "Spacious gas-lift ottoman storage beneath the mattress",
      "Handmade to order in Britain",
      "Tailored upholstered frame and headboard"
    ],
    "dimensions": {
      "width": 197,
      "length": 211
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "images": []
  }
];

(function () {
  "use strict";

  function qs(sel, scope) {
    return (scope || document).querySelector(sel);
  }
  function qsa(sel, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(sel));
  }
  function soMoney(v) {
    return "\u00A3" + Number(v).toFixed(2);
  }
  function soStars(n) {
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }
  var soState = { page: 1 };

  function initSizeCounts() {
    var counts = { Single: 0, "Small Double": 0, Double: 0, King: 0, "Super King": 0 };
    SOLID_OTTOMAN_PRODUCTS.forEach(function (p) {
      if (counts.hasOwnProperty(p.sizeKey)) counts[p.sizeKey]++;
    });
    var map = {
      soCountAll: SOLID_OTTOMAN_PRODUCTS.length,
      soCountSingle: counts.Single,
      soCountSmallDouble: counts["Small Double"],
      soCountDouble: counts.Double,
      soCountKing: counts.King,
      soCountSuperKing: counts["Super King"]
    };
    Object.keys(map).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = map[id];
    });
  }

  function initFilters() {
    var grid = document.getElementById("soProductGrid");
    if (!grid) return;

    var sizeSelect = document.getElementById("soSizeSelect");
    var priceSelect = document.getElementById("soPriceSelect");
    var sortSelect = document.getElementById("soSortSelect");
    var filtersBtn = document.getElementById("soFiltersBtn");
    var filtersCountEl = document.getElementById("soFiltersCount");
    var drawer = document.getElementById("soFilterDrawer");
    var drawerClose = document.getElementById("soFilterDrawerClose");
    var overlay = document.getElementById("soFilterOverlay");
    var applyBtn = document.getElementById("soApplyFilters");
    var clearBtn = document.getElementById("soClearFilters");
    var productCountEl = document.getElementById("soProductCount");
    var fallbackNote = document.getElementById("soFallbackNote");
    var pagination = document.getElementById("soPagination");
    var pagePrevBtn = document.getElementById("soPagePrev");
    var pageNextBtn = document.getElementById("soPageNext");
    var pageButtons = qsa(".mt-pagination__page", pagination);

    var PAGE_SIZE = 12;
    var cards = qsa(".so-product-card", grid);

    function priceInRange(price, range) {
      if (range === "all") return true;
      if (range === "under-500") return price < 500;
      if (range === "500-650") return price >= 500 && price <= 650;
      if (range === "over-650") return price > 650;
      return true;
    }

    function getFilterState() {
      return {
        size: sizeSelect ? sizeSelect.value : "all",
        price: priceSelect ? priceSelect.value : "all"
      };
    }

    function cardMatches(card, state) {
      return (
        (state.size === "all" || card.dataset.size === state.size) &&
        priceInRange(parseFloat(card.dataset.price), state.price)
      );
    }

    function cardScore(card, state) {
      var score = 0;
      if (state.size !== "all" && card.dataset.size === state.size) score += 60;
      if (priceInRange(parseFloat(card.dataset.price), state.price)) score += 1;
      return score;
    }

    function activeFilterCount(state) {
      var count = 0;
      if (state.size !== "all") count += 1;
      if (state.price !== "all") count += 1;
      return count;
    }

    function updateFiltersCountBadge(state) {
      if (!filtersCountEl) return;
      var count = activeFilterCount(state);
      if (count > 0) {
        filtersCountEl.textContent = String(count);
        filtersCountEl.hidden = false;
      } else {
        filtersCountEl.hidden = true;
      }
    }

    function sortCards(list, mode) {
      var sorted = list.slice();
      sorted.sort(function (a, b) {
        var priceA = parseFloat(a.dataset.price);
        var priceB = parseFloat(b.dataset.price);
        if (mode === "price-asc") return priceA - priceB;
        if (mode === "price-desc") return priceB - priceA;
        if (mode === "rating") return parseInt(b.dataset.rating, 10) - parseInt(a.dataset.rating, 10);
        return parseInt(a.dataset.order, 10) - parseInt(b.dataset.order, 10);
      });
      return sorted;
    }

    function renderPagination(totalPages) {
      if (!pagination) return;
      pageButtons.forEach(function (btn) {
        var page = parseInt(btn.dataset.page, 10);
        btn.hidden = page > totalPages;
        btn.classList.toggle("is-active", page === soState.page);
        btn.setAttribute("aria-current", page === soState.page ? "page" : "false");
      });
      if (pagePrevBtn) pagePrevBtn.disabled = soState.page <= 1;
      if (pageNextBtn) pageNextBtn.disabled = soState.page >= totalPages;
      pagination.hidden = totalPages <= 1;
    }

    function applyFilters(resetPage) {
      var state = getFilterState();
      var exactMatches = cards.filter(function (card) { return cardMatches(card, state); });

      var matched = exactMatches;
      var usedFallback = false;

      if (matched.length === 0) {
        var scored = cards.map(function (card) { return { card: card, score: cardScore(card, state) }; });
        var maxScore = Math.max.apply(null, scored.map(function (s) { return s.score; }));
        matched = scored.filter(function (s) { return s.score === maxScore; }).map(function (s) { return s.card; });
        usedFallback = activeFilterCount(state) > 0;
      }

      var sortMode = sortSelect ? sortSelect.value : "featured";
      matched = sortCards(matched, sortMode);

      if (resetPage) soState.page = 1;

      var totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
      if (soState.page > totalPages) soState.page = totalPages;

      var startIndex = (soState.page - 1) * PAGE_SIZE;
      var pageItems = matched.slice(startIndex, startIndex + PAGE_SIZE);

      cards.forEach(function (card) {
        card.hidden = pageItems.indexOf(card) === -1;
      });
      pageItems.forEach(function (card) { grid.appendChild(card); });

      if (fallbackNote) fallbackNote.hidden = !usedFallback;

      if (productCountEl) {
        if (matched.length === 0) {
          productCountEl.textContent = "0 beds";
        } else {
          var from = startIndex + 1;
          var to = Math.min(startIndex + PAGE_SIZE, matched.length);
          productCountEl.textContent = "Showing " + from + "\u2013" + to + " of " + matched.length + " beds";
        }
      }

      renderPagination(totalPages);
      updateFiltersCountBadge(state);
    }

    [sizeSelect, priceSelect].forEach(function (select) {
      if (select) select.addEventListener("change", function () { applyFilters(true); });
    });
    if (sortSelect) sortSelect.addEventListener("change", function () { applyFilters(false); });

    if (pagePrevBtn) {
      pagePrevBtn.addEventListener("click", function () {
        if (soState.page > 1) { soState.page -= 1; applyFilters(false); grid.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    }
    if (pageNextBtn) {
      pageNextBtn.addEventListener("click", function () {
        soState.page += 1; applyFilters(false); grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    pageButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        soState.page = parseInt(btn.dataset.page, 10);
        applyFilters(false);
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    function openDrawer() {
      if (!drawer) return;
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      if (overlay) { overlay.hidden = false; requestAnimationFrame(function () { overlay.classList.add("is-visible"); }); }
      if (filtersBtn) filtersBtn.setAttribute("aria-expanded", "true");
      document.body.classList.add("sf-drawer-open");
    }
    function closeDrawer() {
      if (!drawer) return;
      drawer.classList.remove("is-open");
      drawer.setAttribute("aria-hidden", "true");
      if (overlay) { overlay.classList.remove("is-visible"); window.setTimeout(function () { overlay.hidden = true; }, 250); }
      if (filtersBtn) filtersBtn.setAttribute("aria-expanded", "false");
      document.body.classList.remove("sf-drawer-open");
    }
    if (filtersBtn) {
      filtersBtn.addEventListener("click", function () {
        var isMobile = window.matchMedia("(max-width: 1023px)").matches;
        if (!isMobile) { if (drawer) drawer.scrollIntoView({ behavior: "smooth", block: "nearest" }); return; }
        if (drawer && drawer.classList.contains("is-open")) { closeDrawer(); } else { openDrawer(); }
      });
    }
    if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && drawer && drawer.classList.contains("is-open")) closeDrawer();
    });
    if (applyBtn) applyBtn.addEventListener("click", function () { applyFilters(true); closeDrawer(); });
    if (clearBtn) {
      clearBtn.addEventListener("click", function () {
        [sizeSelect, priceSelect].forEach(function (select) { if (select) select.value = "all"; });
        applyFilters(true);
      });
    }
    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 1024px)").matches && drawer && drawer.classList.contains("is-open")) closeDrawer();
    });

    initSizeCounts();
    applyFilters(true);
  }

  /* ---- 2 / 3 / 4 column view toggle ---- */
  function initViewToggle() {
    var grid = document.getElementById("soProductGrid");
    var btn2 = document.getElementById("soCols2Btn");
    var btn3 = document.getElementById("soCols3Btn");
    var btn4 = document.getElementById("soCols4Btn");
    if (!grid || !btn2 || !btn3 || !btn4) return;
    var buttons = [btn2, btn3, btn4];
    function setActive(activeBtn) {
      buttons.forEach(function (btn) {
        var isActive = btn === activeBtn;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });
    }
    btn2.addEventListener("click", function () { grid.classList.remove("so-grid--cols-4"); grid.classList.add("so-grid--cols-2"); setActive(btn2); });
    btn3.addEventListener("click", function () { grid.classList.remove("so-grid--cols-2", "so-grid--cols-4"); setActive(btn3); });
    btn4.addEventListener("click", function () { grid.classList.remove("so-grid--cols-2"); grid.classList.add("so-grid--cols-4"); setActive(btn4); });
  }

  /* ---- Detail view: one reusable component for all 45 products ---- */
  function initDetail() {
    var categoryView = document.getElementById("soCategoryView");
    var detailView = document.getElementById("soDetailView");
    var notFoundView = document.getElementById("soNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("soDetailBreadcrumbName");
    var mainImage = document.getElementById("soGalleryMainImage");
    var imagePlaceholder = document.getElementById("soDetailImagePlaceholder");
    var thumbsWrap = document.getElementById("soGalleryThumbs");
    var prevBtn = document.getElementById("soGalleryPrev");
    var nextBtn = document.getElementById("soGalleryNext");
    var zoomBtn = document.getElementById("soGalleryZoom");
    var lightbox = document.getElementById("soLightbox");
    var lightboxImage = document.getElementById("soLightboxImage");
    var lightboxClose = document.getElementById("soLightboxClose");
    var sizeEl = document.getElementById("soDetailSize");
    var titleEl = document.getElementById("soDetailTitle");
    var starsEl = document.getElementById("soDetailStars");
    var reviewCountEl = document.getElementById("soDetailReviewCount");
    var priceEl = document.getElementById("soDetailPrice");
    var prevPriceEl = document.getElementById("soDetailPrevPrice");
    var monthlyEl = document.getElementById("soDetailMonthly");
    var descriptionEl = document.getElementById("soDetailDescription");
    var featuresEl = document.getElementById("soDetailFeatures");
    var dimensionsEl = document.getElementById("soDetailDimensions");
    var deliveryEl = document.getElementById("soDetailDelivery");
    var warrantyEl = document.getElementById("soDetailWarranty");
    var returnsEl = document.getElementById("soDetailReturns");
    var relatedGrid = document.getElementById("soRelatedGrid");
    var qtyValueEl = document.getElementById("soQtyValue");
    var qtyMinus = document.getElementById("soQtyMinus");
    var qtyPlus = document.getElementById("soQtyPlus");
    var addBtn = document.getElementById("soAddToCart");
    var messageEl = document.getElementById("soPurchaseMessage");

    var currentProduct = null;
    var quantity = 1;
    var detailImageIndex = 0;

    function renderGallery(product) {
      var images = (product.images && product.images.length) ? product.images : [];

      if (images.length === 0) {
        mainImage.hidden = true;
        mainImage.removeAttribute("src");
        if (imagePlaceholder) imagePlaceholder.hidden = false;
        thumbsWrap.innerHTML = "";
        if (prevBtn) prevBtn.hidden = true;
        if (nextBtn) nextBtn.hidden = true;
        if (zoomBtn) zoomBtn.hidden = true;
        return;
      }

      if (zoomBtn) zoomBtn.hidden = false;
      mainImage.hidden = false;
      if (imagePlaceholder) imagePlaceholder.hidden = true;
      mainImage.src = images[detailImageIndex] || images[0];
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
        images.forEach(function (imgSrc, index) {
          var thumb = document.createElement("button");
          thumb.type = "button";
          thumb.className = "bb-modal__thumb" + (index === detailImageIndex ? " is-active" : "");
          thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
          thumb.innerHTML = '<img src="' + imgSrc + '" alt="" loading="lazy" />';
          thumb.addEventListener("click", function () {
            detailImageIndex = index;
            renderGallery(product);
          });
          thumbsWrap.appendChild(thumb);
        });
      }
      if (prevBtn) prevBtn.hidden = images.length < 2;
      if (nextBtn) nextBtn.hidden = images.length < 2;
    }

    function renderDimensions(product) {
      var d = product.dimensions;
      dimensionsEl.innerHTML =
        "<thead><tr><th scope=\"col\">Size</th><th scope=\"col\">Width (cm)</th><th scope=\"col\">Length (cm)</th></tr></thead><tbody>" +
        "<tr><td>" + product.size + "</td><td>" + d.width + "</td><td>" + d.length + "</td></tr></tbody>";
    }

    function renderRelated(product) {
      relatedGrid.innerHTML = "";
      var others = SOLID_OTTOMAN_PRODUCTS.filter(function (p) { return p.slug !== product.slug; });
      var sameSize = others.filter(function (p) { return p.sizeKey === product.sizeKey; });
      var rest = others.filter(function (p) { return p.sizeKey !== product.sizeKey; });
      var related = sameSize.concat(rest).slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + soMoney(p.oldPrice) + '</span>' : "";
        var relatedImage = (p.images && p.images[0]) || "";
        var imageHtml = relatedImage
          ? '<img src="' + relatedImage + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />'
          : '<span class="so-image-placeholder" aria-hidden="true">Add image</span>';
        var card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="solid-base-ottomans.html#/' + p.slug + '">' + imageHtml + '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="solid-base-ottomans.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
            '<div class="product-card__rating">' +
              '<span class="product-card__stars" aria-hidden="true">' + soStars(p.rating) + '</span>' +
              '<span class="product-card__review-count">(' + p.reviews + ')</span>' +
            '</div>' +
            '<div class="product-card__price-row">' +
              '<span class="product-card__price">' + soMoney(p.price) + '</span>' + prevHtml +
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
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/solid-ottoman-beds/" + product.slug);

      breadcrumbName.textContent = product.name;
      sizeEl.textContent = product.size;
      titleEl.textContent = product.name;
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
      priceEl.textContent = soMoney(product.price);
      prevPriceEl.textContent = product.oldPrice ? soMoney(product.oldPrice) : "";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;
      deliveryEl.textContent = product.delivery;
      warrantyEl.textContent = product.warranty;
      returnsEl.textContent = product.returns;

      featuresEl.innerHTML = "";
      product.features.forEach(function (feature) {
        var li = document.createElement("li");
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      quantity = 1;
      qtyValueEl.textContent = "1";
      messageEl.textContent = "";
      messageEl.classList.remove("is-error");

      currentProduct = product;
      detailImageIndex = 0;
      renderGallery(product);
      renderDimensions(product);
      renderRelated(product);
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "Solid Ottoman Beds | Reinforced Storage Beds | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) descTag.setAttribute("content", "Shop Solid Ottoman Beds at Rabbora Living. Reinforced solid base storage beds with generous gas-lift storage, handmade in Britain with a 24-month warranty.");
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/solid-base-ottomans.html");
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

    var SO_PRODUCTS_BY_SLUG = {};
    SOLID_OTTOMAN_PRODUCTS.forEach(function (p) { SO_PRODUCTS_BY_SLUG[p.slug] = p; });

    function handleRoute() {
      var hash = window.location.hash;
      if (!hash || hash === "#") { showCategory(); return; }
      var slug = hash.replace(/^#\/?/, "");
      if (!slug) { showCategory(); return; }
      var product = SO_PRODUCTS_BY_SLUG[slug];
      if (product) { showDetail(product); } else { showNotFound(); }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.images && currentProduct.images.length ? currentProduct.images : [];
        if (images.length === 0) return;
        detailImageIndex = (detailImageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.images && currentProduct.images.length ? currentProduct.images : [];
        if (images.length === 0) return;
        detailImageIndex = (detailImageIndex + 1) % images.length;
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
        if (quantity > 1) { quantity -= 1; qtyValueEl.textContent = String(quantity); }
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        quantity += 1; qtyValueEl.textContent = String(quantity);
      });
    }

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "solid-base-ottoman-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "solid-base-ottomans.html#/" + currentProduct.slug,
              image: (currentProduct.images && currentProduct.images[0]) || "",
              alt: currentProduct.name,
              price: currentProduct.price,
              category: "Solid Base Ottomans",
              variant: {
                size: currentProduct.size || null
              }
            },
            quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Basket clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + quantity + " \u00d7 " + currentProduct.name + " (" + currentProduct.size +
          ") to your basket \u2014 " + soMoney(currentProduct.price * quantity) + ".";
      });
    }
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
    initFilters();
    initViewToggle();
    initDetail();
  });
})();