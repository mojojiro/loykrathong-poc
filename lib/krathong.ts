import type { KrathongLocal, Particle } from '@/types/krathong';

export function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, wt: number) {
  const skyG = ctx.createLinearGradient(0, 0, 0, h * 0.42);
  skyG.addColorStop(0, '#060318');
  skyG.addColorStop(1, '#130b38');
  ctx.fillStyle = skyG;
  ctx.fillRect(0, 0, w, h * 0.42);

  // Moon
  ctx.beginPath(); ctx.arc(w * 0.85, h * 0.14, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#fff8e0'; ctx.fill();
  ctx.beginPath(); ctx.arc(w * 0.83, h * 0.12, 23, 0, Math.PI * 2);
  ctx.fillStyle = '#130b38'; ctx.fill();

  // Stars
  ctx.fillStyle = 'rgba(255,255,220,0.7)';
  const starPositions = [
    [0.1, 0.05], [0.2, 0.12], [0.35, 0.04], [0.45, 0.09],
    [0.55, 0.03], [0.6, 0.15], [0.7, 0.07], [0.25, 0.22],
    [0.4, 0.18], [0.15, 0.28], [0.5, 0.25], [0.65, 0.2],
  ];
  starPositions.forEach(([sx, sy]) => {
    const alpha = 0.4 + Math.sin(wt * 0.03 + sx * 10) * 0.3;
    ctx.globalAlpha = alpha;
    ctx.fillRect(sx * w, sy * h * 0.42, 1.5, 1.5);
  });
  ctx.globalAlpha = 1;

  // Water
  const waterG = ctx.createLinearGradient(0, h * 0.42, 0, h);
  waterG.addColorStop(0, '#0a2540');
  waterG.addColorStop(1, '#061520');
  ctx.fillStyle = waterG;
  ctx.fillRect(0, h * 0.42, w, h * 0.58);

  // Moon reflection
  const reflG = ctx.createLinearGradient(0, h * 0.42, 0, h * 0.65);
  reflG.addColorStop(0, 'rgba(255,248,224,0.06)');
  reflG.addColorStop(1, 'rgba(255,248,224,0)');
  ctx.fillStyle = reflG;
  ctx.fillRect(w * 0.78, h * 0.42, w * 0.14, h * 0.23);

  // Waves
  for (let row = 0; row < 6; row++) {
    const y = h * 0.42 + row * 28 + 10;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const wy = y + Math.sin(x / 70 + wt * 0.013 + row * 0.8) * 3
                   + Math.sin(x / 40 + wt * 0.02) * 1.5;
      x === 0 ? ctx.moveTo(x, wy) : ctx.lineTo(x, wy);
    }
    ctx.strokeStyle = `rgba(80,160,240,${0.07 - row * 0.008})`;
    ctx.lineWidth = 1.5; ctx.stroke();
  }
}

export function drawKrathong(ctx: CanvasRenderingContext2D, k: KrathongLocal, wt: number) {
  ctx.save();
  ctx.translate(k.x, k.y);
  ctx.rotate(Math.sin(wt * 0.85 + k.phase) * 0.055);

  // Base — กาบกล้วย
  ctx.beginPath(); ctx.ellipse(0, 6, 26, 9, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#3b1f00'; ctx.fill();

  // ใบตอง
  ctx.beginPath(); ctx.ellipse(0, 4, 22, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1a5e2a'; ctx.fill();

  // กลีบดอกไม้
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 13, Math.sin(a) * 4.5 - 2, 6.5, 3.5, a, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#2d8a3e' : '#3aaa50';
    ctx.fill();
  }

  // ดอกไม้กลาง
  ctx.beginPath(); ctx.ellipse(0, 2, 10, 5, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#b03030'; ctx.fill();

  // กลีบดอกไม้ชั้นใน
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(Math.cos(a) * 6, Math.sin(a) * 3 + 2, 4, 2.5, a, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#e05050' : '#f07070';
    ctx.fill();
  }

  // เทียน
  ctx.beginPath(); ctx.moveTo(-1.5, -4); ctx.lineTo(0, -17); ctx.lineTo(1.5, -4);
  ctx.fillStyle = '#f0e040'; ctx.fill();

  // เปลวไฟ — ใช้ wt แทน Date.now() เพื่อให้ predictable
  const fl = Math.sin(wt * 12 + k.phase) * 0.25 + 0.75;
  ctx.beginPath(); ctx.arc(0, -18, 3.5 * fl, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,150,20,${0.55 * fl})`; ctx.fill();
  ctx.beginPath(); ctx.arc(0, -18, 1.6, 0, Math.PI * 2);
  ctx.fillStyle = '#fffaaa'; ctx.fill();

  ctx.restore();
}

export function drawKrathongLabel(ctx: CanvasRenderingContext2D, k: KrathongLocal) {
  if (k.labelAlpha <= 0.01) return;
  // labelAlpha อาจ > 1 ระหว่าง hold period — clamp ให้ไม่เกิน 1
  const alpha = Math.min(1, k.labelAlpha);
  const label = k.message ? `${k.name} · ${k.message}` : k.name;
  ctx.save();
  ctx.font = '500 12px sans-serif';
  const tw = ctx.measureText(label).width;
  const bw = tw + 16, bh = 22, bx = k.x - bw / 2, by = k.y - 52;

  ctx.fillStyle = `rgba(10,18,40,${0.75 * alpha})`;
  roundRect(ctx, bx, by, bw, bh, 6); ctx.fill();

  ctx.fillStyle = `rgba(255,255,220,${alpha})`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, k.x, by + bh / 2);
  ctx.restore();
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.beginPath(); ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${p.hue},100%,70%,${p.life})`; ctx.fill();
}
