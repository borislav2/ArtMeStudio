import type { APIRoute } from "astro";
import { z } from "zod";
import { sendMail, record, limited, json, clean, env } from "../../lib/server/util";
export const prerender = false;

const Quote = z.object({
  name: z.string().min(1).max(80), phone: z.string().min(6).max(30), email: z.string().max(120).optional().default(""),
  type: z.string().max(40).optional().default(""), model: z.string().max(120).optional().default(""),
  style: z.string().max(80).optional().default(""), no: z.string().max(40).optional().default(""),
  msg: z.string().max(3000).optional().default(""), consent: z.literal("on"), company: z.string().max(0).optional()
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (limited(clientAddress || "?")) return json({ error: "Твърде много опити. Изчакай няколко минути." }, 429);
  let body: unknown; try { body = await request.json(); } catch { return json({ error: "Невалидни данни." }, 400); }
  const r = Quote.safeParse(body);
  if (!r.success) return json({ error: "Провери име, телефон и съгласието с условията." }, 400);
  const q = Object.fromEntries(Object.entries(r.data).map(([k, v]) => [k, clean(v, 3000)]));
  if (q.email && !/^\S+@\S+\.\S+$/.test(q.email)) return json({ error: "Имейлът изглежда невалиден." }, 400);
  const text = `Ново запитване от сайта\n\nИме: ${q.name}\nТелефон: ${q.phone}\nИмейл: ${q.email || "-"}\nПревозно средство: ${q.type}\nМодел: ${q.model || "-"}\nДизайн: ${q.style || "-"}\nНомер/име: ${q.no || "-"}\n\n${q.msg}`;
  try {
    await record("quotes", q);
    await sendMail(env("MAIL_TO") || "artmeoffice@gmail.com", `Запитване: ${q.name} · ${q.model || q.type}`, text, q.email || undefined);
  } catch (e) { console.error(e); return json({ error: "Запитването не беше изпратено." }, 500); }
  return json({ ok: true });
};
