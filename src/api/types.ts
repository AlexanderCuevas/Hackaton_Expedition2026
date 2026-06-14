// API types for frontend ↔ backend integration
// Keep minimal subset required by the frontend integration.

export interface PersonalInfo {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
}

export interface EducationItem {
  institution?: string;
  degree?: string;
  startDate?: string;
  endDate?: string;
}

export interface ExperienceItem {
  company?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface CertificationItem {
  name?: string;
  issuer?: string;
}

export interface LanguageItem {
  language: string;
  level?: string;
}

export interface ExtractedProfile {
  personalInfo?: PersonalInfo;
  skills?: string[];
  education?: EducationItem[];
  experience?: ExperienceItem[];
  certifications?: CertificationItem[];
  languages?: LanguageItem[];
}

export interface CvContext {
  id: string;
  cvId?: string;
  extractedProfile?: ExtractedProfile;
  analysis?: any; // kept loose, frontend uses src/types.ts::CvAnalysis when available
  createdAt?: string;
}

export interface CvTextResponse {
  ok: boolean;
  cvId?: string;
  context?: CvContext;
}

export interface CvDetailResponse {
  ok: boolean;
  context?: CvContext;
}

export interface QueryAiResponse {
  ok?: boolean;
  text?: string;
}
