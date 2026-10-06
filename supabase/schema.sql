-- SENTINEL-AI: VIT Campus Emergency Response Database Schema

-- 1. campus_incidents table
CREATE TABLE IF NOT EXISTS campus_incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_type VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  campus_location VARCHAR(255) NOT NULL,
  hostel_building VARCHAR(255),
  severity INT NOT NULL CHECK (severity BETWEEN 1 AND 5),
  priority VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
  confidence DOUBLE PRECISION DEFAULT 0.9,
  reported_by VARCHAR(255) DEFAULT 'Campus Student',
  assigned_department VARCHAR(255),
  status VARCHAR(50) NOT NULL DEFAULT 'REPORTED',
  image_url TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. campus_resources table
CREATE TABLE IF NOT EXISTS campus_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  resource_type VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  availability_status VARCHAR(50) NOT NULL DEFAULT 'Available',
  assigned_incident_id UUID REFERENCES campus_incidents(id) ON DELETE SET NULL,
  phone VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. campus_response_actions table
CREATE TABLE IF NOT EXISTS campus_response_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES campus_incidents(id) ON DELETE CASCADE,
  recommended_action TEXT NOT NULL,
  assigned_resource VARCHAR(255),
  status VARCHAR(50) DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ai_incident_analysis table
CREATE TABLE IF NOT EXISTS ai_incident_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES campus_incidents(id) ON DELETE CASCADE,
  analysis_json JSONB NOT NULL,
  confidence DOUBLE PRECISION DEFAULT 0.95,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial seed resources for VIT Vellore Campus
INSERT INTO campus_resources (name, resource_type, location, latitude, longitude, availability_status, phone)
VALUES
  ('Campus Health Centre Ambulance 1', 'Ambulance', 'VIT Campus Health Centre', 12.9701, 79.1570, 'Available', '+91 416 220 2121'),
  ('Campus Health Centre Ambulance 2', 'Ambulance', 'VIT Campus Health Centre', 12.9701, 79.1570, 'Available', '+91 416 220 2122'),
  ('Security Command Team Alpha', 'Campus Security Team', 'VIT Main Gate HQ', 12.9680, 79.1550, 'Available', '+91 416 220 2000'),
  ('Security Patrol Team Beta', 'Campus Security Team', 'Technology Tower Plaza', 12.9695, 79.1562, 'Available', '+91 416 220 2001'),
  ('Hostel Warden On-Duty (MH Block C)', 'Hostel Warden', 'Men\'s Hostel Block C', 12.9720, 79.1588, 'Available', '+91 416 220 2500'),
  ('Campus Fire Safety Emergency Squad', 'Fire Safety Team', 'Main Building Quad', 12.9690, 79.1555, 'Available', '+91 416 220 2999'),
  ('Electrical Maintenance Unit 1', 'Electrical Maintenance Team', 'Silver Jubilee Tower Substation', 12.9712, 79.1601, 'Available', '+91 416 220 2300'),
  ('Campus Civil Estate Maintenance Team', 'Maintenance Team', 'SAC Maintenance Office', 12.9705, 79.1580, 'Available', '+91 416 220 2400')
ON CONFLICT DO NOTHING;

-- Row Level Security (RLS) Policies
ALTER TABLE campus_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE campus_response_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_incident_analysis ENABLE ROW LEVEL SECURITY;

-- Public read / write policies for demo environment
CREATE POLICY "Allow public read campus_incidents" ON campus_incidents FOR SELECT USING (true);
CREATE POLICY "Allow public insert campus_incidents" ON campus_incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update campus_incidents" ON campus_incidents FOR UPDATE USING (true);

CREATE POLICY "Allow public read campus_resources" ON campus_resources FOR SELECT USING (true);
CREATE POLICY "Allow public update campus_resources" ON campus_resources FOR UPDATE USING (true);

CREATE POLICY "Allow public read response_actions" ON campus_response_actions FOR SELECT USING (true);
CREATE POLICY "Allow public insert response_actions" ON campus_response_actions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read ai_analysis" ON ai_incident_analysis FOR SELECT USING (true);
CREATE POLICY "Allow public insert ai_analysis" ON ai_incident_analysis FOR INSERT WITH CHECK (true);
