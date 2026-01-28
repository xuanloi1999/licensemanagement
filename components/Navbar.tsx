
import React from 'react';
import { Button } from './UI';

interface NavbarProps {
  role: 'admin' | 'org';
  onSwitchRole: (role: 'admin' | 'org') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ role, onSwitchRole, onLogout }) => {
  return (
    <nav className="h-16 border-b border-neutral-800 bg-background-darker/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <span className="font-display text-xl font-bold tracking-tight">Nova<span className="text-primary">License</span></span>
        
        <div className="ml-8 hidden md:flex items-center gap-1 bg-neutral-900 rounded-full p-1 border border-neutral-800">
          <button
            onClick={() => onSwitchRole('admin')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${role === 'admin' ? 'bg-primary text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
          >
            Admin Panel
          </button>
          <button
            onClick={() => onSwitchRole('org')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${role === 'org' ? 'bg-secondary text-white shadow-lg' : 'text-neutral-400 hover:text-white'}`}
          >
            Org Portal
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-medium">User Profile</span>
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest">{role === 'admin' ? 'Global Administrator' : 'Org Manager'}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700 cursor-pointer hover:border-primary transition-all">
          <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <Button variant="ghost" onClick={onLogout} className="!p-2">
          <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Button>
      </div>
    </nav>
  );
};
