/* =========================================================
   RABBORA LIVING — BED FRAMES
   ---------------------------------------------------------
   Self-contained product data + detail-page logic for
   bed-frames.html. Loaded AFTER script.js (which
   handles the shared header, mobile nav, search, wishlist
   count, cart count — none of that is duplicated here).

   ===============================
   PRODUCT DATA
   ===============================
   These 30 entries are real Rabbora products (name, price,
   oldPrice, badge and image) pulled from the Slatted Ottoman
   Beds, Solid Base Ottomans, High Headboard Beds and TV Beds
   ranges, so this hub page showcases real, currently-listed
   beds rather than placeholders. "description"/"features" are
   still generic filler text — real per-product copy for these
   wasn't available/requested when this data was populated.
   ========================================================= */

var BF_PRODUCTS = [
  {
    slug: "bed-frame-1",
    name: "Rabbora Manhattan Slatted Ottoman Bed",
    price: 249.0,
    oldPrice: 429.0,
    badge: "42% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-1.jfif",
    images: ["slatted/img-1.jfif", "slatted/img-6.jfif", "slatted/img-5.jfif", "slatted/img-4.jfif", "slatted/img-2.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-2",
    name: "Rabbora Milan Slatted Wingback Ottoman Bed",
    price: 259.0,
    oldPrice: 420.0,
    badge: "38% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-7.jfif",
    images: ["slatted/img-7.jfif", "slatted/img-8.jfif", "slatted/img-9.jfif", "slatted/img-10.jfif", "slatted/img-3.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-3",
    name: "Rabbora Athens Slatted Designer Ottoman Bed",
    price: 289.0,
    oldPrice: 400.0,
    badge: "28% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-12.jfif",
    images: ["slatted/img-12.jfif", "slatted/img-15.jfif", "slatted/img-13.jfif", "slatted/img-11.jfif", "slatted/img-14.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-4",
    name: "Rabbora Empire Slatted Ottoman Bed",
    price: 289.0,
    oldPrice: 420.0,
    badge: "31% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-17.jfif",
    images: ["slatted/img-17.jfif", "slatted/img-19.jfif", "slatted/img-18.jfif", "slatted/img-12.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-5",
    name: "Rabbora Art Deco Slatted Ottoman Bed",
    price: 252.0,
    oldPrice: 420.0,
    badge: "40% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-22.jfif",
    images: ["slatted/img-22.jfif", "slatted/img-24.jfif", "slatted/img-25.jfif", "slatted/img-26.jfif", "slatted/img-23.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-6",
    name: "Rabbora Orlando Slatted Ottoman Bed",
    price: 306.59,
    oldPrice: 420.0,
    badge: "27% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-30.png",
    images: ["slatted/img-30.png", "slatted/img-28.png", "slatted/img-29.png", "slatted/img-31.png", "slatted/img-27.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-7",
    name: "Rabbora Kendal Slatted Wingback Bed",
    price: 299.0,
    oldPrice: 444.0,
    badge: "33% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/img-35.png",
    images: ["slatted/img-35.png", "slatted/img-34.png", "slatted/img-33.png", "slatted/img-32.png", "slatted/img-36.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-8",
    name: "Rabbora Teddy Orlando Slatted Ottoman Bed",
    price: 306.59,
    oldPrice: 420.0,
    badge: "27% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/34.png",
    images: ["slatted/34.png", "slatted/35.png", "slatted/36.png", "slatted/37.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-9",
    name: "Rabbora Park Lane Ambassador Slatted Bed",
    price: 449.0,
    oldPrice: 600.0,
    badge: "25% off",
    rating: 5,
    reviewCount: 0,
    image: "slatted/38.png",
    images: ["slatted/38.png", "slatted/39.png", "slatted/img-37.png", "slatted/img-39.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-10",
    name: "Rabbora Solid Ottoman Bed",
    price: 249.0,
    oldPrice: 429.0,
    badge: "42% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/1.jfif",
    images: ["solid/1.jfif", "solid/2.jfif", "solid/3.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-11",
    name: "Rabbora Luxury Solid Ottoman Bed",
    price: 259.0,
    oldPrice: 420.0,
    badge: "38% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/4.jfif",
    images: ["solid/4.jfif", "solid/5.jfif", "solid/6.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-12",
    name: "Rabbora Premium Ottoman Bed",
    price: 289.0,
    oldPrice: 400.0,
    badge: "28% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/7.jfif",
    images: ["solid/7.jfif", "solid/8.jfif", "solid/9.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-13",
    name: "Rabbora Classic Ottoman Bed",
    price: 289.0,
    oldPrice: 420.0,
    badge: "31% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/10.jfif",
    images: ["solid/10.jfif", "solid/11.jfif", "solid/12.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-14",
    name: "Rabbora Elegant Ottoman Bed",
    price: 252.0,
    oldPrice: 420.0,
    badge: "40% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/13.jfif",
    images: ["solid/13.jfif", "solid/14.jfif", "solid/15.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-15",
    name: "Rabbora Comfort Ottoman Bed",
    price: 299.0,
    oldPrice: 444.0,
    badge: "33% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/16.jfif",
    images: ["solid/16.jfif", "solid/17.jfif", "solid/18.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-16",
    name: "Rabbora Signature Ottoman Bed",
    price: 299.0,
    oldPrice: 420.0,
    badge: "29% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/19.jfif",
    images: ["solid/19.jfif", "solid/20.jfif", "solid/21.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-17",
    name: "Rabbora Modern Ottoman Bed",
    price: 299.0,
    oldPrice: 420.0,
    badge: "29% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/22.jfif",
    images: ["solid/22.jfif", "solid/23.jfif", "solid/24.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-18",
    name: "Rabbora Prestige Ottoman Bed",
    price: 389.0,
    oldPrice: 499.0,
    badge: "22% off",
    rating: 5,
    reviewCount: 0,
    image: "solid/25.jfif",
    images: ["solid/25.jfif", "solid/26.jfif", "solid/27.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Single", "Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Single 3ft", "Small Double 4ft", "Double 4ft 6\"", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-19",
    name: "Rabbora Duke High & Wide Headboard Bed",
    price: 799.0,
    oldPrice: 1000.0,
    badge: "20% off",
    rating: 5,
    reviewCount: 0,
    image: "high/1.jfif",
    images: ["high/1.jfif", "high/2.jfif", "high/3.jfif", "high/4.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Double", "King", "Super King"],
    sizeLabels: ["Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-20",
    name: "Rabbora Las Vegas High Headboard Bed",
    price: 749.0,
    oldPrice: 1000.0,
    badge: "25% off",
    rating: 5,
    reviewCount: 0,
    image: "high/5.jfif",
    images: ["high/5.jfif", "high/6.jfif", "high/7.jfif", "high/8.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-21",
    name: "Rabbora Athena High Headboard Bed",
    price: 699.0,
    oldPrice: 900.0,
    badge: "22% off",
    rating: 5,
    reviewCount: 0,
    image: "high/9.jfif",
    images: ["high/9.jfif", "high/10.jfif", "high/11.jfif", "high/12.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-22",
    name: "Rabbora Chicago High Headboard Bed",
    price: 449.0,
    oldPrice: 480.0,
    badge: "6% off",
    rating: 5,
    reviewCount: 0,
    image: "high/13.jfif",
    images: ["high/13.jfif", "high/14.jfif", "high/15.jfif", "high/16.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-23",
    name: "Rabbora Model Square Hotel Bed",
    price: 649.0,
    oldPrice: 1000.0,
    badge: "35% off",
    rating: 5,
    reviewCount: 0,
    image: "high/17.jfif",
    images: ["high/17.jfif", "high/18.jfif", "high/19.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-24",
    name: "Rabbora Starlight Luxury Bed",
    price: 599.0,
    oldPrice: 900.0,
    badge: "33% off",
    rating: 5,
    reviewCount: 0,
    image: "high/20.jfif",
    images: ["high/20.jfif", "high/21.jfif", "high/22.jfif", "high/23.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-25",
    name: "Rabbora DaVinci Tall Headboard Bed",
    price: 749.0,
    oldPrice: 900.0,
    badge: "17% off",
    rating: 5,
    reviewCount: 0,
    image: "high/24.jfif",
    images: ["high/24.jfif", "high/25.jfif", "high/26.jfif", "high/27.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Double", "King", "Super King"],
    sizeLabels: ["Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-26",
    name: "Rabbora Geneva High & Wide Headboard Bed",
    price: 749.0,
    oldPrice: 1000.0,
    badge: "25% off",
    rating: 5,
    reviewCount: 0,
    image: "high/28.jfif",
    images: ["high/28.jfif", "high/29.jfif", "high/30.jfif", "high/31.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Small Double", "Double", "King", "Super King"],
    sizeLabels: ["Small Double 4ft", "Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-27",
    name: "Rabbora Milano TV Bed",
    price: 999.0,
    oldPrice: 1399.0,
    badge: "29% Off",
    rating: 5,
    reviewCount: 0,
    image: "tv/img-1.jfif",
    images: ["tv/img-1.jfif", "tv/img-22.png", "tv/img-23.png"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Double", "King", "Super King"],
    sizeLabels: ["Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-28",
    name: "Rabbora Monaco TV Bed",
    price: 990.0,
    oldPrice: 1399.0,
    badge: "29% Off",
    rating: 5,
    reviewCount: 0,
    image: "tv/img-2.jfif",
    images: ["tv/img-2.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Double", "King", "Super King"],
    sizeLabels: ["Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-29",
    name: "Rabbora Windsor TV Bed",
    price: 1099.0,
    oldPrice: 1399.0,
    badge: "21% Off",
    rating: 5,
    reviewCount: 0,
    image: "tv/img-3.jfif",
    images: ["tv/img-3.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Double", "King", "Super King"],
    sizeLabels: ["Double 4'6ft", "King 5ft", "Super King 6ft"]
  },
  {
    slug: "bed-frame-30",
    name: "Rabbora Kensington TV Bed",
    price: 999.0,
    oldPrice: 1399.0,
    badge: "29% Off",
    rating: 5,
    reviewCount: 0,
    image: "tv/img-4.jfif",
    images: ["tv/img-4.jfif"],
    description: "Add a short product description here once real product details are available.",
    features: [],
    sizes: ["Double", "King", "Super King"],
    sizeLabels: ["Double 4'6ft", "King 5ft", "Super King 6ft"]
  }
];

// Exact per-size prices, copied from the same bed on its own category
// page (Slatted Ottoman, Solid Base Ottoman, High Headboard, TV Beds).
// A size missing from a bed's list is not offered for that bed.
var BF_SIZE_PRICES = {
  "bed-frame-1": { "Single": 249, "Small Double": 388, "Double": 429, "King": 459, "Super King": 499 }, // Rabbora Manhattan Slatted Ottoman Bed (SL chelsea-slatted-ottoman-bed)
  "bed-frame-2": { "Single": 259, "Small Double": 359, "Double": 399, "King": 439, "Super King": 469 }, // Rabbora Milan Slatted Wingback Ottoman Bed (SL hampton-slatted-ottoman-bed)
  "bed-frame-3": { "Single": 289, "Small Double": 367.5, "Double": 399, "King": 439, "Super King": 469 }, // Rabbora Athens Slatted Designer Ottoman Bed (SL monaco-ottoman-bed)
  "bed-frame-4": { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 }, // Rabbora Empire Slatted Ottoman Bed (SL windsor-slatted-ottoman-bed)
  "bed-frame-5": { "Single": 252, "Small Double": 383.99, "Double": 449, "King": 489, "Super King": 529 }, // Rabbora Art Deco Slatted Ottoman Bed (SL kensington-slatted-ottoman-bed)
  "bed-frame-6": { "Single": 306.59, "Small Double": 409, "Double": 449, "King": 489, "Super King": 539 }, // Rabbora Orlando Slatted Ottoman Bed (SL mayfair-ottoman-bed)
  "bed-frame-7": { "Single": 299, "Small Double": 409, "Double": 439, "King": 459, "Super King": 509 }, // Rabbora Kendal Slatted Wingback Bed (SL richmond-slatted-ottoman-bed)
  "bed-frame-8": { "Single": 306.59, "Small Double": 439, "Double": 489, "King": 509, "Super King": 559 }, // Rabbora Teddy Orlando Slatted Ottoman Bed (SL cambridge-slatted-ottoman-bed)
  "bed-frame-9": { "Single": 449, "Small Double": 589, "Double": 599, "King": 649, "Super King": 699 }, // Rabbora Park Lane Ambassador Slatted Bed (SL victoria-ottoman-bed)
  "bed-frame-10": { "Single": 249, "Small Double": 388, "Double": 429, "King": 459, "Super King": 499 }, // Rabbora Solid Ottoman Bed (SO solid-ottoman-bed-1)
  "bed-frame-11": { "Single": 259, "Small Double": 359, "Double": 399, "King": 439, "Super King": 469 }, // Rabbora Luxury Solid Ottoman Bed (SO solid-ottoman-bed-2)
  "bed-frame-12": { "Single": 289, "Small Double": 367.5, "Double": 399, "King": 439, "Super King": 469 }, // Rabbora Premium Ottoman Bed (SO solid-ottoman-bed-3)
  "bed-frame-13": { "Single": 289, "Small Double": 409, "Double": 449, "King": 458.99, "Super King": 499 }, // Rabbora Classic Ottoman Bed (SO solid-ottoman-bed-4)
  "bed-frame-14": { "Single": 252, "Small Double": 383.99, "Double": 449, "King": 489, "Super King": 529 }, // Rabbora Elegant Ottoman Bed (SO solid-ottoman-bed-5)
  "bed-frame-15": { "Single": 299, "Small Double": 409, "Double": 439, "King": 459, "Super King": 509 }, // Rabbora Comfort Ottoman Bed (SO solid-ottoman-bed-6)
  "bed-frame-16": { "Single": 299, "Small Double": 369, "Double": 399, "King": 419, "Super King": 479 }, // Rabbora Signature Ottoman Bed (SO solid-ottoman-bed-7)
  "bed-frame-17": { "Single": 299, "Small Double": 409, "Double": 429, "King": 459, "Super King": 499 }, // Rabbora Modern Ottoman Bed (SO solid-ottoman-bed-8)
  "bed-frame-18": { "Single": 389, "Small Double": 439, "Double": 449, "King": 499, "Super King": 549 }, // Rabbora Prestige Ottoman Bed (SO solid-ottoman-bed-9)
  "bed-frame-19": { "Double": 799, "King": 849, "Super King": 899 }, // Rabbora Duke High & Wide Headboard Bed (HH high-headboard-bed-1)
  "bed-frame-20": { "Small Double": 749, "Double": 799, "King": 849, "Super King": 899 }, // Rabbora Las Vegas High Headboard Bed (HH high-headboard-bed-2)
  "bed-frame-21": { "Small Double": 699, "Double": 749, "King": 799, "Super King": 849 }, // Rabbora Athena High Headboard Bed (HH high-headboard-bed-3)
  "bed-frame-22": { "Small Double": 449, "Double": 489, "King": 529, "Super King": 549 }, // Rabbora Chicago High Headboard Bed (HH high-headboard-bed-4)
  "bed-frame-23": { "Small Double": 649, "Double": 699, "King": 799, "Super King": 849 }, // Rabbora Model Square Hotel Bed (HH high-headboard-bed-5)
  "bed-frame-24": { "Small Double": 599, "Double": 649, "King": 699, "Super King": 749 }, // Rabbora Starlight Luxury Bed (HH high-headboard-bed-6)
  "bed-frame-25": { "Double": 749, "King": 799, "Super King": 829 }, // Rabbora DaVinci Tall Headboard Bed (HH high-headboard-bed-7)
  "bed-frame-26": { "Small Double": 749, "Double": 799, "King": 849, "Super King": 899 }, // Rabbora Geneva High & Wide Headboard Bed (HH high-headboard-bed-8)
  "bed-frame-27": { "Double": 999, "King": 1099, "Super King": 1199 }, // Rabbora Milano TV Bed (TV tv-bed-1)
  "bed-frame-28": { "Double": 990, "King": 1094, "Super King": 1190 }, // Rabbora Monaco TV Bed (TV tv-bed-2)
  "bed-frame-29": { "Double": 1099, "King": 1299, "Super King": 1399 }, // Rabbora Windsor TV Bed (TV tv-bed-3)
  "bed-frame-30": { "Double": 999, "King": 1099, "Super King": 1199 } // Rabbora Kensington TV Bed (TV tv-bed-4)
};

// Old (original / "was") price for each size. Single 3ft is not listed:
// it keeps its existing old price. The other sizes are worked out from
// their existing sale price:
//   Small Double 21% off -> old = sale / 0.79
//   Double       28% off -> old = sale / 0.72
//   King         29% off -> old = sale / 0.71
//   Super King   29% off -> old = sale / 0.71
// Any number here can be changed in VS Code; a size left out shows the
// page's old price exactly as before.
var BF_SIZE_OLD_PRICES = {
  "bed-frame-1": { "Small Double": 491.14, "Double": 595.83, "King": 646.48, "Super King": 702.82 },
  "bed-frame-2": { "Small Double": 454.43, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
  "bed-frame-3": { "Small Double": 465.19, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
  "bed-frame-4": { "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 },
  "bed-frame-5": { "Small Double": 486.06, "Double": 623.61, "King": 688.73, "Super King": 745.07 },
  "bed-frame-6": { "Small Double": 517.72, "Double": 623.61, "King": 688.73, "Super King": 759.15 },
  "bed-frame-7": { "Small Double": 517.72, "Double": 609.72, "King": 646.48, "Super King": 716.9 },
  "bed-frame-8": { "Small Double": 555.7, "Double": 679.17, "King": 716.9, "Super King": 787.32 },
  "bed-frame-9": { "Small Double": 745.57, "Double": 831.94, "King": 914.08, "Super King": 984.51 },
  "bed-frame-10": { "Small Double": 491.14, "Double": 595.83, "King": 646.48, "Super King": 702.82 },
  "bed-frame-11": { "Small Double": 454.43, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
  "bed-frame-12": { "Small Double": 465.19, "Double": 554.17, "King": 618.31, "Super King": 660.56 },
  "bed-frame-13": { "Small Double": 517.72, "Double": 623.61, "King": 646.46, "Super King": 702.82 },
  "bed-frame-14": { "Small Double": 486.06, "Double": 623.61, "King": 688.73, "Super King": 745.07 },
  "bed-frame-15": { "Small Double": 517.72, "Double": 609.72, "King": 646.48, "Super King": 716.9 },
  "bed-frame-16": { "Small Double": 467.09, "Double": 554.17, "King": 590.14, "Super King": 674.65 },
  "bed-frame-17": { "Small Double": 517.72, "Double": 595.83, "King": 646.48, "Super King": 702.82 },
  "bed-frame-18": { "Small Double": 555.7, "Double": 623.61, "King": 702.82, "Super King": 773.24 },
  "bed-frame-19": { "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 },
  "bed-frame-20": { "Small Double": 948.1, "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 },
  "bed-frame-21": { "Small Double": 884.81, "Double": 1040.28, "King": 1125.35, "Super King": 1195.77 },
  "bed-frame-22": { "Small Double": 568.35, "Double": 679.17, "King": 745.07, "Super King": 773.24 },
  "bed-frame-23": { "Small Double": 821.52, "Double": 970.83, "King": 1125.35, "Super King": 1195.77 },
  "bed-frame-24": { "Small Double": 758.23, "Double": 901.39, "King": 984.51, "Super King": 1054.93 },
  "bed-frame-25": { "Double": 1040.28, "King": 1125.35, "Super King": 1167.61 },
  "bed-frame-26": { "Small Double": 948.1, "Double": 1109.72, "King": 1195.77, "Super King": 1266.2 },
  "bed-frame-27": { "Double": 1387.5, "King": 1547.89, "Super King": 1688.73 },
  "bed-frame-28": { "Double": 1375, "King": 1540.85, "Super King": 1676.06 },
  "bed-frame-29": { "Double": 1526.39, "King": 1829.58, "Super King": 1970.42 },
  "bed-frame-30": { "Double": 1387.5, "King": 1547.89, "Super King": 1688.73 }
};


// Price of one size (before add-ons); with no size, the base price.
function bfSizePrice(product, size) {
  var map = BF_SIZE_PRICES[product.slug];
  if (size && map && typeof map[size] === "number") return map[size];
  return product.price;
}

// Button text for a size, e.g. "King 5ft".
function bfSizeLabel(product, size) {
  var i = (product.sizes || []).indexOf(size);
  return (product.sizeLabels && product.sizeLabels[i]) || size;
}


var BF_FABRIC_COLLECTIONS = [
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

  /**
   * Reviews are stored per-product in localStorage, following the same
   * pattern as the existing Cart/Wishlist stores elsewhere on this site
   * (a plain JSON array under one key per product), but self-contained
   * here since no shared review store exists yet.
   */
  var BF_REVIEWS_STORAGE_PREFIX = "rabboraReviews:bedframe:";

  function getStoredReviews(slug) {
    try {
      var raw = window.localStorage.getItem(BF_REVIEWS_STORAGE_PREFIX + slug);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveReview(slug, review) {
    var reviews = getStoredReviews(slug);
    reviews.push(review);
    try {
      window.localStorage.setItem(BF_REVIEWS_STORAGE_PREFIX + slug, JSON.stringify(reviews));
      return true;
    } catch (err) {
      return false;
    }
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

    var ottomanStorageEl = document.getElementById("bfOttomanStorageOptions");
    var ottomanStorageMsg = document.getElementById("bfOttomanStorageMessage");
    var footstoolEl = document.getElementById("bfFootstoolOptions");
    var footstoolMsg = document.getElementById("bfFootstoolMessage");
    var headboardCustomEl = document.getElementById("bfHeadboardCustomOptions");
    var headboardCustomMsg = document.getElementById("bfHeadboardCustomMessage");
    var customRequestEl = document.getElementById("bfCustomRequest");
    var assemblyEl = document.getElementById("bfAssemblyOptions");
    var assemblyMsg = document.getElementById("bfAssemblyMessage");
    var deliveryDelayEl = document.getElementById("bfDeliveryDelayOptions");
    var deliveryDelayMsg = document.getElementById("bfDeliveryDelayMessage");
    var delayDateWrap = document.getElementById("bfDelayDateWrap");
    var delayDateInput = document.getElementById("bfDelayDate");

    var currentProduct = null;
    var quantity = 1;
    var selectedFabric = null;
    var selectedFabricSlug = null;
    var selectedFabricImage = null;
    var selectedSize = null;
    var imageIndex = 0;
    var ottomanStorage = null;
    var footstoolBlanketBox = null;
    var headboardCustom = null;
    var customRequest = "";
    var assembly = null;
    var deliveryDelay = null;
    var deliveryDate = "";

    var ASSEMBLY_PRICE = 59;

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

      // Same real fabric collections/paths as the working Blanket Box and
      // Sofa fabric selectors, grouped under their collection headings
      // since there are now 95 real colours rather than the old 29-item
      // flat placeholder list.
      BF_FABRIC_COLLECTIONS.forEach(function (collection) {
        var groupEl = document.createElement("div");
        groupEl.className = "bb-modal__fabric-collection";

        var titleEl = document.createElement("p");
        titleEl.className = "bb-modal__fabric-collection-title";
        titleEl.textContent = collection.name;
        groupEl.appendChild(titleEl);

        var gridEl = document.createElement("div");
        gridEl.className = "bb-modal__fabric-grid";

        collection.fabrics.forEach(function (fabric, index) {
          var isSelected = selectedFabric === fabric.name;
          if (selectedFabric === null && collection === BF_FABRIC_COLLECTIONS[0] && index === 0) {
            selectedFabric = fabric.name;
            selectedFabricSlug = fabric.slug;
            selectedFabricImage = fabric.image;
            isSelected = true;
          }

          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "fabric-swatch";
          btn.setAttribute("aria-pressed", String(isSelected));
          btn.setAttribute("aria-label", "Select " + fabric.name);
          btn.innerHTML =
            '<span class="fabric-swatch__ring">' +
              '<img src="' + fabric.image + '" alt="" class="fabric-swatch__image" loading="lazy" width="56" height="56" onerror="this.style.display=&#39;none&#39;; this.parentElement.classList.add(&#39;fabric-swatch__ring--fallback&#39;);" />' +
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
              selectedFabricSlug = null;
              selectedFabricImage = null;
            } else {
              selectedFabric = fabric.name;
              selectedFabricSlug = fabric.slug;
              selectedFabricImage = fabric.image;
              btn.setAttribute("aria-pressed", "true");
            }
          });

          gridEl.appendChild(btn);
        });

        groupEl.appendChild(gridEl);
        fabricsEl.appendChild(groupEl);
      });
    }


    // ---- Selected-size price (shown directly below the size buttons) ----
    // Always shows the price of the size that is currently selected, and
    // nothing while no size is selected. The crossed-out price is only
    // shown when the product data has a real original price for that
    // size (the stored oldPrice belongs to the base size, i.e. the size
    // with no price difference) and it is higher than the price.
    // ---- Price area: selected size, current price, crossed-out old
    // price, "% off" and monthly amount ----
    // Same presentation on every product page. Nothing here changes a
    // price: every number comes from this page's existing price logic.
    // - Old price: only the real old/compare-at price of the selected size
    //   (API compare_at_price, or this file's own fallback rule). None ->
    //   no crossed-out price and no "% off".
    // - Paid add-ons (e.g. Assembly): the old price belongs to the size
    //   price only, so it stays on the size-price line and is not shown
    //   next to the final price while an add-on is included.
    // - "% off" = round((old - price) / old * 100), from real prices only.
    // - Monthly = final displayed price / 12, rounded up to the next whole
    //   pound (the rule every existing "or from £X/month" value follows,
    //   e.g. £249 -> £21). Add-ons included. No finance provider named.
    function rbDiscountPercent(oldPrice, price) {
      if (!oldPrice || !price || oldPrice <= price) return null;
      var pct = Math.round(((oldPrice - price) / oldPrice) * 100);
      return pct > 0 ? pct : null;
    }

    function rbMonthlyAmount(price) {
      // In pence, so e.g. 300 / 12 stays exactly 25.
      return Math.ceil(Math.round(price * 100) / 1200);
    }

    // "% off" text beside a crossed-out price (created once, by script,
    // so no HTML/CSS file has to change).
    function rbDiscountEl(container, afterEl) {
      if (!container) return null;
      var el = container.querySelector("[data-rb-discount]");
      if (!el) {
        el = document.createElement("span");
        el.setAttribute("data-rb-discount", "");
        el.style.marginLeft = "0.5rem";
        el.style.fontSize = "0.8rem";
        el.style.fontWeight = "600";
        if (afterEl && afterEl.parentNode === container) {
          container.insertBefore(el, afterEl.nextSibling);
        } else {
          container.appendChild(el);
        }
      }
      return el;
    }

    // Label of the size button that is currently selected, exactly as it
    // appears on the button (e.g. "Double 4ft 6\"").
    function rbSelectedSizeLabel(sizeOptionsContainer) {
      if (!sizeOptionsContainer) return "";
      var btn = sizeOptionsContainer.querySelector('[aria-pressed="true"], .is-active');
      return btn ? btn.textContent.trim() : "";
    }

    // "Selected: Double 4ft 6"" line just above the size buttons.
    function rbRenderSizeLabel(sizeOptionsContainer, sizeKey) {
      if (!sizeOptionsContainer || !sizeOptionsContainer.parentNode) return;
      var labelEl = sizeOptionsContainer.previousElementSibling;
      if (!labelEl || !labelEl.hasAttribute("data-rb-size-label")) {
        labelEl = document.createElement("p");
        labelEl.setAttribute("data-rb-size-label", "");
        labelEl.setAttribute("aria-live", "polite");
        labelEl.style.margin = "0 0 0.5rem";
        labelEl.style.fontSize = "0.85rem";
        labelEl.style.fontWeight = "600";
        sizeOptionsContainer.parentNode.insertBefore(labelEl, sizeOptionsContainer);
      }
      function update() {
        var label = sizeKey ? (rbSelectedSizeLabel(sizeOptionsContainer) || String(sizeKey)) : "";
        labelEl.textContent = label ? "Selected: " + label : "";
        labelEl.hidden = !label;
      }
      update();
      // When a product first opens, the price is drawn just before its
      // size buttons are, so read the button label again once they exist.
      setTimeout(update, 0);
    }

    // o = { priceEl, prevEl, monthlyEl, finalPrice, sizePrice, oldPrice,
    //       sizeKey, sizeOptions, sizeRow, money, noSizeLabel }
    function rbUpdatePriceArea(o) {
      var validOld = (o.oldPrice && o.oldPrice > o.sizePrice) ? o.oldPrice : null;
      var hasAddons = Math.round(o.finalPrice * 100) !== Math.round(o.sizePrice * 100);

      // Main (final) price: crossed-out old price + "% off" only while no
      // paid add-on is included.
      var mainOld = (validOld && !hasAddons) ? validOld : null;
      if (o.prevEl) {
        o.prevEl.textContent = mainOld ? o.money(mainOld) : "";
        var mainPctEl = rbDiscountEl(o.prevEl.parentNode, o.prevEl);
        var mainPct = rbDiscountPercent(mainOld, o.finalPrice);
        if (mainPctEl) mainPctEl.textContent = mainPct ? mainPct + "% off" : "";
      }

      // Monthly amount from the final displayed price. Pages without a
      // monthly line get one right under the main price row.
      var monthlyEl = o.monthlyEl;
      if (!monthlyEl && o.priceEl && o.priceEl.parentNode && o.priceEl.parentNode.parentNode) {
        var row = o.priceEl.parentNode;
        monthlyEl = row.nextElementSibling && row.nextElementSibling.hasAttribute("data-rb-monthly")
          ? row.nextElementSibling : null;
        if (!monthlyEl) {
          monthlyEl = document.createElement("p");
          monthlyEl.className = "product-card__monthly bb-modal__monthly";
          monthlyEl.setAttribute("data-rb-monthly", "");
          row.parentNode.insertBefore(monthlyEl, row.nextSibling);
        }
      }
      if (monthlyEl && typeof o.finalPrice === "number" && isFinite(o.finalPrice) && o.finalPrice > 0) {
        monthlyEl.textContent = "or from £" + rbMonthlyAmount(o.finalPrice) + "/month";
      }

      // Size-price line (below the size buttons): selected size, size
      // price, its real old price and "% off".
      if (o.sizeRow) {
        var rowPctEl = rbDiscountEl(o.sizeRow, null);
        var rowPct = o.sizeKey ? rbDiscountPercent(validOld, o.sizePrice) : null;
        if (rowPctEl) rowPctEl.textContent = rowPct ? rowPct + "% off" : "";
        if (!o.noSizeLabel) rbRenderSizeLabel(o.sizeOptions, o.sizeKey);
      }
    }

    var sizePriceRow = null;
    function renderSelectedSizePrice(sizeKey, sizePrice, oldPrice) {
      var anchor = sizeEl;
      if (!anchor || !anchor.parentNode) return;
      if (!sizePriceRow) {
        sizePriceRow = document.createElement("div");
        sizePriceRow.className = "bb-modal__price-row";
        sizePriceRow.setAttribute("data-size-price", "");
        sizePriceRow.setAttribute("aria-live", "polite");
        sizePriceRow.style.marginTop = "0.75rem";
        sizePriceRow.innerHTML =
          '<span class="bb-modal__price"></span>' +
          '<span class="product-card__price-prev"></span>';
      }
      if (anchor.nextSibling !== sizePriceRow) {
        anchor.parentNode.insertBefore(sizePriceRow, anchor.nextSibling);
      }
      if (!sizeKey) {
        sizePriceRow.style.display = "none";
        return;
      }
      sizePriceRow.style.display = "";
      sizePriceRow.children[0].textContent = bfMoney(sizePrice);
      sizePriceRow.children[1].textContent =
        (oldPrice && oldPrice > sizePrice) ? bfMoney(oldPrice) : "";
    }

    function renderSizeOptions(product) {
      if (!sizeEl) return;
      sizeEl.innerHTML = "";
      var sizes = product.sizes || [];
      if (sizes.length === 0) {
        sizeEl.closest(".bb-modal__fabrics").hidden = true;
        selectedSize = null;
        renderSelectedSizePrice(null);
        return;
      }
      sizeEl.closest(".bb-modal__fabrics").hidden = false;

      selectedSize = sizes[0];

      sizes.forEach(function (size) {
        var pill = document.createElement("button");
        pill.type = "button";
        pill.className = "mt-option-pill" + (size === selectedSize ? " is-active" : "");
        pill.textContent = bfSizeLabel(product, size);
        pill.addEventListener("click", function () {
          selectedSize = size;
          Array.prototype.forEach.call(sizeEl.querySelectorAll(".mt-option-pill"), function (el) {
            el.classList.remove("is-active");
          });
          pill.classList.add("is-active");
          renderPrice(product);
        });
        sizeEl.appendChild(pill);
      });
      renderPrice(product);
    }

    var reviewsSummaryEl = document.getElementById("bfReviewsSummary");
    var reviewsListEl = document.getElementById("bfReviewsList");
    var reviewForm = document.getElementById("bfReviewForm");
    var reviewNameInput = document.getElementById("bfReviewName");
    var reviewCommentInput = document.getElementById("bfReviewComment");
    var reviewMessageEl = document.getElementById("bfReviewMessage");
    var reviewStarsInputEl = document.getElementById("bfReviewStarsInput");
    var selectedReviewRating = 0;

    function updateReviewStarButtons() {
      if (!reviewStarsInputEl) return;
      qsa(".mt-detail__review-star", reviewStarsInputEl).forEach(function (btn) {
        var value = Number(btn.getAttribute("data-value"));
        var isFilled = value <= selectedReviewRating;
        btn.setAttribute("aria-pressed", String(isFilled));
        btn.classList.toggle("is-filled", isFilled);
      });
    }

    function renderReviews(product) {
      var starsEl = document.getElementById("bfDetailStars");
      var reviewCountEl = document.getElementById("bfDetailReviewCount");
      var reviews = getStoredReviews(product.slug);

      if (reviews.length === 0) {
        if (starsEl) starsEl.textContent = "";
        if (reviewCountEl) reviewCountEl.textContent = "No reviews yet";
        if (reviewsSummaryEl) reviewsSummaryEl.textContent = "";
        if (reviewsListEl) {
          reviewsListEl.innerHTML = "";
          var emptyMsg = document.createElement("p");
          emptyMsg.className = "mt-detail__reviews-empty";
          emptyMsg.textContent = "No reviews yet. Be the first to review this bed frame.";
          reviewsListEl.appendChild(emptyMsg);
        }
        return;
      }

      var total = reviews.reduce(function (sum, r) { return sum + r.rating; }, 0);
      var avg = total / reviews.length;
      var roundedAvg = Math.round(avg);

      if (starsEl) starsEl.textContent = renderStars(roundedAvg);
      if (reviewCountEl) reviewCountEl.textContent = "(" + reviews.length + ")";

      if (reviewsSummaryEl) {
        reviewsSummaryEl.textContent =
          avg.toFixed(1) + " out of 5 \u00b7 " + reviews.length + " review" + (reviews.length === 1 ? "" : "s");
      }

      if (reviewsListEl) {
        reviewsListEl.innerHTML = "";
        reviews.slice().reverse().forEach(function (r) {
          var item = document.createElement("div");
          item.className = "mt-detail__review-item";

          var head = document.createElement("div");
          head.className = "mt-detail__review-item-head";

          var starsSpan = document.createElement("span");
          starsSpan.className = "mt-detail__review-item-stars";
          starsSpan.setAttribute("aria-hidden", "true");
          starsSpan.textContent = renderStars(r.rating);

          var nameSpan = document.createElement("span");
          nameSpan.className = "mt-detail__review-item-name";
          nameSpan.textContent = r.name;

          var dateSpan = document.createElement("span");
          dateSpan.className = "mt-detail__review-item-date";
          dateSpan.textContent = new Date(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

          head.appendChild(starsSpan);
          head.appendChild(nameSpan);
          head.appendChild(dateSpan);

          var commentP = document.createElement("p");
          commentP.className = "mt-detail__review-item-comment";
          commentP.textContent = r.comment;

          item.appendChild(head);
          item.appendChild(commentP);
          reviewsListEl.appendChild(item);
        });
      }
    }

    if (reviewStarsInputEl) {
      qsa(".mt-detail__review-star", reviewStarsInputEl).forEach(function (btn) {
        btn.addEventListener("click", function () {
          selectedReviewRating = Number(btn.getAttribute("data-value"));
          updateReviewStarButtons();
          if (reviewMessageEl) {
            reviewMessageEl.textContent = "";
            reviewMessageEl.classList.remove("is-error");
          }
        });
      });
    }

    if (reviewForm) {
      reviewForm.addEventListener("submit", function (event) {
        event.preventDefault();
        if (!currentProduct) return;

        var name = reviewNameInput.value.trim();
        var comment = reviewCommentInput.value.trim();

        if (!name) {
          reviewMessageEl.textContent = "Please enter your name.";
          reviewMessageEl.classList.add("is-error");
          reviewNameInput.focus();
          return;
        }
        if (!selectedReviewRating) {
          reviewMessageEl.textContent = "Please select a star rating.";
          reviewMessageEl.classList.add("is-error");
          return;
        }
        if (!comment) {
          reviewMessageEl.textContent = "Please write a short review.";
          reviewMessageEl.classList.add("is-error");
          reviewCommentInput.focus();
          return;
        }

        var review = {
          name: name,
          rating: selectedReviewRating,
          comment: comment,
          date: Date.now()
        };

        var ok = saveReview(currentProduct.slug, review);

        reviewForm.reset();
        selectedReviewRating = 0;
        updateReviewStarButtons();

        if (!ok) {
          reviewMessageEl.textContent = "Sorry, something went wrong saving your review. Please try again.";
          reviewMessageEl.classList.add("is-error");
          return;
        }

        reviewMessageEl.classList.remove("is-error");
        reviewMessageEl.textContent = "Thank you \u2014 your review has been added.";
        renderReviews(currentProduct);
      });
    }

    // Assembly is the only new option with a confirmed real price
    // (£59.00) — every other new option stays £0 since no genuine
    // price data exists for them anywhere in the project.
    function currentPrice(product) {
      return bfSizePrice(product, selectedSize) + (assembly === "yes" ? ASSEMBLY_PRICE : 0);
    }

    function renderPrice(product) {
      var priceEl = document.getElementById("bfDetailPrice");
      if (priceEl) priceEl.textContent = bfMoney(currentPrice(product));
      var sizePrice = bfSizePrice(product, selectedSize);
      // The stored oldPrice belongs to the first (cheapest) size only.
      var isBaseSize = !selectedSize || selectedSize === (product.sizes || [])[0];
      var validOldPrice = (isBaseSize && product.oldPrice && product.oldPrice > sizePrice) ? product.oldPrice : null;
      // Small Double / Double / King / Super King: old price from
      // BF_SIZE_OLD_PRICES (Single keeps its existing old price).
      var listedOld = (selectedSize && selectedSize !== "Single" && BF_SIZE_OLD_PRICES[product.slug])
        ? BF_SIZE_OLD_PRICES[product.slug][selectedSize] : null;
      if (typeof listedOld === "number") validOldPrice = listedOld > sizePrice ? listedOld : null;
      var prevPriceEl = document.getElementById("bfDetailPrevPrice");
      if (prevPriceEl) prevPriceEl.textContent = validOldPrice ? bfMoney(validOldPrice) : "";
      renderSelectedSizePrice(selectedSize, sizePrice, validOldPrice);
      // Price area: size label, old price, "% off" and monthly amount.
      rbUpdatePriceArea({
        priceEl: priceEl, prevEl: prevPriceEl, monthlyEl: null,
        finalPrice: currentPrice(product), sizePrice: sizePrice, oldPrice: validOldPrice,
        sizeKey: selectedSize, sizeOptions: sizeEl, sizeRow: sizePriceRow,
        money: bfMoney
      });
    }

    // Shared helper for the five new single-select option groups — each
    // is a plain group of .mt-option-pill buttons using this page's own
    // .is-active convention (matching the existing Size selector),
    // where exactly one choice can be active at a time.
    function initRadioPillGroup(container, setter, messageEl2, onSelect) {
      if (!container) return;
      Array.prototype.forEach.call(container.querySelectorAll(".mt-option-pill"), function (btn) {
        btn.addEventListener("click", function () {
          setter(btn.dataset.value);
          Array.prototype.forEach.call(container.querySelectorAll(".mt-option-pill"), function (el) {
            el.classList.remove("is-active");
          });
          btn.classList.add("is-active");
          if (messageEl2) messageEl2.textContent = "";
          if (onSelect) onSelect(btn.dataset.value);
        });
      });
    }

    initRadioPillGroup(ottomanStorageEl, function (v) { ottomanStorage = v; }, ottomanStorageMsg);
    initRadioPillGroup(footstoolEl, function (v) { footstoolBlanketBox = v; }, footstoolMsg);
    initRadioPillGroup(headboardCustomEl, function (v) { headboardCustom = v; }, headboardCustomMsg);
    initRadioPillGroup(assemblyEl, function (v) { assembly = v; }, assemblyMsg, function () {
      if (currentProduct) renderPrice(currentProduct);
    });
    initRadioPillGroup(deliveryDelayEl, function (v) { deliveryDelay = v; }, deliveryDelayMsg, function (value) {
      if (delayDateWrap) delayDateWrap.hidden = value !== "yes";
    });

    if (customRequestEl) {
      customRequestEl.addEventListener("input", function () {
        customRequest = customRequestEl.value;
      });
    }

    if (delayDateInput) {
      delayDateInput.addEventListener("change", function () {
        deliveryDate = delayDateInput.value;
      });
    }

    function renderDetail(product) {
      document.title = product.name + " | Non-Storage Bed Frames | Rabbora Living";

      var eyebrowEl = document.getElementById("bfDetailEyebrow");
      if (eyebrowEl) eyebrowEl.textContent = "Non-Storage Bed Frame";

      document.getElementById("bfDetailTitle").textContent = product.name;
      document.getElementById("bfDetailBreadcrumbName").textContent = product.name;

      renderPrice(product);
      var prevPriceEl = document.getElementById("bfDetailPrevPrice");
      if (prevPriceEl) prevPriceEl.textContent = (product.oldPrice && product.oldPrice > product.price) ? bfMoney(product.oldPrice) : "";
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

      selectedReviewRating = 0;
      updateReviewStarButtons();
      if (reviewForm) reviewForm.reset();
      if (reviewMessageEl) {
        reviewMessageEl.textContent = "";
        reviewMessageEl.classList.remove("is-error");
      }
      renderReviews(product);
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
      selectedFabricSlug = null;
      selectedFabricImage = null;
      imageIndex = 0;

      ottomanStorage = null;
      footstoolBlanketBox = null;
      headboardCustom = null;
      customRequest = "";
      assembly = null;
      deliveryDelay = null;
      deliveryDate = "";
      [ottomanStorageEl, footstoolEl, headboardCustomEl, assemblyEl, deliveryDelayEl].forEach(function (group) {
        if (!group) return;
        Array.prototype.forEach.call(group.querySelectorAll(".mt-option-pill"), function (el) {
          el.classList.remove("is-active");
        });
      });
      [ottomanStorageMsg, footstoolMsg, headboardCustomMsg, assemblyMsg, deliveryDelayMsg].forEach(function (msg) {
        if (msg) msg.textContent = "";
      });
      if (customRequestEl) customRequestEl.value = "";
      if (delayDateInput) delayDateInput.value = "";
      if (delayDateWrap) delayDateWrap.hidden = true;
      if (messageEl) {
        messageEl.textContent = "";
        messageEl.classList.remove("is-error");
      }

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

    // Each required new option shows its own inline message right next
    // to that option (not just one generic message at the bottom),
    // checked top-to-bottom in the order they appear. This page has
    // never enforced a Size requirement, so that behaviour is left
    // unchanged here.
    function validateRequiredOptions() {
      if (!ottomanStorage) {
        ottomanStorageMsg.textContent = "Please select an option.";
        ottomanStorageEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!footstoolBlanketBox) {
        footstoolMsg.textContent = "Please select an option.";
        footstoolEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!headboardCustom) {
        headboardCustomMsg.textContent = "Please select an option.";
        headboardCustomEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!assembly) {
        assemblyMsg.textContent = "Please select an option.";
        assemblyEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      if (!deliveryDelay) {
        deliveryDelayMsg.textContent = "Please select an option.";
        deliveryDelayEl.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }
      return true;
    }

    function addCurrentToCart() {
      if (!currentProduct) return;
      if (!validateRequiredOptions()) return;

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

      var unitPrice = currentPrice(currentProduct);

      window.RabboraCart.add({
        id: currentProduct.slug,
        slug: currentProduct.slug,
        name: currentProduct.name,
        image: currentProduct.image,
        price: unitPrice,
        variant: {
          size: selectedSize || "",
          fabric: selectedFabric || "",
          fabricSlug: selectedFabricSlug || "",
          fabricImage: selectedFabricImage || "",
          ottomanStorage: ottomanStorage,
          footstoolBlanketBox: footstoolBlanketBox,
          headboardHeight: headboardCustom,
          customRequest: customRequest || null,
          assembly: assembly,
          assemblyPrice: assembly === "yes" ? ASSEMBLY_PRICE : 0,
          deliveryDelay: deliveryDelay,
          requiredDeliveryDate: deliveryDelay === "yes" ? (deliveryDate || null) : null
        },
        url: "bed-frames.html#/" + currentProduct.slug
      }, quantity);

      if (messageEl) {
        messageEl.classList.remove("is-error");
        messageEl.textContent =
          "Added " + quantity + " \u00d7 " + currentProduct.name +
          (selectedSize ? " (" + selectedSize + ")" : "") +
          " to your basket \u2014 " + bfMoney(unitPrice * quantity) + ".";
      }
    }

    if (addBtn) {
      addBtn.addEventListener("click", addCurrentToCart);
    }

    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        if (!currentProduct) return;
        if (!validateRequiredOptions()) return;
        addCurrentToCart();
        window.location.href = "cart.html";
      });
    }
  });
})();