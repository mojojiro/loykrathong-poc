# Deployment Guide

## Deploy บน Vercel

### 1. Push code ขึ้น GitHub

```bash
git push origin main
```

### 2. Import project บน Vercel

1. ไปที่ https://vercel.com/new
2. กด **Import** เลือก repo `loykrathong-poc`
3. Framework preset จะ detect เป็น **Next.js** อัตโนมัติ

### 3. ใส่ Environment Variables

ใน Vercel project settings → **Environment Variables** ใส่:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` |

### 4. Deploy

กด **Deploy** รอประมาณ 1-2 นาที จะได้ URL เช่น `loykrathong-poc.vercel.app`

---

## Supabase Setup (ถ้ายังไม่ได้ทำ)

1. สร้าง project ที่ https://supabase.com
2. ไปที่ **SQL Editor** → **New query**
3. Paste เนื้อหาจาก `supabase/migrations/001_krathongs.sql` แล้วกด **Run**
4. ดู credentials ที่ **Settings → API**
