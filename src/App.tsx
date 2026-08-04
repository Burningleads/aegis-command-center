import { useEffect, useMemo, useState } from 'react';
import { Header } from './components/Header';
import { BottomNav, type TabId } from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import NewMissionForm from './pages/MissionLog';
import MissionHistory from './pages/History';
import Statistics from './pages/Statistics';
import { DebriefModal } from './components/DebriefModal';
import { useMissions, type MissionInput, type DebriefInput } from './hooks/useMissions';
import { computeStats } from './lib/missions';

const SUBTITLES: Record<TabId, string> = {
  dashboard: 'Command Center',
  log: 'Deploy',
  history: 'Logbook',
  stats: 'Performance',
};

type ToastKind = 'success' | 'info' | 'error';
interface ToastState {
  msg: string;
  kind: ToastKind;
}

export default function App() {
  const [tab, setTab] = useState<TabId>('dashboard');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [debriefId, setDebriefId] = useState<string | null>(null);
  const { missions, loaded, addMission, setStatus, completeMission, deleteMission } = useMissions();

  const stats = useMemo(() => computeStats(missions), [missions]);
  const debriefMission = useMemo(
    () => missions.find((m) => m.id === debriefId) ?? null,
    [missions, debriefId]
  );

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const handleSave = (input: MissionInput) => {
    addMission(input);
    setToast({ msg: 'Mission logged', kind: 'success' });
    setTab('history');
  };

  const handleActivate = (id: string) => {
    setStatus(id, 'Active');
    setToast({ msg: 'Mission activated', kind: 'success' });
  };

  const handleCancel = (id: string) => {
    setStatus(id, 'Cancelled');
    setToast({ msg: 'Mission cancelled', kind: 'info' });
  };

  const handleComplete = (id: string, debrief: DebriefInput) => {
    completeMission(id, debrief);
    setDebriefId(null);
    setToast({
      msg: `Mission complete · ${debrief.result}${debrief.pnlR >= 0 ? ' +' : ' '}${debrief.pnlR.toFixed(1)}R`,
      kind: debrief.result === 'Loss' ? 'error' : 'success',
    });
  };

  const handleDelete = (id: string) => {
    deleteMission(id);
    setToast({ msg: 'Mission deleted', kind: 'info' });
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.06),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.03),transparent_60%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-shell px-5 pb-28">
        <Header subtitle={SUBTITLES[tab]} />

        {loaded && (
          <>
            {tab === 'dashboard' && (
              <Dashboard missions={missions} stats={stats} onNewMission={() => setTab('log')} />
            )}
            {tab === 'log' && <NewMissionForm onSave={handleSave} />}
            {tab === 'history' && (
              <MissionHistory
                missions={missions}
                onActivate={handleActivate}
                onCancel={handleCancel}
                onDebrief={(id) => setDebriefId(id)}
                onDelete={handleDelete}
                onNewMission={() => setTab('log')}
              />
            )}
            {tab === 'stats' && <Statistics stats={stats} />}
          </>
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />

      <DebriefModal
        open={!!debriefId}
        mission={debriefMission}
        onClose={() => setDebriefId(null)}
        onComplete={handleComplete}
      />

      {toast && (
        <div className="aegis-toast fixed bottom-24 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full border border-gold-400/30 bg-black/90 px-4 py-2.5 backdrop-blur-xl shadow-[0_8px_30px_-8px_rgba(212,175,55,0.4)]">
            <span className="text-sm font-semibold text-white">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
