
import React from 'react';
import { Card, Progress, Badge } from '../components/UI';
import { Organization } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface OrgUsageProps {
  org: Organization;
}

const DAILY_USAGE = [
  { time: '00:00', seats: 45, labs: 12, cpu: 15 },
  { time: '04:00', seats: 30, labs: 8, cpu: 10 },
  { time: '08:00', seats: 120, labs: 45, cpu: 55 },
  { time: '12:00', seats: 420, labs: 85, cpu: 92 },
  { time: '16:00', seats: 380, labs: 70, cpu: 80 },
  { time: '20:00', seats: 210, labs: 30, cpu: 40 },
  { time: '23:59', seats: 85, labs: 15, cpu: 20 },
];

const RESOURCE_DISTRIBUTION = [
  { name: 'R&D Dept', value: 45 },
  { name: 'DevOps', value: 25 },
  { name: 'Testing', value: 15 },
  { name: 'Others', value: 15 },
];

export const OrgUsage: React.FC<OrgUsageProps> = ({ org }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display">Usage & Resource Limits</h1>
          <p className="text-neutral-400 text-sm">Deep dive into organization consumption and real-time quotas</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] text-neutral-500 uppercase font-bold">Billing Cycle</p>
            <p className="text-sm font-bold">Monthly</p>
          </div>
          <div className="w-px h-8 bg-neutral-800"></div>
          <div className="text-center">
            <p className="text-[10px] text-neutral-500 uppercase font-bold">Next Invoice</p>
            <p className="text-sm font-bold">Mar 01, 2025</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Seat Consumption Trend (24h)
            </h3>
            <Badge status="active" />
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DAILY_USAGE}>
                <defs>
                  <linearGradient id="colorSeats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec1938" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec1938" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252527" vertical={false} />
                <XAxis dataKey="time" stroke="#5b5b5f" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#5b5b5f" fontSize={10} axisLine={false} tickLine={false} domain={[0, org.quotas.seats.total]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid #444546', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="seats" stroke="#ec1938" fillOpacity={1} fill="url(#colorSeats)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold mb-6">Resource Allocation</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RESOURCE_DISTRIBUTION} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="#5b5b5f" fontSize={10} width={80} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#121212', border: '1px solid #444546', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                  {RESOURCE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ec1938' : '#00c7cd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
             <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Total Utilization</span>
                <span className="font-bold">84%</span>
             </div>
             <Progress value={84} total={100} color="bg-primary" />
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 border-t-4 border-t-primary">
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold">Seats Used</p>
                <h4 className="text-2xl font-bold">{org.quotas.seats.current}</h4>
             </div>
             <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
          </div>
          <Progress value={org.quotas.seats.current} total={org.quotas.seats.total} label="Max Capacity" />
          <p className="text-[10px] text-neutral-500 mt-4 italic">* Additional seats available for $5/mo each</p>
        </Card>

        <Card className="p-6 border-t-4 border-t-secondary">
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold">Lab Instances</p>
                <h4 className="text-2xl font-bold">{org.quotas.labs.current}</h4>
             </div>
             <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
             </div>
          </div>
          <Progress value={org.quotas.labs.current} total={org.quotas.labs.total} color="bg-secondary" label="Lab Quota" />
        </Card>

        <Card className="p-6 border-t-4 border-t-process">
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-neutral-500 text-[10px] uppercase font-bold">Concurrency</p>
                <h4 className="text-2xl font-bold">{org.quotas.concurrency.current}</h4>
             </div>
             <div className="w-10 h-10 rounded-xl bg-process/10 flex items-center justify-center text-process">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             </div>
          </div>
          <Progress value={org.quotas.concurrency.current} total={org.quotas.concurrency.total} color="bg-process" label="Max Burst" />
        </Card>
      </div>
    </div>
  );
};
