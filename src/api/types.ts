import type { CvAnalysis } from "../types";

/* ───────── Generic wrapper ───────── */

export interface ApiResponse<T = unknown> {
  ok: true;
  [key: string]: T | boolean;
}

export interface ApiErrorBody {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}

/* ───────── AI Query ───────── */

export interface AiQueryRequest {
  prompt: string;
  model?: string;
  max_tokens?: number;
  maxTokens?: number;
  max_words?: number;
  maxWords?: number;
  cvId?: string;
}

export interface AiQueryResponse {
  text: string;
}

/* ───────── CV Upload (file) ───────── */

export interface CvUploadResponse {
  ok: true;
  cvId: string;
  context: CvContext;
}

/* ───────── CV Text analysis ───────── */

export interface CvTextRequest {
  text?: string;
  cvText?: string;
  targetRole?: string;
  studentId?: string;
  fileName?: string;
}

export interface CvTextResponse {
  ok: true;
  cvId: string;
  context: CvContext;
}

/* ───────── CV Detail ───────── */

export interface CvDetailResponse {
  ok: true;
  context: CvContext;
}

/* ───────── CV List ───────── */

export interface CvListItem {
  id: string;
  fileName: string;
  fileType: string;
  targetRole: string;
  createdAt: string;
}

export interface CvListResponse {
  ok: true;
  cvs: CvListItem[];
}

/* ───────── Extracted profile from CV ───────── */

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  summary: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Certification {
  name: string;
  issuer: string;
}

export interface Language {
  language: string;
  level: string;
}

export interface ExtractedProfile {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: string[];
  certifications: Certification[];
  languages: Language[];
}

/* ───────── Shared CV context ───────── */

export interface CvContext {
  id: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  targetRole: string;
  studentId?: string;
  extractedText: string;
  extractedProfile: ExtractedProfile;
  analysis: CvAnalysis;
  createdAt: string;
}

/* ───────── WhatsApp ───────── */

export interface WhatsAppConfigResponse {
  ok: true;
  configured: boolean;
  hasToken: boolean;
  hasPhoneNumberId: boolean;
  phoneNumberId: string;
}

export interface WhatsAppSendRequest {
  to: string;
  type: "template" | "text";
  templateName?: string;
  languageCode?: string;
  text?: string;
  preview_url?: boolean;
}

export interface WhatsAppSendResponse {
  ok: true;
  payload: Record<string, unknown>;
  whatsappResponse: Record<string, unknown>;
}
