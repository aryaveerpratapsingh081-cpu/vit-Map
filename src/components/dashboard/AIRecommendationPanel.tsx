'use client';

import React from 'react';
import { CampusIncident } from '@/types';
import { PriorityBadge, StatusBadge } from './PriorityBadge';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Navigation,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

export function AIRecommendationPanel({
  incident,
}: {
  incident: CampusIncident | null;
}) {
  if (!incident) {
    return (
      <div className="glass-panel p-6 rounded-xl border border-cyan-500/20 flex flex-col items-center justify-center text-center text-slate-500 min-h-[300px]">
        <Sparkles className="w-8 h-8 text-cyan-500/50 mb-2 animate-spin" />
        <p className="text-xs font-mono">Select an active emergency incident from the map or feed to view Gemini AI Triage & Dispatch Plan.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-100 font-mono uppercase tracking-wider">
              AI Triage & Spatial Recommendation
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">
              CONFIDENCE SCORE: {(incident.confidence * 100).toFixed(0)}% (Validated with Zod)
            </span>
          </div>
        </div>

        <PriorityBadge priority={incident.priority} />
      </div>

      {/* Basic Incident Metadata Summary */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-navy-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">INCIDENT CATEGORY</span>
          <span className="font-bold text-cyan-300">{incident.category}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-navy-950/70 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase block">SEVERITY LEVEL</span>
          <span className="font-bold text-amber-400">LEVEL {incident.severity} / 5</span>
        </div>
        <div className="p-2.5 rounded-lg bg-navy-950/70 border border-slate-800 col-span-2">
          <span className="text-[10px] text-slate-400 uppercase block">RECOMMENDED DEPARTMENT</span>
          <span className="font-bold text-emerald-300">{incident.assigned_department}</span>
        </div>
      </div>

      {/* Immediate Risks */}
      <div>
        <h4 className="text-xs font-mono font-semibold text-red-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Immediate Campus Risks</span>
        </h4>
        <ul className="space-y-1 pl-1">
          {incident.immediate_risks.map((risk, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
              <span className="text-red-500 font-bold">•</span>
              <span>{risk}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Response Actions */}
      <div>
        <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Suggested Action Plan</span>
        </h4>
        <ul className="space-y-1 pl-1">
          {incident.recommended_actions.map((action, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
              <span className="text-cyan-400 font-bold">{idx + 1}.</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Nearest Response Team Recommendation */}
      {incident.assigned_resource ? (
        <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/40 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase flex items-center space-x-1">
              <Navigation className="w-3 h-3 text-cyan-400 animate-spin" />
              <span>NEAREST AVAILABLE RESPONSE TEAM</span>
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              ETA ~ {incident.assigned_resource.eta_minutes} MIN
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-100">{incident.assigned_resource.name}</span>
            <span className="text-slate-400 font-mono">
              Distance: {incident.assigned_resource.distance_km} KM
            </span>
          </div>

          <div className="text-[11px] text-slate-300 font-mono">
            Stationed at: {incident.assigned_resource.location}
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
          No automated resource assigned yet.
        </div>
      )}
    </div>
  );
}
