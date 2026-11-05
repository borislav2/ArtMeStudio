import { PRODUCTS, fullName } from "../data/products";
import { CATEGORIES } from "../data/site";

export interface PricedLine { slug: string; title: string; scheme: string; image?: string; fitment: string; number: string; name: string; install: boolean; installNote: string | null; qty: number; unit: number; total: number }

/** Installation is booked with the order but priced on confirmation (depends on model and part count). */
export const installNoteFor = (slug: string) => {
  const p = PRODUCTS.find(x => x.slug === slug);
  return CATEGORIES.find(c => c.key === p?.category)?.install ?? null;
};

/** Shared by the cart page (display) and /api/order (authoritative). Unknown products are dropped. */
export function priceLines(lines: { slug: string; fitment?: string; number?: string; name?: string; install?: boolean; qty?: number }[]) {
  const out: PricedLine[] = [];
  for (const l of lines.slice(0, 30)) {
    const p = PRODUCTS.find(x => x.slug === l.slug); if (!p || p.price == null) continue;
    const qty = Math.max(1, Math.min(10, Math.floor(Number(l.qty) || 1)));
    const note = installNoteFor(p.slug);
    const fitment = p.fitments.length ? (p.fitments.includes(String(l.fitment)) ? String(l.fitment) : p.fitments[0]) : String(l.fitment || "").slice(0, 80);
    out.push({ slug: p.slug, title: fullName(p), scheme: p.scheme, image: p.images[0], fitment,
      number: String(l.number || "").replace(/\D/g, "").slice(0, 3), name: String(l.name || "").slice(0, 24),
      install: !!l.install && !!note, installNote: note, qty, unit: p.price, total: p.price * qty });
  }
  const subtotal = out.reduce((s, l) => s + l.total, 0);
  return { lines: out, subtotal, advance: Math.round(subtotal * 50) / 100 };
}
export const eur = (n: number) => new Intl.NumberFormat("bg-BG", { style: "currency", currency: "EUR", minimumFractionDigits: n % 1 ? 2 : 0 }).format(n);
