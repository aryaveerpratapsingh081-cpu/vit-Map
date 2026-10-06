'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Activity, Radio, Bell, MapPin, Sparkles } from 'lucide-react';
import { useSentinelStore } from '@/lib/store';
import Link from 'next/link';

export function Header() {
  const { incidents, triggerSimulationScenario } = useSentinelStore();
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeCount = incidents.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = incidents.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 px-4 py-3 bg-navy-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-red-500/20 border border-cyan-400/40 shadow-lg shadow-cyan-500/10">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
                SENTINEL-AI
              </span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                VIT VELLORE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Campus Emergency Response & Spatial Triage System
            </p>
          </div>
        </div>

        {/* Live Status Indicators & Quick Simulation */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          {/* Active Incidents Pills */}
          <div className="hidden md:flex items-center space-x-2 bg-navy-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center text-xs space-x-1">
              <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-slate-400">ACTIVE:</span>
              <span className="font-mono font-bold text-cyan-400">{activeCount}</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center text-xs space-x-1">
              <Radio className="w-4 h-4 text-red-400" />
              <span className="text-slate-400">CRITICAL:</span>
              <span className="font-mono font-bold text-red-400">{criticalCount}</span>
            </div>
          </div>

          {/* Simulation Quick Trigger */}
          <Link
            href="/simulation"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600/80 to-amber-600/80 hover:from-red-500 hover:to-amber-500 text-white text-xs font-semibold shadow-md shadow-red-900/30 transition-all border border-red-400/40"
          >
            <Sparkles className="w-4 h-4 animate-spin text-amber-200" />
            <span className="hidden sm:inline">SIMULATION MODE</span>
            <span className="sm:hidden">SIMULATE</span>
          </Link>

          {/* Clock */}
          <div className="hidden lg:flex flex-col items-end text-xs font-mono text-cyan-300/80">
            <span className="text-[10px] text-slate-400">VIT IST TIME</span>
            <span className="font-bold text-cyan-400">{timeString || '02:59:00'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
