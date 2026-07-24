import { getDB } from '../database';

export async function clearAllStores() {
  const db = await getDB();
  const inst = await db;
  const tx = inst.transaction(['missions', 'sessions', 'uploads'], 'readwrite');
  await Promise.all([
    tx.objectStore('missions').clear(),
    tx.objectStore('sessions').clear(),
    tx.objectStore('uploads').clear()
  ] as any);
  await tx.done;
}
