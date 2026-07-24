import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { getTodayMetrics } from '../services/missionService';
import Card from '../components/Card';
import { formatPercentage } from '../utils/format';

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState({
    todaysRisk: '—',
    openMissions: 0,
    todaysConfidence: 0,
    currentSession: '—',
    currentStreak: 0,
    winRate: 0
  });

  useEffect(() => {
    async function load() {
      const m = await getTodayMetrics();
      setMetrics(m as any);
    }
    load();
  }, []);

  return (
    <div className="pb-28">
      <Header title="Aegis Command Center" subtitle="Dashboard" />
      <div className="px-4 space-y-4">
        <section className="grid grid-cols-2 gap-4">
          <StatCard label="Today's Risk" value={metrics.todaysRisk} accent />
          <StatCard label="Open Missions" value={metrics.openMissions} />
          <StatCard
            label="Today's Confidence"
            value={formatPercentage((metrics as any).todaysConfidence)}
          />
          <StatCard label="Current Session" value={metrics.currentSession} />
        </section>

        <section className="grid grid-cols-2 gap-4">
          <Card>
            <div className="text-sm text-gray-300">Current Streak</div>
            <div className="text-3xl font-bold text-aegis-gold-100">{metrics.currentStreak}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-300">Win Rate</div>
            <div className="text-3xl font-bold text-aegis-gold-100">{formatPercentage(metrics.winRate)}</div>
          </Card>
        </section>

        <section>
          <h2 className="text-sm text-gray-300 mb-2">Recent Missions</h2>
          <div className="space-y-3">
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Recon Alpha</div>
                  <div className="text-xs text-gray-400">In progress • High</div>
                </div>
                <div className="text-aegis-gold-100 font-semibold">ETA 2h</div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Secure Outpost</div>
                  <div className="text-xs text-gray-400">Pending • Medium</div>
                </div>
                <div className="text-gray-300 text-sm">—</div>
              </div>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
