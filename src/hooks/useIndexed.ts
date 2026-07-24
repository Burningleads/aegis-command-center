import { useEffect, useState } from 'react';
import { getDB } from '../database';

export function useIndexedCount(storeName: string) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const db = await getDB();
      const inst = await db;
      const all = await inst.getAll(storeName as any);
      if (mounted) setCount(all.length);
    }
    load();
    return () => {
      mounted = false;
    };
  }, [storeName]);

  return count;
}
