
import React, { useState, useEffect } from 'react';
import { Card, Progress, Button, Badge, Input } from '../components/UI';
import { Organization } from '../types';
import { PLANS } from '../constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface OrgPortalProps {
  org: Organization;
  focusActivation?: boolean;
}

const MOCK_USAGE_DATA = [
  { name: 'Mon', usage: 45 },
  { name: 'Tue', usage: 52 },
  { name: 'Wed', usage: 85 },
  { name: 'Thu', usage: 60 },
  { name: 'Fri', usage: 78 },
  { name: 'Sat', usage: 35 },
  { name: 'Sun', usage: 22 },
];

export const OrgPortal: React.FC<OrgPortalProps> = ({ org, focusActivation = false }) => {
  const [activationKey, setActivationKey] = useState('');
  const [activationStatus, setActivationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleActivate = () => {
    setActivationStatus('loading');
    setTimeout(() => {
      if (activationKey.length > 5) setActivationStatus('success');
      else setActivationStatus('error');
    }, 1500);
  };

  const isBlocked = org.status === 'expired' || org.status === 'suspended';

  if (isBlocked) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-darker flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center text-error mb-6 animate-pulse border border-error/20 shadow-2xl shadow-error/10">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h1 className="text-4xl font-bold font-display mb-2">Access Denied</h1>
        <p className="text-xl text-error font-medium mb-6">Your organization license is {org.status}</p>
        <p className="text-neutral-400 max-w-md mb-8">
          The license for <strong>{org.name}</strong> was {org.status} on {org.expiryDate}. Please contact your administrator or billing department to restore access.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()}>Try Reconnecting</Button>
          <Button variant="outline">Billing Support</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">{focusActivation ? 'License Activation' : 'Organization Overview'}</h1>
          <p className="text-neutral-400 text-sm">Welcome back, {org.name} platform manager</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge status={org.status} className="!py-2 !px-4 !text-xs" />
          <div className="h-10 w-px bg-neutral-800"></div>
          <div className="text-right">
             <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-widest">Valid Until</p>
             <p className="text-sm font-bold text-white">{org.expiryDate}</p>
          </div>
        </div>
      </div>

      {!focusActivation ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Active Plan</p>
              <h3 className="text-2xl font-bold text-primary">{PLANS.find(p => p.id === org.planId)?.name}</h3>
              <div className="mt-4 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-success"></span>
                 <span className="text-xs text-neutral-400">Subscription Active</span>
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Seats Used</p>
              <h3 className="text-2xl font-bold text-white">{org.quotas.seats.current} <span className="text-sm text-neutral-500">/ {org.quotas.seats.total}</span></h3>
              <Progress value={org.quotas.seats.current} total={org.quotas.seats.total} className="mt-4" />
            </Card>
            <Card className="p-6">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Active Labs</p>
              <h3 className="text-2xl font-bold text-white">{org.quotas.labs.current} <span className="text-sm text-neutral-500">/ {org.quotas.labs.total}</span></h3>
              <Progress value={org.quotas.labs.current} total={org.quotas.labs.total} className="mt-4" color="bg-secondary" />
            </Card>
            <Card className="p-6">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Concurrency</p>
              <h3 className="text-2xl font-bold text-white">{org.quotas.concurrency.current} <span className="text-sm text-neutral-500">/ {org.quotas.concurrency.total}</span></h3>
              <Progress value={org.quotas.concurrency.current} total={org.quotas.concurrency.total} className="mt-4" color="bg-process" />
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold">Usage Trends (Last 7 Days)</h3>
                <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
                  <button className="px-3 py-1 text-[10px] font-bold bg-primary text-white rounded-md shadow-lg">SEATS</button>
                  <button className="px-3 py-1 text-[10px] font-bold text-neutral-400 hover:text-white transition-colors">LABS</button>
                </div>
              </div>
              <div className="h-full pb-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_USAGE_DATA}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec1938" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ec1938" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#252527" vertical={false} />
                    <XAxis dataKey="name" stroke="#5b5b5f" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#5b5b5f" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121212', border: '1px solid #444546', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#ec1938' }}
                    />
                    <Area type="monotone" dataKey="usage" stroke="#ec1938" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  Quick Key Activation
                </h3>
                <div className="space-y-4">
                  <Input 
                    placeholder="XXXX-XXXX-XXXX-XXXX" 
                    value={activationKey} 
                    onChange={(e) => {
                      setActivationKey(e.target.value);
                      setActivationStatus('idle');
                    }}
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full flex items-center justify-center gap-2" 
                    onClick={handleActivate}
                    disabled={!activationKey || activationStatus === 'loading'}
                  >
                    {activationStatus === 'loading' ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Validate License'}
                  </Button>
                </div>
              </Card>

              <Card className="p-6 border-l-4 border-l-secondary">
                 <h4 className="font-bold text-xs mb-4 uppercase tracking-widest text-neutral-500">Plan Highlights</h4>
                 <ul className="space-y-3">
                    {PLANS.find(p => p.id === org.planId)?.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-neutral-300">
                         <svg className="w-4 h-4 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                         {f}
                      </li>
                    ))}
                 </ul>
                 <Button variant="ghost" className="w-full mt-6 text-[10px] font-bold border border-neutral-800">VIEW ALL FEATURES</Button>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-2xl mx-auto py-12">
          <Card className="p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <svg className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            </div>
            
            <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            </div>
            
            <h2 className="text-2xl font-bold font-display mb-2">Activate Subscription</h2>
            <p className="text-neutral-400 mb-8 max-w-sm mx-auto">Enter your enterprise license key below to unlock advanced features and increase resource quotas.</p>
            
            <div className="space-y-6 text-left">
              <Input 
                label="License Key" 
                placeholder="XXXX-XXXX-XXXX-XXXX" 
                className="max-w-md mx-auto"
                value={activationKey} 
                onChange={(e) => {
                  setActivationKey(e.target.value);
                  setActivationStatus('idle');
                }}
              />
              
              <div className="max-w-md mx-auto pt-2">
                <Button 
                  variant="secondary" 
                  className="w-full py-3 font-bold"
                  onClick={handleActivate}
                  disabled={activationStatus === 'loading' || !activationKey}
                >
                   {activationStatus === 'loading' ? 'Verifying...' : 'Activate Platform'}
                </Button>
              </div>

              {activationStatus === 'success' && (
                <div className="max-w-md mx-auto p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-3 animate-fade-in">
                   <div className="w-6 h-6 rounded-full bg-success text-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <div>
                      <p className="font-bold">Activation Successful!</p>
                      <p className="text-xs opacity-80">Your plan has been updated to Enterprise Plus.</p>
                   </div>
                </div>
              )}

              {activationStatus === 'error' && (
                <div className="max-w-md mx-auto p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-center gap-3 animate-fade-in">
                   <div className="w-6 h-6 rounded-full bg-error text-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                   </div>
                   <div>
                      <p className="font-bold">Invalid Key</p>
                      <p className="text-xs opacity-80">The provided license key is either expired or incorrect.</p>
                   </div>
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-800 flex justify-center gap-8">
               <div className="text-center">
                  <p className="text-lg font-bold">500+</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold">Seats Added</p>
               </div>
               <div className="w-px h-10 bg-neutral-800"></div>
               <div className="text-center">
                  <p className="text-lg font-bold">Priority</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-bold">Support Tier</p>
               </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
