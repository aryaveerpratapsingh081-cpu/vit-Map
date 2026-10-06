'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  AlertTriangle,
  MapPin,
  ListFilter,
  ShieldCheck,
  PlayCircle,
  BarChart3,
  Building2,
  Compass,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Safe Navigator', href: '/navigate', icon: Compass },
  { name: 'Report Emergency', href: '/report', icon: AlertTriangle },
  { name: 'Live Campus Map', href: '/map', icon: MapPin },
  { name: 'Active Incidents', href: '/incidents', icon: ListFilter },
  { name: 'Resources', href: '/resources', icon: ShieldCheck },
  { name: 'Simulation Mode', href: '/simulation', icon: PlayCircle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full md:w-64 bg-navy-950/95 border-r border-cyan-500/10 flex flex-col justify-between p-4 glass-panel">
      <div className="space-y-6">
        <div className="px-3 py-2 text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center space-x-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>VIT Campus Navigation</span>
        </div>

        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || (item.href === '/dashboard' && pathname === '/');

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-500/40 shadow-md shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900/60'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-800/80 px-3">
        <div className="rounded-lg bg-navy-900/60 p-3 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
            <span>TARGET SCOPE</span>
            <span className="text-cyan-400 font-bold">VIT VELLORE</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Academic Emergency Response Prototype & Spatial Triage System
          </p>
        </div>
      </div>
    </aside>
  );
}
