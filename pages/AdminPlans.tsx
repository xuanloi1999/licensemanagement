
import React from 'react';
import { Card, Badge, Button } from '../components/UI';
import { PLANS } from '../constants';

export const AdminPlans: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-display tracking-tight text-white">Grid Blueprints</h1>
          <p className="text-neutral-500 text-sm mt-1 font-medium">Standardized resource tiers and operational capability constraints.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {PLANS.map(plan => (
          <Card key={plan.id} className="flex flex-col border-neutral-800 bg-background-darker/40 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:border-neutral-700 transition-all">
            {/* Tier Accent Header */}
            <div className={`absolute top-0 left-0 w-full h-2 ${
              plan.id === 'enterprise' ? 'bg-primary' : 
              plan.id === 'pro' ? 'bg-secondary' : 
              'bg-neutral-600'
            }`}></div>
            
            <div className="p-10 border-b border-neutral-800/50 bg-neutral-900/10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className={`text-4xl font-bold font-display tracking-tighter mb-1 ${
                    plan.id === 'enterprise' ? 'text-primary' : 
                    plan.id === 'pro' ? 'text-secondary' : 
                    'text-white'
                  }`}>
                    {plan.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-neutral-600 uppercase tracking-widest font-bold">PROFILE_UUID: {plan.id}</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 shadow-inner text-neutral-500 group-hover:text-primary transition-colors">
                   <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                   </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-medium mb-8 max-w-[280px]">
                {plan.description}
              </p>
              
              {/* Quotas Summary */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 shadow-inner">
                  <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1.5">Seats</p>
                  <p className="text-xl font-bold text-white tracking-tighter">{plan.defaultQuotas.seats}</p>
                </div>
                <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 shadow-inner">
                  <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1.5">Labs</p>
                  <p className="text-xl font-bold text-white tracking-tighter">{plan.defaultQuotas.labs}</p>
                </div>
                <div className="bg-neutral-950/60 p-4 rounded-2xl border border-neutral-800 shadow-inner">
                  <p className="text-[9px] text-neutral-600 uppercase font-bold tracking-widest mb-1.5">Burst</p>
                  <p className="text-xl font-bold text-white tracking-tighter">{plan.defaultQuotas.concurrency}x</p>
                </div>
              </div>
            </div>
            
            <div className="p-10 flex-1 space-y-10 pb-12">
              {/* Marketing/Feature List */}
              <div className="space-y-6">
                <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-[0.3em] flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Service Inclusions
                </p>
                <div className="grid gap-4">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-4 group/item">
                      <div className="w-6 h-6 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs font-bold text-neutral-300 uppercase tracking-tight group-hover/item:text-white transition-colors">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Feature Flags (Comparison View) */}
              <div className="space-y-6">
                <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-[0.3em] flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  Capability Grid
                </p>
                <div className="bg-neutral-950/40 rounded-[2rem] p-6 border border-neutral-800/60 space-y-5">
                  {plan.featureFlags.map((flag, idx) => (
                    <div key={idx} className={`flex items-center justify-between group/flag ${!flag.enabled ? 'opacity-40' : ''}`}>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white tracking-tight uppercase">{flag.label}</span>
                        <span className="text-[8px] font-mono text-neutral-600 uppercase tracking-widest mt-0.5">{flag.key}</span>
                      </div>
                      <div className={`p-1.5 rounded-lg border transition-all ${
                        flag.enabled 
                          ? 'bg-success/10 border-success/20 text-success' 
                          : 'bg-neutral-900 border-neutral-800 text-neutral-700'
                      }`}>
                        {flag.enabled ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
