import React from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Dashboard', icon: DashboardIcon },
  { to: '/missions', label: 'Missions', icon: ListIcon },
  { to: '/history', label: 'History', icon: ClockIcon },
  { to: '/stats', label: 'Stats', icon: ChartIcon }
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-4 left-4 right-4 bg-black/50 border border-black/40 rounded-3xl backdrop-blur-md p-2 flex justify-between md:relative md:left-0 md:right-0 md:bottom-0 md:rounded-none">
      {items.map((it) => (
        <NavLink
          key={it.to}
          to={it.to}
          className={({ isActive }) =>
            'flex-1 text-center py-2 rounded-xl text-xs ' + (isActive ? 'text-aegis-gold-100 font-semibold' : 'text-gray-300')
          }
        >
          <div className="flex flex-col items-center">
            <it.icon className="w-6 h-6 mb-1" />
            <span>{it.label}</span>
          </div>
        </NavLink>
      ))}
    </nav>
  );
}

/* Icons */
function DashboardIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1" strokeWidth="1.5"></rect>
      <rect x="14" y="3" width="7" height="5" rx="1" strokeWidth="1.5"></rect>
      <rect x="14" y="12" width="7" height="9" rx="1" strokeWidth="1.5"></rect>
      <rect x="3" y="14" width="7" height="6" rx="1" strokeWidth="1.5"></rect>
    </svg>
  );
}
function ListIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M8 6h13M8 12h13M8 18h13" strokeWidth="1.5" strokeLinecap="round"></path>
      <path d="M3 6h.01M3 12h.01M3 18h.01" strokeWidth="1.5" strokeLinecap="round"></path>
    </svg>
  );
}
function ClockIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" strokeWidth="1.5"></circle>
      <path d="M12 7v6l4 2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
  );
}
function ChartIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path d="M3 3v18h18" strokeWidth="1.5"></path>
      <path d="M7 13v6M12 9v10M17 5v14" strokeWidth="1.5" strokeLinecap="round"></path>
    </svg>
  );
}
