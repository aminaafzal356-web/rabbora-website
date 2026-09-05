/* =========================================================
   RABBORA LIVING — BED FRAMES
   ---------------------------------------------------------
   Self-contained product data + detail-page logic for
   bed-frames.html. Loaded AFTER script.js (which
   handles the shared header, mobile nav, search, wishlist
   count, cart count — none of that is duplicated here).

   ===============================
   EDIT YOUR PRODUCTS HERE
   ===============================
   The 3 products below are PLACEHOLDERS. Replace "name",
   "price" and "image" with real data before this page goes
   live — nothing else needs to change; the detail page,
   gallery, fabric colours, size selector and Cart/Wishlist
   are already fully wired up.
   ========================================================= */

var BF_PRODUCTS = [
  {
    slug: "bed-frame-1",
    name: "Bed Name 1",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-2",
    name: "Bed Name 2",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-3",
    name: "Bed Name 3",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-4",
    name: "Bed Name 4",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-5",
    name: "Bed Name 5",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-6",
    name: "Bed Name 6",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-7",
    name: "Bed Name 7",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-8",
    name: "Bed Name 8",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-9",
    name: "Bed Name 9",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-10",
    name: "Bed Name 10",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-11",
    name: "Bed Name 11",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-12",
    name: "Bed Name 12",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-13",
    name: "Bed Name 13",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-14",
    name: "Bed Name 14",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-15",
    name: "Bed Name 15",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-16",
    name: "Bed Name 16",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-17",
    name: "Bed Name 17",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-18",
    name: "Bed Name 18",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-19",
    name: "Bed Name 19",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-20",
    name: "Bed Name 20",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-21",
    name: "Bed Name 21",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-22",
    name: "Bed Name 22",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-23",
    name: "Bed Name 23",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-24",
    name: "Bed Name 24",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-25",
    name: "Bed Name 25",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-26",
    name: "Bed Name 26",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-27",
    name: "Bed Name 27",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-28",
    name: "Bed Name 28",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-29",
    name: "Bed Name 29",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  },
  {
    slug: "bed-frame-30",
    name: "Bed Name 30",
    price: 0,
    rating: 5,
    reviewCount: 0,
    image: "images/PUT-IMAGE-HERE.jpg",
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"]
  }
];

var BF_FABRIC_CATALOG = [
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

  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  var BF_PRODUCTS_BY_SLUG = {};
  BF_PRODUCTS.forEach(function (p) { BF_PRODUCTS_BY_SLUG[p.slug] = p; });

  function bfMoney(value) {
    return "\u00A3" + Number(value).toFixed(2);
  }

  function renderStars(rating) {
    var full = Math.round(rating);
    var out = "";
    for (var i = 0; i < 5; i++) out += i < full ? "\u2605" : "\u2606";
    return out;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var categoryView = document.getElementById("bfCategoryView");
    var detailView = document.getElementById("bfDetailView");
    var notFoundView = document.getElementById("bfNotFoundView");

    var mainImage = document.getElementById("bfGalleryMainImage");
    var imagePlaceholder = document.getElementById("bfDetailImagePlaceholder");
    var galleryPrev = document.getElementById("bfGalleryPrev");
    var galleryNext = document.getElementById("bfGalleryNext");
    var thumbsWrap = document.getElementById("bfGalleryThumbs");
    var fabricsEl = document.getElementById("bfModalFabrics");
    var sizeEl = document.getElementById("bfSizeOptions");

    var qtyValueEl = document.getElementById("bfQtyValue");
    var qtyMinus = document.getElementById("bfQtyMinus");
    var qtyPlus = document.getElementById("bfQtyPlus");
    var addBtn = document.getElementById("bfAddToCart");
    var buyNowBtn = document.getElementById("bfBuyNow");
    var messageEl = document.getElementById("bfPurchaseMessage");

    var currentProduct = null;
    var quantity = 1;
    var selectedFabric = null;
    var selectedSize = null;
    var imageIndex = 0;

    function getProductImages(product) {
      if (Array.isArray(product.images) && product.images.length) return product.images;
      return product.image ? [product.image] : [];
    }

    function renderThumbs(product) {
      if (!thumbsWrap) return;
      var images = getProductImages(product).filter(function (src) {
        return src && src.indexOf("PUT-IMAGE-HERE") === -1;
      });
      thumbsWrap.innerHTML = "";

      if (images.length === 0) {
        if (galleryPrev) galleryPrev.hidden = true;
        if (galleryNext) galleryNext.hidden = true;
        for (var i = 0; i < 3; i++) {
          var ph = document.createElement("span");
          ph.className = "bb-modal__thumb so-image-placeholder";
          ph.setAttribute("aria-hidden", "true");
          thumbsWrap.appendChild(ph);
        }
        return;
      }

      if (images.length < 2) {
        if (galleryPrev) galleryPrev.hidden = true;
        if (galleryNext) galleryNext.hidden = true;
      } else {
        if (galleryPrev) galleryPrev.hidden = false;
        if (galleryNext) galleryNext.hidden = false;
      }

      images.forEach(function (src, index) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "bb-modal__thumb" + (index === imageIndex ? " is-active" : "");
        thumb.setAttribute("aria-label", "Show image " + (index + 1) + " of " + product.name);
        thumb.innerHTML = '<img src="' + src + '" alt="" loading="lazy" />';
        thumb.addEventListener("click", function () {
          imageIndex = index;
          renderImage(product);
        });
        thumbsWrap.appendChild(thumb);
      });
    }

    function renderImage(product) {
      var images = getProductImages(product).filter(function (src) {
        return src && src.indexOf("PUT-IMAGE-HERE") === -1;
      });
      var hasRealImage = images.length > 0;
      if (hasRealImage) {
        mainImage.src = images[imageIndex] || images[0];
        mainImage.alt = "";
        mainImage.hidden = false;
        imagePlaceholder.hidden = true;
        mainImage.onerror = function () {
          mainImage.hidden = true;
          imagePlaceholder.hidden = false;
        };
      } else {
        mainImage.hidden = true;
        mainImage.src = "";
        imagePlaceholder.hidden = false;
      }
      renderThumbs(product);
    }

    function renderFabrics() {
      if (!fabricsEl) return;
      fabricsEl.innerHTML = "";

      BF_FABRIC_CATALOG.forEach(function (fabric, index) {
        var isSelected = selectedFabric === fabric.name;
        if (selectedFabric === null && index === 0) {
          selectedFabric = fabric.name;
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
          var alreadySelected = selectedFabric === fabric.name;

          Array.prototype.forEach.call(fabricsEl.querySelectorAll(".fabric-swatch"), function (el) {
            el.setAttribute("aria-pressed", "false");
          });

          if (alreadySelected) {
            selectedFabric = null;
          } else {
            selectedFabric = fabric.name;
            btn.setAttribute("aria-pressed", "true");
          }
        });

        fabricsEl.appendChild(btn);
      });
    }

    function renderSizeOptions(product) {
      if (!sizeEl) return;
      sizeEl.innerHTML = "";
      var sizes = product.sizes || [];
      if (sizes.length === 0) {
        sizeEl.closest(".bb-modal__fabrics").hidden = true;
        return;
      }
      sizeEl.closest(".bb-modal__fabrics").hidden = false;

      selectedSize = sizes[0];

      sizes.forEach(function (size) {
        var pill = document.createElement("button");
        pill.type = "button";
        pill.className = "mt-option-pill" + (size === selectedSize ? " is-active" : "");
        pill.textContent = size;
        pill.addEventListener("click", function () {
          selectedSize = size;
          Array.prototype.forEach.call(sizeEl.querySelectorAll(".mt-option-pill"), function (el) {
            el.classList.remove("is-active");
          });
          pill.classList.add("is-active");
        });
        sizeEl.appendChild(pill);
      });
    }

    function renderDetail(product) {
      document.title = product.name + " | Non-Storage Bed Frames | Rabbora Living";

      var eyebrowEl = document.getElementById("bfDetailEyebrow");
      if (eyebrowEl) eyebrowEl.textContent = "Non-Storage Bed Frame";

      document.getElementById("bfDetailTitle").textContent = product.name;
      document.getElementById("bfDetailBreadcrumbName").textContent = product.name;

      var starsEl = document.getElementById("bfDetailStars");
      var reviewCountEl = document.getElementById("bfDetailReviewCount");
      if (starsEl) starsEl.textContent = renderStars(product.rating || 5);
      if (reviewCountEl) reviewCountEl.textContent = product.reviewCount ? "(" + product.reviewCount + ")" : "";

      document.getElementById("bfDetailPrice").textContent = bfMoney(product.price);
      document.getElementById("bfDetailDescription").textContent = product.description || "";

      var featuresEl = document.getElementById("bfDetailFeatures");
      if (featuresEl) {
        featuresEl.innerHTML = "";
        (product.features || []).forEach(function (feature) {
          var li = document.createElement("li");
          li.textContent = feature;
          featuresEl.appendChild(li);
        });
      }

      quantity = 1;
      if (qtyValueEl) qtyValueEl.textContent = "1";
      if (messageEl) {
        messageEl.textContent = "";
        messageEl.classList.remove("is-error");
      }
    }

    function showCategory() {
      categoryView.hidden = false;
      detailView.hidden = true;
      notFoundView.hidden = true;
    }

    function showNotFound() {
      categoryView.hidden = true;
      detailView.hidden = true;
      notFoundView.hidden = false;
      document.title = "Product Not Found | Rabbora Living";
    }

    function showDetail(product) {
      categoryView.hidden = true;
      notFoundView.hidden = true;
      detailView.hidden = false;
      selectedFabric = null;
      imageIndex = 0;
      currentProduct = product;
      renderDetail(product);
      renderSizeOptions(product);
      renderFabrics();
      renderImage(product);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }

    function currentSlugFromHash() {
      var hash = window.location.hash;
      if (!hash || hash === "#") return null;
      return hash.replace(/^#\/?/, "") || null;
    }

    function handleRoute() {
      // Defensive: always release the mobile-menu scroll lock and close
      // the drawer on every route change (see blanket-boxes.js for the
      // full explanation of why this matters).
      document.body.style.overflow = "";
      var mobileDrawer = document.getElementById("mobileNav");
      var mobileOverlay = document.getElementById("mobileNavOverlay");
      var hamburgerBtn = document.getElementById("hamburgerBtn");
      if (mobileDrawer && mobileDrawer.classList.contains("is-open")) {
        mobileDrawer.classList.remove("is-open");
        mobileDrawer.setAttribute("aria-hidden", "true");
        if (mobileOverlay) mobileOverlay.classList.remove("is-visible");
        if (hamburgerBtn) hamburgerBtn.setAttribute("aria-expanded", "false");
      }

      var slug = currentSlugFromHash();
      if (!slug) { showCategory(); return; }

      var product = BF_PRODUCTS_BY_SLUG[slug];
      if (!product) { showNotFound(); return; }

      showDetail(product);
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

    if (galleryPrev) {
      galleryPrev.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = getProductImages(currentProduct).filter(function (src) {
          return src && src.indexOf("PUT-IMAGE-HERE") === -1;
        });
        if (images.length < 2) return;
        imageIndex = (imageIndex - 1 + images.length) % images.length;
        renderImage(currentProduct);
      });
    }
    if (galleryNext) {
      galleryNext.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = getProductImages(currentProduct).filter(function (src) {
          return src && src.indexOf("PUT-IMAGE-HERE") === -1;
        });
        if (images.length < 2) return;
        imageIndex = (imageIndex + 1) % images.length;
        renderImage(currentProduct);
      });
    }

    function hasCartStore() {
      return !!(window.RabboraCart && typeof window.RabboraCart.add === "function");
    }

    function addCurrentToCart() {
      if (!currentProduct) return;

      if (!hasCartStore()) {
        console.error(
          "[Rabbora Cart] window.RabboraCart is not available on this page. " +
          "Check that <script src=\"cart-data.js\"></script> is present and loads before this script."
        );
        if (messageEl) {
          messageEl.textContent = "Sorry, something went wrong adding this to your cart. Please refresh and try again.";
          messageEl.classList.add("is-error");
        }
        return;
      }

      window.RabboraCart.add({
        id: currentProduct.slug,
        slug: currentProduct.slug,
        name: currentProduct.name,
        image: currentProduct.image,
        price: currentProduct.price,
        variant: { size: selectedSize || "", fabric: selectedFabric || "" },
        url: "bed-frames.html#/" + currentProduct.slug
      }, quantity);

      if (messageEl) {
        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + quantity + " \u00d7 " + currentProduct.name +
          (selectedSize ? " (" + selectedSize + ")" : "") +
          " to your basket \u2014 " + bfMoney(currentProduct.price * quantity) + ".";
      }
    }

    if (addBtn) {
      addBtn.addEventListener("click", addCurrentToCart);
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        addCurrentToCart();
        window.location.href = "cart.html";
      });
    }
  });
})();