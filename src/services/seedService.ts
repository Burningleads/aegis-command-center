import { getDB } from '../database';
import { addMission } from './missionService';
import { nanoid } from 'nanoid';
import { saveUpload } from './uploadService';

export async function seedIfEmpty() {
  const db = await getDB();
  const inst = await db;
  const missions = await inst.getAll('missions');
  if ((missions as any[]).length === 0) {
    await addMission({ id: nanoid(), title: 'Recon Alpha', status: 'in_progress', risk: 7, confidence: 0.85 });
    await addMission({ id: nanoid(), title: 'Secure Outpost', status: 'open', risk: 4, confidence: 0.6 });
  }

  const sessions = await inst.getAll('sessions');
  if ((sessions as any[]).length === 0) {
    await inst.put('sessions', { id: nanoid(), name: 'Morning', startedAt: Date.now() - 3600000, endedAt: Date.now(), streak: 3, win: true });
  }

  const uploads = await inst.getAll('uploads');
  if ((uploads as any[]).length === 0) {
    // create a tiny SVG data URL as demo upload
    const svg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="100%" height="100%" fill="#0b0b0b"/><text x="50%" y="50%" fill="#d4af37" font-size="20" font-family="Arial" text-anchor="middle" dominant-baseline="middle">Demo Screenshot</text></svg>');
    const dataUrl = `data:image/svg+xml;charset=UTF-8,${svg}`;
    await saveUpload({ name: 'demo.svg', dataUrl });
  }
}
