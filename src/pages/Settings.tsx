import React from 'react';
import Header from '../components/Header';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const Settings: React.FC = () => {
  return (
    <div className="pb-28">
      <Header title="Settings" subtitle="App preferences & account" />
      <div className="px-4 space-y-4">
        <Card>
          <div className="text-sm text-gray-300">Theme: <strong className="text-aegis-gold-100">Black & Gold</strong></div>
          <div className="mt-3">
            <Link to="/backup" className="text-sm text-aegis-gold-100">Backup data</Link>
          </div>
          <div className="mt-2">
            <Link to="/restore" className="text-sm text-aegis-gold-100">Restore data</Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
