'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { CampusIncident, CampusResource } from '@/types';
import { VIT_CAMPUS_CENTER, VIT_CAMPUS_LOCATIONS, VIT_BOUNDARY_POLYGON, VIT_OUTSIDE_MASK_POLYGON } from '@/lib/vit-locations';
import { PriorityBadge, StatusBadge } from './PriorityBadge';

// Helper component to center map on selected incident
function MapController({ selectedIncident }: { selectedIncident: CampusIncident | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedIncident && selectedIncident.lat && selectedIncident.lng) {
      map.flyTo([selectedIncident.lat, selectedIncident.lng], 18, {
        duration: 1.2,
      });
    }
  }, [selectedIncident, map]);

  return null;
}

// Custom Leaflet Marker Icons Generator
function createCustomMarkerIcon(category: string, priority: string, isSelected: boolean) {
  let color = '#29b6f6';
  let pulseClass = '';

  if (priority === 'CRITICAL') {
    color = '#ff3366';
    pulseClass = 'radar-ping-critical';
  } else if (priority === 'HIGH') {
    color = '#ff9900';
  } else if (category.includes('Medical')) {
    color = '#ff3366';
  } else if (category.includes('Waterlogging')) {
    color = '#00f0ff';
  } else if (category.includes('Electrical')) {
    color = '#ffcc00';
  }

  const borderStyle = isSelected ? 'border-2 border-white scale-125 z-50' : 'border border-cyan-400/50';

  const html = `
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full shadow-lg ${borderStyle} ${pulseClass}" style="background-color: ${color}22; border-color: ${color};">
      <div class="w-3.5 h-3.5 rounded-full" style="background-color: ${color}; box-shadow: 0 0 10px ${color};"></div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}

// Resource Marker Icon
function createResourceMarkerIcon(type: string) {
  let color = '#10b981'; // green available
  const html = `
    <div class="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-950/90 border border-emerald-500 shadow-md">
      <div class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-resource-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

// VIT Landmark Marker Icon
function createLandmarkMarkerIcon() {
  const html = `
    <div class="flex items-center justify-center w-5 h-5 rounded-full bg-slate-800/80 border border-slate-600">
      <div class="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-landmark-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
}

interface TacticalMapInnerProps {
  incidents: CampusIncident[];
  resources: CampusResource[];
  selectedIncident: CampusIncident | null;
  onSelectIncident: (inc: CampusIncident) => void;
}

export default function TacticalMapInner({
  incidents,
  resources,
  selectedIncident,
  onSelectIncident,
}: TacticalMapInnerProps) {
  // Determine polyline route if selected incident has assigned resource
  let routeCoords: [number, number][] = [];
  if (selectedIncident && selectedIncident.assigned_resource) {
    const res = resources.find((r) => r.id === selectedIncident.assigned_resource?.id);
    if (res) {
      routeCoords = [
        [res.lat, res.lng],
        [selectedIncident.lat, selectedIncident.lng],
      ];
    }
  }

  return (
    <div className="relative w-full h-[780px] rounded-xl overflow-hidden border border-cyan-500/20 shadow-2xl">
      <MapContainer
        center={[VIT_CAMPUS_CENTER.lat, VIT_CAMPUS_CENTER.lng]}
        zoom={VIT_CAMPUS_CENTER.zoom}
        minZoom={15}
        maxZoom={19}
        maxBounds={[
          [12.9600, 79.1480],
          [12.9800, 79.1680],
        ]}
        maxBoundsViscosity={1.0}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController selectedIncident={selectedIncident} />

        {/* Esri World Imagery Satellite Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />

        {/* Black Mask to hide everything outside VIT Campus */}
        <Polygon
          positions={VIT_OUTSIDE_MASK_POLYGON}
          pathOptions={{
            color: '#071428',
            fillColor: '#071428',
            fillOpacity: 0.98,
            weight: 0,
          }}
        />

        {/* Glowing Cyan Border Outline for VIT Campus */}
        <Polygon
          positions={VIT_BOUNDARY_POLYGON}
          pathOptions={{
            color: '#00f0ff',
            weight: 3,
            fillColor: 'transparent',
            dashArray: '6, 6',
          }}
        />

        {/* Render Polyline route from resource to incident */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: '#00f0ff',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.8,
            }}
          />
        )}

        {/* Render VIT Campus Landmarks */}
        {VIT_CAMPUS_LOCATIONS.map((loc) => (
          <Marker
            key={`landmark-${loc.id}`}
            position={[loc.lat, loc.lng]}
            icon={createLandmarkMarkerIcon()}
          >
            <Popup>
              <div className="p-1">
                <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold">
                  {loc.category}
                </span>
                <h4 className="font-bold text-sm text-slate-100">{loc.name}</h4>
                <p className="text-xs text-slate-300 mt-1">{loc.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Campus Available Resources */}
        {resources.map((res) => (
          <Marker
            key={`res-${res.id}`}
            position={[res.lat, res.lng]}
            icon={createResourceMarkerIcon(res.resource_type)}
          >
            <Popup>
              <div className="p-1">
                <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold">
                  CAMPUS RESOURCE ({res.availability_status})
                </span>
                <h4 className="font-bold text-sm text-slate-100">{res.name}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{res.location}</p>
                <p className="text-xs text-emerald-400 font-mono mt-1">📞 {res.phone}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Active Emergencies */}
        {incidents.map((inc) => {
          const isSelected = selectedIncident?.id === inc.id;
          return (
            <Marker
              key={`inc-${inc.id}`}
              position={[inc.lat, inc.lng]}
              icon={createCustomMarkerIcon(inc.category, inc.priority, isSelected)}
              eventHandlers={{
                click: () => onSelectIncident(inc),
              }}
            >
              <Popup>
                <div className="p-1 space-y-1.5 max-w-xs">
                  <div className="flex items-center justify-between">
                    <PriorityBadge priority={inc.priority} />
                    <StatusBadge status={inc.status} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-100">{inc.category}</h4>
                  <p className="text-xs text-slate-300 line-clamp-2">{inc.description}</p>
                  <div className="text-[11px] font-mono text-cyan-300 pt-1 border-t border-slate-700">
                    📍 {inc.campus_location}
                  </div>
                  <button
                    onClick={() => onSelectIncident(inc)}
                    className="w-full mt-2 py-1 px-2 text-xs rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-center"
                  >
                    View AI Triage & Route
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Overlay Badge */}
      <div className="absolute bottom-3 left-3 z-[400] glass-panel px-3 py-1.5 rounded-lg text-xs font-mono flex items-center space-x-2 text-cyan-300">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        <span>VIT VELLORE LIVE MAP FEED</span>
      </div>
    </div>
  );
}
