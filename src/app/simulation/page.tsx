'use client';

import React, { useState } from 'react';
import { useSentinelStore } from '@/lib/store';
import { CampusIncident } from '@/types';
import { PriorityBadge, StatusBadge } from '@/components/dashboard/PriorityBadge';
import { TacticalMap } from '@/components/dashboard/TacticalMap';
import {
  Sparkles,
  Flame,
  Stethoscope,
  CloudRain,
  Zap,
  Car,
  PlayCircle,
  Navigation,
  CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SimulationModePage() {
  const {
    incidents,
    resources,
    selectedIncident,
    setSelectedIncident,
    triggerSimulationScenario,
    updateIncidentStatus,
  } = useSentinelStore();

  const [activeSimulation, setActiveSimulation] = useState<CampusIncident | null>(selectedIncident);

  const handleSimulate = (scenarioType: string) => {
    const newInc = triggerSimulationScenario(scenarioType);
    setActiveSimulation(newInc);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  return (
    <div className="space-y-5 py-1">
      {/* Banner */}
      <div className="glass-panel p-5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-navy-900 to-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-amber-950 border border-amber-500/50 text-amber-400">
            <PlayCircle className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-slate-100 uppercase tracking-wider">
              Academic Demonstration Simulation Mode
            </h1>
            <p className="text-xs text-slate-400">
              One-click simulation trigger engine to demonstrate AI triage, priority scoring, and nearest resource routing for VIT Vellore campus evaluation.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-mono bg-amber-950 text-amber-300 border border-amber-500/40">
          DEMO MODE ACTIVE
        </span>
      </div>

      {/* Simulation Trigger Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => handleSimulate('medical')}
          className="glass-panel p-4 rounded-xl border border-red-500/40 hover:border-red-400 bg-red-950/30 hover:bg-red-950/60 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <Stethoscope className="w-6 h-6 text-red-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono font-bold text-red-300">LEVEL 5</span>
          </div>
          <h3 className="font-bold text-xs text-slate-100 uppercase font-mono">
            Medical Emergency
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Hostel Block D</p>
        </button>

        <button
          onClick={() => handleSimulate('fire')}
          className="glass-panel p-4 rounded-xl border border-amber-500/40 hover:border-amber-400 bg-amber-950/30 hover:bg-amber-950/60 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono font-bold text-amber-300">LEVEL 5</span>
          </div>
          <h3 className="font-bold text-xs text-slate-100 uppercase font-mono">
            Fire Outbreak
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Technology Tower (TT)</p>
        </button>

        <button
          onClick={() => handleSimulate('waterlogging')}
          className="glass-panel p-4 rounded-xl border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/30 hover:bg-cyan-950/60 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <CloudRain className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono font-bold text-cyan-300">LEVEL 3</span>
          </div>
          <h3 className="font-bold text-xs text-slate-100 uppercase font-mono">
            Waterlogging
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Main Building Plaza</p>
        </button>

        <button
          onClick={() => handleSimulate('electrical')}
          className="glass-panel p-4 rounded-xl border border-yellow-500/40 hover:border-yellow-400 bg-yellow-950/30 hover:bg-yellow-950/60 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <Zap className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono font-bold text-yellow-300">LEVEL 4</span>
          </div>
          <h3 className="font-bold text-xs text-slate-100 uppercase font-mono">
            Electrical Hazard
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Silver Jubilee Tower (SJT)</p>
        </button>

        <button
          onClick={() => handleSimulate('accident')}
          className="glass-panel p-4 rounded-xl border border-purple-500/40 hover:border-purple-400 bg-purple-950/30 hover:bg-purple-950/60 transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <Car className="w-6 h-6 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] font-mono font-bold text-purple-300">LEVEL 4</span>
          </div>
          <h3 className="font-bold text-xs text-slate-100 uppercase font-mono">
            Road Accident
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">VIT Main Gate HQ</p>
        </button>
      </div>

      {/* Simulated Incident Live Breakdown */}
      {activeSimulation && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
          {/* Spatial Map */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
              <span>LIVE SPATIAL ROUTE OVERLAY</span>
              <span>RESOURCE → INCIDENT PATH</span>
            </div>
            <TacticalMap
              incidents={incidents}
              resources={resources}
              selectedIncident={activeSimulation}
              onSelectIncident={setSelectedIncident}
            />
          </div>

          {/* AI Simulation Results Panel */}
          <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 space-y-4 bg-navy-950">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-cyan-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span>SIMULATION OUTPUT</span>
              </span>
              <PriorityBadge priority={activeSimulation.priority} />
            </div>

            <div>
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                INCIDENT TYPE & LOCATION
              </span>
              <h3 className="font-bold text-base text-slate-100">
                {activeSimulation.category}
              </h3>
              <p className="text-xs text-cyan-300 font-mono mt-0.5">
                📍 {activeSimulation.campus_location}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-navy-900 border border-slate-800 space-y-1 text-xs">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                AI SEVERITY & TRIAGE ASSESSMENT
              </span>
              <div className="flex items-center justify-between text-slate-200 font-mono">
                <span>Severity Score:</span>
                <span className="font-bold text-amber-400">
                  {activeSimulation.severity} / 5
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-200 font-mono">
                <span>Assigned Dept:</span>
                <span className="font-bold text-emerald-400 text-right">
                  {activeSimulation.assigned_department}
                </span>
              </div>
            </div>

            {/* Recommended Action steps */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">
                AI RECOMMENDED ACTIONS:
              </span>
              <ul className="space-y-1 pl-1">
                {activeSimulation.recommended_actions.map((act, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-300 flex items-start space-x-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resource Dispatch info */}
            {activeSimulation.assigned_resource && (
              <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono space-y-1">
                <span className="text-[10px] font-bold text-cyan-300 flex items-center space-x-1">
                  <Navigation className="w-3 h-3 text-cyan-400" />
                  <span>RECOMMENDED RESOURCE DISPATCH</span>
                </span>
                <p className="font-bold text-slate-100">
                  {activeSimulation.assigned_resource.name}
                </p>
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Dist: {activeSimulation.assigned_resource.distance_km} KM</span>
                  <span className="text-emerald-400 font-bold">
                    ETA: ~{activeSimulation.assigned_resource.eta_minutes} MIN
                  </span>
                </div>
              </div>
            )}

            {/* Interactive Status Timeline button */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                ADVANCE SIMULATED STATUS:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateIncidentStatus(activeSimulation.id, 'IN PROGRESS')}
                  className="py-1.5 px-2 rounded bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-xs font-mono text-indigo-300"
                >
                  SET IN PROGRESS
                </button>
                <button
                  onClick={() => updateIncidentStatus(activeSimulation.id, 'RESOLVED')}
                  className="py-1.5 px-2 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/40 text-xs font-mono text-emerald-300"
                >
                  MARK RESOLVED
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
