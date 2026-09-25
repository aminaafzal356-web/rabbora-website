/* =========================================================
   RABBORA LIVING — KIDS' BEDS
   ---------------------------------------------------------
   Self-contained data + page logic for kids-beds.html. Loaded
   AFTER script.js (which still runs the shared header, mobile
   nav, search, dropdown, etc. — none of that is touched here).
   ========================================================= */

// ==========================================
// KIDS BED IMAGES — EDIT ONLY THIS SECTION
// ==========================================
// This is the ONLY place image paths live for this page. To
// change a photo, replace the "image" value below — any
// extension works (.png, .jpg, .jpeg, .webp, .jfif). Nothing
// else in this file needs to change; no path is built or
// guessed anywhere else. Both the product listing and the
// product detail page read from this exact array.
const KIDS_BED_IMAGES = [
  { name: "Kids Bed 1", image: "tv/img-6.jfif" },
  { name: "Kids Bed 2", image: "tv/img-7.jfif" },
  { name: "Kids Bed 3", image: "tv/img-8.jfif" },
  { name: "Kids Bed 4", image: "tv/img-10.jfif" },
  { name: "Kids Bed 5", image: "tv/img-11.jfif" }
];

function getKidsBedImage(imageName) {
  var match = KIDS_BED_IMAGES.filter(function (item) {
    return item.name === imageName;
  })[0];
  return match ? match.image : "";
}

// ==========================================
// KIDS BED PRODUCT DATA
// ==========================================
// Each product references its photo by "imageName", which is
// matched against KIDS_BED_IMAGES above — the image path itself
// is never repeated here.
var KB_FABRIC_COLLECTIONS = [
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

var KB_FABRIC_COLLECTIONS_FLAT = [];
KB_FABRIC_COLLECTIONS.forEach(function (collection) {
  collection.fabrics.forEach(function (fabric) {
    KB_FABRIC_COLLECTIONS_FLAT.push(fabric);
  });
});

var KIDS_BED_PRODUCTS = 
[
  {
    "id": 1,
    "slug": "kids-bed-1",
    "name": "Harper Kids Bed",
    "images": [
      "tv/img-6.jfif",
       "tv/img-30.png",
        "tv/img-12.png"
    ],
    "price": 449,
    "oldPrice": 599,
    "monthly": 38,
    "rating": 5,
    "reviews": 0,
    "badge": "25% Off",
    "shortInfo": "A safe, durable frame sized and finished for a growing child's room.",
    "description": "A stylish and comfortable kids bed designed to create a cosy space for relaxing, sleeping and enjoying everyday moments.",
    "sizes": [
      "Single",
      "Small Double"
    ],
    "features": [
      "Low-profile frame designed with child safety in mind",
      "Durable, easy-to-clean upholstered finish",
      "Rounded edges and solid, stable construction",
      "Sprung slatted base for a comfortable sleep surface"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds."
  },
  {
    "id": 2,
    "slug": "kids-bed-2",
    "name": "Luna Kids Bed",
    "images": [
      "tv/img-7.jfif",
       "tv/img-13.png",
        "tv/img-15.png"
    ],
    "price": 449,
    "oldPrice": 599,
    "monthly": 38,
    "rating": 0,
    "reviews": 0,
    "badge": "25% Off",
    "shortInfo": "A safe, durable frame sized and finished for a growing child's room.",
    "description": "Bring elegance and comfort to your child's bedroom with the Luna Kids Bed, designed with a beautiful look and a cosy feel.",
    "sizes": [
      "Single",
      "Small Double"
    ],
    "features": [
      "Low-profile frame designed with child safety in mind",
      "Durable, easy-to-clean upholstered finish",
      "Rounded edges and solid, stable construction",
      "Sprung slatted base for a comfortable sleep surface"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds."
  },
  {
    "id": 3,
    "slug": "kids-bed-3",
    "name": "Mia Kids Bed",
    "images": [
     "tv/img-8.jfif",
       "tv/img-16.png",
        "tv/img-17.png"
    ],
    "price": 449,
    "oldPrice": 599,
    "monthly": 38,
    "rating": 5,
    "reviews": 0,
    "badge": "25% Off",
    "shortInfo": "A safe, durable frame sized and finished for a growing child's room.",
    "description": "The Mia Kids Bed combines a charming design with everyday comfort, making it a lovely choice for a modern children's bedroom.",
    "sizes": [
      "Single",
      "Small Double"
    ],
    "features": [
      "Low-profile frame designed with child safety in mind",
      "Durable, easy-to-clean upholstered finish",
      "Rounded edges and solid, stable construction",
      "Sprung slatted base for a comfortable sleep surface"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds."
  },
  {
    "id": 4,
    "slug": "kids-bed-4",
    "name": "Oliver Kids Bed",
    "images": [
       "tv/img-10.jfif",
       "tv/img-18.png",
        "tv/img-19.png"
    ],
    "price": 449,
    "oldPrice": 599,
    "monthly": 38,
    "rating": 0,
    "reviews": 0,
    "badge": "25% Off",
    "shortInfo": "A safe, durable frame sized and finished for a growing child's room.",
    "description": "Create a warm and inviting bedroom with the Oliver Kids Bed, offering a stylish design and a comfortable place to rest.",
    "sizes": [
      "Single",
      "Small Double"
    ],
    "features": [
      "Low-profile frame designed with child safety in mind",
      "Durable, easy-to-clean upholstered finish",
      "Rounded edges and solid, stable construction",
      "Sprung slatted base for a comfortable sleep surface"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds."
  },
  {
    "id": 5,
    "slug": "kids-bed-5",
    "name": "Aria Kids Bed",
    "images": [
  "tv/img-11.jfif",
       "tv/img-20.png",
        "tv/img-21.png"
    ],
    "price": 499,
    "oldPrice": 599,
    "monthly": 42,
    "rating": 5,
    "reviews": 0,
    "badge": "17% Off",
    "shortInfo": "A safe, durable frame sized and finished for a growing child's room.",
    "description": "The Aria Kids Bed adds a touch of luxury to your child's room with its elegant design, cosy finish and timeless appeal.",
    "sizes": [
      "Single",
      "Small Double"
    ],
    "features": [
      "Low-profile frame designed with child safety in mind",
      "Durable, easy-to-clean upholstered finish",
      "Rounded edges and solid, stable construction",
      "Sprung slatted base for a comfortable sleep surface"
    ],
    "dimensions": {
      "Single": {
        "width": 105,
        "length": 206
      },
      "Small Double": {
        "width": 136,
        "length": 206
      }
    },
    "delivery": "Handmade to order, with standard UK delivery included.",
    "warranty": "24 month warranty",
    "returns": "30-day easy returns on unused, unassembled beds."
  }
];

var KIDS_BED_SIZE_DELTAS = {
  "Single": 0,
  "Small Double": 40
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

  var KIDS_PRODUCTS_BY_SLUG = {};
  KIDS_BED_PRODUCTS.forEach(function (p) {
    KIDS_PRODUCTS_BY_SLUG[p.slug] = p;
  });

  var kbState = {
    selectedSize: null,
    quantity: 1,
    imageIndex: 0,
    selectedFabricIndex: -1,
    footstoolBlanketBox: null,
    headboardCustom: null,
    customRequest: "",
    assembly: null,
    deliveryDelay: null,
    deliveryDate: ""
  };

  var ASSEMBLY_PRICE = 59;

  var kbWishlist = new Set();

  // ==========================================
  // KIDS BED LISTING
  // ==========================================
  /* ---- Populate each grid card's image from KIDS_BED_IMAGES ---- */
  function populateGridImages() {
    qsa(".kb-product-image").forEach(function (img) {
      var name = img.dataset.imageName;
      img.src = getKidsBedImage(name);
    });
  }

  /* ---- Product count ---- */
  function initToolbar() {
    var grid = document.getElementById("kbProductGrid");
    if (!grid) return;
    var countEl = document.getElementById("kbProductCount");
    var cards = qsa(".kb-product-card", grid);
    if (countEl) countEl.textContent = cards.length + (cards.length === 1 ? " Bed" : " Beds");
  }

  /* ---- Grid / list view toggle ---- */
  function initViewToggle() {
    var grid = document.getElementById("kbProductGrid");
    var gridBtn = document.getElementById("kbGridViewBtn");
    var listBtn = document.getElementById("kbListViewBtn");
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

  /* ---- FAQ accordion ---- */
  function initFaq() {
    qsa(".kb-faq-item").forEach(function (item) {
      var toggle = qs(".kb-faq-item__toggle", item);
      if (!toggle) return;
      toggle.addEventListener("click", function () {
        var isOpen = item.classList.contains("is-open");
        item.classList.toggle("is-open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });
    });
  }

  // ==========================================
  // KIDS BED DETAIL PAGE
  // ==========================================
  /* ---- Detail view: one reusable component for all 5 products ---- */
  function initDetail() {
    var categoryView = document.getElementById("kbCategoryView");
    var detailView = document.getElementById("kbDetailView");
    var notFoundView = document.getElementById("kbNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("kbDetailBreadcrumbName");
    var mainImage = document.getElementById("kbGalleryMainImage");
    var thumbsWrap = document.getElementById("kbGalleryThumbs");
    var prevBtn = document.getElementById("kbGalleryPrev");
    var nextBtn = document.getElementById("kbGalleryNext");
    var zoomBtn = document.getElementById("kbGalleryZoom");
    var lightbox = document.getElementById("kbLightbox");
    var lightboxImage = document.getElementById("kbLightboxImage");
    var lightboxClose = document.getElementById("kbLightboxClose");
    var titleEl = document.getElementById("kbDetailTitle");
    var starsEl = document.getElementById("kbDetailStars");
    var reviewCountEl = document.getElementById("kbDetailReviewCount");
    var priceEl = document.getElementById("kbDetailPrice");
    var prevPriceEl = document.getElementById("kbDetailPrevPrice");
    var monthlyEl = document.getElementById("kbDetailMonthly");
    var descriptionEl = document.getElementById("kbDetailDescription");
    var sizeOptionsEl = document.getElementById("kbSizeOptions");
    var fabricOptionsEl = document.getElementById("kbModalFabrics");
    var footstoolEl = document.getElementById("kbFootstoolOptions");
    var footstoolMsg = document.getElementById("kbFootstoolMessage");
    var headboardCustomEl = document.getElementById("kbHeadboardCustomOptions");
    var headboardCustomMsg = document.getElementById("kbHeadboardCustomMessage");
    var customRequestEl = document.getElementById("kbCustomRequest");
    var assemblyEl = document.getElementById("kbAssemblyOptions");
    var assemblyMsg = document.getElementById("kbAssemblyMessage");
    var deliveryDelayEl = document.getElementById("kbDeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("kbDeliveryDelayMessage");
    var delayDateWrap = document.getElementById("kbDelayDateWrap");
    var delayDateInput = document.getElementById("kbDelayDate");
    var featuresEl = document.getElementById("kbDetailFeatures");
    var dimensionsEl = document.getElementById("kbDetailDimensions");
    var deliveryEl = document.getElementById("kbDetailDelivery");
    var warrantyEl = document.getElementById("kbDetailWarranty");
    var returnsEl = document.getElementById("kbDetailReturns");
    var relatedGrid = document.getElementById("kbRelatedGrid");
    var qtyValueEl = document.getElementById("kbQtyValue");
    var qtyMinus = document.getElementById("kbQtyMinus");
    var qtyPlus = document.getElementById("kbQtyPlus");
    var addBtn = document.getElementById("kbAddToCart");
    var buyNowBtn = document.getElementById("kbBuyNow");
    var wishlistBtn = document.getElementById("kbWishlistBtn");
    var messageEl = document.getElementById("kbPurchaseMessage");

    var currentProduct = null;

    function currentPrice(product) {
      var delta = kbState.selectedSize ? (KIDS_BED_SIZE_DELTAS[kbState.selectedSize] || 0) : 0;
      var addons = kbState.assembly === "yes" ? ASSEMBLY_PRICE : 0;
      return Math.max(0, product.price + delta + addons);
    }

    // Fabric Colour — new on this page (the container already existed
    // in the HTML but was never populated). Uses the same real, current
    // Fabric Samples collection data and grouped/collection-heading
    // swatch pattern already used on Blanket Boxes, Sofas, Bed Frames,
    // Ottoman Beds, Solid Base Ottoman, High Headboard Beds, Storage
    // Drawers and TV Beds.
    function selectedFabricName() {
      if (kbState.selectedFabricIndex === -1) return "";
      var fabric = KB_FABRIC_COLLECTIONS_FLAT[kbState.selectedFabricIndex];
      return fabric ? fabric.name : "";
    }

    function renderFabricOptions() {
      if (!fabricOptionsEl) return;
      fabricOptionsEl.innerHTML = "";

      KB_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl2 = document.createElement("p");
        titleEl2.className = "bb-modal__fabric-collection-title";
        titleEl2.textContent = collection.name;
        groupEl.appendChild(titleEl2);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric) {
          var flatIndex = KB_FABRIC_COLLECTIONS_FLAT.indexOf(fabric);
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(kbState.selectedFabricIndex === flatIndex));
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
            var alreadySelected = kbState.selectedFabricIndex === flatIndex;
            Array.prototype.forEach.call(fabricOptionsEl.querySelectorAll(".fabric-swatch"), function (el) {
              el.setAttribute("aria-pressed", "false");
            });
            if (alreadySelected) {
              kbState.selectedFabricIndex = -1;
            } else {
              kbState.selectedFabricIndex = flatIndex;
              btn.setAttribute("aria-pressed", "true");
            }
          });
          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricOptionsEl.appendChild(groupEl);
      });
    }

    // Shared helper for the four new single-select option groups (note:
    // no Ottoman Storage option on this page — a "storage upgrade"
    // doesn't apply to Kids Beds and was intentionally left out) — each
    // is a plain group of .kb-option-pill buttons where exactly one
    // choice can be active at a time.
    function initRadioPillGroup(container, stateKey, messageEl2, onSelect) {
      if (!container) return;
      Array.prototype.forEach.call(container.querySelectorAll(".kb-option-pill"), function (btn) {
        btn.addEventListener("click", function () {
          kbState[stateKey] = btn.dataset.value;
          Array.prototype.forEach.call(container.querySelectorAll(".kb-option-pill"), function (el) {
            el.setAttribute("aria-pressed", "false");
          });
          btn.setAttribute("aria-pressed", "true");
          if (messageEl2) messageEl2.textContent = "";
          if (onSelect) onSelect(btn.dataset.value);
        });
      });
    }

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
        kbState.customRequest = customRequestEl.value;
      });
    }

    if (delayDateInput) {
      delayDateInput.addEventListener("change", function () {
        kbState.deliveryDate = delayDateInput.value;
      });
    }

    function renderGallery(product) {
      var images = (product.images && product.images.length) ? product.images : [];

      if (images.length === 0) {
        mainImage.hidden = true;
        mainImage.removeAttribute("src");
        thumbsWrap.innerHTML = "";
        if (prevBtn) prevBtn.hidden = true;
        if (nextBtn) nextBtn.hidden = true;
        if (zoomBtn) zoomBtn.hidden = true;
        return;
      }

      if (zoomBtn) zoomBtn.hidden = false;
      mainImage.hidden = false;
      mainImage.src = images[kbState.imageIndex] || images[0];
      mainImage.alt = "";
      mainImage.onerror = function () { mainImage.hidden = true; };
      mainImage.onload = function () { mainImage.hidden = false; };

      thumbsWrap.innerHTML = "";
      if (images.length > 1) {
        images.forEach(function (src, index) {
          var thumb = document.createElement("button");
          thumb.type = "button";
          thumb.className = index === kbState.imageIndex ? "is-active" : "";
          thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
          var img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.loading = "lazy";
          img.onerror = function () { img.style.visibility = "hidden"; };
          thumb.appendChild(img);
          thumb.addEventListener("click", function () {
            kbState.imageIndex = index;
            renderGallery(product);
          });
          thumbsWrap.appendChild(thumb);
        });
      }
      if (prevBtn) prevBtn.hidden = images.length < 2;
      if (nextBtn) nextBtn.hidden = images.length < 2;
    }

    function syncWishlistButton(product) {
      if (!wishlistBtn) return;
      var isSaved = kbWishlist.has(product.slug);
      wishlistBtn.setAttribute("aria-pressed", String(isSaved));
      wishlistBtn.setAttribute("aria-label", isSaved ? "Remove from wishlist" : "Add to wishlist");
    }

    // Display labels only — the underlying plain size key ("Single",
    // "Small Double") is unchanged and still drives pricing, dimensions
    // and the cart variant, matching the same "Single 3ft" / "Small
    // Double 4ft" labelling convention already used everywhere else on
    // the site.
    var KB_SIZE_LABELS = {
      "Single": "Single 3ft",
      "Small Double": "Small Double 4ft"
    };

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.sizes.forEach(function (size) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "kb-option-pill";
        btn.setAttribute("aria-pressed", String(kbState.selectedSize === size));
        btn.textContent = KB_SIZE_LABELS[size] || size;
        btn.addEventListener("click", function () {
          kbState.selectedSize = size;
          messageEl.textContent = "";
          qsa(".kb-option-pill", sizeOptionsEl).forEach(function (el) {
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
      var others = KIDS_BED_PRODUCTS.filter(function (p) { return p.slug !== product.slug; });

      others.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + money(p.oldPrice) + '</span>' : "";
        var card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="kids-beds.html#/' + p.slug + '">' +
              '<img src="' + ((p.images && p.images[0]) || "") + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="kids-beds.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
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
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/kids-beds/" + product.slug);

      breadcrumbName.textContent = product.name;
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

      kbState.selectedSize = null;
      kbState.quantity = 1;
      kbState.imageIndex = 0;
      qtyValueEl.textContent = "1";
      messageEl.textContent = "";
      messageEl.classList.remove("is-error");

      kbState.selectedFabricIndex = -1;
      kbState.footstoolBlanketBox = null;
      kbState.headboardCustom = null;
      kbState.customRequest = "";
      kbState.assembly = null;
      kbState.deliveryDelay = null;
      kbState.deliveryDate = "";
      [footstoolEl, headboardCustomEl, assemblyEl, deliveryDelayEl].forEach(function (group) {
        if (!group) return;
        Array.prototype.forEach.call(group.querySelectorAll(".kb-option-pill"), function (el) {
          el.setAttribute("aria-pressed", "false");
        });
      });
      [footstoolMsg, headboardCustomMsg, assemblyMsg, deliveryDelayMsg].forEach(function (msg) {
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
      syncWishlistButton(product);
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
      document.title = "Kids\u2019 Beds | Safe & Durable Bed Frames | Rabbora Living";
      var descTag = document.getElementById("pageDescription");
      if (descTag) descTag.setAttribute("content", "Shop Kids' Beds at Rabbora Living. Safe, durable, low-profile bed frames handmade in Britain, sized for a growing child's room.");
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/kids-beds");
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
      var product = KIDS_PRODUCTS_BY_SLUG[slug];
      if (product) { showDetail(product); } else { showNotFound(); }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.images && currentProduct.images.length ? currentProduct.images : [];
        if (images.length === 0) return;
        kbState.imageIndex = (kbState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.images && currentProduct.images.length ? currentProduct.images : [];
        if (images.length === 0) return;
        kbState.imageIndex = (kbState.imageIndex + 1) % images.length;
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
        if (kbState.quantity > 1) {
          kbState.quantity -= 1;
          qtyValueEl.textContent = String(kbState.quantity);
        }
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        kbState.quantity += 1;
        qtyValueEl.textContent = String(kbState.quantity);
      });
    }

    // Shared validation for both Add to Basket and Buy Now — each
    // required option shows its own inline message right next to that
    // option (not just one generic message at the bottom), checked
    // top-to-bottom in the order they appear. No Ottoman Storage check
    // here, since that option was intentionally left off this page.
    function validateRequiredOptions() {
      if (!kbState.selectedSize) {
        messageEl.textContent = "Please select a size.";
        messageEl.classList.add("is-error");
        return false;
      }
      if (!kbState.footstoolBlanketBox) {
        footstoolMsg.textContent = "Please select an option.";
        footstoolEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!kbState.headboardCustom) {
        headboardCustomMsg.textContent = "Please select an option.";
        headboardCustomEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!kbState.assembly) {
        assemblyMsg.textContent = "Please select an option.";
        assemblyEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!kbState.deliveryDelay) {
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
        var resolvedImage = (currentProduct.images && currentProduct.images[0]) || "";
        var fabricName = selectedFabricName();

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "kids-bed-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "kids-beds.html#/" + currentProduct.slug,
              image: resolvedImage || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "Kids\u2019 Beds",
              variant: {
                size: kbState.selectedSize,
                fabric: fabricName || null,
                footstoolBlanketBox: kbState.footstoolBlanketBox,
                headboardHeight: kbState.headboardCustom,
                customRequest: kbState.customRequest || null,
                assembly: kbState.assembly,
                assemblyPrice: kbState.assembly === "yes" ? ASSEMBLY_PRICE : 0,
                deliveryDelay: kbState.deliveryDelay,
                deliveryDate: kbState.deliveryDelay === "yes" ? (kbState.deliveryDate || null) : null
              }
            },
            kbState.quantity
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
          "Added " + kbState.quantity + " \u00d7 " + currentProduct.name + " (" + (KB_SIZE_LABELS[kbState.selectedSize] || kbState.selectedSize) +
          ") to your basket \u2014 " + money(unitPrice * kbState.quantity) + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!validateRequiredOptions()) return;
        messageEl.classList.remove("is-error");
        messageEl.textContent = "Taking you to checkout for " + kbState.quantity + " \u00d7 " + currentProduct.name + "...";
      });
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var isSaved = kbWishlist.has(currentProduct.slug);
        if (isSaved) {
          kbWishlist.delete(currentProduct.slug);
        } else {
          kbWishlist.add(currentProduct.slug);
        }
        syncWishlistButton(currentProduct);

        var wishlistCountEl = document.getElementById("wishlistCount");
        if (wishlistCountEl) {
          wishlistCountEl.textContent = String(kbWishlist.size);
        }
      });
    }
  }


  /* ---- Review data cleanup: no verified real reviews exist yet, so
     replace any star/count display with an honest "No reviews yet"
     message instead of showing invented numbers. Excludes the detail
     view's own rating element (.kb-detail__rating), which is
     populated separately once a product is opened. ---- */
  function cleanupFakeRatings() {
    document.querySelectorAll(".product-card__rating:not(.kb-detail__rating)").forEach(function (el) {
      el.innerHTML = '<span class="product-card__no-reviews">No reviews yet</span>';
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    cleanupFakeRatings();
    populateGridImages();
    initToolbar();
    initViewToggle();
    initFaq();
    initDetail();
  });
})();