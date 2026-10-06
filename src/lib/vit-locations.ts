import { VITLocation } from '@/types';

// Centered on VIT Vellore Campus (Tamil Nadu, India)
export const VIT_CAMPUS_CENTER = {
  lat: 12.9712,
  lng: 79.1582,
  zoom: 16.5,
};

// ─── ACCURATE VIT CAMPUS BOUNDARY POLYGONS ───
// North Campus Polygon (Hostels, Food Park, N/Q/S/T Blocks)
export const VIT_NORTH_CAMPUS_POLYGON: [number, number][] = [
  [12.9752, 79.1502],
  [12.9772, 79.1508],
  [12.9778, 79.1542],
  [12.9782, 79.1582],
  [12.9784, 79.1625],
  [12.9778, 79.1648],
  [12.9768, 79.1662],
  [12.9755, 79.1668],
  [12.9745, 79.1650],
  [12.9738, 79.1605],
  [12.9732, 79.1565],
  [12.9735, 79.1522],
  [12.9742, 79.1502],
  [12.9752, 79.1502],
];

// South Campus Polygon (Main Building, SJT, PRP, LH, Gates)
export const VIT_SOUTH_CAMPUS_POLYGON: [number, number][] = [
  [12.9705, 79.1482],
  [12.9725, 79.1528],
  [12.9728, 79.1580],
  [12.9732, 79.1638],
  [12.9738, 79.1672],
  [12.9722, 79.1675],
  [12.9698, 79.1670],
  [12.9678, 79.1662],
  [12.9645, 79.1658],
  [12.9625, 79.1628],
  [12.9615, 79.1595],
  [12.9618, 79.1558],
  [12.9632, 79.1525],
  [12.9655, 79.1495],
  [12.9680, 79.1480],
  [12.9705, 79.1482],
];

// Single perimeter enclosing the entire campus area
export const VIT_BOUNDARY_POLYGON: [number, number][] = [
  [12.9752, 79.1502],
  [12.9772, 79.1508],
  [12.9778, 79.1542],
  [12.9782, 79.1582],
  [12.9784, 79.1625],
  [12.9778, 79.1648],
  [12.9768, 79.1662],
  [12.9755, 79.1668],
  [12.9738, 79.1672],
  [12.9722, 79.1675],
  [12.9698, 79.1670],
  [12.9678, 79.1662],
  [12.9645, 79.1658],
  [12.9625, 79.1628],
  [12.9615, 79.1595],
  [12.9618, 79.1558],
  [12.9632, 79.1525],
  [12.9655, 79.1495],
  [12.9680, 79.1480],
  [12.9705, 79.1482],
  [12.9742, 79.1502],
  [12.9752, 79.1502],
];

// Multi-polygon mask to blackout area outside VIT campus
export const VIT_OUTSIDE_MASK_POLYGON: [number, number][][] = [
  [
    [85, -180],
    [85, 180],
    [-85, 180],
    [-85, -180],
  ],
  VIT_NORTH_CAMPUS_POLYGON,
  VIT_SOUTH_CAMPUS_POLYGON,
];

export const VIT_CAMPUS_LOCATIONS: VITLocation[] = [
  // ── GATES ──
  { id: 'gate-1', name: 'Main Gate', category: 'Security', lat: 12.9688, lng: 79.1488, description: 'Primary Campus Entrance & Security HQ' },
  { id: 'gate-2a', name: 'Gate 2A', category: 'Security', lat: 12.9630, lng: 79.1532, description: 'South Access Gate' },
  { id: 'gate-5', name: 'Gate 5', category: 'Security', lat: 12.9762, lng: 79.1665, description: 'Northeast Entrance Gate' },
  { id: 'gate-11', name: 'Gate 11', category: 'Security', lat: 12.9640, lng: 79.1648, description: 'Hostel Outer Perimeter Gate' },
  { id: 'gate-11a', name: 'Gate 11A', category: 'Security', lat: 12.9672, lng: 79.1642, description: 'PRP Access Gate' },

  // ── ACADEMIC BLOCKS ──
  { id: 'main-building', name: 'Main Building', category: 'Administrative', lat: 12.9692, lng: 79.1548, description: 'Central Admin Offices & Auditorium' },
  { id: 'cdmm', name: 'CDMM', category: 'Academic', lat: 12.9698, lng: 79.1535, description: 'Center for Disaster Mitigation & Management' },
  { id: 'anna-auditorium', name: 'Anna Auditorium', category: 'Academic', lat: 12.9702, lng: 79.1525, description: 'Main Convocation & Event Hall' },
  { id: 'mother-teresa', name: 'Mother Teresa Block', category: 'Academic', lat: 12.9708, lng: 79.1572, description: 'Bio-Sciences & Bio-Tech Labs' },
  { id: 'ida-scudder', name: 'Ida Scudder Block', category: 'Academic', lat: 12.9706, lng: 79.1588, description: 'Medical Science & Nursing Labs' },
  { id: 'sjt', name: 'SJT', category: 'Academic', lat: 12.9712, lng: 79.1601, description: 'Silver Jubilee Tower Classrooms' },
  { id: 'prp-block-e', name: 'PRP Block E', category: 'Academic', lat: 12.9722, lng: 79.1632, description: 'Periyar Research Park - Block E' },
  { id: 'prp-block-a', name: 'PRP Block A', category: 'Academic', lat: 12.9728, lng: 79.1645, description: 'Periyar Research Park - Block A' },
  { id: 'prp-annex', name: 'PRP Annex', category: 'Academic', lat: 12.9710, lng: 79.1642, description: 'Research Annex & Labs' },
  { id: 'mgb', name: 'MGB', category: 'Academic', lat: 12.9732, lng: 79.1658, description: 'Mahatma Gandhi Block' },

  // ── MEN\'S HOSTELS (NORTH CAMPUS) ──
  { id: 'a-block', name: 'A Block', category: 'Hostel', lat: 12.9752, lng: 79.1528, description: 'Men\'s Residence Block A' },
  { id: 'b-block', name: 'B Block', category: 'Hostel', lat: 12.9765, lng: 79.1518, description: 'Men\'s Residence Block B' },
  { id: 'b-annexe', name: 'B Annexe', category: 'Hostel', lat: 12.9772, lng: 79.1512, description: 'Block B Extension' },
  { id: 'c-block', name: 'C Block', category: 'Hostel', lat: 12.9750, lng: 79.1542, description: 'Men\'s Residence Block C' },
  { id: 'd-block', name: 'D Block', category: 'Hostel', lat: 12.9750, lng: 79.1552, description: 'Men\'s Residence Block D' },
  { id: 'e-block', name: 'E Block', category: 'Hostel', lat: 12.9750, lng: 79.1565, description: 'Men\'s Residence Block E' },
  { id: 'f-block', name: 'F Block', category: 'Hostel', lat: 12.9760, lng: 79.1538, description: 'Men\'s Residence Block F' },
  { id: 'n-block', name: 'N Block', category: 'Hostel', lat: 12.9772, lng: 79.1605, description: 'Men\'s Residence Block N' },
  { id: 'q-block', name: 'Q Block', category: 'Hostel', lat: 12.9758, lng: 79.1602, description: 'Men\'s Residence Block Q' },
  { id: 's-block', name: 'S Block', category: 'Hostel', lat: 12.9768, lng: 79.1625, description: 'Men\'s Residence Block S' },
  { id: 't-block', name: 'T Block', category: 'Hostel', lat: 12.9774, lng: 79.1628, description: 'Men\'s Residence Block T' },
  { id: 'm-block', name: 'M Block', category: 'Hostel', lat: 12.9740, lng: 79.1610, description: 'Men\'s Residence Block M' },
  { id: 'lh-block', name: 'LH Block', category: 'Hostel', lat: 12.9658, lng: 79.1575, description: 'Ladies Hostel Quadrangle' },

  // ── MESSES & FOOD ──
  { id: 'food-park', name: 'Food Park', category: 'Facility', lat: 12.9748, lng: 79.1578, description: 'Hostel Food Court & Snacks Hub' },
  { id: 'mh-nonveg-mess', name: 'MH Non-Veg Mess', category: 'Facility', lat: 12.9764, lng: 79.1612, description: 'Men\'s Hostel Central Non-Veg Mess' },
  { id: 'mh-special-mess', name: 'MH Special Mess', category: 'Facility', lat: 12.9752, lng: 79.1612, description: 'Men\'s Hostel Special Dining Hall' },
  { id: 'lh-nonveg-mess', name: 'LH Non-Veg Mess', category: 'Facility', lat: 12.9642, lng: 79.1582, description: 'Ladies Hostel Non-Veg Dining Mess' },
  { id: 'canteen', name: 'Canteen', category: 'Facility', lat: 12.9700, lng: 79.1508, description: 'Main Building Cafeteria' },
  { id: 'nescafe', name: 'Nescafe', category: 'Facility', lat: 12.9695, lng: 79.1555, description: 'Coffee & Snacks Point' },
  { id: 'amul', name: 'Amul', category: 'Facility', lat: 12.9692, lng: 79.1565, description: 'Amul Ice Cream & Dairy Counter' },
  { id: 'lassi-house', name: 'Lassi House', category: 'Facility', lat: 12.9725, lng: 79.1618, description: 'Fresh Juices & Lassi Counter' },

  // ── GROUNDS & FACILITIES ──
  { id: 'sjt-ground', name: 'SJT Ground', category: 'Sports', lat: 12.9688, lng: 79.1625, description: 'Main Sports & Athletic Ground' },
  { id: 'health-centre', name: 'Health Centre', category: 'Medical', lat: 12.9701, lng: 79.1570, description: '24/7 Campus Hospital & Ambulance' },
];

export function getLocationByName(name: string): VITLocation | undefined {
  return VIT_CAMPUS_LOCATIONS.find(
    (loc) => loc.name.toLowerCase() === name.toLowerCase() || loc.id.toLowerCase() === name.toLowerCase()
  );
}

export function getLocationCoordinates(name: string): { lat: number; lng: number } {
  const match = getLocationByName(name);
  if (match) {
    return { lat: match.lat, lng: match.lng };
  }
  return {
    lat: VIT_CAMPUS_CENTER.lat + (Math.random() - 0.5) * 0.002,
    lng: VIT_CAMPUS_CENTER.lng + (Math.random() - 0.5) * 0.002,
  };
}
