import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import ScreenshotUploader from '../components/ScreenshotUploader';
import { getAllMissions } from '../services/missionService';
import { getAllUploads, deleteUpload } from '../services/uploadService';

const MissionLog: React.FC = () => {
  const [missions, setMissions] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const [m, u] = await Promise.all([getAllMissions(), getAllUploads()]);
    setMissions(m as any);
    setUploads(u as any);
  }

  async function handleUploaded() {
    const u = await getAllUploads();
    setUploads(u as any);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this upload?')) return;
    await deleteUpload(id);
    setUploads((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="pb-28">
      <Header title="Mission Log" subtitle="Active and archived missions" />
      <div className="px-4 space-y-4">
        <Card>
          <div className="text-sm text-gray-300">Screenshot Upload</div>
          <div className="mt-3">
            <ScreenshotUploader onUploaded={handleUploaded} />
          </div>
        </Card>

        {uploads.length > 0 && (
          <section>
            <h3 className="text-sm text-gray-300 mb-2">Uploads</h3>
            <div className="grid grid-cols-2 gap-3">
              {uploads.map((up) => (
                <div key={up.id} className="bg-black/40 rounded-lg p-2">
                  <img src={up.dataUrl} alt={up.name} className="w-full h-32 object-cover rounded-md" />
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-200">{up.name}</div>
                    <button onClick={() => handleDelete(up.id)} className="text-xs text-red-400">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
