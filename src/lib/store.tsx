'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CampusIncident,
  CampusResource,
  EmergencyCategory,
  IncidentStatus,
  PriorityLevel,
} from '@/types';
import { getLocationCoordinates, VIT_CAMPUS_LOCATIONS } from './vit-locations';
import {
  calculateCampusPriority,
  mapCategoryToDepartment,
  recommendNearestResource,
} from './triage-engine';
import { generateVITCampusFallbackAnalysis } from './gemini';

// Initial Campus Resources Seed
const INITIAL_RESOURCES: CampusResource[] = [
  {
    id: 'res-1',
    name: 'Campus Health Centre Ambulance 1',
    resource_type: 'Ambulance',
    location: 'VIT Campus Health Centre',
    lat: 12.9701,
    lng: 79.157,
    availability_status: 'Available',
    phone: '+91 416 220 2121',
  },
  {
    id: 'res-2',
    name: 'Campus Health Centre Ambulance 2',
    resource_type: 'Ambulance',
    location: 'VIT Campus Health Centre',
    lat: 12.9701,
    lng: 79.157,
    availability_status: 'Available',
    phone: '+91 416 220 2122',
  },
  {
    id: 'res-3',
    name: 'Security Command Team Alpha',
    resource_type: 'Campus Security Team',
    location: 'VIT Main Gate HQ',
    lat: 12.968,
    lng: 79.155,
    availability_status: 'Available',
    phone: '+91 416 220 2000',
  },
  {
    id: 'res-4',
    name: 'Security Patrol Team Beta',
    resource_type: 'Campus Security Team',
    location: 'Technology Tower Plaza',
    lat: 12.9695,
    lng: 79.1562,
    availability_status: 'Available',
    phone: '+91 416 220 2001',
  },
  {
    id: 'res-5',
    name: 'Hostel Warden On-Duty (MH)',
    resource_type: 'Hostel Warden',
    location: "Men's Hostel Block C",
    lat: 12.972,
    lng: 79.1588,
    availability_status: 'Available',
    phone: '+91 416 220 2500',
  },
  {
    id: 'res-6',
    name: 'Campus Fire Safety Emergency Squad',
    resource_type: 'Fire Safety Team',
    location: 'Main Building Quad',
    lat: 12.969,
    lng: 79.1555,
    availability_status: 'Available',
    phone: '+91 416 220 2999',
  },
  {
    id: 'res-7',
    name: 'Electrical Maintenance Unit 1',
    resource_type: 'Electrical Maintenance Team',
    location: 'Silver Jubilee Tower Substation',
    lat: 12.9712,
    lng: 79.1601,
    availability_status: 'Available',
    phone: '+91 416 220 2300',
  },
  {
    id: 'res-8',
    name: 'Campus Civil Estate Maintenance Team',
    resource_type: 'Maintenance Team',
    location: 'SAC Maintenance Office',
    lat: 12.9705,
    lng: 79.158,
    availability_status: 'Available',
    phone: '+91 416 220 2400',
  },
];

// Initial Campus Incidents Seed
const INITIAL_INCIDENTS: CampusIncident[] = [
  {
    id: 'inc-101',
    category: 'Medical Emergency',
    description: 'Student experienced heat syncope & collapse during sports practice at stadium.',
    campus_location: 'Outdoor Stadium & Sports Complex',
    lat: 12.9715,
    lng: 79.1545,
    hostel_building: 'N/A',
    reported_by: 'Sports Warden',
    severity: 5,
    priority: 'CRITICAL',
    confidence: 0.96,
    status: 'IN PROGRESS',
    assigned_department: 'Campus Health Centre & Ambulance Services',
    immediate_risks: [
      'Acute dehydration & unconsciousness',
      'Delayed resuscitation risk',
    ],
    recommended_actions: [
      'Dispatch Campus Health Centre Ambulance 1',
      'Provide immediate shaded first-aid',
      'Contact Medical Officer on duty',
    ],
    assigned_resource: {
      id: 'res-1',
      name: 'Campus Health Centre Ambulance 1',
      resource_type: 'Ambulance',
      location: 'VIT Campus Health Centre',
      distance_km: 0.35,
      eta_minutes: 2,
    },
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'inc-102',
    category: 'Waterlogging/Flooding',
    description: 'Heavy rainfall overflow near Technology Tower walkway blocking student access.',
    campus_location: 'Technology Tower (TT)',
    lat: 12.9695,
    lng: 79.1562,
    reported_by: 'Campus Student',
    severity: 3,
    priority: 'MEDIUM',
    confidence: 0.92,
    status: 'RESPONSE ASSIGNED',
    assigned_department: 'Campus Estate & Civil Maintenance Team',
    immediate_risks: [
      'Pedestrian slip & fall risk',
      'Submerged electric junction box',
    ],
    recommended_actions: [
      'Deploy portable water suction pump',
      'Isolate local outdoor power supply',
      'Setup hazard barrier cones',
    ],
    assigned_resource: {
      id: 'res-8',
      name: 'Campus Civil Estate Maintenance Team',
      resource_type: 'Maintenance Team',
      location: 'SAC Maintenance Office',
      distance_km: 0.22,
      eta_minutes: 3,
    },
    created_at: new Date(Date.now() - 42 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: 'inc-103',
    category: 'Electrical Hazard',
    description: 'Short circuit sparks detected near elevator electrical panel on SJT 4th floor.',
    campus_location: 'Silver Jubilee Tower (SJT)',
    lat: 12.9712,
    lng: 79.1601,
    hostel_building: 'SJT Block',
    reported_by: 'Lab Assistant',
    severity: 4,
    priority: 'HIGH',
    confidence: 0.95,
    status: 'AI ANALYZED',
    assigned_department: 'Electrical Infrastructure Maintenance Dept',
    immediate_risks: [
      'Electrical fire outbreak in vertical shaft',
      'Elevator power loss entrapment',
    ],
    recommended_actions: [
      'Isolate 4th floor main electrical breaker',
      'Dispatch Electrical Maintenance Unit 1',
      'Temporarily halt elevator operation',
    ],
    assigned_resource: {
      id: 'res-7',
      name: 'Electrical Maintenance Unit 1',
      resource_type: 'Electrical Maintenance Team',
      location: 'Silver Jubilee Tower Substation',
      distance_km: 0.05,
      eta_minutes: 1,
    },
    created_at: new Date(Date.now() - 8 * 60000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 60000).toISOString(),
  },
];

interface SentinelContextType {
  incidents: CampusIncident[];
  resources: CampusResource[];
  selectedIncident: CampusIncident | null;
  setSelectedIncident: (inc: CampusIncident | null) => void;
  addIncident: (newInc: Partial<CampusIncident>) => CampusIncident;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  updateResourceStatus: (id: string, status: CampusResource['availability_status']) => void;
  triggerSimulationScenario: (scenarioType: string) => CampusIncident;
  getIncidentById: (id: string) => CampusIncident | undefined;
}

const SentinelContext = createContext<SentinelContextType | undefined>(undefined);

export function SentinelProvider({ children }: { children: React.ReactNode }) {
  const [incidents, setIncidents] = useState<CampusIncident[]>(INITIAL_INCIDENTS);
  const [resources, setResources] = useState<CampusResource[]>(INITIAL_RESOURCES);
  const [selectedIncident, setSelectedIncident] = useState<CampusIncident | null>(INITIAL_INCIDENTS[0]);

  const addIncident = (data: Partial<CampusIncident>): CampusIncident => {
    const coords = data.lat && data.lng
      ? { lat: data.lat, lng: data.lng }
      : getLocationCoordinates(data.campus_location || 'Main Building');

    const category = data.category || 'Other Campus Emergency';
    const severity = data.severity || 3;
    const priority = calculateCampusPriority(severity, category, data.campus_location || '');
    const analysis = generateVITCampusFallbackAnalysis(category, data.description || '', data.campus_location || '');

    const recommendedResource = recommendNearestResource(
      coords.lat,
      coords.lng,
      category,
      resources
    );

    const newInc: CampusIncident = {
      id: `inc-${Date.now()}`,
      category,
      description: data.description || 'Emergency incident reported on campus.',
      campus_location: data.campus_location || 'VIT Main Campus',
      lat: coords.lat,
      lng: coords.lng,
      hostel_building: data.hostel_building || '',
      reported_by: data.reported_by || 'VIT Student',
      image_url: data.image_url,
      video_url: data.video_url,
      severity,
      priority,
      confidence: data.confidence || 0.94,
      status: 'AI ANALYZED',
      assigned_department: mapCategoryToDepartment(category),
      assigned_resource: recommendedResource,
      immediate_risks: analysis.immediate_risks,
      recommended_actions: analysis.recommended_actions,
      ai_analysis: analysis,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setIncidents((prev) => [newInc, ...prev]);
    setSelectedIncident(newInc);

    // If a resource was assigned, update resource status
    if (recommendedResource) {
      setResources((prev) =>
        prev.map((res) =>
          res.id === recommendedResource.id
            ? { ...res, availability_status: 'Dispatched', assigned_incident_id: newInc.id }
            : res
        )
      );
    }

    return newInc;
  };

  const updateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const updated = { ...inc, status: newStatus, updated_at: new Date().toISOString() };
          if (selectedIncident?.id === id) {
            setSelectedIncident(updated);
          }
          return updated;
        }
        return inc;
      })
    );
  };

  const updateResourceStatus = (id: string, status: CampusResource['availability_status']) => {
    setResources((prev) =>
      prev.map((res) => (res.id === id ? { ...res, availability_status: status } : res))
    );
  };

  const triggerSimulationScenario = (scenarioType: string): CampusIncident => {
    let category: EmergencyCategory = 'Medical Emergency';
    let locationName = 'Hostel Block C (MH)';
    let description = 'Simulated incident';
    let severity = 5;

    if (scenarioType === 'medical') {
      category = 'Medical Emergency';
      locationName = 'Hostel Block D (MH)';
      description = 'Student collapsed with high fever and severe shortness of breath in room 302.';
      severity = 5;
    } else if (scenarioType === 'fire') {
      category = 'Fire';
      locationName = 'Technology Tower (TT)';
      description = 'Dense electrical smoke & localized fire detected in 2nd floor server room.';
      severity = 5;
    } else if (scenarioType === 'waterlogging') {
      category = 'Waterlogging/Flooding';
      locationName = 'Main Administrative Building (MB)';
      description = 'Monsoon drainage blockage causing 1.5 ft waterlogging at Main Building entrance.';
      severity = 3;
    } else if (scenarioType === 'electrical') {
      category = 'Electrical Hazard';
      locationName = 'Silver Jubilee Tower (SJT)';
      description = 'Exposed high voltage transformer cable shorting near SJT entrance walkway.';
      severity = 4;
    } else if (scenarioType === 'accident') {
      category = 'Road Accident';
      locationName = 'VIT Main Gate & Security HQ';
      description = 'Two-wheeler skid collision near Main Gate roundabout involving student scooter.';
      severity = 4;
    }

    const coords = getLocationCoordinates(locationName);
    const incident = addIncident({
      category,
      campus_location: locationName,
      description: `[SIMULATION ENGINE] ${description}`,
      severity,
      lat: coords.lat,
      lng: coords.lng,
      reported_by: 'SENTINEL Simulation System',
    });

    return incident;
  };

  const getIncidentById = (id: string) => incidents.find((i) => i.id === id);

  return (
    <SentinelContext.Provider
      value={{
        incidents,
        resources,
        selectedIncident,
        setSelectedIncident,
        addIncident,
        updateIncidentStatus,
        updateResourceStatus,
        triggerSimulationScenario,
        getIncidentById,
      }}
    >
      {children}
    </SentinelContext.Provider>
  );
}

export function useSentinelStore() {
  const context = useContext(SentinelContext);
  if (!context) {
    throw new Error('useSentinelStore must be used within a SentinelProvider');
  }
  return context;
}
