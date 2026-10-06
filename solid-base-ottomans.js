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

var SO_FABRIC_COLLECTIONS = [
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

var SO_FABRIC_COLLECTIONS_FLAT = [];
SO_FABRIC_COLLECTIONS.forEach(function (collection) {
  collection.fabrics.forEach(function (fabric) {
    SO_FABRIC_COLLECTIONS_FLAT.push(fabric);
  });
});


var SOLID_OTTOMAN_PRODUCTS = 
[
  {
    "id": 1,
    "slug": "solid-ottoman-bed-1",
    "name": "Rabbora Solid Ottoman Bed",
    "price": 249.0,
    "oldPrice": 429.0,
    "monthly": 21,
    "rating": 5,
    "reviews": 15,
    "badge": "42% off",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "A stylish and practical ottoman bed designed to bring comfort, elegance and useful storage into your bedroom.",
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
    "name": "Rabbora Luxury Solid Ottoman Bed",
    "price": 259.0,
    "oldPrice": 420.0,
    "monthly": 22,
    "rating": 5,
    "reviews": 24,
    "badge": "38% off",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "Enjoy a refined bedroom look with a comfortable design and convenient ottoman storage for everyday living.",
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
    "name": "Rabbora Premium Ottoman Bed",
    "price": 289.0,
    "oldPrice": 400.0,
    "monthly": 25,
    "rating": 4,
    "reviews": 33,
    "badge": "28% off",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "Designed for modern bedrooms, this premium ottoman bed combines timeless style, comfort and practical storage.",
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
    "name": "Rabbora Classic Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 42,
    "badge": "31% off",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "A beautifully balanced design that brings a sophisticated feel, relaxing comfort and useful storage to your bedroom.",
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
    "name": "Rabbora Elegant Ottoman Bed",
    "price": 252.0,
    "oldPrice": 420.0,
    "monthly": 21,
    "rating": 5,
    "reviews": 51,
    "badge": "40% off",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "Create a warm and inviting bedroom with an elegant ottoman bed made for comfort, style and everyday practicality.",
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
    "name": "Rabbora Comfort Ottoman Bed",
    "price": 299.0,
    "oldPrice": 444.0,
    "monthly": 25,
    "rating": 4,
    "reviews": 60,
    "badge": "33% off",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "Combining a comfortable sleeping space with practical under-bed storage, this design is made for modern living.",
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
    "name": "Rabbora Signature Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 69,
    "badge": "29% off",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "A sophisticated bedroom centrepiece offering a stylish finish, comfortable support and generous storage.",
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
    "name": "Rabbora Modern Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 78,
    "badge": "29% off",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "Bring contemporary character to your bedroom with a modern ottoman design focused on comfort and functionality.",
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
    "name": "Rabbora Prestige Ottoman Bed",
    "price": 389.0,
    "oldPrice": 499.0,
    "monthly": 33,
    "rating": 4,
    "reviews": 87,
    "badge": "22% off",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "A refined choice for those who appreciate elegant bedroom furniture, comfortable design and practical storage.",
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
    "name": "Rabbora Deluxe Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 96,
    "badge": "31% off",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "Designed to enhance your bedroom, this deluxe ottoman bed offers a beautiful balance of style, comfort and convenience.",
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
    "name": "Rabbora Heritage Ottoman Bed",
    "price": 275.0,
    "oldPrice": 360.0,
    "monthly": 23,
    "rating": 5,
    "reviews": 105,
    "badge": "24% off",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "A timeless bedroom design combining everyday comfort with a practical ottoman storage solution.",
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
    "name": "Rabbora Select Ottoman Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthly": 30,
    "rating": 4,
    "reviews": 114,
    "badge": "17% off",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "A carefully styled ottoman bed created to add comfort, character and useful storage to your bedroom.",
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
    "name": "Rabbora Grande Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 123,
    "badge": "29% off",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "Make a statement with a sophisticated ottoman bed designed for comfortable nights and convenient bedroom storage.",
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
    "name": "Rabbora Haven Ottoman Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthly": 30,
    "rating": 5,
    "reviews": 132,
    "badge": "17% off",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "Create a cosy bedroom retreat with a beautifully designed bed offering comfort and practical hidden storage.",
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
    "name": "Rabbora Urban Ottoman Bed",
    "price": 399.0,
    "oldPrice": 478.8,
    "monthly": 34,
    "rating": 4,
    "reviews": 141,
    "badge": "17% off",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "A modern and versatile ottoman bed designed to complement contemporary bedrooms with comfort and functionality.",
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
    "name": "Rabbora Royal Ottoman Bed",
    "price": 349.0,
    "oldPrice": 549.0,
    "monthly": 30,
    "rating": 5,
    "reviews": 150,
    "badge": "36% off",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "Add a touch of luxury to your bedroom with a refined ottoman design created for comfort and practical storage.",
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
    "name": "Rabbora Elite Ottoman Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthly": 30,
    "rating": 5,
    "reviews": 159,
    "badge": "17% off",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "An elegant bedroom choice combining sophisticated styling, comfortable sleeping and convenient storage.",
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
    "name": "Rabbora Harmony Ottoman Bed",
    "price": 299.0,
    "oldPrice": 414.0,
    "monthly": 25,
    "rating": 4,
    "reviews": 168,
    "badge": "28% off",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "A beautifully balanced design created to bring comfort, calm and practical storage into your bedroom.",
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
    "name": "Rabbora Grace Ottoman Bed",
    "price": 389.0,
    "oldPrice": 499.0,
    "monthly": 33,
    "rating": 5,
    "reviews": 17,
    "badge": "22% off",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "Elegant and inviting, this ottoman bed brings a refined character to your bedroom while providing useful storage.",
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
    "name": "Rabbora Comfort Plus Ottoman Bed",
    "price": 299.0,
    "oldPrice": 360.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 26,
    "badge": "17% off",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "Enjoy a practical combination of comfortable sleeping space, elegant styling and accessible ottoman storage.",
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
    "name": "Rabbora Contemporary Ottoman Bed",
    "price": 319.0,
    "oldPrice": 420.0,
    "monthly": 27,
    "rating": 4,
    "reviews": 35,
    "badge": "24% off",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "A clean and sophisticated ottoman bed designed to suit modern bedrooms while keeping comfort at the heart of its design.",
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
    "name": "Rabbora Living Ottoman Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthly": 30,
    "rating": 5,
    "reviews": 44,
    "badge": "17% off",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "Designed for everyday living, this stylish ottoman bed combines comfort, character and practical storage.",
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
    "name": "Rabbora Luxe Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 53,
    "badge": "29% off",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "A luxurious bedroom addition offering an elegant appearance, comfortable design and useful hidden storage.",
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
    "name": "Rabbora Classic Luxe Ottoman Bed",
    "price": 399.0,
    "oldPrice": 600.0,
    "monthly": 34,
    "rating": 4,
    "reviews": 62,
    "badge": "34% off",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "Timeless styling meets everyday practicality in an ottoman bed designed for comfortable and organised bedrooms.",
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
    "name": "Rabbora Comfort Luxe Ottoman Bed",
    "price": 599.0,
    "oldPrice": 900.0,
    "monthly": 50,
    "rating": 5,
    "reviews": 71,
    "badge": "33% off",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "A sophisticated bed designed to create a comfortable bedroom atmosphere with the added benefit of practical storage.",
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
    "name": "Rabbora Grand Ottoman Bed",
    "price": 349.0,
    "oldPrice": 420.0,
    "monthly": 30,
    "rating": 5,
    "reviews": 80,
    "badge": "17% off",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "Bring elegance and functionality together with a spacious-looking ottoman design created for modern bedrooms.",
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
    "name": "Rabbora Supreme Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 4,
    "reviews": 89,
    "badge": "31% off",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "A premium bedroom centrepiece combining refined styling, relaxing comfort and convenient storage.",
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
    "name": "Rabbora Essence Ottoman Bed",
    "price": 325.0,
    "oldPrice": 360.0,
    "monthly": 28,
    "rating": 5,
    "reviews": 98,
    "badge": "10% off",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "A simple yet elegant approach to bedroom design, combining comfort with the practicality of ottoman storage.",
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
    "name": "Rabbora Modern Luxe Ottoman Bed",
    "price": 299.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 5,
    "reviews": 107,
    "badge": "29% off",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "Give your bedroom a sophisticated finish with a modern ottoman bed designed around comfort and everyday convenience.",
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
    "name": "Rabbora Serenity Ottoman Bed",
    "price": 289.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 4,
    "reviews": 116,
    "badge": "31% off",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "Designed to create a calm and inviting bedroom, this ottoman bed combines comfortable design with useful storage.",
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
    "name": "Rabbora Majestic Ottoman Bed",
    "price": 289.0,
    "oldPrice": null,
    "monthly": 25,
    "rating": 5,
    "reviews": 125,
    "badge": null,
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "A striking yet versatile ottoman bed designed to add elegance, comfort and practicality to your bedroom.",
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
    "name": "Rabbora Comfort Elite Ottoman Bed",
    "price": 389.0,
    "oldPrice": 499.0,
    "monthly": 33,
    "rating": 5,
    "reviews": 134,
    "badge": "22% off",
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "Experience a refined bedroom feel with an elegant bed design offering comfortable sleeping and practical storage.",
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
    "name": "Rabbora Timeless Ottoman Bed",
    "price": 294.0,
    "oldPrice": 420.0,
    "monthly": 25,
    "rating": 4,
    "reviews": 143,
    "badge": "30% off",
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "A timeless choice designed to complement a wide range of bedroom interiors while providing comfort and storage.",
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
    "name": "Rabbora Opulent Ottoman Bed",
    "price": 539.0,
    "oldPrice": 649.0,
    "monthly": 45,
    "rating": 5,
    "reviews": 152,
    "badge": "17% off",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "Add a luxurious feel to your bedroom with an elegant ottoman design made for comfort and practical everyday living.",
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
    "name": "Rabbora Refined Ottoman Bed",
    "price": 549.0,
    "oldPrice": 900.0,
    "monthly": 46,
    "rating": 5,
    "reviews": 161,
    "badge": "39% off",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "A beautifully considered bedroom design combining refined style, comfortable support and useful storage space.",
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
    "name": "Rabbora Signature Luxe Ottoman Bed",
    "price": 549.0,
    "oldPrice": 900.0,
    "monthly": 46,
    "rating": 4,
    "reviews": 170,
    "badge": "39% off",
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "A sophisticated ottoman bed designed to become a stylish focal point while keeping comfort and practicality in balance.",
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
    "name": "Rabbora Elegant Luxe Ottoman Bed",
    "price": 701,
    "oldPrice": null,
    "monthly": null,
    "rating": 5,
    "reviews": 19,
    "badge": null,
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "Bring a polished look to your bedroom with a comfortable ottoman bed designed for modern everyday living.",
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
    "name": "Rabbora Prestige Luxe Ottoman Bed",
    "price": 718,
    "oldPrice": null,
    "monthly": null,
    "rating": 5,
    "reviews": 28,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "A refined bedroom centrepiece offering an elegant appearance, comfortable sleeping space and practical storage.",
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
    "name": "Rabbora Modern Comfort Ottoman Bed",
    "price": 735,
    "oldPrice": null,
    "monthly": null,
    "rating": 4,
    "reviews": 37,
    "badge": null,
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "Designed with modern bedrooms in mind, this ottoman bed combines stylish simplicity with everyday comfort and storage.",
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
       "solid/115.jfif",
      "solid/116.jfif",
      "solid/117.jfif"
    ]
  },
  {
    "id": 40,
    "slug": "solid-ottoman-bed-40",
    "name": "Rabbora Luxury Comfort Ottoman Bed",
    "price": 752,
    "oldPrice": null,
    "monthly": null,
    "rating": 5,
    "reviews": 46,
    "badge": null,
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "Enjoy an elegant bedroom atmosphere with a luxurious ottoman bed designed around comfort, style and convenience.",
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
       "solid/118.jfif",
      "solid/119.jfif",
      "solid/120.jfif"
    ]
  },
  {
    "id": 41,
    "slug": "solid-ottoman-bed-41",
    "name": "Rabbora Grand Luxe Ottoman Bed",
    "price": 429,
    "oldPrice": null,
    "monthly": null,
    "rating": 5,
    "reviews": 55,
    "badge": null,
    "size": "Single 3ft",
    "sizeKey": "Single",
    "shortInfo": "Reinforced solid base storage, Single 3ft size.",
    "description": "A sophisticated design that brings together premium bedroom styling, comfortable sleeping and practical storage.",
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
       "solid/121.jfif",
      "solid/122.jfif",
      "solid/123.jfif"
    ]
  },
  {
    "id": 42,
    "slug": "solid-ottoman-bed-42",
    "name": "Rabbora Classic Comfort Ottoman Bed",
    "price": 446,
    "oldPrice": null,
    "monthly": null,
    "rating": 4,
    "reviews": 64,
    "badge": null,
    "size": "Small Double 4ft",
    "sizeKey": "Small Double",
    "shortInfo": "Reinforced solid base storage, Small Double 4ft size.",
    "description": "A versatile ottoman bed offering timeless appeal, comfortable design and convenient storage for a well-organised bedroom.",
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
       "solid/124.jfif",
      "solid/125.jfif",
      "solid/126.jfif"
    ]
  },
  {
    "id": 43,
    "slug": "solid-ottoman-bed-43",
    "name": "Rabbora Pure Ottoman Bed",
    "price": 463,
    "oldPrice": null,
    "monthly": null,
    "rating": 5,
    "reviews": 73,
    "badge": null,
    "size": "Double 4'6ft",
    "sizeKey": "Double",
    "shortInfo": "Reinforced solid base storage, Double 4'6ft size.",
    "description": "A clean and elegant bedroom design focused on comfort, simplicity and the practicality of hidden storage.",
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
       "solid/127.jfif",
      "solid/128.jfif",
      "solid/129.jfif"
    ]
  },
  {
    "id": 44,
    "slug": "solid-ottoman-bed-44",
    "name": "Rabbora Majestic Luxe Ottoman Bed",
    "price": 549.0,
    "oldPrice": 900.0,
    "monthly": 46,
    "rating": 5,
    "reviews": 82,
    "badge": "39% off",
    "size": "King 5ft",
    "sizeKey": "King",
    "shortInfo": "Reinforced solid base storage, King 5ft size.",
    "description": "Create an impressive bedroom setting with a refined ottoman bed designed to balance luxury, comfort and functionality.",
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
       "solid/130.jfif",
      "solid/131.jfif",
      "solid/132.jfif"
    ]
  },
  {
    "id": 45,
    "slug": "solid-ottoman-bed-45",
    "name": "Rabbora Ultimate Ottoman Bed",
    "price": 549.0,
    "oldPrice": 900.0,
    "monthly": 46,
    "rating": 4,
    "reviews": 91,
    "badge": "39% off",
    "size": "Super King 6ft",
    "sizeKey": "Super King",
    "shortInfo": "Reinforced solid base storage, Super King 6ft size.",
    "description": "A sophisticated finishing touch for the bedroom, combining comfortable design, elegant styling and practical ottoman storage.",
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
       "solid/133.jfif",
      "solid/134.jfif",
      "solid/135.jfif"
    ]
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

  // Price of each size, per bed (site owner's price list, 26 Sep 2026;
  // record #N uses row #N of that list). Sizes missing from a bed's list
  // are not offered for that bed.
  var SO_SIZE_PRICES = {
    "solid-ottoman-bed-1": { "Single": 249, "Small Double": 388, "Double": 429, "King": 459, "Super King": 499 } /* #1 2026 Manhattan Bed Frame with Lines ® */,
    "solid-ottoman-bed-2": { "Single": 259, "Small Double": 359, "Double": 399, "King": 439, "Super King": 469 } /* #2 2026 Milan Wingback Bed® with Optional Ottoman Storage */,
    "solid-ottoman-bed-3": { "Single": 289, "Small Double": 367.50, "Double": 399, "King": 439, "Super King": 469 } /* #3 2026 Athens Linear Designer Bed® */,
    "solid-ottoman-bed-4": { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 } /* #4 2026 Empire Bed Frame with Optional Ottoman Storage */,
    "solid-ottoman-bed-5": { "Single": 252, "Small Double": 383.99, "Double": 449, "King": 489, "Super King": 529 } /* #5 The 2026 Art Deco Bed Style */,
    "solid-ottoman-bed-6": { "Single": 299, "Small Double": 409, "Double": 439, "King": 459, "Super King": 509 } /* #6 2026 Kendal Butterfly Wingback Bed */,
    "solid-ottoman-bed-7": { "Single": 299, "Small Double": 369, "Double": 399, "King": 419, "Super King": 479 } /* #7 2026 Brooklyn Bed Frame with Lines */,
    "solid-ottoman-bed-8": { "Single": 299, "Small Double": 409, "Double": 429, "King": 459, "Super King": 499 } /* #8 2026 Nevada Bed Frame with Lines */,
    "solid-ottoman-bed-9": { "Single": 389, "Small Double": 439, "Double": 449, "King": 499, "Super King": 549 } /* #9 2026 Ibiza Linear Upholstered Bed with Black Lining */,
    "solid-ottoman-bed-10": { "Single": 289, "Small Double": 409, "Double": 425, "King": 459, "Super King": 485 } /* #10 2026 Tokyo Sunrise Designer Bed® – With Optional Ottoman Storage */,
    "solid-ottoman-bed-11": { "Single": 275, "Small Double": 339, "Double": 349, "King": 399, "Super King": 419 } /* #11 2026 Málaga Upholstery Designer Bed */,
    "solid-ottoman-bed-12": { "Single": 349, "Small Double": 399, "Double": 449, "King": 489, "Super King": 549 } /* #12 2026 Lisbon Bed Frame with Optional Ottoman Storage */,
    "solid-ottoman-bed-13": { "Single": 299, "Small Double": 399, "Double": 419, "King": 449, "Super King": 499 } /* #13 2026 Mona Lisa bed with optional ottoman storage */,
    "solid-ottoman-bed-14": { "Single": 349, "Small Double": 409, "Double": 439, "King": 479, "Super King": 529 } /* #14 2026 Barcelona Bed Frame with Lines */,
    "solid-ottoman-bed-15": { "Single": 399, "Small Double": 479, "Double": 499, "King": 579, "Super King": 609 } /* #15 2026 Florence Design Bed Frame */,
    "solid-ottoman-bed-16": { "Single": 349, "Small Double": 489, "Double": 499, "King": 549, "Super King": 589 } /* #16 2026 Golden Crown Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-17": { "Single": 349, "Small Double": 409, "Double": 439, "King": 479, "Super King": 529 } /* #17 2026 Avon Triple Panel Bed */,
    "solid-ottoman-bed-18": { "Single": 299, "Small Double": 349, "Double": 389, "King": 419, "Super King": 499 } /* #18 Duchess of La Rosa Bed (2026 Collection) */,
    "solid-ottoman-bed-19": { "Single": 389, "Small Double": 439, "Double": 449, "King": 499, "Super King": 549 } /* #19 2026 Osaka Linear Upholstered Bed with Black Lining */,
    "solid-ottoman-bed-20": { "Single": 299, "Small Double": 399, "Double": 409, "King": 449, "Super King": 469 } /* #20 2026 Victoria V Lined Designer Bed */,
    "solid-ottoman-bed-21": { "Single": 319, "Small Double": 379, "Double": 409, "King": 449, "Super King": 499 } /* #21 2026 Thames Triple Wingback Bed */,
    "solid-ottoman-bed-22": { "Single": 349, "Small Double": 409, "Double": 439, "King": 479, "Super King": 529 } /* #22 2026 Paris Linear Bed Frame */,
    "solid-ottoman-bed-23": { "Single": 290, "Small Double": 399, "Double": 399, "King": 449, "Super King": 499 } /* #23 2026 Torino Bumper Style Designer Bed */,
    "solid-ottoman-bed-24": { "Single": 299, "Small Double": 439, "Double": 465, "King": 499, "Super King": 529 } /* #24 2026 New Skyscraper Art Deco Bed */,
    "solid-ottoman-bed-25": { "Single": 399, "Small Double": 469, "Double": 489, "King": 549, "Super King": 599 } /* #25 2026 Cannes Bed with optional ottoman storage */,
    "solid-ottoman-bed-26": { "Single": 389, "Small Double": 499, "Double": 529, "King": 549, "Super King": 599 } /* #26 2026 Toronto Lux Bed Frame */,
    "solid-ottoman-bed-27": { "Single": 275, "Small Double": 375, "Double": 399, "King": 449, "Super King": 499 } /* #27 2026 New Monaco Upholstered Bed */,
    "solid-ottoman-bed-28": { "Small Double": 599, "Double": 649, "King": 749, "Super King": 849 } /* #28 2026 Golden Pyramid Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-29": { "Single": 329, "Small Double": 479, "Double": 499, "King": 539, "Super King": 599 } /* #29 2026 Lincoln Art Deco with Optional Ottoman Storage */,
    "solid-ottoman-bed-30": { "Single": 349, "Small Double": 449, "Double": 479, "King": 489, "Super King": 539 } /* #30 2026 GOLDEN SKYLINE BED */,
    "solid-ottoman-bed-31": { "Single": 349, "Small Double": 449, "Double": 489, "King": 529, "Super King": 549 } /* #31 2026 Chicago High Headboard Bed Frame (2-Piece Headboard) */,
    "solid-ottoman-bed-32": { "Single": 399, "Small Double": 449, "Double": 459, "King": 474, "Super King": 529 } /* #32 2026 Teddy-Empire Bed Optional Ottoman Storage */,
    "solid-ottoman-bed-33": { "Single": 349, "Small Double": 389, "Double": 399, "King": 439, "Super King": 489 } /* #33 2026 Madison Square Linear Frame */,
    "solid-ottoman-bed-34": { "Single": 399, "Small Double": 549, "Double": 549, "King": 749, "Super King": 649 } /* #34 2026 Tulip Wingback Art Deco Bed */,
    "solid-ottoman-bed-35": { "Small Double": 599, "Double": 649, "King": 699, "Super King": 749 } /* #35 2026 Starlight Luxury Mirrored Bed Frame */,
    "solid-ottoman-bed-36": { "Single": 349, "Small Double": 409, "Double": 449, "King": 489, "Super King": 539 } /* #36 2026 Empire Black Edition Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-37": { "Single": 289, "Small Double": 389, "Double": 419, "King": 439, "Super King": 489 } /* #37 2026 Dubai Palm Bed Frame with Optional Ottoman Storage */,
    "solid-ottoman-bed-38": { "Single": 325, "Small Double": 399, "Double": 429, "King": 459, "Super King": 529 } /* #38 The 2026 Matrix Cube Bed */,
    "solid-ottoman-bed-39": { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 } /* #39 2026 PSCL Arizona Bed Frame with optional ottoman storage */,
    "solid-ottoman-bed-40": { "Single": 299, "Small Double": 399, "Double": 409, "King": 449, "Super King": 499 } /* #40 2026 Zurich Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-41": { "Single": 389, "Small Double": 439, "Double": 449, "King": 499, "Super King": 549 } /* #41 2026 Golden Ibiza Linear Bed with Gold Fabric Lining */,
    "solid-ottoman-bed-42": { "Single": 294, "Small Double": 409, "Double": 439, "King": 479, "Super King": 529 } /* #42 2026 Yukon Bed Frame with Wings */,
    "solid-ottoman-bed-43": { "Single": 539, "Small Double": 649, "Double": 699, "King": 799, "Super King": 899 } /* #43 Black Plush Golden Pyramid Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-44": { "Small Double": 549, "Double": 599, "King": 659, "Super King": 699 } /* #44 2026 Riviera High Headboard Bed Frame (2-Piece Headboard) */,
    "solid-ottoman-bed-45": { "Small Double": 549, "Double": 599, "King": 659, "Super King": 699 } /* #45 2026 Silver Fern Bed with High Headboard (2-Piece Headboard) */
  };
  // Old (original / "was") price for each size, same layout as SO_SIZE_PRICES
  // above. Single 3ft is not listed: it keeps its existing old price. The
  // other sizes are worked out from their existing sale price:
  //   Small Double 21% off -> old = sale / 0.79
  //   Double       28% off -> old = sale / 0.72
  //   King         29% off -> old = sale / 0.71
  //   Super King   29% off -> old = sale / 0.71
  // Any number here can be changed in VS Code; a size left out shows the
  // page's old price exactly as before.
  var SO_SIZE_OLD_PRICES = {
    "solid-ottoman-bed-1": { "Small Double": 491.14, "Double": 595.83, "King": 646.48, "Super King": 702.82 } /* #1 2026 Manhattan Bed Frame with Lines ® */,
    "solid-ottoman-bed-2": { "Small Double": 454.43, "Double": 554.17, "King": 618.31, "Super King": 660.56 } /* #2 2026 Milan Wingback Bed® with Optional Ottoman Storage */,
    "solid-ottoman-bed-3": { "Small Double": 465.19, "Double": 554.17, "King": 618.31, "Super King": 660.56 } /* #3 2026 Athens Linear Designer Bed® */,
    "solid-ottoman-bed-4": { "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 } /* #4 2026 Empire Bed Frame with Optional Ottoman Storage */,
    "solid-ottoman-bed-5": { "Small Double": 486.06, "Double": 623.61, "King": 688.73, "Super King": 745.07 } /* #5 The 2026 Art Deco Bed Style */,
    "solid-ottoman-bed-6": { "Small Double": 517.72, "Double": 609.72, "King": 646.48, "Super King": 716.9 } /* #6 2026 Kendal Butterfly Wingback Bed */,
    "solid-ottoman-bed-7": { "Small Double": 467.09, "Double": 554.17, "King": 590.14, "Super King": 674.65 } /* #7 2026 Brooklyn Bed Frame with Lines */,
    "solid-ottoman-bed-8": { "Small Double": 517.72, "Double": 595.83, "King": 646.48, "Super King": 702.82 } /* #8 2026 Nevada Bed Frame with Lines */,
    "solid-ottoman-bed-9": { "Small Double": 555.7, "Double": 623.61, "King": 702.82, "Super King": 773.24 } /* #9 2026 Ibiza Linear Upholstered Bed with Black Lining */,
    "solid-ottoman-bed-10": { "Small Double": 517.72, "Double": 590.28, "King": 646.48, "Super King": 683.1 } /* #10 2026 Tokyo Sunrise Designer Bed® – With Optional Ottoman Storage */,
    "solid-ottoman-bed-11": { "Small Double": 429.11, "Double": 484.72, "King": 561.97, "Super King": 590.14 } /* #11 2026 Málaga Upholstery Designer Bed */,
    "solid-ottoman-bed-12": { "Small Double": 505.06, "Double": 623.61, "King": 688.73, "Super King": 773.24 } /* #12 2026 Lisbon Bed Frame with Optional Ottoman Storage */,
    "solid-ottoman-bed-13": { "Small Double": 505.06, "Double": 581.94, "King": 632.39, "Super King": 702.82 } /* #13 2026 Mona Lisa bed with optional ottoman storage */,
    "solid-ottoman-bed-14": { "Small Double": 517.72, "Double": 609.72, "King": 674.65, "Super King": 745.07 } /* #14 2026 Barcelona Bed Frame with Lines */,
    "solid-ottoman-bed-15": { "Small Double": 606.33, "Double": 693.06, "King": 815.49, "Super King": 857.75 } /* #15 2026 Florence Design Bed Frame */,
    "solid-ottoman-bed-16": { "Small Double": 618.99, "Double": 693.06, "King": 773.24, "Super King": 829.58 } /* #16 2026 Golden Crown Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-17": { "Small Double": 517.72, "Double": 609.72, "King": 674.65, "Super King": 745.07 } /* #17 2026 Avon Triple Panel Bed */,
    "solid-ottoman-bed-18": { "Small Double": 441.77, "Double": 540.28, "King": 590.14, "Super King": 702.82 } /* #18 Duchess of La Rosa Bed (2026 Collection) */,
    "solid-ottoman-bed-19": { "Small Double": 555.7, "Double": 623.61, "King": 702.82, "Super King": 773.24 } /* #19 2026 Osaka Linear Upholstered Bed with Black Lining */,
    "solid-ottoman-bed-20": { "Small Double": 505.06, "Double": 568.06, "King": 632.39, "Super King": 660.56 } /* #20 2026 Victoria V Lined Designer Bed */,
    "solid-ottoman-bed-21": { "Small Double": 479.75, "Double": 568.06, "King": 632.39, "Super King": 702.82 } /* #21 2026 Thames Triple Wingback Bed */,
    "solid-ottoman-bed-22": { "Small Double": 517.72, "Double": 609.72, "King": 674.65, "Super King": 745.07 } /* #22 2026 Paris Linear Bed Frame */,
    "solid-ottoman-bed-23": { "Small Double": 505.06, "Double": 554.17, "King": 632.39, "Super King": 702.82 } /* #23 2026 Torino Bumper Style Designer Bed */,
    "solid-ottoman-bed-24": { "Small Double": 555.7, "Double": 645.83, "King": 702.82, "Super King": 745.07 } /* #24 2026 New Skyscraper Art Deco Bed */,
    "solid-ottoman-bed-25": { "Small Double": 593.67, "Double": 679.17, "King": 773.24, "Super King": 843.66 } /* #25 2026 Cannes Bed with optional ottoman storage */,
    "solid-ottoman-bed-26": { "Small Double": 631.65, "Double": 734.72, "King": 773.24, "Super King": 843.66 } /* #26 2026 Toronto Lux Bed Frame */,
    "solid-ottoman-bed-27": { "Small Double": 474.68, "Double": 554.17, "King": 632.39, "Super King": 702.82 } /* #27 2026 New Monaco Upholstered Bed */,
    "solid-ottoman-bed-28": { "Small Double": 758.23, "Double": 901.39, "King": 1054.93, "Super King": 1195.77 } /* #28 2026 Golden Pyramid Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-29": { "Small Double": 606.33, "Double": 693.06, "King": 759.15, "Super King": 843.66 } /* #29 2026 Lincoln Art Deco with Optional Ottoman Storage */,
    "solid-ottoman-bed-30": { "Small Double": 568.35, "Double": 665.28, "King": 688.73, "Super King": 759.15 } /* #30 2026 GOLDEN SKYLINE BED */,
    "solid-ottoman-bed-31": { "Small Double": 568.35, "Double": 679.17, "King": 745.07, "Super King": 773.24 } /* #31 2026 Chicago High Headboard Bed Frame (2-Piece Headboard) */,
    "solid-ottoman-bed-32": { "Small Double": 568.35, "Double": 637.5, "King": 667.61, "Super King": 745.07 } /* #32 2026 Teddy-Empire Bed Optional Ottoman Storage */,
    "solid-ottoman-bed-33": { "Small Double": 492.41, "Double": 554.17, "King": 618.31, "Super King": 688.73 } /* #33 2026 Madison Square Linear Frame */,
    "solid-ottoman-bed-34": { "Small Double": 694.94, "Double": 762.5, "King": 1054.93, "Super King": 914.08 } /* #34 2026 Tulip Wingback Art Deco Bed */,
    "solid-ottoman-bed-35": { "Small Double": 758.23, "Double": 901.39, "King": 984.51, "Super King": 1054.93 } /* #35 2026 Starlight Luxury Mirrored Bed Frame */,
    "solid-ottoman-bed-36": { "Small Double": 517.72, "Double": 623.61, "King": 688.73, "Super King": 759.15 } /* #36 2026 Empire Black Edition Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-37": { "Small Double": 492.41, "Double": 581.94, "King": 618.31, "Super King": 688.73 } /* #37 2026 Dubai Palm Bed Frame with Optional Ottoman Storage */,
    "solid-ottoman-bed-38": { "Small Double": 505.06, "Double": 595.83, "King": 646.48, "Super King": 745.07 } /* #38 The 2026 Matrix Cube Bed */,
    "solid-ottoman-bed-39": { "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 } /* #39 2026 PSCL Arizona Bed Frame with optional ottoman storage */,
    "solid-ottoman-bed-40": { "Small Double": 505.06, "Double": 568.06, "King": 632.39, "Super King": 702.82 } /* #40 2026 Zurich Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-41": { "Small Double": 555.7, "Double": 623.61, "King": 702.82, "Super King": 773.24 } /* #41 2026 Golden Ibiza Linear Bed with Gold Fabric Lining */,
    "solid-ottoman-bed-42": { "Small Double": 517.72, "Double": 609.72, "King": 674.65, "Super King": 745.07 } /* #42 2026 Yukon Bed Frame with Wings */,
    "solid-ottoman-bed-43": { "Small Double": 821.52, "Double": 970.83, "King": 1125.35, "Super King": 1266.2 } /* #43 Black Plush Golden Pyramid Bed with Optional Ottoman Storage */,
    "solid-ottoman-bed-44": { "Small Double": 694.94, "Double": 831.94, "King": 928.17, "Super King": 984.51 } /* #44 2026 Riviera High Headboard Bed Frame (2-Piece Headboard) */,
    "solid-ottoman-bed-45": { "Small Double": 694.94, "Double": 831.94, "King": 928.17, "Super King": 984.51 } /* #45 2026 Silver Fern Bed with High Headboard (2-Piece Headboard) */
  };


  function soSizePrices(product) {
    // A product loaded from the backend API carries its own size prices.
    if (product && product.sizePrices) return product.sizePrices;
    return (product && SO_SIZE_PRICES[product.slug]) || null;
  }

  // Lowest size price = the bed's "from" price.
  function soFromPrice(product) {
    var prices = soSizePrices(product);
    if (!prices) return product.price;
    var min = null;
    Object.keys(prices).forEach(function (k) {
      if (min === null || prices[k] < min) min = prices[k];
    });
    return min;
  }

  function soSizePrice(product, size) {
    var prices = soSizePrices(product);
    if (prices && size && typeof prices[size] === "number") return prices[size];
    return soFromPrice(product);
  }

  // The stored oldPrice was the original price that went with the
  // stored price, so it is only shown on a size whose price is that
  // same stored price (and only when it is higher).
  function soValidOldPrice(product, sizePrice) {
    if (!product.oldPrice || product.oldPrice <= sizePrice) return null;
    return Math.abs(sizePrice - product.price) < 0.001 ? product.oldPrice : null;
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
    var pageButtons = qsa(".mt-pagination__page");

    var PAGE_SIZE = 12;
    var cards = qsa(".so-product-card", grid);

    function priceInRange(price, range) {
      if (range === "all") return true;
      if (range === "under-300") return price < 300;
      if (range === "300-450") return price >= 300 && price <= 450;
      if (range === "450-600") return price >= 450 && price <= 600;
      if (range === "over-600") return price > 600;
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
      var paginationTop = document.getElementById("soPaginationTop");
      if (paginationTop) paginationTop.hidden = totalPages <= 1;
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
    var sizeOptionsEl = document.getElementById("soSizeOptions");
    var fabricOptionsEl = document.getElementById("soModalFabrics");
    var diamantesToggle = document.getElementById("soDiamantesToggle");
    var buttonsToggle = document.getElementById("soButtonsToggle");
    var ottomanStorageEl = document.getElementById("soOttomanStorageOptions");
    var ottomanStorageMsg = document.getElementById("soOttomanStorageMessage");
    var footstoolEl = document.getElementById("soFootstoolOptions");
    var footstoolMsg = document.getElementById("soFootstoolMessage");
    var headboardEl = document.getElementById("soHeadboardOptions");
    var headboardMsg = document.getElementById("soHeadboardMessage");
    var customRequestEl = document.getElementById("soCustomRequest");
    var assemblyEl = document.getElementById("soAssemblyOptions");
    var assemblyMsg = document.getElementById("soAssemblyMessage");
    var deliveryDelayEl = document.getElementById("soDeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("soDeliveryDelayMessage");
    var delayDateWrap = document.getElementById("soDelayDateWrap");
    var delayDateInput = document.getElementById("soDelayDate");
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
    var selectedFabricIndex = -1;
    var selectedSizeKey = null;
    var diamantes = false;
    var buttons = false;
    var ottomanStorage = null;
    var footstoolBlanketBox = null;
    var headboardHeight = null;
    var customRequest = "";
    var assembly = null;
    var deliveryDelay = null;
    var deliveryDate = "";

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

    function renderRelated(product) {
      relatedGrid.innerHTML = "";
      var others = SOLID_OTTOMAN_PRODUCTS.filter(function (p) { return p.slug !== product.slug; });
      var sameSize = others.filter(function (p) { return p.sizeKey === product.sizeKey; });
      var rest = others.filter(function (p) { return p.sizeKey !== product.sizeKey; });
      var related = sameSize.concat(rest).slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var relFrom = soFromPrice(p);
        var relOld = soValidOldPrice(p, relFrom);
        var prevHtml = relOld ? '<span class="product-card__price-prev">' + soMoney(relOld) + '</span>' : "";
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
              '<span class="product-card__price">' + soMoney(relFrom) + '</span>' + prevHtml +
            '</div>' +
          '</div>';
        relatedGrid.appendChild(card);
      });
    }

    // Size — each Solid Base Ottoman product is a fixed-size SKU (no
    // array of choices exists for a single product, unlike Ottoman
    // Beds), so this renders the one genuine size as a single
    // pre-selected pill purely for visual/UX consistency with Ottoman's
    // Size section — nothing invented, nothing else selectable.
    // The five standard Rabbora bed sizes, same labels/keys already used
    // on Ottoman Beds and Mattresses. Each Solid Base Ottoman product's
    // OWN real size/price stays exactly as it is — since no individual
    // product has genuine price data for the other four sizes, choosing
    // a different size here does not change the price (no invented
    // price differences); it simply records which size the customer
    // wants, exactly as requested.
    var SO_SIZE_LABELS = ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"];
    var SO_SIZE_KEYS = ["Single", "Small Double", "Double", "King", "Super King"];


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
        sizePriceRow.className = "bb-modal__price-row";
        sizePriceRow.setAttribute("data-size-price", "");
        sizePriceRow.setAttribute("aria-live", "polite");
        sizePriceRow.style.marginTop = "0.75rem";
        sizePriceRow.innerHTML =
          '<span class="bb-modal__price"></span>' +
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
      sizePriceRow.children[0].textContent = soMoney(sizePrice);
      sizePriceRow.children[1].textContent =
        (oldPrice && oldPrice > sizePrice) ? soMoney(oldPrice) : "";
    }

    function renderSizeOptions(product) {
      if (!sizeOptionsEl) return;
      sizeOptionsEl.innerHTML = "";
      var offered = soSizePrices(product);
      SO_SIZE_LABELS.forEach(function (label, index) {
        var key = SO_SIZE_KEYS[index];
        if (offered && typeof offered[key] !== "number") return;
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "mt-option-pill";
        btn.setAttribute("aria-pressed", String(selectedSizeKey === key));
        btn.textContent = label;
        btn.addEventListener("click", function () {
          selectedSizeKey = key;
          qsa(".mt-option-pill", sizeOptionsEl).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          renderPurchasePanel(product);
        });
        sizeOptionsEl.appendChild(btn);
      });
    }

    // Fabric Colour — same real, current Fabric Samples collection data
    // and the same grouped/collection-heading swatch pattern already
    // used on Blanket Boxes, Sofas and Bed Frames, with Ottoman's own
    // "Same as main display picture" default-option pattern preserved.
    function selectedFabricName() {
      if (selectedFabricIndex === -1) return "Same as main display picture";
      var fabric = SO_FABRIC_COLLECTIONS_FLAT[selectedFabricIndex];
      return fabric ? fabric.name : "Same as main display picture";
    }

    function renderFabricOptions(product) {
      if (!fabricOptionsEl) return;
      fabricOptionsEl.innerHTML = "";

      var defaultBtn = document.createElement("button");
      defaultBtn.type = "button";
      defaultBtn.className = "fabric-swatch";
      defaultBtn.setAttribute("aria-pressed", String(selectedFabricIndex === -1));
      defaultBtn.setAttribute("aria-label", "Same as main display picture");
      defaultBtn.innerHTML =
        '<span class="fabric-swatch__ring">' +
          '<img src="' + (product.images && product.images[0] ? product.images[0] : "") + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" onerror="this.style.display=&#39;none&#39;; this.parentElement.classList.add(&#39;fabric-swatch__ring--fallback&#39;);" />' +
          '<span class="fabric-swatch__check" aria-hidden="true">' +
            '<svg width="12" height="12" viewBox="0 0 16 16"><path d="M3 8.5l3.2 3.2L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '</span>' +
        '</span>' +
        '<span class="fabric-swatch__name">Default</span>';
      defaultBtn.addEventListener("click", function () {
        selectFabric(-1);
      });
      var defaultGridEl = document.createElement("div");
      defaultGridEl.className = "bb-modal__fabric-grid";
      defaultGridEl.appendChild(defaultBtn);
      fabricOptionsEl.appendChild(defaultGridEl);

      SO_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl2 = document.createElement("p");
        titleEl2.className = "bb-modal__fabric-collection-title";
        titleEl2.textContent = collection.name;
        groupEl.appendChild(titleEl2);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric) {
          var flatIndex = SO_FABRIC_COLLECTIONS_FLAT.indexOf(fabric);
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
            selectFabric(selectedFabricIndex === flatIndex ? -1 : flatIndex);
          });
          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricOptionsEl.appendChild(groupEl);
      });
    }

    function selectFabric(index) {
      selectedFabricIndex = index;
      messageEl.textContent = "";
      messageEl.classList.remove("is-error");
      qsa(".fabric-swatch", fabricOptionsEl).forEach(function (el, i) {
        el.setAttribute("aria-pressed", String((i - 1) === index));
      });
    }

    // Detailing add-ons — Diamantes and Matching Fabric Buttons, the
    // same genuinely-applicable upholstery options Ottoman Beds offers
    // on its own fabric-covered frame. Ottoman's "Ottoman Storage
    // Upgrade" toggle was NOT brought over here, since Solid Base
    // Ottoman is already a storage bed by definition — offering to
    // "add" storage to an already-storage product doesn't apply.
    // Ottoman charges \u00a315 for Buttons via a real detailingButtonsPrice
    // field on its own product data; Solid Base Ottoman has no such
    // field, so per "never invent a price," Buttons stays free here too
    // rather than fabricating a charge.
    function initAddonControls() {
      if (diamantesToggle) {
        diamantesToggle.addEventListener("click", function () {
          diamantes = !diamantes;
          diamantesToggle.setAttribute("aria-pressed", String(diamantes));
        });
      }
      if (buttonsToggle) {
        buttonsToggle.addEventListener("click", function () {
          buttons = !buttons;
          buttonsToggle.setAttribute("aria-pressed", String(buttons));
        });
      }
    }
    initAddonControls();

    // Shared helper for the six new single-select option groups below —
    // each is a plain group of .mt-option-pill buttons where exactly one
    // choice can be active at a time. Avoids repeating the same
    // click/aria-pressed wiring six times.
    function initRadioPillGroup(container, messageEl, onSelect) {
      if (!container) return;
      qsa(".mt-option-pill", container).forEach(function (btn) {
        btn.addEventListener("click", function () {
          qsa(".mt-option-pill", container).forEach(function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          if (messageEl) messageEl.textContent = "";
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

    initRadioPillGroup(headboardEl, headboardMsg, function (value) {
      headboardHeight = value;
    });

    initRadioPillGroup(assemblyEl, assemblyMsg, function (value) {
      assembly = value;
      if (currentProduct) renderPurchasePanel(currentProduct);
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

    // Assembly is the only new option with a confirmed real price
    // (£59.00, given directly for this task) — every other new option
    // stays £0 since no genuine price data exists for them.
    var ASSEMBLY_PRICE = 59;

    function currentPrice(product) {
      return soSizePrice(product, selectedSizeKey) + (assembly === "yes" ? ASSEMBLY_PRICE : 0);
    }

    function renderPurchasePanel(product) {
      priceEl.textContent = soMoney(currentPrice(product));
      var sizePrice = soSizePrice(product, selectedSizeKey);
      var validOldPrice;
      if (product.sizeOldPrices) {
        // Product from the backend API: each size has its own compare-at price.
        var apiOldPrice = selectedSizeKey ? product.sizeOldPrices[selectedSizeKey] : product.oldPrice;
        validOldPrice = (apiOldPrice && apiOldPrice > sizePrice) ? apiOldPrice : null;
      } else {
        validOldPrice = soValidOldPrice(product, sizePrice);
      }
      // Small Double / Double / King / Super King: old price from
      // SO_SIZE_OLD_PRICES (Single keeps its existing old price).
      var listedOld = (selectedSizeKey && selectedSizeKey !== "Single" && SO_SIZE_OLD_PRICES[product.slug])
        ? SO_SIZE_OLD_PRICES[product.slug][selectedSizeKey] : null;
      if (typeof listedOld === "number") validOldPrice = listedOld > sizePrice ? listedOld : null;
      prevPriceEl.textContent = validOldPrice ? soMoney(validOldPrice) : "";
      renderSelectedSizePrice(selectedSizeKey, sizePrice, validOldPrice);
      // Price area: size label, old price, "% off" and monthly amount.
      rbUpdatePriceArea({
        priceEl: priceEl, prevEl: prevPriceEl, monthlyEl: monthlyEl,
        finalPrice: currentPrice(product), sizePrice: sizePrice, oldPrice: validOldPrice,
        sizeKey: selectedSizeKey, sizeOptions: sizeOptionsEl, sizeRow: sizePriceRow,
        money: soMoney
      });
      // Size text above the title shows the size being priced.
      sizeEl.textContent = (selectedSizeKey && selectedSizeKey !== product.sizeKey &&
        rbSelectedSizeLabel(sizeOptionsEl)) || product.size;
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

      selectedFabricIndex = -1;
      selectedSizeKey = product.sizeKey || null;
      var offeredSizes = soSizePrices(product);
      if (offeredSizes && selectedSizeKey && typeof offeredSizes[selectedSizeKey] !== "number") selectedSizeKey = null;
      diamantes = false;
      buttons = false;
      if (diamantesToggle) diamantesToggle.setAttribute("aria-pressed", "false");
      if (buttonsToggle) buttonsToggle.setAttribute("aria-pressed", "false");

      ottomanStorage = null;
      footstoolBlanketBox = null;
      headboardHeight = null;
      customRequest = "";
      assembly = null;
      deliveryDelay = null;
      deliveryDate = "";
      [ottomanStorageEl, footstoolEl, headboardEl, assemblyEl, deliveryDelayEl].forEach(function (group) {
        if (!group) return;
        qsa(".mt-option-pill", group).forEach(function (el) {
          el.setAttribute("aria-pressed", "false");
        });
      });
      [ottomanStorageMsg, footstoolMsg, headboardMsg, assemblyMsg, deliveryDelayMsg].forEach(function (msg) {
        if (msg) msg.textContent = "";
      });
      if (customRequestEl) customRequestEl.value = "";
      if (delayDateInput) delayDateInput.value = "";
      if (delayDateWrap) delayDateWrap.hidden = true;

      renderPurchasePanel(product);

      currentProduct = product;
      detailImageIndex = 0;
      renderGallery(product);
      renderSizeOptions(product);
      renderFabricOptions(product);
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
        "[Rabbora Solid Base Ottomans] api-config.js is not loaded, so product details come from this file only. " +
        "Add <script src=\"api-config.js\"></script> before solid-base-ottomans.js."
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
      merged.images = d.images;
      // soSizePrices() reads this map, so the offered sizes, the size
      // prices and the "from" price all follow the API.
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
      var hash = window.location.hash;
      if (!hash || hash === "#") { rbApiRouteId++; showCategory(); return; }
      var slug = hash.replace(/^#\/?/, "");
      if (!slug) { rbApiRouteId++; showCategory(); return; }
      var product = SO_PRODUCTS_BY_SLUG[slug];
      if (!product) { rbApiRouteId++; showNotFound(); return; }
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

        // Each required new option shows its own inline message right
        // next to that option (not just one generic message at the
        // bottom), and focuses/scrolls to whichever one is missing —
        // checked in the same top-to-bottom order they appear on the
        // page.
        if (!ottomanStorage) {
          ottomanStorageMsg.textContent = "Please select an option.";
          ottomanStorageEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!footstoolBlanketBox) {
          footstoolMsg.textContent = "Please select an option.";
          footstoolEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!headboardHeight) {
          headboardMsg.textContent = "Please select an option.";
          headboardEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!assembly) {
          assemblyMsg.textContent = "Please select an option.";
          assemblyEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (!deliveryDelay) {
          deliveryDelayMsg.textContent = "Please select an option.";
          deliveryDelayEl.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }

        var fabricName = selectedFabricName();
        var unitPrice = currentPrice(currentProduct);
        var sizeIndex = SO_SIZE_KEYS.indexOf(selectedSizeKey);
        var sizeLabel = sizeIndex !== -1 ? SO_SIZE_LABELS[sizeIndex] : currentProduct.size;

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "solid-base-ottoman-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "solid-base-ottomans.html#/" + currentProduct.slug,
              image: (currentProduct.images && currentProduct.images[0]) || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "Solid Base Ottomans",
              variant: {
                size: selectedSizeKey || currentProduct.sizeKey || currentProduct.size || null,
                fabric: fabricName,
                diamantes: diamantes ? "Yes" : null,
                buttons: buttons ? "Yes" : null,
                ottomanStorage: ottomanStorage,
                footstoolBlanketBox: footstoolBlanketBox,
                headboardHeight: headboardHeight,
                customRequest: customRequest || null,
                assembly: assembly,
                assemblyPrice: assembly === "yes" ? ASSEMBLY_PRICE : 0,
                deliveryDelay: deliveryDelay,
                deliveryDate: deliveryDelay === "yes" ? (deliveryDate || null) : null
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

        var detailBits = [];
        if (diamantes) detailBits.push("Diamantes");
        if (buttons) detailBits.push("Matching Fabric Buttons");
        var detailText = detailBits.length ? " with " + detailBits.join(" & ") : "";

        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + quantity + " \u00d7 " + currentProduct.name + " (" + sizeLabel + ", " +
          fabricName + detailText + ") to your basket \u2014 " + soMoney(unitPrice * quantity) + ".";
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