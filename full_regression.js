const { JSDOM } = require("jsdom");
const BASE = "http://localhost:8967/";
function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function check(file) {
  const errs = [];
  const dom = await JSDOM.fromURL(BASE + file, {
    runScripts: "dangerously", resources: "usable", pretendToBeVisual: true,
    beforeParse(window) {
      window.matchMedia = window.matchMedia || function () { return { matches: false, addEventListener(){}, addListener(){} }; };
      window.console.error = (...a) => errs.push(a.join(" "));
    }
  });
  await wait(700);
  console.log(`${file}: ${errs.length === 0 ? "OK" : JSON.stringify(errs)}`);
  dom.window.close();
}

(async () => {
  const pages = [
    "index.html", "ottoman-beds.html", "mattresses.html", "blanket-boxes.html",
    "sofas.html", "high-headboard-beds.html", "kids-beds.html", "non-storage-bed-frames.html",
    "rapid-delivery-beds.html", "solid-base-ottomans.html", "storage-drawers.html", "tv-beds.html",
    "fabric-samples.html", "contact.html", "account.html", "register.html", "forgot-password.html",
    "wishlist.html", "cart.html"
  ];
  for (const p of pages) {
    try {
      await check(p);
    } catch (e) {
      console.log(p, "-> FAILED TO LOAD:", e.message);
    }
  }
})();
