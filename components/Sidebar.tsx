
import React from 'react';

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, isOpen, onClose }) => {
  const items = [
    { id: 'dashboard', label: 'Organizations', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'plans', label: 'License Plans', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { id: 'logs', label: 'Audit Logs', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      <aside className={`fixed lg:static top-0 left-0 bottom-0 w-72 border-r border-neutral-800/60 bg-background-darker/95 lg:bg-background-darker/80 backdrop-blur-xl flex flex-col p-5 space-y-2 z-50 transition-transform duration-300 transform shadow-[10px_0_30px_rgba(0,0,0,0.5)] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-4 py-6 mb-4 flex justify-between items-center border-b border-neutral-800/40 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(236,25,56,0.8)]"></div>
              <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-[0.3em] opacity-80">Grid Control</p>
            </div>
            <p className="text-xl font-bold text-white tracking-widest font-display">SYSTEM TERMINAL</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-neutral-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-1.5 px-1 pt-4">
          {items.map((item) => {
            const isActive = activeView === item.id || (activeView === 'org-detail' && item.id === 'dashboard');
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-xs font-bold transition-all group relative overflow-hidden ${
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-neutral-500 hover:bg-neutral-800/50 hover:text-neutral-300'
                }`}
              >
                <div className={`shrink-0 transition-colors duration-300 ${isActive ? 'text-white' : 'group-hover:text-neutral-400'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <span className="uppercase tracking-[0.1em]">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto px-1 space-y-4">
          <div className="p-5 bg-neutral-900/40 rounded-3xl border border-neutral-800/80 shadow-inner group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-center text-primary shadow-2xl transition-transform group-hover:rotate-12 duration-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white uppercase tracking-tight">Security Node</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                  <p className="text-[8px] text-neutral-500 font-mono uppercase tracking-widest">Authorized</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800 shadow-inner">
                <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '98.4%' }}></div>
              </div>
              <div className="flex justify-between items-center text-[8px] text-neutral-600 font-mono tracking-tighter">
                <span>0xFD2..1E</span>
                <span>v3.0.1</span>
              </div>
            </div>
          </div>
          <div className="text-center px-4 pb-2">
             <p className="text-[8px] font-bold text-neutral-700 uppercase tracking-[0.4em]">HACKGRID CORE</p>
          </div>
        </div>
      </aside>
    </>
  );
};
