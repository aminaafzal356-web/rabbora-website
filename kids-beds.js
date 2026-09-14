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
    imageIndex: 0
  };

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
      return Math.max(0, product.price + delta);
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

    function renderSizeOptions(product) {
      sizeOptionsEl.innerHTML = "";
      product.sizes.forEach(function (size) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "kb-option-pill";
        btn.setAttribute("aria-pressed", String(kbState.selectedSize === size));
        btn.textContent = size;
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

      currentProduct = product;
      renderGallery(product);
      renderSizeOptions(product);
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

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!kbState.selectedSize) {
          messageEl.textContent = "Please select a size.";
          messageEl.classList.add("is-error");
          return;
        }

        var unitPrice = currentPrice(currentProduct);
        var resolvedImage = (currentProduct.images && currentProduct.images[0]) || "";

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
                size: kbState.selectedSize
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
          "Added " + kbState.quantity + " \u00d7 " + currentProduct.name + " (" + kbState.selectedSize +
          ") to your basket \u2014 " + money(unitPrice * kbState.quantity) + ".";
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!kbState.selectedSize) {
          messageEl.textContent = "Please select a size.";
          messageEl.classList.add("is-error");
          return;
        }
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