/**
 * Interface definitions for SkillPath AI
 */

export interface CognitiveProfileItem {
  subject: string;
  A: number; // user score
  B: number; // average score
  fullMark: number;
}

export interface PersonalityTrait {
  name: string;
  userScore: number;
  averageScore: number;
  leftLabel: string;
  rightLabel: string;
}

export interface UserProfile {
  name: string;
  career: string;
  semester: number; // 1 to 10 description
  experienceLevel: string; // Sin experiencia, Proyectos personales, Prácticas, Experiencia laboral
  targetRole: string;
  currentSkills: string[];
  softSkills?: string[];
  interests: string[];
  employabilityScore: number; // 0 to 100
  xp: number; // Experience points
  level: number; // Career path level
  progressToNextLevel: number; // percentage
  avatarUrl?: string; // base64 data URL for profile image
  cognitiveProfile?: CognitiveProfileItem[];
  personalityTraits?: PersonalityTrait[];
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
}

export type GapType = "tecnica" | "blanda" | "certificacion";
export type PriorityType = "alta" | "media" | "baja";

export interface SkillGap {
  skillName: string;
  category: GapType;
  priority: PriorityType;
  description: string;
  recommendedResource: string;
  status: "pendiente" | "en_progreso" | "completado";
}

export interface CareerMission {
  id: string;
  title: string;
  description: string;
  xpValue: number;
  type: "documento" | "aprendizaje" | "networking" | "simulacion";
  status: "bloqueado" | "disponible" | "completado";
  order: number;
  actionLabel: string;
  subtasks: { text: string; done: boolean }[];
  courseId?: string;
  externalSuggestionId?: string;
}

export interface CvAnalysis {
  score: number; // 0 to 100
  strengths: string[];
  weaknesses: string[];
  keywordsFound: string[];
  keywordsMissing: string[];
  generalFeedback: string; // Markdown supported
  atsFormattedCvAdvice: string; // Actionable prompt to refine
}

export interface CvExperiencia {
  rol: string;
  descripcion: string;
  ubicacion: string;
  fechaInicio: string;
  fechaFin: string;
  logros: string[];
}

export interface CvMeta {
  fileName: string;
  format: string;
  source: string;
  status: string;
  targetRole: string;
  analysisDate: string;
}

export interface Vacancy {
  id: string;
  company: string;
  logoUrl?: string;
  role: string;
  location: string;
  salary: string;
  matchScore: number; // 0 to 100
  description: string;
  skillsRequired: string[];
  skillsMissing: string[];
  tipsForApplying: string;
}

export interface InterviewMessage {
  role: "user" | "assistant";
  content: string;
}

export interface InterviewSession {
  roleName: string;
  messages: InterviewMessage[];
  isFinished: boolean;
  evaluation?: {
    score: number; // 0 to 100
    strengths: string[];
    improvements: string[];
    feedbackMessage: string;
  };
}

export interface SocialPost {
  id: string;
  authorName: string;
  authorCareer: string;
  authorSemester: number;
  avatarColor: string;
  content: string;
  date: string;
  likes: number;
  likedByUser: boolean;
  category: "logro" | "proyecto" | "ayuda" | "evento" | "general";
  comments: {
    authorName: string;
    content: string;
    date: string;
  }[];
}

export interface NetworkingContact {
  id: string;
  name: string;
  role: string;
  company: string;
  type: "mentor" | "reclutador" | "alumni";
  isConnected: boolean;
  isPending: boolean;
  compatibilityText: string;
  bio: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseCatalogItem {
  id: string;
  title: string;
  provider: string;
  badge: string;
  duration: string;
  pointsAwarded: number;
  cost: string;
  url: string;
  source: "internal" | "partner";
  linkedGap?: string;
  description: string;
  modules: CourseModule[];
  image?: string;
  code?: string;
  modality?: string;
  speaker?: string;
}

export interface EnrolledCourse {
  courseId: string;
  enrolledAt: string;
  progress: number;
  completedLessons: string[];
  source: "internal" | "external";
}

export interface ExternalCourseSuggestion {
  id: string;
  platform: string;
  title: string;
  instructor: string;
  price: string;
  originalPrice?: string;
  rating: number;
  students: string;
  linkedGap: string;
  url: string;
  highlight: string;
}

export type NotificationType =
  | "connection_request"
  | "connection_accepted"
  | "like"
  | "comment"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  actorName?: string;
  actorAvatar?: string;
  actionUrl?: string;
}
