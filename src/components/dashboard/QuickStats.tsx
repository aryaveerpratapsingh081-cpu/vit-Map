'use client';

import React from 'react';
import { Activity, AlertOctagon, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';
import { useSentinelStore } from '@/lib/store';

export function QuickStats() {
  const { incidents, resources } = useSentinelStore();

  const activeCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const availableTeams = resources.filter((r) => r.availability_status === 'Available').length;

  const STATS = [
    {
      title: 'ACTIVE EMERGENCIES',
      value: activeCount,
      change: activeCount > 0 ? `${activeCount} Pending Dispatch` : 'All Clear',
      icon: Activity,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-950/30',
    },
    {
      title: 'CRITICAL INCIDENTS',
      value: criticalCount,
      change: criticalCount > 0 ? 'Requires Immediate Triage' : 'Zero High Risk',
      icon: AlertOctagon,
      color: 'text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-950/30',
    },
    {
      title: 'RESOLVED INCIDENTS',
      value: resolvedCount,
      change: 'Successfully Closed',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/30',
    },
    {
      title: 'AVAILABLE TEAMS',
      value: `${availableTeams} / ${resources.length}`,
      change: 'Campus Resources Ready',
      icon: ShieldCheck,
      color: 'text-indigo-400',
      border: 'border-indigo-500/30',
      bg: 'bg-indigo-950/30',
    },
    {
      title: 'AVG RESPONSE TIME',
      value: '2.4 min',
      change: 'VIT Campus Standard < 5m',
      icon: Clock,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`glass-panel p-3.5 rounded-xl border ${stat.border} ${stat.bg} glass-panel-hover flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                {stat.title}
              </span>
              <Icon className={`w-4 h-4 ${stat.color}`} />
            </div>

            <div>
              <div className={`text-2xl font-extrabold font-mono ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate font-sans">
                {stat.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
