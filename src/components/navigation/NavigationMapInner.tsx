'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import { NavigationRouteResult } from '@/lib/pathfinding';
import { VIT_CAMPUS_CENTER, VIT_BOUNDARY_POLYGON, VIT_OUTSIDE_MASK_POLYGON } from '@/lib/vit-locations';
import { AlertTriangle, Navigation, MapPin } from 'lucide-react';

function MapRecenter({ coords }: { coords: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (coords && coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [coords, map]);
  return null;
}

// Marker Icon Generators
function createStartPinIcon() {
  const html = `
    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500/50 animate-pulse">
      <div class="w-3 h-3 rounded-full bg-white"></div>
    </div>
  `;
  return L.divIcon({ html, className: 'start-pin', iconSize: [32, 32], iconAnchor: [16, 16] });
}

function createDestPinIcon() {
  const html = `
    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-red-600 border-2 border-white shadow-lg shadow-red-500/50">
      <div class="w-3 h-3 rounded-full bg-white"></div>
    </div>
  `;
  return L.divIcon({ html, className: 'dest-pin', iconSize: [32, 32], iconAnchor: [16, 16] });
}

function createHazardPinIcon() {
  const html = `
    <div class="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/90 border-2 border-red-500 shadow-lg radar-ping-critical">
      <span class="text-xs font-bold text-slate-950">⚠️</span>
    </div>
  `;
  return L.divIcon({ html, className: 'hazard-pin', iconSize: [32, 32], iconAnchor: [16, 16] });
}

export default function NavigationMapInner({ routeResult }: { routeResult: NavigationRouteResult }) {
  const startCoords = routeResult.routeCoordinates[0] || [VIT_CAMPUS_CENTER.lat, VIT_CAMPUS_CENTER.lng];
  const destCoords =
    routeResult.routeCoordinates[routeResult.routeCoordinates.length - 1] || [
      VIT_CAMPUS_CENTER.lat,
      VIT_CAMPUS_CENTER.lng,
    ];

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-cyan-500/30 shadow-2xl">
      <MapContainer
        center={[VIT_CAMPUS_CENTER.lat, VIT_CAMPUS_CENTER.lng]}
        zoom={16}
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
        <MapRecenter coords={routeResult.routeCoordinates} />

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

        {/* Render Blocked Direct Path in Dashed Red if Rerouted */}
        {routeResult.hasRerouted && routeResult.directBlockedRouteCoordinates && (
          <Polyline
            positions={routeResult.directBlockedRouteCoordinates}
            pathOptions={{ color: '#ef4444', weight: 4, dashArray: '6, 8', opacity: 0.6 }}
          />
        )}

        {/* Render Recommended Safe Alternate Route in Glowing Cyan */}
        <Polyline
          positions={routeResult.routeCoordinates}
          pathOptions={{
            color: routeResult.hasRerouted ? '#00f0ff' : '#10b981',
            weight: 5,
            opacity: 0.9,
          }}
        />

        {/* Start Pin */}
        <Marker position={startCoords} icon={createStartPinIcon()}>
          <Popup>
            <div className="p-1 text-xs">
              <span className="font-bold text-blue-400 block font-mono">YOUR LOCATION</span>
              <span className="text-slate-100 font-bold">{routeResult.startName}</span>
            </div>
          </Popup>
        </Marker>

        {/* Destination Pin */}
        <Marker position={destCoords} icon={createDestPinIcon()}>
          <Popup>
            <div className="p-1 text-xs">
              <span className="font-bold text-red-400 block font-mono">DESTINATION</span>
              <span className="text-slate-100 font-bold">{routeResult.destinationName}</span>
            </div>
          </Popup>
        </Marker>

        {/* Active Hazard Markers on map */}
        {routeResult.blockedIncidents.map((inc) => (
          <Marker key={`nav-haz-${inc.id}`} position={[inc.lat, inc.lng]} icon={createHazardPinIcon()}>
            <Popup>
              <div className="p-1 text-xs">
                <span className="font-bold text-red-400 font-mono uppercase block">⚠️ ACTIVE ROUTE HAZARD</span>
                <span className="font-bold text-slate-100">{inc.category}</span>
                <p className="text-[11px] text-slate-300 mt-1">{inc.description}</p>
                <div className="text-[10px] text-amber-400 font-mono mt-1">DYNAMIC REROUTE APPLIED</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-[400] glass-panel p-2.5 rounded-lg text-xs font-mono space-y-1 bg-navy-950/90 border border-cyan-500/30">
        <div className="flex items-center space-x-2 text-cyan-300">
          <span className="w-3 h-1 bg-cyan-400 rounded"></span>
          <span>Safe Rerouted Path</span>
        </div>
        {routeResult.hasRerouted && (
          <div className="flex items-center space-x-2 text-red-400">
            <span className="w-3 h-1 bg-red-500 rounded border-dashed"></span>
            <span>Blocked Hazard Path</span>
          </div>
        )}
      </div>
    </div>
  );
}
