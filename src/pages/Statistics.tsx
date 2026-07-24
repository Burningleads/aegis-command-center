import React from 'react';
import Header from '../components/Header';
import Card from '../components/Card';

const Statistics: React.FC = () => {
  return (
    <div className="pb-28">
      <Header title="Statistics" subtitle="Performance & trends" />
      <div className="px-4 space-y-4">
        <Card>
          <div className="text-gray-300">Win Rate • Trend • Distribution</div>
        </Card>
      </div>
    </div>
  );
};

export default Statistics;
