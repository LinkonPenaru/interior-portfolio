import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Navigation,
  Eye,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Briefcase,
  HelpCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import {
  AboutProfile,
  EducationEntry,
  EducationLevel,
  GradeSystem,
  ProfileLink,
  ValidationErrors,
} from '../../types/about';
import { aboutService, normalizeDecimal } from '../../services/aboutService';

interface EditAboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updated: AboutProfile) => void;
}

const COMMON_CITIES = [
  { displayText: 'Mumbai, Maharashtra, India', city: 'Mumbai', region: 'Maharashtra', country: 'IN - India', timezone: 'Asia/Kolkata', lat: 19.0760, lng: 72.8777 },
  { displayText: 'Dhaka, Bangladesh', city: 'Dhaka', region: 'Dhaka Division', country: 'BD - Bangladesh', timezone: 'Asia/Dhaka', lat: 23.8103, lng: 90.4125 },
  { displayText: 'Delhi, India', city: 'Delhi', region: 'National Capital Region', country: 'IN - India', timezone: 'Asia/Kolkata', lat: 28.6139, lng: 77.2090 },
  { displayText: 'Bengaluru, Karnataka, India', city: 'Bengaluru', region: 'Karnataka', country: 'IN - India', timezone: 'Asia/Kolkata', lat: 12.9716, lng: 77.5946 },
  { displayText: 'London, United Kingdom', city: 'London', region: 'Greater London', country: 'GB - United Kingdom', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
  { displayText: 'New York, NY, USA', city: 'New York', region: 'New York', country: 'US - United States', timezone: 'America/New_York', lat: 40.7128, lng: -74.0060 },
  { displayText: 'Dubai, United Arab Emirates', city: 'Dubai', region: 'Dubai Emirate', country: 'AE - United Arab Emirates', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
];

export const EditAboutModal: React.FC<EditAboutModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [profile, setProfile] = useState<AboutProfile | null>(null);
  const [initialProfile, setInitialProfile] = useState<AboutProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'location' | 'preview'>('profile');
  const [statusToast, setStatusToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Geolocation state
  const [geoLoading, setGeoLoading] = useState<boolean>(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [locationSearch, setLocationSearch] = useState<string>('');
  const [citySuggestions, setCitySuggestions] = useState<typeof COMMON_CITIES>([]);

  // Education state
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [deleteConfirmEduId, setDeleteConfirmEduId] = useState<string | null>(null);

  // Concurrency conflict modal state
  const [conflictState, setConflictState] = useState<{
    serverProfile: AboutProfile;
    loadedVersion: number;
    serverVersion: number;
  } | null>(null);

  const firstErrorRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  // Load initial profile data
  const loadProfileData = async () => {
    setLoading(true);
    try {
      const data = await aboutService.getProfile();
      setProfile(JSON.parse(JSON.stringify(data)));
      setInitialProfile(JSON.parse(JSON.stringify(data)));
      setIsDirty(false);
      setErrors({});
      setConflictState(null);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadProfileData();
    }
  }, [isOpen]);

  // Prevent accidental unload with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !saving) {
        handleCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, saving, isDirty]);

  if (!isOpen) return null;

  const showToast = (type: 'success' | 'error', message: string) => {
    setStatusToast({ type, message });
    setTimeout(() => setStatusToast(null), 5000);
  };

  const updateField = <K extends keyof AboutProfile>(key: K, value: AboutProfile[K]) => {
    if (!profile) return;
    setProfile({ ...profile, [key]: value });
    setIsDirty(true);
    // Clear field-specific error
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const updateLocationField = (key: string, value: unknown) => {
    if (!profile) return;
    const currentLocation = profile.location || { displayText: '', showExactLocation: false };
    setProfile({
      ...profile,
      location: { ...currentLocation, [key]: value },
    });
    setIsDirty(true);
  };

  // City Autocomplete filter
  const handleLocationSearchChange = (val: string) => {
    setLocationSearch(val);
    if (!val.trim()) {
      setCitySuggestions([]);
      return;
    }
    const q = val.toLowerCase();
    const matches = COMMON_CITIES.filter(
      (c) =>
        c.displayText.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
    setCitySuggestions(matches);
  };

  const applyCitySuggestion = (city: typeof COMMON_CITIES[0]) => {
    if (!profile) return;
    setProfile({
      ...profile,
      location: {
        displayText: city.displayText,
        city: city.city,
        region: city.region,
        country: city.country,
        timezone: city.timezone,
        latitude: city.lat,
        longitude: city.lng,
        showExactLocation: profile.location?.showExactLocation ?? false,
      },
    });
    setLocationSearch('');
    setCitySuggestions([]);
    setIsDirty(true);
    showToast('success', `Location updated to ${city.displayText}`);
  };

  // Geolocation handler
  const handleUseCurrentLocation = () => {
    setGeoNotice(null);

    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser.');
      return;
    }

    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setGeoNotice('Geolocation requires a secure HTTPS context.');
      return;
    }

    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeoLoading(false);
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));

        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

        if (!profile) return;
        const currentLoc = profile.location || { displayText: '', showExactLocation: false };

        setProfile({
          ...profile,
          location: {
            ...currentLoc,
            latitude: lat,
            longitude: lng,
            timezone: tz,
            displayText: currentLoc.displayText || `Coordinates: ${lat}, ${lng}`,
          },
        });
        setIsDirty(true);
        setGeoNotice(`Captured coordinates: ${lat}° N, ${lng}° E. Please verify the display city name.`);
        showToast('success', 'Location coordinates detected successfully.');
      },
      (error) => {
        setGeoLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setGeoNotice('Location permission was denied. You can manually enter your city and coordinates below.');
            break;
          case error.TIMEOUT:
            setGeoNotice('Location request timed out. Please enter details manually.');
            break;
          case error.POSITION_UNAVAILABLE:
          default:
            setGeoNotice('Position information is currently unavailable.');
            break;
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Education item helpers
  const handleAddEducation = () => {
    if (!profile) return;
    const currentYear = new Date().getFullYear();
    const newEntry: EducationEntry = {
      id: `edu-${Date.now()}`,
      level: 'university',
      institution: '',
      program: '',
      startYear: currentYear,
      isOngoing: true,
      gradeSystem: 'cgpa',
      gradeScale: '10.0',
      gradeValue: '',
      showGrade: true,
      location: '',
      honors: '',
    };
    setProfile({
      ...profile,
      education: [...(profile.education || []), newEntry],
    });
    setEditingEduId(newEntry.id);
    setIsDirty(true);
  };

  const handleUpdateEducation = (id: string, updates: Partial<EducationEntry>) => {
    if (!profile) return;
    const updated = (profile.education || []).map((edu) => {
      if (edu.id !== id) return edu;
      const merged = { ...edu, ...updates };
      // If ongoing is toggled on, clear endYear
      if (updates.isOngoing) {
        delete merged.endYear;
      }
      return merged;
    });
    setProfile({ ...profile, education: updated });
    setIsDirty(true);
  };

  const handleRemoveEducation = (id: string) => {
    if (!profile) return;
    const updated = (profile.education || []).filter((e) => e.id !== id);
    setProfile({ ...profile, education: updated });
    setDeleteConfirmEduId(null);
    setIsDirty(true);
    showToast('success', 'Education entry removed.');
  };

  const handleMoveEducation = (index: number, direction: 'up' | 'down') => {
    if (!profile || !profile.education) return;
    const items = [...profile.education];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;

    const [moved] = items.splice(index, 1);
    items.splice(targetIdx, 0, moved);

    setProfile({ ...profile, education: items });
    setIsDirty(true);
  };

  // Links helpers
  const handleAddLink = () => {
    if (!profile) return;
    const currentLinks = profile.links || [];
    if (currentLinks.length >= 5) return;
    setProfile({
      ...profile,
      links: [...currentLinks, { label: '', url: 'https://' }],
    });
    setIsDirty(true);
  };

  const handleUpdateLink = (idx: number, updates: Partial<ProfileLink>) => {
    if (!profile) return;
    const links = [...(profile.links || [])];
    links[idx] = { ...links[idx], ...updates };
    setProfile({ ...profile, links });
    setIsDirty(true);
  };

  const handleRemoveLink = (idx: number) => {
    if (!profile) return;
    const links = (profile.links || []).filter((_, i) => i !== idx);
    setProfile({ ...profile, links });
    setIsDirty(true);
  };

  // Save handler
  const handleSave = async (forceOverwrite = false) => {
    if (!profile) return;
    setSaving(true);
    setErrors({});

    try {
      const res = await aboutService.saveProfile(profile, forceOverwrite);

      if (res.conflict) {
        setConflictState({
          serverProfile: res.conflict.serverProfile,
          loadedVersion: res.conflict.loadedVersion,
          serverVersion: res.conflict.serverVersion,
        });
        return;
      }

      if (!res.success) {
        if (res.errors) {
          setErrors(res.errors);
          showToast('error', 'Please resolve the highlighted validation errors.');
          // Auto switch to relevant tab if needed
          const firstKey = Object.keys(res.errors)[0];
          if (firstKey.startsWith('education')) setActiveTab('education');
          else if (firstKey.startsWith('location')) setActiveTab('location');
          else setActiveTab('profile');
        }
        return;
      }

      // Success
      setIsDirty(false);
      showToast('success', 'About & Vision profile saved successfully.');
      onSaved?.(res.profile!);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      showToast('error', (err as Error).message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (!initialProfile) return;
    if (confirm('Reset all changes to the last saved profile?')) {
      setProfile(JSON.parse(JSON.stringify(initialProfile)));
      setIsDirty(false);
      setErrors({});
      showToast('success', 'Reset to last saved profile.');
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm('You have unsaved changes. Discard changes and close?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (loading || !profile) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-cream-50 p-8 border border-stone-300 text-stone-800 text-sm font-mono flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading About & Vision Profile...</span>
        </div>
      </div>
    );
  }

  const currentYear = new Date().getFullYear();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-4xl bg-cream-50 border border-stone-300 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden rounded-none animate-fadeIn">
        
        {/* Header Bar */}
        <div className="px-6 py-4 bg-stone-900 text-cream-50 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-5 h-5 text-stone-300" />
            <div>
              <h2 id="modal-title" className="font-serif text-lg sm:text-xl font-light text-cream-100">
                Edit About & Academic Profile
              </h2>
              <p className="text-[10px] font-mono uppercase tracking-[0.12em] text-stone-400">
                Profile Version {profile.version} • Owner Configuration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-900/60 text-amber-200 border border-amber-700/80 text-[10px] font-mono uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Unsaved changes
              </span>
            )}
            <button
              type="button"
              onClick={handleCancel}
              className="p-1.5 text-stone-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-sand-100/50 px-6 shrink-0 overflow-x-auto">
          {[
            { id: 'profile', label: '1. Identity & Bio', icon: Briefcase },
            { id: 'location', label: '2. Location & Timezone', icon: MapPin },
            { id: 'education', label: `3. Education & Credentials (${profile.education?.length || 0})`, icon: GraduationCap },
            { id: 'preview', label: '4. Live Public Preview', icon: Eye },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 py-3 px-4 text-xs uppercase tracking-[0.12em] font-medium border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-stone-900 text-stone-950 font-semibold bg-cream-50'
                    : 'border-transparent text-stone-600 hover:text-stone-950'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Status Toast Notification */}
        {statusToast && (
          <div
            aria-live="polite"
            className={`px-6 py-2.5 text-xs font-mono uppercase tracking-wider flex items-center justify-between border-b ${
              statusToast.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
              <span>{statusToast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusToast(null)}
              className="text-xs hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto flex-grow space-y-8">
          
          {/* TAB 1: IDENTITY & BIO */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="fullName" className="text-xs font-mono uppercase tracking-[0.12em] text-stone-800 font-medium">
                    Full Legal / Professional Name <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {profile.fullName.length} / 80
                  </span>
                </div>
                <input
                  id="fullName"
                  type="text"
                  maxLength={80}
                  value={profile.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="e.g. Urvi G Eragola"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                    errors.fullName ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'
                  } focus:outline-none focus:border-stone-800 text-stone-900`}
                />
                {errors.fullName && <p className="text-xs text-rose-600 font-mono">{errors.fullName}</p>}
                <p className="text-[11px] text-stone-500 font-light">
                  Name presented prominently across hero headers, metadata cards, and architectural credits.
                </p>
              </div>

              {/* Headline */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="headline" className="text-xs font-mono uppercase tracking-[0.12em] text-stone-800 font-medium">
                    Professional Headline / Studio Role
                  </label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {(profile.headline || '').length} / 120
                  </span>
                </div>
                <input
                  id="headline"
                  type="text"
                  maxLength={120}
                  value={profile.headline || ''}
                  onChange={(e) => updateField('headline', e.target.value)}
                  placeholder="e.g. Interior Architecture & Spatial Design Practitioner"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 focus:outline-none focus:border-stone-800 text-stone-900"
                />
                <p className="text-[11px] text-stone-500 font-light">
                  Concise tagline displayed beside your biography.
                </p>
              </div>

              {/* Bio Statement */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="bio" className="text-xs font-mono uppercase tracking-[0.12em] text-stone-800 font-medium">
                    About Biography & Spatial Statement
                  </label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {(profile.bio || '').length} / 1000
                  </span>
                </div>
                <textarea
                  id="bio"
                  rows={5}
                  maxLength={1000}
                  value={profile.bio || ''}
                  onChange={(e) => updateField('bio', e.target.value)}
                  placeholder="Write a clear statement of your design philosophy, institution, and spatial practice..."
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                    errors.bio ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'
                  } focus:outline-none focus:border-stone-800 text-stone-900 leading-relaxed`}
                />
                {errors.bio && <p className="text-xs text-rose-600 font-mono">{errors.bio}</p>}
              </div>

              {/* Contact Info (Email & Phone) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-mono uppercase tracking-[0.12em] text-stone-800 font-medium">
                    Professional Contact Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="e.g. eragolaurvi@gmail.com"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                      errors.email ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'
                    } focus:outline-none focus:border-stone-800 text-stone-900`}
                  />
                  {errors.email && <p className="text-xs text-rose-600 font-mono">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs font-mono uppercase tracking-[0.12em] text-stone-800 font-medium">
                    International Phone (E.164)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={profile.phone || ''}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="+919876543210 or +8801712345678"
                    className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                      errors.phone ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-300'
                    } focus:outline-none focus:border-stone-800 text-stone-900`}
                  />
                  {errors.phone && <p className="text-xs text-rose-600 font-mono">{errors.phone}</p>}
                </div>
              </div>

              {/* External Links */}
              <div className="space-y-3 pt-2 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-800 font-medium">
                    External Portfolio Links (Max 5)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddLink}
                    disabled={(profile.links || []).length >= 5}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs uppercase tracking-wider bg-stone-900 text-cream-50 hover:bg-stone-800 disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {(profile.links || []).map((link, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateLink(idx, { label: e.target.value })}
                        placeholder="Label (e.g. LinkedIn)"
                        className="w-1/3 px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none focus:border-stone-800"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(idx, { url: e.target.value })}
                        placeholder="https://..."
                        className="flex-grow px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none focus:border-stone-800"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(idx)}
                        className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOCATION & TIMEZONE */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="p-4 bg-sand-100/60 border border-stone-300/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono uppercase tracking-[0.12em] text-stone-900 font-semibold block">
                      Quick City Matcher & Geocoding
                    </span>
                    <span className="text-[11px] text-stone-600 font-light">
                      Search city to automatically populate timezone, coordinates, and regional details.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={geoLoading}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-stone-900 text-cream-50 text-xs uppercase tracking-[0.12em] hover:bg-stone-800 transition-all shrink-0 shadow-sm"
                  >
                    {geoLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                    <span>Use My Current Location</span>
                  </button>
                </div>

                {geoNotice && (
                  <p className="text-xs font-mono text-stone-700 bg-white/80 p-2 border border-stone-200">
                    ℹ️ {geoNotice}
                  </p>
                )}

                {/* City Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => handleLocationSearchChange(e.target.value)}
                    placeholder="Search city presets (e.g. Dhaka, Mumbai, London)..."
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none focus:border-stone-800"
                  />
                  {citySuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-300 shadow-xl z-20 max-h-48 overflow-y-auto">
                      {citySuggestions.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => applyCitySuggestion(item)}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-sand-100 border-b border-stone-100 flex items-center justify-between"
                        >
                          <span className="font-medium text-stone-900">{item.displayText}</span>
                          <span className="text-[10px] font-mono text-stone-500">{item.timezone}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Display Text (Required if location is set) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="locDisplay" className="text-xs font-mono uppercase tracking-[0.12em] text-stone-800 font-medium">
                    Public Location Display Text <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {(profile.location?.displayText || '').length} / 120
                  </span>
                </div>
                <input
                  id="locDisplay"
                  type="text"
                  maxLength={120}
                  value={profile.location?.displayText || ''}
                  onChange={(e) => updateLocationField('displayText', e.target.value)}
                  placeholder="e.g. Mumbai, Maharashtra, India or Dhaka, Bangladesh"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border ${
                    errors['location.displayText'] ? 'border-rose-500' : 'border-stone-300'
                  } focus:outline-none focus:border-stone-800 text-stone-900`}
                />
                {errors['location.displayText'] && (
                  <p className="text-xs text-rose-600 font-mono">{errors['location.displayText']}</p>
                )}
              </div>

              {/* City, Region, Country */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">City</label>
                  <input
                    type="text"
                    value={profile.location?.city || ''}
                    onChange={(e) => updateLocationField('city', e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">Region / State</label>
                  <input
                    type="text"
                    value={profile.location?.region || ''}
                    onChange={(e) => updateLocationField('region', e.target.value)}
                    placeholder="e.g. Maharashtra"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">Country Code & Name</label>
                  <input
                    type="text"
                    value={profile.location?.country || ''}
                    onChange={(e) => updateLocationField('country', e.target.value)}
                    placeholder="e.g. IN - India"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* Timezone & Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">
                    IANA Timezone
                  </label>
                  <input
                    type="text"
                    value={profile.location?.timezone || ''}
                    onChange={(e) => updateLocationField('timezone', e.target.value)}
                    placeholder="e.g. Asia/Kolkata or Asia/Dhaka"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">Latitude (-90 to 90)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={profile.location?.latitude ?? ''}
                    onChange={(e) =>
                      updateLocationField(
                        'latitude',
                        e.target.value === '' ? undefined : parseFloat(e.target.value)
                      )
                    }
                    placeholder="19.0760"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">Longitude (-180 to 180)</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={profile.location?.longitude ?? ''}
                    onChange={(e) =>
                      updateLocationField(
                        'longitude',
                        e.target.value === '' ? undefined : parseFloat(e.target.value)
                      )
                    }
                    placeholder="72.8777"
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              {errors['location.coordinates'] && (
                <p className="text-xs text-rose-600 font-mono">{errors['location.coordinates']}</p>
              )}

              {/* Show Exact Location Toggle */}
              <div className="p-4 bg-white border border-stone-300 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-mono uppercase tracking-[0.12em] text-stone-900 font-medium">
                    Show Exact Location & Map Pin Publicly
                  </span>
                  <span className="block text-[11px] text-stone-500 font-light mt-0.5">
                    When off, only City and Country are displayed publicly to visitors. When on, exact coordinates and interactive map link are shown.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(profile.location?.showExactLocation)}
                  onChange={(e) => updateLocationField('showExactLocation', e.target.checked)}
                  className="w-5 h-5 accent-stone-900 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: EDUCATION & CREDENTIALS */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h3 className="font-serif text-lg text-stone-900 font-light">
                    Academic Degrees, Schools & Grades
                  </h3>
                  <p className="text-[11px] text-stone-500 font-light">
                    Education entries are sorted with ongoing studies first, followed by graduation year descending.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  disabled={(profile.education || []).length >= 10}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-900 text-cream-50 text-xs uppercase tracking-[0.12em] hover:bg-stone-800 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Education ({(profile.education || []).length}/10)</span>
                </button>
              </div>

              {/* Education Cards */}
              <div className="space-y-4">
                {(profile.education || []).length === 0 ? (
                  <div className="p-8 text-center border border-dashed border-stone-300 text-stone-500 text-xs font-mono">
                    No education entries added yet. Click &quot;Add Education&quot; to include your academic history.
                  </div>
                ) : (
                  profile.education?.map((edu, idx) => {
                    const isExpanded = editingEduId === edu.id;
                    const path = `education[${idx}]`;

                    return (
                      <div
                        key={edu.id}
                        className={`bg-white border transition-all ${
                          isExpanded ? 'border-stone-800 shadow-md' : 'border-stone-300'
                        }`}
                      >
                        {/* Summary Header */}
                        <div className="p-4 flex items-center justify-between bg-sand-50/70 border-b border-stone-200">
                          <div className="flex items-center gap-3">
                            <span className="px-2 py-0.5 bg-stone-900 text-cream-50 font-mono text-[10px] uppercase tracking-wider">
                              {edu.level}
                            </span>
                            <div>
                              <h4 className="font-serif text-base text-stone-900 font-medium">
                                {edu.institution || 'Untitled Institution'}
                              </h4>
                              <p className="text-[11px] text-stone-500 font-mono">
                                {edu.isOngoing ? `${edu.startYear} – Ongoing` : `${edu.startYear} – ${edu.endYear || edu.startYear}`}
                                {edu.showGrade && edu.gradeValue ? ` • ${edu.gradeSystem?.toUpperCase()}: ${edu.gradeValue}${edu.gradeScale ? `/${edu.gradeScale}` : ''}` : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            {/* Reorder Buttons */}
                            <button
                              type="button"
                              onClick={() => handleMoveEducation(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                              title="Move Up"
                            >
                              <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveEducation(idx, 'down')}
                              disabled={idx === (profile.education?.length || 0) - 1}
                              className="p-1.5 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                              title="Move Down"
                            >
                              <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Toggle Edit */}
                            <button
                              type="button"
                              onClick={() => setEditingEduId(isExpanded ? null : edu.id)}
                              className="px-2.5 py-1 text-xs uppercase tracking-wider border border-stone-300 hover:border-stone-900"
                            >
                              {isExpanded ? 'Collapse' : 'Edit'}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmEduId(edu.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                              title="Delete entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Delete Confirmation Alert */}
                        {deleteConfirmEduId === edu.id && (
                          <div className="p-3 bg-rose-50 border-b border-rose-200 flex items-center justify-between text-xs text-rose-900">
                            <span>Are you sure you want to delete this education entry?</span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRemoveEducation(edu.id)}
                                className="px-2 py-0.5 bg-rose-600 text-white uppercase text-[10px] tracking-wider"
                              >
                                Confirm Delete
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmEduId(null)}
                                className="px-2 py-0.5 bg-stone-200 text-stone-700 uppercase text-[10px] tracking-wider"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Collapsible Edit Form */}
                        {isExpanded && (
                          <div className="p-5 space-y-4">
                            {/* Row 1: Level & Institution */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">
                                  Level <span className="text-rose-600">*</span>
                                </label>
                                <select
                                  value={edu.level}
                                  onChange={(e) =>
                                    handleUpdateEducation(edu.id, {
                                      level: e.target.value as EducationLevel,
                                    })
                                  }
                                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                                >
                                  <option value="school">School / SSC</option>
                                  <option value="college">College / HSC / A-Levels</option>
                                  <option value="university">University / Degree</option>
                                  <option value="other">Other Credential</option>
                                </select>
                              </div>

                              <div className="sm:col-span-2 space-y-1">
                                <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">
                                  Institution Name (2–120 chars) <span className="text-rose-600">*</span>
                                </label>
                                <input
                                  type="text"
                                  maxLength={120}
                                  value={edu.institution}
                                  onChange={(e) =>
                                    handleUpdateEducation(edu.id, { institution: e.target.value })
                                  }
                                  placeholder="e.g. Rachana Sansad's Academy of Architecture"
                                  className={`w-full px-3 py-2 text-xs bg-white border ${
                                    errors[`${path}.institution`] ? 'border-rose-500' : 'border-stone-300'
                                  } focus:outline-none`}
                                />
                                {errors[`${path}.institution`] && (
                                  <p className="text-[10px] text-rose-600 font-mono">{errors[`${path}.institution`]}</p>
                                )}
                              </div>
                            </div>

                            {/* Row 2: Program & Location */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">
                                  Program / Degree / Field
                                </label>
                                <input
                                  type="text"
                                  maxLength={120}
                                  value={edu.program || ''}
                                  onChange={(e) => handleUpdateEducation(edu.id, { program: e.target.value })}
                                  placeholder="e.g. Bachelor of Vocational Studies (B. Voc. Interior Design)"
                                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">
                                  Campus Location
                                </label>
                                <input
                                  type="text"
                                  maxLength={120}
                                  value={edu.location || ''}
                                  onChange={(e) => handleUpdateEducation(edu.id, { location: e.target.value })}
                                  placeholder="e.g. Prabhadevi, Mumbai"
                                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                                />
                              </div>
                            </div>

                            {/* Row 3: Timeline & Ongoing */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                              <div className="space-y-1">
                                <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">
                                  Start Year <span className="text-rose-600">*</span>
                                </label>
                                <input
                                  type="number"
                                  min={1950}
                                  max={currentYear + 1}
                                  value={edu.startYear}
                                  onChange={(e) =>
                                    handleUpdateEducation(edu.id, { startYear: parseInt(e.target.value, 10) })
                                  }
                                  className={`w-full px-3 py-2 text-xs bg-white border ${
                                    errors[`${path}.startYear`] ? 'border-rose-500' : 'border-stone-300'
                                  } focus:outline-none`}
                                />
                                {errors[`${path}.startYear`] && (
                                  <p className="text-[10px] text-rose-600 font-mono">{errors[`${path}.startYear`]}</p>
                                )}
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">
                                  End Year {edu.isOngoing && '(Disabled)'}
                                </label>
                                <input
                                  type="number"
                                  disabled={edu.isOngoing}
                                  min={edu.startYear}
                                  max={currentYear + 6}
                                  value={edu.endYear ?? ''}
                                  onChange={(e) =>
                                    handleUpdateEducation(edu.id, {
                                      endYear: e.target.value === '' ? undefined : parseInt(e.target.value, 10),
                                    })
                                  }
                                  placeholder="YYYY"
                                  className={`w-full px-3 py-2 text-xs bg-white border ${
                                    errors[`${path}.endYear`] ? 'border-rose-500' : 'border-stone-300'
                                  } focus:outline-none disabled:bg-stone-100 disabled:text-stone-400`}
                                />
                                {errors[`${path}.endYear`] && (
                                  <p className="text-[10px] text-rose-600 font-mono">{errors[`${path}.endYear`]}</p>
                                )}
                              </div>

                              <div className="pb-2 flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id={`ongoing-${edu.id}`}
                                  checked={edu.isOngoing}
                                  onChange={(e) =>
                                    handleUpdateEducation(edu.id, { isOngoing: e.target.checked })
                                  }
                                  className="w-4 h-4 accent-stone-900 cursor-pointer"
                                />
                                <label
                                  htmlFor={`ongoing-${edu.id}`}
                                  className="text-xs font-mono uppercase tracking-wider text-stone-800 cursor-pointer"
                                >
                                  Currently Ongoing
                                </label>
                              </div>
                            </div>

                            {/* Row 4: Grade System, Value, Scale & Visibility */}
                            <div className="p-3 bg-sand-100/60 border border-stone-200 space-y-3">
                              <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-stone-800 font-semibold block">
                                Grade & Academic Standing
                              </span>

                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div>
                                  <label className="text-[11px] font-mono uppercase text-stone-600 block mb-1">
                                    System
                                  </label>
                                  <select
                                    value={edu.gradeSystem || ''}
                                    onChange={(e) =>
                                      handleUpdateEducation(edu.id, {
                                        gradeSystem: (e.target.value as GradeSystem) || undefined,
                                        gradeScale: e.target.value === 'percentage' ? '100' : (edu.gradeScale || '4.0'),
                                      })
                                    }
                                    className="w-full px-2 py-1.5 text-xs bg-white border border-stone-300"
                                  >
                                    <option value="">None / Not Disclosed</option>
                                    <option value="cgpa">CGPA</option>
                                    <option value="gpa">GPA</option>
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="division">Division</option>
                                    <option value="letter">Letter Grade (A+, A, etc.)</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="text-[11px] font-mono uppercase text-stone-600 block mb-1">
                                    Grade Value
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.gradeValue || ''}
                                    onChange={(e) =>
                                      handleUpdateEducation(edu.id, {
                                        gradeValue: normalizeDecimal(e.target.value),
                                      })
                                    }
                                    placeholder={edu.gradeSystem === 'division' ? 'First Division' : 'e.g. 3.85 or 85'}
                                    className={`w-full px-2 py-1.5 text-xs bg-white border ${
                                      errors[`${path}.gradeValue`] ? 'border-rose-500' : 'border-stone-300'
                                    }`}
                                  />
                                </div>

                                {(edu.gradeSystem === 'gpa' || edu.gradeSystem === 'cgpa') && (
                                  <div>
                                    <label className="text-[11px] font-mono uppercase text-stone-600 block mb-1">
                                      Scale Max
                                    </label>
                                    <select
                                      value={edu.gradeScale || '4.0'}
                                      onChange={(e) =>
                                        handleUpdateEducation(edu.id, { gradeScale: e.target.value })
                                      }
                                      className="w-full px-2 py-1.5 text-xs bg-white border border-stone-300"
                                    >
                                      <option value="4.0">4.0 Scale</option>
                                      <option value="5.0">5.0 Scale</option>
                                      <option value="10.0">10.0 Scale</option>
                                    </select>
                                  </div>
                                )}

                                <div className="flex items-center gap-2 pt-5">
                                  <input
                                    type="checkbox"
                                    id={`showGrade-${edu.id}`}
                                    checked={edu.showGrade}
                                    onChange={(e) =>
                                      handleUpdateEducation(edu.id, { showGrade: e.target.checked })
                                    }
                                    className="w-4 h-4 accent-stone-900 cursor-pointer"
                                  />
                                  <label
                                    htmlFor={`showGrade-${edu.id}`}
                                    className="text-[11px] font-mono uppercase tracking-wider text-stone-800 cursor-pointer"
                                  >
                                    Show Publicly
                                  </label>
                                </div>
                              </div>

                              {errors[`${path}.gradeValue`] && (
                                <p className="text-[10px] text-rose-600 font-mono">{errors[`${path}.gradeValue`]}</p>
                              )}
                            </div>

                            {/* Honors */}
                            <div className="space-y-1">
                              <label className="text-xs font-mono uppercase tracking-[0.12em] text-stone-700">
                                Honors / Awards / Distinction
                              </label>
                              <input
                                type="text"
                                maxLength={200}
                                value={edu.honors || ''}
                                onChange={(e) => handleUpdateEducation(edu.id, { honors: e.target.value })}
                                placeholder="e.g. Dean's List 2024, Studio Excellence Award"
                                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 focus:outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LIVE PUBLIC PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              <div className="p-3 bg-stone-900 text-cream-100 text-xs font-mono flex items-center justify-between">
                <span>Live Public Preview (As Seen by Visitors)</span>
                <span className="text-stone-400">Read-Only</span>
              </div>

              {/* Preview Box styled identically to AboutPage */}
              <div className="p-6 bg-sand-50/80 border-l-2 border-stone-800 text-stone-800 space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-stone-500 block">
                  Designer Biography
                </span>
                <h3 className="font-serif text-2xl text-stone-950 font-light">
                  {profile.fullName || 'Designer Name'}
                </h3>
                {profile.headline && (
                  <p className="text-xs uppercase tracking-[0.12em] text-stone-600 font-medium font-mono">
                    {profile.headline}
                  </p>
                )}
                <p className="text-sm font-light leading-relaxed text-stone-700">
                  {profile.bio || 'No biography text provided.'}
                </p>

                {/* Location row */}
                {profile.location?.displayText && (
                  <div className="pt-2 flex items-center gap-2 text-xs text-stone-600 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" />
                    <span>
                      {profile.location.showExactLocation
                        ? `${profile.location.displayText} (${profile.location.latitude?.toFixed(2)}°, ${profile.location.longitude?.toFixed(2)}°)`
                        : `${profile.location.city || profile.location.displayText.split(',')[0]}, ${profile.location.country || profile.location.displayText.split(',').slice(-1)[0]}`}
                    </span>
                    {profile.location.timezone && (
                      <span className="text-stone-400">• Timezone: {profile.location.timezone}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Preview Education Section */}
              <div className="space-y-4">
                <h4 className="font-serif text-xl text-stone-900 font-light border-b border-stone-200 pb-2">
                  Academic Credentials & Studio Background
                </h4>
                {aboutService.getSortedEducationForPublic(profile.education).length === 0 ? (
                  <p className="text-xs font-mono text-stone-400">Education section will be hidden (no entries).</p>
                ) : (
                  <div className="space-y-3">
                    {aboutService.getSortedEducationForPublic(profile.education).map((edu) => (
                      <div key={edu.id} className="p-4 bg-white border border-stone-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase tracking-wider text-stone-900 font-semibold">
                            {edu.institution}
                          </span>
                          <span className="text-xs font-mono text-stone-500">
                            {edu.isOngoing ? `${edu.startYear} – Present` : `${edu.startYear} – ${edu.endYear || edu.startYear}`}
                          </span>
                        </div>
                        {edu.program && (
                          <p className="text-xs text-stone-700 font-light">{edu.program}</p>
                        )}
                        {edu.showGrade && edu.gradeValue && (
                          <p className="text-xs font-mono text-stone-600">
                            Standing: <strong className="text-stone-900">{edu.gradeValue}</strong>
                            {edu.gradeScale ? ` / ${edu.gradeScale}` : ''} ({edu.gradeSystem?.toUpperCase()})
                          </p>
                        )}
                        {edu.honors && (
                          <p className="text-[11px] text-stone-500 italic">★ {edu.honors}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* 409 Conflict Dialog Modal */}
        {conflictState && (
          <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm z-30 flex items-center justify-center p-6">
            <div className="bg-cream-50 border border-stone-800 max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-2.5 text-amber-700 font-serif text-lg font-medium">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Conflict Detected (409)</span>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                This profile was updated elsewhere (Server Version: <strong>{conflictState.serverVersion}</strong> vs Your Loaded Version: <strong>{conflictState.loadedVersion}</strong>).
              </p>
              <div className="p-3 bg-stone-100 text-xs font-mono text-stone-600 border border-stone-200">
                Current Remote Name: <strong>{conflictState.serverProfile.fullName}</strong><br />
                Last Updated: {new Date(conflictState.serverProfile.updatedAt).toLocaleTimeString()}
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfile(JSON.parse(JSON.stringify(conflictState.serverProfile)));
                    setInitialProfile(JSON.parse(JSON.stringify(conflictState.serverProfile)));
                    setConflictState(null);
                    setIsDirty(false);
                    showToast('success', 'Reloaded latest profile version from server.');
                  }}
                  className="px-3.5 py-2 text-xs uppercase tracking-wider border border-stone-400 bg-white hover:bg-stone-100 text-stone-900"
                >
                  Reload Latest
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConflictState(null);
                    handleSave(true);
                  }}
                  className="px-4 py-2 text-xs uppercase tracking-wider bg-rose-900 text-cream-50 hover:bg-rose-800 font-medium"
                >
                  Overwrite Remote
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions Bar */}
        <div className="px-6 py-4 bg-sand-100/70 border-t border-stone-300 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || saving}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs uppercase tracking-[0.12em] text-stone-600 hover:text-stone-950 disabled:opacity-40"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 text-xs uppercase tracking-[0.12em] border border-stone-300 bg-white text-stone-800 hover:border-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              disabled={saving || !isDirty}
              className="inline-flex items-center gap-2 px-6 py-2 bg-stone-900 text-cream-50 text-xs uppercase tracking-[0.12em] hover:bg-stone-800 transition-all disabled:opacity-50 shadow-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving Profile...' : 'Save Profile'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
