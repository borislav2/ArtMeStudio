import nodemailer from "nodemailer";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const env = (k: string) => (import.meta.env[k] ?? process.env[k]) as string | undefined;
export { env };

let transport: nodemailer.Transporter | null = null;
function mailer() {
  if (transport) return transport;
  if (!env("SMTP_HOST")) return null;
  transport = nodemailer.createTransport({
    host: env("SMTP_HOST"), port: Number(env("SMTP_PORT") || 465), secure: Number(env("SMTP_PORT") || 465) === 465,
    auth: { user: env("SMTP_USER"), pass: env("SMTP_PASS") }
  });
  return transport;
}

/** Sends mail when SMTP is configured; otherwise logs it (dev). */
export async function sendMail(to: string, subject: string, text: string, replyTo?: string) {
  const t = mailer();
  if (!t) { console.log(`[mail:dev] to=${to} subject=${subject}\n${text}`); return; }
  await t.sendMail({ from: env("MAIL_FROM") || env("SMTP_USER"), to, subject, text, replyTo });
}

/** Append-only JSON-lines log, a backup of every order/quote in case an email gets lost. */
export async function record(kind: string, data: unknown) {
  const dir = env("DATA_DIR") || "./data";
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, `${kind}.jsonl`), JSON.stringify({ at: new Date().toISOString(), ...(data as object) }) + "\n");
}

// Tiny in-memory rate limit: N requests per IP per window.
const hits = new Map<string, number[]>();
export function limited(ip: string, max = 5, windowMs = 10 * 60_000) {
  const now = Date.now(); const arr = (hits.get(ip) || []).filter(t => now - t < windowMs);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}

export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
export const clean = (v: unknown, max = 200) => String(v ?? "").replace(/[\u0000-\u0008\u000B-\u001F]/g, "").trim().slice(0, max);
