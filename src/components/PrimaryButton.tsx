import React from 'react';
import { Link } from 'react-router-dom';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'primary' | 'ghost';
};

const PrimaryButton: React.FC<Props> = ({ children, variant = 'primary', className = '', ...rest }) => {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition focus:outline-none';

  const variants: Record<string, string> = {
    primary: 'bg-gradient-to-r from-aegis-gold-500 to-aegis-gold-400 text-black',
    ghost: 'bg-transparent border border-black/30 text-gray-200'
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
};

export default PrimaryButton;
