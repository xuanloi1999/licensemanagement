
import React from 'react';
import { Button } from './UI';

interface NavbarProps {
  onLogout: () => void;
  onMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onLogout, onMenuToggle }) => {
  return (
    <nav className="h-16 border-b border-neutral-800 bg-background-darker/80 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="font-display text-xl md:text-2xl font-bold tracking-tight">Hack<span className="text-primary">grid</span></span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-bold text-white leading-none">Admin Node</span>
          <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold mt-1">Superuser</span>
        </div>
        
        <div className="flex items-center gap-2 md:gap-3 border-l border-neutral-800 pl-4 md:pl-6">
          <div className="hidden xs:flex w-9 h-9 md:w-10 md:h-10 rounded-full bg-neutral-900 border border-neutral-800 items-center justify-center cursor-pointer hover:border-primary transition-all overflow-hidden group">
            <svg className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <Button variant="ghost" onClick={onLogout} className="!p-2 md:!p-2.5 rounded-full hover:bg-error/10 text-error/80 hover:text-error transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};
