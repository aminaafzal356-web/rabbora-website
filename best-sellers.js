/* =========================================================
   RABBORA LIVING — TV BEDS
   ---------------------------------------------------------
   Self-contained data + page logic for best-sellers.html. Loaded
   AFTER script.js (which still runs the shared header, mobile
   nav, search, dropdown, etc. — none of that is touched here).

   ===============================
   EDIT YOUR PRODUCTS HERE
   ===============================
   To change a product's name, price, description or image,
   edit the matching field below. To replace an image, just
   change the "image" path, e.g.:
     "image": "images/img-1.jfif"
   becomes:
     "image": "images/my-new-photo.jpg"
   No slugs, no auto-generated filenames.
   ========================================================= */

var BS_PRODUCTS = [
  {
    "id": 1,
    "slug": "art-deco-bed-style",
    "name": "The 2026 Art Deco Bed Style",
    "price": 253.00,
    "oldPrice": 430.00,
    "monthly": 21,
    "rating": 5,
    "reviews": 156,
    "badge": "Best Seller",
    "image": "images/img-1.jfif",
    "description": "One of our most popular designs, handmade to order on a solid, supportive frame and finished with tailored upholstery."
  },
  {
    "id": 2,
    "slug": "kendal-butterfly-wingback-bed",
    "name": "2026 Kendal Butterfly Wingback Bed",
    "price": 299.00,
    "oldPrice": 444.00,
    "monthly": 25,
    "rating": 5,
    "reviews": 88,
    "badge": null,
    "image": "images/img-31.png",
    "description": "A striking wingback silhouette, handmade to order on a solid, supportive frame and finished with tailored upholstery."
  },
  {
    "id": 3,
    "slug": "empire-bed-frame-ottoman-storage",
    "name": "2026 Empire Bed Frame with Optional Ottoman Storage",
    "price": 290.00,
    "oldPrice": 420.00,
    "monthly": 26,
    "rating": 5,
    "reviews": 172,
    "badge": null,
    "image": "images/img-8.jfif",
    "description": "A considered frame with the option of built-in ottoman storage, handmade to order and finished with tailored upholstery."
  },
  {
    "id": 4,
    "slug": "orlando-bed-frame-ottoman-storage",
    "name": "2026 Orlando Bed frame (Optional Ottoman Storage)",
    "price": 329.00,
    "oldPrice": 421.00,
    "monthly": 26,
    "rating": 5,
    "reviews": 308,
    "badge": "New",
    "image": "images/img-3.jfif",
    "description": "A refined bed frame with the option of built-in ottoman storage, handmade to order and finished with tailored upholstery."
  },
  {
    "id": 5,
    "slug": "best-seller-5",
    "name": "Bed Name 5",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-4.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 6,
    "slug": "best-seller-6",
    "name": "Bed Name 6",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-6.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 7,
    "slug": "best-seller-7",
    "name": "Bed Name 7",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-9.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 8,
    "slug": "best-seller-8",
    "name": "Bed Name 8",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-10.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 9,
    "slug": "best-seller-9",
    "name": "Bed Name 9",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-11.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 10,
    "slug": "best-seller-10",
    "name": "Bed Name 10",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-12.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 11,
    "slug": "best-seller-11",
    "name": "Bed Name 11",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-13.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 12,
    "slug": "best-seller-12",
    "name": "Bed Name 12",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-14.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 13,
    "slug": "best-seller-13",
    "name": "Bed Name 13",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-15.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 14,
    "slug": "best-seller-14",
    "name": "Bed Name 14",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-16.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 15,
    "slug": "best-seller-15",
    "name": "Bed Name 15",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-20.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 16,
    "slug": "best-seller-16",
    "name": "Bed Name 16",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-21.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 17,
    "slug": "best-seller-17",
    "name": "Bed Name 17",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-22.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 18,
    "slug": "best-seller-18",
    "name": "Bed Name 18",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-24.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 19,
    "slug": "best-seller-19",
    "name": "Bed Name 19",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-25.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 20,
    "slug": "best-seller-20",
    "name": "Bed Name 20",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-26.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 21,
    "slug": "best-seller-21",
    "name": "Bed Name 21",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-27.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 22,
    "slug": "best-seller-22",
    "name": "Bed Name 22",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-28.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 23,
    "slug": "best-seller-23",
    "name": "Bed Name 23",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-29.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 24,
    "slug": "best-seller-24",
    "name": "Bed Name 24",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-30.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 25,
    "slug": "best-seller-25",
    "name": "Bed Name 25",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-33.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 26,
    "slug": "best-seller-26",
    "name": "Bed Name 26",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-41.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 27,
    "slug": "best-seller-27",
    "name": "Bed Name 27",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-42.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 28,
    "slug": "best-seller-28",
    "name": "Bed Name 28",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-43.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 29,
    "slug": "best-seller-29",
    "name": "Bed Name 29",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-44.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 30,
    "slug": "best-seller-30",
    "name": "Bed Name 30",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-45.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 31,
    "slug": "best-seller-31",
    "name": "Bed Name 31",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-47.png",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 32,
    "slug": "best-seller-32",
    "name": "Bed Name 32",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-4.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 33,
    "slug": "best-seller-33",
    "name": "Bed Name 33",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-6.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 34,
    "slug": "best-seller-34",
    "name": "Bed Name 34",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-9.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 35,
    "slug": "best-seller-35",
    "name": "Bed Name 35",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-10.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 36,
    "slug": "best-seller-36",
    "name": "Bed Name 36",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-11.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 37,
    "slug": "best-seller-37",
    "name": "Bed Name 37",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-12.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 38,
    "slug": "best-seller-38",
    "name": "Bed Name 38",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-13.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 39,
    "slug": "best-seller-39",
    "name": "Bed Name 39",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-14.jfif",
    "description": "Add a short product description here once real product details are available."
  },
  {
    "id": 40,
    "slug": "best-seller-40",
    "name": "Bed Name 40",
    "price": 0,
    "oldPrice": null,
    "monthly": 0,
    "rating": 5,
    "reviews": 0,
    "badge": null,
    "image": "images/img-15.jfif",
    "description": "Add a short product description here once real product details are available."
  }
];

var BS_FABRIC_CATALOG = [
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

  var BS_PRODUCTS_BY_SLUG = {};
  BS_PRODUCTS.forEach(function (p) {
    BS_PRODUCTS_BY_SLUG[p.slug] = p;
  });

  var bsState = {
    selectedSize: null,
    quantity: 1,
    imageIndex: 0,
    selectedFabric: null
  };

  /* ---- Product count (sort/filter dropdowns removed) ---- */
  function initToolbar() {
    var grid = document.getElementById("bsProductGrid");
    if (!grid) return;

    var countEl = document.getElementById("bsProductCount");
    var pagination = document.getElementById("bsPagination");
    var pagePrevBtn = document.getElementById("bsPagePrev");
    var pageNextBtn = document.getElementById("bsPageNext");
    var pageButtons = qsa(".mt-pagination__page", pagination);
    var cards = qsa(".bs-product-card", grid);

    var PAGE_SIZE = 12;
    var currentPage = 1;

    function renderPagination(totalPages) {
      if (!pagination) return;
      pageButtons.forEach(function (btn) {
        var page = parseInt(btn.dataset.page, 10);
        btn.hidden = page > totalPages;
        btn.classList.toggle("is-active", page === currentPage);
        btn.setAttribute("aria-current", page === currentPage ? "page" : "false");
      });
      if (pagePrevBtn) pagePrevBtn.disabled = currentPage <= 1;
      if (pageNextBtn) pageNextBtn.disabled = currentPage >= totalPages;
      pagination.hidden = totalPages <= 1;
    }

    function applyPage() {
      var totalPages = Math.max(1, Math.ceil(cards.length / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;

      var startIndex = (currentPage - 1) * PAGE_SIZE;
      var pageItems = cards.slice(startIndex, startIndex + PAGE_SIZE);

      cards.forEach(function (card) {
        card.hidden = pageItems.indexOf(card) === -1;
      });

      if (countEl) {
        var from = startIndex + 1;
        var to = Math.min(startIndex + PAGE_SIZE, cards.length);
        countEl.textContent = "Showing " + from + "\u2013" + to + " of " + cards.length + " beds";
      }

      renderPagination(totalPages);
    }

    if (pagePrevBtn) {
      pagePrevBtn.addEventListener("click", function () {
        if (currentPage > 1) { currentPage -= 1; applyPage(); if (grid.scrollIntoView) grid.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    }
    if (pageNextBtn) {
      pageNextBtn.addEventListener("click", function () {
        currentPage += 1; applyPage(); if (grid.scrollIntoView) grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    pageButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        currentPage = parseInt(btn.dataset.page, 10);
        applyPage();
        if (grid.scrollIntoView) grid.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    applyPage();
  }

  /* ---- Grid / list view toggle ---- */
  function initViewToggle() {
    var grid = document.getElementById("bsProductGrid");
    var gridBtn = document.getElementById("bsGridViewBtn");
    var listBtn = document.getElementById("bsListViewBtn");
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
    qsa(".bs-faq-item").forEach(function (item) {
      var toggle = qs(".bs-faq-item__toggle", item);
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
    var categoryView = document.getElementById("bsCategoryView");
    var detailView = document.getElementById("bsDetailView");
    var notFoundView = document.getElementById("bsNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("bsDetailBreadcrumbName");
    var mainImage = document.getElementById("bsGalleryMainImage");
    var thumbsWrap = document.getElementById("bsGalleryThumbs");
    var fabricsEl = document.getElementById("bsModalFabrics");
    var prevBtn = document.getElementById("bsGalleryPrev");
    var nextBtn = document.getElementById("bsGalleryNext");
    var screenSizeEl = document.getElementById("bsDetailEyebrow");
    var titleEl = document.getElementById("bsDetailTitle");
    var starsEl = document.getElementById("bsDetailStars");
    var reviewCountEl = document.getElementById("bsDetailReviewCount");
    var priceEl = document.getElementById("bsDetailPrice");
    var prevPriceEl = document.getElementById("bsDetailPrevPrice");
    var monthlyEl = document.getElementById("bsDetailMonthly");
    var descriptionEl = document.getElementById("bsDetailDescription");
    var deliveryEl = document.getElementById("bsDetailDelivery");
    var warrantyEl = document.getElementById("bsDetailWarranty");
    var returnsEl = document.getElementById("bsDetailReturns");
    var relatedGrid = document.getElementById("bsRelatedGrid");
    var qtyValueEl = document.getElementById("bsQtyValue");
    var qtyMinus = document.getElementById("bsQtyMinus");
    var qtyPlus = document.getElementById("bsQtyPlus");
    var addBtn = document.getElementById("bsAddToCart");
    var messageEl = document.getElementById("bsPurchaseMessage");

    var currentProduct = null;

    function currentSlug() {
      return window.location.hash.replace(/^#\/?/, "");
    }

    function currentPrice(product) {
      return product.price;
    }

    function renderGallery(product) {
      var images = product.gallery && product.gallery.length ? product.gallery : [product.image];
      mainImage.src = images[bsState.imageIndex] || images[0];
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
        if (index === bsState.imageIndex || (images.length <= 1 && index === 0)) img.classList.add("is-active");
        thumb.appendChild(img);
        thumb.addEventListener("click", function () {
          if (images.length > 1) {
            bsState.imageIndex = index;
            renderGallery(product);
          }
        });
        thumbsWrap.appendChild(thumb);
      });
      prevBtn.hidden = images.length < 2;
      nextBtn.hidden = images.length < 2;
    }

    function renderPrice(product) {
      priceEl.textContent = money(currentPrice(product));
      prevPriceEl.textContent = product.oldPrice ? money(product.oldPrice) : "";
    }

    function renderRelated(product) {
      relatedGrid.innerHTML = "";
      var others = BS_PRODUCTS.filter(function (p) { return p.slug !== product.slug; });
      var related = others.slice(0, 4);

      related.forEach(function (p) {
        var badgeHtml = p.badge ? '<span class="product-card__badge">' + p.badge + '</span>' : "";
        var prevHtml = p.oldPrice ? '<span class="product-card__price-prev">' + money(p.oldPrice) + '</span>' : "";
        var card = document.createElement("article");
        card.className = "product-card";
        card.innerHTML =
          '<div class="product-card__image-wrap">' +
            '<a class="product-card__image-link" href="best-sellers.html#/' + p.slug + '">' +
              '<img src="' + p.image + '" alt="' + p.name + '" loading="lazy" width="900" height="900" />' +
            '</a>' + badgeHtml +
          '</div>' +
          '<div class="product-card__body">' +
            '<a href="best-sellers.html#/' + p.slug + '" class="product-card__name">' + p.name + '</a>' +
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
      if (descTag) descTag.setAttribute("content", product.name + " \u2014 " + product.description);
      var canonicalTag = document.getElementById("pageCanonical");
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/best-sellers.html#/" + product.slug);

      breadcrumbName.textContent = product.name;
      screenSizeEl.textContent = "Best Seller";
      titleEl.textContent = product.name;
      starsEl.textContent = stars(product.rating);
      reviewCountEl.textContent = "(" + product.reviews + ")";
      monthlyEl.textContent = "or from \u00A3" + product.monthly + "/month";
      descriptionEl.textContent = product.description;
      deliveryEl.textContent = "Free Mainland UK delivery. Delivery charges may vary for selected UK regions and remote postcodes.";
      warrantyEl.textContent = "24 month warranty";
      returnsEl.textContent = "Easy returns";

      bsState.imageIndex = 0;
      bsState.selectedSize = null;
      bsState.quantity = 1;
      qtyValueEl.textContent = "1";
      messageEl.textContent = "";
      messageEl.classList.remove("is-error");

      currentProduct = product;
      renderGallery(product);
      renderPrice(product);
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
      if (canonicalTag) canonicalTag.setAttribute("href", "https://rabbora.co.uk/best-sellers.html");
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

      BS_FABRIC_CATALOG.forEach(function (fabric, index) {
        var isSelected = bsState.selectedFabric === fabric.name;
        if (bsState.selectedFabric === null && index === 0) {
          bsState.selectedFabric = fabric.name;
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
          var alreadySelected = bsState.selectedFabric === fabric.name;

          Array.prototype.forEach.call(fabricsEl.querySelectorAll(".fabric-swatch"), function (el) {
            el.setAttribute("aria-pressed", "false");
          });

          if (alreadySelected) {
            bsState.selectedFabric = null;
          } else {
            bsState.selectedFabric = fabric.name;
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
      bsState.selectedFabric = null;
      renderDetail(product);
      renderFabrics();
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    function handleRoute() {
      var hash = window.location.hash;
      if (!hash || hash === "#") { showCategory(); return; }
      var slug = hash.replace(/^#\/?/, "");
      if (!slug) { showCategory(); return; }
      var product = BS_PRODUCTS_BY_SLUG[slug];
      if (product) { showDetail(product); } else { showNotFound(); }
    }

    window.addEventListener("hashchange", handleRoute);
    handleRoute();

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        bsState.imageIndex = (bsState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        bsState.imageIndex = (bsState.imageIndex + 1) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (qtyMinus) {
      qtyMinus.addEventListener("click", function () {
        if (bsState.quantity > 1) {
          bsState.quantity -= 1;
          qtyValueEl.textContent = String(bsState.quantity);
        }
      });
    }
    if (qtyPlus) {
      qtyPlus.addEventListener("click", function () {
        bsState.quantity += 1;
        qtyValueEl.textContent = String(bsState.quantity);
      });
    }

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var unitPrice = currentPrice(currentProduct);

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "best-sellers.html#/" + currentProduct.slug,
              image: currentProduct.image || "",
              alt: currentProduct.name,
              price: unitPrice,
              category: "Best Sellers"
            },
            bsState.quantity
          );
        } else {
          console.error(
            "[Rabbora Cart] Add to Basket clicked but window.RabboraCart is unavailable — " +
            "this item was NOT added to the cart. Check that cart-data.js is loaded on this page."
          );
        }

        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + bsState.quantity + " \u00d7 " + currentProduct.name + " (" + bsState.selectedSize +
          ") to your basket \u2014 " + money(unitPrice * bsState.quantity) + ".";
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