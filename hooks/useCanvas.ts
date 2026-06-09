import { useEffect, useRef } from 'react';
import { drawBackground, drawParticle } from '@/lib/krathong';
import { drawKrathong } from '@/lib/krathong';
import type { KrathongLocal, Particle } from '@/types/krathong';

export function useCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  krathongsRef: React.MutableRefObject<KrathongLocal[]>,
  particlesRef: React.MutableRefObject<Particle[]>
) {
  const wtRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let prevW = canvas.offsetWidth || 1;
    let prevH = canvas.offsetHeight || 1;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const newW = canvas.offsetWidth;
      const newH = canvas.offsetHeight;

      // rescale krathong + particle positions ตาม ratio ใหม่
      const rx = newW / prevW;
      const ry = newH / prevH;
      krathongsRef.current.forEach(k => { k.x *= rx; k.y *= ry; });
      particlesRef.current.forEach(p => { p.x *= rx; p.y *= ry; });

      prevW = newW;
      prevH = newH;
      canvas.width = newW * dpr;
      canvas.height = newH * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    let raf: number;
    const loop = () => {
      wtRef.current += 0.016;
      // ใช้ CSS pixels เสมอ — canvas.width เป็น physical pixels (dpr ×)
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      drawBackground(ctx, w, h, wtRef.current);

      krathongsRef.current.forEach(k => {
        k.x += k.vx + Math.sin(wtRef.current * 0.7 + k.phase) * 0.25;
        k.y += Math.sin(wtRef.current * 1.1 + k.phase) * 0.5;
        k.vx *= 0.996;
        if (k.x < -70) k.x = w + 70;
        if (k.x > w + 70) k.x = -70;
        k.labelAlpha = Math.max(0, k.labelAlpha - 0.001);
        drawKrathong(ctx, k, wtRef.current);
      });

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.065; p.life -= 0.021;
        if (p.life <= 0) { particlesRef.current.splice(i, 1); continue; }
        drawParticle(ctx, p);
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
}
