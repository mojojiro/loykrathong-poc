'use client';
import { useState } from 'react';

interface Props {
  onSubmit: (name: string, message: string) => Promise<void>;
  onFirework: () => void;
}

export function KrathongForm({ onSubmit, onFirework }: Props) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setLoading(true);
    await onSubmit(name.trim(), message.trim() || 'ขอพรสิ่งดีๆ');
    setMessage('');
    setLoading(false);
  };

  return (
    <div className="bg-black/60 backdrop-blur rounded-2xl p-4 flex gap-2 flex-wrap">
      <input
        className="flex-1 min-w-[100px] rounded-full px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 outline-none focus:bg-white/15 transition-colors"
        placeholder="ชื่อของคุณ"
        maxLength={20}
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />
      <input
        className="flex-1 min-w-[140px] rounded-full px-3 py-2 text-sm bg-white/10 text-white placeholder:text-white/40 outline-none focus:bg-white/15 transition-colors"
        placeholder="คำอธิษฐาน..."
        maxLength={40}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
      />
      <button
        onClick={handleSubmit}
        disabled={loading || !name.trim()}
        className="rounded-full px-4 py-2 text-sm bg-amber-500/80 hover:bg-amber-500 text-white disabled:opacity-40 transition-colors"
      >
        {loading ? '...' : '🪔 ลอยกระทง'}
      </button>
      <button
        onClick={onFirework}
        className="rounded-full px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        🎆 พลุ
      </button>
    </div>
  );
}
