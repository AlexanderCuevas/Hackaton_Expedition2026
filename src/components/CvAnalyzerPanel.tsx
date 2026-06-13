import React, { useState, useRef, useCallback } from "react";
import { CvAnalysis } from "../types";
import {
  FileText, Sparkles, AlertCircle, CheckCircle, HelpCircle, ArrowUpRight,
  TrendingDown, ThumbsUp, ThumbsDown, BookOpen, AlertTriangle, RefreshCw,
  Briefcase, Shield, ChevronRight, X, ArrowRight, Check, PlusCircle, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import mammoth from "mammoth";

GlobalWorkerOptions.workerSrc = "https://unpkg.com/pdfjs-dist@6.0.227/build/pdf.worker.min.mjs";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
const ALLOWED_EXTENSIONS = [".pdf", ".docx"];

function cleanExtractedText(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatCvTextAsMarkdown(text: string): string {
  const lines = text.split("\n").map(l => l.trim());
  const result: string[] = [];
  let inBulletSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) {
      if (inBulletSection) { result.push(""); inBulletSection = false; }
      result.push("");
      continue;
    }

    const isEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(line);
    const isUrl = /^(https?:\/\/|www\.)/i.test(line) || /linkedin|github/i.test(line);
    const isPhone = /^[\+\(]?\d{1,4}[\)\-\s]?\d{6,}/.test(line);
    const isNameLine = i === 0 && !line.startsWith("##") && !isEmail && !isUrl && !isPhone && line.length > 0 && line.length < 60;
    const upperLine = line.toUpperCase().trim();

    const sectionHeaders = [
      /^PERFIL/, /^DATOS PERSONALES/i, /^ESTUDIOS/, /^EDUCACIÓN/i,
      /^EXPERIENCIA/, /^PROYECTOS/, /^HABILIDADES/i, /^CERTIFICACIONES/i,
      /^IDIOMAS/i, /^FORMACIÓN/i, /^RESUMEN/i, /^OBJETIVO/i, /^REFERENCIAS/i,
      /^LOGROS/i, /^PUBLICACIONES/i, /^CURSOS/i, /^COMPETENCIAS/i
    ];

    const isSectionHeader = sectionHeaders.some(rx => rx.test(upperLine)) && line.length < 50;

    if (isNameLine) {
      result.push(line);
      continue;
    }

    if (isSectionHeader) {
      if (inBulletSection) { inBulletSection = false; }
      result.push("");
      result.push("## " + line);
      result.push("");
      continue;
    }

    if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*") || /^\d+[\.\)]/.test(line)) {
      if (!inBulletSection) { inBulletSection = true; }
      const bulletText = line.replace(/^[•\-*\d\)\.]+\s*/, "");
      result.push("- " + bulletText);
      continue;
    }

    if (line.startsWith("###")) {
      result.push("");
      result.push(line);
      continue;
    }

    if (isEmail || isUrl) {
      if (inBulletSection) { result.push(""); inBulletSection = false; }
      const lower = line.toLowerCase();
      const label = isEmail ? "Correo:" : lower.startsWith("http") && line.includes("linkedin") ? "LinkedIn:" : lower.startsWith("http") && line.includes("github") ? "GitHub:" : "";
      result.push(label ? `${label} ${line}` : line);
      continue;
    }

    if (isPhone) {
      if (inBulletSection) { result.push(""); inBulletSection = false; }
      result.push("Teléfono: " + line);
      continue;
    }

    if (inBulletSection) { inBulletSection = false; }
    result.push(line);
  }

  return result.join("\n").replace(/\n{4,}/g, "\n\n").trim();
}

async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const items = content.items.map((item: any) => item.str);
    const lastY = (content.items[0] as any)?.transform?.[5] ?? 0;
    let pageText = "";
    let prevY = lastY;
    for (const item of content.items as any[]) {
      const y = item.transform[5];
      if (Math.abs(y - prevY) > 5) pageText += "\n";
      pageText += item.str + " ";
      prevY = y;
    }
    pages.push(pageText);
  }
  return cleanExtractedText(pages.join("\n\n"));
}

async function extractTextFromDOCX(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return cleanExtractedText(result.value);
}

const TEMPLATE_MOCK_CVS = [
  {
    title: "CV Sistemas (Sin Palabras Clave)",
    content: `JUAN PÉREZ
Estudiante de Ingeniería de Sistemas

SOPORTE TÉCNICO Y DISEÑO
He trabajado dando soporte a computadoras en la cabina de mi tío. Sé formatear computadoras y dar soporte técnico básico. También domino un poco de Photoshop y Corel Draw. Quiero aprender a programar rápido.

Habilidades:
Trabajo en equipo, puntualidad, ganas de aprender.

Educación:
UTP, cursando 7mo ciclo.`
  },
  {
    title: "CV Administración (Redacción Pasiva)",
    content: `MARÍA SILVA
Estudiante de Administración - 8vo ciclo

EXPERIENCIA ACADÉMICA Y PROYECTOS:
- Ayudé en la organización del evento de bienvenida de la UTP.
- Me encargué de revisar algunos presupuestos sencillos para un proyecto de clase.
- Hice un trabajo de investigación sobre empresas peruanas de consumo masivo con mi grupo.
- Sé usar Word, PowerPoint y un poco de Excel.`
  }
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() || "";
}

function generateRecommendations(analysis: CvAnalysis, cvText: string, career: string, targetRole: string, semester: number): string[] {
  const ctx = getCareerContext(career);
  const recs: string[] = [];
  const lower = cvText.toLowerCase();
  const area = ctx.area;

  const hasKeywords = analysis.keywordsFound.length > 2;
  if (analysis.keywordsMissing.length > 0) {
    recs.push(`Agregar palabras clave de la vacante objetivo en tu CV, especialmente: ${analysis.keywordsMissing.slice(0, 5).join(", ")}.`);
  }

  if (!hasKeywords) {
    const examples = ctx.tools.slice(0, 4).join(", ");
    recs.push(`Incluir competencias técnicas clave para ${area}: ${examples}. Revisa la descripción de la vacante y agrega las herramientas que dominas.`);
  }

  const hasEvidence = ctx.evidenceTypes.some(ev => lower.includes(ev.toLowerCase().slice(0, 8)));
  if (!hasEvidence) {
    const evType = ctx.evidenceTypes[0] || "proyectos o prácticas";
    recs.push(`Agregar ${evType.toLowerCase()} como evidencia de tus capacidades. Los reclutadores buscan resultados demostrables, no solo listas de cursos.`);
  }

  const hasPortfolio = /portafolio|linkedin|github|behance|drive/i.test(lower);
  if (!hasPortfolio && area !== "General") {
    recs.push(`Incluir enlace a tu portafolio, LinkedIn o repositorio donde muestres tus ${ctx.evidenceTypes[1]?.toLowerCase() || "trabajos"}.`);
  }

  const hasMetrics = /\d+%\|\d+ años|\d+ proyectos|increment|reduj|aument|logré|resultó/i.test(lower);
  if (!hasMetrics) {
    recs.push("Cuantificar tus logros con números concretos: cambia 'participé en un proyecto' por 'lideré un proyecto que redujo costos en 15%'.");
  }

  const hasSoftSkills = /trabajo en equipo|liderazgo|comunicación|organización|adaptabilidad/i.test(lower);
  if (!hasSoftSkills) {
    const soft = ctx.softSkills.slice(0, 3).join(", ");
    recs.push(`Incorporar habilidades blandas clave para ${area}: ${soft}. Los reclutadores valoran estas competencias tanto como las técnicas.`);
  }

  if (semester >= 7 && !/práctic|experien/i.test(lower)) {
    const role = ctx.sampleEntryLevelRoles[0] || targetRole;
    recs.push(`Si estás en ciclo ${semester}, es importante mostrar experiencia preprofesional. Agrega prácticas, proyectos o voluntariado relacionado con ${role}.`);
  }

  return recs.slice(0, 5);
}

function generateBeforeAfter(cvText: string, analysis: CvAnalysis): { before: string; after: string } {
  const lines = cvText.split("\n").filter(l => l.trim());
  const beforeText = lines.length > 0
    ? lines.slice(0, Math.min(3, lines.length)).join(" ").substring(0, 200)
    : cvText.substring(0, 200);

  const afterText = analysis.atsFormattedCvAdvice
    ? analysis.atsFormattedCvAdvice.split("\n").filter(l => l.trim()).slice(0, 3).join(" ").substring(0, 250)
    : "Perfil profesional optimizado con palabras clave estratégicas, logros cuantificables y orientación al puesto objetivo.";

  return {
    before: beforeText || "Sin contenido de CV disponible.",
    after: afterText || "CV optimizado pendiente de generación."
  };
}

const mockOptimizedScore = (currentScore: number): number => {
  return Math.min(100, currentScore + 18 + Math.floor(Math.random() * 15));
};

const detectExperienceLevel = (cvText: string): "basico" | "intermedio" | "avanzado" => {
  const lines = cvText.split("\n").filter(l => l.trim()).length;
  const hasProjects = /proyecto|práctic|experien/i.test(cvText);
  const hasTech = /react|javascript|python|java|sql|html|css/i.test(cvText);
  if (lines > 15 && hasProjects && hasTech) return "avanzado";
  if (lines > 8 && (hasProjects || hasTech)) return "intermedio";
  return "basico";
};

const getRouteImpactData = (score: number, optimizedScore: number, career: string) => {
  const ctx = getCareerContext(career);
  const impact = optimizedScore - score;
  let nextMission = "Simular entrevista técnico-comportamental";
  if (impact < 5) nextMission = `Buscar prácticas en ${ctx.area}`;
  else if (impact < 12) nextMission = "Obtener certificación relevante al área";
  return {
    compatibilityBefore: score,
    compatibilityAfter: optimizedScore,
    impact,
    evidence: "CV optimizado",
    nextMission
  };
};

interface CareerContext {
  area: string;
  tools: string[];
  softSkills: string[];
  evidenceTypes: string[];
  sectionKeywords: string[];
  sampleEntryLevelRoles: string[];
}

function getCareerContext(career: string): CareerContext {
  const c = career.toLowerCase();
  if (c.includes("sistemas") || c.includes("informática") || c.includes("computación") || c.includes("software") || c.includes("datos") || c.includes("redes") || c.includes("ciber")) {
    return {
      area: "Tecnología",
      tools: ["Lenguajes de programación", "Bases de datos", "Git/GitHub", "APIs REST", "Frameworks", "Metodologías ágiles", "Testing", "Cloud", "CI/CD", "Arquitectura de software"],
      softSkills: ["Resolución de problemas", "Pensamiento lógico", "Trabajo en equipo técnico", "Comunicación técnica", "Autogestión"],
      evidenceTypes: ["Proyectos personales o académicos", "Repositorios en GitHub", "Hackathones", "Certificaciones técnicas", "Prácticas profesionales"],
      sectionKeywords: ["Lenguajes", "Proyectos", "Educación", "Certificaciones", "Habilidades técnicas"],
      sampleEntryLevelRoles: ["Backend Developer Trainee", "Frontend Developer Junior", "Soporte Técnico", "Analista de Datos"],
    };
  }
  if (c.includes("industrial")) {
    return {
      area: "Ingeniería y Operaciones",
      tools: ["Excel avanzado", "Power BI", "ERP/SAP", "AutoCAD", "Lean Manufacturing", "Six Sigma", "Indicadores/KPIs", "Diagramas de flujo", "Gestión de procesos"],
      softSkills: ["Análisis de datos", "Organización", "Mejora continua", "Trabajo en equipo", "Comunicación efectiva"],
      evidenceTypes: ["Proyectos de mejora", "Prácticas preprofesionales", "Reportes de indicadores", "Diagramas de procesos", "Certificaciones"],
      sectionKeywords: ["Experiencia", "Proyectos", "Habilidades", "Educación", "Logros"],
      sampleEntryLevelRoles: ["Practicante de Procesos", "Asistente de Operaciones", "Analista de Mejora Continua", "Practicante de Logística"],
    };
  }
  if (c.includes("administra") || c.includes("gestión") || c.includes("negocios") || c.includes("empresarial")) {
    return {
      area: "Administración y Negocios",
      tools: ["Excel", "ERP", "Gestión documental", "Redacción administrativa", "Power BI", "CRM", "Indicadores de gestión"],
      softSkills: ["Organización", "Comunicación", "Atención al cliente", "Trabajo en equipo", "Planificación"],
      evidenceTypes: ["Reportes académicos", "Prácticas", "Casos de estudio", "Organización de eventos", "Proyectos de investigación"],
      sectionKeywords: ["Experiencia", "Educación", "Habilidades", "Logros", "Prácticas"],
      sampleEntryLevelRoles: ["Asistente Administrativo", "Practicante de Gestión", "Analista de Operaciones", "Coordinador Junior"],
    };
  }
  if (c.includes("contab") || c.includes("finanzas") || c.includes("tribut")) {
    return {
      area: "Contabilidad y Finanzas",
      tools: ["Excel avanzado", "ERP contable", "SUNAT", "Estados financieros", "Conciliaciones bancarias", "Análisis de cuentas", "Normativa contable"],
      softSkills: ["Atención al detalle", "Ética profesional", "Análisis numérico", "Organización", "Confidencialidad"],
      evidenceTypes: ["Prácticas contables", "Reportes financieros", "Casos prácticos", "Declaraciones tributarias", "Conciliaciones"],
      sectionKeywords: ["Experiencia", "Educación", "Habilidades", "Certificaciones", "Logros"],
      sampleEntryLevelRoles: ["Practicante Contable", "Asistente de Finanzas", "Analista Contable Junior", "Asistente de Tributación"],
    };
  }
  if (c.includes("marketing") || c.includes("publicidad") || c.includes("comunic")) {
    return {
      area: "Marketing y Comunicaciones",
      tools: ["Redes sociales", "Meta Ads", "Google Ads", "Canva", "SEO", "Copywriting", "Analítica digital", "Branding"],
      softSkills: ["Creatividad", "Comunicación", "Storytelling", "Trabajo en equipo", "Investigación de mercado"],
      evidenceTypes: ["Campañas académicas", "Portafolio de contenido", "Redes sociales", "Casos de marketing", "Proyectos de branding"],
      sectionKeywords: ["Experiencia", "Proyectos", "Habilidades", "Logros", "Educación"],
      sampleEntryLevelRoles: ["Practicante de Marketing Digital", "Community Manager Junior", "Asistente de Comunicaciones", "Analista de Redes"],
    };
  }
  if (c.includes("psicolog") || c.includes("recursos humanos") || c.includes("rrhh")) {
    return {
      area: "Psicología y Gestión Humana",
      tools: ["Reclutamiento y selección", "Entrevistas", "Evaluación psicológica", "Clima laboral", "Capacitación", "Gestión del talento", "Legislación laboral"],
      softSkills: ["Empatía", "Comunicación", "Escucha activa", "Trabajo en equipo", "Confidencialidad"],
      evidenceTypes: ["Prácticas en RRHH", "Reportes de clima", "Entrevistas realizadas", "Talleres facilitados", "Proyectos de investigación"],
      sectionKeywords: ["Experiencia", "Educación", "Habilidades", "Logros", "Prácticas"],
      sampleEntryLevelRoles: ["Practicante de RRHH", "Asistente de Selección", "Analista de Clima Laboral", "Practicante de Capacitación"],
    };
  }
  if (c.includes("derecho") || c.includes("legal") || c.includes("abog")) {
    return {
      area: "Derecho y Asesoría Legal",
      tools: ["Redacción legal", "Análisis normativo", "Investigación jurídica", "Contratos", "Argumentación", "Derecho laboral/civil/administrativo"],
      softSkills: ["Análisis crítico", "Argumentación", "Comunicación escrita", "Ética", "Investigación"],
      evidenceTypes: ["Escritos legales", "Casos de estudio", "Prácticas en estudio", "Investigaciones", "Moot court"],
      sectionKeywords: ["Experiencia", "Educación", "Habilidades", "Logros", "Publicaciones"],
      sampleEntryLevelRoles: ["Practicante Legal", "Asistente Legal", "Analista Normativo Junior", "Practicante de Estudio Jurídico"],
    };
  }
  if (c.includes("arquitect") || c.includes("diseño") || c.includes("urban")) {
    return {
      area: "Arquitectura y Diseño",
      tools: ["AutoCAD", "Revit", "SketchUp", "Lumion", "Figma", "Adobe Suite", "Modelado 3D", "Lectura de planos"],
      softSkills: ["Creatividad visual", "Atención al detalle", "Comunicación visual", "Trabajo en equipo", "Presentación"],
      evidenceTypes: ["Portafolio de proyectos", "Planos", "Modelos 3D", "Diseños UI/UX", "Proyectos académicos"],
      sectionKeywords: ["Proyectos", "Portafolio", "Habilidades", "Educación", "Experiencia"],
      sampleEntryLevelRoles: ["Practicante de Arquitectura", "Diseñador Junior", "Asistente de Diseño", "Modelador 3D Junior"],
    };
  }
  return {
    area: "General",
    tools: ["Herramientas ofimáticas", "Comunicación efectiva", "Trabajo en equipo", "Organización", "Redacción profesional"],
    softSkills: ["Comunicación", "Trabajo en equipo", "Organización", "Responsabilidad", "Aprendizaje continuo"],
    evidenceTypes: ["Prácticas preprofesionales", "Proyectos académicos", "Voluntariado", "Certificaciones", "Logros académicos"],
    sectionKeywords: ["Experiencia", "Educación", "Habilidades", "Logros", "Proyectos"],
    sampleEntryLevelRoles: ["Practicante Profesional", "Asistente Junior", "Analista de Soporte", "Coordinador de Área"],
  };
}

interface CvAnalyzerPanelProps {
  targetRole: string;
  career: string;
  semester: number;
  onAnalysisResult: (analysis: CvAnalysis) => void;
  savedAnalysis?: CvAnalysis;
}

export default function CvAnalyzerPanel({
  targetRole,
  career,
  semester,
  onAnalysisResult,
  savedAnalysis
}: CvAnalyzerPanelProps) {
  const [cvText, setCvText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileStatus, setFileStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [showText, setShowText] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CvAnalysis | undefined>(savedAnalysis);
  const [dragOver, setDragOver] = useState(false);
  const [optimizedScore, setOptimizedScore] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [beforeAfter, setBeforeAfter] = useState<{ before: string; after: string }>({ before: "", after: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"pegar" | "subir">("subir");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((f: File): boolean => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    const typeOk = ALLOWED_TYPES.includes(f.type);
    const extOk = ALLOWED_EXTENSIONS.includes(ext);
    return typeOk || extOk;
  }, []);

  const handleFile = useCallback(async (f: File) => {
    if (!validateFile(f)) {
      setFileStatus("invalid");
      setFile(f);
      setErrorStr("Formato no soportado. Solo se aceptan archivos PDF o DOCX.");
      return;
    }
    setFile(f);
    setFileStatus("valid");
    setErrorStr(null);
    setExtracting(true);

    try {
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      let text = "";

      if (ext === ".pdf") {
        text = await extractTextFromPDF(f);
      } else if (ext === ".docx") {
        text = await extractTextFromDOCX(f);
      }

      if (text && text.trim().length > 20) {
        const cleaned = cleanExtractedText(text);
        const formatted = formatCvTextAsMarkdown(cleaned);
        setCvText(formatted);
        setErrorStr(null);
      } else {
        setCvText("");
        setErrorStr("El archivo parece no contener texto seleccionable. Puedes pegar el contenido manualmente.");
      }
    } catch (err) {
      console.error("Error extracting text:", err);
      setCvText("");
      setErrorStr("No pudimos extraer el texto de este archivo. Puedes pegar el contenido manualmente.");
    } finally {
      setExtracting(false);
    }
  }, [validateFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [handleFile]);

  const removeFile = useCallback(() => {
    setFile(null);
    setFileStatus("idle");
    setExtracting(false);
    setConfirmed(false);
    setErrorStr(null);
  }, []);

  const handleLoadTemplate = (content: string) => {
    setCvText(content);
    setErrorStr(null);
  };

  const handleAnalyze = async () => {
    if (!cvText.trim() || cvText.length < 30) {
      setErrorStr("Por favor ingresa un texto de CV válido de al menos 30 caracteres.");
      return;
    }

    if (activeTab === "subir" && fileStatus === "valid" && !confirmed) {
      setErrorStr("Debes confirmar que has revisado el texto extraído antes de analizar.");
      return;
    }

    setLoading(true);
    setErrorStr(null);

    try {
      const response = await fetch("/api/cv/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, targetRole, career, semester })
      });

      if (!response.ok) {
        throw new Error("Fallo en la comunicación con el servidor");
      }

      const data: CvAnalysis = await response.json();
      setAnalysis(data);
      onAnalysisResult(data);

      const ctx = getCareerContext(career);
      const optScore = mockOptimizedScore(data.score);
      setOptimizedScore(optScore);
      const recs = generateRecommendations(data, cvText, career, targetRole, semester);
      setRecommendations(recs);
      const ba = generateBeforeAfter(cvText, data);
      setBeforeAfter(ba);
    } catch (err: any) {
      console.error(err);
      setErrorStr("Fallo al analizar CV: " + (err.message || "error del servidor"));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(undefined);
    setCvText("");
    setFile(null);
    setFileStatus("idle");
    setOptimizedScore(0);
    setRecommendations([]);
    setBeforeAfter({ before: "", after: "" });
    setErrorStr(null);
  };

  const routeImpact = analysis ? getRouteImpactData(analysis.score, optimizedScore, career) : null;

  const renderFilePreview = () => {
    if (!file) return null;
    const ext = getFileExtension(file.name);
    const isInvalid = fileStatus === "invalid";
    return (
      <div className={`p-4 flex items-center justify-between gap-3 border ${isInvalid ? "border-[#B50E30]/30 bg-[#B50E30]/5" : "border-black bg-neutral-50"}`}>
        <div className="flex items-center gap-3 min-w-0">
          <div className={`h-10 w-10 flex items-center justify-center shrink-0 ${isInvalid ? "bg-[#B50E30]/10" : "bg-black"}`}>
            {isInvalid ? (
              <AlertTriangle className="h-5 w-5 text-[#B50E30]" />
            ) : (
              <CheckCircle className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-extrabold uppercase tracking-tight truncate ${isInvalid ? "text-[#B50E30]" : "text-black"}`}>
              {file.name}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
              <span>{ext}</span>
              <span className="w-1 h-1 bg-neutral-300 rounded-none" />
              <span>{formatFileSize(file.size)}</span>
              <span className="w-1 h-1 bg-neutral-300 rounded-none" />
              <span className={isInvalid ? "text-[#B50E30] font-bold" : extracting ? "text-neutral-400 animate-pulse" : "text-black font-bold"}>
                {isInvalid ? "Formato no válido" : extracting ? "Extrayendo texto..." : cvText.trim().length > 0 ? "Texto extraído correctamente" : "Listo para analizar"}
              </span>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={removeFile}
          className="h-7 w-7 flex items-center justify-center hover:bg-neutral-200 transition cursor-pointer shrink-0 border border-utp-border"
        >
          <X className="h-3.5 w-3.5 text-neutral-500" />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Module */}
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-black uppercase tracking-wider flex items-center gap-2">
              <FileText className="h-5.5 w-5.5 text-[#B50E30]" />
              CV Analyzer IA - Escaneo ATS
            </h2>
            <p className="text-neutral-500 text-xs font-semibold">
              <span className="text-[#B50E30] font-black uppercase tracking-wider text-[10px] mr-1.5">{getCareerContext(career).area}</span>
              Sube o copia tu CV para evaluar la compatibilidad técnica con tu puesto objetivo: <strong className="text-black">{targetRole || "general"}</strong>.
            </p>
          </div>
          {analysis && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-black hover:bg-neutral-50 text-black font-black uppercase tracking-wider rounded-none text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-[#B50E30]" />
              Nueva simulación
            </button>
          )}
        </div>
      </div>

      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Input Columns */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              {/* Tab selector: Upload vs Paste */}
              <div className="flex border-b border-utp-border pb-3 gap-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("subir")}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "subir"
                      ? "bg-black text-white"
                      : "bg-transparent text-neutral-500 hover:text-black border border-utp-border"
                  }`}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  Subir archivo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("pegar")}
                  className={`px-4 py-2 text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 ${
                    activeTab === "pegar"
                      ? "bg-black text-white"
                      : "bg-transparent text-neutral-500 hover:text-black border border-utp-border"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  Pegar texto
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "subir" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    {/* Drag & Drop Zone */}
                    <div
                      onDrop={extracting ? undefined : handleDrop}
                      onDragOver={extracting ? undefined : handleDragOver}
                      onDragLeave={extracting ? undefined : handleDragLeave}
                      onClick={extracting ? undefined : () => fileInputRef.current?.click()}
                      className={`border-2 border-dashed p-8 text-center transition select-none ${
                        extracting
                          ? "border-black bg-neutral-50 cursor-wait"
                          : dragOver
                            ? "border-black bg-neutral-50 cursor-pointer"
                            : fileStatus === "valid"
                              ? "border-black bg-neutral-50/50 cursor-pointer"
                              : "border-utp-border hover:border-neutral-400 hover:bg-neutral-50 cursor-pointer"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={extracting}
                      />
                      <div className="flex flex-col items-center gap-2">
                        <div className={`h-12 w-12 flex items-center justify-center ${extracting ? "bg-black" : dragOver ? "bg-black" : "bg-neutral-100"}`}>
                          {extracting ? (
                            <div className="h-6 w-6 border-2 border-white border-t-transparent animate-spin" />
                          ) : (
                            <FileText className={`h-6 w-6 ${dragOver ? "text-white" : "text-black"}`} />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-black text-black uppercase tracking-wider">
                            {extracting ? "Extrayendo texto del CV..." : dragOver ? "Suelta tu archivo aquí" : "Arrastra tu CV aquí o selecciona un archivo"}
                          </p>
                          <p className="text-[10px] text-neutral-500 font-semibold mt-1 uppercase tracking-wider">
                            {extracting ? "Procesando documento..." : "Formatos permitidos: PDF o DOCX"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* File Preview Card */}
                    {renderFilePreview()}

                    {/* After file is valid, show simplified post-upload section */}
                    {fileStatus === "valid" && (
                      <div className="mt-5 space-y-4">
                        {/* Extracting state */}
                        {extracting && (
                          <div className="flex items-center gap-3 p-4 bg-neutral-50 border border-utp-border">
                            <div className="h-5 w-5 border-2 border-black border-t-transparent animate-spin" />
                            <span className="text-xs font-bold text-black uppercase tracking-wider">Extrayendo texto del CV...</span>
                          </div>
                        )}

                        {/* Success state */}
                        {!extracting && cvText.trim().length > 0 && (
                          <>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-[#B50E30]" />
                              <span className="text-xs font-bold text-black">Texto extraído correctamente.</span>
                              <span className="text-[11px] text-neutral-500 font-semibold">Revisa el contenido solo si deseas corregir algún dato antes del análisis.</span>
                            </div>

                            {/* Toggle textarea */}
                            <button
                              type="button"
                              onClick={() => setShowText(!showText)}
                              className="flex items-center gap-1.5 text-[11px] text-black font-black uppercase tracking-wider hover:text-[#B50E30] transition cursor-pointer"
                            >
                              <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showText ? "rotate-90" : ""}`} />
                              {showText ? "Ocultar texto extraído" : "Ver texto extraído"}
                            </button>

                            {showText && (
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-[10px] font-black uppercase tracking-wider text-black">Contenido del CV en formato editable</span>
                                    <p className="text-[10px] text-neutral-400 font-semibold mt-0.5">El texto fue ordenado automáticamente para facilitar la revisión. Puedes corregirlo antes del análisis.</p>
                                  </div>
                                  <span className="text-[9px] text-neutral-400 font-extrabold uppercase">{cvText.length.toLocaleString()} caracteres</span>
                                </div>
                                <textarea
                                  value={cvText}
                                  onChange={(e) => setCvText(e.target.value)}
                                  rows={10}
                                  className="w-full p-5 bg-neutral-50 rounded-none border border-utp-border outline-none focus:border-black text-xs font-semibold text-black transition leading-7 font-mono"
                                />
                              </div>
                            )}

                            {/* Confirmation Checkbox */}
                            <div className="flex items-start gap-3 p-4 bg-neutral-50 border border-utp-border">
                              <button
                                type="button"
                                onClick={() => setConfirmed(!confirmed)}
                                className={`h-5 w-5 shrink-0 mt-0.5 flex items-center justify-center transition border cursor-pointer ${
                                  confirmed ? "bg-black border-black text-white" : "bg-white border-neutral-400 hover:border-black"
                                }`}
                              >
                                {confirmed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                              </button>
                              <div>
                                <label
                                  onClick={() => setConfirmed(!confirmed)}
                                  className="text-xs font-bold text-black uppercase tracking-wider cursor-pointer leading-relaxed"
                                >
                                  He revisado la información extraída y confirmo que mi CV está listo para analizar
                                </label>
                              </div>
                            </div>

                          </>
                        )}

                        {/* Failed state */}
                        {!extracting && cvText.trim().length === 0 && (
                          <div className="p-5 bg-neutral-50 border border-utp-border text-center space-y-3">
                            <AlertCircle className="h-8 w-8 text-[#B50E30] mx-auto" />
                            <p className="text-xs font-bold text-black uppercase tracking-wider">No se pudo extraer texto del archivo</p>
                            <p className="text-[11px] text-neutral-500 font-semibold">Puedes pegar el contenido manualmente usando la opción "Pegar texto".</p>
                            <button
                              type="button"
                              onClick={() => setActiveTab("pegar")}
                              className="text-[11px] text-[#B50E30] font-black uppercase tracking-wider hover:underline cursor-pointer"
                            >
                              Ir a pegar texto manualmente
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Toggle to paste text option */}
                    {fileStatus !== "valid" && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setActiveTab("pegar")}
                          className="text-[11px] text-[#B50E30] font-black uppercase tracking-wider hover:underline cursor-pointer"
                        >
                          O pegar contenido del CV manualmente
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "pegar" && (
                  <motion.div
                    key="paste"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-utp-border">
                      <span className="text-[10px] font-black uppercase tracking-wider text-black">Contenido de tu Currículum Vitae (Texto plano)</span>
                      <span className="text-[10px] text-neutral-400 font-extrabold uppercase">Mínimo 30 caracteres</span>
                    </div>

                    <textarea
                      value={cvText}
                      onChange={(e) => setCvText(e.target.value)}
                      rows={11}
                      placeholder="Pega aquí el extracto de tu CV o agrégale tus proyectos académicos directamente para la evaluación..."
                      className="w-full p-4 bg-neutral-50 rounded-none border border-utp-border outline-none focus:border-black text-xs font-semibold text-black transition leading-relaxed font-mono"
                    />

                    {cvText.trim().length > 10 && (
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            const cleaned = cleanExtractedText(cvText);
                            const formatted = formatCvTextAsMarkdown(cleaned);
                            setCvText(formatted);
                          }}
                          className="text-[11px] text-black font-black uppercase tracking-wider hover:text-[#B50E30] transition flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Ordenar texto
                        </button>
                        <span className="text-[9px] text-neutral-400 font-extrabold uppercase">{cvText.length.toLocaleString()} caracteres</span>
                      </div>
                    )}

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTab("subir")}
                        className="text-[11px] text-[#B50E30] font-black uppercase tracking-wider hover:underline cursor-pointer"
                      >
                        O subir archivo PDF / DOCX
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {errorStr && (
                <div className="p-3.5 bg-neutral-50 border-l-4 border-[#B50E30] text-black text-xs flex items-center gap-2 font-bold uppercase tracking-wide">
                  <AlertCircle className="h-4 w-4 text-[#B50E30]" />
                  <span>{errorStr}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={loading || extracting || (activeTab === "subir" && fileStatus === "valid" && !confirmed)}
                  className="bg-[#B50E30] hover:bg-[#85061B] text-white font-black uppercase tracking-widest text-xs py-3 px-6 transition flex items-center gap-2 cursor-pointer rounded-none"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 rounded-none border-2 border-white border-t-transparent animate-spin" />
                      Optimizando CV...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 fill-white" />
                      Analizar CV con IA
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Prompt Templates Assistant Panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <div>
                <h3 className="text-xs font-black text-black uppercase tracking-widest">Ejemplos de Prueba</h3>
                <p className="text-[11px] text-neutral-500 mt-1 font-semibold">Carga formatos desfavorables para simular la evaluación ATS. La IA analizará según tu área: <strong className="text-black">{getCareerContext(career).area}</strong>.</p>
              </div>

              <div className="space-y-2">
                {TEMPLATE_MOCK_CVS.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleLoadTemplate(tmpl.content)}
                    className="w-full p-4 bg-neutral-50 hover:bg-neutral-100 border border-utp-border rounded-none text-left text-xs font-bold text-black transition flex items-center justify-between uppercase tracking-tight"
                  >
                    <span>{tmpl.title}</span>
                    <ArrowUpRight className="h-4 w-4 text-[#B50E30] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 rounded-none border border-utp-border p-5 space-y-3">
              <h4 className="text-[10px] font-black text-black uppercase tracking-wider">¿Qué evalúa la IA?</h4>
              <ul className="space-y-2 text-black text-[11px] font-semibold">
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                  <span><strong>Compatibilidad ATS</strong>: Organización, redacción y palabras clave según tu área.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                  <span><strong>Competencias de {getCareerContext(career).area}</strong>: Herramientas y conocimientos propios de tu carrera.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                  <span><strong>Evidencias</strong>: Proyectos, prácticas o casos que demuestren lo que sabes hacer.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* ===== RESULTS VIEW (Compact & Actionable) ===== */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Resultado rápido de tu CV */}
            <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
              <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" className="stroke-neutral-100 fill-transparent" strokeWidth="7" />
                      <circle cx="48" cy="48" r="40" className="stroke-[#B50E30] fill-transparent transition-all duration-1000" strokeWidth="7" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.score / 100)}`} strokeLinecap="square" />
                    </svg>
                    <div className="absolute font-sans text-center">
                      <span className="text-xl font-black text-black">{analysis.score}</span>
                      <span className="text-[9px] text-neutral-400 font-extrabold block">ATS</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <TrendingUp className="h-5 w-5 text-black" />
                    <span className="text-[8px] font-black text-black uppercase tracking-wider mt-0.5">+{optimizedScore - analysis.score}%</span>
                  </div>
                  <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" className="stroke-neutral-100 fill-transparent" strokeWidth="7" />
                      <circle cx="48" cy="48" r="40" className="stroke-black fill-transparent transition-all duration-1000" strokeWidth="7" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - optimizedScore / 100)}`} strokeLinecap="square" />
                    </svg>
                    <div className="absolute font-sans text-center">
                      <span className="text-xl font-black text-black">{optimizedScore}</span>
                      <span className="text-[9px] text-neutral-400 font-extrabold block">OPT</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 space-y-1.5 text-center sm:text-left">
                  <h3 className="text-sm font-black text-black uppercase tracking-wider">
                    {analysis.score >= 80 ? "CV sobresaliente" : analysis.score >= 60 ? "CV aceptable, requiere ajustes" : "CV en riesgo de ser descartado"}
                  </h3>
                  <div className="text-xs text-neutral-600 font-semibold space-y-0.5">
                    <p><span className="text-[10px] font-black text-[#B50E30] uppercase tracking-wider mr-1">{getCareerContext(career).area}</span> Vacante objetivo: <strong className="text-black">{targetRole}</strong></p>
                    <p>Impacto en ruta: <strong className="text-[#B50E30]">+{optimizedScore - analysis.score}% compatibilidad</strong></p>
                  </div>
                  <span className="inline-block bg-black text-white text-[9px] font-black px-2 py-0.5 uppercase tracking-wider mt-1">
                    Próxima acción: {recommendations.length > 0 ? recommendations[0].split(",")[0].substring(0, 40) : "Optimizar perfil profesional"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Tu próxima mejor acción */}
            {recommendations.length > 0 && (
              <div className="bg-black text-white rounded-none p-6 border border-neutral-900 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-20 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
                <div className="relative z-10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 fill-[#B50E30] text-[#B50E30]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#B50E30]">Tu próxima mejor acción</span>
                  </div>
                  <p className="text-sm text-neutral-200 font-bold leading-relaxed">{recommendations[0]}</p>
                  <div className="flex items-center gap-4 pt-1 text-xs">
                    <span className="text-neutral-400">Impacto estimado:</span>
                    <span className="text-[#B50E30] font-black">+{optimizedScore - analysis.score}% compatibilidad</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Tus 3 mejoras prioritarias */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <h3 className="text-xs font-black text-black uppercase tracking-widest pb-2 border-b border-utp-border flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B50E30] fill-[#B50E30]" />
                Tus 3 mejoras prioritarias
              </h3>
              <div className="space-y-2">
                {recommendations.slice(0, 3).map((rec, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 border border-utp-border flex items-start gap-3">
                    <div className="h-6 w-6 bg-black flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-white text-[10px] font-black">{idx + 1}</span>
                    </div>
                    <div>
                      <p className="text-xs text-black font-bold leading-relaxed">{rec}</p>
                      <p className="text-[10px] text-neutral-500 font-semibold mt-0.5">Impacto: +{Math.round((optimizedScore - analysis.score) / Math.max(1, recommendations.length))}% compatibilidad</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Extracto optimizado para tu CV */}
            {analysis.atsFormattedCvAdvice && (
              <div className="bg-black text-white rounded-none p-6 border border-neutral-900">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 fill-[#B50E30] text-[#B50E30]" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Extracto optimizado para tu CV</span>
                  </div>
                </div>
                <div className="py-4 text-neutral-300 font-mono text-xs leading-relaxed whitespace-pre-line select-all max-h-40 overflow-y-auto">
                  {analysis.atsFormattedCvAdvice}
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(analysis.atsFormattedCvAdvice || "");
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    }}
                    className="bg-white text-black font-black text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-neutral-200 transition cursor-pointer flex items-center gap-1.5"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                    {copied ? "Copiado" : "Copiar extracto"}
                  </button>
                  <span className="text-[9px] text-neutral-500 font-semibold">Puedes usar este texto en tu CV o LinkedIn.</span>
                </div>
              </div>
            )}

            {/* 5. Antes vs Después compacto */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-utp-border">
                <h3 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#B50E30]" />
                  Antes vs Después
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-neutral-50 border border-utp-border space-y-1">
                  <span className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#B50E30]" />
                    Antes
                  </span>
                  <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed italic truncate max-h-12">
                    &ldquo;{beforeAfter.before}&rdquo;
                  </p>
                </div>
                <div className="p-3 bg-black border border-neutral-800 space-y-1">
                  <span className="text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-white" />
                    Después
                  </span>
                  <p className="text-[11px] text-neutral-300 font-semibold leading-relaxed italic truncate max-h-12">
                    &ldquo;{beforeAfter.after}&rdquo;
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-[#B50E30]/5 border border-[#B50E30]/10">
                <Sparkles className="h-3.5 w-3.5 text-[#B50E30] shrink-0 fill-[#B50E30]" />
                <p className="text-[10px] text-black font-bold uppercase tracking-wider">Impacto: +{optimizedScore - analysis.score}% en filtros ATS</p>
              </div>
            </div>

            {/* 6. Informe detallado (accordion) */}
            <div className="bg-white rounded-none border border-utp-border">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="w-full p-5 flex items-center justify-between text-left transition hover:bg-neutral-50 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#B50E30]" />
                  <span className="text-xs font-black text-black uppercase tracking-widest">Ver informe detallado de mejora</span>
                </div>
                <ChevronRight className={`h-4 w-4 text-black transition-transform ${showDetails ? "rotate-90" : ""}`} />
              </button>
              {showDetails && (
                <div className="px-5 pb-5 pt-0 border-t border-utp-border">
                  <div className="pt-4 text-black text-xs leading-relaxed space-y-3 font-semibold">
                    <ReactMarkdown>{analysis.generalFeedback}</ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Keywords Section */}
            <div className="bg-white rounded-none border border-utp-border p-5 space-y-4">
              <div className="flex items-center gap-1.5 pb-2 border-b border-utp-border">
                <Shield className="h-3.5 w-3.5 text-[#B50E30]" />
                <span className="text-[10px] font-black text-black uppercase tracking-wider">Palabras clave</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-[9px] font-black text-black uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-[#B50E30]" />
                    Encontradas ({analysis.keywordsFound.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywordsFound.length > 0 ? analysis.keywordsFound.slice(0, 6).map((kw, idx) => (
                      <span key={idx} className="bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-tight">{kw}</span>
                    )) : <span className="text-[9px] text-neutral-400 font-semibold">Ninguna</span>}
                  </div>
                </div>
                <div className="border-t border-utp-border pt-3">
                  <div className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-[#B50E30]" />
                    Faltantes ({analysis.keywordsMissing.length})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywordsMissing.length > 0 ? analysis.keywordsMissing.slice(0, 6).map((kw, idx) => (
                      <span key={idx} className="bg-[#B50E30]/10 text-[#B50E30] border border-[#B50E30]/25 text-[9px] font-bold px-2 py-0.5 uppercase tracking-tight">{kw}</span>
                    )) : <span className="text-[9px] text-neutral-400 font-semibold">Completas</span>}
                  </div>
                  {analysis.keywordsMissing.length > 0 && (
                    <button
                      type="button"
                      className="mt-2 text-[9px] text-black font-black uppercase tracking-wider hover:text-[#B50E30] transition flex items-center gap-1 cursor-pointer"
                    >
                      <PlusCircle className="h-3 w-3" />
                      Crear misión para cerrar brecha
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses compact */}
            <div className="bg-white rounded-none border border-utp-border p-5 space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-utp-border">
                <ThumbsUp className="h-3.5 w-3.5 text-[#B50E30]" />
                <span className="text-[10px] font-black text-black uppercase tracking-wider">Fortalezas & Alertas</span>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-[9px] font-black text-black uppercase tracking-wider mb-1">Fortalezas ({Math.min(3, analysis.strengths.length)})</div>
                  <ul className="space-y-1">
                    {analysis.strengths.slice(0, 3).map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[10px] font-semibold text-black">
                        <span className="text-[#B50E30] font-black mt-0.5">•</span>
                        <span className="leading-relaxed">{str.length > 60 ? str.substring(0, 60) + "..." : str}</span>
                      </li>
                    ))}
                    {analysis.strengths.length === 0 && <li className="text-[10px] text-neutral-400 font-semibold">Sin fortalezas detectadas</li>}
                  </ul>
                </div>
                <div className="border-t border-utp-border pt-2">
                  <div className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider mb-1">Alertas ({Math.min(3, analysis.weaknesses.length)})</div>
                  <ul className="space-y-1">
                    {analysis.weaknesses.slice(0, 3).map((weak, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-[10px] font-bold text-[#B50E30]">
                        <span className="font-black mt-0.5">•</span>
                        <span className="leading-relaxed">{weak.length > 60 ? weak.substring(0, 60) + "..." : weak}</span>
                      </li>
                    ))}
                    {analysis.weaknesses.length === 0 && <li className="text-[10px] text-neutral-400 font-semibold">Sin alertas</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Route Impact */}
            {routeImpact && (
              <div className="bg-white rounded-none border border-utp-border p-5 space-y-3">
                <div className="flex items-center gap-1.5 pb-2 border-b border-utp-border">
                  <TrendingUp className="h-3.5 w-3.5 text-[#B50E30]" />
                  <span className="text-[10px] font-black text-black uppercase tracking-wider">Impacto en tu Ruta</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-semibold">Misión</span>
                    <span className="font-extrabold text-black text-right max-w-[55%]">Optimizar CV para filtros ATS</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-semibold">Antes</span>
                    <span className="font-extrabold text-black">{routeImpact.compatibilityBefore}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-semibold">Después</span>
                    <span className="font-extrabold text-black">{routeImpact.compatibilityAfter}%</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-utp-border pt-1.5">
                    <span className="font-black text-black uppercase tracking-wider text-[11px]">Impacto</span>
                    <span className="bg-[#B50E30]/10 text-[#B50E30] font-black text-[10px] px-2 py-0.5 border border-[#B50E30]/20">+{routeImpact.impact}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 font-semibold">Evidencia</span>
                    <span className="font-extrabold text-black flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-[#B50E30]" />
                      {routeImpact.evidence}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* This improvement is part of your Route */}
            {routeImpact && (
              <div className="bg-black text-white rounded-none p-5 border border-neutral-900 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
                  <div className="h-6 w-6 bg-[#B50E30] flex items-center justify-center shrink-0">
                    <Briefcase className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-wider">Esta mejora forma parte de tu Ruta</h4>
                    <p className="text-[8px] text-neutral-500 font-semibold uppercase tracking-wider">SkillQuest UTP</p>
                  </div>
                </div>
                <div className="text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Estado</span>
                    <span className="text-[#B50E30] font-black flex items-center gap-1 uppercase tracking-wider">
                      <Sparkles className="h-3 w-3 fill-[#B50E30]" />
                      En progreso
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Impacto</span>
                    <span className="text-white font-extrabold">+{routeImpact.impact}% compatibilidad</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Evidencia</span>
                    <span className="text-white font-extrabold flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-[#B50E30]" />
                      {routeImpact.evidence}
                    </span>
                  </div>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex items-center gap-2 text-[11px]">
                  <ArrowRight className="h-3.5 w-3.5 text-[#B50E30] shrink-0" />
                  <span className="text-neutral-400 font-semibold">Siguiente:</span>
                  <span className="text-white font-extrabold">{routeImpact.nextMission}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
