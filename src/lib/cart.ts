// Client cart, stored in localStorage. Prices here are display-only; the server recomputes totals.
export interface CartLine { id: string; slug: string; fitment: string; number: string; name: string; install: boolean; qty: number }
const KEY = "artme-cart-v1";

export function readCart(): CartLine[] {
  try { const v = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
}
export function writeCart(lines: CartLine[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* storage blocked */ }
  window.dispatchEvent(new CustomEvent("cart:change", { detail: lines }));
}
export function addLine(l: Omit<CartLine, "id" | "qty">) {
  const lines = readCart();
  const same = lines.find(x => x.slug === l.slug && x.fitment === l.fitment && x.number === l.number && x.name === l.name && x.install === l.install);
  if (same) same.qty += 1; else lines.push({ ...l, id: Math.random().toString(36).slice(2, 10), qty: 1 });
  writeCart(lines);
}
export function removeLine(id: string) { writeCart(readCart().filter(l => l.id !== id)); }
export function setQty(id: string, qty: number) {
  writeCart(readCart().map(l => l.id === id ? { ...l, qty: Math.max(1, Math.min(10, qty)) } : l));
}
export const count = () => readCart().reduce((n, l) => n + l.qty, 0);
