'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { NavigationRouteResult } from '@/lib/pathfinding';
import { Loader2 } from 'lucide-react';

const NavigationMapInner = dynamic(() => import('./NavigationMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-xl glass-panel flex flex-col items-center justify-center border border-cyan-500/20 text-cyan-400 space-y-2">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      <span className="font-mono text-xs">Computing Safe Campus Route & Hazard Maps...</span>
    </div>
  ),
});

export function NavigationMap({ routeResult }: { routeResult: NavigationRouteResult }) {
  return <NavigationMapInner routeResult={routeResult} />;
}
