export interface Krathong {
  id: string;
  name: string;
  message: string;
  color: string;
  x: number;
  y: number;
  createdAt: number;
}

export interface KrathongLocal extends Krathong {
  vx: number;
  phase: number;
  labelAlpha: number;
}

export interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  hue: number;
  size: number;
}
