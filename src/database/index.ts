import { openDB, IDBPDatabase } from 'idb';

export type Mission = {
  id: string;
  title: string;
  status: 'open' | 'in_progress' | 'completed';
  risk: number;
  confidence: number;
  createdAt: number;
  updatedAt?: number;
};

export type Session = {
  id: string;
  name: string;
  startedAt: number;
  endedAt?: number;
  streak?: number;
  win?: boolean;
};

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB('aegis-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('missions')) {
          db.createObjectStore('missions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('sessions')) {
          db.createObjectStore('sessions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('uploads')) {
          db.createObjectStore('uploads', { keyPath: 'id' });
        }
      }
    });
  }
  return dbPromise;
}
