import React, { useEffect, useState } from 'react';
import RiskManager from '../components/RiskManager';
// Keep your existing page components/imports below if needed

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<any>({
    todaysRisk: 0,
    openMissions: 0,
    todaysConfidence: 0,
    currentSession: '-',
    currentStreak: 0,
    winRate: 0
  });

  return (
    <div className="min-h-screen pb-28 px-4 space-y-4 pt-4">
      
      {/* Our XAUUSD Risk Manager Front & Center */}
      <RiskManager />

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="text-sm text-slate-400">Today's Risk</div>
          <div className="text-2xl font-bold text-white mt-1">{metrics.todaysRisk}</div>
        </div>
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
          <div className="text-sm text-slate-400">Open Missions</div>
          <div className="text-2xl font-bold text-white mt-1">{metrics.openMissions}</div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;