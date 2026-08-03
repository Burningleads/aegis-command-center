import React, { useState } from 'react';
import RiskManager from '../components/RiskManager';

const Dashboard: React.FC = () => {
  const [metrics] = useState({
    todaysRisk: '$0.53',
    openMissions: '1 Active',
    todaysConfidence: '85%',
    currentSession: 'London/NY',
    currentStreak: '3 Wins',
    winRate: '75%'
  });

  return (
    <div className="min-h-screen pb-28 px-4 space-y-4 pt-4 max-w-xl mx-auto font-sans text-white">
      
      {/* Header Branding */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">Aegis OS</h1>
          <p className="text-xs text-slate-400">XAUUSD Decision Engine</p>
        </div>
        <span className="text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-2 py-1 rounded">
          Session Active
        </span>
      </div>

      {/* Primary Execution Desk */}
      <RiskManager />

      {/* Decision Analytics Grid */}
      <section className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400">Decision Confidence</div>
          <div className="text-xl font-bold text-green-400 mt-1">{metrics.todaysConfidence}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400">Target Win Rate</div>
          <div className="text-xl font-bold text-blue-400 mt-1">{metrics.winRate}</div>
        </div>
      </section>

    </div>
  );
};

export default Dashboard;