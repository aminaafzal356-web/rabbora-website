/* =========================================================
   RABBORA LIVING — HIGH HEADBOARD BEDS
   ---------------------------------------------------------
   Self-contained data + page logic for high-headboard-beds.html.
   Loaded AFTER search-index.js and script.js (which run the
   shared header, mobile nav, global search, dropdown, etc. —
   none of that is touched here).

   EDIT YOUR PRODUCTS HERE — to change a photo, replace the
   "image" path (main card) or any entry in "gallery" (detail
   page, 5 images). No slugs, no auto-generated filenames.
   ========================================================= */

var HH_FABRIC_COLLECTIONS = [
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

var HH_FABRIC_COLLECTIONS_FLAT = [];
HH_FABRIC_COLLECTIONS.forEach(function (collection) {
  collection.fabrics.forEach(function (fabric) {
    HH_FABRIC_COLLECTIONS_FLAT.push(fabric);
  });
});

var HH_BED_PRODUCTS = 
[
  {
    "id": 1,
    "slug": "high-headboard-bed-1",
    "name": "Rabbora Duke High & Wide Headboard Bed",
    "price": 799.0,
    "oldPrice": 1000.0,
    "monthly": 67,
    "rating": 5,
    "reviews": 20,
    "badge": "20% off",
    "headboardHeight": "130cm",
    "shortInfo": "Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing.",
    "description": "A luxurious statement bed designed around an impressive high and wide headboard, creating a sophisticated bedroom focal point with an elegant and refined presence.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 130cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/1.jfif",
    "gallery": [
      "high/1.jfif",
      "high/2.jfif",
      "high/3.jfif",
      "high/4.jfif"
    ]
  },
  {
    "id": 2,
    "slug": "high-headboard-bed-2",
    "name": "Rabbora Las Vegas High Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthly": 63,
    "rating": 5,
    "reviews": 33,
    "badge": "25% off",
    "headboardHeight": "140cm",
    "shortInfo": "Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing.",
    "description": "A striking high-headboard design created to bring a luxurious hotel-inspired atmosphere to the bedroom while offering an elegant and comfortable place to rest.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 140cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/5.jfif",
    "gallery": [
      "high/5.jfif",
      "high/6.jfif",
      "high/7.jfif",
        "high/8.jfif",

    ]
  },
  {
    "id": 3,
    "slug": "high-headboard-bed-3",
    "name": "Rabbora Athena High Headboard Bed",
    "price": 699.0,
    "oldPrice": 900.0,
    "monthly": 59,
    "rating": 4,
    "reviews": 46,
    "badge": "22% off",
    "headboardHeight": "150cm",
    "shortInfo": "Statement upholstered headboard standing 150cm tall, with deep-buttoned detailing.",
    "description": "An elegant high-headboard bed designed to create a sophisticated bedroom centrepiece with graceful proportions, refined styling and comfortable sleeping space.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 150cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/9.jfif",
    "gallery": [
      "high/9.jfif",
      "high/10.jfif",
      "high/11.jfif",
      "high/12.jfif"
    ]
  },
  {
    "id": 4,
    "slug": "high-headboard-bed-4",
    "name": "Rabbora Chicago High Headboard Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthly": 30,
    "rating": 5,
    "reviews": 59,
    "badge": "17% off",
    "headboardHeight": "130cm",
    "shortInfo": "Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing.",
    "description": "A sophisticated high-headboard design that gives the bedroom a strong and elegant focal point while creating a comfortable and inviting sleeping environment.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 130cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/13.jfif",
    "gallery": [
      "high/13.jfif",
      "high/14.jfif",
      "high/15.jfif",
      "high/16.jfif"
    ]
  },
  {
    "id": 5,
    "slug": "high-headboard-bed-5",
    "name": "Rabbora Model Square Hotel Bed",
    "price": 649.0,
    "oldPrice": 1000.0,
    "monthly": 55,
    "rating": 5,
    "reviews": 72,
    "badge": "35% off",
    "headboardHeight": "140cm",
    "shortInfo": "Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing.",
    "description": "A bold hotel-inspired bed featuring a distinctive structured profile, designed to bring a luxurious and sophisticated character to the modern bedroom.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 140cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/17.jfif",
    "gallery": [
      "high/17.jfif",
      "high/18.jfif",
      "high/19.jfif"
    ]
  },
  {
    "id": 6,
    "slug": "high-headboard-bed-6",
    "name": "Rabbora Starlight Luxury Bed",
    "price": 599.0,
    "oldPrice": 900.0,
    "monthly": 50,
    "rating": 4,
    "reviews": 85,
    "badge": "33% off",
    "headboardHeight": "150cm",
    "shortInfo": "Statement upholstered headboard standing 150cm tall, with deep-buttoned detailing.",
    "description": "A glamorous bedroom centrepiece designed to create an elegant and luxurious atmosphere, bringing refined character and sophisticated style to your bedroom.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 150cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/20.jfif",
    "gallery": [
      "high/20.jfif",
      "high/21.jfif",
      "high/22.jfif",
      "high/23.jfif"
    ]
  },
  {
    "id": 7,
    "slug": "high-headboard-bed-7",
    "name": "Rabbora DaVinci Tall Headboard Bed",
    "price": 749.0,
    "oldPrice": 900.0,
    "monthly": 63,
    "rating": 5,
    "reviews": 98,
    "badge": "17% off",
    "headboardHeight": "130cm",
    "shortInfo": "Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing.",
    "description": "A grand tall-headboard design created to make an impressive statement in the bedroom while offering an elegant appearance and comfortable sleeping space.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 130cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/24.jfif",
    "gallery": [
      "high/24.jfif",
      "high/25.jfif",
      "high/26.jfif",
      "high/27.jfif"
    ]
  },
  {
    "id": 8,
    "slug": "high-headboard-bed-8",
    "name": "Rabbora Geneva High & Wide Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthly": 63,
    "rating": 5,
    "reviews": 111,
    "badge": "25% off",
    "headboardHeight": "140cm",
    "shortInfo": "Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing.",
    "description": "A luxurious high and wide headboard design created to give the bedroom a dramatic focal point with sophisticated styling and an elegant, comfortable feel.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 140cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/28.jfif",
    "gallery": [
      "high/28.jfif",
      "high/29.jfif",
      "high/30.jfif",
      "high/31.jfif"
    ]
  },
  {
    "id": 9,
    "slug": "high-headboard-bed-9",
    "name": "Rabbora Bahamas Wide Headboard Bed",
    "price": 749.0,
    "oldPrice": 1000.0,
    "monthly": 63,
    "rating": 4,
    "reviews": 124,
    "badge": "25% off",
    "headboardHeight": "150cm",
    "shortInfo": "Statement upholstered headboard standing 150cm tall, with deep-buttoned detailing.",
    "description": "A grand hotel-inspired design featuring a wide statement headboard, created to bring an impressive and luxurious character to the bedroom.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 150cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/32.jfif",
    "gallery": [
      "high/32.jfif",
      "high/33.jfif",
      "high/34.jfif"
    ]
  },
  {
    "id": 10,
    "slug": "high-headboard-bed-10",
    "name": "Rabbora Riviera High Headboard Bed",
    "price": 549.0,
    "oldPrice": 900.0,
    "monthly": 46,
    "rating": 5,
    "reviews": 137,
    "badge": "39% off",
    "headboardHeight": "130cm",
    "shortInfo": "Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing.",
    "description": "A refined high-headboard bed designed to create an elegant bedroom focal point while bringing a sophisticated and luxurious feel to the space.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 130cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/35.jfif",
    "gallery": [
      "high/35.jfif",
      "high/36.jfif",
      "high/37.jfif",
    
    ]
  },
  {
    "id": 11,
    "slug": "high-headboard-bed-11",
    "name": "Rabbora New York Tall Headboard Bed",
    "price": 799.0,
    "oldPrice": 900.0,
    "monthly": 67,
    "rating": 5,
    "reviews": 150,
    "badge": "11% off",
    "headboardHeight": "140cm",
    "shortInfo": "Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing.",
    "description": "A striking tall-headboard design created to give the bedroom a contemporary luxury appearance with an impressive presence and elegant proportions.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 140cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/40.png",
    "gallery": [
      "high/40.png",
      "high/38.png",
      "high/39.png",
      
    ]
  },
  {
    "id": 12,
    "slug": "high-headboard-bed-12",
    "name": "Rabbora Grand Luxury Upholstered Bed",
    "price": 1199.0,
    "oldPrice": 1499.0,
    "monthly": 100,
    "rating": 4,
    "reviews": 163,
    "badge": "20% off",
    "headboardHeight": "150cm",
    "shortInfo": "Statement upholstered headboard standing 150cm tall, with deep-buttoned detailing.",
    "description": "A premium statement bed designed to bring a sophisticated and luxurious finish to the bedroom, combining an impressive profile with an elegant upholstered appearance.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 150cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/41.jfif",
    "gallery": [
      "high/41.jfif",
      "high/42.png",
      "high/43.jfif"
    ]
  },
  {
    "id": 13,
    "slug": "high-headboard-bed-13",
    "name": "Rabbora Silver Fern High Headboard Bed",
    "price": 799.00,
    "oldPrice": 900.0,
    "monthly": 67,
    "rating": 5,
    "reviews": 176,
    "badge": "39% off",
    "headboardHeight": "130cm",
    "shortInfo": "Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing.",
    "description": "An elegant high-headboard design created to add a refined and luxurious focal point to the bedroom while providing a comfortable and inviting sleeping space.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 130cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/44.jfif",
    "gallery": [
      "high/44.jfif",
      "high/45.png",
       "high/46.jfif",

    ]
  },
  {
    "id": 14,
    "slug": "high-headboard-bed-14",
    "name": "Rabbora Marble Bahamas Wide Headboard Bed",
    "price": 549.00,
    "oldPrice": 900.00,
    "monthly": 46,
    "rating": 5,
    "reviews": 189,
    "badge": "20% off",
    "headboardHeight": "140cm",
    "shortInfo": "Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing.",
    "description": "A luxurious wide-headboard design created to give the bedroom a sophisticated hotel-inspired presence with an elegant and impressive overall appearance.",
    "sizes": [
      "Single",
      "Small Double",
      "Double",
      "King",
      "Super King"
    ],
    "features": [
      "Statement headboard, 140cm tall",
      "Deep-buttoned upholstered detailing",
      "Solid frame construction built for everyday use",
      "Sprung slatted base for a comfortable, breathable sleep surface"
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
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds.",
    "image": "high/49.png",
    "gallery": [
      "high/49.png",
     "high/47.png",
      "high/48.jfif"
       
    ]
  }
];

var HH_BED_SIZE_DELTAS = {
  "Single": -110,
  "Small Double": -55,
  "Double": 0,
  "King": 105,
  "Super King": 185
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

  var HH_PRODUCTS_BY_SLUG = {};
  HH_BED_PRODUCTS.forEach(function (p) {
    HH_PRODUCTS_BY_SLUG[p.slug] = p;
  });

  var hhState = {
    selectedSize: null,
    quantity: 1,
    imageIndex: 0
  };

  /* ---- Product count ---- */
  function initToolbar() {
    var grid = document.getElementById("hhProductGrid");
    if (!grid) return;
    var countEl = document.getElementById("hhProductCount");
    var cards = qsa(".hh-product-card", grid);
    if (countEl) countEl.textContent = cards.length + (cards.length === 1 ? " Bed" : " Beds");
  }

  /* ---- Grid / list view toggle ---- */
  function initViewToggle() {
    var grid = document.getElementById("hhProductGrid");
    var gridBtn = document.getElementById("hhGridViewBtn");
    var listBtn = document.getElementById("hhListViewBtn");
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

  /* ---- 4 / 5 columns per row toggle ---- */
  function initColumnsToggle() {
    var grid = document.getElementById("hhProductGrid");
    var cols4Btn = document.getElementById("hhCols4Btn");
    var cols5Btn = document.getElementById("hhCols5Btn");
    if (!grid || !cols4Btn || !cols5Btn) return;

    cols4Btn.addEventListener("click", function () {
      grid.classList.remove("hh-grid--cols-5");
      cols4Btn.classList.add("is-active");
      cols4Btn.setAttribute("aria-pressed", "true");
      cols5Btn.classList.remove("is-active");
      cols5Btn.setAttribute("aria-pressed", "false");
    });

    cols5Btn.addEventListener("click", function () {
      grid.classList.add("hh-grid--cols-5");
      cols5Btn.classList.add("is-active");
      cols5Btn.setAttribute("aria-pressed", "true");
      cols4Btn.classList.remove("is-active");
      cols4Btn.setAttribute("aria-pressed", "false");
    });
  }

  /* ---- FAQ accordion ---- */
  function initFaq() {
    qsa(".hh-faq-item").forEach(function (item) {
      var toggle = qs(".hh-faq-item__toggle", item);
      if (!toggle) return;
      toggle.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        item.classList.toggle("is-open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  /* ---- Detail view: one reusable component for all 14 products ---- */
  function initDetail() {
    var categoryView = document.getElementById("hhCategoryView");
    var detailView = document.getElementById("hhDetailView");
    var notFoundView = document.getElementById("hhNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("hhDetailBreadcrumbName");
    var mainImage = document.getElementById("hhGalleryMainImage");
    var thumbsWrap = document.getElementById("hhGalleryThumbs");
    var prevBtn = document.getElementById("hhGalleryPrev");
    var nextBtn = document.getElementById("hhGalleryNext");
    var zoomBtn = document.getElementById("hhGalleryZoom");
    var lightbox = document.getElementById("hhLightbox");
    var lightboxImage = document.getElementById("hhLightboxImage");
    var lightboxClose = document.getElementById("hhLightboxClose");
    var headboardHeightEl = document.getElementById("hhDetailHeadboardHeight");
    var titleEl = document.getElementById("hhDetailTitle");
    var starsEl = document.getElementById("hhDetailStars");
    var reviewCountEl = document.getElementById("hhDetailReviewCount");
    var priceEl = document.getElementById("hhDetailPrice");
    var prevPriceEl = document.getElementById("hhDetailPrevPrice");
    var monthlyEl = document.getElementById("hhDetailMonthly");
    var descriptionEl = document.getElementById("hhDetailDescription");
    var sizeOptionsEl = document.getElementById("hhSizeOptions");
    var featuresEl = document.getElementById("hhDetailFeatures");
    var fabricOptionsEl = document.getElementById("hhModalFabrics");
    var selectedFabricNameEl = document.getElementById("hhSelectedFabricName");
    var ottomanStorageEl = document.getElementById("hhOttomanStorageOptions");
    var ottomanStorageMsg = document.getElementById("hhOttomanStorageMessage");
    var footstoolEl = document.getElementById("hhFootstoolOptions");
    var footstoolMsg = document.getElementById("hhFootstoolMessage");
    var headboardCustomEl = document.getElementById("hhHeadboardCustomOptions");
    var headboardCustomMsg = document.getElementById("hhHeadboardCustomMessage");
    var customRequestEl = document.getElementById("hhCustomRequest");
    var assemblyEl = document.getElementById("hhAssemblyOptions");
    var assemblyMsg = document.getElementById("hhAssemblyMessage");
    var deliveryDelayEl = document.getElementById("hhDeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("hhDeliveryDelayMessage");
    var delayDateWrap = document.getElementById("hhDelayDateWrap");
    var delayDateInput = document.getElementById("hhDelayDate");
    var dimensionsEl = document.getElementById("hhDetailDimensions");
    var deliveryEl = document.getElementById("hhDetailDelivery");
    var warrantyEl = document.getElementById("hhDetailWarranty");
    var returnsEl = document.getElementById("hhDetailReturns");
    var relatedGrid = document.getElementById("hhRelatedGrid");
    var qtyValueEl = document.getElementById("hhQtyValue");
    var qtyMinus = document.getElementById("hhQtyMinus");
    var qtyPlus = document.getElementById("hhQtyPlus");
    var addBtn = document.getElementById("hhAddToCart");
    var buyNowBtn = document.getElementById("hhBuyNow");
    var wishlistBtn = document.getElementById("hhWishlistBtn");
    var messageEl = document.getElementById("hhPurchaseMessage");

    var currentProduct = null;
    var hhWishlist = new Set();
    var selectedFabricIndex = -1;
    var ottomanStorage = null;
    var footstoolBlanketBox = null;
    var headboardCustom = null;
    var customRequest = "";
    var assembly = null;
    var deliveryDelay = null;
    var deliveryDate = "";

    var ASSEMBLY_PRICE = 59;

    function currentPrice(product) {
      var delta = hhState.selectedSize ? (HH_BED_SIZE_DELTAS[hhState.selectedSize] || 0) : 0;
      var addons = assembly === "yes" ? ASSEMBLY_PRICE : 0;
      return Math.max(0, product.price + delta + addons);
    }

    // Renders the gallery using each product's own "gallery" array —
    // the exact same image links defined in the product data, never
    // invented. The main wrap already carries a CSS-only pulsing glow
    // (hh-detail__main-wrap--glow in the HTML) applied around whichever
    // image is currently shown, so no separate "flash" asset is needed.
    function renderGallery(product) {
      var images = product.gallery && product.gallery.length ? product.gallery : [product.image];
      mainImage.src = images[hhState.imageIndex] || images[0];
      mainImage.alt = product.name;

      thumbsWrap.innerHTML = "";
      images.forEach(function (src, index) {
        var thumb = document.createElement("img");
        thumb.src = src;
        thumb.alt = "";
        thumb.loading = "lazy";
        if (index === hhState.imageIndex) thumb.classList.add("is-active");
        thumb.addEventListener("click", function () {
          hhState.imageIndex = index;
          renderGallery(product);
        });
        thumbsWrap.appendChild(thumb);
      });
    }

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.sizes.forEach(function (size) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "hh-option-pill";
        btn.setAttribute("aria-pressed", String(hhState.selectedSize === size));
        btn.textContent = size;
        btn.addEventListener("click", function () {
          hhState.selectedSize = size;
          messageEl.textContent = "";
          qsa(".hh-option-pill", sizeOptionsEl).forEach(function (el) {
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
      var others = HH_BED_PRODUCTS.filter(function (p) { return p.slug !== product.slug; });
      var related = others.slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + money(p.oldPrice) + '</span>' : "";
        var card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="high-headboard-beds.html#/' + p.slug + '">' +
              '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="high-headboard-beds.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
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

    function syncWishlistButton(product) {
      if (!wishlistBtn) return;
      var isSaved = hhWishlist.has(product.slug);
      wishlistBtn.setAttribute("aria-pressed", String(isSaved));
      wishlistBtn.setAttribute("aria-label", isSaved ? "Remove from wishlist" : "Add to wishlist");
    }

    // Fabric Colour — same real, current Fabric Samples collection data
    // and the same grouped/collection-heading swatch pattern already
    // used on Blanket Boxes, Sofas, Bed Frames and Solid Base Ottoman.
    // No fabric selector existed on this page before, so this is new,
    // but reuses the exact same shared component/markup, not a new
    // design.
    function selectedFabricName() {
      if (selectedFabricIndex === -1) return "";
      var fabric = HH_FABRIC_COLLECTIONS_FLAT[selectedFabricIndex];
      return fabric ? fabric.name : "";
    }

    function updateSelectedFabricName() {
      if (!selectedFabricNameEl) return;
      var name = selectedFabricName();
      if (name) {
        selectedFabricNameEl.textContent = "Selected: " + name;
        selectedFabricNameEl.classList.remove("is-empty");
      } else {
        selectedFabricNameEl.textContent = "No fabric colour selected yet";
        selectedFabricNameEl.classList.add("is-empty");
      }
    }

    function renderFabricOptions(product) {
      if (!fabricOptionsEl) return;
      fabricOptionsEl.innerHTML = "";

      HH_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl2 = document.createElement("p");
        titleEl2.className = "bb-modal__fabric-collection-title";
        titleEl2.textContent = collection.name;
        groupEl.appendChild(titleEl2);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric) {
          var flatIndex = HH_FABRIC_COLLECTIONS_FLAT.indexOf(fabric);
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(selectedFabricIndex === flatIndex));
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
            var alreadySelected = selectedFabricIndex === flatIndex;
            qsa(".fabric-swatch", fabricOptionsEl).forEach(function (el) {
              el.setAttribute("aria-pressed", "false");
            });
            if (alreadySelected) {
              selectedFabricIndex = -1;
            } else {
              selectedFabricIndex = flatIndex;
              btn.setAttribute("aria-pressed", "true");
            }
            updateSelectedFabricName();
          });
          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricOptionsEl.appendChild(groupEl);
      });
    }

    // Shared helper for the six new single-select option groups —
    // each is a plain group of .hh-option-pill buttons where exactly
    // one choice can be active at a time.
    function initRadioPillGroup(container, messageEl2, onSelect) {
      if (!container) return;
      qsa(".hh-option-pill", container).forEach(function (btn) {
        btn.addEventListener("click", function () {
          qsa(".hh-option-pill", container).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          if (messageEl2) messageEl2.textContent = "";
          onSelect(btn.dataset.value);
        });
      });
    }

    initRadioPillGroup(ottomanStorageEl, ottomanStorageMsg, function (value) {
      ottomanStorage = value;
    });

    initRadioPillGroup(footstoolEl, footstoolMsg, function (value) {
      footstoolBlanketBox = value;
    });

    initRadioPillGroup(headboardCustomEl, headboardCustomMsg, function (value) {
      headboardCustom = value;
    });

    initRadioPillGroup(assemblyEl, assemblyMsg, function (value) {
      assembly = value;
      if (currentProduct) renderPrice(currentProduct);
    });

    initRadioPillGroup(deliveryDelayEl, deliveryDelayMsg, function (value) {
      deliveryDelay = value;
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
      document.title = product.name + " | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) descTag.setAttribute("content", product.name + " \u2014 " + product.shortInfo);
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/high-headboard-beds/" + product.slug);

      breadcrumbName.textContent = product.name;
      headboardHeightEl.textContent = "Headboard Height: " + product.headboardHeight;
      titleEl.textContent = product.name;
      starsEl.textContent = "";
      reviewCountEl.textContent = "No reviews yet";
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

      hhState.selectedSize = null;
      hhState.quantity = 1;
      hhState.imageIndex = 0;
      qtyValueEl.textContent = "1";
      messageEl.textContent = "";
      messageEl.classList.remove("is-error");

      selectedFabricIndex = -1;
      updateSelectedFabricName();

      ottomanStorage = null;
      footstoolBlanketBox = null;
      headboardCustom = null;
      customRequest = "";
      assembly = null;
      deliveryDelay = null;
      deliveryDate = "";
      [ottomanStorageEl, footstoolEl, headboardCustomEl, assemblyEl, deliveryDelayEl].forEach(function (group) {
        if (!group) return;
        qsa(".hh-option-pill", group).forEach(function (el) {
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
      renderFabricOptions(product);
      renderPrice(product);
      renderDimensions(product);
      renderRelated(product);
      syncWishlistButton(product);
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "High Headboard Beds | Statement Bed Frames | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) descTag.setAttribute("content", "Shop High Headboard Beds at Rabbora Living. Statement upholstered bed frames with deep-buttoned tall headboards, handmade in Britain with a 24-month warranty.");
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/high-headboard-beds");
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
      var product = HH_PRODUCTS_BY_SLUG[slug];
      if (product) { showDetail(product); } else { showNotFound(); }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        hhState.imageIndex = (hhState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        hhState.imageIndex = (hhState.imageIndex + 1) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (zoomBtn) {
      zoomBtn.addEventListener("click", function () {
        if (!mainImage.src) return;
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
        if (hhState.quantity > 1) {
          hhState.quantity -= 1;
          qtyValueEl.textContent = String(hhState.quantity);
        }
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        hhState.quantity += 1;
        qtyValueEl.textContent = String(hhState.quantity);
      });
    }

    // Shared validation for both Add to Basket and Buy Now — each
    // required option shows its own inline message right next to that
    // option (not just one generic message at the bottom), checked in
    // the same top-to-bottom order they appear on the page.
    function validateRequiredOptions() {
      if (!hhState.selectedSize) {
        messageEl.textContent = "Please select a size.";
        messageEl.classList.add("is-error");
        return false;
      }
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

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!validateRequiredOptions()) return;

        var unitPrice = currentPrice(currentProduct);
        var fabricName = selectedFabricName();

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "high-headboard-bed-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "high-headboard-beds.html#/" + currentProduct.slug,
              image: currentProduct.image || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "High Headboard Beds",
              variant: {
                size: hhState.selectedSize,
                fabric: fabricName || null,
                ottomanStorage: ottomanStorage,
                footstoolBlanketBox: footstoolBlanketBox,
                headboardHeight: headboardCustom,
                customRequest: customRequest || null,
                assembly: assembly,
                assemblyPrice: assembly === "yes" ? ASSEMBLY_PRICE : 0,
                deliveryDelay: deliveryDelay,
                deliveryDate: deliveryDelay === "yes" ? (deliveryDate || null) : null
              }
            },
            hhState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Basket clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + hhState.quantity + " \u00d7 " + currentProduct.name + " (" + hhState.selectedSize +
          ") to your basket \u2014 " + money(unitPrice * hhState.quantity) + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!validateRequiredOptions()) return;
        messageEl.classList.remove("is-error");
        messageEl.textContent = "Taking you to checkout for " + hhState.quantity + " \u00d7 " + currentProduct.name + "...";
      });
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var isSaved = hhWishlist.has(currentProduct.slug);
        if (isSaved) { hhWishlist.delete(currentProduct.slug); } else { hhWishlist.add(currentProduct.slug); }
        syncWishlistButton(currentProduct);
        var wishlistCountEl = document.getElementById("wishlistCount");
        if (wishlistCountEl) wishlistCountEl.textContent = String(hhWishlist.size);
      });
    }
  }


  /* ---- Review data cleanup: no verified real reviews exist yet, so
     replace any star/count display with an honest "No reviews yet"
     message instead of showing invented numbers. Excludes the detail
     view's own rating element (.hh-detail__rating), which is
     populated separately once a product is opened. ---- */
  function cleanupFakeRatings() {
    document.querySelectorAll(".product-card__rating:not(.hh-detail__rating)").forEach(function (el) {
      el.innerHTML = '<span class="product-card__no-reviews">No reviews yet</span>';
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cleanupFakeRatings();
    initToolbar();
    initViewToggle();
    initColumnsToggle();
    initFaq();
    initDetail();
  });
})();