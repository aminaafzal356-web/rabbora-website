/* =========================================================
   RABBORA LIVING — RAPID DELIVERY BEDS
   ---------------------------------------------------------
   Self-contained data + page logic for rapid-delivery-beds.html.
   Loaded AFTER script.js (which still runs the shared header,
   mobile nav, search, dropdown, etc. — none of that is
   touched or duplicated here).

   ===============================
   EDIT YOUR PRODUCTS HERE
   ===============================
   To change a product's name, price, description or image,
   just edit the matching field below. To change an image,
   replace the "image" path — e.g.:
     "image": "images/rapid-delivery/img-1.png"
   becomes:
     "image": "images/rapid-delivery/my-new-photo.jpg"
   No slugs, no auto-generated filenames, nothing else to update.
   ========================================================= */

var RAPID_DELIVERY_PRODUCTS = 
[
  {
    "id": 1,
    "slug": "rapid-1",
    "name": "Chelsea Rapid Bed",
    "type": "Upholstered",
    "price": 279,
    "oldPrice": 339,
    "monthly": 23,
    "rating": 4,
    "reviews": 24,
    "badge": "Rapid Delivery",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Chelsea Rapid Bed is a handmade upholstered bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Upholstered construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-1.png"
  },
  {
    "id": 2,
    "slug": "rapid-2",
    "name": "Hampton Rapid Bed",
    "type": "Ottoman Storage",
    "price": 302,
    "oldPrice": null,
    "monthly": 25,
    "rating": 5,
    "reviews": 31,
    "badge": "Rapid Delivery",
    "shortInfo": "Ottoman Storage bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Hampton Rapid Bed is a handmade ottoman storage bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Ottoman Storage construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-2.png"
  },
  {
    "id": 3,
    "slug": "rapid-3",
    "name": "Windsor Rapid Bed",
    "type": "Divan",
    "price": 325,
    "oldPrice": null,
    "monthly": 27,
    "rating": 5,
    "reviews": 38,
    "badge": "Rapid Delivery",
    "shortInfo": "Divan bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Windsor Rapid Bed is a handmade divan bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Divan construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-3.png"
  },
  {
    "id": 4,
    "slug": "rapid-4",
    "name": "Kensington Rapid Bed",
    "type": "Upholstered",
    "price": 348,
    "oldPrice": 408,
    "monthly": 29,
    "rating": 5,
    "reviews": 45,
    "badge": null,
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Kensington Rapid Bed is a handmade upholstered bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Upholstered construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-4.png"
  },
  {
    "id": 5,
    "slug": "rapid-5",
    "name": "Mayfair Rapid Bed",
    "type": "Ottoman Storage",
    "price": 371,
    "oldPrice": null,
    "monthly": 31,
    "rating": 4,
    "reviews": 52,
    "badge": "Rapid Delivery",
    "shortInfo": "Ottoman Storage bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Mayfair Rapid Bed is a handmade ottoman storage bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Ottoman Storage construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-5.png"
  },
  {
    "id": 6,
    "slug": "rapid-6",
    "name": "Richmond Rapid Bed",
    "type": "Divan",
    "price": 394,
    "oldPrice": null,
    "monthly": 33,
    "rating": 5,
    "reviews": 59,
    "badge": "Rapid Delivery",
    "shortInfo": "Divan bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Richmond Rapid Bed is a handmade divan bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Divan construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-6.png"
  },
  {
    "id": 7,
    "slug": "rapid-7",
    "name": "Cambridge Rapid Bed",
    "type": "Upholstered",
    "price": 417,
    "oldPrice": 477,
    "monthly": 35,
    "rating": 5,
    "reviews": 66,
    "badge": "Rapid Delivery",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Cambridge Rapid Bed is a handmade upholstered bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Upholstered construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-7.png"
  },
  {
    "id": 8,
    "slug": "rapid-8",
    "name": "Victoria Rapid Bed",
    "type": "Ottoman Storage",
    "price": 440,
    "oldPrice": null,
    "monthly": 37,
    "rating": 5,
    "reviews": 73,
    "badge": null,
    "shortInfo": "Ottoman Storage bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Victoria Rapid Bed is a handmade ottoman storage bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Ottoman Storage construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-8.png"
  },
  {
    "id": 9,
    "slug": "rapid-9",
    "name": "Oxford Rapid Bed",
    "type": "Divan",
    "price": 463,
    "oldPrice": null,
    "monthly": 39,
    "rating": 4,
    "reviews": 80,
    "badge": "Rapid Delivery",
    "shortInfo": "Divan bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Oxford Rapid Bed is a handmade divan bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Divan construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-9.png"
  },
  {
    "id": 10,
    "slug": "rapid-10",
    "name": "Chester Rapid Bed",
    "type": "Upholstered",
    "price": 486,
    "oldPrice": 546,
    "monthly": 40,
    "rating": 5,
    "reviews": 87,
    "badge": "Rapid Delivery",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Chester Rapid Bed is a handmade upholstered bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Upholstered construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-10.png"
  },
  {
    "id": 11,
    "slug": "rapid-11",
    "name": "Kingston Rapid Bed",
    "type": "Ottoman Storage",
    "price": 509,
    "oldPrice": null,
    "monthly": 42,
    "rating": 5,
    "reviews": 94,
    "badge": "Rapid Delivery",
    "shortInfo": "Ottoman Storage bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Kingston Rapid Bed is a handmade ottoman storage bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Ottoman Storage construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-11.png"
  },
  {
    "id": 12,
    "slug": "rapid-12",
    "name": "Brighton Rapid Bed",
    "type": "Divan",
    "price": 532,
    "oldPrice": null,
    "monthly": 44,
    "rating": 5,
    "reviews": 101,
    "badge": null,
    "shortInfo": "Divan bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Brighton Rapid Bed is a handmade divan bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Divan construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-12.png"
  },
  {
    "id": 13,
    "slug": "rapid-13",
    "name": "Lancaster Rapid Bed",
    "type": "Upholstered",
    "price": 295,
    "oldPrice": 355,
    "monthly": 25,
    "rating": 4,
    "reviews": 108,
    "badge": "Rapid Delivery",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Lancaster Rapid Bed is a handmade upholstered bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Upholstered construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-13.png"
  },
  {
    "id": 14,
    "slug": "rapid-14",
    "name": "Bristol Rapid Bed",
    "type": "Ottoman Storage",
    "price": 318,
    "oldPrice": null,
    "monthly": 26,
    "rating": 5,
    "reviews": 115,
    "badge": "Rapid Delivery",
    "shortInfo": "Ottoman Storage bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Bristol Rapid Bed is a handmade ottoman storage bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Ottoman Storage construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-14.png"
  },
  {
    "id": 15,
    "slug": "rapid-15",
    "name": "Soho Rapid Bed",
    "type": "Divan",
    "price": 341,
    "oldPrice": null,
    "monthly": 28,
    "rating": 5,
    "reviews": 122,
    "badge": "Rapid Delivery",
    "shortInfo": "Divan bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Soho Rapid Bed is a handmade divan bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Divan construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-15.png"
  },
  {
    "id": 16,
    "slug": "rapid-16",
    "name": "Belgravia Rapid Bed",
    "type": "Upholstered",
    "price": 364,
    "oldPrice": 424,
    "monthly": 30,
    "rating": 5,
    "reviews": 129,
    "badge": null,
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Belgravia Rapid Bed is a handmade upholstered bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Upholstered construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-16.png"
  },
  {
    "id": 17,
    "slug": "rapid-17",
    "name": "Fulham Rapid Bed",
    "type": "Ottoman Storage",
    "price": 387,
    "oldPrice": null,
    "monthly": 32,
    "rating": 4,
    "reviews": 136,
    "badge": "Rapid Delivery",
    "shortInfo": "Ottoman Storage bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Fulham Rapid Bed is a handmade ottoman storage bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Ottoman Storage construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-17.png"
  },
  {
    "id": 18,
    "slug": "rapid-18",
    "name": "Greenwich Rapid Bed",
    "type": "Divan",
    "price": 410,
    "oldPrice": null,
    "monthly": 34,
    "rating": 5,
    "reviews": 143,
    "badge": "Rapid Delivery",
    "shortInfo": "Divan bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Greenwich Rapid Bed is a handmade divan bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Divan construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-18.png"
  },
  {
    "id": 19,
    "slug": "rapid-19",
    "name": "Camden Rapid Bed",
    "type": "Upholstered",
    "price": 433,
    "oldPrice": 493,
    "monthly": 36,
    "rating": 5,
    "reviews": 150,
    "badge": "Rapid Delivery",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Camden Rapid Bed is a handmade upholstered bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Upholstered construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-19.png"
  },
  {
    "id": 20,
    "slug": "rapid-20",
    "name": "Putney Rapid Bed",
    "type": "Ottoman Storage",
    "price": 456,
    "oldPrice": null,
    "monthly": 38,
    "rating": 5,
    "reviews": 157,
    "badge": null,
    "shortInfo": "Ottoman Storage bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "The Putney Rapid Bed is a handmade ottoman storage bed frame selected for faster delivery. Built on a solid, supportive frame with a tailored fabric finish, it's designed to be a comfortable, lasting centrepiece for your bedroom, with dispatch times faster than our standard made-to-order range.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Ottoman Storage construction with a tailored fabric finish",
      "Sprung slatted base for supportive, breathable sleep",
      "Solid frame built for everyday use",
      "Selected for faster dispatch on chosen sizes/fabrics"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
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
    "delivery": "Rapid Delivery on selected sizes and fabrics \u2014 see delivery process below.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "images/rapid-delivery/img-20.png"
  }
];

/* ===============================
   EDIT YOUR FABRIC/COLOUR OPTIONS HERE
   ===============================
   Same simple structure — just "name" and "image". These 6
   options are shown on every product's detail page. To change
   one, edit its "image" path the same way as above. */
var RAPID_DELIVERY_FABRICS = 
[
  {
    "name": "Grey",
    "image": "images/rapid-delivery/fabric-1.png"
  },
  {
    "name": "Silver",
    "image": "images/rapid-delivery/fabric-2.png"
  },
  {
    "name": "Charcoal",
    "image": "images/rapid-delivery/fabric-3.png"
  },
  {
    "name": "Beige",
    "image": "images/rapid-delivery/fabric-4.png"
  },
  {
    "name": "Navy",
    "image": "images/rapid-delivery/fabric-5.png"
  },
  {
    "name": "Green",
    "image": "images/rapid-delivery/fabric-6.png"
  }
];

var RAPID_DELIVERY_SIZE_DELTAS = {
  "Single": -80,
  "Small Double": -40,
  "Double": 0,
  "King": 90,
  "Super King": 160
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

  var RD2_PRODUCTS = {};
  RAPID_DELIVERY_PRODUCTS.forEach(function (p) {
    RD2_PRODUCTS[p.slug] = p;
  });

  var rd2State = {
    selectedSize: null,
    selectedFabricIndex: 0,
    quantity: 1,
    imageIndex: 0
  };

  /* ---- Toolbar: sort + type filter ---- */
  function initToolbar() {
    var grid = document.getElementById("rd2ProductGrid");
    if (!grid) return;

    var sortSelect = document.getElementById("rd2SortSelect");
    var typeSelect = document.getElementById("rd2TypeSelect");
    var countEl = document.getElementById("rd2ProductCount");
    var cards = qsa(".rd2-product-card", grid);

    function apply() {
      var type = typeSelect ? typeSelect.value : "all";
      var visible = cards.filter(function (card) {
        return type === "all" || card.dataset.type === type;
      });

      cards.forEach(function (card) {
        card.hidden = visible.indexOf(card) === -1;
      });

      var mode = sortSelect ? sortSelect.value : "featured";
      var sorted = visible.slice().sort(function (a, b) {
        if (mode === "price-asc") return parseFloat(a.dataset.price) - parseFloat(b.dataset.price);
        if (mode === "price-desc") return parseFloat(b.dataset.price) - parseFloat(a.dataset.price);
        if (mode === "rating") return parseInt(b.dataset.rating, 10) - parseInt(a.dataset.rating, 10);
        return parseInt(a.dataset.order, 10) - parseInt(b.dataset.order, 10);
      });
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });

      if (countEl) countEl.textContent = visible.length + (visible.length === 1 ? " Bed" : " Beds");
    }

    if (sortSelect) sortSelect.addEventListener("change", apply);
    if (typeSelect) typeSelect.addEventListener("change", apply);
    apply();
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    qsa(".rd2-faq-item").forEach(function (item) {
      var toggle = qs(".rd2-faq-item__toggle", item);
      if (!toggle) return;
      toggle.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        item.classList.toggle("is-open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ---- Detail view: one reusable component for all 20 products ---- */
  function initDetail() {
    var categoryView = document.getElementById("rd2CategoryView");
    var detailView = document.getElementById("rd2DetailView");
    var notFoundView = document.getElementById("rd2NotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("rd2DetailBreadcrumbName");
    var mainImage = document.getElementById("rd2GalleryMainImage");
    var thumbsWrap = document.getElementById("rd2GalleryThumbs");
    var prevBtn = document.getElementById("rd2GalleryPrev");
    var nextBtn = document.getElementById("rd2GalleryNext");
    var typeEl = document.getElementById("rd2DetailType");
    var titleEl = document.getElementById("rd2DetailTitle");
    var starsEl = document.getElementById("rd2DetailStars");
    var reviewCountEl = document.getElementById("rd2DetailReviewCount");
    var priceEl = document.getElementById("rd2DetailPrice");
    var prevPriceEl = document.getElementById("rd2DetailPrevPrice");
    var monthlyEl = document.getElementById("rd2DetailMonthly");
    var rapidBannerEl = document.getElementById("rd2DetailRapidBanner");
    var descriptionEl = document.getElementById("rd2DetailDescription");
    var sizeOptionsEl = document.getElementById("rd2SizeOptions");
    var fabricOptionsEl = document.getElementById("rd2FabricOptions");
    var featuresEl = document.getElementById("rd2DetailFeatures");
    var dimensionsEl = document.getElementById("rd2DetailDimensions");
    var deliveryEl = document.getElementById("rd2DetailDelivery");
    var warrantyEl = document.getElementById("rd2DetailWarranty");
    var returnsEl = document.getElementById("rd2DetailReturns");
    var relatedGrid = document.getElementById("rd2RelatedGrid");
    var qtyValueEl = document.getElementById("rd2QtyValue");
    var qtyMinus = document.getElementById("rd2QtyMinus");
    var qtyPlus = document.getElementById("rd2QtyPlus");
    var addBtn = document.getElementById("rd2AddToBasket");
    var messageEl = document.getElementById("rd2PurchaseMessage");

    var currentProduct = null;

    function currentSlug() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    function currentPrice(product) {
      var delta = rd2State.selectedSize ? (RAPID_DELIVERY_SIZE_DELTAS[rd2State.selectedSize] || 0) : 0;
      return Math.max(0, product.price + delta);
    }

    function renderGallery(product) {
      // Only one image path is required per product (product.image).
      // If you'd like more angles later, add extra <img> filenames of
      // your choosing to a "gallery" array on the product — this code
      // already supports that, falling back to the single image.
      var images = product.gallery && product.gallery.length ? product.gallery : [product.image];
      mainImage.src = images[rd2State.imageIndex] || images[0];
      mainImage.alt = product.name;

      thumbsWrap.innerHTML = "";
      if (images.length > 1) {
        images.forEach(function (src, index) {
          var img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.loading = "lazy";
          if (index === rd2State.imageIndex) img.classList.add("is-active");
          img.addEventListener("click", function () {
            rd2State.imageIndex = index;
            renderGallery(product);
          });
          thumbsWrap.appendChild(img);
        });
      }
      prevBtn.hidden = images.length < 2;
      nextBtn.hidden = images.length < 2;
    }

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.sizes.forEach(function (size) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rd2-option-pill";
        btn.setAttribute("aria-pressed", String(rd2State.selectedSize === size));
        btn.textContent = size;
        btn.addEventListener("click", function () {
          rd2State.selectedSize = size;
          messageEl.textContent = "";
          qsa(".rd2-option-pill", sizeOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          renderPrice(product);
        });
        sizeOptionsEl.appendChild(btn);
      });
    }

    function renderFabricOptions() {
      fabricOptionsEl.innerHTML = "";
      RAPID_DELIVERY_FABRICS.forEach(function (fabric, index) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rd2-fabric-swatch";
        btn.setAttribute("aria-pressed", String(rd2State.selectedFabricIndex === index));
        btn.setAttribute("aria-label", "Select " + fabric.name);
        btn.innerHTML =
          '<span class="rd2-fabric-swatch__ring">' +
            '<img src="' + fabric.image + '" alt="' + fabric.name + '" loading="lazy" />' +
            '<span class="rd2-fabric-swatch__check" aria-hidden="true">' +
              '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
            '</span>' +
          '</span>' +
          '<span class="rd2-fabric-swatch__name">' + fabric.name + '</span>';
        btn.addEventListener("click", function () {
          rd2State.selectedFabricIndex = index;
          qsa(".rd2-fabric-swatch", fabricOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
        });
        fabricOptionsEl.appendChild(btn);
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
      var others = RAPID_DELIVERY_PRODUCTS.filter(function (p) { return p.slug !== product.slug; });
      var sameType = others.filter(function (p) { return p.type === product.type; });
      var rest = others.filter(function (p) { return p.type !== product.type; });
      var related = sameType.concat(rest).slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + money(p.oldPrice) + '</span>' : "";
        var card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="rapid-delivery-beds.html#/' + p.slug + '">' +
              '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="rapid-delivery-beds.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
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
      if (descTag) {
        descTag.setAttribute("content", product.name + " \u2014 " + product.shortInfo);
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) {
        canonicalTag.setAttribute("href", "https://rabbora.co.uk/rapid-delivery/" + product.slug);
      }

      breadcrumbName.textContent = product.name;
      typeEl.textContent = product.type;
      titleEl.textContent = product.name;
      starsEl.textContent = stars(product.rating);
      reviewCountEl.textContent = "(" + product.reviews + ")";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;
      deliveryEl.textContent = product.delivery;
      warrantyEl.textContent = product.warranty;
      returnsEl.textContent = product.returns;
      rapidBannerEl.hidden = product.badge !== "Rapid Delivery";

      featuresEl.innerHTML = "";
      product.features.forEach(function (feature) {
        var li = document.createElement("li");
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      rd2State.imageIndex = 0;
      rd2State.selectedSize = null;
      rd2State.selectedFabricIndex = 0;
      rd2State.quantity = 1;
      qtyValueEl.textContent = "1";
      messageEl.textContent = "";
      messageEl.classList.remove("is-error");

      currentProduct = product;
      renderGallery(product);
      renderSizeOptions(product);
      renderFabricOptions();
      renderPrice(product);
      renderDimensions(product);
      renderRelated(product);
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "Rapid Delivery Beds | Fast Dispatch Bed Frames | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) {
        descTag.setAttribute("content", "Shop Rapid Delivery bed frames at Rabbora Living. Handmade beds selected for faster dispatch, available in multiple UK sizes and fabrics with a 24-month warranty.");
      }
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/rapid-delivery");
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
      if (!hash || hash === "#") {
        showCategory();
        return;
      }
      var slug = hash.replace(/^#\/?/, "");
      if (!slug) {
        showCategory();
        return;
      }
      var product = RD2_PRODUCTS[slug];
      if (product) {
        showDetail(product);
      } else {
        showNotFound();
      }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        rd2State.imageIndex = (rd2State.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        rd2State.imageIndex = (rd2State.imageIndex + 1) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (rd2State.quantity > 1) {
          rd2State.quantity -= 1;
          qtyValueEl.textContent = String(rd2State.quantity);
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        rd2State.quantity += 1;
        qtyValueEl.textContent = String(rd2State.quantity);
      });
    }

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!rd2State.selectedSize) {
          messageEl.textContent = "Please select a size.";
          messageEl.classList.add("is-error");
          return;
        }

        var fabricName = RAPID_DELIVERY_FABRICS[rd2State.selectedFabricIndex].name;
        var unitPrice = currentPrice(currentProduct);

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "rapid-delivery-bed-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "rapid-delivery-beds.html#/" + currentProduct.slug,
              image: currentProduct.image || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "Rapid Delivery Beds",
              variant: {
                size: rd2State.selectedSize,
                fabric: fabricName
              }
            },
            rd2State.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Basket clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + rd2State.quantity + " \u00d7 " + currentProduct.name + " (" + rd2State.selectedSize + ", " +
          fabricName + ") to your basket \u2014 " + money(unitPrice * rd2State.quantity) + ".";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    initToolbar();
    initFaq();
    initDetail();
  });
})();