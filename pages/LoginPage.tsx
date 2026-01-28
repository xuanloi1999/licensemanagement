
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
  const [loginType, setLoginType] = useState<UserRole>('admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(loginType);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute top-[-15%] right-[-15%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-15%] left-[-15%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px]" />

      <div className="w-full max-w-md relative z-10 space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30 animate-float transform rotate-12">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold font-display tracking-tight">Nova<span className="text-primary">License</span></h1>
          <p className="text-neutral-500 mt-3 font-medium">Enterprise Resource Management System</p>
        </div>

        <Card className="p-8 border-neutral-800/50 bg-background-darker/60 backdrop-blur-xl shadow-2xl">
          <div className="flex bg-neutral-900/80 p-1.5 rounded-2xl border border-neutral-800 mb-8">
            <button 
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${loginType === 'admin' ? 'bg-primary text-white shadow-xl shadow-primary/10' : 'text-neutral-500 hover:text-white'}`}
            >
              ADMIN PANEL
            </button>
            <button 
              onClick={() => setLoginType('org_user')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${loginType === 'org_user' ? 'bg-secondary text-white shadow-xl shadow-secondary/10' : 'text-neutral-500 hover:text-white'}`}
            >
              PORTAL ACCESS
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input 
              label="Email Identity" 
              placeholder={loginType === 'admin' ? "admin@nova.io" : "manager@acme.com"} 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="group-hover:border-primary transition-all"
            />
            <Input 
              label="Secure Password" 
              placeholder="••••••••" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-neutral-400 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded-md bg-neutral-900 border-neutral-800 text-primary focus:ring-primary focus:ring-offset-0 transition-all" />
                <span className="group-hover:text-neutral-300">Remember session</span>
              </label>
              <a href="#" className="text-primary hover:text-primary-400 font-bold transition-colors">Forgot Key?</a>
            </div>

            <Button type="submit" className="w-full py-4 text-sm font-bold tracking-widest uppercase transition-transform active:scale-95" disabled={loading} variant={loginType === 'admin' ? 'primary' : 'secondary'}>
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-5 h-5 border-2 ${loginType === 'admin' ? 'border-white/30 border-t-white' : 'border-white/30 border-t-white'} rounded-full animate-spin`} />
                  AUTHENTICATING...
                </div>
              ) : 'SIGN INTO PLATFORM'}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800/50 text-center">
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
              Powered by Nova Stack v2.5
            </p>
          </div>
        </Card>

        <p className="text-center text-xs text-neutral-600">
          Trouble signing in? <a href="#" className="text-primary-500 hover:underline font-bold">Contact Global Support</a>
        </p>
      </div>
    </div>
  );
};
