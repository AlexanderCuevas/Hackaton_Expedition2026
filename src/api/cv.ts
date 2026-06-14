import { apiFetch } from "./client";
import type {
  CvTextRequest,
  CvTextResponse,
  CvDetailResponse,
  CvListResponse,
  CvUploadResponse,
  ExtractedProfile,
} from "./types";
import type { CvAnalysis } from "../types";

function sanitizeCvText(raw: string): string {
  return raw
    .replace(/\x00/g, "")
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\uFFFE\uFFFF]/g, "")
    .trim()
    .slice(0, 15000);
}

function mockCvId(): string {
  return crypto.randomUUID();
}

const UNIVERSITIES = [
  "Universidad Tecnológica del Perú", "UTP", "Universidad Nacional",
  "Universidad de Lima", "Universidad del Pacífico", "San Martín",
  "Universidad Católica", "PUCP", "Universidad de Ciencias Aplicadas",
  "UPC", "Universidad San Ignacio de Loyola", "USIL",
  "Universidad Peruana de Ciencias", "Universidad César Vallejo",
  "Universidad Alas Peruanas", "Universidad Continental",
];

const COMMON_SKILLS = [
  "HTML/CSS", "JavaScript", "TypeScript", "Python", "Java", "C++", "C#",
  "SQL", "PostgreSQL", "MySQL", "SQL Server", "MongoDB",
  "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Spring Boot",
  "Git", "GitHub", "GitLab", "Docker", "AWS", "Azure", "GCP",
  "REST APIs", "GraphQL", "Scrum", "Agile", "Kanban",
  "Excel", "Power BI", "Tableau", "Figma", "Adobe Photoshop", "Adobe Illustrator",
  "AutoCAD", "Revit", "SketchUp",
  "Comunicación efectiva", "Trabajo en equipo", "Liderazgo",
  "Resolución de problemas", "Pensamiento crítico", "Adaptabilidad",
];

function extractEmail(text: string): string {
  const m = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  return m ? m[0] : "";
}

function extractPhone(text: string): string {
  const m = text.match(/\+?\d{1,3}[\s-]?\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4}/);
  return m ? m[0].trim() : "";
}

function extractLinkedIn(text: string): string {
  const m = text.match(/linkedin\.com\/in\/[\w-]+/i);
  return m ? m[0] : "";
}

function extractGithub(text: string): string {
  const m = text.match(/github\.com\/[\w-]+/i);
  return m ? m[0] : "";
}

function extractName(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 0) return lines[0].replace(/^(nombre|name|nombres|apellidos)[:\s]*/i, "").trim();
  return "";
}

function extractLocation(text: string): string {
  const cities = ["Lima", "Chimbote", "Arequipa", "Cusco", "Trujillo", "Piura", "Huancayo", "Ica", "Puno", "Tacna"];
  for (const city of cities) {
    if (text.includes(city)) return city;
  }
  return "";
}

const SECTION_HEADERS = [
  "EXPERIENCIA PROFESIONAL", "EXPERIENCIA LABORAL", "EXPERIENCIA",
  "EDUCACIÓN", "EDUCACION", "FORMACIÓN ACADÉMICA", "FORMACION ACADEMICA",
  "SKILLS TÉCNICAS", "SKILLS", "HABILIDADES", "APTITUDES",
  "OTROS PROYECTOS Y LOGROS", "PROYECTOS", "CERTIFICACIONES",
  "SOBRE MÍ", "SOBRE MI", "PERFIL PROFESIONAL", "RESUMEN",
  "IDIOMAS", "REFERENCIAS",
];

function getSection(text: string, header: string): string {
  const upper = text.toUpperCase();
  const startIdx = upper.indexOf(header.toUpperCase());
  if (startIdx === -1) return "";
  const afterHeader = startIdx + header.length;
  let endIdx = text.length;
  for (const h of SECTION_HEADERS) {
    if (h.toUpperCase() === header.toUpperCase()) continue;
    const idx = upper.indexOf(h.toUpperCase(), afterHeader);
    if (idx !== -1 && idx < endIdx) endIdx = idx;
  }
  return text.slice(afterHeader, endIdx).trim();
}

const DEGREE_KEYWORDS = [
  "Ingeniería", "Licenciatura", "Bachiller", "Técnico", "Maestría", "Doctorado",
];

function extractEducation(text: string): { institution: string; degree: string; field: string; startDate: string; endDate: string }[] {
  const results: { institution: string; degree: string; field: string; startDate: string; endDate: string }[] = [];
  const section = getSection(text, "EDUCACIÓN") || getSection(text, "EDUCACION") || getSection(text, "FORMACIÓN ACADÉMICA") || getSection(text, "FORMACION ACADEMICA");
  if (!section) return results;
  for (const uni of UNIVERSITIES) {
    if (section.toLowerCase().includes(uni.toLowerCase())) {
      const lines = section.split("\n");
      const lineIdx = lines.findIndex((l) => l.toLowerCase().includes(uni.toLowerCase()));
      const nextLine = lines[lineIdx + 1] || "";
      const combined = (lines[lineIdx] || "") + " " + nextLine;
      const dateMatch = combined.match(/(\w+\s+\d{4})\s*[-–—to]+\s*(\w+\s+\d{4}|Actualidad|Presente)/i);
      let degree = "";
      let field = "";
      for (const dk of DEGREE_KEYWORDS) {
        const idx = combined.toUpperCase().indexOf(dk.toUpperCase());
        if (idx === -1) continue;
        const after = combined.slice(idx + dk.length);
        const endMatch = after.match(/^[^A-Za-zÁÉÍÓÚÑáéíóúñ]*(.+?)(?=\s*\(|\s*\d|,|\s*$|\.)/i);
        const rest = endMatch ? endMatch[1].trim() : "";
        const sep = /^(?:de\s+|en\s+|del\s+)/i.test(rest) ? rest.match(/^(de|en|del)\s+(.*)/i) : null;
        const fullRest = sep ? sep[2] : rest;
        const trimmed = fullRest.replace(/\s+/g, " ").trim();
        if (trimmed) {
          degree = dk + (sep ? " " + sep[1] : "") + " " + trimmed;
          field = trimmed;
          break;
        }
      }
      if (!results.some((r) => r.institution === uni)) {
        results.push({
          institution: uni,
          degree,
          field,
          startDate: dateMatch ? dateMatch[1] : "",
          endDate: dateMatch ? dateMatch[2] : "",
        });
      }
    }
  }
  return results;
}

function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return COMMON_SKILLS.filter((s) => lower.includes(s.toLowerCase()));
}

const ROLE_KEYWORDS = [
  "Desarrollador", "Developer", "Backend", "Frontend", "Full Stack", "Fullstack",
  "Analista", "Asistente", "Coordinador", "Consultor", "Diseñador", "Designer",
  "Ingeniero", "Engineer", "Practicante", "Trainee", "Junior", "Senior",
  "Project Manager", "Scrum Master", "Product Owner", "Líder", "Lider", "Jefe",
  "Técnico", "Tecnico", "QA", "DevOps", "Data Scientist", "Data Analyst",
  "Arquitecto", "UX", "UI",
];

const ROLE_QUALIFIERS = [
  "Backend", "Frontend", "Full Stack", "Fullstack", "Mobile", "DevOps",
  "QA", "Junior", "Senior", "Trainee", "Semi Senior", "Líder", "Lider",
  "Java", "Spring Boot", "Data", "Web",
];

function stripLocationAndDates(text: string): { clean: string; startDate: string; endDate: string } {
  let t = text;
  const dates = t.match(/(\w+\s+\d{4})\s*[-–—to]+\s*(\w+\s+\d{4}|Actualidad|Presente)/i);
  if (dates) {
    t = t.replace(dates[0], "").trim();
  }
  t = t.replace(/(?:,\s*)?(Perú|Peru|Lima|Chimbote|Arequipa|Trujillo|Cusco|Piura|Huancayo|Ica|Puno|Tacna).*/i, "").trim();
  return { clean: t, startDate: dates ? dates[1] : "", endDate: dates ? dates[2] : "" };
}

function parseRoleLine(cleaned: string): { position: string; company: string; startDate: string; endDate: string } | null {
  const { clean, startDate, endDate } = stripLocationAndDates(cleaned);
  if (!clean) return null;
  const roleMatch = ROLE_KEYWORDS.find((kw) =>
    clean.toLowerCase().startsWith(kw.toLowerCase())
  );
  if (!roleMatch) return null;
  const afterRole = clean.slice(roleMatch.length).trim();
  const words = afterRole.split(/\s+/);
  let qualifier = "";
  while (words.length > 0) {
    const candidate = qualifier ? qualifier + " " + words[0] : words[0];
    if (ROLE_QUALIFIERS.some((q) => q.toLowerCase() === candidate.toLowerCase())) {
      qualifier = candidate;
      words.shift();
    } else {
      break;
    }
  }
  const position = roleMatch + (qualifier ? " " + qualifier : "");
  const company = words.join(" ");
  return { position, company, startDate, endDate };
}

function extractExperience(text: string): { company: string; position: string; startDate: string; endDate: string; description: string }[] {
  const results: { company: string; position: string; startDate: string; endDate: string; description: string }[] = [];
  const section = getSection(text, "EXPERIENCIA PROFESIONAL")
    || getSection(text, "EXPERIENCIA LABORAL")
    || getSection(text, "EXPERIENCIA");
  if (!section) return results;

  // Split by newline first; if result is one line, also split by bullet symbols
  let rawLines = section.split("\n").map((l) => l.trim()).filter(Boolean);
  if (rawLines.length <= 1) {
    rawLines = section.split(/[●•]/).map((l) => l.trim()).filter(Boolean);
  }

  let current: { company: string; position: string; startDate: string; endDate: string; description: string } | null = null;
  for (const cleaned of rawLines) {
    const startsWithRole = ROLE_KEYWORDS.some((kw) =>
      cleaned.toLowerCase().startsWith(kw.toLowerCase())
    );
    if (startsWithRole) {
      const parsed = parseRoleLine(cleaned);
      if (parsed) {
        if (current) results.push(current);
        current = { ...parsed, description: "" };
        continue;
      }
    }
    if (current) {
      if (!current.description) current.description = cleaned;
      else current.description += "\n" + cleaned;
    }
  }
  if (current) results.push(current);
  return results.slice(0, 3);
}

function generateMockAnalysis(
  skills: string[],
  targetRole: string,
): CvAnalysis {
  const allTechSet = new Set(COMMON_SKILLS.map((s) => s.toLowerCase()));
  const found = skills.filter((s) => allTechSet.has(s.toLowerCase()));
  const missing = COMMON_SKILLS.filter(
    (s) => !found.includes(s) && allTechSet.has(s.toLowerCase()),
  ).slice(0, 8);

  const score = Math.min(85, Math.max(15, found.length * 8 + 20));

  const strengths = found.length > 0
    ? [`Conocimientos en ${found.slice(0, 3).join(", ")}`, "Formación académica relevante", "Interés claro en el área"]
    : ["Buena disposición para aprender", "Interés en desarrollo profesional"];

  const weaknesses = missing.length > 0
    ? [`Falta experiencia con ${missing.slice(0, 3).join(", ")}`, "CV podría incluir más proyectos o logros concretos"]
    : ["Considera agregar más detalles cuantificables a tu CV"];

  return {
    score,
    strengths,
    weaknesses,
    keywordsFound: found,
    keywordsMissing: missing,
    generalFeedback: `Tu perfil muestra una base sólida con ${found.length} habilidades identificadas. ${strengths[0]}. Para mejorar tu empleabilidad como ${targetRole || "profesional"}, te recomendamos fortalecer las áreas donde tienes menos experiencia y agregar proyectos concretos a tu CV.`,
    atsFormattedCvAdvice: "Usa encabezados claros como 'Experiencia Laboral', 'Educación' y 'Habilidades'. Incluye palabras clave específicas del puesto. Mantén un formato limpio y evita gráficos complejos para mejor compatibilidad ATS.",
  };
}

/* ---- shared mock store ---- */
const mockStore = new Map<string, CvTextResponse>();

function buildMockCvResponse(
  text: string,
  opts?: { targetRole?: string; studentId?: string; fileName?: string },
): CvTextResponse {
  const cleaned = sanitizeCvText(text);
  const id = mockCvId();
  const skills = extractSkills(cleaned);
  const profile: ExtractedProfile = {
    personalInfo: {
      fullName: extractName(cleaned),
      email: extractEmail(cleaned),
      phone: extractPhone(cleaned),
      location: extractLocation(cleaned),
      linkedIn: extractLinkedIn(cleaned),
      summary: extractName(cleaned) ? `${extractName(cleaned)} — profesional con interés en ${opts?.targetRole || "desarrollo profesional"}.` : "",
    },
    education: extractEducation(cleaned),
    experience: extractExperience(cleaned),
    skills,
    certifications: [],
    languages: [],
  };

  const analysis = generateMockAnalysis(skills, opts?.targetRole || "");

  return {
    ok: true,
    cvId: id,
    context: {
      id,
      fileName: opts?.fileName || "cv-text.txt",
      fileType: "text",
      mimeType: "text/plain",
      targetRole: opts?.targetRole || "",
      studentId: opts?.studentId,
      extractedText: cleaned,
      extractedProfile: profile,
      analysis,
      createdAt: new Date().toISOString(),
    },
  };
}

export async function analyzeCvText(
  text: string,
  opts?: {
    targetRole?: string;
    studentId?: string;
    fileName?: string;
  },
): Promise<CvTextResponse> {
  const cleaned = sanitizeCvText(text);
  const body: CvTextRequest = {
    cvText: cleaned,
    text: cleaned,
    ...opts,
  };

  try {
    const res = await apiFetch<CvTextResponse>("/api-ai/cv/text", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (res.ok && res.cvId) mockStore.set(res.cvId, res);
    return res;
  } catch {
    console.log("[CV] Backend no disponible, usando análisis local simulado.");
    const mock = buildMockCvResponse(text, opts);
    mockStore.set(mock.cvId, mock);
    return mock;
  }
}

export async function analyzeCvFile(
  file: File,
  opts?: {
    targetRole?: string;
    studentId?: string;
  },
): Promise<CvUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (opts?.targetRole) formData.append("targetRole", opts.targetRole);
  if (opts?.studentId) formData.append("studentId", opts.studentId);

  try {
    const res = await apiFetch<CvUploadResponse>("/api-ai/cv/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok && res.cvId) mockStore.set(res.cvId, res as unknown as CvTextResponse);
    return res;
  } catch {
    console.log("[CV] Backend no disponible, usando análisis local simulado.");
    const { extractTextFromPdf } = await import("../utils/cvParser");
    const raw = await extractTextFromPdf(file);
    const mock = buildMockCvResponse(raw, opts);
    mockStore.set(mock.cvId, mock);
    return { ok: true, cvId: mock.cvId, context: mock.context };
  }
}

export async function getCvAnalysis(
  cvId: string,
): Promise<CvDetailResponse> {
  try {
    return await apiFetch<CvDetailResponse>(`/api-ai/cv/${cvId}`);
  } catch {
    const stored = mockStore.get(cvId);
    if (stored) {
      return { ok: true, context: stored.context };
    }
    return {
      ok: true,
      context: {
        id: cvId,
        fileName: "cv-text.txt",
        fileType: "text",
        mimeType: "text/plain",
        targetRole: "",
        extractedText: "",
        extractedProfile: {
          personalInfo: { fullName: "", email: "", phone: "", location: "", linkedIn: "", summary: "" },
          education: [],
          experience: [],
          skills: [],
          certifications: [],
          languages: [],
        },
        analysis: {
          score: 0,
          strengths: [],
          weaknesses: [],
          keywordsFound: [],
          keywordsMissing: [],
          generalFeedback: "",
          atsFormattedCvAdvice: "",
        },
        createdAt: new Date().toISOString(),
      },
    };
  }
}

export async function listCvs(
  studentId?: string,
): Promise<CvListResponse> {
  const query = studentId ? `?studentId=${encodeURIComponent(studentId)}` : "";
  try {
    return await apiFetch<CvListResponse>(`/api-ai/cv${query}`);
  } catch {
    return { ok: true, cvs: [] };
  }
}
