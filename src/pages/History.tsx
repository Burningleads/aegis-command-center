import React from 'react';
import Header from '../components/Header';
import Card from '../components/Card';

const History: React.FC = () => {
  return (
    <div className="pb-28">
      <Header title="History" subtitle="Completed sessions & missions" />
      <div className="px-4">
        <Card>
          <div className="text-sm text-gray-300">History will appear here.</div>
        </Card>
      </div>
    </div>
  );
};

export default History;
