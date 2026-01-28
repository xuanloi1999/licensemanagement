
import React from 'react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole | 'none';
  activeView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeView, onNavigate }) => {
  const adminItems = [
    { id: 'dashboard', label: 'Organizations', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'plans', label: 'License Plans', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { id: 'logs', label: 'Audit Logs', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  const portalItems = [
    { id: 'dashboard', label: 'Overview', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'usage', label: 'Usage & Limits', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'activation', label: 'License Activation', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  ];

  const items = role === 'admin' ? adminItems : portalItems;

  return (
    <aside className="w-64 border-r border-neutral-800 bg-background-darker/30 hidden lg:flex flex-col p-4 space-y-2 z-30">
      <p className="text-[10px] uppercase font-bold text-neutral-500 px-4 mb-2 tracking-widest">
        {role === 'admin' ? 'Admin Management' : 'Organization Portal'}
      </p>
      
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group ${
            activeView === item.id 
              ? 'bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5' 
              : 'text-neutral-400 hover:bg-neutral-800 hover:text-white border border-transparent'
          }`}
        >
          <svg 
            className={`w-5 h-5 transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
          </svg>
          {item.label}
          {activeView === item.id && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          )}
        </button>
      ))}

      <div className="mt-auto p-4 bg-neutral-900/40 rounded-2xl border border-neutral-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400 border border-neutral-700">
            {role === 'admin' ? 'AD' : 'OP'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate">{role === 'admin' ? 'System Admin' : 'Portal User'}</p>
            <p className="text-[10px] text-neutral-500 truncate">{role === 'admin' ? 'admin@nova.io' : 'manager@acme.com'}</p>
          </div>
        </div>
        <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary w-2/3"></div>
        </div>
        <p className="text-[8px] text-neutral-500 mt-2 uppercase font-bold text-center tracking-tighter">Session expires in 42m</p>
      </div>
    </aside>
  );
};
