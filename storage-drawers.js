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
      "name": "Chelsea Storage Drawer Bed",
      "image": "images/storage-drawers/img-1.png",
      "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "New",
      "rating": 4,
      "reviews": 22,
      "price": 329.0,
      "oldPrice": 379.0,
      "monthly": 27,
      "drawers": 2
    },
    {
      "slug": "storage-drawer-2",
      "name": "Hampton Storage Drawer Bed",
      "image": "images/storage-drawers/img-2.png",
      "shortInfo": "4 spacious drawers built into a tailored, handmade frame.",
      "badge": "Best Seller",
      "rating": 5,
      "reviews": 31,
      "price": 356.0,
      "oldPrice": null,
      "monthly": 30,
      "drawers": 4
    },
    {
      "slug": "storage-drawer-3",
      "name": "Windsor Storage Drawer Bed",
      "image": "images/storage-drawers/img-3.png",
      "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "",
      "rating": 5,
      "reviews": 40,
      "price": 383.0,
      "oldPrice": null,
      "monthly": 32,
      "drawers": 2
    },
    {
      "slug": "storage-drawer-4",
      "name": "Kensington Storage Drawer Bed",
      "image": "images/storage-drawers/img-4.png",
      "shortInfo": "4 spacious drawers built into a tailored, handmade frame.",
      "badge": "",
      "rating": 5,
      "reviews": 49,
      "price": 410.0,
      "oldPrice": 460.0,
      "monthly": 34,
      "drawers": 4
    },
    {
      "slug": "storage-drawer-5",
      "name": "Mayfair Storage Drawer Bed",
      "image": "images/storage-drawers/img-5.png",
      "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "Best Seller",
      "rating": 4,
      "reviews": 58,
      "price": 437.0,
      "oldPrice": null,
      "monthly": 36,
      "drawers": 2
    },
    {
      "slug": "storage-drawer-6",
      "name": "Richmond Storage Drawer Bed",
      "image": "images/storage-drawers/img-6.png",
      "shortInfo": "4 spacious drawers built into a tailored, handmade frame.",
      "badge": "New",
      "rating": 5,
      "reviews": 67,
      "price": 464.0,
      "oldPrice": null,
      "monthly": 39,
      "drawers": 4
    },
    {
      "slug": "storage-drawer-7",
      "name": "Cambridge Storage Drawer Bed",
      "image": "images/storage-drawers/img-7.png",
      "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "",
      "rating": 5,
      "reviews": 76,
      "price": 491.0,
      "oldPrice": 541.0,
      "monthly": 41,
      "drawers": 2
    },
    {
      "slug": "storage-drawer-8",
      "name": "Victoria Storage Drawer Bed",
      "image": "images/storage-drawers/img-8.png",
      "shortInfo": "4 spacious drawers built into a tailored, handmade frame.",
      "badge": "Best Seller",
      "rating": 5,
      "reviews": 85,
      "price": 518.0,
      "oldPrice": null,
      "monthly": 43,
      "drawers": 4
    },
    {
      "slug": "storage-drawer-9",
      "name": "Oxford Storage Drawer Bed",
      "image": "images/storage-drawers/img-9.png",
      "shortInfo": "2 spacious drawers built into a tailored, handmade frame.",
      "badge": "",
      "rating": 4,
      "reviews": 94,
      "price": 545.0,
      "oldPrice": null,
      "monthly": 45,
      "drawers": 2
    }
  ];

  var SD_PRODUCTS = {};
  SD_PRODUCTS_LIST.forEach(function (p) {
    SD_PRODUCTS[p.slug] = p;
  });

  var SD_FABRIC_CATALOG = [
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
    selectedFabric: null
  };

  function initDetail() {
    var categoryView = document.getElementById("sdCategoryView");
    var detailView = document.getElementById("sdDetailView");
    var notFoundView = document.getElementById("sdNotFoundView");
    if (!categoryView || !detailView || !notFoundView) return;

    var breadcrumbName = document.getElementById("sdDetailBreadcrumbName");
    var mainImage = document.getElementById("sdGalleryMainImage");
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
      // Only one image exists per product in this project — the
      // gallery still supports multiple images (via a "gallery"
      // array) if photos are added later, but falls back cleanly
      // to the single image with prev/next and thumbs hidden.
      var images = product.gallery && product.gallery.length ? product.gallery : [product.image];
      mainImage.src = images[sdState.imageIndex] || images[0];
      mainImage.alt = product.name;

      thumbsWrap.innerHTML = "";
      if (images.length > 1) {
        images.forEach(function (src, index) {
          var img = document.createElement("img");
          img.src = src;
          img.alt = "";
          img.loading = "lazy";
          if (index === sdState.imageIndex) img.classList.add("is-active");
          img.addEventListener("click", function () {
            sdState.imageIndex = index;
            renderGallery(product);
          });
          thumbsWrap.appendChild(img);
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
              '<span class="product-card__stars" aria-hidden="true">' + stars(p.rating) + "</span>" +
              '<span class="product-card__review-count">(' + p.reviews + ")</span>" +
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

    function renderFabrics() {
      if (!fabricsEl) return;
      fabricsEl.innerHTML = "";

      SD_FABRIC_CATALOG.forEach(function (fabric, index) {
        var isSelected = sdState.selectedFabric === fabric.name;
        if (sdState.selectedFabric === null && index === 0) {
          sdState.selectedFabric = fabric.name;
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
            '<img src="' + swatchImagePath + '" alt="' + fabric.name + ' fabric option" class="fabric-swatch__image" loading="lazy" width="56" height="56" />' +
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

        fabricsEl.appendChild(btn);
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
      starsEl.textContent = stars(product.rating);
      reviewCountEl.textContent = "(" + product.reviews + ")";
      priceEl.textContent = money(product.price);
      prevPriceEl.textContent = product.oldPrice ? money(product.oldPrice) : "";
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

      if (deliveryEl) deliveryEl.textContent = "Handmade to order, delivered boxed for home assembly";
      if (warrantyEl) warrantyEl.textContent = "24-month warranty";
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
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
        sdState.imageIndex = (sdState.imageIndex - 1 + images.length) % images.length;
        renderGallery(currentProduct);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        var images = currentProduct.gallery && currentProduct.gallery.length ? currentProduct.gallery : [currentProduct.image];
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

    if (addBtn) {
      addBtn.addEventListener("click", function () {
        if (!currentProduct) return;

        if (window.RabboraCart && typeof window.RabboraCart.add === "function") {
          window.RabboraCart.add(
            {
              id: "storage-drawer-" + currentProduct.slug,
              slug: currentProduct.slug,
              name: currentProduct.name,
              url: "storage-drawers.html#/" + currentProduct.slug,
              image: currentProduct.image || "",
              alt: currentProduct.name,
              price: currentProduct.price,
              category: "Storage Beds With Drawers"
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
            money(currentProduct.price * sdState.quantity) + ".";
        }
      });
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
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
  }

  document.addEventListener("DOMContentLoaded", function () {
    initDetail();
  });
})();