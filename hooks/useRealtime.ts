import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Krathong } from '@/types/krathong';

export function useRealtime(onNewKrathong: (k: Krathong) => void) {
  useEffect(() => {
    supabase
      .from('krathongs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        data?.reverse().forEach(row => onNewKrathong(rowToKrathong(row)));
      });

    const channel = supabase
      .channel('krathongs-realtime')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'krathongs' },
        (payload) => onNewKrathong(rowToKrathong(payload.new as Record<string, unknown>))
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [onNewKrathong]);

  const addKrathong = useCallback(async (k: Omit<Krathong, 'id' | 'createdAt'>) => {
    await supabase.from('krathongs').insert([{
      name: k.name,
      message: k.message,
      color: k.color,
      x: k.x,
      y: k.y,
    }]);
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
