import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  children: ReactNode;
}

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  const base =
    'group relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[0.97] disabled:opacity-40 disabled:active:scale-100 disabled:cursor-not-allowed min-h-[48px]';

  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-black shadow-[0_8px_30px_-8px_rgba(212,175,55,0.55)] hover:shadow-[0_12px_40px_-8px_rgba(212,175,55,0.75)] hover:brightness-110'
      : variant === 'danger'
      ? 'border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 hover:border-red-400/50'
      : 'border border-white/15 bg-white/[0.03] text-white/90 backdrop-blur hover:border-gold-400/50 hover:bg-white/[0.06] hover:text-white';

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {children}
    </button>
  );
}
