// animacao do cogumelo atomico em canvas com particulas (so web)
// desenha fireball -> coluna de fumaca -> chapeu turbulento -> dissipa

import React, { useEffect, useRef } from "react";

type Props = { active: boolean; delayMs?: number };

// pseudo-random estavel por seed (mesma particula = mesmo valor em todo frame)
function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function Explosion3D({ active, delayMs = 2200 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const cx = W / 2;
    const cy = H / 2; // epicentro — o alvo fica centralizado no mapa
    const S = Math.min(W, H) / 640; // escala relativa a tela
    const DUR = 4200;
    let raf = 0;
    const t0 = performance.now() + delayMs;

    // um "puff" e um circulo com gradiente radial suave
    function puff(x: number, y: number, r: number, R: number, G: number, B: number, a: number) {
      if (r <= 0.5 || a <= 0.004) return;
      const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(${R | 0},${G | 0},${B | 0},${a})`);
      g.addColorStop(0.55, `rgba(${R | 0},${G | 0},${B | 0},${a * 0.55})`);
      g.addColorStop(1, `rgba(${R | 0},${G | 0},${B | 0},0)`);
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, 7);
      ctx!.fill();
    }

    // mistura fogo -> fumaca conforme "heat" (1 = incandescente, 0 = fumaca fria)
    function fireSmoke(heat: number): [number, number, number] {
      if (heat > 0.6) {
        const k = (heat - 0.6) / 0.4;
        return [lerp(255, 255, k), lerp(160, 235, k), lerp(60, 180, k)];
      }
      if (heat > 0.25) {
        const k = (heat - 0.25) / 0.35;
        return [lerp(150, 255, k), lerp(110, 160, k), lerp(85, 60, k)];
      }
      const k = heat / 0.25;
      return [lerp(72, 150, k), lerp(64, 110, k), lerp(60, 85, k)];
    }

    function draw(now: number) {
      const tms = now - t0;
      const t = tms / DUR;

      if (t < 0) {
        ctx!.clearRect(0, 0, W, H);
        raf = requestAnimationFrame(draw);
        return;
      }
      if (t >= 1) {
        ctx!.clearRect(0, 0, W, H);
        return; // fim — para o loop
      }

      ctx!.clearRect(0, 0, W, H);

      const fade = t > 0.8 ? 1 - (t - 0.8) / 0.2 : 1; // dissipacao final
      const rise = easeOutCubic(clamp01(t / 0.72));    // progresso da subida
      const heat0 = Math.max(0, 1 - t * 1.5);          // calor global esfriando

      // ── ONDAS DE CHOQUE 360° (dupla) ──
      for (let ring = 0; ring < 2; ring++) {
        const delay = ring * 0.06;
        const st = clamp01((t - delay) / 0.42);
        if (st > 0 && st < 1) {
          const r = easeOutQuad(st) * Math.max(W, H) * 0.85;
          const alpha = (1 - st) * (ring === 0 ? 0.9 : 0.45);
          ctx!.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx!.lineWidth = (ring === 0 ? 7 : 3.5) * (1 - st) + 1;
          ctx!.beginPath();
          ctx!.arc(cx, cy, r, 0, 7);
          ctx!.stroke();
        }
      }

      // geometria do cogumelo
      const riseH = 290 * S;
      const capY = cy - riseH * rise;
      const capR = (46 + 118 * rise) * S;
      const wob = (seed: number, speed: number, amp: number) =>
        Math.sin(tms * 0.001 * speed + seed * 9.7) * amp;

      // ── ANEL DE POEIRA NO CHÃO ──
      const dustT = clamp01(t / 0.65);
      const dustR = easeOutQuad(dustT) * 240 * S;
      for (let i = 0; i < 22; i++) {
        const a = (i / 22) * Math.PI * 2;
        const rr = dustR * (0.9 + 0.2 * rand(i * 3.1));
        const px = cx + Math.cos(a) * rr;
        const py = cy + Math.sin(a) * rr * 0.30;
        const heat = heat0 * 0.35 * (1 - dustT);
        const [R, G, B] = fireSmoke(heat);
        puff(px, py, (26 + 18 * rand(i * 1.7)) * S * (0.4 + dustT), R, G, B, 0.20 * (1 - dustT * 0.6) * fade);
      }

      // ── TRONCO (coluna de fumaça) ──
      const stemTop = capY + capR * 0.35;
      const nLevels = 20;
      for (let i = 0; i < nLevels; i++) {
        const f = i / (nLevels - 1); // 0 = base, 1 = topo
        const visible = rise > f * 0.85;
        if (!visible) continue;
        const y = cy - (cy - stemTop) * f;
        const baseW = (30 + 26 * Math.pow(f, 1.6)) * S; // alarga perto do chapeu
        for (let j = 0; j < 3; j++) {
          const seed = i * 13.7 + j * 5.3;
          const ox = (rand(seed) - 0.5) * baseW * 1.1 + wob(seed, 1.6, 5 * S);
          const heat = heat0 * (0.75 - f * 0.55) * (0.7 + 0.3 * rand(seed + 1));
          const [R, G, B] = fireSmoke(Math.max(0.05, heat));
          const pr = (baseW * 0.75) * (0.75 + 0.5 * rand(seed + 2));
          puff(cx + ox, y + wob(seed + 3, 1.2, 4 * S), pr, R, G, B, 0.34 * fade);
        }
      }

      // nucleo incandescente do tronco (aditivo, esfria com o tempo)
      ctx!.globalCompositeOperation = "lighter";
      if (heat0 > 0.05) {
        const coreH = (cy - stemTop) * Math.min(1, rise * 1.2);
        for (let i = 0; i < 7; i++) {
          const f = i / 6;
          puff(cx, cy - coreH * f, 24 * S * (1 - f * 0.4), 255, 170, 70, 0.16 * heat0 * fade);
        }
      }
      ctx!.globalCompositeOperation = "source-over";

      // ── CHAPÉU (torus de puffs turbulentos) ──
      const nCap = 30;
      const rot = tms * 0.00012; // rotacao lenta = impressao de rolagem
      for (let pass = 0; pass < 2; pass++) {
        // pass 0: metade de tras (em cima), pass 1: frente (embaixo) — leitura pseudo-3D
        for (let i = 0; i < nCap; i++) {
          const a = (i / nCap) * Math.PI * 2 + rot;
          const sinA = Math.sin(a);
          const isBack = sinA < 0;
          if ((pass === 0) !== isBack) continue;
          const seed = i * 7.9;
          const rr = capR * (0.82 + 0.35 * rand(seed)) + wob(seed, 2.1, 6 * S);
          const px = cx + Math.cos(a) * rr;
          const py = capY + sinA * rr * 0.42 + wob(seed + 4, 1.7, 4 * S);
          // embaixo do chapeu = mais quente (iluminado pelo nucleo)
          const litFromBelow = sinA > 0.2 ? 0.35 : 0;
          const heat = clamp01(heat0 * (0.35 + litFromBelow + 0.25 * rand(seed + 2)));
          const [R, G, B] = fireSmoke(heat);
          const pr = (34 + 26 * rand(seed + 1)) * S * (0.35 + 0.65 * rise) * (1 + 0.08 * Math.sin(tms * 0.004 + seed));
          puff(px, py, pr, R, G, B, 0.4 * fade);
        }
      }

      // cupula superior do chapeu
      for (let i = 0; i < 12; i++) {
        const a = Math.PI + (i / 11) * Math.PI; // semicirculo de cima
        const seed = i * 11.3 + 99;
        const rr = capR * (0.55 + 0.3 * rand(seed));
        const px = cx + Math.cos(a) * rr;
        const py = capY - Math.abs(Math.sin(a)) * capR * 0.55 + wob(seed, 1.5, 5 * S);
        const heat = clamp01(heat0 * (0.25 + 0.2 * rand(seed + 1)));
        const [R, G, B] = fireSmoke(heat);
        puff(px, py, (30 + 22 * rand(seed + 2)) * S * (0.35 + 0.65 * rise), R, G, B, 0.38 * fade);
      }

      // ── NÚCLEO INCANDESCENTE + FIREBALL INICIAL (aditivo) ──
      ctx!.globalCompositeOperation = "lighter";
      const fb = clamp01(t / 0.30); // fireball domina no comeco
      if (fb < 1) {
        const fr = lerp(30 * S, capR * 1.15, easeOutCubic(fb));
        puff(cx, lerp(cy, capY, fb * 0.85), fr * 1.5, 255, 235, 190, 0.85 * (1 - fb * 0.75));
        puff(cx, lerp(cy, capY, fb * 0.85), fr * 0.8, 255, 255, 235, 0.9 * (1 - fb * 0.6));
      }
      if (heat0 > 0.03) {
        puff(cx, capY + capR * 0.15, capR * 1.15, 255, 150, 55, 0.34 * heat0 * fade);
        puff(cx, capY + capR * 0.1, capR * 0.55, 255, 215, 130, 0.4 * heat0 * fade);
      }
      // clarao geral da cena no comeco
      if (t < 0.22) {
        puff(cx, cy, Math.max(W, H) * 0.75, 255, 200, 120, 0.22 * (1 - t / 0.22));
      }
      ctx!.globalCompositeOperation = "source-over";

      // ── ANEL DE CONDENSAÇÃO (halo branco ao redor do chapeu) ──
      const condT = clamp01((t - 0.18) / 0.5);
      if (condT > 0 && condT < 1) {
        const cr = capR * (1.15 + condT * 1.3);
        ctx!.strokeStyle = `rgba(255,255,255,${0.30 * (1 - condT) * fade})`;
        ctx!.lineWidth = 14 * S * (1 - condT * 0.5);
        ctx!.beginPath();
        ctx!.ellipse(cx, capY, cr, cr * 0.36, 0, 0, 7);
        ctx!.stroke();
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ctx.clearRect(0, 0, W, H);
    };
  }, [active, delayMs]);

  if (!active) return null;
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        top: 0, left: 0, width: "100%", height: "100%",
        zIndex: 1200,
        pointerEvents: "none",
      }}
    />
  );
}
