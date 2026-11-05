// Interactive 3D graphics kit (shroud, number plate, side panel) with a glossy laminate finish.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SCHEMES, drawLivery, drawPlate } from "./livery";

export interface KitHandle { set(scheme: string, num: string): void; destroy(): void }

export async function mountKit(stage: HTMLElement, scheme: string, num: string): Promise<KitHandle | null> {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  try { await Promise.race([document.fonts.load("italic 900 120px Tektur"), new Promise(r => setTimeout(r, 1500))]); } catch { /* ignore */ }
  let renderer: THREE.WebGLRenderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" }); }
  catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 0.85;
  const cv = renderer.domElement;
  cv.setAttribute("role", "img");
  cv.setAttribute("aria-label", "3D модел на графичен комплект: обтекател, номерна табела и страничен панел");
  stage.appendChild(cv);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50); camera.position.set(0, 0.2, 7.2);
  const key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(3, 4, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffd31a, 0.8); rim.position.set(-4, 1, -3); scene.add(rim);

  const livC = document.createElement("canvas"); livC.width = 1024; livC.height = 640;
  const plaC = document.createElement("canvas"); plaC.width = 512; plaC.height = 512;
  const livT = new THREE.CanvasTexture(livC), plaT = new THREE.CanvasTexture(plaC);
  for (const t of [livT, plaT]) { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); }
  let cur = { scheme, num };
  const paint = () => {
    const s = SCHEMES[cur.scheme] || SCHEMES.neon;
    drawLivery(livC.getContext("2d")!, livC.width, livC.height, s);
    drawPlate(plaC.getContext("2d")!, plaC.width, plaC.height, s, cur.num || "1");
    livT.needsUpdate = plaT.needsUpdate = true;
  };

  const piece = (shape: THREE.Shape, tex: THREE.Texture, bend: number, uvr = [0, 0, 1, 1]) => {
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.025, bevelSegments: 4, curveSegments: 48 });
    g.computeBoundingBox(); const b = g.boundingBox!; const p = g.attributes.position, uv = g.attributes.uv;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      uv.setXY(i, uvr[0] + (x - b.min.x) / (b.max.x - b.min.x) * (uvr[2] - uvr[0]), uvr[1] + (y - b.min.y) / (b.max.y - b.min.y) * (uvr[3] - uvr[1]));
      p.setZ(i, p.getZ(i) - bend * x * x);
    }
    g.computeVertexNormals(); g.center();
    return new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.42, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 0.6 }));
  };
  const sh = new THREE.Shape();
  sh.moveTo(-1.15, 0.45); sh.bezierCurveTo(-0.6, 0.78, 0.3, 0.82, 1.1, 0.42); sh.quadraticCurveTo(1.28, 0.2, 1.12, -0.05);
  sh.lineTo(0.35, -0.58); sh.bezierCurveTo(-0.2, -0.82, -0.8, -0.6, -1.05, -0.25); sh.quadraticCurveTo(-1.25, 0.1, -1.15, 0.45);
  const pl = new THREE.Shape();
  pl.moveTo(-0.55, 0.5); pl.quadraticCurveTo(0, 0.72, 0.55, 0.5); pl.lineTo(0.47, -0.42); pl.quadraticCurveTo(0, -0.66, -0.47, -0.42); pl.closePath();
  const sd = new THREE.Shape();
  sd.moveTo(-1.35, 0.2); sd.lineTo(1.15, 0.46); sd.quadraticCurveTo(1.42, 0.34, 1.28, 0.08); sd.lineTo(-0.95, -0.36); sd.quadraticCurveTo(-1.42, -0.34, -1.35, 0.2);

  const kit = new THREE.Group(); scene.add(kit);
  const parts = [
    { m: piece(sh, livT, 0.16, [0, 0.3, 1, 1]), pos: [0.35, 0.4, 0], rot: [0.05, -0.42, 0.06], ph: 0 },
    { m: piece(pl, plaT, 0.22), pos: [-1.3, 0.25, 0.55], rot: [0, 0.55, -0.06], ph: 1.7 },
    { m: piece(sd, livT, 0.08, [0, 0, 1, 0.55]), pos: [0.35, -0.95, -0.35], rot: [-0.1, -0.25, -0.05], ph: 3.1 }
  ];
  for (const p of parts) { p.m.position.set(p.pos[0], p.pos[1], p.pos[2]); p.m.rotation.set(p.rot[0], p.rot[1], p.rot[2]); kit.add(p.m); }

  const shC = document.createElement("canvas"); shC.width = shC.height = 128; const sx = shC.getContext("2d")!;
  const gr = sx.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, "rgba(0,0,0,.55)"); gr.addColorStop(1, "rgba(0,0,0,0)"); sx.fillStyle = gr; sx.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.3), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shC), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.75; scene.add(shadow);

  const render = () => renderer.render(scene, camera);
  const resize = () => {
    const r = stage.getBoundingClientRect(); if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height; camera.position.z = camera.aspect < 0.9 ? 8.6 : 7.2; camera.updateProjectionMatrix();
    if (reduce) render();
  };
  const ro = new ResizeObserver(resize); ro.observe(stage); resize();
  paint(); if (reduce) render();

  let tx = 0, ty = 0, mx = 0, my = 0, pulse = 0, dragging = false, lastX = 0, spin = 0, spinV = 0, visible = true, raf = 0;
  stage.addEventListener("pointermove", e => {
    const r = stage.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width - 0.5; ty = (e.clientY - r.top) / r.height - 0.5;
    if (dragging) { spinV += (e.clientX - lastX) * 0.004; lastX = e.clientX; }
  });
  stage.addEventListener("pointerleave", () => { tx = ty = 0; dragging = false; });
  stage.addEventListener("pointerdown", e => { if (e.pointerType === "mouse") { dragging = true; lastX = e.clientX; } });
  const up = () => (dragging = false); addEventListener("pointerup", up);
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting)); io.observe(stage);
  const t0 = performance.now();
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    const t = (now - t0) / 1000;
    mx += (tx - mx) * 0.06; my += (ty - my) * 0.06; spin += spinV; spinV *= 0.92; spin *= 0.985;
    const sc = Math.min(1, scrollY / 600);
    kit.rotation.y = mx * 0.6 + spin + Math.sin(t * 0.25) * 0.12;
    kit.rotation.x = my * 0.35 - 0.04 + sc * 0.25;
    pulse *= 0.93;
    parts.forEach((p, i) => {
      p.m.position.y = p.pos[1] + Math.sin(t * 0.9 + p.ph) * 0.06;
      const spread = 1 + sc * 0.18 + pulse * 0.08;
      p.m.position.x = p.pos[0] * spread; p.m.position.z = p.pos[2] + pulse * 0.25 * (i === 1 ? 1 : -0.3);
      p.m.rotation.z = p.rot[2] + Math.sin(t * 0.6 + p.ph) * 0.03;
    });
    (shadow.material as THREE.MeshBasicMaterial).opacity = 0.8 - sc * 0.4;
    render();
  };
  if (!reduce) raf = requestAnimationFrame(loop);

  return {
    set(s, n) { cur = { scheme: s, num: n }; paint(); pulse = 1; if (reduce) render(); },
    destroy() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); removeEventListener("pointerup", up); renderer.dispose(); cv.remove(); }
  };
}
