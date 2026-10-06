'use client';

import React from 'react';
import { useSentinelStore } from '@/lib/store';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, Activity, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';

const COLORS = ['#00f0ff', '#ff3366', '#ff9900', '#00e676', '#8b5cf6', '#3b82f6'];

export default function AnalyticsPage() {
  const { incidents, resources } = useSentinelStore();

  // Category distribution data
  const categoryCounts: Record<string, number> = {};
  incidents.forEach((inc) => {
    categoryCounts[inc.category] = (categoryCounts[inc.category] || 0) + 1;
  });

  const categoryData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    count: categoryCounts[cat],
  }));

  // Location distribution data
  const locationCounts: Record<string, number> = {};
  incidents.forEach((inc) => {
    const locName = inc.campus_location.split('(')[0].trim();
    locationCounts[locName] = (locationCounts[locName] || 0) + 1;
  });

  const locationData = Object.keys(locationCounts).map((loc) => ({
    name: loc,
    count: locationCounts[loc],
  }));

  // Status breakdown data
  const statusCounts: Record<string, number> = {};
  incidents.forEach((inc) => {
    statusCounts[inc.status] = (statusCounts[inc.status] || 0) + 1;
  });

  const statusData = Object.keys(statusCounts).map((st) => ({
    name: st,
    value: statusCounts[st],
  }));

  const activeCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-5 py-1">
      {/* Banner */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-slate-100 uppercase tracking-wider">
              VIT Campus Emergency Analytics & Metrics
            </h1>
            <p className="text-xs text-slate-400">
              Statistical breakdown of emergency incidents, campus location vulnerability, and response team efficiency.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">TOTAL ANALYZED:</span>
          <span className="text-cyan-400 font-bold">{incidents.length} REPORTS</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-xl border border-cyan-500/20">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase block">
            TOTAL INCIDENTS
          </span>
          <div className="text-2xl font-extrabold font-mono text-cyan-400 mt-1">
            {incidents.length}
          </div>
          <span className="text-[11px] text-slate-500">Recorded Campus Reports</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase block">
            RESOLVED RATE
          </span>
          <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
            {incidents.length > 0 ? ((resolvedCount / incidents.length) * 100).toFixed(0) : 100}%
          </div>
          <span className="text-[11px] text-emerald-500">{resolvedCount} Incidents Resolved</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-amber-500/20">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase block">
            AVG RESPONSE TIME
          </span>
          <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">
            2.4 min
          </div>
          <span className="text-[11px] text-amber-500">VIT Campus Standard</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-indigo-500/20">
          <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase block">
            AI CLASSIFICATION CONFD
          </span>
          <div className="text-2xl font-extrabold font-mono text-indigo-400 mt-1">
            95.2%
          </div>
          <span className="text-[11px] text-indigo-400">Gemini Vision & Text</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart 1: Incidents by Category */}
        <div className="glass-panel p-5 rounded-xl border border-cyan-500/20 space-y-3">
          <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            Emergencies by Category
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1b36', borderColor: '#00f0ff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#00f0ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Breakdown Pie Chart */}
        <div className="glass-panel p-5 rounded-xl border border-cyan-500/20 space-y-3">
          <h3 className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
            Incident Lifecycle Status Breakdown
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1b36', borderColor: '#00f0ff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
