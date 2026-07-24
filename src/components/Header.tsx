import React from 'react';

type Props = {
  title?: string;
  subtitle?: string;
};

const Header: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <header className="px-4 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-aegis-gold-100">{title ?? 'Aegis'}</h1>
          {subtitle && <p className="text-sm text-gray-300">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
};

export default Header;
