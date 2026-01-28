
import React, { useState } from 'react';
import { Button, Input, Card } from '../components/UI';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin('admin');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[180px] animate-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-secondary/10 rounded-full blur-[180px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ec1938 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      <div className="w-full max-w-md relative z-10 space-y-10 animate-fade-in">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-primary to-primary-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/40 animate-float transform rotate-6 border border-white/10">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold font-display tracking-tighter text-white">Hack<span className="text-primary">grid</span></h1>
          <p className="text-neutral-500 mt-4 font-bold uppercase tracking-[0.3em] text-[10px] opacity-70">Unified Resource Governance</p>
        </div>

        <Card className="p-10 border-neutral-800/50 bg-background-darker/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5 rounded-3xl">
          <div className="mb-10">
             <h2 className="text-xl font-bold text-white mb-2">Terminal Access</h2>
             <p className="text-xs text-neutral-500">Provide authorization credentials to proceed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="ADMINISTRATOR IDENTITY" 
              placeholder="admin@hackgrid.io" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="font-mono text-sm"
            />
            <Input 
              label="ACCESS SECURITY KEY" 
              placeholder="••••••••••••" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest pt-2">
              <label className="flex items-center gap-2 text-neutral-500 cursor-pointer group hover:text-white transition-colors">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-800 bg-neutral-900 text-primary focus:ring-primary focus:ring-offset-0 transition-all" />
                Persistent Session
              </label>
              <a href="#" className="text-primary hover:text-primary-400 transition-colors">Recovery Link</a>
            </div>

            <Button type="submit" className="w-full py-5 text-xs font-bold tracking-[0.2em] uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-4">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  AUTHORIZING...
                </div>
              ) : 'INITIALIZE SYSTEM'}
            </Button>
          </form>

          <div className="mt-10 pt-6 border-t border-neutral-800/50 text-center">
            <p className="text-[9px] text-neutral-600 uppercase tracking-[0.3em] font-bold">
              Secure Auth Protocol v4.0
            </p>
          </div>
        </Card>

        <p className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
          Unauthorized access is strictly prohibited. <br/>
          <a href="#" className="text-primary-600 hover:text-primary transition-colors mt-2 inline-block">System Status: Active</a>
        </p>
      </div>
    </div>
  );
};
