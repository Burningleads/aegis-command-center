import React from 'react';

type Props = {
  children: React.ReactNode;
  className?: string;
  heading?: string;
};

const Card: React.FC<Props> = ({ children, className = '', heading }) => {
  return (
    <div className={`bg-gradient-to-b from-transparent to-black/30 border border-black/40 rounded-2xl p-4 ${className}`}>
      {heading && <div className="text-sm text-aegis-gold-100 font-semibold mb-2">{heading}</div>}
      {children}
    </div>
  );
};

export default Card;
