'use client';
import { useState, useEffect } from 'react';

interface Props {
  onSubmit: (name: string, message: string) => Promise<boolean>;
  onFirework: () => void;
}

export function KrathongForm({ onSubmit, onFirework }: Props) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  // โหลดชื่อจาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem('krathong-name');
    if (saved) setName(saved);
  }, []);

  const handleNameChange = (v: string) => {
    setName(v);
    localStorage.setItem('krathong-name', v);
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(false);
    setSuccess(false);
    const ok = await onSubmit(name.trim(), message.trim() || 'ขอพรสิ่งดีๆ');
    setLoading(false);
    if (ok) {
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="text-center text-sm text-red-400 bg-black/60 rounded-full py-1.5 px-4">
          เกิดข้อผิดพลาด ลองใหม่อีกครั้ง
        </div>
      )}
      {success && (
        <div className="text-center text-sm text-amber-300 bg-black/60 rounded-full py-1.5 px-4">
          ลอยกระทงสำเร็จ 🪔
        </div>
      )}
      <div className="bg-black/60 backdrop-blur rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-2">
        {/* inputs row */}
        <div className="flex gap-2 flex-1">
          <input
            className="w-[38%] sm:w-auto sm:flex-none rounded-full px-3 py-2.5 sm:py-2 text-sm bg-white/10 text-white placeholder:text-white/40 outline-none focus:bg-white/15 transition-colors"
            placeholder="ชื่อ"
            maxLength={20}
            value={name}
            onChange={e => handleNameChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <input
            className="flex-1 rounded-full px-3 py-2.5 sm:py-2 text-sm bg-white/10 text-white placeholder:text-white/40 outline-none focus:bg-white/15 transition-colors"
            placeholder="คำอธิษฐาน..."
            maxLength={40}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>
        {/* buttons row */}
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="flex-1 sm:flex-none rounded-full px-4 py-2.5 sm:py-2 text-sm bg-amber-500/80 hover:bg-amber-500 active:bg-amber-600 text-white disabled:opacity-40 transition-colors"
          >
            {loading ? '...' : '🪔 ลอยกระทง'}
          </button>
          <button
            onClick={onFirework}
            className="flex-1 sm:flex-none rounded-full px-4 py-2.5 sm:py-2 text-sm bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition-colors"
          >
            🎆 พลุ
          </button>
        </div>
      </div>
    </div>
  );
}
