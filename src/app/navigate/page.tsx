'use client';

import React, { useState, useEffect } from 'react';
import { useSentinelStore } from '@/lib/store';
import { VIT_CAMPUS_LOCATIONS, getLocationByName } from '@/lib/vit-locations';
import { calculateSafeCampusRoute, NavigationRouteResult } from '@/lib/pathfinding';
import { NavigationMap } from '@/components/navigation/NavigationMap';
import {
  Compass,
  MapPin,
  Navigation,
  AlertTriangle,
  Locate,
  Footprints,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SafeNavigatorPage() {
  const { incidents, triggerSimulationScenario } = useSentinelStore();

  const [startId, setStartId] = useState<string>('main-gate');
  const [destId, setDestId] = useState<string>('sjt-tower');
  const [routeResult, setRouteResult] = useState<NavigationRouteResult | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsNotice, setGpsNotice] = useState<string | null>(null);

  // Recalculate route whenever start, destination, or active incidents change
  useEffect(() => {
    const res = calculateSafeCampusRoute(startId, destId, incidents);
    setRouteResult(res);
  }, [startId, destId, incidents]);

  // GPS Auto-Detection Handler
  const handleDetectGps = () => {
    setIsDetectingGps(true);
    setGpsNotice(null);

    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;

          // Find nearest landmark among VIT campus locations
          let nearestId = VIT_CAMPUS_LOCATIONS[0].id;
          let minDistance = Infinity;

          VIT_CAMPUS_LOCATIONS.forEach((loc) => {
            const dist = Math.hypot(loc.lat - userLat, loc.lng - userLng);
            if (dist < minDistance) {
              minDistance = dist;
              nearestId = loc.id;
            }
          });

          setStartId(nearestId);
          setIsDetectingGps(false);
          const locObj = VIT_CAMPUS_LOCATIONS.find((l) => l.id === nearestId);
          setGpsNotice(`GPS Location detected! Set origin to ${locObj?.name}.`);
        },
        (err) => {
          console.warn('GPS location error:', err);
          setIsDetectingGps(false);
          // Fallback to Main Gate
          setStartId('main-gate');
          setGpsNotice('GPS permission unavailable. Defaulted to VIT Main Gate.');
        }
      );
    } else {
      setIsDetectingGps(false);
      setGpsNotice('Geolocation not supported by browser. Defaulted to VIT Main Gate.');
    }
  };

  const handleSimulateHazard = () => {
    triggerSimulationScenario('waterlogging'); // Triggers waterlogging near Technology Tower
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-4 py-1">
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <Compass className="w-7 h-7 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-mono text-slate-100 uppercase tracking-wider">
              VIT Campus Safe Navigator & Dynamic Hazard Rerouter
            </h1>
            <p className="text-xs text-slate-400">
              Real-time campus navigation engine that detects active hazards (waterlogging, electrical, fire) and dynamically reroutes pedestrians along safe alternative walkways.
            </p>
          </div>
        </div>

        {/* Dynamic Simulation Hazard Toggle */}
        <button
          onClick={handleSimulateHazard}
          className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-300 text-xs font-mono font-bold transition-all shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>SIMULATE ROUTE HAZARD</span>
        </button>
      </div>

      {/* Control Panel: Start & Destination Selection */}
      <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Start Origin Selector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold text-cyan-300 uppercase flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>START ORIGIN (CURRENT LOCATION)</span>
              </label>

              <button
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 border border-cyan-500/30 px-2 py-0.5 rounded bg-navy-950"
              >
                <Locate className="w-3 h-3 text-cyan-400" />
                <span>{isDetectingGps ? 'DETECTING...' : 'DETECT MY GPS'}</span>
              </button>
            </div>

            <select
              value={startId}
              onChange={(e) => setStartId(e.target.value)}
              className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
            >
              {VIT_CAMPUS_LOCATIONS.map((loc) => (
                <option key={`start-${loc.id}`} value={loc.id}>
                  {loc.name} ({loc.category})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-cyan-300 uppercase flex items-center space-x-1">
              <Navigation className="w-3.5 h-3.5 text-red-400" />
              <span>DESTINATION</span>
            </label>

            <select
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
            >
              {VIT_CAMPUS_LOCATIONS.map((loc) => (
                <option key={`dest-${loc.id}`} value={loc.id}>
                  {loc.name} ({loc.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {gpsNotice && (
          <div className="text-[11px] font-mono text-cyan-300 bg-cyan-950/40 p-2 rounded border border-cyan-500/30">
            ℹ️ {gpsNotice}
          </div>
        )}
      </div>

      {/* Dynamic Reroute Alert Banner if Rerouting Occurred */}
      {routeResult?.hasRerouted && (
        <div className="glass-panel p-4 rounded-xl border border-red-500/60 bg-red-950/40 text-red-200 text-xs font-mono flex items-center justify-between radar-ping-critical">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 animate-bounce" />
            <div>
              <span className="font-bold text-amber-300 block uppercase">
                ⚠️ ACTIVE HAZARD DETECTED ON PRIMARY ROUTE!
              </span>
              <span>
                Waterlogging / Hazard reported on normal walkway. SENTINEL-AI has dynamically recalculated a safe alternate path avoiding the hazard zone.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold hidden sm:inline">
            DYNAMIC REROUTE ACTIVE
          </span>
        </div>
      )}

      {/* Main Map & Navigation Steps Grid */}
      {routeResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map (Spans 2 cols) */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
              <span>LIVE REROUTED PATHWAY MAP</span>
              <div className="flex items-center space-x-3 text-cyan-400 font-bold">
                <span>Dist: {routeResult.totalDistanceMeters}m</span>
                <span>Walk Time: ~{routeResult.estimatedMinutes} min</span>
              </div>
            </div>
            <NavigationMap routeResult={routeResult} />
          </div>

          {/* Turn-by-Turn Navigation Steps Panel (Spans 1 col) */}
          <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 flex flex-col h-[520px]">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Footprints className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wider">
                  Turn-by-Turn Directions ({routeResult.steps.length})
                </h3>
              </div>

              {routeResult.hasRerouted ? (
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  SAFE ALTERNATE
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  CLEAR PATH
                </span>
              )}
            </div>

            {/* Steps Scroll View */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1">
              {routeResult.steps.map((step) => (
                <div
                  key={`step-${step.stepIndex}`}
                  className="p-3 rounded-lg bg-navy-900/60 border border-slate-800 space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400 font-bold">
                    <span>STEP 0{step.stepIndex}</span>
                    <span>{step.distanceMeters} meters</span>
                  </div>

                  <p className="text-xs text-slate-200 font-sans leading-snug">
                    {step.instruction}
                  </p>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center space-x-1 pt-1 border-t border-slate-800/60">
                    <ArrowRight className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                    <span className="truncate">{step.pathwayName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
