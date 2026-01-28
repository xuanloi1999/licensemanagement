
import React, { useState, useMemo } from 'react';
import { Card, Input, Badge, Button } from '../components/UI';
import { MOCK_LOGS } from '../constants';

export const AdminLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  const filteredLogs = useMemo(() => {
    return MOCK_LOGS.filter(log => {
      const matchesSearch = log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           log.targetOrg.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || log.action.includes(typeFilter);
      const matchesDate = !dateFilter || log.timestamp.includes(dateFilter);
      return matchesSearch && matchesType && matchesDate;
    });
  }, [searchTerm, typeFilter, dateFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">System Audit logs</h1>
          <p className="text-neutral-400 text-sm">Immutable ledger of administrative actions and platform events</p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="flex items-center gap-2">
           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
           Export Logs
        </Button>
      </div>

      <Card className="p-4 flex flex-wrap gap-4 items-end bg-background-darker/40 border-neutral-800">
        <div className="flex-1 min-w-[200px]">
          <Input 
            label="Search Records" 
            placeholder="Search by actor, action, or target..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-52">
          <Input 
            label="Filter by Date" 
            type="date" 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="w-44">
          <label className="block text-xs font-medium text-neutral-400 mb-1">Action Category</label>
          <select 
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary transition-all"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Renew">Renewals</option>
            <option value="Quota">Quota Changes</option>
            <option value="Upgrade">Upgrades</option>
            <option value="Suspend">Suspensions</option>
          </select>
        </div>
        <Button variant="ghost" onClick={() => {setSearchTerm(''); setTypeFilter('All'); setDateFilter('');}} className="mb-0.5 !py-2.5">Reset</Button>
      </Card>

      <Card className="overflow-hidden border-neutral-800 shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-neutral-900/80 border-b border-neutral-800 backdrop-blur-md">
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">Timestamp</th>
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">Administrative Actor</th>
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">Global Action</th>
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">Impacted Org</th>
                <th className="px-8 py-5 font-bold text-neutral-500 uppercase tracking-widest text-[10px]">Change Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-primary/5 transition-all group">
                  <td className="px-8 py-4 font-mono text-[11px] text-neutral-400 whitespace-nowrap group-hover:text-primary transition-colors">{log.timestamp}</td>
                  <td className="px-8 py-4 font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-neutral-800 flex items-center justify-center text-[10px] border border-neutral-700">{log.actor[0]}</div>
                    {log.actor}
                  </td>
                  <td className="px-8 py-4">
                    <span className="px-3 py-1 rounded-full bg-neutral-950 text-neutral-400 text-[10px] font-bold border border-neutral-800 uppercase tracking-tighter group-hover:border-primary group-hover:text-primary transition-all">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-8 py-4 font-bold text-primary-200">{log.targetOrg}</td>
                  <td className="px-8 py-4 text-neutral-400 italic text-xs max-w-xs truncate group-hover:text-neutral-200">{log.details}</td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-neutral-600 italic">No records found matching your specified filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
