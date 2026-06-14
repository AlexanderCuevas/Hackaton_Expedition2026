import { useState, useEffect } from "react";
import { CvAnalysis, SkillGap, CvMeta, UserProfile } from "../types";
import {
  FileText, Sparkles, AlertCircle, CheckCircle,
  BookOpen, AlertTriangle, TrendingUp, ChevronRight, X,
  ArrowRight, Check, Shield, ThumbsUp, ThumbsDown, Copy, Save,
  RefreshCw, Printer, Download, ChevronLeft
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { buildHtmlCv, buildPlainTextCv, copyPlainTextToClipboard, triggerPrintCv } from "../utils/cvGenerator";

/* ============================================================
   Simulated data — MVP without file upload or API calls
   ============================================================ */

const SIMULATED_CV = {
  fileName: "CV_Aaron_Silva.pdf",
  format: "PDF",
  source: "Perfil Profesional",
  status: "Analizado por IA",
  targetRole: "Backend Developer Trainee",
  analysisDate: "Hoy"
};

const SIMULATED_ANALYSIS: CvAnalysis = {
  score: 62,
  strengths: [
    "Sólida formación académica en la carrera.",
    "Experiencia o proyectos relacionados.",
    "Buena disposición al aprendizaje y trabajo en equipo."
  ],
  weaknesses: [
    "No se mencionan tecnologías o herramientas específicas de la vacante.",
    "Faltan logros medibles y resultados cuantificables.",
    "Redacción genérica sin orientación al puesto objetivo."
  ],
  keywordsFound: ["SQL", "React", "Soporte técnico", "Organización", "Desarrollo web"],
  keywordsMissing: ["Git/GitHub", "APIs REST", "Scrum", "CI/CD", "Testing"],
  generalFeedback: `## Informe detallado del análisis ATS

### 1. Estructura del CV
El CV tiene una base útil, pero necesita mayor jerarquía visual y organización por secciones.

### 2. Contenido
**Perfil profesional:** falta un resumen inicial orientado al puesto.
**Educación:** correcta, pero puede reforzarse con logros académicos.
**Experiencia:** mencionada de forma genérica, sin métricas.
**Habilidades:** listadas, pero sin contexto de aplicación.

### 3. Recomendaciones clave
- Agregar un perfil profesional de 3 a 4 líneas orientado a la vacante.
- Incluir proyectos prácticos relacionados a la vacante objetivo.
- Cuantificar logros con números y porcentajes.
- Agregar certificaciones o cursos relevantes al área.
- Incluir enlaces a LinkedIn, GitHub o portafolio profesional.`,
  atsFormattedCvAdvice: "Estudiante de Ingeniería de Sistemas e Informática de ciclo avanzado, orientado al desarrollo backend y análisis de datos. Cuenta con conocimientos en SQL, desarrollo web y construcción de soluciones digitales. Interesado en fortalecer experiencia en APIs REST, control de versiones y metodologías ágiles, aportando capacidad de análisis, aprendizaje autónomo y resolución de problemas."
};

const SIMULATED_OPTIMIZED_SCORE = 85;

const SIMULATED_GAPS: SkillGap[] = [
  { skillName: "Modelamiento de bases de datos SQL", category: "tecnica", priority: "alta", description: "", recommendedResource: "Curso SQL Avanzado en Udemy", status: "pendiente" },
  { skillName: "Comunicación asertiva en equipos Scrum", category: "blanda", priority: "media", description: "", recommendedResource: "Taller de habilidades blandas UTP", status: "pendiente" },
  { skillName: "Certificación AWS Certified Cloud Practitioner", category: "certificacion", priority: "alta", description: "", recommendedResource: "AWS Skill Builder", status: "pendiente" }
];

const SIMULATED_SKILLS = ["HTML/CSS", "JavaScript", "SQL Server", "TypeScript", "Python"];

/* ============================================================
   Subcomponents
   ============================================================ */

function ScoreCircleAnimated({ score, label, color }: { score: number; label: string; color: string }) {
  const [current, setCurrent] = useState(0);
  const r = 40;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 900;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative h-24 w-24 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={r} className="stroke-neutral-100 fill-transparent" strokeWidth="7" />
        <circle
          cx="48" cy="48" r={r}
          className={`fill-transparent transition-none ${color}`}
          strokeWidth="7"
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - current / 100)}
        />
      </svg>
      <div className="absolute font-sans text-center">
        <span className="text-xl font-black text-black">{current}</span>
        <span className="text-[9px] text-neutral-400 font-extrabold block">{label}</span>
      </div>
    </div>
  );
}

function DeltaBadge({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 900;

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    }

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return <>{current}</>;
}

/* ============================================================
   Helpers
   ============================================================ */

const getRouteImpactData = (score: number, optimizedScore: number) => {
  const impact = optimizedScore - score;
  return {
    compatibilityBefore: score,
    compatibilityAfter: optimizedScore,
    impact,
    evidence: "CV optimizado en formato Harvard",
    nextMission: "Simular entrevista técnico-comportamental"
  };
};

/* ============================================================
   Props
   ============================================================ */

interface CvAnalyzerPanelProps {
  targetRole: string;
  onAnalysisResult: (analysis: CvAnalysis) => void;
  savedAnalysis?: CvAnalysis;
  cvInfo?: CvMeta;
  cvText?: string;
  gaps?: SkillGap[];
  currentSkills?: string[];
  onNavigateToDiagnostico?: () => void;
  profile?: UserProfile;
}

/* ============================================================
   Component
   ============================================================ */

export default function CvAnalyzerPanel({
  targetRole,
  onAnalysisResult: _onAnalysisResult,
  savedAnalysis,
  cvInfo,
  cvText: incomingCvText,
  gaps: incomingGaps,
  currentSkills: incomingSkills,
  onNavigateToDiagnostico,
  profile
}: CvAnalyzerPanelProps) {
  const analysis = savedAnalysis ?? SIMULATED_ANALYSIS;
  const optimizedScore = savedAnalysis
    ? Math.min(95, Math.max(analysis.score + 15, analysis.score + Math.round((100 - analysis.score) * 0.35)))
    : SIMULATED_OPTIMIZED_SCORE;
  const routeImpact = getRouteImpactData(analysis.score, optimizedScore);

  const gaps = incomingGaps ?? SIMULATED_GAPS;
  const skills = incomingSkills ?? SIMULATED_SKILLS;
  const displayInfo = cvInfo ?? {
    ...SIMULATED_CV,
    targetRole: targetRole || SIMULATED_CV.targetRole,
  };

  const [activeTab, setActiveTab] = useState<"resumen" | "mejoras" | "keywords" | "informe">("resumen");
  const [copiedExtract, setCopiedExtract] = useState(false);
  const [evidenceSaved, setEvidenceSaved] = useState(false);
  const [cvCopied, setCvCopied] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);

  const getCvData = () => ({
    name: profile?.name || "Estudiante UTP",
    career: profile?.career || "",
    email: profile?.email,
    phone: profile?.phone,
    linkedin: profile?.linkedin,
    hardSkills: incomingSkills || skills,
    softSkills: profile?.softSkills,
    experienceLevel: profile?.experienceLevel,
    targetRole: targetRole,
  });

  const getOrBuildCvHtml = () => {
    return localStorage.getItem("sp_cv_html") || buildHtmlCv(getCvData());
  };

  const handlePrintCv = () => {
    const html = getOrBuildCvHtml();
    triggerPrintCv(html);
  };

  const handleCopyCvText = () => {
    const plainText = buildPlainTextCv(getCvData());
    copyPlainTextToClipboard(plainText);
    setCvCopied(true);
    setTimeout(() => setCvCopied(false), 2500);
  };

  const tabs = [
    { key: "resumen", label: "Resumen IA" },
    { key: "mejoras", label: "Mejoras" },
    { key: "keywords", label: "Keywords" },
    { key: "informe", label: "Informe" }
  ] as const;

  const carouselSlides = [
    {
      title: "Adapta tu CV al formato Harvard",
      action: "Ordena tu CV en secciones claras: perfil, educación, experiencia, habilidades y logros.",
      explanation: "Mejora la lectura ATS y ayuda al reclutador a encontrar tu información rápido.",
      impact: "+8%"
    },
    {
      title: "Agrega logros medibles",
      action: "Incluye resultados con números, porcentajes, tiempos o impacto en tus experiencias.",
      explanation: "Los reclutadores priorizan candidatos que demuestran resultados concretos.",
      impact: "+10%"
    },
    {
      title: "Alinea habilidades con la vacante",
      action: "Agrega palabras clave como SQL, APIs REST, Git/GitHub y metodologías ágiles.",
      explanation: "Sin estas keywords tu CV no pasa el primer filtro automático del ATS.",
      impact: "+12%"
    }
  ];

  return (
    <div className="space-y-6">
      {/* ==================== HEADER ==================== */}
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="relative z-10 space-y-1">
          <h2 className="heading-lg text-black flex items-center gap-2">
            <FileText className="h-5.5 w-5.5 text-[#B50E30]" />
            CV Analyzer IA &mdash; Escaneo ATS
          </h2>
          <p className="text-neutral-500 text-sm font-semibold leading-relaxed">
            Tu CV ya está listo para el análisis. La IA revisó tu perfil y te dice exactamente
            qué mejorar para que pases los filtros ATS y llegues a la entrevista.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ==================== LEFT COLUMN (2/3) ==================== */}
        <div className="lg:col-span-2 space-y-6">

          {/* -------- 1. CV current card -------- */}
          <div className="bg-white rounded-none border border-utp-border p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 bg-black flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black text-black uppercase tracking-wider flex items-center gap-1.5">
                  CV actual cargado
                  <CheckCircle className="h-3 w-3 text-[#B50E30]" />
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0 text-[9px] font-semibold text-neutral-500">
                  <span className="font-extrabold text-black">{displayInfo.fileName}</span>
                  <span className="w-0.5 h-0.5 bg-neutral-300 rounded-full" />
                  <span>{displayInfo.format}</span>
                  <span className="w-0.5 h-0.5 bg-neutral-300 rounded-full" />
                  <span>{displayInfo.source}</span>
                  <span className="w-0.5 h-0.5 bg-neutral-300 rounded-full" />
                  <span>{displayInfo.status}</span>
                  <span className="w-0.5 h-0.5 bg-neutral-300 rounded-full" />
                  <span>Score: {analysis.score}%</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 shrink-0 no-print">
                <button
                  type="button"
                  onClick={handlePrintCv}
                  className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white font-black uppercase tracking-wider rounded-none text-[10px] flex items-center gap-1.5 transition cursor-pointer"
                  title="Imprimir o guardar como PDF"
                >
                  <Printer className="h-3.5 w-3.5" />
                  PDF
                </button>
                <button
                  type="button"
                  onClick={handleCopyCvText}
                  className="px-3 py-1.5 border border-black hover:bg-neutral-50 text-black font-black uppercase tracking-wider rounded-none text-[10px] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {cvCopied ? "Copiado" : "Texto"}
                </button>
              </div>
            </div>
          </div>

          {/* -------- 3-STEP GUIDE -------- */}
          <div className="bg-white rounded-none border border-utp-border p-5">
            <div className="flex items-center justify-between gap-2">
              {[
                { icon: FileText, label: "CV cargado" },
                { icon: Sparkles, label: "IA analizó brechas" },
                { icon: TrendingUp, label: "Mejora tu CV" }
              ].map((step, idx) => (
                <div key={idx} className="flex items-center gap-2 flex-1">
                  <div className="h-8 w-8 bg-neutral-100 flex items-center justify-center shrink-0">
                    <step.icon className={`h-4 w-4 ${idx === 0 ? "text-black" : idx === 1 ? "text-[#B50E30]" : "text-black"}`} />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${idx < 2 ? "text-black" : "text-black"}`}>
                    {step.label}
                  </span>
                  {idx < 2 && <div className="flex-1 h-px bg-neutral-200 mx-2" />}
                </div>
              ))}
            </div>
          </div>

          {/* -------- CARD: ANÁLISIS IA DEL CV -------- */}
          <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-4 border-b border-utp-border">
                <Sparkles className="h-4 w-4 text-[#B50E30] fill-[#B50E30]" />
                Análisis IA del CV
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch gap-6 pt-5">
                {/* Left: score rings */}
                <div className="flex items-center gap-5 shrink-0">
                  <ScoreCircleAnimated score={analysis.score} label="actual" color="stroke-[#B50E30]" />
                  <div className="flex flex-col items-center">
                    <TrendingUp className="h-5 w-5 text-black" />
                    <span className="text-[9px] font-black text-black uppercase tracking-wider mt-0.5">
                      +<DeltaBadge value={optimizedScore - analysis.score} />%
                    </span>
                  </div>
                  <ScoreCircleAnimated score={optimizedScore} label="óptimo" color="stroke-black" />
                </div>

                {/* Right: status + problem + next step */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between border-b border-utp-border pb-2">
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Estado</span>
                    <span className="text-sm font-black text-black uppercase">
                      {analysis.score >= 80 ? "CV sobresaliente" : analysis.score >= 60 ? "Requiere ajustes" : "CV en riesgo"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-utp-border pb-2">
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Score optimizado</span>
                    <span className="text-sm font-extrabold text-black">{optimizedScore}%</span>
                  </div>

                  <div className="p-4 bg-neutral-50 border border-utp-border space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-[#B50E30] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-wider">Problema principal</p>
                        <p className="text-xs text-neutral-600 font-semibold mt-0.5 leading-relaxed">
                          Faltan keywords técnicas y logros medibles.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-2 border-t border-utp-border">
                      <Sparkles className="h-4 w-4 text-[#B50E30] shrink-0 fill-[#B50E30] mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-wider">Siguiente paso</p>
                        <p className="text-xs text-neutral-600 font-semibold mt-0.5 leading-relaxed">
                          Aplicar formato Harvard y agregar logros con números.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------- HAZ ESTO PRIMERO (CARRUSEL) -------- */}
          <div className="relative group">
            {/* Depth layer behind card */}
            <div className="absolute inset-0 translate-y-1.5 bgpul-black/5 rounded-none pointer-events-none" />
            {/* Main card */}
            <div className="relative bg-black text-white rounded-none p-7 border border-neutral-800 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.35)] transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.5)]">
              <div className="flex items-start gap-5">
                <div className="h-11 w-11 bg-[#B50E30] flex items-center justify-center shrink-0">
                  <Sparkles className="h-5 w-5 fill-white text-white" />
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-black uppercase tracking-widest text-[#B50E30]">Haz esto primero</p>
                    <span className="text-[10px] text-neutral-500 font-black">
                      {carouselIdx + 1}/{carouselSlides.length}
                    </span>
                  </div>
                  <p className="text-base font-extrabold uppercase tracking-tight">
                    {carouselSlides[carouselIdx].title}
                  </p>
                  <div className="space-y-2 text-sm text-neutral-300 font-semibold leading-relaxed">
                    <p><span className="text-[10px] font-black text-white uppercase tracking-wider">Qué hacer: </span>{carouselSlides[carouselIdx].action}</p>
                    <p><span className="text-[10px] font-black text-white uppercase tracking-wider">Por qué: </span>{carouselSlides[carouselIdx].explanation}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                    <div className="flex items-center gap-2">
                      {carouselSlides.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCarouselIdx(idx)}
                          className={`h-2 transition-all duration-200 cursor-pointer ${
                            idx === carouselIdx ? "bg-[#B50E30] w-5" : "bg-neutral-700 w-2 hover:bg-neutral-500"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black text-[#B50E30] uppercase tracking-wider">Impacto: {carouselSlides[carouselIdx].impact}</span>
                      <button
                        type="button"
                        onClick={() => setCarouselIdx(prev => Math.max(0, prev - 1))}
                        disabled={carouselIdx === 0}
                        className="h-7 w-7 border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-3.5 w-3.5 text-white" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCarouselIdx(prev => Math.min(carouselSlides.length - 1, prev + 1))}
                        disabled={carouselIdx === carouselSlides.length - 1}
                        className="h-7 w-7 border border-neutral-700 flex items-center justify-center hover:bg-neutral-800 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------- TAB SYSTEM -------- */}
          <div className="bg-white rounded-none border border-utp-border">
            {/* Tab bar */}
            <div className="flex border-b border-utp-border">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-3 px-4 text-[11px] font-black uppercase tracking-wider transition cursor-pointer ${
                    activeTab === tab.key
                      ? "text-[#B50E30] border-b-2 border-[#B50E30] bg-white"
                      : "text-neutral-500 hover:text-black bg-neutral-50/50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="p-6">
              {/* ============ TAB: RESUMEN IA ============ */}
              {activeTab === "resumen" && (
                <div className="space-y-6">
                  <p className="text-xs text-neutral-500 font-semibold border-b border-utp-border pb-3 -mt-2">Lo bueno y lo que debes corregir.</p>

                  {/* Fortalezas */}
                  <div>
                    <span className="text-[11px] font-black text-green-600 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      Fortalezas
                    </span>
                    <ul className="space-y-1">
                      {analysis.strengths.slice(0, 3).map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs font-semibold text-black">
                          <span className="text-[#B50E30] font-black mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Alertas */}
                  <div className="border-t border-utp-border pt-4">
                    <span className="text-[11px] font-black text-amber-600 uppercase tracking-wider flex items-center gap-1 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      Alertas
                    </span>
                    <ul className="space-y-1">
                      {analysis.weaknesses.slice(0, 3).map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs font-bold text-black">
                          <span className="font-black mt-0.5">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Extracto optimizado */}
                  <div className="bg-black text-white rounded-none p-5 border border-neutral-900">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 fill-[#B50E30] text-[#B50E30]" />
                        <span className="heading-xs tracking-widest">Extracto optimizado para formato Harvard</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-semibold pt-3 pb-1">
                      Copia este texto en la sección Perfil profesional de tu CV.
                    </p>
                    <div className="py-3 text-neutral-300 font-mono text-xs leading-relaxed select-all">
                      {analysis.atsFormattedCvAdvice}
                    </div>
                    <p className="text-[10px] text-neutral-500 font-semibold pb-3">
                      Este extracto ya está orientado a tu vacante objetivo.
                    </p>
                    <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(analysis.atsFormattedCvAdvice || "");
                          setCopiedExtract(true);
                          setTimeout(() => setCopiedExtract(false), 2500);
                        }}
                        className="bg-white text-black font-black text-[11px] uppercase tracking-wider px-4 py-2 hover:bg-neutral-200 transition cursor-pointer flex items-center gap-1.5"
                      >
                        {copiedExtract ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copiedExtract ? "Copiado" : "Copiar extracto"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEvidenceSaved(true);
                          setTimeout(() => setEvidenceSaved(false), 2500);
                        }}
                        className="border border-neutral-700 text-neutral-300 font-black text-[11px] uppercase tracking-wider px-4 py-2 hover:bg-neutral-800 transition cursor-pointer flex items-center gap-1.5"
                      >
                        {evidenceSaved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                        {evidenceSaved ? "Guardado" : "Guardar como evidencia"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ============ TAB: MEJORAS ============ */}
              {activeTab === "mejoras" && (
                <div className="space-y-6">
                  <p className="text-xs text-neutral-500 font-semibold border-b border-utp-border pb-3 -mt-2">Tus acciones prioritarias.</p>

                  <div className="space-y-3">
                    {[
                      { title: "Adaptar al formato Harvard", que: "Ordena tu CV en secciones claras.", por: "Ayuda al reclutador y al ATS a leer tu perfil.", impacto: "+8%" },
                      { title: "Agregar logros medibles", que: "Incluye resultados con números, porcentajes o tiempos.", por: "Los reclutadores buscan impacto medible, no descripciones.", impacto: "+10%" },
                      { title: "Alinear habilidades con la vacante", que: "Agrega SQL, APIs REST, Git/GitHub y metodologías ágiles.", por: "Sin estas keywords tu CV no pasa el primer filtro automático.", impacto: "+12%" }
                    ].map((rec, idx) => (
                      <div key={idx} className="p-4 bg-neutral-50 border border-utp-border">
                        <div className="flex items-start gap-3">
                          <div className="h-6 w-6 bg-black flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-white text-[10px] font-black">{idx + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-extrabold text-black uppercase tracking-tight">{rec.title}</p>
                            <div className="mt-2 space-y-1 text-xs">
                              <p className="text-neutral-600 font-semibold"><span className="font-black text-black uppercase tracking-wider text-[10px]">Qué hacer:</span> {rec.que}</p>
                              <p className="text-neutral-600 font-semibold"><span className="font-black text-black uppercase tracking-wider text-[10px]">Por qué importa:</span> {rec.por}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-utp-border flex items-center justify-end">
                          <span className="text-[10px] font-black text-[#B50E30] uppercase tracking-wider">Impacto: {rec.impacto}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Estructura Harvard */}
                  <div className="border-t border-utp-border pt-5">
                    <h4 className="heading-xs text-black flex items-center gap-2 mb-3">
                      <BookOpen className="h-4 w-4 text-[#B50E30]" />
                      Estructura Harvard recomendada
                    </h4>
                    <p className="text-[11px] text-neutral-500 font-semibold mb-3">Tu CV debe tener estas secciones en orden:</p>
                    <div className="space-y-1.5">
                      {[
                        { num: "1", title: "Encabezado profesional", desc: "Nombre, correo, teléfono, LinkedIn, GitHub." },
                        { num: "2", title: "Perfil profesional", desc: "Resumen breve orientado a la vacante." },
                        { num: "3", title: "Educación", desc: "Carrera, universidad, ciclo o año académico." },
                        { num: "4", title: "Experiencia / proyectos", desc: "Prácticas o proyectos académicos relevantes." },
                        { num: "5", title: "Habilidades", desc: "Skills técnicas y blandas alineadas al puesto." },
                        { num: "6", title: "Certificaciones", desc: "Cursos, talleres o eventos relevantes." },
                        { num: "7", title: "Logros o evidencias", desc: "Resultados medibles o portafolio." }
                      ].map((s) => (
                        <div key={s.num} className="flex items-start gap-2 p-2 bg-neutral-50 border border-utp-border">
                          <div className="h-5 w-5 bg-black flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-white text-[8px] font-black">{s.num}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-[11px] font-extrabold text-black uppercase tracking-tight">{s.title}</p>
                            <p className="text-[10px] text-neutral-500 font-semibold">{s.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ============ TAB: KEYWORDS ============ */}
              {activeTab === "keywords" && (
                <div className="space-y-4">
                  <p className="text-xs text-neutral-500 font-semibold border-b border-utp-border pb-3 -mt-2">Palabras que ayudan a pasar filtros ATS.</p>

                  <div className="flex items-center gap-1.5 pb-2">
                    <Shield className="h-4 w-4 text-[#B50E30]" />
                    <span className="text-[11px] font-black text-black uppercase tracking-wider">Palabras clave detectadas</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] font-black text-black uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5 text-[#B50E30]" />
                        Encontradas ({Math.min(5, analysis.keywordsFound.length)})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {analysis.keywordsFound.slice(0, 5).map((kw, idx) => (
                          <span key={idx} className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-tight">{kw}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-[#B50E30] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5 text-[#B50E30]" />
                        Faltantes ({Math.min(5, analysis.keywordsMissing.length)})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {analysis.keywordsMissing.slice(0, 5).map((kw, idx) => (
                          <span key={idx} className="bg-[#B50E30]/10 text-[#B50E30] border border-[#B50E30]/25 text-[10px] font-bold px-2 py-0.5 uppercase tracking-tight">{kw}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-utp-border text-xs font-semibold text-neutral-600 leading-relaxed">
                    <AlertCircle className="h-3.5 w-3.5 text-[#B50E30] inline mr-1 -mt-0.5" />
                    Los filtros ATS bloquean CVs sin keywords antes de que los vea un reclutador. Tienes {analysis.keywordsFound.length} de {analysis.keywordsFound.length + analysis.keywordsMissing.length} términos clave.
                  </div>
                </div>
              )}

              {/* ============ TAB: INFORME ============ */}
              {activeTab === "informe" && (
                <div className="space-y-4 text-xs font-semibold text-neutral-700 leading-relaxed">
                  <p className="text-xs text-neutral-500 font-semibold border-b border-utp-border pb-3 -mt-2">Detalle completo para revisar con calma.</p>

                  <h4 className="text-[11px] font-black text-black uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-utp-border">
                    <BookOpen className="h-4 w-4 text-[#B50E30]" />
                    Informe detallado del análisis ATS
                  </h4>

                  <div>
                    <p className="text-[11px] font-black text-black uppercase tracking-wider mb-1.5">1. Estructura del CV</p>
                    <p className="text-xs text-neutral-600">El CV tiene una base útil, pero necesita mayor jerarquía visual y organización por secciones.</p>
                  </div>

                  <div>
                    <p className="text-[11px] font-black text-black uppercase tracking-wider mb-1.5">2. Contenido</p>
                    <ul className="space-y-1 list-disc list-inside text-xs text-neutral-600">
                      <li><strong>Perfil profesional:</strong> falta un resumen inicial orientado al puesto.</li>
                      <li><strong>Educación:</strong> correcta, pero puede reforzarse con logros académicos.</li>
                      <li><strong>Experiencia:</strong> mencionada de forma genérica, sin métricas.</li>
                      <li><strong>Habilidades:</strong> listadas, pero sin contexto de aplicación.</li>
                    </ul>
                  </div>

                  <div>
                    <p className="text-[11px] font-black text-black uppercase tracking-wider mb-1.5">3. Recomendaciones clave</p>
                    <ul className="space-y-1 list-disc list-inside text-xs text-neutral-600">
                      <li>Agregar un perfil profesional de 3 a 4 líneas orientado a la vacante.</li>
                      <li>Incluir proyectos prácticos relacionados a la vacante objetivo.</li>
                      <li>Cuantificar logros con números y porcentajes.</li>
                      <li>Agregar certificaciones o cursos relevantes al área.</li>
                      <li>Incluir enlaces a LinkedIn, GitHub o portafolio profesional.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ==================== RIGHT COLUMN (1/3) ==================== */}
        <div className="space-y-4">
          {/* -------- Skills & Brechas -------- */}
          <div className="bg-white rounded-none border border-utp-border p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-utp-border">
              <h3 className="heading-sm text-black tracking-widest flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#B50E30]" />
                Skills & Brechas
              </h3>
              {gaps.filter(g => g.priority === "alta" && g.status !== "completado").length > 0 && (
                <span className="bg-black text-white text-[10px] font-black px-2 py-0.5 rounded-none uppercase">
                  {gaps.filter(g => g.priority === "alta" && g.status !== "completado").length} Críticas
                </span>
              )}
            </div>

            <p className="text-[11px] text-neutral-500 font-semibold mb-4 leading-relaxed">
              Estas brechas explican por qué tu CV aún no llega al score ideal.
            </p>

            {skills.length > 0 && (
              <div className="mb-4">
                <p className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mb-2">Tus habilidades actuales</p>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="bg-black text-white text-[11px] font-bold px-3 py-1.5 uppercase tracking-tight">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {gaps.length === 0 ? (
              <div className="text-center py-6 px-4">
                <AlertCircle className="h-6 w-6 text-[#B50E30] mx-auto mb-2" />
                <p className="text-black text-[11px] font-extrabold uppercase tracking-wide">Sin diagnóstico registrado</p>
                {onNavigateToDiagnostico && (
                  <button
                    type="button"
                    onClick={onNavigateToDiagnostico}
                    className="mt-2 inline-flex items-center gap-1 text-[#B50E30] text-[10px] font-black uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Ir al diagnóstico
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {gaps.slice(0, 3).map((gap, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-none border border-utp-border space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-black uppercase tracking-tight text-xs">{gap.skillName}</span>
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-none uppercase shrink-0 ${
                        gap.priority === "alta" ? "bg-[#B50E30] text-white"
                          : gap.priority === "media" ? "bg-black text-white"
                          : "bg-neutral-200 text-black"
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className={`font-black uppercase tracking-wider ${
                        gap.category === "tecnica" ? "text-black"
                          : gap.category === "blanda" ? "text-neutral-500"
                          : "text-[#B50E30]"
                      }`}>
                        {gap.category === "tecnica" ? "Técnica" : gap.category === "blanda" ? "Blanda" : gap.category === "certificacion" ? "Certificación" : gap.category}
                      </span>
                    </div>
                    {gap.recommendedResource && (
                      <div className="text-[10px] text-neutral-400 font-semibold">
                        Recurso: {gap.recommendedResource}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* -------- Impacto en tu Ruta -------- */}
          {routeImpact && (
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-utp-border">
                <TrendingUp className="h-4 w-4 text-[#B50E30]" />
                <span className="text-[11px] font-black text-black uppercase tracking-wider">Impacto en tu Ruta</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-semibold text-[11px]">Misión</span>
                  <span className="font-extrabold text-black text-right max-w-[55%] text-xs">Optimizar CV para filtros ATS</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-semibold text-[11px]">Evidencia</span>
                  <span className="font-extrabold text-black flex items-center gap-1 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 text-[#B50E30]" />
                    {routeImpact.evidence}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-semibold text-[11px]">Antes</span>
                  <span className="font-extrabold text-black">{routeImpact.compatibilityBefore}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-semibold text-[11px]">Después</span>
                  <span className="font-extrabold text-black">{routeImpact.compatibilityAfter}%</span>
                </div>
                <div className="flex items-center justify-between border-t border-utp-border pt-1.5">
                  <span className="font-black text-black uppercase tracking-wider text-[11px]">Impacto</span>
                  <span className="bg-[#B50E30]/10 text-[#B50E30] font-black text-[11px] px-2 py-0.5 border border-[#B50E30]/20">+{routeImpact.impact}%</span>
                </div>
              </div>
              <p className="text-[10px] text-neutral-400 font-semibold -mb-1">Este avance desbloquea tu siguiente misión.</p>
              <div className="flex items-center gap-2 pt-2 border-t border-utp-border text-xs">
                <ArrowRight className="h-3.5 w-3.5 text-[#B50E30] shrink-0" />
                <span className="text-neutral-500 font-semibold text-[11px]">Siguiente:</span>
                <span className="font-extrabold text-black text-xs">{routeImpact.nextMission}</span>
              </div>
            </div>
          )}

          {/* -------- ¿Qué evalúa la IA? -------- */}
          <div className="bg-neutral-50 rounded-none border border-utp-border p-6 space-y-3">
            <h4 className="text-[11px] font-black text-black uppercase tracking-wider">¿Qué evalúa la IA?</h4>
            <ul className="space-y-2 text-black text-xs font-semibold">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong>Compatibilidad ATS</strong>: Legibilidad y organización del currículum.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="h-4 w-4 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong>Palabras Clave</strong>: Lenguajes y herramientas esenciales del mercado.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Shield className="h-4 w-4 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong>Escaneo ATS</strong>: Formato óptimo para filtros automatizados.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
