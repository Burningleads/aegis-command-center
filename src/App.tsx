import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MissionLog from './pages/MissionLog';
import History from './pages/History';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Backup from './pages/Backup';
import Restore from './pages/Restore';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-aegis-black text-white">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/missions" element={<MissionLog />} />
          <Route path="/history" element={<History />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/backup" element={<Backup />} />
          <Route path="/restore" element={<Restore />} />
        </Routes>
      </main>

      <BottomNav />
    </div>
  );
};

export default App;
