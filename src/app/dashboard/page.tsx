'use client';

import React from 'react';
import { useSentinelStore } from '@/lib/store';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { TacticalMap } from '@/components/dashboard/TacticalMap';
import { EmergencyFeed } from '@/components/dashboard/EmergencyFeed';
import { AIRecommendationPanel } from '@/components/dashboard/AIRecommendationPanel';
import { Radio, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  const { incidents, resources, selectedIncident, setSelectedIncident } =
    useSentinelStore();

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950">
        <div>
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h1 className="text-lg font-extrabold tracking-wider font-mono text-slate-100 uppercase">
              VIT Campus Emergency Command Dashboard
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time emergency monitoring, Gemini AI triage, and spatial resource dispatch for VIT Vellore.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono bg-navy-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-slate-400">SYSTEM STATUS:</span>
          <span className="text-emerald-400 font-bold">OPERATIONAL</span>
        </div>
      </div>

      {/* KPI Stats */}
      <QuickStats />

      {/* Map & Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Leaflet Map (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
            <span>LIVE SPATIAL MAP (VIT CAMPUS)</span>
            {selectedIncident && (
              <span className="text-cyan-400 truncate max-w-xs">
                SELECTED: {selectedIncident.category} @ {selectedIncident.campus_location}
              </span>
            )}
          </div>
          <TacticalMap
            incidents={incidents}
            resources={resources}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />
        </div>

        {/* Live Feed (Spans 1 column) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
            <span>RECENT INCIDENTS</span>
            <span>CLICK TO VIEW AI TRIAGE</span>
          </div>
          <EmergencyFeed
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />
        </div>
      </div>

      {/* Bottom AI Recommendation Panel */}
      <div className="pt-2">
        <AIRecommendationPanel incident={selectedIncident} />
      </div>
    </div>
  );
}
