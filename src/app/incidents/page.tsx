'use client';

import React, { useState } from 'react';
import { useSentinelStore } from '@/lib/store';
import { IncidentStatus } from '@/types';
import { PriorityBadge, StatusBadge } from '@/components/dashboard/PriorityBadge';
import {
  ListFilter,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  FileText,
} from 'lucide-react';

const STATUS_TIMELINE: IncidentStatus[] = [
  'REPORTED',
  'AI ANALYZED',
  'PRIORITIZED',
  'RESPONSE ASSIGNED',
  'IN PROGRESS',
  'RESOLVED',
];

export default function IncidentsPage() {
  const { incidents, updateIncidentStatus } = useSentinelStore();
  const [selectedId, setSelectedId] = useState<string>(incidents[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const selectedIncident = incidents.find((i) => i.id === selectedId) || incidents[0];

  const filteredIncidents = incidents.filter(
    (inc) => filterCategory === 'ALL' || inc.category === filterCategory
  );

  return (
    <div className="space-y-4 py-1">
      {/* Banner */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <ListFilter className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-slate-100 uppercase tracking-wider">
              Campus Incident Status Tracker & Audit Trail
            </h1>
            <p className="text-xs text-slate-400">
              Track active emergency lifecycles from student report to AI triage and resolution.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Incidents List (Spans 1 col) */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3 h-[600px] flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="font-mono text-xs font-bold text-slate-300 uppercase">
              Incident Registry ({filteredIncidents.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {filteredIncidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedId(inc.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-navy-850 border-cyan-400/80 shadow-md'
                      : 'bg-navy-950/60 border-slate-800 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <PriorityBadge priority={inc.priority} />
                    <StatusBadge status={inc.status} />
                  </div>
                  <h4 className="font-bold text-xs text-slate-100">{inc.category}</h4>
                  <p className="text-[11px] text-cyan-300 font-mono mt-0.5">
                    📍 {inc.campus_location}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detailed Status Inspector (Spans 2 cols) */}
        {selectedIncident ? (
          <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-cyan-500/20 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold block uppercase">
                  INCIDENT ID: #{selectedIncident.id.slice(-6)}
                </span>
                <h2 className="text-lg font-bold text-slate-100">
                  {selectedIncident.category}
                </h2>
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedIncident.campus_location}</span>
                </div>
              </div>

              <div className="flex flex-col items-end space-y-1">
                <PriorityBadge priority={selectedIncident.priority} />
                <StatusBadge status={selectedIncident.status} />
              </div>
            </div>

            {/* Lifecycle Timeline */}
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-400 uppercase mb-3">
                Emergency Response Status Timeline:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {STATUS_TIMELINE.map((step, idx) => {
                  const currentIdx = STATUS_TIMELINE.indexOf(selectedIncident.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div
                      key={step}
                      onClick={() => updateIncidentStatus(selectedIncident.id, step)}
                      className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold shadow-md'
                          : isCompleted
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-navy-950/40 border-slate-800 text-slate-600'
                      }`}
                    >
                      <div className="text-[9px] font-mono text-slate-400 mb-0.5">
                        STEP 0{idx + 1}
                      </div>
                      <div className="text-[10px] font-mono leading-tight">{step}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description & Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                  Submitted Description:
                </h4>
                <div className="p-3 rounded-lg bg-navy-950 border border-slate-800 text-xs text-slate-200">
                  {selectedIncident.description}
                </div>
              </div>

              {selectedIncident.image_url && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
                    Attached Evidence Photo:
                  </h4>
                  <div className="rounded-lg overflow-hidden border border-slate-800 max-h-36">
                    <img
                      src={selectedIncident.image_url}
                      alt="Incident evidence"
                      className="w-full h-36 object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Assigned Resource info */}
            {selectedIncident.assigned_resource && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase block">
                    RECOMMENDED DISPATCH RESOURCE
                  </span>
                  <h4 className="font-bold text-sm text-slate-100">
                    {selectedIncident.assigned_resource.name}
                  </h4>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    Location: {selectedIncident.assigned_resource.location}
                  </p>
                </div>
                <div className="text-right font-mono text-xs">
                  <span className="text-emerald-400 font-bold block">
                    ETA ~ {selectedIncident.assigned_resource.eta_minutes} MIN
                  </span>
                  <span className="text-slate-400">
                    Distance: {selectedIncident.assigned_resource.distance_km} KM
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 glass-panel p-8 rounded-xl flex items-center justify-center text-slate-500 text-xs font-mono">
            Select an incident to inspect details.
          </div>
        )}
      </div>
    </div>
  );
}
