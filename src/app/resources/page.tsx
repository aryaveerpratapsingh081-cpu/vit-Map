'use client';

import React from 'react';
import { useSentinelStore } from '@/lib/store';
import { CampusResource, ResourceStatus } from '@/types';
import {
  ShieldCheck,
  Ambulance,
  Building,
  Wrench,
  Zap,
  Flame,
  PhoneCall,
  MapPin,
} from 'lucide-react';

export default function ResourcesPage() {
  const { resources, updateResourceStatus, incidents } = useSentinelStore();

  const getResourceIcon = (type: string) => {
    if (type.includes('Ambulance')) return Ambulance;
    if (type.includes('Security')) return ShieldCheck;
    if (type.includes('Warden')) return Building;
    if (type.includes('Electrical')) return Zap;
    if (type.includes('Fire')) return Flame;
    return Wrench;
  };

  const STATUS_OPTIONS: ResourceStatus[] = ['Available', 'Dispatched', 'Busy', 'Offline'];

  return (
    <div className="space-y-5 py-1">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-navy-900 to-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-indigo-950 border border-indigo-500/50 text-indigo-400">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-slate-100 uppercase tracking-wider">
              VIT Campus Resource & Response Dispatch Management
            </h1>
            <p className="text-xs text-slate-400">
              Monitor and dispatch VIT emergency response teams, health centre ambulances, wardens, and maintenance units.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">TOTAL UNITS:</span>
          <span className="text-indigo-400 font-bold">{resources.length}</span>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((res) => {
          const Icon = getResourceIcon(res.resource_type);
          const isAvailable = res.availability_status === 'Available';
          const isDispatched = res.availability_status === 'Dispatched';

          const assignedIncident = res.assigned_incident_id
            ? incidents.find((i) => i.id === res.assigned_incident_id)
            : null;

          return (
            <div
              key={res.id}
              className={`glass-panel p-4 rounded-xl border transition-all ${
                isAvailable
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : isDispatched
                  ? 'border-cyan-500/40 bg-cyan-950/20'
                  : 'border-slate-800 bg-navy-950'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-navy-900 border border-slate-700 text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">
                      {res.resource_type}
                    </span>
                    <h3 className="font-bold text-sm text-slate-100">{res.name}</h3>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-300 font-mono mb-3">
                <div className="flex items-center space-x-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{res.location}</span>
                </div>
                {res.phone && (
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>{res.phone}</span>
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  STATUS:
                </span>
                <select
                  value={res.availability_status}
                  onChange={(e) =>
                    updateResourceStatus(res.id, e.target.value as ResourceStatus)
                  }
                  className={`text-xs font-mono font-bold rounded px-2 py-1 border focus:outline-none ${
                    isAvailable
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : isDispatched
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-700'
                  }`}
                >
                  {STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {assignedIncident && (
                <div className="mt-2.5 p-2 rounded bg-navy-900 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
                  Assigned to: {assignedIncident.category} @ {assignedIncident.campus_location}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
