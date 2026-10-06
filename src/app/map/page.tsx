'use client';

import React from 'react';
import { useSentinelStore } from '@/lib/store';
import { TacticalMap } from '@/components/dashboard/TacticalMap';
import { AIRecommendationPanel } from '@/components/dashboard/AIRecommendationPanel';
import { MapPin } from 'lucide-react';

export default function MapPage() {
  const { incidents, resources, selectedIncident, setSelectedIncident } = useSentinelStore();

  return (
    <div className="space-y-4 py-1">
      <div className="glass-panel px-3 py-2 rounded-lg border border-cyan-500/30 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-cyan-400 font-bold">
          <MapPin className="w-4 h-4 animate-pulse text-cyan-400" />
          <span>VIT VELLORE CAMPUS MAP</span>
        </div>
        <div className="text-slate-400">
          <span>Target: SJT, PRP, Hostels, Messes, Gates</span>
        </div>
      </div>

      <div className="w-full">
        <TacticalMap
          incidents={incidents}
          resources={resources}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
        />
      </div>
    </div>
  );
}
