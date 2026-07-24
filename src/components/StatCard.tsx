import React from 'react';

type Props = {
  label: string;
  value: string | number;
  className?: string;
  accent?: boolean;
};

const StatCard: React.FC<Props> = ({ label, value, className = '', accent = false }) => {
  return (
    <div className={`bg-gradient-to-b from-black/20 to-black/40 border border-black/30 rounded-2xl p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-300">{label}</div>
        </div>
        {accent && <div className="text-xs text-aegis-gold-100 font-semibold">PRIORITY</div>}
      </div>
      <div className="mt-3">
        <div className="text-2xl md:text-3xl font-bold text-aegis-gold-100">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
