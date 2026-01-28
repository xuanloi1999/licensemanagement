
import React from 'react';
import { Card, Input, Badge } from '../components/UI';
import { MOCK_LOGS } from '../constants';

export const AdminLogs: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold font-display">System Audit Logs</h1>
        <p className="text-neutral-400 text-sm">Track all administrative actions across the entire platform</p>
      </div>

      <Card className="p-4 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <Input label="Search Logs" placeholder="Search by actor or action..." />
        </div>
        <div className="w-48">
          <Input label="Date Range" type="date" />
        </div>
        <div className="w-40">
          <label className="block text-xs font-medium text-neutral-400 mb-1">Action Type</label>
          <select className="w-full bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-primary">
            <option>All Actions</option>
            <option>License Update</option>
            <option>Quota Change</option>
            <option>Plan Upgrade</option>
            <option>System Suspend</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-neutral-900 border-b border-neutral-800">
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Timestamp</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Actor</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Action</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Target Org</th>
                <th className="px-6 py-4 font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {MOCK_LOGS.map(log => (
                <tr key={log.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4 font-medium text-primary">{log.actor}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 text-xs">{log.action}</span>
                  </td>
                  <td className="px-6 py-4 font-bold">{log.targetOrg}</td>
                  <td className="px-6 py-4 text-neutral-400 italic max-w-xs truncate">{log.details}</td>
                </tr>
              ))}
              {/* Extra rows for scroll demo */}
              {[...Array(8)].map((_, i) => (
                <tr key={i} className="hover:bg-neutral-800/30 transition-colors opacity-60">
                  <td className="px-6 py-4 font-mono text-xs text-neutral-500">2024-05-0{9-i} 12:00:00</td>
                  <td className="px-6 py-4 font-medium text-neutral-300">System Bot</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-400 text-xs">Heartbeat</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-neutral-600">-</td>
                  <td className="px-6 py-4 text-neutral-500 italic">Background health check passed</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
