import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import PrimaryButton from '../components/PrimaryButton';
import { getTodayMetrics } from '../services/missionService';
import { formatPercentage } from '../utils/format';
import BottomNavigation from '../components/BottomNavigation';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

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
    let mounted = true;
    async function load() {
      const m = await getTodayMetrics();
      if (mounted) setMetrics(m as any);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen pb-28">
      <Header subtitle="Command Center" />
      <div className="px-4 space-y-4">
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-300">Good to see you, Commander</h2>
            <p className="text-xs text-gray-400">Overview of today</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/missions">
              <PrimaryButton>Log New Mission</PrimaryButton>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard label="Today's Risk" value={metrics.todaysRisk} accent />
          <StatCard label="Open Missions" value={metrics.openMissions} />
          <StatCard label="Today's Confidence" value={formatPercentage(metrics.todaysConfidence)} />
          <StatCard label="Current Session" value={metrics.currentSession} />
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <div className="text-sm text-gray-300">Current Streak</div>
            <div className="text-3xl font-bold text-aegis-gold-100 mt-2">{metrics.currentStreak}</div>
          </Card>
          <Card>
            <div className="text-sm text-gray-300">Win Rate</div>
            <div className="text-3xl font-bold text-aegis-gold-100 mt-2">{formatPercentage(metrics.winRate)}</div>
          </Card>
        </section>

        <section>
          <h3 className="text-sm text-gray-300 mb-2">Recent Activity</h3>
          <Card>
            <div className="text-sm text-gray-300">No recent missions. Use "Log New Mission" to create one.</div>
          </Card>
        </section>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Dashboard;
