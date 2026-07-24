import { getDB } from '../database';
import { nanoid } from 'nanoid';

export type Upload = {
  id: string;
  name: string;
  dataUrl: string;
  missionId?: string | null;
  createdAt: number;
};

export async function saveUpload({ name, dataUrl, missionId }: { name?: string; dataUrl: string; missionId?: string | null }) {
  const db = await getDB();
  const upload: Upload = {
    id: nanoid(),
    name: name ?? `screenshot-${Date.now()}`,
    dataUrl,
    missionId: missionId ?? null,
    createdAt: Date.now()
  };
  const inst = await db;
  await inst.put('uploads', upload);
  return upload;
}

export async function getAllUploads(): Promise<Upload[]> {
  const db = await getDB();
  const inst = await db;
  return (await inst.getAll('uploads')) as Upload[];
}

export async function deleteUpload(id: string) {
  const db = await getDB();
  const inst = await db;
  await inst.delete('uploads', id);
}
