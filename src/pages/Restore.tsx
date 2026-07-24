import React, { useRef } from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { importAll } from '../services/backupService';

const Restore: React.FC = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await importAll(JSON.parse(text));
      alert('Restore completed');
    } catch (err) {
      alert('Restore failed');
    }
  }

  return (
    <div className="pb-28">
      <Header title="Restore" subtitle="Import backup file" />
      <div className="px-4 space-y-4">
        <Card>
          <div className="text-sm text-gray-300">Select a backup JSON file to restore indexed data.</div>
          <div className="mt-3">
            <input ref={inputRef} type="file" accept="application/json" onChange={handleFile} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Restore;
