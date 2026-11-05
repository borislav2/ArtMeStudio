# Art Me Graphics website

Custom replacement for the GombaShop store at artmegraphics.com. Bulgarian-only.

**Stack:** Astro 5 (static pages + Node server for `/api/*`), Three.js for the live 3D kit, Nodemailer for order/quote emails, optional Stripe Checkout for the 50% advance.

## Run locally
```bash
npm install
cp .env.example .env   # fill SMTP_* to send real emails; without it emails are printed to the console
npm run dev            # http://localhost:4321
```

## Structure
| Path | What |
|---|---|
| `src/data/products.ts` | Catalog (prices are authoritative; the server recomputes totals from here) |
| `src/data/site.ts` | Contacts, categories, riders, FAQ, business rules (7 days, 3 corrections, 50% advance) |
| `src/lib/kit3d.ts` | Three.js 3D kit (lazy-loaded only when the stage is on screen) |
| `src/lib/livery.ts` | Procedural livery art used until real photos are added |
| `src/lib/cart.ts` | Client cart (localStorage) |
| `src/pages/api/order.ts` | Validates order, prices it server-side, emails studio + customer, logs to `DATA_DIR/orders.jsonl`, optional Stripe |
| `src/pages/api/quote.ts` | Custom-design inquiry |

## Order flow
Product → options (model/year, number, name, installation) → cart → checkout (Econt office / address / pickup, advance by bank transfer or card) → studio gets an email, customer gets a confirmation → 3D visualisation and approval happen by email/phone as today.

## Deploy (VPS, e.g. Webdock)
```bash
docker build -t artme .
docker run -d --restart=always -p 4321:4321 --env-file .env -v artme-data:/data artme
```
Put Caddy or nginx in front for HTTPS. Example Caddyfile:
```
artmegraphics.com, www.artmegraphics.com {
  encode zstd gzip
  reverse_proxy 127.0.0.1:4321
}
```

## Before launch
- [ ] Import the full catalog from GombaShop and add real photos (`images` field per product, files in `public/products/`).
- [ ] Bank details (IBAN) in the customer email (`src/pages/api/order.ts`).
- [ ] Paste the legal texts (`obshti-usloviya`, `poveritelnost`).
- [ ] 301 redirects from old GombaShop URLs (`/motokros-grafiki.html` → `/grafiki/motokros`, product URLs → `/produkt/<slug>`).
- [ ] SMTP credentials (Gmail app password) and, if wanted, Stripe key.
