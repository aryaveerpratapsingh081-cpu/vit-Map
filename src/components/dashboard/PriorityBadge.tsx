import React from 'react';
import { PriorityLevel, IncidentStatus } from '@/types';

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  let styles = 'bg-gray-800 text-gray-300 border-gray-600';

  if (priority === 'CRITICAL') {
    styles = 'bg-red-950/80 text-red-400 border-red-500/50 radar-ping-critical';
  } else if (priority === 'HIGH') {
    styles = 'bg-amber-950/80 text-amber-400 border-amber-500/50';
  } else if (priority === 'MEDIUM') {
    styles = 'bg-blue-950/80 text-cyan-400 border-cyan-500/50';
  } else if (priority === 'LOW') {
    styles = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase border ${styles}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: IncidentStatus }) {
  let styles = 'bg-slate-800 text-slate-300 border-slate-700';

  switch (status) {
    case 'REPORTED':
      styles = 'bg-amber-950/60 text-amber-300 border-amber-500/40';
      break;
    case 'AI ANALYZED':
      styles = 'bg-purple-950/60 text-purple-300 border-purple-500/40';
      break;
    case 'PRIORITIZED':
      styles = 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40';
      break;
    case 'RESPONSE ASSIGNED':
      styles = 'bg-blue-950/60 text-blue-300 border-blue-500/40';
      break;
    case 'IN PROGRESS':
      styles = 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40 animate-pulse';
      break;
    case 'RESOLVED':
      styles = 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${styles}`}>
      {status}
    </span>
  );
}
