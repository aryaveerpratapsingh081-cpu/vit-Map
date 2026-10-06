'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Search, MapPin, Navigation, Layers, Sun, Moon, AlertTriangle, FileText, BarChart2, Zap } from 'lucide-react';
import { useSentinelStore } from '@/lib/store';

const FullscreenMap = dynamic(() => import('@/components/map/FullscreenMap'), { ssr: false });

const CATEGORIES = [
  { label: 'Hostels', color: '#60a5fa' },
  { label: 'Stores & canteens', color: '#34d399' },
  { label: 'Bike parking', color: '#a78bfa' },
  { label: 'Academic & admin', color: '#fb923c' },
  { label: 'Sports', color: '#4ade80' },
  { label: 'PRP classrooms', color: '#f472b6' },
  { label: 'Shops', color: '#facc15' },
  { label: 'Gates', color: '#f87171' },
  { label: 'ATMs & banks', color: '#38bdf8' },
  { label: 'Messes', color: '#a3e635' },
  { label: 'Car parking', color: '#94a3b8' },
  { label: 'Printing', color: '#e879f9' },
  { label: 'Parks & grounds', color: '#2dd4bf' },
  { label: 'Laundry', color: '#fb7185' },
  { label: 'Health', color: '#ff4d6d' },
  { label: 'Lecture halls', color: '#818cf8' },
  { label: 'Offices', color: '#64748b' },
  { label: 'Toilets', color: '#475569' },
  { label: 'Vending', color: '#fbbf24' },
  { label: 'Shuttle', color: '#6ee7b7' },
];

export default function Home() {
  const { incidents, resources, selectedIncident, setSelectedIncident } = useSentinelStore();
  const [activeCategories, setActiveCategories] = useState<string[]>(['Messes', 'Gates']);
  const [mapMode, setMapMode] = useState<'map' | 'satellite'>('satellite');
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleCategory = (label: string) => {
    setActiveCategories((prev) =>
      prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
    );
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black text-slate-100 antialiased">
      {/* ─── FULLSCREEN MAP (Centered on VIT Campus) ─── */}
      <div className="absolute inset-0 z-0">
        <FullscreenMap
          incidents={incidents}
          resources={resources}
          selectedIncident={selectedIncident}
          onSelectIncident={setSelectedIncident}
          mapMode={mapMode}
          activeCategories={activeCategories}
        />
      </div>

      {/* ─── TOP BAR ─── */}
      <header
        id="vit-topbar"
        className="absolute top-0 left-0 right-0 z-[1000] flex items-center gap-2 px-3.5 py-2.5 bg-navy-950/90 backdrop-blur-xl border-b border-cyan-500/10 shadow-lg shadow-black/50"
      >
        {/* Brand */}
        <button
          id="brand-btn"
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-white/5 transition-all shrink-0 border border-white/5"
          title="VIT Campus Map"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-blue-600 flex items-center justify-center shadow-md shadow-amber-500/20">
            <MapPin className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-white text-sm tracking-wider hidden sm:inline">VIT Map</span>
        </button>

        {/* Search */}
        <div className="flex-1 relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="campus-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search SJT, PRP 327, Gate 11, mess…"
            className="w-full pl-10 pr-12 py-2 rounded-xl text-sm bg-white/5 border border-white/10 text-slate-100 placeholder:text-slate-500 outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all shadow-inner"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 hidden sm:inline-block">⌘K</kbd>
        </div>

        {/* Quick Jump Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="go-mess"
            onClick={() => toggleCategory('Messes')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              activeCategories.includes('Messes')
                ? 'bg-lime-400 text-black border-lime-300 shadow-lime-400/20'
                : 'text-slate-300 border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            Mess
          </button>
          <button
            id="go-prp"
            onClick={() => toggleCategory('PRP classrooms')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              activeCategories.includes('PRP classrooms')
                ? 'bg-pink-400 text-black border-pink-300 shadow-pink-400/20'
                : 'text-slate-300 border-white/10 bg-white/5 hover:bg-white/10'
            }`}
          >
            PRP
          </button>
        </div>

        {/* Map / Satellite Toggle */}
        <div className="flex rounded-xl overflow-hidden border border-white/10 shrink-0 text-xs font-bold bg-white/5 p-0.5">
          <button
            id="map-btn"
            onClick={() => setMapMode('map')}
            className={`px-3 py-1 rounded-lg transition-all ${
              mapMode === 'map' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Map
          </button>
          <button
            id="sat-btn"
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1 rounded-lg transition-all ${
              mapMode === 'satellite' ? 'bg-amber-400 text-black shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
        </div>

        {/* Emergency Panel Drawer Toggle */}
        <button
          id="layers-btn"
          onClick={() => setShowSidebar((v) => !v)}
          className="p-2 rounded-xl border border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 transition-all shrink-0"
          title="Emergency Control Center"
        >
          <Layers className="w-4 h-4 text-cyan-400" />
        </button>

        {/* Theme Toggle */}
        <button
          id="theme-btn"
          onClick={() => setDarkMode((v) => !v)}
          className="p-2 rounded-xl border border-white/10 text-slate-300 bg-white/5 hover:bg-white/10 transition-all shrink-0"
          title="Toggle theme"
        >
          {darkMode ? <Moon className="w-4 h-4 text-amber-300" /> : <Sun className="w-4 h-4 text-amber-400" />}
        </button>
      </header>

      {/* ─── SIDEBAR DRAWER ─── */}
      <div
        className={`absolute top-0 right-0 bottom-0 z-[1100] w-80 bg-navy-950/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-2xl transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-navy-900/60">
          <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">Emergency Control Center</span>
          <button onClick={() => setShowSidebar(false)} className="text-slate-400 hover:text-white text-lg font-bold">✕</button>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 53px)' }}>
          {/* Active Incidents Badge */}
          <div className="rounded-2xl p-4 border border-red-500/30 bg-red-950/40 shadow-lg shadow-red-950/20">
            <p className="text-xs text-red-400 font-mono font-bold uppercase tracking-wider">Active Emergency Incidents</p>
            <p className="text-3xl font-extrabold text-red-300 mt-1">
              {incidents.filter((i) => i.status !== 'RESOLVED').length}
            </p>
          </div>

          {/* Resources Available Badge */}
          <div className="rounded-2xl p-4 border border-cyan-500/30 bg-cyan-950/40 shadow-lg shadow-cyan-950/20">
            <p className="text-xs text-cyan-400 font-mono font-bold uppercase tracking-wider">Available Responders</p>
            <p className="text-3xl font-extrabold text-cyan-300 mt-1">
              {resources.filter((r) => r.availability_status === 'AVAILABLE').length}
            </p>
          </div>

          {/* Recent Alerts List */}
          <div className="rounded-2xl p-3 border border-white/10 bg-white/5">
            <p className="text-xs text-slate-400 font-mono font-bold uppercase tracking-wider mb-2.5 px-1">Recent Incidents</p>
            <div className="space-y-1.5">
              {incidents.slice(0, 5).map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => { setSelectedIncident(inc); setShowSidebar(false); }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-all border border-white/5 group"
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${inc.priority === 'CRITICAL' ? 'bg-red-500 shadow-sm shadow-red-500' : inc.priority === 'HIGH' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                    <span className="text-xs text-slate-200 font-semibold group-hover:text-cyan-300 transition-colors truncate">{inc.category}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 pl-4 truncate">{inc.campus_location}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Internal Navigation Links */}
          <div className="space-y-1.5 pt-1">
            <Link href="/navigate" className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300 border border-white/5">
              <Navigation className="w-4 h-4 text-cyan-400" /> Safe Campus Route
            </Link>
            <Link href="/report" className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-red-500/10 hover:text-red-300 border border-white/5">
              <AlertTriangle className="w-4 h-4 text-red-400" /> Report Emergency
            </Link>
            <Link href="/incidents" className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-amber-500/10 hover:text-amber-300 border border-white/5">
              <FileText className="w-4 h-4 text-amber-400" /> Incident Log
            </Link>
            <Link href="/analytics" className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-purple-500/10 hover:text-purple-300 border border-white/5">
              <BarChart2 className="w-4 h-4 text-purple-400" /> Spatial Analytics
            </Link>
            <Link href="/simulation" className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-yellow-500/10 hover:text-yellow-300 border border-white/5">
              <Zap className="w-4 h-4 text-yellow-400" /> AI Simulation
            </Link>
          </div>
        </div>
      </div>

      {/* ─── BOTTOM DOCK ─── */}
      <div
        id="bottom-dock"
        className="absolute bottom-0 left-0 right-0 z-[1000] px-3.5 py-2.5 bg-navy-950/90 backdrop-blur-xl border-t border-cyan-500/10 shadow-2xl"
      >
        <div id="layer-chips" className="flex flex-wrap gap-1.5 mb-2">
          {CATEGORIES.map((cat) => {
            const active = activeCategories.includes(cat.label);
            return (
              <button
                key={cat.label}
                onClick={() => toggleCategory(cat.label)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border"
                style={{
                  borderColor: active ? cat.color : 'rgba(255,255,255,0.10)',
                  color: active ? cat.color : '#94a3b8',
                  background: active ? `${cat.color}15` : 'rgba(255,255,255,0.03)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cat.color }} />
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1.5 border-t border-white/5">
          <a
            href="https://www.openstreetmap.org/relation/15931944"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors font-semibold"
          >
            VIT Vellore Campus Map
          </a>
          <span>Built with Next.js 14 & Tailwind CSS</span>
        </div>
      </div>
    </div>
  );
}
