// Procedural livery art used by the 3D kit, product cards and placeholders.
export interface Scheme { name: string; base: string; primary: string; secondary: string; accent: string; plate: string; ink: string }
export const SCHEMES: Record<string, Scheme> = {
  neon:   { name: "Neon Rider",    base: "#0E0F12", primary: "#E4FF2E", secondary: "#2B2F36", accent: "#FFFFFF", plate: "#E4FF2E", ink: "#0E0F12" },
  blue:   { name: "Factory Blue",  base: "#0A2A6B", primary: "#2563FF", secondary: "#E9EEF5", accent: "#FFC400", plate: "#FFFFFF", ink: "#0A2A6B" },
  pink:   { name: "Pink Factory",  base: "#17171C", primary: "#FF3EA5", secondary: "#F2F2F2", accent: "#00D1C1", plate: "#FF3EA5", ink: "#111114" },
  teal:   { name: "White Teal",    base: "#EEF1F2", primary: "#00A3A3", secondary: "#1B2226", accent: "#FF6A13", plate: "#1B2226", ink: "#FFFFFF" },
  purple: { name: "Purple Fusion", base: "#1A1030", primary: "#7B3CFF", secondary: "#FF7A1A", accent: "#FFFFFF", plate: "#FFFFFF", ink: "#1A1030" }
};

export function drawLivery(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme) {
  ctx.save();
  ctx.fillStyle = s.base; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = s.secondary;
  const step = Math.max(10, w / 48);
  for (let y = 0; y < h + step; y += step) for (let x = 0; x < w + step; x += step) {
    const t = (x / w * 0.9 + (1 - y / h) * 0.6) - 0.55;
    const r = Math.max(0, Math.min(step * 0.48, t * step * 0.9));
    if (r > 0.4) { ctx.beginPath(); ctx.arc(x + ((y / step) % 2 ? step / 2 : 0), y, r, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.fillStyle = s.primary; ctx.beginPath();
  ctx.moveTo(0, h * 0.78); ctx.bezierCurveTo(w * 0.3, h * 0.62, w * 0.55, h * 0.25, w, h * 0.05);
  ctx.lineTo(w, h * 0.42); ctx.bezierCurveTo(w * 0.6, h * 0.55, w * 0.35, h * 0.85, w * 0.12, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
  ctx.fillStyle = s.secondary; ctx.beginPath();
  ctx.moveTo(w * 0.18, h); ctx.bezierCurveTo(w * 0.4, h * 0.8, w * 0.65, h * 0.55, w, h * 0.48);
  ctx.lineTo(w, h * 0.6); ctx.bezierCurveTo(w * 0.7, h * 0.66, w * 0.5, h * 0.86, w * 0.34, h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = s.accent; ctx.lineWidth = Math.max(2, w / 260);
  for (let i = 0; i < 3; i++) { const o = i * w * 0.012; ctx.beginPath();
    ctx.moveTo(0, h * 0.74 - o); ctx.bezierCurveTo(w * 0.3, h * 0.58 - o, w * 0.55, h * 0.21 - o, w, h * 0.01 - o); ctx.stroke(); }
  ctx.fillStyle = s.accent; ctx.globalAlpha = 0.9;
  for (let i = 0; i < 5; i++) { const x = w * (0.62 + i * 0.05), y = h * 0.72; ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + w * 0.025, y); ctx.lineTo(x - w * 0.02, y + h * 0.16); ctx.lineTo(x - w * 0.045, y + h * 0.16); ctx.closePath(); ctx.fill(); }
  ctx.globalAlpha = 1;
  ctx.save(); ctx.translate(w * 0.06, h * 0.42); ctx.rotate(-0.16);
  ctx.font = `italic 900 ${Math.round(h * 0.2)}px Tektur, "Arial Black", sans-serif`;
  ctx.fillStyle = s.accent; ctx.globalAlpha = 0.92; ctx.fillText("ART ME", 0, 0);
  ctx.font = `600 ${Math.round(h * 0.04)}px "JetBrains Mono", monospace`; ctx.globalAlpha = 0.7;
  ctx.fillText("GRAPHICS · FACTORY KIT", 4, h * 0.07);
  ctx.restore(); ctx.restore();
}

export function drawPlate(ctx: CanvasRenderingContext2D, w: number, h: number, s: Scheme, num: string) {
  ctx.fillStyle = s.plate; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = s.primary === s.plate ? s.secondary : s.primary; ctx.fillRect(0, 0, w, h * 0.16);
  ctx.fillStyle = s.ink; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  const size = h * (num.length > 2 ? 0.42 : 0.56);
  ctx.font = `italic 900 ${Math.round(size)}px Tektur, "Arial Black", sans-serif`;
  ctx.fillText(num, w / 2, h * 0.58);
  ctx.font = `600 ${Math.round(h * 0.05)}px "JetBrains Mono", monospace`;
  ctx.fillStyle = s.plate; ctx.fillText("ART ME", w / 2, h * 0.08);
}

/** Paints every <canvas data-livery="scheme"> on the page. Re-runs when fonts arrive. */
export function paintAll(root: ParentNode = document) {
  const run = () => root.querySelectorAll<HTMLCanvasElement>("canvas[data-livery]").forEach(c => {
    if (c.dataset.fit === "box") {
      const r = c.getBoundingClientRect();
      if (r.width) { c.width = 600; c.height = Math.round(600 * (r.height / r.width)); }
    }
    const ctx = c.getContext("2d"); const s = SCHEMES[c.dataset.livery || "neon"];
    if (ctx && s) drawLivery(ctx, c.width, c.height, s);
  });
  run();
  document.fonts?.ready.then(run);
}
