import { VITLocation } from '@/types';
import { VIT_CAMPUS_LOCATIONS } from './vit-locations';

export interface CampusGraphNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface CampusEdge {
  from: string;
  to: string;
  distance: number; // in meters
  pathwayName: string;
}

// Map of VIT Vellore Key Nodes
export class CampusNodes {
  static getNodes(): CampusGraphNode[] {
    return VIT_CAMPUS_LOCATIONS.map((loc) => ({
      id: loc.id,
      name: loc.name,
      lat: loc.lat,
      lng: loc.lng,
      description: loc.description,
    }));
  }
}

// Campus Graph Edges (Pathways & Walkways connecting VIT landmarks)
export const CAMPUS_GRAPH_EDGES: CampusEdge[] = [
  // Main Gate to Main Building
  { from: 'main-gate', to: 'main-building', distance: 180, pathwayName: 'Main Gate Boulevard' },
  { from: 'main-gate', to: 'parking-area-1', distance: 80, pathwayName: 'Main Gate Parking Lane' },

  // Main Building to Library & TT
  { from: 'main-building', to: 'library', distance: 120, pathwayName: 'Administrative Library Passage' },
  { from: 'main-building', to: 'tech-tower', distance: 150, pathwayName: 'TT Quadrangle Walkway' },
  { from: 'library', to: 'tech-tower', distance: 110, pathwayName: 'Periyar Library Arcade' },

  // TT to Foodys & SAC
  { from: 'tech-tower', to: 'foodys', distance: 90, pathwayName: 'Central Food Court Pathway' },
  { from: 'tech-tower', to: 'sac', distance: 220, pathwayName: 'TT to SAC Avenue' },
  { from: 'foodys', to: 'sac', distance: 140, pathwayName: 'Student Centre Food Court Walkway' },

  // SAC to Health Centre & Stadium
  { from: 'sac', to: 'health-centre', distance: 130, pathwayName: 'Health Centre Medical Lane' },
  { from: 'sac', to: 'stadium', distance: 280, pathwayName: 'Stadium Sports Complex Way' },
  { from: 'health-centre', to: 'stadium', distance: 240, pathwayName: 'Medical Center Stadium Path' },

  // SAC & Foodys to SJT Tower
  { from: 'sac', to: 'sjt-tower', distance: 210, pathwayName: 'SJT Academic Link Road' },
  { from: 'foodys', to: 'sjt-tower', distance: 310, pathwayName: 'Foodys to SJT Corridor' },

  // SJT Tower to Hostels
  { from: 'sjt-tower', to: 'hostel-block-c', distance: 160, pathwayName: 'Men\'s Hostel Block C Link' },
  { from: 'sjt-tower', to: 'hostel-block-d', distance: 190, pathwayName: 'Hostel Block D Quadrangle' },
  { from: 'hostel-block-c', to: 'hostel-block-d', distance: 70, pathwayName: 'Hostel Residential Walkway' },

  // Ladies Hostel to Main Gate & Library
  { from: 'ladies-hostel-b', to: 'main-gate', distance: 140, pathwayName: 'Ladies Hostel Gate Link' },
  { from: 'ladies-hostel-b', to: 'library', distance: 200, pathwayName: 'LH Library Quad Path' },
  { from: 'health-centre', to: 'hostel-block-c', distance: 230, pathwayName: 'Health Centre Hostel Access Corridor' }
];

// Helper to get adjacency list
export function getCampusAdjacencyList(): Record<string, { to: string; distance: number; pathwayName: string }[]> {
  const adj: Record<string, { to: string; distance: number; pathwayName: string }[]> = {};

  CAMPUS_GRAPH_EDGES.forEach((edge) => {
    if (!adj[edge.from]) adj[edge.from] = [];
    if (!adj[edge.to]) adj[edge.to] = [];

    adj[edge.from].push({ to: edge.to, distance: edge.distance, pathwayName: edge.pathwayName });
    adj[edge.to].push({ to: edge.from, distance: edge.distance, pathwayName: edge.pathwayName }); // Bi-directional
  });

  return adj;
}
