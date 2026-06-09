'use client';
import { useRef, useCallback } from 'react';
import { useCanvas } from '@/hooks/useCanvas';
import { useRealtime } from '@/hooks/useRealtime';
import { KrathongForm } from './KrathongForm';
import type { Krathong, KrathongLocal, Particle } from '@/types/krathong';

const COLORS = ['#f4a261', '#e76f51', '#2a9d8f', '#e9c46a', '#264653', '#a8dadc'];
const myColor = COLORS[Math.floor(Math.random() * COLORS.length)];

export function KrathongCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const krathongsRef = useRef<KrathongLocal[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  const toLocal = useCallback((k: Krathong, showLabel: boolean): KrathongLocal => {
    const canvas = canvasRef.current;
    const w = canvas?.offsetWidth ?? 800;
    const h = canvas?.offsetHeight ?? 500;
    return {
      ...k,
      x: k.x * w,
      y: k.y * h,
      vx: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
      // 6 = hold ~10s (5 units) + fade ~2s (1 unit) ที่ rate 0.00833/frame@60fps
      labelAlpha: showLabel ? 6 : 0,
    };
  }, []);

  const onNewKrathong = useCallback((k: Krathong) => {
    if (krathongsRef.current.some(e => e.id === k.id)) return;
    krathongsRef.current.push(toLocal(k, true));
    if (krathongsRef.current.length > 50) krathongsRef.current.shift();
  }, [toLocal]);

  const onHistoryKrathong = useCallback((k: Krathong) => {
    if (krathongsRef.current.some(e => e.id === k.id)) return;
    krathongsRef.current.push(toLocal(k, false));
    if (krathongsRef.current.length > 50) krathongsRef.current.shift();
  }, [toLocal]);

  const { addKrathong } = useRealtime(onNewKrathong, onHistoryKrathong);

  useCanvas(canvasRef, krathongsRef, particlesRef);

  const handleSubmit = useCallback(async (name: string, message: string): Promise<boolean> => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    const x = 0.1 + Math.random() * 0.8;
    const y = 0.55 + Math.random() * 0.35;
    return addKrathong({ name, message, color: myColor, x, y });
  }, [addKrathong]);

  const handleFirework = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const fx = 80 + Math.random() * (canvas.width - 160);
    const fy = 40 + Math.random() * 120;
    const hue = Math.random() * 360;
    for (let i = 0; i < 60; i++) {
      const a = (i / 60) * Math.PI * 2;
      const sp = 2 + Math.random() * 4;
      particlesRef.current.push({
        x: fx, y: fy,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 1,
        hue,
        size: 2 + Math.random() * 2,
      });
    }
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#060318]">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-3 sm:px-4">
        <KrathongForm onSubmit={handleSubmit} onFirework={handleFirework} />
      </div>
    </div>
  );
}
