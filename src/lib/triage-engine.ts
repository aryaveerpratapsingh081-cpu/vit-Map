import {
  CampusIncident,
  CampusResource,
  EmergencyCategory,
  PriorityLevel,
  RecommendedResource,
} from '@/types';
import { VIT_CAMPUS_LOCATIONS } from './vit-locations';

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates
 */
export function calculateHaversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in KM
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Campus Spatial Priority Triage Calculator
 */
export function calculateCampusPriority(
  severity: number,
  category: EmergencyCategory,
  locationName: string
): PriorityLevel {
  let score = severity * 3;

  // Category weightings
  if (category === 'Medical Emergency' || category === 'Fire') {
    score += 4;
  } else if (category === 'Electrical Hazard' || category === 'Road Accident') {
    score += 3;
  } else if (category === 'Waterlogging/Flooding' || category === 'Security Issue') {
    score += 2;
  }

  // Location density weightings
  const locUpper = locationName.toUpperCase();
  if (locUpper.includes('HOSTEL') || locUpper.includes('LH') || locUpper.includes('MH')) {
    score += 3; // High density residential area
  } else if (locUpper.includes('TOWER') || locUpper.includes('SJT') || locUpper.includes('TT')) {
    score += 2; // Academic towers
  } else if (locUpper.includes('GATE') || locUpper.includes('FOOD') || locUpper.includes('LIBRARY')) {
    score += 1;
  }

  if (score >= 14) return 'CRITICAL';
  if (score >= 10) return 'HIGH';
  if (score >= 6) return 'MEDIUM';
  return 'LOW';
}

/**
 * Maps Emergency Categories to relevant Campus Department Teams
 */
export function mapCategoryToDepartment(category: EmergencyCategory): string {
  switch (category) {
    case 'Medical Emergency':
      return 'Campus Health Centre & Ambulance Services';
    case 'Fire':
      return 'Campus Fire Safety & Security Operations';
    case 'Electrical Hazard':
      return 'Electrical Infrastructure Maintenance Dept';
    case 'Waterlogging/Flooding':
    case 'Fallen Tree':
    case 'Infrastructure Damage':
      return 'Campus Estate & Civil Maintenance Team';
    case 'Security Issue':
    case 'Missing Person':
    case 'Road Accident':
      return 'VIT Campus Security Command HQ';
    default:
      return 'General Campus Emergency Response Command';
  }
}

/**
 * Recommends nearest available resource for an incident location
 */
export function recommendNearestResource(
  incidentLat: number,
  incidentLng: number,
  category: EmergencyCategory,
  availableResources: CampusResource[]
): RecommendedResource | null {
  if (!availableResources || availableResources.length === 0) return null;

  // Filter relevant resources if possible
  let suitable = availableResources.filter((r) => r.availability_status === 'Available');

  if (suitable.length === 0) {
    // Fallback to any available resource if none of ideal type match
    suitable = availableResources;
  }

  // Category specific matching preference
  let preferredType = '';
  if (category === 'Medical Emergency') preferredType = 'Ambulance';
  else if (category === 'Fire') preferredType = 'Fire Safety Team';
  else if (category === 'Electrical Hazard') preferredType = 'Electrical Maintenance Team';
  else if (category === 'Waterlogging/Flooding' || category === 'Infrastructure Damage')
    preferredType = 'Maintenance Team';
  else preferredType = 'Campus Security Team';

  const categoryMatches = suitable.filter((r) => r.resource_type.includes(preferredType));
  const pool = categoryMatches.length > 0 ? categoryMatches : suitable;

  // Find minimum distance
  let nearest: CampusResource | null = null;
  let minDistance = Infinity;

  for (const resource of pool) {
    const dist = calculateHaversineDistance(
      incidentLat,
      incidentLng,
      resource.lat,
      resource.lng
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = resource;
    }
  }

  if (!nearest) return null;

  // Estimate ETA (assuming avg campus speed 20km/h => 1 km = 3 mins + 1 min prep)
  const eta = Math.max(1, Math.round(minDistance * 3 + 1));

  return {
    id: nearest.id,
    name: nearest.name,
    resource_type: nearest.resource_type,
    location: nearest.location,
    distance_km: minDistance === 0 ? 0.2 : minDistance,
    eta_minutes: eta,
  };
}
