/**
 * About & Vision Profile Service Layer
 * 
 * Includes client & server-grade validation, sanitization, concurrency/conflict detection (409),
 * rate limiting, and unified persistent storage.
 */

import {
  AboutProfile,
  EducationEntry,
  SaveProfileResult,
  ValidationErrors,
} from '../types/about';
import { designerConfig } from '../config/designer';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY = 'portfolio_about_profile_v2';
const RATE_LIMIT_KEY = 'portfolio_about_save_timestamps_v2';
const MAX_SAVES_PER_MINUTE = 10;

/**
 * Default Seed Profile matching the portfolio owner
 */
export const DEFAULT_ABOUT_PROFILE: AboutProfile = {
  fullName: designerConfig.fullName || 'Urvi G Eragola',
  headline: 'Interior Architecture & Spatial Design Practitioner',
  bio: designerConfig.bioParagraphs?.[0] || 
    'I am an interior design practitioner based in Mumbai, studying at Rachana Sansad\'s Academy of Architecture. My portfolio reflects a methodical approach to residential and commercial spatial challenges, emphasizing foundational hand-drafted layouts, joinery sections, and comprehensive specification schedules.',
  email: designerConfig.contactEmail || 'eragolaurvi@gmail.com',
  phone: '+919876543210',
  links: [
    { label: 'LinkedIn', url: 'https://linkedin.com/in/' },
    { label: 'Instagram', url: 'https://instagram.com/' },
  ],
  location: {
    displayText: 'Mumbai, Maharashtra, India',
    city: 'Mumbai',
    region: 'Maharashtra',
    country: 'IN - India',
    timezone: 'Asia/Kolkata',
    latitude: 19.0178,
    longitude: 72.8302,
    showExactLocation: false,
  },
  education: [
    {
      id: 'edu-rachana-sansad',
      level: 'university',
      institution: "Rachana Sansad's Academy of Architecture",
      program: 'Bachelor of Vocational Studies (B. Voc. Interior Design)',
      startYear: 2024,
      isOngoing: true,
      gradeSystem: 'cgpa',
      gradeScale: '10.0',
      gradeValue: '9.2',
      showGrade: true,
      honors: 'Roll No: 14 • First Year Studio Distinction',
      location: 'Prabhadevi, Mumbai',
    },
    {
      id: 'edu-high-school',
      level: 'college',
      institution: 'Mumbai Junior College of Arts & Commerce',
      program: 'Higher Secondary Certificate (HSC) in Design & Arts',
      startYear: 2022,
      endYear: 2024,
      isOngoing: false,
      gradeSystem: 'percentage',
      gradeValue: '88.5',
      showGrade: true,
      honors: 'Visual Arts Merit Certificate',
      location: 'Mumbai, India',
    },
  ],
  updatedAt: new Date().toISOString(),
  version: 1,
};

// ==========================================
// SANITIZATION HELPERS
// ==========================================

export const sanitizeString = (str?: string): string => {
  if (!str) return '';
  return str
    // Strip control characters (except space, tab, newline)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Collapse repeated internal whitespace
    .replace(/[^\S\r\n]+/g, ' ')
    .trim();
};

export const normalizeDecimal = (val?: string): string => {
  if (!val) return '';
  return val.trim().replace(',', '.');
};

export const escapeHtml = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// ==========================================
// VALIDATION ENGINE
// ==========================================

export const validateProfile = (profile: AboutProfile): ValidationErrors => {
  const errors: ValidationErrors = {};
  const currentYear = new Date().getFullYear();

  // 1. Full Name (required, 2-80 chars)
  const cleanName = sanitizeString(profile.fullName);
  if (!cleanName) {
    errors.fullName = 'Full Name is required.';
  } else if (cleanName.length < 2 || cleanName.length > 80) {
    errors.fullName = 'Full Name must be between 2 and 80 characters.';
  }

  // 2. Headline (optional, max 120 chars)
  if (profile.headline && sanitizeString(profile.headline).length > 120) {
    errors.headline = 'Headline cannot exceed 120 characters.';
  }

  // 3. Bio (optional, max 1000 chars)
  if (profile.bio && sanitizeString(profile.bio).length > 1000) {
    errors.bio = 'Bio cannot exceed 1000 characters.';
  }

  // 4. Email (optional, valid format)
  if (profile.email) {
    const cleanEmail = sanitizeString(profile.email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (cleanEmail && !emailRegex.test(cleanEmail)) {
      errors.email = 'Please provide a valid email address.';
    }
  }

  // 5. Phone (optional, E.164 format: +[country code][digits])
  if (profile.phone) {
    const cleanPhone = sanitizeString(profile.phone).replace(/[\s-]/g, '');
    const e164Regex = /^\+[1-9]\d{6,14}$/;
    if (cleanPhone && !e164Regex.test(cleanPhone)) {
      errors.phone = 'Phone number must be in international E.164 format (e.g. +8801XXXXXXXXX or +91XXXXXXXXXX).';
    }
  }

  // 6. Links (optional, max 5, https:// only)
  if (profile.links) {
    if (profile.links.length > 5) {
      errors.links = 'Maximum 5 links allowed.';
    }
    profile.links.forEach((link, idx) => {
      const cleanUrl = sanitizeString(link.url);
      if (!cleanUrl) {
        errors[`links[${idx}].url`] = 'URL is required.';
      } else if (!cleanUrl.startsWith('https://')) {
        errors[`links[${idx}].url`] = 'Link must be secure and start with https://';
      } else if (cleanUrl.toLowerCase().startsWith('javascript:') || cleanUrl.toLowerCase().startsWith('data:')) {
        errors[`links[${idx}].url`] = 'Invalid URL protocol.';
      }
    });
  }

  // 7. Location validation
  if (profile.location) {
    const loc = profile.location;
    const cleanDisplay = sanitizeString(loc.displayText);
    if (!cleanDisplay) {
      errors['location.displayText'] = 'Display text is required if location is set (e.g. "Dhaka, Bangladesh").';
    } else if (cleanDisplay.length > 120) {
      errors['location.displayText'] = 'Location display text cannot exceed 120 characters.';
    }

    if (loc.city && sanitizeString(loc.city).length > 80) {
      errors['location.city'] = 'City cannot exceed 80 characters.';
    }
    if (loc.region && sanitizeString(loc.region).length > 80) {
      errors['location.region'] = 'Region cannot exceed 80 characters.';
    }

    // Latitude & Longitude: both or neither
    const hasLat = loc.latitude !== undefined && loc.latitude !== null && !isNaN(loc.latitude);
    const hasLng = loc.longitude !== undefined && loc.longitude !== null && !isNaN(loc.longitude);

    if (hasLat !== hasLng) {
      errors['location.coordinates'] = 'Both latitude and longitude must be provided together, or neither.';
    } else if (hasLat && hasLng) {
      if (loc.latitude! < -90 || loc.latitude! > 90) {
        errors['location.latitude'] = 'Latitude must be between -90 and 90 degrees.';
      }
      if (loc.longitude! < -180 || loc.longitude! > 180) {
        errors['location.longitude'] = 'Longitude must be between -180 and 180 degrees.';
      }
    }
  }

  // 8. Education validation
  if (profile.education) {
    if (profile.education.length > 10) {
      errors.education = 'Maximum 10 education entries allowed.';
    }

    const seenEntries = new Set<string>();

    profile.education.forEach((edu, idx) => {
      const path = `education[${idx}]`;

      // Required Level
      if (!['school', 'college', 'university', 'other'].includes(edu.level)) {
        errors[`${path}.level`] = 'Please select a valid education level.';
      }

      // Required Institution (2-120 chars)
      const cleanInst = sanitizeString(edu.institution);
      if (!cleanInst) {
        errors[`${path}.institution`] = 'Institution name is required.';
      } else if (cleanInst.length < 2 || cleanInst.length > 120) {
        errors[`${path}.institution`] = 'Institution name must be between 2 and 120 characters.';
      }

      // Program (max 120 chars)
      if (edu.program && sanitizeString(edu.program).length > 120) {
        errors[`${path}.program`] = 'Program cannot exceed 120 characters.';
      }

      // Start Year (1950 to currentYear + 1)
      if (!edu.startYear || isNaN(edu.startYear)) {
        errors[`${path}.startYear`] = 'Start Year is required.';
      } else if (edu.startYear < 1950 || edu.startYear > currentYear + 1) {
        errors[`${path}.startYear`] = `Start Year must be between 1950 and ${currentYear + 1}.`;
      }

      // End Year vs Ongoing
      if (edu.isOngoing && edu.endYear) {
        errors[`${path}.endYear`] = 'An ongoing education entry cannot have an End Year specified.';
      }

      if (!edu.isOngoing && edu.endYear !== undefined && edu.endYear !== null) {
        if (edu.endYear < edu.startYear) {
          errors[`${path}.endYear`] = 'End Year must be greater than or equal to Start Year.';
        } else if (edu.endYear > currentYear + 6) {
          errors[`${path}.endYear`] = `End Year cannot exceed ${currentYear + 6}.`;
        }
      }

      // Grade System & Value Rules
      const rawGrade = sanitizeString(edu.gradeValue);
      const normalizedGrade = normalizeDecimal(rawGrade);

      if (edu.gradeSystem && !rawGrade) {
        errors[`${path}.gradeValue`] = 'Grade value is required when a grade system is selected.';
      }
      if (!edu.gradeSystem && rawGrade) {
        errors[`${path}.gradeSystem`] = 'Please choose a grade system for the entered grade.';
      }

      if (edu.gradeSystem && rawGrade) {
        if (edu.gradeSystem === 'gpa' || edu.gradeSystem === 'cgpa') {
          const numValue = parseFloat(normalizedGrade);
          const scaleNum = parseFloat(edu.gradeScale || '4.0');

          if (isNaN(numValue)) {
            errors[`${path}.gradeValue`] = 'Grade must be a numeric decimal value.';
          } else if (isNaN(scaleNum) || scaleNum <= 0) {
            errors[`${path}.gradeScale`] = 'A valid positive grade scale (e.g. 4.0 or 5.0) is required.';
          } else if (numValue < 0 || numValue > scaleNum) {
            errors[`${path}.gradeValue`] = `Grade (${numValue}) must be between 0 and scale maximum (${scaleNum}).`;
          }
        } else if (edu.gradeSystem === 'percentage') {
          const numValue = parseFloat(normalizedGrade);
          if (isNaN(numValue)) {
            errors[`${path}.gradeValue`] = 'Percentage must be a numeric value.';
          } else if (numValue < 0 || numValue > 100) {
            errors[`${path}.gradeValue`] = 'Percentage must be between 0 and 100.';
          }
        }
      }

      // Duplicate check: same institution, level, and startYear
      const duplicateKey = `${cleanInst.toLowerCase()}|${edu.level}|${edu.startYear}`;
      if (seenEntries.has(duplicateKey)) {
        errors[`${path}.duplicate`] = `Duplicate entry: "${cleanInst}" (${edu.level}, starting ${edu.startYear}) is already listed.`;
      } else {
        seenEntries.add(duplicateKey);
      }

      // Honors & Location length
      if (edu.honors && sanitizeString(edu.honors).length > 200) {
        errors[`${path}.honors`] = 'Honors cannot exceed 200 characters.';
      }
      if (edu.location && sanitizeString(edu.location).length > 120) {
        errors[`${path}.location`] = 'Location cannot exceed 120 characters.';
      }
    });
  }

  return errors;
};

// ==========================================
// STORAGE & CONCURRENCY LAYER
// ==========================================

export const aboutService = {
  /**
   * Retrieves the current About profile
   */
  async getProfile(): Promise<AboutProfile> {
    // 1. Try Supabase if configured
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('about_profile')
          .select('*')
          .order('version', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data && data.profile_data) {
          return data.profile_data as AboutProfile;
        }
      } catch (err) {
        console.warn('Supabase profile fetch error, using local fallback:', err);
      }
    }

    // 2. Fallback to LocalStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed as AboutProfile;
      }
    } catch (e) {
      console.warn('Failed to parse local profile:', e);
    }

    // 3. Return Default Seed Profile
    return DEFAULT_ABOUT_PROFILE;
  },

  /**
   * Checks rate limiting (Max 10 saves per minute)
   */
  checkRateLimit(): boolean {
    try {
      const now = Date.now();
      const raw = localStorage.getItem(RATE_LIMIT_KEY);
      let timestamps: number[] = raw ? JSON.parse(raw) : [];
      // Keep timestamps from the last 60 seconds
      timestamps = timestamps.filter((t) => now - t < 60000);
      if (timestamps.length >= MAX_SAVES_PER_MINUTE) {
        return false;
      }
      timestamps.push(now);
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(timestamps));
      return true;
    } catch {
      return true;
    }
  },

  /**
   * Saves or updates the profile with concurrency conflict detection (409)
   */
  async saveProfile(
    profileToSave: AboutProfile,
    forceOverwrite = false
  ): Promise<SaveProfileResult> {
    // 1. Rate limit check
    if (!this.checkRateLimit()) {
      return {
        success: false,
        errors: {
          rateLimit: 'Rate limit reached (maximum 10 saves per minute). Please wait a moment before saving again.',
        },
      };
    }

    // 2. Deep Clean & Normalize
    const cleanProfile: AboutProfile = {
      fullName: sanitizeString(profileToSave.fullName),
      headline: sanitizeString(profileToSave.headline) || undefined,
      bio: sanitizeString(profileToSave.bio) || undefined,
      email: sanitizeString(profileToSave.email) || undefined,
      phone: sanitizeString(profileToSave.phone) || undefined,
      links: (profileToSave.links || [])
        .map((l) => ({ label: sanitizeString(l.label), url: sanitizeString(l.url) }))
        .filter((l) => l.label && l.url),
      location: profileToSave.location
        ? {
            displayText: sanitizeString(profileToSave.location.displayText),
            city: sanitizeString(profileToSave.location.city) || undefined,
            region: sanitizeString(profileToSave.location.region) || undefined,
            country: sanitizeString(profileToSave.location.country) || undefined,
            timezone: sanitizeString(profileToSave.location.timezone) || undefined,
            latitude: profileToSave.location.latitude,
            longitude: profileToSave.location.longitude,
            showExactLocation: Boolean(profileToSave.location.showExactLocation),
          }
        : undefined,
      education: (profileToSave.education || []).map((edu) => ({
        ...edu,
        institution: sanitizeString(edu.institution),
        program: sanitizeString(edu.program) || undefined,
        gradeValue: normalizeDecimal(sanitizeString(edu.gradeValue)) || undefined,
        honors: sanitizeString(edu.honors) || undefined,
        location: sanitizeString(edu.location) || undefined,
      })),
      updatedAt: new Date().toISOString(),
      version: (profileToSave.version || 1) + 1,
    };

    // 3. Strict Validation
    const validationErrors = validateProfile(cleanProfile);
    if (Object.keys(validationErrors).length > 0) {
      return {
        success: false,
        errors: validationErrors,
      };
    }

    // 4. Concurrency Conflict Check (Version comparison)
    const currentServerProfile = await this.getProfile();
    const loadedVersion = profileToSave.version;

    if (!forceOverwrite && currentServerProfile.version > loadedVersion) {
      return {
        success: false,
        conflict: {
          loadedVersion,
          serverVersion: currentServerProfile.version,
          serverProfile: currentServerProfile,
        },
      };
    }

    // If force overwriting, guarantee higher version
    if (forceOverwrite) {
      cleanProfile.version = Math.max(currentServerProfile.version, loadedVersion) + 1;
    }

    // 5. Persist to Storage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanProfile));
      
      // Dispatch custom reactive event for same tab & cross-tab sync
      window.dispatchEvent(new CustomEvent('portfolio_about_updated', { detail: cleanProfile }));
    } catch (e) {
      console.error('LocalStorage write failed:', e);
    }

    // Optional Supabase persistence
    if (isSupabaseConfigured()) {
      try {
        await supabase.from('about_profile').upsert({
          id: 'primary',
          version: cleanProfile.version,
          profile_data: cleanProfile,
          updated_at: cleanProfile.updatedAt,
        });
      } catch (err) {
        console.warn('Supabase upsert warning (local saved successfully):', err);
      }
    }

    return {
      success: true,
      profile: cleanProfile,
    };
  },

  /**
   * Sorts education for public display:
   * Ongoing entries first, then sorted by endYear descending.
   */
  getSortedEducationForPublic(entries?: EducationEntry[]): EducationEntry[] {
    if (!entries || entries.length === 0) return [];
    return [...entries].sort((a, b) => {
      // Ongoing entries first
      if (a.isOngoing && !b.isOngoing) return -1;
      if (!a.isOngoing && b.isOngoing) return 1;
      // Both ongoing: sort by startYear descending
      if (a.isOngoing && b.isOngoing) {
        return b.startYear - a.startYear;
      }
      // Both completed: sort by endYear descending
      const endA = a.endYear ?? a.startYear;
      const endB = b.endYear ?? b.startYear;
      if (endB !== endA) return endB - endA;
      return b.startYear - a.startYear;
    });
  },
};
