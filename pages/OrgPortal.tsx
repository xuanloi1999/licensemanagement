
import React, { useState } from 'react';
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
        <h1 className="text-4xl font-bold font-display mb-2 text-white">Grid Access Restricted</h1>
        <p className="text-xl text-error font-medium mb-6 uppercase tracking-widest">License Status: {org.status}</p>
        <p className="text-neutral-400 max-w-md mb-8 leading-relaxed font-medium">
          The subscription for <strong>{org.name}</strong> has been restricted due to {org.status === 'expired' ? 'expiration' : 'administrative suspension'}. Contact Hackgrid support or your billing department.
        </p>
        <div className="flex gap-4">
          <Button onClick={() => window.location.reload()} className="!px-8 !py-3">Retry Link</Button>
          <Button variant="outline" className="!px-8 !py-3">Contact HQ</Button>
        </div>
      </div>
    );
  }

  // Warning state if usage > 85%
  const seatUsagePercent = (org.quotas.seats.current / org.quotas.seats.total) * 100;
  const isNearLimit = seatUsagePercent > 85;

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-display text-white tracking-tight">{focusActivation ? 'Entity Activation' : 'Entity Dashboard'}</h1>
          <p className="text-neutral-500 text-sm font-medium mt-1">Operational view for {org.name} resource grid.</p>
        </div>
        <div className="flex items-center gap-6 bg-neutral-900/40 p-3 px-6 rounded-2xl border border-neutral-800">
          <Badge status={org.status} className="!py-1.5 !px-5 !text-[10px] !rounded-xl" />
          <div className="h-10 w-px bg-neutral-800"></div>
          <div className="text-right">
             <p className="text-[10px] text-neutral-500 uppercase font-bold tracking-[0.2em] mb-0.5">Termination Date</p>
             <p className="text-sm font-bold text-white font-mono">{org.expiryDate}</p>
          </div>
        </div>
      </div>

      {isNearLimit && (
        <div className="p-4 bg-warning/10 border border-warning/20 rounded-2xl flex items-center gap-4 animate-pulse">
           <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center text-warning">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
           </div>
           <div>
              <p className="text-sm font-bold text-warning uppercase tracking-tight">Resource Saturation Alert</p>
              <p className="text-xs text-neutral-400 font-medium">Organization is at {Math.round(seatUsagePercent)}% seat capacity. System may restrict new sessions soon.</p>
           </div>
           <Button variant="outline" className="ml-auto !text-[10px] !py-2 hover:bg-warning hover:text-black hover:border-warning">Request Increase</Button>
        </div>
      )}

      {!focusActivation ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-8 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 rounded-3xl group hover:border-primary/40 transition-all shadow-xl">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Deployed Tier</p>
              <h3 className="text-2xl font-bold text-primary tracking-tighter">{PLANS.find(p => p.id === org.planId)?.name.toUpperCase()}</h3>
              <div className="mt-6 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(30,185,128,0.6)]"></span>
                 <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">License Verified</span>
              </div>
            </Card>
            <Card className="p-8 rounded-3xl shadow-xl">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">User Saturation</p>
              <h3 className="text-2xl font-bold text-white tracking-tighter">{org.quotas.seats.current} <span className="text-sm text-neutral-600">/ {org.quotas.seats.total}</span></h3>
              <Progress value={org.quotas.seats.current} total={org.quotas.seats.total} className="mt-6" />
            </Card>
            <Card className="p-8 rounded-3xl shadow-xl">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Compute Units</p>
              <h3 className="text-2xl font-bold text-white tracking-tighter">{org.quotas.labs.current} <span className="text-sm text-neutral-600">/ {org.quotas.labs.total}</span></h3>
              <Progress value={org.quotas.labs.current} total={org.quotas.labs.total} className="mt-6" color="bg-secondary" />
            </Card>
            <Card className="p-8 rounded-3xl shadow-xl">
              <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-2">Burst Concurrency</p>
              <h3 className="text-2xl font-bold text-white tracking-tighter">{org.quotas.concurrency.current} <span className="text-sm text-neutral-600">/ {org.quotas.concurrency.total}</span></h3>
              <Progress value={org.quotas.concurrency.current} total={org.quotas.concurrency.total} className="mt-6" color="bg-process" />
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-10 h-[450px] rounded-3xl shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold tracking-tight flex items-center gap-3">
                   <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                   </span>
                   Entity Consumption Trend
                </h3>
                <div className="flex bg-neutral-900/60 rounded-xl p-1 border border-neutral-800">
                  <button className="px-5 py-1.5 text-[10px] font-bold bg-primary text-white rounded-lg shadow-lg uppercase tracking-widest">Users</button>
                  <button className="px-5 py-1.5 text-[10px] font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">Compute</button>
                </div>
              </div>
              <div className="h-full pb-16">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_USAGE_DATA}>
                    <defs>
                      <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec1938" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#ec1938" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#252527" vertical={false} />
                    <XAxis dataKey="name" stroke="#5b5b5f" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#5b5b5f" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#121212', border: '1px solid #444546', borderRadius: '16px', fontSize: '12px', fontWeight: 'bold' }}
                      itemStyle={{ color: '#ec1938' }}
                      cursor={{ stroke: '#ec1938', strokeWidth: 1 }}
                    />
                    <Area type="monotone" dataKey="usage" stroke="#ec1938" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={4} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="space-y-8">
              <Card className="p-10 rounded-3xl shadow-2xl border-neutral-800 bg-background-darker/40">
                <h3 className="font-bold mb-6 flex items-center gap-3 text-lg">
                  <span className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  </span>
                  Key Activation
                </h3>
                <div className="space-y-5">
                  <Input 
                    placeholder="XXXX-XXXX-XXXX-XXXX" 
                    value={activationKey} 
                    className="!bg-neutral-950/60 !py-3 !rounded-xl"
                    onChange={(e) => {
                      setActivationKey(e.target.value);
                      setActivationStatus('idle');
                    }}
                  />
                  <Button 
                    variant="secondary" 
                    className="w-full flex items-center justify-center gap-3 !py-4 rounded-xl !text-xs font-bold uppercase tracking-widest shadow-xl shadow-secondary/10" 
                    onClick={handleActivate}
                    disabled={!activationKey || activationStatus === 'loading'}
                  >
                    {activationStatus === 'loading' ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : 'Validate License'}
                  </Button>
                </div>
              </Card>

              <Card className="p-10 border-l-8 border-l-secondary rounded-3xl shadow-xl">
                 <h4 className="font-bold text-[10px] mb-6 uppercase tracking-[0.3em] text-neutral-500">Tier Features</h4>
                 <ul className="space-y-5">
                    {PLANS.find(p => p.id === org.planId)?.features.slice(0, 4).map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-xs text-neutral-300 font-medium">
                         <div className="w-5 h-5 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                         </div>
                         {f}
                      </li>
                    ))}
                 </ul>
                 <Button variant="ghost" className="w-full mt-8 text-[10px] font-bold border border-neutral-800 py-3 uppercase tracking-widest rounded-xl hover:bg-neutral-800">Operational Matrix</Button>
              </Card>
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-2xl mx-auto py-12">
          <Card className="p-12 text-center relative overflow-hidden rounded-[2.5rem] shadow-2xl border-neutral-800">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none scale-150">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 8.94-7 10.15-3.87-1.21-7-5.48-7-10.15V6.3l7-3.12z"/></svg>
            </div>
            
            <div className="w-20 h-20 bg-secondary/10 rounded-[2rem] flex items-center justify-center text-secondary mx-auto mb-8 shadow-inner border border-secondary/10">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
            </div>
            
            <h2 className="text-3xl font-bold font-display mb-3 text-white">Initialize Subscription</h2>
            <p className="text-neutral-500 mb-10 max-w-sm mx-auto font-medium">Provision your entity by supplying an authorized AES license key below.</p>
            
            <div className="space-y-8 text-left max-w-md mx-auto">
              <Input 
                label="ENCRYPTED KEY" 
                placeholder="XXXX-XXXX-XXXX-XXXX" 
                className="!bg-neutral-950/60 !py-4 !px-6 !rounded-2xl !text-sm font-mono tracking-widest"
                value={activationKey} 
                onChange={(e) => {
                  setActivationKey(e.target.value);
                  setActivationStatus('idle');
                }}
              />
              
              <div className="pt-2">
                <Button 
                  variant="secondary" 
                  className="w-full py-4 font-bold text-xs tracking-[0.2em] uppercase rounded-2xl shadow-xl shadow-secondary/20"
                  onClick={handleActivate}
                  disabled={activationStatus === 'loading' || !activationKey}
                >
                   {activationStatus === 'loading' ? 'VERIFYING...' : 'ACTIVATE ENTITY'}
                </Button>
              </div>

              {activationStatus === 'success' && (
                <div className="p-5 bg-success/10 border border-success/20 rounded-2xl text-success text-sm flex items-center gap-4 animate-fade-in shadow-lg">
                   <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <div>
                      <p className="font-bold uppercase tracking-tight">Activation Successful</p>
                      <p className="text-[11px] opacity-80 font-medium">Grid resources have been scaled to Enterprise specifications.</p>
                   </div>
                </div>
              )}

              {activationStatus === 'error' && (
                <div className="p-5 bg-error/10 border border-error/20 rounded-2xl text-error text-sm flex items-center gap-4 animate-fade-in shadow-lg">
                   <div className="w-8 h-8 rounded-full bg-error text-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                   </div>
                   <div>
                      <p className="font-bold uppercase tracking-tight">Invalid Credential</p>
                      <p className="text-[11px] opacity-80 font-medium">The provided key failed authorization or has already been recycled.</p>
                   </div>
                </div>
              )}
            </div>

            <div className="mt-12 pt-10 border-t border-neutral-800 flex justify-center gap-12">
               <div className="text-center">
                  <p className="text-2xl font-bold text-white tracking-tighter">500+</p>
                  <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-[0.2em]">New Seats</p>
               </div>
               <div className="w-px h-12 bg-neutral-800"></div>
               <div className="text-center">
                  <p className="text-2xl font-bold text-white tracking-tighter">PRIORITY</p>
                  <p className="text-[9px] text-neutral-500 uppercase font-bold tracking-[0.2em]">SLA Status</p>
               </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
