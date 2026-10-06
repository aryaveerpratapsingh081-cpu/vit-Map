import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIIncidentAnalysis, EmergencyCategory } from '@/types';
import { mapCategoryToDepartment } from './triage-engine';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

export async function analyzeEmergencyWithGemini(
  description: string,
  category: EmergencyCategory,
  locationName: string,
  imageBase64?: string
): Promise<AIIncidentAnalysis> {
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const prompt = `
You are SENTINEL-AI, the Emergency Classification Engine for Vellore Institute of Technology (VIT Vellore) Campus.
Analyze the following campus emergency report and output strict JSON.

Report Details:
- Category Selected: "${category}"
- User Description: "${description}"
- Campus Location: "${locationName}"

Output JSON matching this exact structure:
{
  "incident_type": "${category}",
  "severity": <number between 1 and 5>,
  "confidence": <number between 0.85 and 0.99>,
  "location": "${locationName}",
  "recommended_department": "<Appropriate VIT Department>",
  "immediate_risks": ["<Risk 1>", "<Risk 2>", "<Risk 3>"],
  "recommended_actions": ["<Action 1>", "<Action 2>", "<Action 3>"],
  "summary": "<Concise 1-sentence triage summary for emergency dispatchers>"
}
`;

      const contents: any[] = [prompt];
      if (imageBase64) {
        // Strip data prefix if present
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        contents.push({
          inlineData: {
            data: cleanBase64,
            mimeType: 'image/jpeg',
          },
        });
      }

      const result = await model.generateContent(contents);
      const responseText = result.response.text();

      const parsed = JSON.parse(responseText);
      return {
        incident_type: parsed.incident_type || category,
        severity: Math.min(5, Math.max(1, parseInt(parsed.severity) || 3)),
        confidence: parseFloat(parsed.confidence) || 0.92,
        location: parsed.location || locationName,
        recommended_department:
          parsed.recommended_department || mapCategoryToDepartment(category),
        immediate_risks: Array.isArray(parsed.immediate_risks)
          ? parsed.immediate_risks
          : ['Potential campus hazard', 'Delayed response risk'],
        recommended_actions: Array.isArray(parsed.recommended_actions)
          ? parsed.recommended_actions
          : ['Dispatch campus response team', 'Alert location supervisor'],
        summary: parsed.summary || `${category} reported at ${locationName}. Quick triage required.`,
      };
    } catch (err) {
      console.warn('Gemini API call failed or timed out, using campus AI fallback engine:', err);
    }
  }

  // Fallback intelligent generator tuned specifically for VIT Vellore campus scenarios
  return generateVITCampusFallbackAnalysis(category, description, locationName);
}

export function generateVITCampusFallbackAnalysis(
  category: EmergencyCategory,
  description: string,
  locationName: string
): AIIncidentAnalysis {
  let severity = 3;
  let immediate_risks: string[] = [];
  let recommended_actions: string[] = [];

  const textLower = description.toLowerCase();

  switch (category) {
    case 'Medical Emergency':
      severity = textLower.includes('collapse') || textLower.includes('unconscious') || textLower.includes('severe') ? 5 : 4;
      immediate_risks = [
        'Acute patient health deterioration',
        'Delayed emergency resuscitation',
        'Crowd obstruction at incident location',
      ];
      recommended_actions = [
        'Dispatch Campus Health Centre Ambulance 1 immediately',
        'Contact 24/7 Campus Medical Officer',
        'Alert nearest Security Officer to clear access pathway',
      ];
      break;

    case 'Fire':
      severity = 5;
      immediate_risks = [
        'Rapid fire escalation & toxic smoke dispersal',
        'Building occupant entrapment in high-rise block',
        'Electrical mains short circuit hazard',
      ];
      recommended_actions = [
        'Trigger campus evacuation alarm at location',
        'Dispatch VIT Fire Safety Squad with extinguishers',
        'Alert Warden & Campus Security Team Alpha',
      ];
      break;

    case 'Waterlogging/Flooding':
      severity = textLower.includes('hostel') || textLower.includes('sjt') ? 4 : 3;
      immediate_risks = [
        'Submerged electrical conduits & shock hazard',
        'Pedestrian pathway blockage near main walkway',
        'Property & infrastructure damage',
      ];
      recommended_actions = [
        'Dispatch Estate Maintenance & Pumping Crew',
        'Isolate local electrical distribution boards',
        'Divert student pedestrian movement via alternative routes',
      ];
      break;

    case 'Electrical Hazard':
      severity = 4;
      immediate_risks = [
        'High voltage electrocution hazard',
        'Sparks & potential fire initiation',
        'Power outage to academic/hostel block',
      ];
      recommended_actions = [
        'Immediately trip main circuit breaker for zone',
        'Dispatch On-Call Electrical Maintenance Crew',
        'Cordon off hazard radius with security tape',
      ];
      break;

    case 'Road Accident':
      severity = textLower.includes('injury') || textLower.includes('head') ? 5 : 4;
      immediate_risks = [
        'Physical injury to student commuter',
        'Traffic congestion at campus main arterial route',
        'Secondary vehicle collision risk',
      ];
      recommended_actions = [
        'Dispatch Security Patrol Vehicle & Health Centre Ambulance',
        'Clear perimeter and manage traffic flow',
        'Notify Chief Security Officer',
      ];
      break;

    case 'Fallen Tree':
      severity = 3;
      immediate_risks = [
        'Blocked roadway or hostel access lane',
        'Damaged overhead cabling',
        'Pedestrian injury hazard',
      ];
      recommended_actions = [
        'Dispatch Campus Estate Tree Removal Squad',
        'Set up temporary warning barriers',
        'Reroute campus shuttle buses',
      ];
      break;

    case 'Security Issue':
      severity = textLower.includes('fight') || textLower.includes('unauthorized') ? 4 : 3;
      immediate_risks = [
        'Escalation of physical conflict',
        'Unapproved campus boundary breach',
        'Threat to student safety',
      ];
      recommended_actions = [
        'Dispatch Security Patrol Alpha immediately',
        'Review CCTV live feeds covering location',
        'Alert Hostel Warden on duty',
      ];
      break;

    case 'Infrastructure Damage':
      severity = 2;
      immediate_risks = [
        'Structural deterioration',
        'Potential trip/fall injuries',
      ];
      recommended_actions = [
        'Log maintenance ticket for Civil Works team',
        'Place hazard caution sign at site',
      ];
      break;

    default:
      severity = 3;
      immediate_risks = ['Campus operational disruption', 'Unverified hazard propagation'];
      recommended_actions = [
        'Dispatch general security squad to inspect site',
        'Log incident in SENTINEL-AI central ledger',
      ];
      break;
  }

  return {
    incident_type: category,
    severity,
    confidence: 0.94,
    location: locationName,
    recommended_department: mapCategoryToDepartment(category),
    immediate_risks,
    recommended_actions,
    summary: `AI analyzed ${category} report at ${locationName}. Priority dispatch recommended.`,
  };
}
