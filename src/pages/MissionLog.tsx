import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { getAllMissions } from '../services/missionService';

const MissionLog: React.FC = () => {
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const m = await getAllMissions();
      setMissions(m as any);
    }
    load();
  }, []);

  return (
    <div className="pb-28">
      <Header title="Mission Log" subtitle="Active and archived missions" />
      <div className="px-4 space-y-4">
        {missions.length === 0 && (
          <Card>
            <div className="text-sm text-gray-300">No missions loaded yet — use the API or UI to add.</div>
          </Card>
        )}

        {missions.map((m) => (
          <Card key={m.id} className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">{m.title}</div>
                <div className="text-xs text-gray-400">{m.status} • Risk {m.risk}</div>
              </div>
              <div className="text-aegis-gold-100 font-semibold">{m.confidence}%</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MissionLog;
