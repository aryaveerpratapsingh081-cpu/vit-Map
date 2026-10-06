'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CampusIncident, CampusResource } from '@/types';
import {
  VIT_CAMPUS_CENTER,
  VIT_CAMPUS_LOCATIONS,
  VIT_NORTH_CAMPUS_POLYGON,
  VIT_SOUTH_CAMPUS_POLYGON,
  VIT_OUTSIDE_MASK_POLYGON,
} from '@/lib/vit-locations';

// ─── Map Recenter Helper ───
function MapController({ selectedIncident }: { selectedIncident: CampusIncident | null }) {
  const map = useMap();
  useEffect(() => {
    if (selectedIncident?.lat && selectedIncident?.lng) {
      map.flyTo([selectedIncident.lat, selectedIncident.lng], 18, { duration: 1.2 });
    }
  }, [selectedIncident, map]);
  return null;
}

// ─── Landmark Marker Icon with Text Label under point (matching Picture 2) ───
const CAT_COLORS: Record<string, string> = {
  Medical: '#ff4d6d',
  Security: '#f87171',
  Academic: '#818cf8',
  Administrative: '#fb923c',
  Facility: '#34d399',
  Hostel: '#60a5fa',
  Sports: '#4ade80',
};

function landmarkWithLabelIcon(name: string, category: string) {
  const color = CAT_COLORS[category] || '#38bdf8';
  return L.divIcon({
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;">
        <div style="
          width:10px;height:10px;border-radius:50%;
          background:${color};
          border:1.5px solid #ffffff;
          box-shadow:0 0 6px ${color};
        "></div>
        <span style="
          margin-top:2px;
          padding:1px 5px;
          border-radius:4px;
          background:rgba(7,20,40,0.85);
          color:#f1f5f9;
          font-size:9.5px;
          font-weight:600;
          font-family:system-ui,sans-serif;
          white-space:nowrap;
          border:1px solid rgba(255,255,255,0.15);
          box-shadow:0 2px 6px rgba(0,0,0,0.6);
          backdrop-filter:blur(4px);
        ">${name}</span>
      </div>
    `,
    className: '',
    iconSize: [80, 30],
    iconAnchor: [40, 5],
  });
}

// ─── Incident Marker Icon ───
function incidentIcon(priority: string, isSelected: boolean) {
  const color = priority === 'CRITICAL' ? '#ef4444' : priority === 'HIGH' ? '#f97316' : '#38bdf8';
  const size = isSelected ? 34 : 24;
  return L.divIcon({
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color}35;border:2px solid ${color};
        box-shadow:0 0 ${isSelected ? 16 : 8}px ${color};
        display:flex;align-items:center;justify-content:center;
      ">
        <div style="width:${size * 0.4}px;height:${size * 0.4}px;border-radius:50%;background:${color}"></div>
      </div>
    `,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// ─── Resource Marker Icon ───
function resourceIcon() {
  return L.divIcon({
    html: `
      <div style="
        width:20px;height:20px;border-radius:6px;
        background:#052e16;border:1.5px solid #10b981;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 0 6px #10b981;
      ">
        <div style="width:7px;height:7px;border-radius:50%;background:#34d399"></div>
      </div>
    `,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

// ─── Tile URLs ───
const TILES = {
  // Dark basemap with roads & buildings
  map: 'https://{s}.basemaps.cartocdn.com/dark_matter/{z}/{x}/{y}{r}.png',
  // High-res satellite imagery from Esri (matches Picture 2)
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

interface FullscreenMapProps {
  incidents: CampusIncident[];
  resources: CampusResource[];
  selectedIncident: CampusIncident | null;
  onSelectIncident: (inc: CampusIncident) => void;
  mapMode: 'map' | 'satellite';
  activeCategories: string[];
}

export default function FullscreenMap({
  incidents,
  resources,
  selectedIncident,
  onSelectIncident,
  mapMode,
}: FullscreenMapProps) {
  // Route polyline from assigned resource to selected incident
  let routeCoords: [number, number][] = [];
  if (selectedIncident?.assigned_resource) {
    const res = resources.find((r) => r.id === selectedIncident.assigned_resource?.id);
    if (res) routeCoords = [[res.lat, res.lng], [selectedIncident.lat, selectedIncident.lng]];
  }

  const tileUrl = TILES[mapMode];
  const attribution =
    mapMode === 'satellite'
      ? '&copy; OpenStreetMap &copy; Esri'
      : '&copy; OpenStreetMap &copy; CARTO';

  return (
    <MapContainer
      center={[VIT_CAMPUS_CENTER.lat, VIT_CAMPUS_CENTER.lng]}
      zoom={VIT_CAMPUS_CENTER.zoom}
      minZoom={15}
      maxZoom={19}
      maxBounds={[
        [12.955, 79.140],
        [12.985, 79.175],
      ]}
      maxBoundsViscosity={1.0}
      scrollWheelZoom
      zoomControl={false}
      style={{ width: '100%', height: '100%', background: '#000000' }}
    >
      <MapController selectedIncident={selectedIncident} />

      {/* Satellite or Dark Map Tile Layer */}
      <TileLayer url={tileUrl} attribution={attribution} maxZoom={19} />

      {/* ── BLACKOUT MASK OUTSIDE VIT CAMPUS ── */}
      <Polygon
        positions={VIT_OUTSIDE_MASK_POLYGON}
        pathOptions={{
          color: 'transparent',
          fillColor: '#000005',
          fillOpacity: 0.96,
          weight: 0,
          interactive: false,
        }}
      />

      {/* ── NORTH CAMPUS BLUE OUTLINE BORDER ── */}
      <Polygon
        positions={VIT_NORTH_CAMPUS_POLYGON}
        pathOptions={{
          color: '#3b82f6',
          weight: 2.5,
          fillOpacity: 0,
          opacity: 0.95,
          interactive: false,
        }}
      />

      {/* ── SOUTH CAMPUS BLUE OUTLINE BORDER ── */}
      <Polygon
        positions={VIT_SOUTH_CAMPUS_POLYGON}
        pathOptions={{
          color: '#3b82f6',
          weight: 2.5,
          fillOpacity: 0,
          opacity: 0.95,
          interactive: false,
        }}
      />

      {/* ── CAMPUS LANDMARKS WITH LABELS UNDERNEATH (Picture 2 style) ── */}
      {VIT_CAMPUS_LOCATIONS.map((loc) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={landmarkWithLabelIcon(loc.name, loc.category)}
        >
          <Popup>
            <div style={{ minWidth: 160, background: '#071428', color: '#f1f5f9', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(59,130,246,0.3)' }}>
              <span style={{ fontSize: 10, color: CAT_COLORS[loc.category] || '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 4 }}>{loc.category}</span>
              <h4 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700 }}>{loc.name}</h4>
              <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{loc.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* ── AVAILABLE RESPONDER RESOURCES ── */}
      {resources.map((res) => (
        <Marker key={res.id} position={[res.lat, res.lng]} icon={resourceIcon()}>
          <Popup>
            <div style={{ minWidth: 160, background: '#071428', color: '#f1f5f9', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.3)' }}>
              <span style={{ fontSize: 10, color: '#34d399', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 4 }}>RESOURCE • {res.availability_status}</span>
              <h4 style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700 }}>{res.name}</h4>
              <p style={{ margin: '0 0 4px', fontSize: 11, color: '#94a3b8' }}>{res.location}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#34d399', fontFamily: 'monospace' }}>📞 {res.phone}</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* ── EMERGENCY ROUTE LINE ── */}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} pathOptions={{ color: '#00f0ff', weight: 4, dashArray: '8,8', opacity: 0.9 }} />
      )}

      {/* ── INCIDENT EMERGENCY MARKERS ── */}
      {incidents.map((inc) => {
        const isSelected = selectedIncident?.id === inc.id;
        return (
          <Marker
            key={inc.id}
            position={[inc.lat, inc.lng]}
            icon={incidentIcon(inc.priority, isSelected)}
            eventHandlers={{ click: () => onSelectIncident(inc) }}
            zIndexOffset={isSelected ? 1000 : 0}
          >
            <Popup>
              <div style={{ minWidth: 200, maxWidth: 240, background: '#071428', color: '#f1f5f9', padding: '12px', borderRadius: '10px', border: `1px solid ${inc.priority === 'CRITICAL' ? '#ef4444' : inc.priority === 'HIGH' ? '#f97316' : '#38bdf8'}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 10, color: inc.priority === 'CRITICAL' ? '#ef4444' : inc.priority === 'HIGH' ? '#f97316' : '#38bdf8', fontWeight: 700, textTransform: 'uppercase', background: inc.priority === 'CRITICAL' ? '#7f1d1d50' : inc.priority === 'HIGH' ? '#43140750' : '#0c4a6e50', padding: '2px 8px', borderRadius: 4 }}>{inc.priority}</span>
                  <span style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>{inc.status}</span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: 13, fontWeight: 700 }}>{inc.category}</h4>
                <p style={{ margin: '0 0 8px', fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>{inc.description}</p>
                <p style={{ margin: '0 0 10px', fontSize: 11, color: '#38bdf8', fontFamily: 'monospace' }}>📍 {inc.campus_location}</p>
                <button
                  onClick={() => onSelectIncident(inc)}
                  style={{ width: '100%', padding: '6px', background: 'linear-gradient(135deg, #0e7490, #1d4ed8)', border: 'none', borderRadius: 6, color: 'white', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                >
                  View AI Triage & Route →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
