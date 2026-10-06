import { CampusIncident } from '@/types';
import { getCampusAdjacencyList, CAMPUS_GRAPH_EDGES } from './campus-graph';
import { getLocationByName, VIT_CAMPUS_LOCATIONS } from './vit-locations';
import { calculateHaversineDistance } from './triage-engine';

export interface RouteStep {
  stepIndex: number;
  fromName: string;
  toName: string;
  pathwayName: string;
  distanceMeters: number;
  instruction: string;
  isHazardous?: boolean;
}

export interface NavigationRouteResult {
  startNodeId: string;
  destinationNodeId: string;
  startName: string;
  destinationName: string;
  totalDistanceMeters: number;
  estimatedMinutes: number;
  routeCoordinates: [number, number][];
  steps: RouteStep[];
  hasRerouted: boolean;
  blockedIncidents: CampusIncident[];
  directBlockedRouteCoordinates?: [number, number][];
}

/**
 * Calculates optimal campus route with dynamic hazard avoidance rerouting
 */
export function calculateSafeCampusRoute(
  startId: string,
  destId: string,
  activeIncidents: CampusIncident[]
): NavigationRouteResult {
  const startLoc = getLocationByName(startId) || VIT_CAMPUS_LOCATIONS[0];
  const destLoc = getLocationByName(destId) || VIT_CAMPUS_LOCATIONS[3]; // Default SJT

  // Find active hazard nodes (locations with active emergencies)
  const hazardLocNames = new Set(
    activeIncidents
      .filter((i) => i.status !== 'RESOLVED' && (i.severity >= 3 || i.priority === 'CRITICAL' || i.priority === 'HIGH'))
      .map((i) => i.campus_location.toLowerCase())
  );

  const blockedIncidents = activeIncidents.filter(
    (i) => i.status !== 'RESOLVED' && hazardLocNames.has(i.campus_location.toLowerCase())
  );

  const adj = getCampusAdjacencyList();

  // 1. Calculate Standard Unobstructed Direct Path
  const directPath = runDijkstra(startLoc.id, destLoc.id, adj, new Set());

  // 2. Check if Direct Path intersects any active hazard zone
  const hazardNodesInDirectPath = directPath.nodeIds.filter((id) => {
    const loc = getLocationByName(id);
    return loc && hazardLocNames.has(loc.name.toLowerCase());
  });

  let finalNodeIds = directPath.nodeIds;
  let hasRerouted = false;
  let directBlockedCoords: [number, number][] | undefined = undefined;

  if (hazardNodesInDirectPath.length > 0) {
    // Save direct blocked coordinates for visual comparison map overlay
    directBlockedCoords = directPath.nodeIds.map((id) => {
      const loc = getLocationByName(id)!;
      return [loc.lat, loc.lng] as [number, number];
    });

    // Run Dijkstra with hazard nodes blocked
    const blockedNodesSet = new Set(hazardNodesInDirectPath);
    const safePath = runDijkstra(startLoc.id, destLoc.id, adj, blockedNodesSet);

    if (safePath.nodeIds.length > 0) {
      finalNodeIds = safePath.nodeIds;
      hasRerouted = true;
    }
  }

  // Build coordinates and step-by-step turn instructions
  const routeCoordinates: [number, number][] = [];
  const steps: RouteStep[] = [];
  let totalDistanceMeters = 0;

  for (let i = 0; i < finalNodeIds.length; i++) {
    const currLoc = getLocationByName(finalNodeIds[i])!;
    routeCoordinates.push([currLoc.lat, currLoc.lng]);

    if (i < finalNodeIds.length - 1) {
      const nextLoc = getLocationByName(finalNodeIds[i + 1])!;
      const edge = adj[currLoc.id]?.find((e) => e.to === nextLoc.id);
      const dist = edge ? edge.distance : 150;
      totalDistanceMeters += dist;

      let instruction = `Head along ${edge ? edge.pathwayName : 'Campus Walkway'} towards ${nextLoc.name}`;
      if (hasRerouted && i === 1) {
        instruction += ` (⚠️ Safe Dynamic Reroute avoiding hazard zone)`;
      }

      steps.push({
        stepIndex: i + 1,
        fromName: currLoc.name,
        toName: nextLoc.name,
        pathwayName: edge ? edge.pathwayName : 'Campus Walkway',
        distanceMeters: dist,
        instruction,
      });
    }
  }

  // Estimated walking speed: ~1.2 m/s => 72 meters per minute
  const estimatedMinutes = Math.max(1, Math.round(totalDistanceMeters / 72));

  return {
    startNodeId: startLoc.id,
    destinationNodeId: destLoc.id,
    startName: startLoc.name,
    destinationName: destLoc.name,
    totalDistanceMeters,
    estimatedMinutes,
    routeCoordinates,
    steps,
    hasRerouted,
    blockedIncidents,
    directBlockedRouteCoordinates: directBlockedCoords,
  };
}

// Dijkstra shortest path solver
function runDijkstra(
  startId: string,
  destId: string,
  adj: Record<string, { to: string; distance: number; pathwayName: string }[]>,
  blockedNodeIds: Set<string>
): { nodeIds: string[]; totalDist: number } {
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const unvisited = new Set<string>();

  Object.keys(adj).forEach((node) => {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  });

  distances[startId] = 0;

  while (unvisited.size > 0) {
    let current: string | null = null;
    let minDist = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minDist) {
        minDist = distances[node];
        current = node;
      }
    }

    if (!current || minDist === Infinity) break;
    if (current === destId) break;

    unvisited.delete(current);

    const neighbors = adj[current] || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.to)) continue;

      // Apply heavy penalty cost if node is blocked by hazard
      let weight = neighbor.distance;
      if (blockedNodeIds.has(neighbor.to) && neighbor.to !== destId) {
        weight += 50000; // Infinity penalty to force rerouting
      }

      const alt = distances[current] + weight;
      if (alt < distances[neighbor.to]) {
        distances[neighbor.to] = alt;
        previous[neighbor.to] = current;
      }
    }
  }

  // Reconstruct path
  const path: string[] = [];
  let curr: string | null = destId;

  if (distances[destId] === Infinity && previous[destId] === null) {
    // If blocked completely, fallback to direct path
    return { nodeIds: [startId, destId], totalDist: 300 };
  }

  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return { nodeIds: path, totalDist: distances[destId] };
}
