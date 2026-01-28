
import React, { useState } from 'react';
import { Card, Button, Badge, Modal, Input } from '../components/UI';
import { PLANS } from '../constants';

export const AdminPlans: React.FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display">License Plans</h1>
          <p className="text-neutral-400 text-sm">Define default quotas and feature flags for each subscription tier</p>
        </div>
        <Button className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create New Plan
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLANS.map(plan => (
          <Card key={plan.id} className="flex flex-col">
            <div className="p-6 border-b border-neutral-800 bg-neutral-900/20">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-primary">{plan.name}</h3>
                <Badge status="active" />
              </div>
              <p className="text-xs text-neutral-500">ID: {plan.id}</p>
            </div>
            
            <div className="p-6 flex-1 space-y-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-3">Default Quotas</p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-2 bg-neutral-900 rounded border border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-1">Seats</p>
                    <p className="font-bold">{plan.defaultQuotas.seats}</p>
                  </div>
                  <div className="text-center p-2 bg-neutral-900 rounded border border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-1">Labs</p>
                    <p className="font-bold">{plan.defaultQuotas.labs}</p>
                  </div>
                  <div className="text-center p-2 bg-neutral-900 rounded border border-neutral-800">
                    <p className="text-xs text-neutral-500 mb-1">Cncry</p>
                    <p className="font-bold">{plan.defaultQuotas.concurrency}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest mb-3">Feature Flags</p>
                <div className="flex flex-wrap gap-2">
                  {plan.features.map((f, i) => (
                    <span key={i} className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold border border-secondary/20">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-neutral-900/50 border-t border-neutral-800 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => { setSelectedPlan(plan); setShowEditModal(true); }}>Edit Plan</Button>
              <Button variant="ghost" className="!p-2 text-error hover:bg-error/10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Modal 
        isOpen={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        title={`Edit Plan: ${selectedPlan?.name}`}
        footer={<><Button variant="outline" onClick={() => setShowEditModal(false)}>Cancel</Button><Button onClick={() => setShowEditModal(false)}>Save Changes</Button></>}
      >
        <div className="space-y-4">
          <Input label="Plan Name" value={selectedPlan?.name} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Default Seats" type="number" value={selectedPlan?.defaultQuotas.seats.toString()} />
            <Input label="Default Labs" type="number" value={selectedPlan?.defaultQuotas.labs.toString()} />
            <Input label="Default Concurrency" type="number" value={selectedPlan?.defaultQuotas.concurrency.toString()} />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">Feature Flags</label>
            <div className="space-y-2">
              {['SSO Login', 'API Access', 'Dedicated Support', 'Custom Labs', 'White Labeling'].map(feat => (
                <div key={feat} className="flex items-center justify-between p-3 bg-neutral-900 rounded-lg border border-neutral-800">
                  <span className="text-sm">{feat}</span>
                  <div className="w-10 h-5 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
