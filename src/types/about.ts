/**
 * About & Vision Data Models and Validation Types
 */

export type EducationLevel = 'school' | 'college' | 'university' | 'other';

export type GradeSystem = 'gpa' | 'cgpa' | 'percentage' | 'division' | 'letter' | 'other';

export interface EducationEntry {
  id: string;
  level: EducationLevel;
  institution: string; // 2–120 chars
  program?: string; // max 120 chars
  startYear: number; // 1950 to currentYear + 1
  endYear?: number; // >= startYear and <= currentYear + 6
  isOngoing: boolean; // default false, cannot be true when endYear is set
  gradeSystem?: GradeSystem; // required if gradeValue is given
  gradeValue?: string; // numeric decimal or text ("First Division", "A+")
  gradeScale?: string; // e.g. "4.0", "5.0", "10.0"
  showGrade: boolean; // default true
  honors?: string; // max 200 chars
  location?: string; // max 120 chars
}

export interface ProfileLink {
  label: string;
  url: string; // Must start with https://
}

export interface ProfileLocation {
  displayText: string; // max 120 chars, e.g. "Dhaka, Bangladesh" or "Mumbai, India"
  city?: string; // max 80 chars
  region?: string; // max 80 chars
  country?: string; // ISO 3166-1 alpha-2 code plus display name (e.g. "BD - Bangladesh")
  timezone?: string; // IANA name, e.g. "Asia/Dhaka", "Asia/Kolkata"
  latitude?: number; // -90 to 90
  longitude?: number; // -180 to 180
  showExactLocation: boolean; // default false
}

export interface AboutProfile {
  fullName: string; // 2–80 chars
  headline?: string; // max 120 chars
  bio?: string; // max 1000 chars
  email?: string;
  phone?: string; // E.164 format (+8801..., +91...)
  links?: ProfileLink[]; // max 5
  location?: ProfileLocation;
  education?: EducationEntry[]; // max 10
  updatedAt: string; // ISO timestamp
  version: number; // incremented on every save for conflict detection
}

export interface ValidationErrors {
  [fieldPath: string]: string;
}

export interface SaveProfileResult {
  success: boolean;
  profile?: AboutProfile;
  errors?: ValidationErrors;
  conflict?: {
    loadedVersion: number;
    serverVersion: number;
    serverProfile: AboutProfile;
  };
}

export interface ChatbotChangeLog {
  id: string;
  timestamp: string;
  tool: string;
  description: string;
  previousValue: unknown;
  newValue: unknown;
}
