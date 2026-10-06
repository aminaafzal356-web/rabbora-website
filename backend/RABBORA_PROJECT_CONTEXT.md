# Rabbora Living — Project Context (Backend Reference)

> **What this is.** A reference for building the Rabbora Living backend, written only from the existing frontend files. The frontend is the source of truth: every name, price, path and option below was read directly from the files in §1. Nothing was invented or corrected.
>
> **"Not found in current project"** means the information was not in the files available for this inspection. It may exist in project files that were not provided.
>
> **Status.** Documentation only. No frontend file was changed. No database, API or backend code was written in this step. More files are still being provided; this document will be extended.
>
> Last updated: 25 September 2026 (batch 3: Slatted Ottoman, Rapid Delivery, High Headboard, Kids, Mattresses, Sofas, Fabric Samples, search index).

---

## 1. Files inspected

### 1.1 Fully inspected

| File | What it is |
|---|---|
| `index.html` | Home page. **This copy is from before the latest hero redesign.** |
| `script.js` | Shared site script (header, nav, search, header counts) + Home product data `PRODUCTS`. The copy read is the latest `script.js` delivered with the hero update (only its hero function differs from the original). |
| `style.css` | Shared stylesheet |
| `tv-beds.html/.css/.js` | TV Beds — category + product detail |
| `storage-drawers.html/.css/.js` | Storage Beds With Drawers — category + product detail |
| `solid-base-ottomans.html/.js` | Solid Base Ottomans — category + product detail (`solid-base-ottomans.css` not provided in this batch) |
| `bed-frames.html/.css/.js` | Bed Frames hub — category + product detail |
| `best-sellers.html/.css/.js` | Best Sellers — category + product detail |
| `blanket-boxes.html/.css/.js` | Blanket Boxes — category + product detail |
| `account.html/.css/.js` | **Log In page** (the file is named `account.html`; its title is "Log In" and its canonical URL is `login.html`) |
| `wishlist.html/.css/.js`, `wishlist-data.js` | Wishlist page + shared wishlist store |
| `cart-data.js`, `cart.js` | Shared cart store + cart page logic |
| `ottoman-beds.html/.js` | Slatted Ottoman Beds — category + product detail (60 products) |
| `rapid-delivery-beds.html/.js` | Rapid Delivery Beds — category + product detail (31 products) |
| `high-headboard-beds.html/.js` | High Headboard Beds — category + product detail (14 products) |
| `kids-beds.html/.js` | Kids' Beds — category + product detail (5 products) |
| `mattresses.html/.js` | Luxury Mattresses — category + product detail (16 products) |
| `sofas.html/.js` | Sofas — category + product detail (4 products) |
| `fabric-samples.html/.js` | Free Fabric Samples request page (95 swatches, request form) |
| `search-index.js` | Global header search data `GLOBAL_SEARCH_INDEX` (222 entries) |

`solid-base-ottomans.html/.js` were sent again in the latest batch; they are **byte-for-byte identical** to the copies already inspected.

CSS files contain presentation only; no product or business data was found in them. (`best-sellers.css` starts with a copied "TV BEDS" header comment — cosmetic only.)

### 1.2 Inspected on 24 September but not available now

`reviews.html/.css/.js`, `register.html/.css/.js`, `about.html/.js`, `cart.html`, `solid-base-ottomans.css`, `rapid-delivery-beds.css`, `sofas.css`. Facts recorded from them are in **§14 (provisional)**. (Slatted Ottoman, Rapid Delivery, Sofas and `search-index.js` have now been re-supplied and are **verified** in this version.)

CSS not provided for: `ottoman-beds.css`, `high-headboard-beds.css`, `kids-beds.css`, `mattresses.css`, `fabric-samples.css` (and, in this session, `solid-base-ottomans.css`, `rapid-delivery-beds.css`, `sofas.css`).

### 1.3 Referenced by the code but never provided

`checkout.html`, `product.html`, `login.html`, `forget-password.html`, `non-storage-bed-frames.html`, `beds-upholstered.html`, `rapid-delivery.html` and `solid-ottoman-beds.html` (both linked only from `search-index.js`), `contact.html`, `craftsmanship.html`, `delivery.html`, `returns.html`, `warranty.html`, `faqs.html`, `terms.html`, `privacy-policy.html`, `cookie-policy.html` — and **no image files** (only their paths were seen in code).

---

## 2. Website structure

- **Technology:** plain HTML5 / CSS3 / vanilla JavaScript. No framework, no build step.
- **One page per category.** Each category page shows both the category grid and the product detail view, chosen by the URL hash, e.g. `tv-beds.html#/tv-bed-1`. JavaScript switches between a category view, a detail view and a "not found" view and listens for `hashchange`.
- **Home page product cards** link to `product.html?slug=<slug>` (page not provided).
- **Header on every page:** announcement bar "Free UK delivery on all bed frames — 0% finance available at checkout"; logo; search bar with an "All Categories" menu; account icon → `account.html`; wishlist button `#wishlistBtn` (count `#wishlistCount`) → `wishlist.html`; cart button `#cartBtn` (count `#cartCount`) → `cart.html`.

### 2.1 Main navigation

- Home → `index.html`
- **Bed Frames** (dropdown): Slatted Ottoman → `ottoman-beds.html`; Solid Base Ottomans → `solid-base-ottomans.html`; Drawer Beds → `storage-drawers.html`; TV Beds → `tv-beds.html`; Kids' Beds → `kids-beds.html`; Non-Storage Bed Frames → `non-storage-bed-frames.html`; High Headboard Beds → `high-headboard-beds.html`; View all bed frames → `bed-frames.html`
- Rapid Delivery Beds → `rapid-delivery-beds.html`
- Luxury Mattresses → `mattresses.html`
- Sofas → `sofas.html`
- Blanket Boxes → `blanket-boxes.html`
- Fabric Samples → `fabric-samples.html`
- Contact Us → `contact.html`

**Search "All Categories" menu** (`account.html` header): All Categories, Blanket Boxes and Footstools, Kids' Beds, Luxury Bed Frames, High Headboard Beds, Luxury Mattresses, RABBORA Rapid Delivery, Slatted Ottoman Storage, Sofas, Solid Ottoman Storage, Storage with Drawers, TV Beds; and, marked **"coming soon"** with no link: Divan Base Only, Metal Frames, Parklane Style, Rabbora Bed Frame, Wingback Style Beds, Model C Sofas.

**Home "Most Popular Categories" tiles** link to `bed-frames.html` (Luxury Bed Frames, Divan, Velvet, Wingback, Luxury, Panel, Double, King Size, Super King Beds — one tile is labelled "Panal Beds"), `mattresses.html` (Mattresses, Memory Foam, Pocket Sprung), `ottoman-beds.html`, `solid-base-ottomans.html`, `storage-drawers.html`, `tv-beds.html`, `sofas.html` (Sofas, Corner Sofas, Recliner Sofas). Sub-types such as Divan or Velvet have no separate page or filter in the inspected files.

**Home "Featured Categories"** has two links that don't match their labels: "Solid Ottoman Storage" → `beds-upholstered.html`; "TV Beds" → `high-headboard-beds.html`.

**Footer:** Shop, Customer Service (Contact Us, Delivery, Returns, Warranty, FAQs), About (Our Story → `about.html`, Craftsmanship, Contact), Legal (Privacy Policy, Terms & Conditions, Cookie Policy). Contact: `hello@rabbora.co.uk`, `+44 20 0000 0000`, WhatsApp `wa.me/447000000000`, address "Unit 4, Furnishing Quarter, London, UK", social `@rabboraliving` (Instagram, Facebook, TikTok, YouTube, Pinterest). *(The phone and WhatsApp numbers are mostly zeros — confirm they are real before using them anywhere.)*

### 2.2 Script load order and page category

| Page | Stylesheets | Scripts (in order) | `<body data-wishlist-category>` |
|---|---|---|---|
| `index.html` | `style.css` | `search-index.js`, `wishlist-data.js`, `cart-data.js`, `script.js` | — |
| `tv-beds.html` | `style.css`, `tv-beds.css` | shared four + `tv-beds.js` | TV Beds |
| `storage-drawers.html` | `style.css`, `storage-drawers.css` | shared four + `storage-drawers.js` | Storage Beds With Drawers |
| `solid-base-ottomans.html` | `style.css`, `solid-base-ottomans.css` | shared four + `solid-base-ottomans.js` | Solid Base Ottomans |
| `bed-frames.html` | `style.css`, `bed-frames.css` | shared four + `bed-frames.js` | **not set** (saved wishlist items get an empty category) |
| `best-sellers.html` | `style.css`, `best-sellers.css` | shared four + `best-sellers.js` | Best Sellers |
| `blanket-boxes.html` | **`blanket-boxes.css?v=3` only** | `search-index.js`, `wishlist-data.js`, `cart-data.js`, `blanket-boxes.js?v=3` — **no `script.js`** | Blanket Boxes |
| `ottoman-beds.html` | `ottoman-beds.css` only | `search-index.js`, `wishlist-data.js`, `cart-data.js`, `ottoman-beds.js` — **no `script.js`** | Slatted Ottoman Beds |
| `rapid-delivery-beds.html` | `style.css`, `rapid-delivery-beds.css` | shared four + `rapid-delivery-beds.js` | Rapid Delivery Beds |
| `high-headboard-beds.html` | `style.css`, `high-headboard-beds.css` | shared four + `high-headboard-beds.js` | High Headboard Beds |
| `kids-beds.html` | `style.css`, `kids-beds.css` | shared four + `kids-beds.js` | **Kids Beds** (no apostrophe; the cart uses "Kids’ Beds") |
| `mattresses.html` | `mattresses.css` only | `search-index.js`, `wishlist-data.js`, `cart-data.js`, `mattresses.js` — **no `script.js`** | Luxury Mattresses |
| `sofas.html` | `sofas.css?v=3` only | `search-index.js`, `wishlist-data.js`, `cart-data.js`, `sofas.js` — **no `script.js`** | Sofas |
| `fabric-samples.html` | `fabric-samples.css` only | `search-index.js`, `wishlist-data.js`, `cart-data.js`, `fabric-samples.js` — **no `script.js`** | **not set** |
| `account.html` | `account.css` only | shared four + `account.js` | — |
| `wishlist.html` | `wishlist.css` only | shared four + `wishlist.js` | — |

"Shared four" = `search-index.js`, `wishlist-data.js`, `cart-data.js`, `script.js`. `blanket-boxes.js`, `ottoman-beds.js`, `mattresses.js`, `sofas.js` and `fabric-samples.js` each contain their own copy of the header, search, mobile-nav, wishlist-heart and cart-count code because `script.js` is not loaded on those pages. `blanket-boxes.css` and `account.css` contain their own copy of the design tokens and header styles.

---

## 3. Product categories — overview (verified)


| Category | Page | Data source | Products | Static cards | Cart `id` | Cart `category` | Wishlist `id` (from card) |
|---|---|---|---|---|---|---|---|
| TV Beds | `tv-beds.html` | `TV_BED_PRODUCTS` | 12 | 4 (`tv-bed-1`…`4`) | `tv-bed-` + slug → `tv-bed-tv-bed-1` | TV Beds | `data-product-id` → `tv-bed-tv-bed-1` |
| Storage Beds With Drawers | `storage-drawers.html` | `SD_PRODUCTS_LIST` | 10 | 10 | `storage-drawer-` + slug → `storage-drawer-storage-drawer-1` | Storage Beds With Drawers | slug → `storage-drawer-1` |
| Solid Base Ottomans | `solid-base-ottomans.html` | `SOLID_OTTOMAN_PRODUCTS` | 45 | 45 | `solid-base-ottoman-` + slug → `solid-base-ottoman-solid-ottoman-bed-1` | Solid Base Ottomans | slug → `solid-ottoman-bed-1` |
| Bed Frames (hub) | `bed-frames.html` | `BF_PRODUCTS` | 30 | 30 | slug → `bed-frame-1` | **not set** (`""`) | slug → `bed-frame-1` |
| Best Sellers | `best-sellers.html` | `BS_PRODUCTS` | 40 | 40 (12 per page) | slug → `art-deco-bed-style`, `best-seller-5`… | Best Sellers | slug |
| Blanket Boxes | `blanket-boxes.html` | `BB_PRODUCTS` (object keyed by slug) | 7 | 7 | `blanket-box-` + slug | Blanket Boxes | slug |
| Slatted Ottoman Beds | `ottoman-beds.html` | `SLATTED_OTTOMAN_PRODUCTS` | 60 | 60 (12 per page) | `ottoman-bed-` + slug | Slatted Ottoman Beds | **slug** (this page reads `data-slug` before `data-product-id`) |
| Rapid Delivery Beds | `rapid-delivery-beds.html` | `RAPID_DELIVERY_PRODUCTS` | 31 | 31 | `rapid-delivery-bed-` + slug → `rapid-delivery-bed-rapid-1` | Rapid Delivery Beds | `data-product-id` → `rapid-delivery-rapid-1` (≠ cart id) |
| High Headboard Beds | `high-headboard-beds.html` | `HH_BED_PRODUCTS` | 14 | 14 | `high-headboard-bed-` + slug → `high-headboard-bed-high-headboard-bed-1` | High Headboard Beds | slug |
| Kids' Beds | `kids-beds.html` | `KIDS_BED_PRODUCTS` | 5 | 5 | `kids-bed-` + slug → `kids-bed-kids-bed-1` | Kids’ Beds (curly ’) | slug |
| Luxury Mattresses | `mattresses.html` | `MATTRESS_PRODUCTS_LIST` | 16 | 16 (12 per page) | `mattress-` + slug | Luxury Mattresses | `mattress-` + slug (= cart id) |
| Sofas | `sofas.html` | `SF_PRODUCTS` (object keyed by slug) | 4 | 4 | `sofa-` + slug | Sofas | slug |
| Fabric Samples | `fabric-samples.html` | `FABRIC_CATALOG` + static swatches | 95 | 95 swatches | — (no cart) | — | — |
| Home page cards | `index.html` | `PRODUCTS.popular` + `.bestSellers` | 8 | rendered by JS | — (no Add to Cart) | — | `id`, e.g. `demo-p1` |


**Important: Bed Frames and Best Sellers are not separate products.** Their entries re-use products from the other ranges (same name, price, previous price and image) under **new slugs and ids**. For example, "Rabbora Lyon Storage Bed" exists as `storage-drawer-1` (Storage Drawers), `orlando-bed-frame-ottoman-storage` (Best Sellers); "Rabbora Milano TV Bed" as `tv-bed-1` (TV Beds) and `bed-frame-27` (Bed Frames); "Rabbora Solid Ottoman Bed" as `solid-ottoman-bed-1`, `bed-frame-10` and `empire-bed-frame-ottoman-storage`. The same bed can therefore be in the cart or wishlist under several different ids. See §12.

Rapid Delivery entries are also re-listings: their names are the names of beds from other ranges (e.g. `rapid-1` "Rabbora Athens Linear Bed", `rapid-4` "Rabbora Empire Ottoman Bed") and all use Solid Base photos. Non-Storage Bed Frames: **Not found in current project** (page not provided).

**Total product records across all inspected data files:** 274 (TV 12, Storage Drawers 10, Solid Base 45, Bed Frames 30, Best Sellers 40, Blanket Boxes 7, Slatted Ottoman 60, Rapid Delivery 31, High Headboard 14, Kids 5, Mattresses 16, Sofas 4) plus 8 Home cards. Because of re-listing, the number of *distinct* beds is lower; it cannot be worked out exactly from names alone.

---

## 4. Products — exact values from the data files

Prices are GBP numbers as stored. "Monthly" is the stored "or from £X/month" figure. Ratings and review counts are stored in the data but **hidden on every inspected page** ("No reviews yet" is shown instead — §12).


### 4.1 TV Beds — `tv-beds.js` → `TV_BED_PRODUCTS` (12)

Fields: `id, slug, name, price, oldPrice, monthlyPrice, rating, reviewCount, badge, maxScreenSize, shortInfo, description, availableSizeLabels, availableSizes, features, tvInfo, dimensions, delivery, warranty, returns, images`.

| id | slug | name | price | oldPrice | monthly | badge | max TV | rating | reviews | images |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `tv-bed-1` | Rabbora Milano TV Bed | £999.00 | £1,399.00 | 84 | 29% Off | Up to 32" | 5 | 0 | `tv/img-1.jfif`, `tv/img-22.png`, `tv/img-23.png` |
| 2 | `tv-bed-2` | Rabbora Monaco TV Bed | £990.00 | £1,399.00 | 83 | 29% Off | Up to 40" | 5 | 0 | `tv/img-2.jfif` |
| 3 | `tv-bed-3` | Rabbora Windsor TV Bed | £1,099.00 | £1,399.00 | 92 | 21% Off | Up to 43" | 5 | 0 | `tv/img-3.jfif` |
| 4 | `tv-bed-4` | Rabbora Kensington TV Bed | £999.00 | £1,399.00 | 84 | 29% Off | Up to 50" | 0 | 0 | `tv/img-4.jfif` |
| 5 | `tv-bed-5` | Mayfair TV Bed | £735.00 | — | 61 | Best Seller | Up to 32" | 4 | 62 | *(empty — no images)* |
| 6 | `tv-bed-6` | Richmond TV Bed | £769.00 | — | 64 | New | Up to 40" | 5 | 73 | *(empty — no images)* |
| 7 | `tv-bed-7` | Cambridge TV Bed | £803.00 | £893.00 | 67 | — | Up to 43" | 5 | 84 | *(empty — no images)* |
| 8 | `tv-bed-8` | Victoria TV Bed | £837.00 | — | 70 | Best Seller | Up to 50" | 5 | 95 | *(empty — no images)* |
| 9 | `tv-bed-9` | Oxford TV Bed | £871.00 | — | 73 | — | Up to 32" | 4 | 106 | *(empty — no images)* |
| 10 | `tv-bed-10` | Chester TV Bed | £905.00 | £995.00 | 75 | — | Up to 40" | 5 | 117 | *(empty — no images)* |
| 11 | `tv-bed-11` | Kingston TV Bed | £939.00 | — | 78 | Best Seller | Up to 43" | 5 | 128 | *(empty — no images)* |
| 12 | `tv-bed-12` | Brighton TV Bed | £973.00 | — | 81 | — | Up to 50" | 5 | 139 | *(empty — no images)* |

Shared by all 12: sizes `Small Double 4ft`, `Double 4ft 6"`, `King 5ft`, `Super King 6ft`; delivery "Handmade to order, with standard UK delivery included."; warranty "24 month warranty"; returns "30-day easy returns on unused, unassembled beds.". Per-product text: Appendix A.

### 4.2 Storage Beds With Drawers — `storage-drawers.js` → `SD_PRODUCTS_LIST` (10)

Fields: `slug, name, description, image, images, shortInfo, badge, rating, reviews, price, oldPrice, monthly, drawers, warranty, delivery`. No numeric `id`, no sizes, no dimensions, no features, no `returns` field (the page writes "30-day easy returns on unused, unassembled beds" in JS). `image` = cart / related image; `images` = card / gallery images (different folders).

| slug | name | drawers | price | oldPrice | monthly | badge | rating | reviews | `image` | `images` |
|---|---|---|---|---|---|---|---|---|---|---|
| `storage-drawer-1` | Rabbora Lyon Storage Bed | 2 | £299.00 | £380.00 | 25 | 21% off | 4 | 22 | `images/storage-drawers/img-1.png` | `drawar/1.jfif`, `drawar/2.jfif`, `drawar/3.jfif` |
| `storage-drawer-2` | Rabbora Mona Lisa Storage Bed | 4 | £299.00 | £380.00 | 25 | 21% off | 5 | 31 | `images/storage-drawers/img-2.png` | `drawar/4.jfif`, `drawar/5.jfif`, `drawar/6.jfif` |
| `storage-drawer-3` | Rabbora Art Deco Storage Bed | 2 | £299.00 | £380.00 | 25 | 21% off | 5 | 40 | `images/storage-drawers/img-3.png` | `drawar/7.jfif`, `drawar/8.jfif`, `drawar/9.jfif` |
| `storage-drawer-4` | Rabbora Golden Skyline Storage Bed | 4 | £399.00 | £499.00 | 34 | 20% off | 5 | 49 | `images/storage-drawers/img-4.png` | `drawar/10.jfif`, `drawar/11.jfif`, `drawar/12.jfif` |
| `storage-drawer-5` | Rabbora Dover Designer Storage Bed | 2 | £299.00 | £400.00 | 25 | 25% off | 4 | 58 | `images/storage-drawers/img-5.png` | `drawar/13.jfif`, `drawar/14.jfif`, `drawar/15.jfif` |
| `storage-drawer-6` | Rabbora Brooklyn Storage Bed | 4 | £299.00 | £380.00 | 25 | 21% off | 5 | 67 | `images/storage-drawers/img-6.png` | `drawar/16.jfif`, `drawar/17.jfif`, `drawar/18.jfif` |
| `storage-drawer-7` | Rabbora Mayfair Storage Bed | 2 | £299.00 | £380.00 | 25 | 21% off | 5 | 76 | `images/storage-drawers/img-7.png` | `drawar/19.jfif`, `drawar/20.jfif`, `drawar/21.jfif` |
| `storage-drawer-8` | Rabbora Toronto Lux Storage Bed | 4 | £399.00 | £499.00 | 34 | 20% off | 5 | 85 | `images/storage-drawers/img-8.png` | `drawar/22.jfif`, `drawar/23.jfif`, `drawar/24.jfif` |
| `storage-drawer-9` | Rabbora Virginia Storage Bed | 2 | £299.00 | £370.00 | 25 | 19% off | 4 | 94 | `images/storage-drawers/img-9.png` | `drawar/25.jfif`, `drawar/26.jfif`, `drawar/27.jfif` |
| `storage-drawer-10` | Rabbora Kensington Storage Bed | 2 | £299.00 | £370.00 | 25 | 19% off | 4 | 0 | `images/storage-drawers/img-9.png` | `drawar/28.jfif`, `drawar/29.jfif`, `drawar/30.jfif` |

Shared: warranty "24-month warranty"; delivery "Handmade to order, delivered boxed for home assembly". Per-product text: Appendix B.

### 4.3 Solid Base Ottomans — `solid-base-ottomans.js` → `SOLID_OTTOMAN_PRODUCTS` (45)

Fields: `id, slug, name, price, oldPrice, monthly, rating, reviews, badge, size, sizeKey, shortInfo, description, features, dimensions, delivery, warranty, returns, images`. **Each record holds one size** (`size` label + `sizeKey`) and one `dimensions` object; 9 products per size.

| id | slug | name | stored size | price | oldPrice | monthly | badge | rating | reviews | images |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `solid-ottoman-bed-1` | Rabbora Solid Ottoman Bed | Single 3ft | £249.00 | £429.00 | 21 | 42% off | 5 | 15 | `solid/1.jfif`, `solid/2.jfif`, `solid/3.jfif` |
| 2 | `solid-ottoman-bed-2` | Rabbora Luxury Solid Ottoman Bed | Small Double 4ft | £259.00 | £420.00 | 22 | 38% off | 5 | 24 | `solid/4.jfif`, `solid/5.jfif`, `solid/6.jfif` |
| 3 | `solid-ottoman-bed-3` | Rabbora Premium Ottoman Bed | Double 4'6ft | £289.00 | £400.00 | 25 | 28% off | 4 | 33 | `solid/7.jfif`, `solid/8.jfif`, `solid/9.jfif` |
| 4 | `solid-ottoman-bed-4` | Rabbora Classic Ottoman Bed | King 5ft | £289.00 | £420.00 | 25 | 31% off | 5 | 42 | `solid/10.jfif`, `solid/11.jfif`, `solid/12.jfif` |
| 5 | `solid-ottoman-bed-5` | Rabbora Elegant Ottoman Bed | Super King 6ft | £252.00 | £420.00 | 21 | 40% off | 5 | 51 | `solid/13.jfif`, `solid/14.jfif`, `solid/15.jfif` |
| 6 | `solid-ottoman-bed-6` | Rabbora Comfort Ottoman Bed | Single 3ft | £299.00 | £444.00 | 25 | 33% off | 4 | 60 | `solid/16.jfif`, `solid/17.jfif`, `solid/18.jfif` |
| 7 | `solid-ottoman-bed-7` | Rabbora Signature Ottoman Bed | Small Double 4ft | £299.00 | £420.00 | 25 | 29% off | 5 | 69 | `solid/19.jfif`, `solid/20.jfif`, `solid/21.jfif` |
| 8 | `solid-ottoman-bed-8` | Rabbora Modern Ottoman Bed | Double 4'6ft | £299.00 | £420.00 | 25 | 29% off | 5 | 78 | `solid/22.jfif`, `solid/23.jfif`, `solid/24.jfif` |
| 9 | `solid-ottoman-bed-9` | Rabbora Prestige Ottoman Bed | King 5ft | £389.00 | £499.00 | 33 | 22% off | 4 | 87 | `solid/25.jfif`, `solid/26.jfif`, `solid/27.jfif` |
| 10 | `solid-ottoman-bed-10` | Rabbora Deluxe Ottoman Bed | Super King 6ft | £289.00 | £420.00 | 25 | 31% off | 5 | 96 | `solid/28.jfif`, `solid/29.jfif`, `solid/30.jfif` |
| 11 | `solid-ottoman-bed-11` | Rabbora Heritage Ottoman Bed | Single 3ft | £275.00 | £360.00 | 23 | 24% off | 5 | 105 | `solid/31.jfif`, `solid/32.jfif`, `solid/33.jfif` |
| 12 | `solid-ottoman-bed-12` | Rabbora Select Ottoman Bed | Small Double 4ft | £349.00 | £420.00 | 30 | 17% off | 4 | 114 | `solid/34.jfif`, `solid/35.jfif`, `solid/36.jfif` |
| 13 | `solid-ottoman-bed-13` | Rabbora Grande Ottoman Bed | Double 4'6ft | £299.00 | £420.00 | 25 | 29% off | 5 | 123 | `solid/37.jfif`, `solid/38.jfif`, `solid/39.jfif` |
| 14 | `solid-ottoman-bed-14` | Rabbora Haven Ottoman Bed | King 5ft | £349.00 | £420.00 | 30 | 17% off | 5 | 132 | `solid/40.jfif`, `solid/41.jfif`, `solid/42.jfif` |
| 15 | `solid-ottoman-bed-15` | Rabbora Urban Ottoman Bed | Super King 6ft | £399.00 | £478.80 | 34 | 17% off | 4 | 141 | `solid/43.jfif`, `solid/44.jfif`, `solid/45.jfif` |
| 16 | `solid-ottoman-bed-16` | Rabbora Royal Ottoman Bed | Single 3ft | £349.00 | £549.00 | 30 | 36% off | 5 | 150 | `solid/46.jfif`, `solid/47.jfif`, `solid/48.jfif` |
| 17 | `solid-ottoman-bed-17` | Rabbora Elite Ottoman Bed | Small Double 4ft | £349.00 | £420.00 | 30 | 17% off | 5 | 159 | `solid/49.jfif`, `solid/50.jfif`, `solid/51.jfif` |
| 18 | `solid-ottoman-bed-18` | Rabbora Harmony Ottoman Bed | Double 4'6ft | £299.00 | £414.00 | 25 | 28% off | 4 | 168 | `solid/52.jfif`, `solid/53.jfif`, `solid/54.jfif` |
| 19 | `solid-ottoman-bed-19` | Rabbora Grace Ottoman Bed | King 5ft | £389.00 | £499.00 | 33 | 22% off | 5 | 17 | `solid/55.jfif`, `solid/56.jfif`, `solid/57.jfif` |
| 20 | `solid-ottoman-bed-20` | Rabbora Comfort Plus Ottoman Bed | Super King 6ft | £299.00 | £360.00 | 25 | 17% off | 5 | 26 | `solid/58.jfif`, `solid/59.jfif`, `solid/60.jfif` |
| 21 | `solid-ottoman-bed-21` | Rabbora Contemporary Ottoman Bed | Single 3ft | £319.00 | £420.00 | 27 | 24% off | 4 | 35 | `solid/61.jfif`, `solid/62.jfif`, `solid/63.jfif` |
| 22 | `solid-ottoman-bed-22` | Rabbora Living Ottoman Bed | Small Double 4ft | £349.00 | £420.00 | 30 | 17% off | 5 | 44 | `solid/64.jfif`, `solid/65.jfif`, `solid/66.jfif` |
| 23 | `solid-ottoman-bed-23` | Rabbora Luxe Ottoman Bed | Double 4'6ft | £299.00 | £420.00 | 25 | 29% off | 5 | 53 | `solid/67.jfif`, `solid/68.jfif`, `solid/69.jfif` |
| 24 | `solid-ottoman-bed-24` | Rabbora Classic Luxe Ottoman Bed | King 5ft | £399.00 | £600.00 | 34 | 34% off | 4 | 62 | `solid/70.jfif`, `solid/71.jfif`, `solid/72.jfif` |
| 25 | `solid-ottoman-bed-25` | Rabbora Comfort Luxe Ottoman Bed | Super King 6ft | £599.00 | £900.00 | 50 | 33% off | 5 | 71 | `solid/73.jfif`, `solid/74.jfif`, `solid/75.jfif` |
| 26 | `solid-ottoman-bed-26` | Rabbora Grand Ottoman Bed | Single 3ft | £349.00 | £420.00 | 30 | 17% off | 5 | 80 | `solid/76.jfif`, `solid/77.jfif`, `solid/78.jfif` |
| 27 | `solid-ottoman-bed-27` | Rabbora Supreme Ottoman Bed | Small Double 4ft | £289.00 | £420.00 | 25 | 31% off | 4 | 89 | `solid/79.jfif`, `solid/80.jfif`, `solid/81.jfif` |
| 28 | `solid-ottoman-bed-28` | Rabbora Essence Ottoman Bed | Double 4'6ft | £325.00 | £360.00 | 28 | 10% off | 5 | 98 | `solid/82.jfif`, `solid/83.jfif`, `solid/84.jfif` |
| 29 | `solid-ottoman-bed-29` | Rabbora Modern Luxe Ottoman Bed | King 5ft | £299.00 | £420.00 | 25 | 29% off | 5 | 107 | `solid/85.jfif`, `solid/86.jfif`, `solid/87.jfif` |
| 30 | `solid-ottoman-bed-30` | Rabbora Serenity Ottoman Bed | Super King 6ft | £289.00 | £420.00 | 25 | 31% off | 4 | 116 | `solid/88.jfif`, `solid/89.jfif`, `solid/90.jfif` |
| 31 | `solid-ottoman-bed-31` | Rabbora Majestic Ottoman Bed | Single 3ft | £289.00 | — | 25 | — | 5 | 125 | `solid/91.jfif`, `solid/92.jfif`, `solid/93.jfif` |
| 32 | `solid-ottoman-bed-32` | Rabbora Comfort Elite Ottoman Bed | Small Double 4ft | £389.00 | £499.00 | 33 | 22% off | 5 | 134 | `solid/94.jfif`, `solid/95.jfif`, `solid/96.jfif` |
| 33 | `solid-ottoman-bed-33` | Rabbora Timeless Ottoman Bed | Double 4'6ft | £294.00 | £420.00 | 25 | 30% off | 4 | 143 | `solid/97.jfif`, `solid/98.jfif`, `solid/99.jfif` |
| 34 | `solid-ottoman-bed-34` | Rabbora Opulent Ottoman Bed | King 5ft | £539.00 | £649.00 | 45 | 17% off | 5 | 152 | `solid/100.jfif`, `solid/101.jfif`, `solid/102.jfif` |
| 35 | `solid-ottoman-bed-35` | Rabbora Refined Ottoman Bed | Super King 6ft | £549.00 | £900.00 | 46 | 39% off | 5 | 161 | `solid/103.jfif`, `solid/104.jfif`, `solid/105.jfif` |
| 36 | `solid-ottoman-bed-36` | Rabbora Signature Luxe Ottoman Bed | Single 3ft | £549.00 | £900.00 | 46 | 39% off | 4 | 170 | `solid/106.jfif`, `solid/107.jfif`, `solid/108.jfif` |
| 37 | `solid-ottoman-bed-37` | Rabbora Elegant Luxe Ottoman Bed | Small Double 4ft | £701.00 | — | — | — | 5 | 19 | `solid/109.jfif`, `solid/110.jfif`, `solid/111.jfif` |
| 38 | `solid-ottoman-bed-38` | Rabbora Prestige Luxe Ottoman Bed | Double 4'6ft | £718.00 | — | — | — | 5 | 28 | `solid/112.jfif`, `solid/113.jfif`, `solid/114.jfif` |
| 39 | `solid-ottoman-bed-39` | Rabbora Modern Comfort Ottoman Bed | King 5ft | £735.00 | — | — | — | 4 | 37 | `solid/115.jfif`, `solid/116.jfif`, `solid/117.jfif` |
| 40 | `solid-ottoman-bed-40` | Rabbora Luxury Comfort Ottoman Bed | Super King 6ft | £752.00 | — | — | — | 5 | 46 | `solid/118.jfif`, `solid/119.jfif`, `solid/120.jfif` |
| 41 | `solid-ottoman-bed-41` | Rabbora Grand Luxe Ottoman Bed | Single 3ft | £429.00 | — | — | — | 5 | 55 | `solid/121.jfif`, `solid/122.jfif`, `solid/123.jfif` |
| 42 | `solid-ottoman-bed-42` | Rabbora Classic Comfort Ottoman Bed | Small Double 4ft | £446.00 | — | — | — | 4 | 64 | `solid/124.jfif`, `solid/125.jfif`, `solid/126.jfif` |
| 43 | `solid-ottoman-bed-43` | Rabbora Pure Ottoman Bed | Double 4'6ft | £463.00 | — | — | — | 5 | 73 | `solid/127.jfif`, `solid/128.jfif`, `solid/129.jfif` |
| 44 | `solid-ottoman-bed-44` | Rabbora Majestic Luxe Ottoman Bed | King 5ft | £549.00 | £900.00 | 46 | 39% off | 5 | 82 | `solid/130.jfif`, `solid/131.jfif`, `solid/132.jfif` |
| 45 | `solid-ottoman-bed-45` | Rabbora Ultimate Ottoman Bed | Super King 6ft | £549.00 | £900.00 | 46 | 39% off | 4 | 91 | `solid/133.jfif`, `solid/134.jfif`, `solid/135.jfif` |

Shared by all 45: features "Reinforced solid base for maximum support; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Tailored upholstered frame and headboard"; delivery "Handmade to order, with standard UK delivery included."; warranty "24 month warranty"; returns "30-day easy returns on unused, unassembled beds.". Dimensions by stored size (cm, width × length): Single 105×206, Small Double 136×206, Double 152×206, King 167×211, Super King 197×211. Per-product `description`/`shortInfo`: Appendix C.

### 4.4 Bed Frames hub — `bed-frames.js` → `BF_PRODUCTS` (30)

File comment: "These 30 entries are real Rabbora products (name, price, oldPrice, badge and image) pulled from the Slatted Ottoman Beds, Solid Base Ottomans, High Headboard Beds and TV Beds ranges … \"description\"/\"features\" are still generic filler text." Fields: `slug, name, price, oldPrice, badge, rating, reviewCount, image, images, description, features, sizes`. Every product: description "Add a short product description here once real product details are available.", `features: []`, `rating: 5`, `reviewCount: 0`, `sizes` = all five (Single … Super King). **No monthly price field.**

| slug | name | price | oldPrice | badge | images |
|---|---|---|---|---|---|
| `bed-frame-1` | Rabbora Manhattan Slatted Ottoman Bed | £249.00 | £429.00 | 42% off | `slatted/img-1.jfif`, `slatted/img-6.jfif`, `slatted/img-5.jfif` |
| `bed-frame-2` | Rabbora Milan Slatted Wingback Ottoman Bed | £259.00 | £420.00 | 38% off | `slatted/img-7.jfif`, `slatted/img-8.jfif`, `slatted/img-9.jfif` |
| `bed-frame-3` | Rabbora Athens Slatted Designer Ottoman Bed | £289.00 | £400.00 | 28% off | `slatted/img-12.jfif`, `slatted/img-15.jfif`, `slatted/img-13.jfif` |
| `bed-frame-4` | Rabbora Empire Slatted Ottoman Bed | £289.00 | £420.00 | 31% off | `slatted/img-17.jfif`, `slatted/img-19.jfif`, `slatted/img-18.jfif` |
| `bed-frame-5` | Rabbora Art Deco Slatted Ottoman Bed | £252.00 | £420.00 | 40% off | `slatted/img-22.jfif`, `slatted/img-24.jfif`, `slatted/img-25.jfif` |
| `bed-frame-6` | Rabbora Orlando Slatted Ottoman Bed | £306.59 | £420.00 | 27% off | `slatted/img-30.png`, `slatted/img-28.png`, `slatted/img-29.png` |
| `bed-frame-7` | Rabbora Kendal Slatted Wingback Bed | £299.00 | £444.00 | 33% off | `slatted/img-35.png`, `slatted/img-34.png`, `slatted/img-33.png` |
| `bed-frame-8` | Rabbora Teddy Orlando Slatted Ottoman Bed | £306.59 | £420.00 | 27% off | `slatted/34.png`, `slatted/35.png`, `slatted/36.png` |
| `bed-frame-9` | Rabbora Park Lane Ambassador Slatted Bed | £449.00 | £600.00 | 25% off | `slatted/38.png`, `slatted/39.png`, `slatted/img-37.png` |
| `bed-frame-10` | Rabbora Solid Ottoman Bed | £249.00 | £429.00 | 42% off | `solid/1.jfif`, `solid/2.jfif`, `solid/3.jfif` |
| `bed-frame-11` | Rabbora Luxury Solid Ottoman Bed | £259.00 | £420.00 | 38% off | `solid/4.jfif`, `solid/5.jfif`, `solid/6.jfif` |
| `bed-frame-12` | Rabbora Premium Ottoman Bed | £289.00 | £400.00 | 28% off | `solid/7.jfif`, `solid/8.jfif`, `solid/9.jfif` |
| `bed-frame-13` | Rabbora Classic Ottoman Bed | £289.00 | £420.00 | 31% off | `solid/10.jfif`, `solid/11.jfif`, `solid/12.jfif` |
| `bed-frame-14` | Rabbora Elegant Ottoman Bed | £252.00 | £420.00 | 40% off | `solid/13.jfif`, `solid/14.jfif`, `solid/15.jfif` |
| `bed-frame-15` | Rabbora Comfort Ottoman Bed | £299.00 | £444.00 | 33% off | `solid/16.jfif`, `solid/17.jfif`, `solid/18.jfif` |
| `bed-frame-16` | Rabbora Signature Ottoman Bed | £299.00 | £420.00 | 29% off | `solid/19.jfif`, `solid/20.jfif`, `solid/21.jfif` |
| `bed-frame-17` | Rabbora Modern Ottoman Bed | £299.00 | £420.00 | 29% off | `solid/22.jfif`, `solid/23.jfif`, `solid/24.jfif` |
| `bed-frame-18` | Rabbora Prestige Ottoman Bed | £389.00 | £499.00 | 22% off | `solid/25.jfif`, `solid/26.jfif`, `solid/27.jfif` |
| `bed-frame-19` | Rabbora Duke High & Wide Headboard Bed | £799.00 | £1,000.00 | 20% off | `high/1.jfif`, `high/2.jfif`, `high/3.jfif` |
| `bed-frame-20` | Rabbora Las Vegas High Headboard Bed | £749.00 | £1,000.00 | 25% off | `high/5.jfif`, `high/6.jfif`, `high/7.jfif` |
| `bed-frame-21` | Rabbora Athena High Headboard Bed | £699.00 | £900.00 | 22% off | `high/9.jfif`, `high/10.jfif`, `high/11.jfif` |
| `bed-frame-22` | Rabbora Chicago High Headboard Bed | £349.00 | £420.00 | 17% off | `high/13.jfif`, `high/14.jfif`, `high/15.jfif` |
| `bed-frame-23` | Rabbora Model Square Hotel Bed | £649.00 | £1,000.00 | 35% off | `high/17.jfif`, `high/18.jfif`, `high/19.jfif` |
| `bed-frame-24` | Rabbora Starlight Luxury Bed | £599.00 | £900.00 | 33% off | `high/20.jfif`, `high/21.jfif`, `high/22.jfif` |
| `bed-frame-25` | Rabbora DaVinci Tall Headboard Bed | £749.00 | £900.00 | 17% off | `high/24.jfif`, `high/25.jfif`, `high/26.jfif` |
| `bed-frame-26` | Rabbora Geneva High & Wide Headboard Bed | £749.00 | £1,000.00 | 25% off | `high/28.jfif`, `high/29.jfif`, `high/30.jfif` |
| `bed-frame-27` | Rabbora Milano TV Bed | £999.00 | £1,399.00 | 29% Off | `tv/img-1.jfif`, `tv/img-22.png`, `tv/img-23.png` |
| `bed-frame-28` | Rabbora Monaco TV Bed | £990.00 | £1,399.00 | 29% Off | `tv/img-2.jfif` |
| `bed-frame-29` | Rabbora Windsor TV Bed | £1,099.00 | £1,399.00 | 21% Off | `tv/img-3.jfif` |
| `bed-frame-30` | Rabbora Kensington TV Bed | £999.00 | £1,399.00 | 29% Off | `tv/img-4.jfif` |

### 4.5 Best Sellers — `best-sellers.js` → `BS_PRODUCTS` (40)

Fields: `id, slug, name, price, oldPrice, monthly, rating, reviews, badge, image, description`. One image per product (the gallery code reads a `gallery` field that no product has, so the single `image` is shown three times as thumbnails). Descriptions: ids 1–4 have a short sentence; ids 5–40 have the placeholder "Add a short product description here once real product details are available." **The first four slugs do not match the product names** (e.g. `art-deco-bed-style` = "Rabbora Manhattan Slatted Ottoman Bed").

| id | slug | name | price | oldPrice | monthly | badge | rating | reviews | image |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `art-deco-bed-style` | Rabbora Manhattan Slatted Ottoman Bed | £249.00 | £429.00 | 21 | Best Seller | 5 | 156 | `slatted/img-1.jfif` |
| 2 | `kendal-butterfly-wingback-bed` | Rabbora Duke High & Wide Headboard Bed | £799.00 | £1,000.00 | 67 | — | 5 | 88 | `high/1.jfif` |
| 3 | `empire-bed-frame-ottoman-storage` | Rabbora Solid Ottoman Bed | £249.00 | £429.00 | 21 | — | 5 | 172 | `solid/1.jfif` |
| 4 | `orlando-bed-frame-ottoman-storage` | Rabbora Lyon Storage Bed | £299.00 | £380.00 | 25 | New | 5 | 308 | `drawar/1.jfif` |
| 5 | `best-seller-5` | Rabbora Milan Slatted Wingback Ottoman Bed | £259.00 | £420.00 | 22 | — | 5 | 0 | `slatted/img-7.jfif` |
| 6 | `best-seller-6` | Rabbora Las Vegas High Headboard Bed | £749.00 | £1,000.00 | 62 | — | 5 | 0 | `high/5.jfif` |
| 7 | `best-seller-7` | Rabbora Luxury Solid Ottoman Bed | £259.00 | £420.00 | 22 | — | 5 | 0 | `solid/4.jfif` |
| 8 | `best-seller-8` | Rabbora Mona Lisa Storage Bed | £299.00 | £380.00 | 25 | — | 5 | 0 | `drawar/4.jfif` |
| 9 | `best-seller-9` | Rabbora Athens Slatted Designer Ottoman Bed | £289.00 | £400.00 | 24 | — | 5 | 0 | `slatted/img-12.jfif` |
| 10 | `best-seller-10` | Rabbora Athena High Headboard Bed | £699.00 | £900.00 | 58 | — | 5 | 0 | `high/9.jfif` |
| 11 | `best-seller-11` | Rabbora Premium Ottoman Bed | £289.00 | £400.00 | 24 | — | 5 | 0 | `solid/7.jfif` |
| 12 | `best-seller-12` | Rabbora Art Deco Storage Bed | £299.00 | £380.00 | 25 | — | 5 | 0 | `drawar/7.jfif` |
| 13 | `best-seller-13` | Rabbora Empire Slatted Ottoman Bed | £289.00 | £420.00 | 24 | — | 5 | 0 | `slatted/img-17.jfif` |
| 14 | `best-seller-14` | Rabbora Chicago High Headboard Bed | £349.00 | £420.00 | 29 | — | 5 | 0 | `high/13.jfif` |
| 15 | `best-seller-15` | Rabbora Classic Ottoman Bed | £289.00 | £420.00 | 24 | — | 5 | 0 | `solid/10.jfif` |
| 16 | `best-seller-16` | Rabbora Golden Skyline Storage Bed | £399.00 | £499.00 | 33 | — | 5 | 0 | `drawar/10.jfif` |
| 17 | `best-seller-17` | Rabbora Art Deco Slatted Ottoman Bed | £252.00 | £420.00 | 21 | — | 5 | 0 | `slatted/img-22.jfif` |
| 18 | `best-seller-18` | Rabbora Model Square Hotel Bed | £649.00 | £1,000.00 | 54 | — | 5 | 0 | `high/17.jfif` |
| 19 | `best-seller-19` | Rabbora Elegant Ottoman Bed | £252.00 | £420.00 | 21 | — | 5 | 0 | `solid/13.jfif` |
| 20 | `best-seller-20` | Rabbora Dover Designer Storage Bed | £299.00 | £400.00 | 25 | — | 5 | 0 | `drawar/13.jfif` |
| 21 | `best-seller-21` | Rabbora Orlando Slatted Ottoman Bed | £306.59 | £420.00 | 26 | — | 5 | 0 | `slatted/img-30.png` |
| 22 | `best-seller-22` | Rabbora Starlight Luxury Bed | £599.00 | £900.00 | 50 | — | 5 | 0 | `high/20.jfif` |
| 23 | `best-seller-23` | Rabbora Comfort Ottoman Bed | £299.00 | £444.00 | 25 | — | 5 | 0 | `solid/16.jfif` |
| 24 | `best-seller-24` | Rabbora Brooklyn Storage Bed | £299.00 | £380.00 | 25 | — | 5 | 0 | `drawar/16.jfif` |
| 25 | `best-seller-25` | Rabbora Kendal Slatted Wingback Bed | £299.00 | £444.00 | 25 | — | 5 | 0 | `slatted/img-35.png` |
| 26 | `best-seller-26` | Rabbora DaVinci Tall Headboard Bed | £749.00 | £900.00 | 62 | — | 5 | 0 | `high/24.jfif` |
| 27 | `best-seller-27` | Rabbora Signature Ottoman Bed | £299.00 | £420.00 | 25 | — | 5 | 0 | `solid/19.jfif` |
| 28 | `best-seller-28` | Rabbora Mayfair Storage Bed | £299.00 | £380.00 | 25 | — | 5 | 0 | `drawar/19.jfif` |
| 29 | `best-seller-29` | Rabbora Teddy Orlando Slatted Ottoman Bed | £306.59 | £420.00 | 26 | — | 5 | 0 | `slatted/34.png` |
| 30 | `best-seller-30` | Rabbora Geneva High & Wide Headboard Bed | £749.00 | £1,000.00 | 62 | — | 5 | 0 | `high/28.jfif` |
| 31 | `best-seller-31` | Rabbora Modern Ottoman Bed | £299.00 | £420.00 | 25 | — | 5 | 0 | `solid/22.jfif` |
| 32 | `best-seller-32` | Rabbora Toronto Lux Storage Bed | £399.00 | £499.00 | 33 | — | 5 | 0 | `drawar/22.jfif` |
| 33 | `best-seller-33` | Rabbora Park Lane Ambassador Slatted Bed | £449.00 | £600.00 | 37 | — | 5 | 0 | `slatted/38.png` |
| 34 | `best-seller-34` | Rabbora Bahamas Wide Headboard Bed | £749.00 | £1,000.00 | 62 | — | 5 | 0 | `high/32.jfif` |
| 35 | `best-seller-35` | Rabbora Prestige Ottoman Bed | £389.00 | £499.00 | 32 | — | 5 | 0 | `solid/25.jfif` |
| 36 | `best-seller-36` | Rabbora Virginia Storage Bed | £299.00 | £370.00 | 25 | — | 5 | 0 | `drawar/25.jfif` |
| 37 | `best-seller-37` | Rabbora Brooklyn Slatted Bed | £299.00 | £420.00 | 25 | — | 5 | 0 | `slatted/40.png` |
| 38 | `best-seller-38` | Rabbora Riviera High Headboard Bed | £549.00 | £900.00 | 46 | — | 5 | 0 | `high/35.jfif` |
| 39 | `best-seller-39` | Rabbora Deluxe Ottoman Bed | £289.00 | £420.00 | 24 | — | 5 | 0 | `solid/28.jfif` |
| 40 | `best-seller-40` | Rabbora Kensington Storage Bed | £299.00 | £370.00 | 25 | — | 5 | 0 | `drawar/28.jfif` |

Detail page fixed texts: eyebrow "Best Seller"; delivery "Free Mainland UK delivery. Delivery charges may vary for selected UK regions and remote postcodes."; warranty "24 month warranty"; returns "Easy returns".

### 4.6 Blanket Boxes — `blanket-boxes.js` → `BB_PRODUCTS` (7, object keyed by slug)

Fields: `name, price, prev, monthly, rating, reviews, description, features, fabrics, images`. The per-product `fabrics` list (3 suggested fabrics each) is **not used** by the page — the fabric picker shows the full catalogue (§7). No `badge` field in the data.

| slug (key) | name | price | prev | monthly | rating | reviews | suggested fabrics (unused) | images |
|---|---|---|---|---|---|---|---|---|
| `manhattan-style-blanket-box` | Manhattan Style Blanket Box | £200.00 | £210.00 | 11 | 5 | 86 | Plush Grey (`plush-grey`), Plush Silver (`plush-silver`), Coniston Charcoal (`coniston-charcoal`) | `blanket/img-90.png`, `blanket/img-98.png` |
| `chesterfield-blanket-box` | Chesterfield Blanket Box | £329.00 | £405.00 | 14 | 5 | 54 | Crushed Velvet Mink (`crushed-velvet-mink`), Coniston Almond (`coniston-almond`), Plush Beige (`plush-beige`) | `blanket/img-89.png`, `blanket/img-97.png` |
| `luxury-storage-blanket-box` | Luxury Storage Blanket Box | £200.00 | — | 17 | 5 | 112 | Coniston Emerald (`coniston-emerald`), Crushed Velvet Black (`crushed-velvet-black`), Plush Green (`plush-green`) | `blanket/img-88.png`, `blanket/img-95.png` |
| `ottoman-style-blanket-box` | Ottoman Style Blanket Box | £200.00 | £220.00 | 13 | 4 | 39 | Cream Boucle (`cream-boucle`), Naples Ivory (`naples-ivory`), Marble Oatmeal (`marble-oatmeal`) | `blanket/img-86.png`, `blanket/img-93.png` |
| `premium-fabric-blanket-box` | Premium Fabric Blanket Box | £200.00 | — | 14 | 5 | 67 | Plush Pink (`plush-pink`), Coniston Pink (`coniston-pink`), Pink Boucle (`pink-boucle`) | `blanket/img-85.png`, `blanket/img-96.png` |
| `classic-blanket-box` | Classic Blanket Box | £200.00 | — | 10 | 4 | 28 | Coniston Charcoal (`coniston-charcoal`), Naples Black (`naples-black`), Plush Black (`plush-black`) | `blanket/img-84.png`, `blanket/img-92.png` |
| `plush-storage-blanket-box` | Plush Storage Blanket Box | £200.00 | £175.00 | 12 | 5 | 71 | Plush Mustard (`plush-mustard`), Plush Turquoise (`plush-turquoise`), Coniston Blue (`coniston-blue`) | `blanket/img-87.png`, `blanket/img-94.png` |

Badges shown only on the static HTML cards: Manhattan Style "Best Seller", Chesterfield "New", Luxury Storage "Best Seller", Plush Storage "Sale". Per-product `description`/`features`: Appendix D.

### 4.7 Home page cards — `script.js` → `PRODUCTS`

Rendered by JS into `#popularProductsGrid` and `#bestSellerProductsGrid`; each card links to `product.html?slug=<slug>`.

| group | id | slug (exact) | name | price | previousPrice | monthly | badge | rating | reviews | image | alt text |
|---|---|---|---|---|---|---|---|---|---|---|---|
| popular | `demo-p1` | `"ottoman-bed"` | 2026 Empire Bed Frame with Optional Ottoman Storage | £290.00 | £421.00 | 25 | Best Seller | 5 | 128 | `images/img-18.jfif` | Harrow ottoman bed frame in sage fabric |
| popular | `demo-p2` | `"2026 Manhattan Bed Frame with Lines ®"` | 2026 Manhattan Bed Frame with Lines ® | £249.00 | £429.00 | 21 | — | 5 | 94 | `images/img-20.jfif` | Kensworth drawer bed in ivory boucle |
| popular | `demo-p3` | `"2026 Orlando Bed frame (Optional Ottoman Storage)"` | 2026 Orlando Bed frame (Optional Ottoman Storage) | £729.00 | £899.00 | 30 | New | 5 | 201 | `images/img-4.jfif` | Aldermoor high headboard bed in forest velvet |
| popular | `demo-p4` | `"wren-tv-bed"` | Wren TV Bed Frame | £1,399.00 | £999.00 | 84 | — | 4 | 67 | `images/img-29.jfif` | Wren TV bed frame with lift mechanism |
| bestSellers | `demo-b1` | `"The 2026 Art Deco Bed Style"` | The 2026 Art Deco Bed Style | £253.00 | £430.00 | 21 | Best Seller | 5 | 156 | `images/img-1.jfif` | Art Deco Bed Style |
| bestSellers | `demo-b2` | `"2026 Kendal Butterfly Wingback Bed"` | 2026 Kendal Butterfly Wingback Bed | £299.00 | £444.00 | 25 | — | 5 | 88 | `images/img-31.png` | Kendal Butterfly Wingback Bed |
| bestSellers | `demo-b3` | `" Frame with Optional Ottoman Storage"` | 2026 Empire Bed Frame with Optional Ottoman Storage | £290.00 | £420.00 | 26 | — | 5 | 172 | `images/img-8.jfif` | Brindley solid base ottoman bed |
| bestSellers | `demo-b4` | `" Bed frame (Optional Ottoman Storage)"` | 2026 Orlando Bed frame (Optional Ottoman Storage) | £329.00 | £421.00 | 26 | New | 5 | 307.59 | `images/img-3.jfif` | 2026 Orlando Bed frame (Optional Ottoman Storage) |


### 4.8 Slatted Ottoman Beds — `ottoman-beds.js` → `SLATTED_OTTOMAN_PRODUCTS` (60)

Fields: `id, slug, name, price, oldPrice, monthlyPrice, rating, reviewCount, badge, availableSizeLabels, availableSizes, availableColours, availableFabrics, dimensions, description, features, materials, warranty, delivery, returns, ottomanUpgradePrice, detailingButtonsPrice, images`. Every product: sizes `Single 3ft`, `Small Double 4ft`, `Double 4ft 6"`, `King 5ft`, `Super King 6ft`; `detailingButtonsPrice` 15; `ottomanUpgradePrice` 0; `dimensions` per size (same cm values as §6). `availableColours` is used by the colour filter; `availableFabrics` (4 suggested fabrics per product) is extra data — the detail page shows the full catalogue. **Slugs do not match names for all 60** (e.g. `chelsea-slatted-ottoman-bed` = "Rabbora Manhattan Slatted Ottoman Bed").

| id | slug | name | price | oldPrice | monthly | badge | colours | suggested fabrics | rating | reviews | images |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `chelsea-slatted-ottoman-bed` | Rabbora Manhattan Slatted Ottoman Bed | £249.00 | £429.00 | 21 | 42% off | Blue, Silver, Brown | `coniston-blue`, `coniston-charcoal`, `plush-green`, `marble-silver` | 4 | 75 | `slatted/img-1.jfif`, `slatted/img-6.jfif`, `slatted/img-5.jfif`, `slatted/img-4.jfif`, `slatted/img-2.jfif` |
| 2 | `hampton-slatted-ottoman-bed` | Rabbora Milan Slatted Wingback Ottoman Bed | £259.00 | £420.00 | 22 | 38% off | Blue, Brown, Beige | `plush-grey`, `crushed-velvet-black`, `naples-silver`, `plush-turquoise` | 4 | 147 | `slatted/img-7.jfif`, `slatted/img-8.jfif`, `slatted/img-9.jfif`, `slatted/img-10.jfif`, `slatted/img-3.jfif` |
| 3 | `monaco-ottoman-bed` | Rabbora Athens Slatted Designer Ottoman Bed | £289.00 | £400.00 | 25 | 28% off | Beige, White, Silver | `coniston-pink`, `plush-black`, `coniston-armour`, `coniston-almond` | 4 | 58 | `slatted/img-12.jfif`, `slatted/img-15.jfif`, `slatted/img-13.jfif`, `slatted/img-11.jfif`, `slatted/img-14.jfif` |
| 4 | `windsor-slatted-ottoman-bed` | Rabbora Empire Slatted Ottoman Bed | £289.00 | £420.00 | 25 | 31% off | Blue, Silver, Brown | `pink-boucle`, `plush-silver`, `coniston-blue`, `naples-black` | 5 | 172 | `slatted/img-17.jfif`, `slatted/img-19.jfif`, `slatted/img-.jfif`, `slatted/img-18.jfif`, `slatted/img-12.jfif` |
| 5 | `kensington-slatted-ottoman-bed` | Rabbora Art Deco Slatted Ottoman Bed | £252.00 | £420.00 | 21 | 40% off | Beige, Black, Silver | `naples-silver`, `plush-turquoise`, `plush-steel`, `plush-silver` | 5 | 110 | `slatted/img-22.jfif`, `slatted/img-24.jfif`, `slatted/img-25.jfif`, `slatted/img-26.jfif`, `slatted/img-23.jfif` |
| 6 | `mayfair-ottoman-bed` | Rabbora Orlando Slatted Ottoman Bed | £306.59 | £420.00 | 26 | 27% off | White, Pink, Beige | `plush-mustard`, `marble-oatmeal`, `plush-pink`, `plush-cream` | 5 | 89 | `slatted/img-30.png`, `slatted/img-28.png`, `slatted/img-29.png`, `slatted/img-31.png`, `slatted/img-27.png` |
| 7 | `richmond-slatted-ottoman-bed` | Rabbora Kendal Slatted Wingback Bed | £299.00 | £444.00 | 25 | 33% off | Green, Brown, Black | `crushed-velvet-black`, `coniston-blue`, `naples-steel`, `plush-cream` | 5 | 180 | `slatted/img-35.png`, `slatted/img-34.png`, `slatted/img-33.png`, `slatted/img-32.png`, `slatted/img-36.png` |
| 8 | `cambridge-slatted-ottoman-bed` | Rabbora Teddy Orlando Slatted Ottoman Bed | £306.59 | £420.00 | 26 | 27% off | Grey, White, Brown | `marble-oatmeal`, `cream-boucle`, `plush-silver`, `naples-steel` | 4 | 193 | `slatted/34.png`, `slatted/35.png`, `slatted/36.png`, `slatted/37.png` |
| 9 | `victoria-ottoman-bed` | Rabbora Park Lane Ambassador Slatted Bed | £449.00 | £600.00 | 38 | 25% off | Cream, Black, Pink | `coniston-emerald`, `marble-silver`, `plush-mustard`, `naples-black` | 4 | 185 | `slatted/38.png`, `slatted/39.png`, `slatted/img-37.png`, `slatted/img-39.png` |
| 10 | `oxford-slatted-ottoman-bed` | Rabbora Brooklyn Slatted Bed | £299.00 | £420.00 | 25 | 29% off | White, Beige, Cream | `crushed-velvet-cream`, `coniston-pink`, `marble-silver`, `coniston-emerald` | 5 | 85 | `slatted/40.png`, `slatted/41.png`, `slatted/43.png`, `slatted/42.png` |
| 11 | `chester-slatted-ottoman-bed` | Rabbora Washington Slatted Bed | £349.00 | £599.00 | 30 | 42% off | Brown, Silver, Pink | `plush-mustard`, `plush-cream`, `pink-boucle`, `plush-green` | 4 | 46 | `slatted/45.png`, `slatted/47.png`, `slatted/46.png`, `slatted/44.png` |
| 12 | `kingston-ottoman-bed` | Rabbora Nevada Slatted Ottoman Bed | £299.00 | £420.00 | 25 | 29% off | Silver, Blue, Black | `crushed-velvet-black`, `marble-platinum`, `plush-grey`, `plush-green` | 5 | 153 | `slatted/48.png`, `slatted/50.png`, `slatted/49.png` |
| 13 | `manhattan-slatted-ottoman-bed` | Rabbora Hawaii Cream Slatted Ottoman Bed | £239.00 | £420.00 | 20 | 43% off | Black, Blue, Cream | `plush-cream`, `naples-black`, `plush-grey`, `coniston-blue` | 4 | 93 | `slatted/84.png`, `slatted/85.jfif`, `slatted/86.png` |
| 14 | `brighton-slatted-ottoman-bed` | Rabbora Ibiza Slatted Upholstered Bed | £389.00 | £499.00 | 33 | 22% off | Cream, Blue, Grey | `crushed-velvet-mink`, `naples-silver`, `coniston-almond`, `plush-pink` | 5 | 181 | `slatted/87.png`, `slatted/88.jfif`, `slatted/89.png` |
| 15 | `lancaster-ottoman-bed` | Rabbora Tokyo Sunrise Slatted Ottoman Bed | £289.00 | £420.00 | 25 | 31% off | Silver, Pink, Green | `naples-steel`, `plush-silver`, `marble-silver`, `crushed-velvet-cream` | 4 | 110 | `slatted/90.png`, `slatted/91.jfif`, `slatted/92.jfif` |
| 16 | `bristol-slatted-ottoman-bed` | Rabbora Malaga Slatted Designer Bed | £275.00 | £360.00 | 23 | 24% off | Black, Blue, Brown | `plush-green`, `naples-ivory`, `crushed-velvet-black`, `plush-cream` | 5 | 50 | `slatted/93.png`, `slatted/95.jfif`, `slatted/94.jfif` |
| 17 | `soho-slatted-ottoman-bed` | Rabbora Madrid Slatted Ottoman Bed | £349.00 | £420.00 | 30 | 17% off | Green, Blue, Pink | `coniston-emerald`, `plush-green`, `plush-mustard`, `plush-pink` | 4 | 200 | `slatted/96.jfif`, `slatted/97.jfif`, `slatted/98.jfif` |
| 18 | `belgravia-ottoman-bed` | Rabbora Lisbon Slatted Ottoman Bed | £349.00 | £420.00 | 30 | 17% off | Silver, Grey, Beige | `crushed-velvet-black`, `naples-steel`, `crushed-velvet-cream`, `plush-grey` | 5 | 23 | `slatted/99.jfif`, `slatted/101.png`, `slatted/100.png` |
| 19 | `fulham-slatted-ottoman-bed` | Rabbora Rome Slatted Wingback Bed | £389.00 | £478.80 | 33 | 19% off | Beige, Blue, Cream | `naples-steel`, `coniston-armour`, `plush-green`, `naples-ivory` | 5 | 36 | `slatted/102.png`, `slatted/103.png`, `slatted/104.png` |
| 20 | `chiswick-slatted-ottoman-bed` | Rabbora Mona Lisa Slatted Ottoman Bed | £299.00 | £420.00 | 25 | 29% off | Beige, Silver, Blue | `naples-steel`, `pink-boucle`, `naples-ivory`, `coniston-pink` | 5 | 165 | `slatted/105.jfif`, `slatted/106.jfif`, `slatted/107.jfif` |
| 21 | `greenwich-ottoman-bed` | Rabbora Barcelona Slatted Bed | £349.00 | £420.00 | 30 | 17% off | Silver, Grey, Brown | `marble-platinum`, `coniston-blue`, `plush-silver`, `plush-green` | 5 | 123 | `slatted/108.jfif`, `slatted/109.jfif`, `slatted/110.jfif` |
| 22 | `camden-slatted-ottoman-bed` | Rabbora Florence Slatted Designer Bed | £399.00 | £478.80 | 34 | 17% off | Cream, Black, Green | `crushed-velvet-black`, `naples-black`, `coniston-almond`, `coniston-pink` | 4 | 67 | `slatted/111.png`, `slatted/112.jfif`, `slatted/113.jfif` |
| 23 | `notting-hill-slatted-ottoman-bed` | Rabbora Duke Slatted Luxury Wide Headboard Bed | £799.00 | £1,000.00 | 67 | 20% off | Grey, Silver, Beige | `coniston-charcoal`, `plush-silver`, `plush-mustard`, `crushed-velvet-black` | 4 | 131 | `slatted/114.png`, `slatted/116.png`, `slatted/115.png` |
| 24 | `marylebone-ottoman-bed` | Rabbora Golden Crown Slatted Ottoman Bed | £349.00 | £549.00 | 30 | 36% off | Grey, Brown, Black | `marble-silver`, `plush-silver`, `plush-cream`, `coniston-emerald` | 5 | 72 | `slatted/118.png`, `slatted/117.png`, `slatted/119.png` |
| 25 | `highgate-slatted-ottoman-bed` | Rabbora Avon Slatted Triple Panel Bed | £349.00 | £420.00 | 30 | 17% off | Green, Cream, Beige | `coniston-blue`, `pink-boucle`, `crushed-velvet-black`, `plush-green` | 5 | 126 | `slatted/51.png`, `slatted/52.png`, `slatted/53.png` |
| 26 | `hampstead-slatted-ottoman-bed` | Rabbora Duchess Slatted La Rosa Bed | £299.00 | £414.00 | 25 | 28% off | Green, Blue, Cream | `plush-silver`, `coniston-blue`, `plush-black`, `crushed-velvet-cream` | 5 | 206 | `slatted/54.png`, `slatted/56.png`, `slatted/55.png` |
| 27 | `clapham-ottoman-bed` | Rabbora Osaka Slatted Upholstered Bed | £389.00 | £499.00 | 33 | 22% off | Beige, Brown, Silver | `crushed-velvet-mink`, `plush-steel`, `plush-green`, `marble-platinum` | 4 | 65 | `slatted/57.png`, `slatted/58.png`, `slatted/59.png` |
| 28 | `islington-slatted-ottoman-bed` | Rabbora Jersey Slatted Ottoman Bed | £249.00 | £420.00 | 21 | 41% off | Black, Beige, White | `plush-green`, `crushed-velvet-cream`, `crushed-velvet-silver`, `plush-black` | 5 | 38 | `slatted/120.png`, `slatted/60.png`, `slatted/61.png` |
| 29 | `shoreditch-slatted-ottoman-bed` | Rabbora Victoria Slatted Designer Bed | £299.00 | £360.00 | 25 | 17% off | Pink, Silver, Blue | `cream-boucle`, `plush-steel`, `plush-grey`, `naples-black` | 5 | 135 | `slatted/62.png`, `slatted/64.png`, `slatted/63.png` |
| 30 | `southbank-ottoman-bed` | Rabbora Thames Slatted Wingback Bed | £319.00 | £420.00 | 27 | 24% off | Cream, Green, Black | `marble-silver`, `naples-steel`, `plush-pink`, `plush-beige` | 4 | 107 | `slatted/65.png`, `slatted/67.png`, `slatted/66.png` |
| 31 | `kew-slatted-ottoman-bed` | Rabbora Cloud Slatted Boucle Bed | £789.00 | £1,399.00 | 66 | 44% off | Silver, Cream, Black | `marble-oatmeal`, `crushed-velvet-black`, `plush-beige`, `plush-green` | 5 | 20 | `slatted/68.png`, `slatted/70.png`, `slatted/69.png` |
| 32 | `putney-slatted-ottoman-bed` | Rabbora Las Vegas Slatted Luxury High Headboard Bed | £749.00 | £1,000.00 | 63 | 25% off | White, Beige, Black | `plush-beige`, `crushed-velvet-mink`, `naples-silver`, `plush-turquoise` | 5 | 57 | `slatted/71.png`, `slatted/74.png`, `slatted/73.png`, `slatted/72.png` |
| 33 | `wimbledon-ottoman-bed` | Rabbora Paris Slatted Linear Bed | £349.00 | £420.00 | 30 | 17% off | Grey, White, Cream | `coniston-pink`, `marble-oatmeal`, `coniston-armour`, `plush-silver` | 4 | 41 | `slatted/75.png`, `slatted/77.png`, `slatted/76.png` |
| 34 | `dulwich-slatted-ottoman-bed` | Rabbora Skyscraper Slatted Art Deco Bed | £299.00 | £420.00 | 25 | 29% off | Silver, Pink, Cream | `crushed-velvet-black`, `plush-turquoise`, `coniston-pink`, `plush-grey` | 4 | 207 | `slatted/78.png`, `slatted/121.png`, `slatted/79.png` |
| 35 | `ealing-slatted-ottoman-bed` | Rabbora Torino Slatted Designer Bed | £290.00 | £396.00 | 25 | 27% off | White, Grey, Pink | `coniston-pink`, `coniston-almond`, `plush-silver`, `plush-beige` | 5 | 159 | `slatted/80.png`, `slatted/122.png`, `slatted/81.png` |
| 36 | `harrow-ottoman-bed` | Rabbora Sheffield Slatted Studded Bed | £349.00 | £456.00 | 30 | 23% off | Cream, Beige, Pink | `marble-silver`, `marble-platinum`, `coniston-pink`, `crushed-velvet-mink` | 4 | 108 | `slatted/82.png`, `slatted/123.png`, `slatted/83.png` |
| 37 | `barnet-slatted-ottoman-bed` | Rabbora Cannes Slatted Ottoman Bed | £399.00 | £499.00 | 34 | 20% off | Beige, Black, Cream | `coniston-blue`, `plush-black`, `pink-boucle`, `coniston-pink` | 5 | 24 | `slatted/82.jfif`, `slatted/123.jfif`, `slatted/83.jfif` |
| 38 | `farringdon-slatted-ottoman-bed` | Rabbora Teddy Zen Slatted Boucle Ottoman Bed | £599.00 | £1,399.00 | 50 | 57% off | Brown, White, Silver | `pink-boucle`, `plush-silver`, `plush-pink`, `crushed-velvet-black` | 5 | 48 | `slatted/198.png`, `slatted/199.jfif`, `slatted/200.png` |
| 39 | `barbican-slatted-ottoman-bed` | Rabbora Venice Slatted Linear Ottoman Bed | £314.99 | £372.00 | 27 | 15% off | Green, Cream, Brown | `coniston-charcoal`, `coniston-pink`, `plush-pink`, `plush-mustard` | 4 | 125 | `slatted/195.png`, `slatted/196.jfif`, `slatted/197.jfif` |
| 40 | `angel-ottoman-bed` | Rabbora Geneva Slatted High & Wide Headboard Bed | £749.00 | £1,000.00 | 63 | 25% off | Pink, Black, White | `cream-boucle`, `naples-ivory`, `naples-black`, `coniston-pink` | 5 | 175 | `slatted/192.jfif`, `slatted/193.jfif`, `slatted/194.jfif` |
| 41 | `finsbury-slatted-ottoman-bed` | Rabbora Zurich Slatted Ottoman Bed | £299.00 | £420.00 | 25 | 29% off | Pink, Brown, White | `naples-steel`, `cream-boucle`, `naples-black`, `crushed-velvet-cream` | 4 | 89 | `slatted/189.jfif`, `slatted/190.jfif`, `slatted/191.jfif` |
| 42 | `whitechapel-slatted-ottoman-bed` | Rabbora Arizona Slatted Ottoman Bed | £289.00 | — | 25 | — | White, Black, Blue | `naples-silver`, `plush-pink`, `pink-boucle`, `coniston-armour` | 5 | 64 | `slatted/186.jfif`, `slatted/187.jfif`, `slatted/188.png` |
| 43 | `aldgate-ottoman-bed` | Rabbora Golden Ibiza Slatted Linear Bed | £389.00 | £499.00 | 33 | 22% off | Beige, Green, Blue | `coniston-pink`, `naples-ivory`, `crushed-velvet-black`, `cream-boucle` | 4 | 79 | `slatted/183.jfif`, `slatted/184.jfif`, `slatted/185.png` |
| 44 | `stratford-slatted-ottoman-bed` | Rabbora Sheffield Slatted Upholstered Bed | £295.00 | £456.00 | 25 | 35% off | Pink, White, Green | `coniston-emerald`, `plush-turquoise`, `naples-steel`, `plush-beige` | 4 | 93 | `slatted/180.png`, `slatted/181.jfif`, `slatted/182.jfif` |
| 45 | `hackney-wick-slatted-ottoman-bed` | Rabbora Yukon Slatted Wing Bed | £294.00 | £420.00 | 25 | 30% off | Black, Pink, Blue | `plush-black`, `plush-pink`, `plush-turquoise`, `naples-black` | 5 | 208 | `slatted/177.jfif`, `slatted/178.jfif`, `slatted/179.jfif` |
| 46 | `bow-ottoman-bed` | Rabbora Presidential Slatted Ottoman Bed | £749.00 | £1,052.00 | 63 | 29% off | Beige, Pink, Green | `crushed-velvet-black`, `cream-boucle`, `plush-turquoise`, `plush-cream` | 5 | 48 | `slatted/174.png`, `slatted/175.png`, `slatted/176.jfif` |
| 47 | `poplar-slatted-ottoman-bed` | Rabbora Montana Ambassador Slatted Bed | £599.00 | £800.00 | 50 | 25% off | Beige, White, Cream | `coniston-charcoal`, `marble-oatmeal`, `naples-silver`, `plush-beige` | 5 | 170 | `slatted/171.jfif`, `slatted/172.png`, `slatted/173.jfif` |
| 48 | `limehouse-slatted-ottoman-bed` | Rabbora Amalfi Slatted Italian Style Ottoman Bed | £299.00 | £599.00 | 25 | 50% off | Green, Silver, Grey | `crushed-velvet-black`, `plush-beige`, `plush-turquoise`, `coniston-almond` | 5 | 29 | `slatted/168.jfif`, `slatted/169.png`, `slatted/170.jfif` |
| 49 | `rotherhithe-ottoman-bed` | Rabbora Teddy Wave Slatted Ottoman Bed | £449.00 | £520.00 | 38 | 14% off | Silver, Pink, Brown | `plush-silver`, `coniston-armour`, `marble-platinum`, `naples-ivory` | 5 | 105 | `slatted/165.jfif`, `slatted/166.jfif`, `slatted/167.png` |
| 50 | `deptford-slatted-ottoman-bed` | Rabbora Black Plush Golden Pyramid Slatted Ottoman Bed | £539.00 | £649.00 | 45 | 17% off | Blue, Brown, Beige | `plush-beige`, `plush-steel`, `naples-steel`, `coniston-charcoal` | 4 | 56 | `slatted/160.jfif`, `slatted/161.jfif`, `slatted/162.jfif` |
| 51 | `new-cross-slatted-ottoman-bed` | Rabbora Bahamas Slatted Luxury Wide Headboard Bed | £749.00 | £1,000.00 | 63 | 25% off | Pink, Grey, Silver | `marble-platinum`, `crushed-velvet-cream`, `coniston-pink`, `plush-beige` | 5 | 131 | `slatted/157.jfif`, `slatted/158.jfif`, `slatted/159.png` |
| 52 | `catford-ottoman-bed` | Rabbora Riviera Slatted High Headboard Bed | £549.00 | £900.00 | 46 | 39% off | Cream, Grey, Brown | `plush-cream`, `naples-steel`, `crushed-velvet-black`, `plush-steel` | 5 | 187 | `slatted/154.jfif`, `slatted/155.jfif`, `slatted/156.jfif` |
| 53 | `sydenham-slatted-ottoman-bed` | Rabbora New York Slatted Tall Headboard Bed | £799.00 | £900.00 | 67 | 11% off | Green, Silver, Beige | `naples-steel`, `plush-beige`, `plush-turquoise`, `marble-platinum` | 5 | 92 | `slatted/153.png`, `slatted/152.png`, `slatted/151.png` |
| 54 | `crystal-palace-slatted-ottoman-bed` | Rabbora Grand Slatted Luxury Upholstered Bed | £1,199.00 | £1,499.00 | 100 | 20% off | Cream, Black, Pink | `coniston-pink`, `coniston-charcoal`, `crushed-velvet-black`, `naples-steel` | 5 | 187 | `slatted/148.jfif`, `slatted/149.png`, `slatted/150.jfif` |
| 55 | `norwood-ottoman-bed` | Rabbora Silver Fern Slatted High Headboard Bed | £549.00 | £900.00 | 46 | 39% off | Black, Brown, Pink | `plush-beige`, `naples-black`, `coniston-charcoal`, `plush-turquoise` | 5 | 209 | `slatted/147.png`, `slatted/145.png`, `slatted/146.jfif` |
| 56 | `streatham-slatted-ottoman-bed` | Rabbora Marble Bahamas Slatted Luxury Bed | £799.00 | £1,000.00 | 67 | 20% off | White, Black, Grey | `plush-silver`, `marble-silver`, `coniston-pink`, `coniston-blue` | 5 | 38 | `slatted/142.jfif`, `slatted/143.jfif`, `slatted/144.jfif` |
| 57 | `balham-slatted-ottoman-bed` | Rabbora Duke of Orlando Slatted Wide Headboard Bed | £799.00 | £1,000.00 | 67 | 20% off | Green, Black, Cream | `cream-boucle`, `plush-cream`, `naples-ivory`, `crushed-velvet-silver` | 5 | 165 | `slatted/140.jfif`, `slatted/139.png`, `slatted/141.jfif` |
| 58 | `tooting-ottoman-bed` | Rabbora Ascot Slatted Tall Headboard Bed | £799.00 | £900.00 | 67 | 11% off | Silver, Cream, White | `plush-pink`, `coniston-pink`, `plush-black`, `plush-green` | 5 | 41 | `slatted/136.jfif`, `slatted/137.jfif`, `slatted/138.jfif` |
| 59 | `earlsfield-slatted-ottoman-bed` | Rabbora Teddy Duke Slatted Wide Headboard Bed | £849.00 | £1,000.00 | 71 | 15% off | Green, Silver, White | `marble-oatmeal`, `cream-boucle`, `crushed-velvet-black`, `plush-silver` | 5 | 187 | `slatted/133.png`, `slatted/135.jfif`, `slatted/134.jfif` |
| 60 | `raynes-park-slatted-ottoman-bed` | Rabbora Astoria Slatted Deco Ottoman Bed | £299.00 | £599.00 | 25 | 50% off | Grey, Beige, White | `marble-platinum`, `crushed-velvet-black`, `naples-black`, `coniston-pink` | 5 | 18 | `slatted/129.png`, `slatted/131.jfif`, `slatted/132.jfif` |

Shared by all 60: delivery "Handmade to order, with fast delivery options available on selected sizes and fabrics."; warranty "24 month warranty"; returns "30-day easy returns on unused, unassembled beds.". Per-product text: Appendix F.

### 4.9 Rapid Delivery Beds — `rapid-delivery-beds.js` → `RAPID_DELIVERY_PRODUCTS` (31)

Fields: `id, slug, name, type, price, oldPrice, monthlyPrice, rating, reviewCount, badge, shortInfo, description, availableSizeLabels, availableSizes, features, dimensions, delivery, warranty, returns, images`. Every product: all 5 sizes; `dimensions` per size (§6). `type` is Upholstered (12), Storage (10) or Ottoman (9). Slugs are `rapid-1` … `rapid-31`. All images are from `solid/`.

| id | slug | name | type | price | oldPrice | monthly | badge | rating | reviews | images |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `rapid-1` | Rabbora Athens Linear Bed | Upholstered | £289.00 | £400.00 | 25 | 28% off | 4 | 0 | `solid/1.jfif`, `solid/2.jfif`, `solid/3.jfif` |
| 2 | `rapid-2` | Rabbora Brooklyn Bed Frame | Upholstered | £299.00 | £420.00 | 25 | 29% off | 4 | 0 | `solid/4.jfif`, `solid/5.jfif`, `solid/6.jfif` |
| 3 | `rapid-3` | Rabbora Chicago High Headboard Bed | Upholstered | £349.00 | £420.00 | 30 | 17% off | 4 | 0 | `solid/7.jfif`, `solid/8.jfif`, `solid/9.jfif` |
| 4 | `rapid-4` | Rabbora Empire Ottoman Bed | Ottoman | £289.00 | £420.00 | 25 | 31% off | 4 | 0 | `solid/10.jfif`, `solid/11.jfif`, `solid/12.jfif` |
| 5 | `rapid-5` | Rabbora Hawaii Cream Bouclé Bed | Ottoman | £239.00 | £420.00 | 20 | 43% off | 4 | 0 | `solid/13.jfif`, `solid/14.jfif`, `solid/15.jfif` |
| 6 | `rapid-6` | Rabbora Kendal Wingback Bed | Upholstered | £299.00 | £444.00 | 25 | 33% off | 4 | 0 | `solid/16.jfif`, `solid/17.jfif`, `solid/18.jfif` |
| 7 | `rapid-7` | Rabbora Lisbon Ottoman Bed | Ottoman | £349.00 | £420.00 | 30 | 17% off | 4 | 0 | `solid/19.jfif`, `solid/20.jfif`, `solid/21.jfif` |
| 8 | `rapid-8` | Rabbora Málaga Designer Bed | Upholstered | £275.00 | £360.00 | 23 | 24% off | 4 | 0 | `solid/22.jfif`, `solid/23.jfif`, `solid/24.jfif` |
| 9 | `rapid-9` | Rabbora Manhattan Bed Frame | Upholstered | £249.00 | £429.00 | 21 | 42% off | 4 | 0 | `solid/25.jfif`, `solid/26.jfif`, `solid/27.jfif` |
| 10 | `rapid-10` | Rabbora Milan Wingback Bed | Ottoman | £259.00 | £420.00 | 22 | 38% off | 4 | 0 | `solid/28.jfif`, `solid/29.jfif`, `solid/30.jfif` |
| 11 | `rapid-11` | Rabbora Mona Lisa Bed | Ottoman | £299.00 | £420.00 | 25 | 29% off | 4 | 0 | `solid/31.jfif`, `solid/32.jfif`, `solid/33.jfif` |
| 12 | `rapid-12` | Rabbora Nevada Bed Frame | Upholstered | £299.00 | £420.00 | 25 | 29% off | 4 | 0 | `solid/34.jfif`, `solid/35.jfif`, `solid/36.jfif` |
| 13 | `rapid-13` | Rabbora Orlando Ottoman Bed | Ottoman | £306.59 | £420.00 | 26 | 27% off | 4 | 0 | `solid/37.jfif`, `solid/38.jfif`, `solid/39.jfif` |
| 14 | `rapid-14` | Rabbora Princess Signature Bed | Upholstered | £349.00 | £420.00 | 30 | 17% off | 4 | 0 | `solid/40.jfif`, `solid/41.jfif`, `solid/42.jfif` |
| 15 | `rapid-15` | Rabbora Amalfi Italian Style Bed | Ottoman | £299.00 | £599.00 | 25 | 50% off | 4 | 0 | `solid/43.jfif`, `solid/44.jfif`, `solid/45.jfif` |
| 16 | `rapid-16` | Rabbora Teddy-Orlando Ottoman Bed | Ottoman | £306.59 | £420.00 | 26 | 27% off | 4 | 0 | `solid/46.jfif`, `solid/47.jfif`, `solid/48.jfif` |
| 17 | `rapid-17` | Rabbora Tokyo Sunrise Ottoman Bed | Ottoman | £289.00 | £420.00 | 25 | 31% off | 4 | 0 | `solid/49.jfif`, `solid/50.jfif`, `solid/51.jfif` |
| 18 | `rapid-18` | Rabbora Torino Bumper Bed | Upholstered | £290.00 | £396.00 | 25 | 27% off | 4 | 0 | `solid/52.jfif`, `solid/53.jfif`, `solid/54.jfif` |
| 19 | `rapid-19` | Rabbora Washington Bed Frame | Upholstered | £349.00 | £599.00 | 30 | 42% off | 4 | 0 | `solid/55.jfif`, `solid/56.jfif`, `solid/57.jfif` |
| 20 | `rapid-20` | Rabbora Duchess of La Rosa Bed | Upholstered | £299.00 | £414.00 | 25 | 28% off | 4 | 0 | `solid/58.jfif`, `solid/59.jfif`, `solid/60.jfif` |
| 21 | `rapid-21` | Rabbora Art Deco Bed | Upholstered | £252.00 | £420.00 | 21 | 40% off | 4 | 0 | `solid/61.jfif`, `solid/62.jfif`, `solid/63.jfif` |
| 22 | `rapid-22` | Rabbora Art Deco Storage Bed | Storage | £299.00 | £380.00 | 25 | 21% off | 4 | 0 | `solid/64.jfif`, `solid/65.jfif`, `solid/66.jfif` |
| 23 | `rapid-23` | Rabbora Brooklyn Storage Bed | Storage | £299.00 | £380.00 | 25 | 21% off | 4 | 0 | `solid/67.jfif`, `solid/68.jfif`, `solid/69.jfif` |
| 24 | `rapid-24` | Rabbora Divan Hawaii Storage Bed | Storage | £299.00 | £380.00 | 25 | 21% off | 4 | 0 | `solid/70.jfif`, `solid/71.jfif`, `solid/72.jfif` |
| 25 | `rapid-25` | Rabbora Dover Designer Storage Bed | Storage | £299.00 | £400.00 | 25 | 25% off | 4 | 0 | `solid/73.jfif`, `solid/74.jfif`, `solid/75.jfif` |
| 26 | `rapid-26` | Rabbora Golden Skyline Storage Bed | Storage | £399.00 | £499.00 | 34 | 20% off | 4 | 0 | `solid/76.jfif`, `solid/77.jfif`, `solid/78.jfif` |
| 27 | `rapid-27` | Rabbora Lyon Storage Bed | Storage | £299.00 | £380.00 | 25 | 21% off | 4 | 0 | `solid/79.jfif`, `solid/80.jfif`, `solid/81.jfif` |
| 28 | `rapid-28` | Rabbora Mayfair Storage Bed | Storage | £299.00 | £380.00 | 25 | 21% off | 4 | 0 | `solid/82.jfif`, `solid/83.jfif`, `solid/84.jfif` |
| 29 | `rapid-29` | Rabbora Mona Lisa Storage Bed | Storage | £299.00 | £380.00 | 25 | 21% off | 4 | 0 | `solid/85.jfif`, `solid/86.jfif`, `solid/87.jfif` |
| 30 | `rapid-30` | Rabbora Toronto Lux Storage Bed | Storage | £399.00 | £499.00 | 34 | 20% off | 4 | 0 | `solid/88.jfif`, `solid/89.jfif`, `solid/90.jfif` |
| 31 | `rapid-31` | Rabbora Virginia Storage Bed | Storage | £299.00 | £370.00 | 25 | 19% off | 4 | 0 | `solid/91.jfif`, `solid/92.jfif`, `solid/93.jfif` |

Shared by all 31: delivery "Rapid Delivery on selected sizes and fabrics — see delivery process below."; warranty "24 month warranty"; returns "30-day easy returns on unused, unassembled beds.". Per-product text: Appendix F.

### 4.10 High Headboard Beds — `high-headboard-beds.js` → `HH_BED_PRODUCTS` (14)

Fields: `id, slug, name, price, oldPrice, monthly, rating, reviews, badge, headboardHeight, shortInfo, description, sizes, features, dimensions, delivery, warranty, returns, image, gallery`. `image` = cart image; `gallery` = detail gallery. Every product: all 5 sizes; `dimensions` per size (§6). `headboardHeight` is descriptive text (130cm ×5, 140cm ×5, 150cm ×4).

| id | slug | name | price | oldPrice | monthly | badge | headboard | rating | reviews | `image` | `gallery` |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `high-headboard-bed-1` | Rabbora Duke High & Wide Headboard Bed | £799.00 | £1,000.00 | 67 | 20% off | 130cm | 5 | 20 | `high/1.jfif` | `high/1.jfif`, `high/2.jfif`, `high/3.jfif`, `high/4.jfif` |
| 2 | `high-headboard-bed-2` | Rabbora Las Vegas High Headboard Bed | £749.00 | £1,000.00 | 63 | 25% off | 140cm | 5 | 33 | `high/5.jfif` | `high/5.jfif`, `high/6.jfif`, `high/7.jfif`, `high/8.jfif` |
| 3 | `high-headboard-bed-3` | Rabbora Athena High Headboard Bed | £699.00 | £900.00 | 59 | 22% off | 150cm | 4 | 46 | `high/9.jfif` | `high/9.jfif`, `high/10.jfif`, `high/11.jfif`, `high/12.jfif` |
| 4 | `high-headboard-bed-4` | Rabbora Chicago High Headboard Bed | £349.00 | £420.00 | 30 | 17% off | 130cm | 5 | 59 | `high/13.jfif` | `high/13.jfif`, `high/14.jfif`, `high/15.jfif`, `high/16.jfif` |
| 5 | `high-headboard-bed-5` | Rabbora Model Square Hotel Bed | £649.00 | £1,000.00 | 55 | 35% off | 140cm | 5 | 72 | `high/17.jfif` | `high/17.jfif`, `high/18.jfif`, `high/19.jfif` |
| 6 | `high-headboard-bed-6` | Rabbora Starlight Luxury Bed | £599.00 | £900.00 | 50 | 33% off | 150cm | 4 | 85 | `high/20.jfif` | `high/20.jfif`, `high/21.jfif`, `high/22.jfif`, `high/23.jfif` |
| 7 | `high-headboard-bed-7` | Rabbora DaVinci Tall Headboard Bed | £749.00 | £900.00 | 63 | 17% off | 130cm | 5 | 98 | `high/24.jfif` | `high/24.jfif`, `high/25.jfif`, `high/26.jfif`, `high/27.jfif` |
| 8 | `high-headboard-bed-8` | Rabbora Geneva High & Wide Headboard Bed | £749.00 | £1,000.00 | 63 | 25% off | 140cm | 5 | 111 | `high/28.jfif` | `high/28.jfif`, `high/29.jfif`, `high/30.jfif`, `high/31.jfif` |
| 9 | `high-headboard-bed-9` | Rabbora Bahamas Wide Headboard Bed | £749.00 | £1,000.00 | 63 | 25% off | 150cm | 4 | 124 | `high/32.jfif` | `high/32.jfif`, `high/33.jfif`, `high/34.jfif` |
| 10 | `high-headboard-bed-10` | Rabbora Riviera High Headboard Bed | £549.00 | £900.00 | 46 | 39% off | 130cm | 5 | 137 | `high/35.jfif` | `high/35.jfif`, `high/36.jfif`, `high/37.jfif` |
| 11 | `high-headboard-bed-11` | Rabbora New York Tall Headboard Bed | £799.00 | £900.00 | 67 | 11% off | 140cm | 5 | 150 | `high/40.png` | `high/40.png`, `high/38.png`, `high/39.png` |
| 12 | `high-headboard-bed-12` | Rabbora Grand Luxury Upholstered Bed | £1,199.00 | £1,499.00 | 100 | 20% off | 150cm | 4 | 163 | `high/41.jfif` | `high/41.jfif`, `high/42.png`, `high/43.jfif` |
| 13 | `high-headboard-bed-13` | Rabbora Silver Fern High Headboard Bed | £799.00 | £900.00 | 67 | 39% off | 130cm | 5 | 176 | `high/44.jfif` | `high/44.jfif`, `high/45.png`, `high/46.jfif` |
| 14 | `high-headboard-bed-14` | Rabbora Marble Bahamas Wide Headboard Bed | £549.00 | £900.00 | 46 | 20% off | 140cm | 5 | 189 | `high/49.png` | `high/49.png`, `high/47.png`, `high/48.jfif` |

Shared by all 14: delivery "Handmade to order, with standard UK delivery included."; warranty "24 month warranty"; returns "30-day easy returns on unused, unassembled beds.". Per-product text: Appendix F.

### 4.11 Kids' Beds — `kids-beds.js` → `KIDS_BED_PRODUCTS` (5)

Fields: `id, slug, name, images, price, oldPrice, monthly, rating, reviews, badge, shortInfo, description, sizes, features, dimensions, delivery, warranty, returns`. `images` are taken from a separate constant `KIDS_BED_IMAGES` (all in `tv/`). Sizes: **Single and Small Double only**.

| id | slug | name | price | oldPrice | monthly | badge | rating | reviews | images |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `kids-bed-1` | Harper Kids Bed | £449.00 | £599.00 | 38 | 25% Off | 5 | 0 | `tv/img-6.jfif`, `tv/img-30.png`, `tv/img-12.png` |
| 2 | `kids-bed-2` | Luna Kids Bed | £449.00 | £599.00 | 38 | 25% Off | 0 | 0 | `tv/img-7.jfif`, `tv/img-13.png`, `tv/img-15.png` |
| 3 | `kids-bed-3` | Mia Kids Bed | £449.00 | £599.00 | 38 | 25% Off | 5 | 0 | `tv/img-8.jfif`, `tv/img-16.png`, `tv/img-17.png` |
| 4 | `kids-bed-4` | Oliver Kids Bed | £449.00 | £599.00 | 38 | 25% Off | 0 | 0 | `tv/img-10.jfif`, `tv/img-18.png`, `tv/img-19.png` |
| 5 | `kids-bed-5` | Aria Kids Bed | £499.00 | £599.00 | 42 | 17% Off | 5 | 0 | `tv/img-11.jfif`, `tv/img-20.png`, `tv/img-21.png` |

Shared by all 5: delivery "Handmade to order, with standard UK delivery included."; warranty "24 month warranty"; returns "30-day easy returns on unused, unassembled beds.". Per-product text: Appendix F.

### 4.12 Luxury Mattresses — `mattresses.js` → `MATTRESS_PRODUCTS_LIST` (16)

Fields: `id, slug, name, mattressType, mattressTypeLabel, price, oldPrice, monthlyPrice, rating, reviewCount, badge, firmness, availableSizes, materials, description, features, warranty, delivery, colour, images`. `mattressType` / label: `hybrid` Hybrid, `orthopaedic` Orthopaedic, `memory-foam` Memory Foam, `pocket-spring` Pocket Spring (4 each). `colour` is a hex colour per type (`#3f6b5e`, `#4a6b82`, `#7d7690`, `#a48a6a`). Sizes for all 16: `Small Double`, `Double`, `King Size`, `Super King` (**no Single; "King Size", not "King"**). Badges are text such as "29% Off" (capital O). **15 of 16 slugs do not match names** (e.g. `pillowtop-2000` = "Chicago 3000 Pocket Sprung Ultimate Luxury Mattress").

| id | slug | name | type | price | oldPrice | monthly | badge | firmness | rating | reviews | images |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `bedzone-hybrid-memory-pocket-spring` | Bedzone Hybrid Memory Pocket Spring Mattress | Hybrid | £279.00 | — | 24 | — | Medium / Firm | 5 | 0 | `images/img-23.webp`, `images/img-142.webp`, `images/img-143.png` |
| 2 | `orthopaedic-zero-gravity` | Healthopaedic Zero Gravity Orthoflex Mattress | Orthopaedic | £299.00 | £499.00 | 25 | 40% Off | Firm | 5 | 0 | `images/img-144.webp`, `images/img-145.webp`, `images/img-146.png` |
| 3 | `pillowtop-2000` | Chicago 3000 Pocket Sprung Ultimate Luxury Mattress | Memory Foam | £549.00 | — | 46 | — | Soft / Medium | 5 | 0 | `images/img-73.png`, `images/img-147.webp`, `images/img-148.jpg` |
| 4 | `luxury-pocket-spring` | Healthopaedic Pillowtop 3000 Mattress | Pocket Spring | £499.00 | £699.00 | 42 | 29% Off | Medium / Firm | 0 | 0 | `images/img-72.png`, `images/img-149.png`, `images/img-150.webp` |
| 5 | `cloudrest-memory-foam` | Healthopedic Zero Gravity ZenFloat 1000 Mattress | Memory Foam | £399.00 | £549.00 | 34 | 27% Off | Soft | 5 | 0 | `images/img-74.png`, `images/img-151.jpg`, `images/img-152.png` |
| 6 | `harmony-hybrid-deluxe` | Backcare Luxury 2000 Pocket Mattress | Hybrid | £299.00 | — | 25 | — | Medium | 0 | 0 | `images/img-99.png`, `images/img-153.jpg`, `images/img-154.jpg` |
| 7 | `firmsupport-orthopaedic-pro` | 1000 CoolGel Mattress | Orthopaedic | £299.00 | — | 25 | — | Firm | 0 | 0 | `images/img-78.png`, `images/img-155.jpg`, `images/img-156.webp` |
| 8 | `serenity-pocket-1000` | California Pillow Top Mattress | Pocket Spring | £299.00 | — | 25 | — | Medium / Firm | 0 | 0 | `images/img-157.webp`, `images/img-158.webp`, `images/img-159.webp` |
| 9 | `dreamsoft-memory-foam` | Orion 1000 Pocket Sprung Luxury Mattress | Memory Foam | £229.00 | — | 20 | — | Soft / Medium | 4 | 0 | `images/img-128.jpg`, `images/img-160.png`, `images/img-161.png` |
| 10 | `everest-hybrid-support` | MTRS Comfort Dynamics 1000 Mattress | Hybrid | £380.00 | £699.00 | 32 | 46% Off | Medium / Firm | 0 | 0 | `images/img-126.jfif`, `images/img-162.png`, `images/img-163.jpg` |
| 11 | `royaltouch-pocket-spring` | Bedzone Titanium Ortho 12.5 Mattress | Pocket Spring | £145.00 | £175.00 | 13 | 17% Off | Medium | 0 | 0 | `images/img-165.png`, `images/img-166.png`, `images/img-167.png` |
| 12 | `restwell-orthopaedic-classic` | Orion 2000 Pocket Sprung Luxury Mattress | Orthopaedic | £249.00 | — | 21 | — | Firm | 0 | 0 | `images/img-129.jpg`, `images/img-168.jpg`, `images/img-169.jpg` |
| 13 | `nightcloud-memory-foam-plus` | MTRS Atomic Comfort 5000 Mattress | Memory Foam | £799.00 | £1,199.00 | 67 | 33% Off | Soft / Medium | 0 | 0 | `images/img-124.jfif`, `images/img-170.png`, `images/img-171.png` |
| 14 | `coastal-hybrid-breeze` | MTRS Comfort Dynamics 2000 Pocket Mattress | Hybrid | £499.00 | £699.00 | 42 | 29% Off | Medium | 0 | 0 | `images/img-130.webp`, `images/img-172.png`, `images/img-173.png` |
| 15 | `pureposture-orthopaedic` | MTRS Atomic Comfort 3000 Mattress | Orthopaedic | £549.00 | £999.00 | 46 | 45% Off | Firm | 0 | 0 | `images/img-131.webp`, `images/img-150.webp`, `images/img-162.png` |
| 16 | `signature-pocket-2000` | MTRS Lux Comfort 9000 Mattress | Pocket Spring | £1,200.00 | £1,800.00 | 100 | 33% Off | Medium / Firm | 0 | 0 | `images/img-79.png`, `images/img-174.png`, `images/img-163.jpg` |

Shared by all 16: delivery "Free UK delivery, rolled and boxed for easy access"; warranty "24 month warranty". No `returns` field. Materials, description and features per product: Appendix F.

### 4.13 Sofas — `sofas.js` → `SF_PRODUCTS` (4, object keyed by slug)

Fields: `name, price, prev, monthly, rating, reviews, description, features, dimensions, images`. `dimensions` is one text line. No `id`, no badge in the data. All images in `images/`.

| slug (key) | name | price | prev | monthly | dimensions | rating | reviews | images |
|---|---|---|---|---|---|---|---|---|
| `chesterfield-3-seater-sofa` | Chesterfield 3-Seater Sofa | £999.00 | £1,099.00 | 84 | Approx. 210cm wide × 90cm deep × 78cm high | 5 | 143 | `images/img-44.png`, `images/img-53.png`, `images/img-54.png` |
| `chelsea-corner-sofa` | Chelsea Corner Sofa | £799.00 | — | 67 | Approx. 280cm × 210cm corner footprint × 85cm high | 5 | 88 | `images/img-41.png`, `images/img-55.png`, `images/img-56.png` |
| `hampton-2-seater-sofa` | Hampton 2-Seater Sofa | £799.00 | £899.00 | 67 | Approx. 165cm wide × 86cm deep × 80cm high | 4 | 52 | `images/img-42.png`, `images/img-57.png`, `images/img-58.png` |
| `harlow-modular-sofa` | Harlow Modular Sofa | £999.00 | — | 84 | Approx. 300cm configurable × 95cm deep × 80cm high | 5 | 67 | `images/img-45.png`, `images/img-59.png`, `images/img-60.png` |

Size options (`SF_SIZE_OPTIONS`): `2 Seater Sofa`, `3 Seater Sofa`, `3+2 Seater`, `Left Corner Sofa`, `Right Corner Sofa` — same list for every sofa, **no price effect** and no per-size dimensions. Per-product text: Appendix F.

### 4.14 Fabric Samples — `fabric-samples.html` / `fabric-samples.js`

- The page shows **95 static swatch buttons** (`.fabric-swatch`, `data-fabric` = fabric name). Their names match the shared catalogue exactly (verified, §7). `FABRIC_CATALOG` in the JS lists the same 95 `{ slug, name }` pairs.
- **Up to 4 samples** (`FABRIC_MAX_SELECTION = 4`); status text "N / 4 Samples Selected"; a limit message appears when a 5th is clicked. The chosen names are written, comma-separated, into the hidden required field `#fabric-samples`.
- **Request form** `#fabricSamplesForm`: `name` (required), `email` (required, email pattern), `phone` (required), `postcode` (required), `address` (required), `notes` (optional), `marketingConsent` (checkbox, optional). Messages: "Please select at least one fabric sample above." / "Please complete all required fields correctly."
- **Submission is a placeholder**: it only shows "Thanks — your free sample request has been received." Nothing is sent or saved. Code comment shows the intended call: `POST /api/fabric-samples` with the form fields as JSON.
- Samples are described as **free**; no price, no cart, no stock.

### 4.15 `search-index.js` → `GLOBAL_SEARCH_INDEX` (222 entries) — verified

Entry fields: `name, category, url, image, price, keywords`. Used by the header search on every page. **It is out of date and must not be used as product data:**

| Category in index | Entries | Matches a real product URL | Price differs | Name differs |
|---|---|---|---|---|
| Slatted Ottoman Beds | 84 | 60 | 60 | 60 |
| Solid Ottoman Beds | 45 | 0 (links to `solid-ottoman-beds.html`, which does not exist; real page is `solid-base-ottomans.html`) | — | — |
| Rapid Delivery Beds | 20 | 0 (links to `rapid-delivery.html#/rapid-N`; real page is `rapid-delivery-beds.html`; real range has 31) | — | — |
| Luxury Mattresses | 16 | 16 | 16 | 16 |
| High Headboard Beds | 14 | 14 | 14 | 14 |
| TV Beds | 12 | 12 | 4 | 4 |
| Storage Beds With Drawers | 9 | 9 | 9 | 9 |
| Blanket Boxes | 7 | 0 (all link to `blanket-boxes.html` without slug) | — | — |
| Kids’ Beds | 5 | 5 | 5 | 5 |
| Bed Frames | 5 | 0 (category links, `price: null`) | — | — |
| Sofas | 4 | 0 (all link to `sofas.html` without slug) | — | — |
| Fabric Samples | 1 | category link, `price: null` | — | — |

24 Slatted Ottoman entries point to slugs that no longer exist (e.g. `enfield-slatted-ottoman-bed`, `bromley-ottoman-bed`). A backend search should be built from the real product data instead.



---

## 5. Product options, add-ons and pricing

Values in **bold** are the exact strings saved in the cart `variant`.

### 5.1 Option groups

| Option (`variant` key) | Values → button text | Price |
|---|---|---|
| `size` | size key, e.g. **`King`** (§6); Mattresses **`King Size`**; Sofas **`3 Seater Sofa`** etc. | size delta on TV, Slatted Ottoman, Rapid Delivery, High Headboard, Kids, Mattresses; none on Storage Drawers, Solid Base, Bed Frames, Best Sellers, Blanket Boxes, Sofas |
| `width` | Blanket Boxes: **`3ft Wide`**, **`4ft Wide`**, **`4.6ft Wide`**, **`5ft Wide`**, **`6ft Wide`** | none |
| `fabric` | fabric **name** (e.g. "Plush Grey"); Solid Base default **"Same as main display picture"**; `null` or `""` when none | none |
| `ottomanStorage` | **`yes`** "Yes Please, I want a storage base" / **`no`** "No thanks, I want a normal bed" (heading on Bed Frames / Best Sellers: "Add Gas Lift-Up Ottoman Storage to Your Bed?") | none |
| `footstoolBlanketBox` | **`yes`** "Yes Please, show me the options" / **`no`** "No thanks" | none |
| `headboardHeight` | **`normal`** "No Thanks (I want normal dimensions)" / **`increase`** / **`decrease`** | none |
| `customRequest` | free text (max 500) or `null`. "Extra charges may apply for custom dimensions. If you use this section the bed will be non-returnable." | none |
| `assembly` + `assemblyPrice` | **`no`** "No Thanks (Delivery to front door of your house/flat)" / **`yes`** "Yes Please (£59.00)" | **+£59** (`ASSEMBLY_PRICE = 59`) |
| `deliveryDelay` + `deliveryDate` | **`no`** "No, I want standard delivery asap" / **`yes`** + date input. **Bed Frames saves the date as `requiredDeliveryDate`**, all others as `deliveryDate` | none |
| `diamantes` | Solid Base only: **`"Yes"`** or `null` — "Diamantes (FREE)" | none |
| `buttons` | Solid Base and Slatted Ottoman: **`"Yes"`** or `null` — "Matching Fabric Buttons" | Solid Base: FREE; **Slatted Ottoman: +£15** (`detailingButtonsPrice`) |
| `footstoolBlanketBoxType` | Slatted Ottoman only, when `footstoolBlanketBox` = `yes`: `footstool` / `blanket-box` | none |
| `dimensions` | Mattresses: text from `MATTRESS_SIZE_DIMENSIONS`, e.g. **`135 x 190cm`** | none |
| `firmness` | Mattresses: **`Soft`**, **`Medium`**, **`Firm`** (per product; single-firmness products save their only value) | none |
| `fabricSlug`, `fabricImage` | Bed Frames and **Rapid Delivery**: inside `variant`; Blanket Boxes and **Sofas**: `fabricImage` at top level | none |

### 5.2 Which page uses which option

| Page | size | width | fabric | ottomanStorage | footstool | headboard | custom | assembly | delay | diamantes / buttons | Buy Now |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TV Beds | **req** | — | opt | — | **req** | **req** | opt | **req** | **req** | — | — |
| Storage Drawers | — | — | opt | **req** | **req** | **req** | opt | **req** | **req** | — | message only |
| Solid Base Ottomans | pre-selected | — | default "Same as main display picture" | **req** | **req** | **req** | opt | **req** | **req** | opt / opt | button with no action |
| Bed Frames | pre-selected (Single) | — | pre-selected (Plush Grey) | **req** | **req** | **req** | opt | **req** | **req** | — | adds to cart, opens `cart.html` |
| Best Sellers | — | — | pre-selected (Plush Grey) | **req** | **req** | **req** | opt | **req** | **req** | — | — |
| Blanket Boxes | — | **req** | **req** (none pre-selected) | — | — | — | — | — | — | — | message only |
| Slatted Ottoman | **req** | — | default "Same as main display picture" | **req** | **req** (+ type) | **req** | opt | **req** | **req** | opt / opt (+£15) | — |
| Rapid Delivery | **req** | — | pre-selected (first fabric, Plush Grey) | **req** | **req** | **req** | opt | **req** | **req** | — | — |
| High Headboard | **req** | — | opt | **req** | **req** | **req** | opt | **req** | **req** | — | message only ("Taking you to checkout…") |
| Kids' Beds | **req** | — | opt | — | **req** | **req** | opt | **req** | **req** | — | message only |
| Mattresses | **req** (+ firmness req when >1) | — | — | — | — | — | — | — | — | — | message only |
| Sofas | **req** | — | **req** | — | — | — | — | — | — | — | message only |

"req" = Add to Cart is blocked until chosen ("Please select an option.", "Please select a size.", "Please select a blanket box width.", "Please select a fabric colour."). "pre-selected" = a value is chosen automatically when the page opens; the customer can change it. Clicking a selected fabric again un-selects it.

### 5.3 Unit price (calculated in the browser)

- **TV Beds:** `max(0, price + TV_BED_SIZE_DELTAS[size] + (assembly = "yes" ? 59 : 0))`
- **Storage Drawers, Solid Base, Bed Frames, Best Sellers:** `price + (assembly = "yes" ? 59 : 0)` — size, fabric, diamantes and buttons do not change the price. Code comment: "Assembly is the only new option with a confirmed real price (£59.00) — every other new option stays £0 since no genuine price data exists for them."
- **Blanket Boxes:** `price` — width and fabric do not change the price.
- **Slatted Ottoman:** `max(0, price + SIZE_DELTA[size] + (buttons ? detailingButtonsPrice (15) : 0) + (assembly = "yes" ? 59 : 0))`. Diamantes, ottoman storage and fabric: £0.
- **Rapid Delivery, High Headboard, Kids' Beds:** `max(0, price + SIZE_DELTA[size] + (assembly = "yes" ? 59 : 0))`.
- **Mattresses:** `max(0, price + MATTRESS_SIZE_DELTAS[size])` — no assembly, firmness no effect.
- **Sofas:** `price` — size and fabric do not change the price (a corner sofa costs the same as a 2-seater).

The unit price is passed to the cart as `price`. **A backend must recalculate it on the server** and must not trust the browser's price.

---

## 6. Size systems

- **Size keys:** `Single`, `Small Double`, `Double`, `King`, `Super King`. **Labels:** `Single 3ft`, `Small Double 4ft`, `Double 4ft 6"`, `King 5ft`, `Super King 6ft`. The cart stores the key (Bed Frames stores its own `sizes` strings, which are the same keys).
- **TV Beds:** 4 sizes (no Single), with price deltas:

| Small Double | Double | King | Super King |
|---|---|---|---|
| −£50 | £0 | +£95 | +£170 |

- **Size deltas (£, relative to Double = base price):**

| Page | Single | Small Double | Double | King | Super King |
|---|---|---|---|---|---|
| TV Beds | — | −50 | 0 | +95 | +170 |
| Slatted Ottoman | −100 | −50 | 0 | +100 | +190 |
| Rapid Delivery | −80 | −40 | 0 | +90 | +160 |
| High Headboard | −110 | −55 | 0 | +105 | +185 |
| Kids' Beds | **0** (base) | +40 | — | — | — |
| Mattresses | — | −40 | 0 | +80 (`King Size`) | +150 |

  Kids' Beds is the only range where the base price is the Single price.
- **Mattress sizes** (`MATTRESS_SIZE_DIMENSIONS`): Small Double 120 x 190cm, Double 135 x 190cm, King Size 150 x 200cm, Super King 180 x 200cm (different from bed-frame dimensions).
- **Slatted Ottoman, Rapid Delivery, High Headboard:** all 5 sizes, per-size `dimensions` objects (same cm values as below). **Kids:** Single and Small Double only.
- **Sofas:** `2 Seater Sofa`, `3 Seater Sofa`, `3+2 Seater`, `Left Corner Sofa`, `Right Corner Sofa`, no price effect.
- **Solid Base Ottomans:** the page always shows all 5 size buttons and pre-selects the product's stored `sizeKey`. Choosing another size changes only the saved `size`; **price and dimensions stay those of the stored size.**
- **Bed Frames:** every product lists all 5 sizes — **including the four TV beds (`bed-frame-27`…`30`), which on the TV Beds page are not offered in Single**. The first size (Single) is pre-selected. No price effect. No dimensions data.
- **Best Sellers:** no size option at all.
- **Storage Drawers:** no size data (FAQ text says "Single, Small Double, Double, King and Super King"). **Not found in current project** as data.
- **Blanket Boxes:** widths `3ft Wide`, `4ft Wide`, `4.6ft Wide`, `5ft Wide`, `6ft Wide` (`BB_WIDTH_OPTIONS`), required, no price effect. Blanket box dimensions: **Not found in current project**.
- **Dimensions** (TV per size; Solid Base per stored size), cm width × length: Single 105×206, Small Double 136×206, Double 152×206, King 167×211, Super King 197×211. Heights: **Not found in current project**.

---

## 7. Fabric system

- **One fabric catalogue**, copied identically (verified) into: `TV_FABRIC_COLLECTIONS` (tv-beds.js), `SD_FABRIC_COLLECTIONS` (storage-drawers.js), `SO_FABRIC_COLLECTIONS` (solid-base-ottomans.js), `BF_FABRIC_COLLECTIONS` (bed-frames.js), `BS_FABRIC_COLLECTIONS` (best-sellers.js), `FABRIC_COLLECTIONS` (blanket-boxes.js). Also verified identical in `OTTOMAN_FABRIC_COLLECTIONS` (ottoman-beds.js), `RD_FABRIC_COLLECTIONS` (rapid-delivery-beds.js), `HH_FABRIC_COLLECTIONS` (high-headboard-beds.js), `KB_FABRIC_COLLECTIONS` (kids-beds.js) and `FABRIC_COLLECTIONS` (sofas.js); the 95 swatches on `fabric-samples.html` and its `FABRIC_CATALOG` use the same names/slugs. Mattresses have no fabric.
- Structure: `[{ name, fabrics: [{ slug, name, image }] }]` — **10 collections, 95 fabrics**, swatches in `fabric/` (`.jfif`). All slugs unique.
- Fabric never changes the price. The cart stores the fabric **name** (Bed Frames also saves `fabricSlug` + `fabricImage`; Blanket Boxes saves `fabricImage`).
- **Blanket Boxes suggested-fabric lists use two slugs that are not in the catalogue:** `cream-boucle` ("Cream Boucle") and `pink-boucle` ("Pink Boucle"). These lists are not used by the page.


**Plush** (21)

| slug | name | swatch image |
|---|---|---|
| `plush-grey` | Plush Grey | `fabric/plush-grey.jfif` |
| `plush-silver` | Plush Silver | `fabric/plush-silver.jfif` |
| `plush-steel` | Plush Steel | `fabric/plush-steel.jfif` |
| `plush-cream` | Plush Cream | `fabric/plush-cream.jfif` |
| `plush-beige` | Plush Beige | `fabric/plush-beige.jfif` |
| `plush-black` | Plush Black | `fabric/plush-black.jfif` |
| `plush-pink` | Plush Pink | `fabric/plush-pink.jfif` |
| `plush-mustard` | Plush Mustard | `fabric/plush-mustard.jfif` |
| `plush-green` | Plush Green | `fabric/plush-green.jfif` |
| `plush-turquoise` | Plush Turquoise | `fabric/plush-turquoise.jfif` |
| `plush-royal-blue` | Plush Royal Blue | `fabric/plush-royal-blue.jfif` |
| `plush-white` | Plush White | `fabric/plush-white.jfif` |
| `plush-baby-pink` | Plush Baby Pink | `fabric/plush-baby-pink.jfif` |
| `plush-ice-silver` | Plush Ice Silver | `fabric/plush-ice-sliver.jfif` |
| `plush-pebble` | Plush Pebble | `fabric/plush-pebble.jfif` |
| `plush-mocca` | Plush Mocca | `fabric/plush-mocca.jfif` |
| `plush-emerald-green` | Plush Emerald Green | `fabric/plush-emerald-green.jfif` |
| `plush-duck-egg` | Plush Duck Egg | `fabric/plush-duck-egg.jfif` |
| `plush-camel` | Plush Camel | `fabric/plush-camel.jfif` |
| `plush-teal` | Plush Teal | `fabric/plush-teal.jfif` |
| `plush-plum` | Plush Plum | `fabric/plush-plum.jfif` |

**Coniston** (6)

| slug | name | swatch image |
|---|---|---|
| `coniston-charcoal` | Coniston Charcoal | `fabric/coniston-charcoal.jfif` |
| `coniston-almond` | Coniston Almond | `fabric/coniston-almond.jfif` |
| `coniston-armour` | Coniston Armour | `fabric/coniston-armour.jfif` |
| `coniston-emerald` | Coniston Emerald | `fabric/coniston-emerald.jfif` |
| `coniston-pink` | Coniston Pink | `fabric/coniston-pink.jfif` |
| `coniston-blue` | Coniston Blue | `fabric/coniston-blue.jfif` |

**Naples** (13)

| slug | name | swatch image |
|---|---|---|
| `naples-silver` | Naples Silver | `fabric/naples-silver.jfif` |
| `naples-steel` | Naples Steel | `fabric/naples-steel.jfif` |
| `naples-black` | Naples Black | `fabric/naples-black.jfif` |
| `naples-ivory` | Naples Ivory | `fabric/naples-ivory.jfif` |
| `naples-pearl-blue` | Naples Pearl Blue | `fabric/naples-pearl-blue.jfif` |
| `naples-cream` | Naples Cream | `fabric/naples-cream.jfif` |
| `naples-sand` | Naples Sand | `fabric/naples-sand.jfif` |
| `naples-mink` | Naples Mink | `fabric/naples-mink.jfif` |
| `naples-seal-grey` | Naples Seal Grey | `fabric/naples-seal-grey.jfif` |
| `naples-slate-grey` | Naples Slate Grey | `fabric/naples-slate-grey.jfif` |
| `naples-charcoal` | Naples Charcoal | `fabric/naples-charcoal.jfif` |
| `naples-blue` | Naples Blue | `fabric/naples-blue.jfif` |
| `naples-plum` | Naples Plum | `fabric/naples-plum.jfif` |

**Crushed Velvet** (14)

| slug | name | swatch image |
|---|---|---|
| `crushed-velvet-silver` | Crushed Velvet Silver | `fabric/crushed-velvet-silver.jfif` |
| `crushed-velvet-black` | Crushed Velvet Black | `fabric/crushed-velvet-black.jfif` |
| `crushed-velvet-cream` | Crushed Velvet Cream | `fabric/crushed-velvet-cream.jfif` |
| `crushed-velvet-mink` | Crushed Velvet Mink | `fabric/crushed-velvet-mink.jfif` |
| `crushed-velvet-white` | Crushed Velvet White | `fabric/crushed-white.jfif` |
| `crushed-velvet-grey` | Crushed Velvet Grey | `fabric/crushed-grey.jfif` |
| `crushed-velvet-camel` | Crushed Velvet Camel | `fabric/crushed-camel.jfif` |
| `crushed-velvet-gold` | Crushed Velvet Gold | `fabric/crushed-gold.jfif` |
| `crushed-velvet-teal` | Crushed Velvet Teal | `fabric/crushed-teal.jfif` |
| `crushed-velvet-denim` | Crushed Velvet Denim | `fabric/crushed-denim.jfif` |
| `crushed-velvet-hot-pink` | Crushed Velvet Hot Pink | `fabric/crushed-hot-pink.jfif` |
| `crushed-velvet-purple` | Crushed Velvet Purple | `fabric/crushed-purple.jfif` |
| `crushed-velvet-plum` | Crushed Velvet Plum | `fabric/crushed-plum.jfif` |
| `crushed-velvet-baby-pink` | Crushed Velvet Baby Pink | `fabric/crushed-baby-pink.jfif` |

**Chenille** (11)

| slug | name | swatch image |
|---|---|---|
| `chenille-cream` | Chenille Cream | `fabric/chenille-cream.jfif` |
| `chenille-mink` | Chenille Mink | `fabric/chenille-mink.jfif` |
| `chenille-chocolate` | Chenille Chocolate | `fabric/chenille-chocolate.jfif` |
| `chenille-steel` | Chenille Steel | `fabric/chenille-steel.jfif` |
| `chenille-charcoal` | Chenille Charcoal | `fabric/chenille-charcoal.jfif` |
| `chenille-duck-egg` | Chenille Duck Egg | `fabric/chenille-duck-egg.jfif` |
| `chenille-teal` | Chenille Teal | `fabric/chenille-teal.jfif` |
| `chenille-purple` | Chenille Purple | `fabric/chenille-purple.jfif` |
| `chenille-plum` | Chenille Plum | `fabric/chenille-plum.jfif` |
| `chenille-red` | Chenille Red | `fabric/chenille-red.jfif` |
| `chenille-black` | Chenille Black | `fabric/chenille-black.jfif` |

**Linoso** (8)

| slug | name | swatch image |
|---|---|---|
| `linoso-sand` | Linoso Sand | `fabric/linoso-sand.jfif` |
| `linoso-silver` | Linoso Silver | `fabric/linoso-silver.jfif` |
| `linoso-slate-grey` | Linoso Slate Grey | `fabric/linoso-slate-grey.jfif` |
| `linoso-charcoal` | Linoso Charcoal | `fabric/linoso-charcoal.jfif` |
| `linoso-truffle` | Linoso Truffle | `fabric/linoso-truffle.jfif` |
| `linoso-black` | Linoso Black | `fabric/linoso-black.jfif` |
| `linoso-midnight-blue` | Linoso Midnight Blue | `fabric/linoso-midnight-blue.jfif` |
| `linoso-plum` | Linoso Plum | `fabric/linoso-plum.jfif` |

**Boucle** (4)

| slug | name | swatch image |
|---|---|---|
| `boucle-granite` | Boucle Granite | `fabric/boucle-granite.jfif` |
| `boucle-dove` | Boucle Dove | `fabric/boucle-dove.jfif` |
| `boucle-ivory` | Boucle Ivory | `fabric/boucle-ivory.jfif` |
| `boucle-truffle` | Boucle Truffle | `fabric/boucle-truffle.jfif` |

**Naples Alternative** (6)

| slug | name | swatch image |
|---|---|---|
| `grey-naples` | Grey Naples | `fabric/plush-grey.jfif` |
| `sand-naples` | Sand Naples | `fabric/naples-sand.jfif` |
| `silver-naples` | Silver Naples | `fabric/Naples-Silver.jfif` |
| `black-naples` | Black Naples | `fabric/Naples-Black.jfif` |
| `brown-naples` | Brown Naples | `fabric/naple-brown.jfif` |
| `cream-naples` | Cream Naples | `fabric/naples-cream.jfif` |

**Additional Colours** (9)

| slug | name | swatch image |
|---|---|---|
| `dove` | Dove | `fabric/dove.jfif` |
| `ivory` | Ivory | `fabric/ivory.jfif` |
| `latte` | Latte | `fabric/latte.jfif` |
| `mink` | Mink | `fabric/mink.jfif` |
| `truffle` | Truffle | `fabric/truffle.jfif` |
| `saffron` | Saffron | `fabric/saffron.jfif` |
| `powder` | Powder | `fabric/powder.jfif` |
| `sky` | Sky | `fabric/sky.jfif` |
| `marine` | Marine | `fabric/marrine.jfif` |

**Marble** (3)

| slug | name | swatch image |
|---|---|---|
| `marble-oatmeal` | Marble Oatmeal | `fabric/marble-oatmeal.jfif` |
| `marble-platinum` | Marble Platinum | `fabric/marble-platinum.jfif` |
| `marble-silver` | Marble Silver | `fabric/marble-silver.jfif` |

**Swatch paths that do not follow `fabric/<slug>.jfif`** — real file names, keep exactly:

- `plush-ice-silver` → `fabric/plush-ice-sliver.jfif` ("sliver")
- `crushed-velvet-white/grey/camel/gold/teal/denim/hot-pink/purple/plum/baby-pink` → `fabric/crushed-<colour>.jfif`
- `grey-naples` → `fabric/plush-grey.jfif` (same image as Plush Grey); `sand-naples` → `fabric/naples-sand.jfif`; `cream-naples` → `fabric/naples-cream.jfif`
- `silver-naples` → `fabric/Naples-Silver.jfif`, `black-naples` → `fabric/Naples-Black.jfif` (**capital letters — case-sensitive on Linux servers**)
- `brown-naples` → `fabric/naple-brown.jfif`; `marine` → `fabric/marrine.jfif`

---

## 8. Cart architecture (`cart-data.js`, `cart.js`)

- **Global:** `window.RabboraCart` = `{ STORAGE_KEY, EVENT_NAME, getAll, has, count, subtotal, add, remove, updateQuantity, clear, buildLineId }`
- **localStorage key:** `rabboraCart` (JSON array). **Event:** `rabbora:cart:change` (`CustomEvent`, `detail.items`); the `storage` event re-fires it across tabs. Writes are read back and retried once.

### 8.1 Line identity — `buildLineId(productId, variant)`

Takes every `variant` key whose value is not `null`/`undefined`/`""`, sorts the keys, and builds `<productId>::<key>:<value>|…`. No variant → just the product id. Same product + identical variant → quantity is added to the existing line; any difference in any variant field (including custom-request text or date) → a separate line.

### 8.2 Stored cart line

```js
{ lineId, id, slug /* or null */, name, url /* default "index.html" */,
  image /* default "" */, alt /* default = name */,
  price,        // NUMBER — unit price, clamped to >= 0
  variant,      // object or null
  fabricImage,  // default ""
  category,     // default ""
  quantity,     // integer >= 1
  addedAt }     // Date.now()
```

`getAll()` drops any line without a string `lineId`, string `name`, finite `price >= 0` or `quantity > 0`. `count()` = total quantity; `subtotal()` = Σ price × quantity; `updateQuantity(lineId, 0)` removes the line.

### 8.3 What each page sends to `RabboraCart.add(item, quantity)`

| Page | `id` | `url` | `image` | `category` | `variant` keys |
|---|---|---|---|---|---|
| TV Beds | `"tv-bed-" + slug` | `tv-beds.html#/<slug>` | `images[0]` | TV Beds | size, fabric, footstoolBlanketBox, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, deliveryDate |
| Storage Drawers | `"storage-drawer-" + slug` | `storage-drawers.html#/<slug>` | `image` | Storage Beds With Drawers | fabric, ottomanStorage, footstoolBlanketBox, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, deliveryDate |
| Solid Base Ottomans | `"solid-base-ottoman-" + slug` | `solid-base-ottomans.html#/<slug>` | `images[0]` | Solid Base Ottomans | size, fabric, diamantes, buttons, ottomanStorage, footstoolBlanketBox, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, deliveryDate |
| Bed Frames | slug (no prefix) | `bed-frames.html#/<slug>` | `image` | **not sent** | size, fabric, fabricSlug, fabricImage, ottomanStorage, footstoolBlanketBox, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, **requiredDeliveryDate** |
| Best Sellers | slug (no prefix) | `best-sellers.html#/<slug>` | `image` | Best Sellers | fabric, ottomanStorage, footstoolBlanketBox, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, deliveryDate |
| Blanket Boxes | `"blanket-box-" + slug` | `blanket-boxes.html#/<slug>` | `images[0]` | Blanket Boxes | width, fabric (+ top-level `fabricImage`) |
| Slatted Ottoman | `"ottoman-bed-" + slug` | `ottoman-beds.html#/<slug>` | `images[0]` | Slatted Ottoman Beds | size, fabric, diamantes, buttons, ottomanStorage, footstoolBlanketBox, footstoolBlanketBoxType, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, deliveryDate |
| Rapid Delivery | `"rapid-delivery-bed-" + slug` | `rapid-delivery-beds.html#/<slug>` | `images[0]` | Rapid Delivery Beds | size, fabric, fabricSlug, fabricImage, ottomanStorage, footstoolBlanketBox, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, deliveryDate |
| High Headboard | `"high-headboard-bed-" + slug` | `high-headboard-beds.html#/<slug>` | `image` | High Headboard Beds | size, fabric, ottomanStorage, footstoolBlanketBox, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, deliveryDate |
| Kids' Beds | `"kids-bed-" + slug` | `kids-beds.html#/<slug>` | `images[0]` | Kids’ Beds | size, fabric, footstoolBlanketBox, headboardHeight, customRequest, assembly, assemblyPrice, deliveryDelay, deliveryDate |
| Mattresses | `"mattress-" + slug` | `mattresses.html#/<slug>` | `images[0]` | Luxury Mattresses | size, dimensions, firmness |
| Sofas | `"sofa-" + slug` | `sofas.html#/<slug>` | `images[0]` | Sofas | size, fabric (+ top-level `fabricImage`) |
| Wishlist page | wishlist item `id` | saved url | saved image | saved category | **no variant**; price parsed from the saved text (e.g. `"£329.00"` → `329`) |

All pages send `slug`, `name`, `price` (unit price) and quantity (− / +, minimum 1). All except Bed Frames send `alt`.

### 8.4 Cart page (`cart.js`)

- Lines show image, name link, variant text, line total, unit price ("each"), − / + and remove.
- **Variant text:** known keys get labels (`size` Size, `colour`/`color` Colour, `fabric` Fabric, `diamantes` Diamantes, `buttons` Buttons); **all other keys are printed with their raw name**, e.g. "AssemblyPrice: 59", "FootstoolBlanketBox: yes", "Width: 4ft Wide", and on Bed Frames also "FabricSlug: plush-grey", "FabricImage: fabric/plush-grey.jfif".
- **Summary:** Subtotal, Delivery, Total (`£1,234.00` format). `calculateDelivery()` is a marked "FUTURE BACKEND INTEGRATION POINT" and **always returns 0** ("Free (Mainland UK)").
- **"Proceed to Checkout"** (`#cartCheckoutBtn`) → `checkout.html` when the cart is not empty.

---

## 9. Checkout architecture

**Not found in current project.** `checkout.html` was not provided; there is no checkout form, payment, order submission or confirmation in the inspected files. `cart.js`: "No checkout page/backend exists yet — do not fake an order or claim payment success." Finance provider and how monthly prices are calculated: **Not found in current project**. Delivery texts on detail pages: "Free Mainland UK delivery. Delivery charges may vary for selected UK regions and remote postcodes" (Bed Frames, Best Sellers), "Made for you, ready quickly — free Mainland UK delivery" (Blanket Boxes), "Handmade to order, with standard UK delivery included." (TV, Solid Base data).

---

## 10. Wishlist architecture (`wishlist-data.js`, `wishlist.js`)

- **Global:** `window.RabboraWishlist` = `{ STORAGE_KEY, EVENT_NAME, getAll, has, count, add, remove, toggle, clear, fromCard, syncButtons }`
- **localStorage key:** `rabboraWishlist` (JSON array). **Event:** `rabbora:wishlist:change`. One item per `id`.
- **Stored item:** `{ id, slug, name, url, image, alt, category, price, previousPrice, monthly, badge, stars, reviewCount, addedAt }` — `price`, `previousPrice`, `monthly` are **display text** (e.g. `"£329.00"`, `"or from £25/mo"`).
- `fromCard(card)` reads the rendered card: `id` = `data-product-id` else `data-slug`; `category` from `<body data-wishlist-category>` (empty on `bed-frames.html`); `url` from the card link.
- **No size, fabric or option is stored.** Hearts exist on the static cards of every category page (not on the TV/Best Sellers "Related" cards built by JS).
- **Detail-page hearts:** Slatted Ottoman and Mattresses save a full snapshot to `RabboraWishlist` (price = current unit price as text). **High Headboard and Kids' Beds detail hearts only use an in-memory `Set`** — they change the header count but nothing is saved and nothing appears on `wishlist.html`.
- Wishlist page: renders from storage on load / change / storage event / back-forward cache; View Product, Add to Cart (§8.3), Remove, Clear all (with confirmation); missing image falls back to `images/img-2.png`.

---

## 11. localStorage, global JS structures and accounts

| Key / global | Defined in | Contents |
|---|---|---|
| `localStorage["rabboraCart"]` | `cart-data.js` | cart lines (§8.2) |
| `localStorage["rabboraWishlist"]` | `wishlist-data.js` | wishlist items (§10) |
| `localStorage["rabboraReviews:bedframe:<slug>"]` | `bed-frames.js` | **customer reviews written on the Bed Frames detail page**: JSON array of `{ name, rating (1–5), comment, date (ms timestamp) }`. Shown only on that product's Bed Frames detail page, only in that browser. |
| `window.RabboraCart`, `window.RabboraWishlist` | stores | APIs |
| events `rabbora:cart:change`, `rabbora:wishlist:change` | stores | change notifications |
| Global product data | page JS | `TV_BED_PRODUCTS`, `TV_FABRIC_COLLECTIONS`, `TV_BED_SIZE_DELTAS`, `SOLID_OTTOMAN_PRODUCTS`, `SO_FABRIC_COLLECTIONS`, `BF_PRODUCTS`, `BF_FABRIC_COLLECTIONS`, `BS_PRODUCTS`, `BS_FABRIC_COLLECTIONS` are global; `SD_PRODUCTS_LIST`, `BB_PRODUCTS` and their fabric lists are inside the page function (not global). Also global: `RAPID_DELIVERY_PRODUCTS`, `RAPID_DELIVERY_SIZE_DELTAS`, `HH_BED_PRODUCTS`, `HH_BED_SIZE_DELTAS`, `KIDS_BED_PRODUCTS`, `KIDS_BED_SIZE_DELTAS`, the `*_FABRIC_COLLECTIONS(_FLAT)` lists and `GLOBAL_SEARCH_INDEX`. Inside page functions: `SLATTED_OTTOMAN_PRODUCTS`, `MATTRESS_PRODUCTS_LIST`, `SF_PRODUCTS`, `FABRIC_CATALOG` |

No `sessionStorage` or cookies are used in the inspected files.

**Log In page (`account.html` + `account.js`):**
- Fields: `email`, `password` (min 8 characters), "Remember me" checkbox (`remember`). Links: "Forgot password?" → `forget-password.html`; "Create account" → `register.html`.
- `authenticateUser()` is a marked "FUTURE BACKEND INTEGRATION POINT" and **always fails** with "Login is not available yet — this account system isn't connected to a server." Code comment describes the intended call: `POST /api/login` with JSON `{ email, password }`, `credentials: "include"` (session cookie), success `{ user: {...} }`, error `{ message }`; "The backend … is responsible for verifying the password and issuing a session/cookie/token."
- After a successful login the comment suggests redirecting to `account.html`. There is no separate "my account" dashboard page in the inspected files: **Not found in current project**.

---

## 12. Data issues found (not changed — the backend must decide how to handle them)

1. **The same bed has several identities.** Bed Frames and Best Sellers re-list products from other ranges under different slugs/ids (§3). In cart and wishlist the same bed can appear as e.g. `storage-drawer-storage-drawer-1`, `orlando-bed-frame-ottoman-storage` and `storage-drawer-1`.
2. **Wishlist id ≠ cart id** on Storage Drawers, Solid Base and Blanket Boxes (wishlist uses the slug, cart adds a prefix). TV matches. Adding to cart from the Wishlist page therefore creates a different line, with no options.
3. **Doubled prefixes:** `tv-bed-tv-bed-1`, `storage-drawer-storage-drawer-1`, `solid-base-ottoman-solid-ottoman-bed-1`.
4. **Slugs that don't match names:** Best Sellers ids 1–4 (`art-deco-bed-style` = Manhattan Slatted Ottoman Bed, `kendal-butterfly-wingback-bed` = Duke High & Wide Headboard Bed, `empire-bed-frame-ottoman-storage` = Solid Ottoman Bed, `orlando-bed-frame-ottoman-storage` = Lyon Storage Bed).
5. **Ratings/reviews** are stored but hidden everywhere ("no verified real reviews exist yet"). Best Sellers stores 156 / 88 / 172 / 308 reviews for ids 1–4 while the same beds elsewhere store different numbers. Bed Frames lets customers write reviews that are saved only in their own browser.
6. **TV Beds:** 8 of 12 products have no images; only 4 appear on the category page; related cards for image-less products show a broken image.
7. **Card `data-price`/`data-rating` attributes are wrong** on TV cards (e.g. `data-price="599"` vs £999).
8. **Badges differ between HTML cards and data:** Storage Drawers (4 cards) and Solid Base (23 cards) show no badge although the data has one; Blanket Boxes cards show badges that are not in the data.
9. **Monthly prices differ** for the same bed: e.g. Premium Ottoman Bed £24/mo (Best Sellers) vs £25/mo (Solid Base); Golden Skyline Storage Bed £33 vs £34; also Classic, Prestige, Deluxe Ottoman and Toronto Lux.
10. **Bed Frames offers Single for the four TV beds**, which the TV Beds page does not.
11. **Bed Frames:** no cart `category`, no `alt`; saves the date as `requiredDeliveryDate` (others `deliveryDate`); puts `fabricSlug`/`fabricImage` inside `variant`, so they are printed on the cart page and split cart lines; allows empty size/fabric; detail page says "Non-Storage Bed Frames" in the browser title and "Non-Storage Bed Frame" as the eyebrow; body has no `data-wishlist-category`.
12. **Solid Base:** size choice does not change price or dimensions; Diamantes and Buttons are FREE here but Buttons cost £15 on Slatted Ottoman (§14); the Buy Now button has no action.
13. **Blanket Boxes:** "Plush Storage Blanket Box" has previous price £175, lower than its price £200; suggested fabrics include `cream-boucle` and `pink-boucle`, which are not in the fabric catalogue; the page does not load `style.css` or `script.js` (its own copies are used instead).
14. **Storage Drawers:** `storage-drawer-10` re-uses `storage-drawer-9`'s cart image; card/gallery and cart images come from different folders.
15. **Rapid Delivery products use Solid Base photos** (`solid/…`, verified); Bed Frames / Best Sellers use the source products' photos. Kids' Beds use TV photos (`tv/…`).
16. **Home page data:** slugs with spaces/leading spaces; duplicate names with different prices ("2026 Empire…" £290/£421 and £290/£420; "2026 Orlando…" £729/£899 and £329/£421); "Wren TV Bed Frame" £1,399 with previous £999; `reviewCount: 307.59`; `alt` texts naming other products.
17. **Placeholder copy:** Bed Frames (all 30) and Best Sellers (36 of 40) show "Add a short product description here once real product details are available."
18. **Cart page** prints raw variant keys (§8.4).
19. `index.html` (old copy) preloads `images/hero-bedroom.jpg`, which is not used.
20. **Card `data-price` is wrong on every card** of Slatted Ottoman (60/60), High Headboard (14/14), Kids' Beds (5/5) and Sofas (4/4) — e.g. `chelsea-slatted-ottoman-bed` `data-price="649"` while the card shows and the data holds £249. The visible prices are correct; the wrong attribute is what the price filter and price sort use. Mattresses and Rapid Delivery are correct.
21. **Slugs that don't match names** on Slatted Ottoman (all 60), Mattresses (15/16), High Headboard (7/14) and Rapid Delivery (`rapid-N`).
22. **Wishlist ids differ from cart ids:** Slatted Ottoman (wishlist = slug, cart = `ottoman-bed-` + slug), Rapid Delivery (wishlist `rapid-delivery-rapid-1`, cart `rapid-delivery-bed-rapid-1`), High Headboard / Kids / Sofas (wishlist = slug). Mattresses match.
23. **High Headboard and Kids' Beds detail-page wishlist buttons are not saved** (in-memory only, §10).
24. **Kids' Beds:** cart category `Kids’ Beds` (curly apostrophe) vs page `data-wishlist-category="Kids Beds"`; page preloads `images/kids-bed/img-1.png` while the products use `tv/` images; the page's JSON-LD (structured-data) script is not valid JSON.
25. **Slatted Ottoman:** one image path is `slatted/img-.jfif` (number missing).
26. **Sofas:** the colour filter compares the chosen colour with fabric names, so it does not match the cards' `data-colours` (brown/grey/…) — the filter does not work as intended; the Chelsea sofa card repeats text; the page preloads `images/category-sofas.jpg`, which the hero does not use; size does not change the price.
27. **Mattresses** use the size key `King Size` where every other range uses `King`.
28. **`search-index.js` is stale** (§4.15): wrong page names (`rapid-delivery.html`, `solid-ottoman-beds.html`), old names and prices, 24 removed slugs.
29. **Placeholder submissions:** Fabric Samples form, Buy Now buttons (High Headboard, Kids, Mattresses, Sofas) only show a message; nothing is sent.

---

## 13. Image folders and paths

No image files were provided; these folders are referenced by the inspected code. **Keep every path exactly (spelling and capital letters).**

| Folder | Used for |
|---|---|
| `images/` | logo `img-2.png` (header, footer, favicon, fallback image); `images/logo.png` in mobile-nav headers; Home hero, category tiles, editorial images; Home product cards; **Sofas** (12 images) and **Mattresses** (48 images) |
| `tv/` | Kids' Beds images (15); TV Beds card/gallery images (`img-1.jfif`–`img-4.jfif`, `img-22.png`, `img-23.png`), TV hero `img-5.png`; also Bed Frames `bed-frame-27`…`30` |
| `images/tv-beds/` | TV Beds share image `img-1.png` |
| `drawar/` | Storage Drawers card/gallery `1.jfif`–`30.jfif` (folder spelled `drawar`); also Best Sellers |
| `images/storage-drawers/` | Storage Drawers cart images `img-1.png`–`img-9.png`, share image |
| `solid/` | Solid Base images `1.jfif`–`135.jfif` (3 per product); also Bed Frames, Best Sellers and Rapid Delivery (93 references) |
| `slatted/` | Slatted Ottoman images (199 references, `img-N.jfif`/`.png` and `N.png`; one broken `img-.jfif`); also Bed Frames and Best Sellers; `slatted/53.png` = "Gas lift-up ottoman storage base" option illustration |
| `high/` | High Headboard bed images (63 references across `image` + `gallery`); also used by Bed Frames and Best Sellers |
| `images/kids-bed/` | preload on `kids-beds.html` only (not used by the product data) |
| `blanket/` | Blanket Box product images `img-84.png`–`img-98.png`; option illustrations `img-1.png` (footstool/blanket box), `1.png` (headboard), `2.png` (assembly), `3.png` (delivery delay) |
| `fabric/` | 95 fabric swatches (§7) |
| `images/solid-ottoman-beds/` | referenced in a code comment only |

File types: `.jfif`, `.png`, `.jpg`, `.webp`.

---

## 14. Provisional — recorded on 24 September from files not available now

⚠ **Verify against the files before relying on these.**

Slatted Ottoman, Rapid Delivery, Sofas and `search-index.js` were in this list before; they have now been re-supplied and verified (§4.8, §4.9, §4.13, §4.15) — every earlier provisional fact about them was confirmed.

- **Register (`register.js`):** fields `firstName`, `lastName`, `email`, `password`, `confirmPassword`, `terms`; min 8 characters; always "not available yet"; comment describes `POST /api/register` with `{ firstName, lastName, email, password }`.
- **Reviews (`reviews.js`):** 35 **demo** reviews shaped like a future `GET /api/reviews` `{ id, productId, productName, customerName, rating, title, comment, date, verified }` (`productId` is a category key).
- **Newsletter (`script.js`):** only shows a thank-you; comment shows a future `POST /api/newsletter` `{ email }`.
- **Cart page (`cart.html`):** "Delivery is calculated at checkout based on your address and the items in your cart."

---

## 15. Relationships the future backend must preserve

1. **Slugs are permanent.** They are in detail URLs (`<page>.html#/<slug>`), cart ids, wishlist ids and saved links. Keep every existing slug, including those that don't match names.
2. **One real product, several listings.** Bed Frames and Best Sellers entries point to products from other ranges. The backend should link each listing to one real product while keeping the old slugs working.
3. **Existing ids in customers' browsers:** wishlist ids (card `data-product-id` or slug), cart ids (`<prefix>` + slug or plain slug) and `lineId`s. A move to server carts/wishlists must map all these formats.
4. **Category → page → cart `category` → `data-wishlist-category`** (§2.2, §3).
5. **One shared fabric catalogue** (10 collections, 95 fabrics) with exact slugs, names and image paths; no price effect; the cart stores the name.
6. **Size keys vs labels**, TV size deltas, Blanket Box widths; which pages allow which sizes.
7. **Option values** exactly as saved and **add-on prices** (assembly £59; Slatted Ottoman buttons £15; everything else £0), and the two delivery-date key names (`deliveryDate`, `requiredDeliveryDate`).
8. **Price rule:** base + size delta + add-ons = unit price; × quantity = line total. Recalculate on the server.
9. **Wishlist stores display text**; cart stores numbers.
10. **Image paths exactly as stored**, including `drawar/`, `plush-ice-sliver`, `marrine`, `naple-brown`, `Naples-Silver.jfif`, `Naples-Black.jfif`.
11. **Integration points already marked in the code:** login (`POST /api/login`), register (`POST /api/register`), reviews (`GET/POST /api/reviews`), newsletter (`POST /api/newsletter`), **fabric sample requests (`POST /api/fabric-samples`, max 4 samples)**, delivery cost (`calculateDelivery`), checkout (`checkout.html`).
12. **Bed Frames reviews in localStorage** (`rabboraReviews:bedframe:<slug>`) exist only in customers' browsers.
13. **Mattresses are a different product type:** own size keys (`King Size`), own dimensions, firmness, no fabric and no assembly.
14. **Per-range size deltas** (§6) — the same size costs a different amount in each range.

---

## 16. Not found in current project

- Checkout page, payment, order creation, confirmation, order history
- Account dashboard, logout, sessions, password reset page (`forget-password.html`); login and register are not connected
- `product.html` (target of the Home product cards)
- Product data for Non-Storage Bed Frames (`non-storage-bed-frames.html` not provided)
- Sofa dimensions per size; blanket box / sofa price differences per size or width
- Sizes and dimensions for Storage Drawers; Blanket Box dimensions; bed heights (only headboard heights on High Headboard)
- Where fabric-sample requests go (email, stock of samples, dispatch)
- Delivery charge rules (cart uses £0), delivery areas beyond "Mainland UK"
- VAT handling, discount / promo codes
- Finance provider and monthly price calculation
- Stock / inventory, lead times
- Real customer reviews
- The image files themselves

---

## Appendix A — TV Beds per-product text


**tv-bed-1 — Rabbora Milano TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 32", with a tailored handmade frame.
- description: Bring modern luxury into your bedroom with the Rabbora Milano TV Bed, combining elegant design, relaxing comfort and a built-in TV experience.
- tvInfo: The lift mechanism accommodates televisions up to 32" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 32"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-2 — Rabbora Monaco TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 40", with a tailored handmade frame.
- description: The Rabbora Monaco TV Bed creates a sophisticated bedroom retreat with its stylish finish, comfortable design and seamless entertainment experience.
- tvInfo: The lift mechanism accommodates televisions up to 40" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 40"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-3 — Rabbora Windsor TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 43", with a tailored handmade frame.
- description: Designed for those who appreciate timeless elegance, the Rabbora Windsor TV Bed blends premium bedroom style with convenient built-in entertainment.
- tvInfo: The lift mechanism accommodates televisions up to 43" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 43"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-4 — Rabbora Kensington TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 50", with a tailored handmade frame.
- description: Transform your bedroom with the Rabbora Kensington TV Bed, offering a luxurious statement design with comfort and entertainment beautifully combined.
- tvInfo: The lift mechanism accommodates televisions up to 50" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 50"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-5 — Mayfair TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 32", with a tailored handmade frame.
- description: The Mayfair TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.
- tvInfo: The lift mechanism accommodates televisions up to 32" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 32"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-6 — Richmond TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 40", with a tailored handmade frame.
- description: The Richmond TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.
- tvInfo: The lift mechanism accommodates televisions up to 40" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 40"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-7 — Cambridge TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 43", with a tailored handmade frame.
- description: The Cambridge TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.
- tvInfo: The lift mechanism accommodates televisions up to 43" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 43"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-8 — Victoria TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 50", with a tailored handmade frame.
- description: The Victoria TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.
- tvInfo: The lift mechanism accommodates televisions up to 50" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 50"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-9 — Oxford TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 32", with a tailored handmade frame.
- description: The Oxford TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.
- tvInfo: The lift mechanism accommodates televisions up to 32" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 32"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-10 — Chester TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 40", with a tailored handmade frame.
- description: The Chester TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.
- tvInfo: The lift mechanism accommodates televisions up to 40" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 40"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-11 — Kingston TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 43", with a tailored handmade frame.
- description: The Kingston TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.
- tvInfo: The lift mechanism accommodates televisions up to 43" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 43"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface

**tv-bed-12 — Brighton TV Bed**

- shortInfo: Built-in lift mechanism fits TVs up to 50", with a tailored handmade frame.
- description: The Brighton TV Bed conceals a smooth, quiet lift mechanism within the footboard, raising your television to the perfect viewing height at the touch of a button and lowering it out of sight when not in use. Built on a solid, supportive frame and finished with tailored upholstery, it brings entertainment and comfort together without cluttering the room.
- tvInfo: The lift mechanism accommodates televisions up to 50" and is operated by a simple wireless remote, raising the screen smoothly from the footboard and lowering it flush when not in use. Cable routing is built into the frame to keep connections tidy.
- features: Built-in TV lift mechanism, fits screens up to 50"; Quiet, smooth-motion lift with remote control; Integrated cable management to keep wiring out of sight; Solid frame construction with tailored upholstery; Sprung slatted base for a comfortable, breathable sleep surface


## Appendix B — Storage Beds With Drawers per-product text

| slug | name | shortInfo | description |
|---|---|---|---|
| `storage-drawer-1` | Rabbora Lyon Storage Bed | 2 spacious drawers built into a tailored, handmade frame. | A sophisticated and practical storage bed designed to bring elegant character to the bedroom while providing comfortable sleeping and convenient drawer storage. |
| `storage-drawer-2` | Rabbora Mona Lisa Storage Bed | 4 spacious drawers built into a tailored, handmade frame. | An elegant bedroom centrepiece combining graceful styling and comfortable sleeping with practical drawer storage for everyday convenience. |
| `storage-drawer-3` | Rabbora Art Deco Storage Bed | 2 spacious drawers built into a tailored, handmade frame. | A refined Art Deco-inspired design created to add sophisticated character to the bedroom while offering comfortable sleeping and useful drawer storage. |
| `storage-drawer-4` | Rabbora Golden Skyline Storage Bed | 4 spacious drawers built into a tailored, handmade frame. | A striking bedroom design created to make an elegant statement while combining comfortable sleeping with the practical convenience of drawer storage. |
| `storage-drawer-5` | Rabbora Dover Designer Storage Bed | 2 spacious drawers built into a tailored, handmade frame. | A stylish designer storage bed created to bring refined bedroom character together with comfortable sleeping and convenient drawer storage. |
| `storage-drawer-6` | Rabbora Brooklyn Storage Bed | 4 spacious drawers built into a tailored, handmade frame. | A clean and contemporary storage bed designed to give the bedroom a sophisticated appearance while providing comfortable sleeping and practical drawer storage. |
| `storage-drawer-7` | Rabbora Mayfair Storage Bed | 2 spacious drawers built into a tailored, handmade frame. | A refined bedroom centrepiece designed to bring timeless elegance and comfortable sleeping together with the everyday practicality of drawer storage. |
| `storage-drawer-8` | Rabbora Toronto Lux Storage Bed | 4 spacious drawers built into a tailored, handmade frame. | A premium-looking storage bed created to bring sophisticated character and comfortable sleeping together with convenient drawer storage for a well-organised bedroom. |
| `storage-drawer-9` | Rabbora Virginia Storage Bed | 2 spacious drawers built into a tailored, handmade frame. | A versatile and elegant storage bed designed to provide comfortable everyday sleeping while helping keep the bedroom organised with convenient drawer storage. |
| `storage-drawer-10` | Rabbora Kensington Storage Bed | 2 spacious drawers built into a tailored, handmade frame. | A refined storage bed offering a comfortable, well-proportioned frame with the everyday practicality of built-in drawer storage. |


## Appendix C — Solid Base Ottomans per-product text

| slug | name | shortInfo | description |
|---|---|---|---|
| `solid-ottoman-bed-1` | Rabbora Solid Ottoman Bed | Reinforced solid base storage, Single 3ft size. | A stylish and practical ottoman bed designed to bring comfort, elegance and useful storage into your bedroom. |
| `solid-ottoman-bed-2` | Rabbora Luxury Solid Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | Enjoy a refined bedroom look with a comfortable design and convenient ottoman storage for everyday living. |
| `solid-ottoman-bed-3` | Rabbora Premium Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | Designed for modern bedrooms, this premium ottoman bed combines timeless style, comfort and practical storage. |
| `solid-ottoman-bed-4` | Rabbora Classic Ottoman Bed | Reinforced solid base storage, King 5ft size. | A beautifully balanced design that brings a sophisticated feel, relaxing comfort and useful storage to your bedroom. |
| `solid-ottoman-bed-5` | Rabbora Elegant Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | Create a warm and inviting bedroom with an elegant ottoman bed made for comfort, style and everyday practicality. |
| `solid-ottoman-bed-6` | Rabbora Comfort Ottoman Bed | Reinforced solid base storage, Single 3ft size. | Combining a comfortable sleeping space with practical under-bed storage, this design is made for modern living. |
| `solid-ottoman-bed-7` | Rabbora Signature Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | A sophisticated bedroom centrepiece offering a stylish finish, comfortable support and generous storage. |
| `solid-ottoman-bed-8` | Rabbora Modern Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | Bring contemporary character to your bedroom with a modern ottoman design focused on comfort and functionality. |
| `solid-ottoman-bed-9` | Rabbora Prestige Ottoman Bed | Reinforced solid base storage, King 5ft size. | A refined choice for those who appreciate elegant bedroom furniture, comfortable design and practical storage. |
| `solid-ottoman-bed-10` | Rabbora Deluxe Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | Designed to enhance your bedroom, this deluxe ottoman bed offers a beautiful balance of style, comfort and convenience. |
| `solid-ottoman-bed-11` | Rabbora Heritage Ottoman Bed | Reinforced solid base storage, Single 3ft size. | A timeless bedroom design combining everyday comfort with a practical ottoman storage solution. |
| `solid-ottoman-bed-12` | Rabbora Select Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | A carefully styled ottoman bed created to add comfort, character and useful storage to your bedroom. |
| `solid-ottoman-bed-13` | Rabbora Grande Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | Make a statement with a sophisticated ottoman bed designed for comfortable nights and convenient bedroom storage. |
| `solid-ottoman-bed-14` | Rabbora Haven Ottoman Bed | Reinforced solid base storage, King 5ft size. | Create a cosy bedroom retreat with a beautifully designed bed offering comfort and practical hidden storage. |
| `solid-ottoman-bed-15` | Rabbora Urban Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | A modern and versatile ottoman bed designed to complement contemporary bedrooms with comfort and functionality. |
| `solid-ottoman-bed-16` | Rabbora Royal Ottoman Bed | Reinforced solid base storage, Single 3ft size. | Add a touch of luxury to your bedroom with a refined ottoman design created for comfort and practical storage. |
| `solid-ottoman-bed-17` | Rabbora Elite Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | An elegant bedroom choice combining sophisticated styling, comfortable sleeping and convenient storage. |
| `solid-ottoman-bed-18` | Rabbora Harmony Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | A beautifully balanced design created to bring comfort, calm and practical storage into your bedroom. |
| `solid-ottoman-bed-19` | Rabbora Grace Ottoman Bed | Reinforced solid base storage, King 5ft size. | Elegant and inviting, this ottoman bed brings a refined character to your bedroom while providing useful storage. |
| `solid-ottoman-bed-20` | Rabbora Comfort Plus Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | Enjoy a practical combination of comfortable sleeping space, elegant styling and accessible ottoman storage. |
| `solid-ottoman-bed-21` | Rabbora Contemporary Ottoman Bed | Reinforced solid base storage, Single 3ft size. | A clean and sophisticated ottoman bed designed to suit modern bedrooms while keeping comfort at the heart of its design. |
| `solid-ottoman-bed-22` | Rabbora Living Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | Designed for everyday living, this stylish ottoman bed combines comfort, character and practical storage. |
| `solid-ottoman-bed-23` | Rabbora Luxe Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | A luxurious bedroom addition offering an elegant appearance, comfortable design and useful hidden storage. |
| `solid-ottoman-bed-24` | Rabbora Classic Luxe Ottoman Bed | Reinforced solid base storage, King 5ft size. | Timeless styling meets everyday practicality in an ottoman bed designed for comfortable and organised bedrooms. |
| `solid-ottoman-bed-25` | Rabbora Comfort Luxe Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | A sophisticated bed designed to create a comfortable bedroom atmosphere with the added benefit of practical storage. |
| `solid-ottoman-bed-26` | Rabbora Grand Ottoman Bed | Reinforced solid base storage, Single 3ft size. | Bring elegance and functionality together with a spacious-looking ottoman design created for modern bedrooms. |
| `solid-ottoman-bed-27` | Rabbora Supreme Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | A premium bedroom centrepiece combining refined styling, relaxing comfort and convenient storage. |
| `solid-ottoman-bed-28` | Rabbora Essence Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | A simple yet elegant approach to bedroom design, combining comfort with the practicality of ottoman storage. |
| `solid-ottoman-bed-29` | Rabbora Modern Luxe Ottoman Bed | Reinforced solid base storage, King 5ft size. | Give your bedroom a sophisticated finish with a modern ottoman bed designed around comfort and everyday convenience. |
| `solid-ottoman-bed-30` | Rabbora Serenity Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | Designed to create a calm and inviting bedroom, this ottoman bed combines comfortable design with useful storage. |
| `solid-ottoman-bed-31` | Rabbora Majestic Ottoman Bed | Reinforced solid base storage, Single 3ft size. | A striking yet versatile ottoman bed designed to add elegance, comfort and practicality to your bedroom. |
| `solid-ottoman-bed-32` | Rabbora Comfort Elite Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | Experience a refined bedroom feel with an elegant bed design offering comfortable sleeping and practical storage. |
| `solid-ottoman-bed-33` | Rabbora Timeless Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | A timeless choice designed to complement a wide range of bedroom interiors while providing comfort and storage. |
| `solid-ottoman-bed-34` | Rabbora Opulent Ottoman Bed | Reinforced solid base storage, King 5ft size. | Add a luxurious feel to your bedroom with an elegant ottoman design made for comfort and practical everyday living. |
| `solid-ottoman-bed-35` | Rabbora Refined Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | A beautifully considered bedroom design combining refined style, comfortable support and useful storage space. |
| `solid-ottoman-bed-36` | Rabbora Signature Luxe Ottoman Bed | Reinforced solid base storage, Single 3ft size. | A sophisticated ottoman bed designed to become a stylish focal point while keeping comfort and practicality in balance. |
| `solid-ottoman-bed-37` | Rabbora Elegant Luxe Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | Bring a polished look to your bedroom with a comfortable ottoman bed designed for modern everyday living. |
| `solid-ottoman-bed-38` | Rabbora Prestige Luxe Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | A refined bedroom centrepiece offering an elegant appearance, comfortable sleeping space and practical storage. |
| `solid-ottoman-bed-39` | Rabbora Modern Comfort Ottoman Bed | Reinforced solid base storage, King 5ft size. | Designed with modern bedrooms in mind, this ottoman bed combines stylish simplicity with everyday comfort and storage. |
| `solid-ottoman-bed-40` | Rabbora Luxury Comfort Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | Enjoy an elegant bedroom atmosphere with a luxurious ottoman bed designed around comfort, style and convenience. |
| `solid-ottoman-bed-41` | Rabbora Grand Luxe Ottoman Bed | Reinforced solid base storage, Single 3ft size. | A sophisticated design that brings together premium bedroom styling, comfortable sleeping and practical storage. |
| `solid-ottoman-bed-42` | Rabbora Classic Comfort Ottoman Bed | Reinforced solid base storage, Small Double 4ft size. | A versatile ottoman bed offering timeless appeal, comfortable design and convenient storage for a well-organised bedroom. |
| `solid-ottoman-bed-43` | Rabbora Pure Ottoman Bed | Reinforced solid base storage, Double 4'6ft size. | A clean and elegant bedroom design focused on comfort, simplicity and the practicality of hidden storage. |
| `solid-ottoman-bed-44` | Rabbora Majestic Luxe Ottoman Bed | Reinforced solid base storage, King 5ft size. | Create an impressive bedroom setting with a refined ottoman bed designed to balance luxury, comfort and functionality. |
| `solid-ottoman-bed-45` | Rabbora Ultimate Ottoman Bed | Reinforced solid base storage, Super King 6ft size. | A sophisticated finishing touch for the bedroom, combining comfortable design, elegant styling and practical ottoman storage. |


## Appendix D — Blanket Boxes per-product text

**manhattan-style-blanket-box — Manhattan Style Blanket Box**

- description: The Manhattan Style Blanket Box brings a clean, contemporary look to any bedroom. Its tailored fabric finish and understated silhouette make it equally at home in a minimal city flat or a spacious main suite, while the deep interior keeps spare bedding, cushions and throws neatly out of sight.
- features: Deep interior storage for spare bedding and throws; Soft-close hinged lid for safe, quiet use; Solid frame construction with a tailored fabric finish; Doubles as extra seating at the foot of the bed

**chesterfield-blanket-box — Chesterfield Blanket Box**

- description: The Chesterfield Blanket Box pairs traditional deep-button detailing with practical everyday storage. It brings warmth and character to a bedroom while offering a sturdy, padded seat and generous space for bedding underneath.
- features: Traditional deep-button Chesterfield detailing; Sturdy frame designed to support everyday seating; Generous storage space beneath a padded lid; Turned wooden feet for a classic finish

**luxury-storage-blanket-box — Luxury Storage Blanket Box**

- description: The Luxury Storage Blanket Box is designed to be the statement piece in your bedroom. Its rich, plush upholstery and extra-deep interior give you generous space for bulkier bedding, while the reinforced frame is built for daily use.
- features: Plush velvet-style upholstery for a luxury finish; Extra-deep interior for bulkier bedding and blankets; Reinforced base for long-term everyday use; Padded lid doubles as a comfortable seat

**ottoman-style-blanket-box — Ottoman Style Blanket Box**

- description: The Ottoman Style Blanket Box brings a soft, textured finish to everyday storage. Its neutral tones and compact footprint make it a versatile addition to bedrooms of any size, with a practical lift-up lid for easy access.
- features: Soft, textured bouclé-style fabric finish; Lift-up lid with practical hinge mechanism; Neutral tones suited to a range of bedroom styles; Compact footprint for smaller rooms

**premium-fabric-blanket-box — Premium Fabric Blanket Box**

- description: The Premium Fabric Blanket Box is finished in a soft, plush upholstery that feels as good as it looks. It offers a roomy interior for duvets and pillows, with tailored seams and a considered profile that suits a range of bedroom styles.
- features: Premium plush fabric with a soft-touch finish; Roomy interior suited to duvets and pillows; Neatly finished seams and tailored edges; Sits comfortably at the foot of most bed sizes

**classic-blanket-box — Classic Blanket Box**

- description: The Classic Blanket Box keeps things simple with a timeless woven finish and a versatile silhouette that suits both modern and traditional bedrooms. It's a practical, accessible way to add extra storage without compromising on style.
- features: Timeless woven-texture fabric finish; Straightforward, versatile silhouette; Practical storage for everyday bedroom items; An accessible entry point into the range

**plush-storage-blanket-box — Plush Storage Blanket Box**

- description: The Plush Storage Blanket Box combines a warm, soft-touch finish with generous everyday storage. Its sturdy frame and padded lid make it a comfortable, practical addition to the end of the bed.
- features: Warm, soft-touch plush fabric finish; Generously sized for bulkier bedroom items; Sturdy frame with a comfortable padded lid; Available in a range of considered colourways


## Appendix E — Best Sellers descriptions (ids 1–4)

| id | slug | description |
|---|---|---|
| 1 | `art-deco-bed-style` | One of our most popular designs, handmade to order on a solid, supportive frame and finished with tailored upholstery. |
| 2 | `kendal-butterfly-wingback-bed` | A striking wingback silhouette, handmade to order on a solid, supportive frame and finished with tailored upholstery. |
| 3 | `empire-bed-frame-ottoman-storage` | A considered frame with the option of built-in ottoman storage, handmade to order and finished with tailored upholstery. |
| 4 | `orlando-bed-frame-ottoman-storage` | A refined bed frame with the option of built-in ottoman storage, handmade to order and finished with tailored upholstery. |


## Appendix F — Per-product text for Slatted Ottoman, Rapid Delivery, High Headboard, Kids, Mattresses, Sofas


### F — Slatted Ottoman

| slug | name | description | features | materials |
|---|---|---|---|---|
| `chelsea-slatted-ottoman-bed` | Rabbora Manhattan Slatted Ottoman Bed | A refined slatted ottoman bed designed to give your bedroom a sophisticated look while providing comfortable sleeping and practical hidden storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `hampton-slatted-ottoman-bed` | Rabbora Milan Slatted Wingback Ottoman Bed | A beautifully styled wingback design combining elegant bedroom character, comfortable support and convenient ottoman storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `monaco-ottoman-bed` | Rabbora Athens Slatted Designer Ottoman Bed | A contemporary designer bed created to bring clean styling, relaxing comfort and useful storage together in one elegant bedroom piece. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `windsor-slatted-ottoman-bed` | Rabbora Empire Slatted Ottoman Bed | A statement bedroom design featuring sophisticated detailing, comfortable sleeping space and practical under-bed storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `kensington-slatted-ottoman-bed` | Rabbora Art Deco Slatted Ottoman Bed | Inspired by elegant Art Deco styling, this bed brings a luxurious character to the bedroom while offering practical ottoman storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `mayfair-ottoman-bed` | Rabbora Orlando Slatted Ottoman Bed | A stylish and versatile bedroom centrepiece designed to provide everyday comfort together with convenient storage beneath the bed. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `richmond-slatted-ottoman-bed` | Rabbora Kendal Slatted Wingback Bed | A graceful wingback silhouette combined with comfortable design and practical storage, ideal for creating an inviting bedroom atmosphere. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `cambridge-slatted-ottoman-bed` | Rabbora Teddy Orlando Slatted Ottoman Bed | A soft and inviting bedroom design that combines elegant styling, comfortable sleeping and useful hidden storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `victoria-ottoman-bed` | Rabbora Park Lane Ambassador Slatted Bed | A luxurious statement bed designed to add refined character, comfort and an impressive finish to a modern bedroom. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `oxford-slatted-ottoman-bed` | Rabbora Brooklyn Slatted Bed | A clean and contemporary slatted design offering a stylish bedroom appearance with comfortable sleeping and practical functionality. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `chester-slatted-ottoman-bed` | Rabbora Washington Slatted Bed | A distinctive bedroom design combining elegant upholstery with a sophisticated frame detail for a refined modern appearance. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `kingston-ottoman-bed` | Rabbora Nevada Slatted Ottoman Bed | A contemporary slatted bed designed to bring understated elegance, everyday comfort and practical bedroom storage together. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `manhattan-slatted-ottoman-bed` | Rabbora Hawaii Cream Slatted Ottoman Bed | A beautifully soft-looking bedroom centrepiece designed to create a calm and elegant setting with useful ottoman storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `brighton-slatted-ottoman-bed` | Rabbora Ibiza Slatted Upholstered Bed | A sophisticated upholstered design with modern detailing, created to provide a stylish bedroom look and comfortable sleeping space. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `lancaster-ottoman-bed` | Rabbora Tokyo Sunrise Slatted Ottoman Bed | A distinctive designer-inspired bed offering an elegant silhouette, comfortable sleeping area and convenient hidden storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `bristol-slatted-ottoman-bed` | Rabbora Malaga Slatted Designer Bed | A graceful designer bed created to add warmth and sophistication to your bedroom while keeping comfort at the centre. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `soho-slatted-ottoman-bed` | Rabbora Madrid Slatted Ottoman Bed | A contemporary lined design that combines modern bedroom styling with comfortable support and practical ottoman storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `belgravia-ottoman-bed` | Rabbora Lisbon Slatted Ottoman Bed | An elegant bedroom design offering a balanced combination of stylish detailing, comfortable sleeping and useful storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `fulham-slatted-ottoman-bed` | Rabbora Rome Slatted Wingback Bed | A sophisticated wingback design that creates an elegant focal point while offering a comfortable and welcoming place to rest. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `chiswick-slatted-ottoman-bed` | Rabbora Mona Lisa Slatted Ottoman Bed | A graceful and elegant bed designed to add a refined presence to the bedroom with the practicality of hidden storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `greenwich-ottoman-bed` | Rabbora Barcelona Slatted Bed | A modern lined bed design created to bring clean sophistication, comfort and versatile bedroom styling into your home. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `camden-slatted-ottoman-bed` | Rabbora Florence Slatted Designer Bed | A beautifully proportioned designer bed offering timeless bedroom appeal, comfortable support and a refined finish. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `notting-hill-slatted-ottoman-bed` | Rabbora Duke Slatted Luxury Wide Headboard Bed | A grand bedroom statement featuring a wide headboard design that brings a luxurious hotel-inspired atmosphere to your space. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `marylebone-ottoman-bed` | Rabbora Golden Crown Slatted Ottoman Bed | An elegant statement bed designed to bring a luxurious touch to the bedroom while providing practical hidden storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `highgate-slatted-ottoman-bed` | Rabbora Avon Slatted Triple Panel Bed | A stylish triple-panel design created to add structure and character to your bedroom while providing comfortable everyday use. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `hampstead-slatted-ottoman-bed` | Rabbora Duchess Slatted La Rosa Bed | A graceful and sophisticated bedroom design offering elegant styling, comfortable support and a timeless decorative presence. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `clapham-ottoman-bed` | Rabbora Osaka Slatted Upholstered Bed | A modern upholstered design with distinctive detailing, created for stylish bedrooms and comfortable everyday relaxation. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `islington-slatted-ottoman-bed` | Rabbora Jersey Slatted Ottoman Bed | A versatile bedroom centrepiece combining comfortable sleeping with practical hidden storage and an elegant contemporary appearance. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `shoreditch-slatted-ottoman-bed` | Rabbora Victoria Slatted Designer Bed | A refined lined design that brings elegant proportions, comfortable support and sophisticated bedroom character together. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `southbank-ottoman-bed` | Rabbora Thames Slatted Wingback Bed | A striking wingback-inspired design created to provide a luxurious bedroom presence with comfortable everyday support. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `kew-slatted-ottoman-bed` | Rabbora Cloud Slatted Boucle Bed | A soft and luxurious bedroom design with a welcoming appearance, created to bring comfort and modern elegance to your space. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `putney-slatted-ottoman-bed` | Rabbora Las Vegas Slatted Luxury High Headboard Bed | A dramatic high-headboard design inspired by luxury hotel interiors, creating an impressive focal point for the bedroom. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `wimbledon-ottoman-bed` | Rabbora Paris Slatted Linear Bed | A clean linear design offering contemporary elegance, comfortable sleeping and a sophisticated foundation for modern bedrooms. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `dulwich-slatted-ottoman-bed` | Rabbora Skyscraper Slatted Art Deco Bed | A distinctive Art Deco-inspired design created to give the bedroom a bold architectural feel with elegant styling. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `ealing-slatted-ottoman-bed` | Rabbora Torino Slatted Designer Bed | A beautifully structured bedroom design offering a refined appearance, comfortable sleeping space and versatile styling. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `harrow-ottoman-bed` | Rabbora Sheffield Slatted Studded Bed | A sophisticated studded design that adds elegant detailing and character while maintaining a comfortable bedroom atmosphere. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `barnet-slatted-ottoman-bed` | Rabbora Cannes Slatted Ottoman Bed | A stylish bedroom centrepiece designed to combine elegant detailing, comfortable support and practical storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `farringdon-slatted-ottoman-bed` | Rabbora Teddy Zen Slatted Boucle Ottoman Bed | A calm and luxurious bedroom design combining a soft boucle-inspired appearance with comfortable sleeping and useful storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `barbican-slatted-ottoman-bed` | Rabbora Venice Slatted Linear Ottoman Bed | A contemporary linear design offering a clean bedroom appearance, comfortable sleeping and convenient hidden storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `angel-ottoman-bed` | Rabbora Geneva Slatted High & Wide Headboard Bed | A luxurious wide-headboard design created to make a dramatic bedroom statement while offering a comfortable and refined sleeping space. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `finsbury-slatted-ottoman-bed` | Rabbora Zurich Slatted Ottoman Bed | A sophisticated and practical bedroom design combining elegant styling, comfortable support and convenient under-bed storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `whitechapel-slatted-ottoman-bed` | Rabbora Arizona Slatted Ottoman Bed | A versatile bedroom design created to provide comfortable sleeping with a clean and stylish appearance and useful storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `aldgate-ottoman-bed` | Rabbora Golden Ibiza Slatted Linear Bed | A luxurious linear design with distinctive detailing, created to add elegance and a premium finish to the bedroom. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `stratford-slatted-ottoman-bed` | Rabbora Sheffield Slatted Upholstered Bed | A refined upholstered bedroom design offering comfortable support, elegant styling and versatile appeal. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `hackney-wick-slatted-ottoman-bed` | Rabbora Yukon Slatted Wing Bed | A stylish winged design created to give the bedroom a sophisticated appearance while providing comfortable everyday support. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `bow-ottoman-bed` | Rabbora Presidential Slatted Ottoman Bed | A grand bedroom design offering an impressive presence, comfortable sleeping space and practical hidden storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `poplar-slatted-ottoman-bed` | Rabbora Montana Ambassador Slatted Bed | A luxurious ambassador-inspired design created to bring a premium and sophisticated atmosphere into the bedroom. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `limehouse-slatted-ottoman-bed` | Rabbora Amalfi Slatted Italian Style Ottoman Bed | An elegant Italian-inspired design combining sophisticated bedroom styling, comfortable sleeping and practical storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `rotherhithe-ottoman-bed` | Rabbora Teddy Wave Slatted Ottoman Bed | A soft and contemporary wave-inspired design created to bring comfort, character and modern elegance to the bedroom. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `deptford-slatted-ottoman-bed` | Rabbora Black Plush Golden Pyramid Slatted Ottoman Bed | A bold luxury design combining dramatic styling with comfortable sleeping and practical ottoman storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `new-cross-slatted-ottoman-bed` | Rabbora Bahamas Slatted Luxury Wide Headboard Bed | A grand hotel-inspired bedroom centrepiece featuring a wide headboard design for an impressive and luxurious appearance. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `catford-ottoman-bed` | Rabbora Riviera Slatted High Headboard Bed | A sophisticated high-headboard design created to add a luxurious focal point and elegant character to your bedroom. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `sydenham-slatted-ottoman-bed` | Rabbora New York Slatted Tall Headboard Bed | A bold tall-headboard design bringing contemporary luxury and a striking architectural presence to the bedroom. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `crystal-palace-slatted-ottoman-bed` | Rabbora Grand Slatted Luxury Upholstered Bed | A truly impressive bedroom centrepiece designed with a luxurious appearance, sophisticated detailing and comfortable sleeping space. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `norwood-ottoman-bed` | Rabbora Silver Fern Slatted High Headboard Bed | An elegant high-headboard design created to bring a refined and luxurious atmosphere to contemporary bedrooms. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `streatham-slatted-ottoman-bed` | Rabbora Marble Bahamas Slatted Luxury Bed | A grand hotel-style design combining a wide statement profile with sophisticated styling and a luxurious bedroom presence. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `balham-slatted-ottoman-bed` | Rabbora Duke of Orlando Slatted Wide Headboard Bed | A bold wide-headboard design created to become the focal point of a luxury bedroom while providing comfortable everyday use. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `tooting-ottoman-bed` | Rabbora Ascot Slatted Tall Headboard Bed | A sophisticated tall-headboard design offering an elegant bedroom statement with comfortable sleeping and premium styling. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `earlsfield-slatted-ottoman-bed` | Rabbora Teddy Duke Slatted Wide Headboard Bed | A luxurious wide-headboard design combining soft contemporary character with an impressive and comfortable bedroom setting. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |
| `raynes-park-slatted-ottoman-bed` | Rabbora Astoria Slatted Deco Ottoman Bed | A refined Deco-inspired ottoman design created to add elegant character, comfortable sleeping and practical hidden storage. | Reinforced slatted base for supportive, breathable sleep; Spacious gas-lift ottoman storage beneath the mattress; Handmade to order in Britain; Available in multiple UK bed sizes | Solid timber frame; Reinforced slatted base; High-density foam headboard padding; Tailored fabric upholstery |

### F — Rapid Delivery

| slug | name | shortInfo | description | features |
|---|---|---|---|---|
| `rapid-1` | Rabbora Athens Linear Bed | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A clean, linear silhouette brings understated modern style to the bedroom, with a solid supportive frame designed for comfortable, everyday sleep. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-2` | Rabbora Brooklyn Bed Frame | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A contemporary bed frame with subtle linear detailing, offering a stylish yet practical centrepiece for a modern bedroom. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-3` | Rabbora Chicago High Headboard Bed | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A striking two-piece high headboard design brings a bold, statement presence to the bedroom while providing comfortable, supportive sleep. | Tall two-piece upholstered headboard; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-4` | Rabbora Empire Ottoman Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | A versatile bed frame with the option of ottoman storage beneath the mattress, combining comfortable sleeping with practical hidden storage. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-5` | Rabbora Hawaii Cream Bouclé Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | A soft, textured bouclé finish gives this bed a warm, inviting character, with the option of ottoman storage for practical everyday use. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-6` | Rabbora Kendal Wingback Bed | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A graceful wingback silhouette adds a refined, elegant touch to the bedroom, combining classic styling with comfortable everyday support. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-7` | Rabbora Lisbon Ottoman Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | A stylish bed frame offering the option of ottoman storage, bringing together comfortable sleeping and practical under-bed space. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-8` | Rabbora Málaga Designer Bed | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | An upholstered designer bed with a refined finish, created to bring a touch of contemporary elegance to the bedroom. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-9` | Rabbora Manhattan Bed Frame | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A clean-lined bed frame with subtle detailing, offering a versatile and stylish foundation for a modern bedroom. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-10` | Rabbora Milan Wingback Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | A sophisticated wingback design with the option of ottoman storage, combining classic elegance with practical everyday functionality. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-11` | Rabbora Mona Lisa Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | An elegant bed frame with the option of ottoman storage, designed to bring a graceful presence and practical convenience to the bedroom. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-12` | Rabbora Nevada Bed Frame | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A contemporary lined bed frame offering understated style and comfortable everyday support for a modern bedroom. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-13` | Rabbora Orlando Ottoman Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | A versatile bed frame with the option of ottoman storage, combining a comfortable sleeping space with useful hidden storage. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-14` | Rabbora Princess Signature Bed | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | An upholstered signature bed frame with a refined, tailored finish, designed to bring a touch of elegance to the bedroom. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-15` | Rabbora Amalfi Italian Style Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | An Italian-inspired design with the option of ottoman storage, bringing sophisticated European styling and practical convenience together. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-16` | Rabbora Teddy-Orlando Ottoman Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | A soft, inviting bed frame with the option of ottoman storage, combining comfortable everyday sleeping with useful hidden storage. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-17` | Rabbora Tokyo Sunrise Ottoman Bed | Bed frame with optional ottoman storage, available with rapid dispatch on selected sizes and fabrics. | A distinctive designer-inspired bed with the option of ottoman storage, offering an elegant silhouette and practical under-bed space. | Gas-lift ottoman storage beneath the mattress; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-18` | Rabbora Torino Bumper Bed | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A softly upholstered bumper-style design brings a rounded, contemporary character to the bedroom, with comfortable everyday support. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-19` | Rabbora Washington Bed Frame | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A striking bed frame finished with black fabric-covered edges over a black wooden frame, bringing bold, contemporary character to the bedroom. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-20` | Rabbora Duchess of La Rosa Bed | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | A graceful and sophisticated bed design offering elegant styling and a timeless, decorative presence for the bedroom. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-21` | Rabbora Art Deco Bed | Upholstered bed frame available with rapid dispatch on selected sizes and fabrics. | Inspired by classic Art Deco styling, this bed brings a luxurious, geometric character to the bedroom with comfortable everyday support. | Upholstered construction with a tailored fabric finish; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-22` | Rabbora Art Deco Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | An Art Deco-inspired design with the option of drawer storage, combining distinctive styling with convenient, practical storage space. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-23` | Rabbora Brooklyn Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | A contemporary bed frame with the option of drawer storage, bringing stylish linear detailing together with practical everyday convenience. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-24` | Rabbora Divan Hawaii Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | A soft, textured bouclé-inspired divan design with the option of drawer storage, combining warmth and comfort with practical convenience. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-25` | Rabbora Dover Designer Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | A designer storage bed with drawer storage, bringing refined styling together with generous, practical everyday storage space. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-26` | Rabbora Golden Skyline Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | A striking statement bed with the option of drawer storage, offering a sophisticated skyline-inspired appearance and practical convenience. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-27` | Rabbora Lyon Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | A clean, contemporary bed frame with the option of drawer storage, combining understated style with practical everyday functionality. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-28` | Rabbora Mayfair Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | A refined bed frame with the option of drawer storage, bringing sophisticated bedroom styling together with practical convenience. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-29` | Rabbora Mona Lisa Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | An elegant bed frame with the option of drawer storage, combining a graceful appearance with practical, everyday storage space. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-30` | Rabbora Toronto Lux Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | A premium storage bed with the option of drawer storage, offering a refined, luxurious appearance alongside practical convenience. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |
| `rapid-31` | Rabbora Virginia Storage Bed | Storage bed with drawer storage, available with rapid dispatch on selected sizes and fabrics. | A versatile bed frame with drawer storage, designed to bring practical, everyday convenience together with comfortable, supportive sleep. | Drawer storage built into the base; Sprung slatted base for supportive, breathable sleep; Solid frame built for everyday use; Selected for faster dispatch on chosen sizes/fabrics |

### F — High Headboard

| slug | name | shortInfo | description | features |
|---|---|---|---|---|
| `high-headboard-bed-1` | Rabbora Duke High & Wide Headboard Bed | Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing. | A luxurious statement bed designed around an impressive high and wide headboard, creating a sophisticated bedroom focal point with an elegant and refined presence. | Statement headboard, 130cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-2` | Rabbora Las Vegas High Headboard Bed | Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing. | A striking high-headboard design created to bring a luxurious hotel-inspired atmosphere to the bedroom while offering an elegant and comfortable place to rest. | Statement headboard, 140cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-3` | Rabbora Athena High Headboard Bed | Statement upholstered headboard standing 150cm tall, with deep-buttoned detailing. | An elegant high-headboard bed designed to create a sophisticated bedroom centrepiece with graceful proportions, refined styling and comfortable sleeping space. | Statement headboard, 150cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-4` | Rabbora Chicago High Headboard Bed | Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing. | A sophisticated high-headboard design that gives the bedroom a strong and elegant focal point while creating a comfortable and inviting sleeping environment. | Statement headboard, 130cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-5` | Rabbora Model Square Hotel Bed | Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing. | A bold hotel-inspired bed featuring a distinctive structured profile, designed to bring a luxurious and sophisticated character to the modern bedroom. | Statement headboard, 140cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-6` | Rabbora Starlight Luxury Bed | Statement upholstered headboard standing 150cm tall, with deep-buttoned detailing. | A glamorous bedroom centrepiece designed to create an elegant and luxurious atmosphere, bringing refined character and sophisticated style to your bedroom. | Statement headboard, 150cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-7` | Rabbora DaVinci Tall Headboard Bed | Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing. | A grand tall-headboard design created to make an impressive statement in the bedroom while offering an elegant appearance and comfortable sleeping space. | Statement headboard, 130cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-8` | Rabbora Geneva High & Wide Headboard Bed | Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing. | A luxurious high and wide headboard design created to give the bedroom a dramatic focal point with sophisticated styling and an elegant, comfortable feel. | Statement headboard, 140cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-9` | Rabbora Bahamas Wide Headboard Bed | Statement upholstered headboard standing 150cm tall, with deep-buttoned detailing. | A grand hotel-inspired design featuring a wide statement headboard, created to bring an impressive and luxurious character to the bedroom. | Statement headboard, 150cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-10` | Rabbora Riviera High Headboard Bed | Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing. | A refined high-headboard bed designed to create an elegant bedroom focal point while bringing a sophisticated and luxurious feel to the space. | Statement headboard, 130cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-11` | Rabbora New York Tall Headboard Bed | Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing. | A striking tall-headboard design created to give the bedroom a contemporary luxury appearance with an impressive presence and elegant proportions. | Statement headboard, 140cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-12` | Rabbora Grand Luxury Upholstered Bed | Statement upholstered headboard standing 150cm tall, with deep-buttoned detailing. | A premium statement bed designed to bring a sophisticated and luxurious finish to the bedroom, combining an impressive profile with an elegant upholstered appearance. | Statement headboard, 150cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-13` | Rabbora Silver Fern High Headboard Bed | Statement upholstered headboard standing 130cm tall, with deep-buttoned detailing. | An elegant high-headboard design created to add a refined and luxurious focal point to the bedroom while providing a comfortable and inviting sleeping space. | Statement headboard, 130cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |
| `high-headboard-bed-14` | Rabbora Marble Bahamas Wide Headboard Bed | Statement upholstered headboard standing 140cm tall, with deep-buttoned detailing. | A luxurious wide-headboard design created to give the bedroom a sophisticated hotel-inspired presence with an elegant and impressive overall appearance. | Statement headboard, 140cm tall; Deep-buttoned upholstered detailing; Solid frame construction built for everyday use; Sprung slatted base for a comfortable, breathable sleep surface |

### F — Kids' Beds

| slug | name | shortInfo | description | features |
|---|---|---|---|---|
| `kids-bed-1` | Harper Kids Bed | A safe, durable frame sized and finished for a growing child's room. | A stylish and comfortable kids bed designed to create a cosy space for relaxing, sleeping and enjoying everyday moments. | Low-profile frame designed with child safety in mind; Durable, easy-to-clean upholstered finish; Rounded edges and solid, stable construction; Sprung slatted base for a comfortable sleep surface |
| `kids-bed-2` | Luna Kids Bed | A safe, durable frame sized and finished for a growing child's room. | Bring elegance and comfort to your child's bedroom with the Luna Kids Bed, designed with a beautiful look and a cosy feel. | Low-profile frame designed with child safety in mind; Durable, easy-to-clean upholstered finish; Rounded edges and solid, stable construction; Sprung slatted base for a comfortable sleep surface |
| `kids-bed-3` | Mia Kids Bed | A safe, durable frame sized and finished for a growing child's room. | The Mia Kids Bed combines a charming design with everyday comfort, making it a lovely choice for a modern children's bedroom. | Low-profile frame designed with child safety in mind; Durable, easy-to-clean upholstered finish; Rounded edges and solid, stable construction; Sprung slatted base for a comfortable sleep surface |
| `kids-bed-4` | Oliver Kids Bed | A safe, durable frame sized and finished for a growing child's room. | Create a warm and inviting bedroom with the Oliver Kids Bed, offering a stylish design and a comfortable place to rest. | Low-profile frame designed with child safety in mind; Durable, easy-to-clean upholstered finish; Rounded edges and solid, stable construction; Sprung slatted base for a comfortable sleep surface |
| `kids-bed-5` | Aria Kids Bed | A safe, durable frame sized and finished for a growing child's room. | The Aria Kids Bed adds a touch of luxury to your child's room with its elegant design, cosy finish and timeless appeal. | Low-profile frame designed with child safety in mind; Durable, easy-to-clean upholstered finish; Rounded edges and solid, stable construction; Sprung slatted base for a comfortable sleep surface |

### F — Mattresses

| slug | name | materials | description | features |
|---|---|---|---|---|
| `bedzone-hybrid-memory-pocket-spring` | Bedzone Hybrid Memory Pocket Spring Mattress | Individually wrapped pocket springs; Memory foam comfort layer; Breathable knitted cover | Layered memory foam over individually wrapped pocket springs for balanced support and pressure relief. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Combines springs and foam for balanced support; Reduces motion transfer between sleeping partners; Breathable cover to help regulate temperature; Reinforced edges for consistent support to the perimeter |
| `orthopaedic-zero-gravity` | Healthopaedic Zero Gravity Orthoflex Mattress | High-density support foam; Reinforced firm base layer; Quilted supportive cover | Firm, structured support engineered to keep the spine aligned through the night. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Firm, structured support for spinal alignment; Dense foam base resists sagging over time; Supportive quilted cover for a stable sleep surface; Well suited to those who prefer a firmer feel |
| `pillowtop-2000` | Chicago 3000 Pocket Sprung Ultimate Luxury Mattress | Temperature-sensitive memory foam; High-resilience support foam base; Soft-touch quilted cover | A generously padded pillow-top layer for a soft, cushioned sleep surface. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Slow-responding foam contours to the body; Helps relieve pressure at the hips and shoulders; Reduces motion transfer between sleeping partners; Soft-touch cover for a comfortable sleep surface |
| `luxury-pocket-spring` | Healthopaedic Pillowtop 3000 Mattress | Individually wrapped pocket springs; Natural fibre comfort layer; Quilted knitted cover | Individually wrapped springs that move independently, reducing partner disturbance. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Individually wrapped springs move independently; Even weight distribution across the sleep surface; Breathable construction to help regulate temperature; Reinforced edges for consistent support to the perimeter |
| `cloudrest-memory-foam` | Healthopedic Zero Gravity ZenFloat 1000 Mattress | Temperature-sensitive memory foam; High-resilience support foam base; Soft-touch quilted cover | Slow-responding memory foam that cradles the body and eases pressure points. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Slow-responding foam contours to the body; Helps relieve pressure at the hips and shoulders; Reduces motion transfer between sleeping partners; Soft-touch cover for a comfortable sleep surface |
| `harmony-hybrid-deluxe` | Backcare Luxury 2000 Pocket Mattress | Individually wrapped pocket springs; Memory foam comfort layer; Breathable knitted cover | A refined hybrid construction balancing plush comfort with dependable support. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Combines springs and foam for balanced support; Reduces motion transfer between sleeping partners; Breathable cover to help regulate temperature; Reinforced edges for consistent support to the perimeter |
| `firmsupport-orthopaedic-pro` | 1000 CoolGel Mattress | High-density support foam; Reinforced firm base layer; Quilted supportive cover | Dense support layers designed for those who prefer a firmer sleep surface. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Firm, structured support for spinal alignment; Dense foam base resists sagging over time; Supportive quilted cover for a stable sleep surface; Well suited to those who prefer a firmer feel |
| `serenity-pocket-1000` | California Pillow Top Mattress | Individually wrapped pocket springs; Natural fibre comfort layer; Quilted knitted cover | A dependable 1000-count pocket spring mattress offering even, supportive comfort. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Individually wrapped springs move independently; Even weight distribution across the sleep surface; Breathable construction to help regulate temperature; Reinforced edges for consistent support to the perimeter |
| `dreamsoft-memory-foam` | Orion 1000 Pocket Sprung Luxury Mattress | Temperature-sensitive memory foam; High-resilience support foam base; Soft-touch quilted cover | Soft-touch memory foam layered for a gentle, enveloping feel. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Slow-responding foam contours to the body; Helps relieve pressure at the hips and shoulders; Reduces motion transfer between sleeping partners; Soft-touch cover for a comfortable sleep surface |
| `everest-hybrid-support` | MTRS Comfort Dynamics 1000 Mattress | Individually wrapped pocket springs; Memory foam comfort layer; Breathable knitted cover | A supportive hybrid build combining foam comfort layers with responsive springs. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Combines springs and foam for balanced support; Reduces motion transfer between sleeping partners; Breathable cover to help regulate temperature; Reinforced edges for consistent support to the perimeter |
| `royaltouch-pocket-spring` | Bedzone Titanium Ortho 12.5 Mattress | Individually wrapped pocket springs; Natural fibre comfort layer; Quilted knitted cover | A premium pocket spring mattress finished with a plush, quilted sleep surface. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Individually wrapped springs move independently; Even weight distribution across the sleep surface; Breathable construction to help regulate temperature; Reinforced edges for consistent support to the perimeter |
| `restwell-orthopaedic-classic` | Orion 2000 Pocket Sprung Luxury Mattress | High-density support foam; Reinforced firm base layer; Quilted supportive cover | Reliable orthopaedic support at an accessible price point. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Firm, structured support for spinal alignment; Dense foam base resists sagging over time; Supportive quilted cover for a stable sleep surface; Well suited to those who prefer a firmer feel |
| `nightcloud-memory-foam-plus` | MTRS Atomic Comfort 5000 Mattress | Temperature-sensitive memory foam; High-resilience support foam base; Soft-touch quilted cover | An upgraded memory foam layer for deeper contouring comfort. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Slow-responding foam contours to the body; Helps relieve pressure at the hips and shoulders; Reduces motion transfer between sleeping partners; Soft-touch cover for a comfortable sleep surface |
| `coastal-hybrid-breeze` | MTRS Comfort Dynamics 2000 Pocket Mattress | Individually wrapped pocket springs; Memory foam comfort layer; Breathable knitted cover | A breathable hybrid mattress designed to help regulate temperature through the night. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Combines springs and foam for balanced support; Reduces motion transfer between sleeping partners; Breathable cover to help regulate temperature; Reinforced edges for consistent support to the perimeter |
| `pureposture-orthopaedic` | MTRS Atomic Comfort 3000 Mattress | High-density support foam; Reinforced firm base layer; Quilted supportive cover | Posture-focused support built for consistent spinal alignment. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Firm, structured support for spinal alignment; Dense foam base resists sagging over time; Supportive quilted cover for a stable sleep surface; Well suited to those who prefer a firmer feel |
| `signature-pocket-2000` | MTRS Lux Comfort 9000 Mattress | Individually wrapped pocket springs; Natural fibre comfort layer; Quilted knitted cover | Our most advanced pocket spring construction, with 2000 individually wrapped coils. Built to a Rabbora Living standard for durable, everyday comfort, this mattress is designed to support a better night's sleep for years to come. | Individually wrapped springs move independently; Even weight distribution across the sleep surface; Breathable construction to help regulate temperature; Reinforced edges for consistent support to the perimeter |


### F — Sofas

**chesterfield-3-seater-sofa — Chesterfield 3-Seater Sofa**

- description: The Chesterfield 3-Seater Sofa brings timeless character to any living room. Deep-button detailing and rolled arms pair with a solid hardwood frame, giving you a statement seating piece built to be lived with for years.
- features: Traditional deep-button Chesterfield detailing; Solid hardwood frame built for everyday use; High-density foam and fibre-wrapped cushions; Turned wooden feet for a classic finish

**chelsea-corner-sofa — Chelsea Corner Sofa**

- description: The Chelsea Corner Sofa is built for relaxed, everyday family living. Its generous corner layout and deep, plush cushioning create a comfortable spot to unwind, finished in a hardwearing woven fabric.
- features: Generous corner layout suited to family living rooms; Deep seats with plush, supportive cushioning; Woven fabric finish that wears well day to day; Reinforced frame designed for regular use

**hampton-2-seater-sofa — Hampton 2-Seater Sofa**

- description: The Hampton 2-Seater Sofa brings a soft, contemporary look to compact living spaces. Its tailored linen-look fabric and neat tapered legs make it equally suited to a city flat or a smaller snug.
- features: Compact contemporary silhouette for smaller rooms; Soft linen-look fabric with a tailored finish; Comfortable foam-filled seat and back cushions; Neat tapered legs in a natural wood finish

**harlow-modular-sofa — Harlow Modular Sofa**

- description: The Harlow Modular Sofa is designed to move with you. Its modular sections can be arranged to suit your room, finished in a rich, plush velvet-style fabric that feels as good as it looks.
- features: Modular sections that adapt to your room layout; Plush velvet-style upholstery for a luxury finish; Deep-fill cushions for a relaxed, comfortable seat; Reinforced frame designed for everyday family use

