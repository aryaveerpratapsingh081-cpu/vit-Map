'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSentinelStore } from '@/lib/store';
import { EmergencyCategory } from '@/types';
import { VIT_CAMPUS_LOCATIONS } from '@/lib/vit-locations';
import {
  AlertTriangle,
  Upload,
  Image as ImageIcon,
  Video,
  MapPin,
  Sparkles,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: EmergencyCategory[] = [
  'Medical Emergency',
  'Fire',
  'Waterlogging/Flooding',
  'Electrical Hazard',
  'Road Accident',
  'Fallen Tree',
  'Security Issue',
  'Infrastructure Damage',
  'Missing Person',
  'Other Campus Emergency',
];

export default function ReportEmergencyPage() {
  const router = useRouter();
  const { addIncident } = useSentinelStore();

  const [category, setCategory] = useState<EmergencyCategory>('Medical Emergency');
  const [description, setDescription] = useState('');
  const [campusLocation, setCampusLocation] = useState(VIT_CAMPUS_LOCATIONS[0].name);
  const [hostelBuilding, setHostelBuilding] = useState('');
  const [reportedBy, setReportedBy] = useState('VIT Student');
  const [severity, setSeverity] = useState(3);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);

    try {
      // Call AI Triage API endpoint
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          category,
          campus_location: campusLocation,
          imageBase64: imagePreview,
        }),
      });

      let aiAnalysis = null;
      if (response.ok) {
        const data = await response.json();
        aiAnalysis = data.analysis;
      }

      // Add to store with AI output or automatic spatial engine fallback
      const created = addIncident({
        category,
        description,
        campus_location: campusLocation,
        hostel_building: hostelBuilding,
        reported_by: reportedBy,
        severity: aiAnalysis ? aiAnalysis.severity : severity,
        image_url: imagePreview || undefined,
        video_url: videoName ? `uploaded-${videoName}` : undefined,
      });

      // Confetti feedback
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });

      setSuccessMessage(
        `Emergency reported successfully! AI assigned severity ${created.severity} (${created.priority} PRIORITY). Dispatching nearest team...`
      );

      setTimeout(() => {
        router.push('/dashboard');
      }, 1800);
    } catch (err) {
      console.error('Error submitting incident:', err);
      // Fallback add
      addIncident({
        category,
        description,
        campus_location: campusLocation,
        hostel_building: hostelBuilding,
        reported_by: reportedBy,
        severity,
        image_url: imagePreview || undefined,
      });
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-2">
      {/* Title Card */}
      <div className="glass-panel p-5 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-950/40 via-navy-900 to-navy-950 flex items-center space-x-4">
        <div className="p-3 rounded-xl bg-red-950 border border-red-500/50 text-red-400">
          <AlertTriangle className="w-7 h-7 animate-pulse" />
        </div>
        <div>
          <h1 className="text-lg font-bold font-mono text-slate-100 uppercase tracking-wider">
            VIT Campus Emergency Reporting Portal
          </h1>
          <p className="text-xs text-slate-400">
            Submit emergency incidents occurring inside VIT Vellore campus for immediate AI classification & spatial triage.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="glass-panel p-4 rounded-xl border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 text-xs font-mono flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-xl border border-cyan-500/20 space-y-5">
        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-cyan-300 uppercase block">
            1. Emergency Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as EmergencyCategory)}
            className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Campus Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-cyan-300 uppercase block">
              2. Campus Location *
            </label>
            <select
              value={campusLocation}
              onChange={(e) => setCampusLocation(e.target.value)}
              className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-100 font-medium focus:outline-none focus:border-cyan-400"
              required
            >
              {VIT_CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.name}>
                  {loc.name} ({loc.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-400 uppercase block">
              Hostel / Specific Room / Block (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Block C - Room 302 / 2nd Floor Lab"
              value={hostelBuilding}
              onChange={(e) => setHostelBuilding(e.target.value)}
              className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-cyan-300 uppercase block">
            3. Incident Description *
          </label>
          <textarea
            rows={4}
            placeholder="Describe what happened, injuries, hazard extent, or assistance required..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            required
          />
        </div>

        {/* Media Uploads */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-400 uppercase block">
              Photo Upload (AI Vision Analysis)
            </label>
            <div className="border border-dashed border-slate-700 hover:border-cyan-500 rounded-lg p-3 text-center cursor-pointer bg-navy-950/60 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-slate-400">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <span className="text-[11px]">
                  {imagePreview ? 'Photo Attached (Click to change)' : 'Click to Upload Photo'}
                </span>
              </div>
            </div>
            {imagePreview && (
              <div className="mt-2 rounded-lg overflow-hidden border border-cyan-500/30 max-h-32">
                <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-400 uppercase block">
              Optional Video Clip
            </label>
            <div className="border border-dashed border-slate-700 hover:border-cyan-500 rounded-lg p-3 text-center cursor-pointer bg-navy-950/60 relative">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center justify-center space-y-1 text-slate-400">
                <Video className="w-5 h-5 text-amber-400" />
                <span className="text-[11px]">
                  {videoName ? videoName : 'Click to Upload Video'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reporter Name & Severity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-semibold text-slate-400 uppercase block">
              Reported By
            </label>
            <input
              type="text"
              value={reportedBy}
              onChange={(e) => setReportedBy(e.target.value)}
              className="w-full px-3 py-2 bg-navy-950 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-semibold text-slate-400 uppercase">
                Initial Severity Assessment
              </label>
              <span className="text-xs font-bold font-mono text-cyan-400">{severity} / 5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={severity}
              onChange={(e) => setSeverity(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold font-mono text-sm tracking-wider uppercase shadow-lg shadow-cyan-950/80 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-cyan-200" />
              <span>RUNNING GEMINI AI CLASSIFICATION...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-cyan-300" />
              <span>SUBMIT EMERGENCY REPORT TO SENTINEL-AI</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
