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
      "price": 299.0,
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
      "price": 299.0,
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
      "price": 299.0,
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
      "price": 399.0,
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
      "price": 299.0,
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
      "price": 299.0,
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
      "price": 299.0,
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
      "price": 399.0,
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
      "price": 299.0,
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

  var sdState = {
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
      return product.price + (sdState.assembly === "yes" ? ASSEMBLY_PRICE : 0);
    }

    function renderPrice(product) {
      priceEl.textContent = money(currentPrice(product));
      prevPriceEl.textContent = product.oldPrice ? money(product.oldPrice) : "";
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

      // No size, feature-list or dimensions data exists for these
      // products anywhere in the project yet — rather than invent
      // values, those sections are hidden until real data is added.
      if (sizeOptionsBlock) sizeOptionsBlock.hidden = true;
      if (featuresBlock) featuresBlock.hidden = true;
      if (dimensionsBlock) dimensionsBlock.hidden = true;

      if (deliveryEl) deliveryEl.textContent = product.delivery;
      if (warrantyEl) warrantyEl.textContent = product.warranty;
      if (returnsEl) returnsEl.textContent = "30-day easy returns on unused, unassembled beds";

      sdState.imageIndex = 0;
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

    function handleRoute() {
      var slug = currentSlug();
      if (!slug) {
        showCategory();
        return;
      }
      var product = SD_PRODUCTS[slug];
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
    // top-to-bottom in the order they appear on the page. This page
    // has no genuine Size data, so — per "Size, if the current product
    // requires Size" — no size check is added here.
    function validateRequiredOptions() {
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