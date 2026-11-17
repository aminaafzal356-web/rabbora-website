/*
 * Rabbora Living — admin notification bell (Admin Panel header).
 * Loaded by admin-auth.js once the admin is confirmed. It talks only to
 * /api/admin/notifications* and /api/admin/notification-preferences.
 *
 * - Polls every 8 seconds (backs off to 60 seconds after errors, pauses
 *   while the tab is hidden, and resumes at once when it is shown again).
 * - The last alerted id is kept in localStorage, so two open tabs do not
 *   both play the sound or show the same desktop notification.
 * - Sound plays only for new items, once per batch, and never on page load.
 *   The browser needs one click on the page before it allows sound.
 * - Desktop notifications need permission, asked only when the admin turns
 *   the setting on, and are shown only while the admin is on another tab
 *   or window.
 * - Opening a notification marks it read for this admin and goes to its page.
 *   Pages with a [data-open] button open that record when given ?open=<id>.
 * Notification text is inserted with textContent only, never as HTML.
 */
(function (window, document) {
  "use strict";

  var A = window.RabboraAdmin;
  if (!A || !document.querySelector(".admin-topbar")) return;

  var base = (window.RabboraAdminAssets && window.RabboraAdminAssets.base) || "";
  var SOUND_URL = base + "assets/sounds/rabbora-professional-ding.wav";
  var SEEN_KEY = "rabbora-admin-notify-seen";
  var POLL_MS = 8000;
  var POLL_MAX_MS = 60000;
  var LIST_SIZE = 20;
  var MIN_SOUND_GAP_MS = 1500;
  var MAX_DESKTOP_PER_BATCH = 3;
  var OPEN_WAIT_MS = 15000;

  var state = {
    prefs: { soundEnabled: true, desktopEnabled: false },
    items: [],
    hasMore: false,
    nextBeforeId: null,
    unread: 0,
    pollDelay: POLL_MS,
    pollTimer: null,
    paused: false,
    stopped: false,
    lastSoundAt: 0,
    audio: null,
    audioBroken: false,
    audioUnlocked: false
  };

  var els = {};

  // ------------------------------------------------------------
  // Storage: the last id this browser has alerted on. Falls back to memory
  // when localStorage is blocked, so the page still works.
  // ------------------------------------------------------------

  var memorySeen = null;

  function readSeen() {
    try {
      var v = window.localStorage.getItem(SEEN_KEY);
      if (v !== null) return Number(v) || 0;
    } catch (err) { /* storage blocked */ }
    return memorySeen;
  }

  function writeSeen(id) {
    var current = readSeen();
    if (current !== null && id <= current) return;
    memorySeen = id;
    try { window.localStorage.setItem(SEEN_KEY, String(id)); } catch (err) { /* storage blocked */ }
  }

  // ------------------------------------------------------------
  // Sound
  // ------------------------------------------------------------

  function getAudio() {
    if (!state.audio) {
      var audio = new Audio(SOUND_URL);
      audio.preload = "auto";
      audio.addEventListener("error", function () {
        state.audioBroken = true;
        setSoundStatus("Sound file not found. The file admin/assets/sounds/rabbora-professional-ding.wav is missing from the site.", true);
      });
      state.audio = audio;
    }
    return state.audio;
  }

  // Plays the alert sound. Returns a promise of true when it started.
  function playSound(force) {
    if (state.audioBroken) return Promise.resolve(false);
    var now = Date.now();
    if (!force && now - state.lastSoundAt < MIN_SOUND_GAP_MS) return Promise.resolve(false);
    state.lastSoundAt = now;
    var audio = getAudio();
    try { audio.currentTime = 0; } catch (err) { /* not ready yet */ }
    var started;
    try {
      started = audio.play();
    } catch (err) {
      return Promise.resolve(false);
    }
    if (!started || typeof started.then !== "function") return Promise.resolve(true);
    return started.then(function () { return true; }, function (err) {
      if (err && err.name === "NotAllowedError") {
        setSoundStatus("Your browser blocks sound until you click on this page once.", true);
      }
      return false;
    });
  }

  // The first click or key press on the page lets the browser play sound later.
  // The clip is played silently and stopped at once, so nothing is heard.
  function unlockAudio() {
    if (state.audioUnlocked || state.audioBroken) return;
    state.audioUnlocked = true;
    var audio = getAudio();
    audio.volume = 0;
    var started;
    try { started = audio.play(); } catch (err) { started = null; }
    if (!started || typeof started.then !== "function") {
      audio.volume = 1;
      return;
    }
    started.then(function () {
      audio.pause();
      try { audio.currentTime = 0; } catch (err) { /* ignore */ }
      audio.volume = 1;
    }, function () {
      audio.volume = 1;
      state.audioUnlocked = false;
    });
  }

  function testSound() {
    state.audioBroken = false;
    state.audio = null;
    setSoundStatus("Playing…");
    playSound(true).then(function (ok) {
      if (ok) {
        setSoundStatus("Sound played.");
      } else if (!state.audioBroken) {
        setSoundStatus("Sound could not play. Click on this page once, then try again.", true);
      }
    });
  }

  // ------------------------------------------------------------
  // Desktop notifications
  // ------------------------------------------------------------

  function desktopSupported() {
    return "Notification" in window;
  }

  function desktopPermission() {
    return desktopSupported() ? Notification.permission : "unsupported";
  }

  function showDesktop(item) {
    if (!state.prefs.desktopEnabled || desktopPermission() !== "granted") return;
    // Only when the admin is away from this page; otherwise the bell is enough.
    if (!document.hidden && document.hasFocus()) return;
    try {
      var note = new Notification(item.title, {
        body: item.message,
        tag: "rabbora-admin-" + item.id
      });
      note.onclick = function () {
        window.focus();
        note.close();
        goTo(item);
      };
    } catch (err) {
      // Some browsers only allow notifications from a service worker. Nothing else to do.
    }
  }

  // ------------------------------------------------------------
  // Polling
  // ------------------------------------------------------------

  function schedule(ms) {
    window.clearTimeout(state.pollTimer);
    state.pollTimer = window.setTimeout(poll, ms);
  }

  function poll() {
    if (state.stopped) return;
    if (readSeen() === null) {
      // No alert id yet (the first list load failed): reload the list and
      // mark what exists as seen, so old events never sound.
      refreshList(function () { schedule(POLL_MS); });
      return;
    }
    // Keeps checking while the tab is in the background, so alerts and the
    // sound still arrive. The browser may slow timers in background tabs; that
    // only delays an alert, it does not stop it.
    var after = readSeen() || 0;
    A.request("/admin/notifications/poll?after=" + after).then(function (result) {
      if (result.status === 401 || result.status === 403) {
        // Session ended or access removed: the page guard handles the redirect.
        state.stopped = true;
        return;
      }
      if (!result.ok || !result.data) {
        state.pollDelay = Math.min(POLL_MAX_MS, state.pollDelay * 2);
        schedule(state.pollDelay);
        return;
      }
      state.pollDelay = POLL_MS;
      handleBatch(result.data);
      schedule(POLL_MS);
    });
  }

  // Loads the newest items and marks them seen (no sound).
  function refreshList(done) {
    A.request("/admin/notifications?limit=" + LIST_SIZE).then(function (list) {
      if (list.status === 401 || list.status === 403) { state.stopped = true; return; }
      if (list.ok && list.data) {
        state.items = Array.isArray(list.data.items) ? list.data.items : [];
        state.hasMore = !!list.data.hasMore;
        state.nextBeforeId = list.data.nextBeforeId;
        state.unread = list.data.unreadCount || 0;
        if (state.items.length) writeSeen(state.items[0].id);
        else writeSeen(0);
        renderList();
        updateBadge();
      }
      done();
    });
  }

  function handleBatch(data) {
    var items = Array.isArray(data.items) ? data.items : [];
    if (typeof data.unreadCount === "number") state.unread = data.unreadCount;
    if (items.length) prependItems(items);

    // Re-read the stored id: another tab may have alerted on these already.
    var seen = readSeen() || 0;
    var fresh = items.filter(function (item) { return item.id > seen; });
    if (fresh.length) {
      writeSeen(fresh[fresh.length - 1].id);
      if (state.prefs.soundEnabled) playSound(false);
      fresh.slice(-MAX_DESKTOP_PER_BATCH).forEach(showDesktop);
    }
    renderList();
    updateBadge();
  }

  function prependItems(incoming) {
    var known = {};
    state.items.forEach(function (item) { known[item.id] = true; });
    var additions = incoming.filter(function (item) { return !known[item.id]; }).reverse();
    state.items = additions.concat(state.items);
  }

  // ------------------------------------------------------------
  // Reading and marking
  // ------------------------------------------------------------

  function goTo(item) {
    // Resolved against the current admin page, so "orders.html?open=3" stays in /admin/.
    var target = new URL(item.destinationUrl, window.location.href).href;
    window.location.href = target;
  }

  function openItem(item) {
    setOpen(false);
    if (item.read) {
      goTo(item);
      return;
    }
    item.read = true;
    state.unread = Math.max(0, state.unread - 1);
    renderList();
    updateBadge();
    // Navigate after the request finishes, so the read mark is not lost.
    var go = function () { goTo(item); };
    A.request("/admin/notifications/" + item.id + "/read", { method: "POST" }).then(go, go);
  }

  function markAllRead() {
    els.markAll.disabled = true;
    A.request("/admin/notifications/read-all", { method: "POST" }).then(function (result) {
      if (!result.ok) {
        els.markAll.disabled = false;
        setStatus("Could not mark all as read. Try again.", true);
        return;
      }
      state.items.forEach(function (item) { item.read = true; });
      state.unread = result.data && typeof result.data.unreadCount === "number" ? result.data.unreadCount : 0;
      setStatus("");
      renderList();
      updateBadge();
    });
  }

  function loadOlder() {
    if (!state.hasMore || state.nextBeforeId == null) return;
    els.more.disabled = true;
    A.request("/admin/notifications?limit=" + LIST_SIZE + "&before=" + state.nextBeforeId).then(function (result) {
      els.more.disabled = false;
      if (!result.ok || !result.data) {
        setStatus("Could not load older notifications.", true);
        return;
      }
      var known = {};
      state.items.forEach(function (item) { known[item.id] = true; });
      result.data.items.forEach(function (item) {
        if (!known[item.id]) state.items.push(item);
      });
      state.hasMore = !!result.data.hasMore;
      state.nextBeforeId = result.data.nextBeforeId;
      setStatus("");
      renderList();
    });
  }

  // ------------------------------------------------------------
  // Preferences
  // ------------------------------------------------------------

  function savePrefs(next) {
    var previous = state.prefs;
    state.prefs = next;
    applyPrefs();
    return A.request("/admin/notification-preferences", { method: "PUT", body: next }).then(function (result) {
      if (!result.ok || !result.data || !result.data.preferences) {
        state.prefs = previous;
        applyPrefs();
        setDesktopStatus("Could not save this setting. Try again.", true);
        return false;
      }
      state.prefs = result.data.preferences;
      applyPrefs();
      return true;
    });
  }

  function applyPrefs() {
    els.sound.checked = !!state.prefs.soundEnabled;
    if (!desktopSupported()) {
      els.desktop.checked = false;
      els.desktop.disabled = true;
      setDesktopStatus("Not supported in this browser.");
      return;
    }
    var permission = Notification.permission;
    els.desktop.disabled = false;
    els.desktop.checked = !!state.prefs.desktopEnabled && permission === "granted";
    if (permission === "denied") {
      els.desktop.disabled = true;
      setDesktopStatus("Blocked in your browser settings. Allow notifications for this site to use them.", true);
    } else if (state.prefs.desktopEnabled && permission !== "granted") {
      setDesktopStatus("Permission is needed. Turn this on again to allow it.", true);
    } else {
      setDesktopStatus("");
    }
    if (!state.audioUnlocked) {
      setSoundStatus("Sound plays after your first click on this page.");
    }
  }

  function onSoundChange() {
    savePrefs({ soundEnabled: els.sound.checked, desktopEnabled: !!state.prefs.desktopEnabled });
  }

  function onDesktopChange() {
    if (!els.desktop.checked) {
      savePrefs({ soundEnabled: !!state.prefs.soundEnabled, desktopEnabled: false });
      return;
    }
    if (!desktopSupported()) {
      els.desktop.checked = false;
      return;
    }
    var permission = Notification.permission;
    if (permission === "denied") {
      els.desktop.checked = false;
      setDesktopStatus("Blocked in your browser settings. Allow notifications for this site to use them.", true);
      return;
    }
    var asked = permission === "granted" ? Promise.resolve(permission) : Promise.resolve(Notification.requestPermission());
    asked.then(function (answer) {
      if (answer !== "granted") {
        els.desktop.checked = false;
        setDesktopStatus("Notifications were not allowed.", true);
        return;
      }
      savePrefs({ soundEnabled: !!state.prefs.soundEnabled, desktopEnabled: true });
    });
  }

  // ------------------------------------------------------------
  // Rendering
  // ------------------------------------------------------------

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function setStatus(message, isError) {
    els.status.textContent = message || "";
    els.status.classList.toggle("is-error", !!isError);
  }

  function setSoundStatus(message, isError) {
    els.soundStatus.textContent = message || "";
    els.soundStatus.classList.toggle("is-error", !!isError);
  }

  function setDesktopStatus(message, isError) {
    els.desktopStatus.textContent = message || "";
    els.desktopStatus.classList.toggle("is-error", !!isError);
  }

  function setOpen(open) {
    els.panel.hidden = !open;
    els.bell.setAttribute("aria-expanded", String(open));
  }

  function renderList() {
    while (els.list.firstChild) els.list.removeChild(els.list.firstChild);
    els.empty.hidden = state.items.length > 0;

    state.items.forEach(function (item) {
      var li = el("li");
      var button = el("button", "notify__item" + (item.read ? "" : " is-unread"));
      button.type = "button";
      button.setAttribute("data-id", String(item.id));

      var head = el("span", "notify__item-head");
      head.appendChild(el("strong", "notify__item-title", item.title));
      var time = el("time", "notify__item-time", A.formatDate(item.createdAt));
      var iso = safeIso(item.createdAt);
      if (iso) time.setAttribute("datetime", iso);
      head.appendChild(time);

      button.appendChild(head);
      button.appendChild(el("span", "notify__item-msg", item.message));
      li.appendChild(button);
      els.list.appendChild(li);
    });

    els.more.hidden = !state.hasMore;
    els.markAll.disabled = state.unread === 0;
  }

  function safeIso(value) {
    var d = new Date(value);
    return isNaN(d.getTime()) ? "" : d.toISOString();
  }

  function updateBadge() {
    els.badge.hidden = state.unread === 0;
    els.badge.textContent = state.unread > 99 ? "99+" : String(state.unread);
    els.bell.setAttribute("aria-label", state.unread
      ? "Notifications, " + state.unread + " unread"
      : "Notifications");
  }

  // ------------------------------------------------------------
  // Building the bell
  // ------------------------------------------------------------

  function buildBell() {
    var topbar = document.querySelector(".admin-topbar");
    var wrap = el("div", "notify");

    var bell = el("button", "notify__bell");
    bell.type = "button";
    bell.setAttribute("aria-label", "Notifications");
    bell.setAttribute("aria-haspopup", "dialog");
    bell.setAttribute("aria-expanded", "false");
    bell.setAttribute("aria-controls", "notifyPanel");
    bell.innerHTML =
      '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" focusable="false">' +
      '<path d="M5 8a5 5 0 1 1 10 0c0 4 1.5 5.5 2 6H3c.5-.5 2-2 2-6zM8.5 16.5a1.5 1.5 0 0 0 3 0" ' +
      'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var badge = el("span", "notify__badge");
    badge.hidden = true;
    bell.appendChild(badge);

    var panel = el("div", "notify__panel");
    panel.id = "notifyPanel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Notifications");

    var head = el("div", "notify__head");
    head.appendChild(el("h2", null, "Notifications"));
    var markAll = el("button", "notify__link", "Mark all as read");
    markAll.type = "button";
    head.appendChild(markAll);

    var status = el("p", "notify__status");
    status.setAttribute("role", "status");

    var list = el("ul", "notify__list");
    list.setAttribute("role", "list");
    var empty = el("p", "notify__empty", "No notifications yet.");
    var more = el("button", "notify__more", "Load older notifications");
    more.type = "button";
    more.hidden = true;

    var settings = el("div", "notify__settings");
    settings.appendChild(el("h3", null, "Alerts"));

    var soundLabel = el("label", "notify__setting");
    soundLabel.appendChild(el("span", null, "Play a sound for new alerts"));
    var sound = el("input");
    sound.type = "checkbox";
    soundLabel.appendChild(sound);
    settings.appendChild(soundLabel);

    var test = el("button", "notify__test", "Test sound");
    test.type = "button";
    settings.appendChild(test);
    var soundStatus = el("p", "notify__status");
    soundStatus.setAttribute("role", "status");
    settings.appendChild(soundStatus);

    var desktopLabel = el("label", "notify__setting");
    desktopLabel.appendChild(el("span", null, "Desktop notifications"));
    var desktop = el("input");
    desktop.type = "checkbox";
    desktopLabel.appendChild(desktop);
    settings.appendChild(desktopLabel);
    var desktopStatus = el("p", "notify__status");
    desktopStatus.setAttribute("role", "status");
    settings.appendChild(desktopStatus);

    panel.appendChild(head);
    panel.appendChild(status);
    panel.appendChild(list);
    panel.appendChild(empty);
    panel.appendChild(more);
    panel.appendChild(settings);

    wrap.appendChild(bell);
    wrap.appendChild(panel);
    topbar.insertBefore(wrap, document.getElementById("adminUser") || null);

    els = {
      wrap: wrap, bell: bell, badge: badge, panel: panel, markAll: markAll, status: status,
      list: list, empty: empty, more: more, sound: sound, test: test, soundStatus: soundStatus,
      desktop: desktop, desktopStatus: desktopStatus
    };
  }

  function bindEvents() {
    els.bell.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(els.panel.hidden);
    });
    document.addEventListener("click", function (event) {
      if (!els.panel.hidden && !els.wrap.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !els.panel.hidden) {
        setOpen(false);
        els.bell.focus();
      }
    });
    els.list.addEventListener("click", function (event) {
      var button = event.target.closest(".notify__item");
      if (!button) return;
      var id = Number(button.getAttribute("data-id"));
      for (var i = 0; i < state.items.length; i++) {
        if (state.items[i].id === id) {
          openItem(state.items[i]);
          return;
        }
      }
    });
    els.markAll.addEventListener("click", markAllRead);
    els.more.addEventListener("click", loadOlder);
    els.sound.addEventListener("change", onSoundChange);
    els.desktop.addEventListener("change", onDesktopChange);
    els.test.addEventListener("click", testSound);

    // Coming back to the tab: check right away instead of waiting for the next tick.
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) {
        window.clearTimeout(state.pollTimer);
        poll();
      }
    });

    // Unlock sound on the first real interaction with the page.
    document.addEventListener("pointerdown", unlockAudio, { capture: true, passive: true });
    document.addEventListener("keydown", unlockAudio, { capture: true });
  }

  // ------------------------------------------------------------
  // ?open=<id>: open the record from a notification
  // ------------------------------------------------------------

  function handleOpenParam() {
    // Captured by admin-auth.js before the page could rewrite its address bar.
    var raw = window.RabboraAdminOpenParam;
    if (!raw || !/^\d{1,15}$/.test(raw)) return;
    var params = new URLSearchParams(window.location.search);

    var observer = null;
    var waitTimer = null;
    var settleTimer = null;
    var done = false;

    function finish() {
      done = true;
      if (observer) observer.disconnect();
      window.clearTimeout(waitTimer);
      window.clearTimeout(settleTimer);
      params.delete("open");
      var query = params.toString();
      window.history.replaceState(null, "", window.location.pathname + (query ? "?" + query : "") + window.location.hash);
    }

    function findButton() {
      return document.querySelector('[data-open="' + raw + '"]');
    }

    // The list page re-renders its table after loading, so wait until the
    // table stops changing, then click the row once.
    function clickWhenSettled() {
      if (done) return;
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(function () {
        var button = findButton();
        if (!button || done) return;
        finish();
        button.click();
      }, 400);
    }

    observer = new MutationObserver(function () {
      if (findButton()) clickWhenSettled();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    if (findButton()) clickWhenSettled();
    waitTimer = window.setTimeout(finish, OPEN_WAIT_MS);
  }

  // ------------------------------------------------------------
  // Start
  // ------------------------------------------------------------

  function start() {
    buildBell();
    bindEvents();

    Promise.all([
      A.request("/admin/notification-preferences"),
      A.request("/admin/notifications?limit=" + LIST_SIZE)
    ]).then(function (results) {
      var prefs = results[0];
      var list = results[1];
      if (list.status === 401 || list.status === 403) {
        state.stopped = true;
        return;
      }
      if (prefs.ok && prefs.data && prefs.data.preferences) state.prefs = prefs.data.preferences;
      applyPrefs();

      if (list.ok && list.data) {
        state.items = Array.isArray(list.data.items) ? list.data.items : [];
        state.hasMore = !!list.data.hasMore;
        state.nextBeforeId = list.data.nextBeforeId;
        state.unread = list.data.unreadCount || 0;
        // Everything already on screen counts as seen: no sound on page load.
        if (state.items.length) writeSeen(state.items[0].id);
        else if (readSeen() === null) writeSeen(0);
      } else {
        setStatus("Notifications could not load. They will retry shortly.", true);
      }
      renderList();
      updateBadge();
      handleOpenParam();
      schedule(POLL_MS);
    });
  }

  start();
})(window, document);