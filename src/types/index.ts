export type EmergencyCategory =
  | 'Medical Emergency'
  | 'Fire'
  | 'Waterlogging/Flooding'
  | 'Electrical Hazard'
  | 'Road Accident'
  | 'Fallen Tree'
  | 'Security Issue'
  | 'Infrastructure Damage'
  | 'Missing Person'
  | 'Other Campus Emergency';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IncidentStatus =
  | 'REPORTED'
  | 'AI ANALYZED'
  | 'PRIORITIZED'
  | 'RESPONSE ASSIGNED'
  | 'IN PROGRESS'
  | 'RESOLVED';

export type ResourceType =
  | 'Campus Security Team'
  | 'Health Centre'
  | 'Ambulance'
  | 'Hostel Warden'
  | 'Maintenance Team'
  | 'Electrical Maintenance Team'
  | 'Fire Safety Team';

export type ResourceStatus = 'Available' | 'Busy' | 'Dispatched' | 'Offline';

export interface VITLocation {
  id: string;
  name: string;
  category: 'Hostel' | 'Academic' | 'Administrative' | 'Medical' | 'Security' | 'Facility' | 'Sports';
  lat: number;
  lng: number;
  description: string;
}

export interface AIIncidentAnalysis {
  incident_type: EmergencyCategory;
  severity: number; // 1 to 5
  confidence: number; // 0 to 1
  location: string;
  recommended_department: string;
  immediate_risks: string[];
  recommended_actions: string[];
  summary?: string;
}

export interface RecommendedResource {
  id: string;
  name: string;
  resource_type: ResourceType;
  location: string;
  distance_km: number;
  eta_minutes: number;
}

export interface CampusResource {
  id: string;
  name: string;
  resource_type: ResourceType;
  location: string;
  lat: number;
  lng: number;
  availability_status: ResourceStatus;
  assigned_incident_id?: string | null;
  phone?: string;
}

export interface CampusIncident {
  id: string;
  category: EmergencyCategory;
  description: string;
  campus_location: string;
  lat: number;
  lng: number;
  hostel_building?: string;
  reported_by: string;
  image_url?: string;
  video_url?: string;
  severity: number; // 1-5
  priority: PriorityLevel;
  confidence: number;
  status: IncidentStatus;
  assigned_department: string;
  assigned_resource?: RecommendedResource | null;
  immediate_risks: string[];
  recommended_actions: string[];
  ai_analysis?: AIIncidentAnalysis;
  created_at: string;
  updated_at: string;
}

export interface CampusResponseAction {
  id: string;
  incident_id: string;
  recommended_action: string;
  assigned_resource: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  created_at: string;
}
