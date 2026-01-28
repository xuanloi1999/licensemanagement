
import React, { useState } from 'react';
import { Card, Input, Button, Badge } from '../components/UI';
import { MOCK_ORGS, PLANS } from '../constants';
import { LicenseStatus } from '../types';

interface AdminDashboardProps {
  onSelectOrg: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onSelectOrg }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LicenseStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<string>('all');

  const filteredOrgs = MOCK_ORGS.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) || org.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || org.status === statusFilter;
    const matchesPlan = planFilter === 'all' || org.planId === planFilter;
    return matchesSearch && matchesStatus && matchesPlan;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Organizations</h1>
          <p className="text-neutral-400 text-sm">Manage all system organizations and their license status</p>
        </div>
        <Button onClick={() => {}} className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Create Organization
        </Button>
      </div>

      <Card className="p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <Input 
            label="Search Organizations" 
            placeholder="Search by name or ID..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-40">
          <label className="block text-xs font-medium text-neutral-400 mb-1">Status</label>
          <select 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="w-40">
          <label className="block text-xs font-medium text-neutral-400 mb-1">Plan</label>
          <select 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
          >
            <option value="all">All Plans</option>
            {PLANS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredOrgs.map(org => (
          <Card key={org.id} className="hover:border-neutral-600 transition-colors cursor-pointer group" onClick={() => onSelectOrg(org.id)}>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-neutral-800 flex items-center justify-center font-display font-bold text-xl text-neutral-400 group-hover:bg-primary group-hover:text-white transition-all">
                  {org.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{org.name}</h3>
                    <Badge status={org.status} />
                  </div>
                  <div className="text-xs text-neutral-500 flex items-center gap-4 mt-1">
                    <span>ID: <span className="text-neutral-300 font-mono">{org.id}</span></span>
                    <span>Plan: <span className="text-primary font-medium">{PLANS.find(p => p.id === org.planId)?.name}</span></span>
                    <span>Expires: <span className="text-neutral-300">{org.expiryDate}</span></span>
                  </div>
                </div>
              </div>
              
              <div className="hidden lg:flex items-center gap-8 px-8 border-x border-neutral-800/50">
                <div className="text-center">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">Seats</div>
                  <div className="text-sm font-medium">{org.quotas.seats.current}/{org.quotas.seats.total}</div>
                </div>
                <div className="text-center">
                  <div className="text-neutral-500 text-[10px] uppercase font-bold">Labs</div>
                  <div className="text-sm font-medium">{org.quotas.labs.current}/{org.quotas.labs.total}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" className="!p-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredOrgs.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center">
            <svg className="w-16 h-16 text-neutral-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-neutral-500">No organizations found matching your filters.</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-neutral-500 pt-4 border-t border-neutral-800">
        <p>Showing {filteredOrgs.length} of {MOCK_ORGS.length} organizations</p>
        <div className="flex gap-2">
          <Button variant="outline" className="!px-3 !py-1" disabled>Previous</Button>
          <Button variant="outline" className="!px-3 !py-1">Next</Button>
        </div>
      </div>
    </div>
  );
};
