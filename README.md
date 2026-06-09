# loykrathong-poc

Real-time multiplayer Loy Krathong web app — ลอยกระทง virtual พร้อมกันแบบ real-time

## Stack

- Next.js 14 + TypeScript + Tailwind CSS
- HTML5 Canvas 2D (animation loop)
- Supabase Realtime + PostgreSQL

## Setup

```bash
npm install
# ใส่ค่าใน .env.local
npm run dev
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```
