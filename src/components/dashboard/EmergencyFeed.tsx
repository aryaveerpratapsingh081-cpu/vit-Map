'use client';

import React, { useState } from 'react';
import { CampusIncident, IncidentStatus, PriorityLevel } from '@/types';
import { PriorityBadge, StatusBadge } from './PriorityBadge';
import { Search, MapPin, Clock, ArrowRight, UserCheck } from 'lucide-react';
import { useSentinelStore } from '@/lib/store';

interface EmergencyFeedProps {
  incidents: CampusIncident[];
  selectedIncident: CampusIncident | null;
  onSelectIncident: (inc: CampusIncident) => void;
}

const STATUS_ORDER: IncidentStatus[] = [
  'REPORTED',
  'AI ANALYZED',
  'PRIORITIZED',
  'RESPONSE ASSIGNED',
  'IN PROGRESS',
  'RESOLVED',
];

export function EmergencyFeed({
  incidents,
  selectedIncident,
  onSelectIncident,
}: EmergencyFeedProps) {
  const { updateIncidentStatus } = useSentinelStore();
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIncidents = incidents.filter((inc) => {
    const matchesPriority =
      filterPriority === 'ALL' || inc.priority === filterPriority;
    const matchesSearch =
      inc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.campus_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPriority && matchesSearch;
  });

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 flex flex-col h-[520px]">
      {/* Header & Controls */}
      <div className="space-y-3 pb-3 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="font-bold text-sm text-slate-100 uppercase tracking-wider font-mono">
              Live Incident Feed ({filteredIncidents.length})
            </h3>
          </div>

          {/* Priority Filters */}
          <div className="flex items-center space-x-1 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterPriority(level)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  filterPriority === level
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'bg-navy-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search VIT location, type, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-navy-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Scrollable Incident List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
        {filteredIncidents.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8">
            <p>No active incidents found for selected criteria.</p>
          </div>
        ) : (
          filteredIncidents.map((inc) => {
            const isSelected = selectedIncident?.id === inc.id;
            return (
              <div
                key={inc.id}
                onClick={() => onSelectIncident(inc)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-navy-850 border-cyan-400/80 shadow-lg shadow-cyan-950/50'
                    : 'bg-navy-900/50 border-slate-800/80 hover:border-cyan-500/40 hover:bg-navy-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <PriorityBadge priority={inc.priority} />
                    <span className="font-bold text-xs text-slate-200">
                      {inc.category}
                    </span>
                  </div>
                  <StatusBadge status={inc.status} />
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 mb-2 font-sans">
                  {inc.description}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1.5 border-t border-slate-800/60">
                  <div className="flex items-center space-x-1 text-cyan-400">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate max-w-[140px]">
                      {inc.campus_location}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {new Date(inc.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Status Progression Controls (for authorized campus staff) */}
                <div className="mt-2 pt-2 border-t border-slate-800/40 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">
                    Update Status:
                  </span>
                  <select
                    value={inc.status}
                    onChange={(e) => {
                      e.stopPropagation();
                      updateIncidentStatus(inc.id, e.target.value as IncidentStatus);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-navy-950 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 rounded px-1.5 py-0.5 focus:outline-none"
                  >
                    {STATUS_ORDER.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
