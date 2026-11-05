import type { APIRoute } from "astro";
import { PRODUCTS } from "../data/products";
import { CATEGORIES } from "../data/site";
export const GET: APIRoute = ({ site }) => {
  const paths = ["/", "/grafiki", ...CATEGORIES.map(c => `/grafiki/${c.key}`), ...PRODUCTS.map(p => `/produkt/${p.slug}`), "/personalen-dizajn", "/faq", "/kontakti", "/za-nas", "/dostavka"];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(p => `<url><loc>${new URL(p, site)}</loc></url>`).join("")}</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml" } });
};
