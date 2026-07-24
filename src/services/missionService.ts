import { getDB, Mission, Session } from '../database';
import { nanoid } from 'nanoid';

export async function addMission(data: Partial<Mission>) {
  const db = await getDB();
  const mission: Mission = {
    id: data.id ?? nanoid(),
    title: data.title ?? 'Untitled',
    status: data.status ?? 'open',
    risk: data.risk ?? 0,
    confidence: data.confidence ?? 0,
    createdAt: Date.now()
  } as Mission;
  await (await db).put('missions', mission);
  return mission;
}

export async function getAllMissions(): Promise<Mission[]> {
  const db = await getDB();
  return (await (await db).getAll('missions')) as Mission[];
}

export async function getTodayMetrics() {
  const db = await getDB();
  const missions = (await (await db).getAll('missions')) as Mission[];
  const open = missions.filter((m) => m.status !== 'completed').length;
  const avgRisk =
    missions.length === 0 ? 0 : Math.round((missions.reduce((s, m) => s + m.risk, 0) / missions.length) * 100) / 100;
  const avgConfidence =
    missions.length === 0
      ? 0
      : Math.round((missions.reduce((s, m) => s + m.confidence, 0) / missions.length) * 100) / 100;

  const sessions = (await (await db).getAll('sessions')) as Session[];
  const wins = sessions.filter((s) => s.win).length;
  const winRate = sessions.length === 0 ? 0 : Math.round((wins / sessions.length) * 100) / 100;
  const streak = sessions.reduce((acc, s) => (s.streak && s.streak > acc ? s.streak : acc), 0);

  return {
    todaysRisk: `${avgRisk}`,
    openMissions: open,
    todaysConfidence: avgConfidence,
    currentSession: sessions.length > 0 ? sessions.at(-1)?.name ?? '—' : '—',
    currentStreak: streak,
    winRate
  };
}
