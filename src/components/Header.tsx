import React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
};

const Header: React.FC<Props> = ({ title = 'Aegis Command Center', subtitle }) => {
  return (
    <header className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-aegis-gold-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-300 mt-1">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;
