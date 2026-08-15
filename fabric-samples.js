/* =========================================================
   FREE FABRIC SAMPLES — PAGE SCRIPT
   Vanilla JavaScript only. No frameworks, no dependencies.
   Handles fabric selection, form validation and the review
   carousel for this page only. Shared header behaviour
   (mobile menu, dropdown, header search) lives in js/script.js
   and is loaded separately on this page.
   ========================================================= */

(function () {
  "use strict";

  var MAX_SAMPLES = 4;

  /* =========================================================
     FABRIC DATA
     ---------------------------------------------------------
     Demo swatch images for layout purposes. Replace with real
     product photography before launch.
     ========================================================= */
  var FABRICS = [
       { id: "Plush Mahroon", name: "Plush grey", image: "images/img-46.jfif" },
     { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
      { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
       { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
        { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
         { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
          { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
           { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
            { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
             { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
              { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
               { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
                { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },
                 { id: "naples-silver", name: "Naples Silver", image: "images/img-34.png" },

   
  ];

  var selectedFabrics = new Set();

  /* =========================================================
     FABRIC GRID
     ========================================================= */
  function createFabricCard(fabric) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "fabric-card";
    card.dataset.fabricId = fabric.id;
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", "Select " + fabric.name + " sample");

    card.innerHTML =
      '<span class="fabric-card__image">' +
        '<img src="' + fabric.image + '" alt="' + fabric.name + ' fabric swatch" loading="lazy" width="300" height="300" />' +
        '<span class="fabric-card__check" aria-hidden="true">' +
          '<svg width="13" height="13" viewBox="0 0 16 16"><path d="M2.5 8.5l3.2 3.2L13.5 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        "</span>" +
      "</span>" +
      '<span class="fabric-card__name">' + fabric.name + "</span>";

    return card;
  }

  function renderFabricGrid() {
    var grid = document.getElementById("fabricGrid");
    if (!grid) return;

    var fragment = document.createDocumentFragment();
    FABRICS.forEach(function (fabric) {
      fragment.appendChild(createFabricCard(fabric));
    });
    grid.appendChild(fragment);
  }

  function updateCounter() {
    var counterEl = document.getElementById("fabricCounter");
    if (counterEl) {
      counterEl.textContent = "Selected: " + selectedFabrics.size + " / " + MAX_SAMPLES;
    }
  }

  function showLimitMessage(show) {
    var msgEl = document.getElementById("fabricLimitMessage");
    if (!msgEl) return;
    msgEl.hidden = !show;
  }

  function updateDisabledState() {
    var atLimit = selectedFabrics.size >= MAX_SAMPLES;
    var cards = document.querySelectorAll(".fabric-card");
    cards.forEach(function (card) {
      var isSelected = card.classList.contains("is-selected");
      var shouldDisable = atLimit && !isSelected;
      card.classList.toggle("is-disabled", shouldDisable);
    });
  }

  function toggleFabricSelection(card) {
    var id = card.dataset.fabricId;
    var isSelected = card.classList.contains("is-selected");

    if (isSelected) {
      selectedFabrics.delete(id);
      card.classList.remove("is-selected");
      card.setAttribute("aria-pressed", "false");
      showLimitMessage(false);
    } else {
      if (selectedFabrics.size >= MAX_SAMPLES) {
        showLimitMessage(true);
        return;
      }
      selectedFabrics.add(id);
      card.classList.add("is-selected");
      card.setAttribute("aria-pressed", "true");
      showLimitMessage(false);
    }

    updateCounter();
    updateDisabledState();
    clearFabricSelectionError();
  }

  function initFabricGrid() {
    renderFabricGrid();
    updateCounter();

    var grid = document.getElementById("fabricGrid");
    if (!grid) return;

    grid.addEventListener("click", function (event) {
      var card = event.target.closest(".fabric-card");
      if (!card) return;
      toggleFabricSelection(card);
    });
  }

  /* =========================================================
     FORM VALIDATION
     ---------------------------------------------------------
     Frontend-only demo validation and submission. No data is
     sent to a server — replace the success branch with a real
     fetch()/API call once a backend is connected.
     ========================================================= */
  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var REQUIRED_FIELDS = [
    { id: "field-name", errorId: "error-name", label: "Name" },
    { id: "field-address1", errorId: "error-address1", label: "Address Line 1" },
    { id: "field-city", errorId: "error-city", label: "City / Town" },
    { id: "field-postcode", errorId: "error-postcode", label: "Postcode" },
    { id: "field-email", errorId: "error-email", label: "Email" }
  ];

  function setFieldError(fieldId, errorId, message) {
    var field = document.getElementById(fieldId);
    var errorEl = document.getElementById(errorId);
    if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
    if (errorEl) errorEl.textContent = message || "";
  }

  function clearFabricSelectionError() {
    var el = document.getElementById("fabricSelectionError");
    if (el) el.hidden = true;
  }

  function validateForm() {
    var isValid = true;
    var firstInvalidField = null;

    REQUIRED_FIELDS.forEach(function (fieldInfo) {
      var field = document.getElementById(fieldInfo.id);
      var value = field ? field.value.trim() : "";

      if (!value) {
        setFieldError(fieldInfo.id, fieldInfo.errorId, fieldInfo.label + " is required.");
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field;
        return;
      }

      if (fieldInfo.id === "field-email" && !EMAIL_PATTERN.test(value)) {
        setFieldError(fieldInfo.id, fieldInfo.errorId, "Enter a valid email address.");
        isValid = false;
        if (!firstInvalidField) firstInvalidField = field;
        return;
      }

      setFieldError(fieldInfo.id, fieldInfo.errorId, "");
    });

    var selectionError = document.getElementById("fabricSelectionError");
    if (selectedFabrics.size === 0) {
      if (selectionError) selectionError.hidden = false;
      isValid = false;
      if (!firstInvalidField) {
        firstInvalidField = document.getElementById("fabricGrid");
      }
    } else if (selectionError) {
      selectionError.hidden = true;
    }

    return { isValid: isValid, firstInvalidField: firstInvalidField };
  }

  function initFabricForm() {
    var form = document.getElementById("fabricSampleForm");
    var successEl = document.getElementById("fabricFormSuccess");
    var submitBtn = document.getElementById("fabricSubmitBtn");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (successEl) successEl.hidden = true;

      var result = validateForm();

      if (!result.isValid) {
        if (result.firstInvalidField && typeof result.firstInvalidField.focus === "function") {
          result.firstInvalidField.focus();
        } else if (result.firstInvalidField && typeof result.firstInvalidField.scrollIntoView === "function") {
          result.firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // Demo-only submission: no data is actually sent anywhere.
      // Replace this block with a real API call once a backend exists.
      if (submitBtn) submitBtn.disabled = true;

      if (successEl) {
        successEl.hidden = false;
        successEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      form.reset();
      selectedFabrics.clear();
      document.querySelectorAll(".fabric-card").forEach(function (card) {
        card.classList.remove("is-selected", "is-disabled");
        card.setAttribute("aria-pressed", "false");
      });
      updateCounter();
      showLimitMessage(false);

      if (submitBtn) submitBtn.disabled = false;
    });

    // Clear a field's error as soon as the person starts fixing it.
    REQUIRED_FIELDS.forEach(function (fieldInfo) {
      var field = document.getElementById(fieldInfo.id);
      if (!field) return;
      field.addEventListener("input", function () {
        if (field.getAttribute("aria-invalid") === "true" && field.value.trim()) {
          setFieldError(fieldInfo.id, fieldInfo.errorId, "");
        }
      });
    });
  }

  /* =========================================================
     REVIEW CAROUSEL
     ---------------------------------------------------------
     DEMO REVIEW DATA — placeholder reviews for layout purposes
     only. These are NOT real customer reviews. Replace with
     verified reviews from a backend before launch.
     ========================================================= */
  var REVIEWS = [
    {
      title: "Fantastic communication and fast installation.",
      text: "The samples arrived within two days and the fabric felt exactly as described. Made choosing so much easier.",
      name: "H. Osei",
      time: "2 weeks ago"
    },
    {
      title: "Really helped us decide",
      text: "We were torn between two greys and the swatches settled it immediately. Lovely quality fabric too.",
      name: "R. Fenwick",
      time: "1 month ago"
    },
    {
      title: "Samples arrived quickly",
      text: "Ordered on a Monday and had them by Wednesday. Great way to check the colour against our curtains first.",
      name: "T. Nakamura",
      time: "3 weeks ago"
    },
    {
      title: "Exactly as described",
      text: "The crushed velvet sample was even nicer in person. Straightforward process from start to finish.",
      name: "L. Bianchi",
      time: "6 days ago"
    }
  ];

  var currentReviewIndex = 0;

  function renderStars() {
    return (
      '<span class="review-slide__stars" aria-hidden="true">\u2605\u2605\u2605\u2605\u2605</span>'
    );
  }

  function renderReviewSlide(index) {
    var review = REVIEWS[index];
    var track = document.getElementById("reviewCarouselTrack");
    if (!track || !review) return;

    track.innerHTML =
      '<div class="review-slide">' +
        renderStars() +
        '<h3 class="review-slide__title">' + review.title + "</h3>" +
        '<p class="review-slide__text">' + review.text + "</p>" +
        '<p class="review-slide__meta">' + review.name + " \u2014 " + review.time + "</p>" +
      "</div>";
  }

  function renderDots() {
    var dotsContainer = document.getElementById("reviewDots");
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    REVIEWS.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "review-carousel__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Show review " + (index + 1));
      dot.setAttribute("aria-selected", index === currentReviewIndex ? "true" : "false");
      if (index === currentReviewIndex) dot.classList.add("is-active");

      dot.addEventListener("click", function () {
        currentReviewIndex = index;
        updateCarousel();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    renderReviewSlide(currentReviewIndex);
    renderDots();
  }

  function initReviewCarousel() {
    var track = document.getElementById("reviewCarouselTrack");
    if (!track) return;

    updateCarousel();

    var prevBtn = document.getElementById("reviewPrevBtn");
    var nextBtn = document.getElementById("reviewNextBtn");

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        currentReviewIndex = (currentReviewIndex - 1 + REVIEWS.length) % REVIEWS.length;
        updateCarousel();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        currentReviewIndex = (currentReviewIndex + 1) % REVIEWS.length;
        updateCarousel();
      });
    }
  }

  /* =========================================================
     INIT
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    initFabricGrid();
    initFabricForm();
    initReviewCarousel();
  });
})();