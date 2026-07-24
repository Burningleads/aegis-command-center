import { getDB } from '../database';

export async function exportAll(): Promise<Blob> {
  const db = await getDB();
  const dbInst = await db;
  const missions = await dbInst.getAll('missions');
  const sessions = await dbInst.getAll('sessions');
  const uploads = await dbInst.getAll('uploads');

  const data = { missions, sessions, uploads, exportedAt: new Date().toISOString() };
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
}

export async function importAll(data: any) {
  const db = await getDB();
  const dbInst = await db;
  if (Array.isArray(data.missions)) {
    for (const m of data.missions) {
      await dbInst.put('missions', m);
    }
  }
  if (Array.isArray(data.sessions)) {
    for (const s of data.sessions) {
      await dbInst.put('sessions', s);
    }
  }
  if (Array.isArray(data.uploads)) {
    for (const u of data.uploads) {
      await dbInst.put('uploads', u);
    }
  }
}
