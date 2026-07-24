import React from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { exportAll } from '../services/backupService';

const Backup: React.FC = () => {
  async function handleExport() {
    const blob = await exportAll();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aegis-backup-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="pb-28">
      <Header title="Backup" subtitle="Export local data" />
      <div className="px-4 space-y-4">
        <Card>
          <div className="text-sm text-gray-300">Create a JSON backup of local IndexedDB data.</div>
          <div className="mt-3">
            <button onClick={handleExport} className="px-4 py-2 rounded-md bg-aegis-gold-500 text-black font-semibold">Export Backup</button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Backup;
