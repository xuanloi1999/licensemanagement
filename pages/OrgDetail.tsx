
import React, { useState } from 'react';
import { Card, Button, Badge, Progress, Modal, Input } from '../components/UI';
import { Organization, Plan } from '../types';
import { PLANS, MOCK_LOGS } from '../constants';

interface OrgDetailProps {
  org: Organization;
  onBack: () => void;
}

export const OrgDetail: React.FC<OrgDetailProps> = ({ org, onBack }) => {
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showEditQuotaModal, setShowEditQuotaModal] = useState(false);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states
  const [newSeats, setNewSeats] = useState(org.quotas.seats.total.toString());
  const [newLabs, setNewLabs] = useState(org.quotas.labs.total.toString());
  const [newConcurrency, setNewConcurrency] = useState(org.quotas.concurrency.total.toString());
  const [selectedPlanId, setSelectedPlanId] = useState(org.planId);

  const plan = PLANS.find(p => p.id === org.planId) || PLANS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(org.licenseKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="!p-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold font-display">{org.name}</h1>
            <Badge status={org.status} className="mt-1" />
          </div>
          <p className="text-neutral-500 text-xs mt-1">ID: {org.id}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* License Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                License Information
              </h3>
              <Badge status={org.status} />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-12">
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">License Key</p>
                <div className="flex items-center gap-2">
                  <code className="bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 font-mono text-sm text-neutral-300">
                    {org.licenseKey.replace(/-[A-Z0-9]{4}-/i, '-••••-')}
                  </code>
                  <Button variant="ghost" onClick={handleCopy} className="!p-1.5 hover:text-primary">
                    {copied ? (
                      <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Current Plan</p>
                <p className="font-medium text-primary text-lg">{plan.name}</p>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Validity Period</p>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002-2z" /></svg>
                  <span className="text-sm">Expires on <span className="font-bold">{org.expiryDate}</span></span>
                </div>
              </div>
              <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-1">Actions</p>
                <div className="flex gap-2">
                  <Button variant="primary" className="!py-1 !px-3" onClick={() => setShowRenewModal(true)}>Renew</Button>
                  <Button variant="outline" className="!py-1 !px-3" onClick={() => setShowEditQuotaModal(true)}>Edit Quotas</Button>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 flex flex-wrap gap-3">
              <Button variant="ghost" className="text-error" onClick={() => setShowRevokeConfirm(true)}>Suspend License</Button>
              <Button variant="ghost" onClick={() => {}}>Force Sync</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Usage Metrics
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <Progress label="Seats Consumption" value={org.quotas.seats.current} total={org.quotas.seats.total} />
              <Progress label="Lab Capacity" value={org.quotas.labs.current} total={org.quotas.labs.total} color="bg-secondary" />
              <Progress label="Concurrency Limit" value={org.quotas.concurrency.current} total={org.quotas.concurrency.total} color="bg-process" />
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="p-4 border-b border-neutral-800 bg-neutral-900/30 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-neutral-400">
                Organization Activity
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {MOCK_LOGS.filter(l => l.targetOrg === org.name).map(log => (
                <div key={log.id} className="flex gap-4">
                  <div className="mt-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(236,25,56,0.6)]" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold">{log.action}</p>
                      <span className="text-[10px] text-neutral-500 font-mono">{log.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">{log.details}</p>
                    <p className="text-[10px] text-primary mt-1 font-medium">Actor: {log.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar Info */}
        <div className="space-y-6">
          <Card className="p-6 border-l-4 border-l-primary">
            <h4 className="font-bold text-xs mb-3 text-neutral-500 uppercase tracking-widest">Plan Features</h4>
            <div className="space-y-3">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-sm text-neutral-300">{f}</span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-6 text-xs text-secondary border border-secondary/10 hover:border-secondary/30">Edit Feature Flags</Button>
          </Card>

          <Card className="p-6 bg-neutral-900/50">
            <h4 className="font-bold text-sm mb-4">Support History</h4>
            <div className="space-y-4">
              <div className="p-3 rounded bg-background-darker border border-neutral-800">
                <p className="text-xs font-bold mb-1">#TKT-9921: Quota Increase Request</p>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-neutral-500">Opened 2 days ago</span>
                  <Badge status="pending" className="!scale-75" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Renew Modal - Detailed as per 2.3 */}
      <Modal 
        isOpen={showRenewModal} 
        onClose={() => setShowRenewModal(false)} 
        title="Renew / Extend License"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowRenewModal(false)}>Cancel</Button>
            <Button onClick={() => setShowRenewModal(false)}>Process Renewal</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-neutral-400 mb-2">Select Subscription Plan</label>
              <div className="grid grid-cols-2 gap-2">
                {PLANS.map(p => (
                  <button 
                    key={p.id}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-3 border rounded-lg text-left transition-all ${selectedPlanId === p.id ? 'border-primary bg-primary/5' : 'border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <p className={`text-sm font-bold ${selectedPlanId === p.id ? 'text-primary' : 'text-white'}`}>{p.name}</p>
                    <p className="text-[10px] text-neutral-500 mt-1">Default: {p.defaultQuotas.seats} seats</p>
                  </button>
                ))}
              </div>
            </div>
            <Input label="New Expiry Date" type="date" value="2026-12-31" />
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-1">Quick Period</label>
              <select className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none">
                <option>Custom</option>
                <option>+ 6 Months</option>
                <option selected>+ 1 Year</option>
                <option>+ 2 Years</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-neutral-900 rounded-lg border border-neutral-800">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Preview Comparison</h4>
            <div className="grid grid-cols-2 gap-8 relative">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] text-neutral-500 uppercase">Current</p>
                <p className="text-sm font-bold">{org.expiryDate}</p>
                <p className="text-xs text-neutral-400">{plan.name}</p>
              </div>
              <div className="space-y-2 text-right">
                <p className="text-[10px] text-success uppercase">After</p>
                <p className="text-sm font-bold text-success">2026-12-31</p>
                <p className="text-xs text-success">{PLANS.find(p => p.id === selectedPlanId)?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit Quota Modal */}
      <Modal 
        isOpen={showEditQuotaModal} 
        onClose={() => setShowEditQuotaModal(false)} 
        title="Override Quotas"
        footer={<><Button variant="outline" onClick={() => setShowEditQuotaModal(false)}>Cancel</Button><Button onClick={() => setShowEditQuotaModal(false)}>Save Overrides</Button></>}
      >
        <div className="space-y-4">
          <p className="text-xs text-neutral-400 mb-4">Manually adjust resource limits for this organization regardless of their default plan quotas.</p>
          <div className="grid grid-cols-1 gap-4">
            <Input label="Total Seats" type="number" value={newSeats} onChange={(e) => setNewSeats(e.target.value)} />
            <Input label="Lab Capacity" type="number" value={newLabs} onChange={(e) => setNewLabs(e.target.value)} />
            <Input label="Max Concurrency" type="number" value={newConcurrency} onChange={(e) => setNewConcurrency(e.target.value)} />
          </div>
          <div className="flex items-center gap-2 mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
            <svg className="w-4 h-4 text-warning shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <p className="text-[10px] text-warning">Warning: Lowering quotas below current usage may cause platform issues for users.</p>
          </div>
        </div>
      </Modal>

      {/* Suspend Confirm */}
      <Modal 
        isOpen={showRevokeConfirm} 
        onClose={() => setShowRevokeConfirm(false)} 
        title="Suspend Organization"
        footer={<><Button variant="outline" onClick={() => setShowRevokeConfirm(false)}>Cancel</Button><Button variant="danger" onClick={() => setShowRevokeConfirm(false)}>Yes, Suspend</Button></>}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4 text-error">
             <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <p className="text-neutral-400 text-sm">Are you sure you want to suspend access for <strong>{org.name}</strong>? This will block all users from logging in until reactive manually.</p>
        </div>
      </Modal>
    </div>
  );
};
