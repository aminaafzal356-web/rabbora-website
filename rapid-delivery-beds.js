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
   To change a product's name, price, description or images,
   just edit the matching field below. Each product has an
   "images" array — the first entry is used as the card-grid
   photo and the gallery's main image. To replace an image,
   edit the matching path in the array, e.g.:
     "images/rapid-delivery/img-1.png"
   becomes:
     "images/rapid-delivery/my-new-photo.jpg"
   No slugs, no auto-generated filenames, nothing else to update.
   ========================================================= */

var RAPID_DELIVERY_PRODUCTS = 
[
  {
    "id": 1,
    "slug": "rapid-1",
    "name": "Rabbora Athens Slatted Designer Ottoman Bed",
    "type": "Upholstered",
    "price": 289,
    "oldPrice": 400,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "28% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A clean, linear silhouette brings understated modern style to the bedroom, with a solid supportive frame designed for comfortable, everyday sleep.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/img-12.jfif",
      "slatted/img-15.jfif",
      "slatted/img-13.jfif",
      "slatted/img-11.jfif",
      "slatted/img-14.jfif"
    ]
  },
  {
    "id": 2,
    "slug": "rapid-2",
    "name": "Rabbora Brooklyn Slatted Bed",
    "type": "Upholstered",
    "price": 299,
    "oldPrice": 420,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "29% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A contemporary bed frame with subtle linear detailing, offering a stylish yet practical centrepiece for a modern bedroom.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/40.png",
      "slatted/41.png",
      "slatted/43.png",
      "slatted/42.png"
    ]
  },
  {
    "id": 3,
    "slug": "rapid-3",
    "name": "Rabbora Chicago High Headboard Bed",
    "type": "Upholstered",
    "price": 449,
    "oldPrice": 480,
    "monthlyPrice": 38,
    "rating": 4,
    "reviewCount": 0,
    "badge": "6% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A striking two-piece high headboard design brings a bold, statement presence to the bedroom while providing comfortable, supportive sleep.",
    "availableSizeLabels": [
      "Small Double 4ft",
      "Double 4'6ft",
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
      "Tall two-piece upholstered headboard",
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
    "images": [
      "high/13.jfif",
      "high/14.jfif",
      "high/15.jfif",
      "high/16.jfif"
    ]
  },
  {
    "id": 4,
    "slug": "rapid-4",
    "name": "Rabbora Empire Slatted Ottoman Bed",
    "type": "Ottoman",
    "price": 289,
    "oldPrice": 420,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "31% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A versatile bed frame with the option of ottoman storage beneath the mattress, combining comfortable sleeping with practical hidden storage.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/img-17.jfif",
      "slatted/img-19.jfif",
      "slatted/img-18.jfif",
      "slatted/img-12.jfif"
    ]
  },
  {
    "id": 5,
    "slug": "rapid-5",
    "name": "Rabbora Hawaii Cream Slatted Ottoman Bed",
    "type": "Ottoman",
    "price": 239,
    "oldPrice": 420,
    "monthlyPrice": 20,
    "rating": 4,
    "reviewCount": 0,
    "badge": "43% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A soft, textured boucl\u00e9 finish gives this bed a warm, inviting character, with the option of ottoman storage for practical everyday use.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/84.png",
      "slatted/85.jfif",
      "slatted/86.png"
    ]
  },
  {
    "id": 6,
    "slug": "rapid-6",
    "name": "Rabbora Kendal Slatted Wingback Bed",
    "type": "Upholstered",
    "price": 299,
    "oldPrice": 444,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "33% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A graceful wingback silhouette adds a refined, elegant touch to the bedroom, combining classic styling with comfortable everyday support.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/img-35.png",
      "slatted/img-34.png",
      "slatted/img-33.png",
      "slatted/img-32.png",
      "slatted/img-36.png"
    ]
  },
  {
    "id": 7,
    "slug": "rapid-7",
    "name": "Rabbora Lisbon Slatted Ottoman Bed",
    "type": "Ottoman",
    "price": 349,
    "oldPrice": 420,
    "monthlyPrice": 30,
    "rating": 4,
    "reviewCount": 0,
    "badge": "17% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A stylish bed frame offering the option of ottoman storage, bringing together comfortable sleeping and practical under-bed space.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/99.jfif",
      "slatted/101.png",
      "slatted/100.png"
    ]
  },
  {
    "id": 8,
    "slug": "rapid-8",
    "name": "Rabbora Malaga Slatted Designer Bed",
    "type": "Upholstered",
    "price": 275,
    "oldPrice": 360,
    "monthlyPrice": 23,
    "rating": 4,
    "reviewCount": 0,
    "badge": "24% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "An upholstered designer bed with a refined finish, created to bring a touch of contemporary elegance to the bedroom.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/93.png",
      "slatted/95.jfif",
      "slatted/94.jfif"
    ]
  },
  {
    "id": 9,
    "slug": "rapid-9",
    "name": "Rabbora Manhattan Slatted Ottoman Bed",
    "type": "Upholstered",
    "price": 249,
    "oldPrice": 429,
    "monthlyPrice": 21,
    "rating": 4,
    "reviewCount": 0,
    "badge": "42% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A clean-lined bed frame with subtle detailing, offering a versatile and stylish foundation for a modern bedroom.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/img-1.jfif",
      "slatted/img-6.jfif",
      "slatted/img-5.jfif",
      "slatted/img-4.jfif",
      "slatted/img-2.jfif"
    ]
  },
  {
    "id": 10,
    "slug": "rapid-10",
    "name": "Rabbora Milan Slatted Wingback Ottoman Bed",
    "type": "Ottoman",
    "price": 259,
    "oldPrice": 420,
    "monthlyPrice": 22,
    "rating": 4,
    "reviewCount": 0,
    "badge": "38% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A sophisticated wingback design with the option of ottoman storage, combining classic elegance with practical everyday functionality.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/img-7.jfif",
      "slatted/img-8.jfif",
      "slatted/img-9.jfif",
      "slatted/img-10.jfif",
      "slatted/img-3.jfif"
    ]
  },
  {
    "id": 11,
    "slug": "rapid-11",
    "name": "Rabbora Mona Lisa Slatted Ottoman Bed",
    "type": "Ottoman",
    "price": 299,
    "oldPrice": 420,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "29% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "An elegant bed frame with the option of ottoman storage, designed to bring a graceful presence and practical convenience to the bedroom.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/105.jfif",
      "slatted/106.jfif",
      "slatted/107.jfif"
    ]
  },
  {
    "id": 12,
    "slug": "rapid-12",
    "name": "Rabbora Nevada Slatted Ottoman Bed",
    "type": "Upholstered",
    "price": 299,
    "oldPrice": 420,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "29% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A contemporary lined bed frame offering understated style and comfortable everyday support for a modern bedroom.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/48.png",
      "slatted/50.png",
      "slatted/49.png"
    ]
  },
  {
    "id": 13,
    "slug": "rapid-13",
    "name": "Rabbora Orlando Slatted Ottoman Bed",
    "type": "Ottoman",
    "price": 306.59,
    "oldPrice": 420,
    "monthlyPrice": 26,
    "rating": 4,
    "reviewCount": 0,
    "badge": "27% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A versatile bed frame with the option of ottoman storage, combining a comfortable sleeping space with useful hidden storage.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/img-30.png",
      "slatted/img-28.png",
      "slatted/img-29.png",
      "slatted/img-31.png",
      "slatted/img-27.png"
    ]
  },
  {
    "id": 14,
    "slug": "rapid-14",
    "name": "Rabbora Princess Signature Bed",
    "type": "Upholstered",
    "price": 349,
    "oldPrice": 420,
    "monthlyPrice": 30,
    "rating": 4,
    "reviewCount": 0,
    "badge": "17% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "An upholstered signature bed frame with a refined, tailored finish, designed to bring a touch of elegance to the bedroom.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "solid/40.jfif",
      "solid/41.jfif",
      "solid/42.jfif"
    ]
  },
  {
    "id": 15,
    "slug": "rapid-15",
    "name": "Rabbora Amalfi Slatted Italian Style Ottoman Bed",
    "type": "Ottoman",
    "price": 299,
    "oldPrice": 599,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "50% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "An Italian-inspired design with the option of ottoman storage, bringing sophisticated European styling and practical convenience together.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/168.jfif",
      "slatted/169.png",
      "slatted/170.jfif"
    ]
  },
  {
    "id": 16,
    "slug": "rapid-16",
    "name": "Rabbora Teddy Orlando Slatted Ottoman Bed",
    "type": "Ottoman",
    "price": 306.59,
    "oldPrice": 420,
    "monthlyPrice": 26,
    "rating": 4,
    "reviewCount": 0,
    "badge": "27% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A soft, inviting bed frame with the option of ottoman storage, combining comfortable everyday sleeping with useful hidden storage.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/34.png",
      "slatted/35.png",
      "slatted/36.png",
      "slatted/37.png"
    ]
  },
  {
    "id": 17,
    "slug": "rapid-17",
    "name": "Rabbora Tokyo Sunrise Slatted Ottoman Bed",
    "type": "Ottoman",
    "price": 289,
    "oldPrice": 420,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "31% off",
    "shortInfo": "Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A distinctive designer-inspired bed with the option of ottoman storage, offering an elegant silhouette and practical under-bed space.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Gas-lift ottoman storage beneath the mattress",
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
    "images": [
      "slatted/90.png",
      "slatted/91.jfif",
      "slatted/92.jfif"
    ]
  },
  {
    "id": 18,
    "slug": "rapid-18",
    "name": "Rabbora Torino Slatted Designer Bed",
    "type": "Upholstered",
    "price": 290,
    "oldPrice": 396,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "27% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A softly upholstered bumper-style design brings a rounded, contemporary character to the bedroom, with comfortable everyday support.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/80.png",
      "slatted/122.png",
      "slatted/81.png"
    ]
  },
  {
    "id": 19,
    "slug": "rapid-19",
    "name": "Rabbora Washington Slatted Bed",
    "type": "Upholstered",
    "price": 349,
    "oldPrice": 599,
    "monthlyPrice": 30,
    "rating": 4,
    "reviewCount": 0,
    "badge": "42% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A striking bed frame finished with black fabric-covered edges over a black wooden frame, bringing bold, contemporary character to the bedroom.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/45.png",
      "slatted/47.png",
      "slatted/46.png",
      "slatted/44.png"
    ]
  },
  {
    "id": 20,
    "slug": "rapid-20",
    "name": "Rabbora Duchess Slatted La Rosa Bed",
    "type": "Upholstered",
    "price": 299,
    "oldPrice": 414,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "28% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "A graceful and sophisticated bed design offering elegant styling and a timeless, decorative presence for the bedroom.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/54.png",
      "slatted/56.png",
      "slatted/55.png"
    ]
  },
  {
    "id": 21,
    "slug": "rapid-21",
    "name": "Rabbora Art Deco Slatted Ottoman Bed",
    "type": "Upholstered",
    "price": 252,
    "oldPrice": 420,
    "monthlyPrice": 21,
    "rating": 4,
    "reviewCount": 0,
    "badge": "40% off",
    "shortInfo": "Upholstered bed frame available with rapid dispatch on selected sizes and fabrics.",
    "description": "Inspired by classic Art Deco styling, this bed brings a luxurious, geometric character to the bedroom with comfortable everyday support.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
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
    "images": [
      "slatted/img-22.jfif",
      "slatted/img-24.jfif",
      "slatted/img-25.jfif",
      "slatted/img-26.jfif",
      "slatted/img-23.jfif"
    ]
  },
  {
    "id": 22,
    "slug": "rapid-22",
    "name": "Rabbora Art Deco Storage Bed",
    "type": "Storage",
    "price": 294,
    "oldPrice": 380,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "21% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "An Art Deco-inspired design with the option of drawer storage, combining distinctive styling with convenient, practical storage space.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/7.jfif",
      "drawar/8.jfif",
      "drawar/9.jfif"
    ]
  },
  {
    "id": 23,
    "slug": "rapid-23",
    "name": "Rabbora Brooklyn Storage Bed",
    "type": "Storage",
    "price": 304,
    "oldPrice": 380,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "21% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A contemporary bed frame with the option of drawer storage, bringing stylish linear detailing together with practical everyday convenience.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/16.jfif",
      "drawar/17.jfif",
      "drawar/18.jfif"
    ]
  },
  {
    "id": 24,
    "slug": "rapid-24",
    "name": "Rabbora Divan Hawaii Storage Bed",
    "type": "Storage",
    "price": 299,
    "oldPrice": 380,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "21% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A soft, textured boucl\u00e9-inspired divan design with the option of drawer storage, combining warmth and comfort with practical convenience.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4ft 6\"",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "solid/70.jfif",
      "solid/71.jfif",
      "solid/72.jfif"
    ]
  },
  {
    "id": 25,
    "slug": "rapid-25",
    "name": "Rabbora Dover Designer Storage Bed",
    "type": "Storage",
    "price": 294,
    "oldPrice": 400,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "25% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A designer storage bed with drawer storage, bringing refined styling together with generous, practical everyday storage space.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/13.jfif",
      "drawar/14.jfif",
      "drawar/15.jfif"
    ]
  },
  {
    "id": 26,
    "slug": "rapid-26",
    "name": "Rabbora Golden Skyline Storage Bed",
    "type": "Storage",
    "price": 394,
    "oldPrice": 499,
    "monthlyPrice": 34,
    "rating": 4,
    "reviewCount": 0,
    "badge": "20% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A striking statement bed with the option of drawer storage, offering a sophisticated skyline-inspired appearance and practical convenience.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/10.jfif",
      "drawar/11.jfif",
      "drawar/12.jfif"
    ]
  },
  {
    "id": 27,
    "slug": "rapid-27",
    "name": "Rabbora Lyon Storage Bed",
    "type": "Storage",
    "price": 294,
    "oldPrice": 380,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "21% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A clean, contemporary bed frame with the option of drawer storage, combining understated style with practical everyday functionality.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/1.jfif",
      "drawar/2.jfif",
      "drawar/3.jfif"
    ]
  },
  {
    "id": 28,
    "slug": "rapid-28",
    "name": "Rabbora Mayfair Storage Bed",
    "type": "Storage",
    "price": 304,
    "oldPrice": 380,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "21% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A refined bed frame with the option of drawer storage, bringing sophisticated bedroom styling together with practical convenience.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/19.jfif",
      "drawar/20.jfif",
      "drawar/21.jfif"
    ]
  },
  {
    "id": 29,
    "slug": "rapid-29",
    "name": "Rabbora Mona Lisa Storage Bed",
    "type": "Storage",
    "price": 294,
    "oldPrice": 380,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "21% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "An elegant bed frame with the option of drawer storage, combining a graceful appearance with practical, everyday storage space.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/4.jfif",
      "drawar/5.jfif",
      "drawar/6.jfif"
    ]
  },
  {
    "id": 30,
    "slug": "rapid-30",
    "name": "Rabbora Toronto Lux Storage Bed",
    "type": "Storage",
    "price": 404,
    "oldPrice": 499,
    "monthlyPrice": 34,
    "rating": 4,
    "reviewCount": 0,
    "badge": "20% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A premium storage bed with the option of drawer storage, offering a refined, luxurious appearance alongside practical convenience.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/22.jfif",
      "drawar/23.jfif",
      "drawar/24.jfif"
    ]
  },
  {
    "id": 31,
    "slug": "rapid-31",
    "name": "Rabbora Virginia Storage Bed",
    "type": "Storage",
    "price": 304,
    "oldPrice": 370,
    "monthlyPrice": 25,
    "rating": 4,
    "reviewCount": 0,
    "badge": "19% off",
    "shortInfo": "Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics.",
    "description": "A versatile bed frame with drawer storage, designed to bring practical, everyday convenience together with comfortable, supportive sleep.",
    "availableSizeLabels": [
      "Single 3ft",
      "Small Double 4ft",
      "Double 4'6ft",
      "King 5ft",
      "Super King 6ft"
    ],
    "availableSizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Drawer storage built into the base",
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
    "images": [
      "drawar/25.jfif",
      "drawar/26.jfif",
      "drawar/27.jfif"
    ]
  }
];

/* ===============================
   EDIT YOUR FABRIC/COLOUR OPTIONS HERE
   ===============================
   Same simple structure — just "name" and "image". These 6
   options are shown on every product's detail page. To change
   one, edit its "image" path the same way as above. */
var RD_FABRIC_COLLECTIONS = [
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

var RD_FABRIC_COLLECTIONS_FLAT = [];
RD_FABRIC_COLLECTIONS.forEach(function (collection) {
  collection.fabrics.forEach(function (fabric) {
    RD_FABRIC_COLLECTIONS_FLAT.push(fabric);
  });
});


// Exact per-size prices, copied from the matching product on the Slatted
// Ottoman, High Headboard and Storage Drawer pages (26 Sep 2026). A size
// missing from a bed's list is not offered for that bed. Beds not listed
// here keep the size differences below.
var RAPID_DELIVERY_SIZE_PRICES = {
  "rapid-1": { "Single": 289, "Small Double": 367.5, "Double": 399, "King": 439, "Super King": 469 }, // Rabbora Athens Slatted Designer Ottoman Bed
  "rapid-2": { "Single": 299, "Small Double": 369, "Double": 399, "King": 419, "Super King": 479 }, // Rabbora Brooklyn Slatted Bed
  "rapid-3": { "Small Double": 449, "Double": 489, "King": 529, "Super King": 549 }, // Rabbora Chicago High Headboard Bed
  "rapid-4": { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 }, // Rabbora Empire Slatted Ottoman Bed
  "rapid-5": { "Single": 239, "Small Double": 379, "Double": 399, "King": 449, "Super King": 499 }, // Rabbora Hawaii Cream Slatted Ottoman Bed
  "rapid-6": { "Single": 299, "Small Double": 409, "Double": 439, "King": 459, "Super King": 509 }, // Rabbora Kendal Slatted Wingback Bed
  "rapid-7": { "Single": 349, "Small Double": 399, "Double": 449, "King": 489, "Super King": 549 }, // Rabbora Lisbon Slatted Ottoman Bed
  "rapid-8": { "Single": 275, "Small Double": 339, "Double": 349, "King": 399, "Super King": 419 }, // Rabbora Malaga Slatted Designer Bed
  "rapid-9": { "Single": 249, "Small Double": 388, "Double": 429, "King": 459, "Super King": 499 }, // Rabbora Manhattan Slatted Ottoman Bed
  "rapid-10": { "Single": 259, "Small Double": 359, "Double": 399, "King": 439, "Super King": 469 }, // Rabbora Milan Slatted Wingback Ottoman Bed
  "rapid-11": { "Single": 299, "Small Double": 399, "Double": 419, "King": 449, "Super King": 499 }, // Rabbora Mona Lisa Slatted Ottoman Bed
  "rapid-12": { "Single": 299, "Small Double": 409, "Double": 429, "King": 459, "Super King": 499 }, // Rabbora Nevada Slatted Ottoman Bed
  "rapid-13": { "Single": 306.59, "Small Double": 409, "Double": 449, "King": 489, "Super King": 539 }, // Rabbora Orlando Slatted Ottoman Bed
  "rapid-15": { "Single": 299, "Small Double": 429, "Double": 459, "King": 499, "Super King": 529 }, // Rabbora Amalfi Slatted Italian Style Ottoman Bed
  "rapid-16": { "Single": 306.59, "Small Double": 439, "Double": 489, "King": 509, "Super King": 559 }, // Rabbora Teddy Orlando Slatted Ottoman Bed
  "rapid-17": { "Single": 289, "Small Double": 409, "Double": 425, "King": 459, "Super King": 485 }, // Rabbora Tokyo Sunrise Slatted Ottoman Bed
  "rapid-18": { "Single": 290, "Small Double": 399, "Double": 399, "King": 449, "Super King": 499 }, // Rabbora Torino Slatted Designer Bed
  "rapid-19": { "Single": 349, "Small Double": 449, "Double": 459, "King": 519, "Super King": 569 }, // Rabbora Washington Slatted Bed
  "rapid-20": { "Single": 299, "Small Double": 349, "Double": 389, "King": 419, "Super King": 499 }, // Rabbora Duchess Slatted La Rosa Bed
  "rapid-21": { "Single": 252, "Small Double": 383.99, "Double": 449, "King": 489, "Super King": 529 }, // Rabbora Art Deco Slatted Ottoman Bed
  "rapid-22": { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 }, // Rabbora Art Deco Storage Bed
  "rapid-23": { "Single": 304, "Small Double": 394, "Double": 404, "King": 454, "Super King": 490 }, // Rabbora Brooklyn Storage Bed
  "rapid-25": { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 484 }, // Rabbora Dover Designer Storage Bed
  "rapid-26": { "Single": 394, "Small Double": 444, "Double": 414, "King": 524, "Super King": 564 }, // Rabbora Golden Skyline Storage Bed
  "rapid-27": { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 }, // Rabbora Lyon Storage Bed
  "rapid-28": { "Single": 304, "Small Double": 394, "Double": 404, "King": 454, "Super King": 490 }, // Rabbora Mayfair Storage Bed
  "rapid-29": { "Single": 294, "Small Double": 384, "Double": 394, "King": 444, "Super King": 480 }, // Rabbora Mona Lisa Storage Bed
  "rapid-30": { "Single": 404, "Small Double": 455, "Double": 455, "King": 475, "Super King": 525 }, // Rabbora Toronto Lux Storage Bed
  "rapid-31": { "Single": 304, "Small Double": 384, "Double": 394, "King": 434, "Super King": 454 } // Rabbora Virginia Storage Bed
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
var RAPID_DELIVERY_SIZE_OLD_PRICES = {
  "rapid-1": { "Small Double": 465.19, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
  "rapid-2": { "Small Double": 467.09, "Double": 554.17, "King": 590.14, "Super King": 674.65 },
  "rapid-3": { "Small Double": 568.35, "Double": 679.17, "King": 745.07, "Super King": 773.24 },
  "rapid-4": { "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 },
  "rapid-5": { "Small Double": 479.75, "Double": 554.17, "King": 632.39, "Super King": 702.82 },
  "rapid-6": { "Small Double": 517.72, "Double": 609.72, "King": 646.48, "Super King": 716.9 },
  "rapid-7": { "Small Double": 505.06, "Double": 623.61, "King": 688.73, "Super King": 773.24 },
  "rapid-8": { "Small Double": 429.11, "Double": 484.72, "King": 561.97, "Super King": 590.14 },
  "rapid-9": { "Small Double": 491.14, "Double": 595.83, "King": 646.48, "Super King": 702.82 },
  "rapid-10": { "Small Double": 454.43, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
  "rapid-11": { "Small Double": 505.06, "Double": 581.94, "King": 632.39, "Super King": 702.82 },
  "rapid-12": { "Small Double": 517.72, "Double": 595.83, "King": 646.48, "Super King": 702.82 },
  "rapid-13": { "Small Double": 517.72, "Double": 623.61, "King": 688.73, "Super King": 759.15 },
  "rapid-14": { "Small Double": 391.14, "Double": 484.72, "King": 618.31, "Super King": 716.9 },
  "rapid-15": { "Small Double": 543.04, "Double": 637.5, "King": 702.82, "Super King": 745.07 },
  "rapid-16": { "Small Double": 555.7, "Double": 679.17, "King": 716.9, "Super King": 787.32 },
  "rapid-17": { "Small Double": 517.72, "Double": 590.28, "King": 646.48, "Super King": 683.1 },
  "rapid-18": { "Small Double": 505.06, "Double": 554.17, "King": 632.39, "Super King": 702.82 },
  "rapid-19": { "Small Double": 568.35, "Double": 637.5, "King": 730.99, "Super King": 801.41 },
  "rapid-20": { "Small Double": 441.77, "Double": 540.28, "King": 590.14, "Super King": 702.82 },
  "rapid-21": { "Small Double": 486.06, "Double": 623.61, "King": 688.73, "Super King": 745.07 },
  "rapid-22": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 },
  "rapid-23": { "Small Double": 498.73, "Double": 561.11, "King": 639.44, "Super King": 690.14 },
  "rapid-24": { "Small Double": 327.85, "Double": 415.28, "King": 547.89, "Super King": 646.48 },
  "rapid-25": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 681.69 },
  "rapid-26": { "Small Double": 562.03, "Double": 575, "King": 738.03, "Super King": 794.37 },
  "rapid-27": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 },
  "rapid-28": { "Small Double": 498.73, "Double": 561.11, "King": 639.44, "Super King": 690.14 },
  "rapid-29": { "Small Double": 486.08, "Double": 547.22, "King": 625.35, "Super King": 676.06 },
  "rapid-30": { "Small Double": 575.95, "Double": 631.94, "King": 669.01, "Super King": 739.44 },
  "rapid-31": { "Small Double": 486.08, "Double": 547.22, "King": 611.27, "Super King": 639.44 }
};


// Price of one size before add-ons. With no size selected this is the
// bed's base price (its first, cheapest size).
function rdSizePrice(product, size) {
  var map = RAPID_DELIVERY_SIZE_PRICES[product.slug];
  if (size && map && typeof map[size] === "number") return map[size];
  var delta = size ? (RAPID_DELIVERY_SIZE_DELTAS[size] || 0) : 0;
  return Math.max(0, product.price + delta);
}

// Button / table text for a size, e.g. "King 5ft".
function rdSizeLabel(product, size) {
  var i = product.availableSizes.indexOf(size);
  return (product.availableSizeLabels && product.availableSizeLabels[i]) || size;
}

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
    imageIndex: 0,
    ottomanStorage: null,
    footstoolBlanketBox: null,
    headboardCustom: null,
    customRequest: "",
    assembly: null,
    deliveryDelay: null,
    deliveryDate: ""
  };

  var ASSEMBLY_PRICE = 59;

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
    var imagePlaceholder = document.getElementById("rd2DetailImagePlaceholder");
    var thumbsWrap = document.getElementById("rd2GalleryThumbs");
    var prevBtn = document.getElementById("rd2GalleryPrev");
    var nextBtn = document.getElementById("rd2GalleryNext");
    var zoomBtn = document.getElementById("rd2GalleryZoom");
    var lightbox = document.getElementById("rd2Lightbox");
    var lightboxImage = document.getElementById("rd2LightboxImage");
    var lightboxClose = document.getElementById("rd2LightboxClose");
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
    var ottomanStorageEl = document.getElementById("rd2OttomanStorageOptions");
    var ottomanStorageMsg = document.getElementById("rd2OttomanStorageMessage");
    var footstoolEl = document.getElementById("rd2FootstoolOptions");
    var footstoolMsg = document.getElementById("rd2FootstoolMessage");
    var headboardCustomEl = document.getElementById("rd2HeadboardCustomOptions");
    var headboardCustomMsg = document.getElementById("rd2HeadboardCustomMessage");
    var customRequestEl = document.getElementById("rd2CustomRequest");
    var assemblyEl = document.getElementById("rd2AssemblyOptions");
    var assemblyMsg = document.getElementById("rd2AssemblyMessage");
    var deliveryDelayEl = document.getElementById("rd2DeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("rd2DeliveryDelayMessage");
    var delayDateWrap = document.getElementById("rd2DelayDateWrap");
    var delayDateInput = document.getElementById("rd2DelayDate");
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
      var sizeOnly = rdSizePrice(product, rd2State.selectedSize);
      var addons = rd2State.assembly === "yes" ? ASSEMBLY_PRICE : 0;
      return sizeOnly + addons;
    }

    // Shared helper for the five new single-select option groups — each
    // is a plain group of .rd2-option-pill buttons where exactly one
    // choice can be active at a time.
    function initRadioPillGroup(container, stateKey, messageEl2, onSelect) {
      if (!container) return;
      qsa(".rd2-option-pill", container).forEach(function (btn) {
        btn.addEventListener("click", function () {
          rd2State[stateKey] = btn.dataset.value;
          qsa(".rd2-option-pill", container).forEach(function (el) {
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
        rd2State.customRequest = customRequestEl.value;
      });
    }

    if (delayDateInput) {
      delayDateInput.addEventListener("change", function () {
        rd2State.deliveryDate = delayDateInput.value;
      });
    }

    function renderGallery(product) {
      var images = product.images;
      mainImage.src = images[rd2State.imageIndex] || images[0];
      mainImage.alt = "";
      mainImage.onerror = function () {
        mainImage.hidden = true;
        if (imagePlaceholder) imagePlaceholder.hidden = false;
      };
      mainImage.onload = function () {
        mainImage.hidden = false;
        if (imagePlaceholder) imagePlaceholder.hidden = true;
      };

      // When only one real photo exists for this product, show it
      // repeated across a few thumbnail slots so the gallery strip has
      thumbsWrap.innerHTML = "";
      if (images.length > 1) {
        images.forEach(function (src, index) {
          var img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.loading = "lazy";
          img.onerror = function () { img.style.visibility = "hidden"; };
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


    // ---- Selected-size price (shown directly below the size buttons) ----
    // Always shows the price of the size that is currently selected, and
    // nothing while no size is selected. The crossed-out price is only
    // shown when the product data has a real original price for that
    // size (the stored oldPrice belongs to the base size, i.e. the size
    // with no price difference) and it is higher than the price.
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
      var anchor = sizeOptionsEl;
      if (!anchor || !anchor.parentNode) return;
      if (!sizePriceRow) {
        sizePriceRow = document.createElement("div");
        sizePriceRow.className = "rd2-detail__price-row";
        sizePriceRow.setAttribute("data-size-price", "");
        sizePriceRow.setAttribute("aria-live", "polite");
        sizePriceRow.style.marginTop = "0.75rem";
        sizePriceRow.innerHTML =
          '<span class="rd2-detail__price"></span>' +
          '<span class="product-card__price-prev"></span>';
      }
      if (anchor.nextSibling !== sizePriceRow) {
        anchor.parentNode.insertBefore(sizePriceRow, anchor.nextSibling);
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
      sizeOptionsEl.innerHTML = "";
      product.availableSizes.forEach(function (size) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rd2-option-pill";
        btn.setAttribute("aria-pressed", String(rd2State.selectedSize === size));
        btn.textContent = rdSizeLabel(product, size);
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

    // Fabric Colour — updated to the current, real Rabbora Fabric
    // Samples collection (95 colours across 10 groups, the same
    // verified real fabric/*.jfif paths already used throughout the
    // site), replacing the old 29-colour catalog with broken image
    // paths. Keeps this page's own .rd2-fabric-swatch styling, just
    // grouped under collection headings like every other page.
    function renderFabricOptions() {
      fabricOptionsEl.innerHTML = "";

      RD_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "rd2-fabric-collection";

        var titleEl2 = document.createElement("p");
        titleEl2.className = "rd2-fabric-collection-title";
        titleEl2.textContent = collection.name;
        groupEl.appendChild(titleEl2);

        var gridEl = document.createElement("div");
        gridEl.className = "rd2-fabric-grid";

        collection.fabrics.forEach(function (fabric) {
          var flatIndex = RD_FABRIC_COLLECTIONS_FLAT.indexOf(fabric);
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "rd2-fabric-swatch";
          btn.setAttribute("aria-pressed", String(rd2State.selectedFabricIndex === flatIndex));
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
            rd2State.selectedFabricIndex = flatIndex;
            qsa(".rd2-fabric-swatch", fabricOptionsEl).forEach(function (el) {
              el.setAttribute("aria-pressed", "false");
            });
            btn.setAttribute("aria-pressed", "true");
          });
          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricOptionsEl.appendChild(groupEl);
      });
    }

    function renderPrice(product) {
      priceEl.textContent = money(currentPrice(product));
      var sizePrice = rdSizePrice(product, rd2State.selectedSize);
      // The stored oldPrice belongs to the base (first) size only.
      var isBaseSize = !rd2State.selectedSize ||
        (RAPID_DELIVERY_SIZE_PRICES[product.slug]
          ? rd2State.selectedSize === product.availableSizes[0]
          : sizePrice === product.price);
      var validOldPrice = (isBaseSize && product.oldPrice && product.oldPrice > sizePrice) ? product.oldPrice : null;
      // Small Double / Double / King / Super King: old price from
      // RAPID_DELIVERY_SIZE_OLD_PRICES (Single keeps its existing old price).
      var listedOld = (rd2State.selectedSize && rd2State.selectedSize !== "Single" && RAPID_DELIVERY_SIZE_OLD_PRICES[product.slug])
        ? RAPID_DELIVERY_SIZE_OLD_PRICES[product.slug][rd2State.selectedSize] : null;
      if (typeof listedOld === "number") validOldPrice = listedOld > sizePrice ? listedOld : null;
      prevPriceEl.textContent = validOldPrice ? money(validOldPrice) : "";
      renderSelectedSizePrice(rd2State.selectedSize, sizePrice, validOldPrice);
      // Price area: size label, old price, "% off" and monthly amount.
      rbUpdatePriceArea({
        priceEl: priceEl, prevEl: prevPriceEl, monthlyEl: monthlyEl,
        finalPrice: currentPrice(product), sizePrice: sizePrice, oldPrice: validOldPrice,
        sizeKey: rd2State.selectedSize, sizeOptions: sizeOptionsEl, sizeRow: sizePriceRow,
        money: money
      });
    }

    function renderDimensions(product) {
      var rows = product.availableSizes.map(function (size) {
        var d = product.dimensions[size];
        return "<tr><td>" + rdSizeLabel(product, size) + "</td><td>" + d.width + "</td><td>" + d.length + "</td></tr>";
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
              '<img src="' + p.images[0] + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="rapid-delivery-beds.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
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
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
      monthlyEl.textContent = "or from \u00A3" + product.monthlyPrice + "/month";
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

      rd2State.ottomanStorage = null;
      rd2State.footstoolBlanketBox = null;
      rd2State.headboardCustom = null;
      rd2State.customRequest = "";
      rd2State.assembly = null;
      rd2State.deliveryDelay = null;
      rd2State.deliveryDate = "";
      [ottomanStorageEl, footstoolEl, headboardCustomEl, assemblyEl, deliveryDelayEl].forEach(function (group) {
        if (!group) return;
        qsa(".rd2-option-pill", group).forEach(function (el) {
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
        var images = currentProduct.images;
        rd2State.imageIndex = (rd2State.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.images;
        rd2State.imageIndex = (rd2State.imageIndex + 1) % images.length;
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
        // Each required new option shows its own inline message right
        // next to that option (not just one generic message at the
        // bottom), checked top-to-bottom in the order they appear.
        if (!rd2State.ottomanStorage) {
          ottomanStorageMsg.textContent = "Please select an option.";
          ottomanStorageEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!rd2State.footstoolBlanketBox) {
          footstoolMsg.textContent = "Please select an option.";
          footstoolEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!rd2State.headboardCustom) {
          headboardCustomMsg.textContent = "Please select an option.";
          headboardCustomEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!rd2State.assembly) {
          assemblyMsg.textContent = "Please select an option.";
          assemblyEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!rd2State.deliveryDelay) {
          deliveryDelayMsg.textContent = "Please select an option.";
          deliveryDelayEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        var fabricName = RD_FABRIC_COLLECTIONS_FLAT[rd2State.selectedFabricIndex].name;
        var fabricSlug = RD_FABRIC_COLLECTIONS_FLAT[rd2State.selectedFabricIndex].slug;
        var fabricImage = RD_FABRIC_COLLECTIONS_FLAT[rd2State.selectedFabricIndex].image;
        var unitPrice = currentPrice(currentProduct);

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "rapid-delivery-bed-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "rapid-delivery-beds.html#/" + currentProduct.slug,
              image: currentProduct.images[0] || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "Rapid Delivery Beds",
              variant: {
                size: rd2State.selectedSize,
                fabric: fabricName,
                fabricSlug: fabricSlug,
                fabricImage: fabricImage,
                ottomanStorage: rd2State.ottomanStorage,
                footstoolBlanketBox: rd2State.footstoolBlanketBox,
                headboardHeight: rd2State.headboardCustom,
                customRequest: rd2State.customRequest || null,
                assembly: rd2State.assembly,
                assemblyPrice: rd2State.assembly === "yes" ? ASSEMBLY_PRICE : 0,
                deliveryDelay: rd2State.deliveryDelay,
                deliveryDate: rd2State.deliveryDelay === "yes" ? (rd2State.deliveryDate || null) : null
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


  /* ---- Review data cleanup: no verified real reviews exist yet, so
     replace any star/count display with an honest "No reviews yet"
     message instead of showing invented numbers. Excludes the detail
     view's own rating element (.rd2-detail__rating), which is
     populated separately by renderDetail() once a product is opened. ---- */
  function cleanupFakeRatings() {
    document.querySelectorAll(".product-card__rating:not(.rd2-detail__rating)").forEach(function (el) {
      el.innerHTML = '<span class="product-card__no-reviews">No reviews yet</span>';
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cleanupFakeRatings();
    initToolbar();
    initFaq();
    initDetail();
  });
})();