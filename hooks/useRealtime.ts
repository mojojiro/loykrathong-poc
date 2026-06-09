import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Krathong } from '@/types/krathong';

export function useRealtime(
  onNewKrathong: (k: Krathong) => void,
  onHistoryKrathong: (k: Krathong) => void,
) {
  const onNewRef = useRef(onNewKrathong);
  onNewRef.current = onNewKrathong;
  const onHistoryRef = useRef(onHistoryKrathong);
  onHistoryRef.current = onHistoryKrathong;

  useEffect(() => {
    let destroyed = false;

    const loadHistory = () => {
      supabase
        .from('krathongs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
        .then(({ data }) => {
          if (destroyed) return;
          data?.reverse().forEach(row => onHistoryRef.current(rowToKrathong(row)));
        });
    };

    loadHistory();

    const channel = supabase
      .channel('krathongs-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'krathongs' },
        (payload) => {
          if (destroyed) return;
          onNewRef.current(rowToKrathong(payload.new as Record<string, unknown>));
        }
      )
      .subscribe((status) => {
        if (destroyed) return;
        // reconnect เมื่อ channel ถูก closed โดยไม่ได้ตั้งใจ
        if (status === 'CLOSED') {
          setTimeout(() => {
            if (!destroyed) supabase.removeChannel(channel);
          }, 2000);
        }
      });

    return () => {
      destroyed = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const addKrathong = useCallback(async (k: Omit<Krathong, 'id' | 'createdAt'>): Promise<boolean> => {
    const { error } = await supabase.from('krathongs').insert([{
      name: k.name,
      message: k.message,
      color: k.color,
      x: k.x,
      y: k.y,
    }]);
    return !error;
  }, []);

  return { addKrathong };
}

function rowToKrathong(row: Record<string, unknown>): Krathong {
  return {
    id: row.id as string,
    name: row.name as string,
    message: row.message as string,
    color: row.color as string,
    x: row.x as number,
    y: row.y as number,
    createdAt: new Date(row.created_at as string).getTime(),
  };
}
