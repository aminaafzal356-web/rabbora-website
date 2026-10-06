/*!
 * Rabbora Living — product reviews (product detail views)
 * ---------------------------------------------------------------
 * Loaded on the 8 category pages after the page's own script. When a
 * product is open ("page.html#/<slug>"), this file:
 *   - shows the published reviews, the average rating and the count
 *     (also in the page's existing stars / "No reviews yet" spot);
 *   - lets a logged-in customer write a review, and edit or delete
 *     their own review.
 *
 * Backend (backend/routes/reviews.js):
 *   GET    /api/reviews?product=<slug>&page=N   published reviews + average + total
 *   POST   /api/reviews        { productId, rating, title, body }  -> published at once
 *   PATCH  /api/reviews/:id    { rating, title, body }  (own review)
 *   DELETE /api/reviews/:id    (own review)
 * A new review is published straight away (no admin approval) and the
 * list, average and count are reloaded right after it is saved. An
 * admin can hide a review from the admin panel; hidden reviews are
 * never shown publicly.
 *
 * The backend has no "my reviews" endpoint, so the id of a review
 * written in this browser is remembered (localStorage
 * "rabboraMyReviews", review id + text only) to allow editing or
 * deleting it. It is cleared on logout.
 *
 * Needs api-config.js and customer.js loaded first.
 */
(function () {
  "use strict";

  var C = window.RabboraCustomer;
  if (!C) {
    console.error("[Rabbora Reviews] customer.js is not loaded on this page — add it before reviews.js.");
    return;
  }

  var MY_REVIEWS_KEY = "rabboraMyReviews";
  var PAGE_SIZE = 10;

  // The page's existing rating spot in the product detail view.
  var starsEl = document.querySelector('[id$="DetailStars"], #sfModalStars');
  if (!starsEl) return;
  var countEl = document.getElementById(starsEl.id.replace(/Stars$/, "ReviewCount"));
  var infoEl = starsEl.closest('[class*="__info"]') || starsEl.parentElement;
  var layoutEl = infoEl && infoEl.parentElement;
  if (!layoutEl || !layoutEl.parentElement) return;

  // ---------------------------------------------------------------
  // Remembered own reviews (no private data: review id, text, rating)
  // ---------------------------------------------------------------

  function readMine() {
    try {
      var raw = window.localStorage.getItem(MY_REVIEWS_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (err) {
      return {};
    }
  }

  function writeMine(map) {
    try {
      if (Object.keys(map).length) window.localStorage.setItem(MY_REVIEWS_KEY, JSON.stringify(map));
      else window.localStorage.removeItem(MY_REVIEWS_KEY);
    } catch (err) {
      // Storage disabled: the review can still be written, just not edited later here.
    }
  }

  function rememberReview(review) {
    var map = readMine();
    map[review.productId] = {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      title: review.title,
      body: review.body,
      isApproved: review.isApproved,
      createdAt: review.createdAt
    };
    writeMine(map);
  }

  function forgetReview(productId) {
    var map = readMine();
    delete map[productId];
    writeMine(map);
  }

  // Logged out (possibly in another tab): never show the previous account's review.
  if (!C.isLoggedInHere()) writeMine({});

  // ---------------------------------------------------------------
  // Panel (added once, below the product's main details)
  // ---------------------------------------------------------------

  var panel = document.createElement("div");
  panel.className = "container rb-reviews";
  panel.id = "rbReviews";
  panel.hidden = true;
  panel.setAttribute("aria-labelledby", "rbReviewsHeading");
  panel.innerHTML =
    '<div class="rb-reviews__head">' +
      '<div>' +
        '<p class="eyebrow">Reviews</p>' +
        '<h2 class="rb-reviews__heading" id="rbReviewsHeading">Customer Reviews</h2>' +
      "</div>" +
      '<p class="rb-reviews__summary" id="rbReviewsSummary"></p>' +
    "</div>" +
    '<div class="rb-reviews__list" id="rbReviewsList"></div>' +
    '<button type="button" class="rb-link-btn rb-reviews__more" id="rbReviewsMore" hidden>Show more reviews</button>' +
    '<div class="rb-reviews__mine" id="rbReviewsMine" hidden></div>' +
    '<div class="rb-reviews__write" id="rbReviewsWrite">' +
      '<button type="button" class="btn btn--outline-forest" id="rbReviewsWriteBtn" hidden>Write a review</button>' +
      '<p class="rb-reviews__login" id="rbReviewsLogin" hidden>Please <a href="account.html">log in</a> to write a review.</p>' +
      '<form class="rb-review-form" id="rbReviewForm" novalidate hidden>' +
        '<h3 class="rb-review-form__heading" id="rbReviewFormHeading">Write a review</h3>' +
        '<div class="rb-field" data-field="rating">' +
          '<p class="rb-field__label" id="rbReviewRatingLabel">Your rating</p>' +
          '<div class="rb-stars-input" role="radiogroup" aria-labelledby="rbReviewRatingLabel">' +
            [5, 4, 3, 2, 1].map(function (n) {
              return '<input type="radio" id="rbReviewRating' + n + '" name="rating" value="' + n + '" />' +
                '<label for="rbReviewRating' + n + '" title="' + n + " star" + (n === 1 ? "" : "s") + '">★<span class="sr-only">' + n + " star" + (n === 1 ? "" : "s") + "</span></label>";
            }).join("") +
          "</div>" +
          '<p class="rb-field__error" role="alert" hidden></p>' +
        "</div>" +
        '<div class="rb-field" data-field="title">' +
          '<label class="rb-field__label" for="rbReviewTitle">Title (optional)</label>' +
          '<input class="rb-input" id="rbReviewTitle" name="title" type="text" maxlength="150" aria-invalid="false" />' +
          '<p class="rb-field__error" role="alert" hidden></p>' +
        "</div>" +
        '<div class="rb-field" data-field="body">' +
          '<label class="rb-field__label" for="rbReviewBody">Your review</label>' +
          '<textarea class="rb-input rb-textarea" id="rbReviewBody" name="body" rows="4" minlength="10" maxlength="2000" required aria-required="true" aria-invalid="false"></textarea>' +
          '<p class="rb-field__hint">At least 10 characters.</p>' +
          '<p class="rb-field__error" role="alert" hidden></p>' +
        "</div>" +
        '<div class="rb-review-form__actions">' +
          '<button type="submit" class="btn btn--forest" id="rbReviewSubmit">Submit review</button>' +
          '<button type="button" class="btn btn--outline-forest" id="rbReviewCancel">Cancel</button>' +
        "</div>" +
      "</form>" +
    "</div>" +
    '<p class="rb-reviews__message" id="rbReviewsMessage" role="status" aria-live="polite" hidden></p>';
  layoutEl.parentElement.insertBefore(panel, layoutEl.nextSibling);

  var els = {
    summary: document.getElementById("rbReviewsSummary"),
    list: document.getElementById("rbReviewsList"),
    more: document.getElementById("rbReviewsMore"),
    mine: document.getElementById("rbReviewsMine"),
    writeBtn: document.getElementById("rbReviewsWriteBtn"),
    login: document.getElementById("rbReviewsLogin"),
    form: document.getElementById("rbReviewForm"),
    formHeading: document.getElementById("rbReviewFormHeading"),
    submit: document.getElementById("rbReviewSubmit"),
    cancel: document.getElementById("rbReviewCancel"),
    message: document.getElementById("rbReviewsMessage")
  };

  var state = {
    slug: null,
    productId: null,
    reviews: [],
    total: 0,
    average: null,
    page: 1,
    myReview: null,     // own review for this product (verified for this account)
    editing: false,
    requestId: 0,
    currentUserId: null // from GET /api/users/me, only when needed
  };

  // ---------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------

  function starsText(rating) {
    var n = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }

  function setMessage(text, isError) {
    els.message.textContent = text || "";
    els.message.hidden = !text;
    els.message.classList.toggle("is-error", !!isError);
  }

  function currentSlug() {
    var slug = (window.location.hash || "").replace(/^#\/?/, "").split(/[?&#]/)[0];
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : null;
  }

  function reviewHtml(review, isMine) {
    return (
      '<article class="rb-review' + (isMine ? " is-mine" : "") + '">' +
        '<div class="rb-review__top">' +
          '<span class="rb-review__stars" aria-label="' + review.rating + ' out of 5 stars">' + starsText(review.rating) + "</span>" +
          '<span class="rb-review__author">' + C.escapeHtml(review.author || "Rabbora customer") + "</span>" +
          '<span class="rb-review__date">' + C.escapeHtml(C.formatDate(review.createdAt)) + "</span>" +
        "</div>" +
        (review.title ? '<h3 class="rb-review__title">' + C.escapeHtml(review.title) + "</h3>" : "") +
        '<p class="rb-review__body">' + C.escapeHtml(review.body) + "</p>" +
      "</article>"
    );
  }

  // ---------------------------------------------------------------
  // The page's own rating spot
  // ---------------------------------------------------------------

  var lastCountText = null;

  function applyRatingToPage() {
    if (!state.productId || !state.total) {
      if (lastCountText !== null) {
        // The last approved review was just removed: back to the page's own text.
        starsEl.textContent = "";
        if (countEl) countEl.textContent = "No reviews yet";
      }
      lastCountText = null;
      return; // keep the page's own "No reviews yet"
    }
    var text = state.average + " (" + state.total + " review" + (state.total === 1 ? "" : "s") + ")";
    lastCountText = text;
    starsEl.textContent = starsText(state.average);
    if (countEl) countEl.textContent = text;
  }

  // The page rewrites "No reviews yet" whenever it opens a product; put
  // the real figures back if they belong to the product still shown.
  if (countEl && typeof MutationObserver === "function") {
    new MutationObserver(function () {
      if (lastCountText && countEl.textContent !== lastCountText && state.slug === currentSlug()) {
        applyRatingToPage();
      }
    }).observe(countEl, { childList: true, characterData: true, subtree: true });
  }

  // ---------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------

  function renderList() {
    if (!state.total) {
      els.summary.textContent = "";
      els.list.innerHTML = '<p class="rb-reviews__empty">No reviews yet. Be the first to review this product.</p>';
      els.more.hidden = true;
      return;
    }
    els.summary.innerHTML =
      '<span class="rb-reviews__summary-stars" aria-hidden="true">' + starsText(state.average) + "</span> " +
      "<strong>" + C.escapeHtml(state.average) + "</strong> out of 5 &middot; " +
      state.total + " review" + (state.total === 1 ? "" : "s");
    var myId = state.myReview ? state.myReview.id : null;
    els.list.innerHTML = state.reviews.map(function (r) { return reviewHtml(r, r.id === myId); }).join("");
    els.more.hidden = state.reviews.length >= state.total;
  }

  function renderMine() {
    var mine = state.myReview;
    if (!mine) {
      els.mine.hidden = true;
      els.mine.innerHTML = "";
      return;
    }
    // On the loaded page, or (when not every review is loaded yet) still
    // marked as shown by the server.
    var published = state.reviews.some(function (r) { return r.id === mine.id; }) ||
      (mine.isApproved !== false && state.reviews.length < state.total);
    els.mine.innerHTML =
      '<div class="rb-reviews__mine-head">' +
        '<h3 class="rb-reviews__mine-heading">Your review</h3>' +
        '<span class="rb-badge ' + (published ? "rb-badge--delivered" : "rb-badge--pending") + '">' +
          (published ? "Published" : "Hidden") +
        "</span>" +
      "</div>" +
      (published ? "" : '<p class="rb-reviews__mine-note">Our team has hidden this review from the shop. Only you can see it.</p>') +
      reviewHtml({ rating: mine.rating, title: mine.title, body: mine.body, author: "You", createdAt: mine.createdAt }, true) +
      '<div class="rb-reviews__mine-actions">' +
        '<button type="button" class="rb-link-btn" id="rbReviewEdit">Edit review</button>' +
        '<button type="button" class="rb-link-btn rb-link-btn--danger" id="rbReviewDelete">Delete review</button>' +
      "</div>";
    els.mine.hidden = false;
  }

  function renderWriteArea() {
    var loggedIn = C.isLoggedInHere();
    els.login.hidden = loggedIn;
    els.writeBtn.hidden = !loggedIn || !!state.myReview || !els.form.hidden;
    if (!loggedIn) els.form.hidden = true;
  }

  function renderAll() {
    renderList();
    renderMine();
    renderWriteArea();
    applyRatingToPage();
  }

  // ---------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------

  function fetchReviews(slug, page) {
    return C.request("/reviews?product=" + encodeURIComponent(slug) + "&page=" + page + "&limit=" + PAGE_SIZE);
  }

  function currentUserId() {
    if (state.currentUserId) return Promise.resolve(state.currentUserId);
    return C.request("/users/me").then(function (result) {
      if (result.ok && result.data && result.data.user) {
        state.currentUserId = result.data.user.id;
        return state.currentUserId;
      }
      return null;
    });
  }

  // The own review remembered for this product, only if it belongs to
  // the account that is logged in now.
  function loadMine(productId) {
    var stored = readMine()[productId];
    if (!stored || !C.isLoggedInHere()) return Promise.resolve(null);
    return currentUserId().then(function (userId) {
      return userId && stored.userId === userId ? stored : null;
    });
  }

  function load() {
    var slug = currentSlug();
    state.requestId += 1;
    var requestId = state.requestId;
    closeForm();
    setMessage("");
    if (!slug) {
      state.slug = null;
      state.productId = null;
      panel.hidden = true;
      return;
    }
    state.slug = slug;
    state.productId = null;
    state.myReview = null;

    fetchReviews(slug, 1).then(function (result) {
      if (requestId !== state.requestId) return;
      if (result.status === 404) {
        // Not in the backend catalogue yet: keep the page as it was.
        panel.hidden = true;
        return;
      }
      if (!result.ok || !result.data) {
        panel.hidden = false;
        els.summary.textContent = "";
        els.list.innerHTML = "";
        els.more.hidden = true;
        els.mine.hidden = true;
        els.writeBtn.hidden = true;
        els.login.hidden = true;
        setMessage(C.errorMessage(result, "Reviews can't be loaded right now."), true);
        return;
      }
      var data = result.data;
      state.productId = data.productId;
      state.reviews = data.reviews || [];
      state.total = data.total || 0;
      state.average = data.average;
      state.page = 1;
      panel.hidden = false;
      return loadMine(state.productId).then(function (mine) {
        if (requestId !== state.requestId) return;
        state.myReview = mine;
        renderAll();
      });
    });
  }

  function loadMore() {
    var slug = state.slug;
    var next = state.page + 1;
    els.more.disabled = true;
    fetchReviews(slug, next).then(function (result) {
      els.more.disabled = false;
      if (slug !== state.slug) return;
      if (result.ok && result.data) {
        state.page = next;
        state.reviews = state.reviews.concat(result.data.reviews || []);
        renderList();
        renderMine();
        return;
      }
      setMessage(C.errorMessage(result, "More reviews can't be loaded right now."), true);
    });
  }

  // ---------------------------------------------------------------
  // Write / edit / delete
  // ---------------------------------------------------------------

  function openForm(review) {
    state.editing = !!review;
    els.form.reset();
    els.formHeading.textContent = review ? "Edit your review" : "Write a review";
    els.submit.textContent = review ? "Save changes" : "Submit review";
    if (review) {
      var radio = els.form.querySelector('input[name="rating"][value="' + review.rating + '"]');
      if (radio) radio.checked = true;
      els.form.elements.title.value = review.title || "";
      els.form.elements.body.value = review.body || "";
    }
    C.showFieldErrors(els.form, {});
    els.form.hidden = false;
    els.writeBtn.hidden = true;
    var first = els.form.querySelector('input[name="rating"]:checked') || els.form.querySelector('input[name="rating"]');
    if (first) first.focus();
  }

  function closeForm() {
    els.form.hidden = true;
    state.editing = false;
    renderWriteArea();
  }

  function readForm() {
    var checked = els.form.querySelector('input[name="rating"]:checked');
    return {
      rating: checked ? Number(checked.value) : null,
      title: els.form.elements.title.value.trim(),
      body: els.form.elements.body.value.trim()
    };
  }

  function validate(data) {
    var errors = {};
    if (!data.rating) errors.rating = "Please choose a star rating.";
    if (data.title.length > 150) errors.title = "Please keep the title under 150 characters.";
    if (data.body.length < 10) errors.body = "Please write at least 10 characters.";
    else if (data.body.length > 2000) errors.body = "Please keep your review under 2,000 characters.";
    return errors;
  }

  function sessionEnded(result) {
    if (result.status !== 401) return false;
    writeMine({});
    state.myReview = null;
    closeForm();
    renderAll();
    setMessage(C.errorMessage(result), true);
    return true;
  }

  function submitForm(event) {
    event.preventDefault();
    var data = readForm();
    if (!C.showFieldErrors(els.form, validate(data))) return;
    var editing = state.editing && state.myReview;
    var body = { rating: data.rating, title: data.title || null, body: data.body };
    var call = editing
      ? C.request("/reviews/" + encodeURIComponent(state.myReview.id), { method: "PATCH", body: body })
      : C.request("/reviews", { method: "POST", body: { productId: state.productId, rating: body.rating, title: body.title, body: body.body } });

    els.submit.disabled = true;
    setMessage(editing ? "Saving your changes…" : "Sending your review…");
    call.then(function (result) {
      els.submit.disabled = false;
      if (result.ok && result.data && result.data.review) {
        rememberReview(result.data.review);
        state.myReview = readMine()[result.data.review.productId] || null;
        closeForm();
        setMessage(editing
          ? "Your changes have been saved."
          : (result.data.message || "Thank you! Your review has been published."));
        // Reload so the review, the average and the count show at once.
        return reloadKeepMessage();
      }
      if (sessionEnded(result)) return;
      if (editing && result.status === 404) {
        forgetReview(state.productId);
        state.myReview = null;
        closeForm();
        renderAll();
        setMessage("This review no longer exists.", true);
        return;
      }
      C.showFieldErrors(els.form, C.fieldErrors(result));
      // e.g. 409 "You have already reviewed this product."
      setMessage(C.errorMessage(result, "We couldn't save your review."), true);
    });
  }

  // After a review is written, edited or deleted the public list changes.
  function reloadKeepMessage() {
    var text = els.message.textContent;
    var isError = els.message.classList.contains("is-error");
    return fetchReviews(state.slug, 1).then(function (result) {
      if (result.ok && result.data) {
        state.reviews = result.data.reviews || [];
        state.total = result.data.total || 0;
        state.average = result.data.average;
        state.page = 1;
      }
      renderAll();
      setMessage(text, isError);
    });
  }

  function deleteMine() {
    if (!state.myReview || !window.confirm("Delete your review?")) return;
    var id = state.myReview.id;
    C.request("/reviews/" + encodeURIComponent(id), { method: "DELETE" }).then(function (result) {
      if (result.ok || result.status === 404) {
        forgetReview(state.productId);
        state.myReview = null;
        setMessage("Your review has been deleted.");
        return reloadKeepMessage();
      }
      if (sessionEnded(result)) return;
      setMessage(C.errorMessage(result, "We couldn't delete your review."), true);
    });
  }

  // ---------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------

  els.writeBtn.addEventListener("click", function () { openForm(null); });
  els.cancel.addEventListener("click", closeForm);
  els.form.addEventListener("submit", submitForm);
  els.more.addEventListener("click", loadMore);
  els.mine.addEventListener("click", function (event) {
    if (event.target.closest("#rbReviewEdit")) openForm(state.myReview);
    else if (event.target.closest("#rbReviewDelete")) deleteMine();
  });

  // Runs after the page's own hashchange handler (this file loads last).
  window.addEventListener("hashchange", function () {
    window.setTimeout(load, 0);
  });
  load();
})();