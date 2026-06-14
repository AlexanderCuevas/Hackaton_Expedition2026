import { UserProfile } from "./types";
import { getStudentCareerBundle } from "./cvMockData";

export interface ProfilePanelAchievement {
  id: string;
  label: string;
  iconKey: string;
  unlocked: boolean;
  xp: number;
}

export interface ProfilePanelData {
  bio: string;
  location: string;
  streak: number;
  cognitiveProfile: { subject: string; A: number; B: number }[];
  personalityTraits: {
    name: string;
    userScore: number;
    averageScore: number;
    leftLabel: string;
    rightLabel: string;
  }[];
  achievements: ProfilePanelAchievement[];
  techSkillLevels: Record<string, number>;
  skillsToDevelop: string[];
}

const PROFILE_BY_CODE: Record<string, ProfilePanelData> = {
  U22223419: {
    bio: "Estudiante de Ingeniería de Sistemas (7mo ciclo) orientado al desarrollo backend. Busco mi primer empleo aplicando SQL, JavaScript y construyendo proyectos en GitHub.",
    location: "Lima, Perú",
    streak: 3,
    cognitiveProfile: [
      { subject: "Razonamiento Lógico", A: 72, B: 65 },
      { subject: "Razonamiento Analítico", A: 68, B: 62 },
      { subject: "Resolución de Problemas", A: 70, B: 68 },
      { subject: "Pensamiento Sistémico", A: 58, B: 60 },
      { subject: "Razonamiento Numérico", A: 65, B: 63 },
    ],
    personalityTraits: [
      { name: "Apertura a la experiencia", userScore: 78, averageScore: 65, leftLabel: "Convencional", rightLabel: "Curioso" },
      { name: "Responsabilidad", userScore: 82, averageScore: 70, leftLabel: "Flexible", rightLabel: "Meticuloso" },
      { name: "Tolerancia al riesgo", userScore: 55, averageScore: 58, leftLabel: "Cauteloso", rightLabel: "Innovador" },
      { name: "Orientación a resultados", userScore: 64, averageScore: 67, leftLabel: "Proceso", rightLabel: "Impacto" },
    ],
    achievements: [
      { id: "ach_first_cv", label: "CV cargado", iconKey: "file", unlocked: true, xp: 50 },
      { id: "ach_git", label: "Primer repo GitHub", iconKey: "cpu", unlocked: false, xp: 150 },
      { id: "ach_sql", label: "SQL dominado", iconKey: "layers", unlocked: false, xp: 200 },
      { id: "ach_interview", label: "Entrevista simulada", iconKey: "star", unlocked: false, xp: 120 },
      { id: "ach_route", label: "Ruta generada", iconKey: "trophy", unlocked: false, xp: 100 },
      { id: "ach_top", label: "Top empleabilidad", iconKey: "award", unlocked: false, xp: 500 },
    ],
    techSkillLevels: {
      "HTML/CSS": 55,
      JavaScript: 48,
      "SQL Server": 52,
    },
    skillsToDevelop: [
      "Git/GitHub",
      "APIs REST",
      "Node.js o Spring Boot",
      "Testing básico",
      "Metodologías Ágiles",
    ],
  },
  U20198765: {
    bio: "Estudiante de Marketing apasionada por el marketing digital, la investigación de mercados y las campañas en redes. Busco prácticas pre-profesionales para aplicar GA4 y Meta Ads en entornos reales.",
    location: "Lima, Perú",
    streak: 7,
    cognitiveProfile: [
      { subject: "Razonamiento Lógico", A: 70, B: 65 },
      { subject: "Razonamiento Analítico", A: 82, B: 62 },
      { subject: "Resolución de Problemas", A: 75, B: 68 },
      { subject: "Pensamiento Sistémico", A: 78, B: 60 },
      { subject: "Creatividad aplicada", A: 88, B: 58 },
    ],
    personalityTraits: [
      { name: "Apertura a la experiencia", userScore: 86, averageScore: 65, leftLabel: "Convencional", rightLabel: "Creativa" },
      { name: "Responsabilidad", userScore: 80, averageScore: 70, leftLabel: "Flexible", rightLabel: "Organizada" },
      { name: "Comunicación", userScore: 84, averageScore: 68, leftLabel: "Reservada", rightLabel: "Expresiva" },
      { name: "Orientación a resultados", userScore: 76, averageScore: 67, leftLabel: "Proceso", rightLabel: "KPIs" },
    ],
    achievements: [
      { id: "ach_first_cv", label: "CV cargado", iconKey: "file", unlocked: true, xp: 50 },
      { id: "ach_campaign", label: "Campaña académica", iconKey: "layers", unlocked: true, xp: 120 },
      { id: "ach_ga4", label: "Certificación GA4", iconKey: "award", unlocked: false, xp: 250 },
      { id: "ach_portfolio", label: "Portafolio digital", iconKey: "star", unlocked: false, xp: 180 },
      { id: "ach_route", label: "Ruta generada", iconKey: "trophy", unlocked: false, xp: 100 },
      { id: "ach_practica", label: "Práctica conseguida", iconKey: "shield", unlocked: false, xp: 400 },
    ],
    techSkillLevels: {
      "Google Analytics": 62,
      "Meta Ads": 58,
      Canva: 75,
      "Excel Avanzado": 70,
      "SEO Básico": 55,
    },
    skillsToDevelop: [
      "Google Analytics 4 certificado",
      "Email Marketing",
      "Storytelling con datos",
      "CRM y funnels",
    ],
  },
  U20245678: {
    bio: "Estudiante de Negocios Internacionales con experiencia en comercio exterior y logística. Certificado PSM I. Orientado a roles COMEX con foco en gestión aduanera, negociación y supply chain.",
    location: "Lima, Perú",
    streak: 12,
    cognitiveProfile: [
      { subject: "Razonamiento Lógico", A: 80, B: 65 },
      { subject: "Razonamiento Analítico", A: 85, B: 62 },
      { subject: "Resolución de Problemas", A: 82, B: 68 },
      { subject: "Negociación", A: 88, B: 55 },
      { subject: "Pensamiento Global", A: 84, B: 58 },
    ],
    personalityTraits: [
      { name: "Apertura a la experiencia", userScore: 76, averageScore: 65, leftLabel: "Local", rightLabel: "Global" },
      { name: "Responsabilidad", userScore: 88, averageScore: 70, leftLabel: "Flexible", rightLabel: "Comprometido" },
      { name: "Liderazgo", userScore: 82, averageScore: 62, leftLabel: "Seguidor", rightLabel: "Líder" },
      { name: "Orientación a resultados", userScore: 90, averageScore: 67, leftLabel: "Proceso", rightLabel: "Resultados" },
    ],
    achievements: [
      { id: "ach_first_cv", label: "CV cargado", iconKey: "file", unlocked: true, xp: 50 },
      { id: "ach_comex", label: "Experiencia COMEX", iconKey: "shield", unlocked: true, xp: 200 },
      { id: "ach_psm", label: "PSM I obtenido", iconKey: "award", unlocked: true, xp: 300 },
      { id: "ach_negotiation", label: "Negociación simulada", iconKey: "star", unlocked: false, xp: 150 },
      { id: "ach_route", label: "Ruta generada", iconKey: "trophy", unlocked: false, xp: 100 },
      { id: "ach_english", label: "Inglés certificado", iconKey: "trophy", unlocked: false, xp: 350 },
    ],
    techSkillLevels: {
      "Excel Financiero": 78,
      "Logística Internacional": 72,
      "Inglés Comercial": 65,
      Negociación: 80,
      Scrum: 70,
      "Gestión Aduanera": 75,
    },
    skillsToDevelop: [
      "Inglés B2/C1 certificado",
      "Incoterms 2020",
      "ERP logístico",
      "Supply Chain Digital",
    ],
  },
};

const DEFAULT_PANEL: ProfilePanelData = {
  bio: "Completa tu diagnóstico para personalizar tu perfil de empleabilidad.",
  location: "Lima, Perú",
  streak: 0,
  cognitiveProfile: [
    { subject: "Razonamiento Lógico", A: 50, B: 65 },
    { subject: "Razonamiento Analítico", A: 50, B: 62 },
    { subject: "Resolución de Problemas", A: 50, B: 68 },
    { subject: "Pensamiento Sistémico", A: 50, B: 60 },
    { subject: "Razonamiento Numérico", A: 50, B: 63 },
  ],
  personalityTraits: [
    { name: "Apertura a la experiencia", userScore: 50, averageScore: 65, leftLabel: "Convencional", rightLabel: "Curioso" },
    { name: "Responsabilidad", userScore: 50, averageScore: 70, leftLabel: "Flexible", rightLabel: "Meticuloso" },
    { name: "Tolerancia al riesgo", userScore: 50, averageScore: 58, leftLabel: "Cauteloso", rightLabel: "Innovador" },
    { name: "Orientación a resultados", userScore: 50, averageScore: 67, leftLabel: "Proceso", rightLabel: "Impacto" },
  ],
  achievements: [
    { id: "ach_diag", label: "Diagnóstico completo", iconKey: "file", unlocked: false, xp: 80 },
    { id: "ach_route", label: "Ruta generada", iconKey: "trophy", unlocked: false, xp: 100 },
    { id: "ach_course", label: "Primer curso", iconKey: "layers", unlocked: false, xp: 120 },
    { id: "ach_interview", label: "Entrevista simulada", iconKey: "star", unlocked: false, xp: 150 },
  ],
  techSkillLevels: {},
  skillsToDevelop: [],
};

export function getProfilePanelData(studentCode: string | null | undefined): ProfilePanelData {
  if (!studentCode) return DEFAULT_PANEL;
  return PROFILE_BY_CODE[studentCode] ?? DEFAULT_PANEL;
}

export function buildTechSkillLevels(
  studentCode: string | null | undefined,
  skills: string[]
): Record<string, number> {
  const base = getProfilePanelData(studentCode).techSkillLevels;
  const levels: Record<string, number> = { ...base };
  for (const skill of skills) {
    if (levels[skill] === undefined) {
      levels[skill] = 45 + (skill.length % 25);
    }
  }
  return levels;
}

export function mergeAppProfileWithStudent(
  appProfile: UserProfile,
  studentCode: string | null | undefined
): UserProfile {
  const bundle = studentCode ? getStudentCareerBundle(studentCode) : undefined;
  const panel = getProfilePanelData(studentCode);

  if (!bundle) return appProfile;

  return {
    ...appProfile,
    targetRole: appProfile.targetRole || bundle.targetRole,
    currentSkills: appProfile.currentSkills.length > 0 ? appProfile.currentSkills : bundle.cv.hardSkills,
    softSkills: appProfile.softSkills?.length ? appProfile.softSkills : bundle.cv.softSkills,
    interests: appProfile.interests.length > 0 ? appProfile.interests : bundle.cv.specializations,
    employabilityScore: appProfile.employabilityScore || bundle.initialEmployabilityScore,
    email: appProfile.email || bundle.cv.email,
    phone: appProfile.phone || bundle.cv.phone,
    linkedin: appProfile.linkedin || bundle.cv.linkedin,
    cognitiveProfile: panel.cognitiveProfile.map((p) => ({
      subject: p.subject,
      A: p.A,
      B: p.B,
      fullMark: 100,
    })),
    personalityTraits: panel.personalityTraits,
  };
}

export const EMPTY_APP_PROFILE: UserProfile = {
  name: "Estudiante UTP",
  career: "",
  semester: 1,
  experienceLevel: "",
  targetRole: "",
  currentSkills: [],
  softSkills: [],
  interests: [],
  employabilityScore: 0,
  xp: 0,
  level: 1,
  progressToNextLevel: 0,
};
