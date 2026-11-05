import type { APIRoute } from "astro";
import { z } from "zod";
import Stripe from "stripe";
import { sendMail, record, limited, json, clean, env } from "../../lib/server/util";
import { priceLines } from "../../lib/pricing";
import { SITE } from "../../data/site";
export const prerender = false;

const Order = z.object({
  name: z.string().min(1).max(80), phone: z.string().min(6).max(30), email: z.string().email().max(120),
  delivery: z.enum(["office", "address", "pickup"]), city: z.string().max(60).optional().default(""), address: z.string().max(160).optional().default(""),
  payment: z.enum(["bank", "card"]), note: z.string().max(2000).optional().default(""), consent: z.literal(true), company: z.string().max(0).optional(),
  items: z.array(z.object({ slug: z.string().max(120), fitment: z.string().max(120).optional(), number: z.string().max(3).optional(), name: z.string().max(24).optional(), install: z.boolean().optional(), qty: z.number().int().min(1).max(10) })).min(1).max(30)
});

const stripeKey = () => env("STRIPE_SECRET_KEY");

// GET tells the checkout which payment options are configured.
export const GET: APIRoute = () => json({ card: !!stripeKey() });

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (limited(clientAddress || "?", 8)) return json({ error: "Твърде много опити. Изчакай няколко минути." }, 429);
  let body: unknown; try { body = await request.json(); } catch { return json({ error: "Невалидни данни." }, 400); }
  const r = Order.safeParse(body);
  if (!r.success) return json({ error: "Провери данните във формата." }, 400);
  const o = r.data;
  if (o.delivery !== "pickup" && (!o.city.trim() || !o.address.trim())) return json({ error: "Липсва адрес за доставка." }, 400);
  if (o.payment === "card" && !stripeKey()) return json({ error: "Плащането с карта не е налично." }, 400);

  // Server-side pricing: client prices are never trusted.
  const { lines, subtotal, advance } = priceLines(o.items);
  if (!lines.length) return json({ error: "Количката е празна." }, 400);

  const orderNo = `AM-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const deliveryText = o.delivery === "pickup" ? "Вземане от студиото в Левски" : `Еконт ${o.delivery === "office" ? "офис" : "адрес"}: ${clean(o.city, 60)}, ${clean(o.address, 160)}`;
  const itemsText = lines.map(l => `- ${l.qty} × ${l.title}\n  ${l.fitment}${l.number ? ` · №${l.number}` : ""}${l.name ? ` · ${l.name}` : ""}${l.install ? ` · МОНТАЖ (${l.installNote})` : ""}\n  ${l.total} €`).join("\n");
  const summary = `Поръчка ${orderNo}\n\n${itemsText}\n\nОбщо: ${subtotal} €\nКапаро 50%: ${advance} €\nПлащане на капаро: ${o.payment === "card" ? "карта" : "банков превод"}\nДоставка: ${deliveryText}\n\nКлиент: ${clean(o.name, 80)}\nТелефон: ${clean(o.phone, 30)}\nИмейл: ${o.email}\nБележка: ${clean(o.note, 2000) || "-"}`;

  try {
    await record("orders", { orderNo, ...o, lines, subtotal, advance });
    await sendMail(env("MAIL_TO") || SITE.email, `Нова поръчка ${orderNo} · ${subtotal} €`, summary, o.email);
    const bank = o.payment === "bank"
      ? `\n\nКапаро за превод: ${advance} €\nОснование: ${orderNo}\nБанкови данни: ще ги получиш в отделно писмо от студиото.` // TODO: put IBAN here once provided
      : "";
    await sendMail(o.email, `Поръчка ${orderNo} е приета · Art Me Graphics`,
      `Здравей, ${clean(o.name, 80)}!\n\nБлагодарим за поръчката. Ето обобщение:\n\n${itemsText}\n\nОбщо: ${subtotal} €${bank}\n\nСледваща стъпка: изпращаме ти 3D визуализация за одобрение. Имаш ${SITE.freeCorrections} безплатни корекции. Печатаме след одобрение, до ${SITE.leadDays} работни дни.\n\nВъпроси: ${SITE.phone}\nArt Me Graphics`);
  } catch (e) { console.error(e); return json({ error: "Поръчката не беше записана." }, 500); }

  if (o.payment === "card") {
    const site = env("PUBLIC_SITE_URL") || new URL(request.url).origin;
    const stripe = new Stripe(stripeKey()!);
    const s = await stripe.checkout.sessions.create({
      mode: "payment", customer_email: o.email, locale: "bg", client_reference_id: orderNo,
      line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: Math.round(advance * 100), product_data: { name: `Капаро 50% · поръчка ${orderNo}` } } }],
      success_url: `${site}/porachka/uspeh?no=${orderNo}&pay=card`, cancel_url: `${site}/porachka/uspeh?no=${orderNo}&pay=bank`
    });
    return json({ orderNo, payUrl: s.url });
  }
  return json({ orderNo });
};
