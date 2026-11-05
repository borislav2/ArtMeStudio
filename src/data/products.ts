import type { CategoryKey } from "./site";

/**
 * Catalog built from the photos exported from the old GombaShop store (Nov 2026).
 * - `price` undefined = made to quote (button becomes "Поискай оферта").
 * - `fitments` empty = buyer types model and year.
 * - Colourway names marked REVIEW were matched to photos by eye; confirm with the studio.
 * Photos are the shop's 270×320 thumbnails; replace with high-res originals when available.
 */
export interface Product {
  slug: string;
  brand: string;
  title: string;
  colourway: string;
  scheme: "neon" | "blue" | "pink" | "teal" | "purple";
  category: CategoryKey;
  price?: number;
  oldPrice?: number;
  isNew?: boolean;
  fitments: string[];
  images: string[];
  featured?: boolean;
}

const img = (...ids: string[]) => ids.map(id => `/img/${id}.webp`);
const HQ25 = ["TC/FC 125 2025", "TC/FC 250 2025", "TC/FC 300 2025", "TC/FC 350 2025", "TC/FC 450 2025"];
const hq = (slug: string, colourway: string, id: string, scheme: Product["scheme"], extra: Partial<Product> = {}): Product =>
  ({ slug: `husqvarna-${slug}`, brand: "Husqvarna", title: "TC / FC 125–450", colourway, scheme, category: "motokros", price: 120, fitments: HQ25, images: img(id), ...extra });

export const PRODUCTS: Product[] = [
  // Motocross: Husqvarna colourways (names REVIEW)
  hq("neon-teal", "Neon Teal", "150", "neon", { featured: true, isNew: true }),
  hq("black-neon", "Black Neon", "196", "neon", { featured: true }),
  hq("pink-factory", "Pink Factory", "54", "pink", { featured: true }),
  hq("factory-blue", "Factory Blue", "1553", "blue", { featured: true }),
  hq("purple-fusion", "Purple Fusion", "145", "purple"),
  hq("white-teal", "White Teal", "146", "teal"),
  hq("grey-tech", "Grey Tech", "152", "teal"),
  hq("neon-race", "Neon Race", "517", "neon"),
  hq("black-teal", "Black Teal", "149", "teal"),
  hq("classic-blue", "Classic Blue", "128", "blue"),
  hq("camo", "Camo", "519", "neon"),
  // Motocross: Husqvarna Factory Racing series
  hq("factory-racing-gold", "Factory Racing Gold", "1000", "neon", { featured: true }),
  hq("factory-racing-white-gold", "Factory Racing White Gold", "590", "teal"),
  hq("factory-racing-blue", "Factory Racing Blue", "958", "blue"),
  hq("factory-racing-red", "Factory Racing Red", "955", "pink"),
  hq("factory-racing-grey-red", "Factory Racing Grey", "1001", "pink"),
  hq("factory-racing-green", "Factory Racing Green", "1551", "teal"),

  // Track bikes (made to quote)
  { slug: "bmw-m-motorsport", brand: "BMW", title: "пистов мотор", colourway: "M Motorsport", scheme: "blue", category: "pistovi", fitments: [], images: img("134", "135"), featured: true },
  { slug: "bmw-m-white", brand: "BMW", title: "пистов мотор", colourway: "M White", scheme: "blue", category: "pistovi", fitments: [], images: img("289", "443") },
  { slug: "bmw-m-dark", brand: "BMW", title: "пистов мотор", colourway: "M Dark", scheme: "blue", category: "pistovi", fitments: [], images: img("394", "398") },
  { slug: "suzuki-monster", brand: "Suzuki", title: "пистов мотор", colourway: "Monster", scheme: "blue", category: "pistovi", fitments: [], images: img("1641") },
  { slug: "suzuki-green", brand: "Suzuki", title: "пистов мотор", colourway: "Lime", scheme: "neon", category: "pistovi", fitments: [], images: img("303") },
  { slug: "suzuki-naked", brand: "Suzuki", title: "нейкед мотор", colourway: "Red Blue", scheme: "pink", category: "pistovi", fitments: [], images: img("1645") },
  { slug: "track-purple", brand: "пистов мотор", title: "", colourway: "Purple", scheme: "purple", category: "pistovi", fitments: [], images: img("1882") },
  { slug: "track-grey", brand: "пистов мотор", title: "", colourway: "Grey Shadow", scheme: "teal", category: "pistovi", fitments: [], images: img("1859") },
  { slug: "track-green-purple", brand: "пистов мотор", title: "", colourway: "Green Purple", scheme: "purple", category: "pistovi", fitments: [], images: img("489") },

  // ATV (made to quote)
  { slug: "atv-yamaha-blue", brand: "Yamaha", title: "ATV", colourway: "Blue", scheme: "blue", category: "atv", fitments: [], images: img("936"), featured: true },
  { slug: "atv-pink", brand: "ATV", title: "", colourway: "Pink", scheme: "pink", category: "atv", fitments: [], images: img("934") },
  { slug: "atv-red-monster", brand: "ATV", title: "", colourway: "Red", scheme: "pink", category: "atv", fitments: [], images: img("935") },
  { slug: "atv-orange", brand: "ATV", title: "", colourway: "Orange", scheme: "purple", category: "atv", fitments: [], images: img("531") },
  { slug: "atv-blue-orange", brand: "ATV", title: "", colourway: "Blue Orange", scheme: "blue", category: "atv", fitments: [], images: img("528") },
  { slug: "atv-suzuki-white", brand: "Suzuki", title: "ATV", colourway: "White", scheme: "teal", category: "atv", fitments: [], images: img("422") },
  { slug: "atv-green", brand: "ATV", title: "", colourway: "Green", scheme: "neon", category: "atv", fitments: [], images: img("430") }
];

/** Real finished bikes, used for the "projects" gallery. */
export const PROJECTS = [
  { src: "/img/1591.webp", alt: "BMW пистов мотор с графики в сини тонове в студиото", cap: "BMW · пистов комплект" },
  { src: "/img/1860.webp", alt: "Пистов мотор в жълто и черно по залез", cap: "Пистов мотор · жълто и черно" },
  { src: "/img/447.webp", alt: "Мотор с холографски графики", cap: "Холографски дизайн" },
  { src: "/img/445.webp", alt: "Жълто ATV с монтирани графики", cap: "ATV · жълт комплект" },
  { src: "/img/327.webp", alt: "Състезател на кросов мотор с розови графики в планината", cap: "Мотокрос · розов комплект" }
];

export const bySlug = (slug: string) => PRODUCTS.find(p => p.slug === slug);
export const productTitle = (p: Product) => `Графики за ${[p.brand, p.title].filter(Boolean).join(" ")}`;
export const fullName = (p: Product) => `${productTitle(p)}${p.colourway ? " · " + p.colourway : ""}`;
