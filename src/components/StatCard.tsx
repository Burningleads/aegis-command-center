import React from 'react';
import Card from './Card';

type Props = {
  label: string;
  value: string | number;
  accent?: boolean;
  className?: string;
};

const StatCard: React.FC<Props> = ({ label, value, accent, className = '' }) => {
  return (
    <Card className={`flex flex-col justify-between ${className}`}>
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted text-gray-300">{label}</div>
        {accent && <div className="text-xs text-aegis-gold-100 font-medium">PRIORITY</div>}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-aegis-gold-100">{value}</div>
      </div>
    </Card>
  );
};

export default StatCard;
