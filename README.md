# loykrathong-poc 🪔

Real-time multiplayer Loy Krathong web app — ผู้ใช้ทุกคนเห็นหน้าจอเดียวกัน สามารถลอยกระทง virtual และจุดพลุพร้อมกัน

## Features

- ลอยกระทง virtual พร้อมใส่ชื่อและข้อความอธิษฐาน
- เห็นกระทงของคนอื่น real-time ผ่าน WebSocket
- Canvas animation — คลื่นน้ำ เปลวเทียน particle พลุ
- รองรับ mobile (iOS Safari / Android Chrome)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Rendering | HTML5 Canvas 2D + requestAnimationFrame |
| Styling | Tailwind CSS |
| Real-time | Supabase Realtime (WebSocket) |
| Database | Supabase PostgreSQL |
| Deploy | Vercel |

## Prerequisites

- Node.js 18+
- Supabase account (free tier)

## Local Setup

1. **Clone และติดตั้ง**

```bash
git clone https://github.com/mojojiro/loykrathong-poc.git
cd loykrathong-poc
npm install
```

2. **ตั้งค่า environment**

```bash
cp .env.example .env.local
```

แก้ไขค่าใน `.env.local` ด้วย credentials จาก Supabase Dashboard → Settings → API

3. **รัน Supabase migration**

เปิด Supabase Dashboard → SQL Editor → New query แล้ว paste ทั้งไฟล์ `supabase/migrations/001_krathongs.sql` แล้วกด Run

4. **Start dev server**

```bash
npm run dev
```

เปิด http://localhost:3000

## Project Structure

```
├── app/
│   ├── page.tsx              # หน้าหลัก
│   └── layout.tsx
├── components/
│   ├── KrathongCanvas.tsx    # Canvas + firework logic
│   └── KrathongForm.tsx      # Form กรอกชื่อ + ข้อความ
├── hooks/
│   ├── useCanvas.ts          # rAF animation loop
│   └── useRealtime.ts        # Supabase subscribe + insert
├── lib/
│   ├── supabase.ts           # Supabase client
│   └── krathong.ts           # Pure draw functions
├── types/
│   └── krathong.ts           # TypeScript interfaces
└── supabase/
    └── migrations/
        └── 001_krathongs.sql # DB schema + realtime setup
```

## Deployment

ดูขั้นตอน deploy บน Vercel ได้ที่ [DEPLOYMENT.md](./DEPLOYMENT.md)

## POC Acceptance Criteria

| Test | เงื่อนไข | Target |
|------|----------|--------|
| Canvas fps | mid-range Android | ≥ 50fps |
| Real-time sync | Browser A ลอย → Browser B เห็น | < 1 วินาที |
| Mobile touch | iOS Safari | ✅ |
| Reconnect | ปิด wifi แล้วเปิดใหม่ | sync กลับมาได้ |
| Load | 20 กระทงพร้อมกัน | ไม่ lag |
