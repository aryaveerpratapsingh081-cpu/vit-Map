'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { CampusIncident, CampusResource } from '@/types';
import { Loader2 } from 'lucide-react';

const TacticalMapInner = dynamic(() => import('./TacticalMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-xl glass-panel flex flex-col items-center justify-center border border-cyan-500/20 text-cyan-400 space-y-2">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      <span className="font-mono text-xs">Initializing VIT Campus Spatial Map...</span>
    </div>
  ),
});

interface TacticalMapProps {
  incidents: CampusIncident[];
  resources: CampusResource[];
  selectedIncident: CampusIncident | null;
  onSelectIncident: (inc: CampusIncident) => void;
}

export function TacticalMap(props: TacticalMapProps) {
  return <TacticalMapInner {...props} />;
}
