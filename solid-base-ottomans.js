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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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
    "image": "images/PUT-IMAGE-HERE.jpg"
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

    function renderImage(product) {
      mainImage.src = product.image;
      mainImage.alt = product.name;
      mainImage.hidden = false;
      imagePlaceholder.hidden = true;
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
        var imageHtml = '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />';
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
      starsEl.textContent = soStars(product.rating);
      reviewCountEl.textContent = "(" + product.reviews + ")";
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
      renderImage(product);
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
        var cartCountEl = document.getElementById("cartCount");
        if (cartCountEl) {
          var current = parseInt(cartCountEl.textContent, 10) || 0;
          cartCountEl.textContent = String(current + quantity);
        }
        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + quantity + " \u00d7 " + currentProduct.name + " (" + currentProduct.size +
          ") to your basket \u2014 " + soMoney(currentProduct.price * quantity) + ".";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFilters();
    initViewToggle();
    initDetail();
  });
})();