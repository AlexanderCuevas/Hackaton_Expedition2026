import { useState, useEffect, useRef, useCallback } from "react";
import { CvAnalysis, SkillGap, CvMeta, UserProfile } from "../types";
import {
  FileText, Sparkles, AlertCircle, CheckCircle,
  BookOpen, AlertTriangle, TrendingUp, X,
  ArrowRight, Check, Shield, ThumbsDown, Copy, Route,
  Brain, Target, Map, Printer
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { buildHtmlCv, buildPlainTextCv, copyPlainTextToClipboard, triggerPrintCv } from "../utils/cvGenerator";

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
   Guide Overlay — Avatar + walkthrough
   ============================================================ */

import avatarImg from "./assets/Avatar.png";

function AvatarGuide({ className }: { className?: string }) {
  return (
    <img
      src={avatarImg}
      alt="Avatar guía"
      className={`${className} object-contain`}
    />
  );
}

const GUIDE_STEPS_DATA = [
  {
    id: "header",
    title: "Cabecera del Panel",
    bubblePosition: "right" as const,
    text: "¡Hola! Bienvenido a tu panel de análisis. Aquí arriba, en la Cabecera, confirmamos que tu CV ha sido escaneado por nuestra IA. Este es el punto de partida: te dice de inmediato que la revisión ATS está lista para mostrarte cómo llegar a la entrevista. A la derecha, el botón 'Generar mi ruta' arma tu plan de empleabilidad personalizado conectando este análisis con tus brechas y las misiones que debes cumplir."
  },
  {
    id: "cv-card",
    title: "Identificación del CV",
    bubblePosition: "right" as const,
    text: "Justo debajo de la cabecera, esta sección es la Identificación del CV. Aquí confirmamos los detalles del archivo que subiste, como su nombre y formato. Lo más importante: te mostramos tu 'Score' actual aquí mismo. Y si necesitas una copia rápida, usa los botones de la derecha para imprimir o copiar el texto extraído."
  },
  {
    id: "step-guide",
    title: "Guía de 3 Pasos",
    bubblePosition: "right" as const,
    text: "Esta barra visual es tu Mapa de Ruta. Te recuerda el proceso simplificado: primero cargaste tu CV (Paso 1), luego la IA analizó las brechas (Paso 2, resaltado en rojo), y ahora estamos en el Paso 3: ¡Mejorar tu CV para maximizar tu impacto!"
  },
  {
    id: "score",
    title: "Círculo de Puntuación",
    bubblePosition: "right" as const,
    text: "¡Llegamos al corazón del análisis! Aquí está tu Score IA. El círculo rojo a la izquierda es tu puntuación Actual según los criterios ATS. El círculo negro a la derecha es tu puntuación Óptima si aplicas las mejoras recomendadas. ¡Nuestro objetivo es ayudarte a cerrar esa brecha!"
  },
  {
    id: "status",
    title: "Resumen de Estado",
    bubblePosition: "left" as const,
    text: "A la derecha de los puntajes, te damos el Diagnóstico Rápido. Interpretamos tu Score (por ejemplo, 'Requiere ajustes') y, crucialmente, identificamos el Problema principal que detectó la IA. Esto te dice exactamente qué te está frenando, como la falta de keywords técnicas o logros medibles."
  },
  {
    id: "skills",
    title: "Skills & Brechas",
    bubblePosition: "right" as const,
    text: "En la columna derecha tienes el panel de Skills & Brechas. Aquí la IA contrasta tus habilidades actuales contra las brechas detectadas. Las brechas de prioridad 'alta' se marcan en rojo. Cada una incluye un recurso recomendado para que puedas cerrarla desde hoy mismo."
  },
];

function GuideOverlay({
  step,
  highlightRect,
  stepData,
  onNext,
  onPrev,
  onClose,
  total,
}: {
  step: number;
  highlightRect: DOMRect;
  stepData: (typeof GUIDE_STEPS_DATA)[number];
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  total: number;
}) {
  const pad = 10;
  const gap = 28;
  const groupW = 520; // avatar (~100px) + gap + bubble (~380px max)

  let groupLeft: number;
  let groupTop: number;

  // Try right of highlight
  if (highlightRect.right + gap + groupW <= window.innerWidth) {
    groupLeft = highlightRect.right + gap;
    groupTop = Math.max(pad, Math.min(highlightRect.top, window.innerHeight - 240));
  }
  // Try left of highlight (for sections on the right edge)
  else if (highlightRect.left - gap - groupW >= 0) {
    groupLeft = highlightRect.left - gap - groupW - 40;
    groupTop = Math.max(pad, Math.min(highlightRect.top, window.innerHeight - 240));
  }
  // Try below
  else if (highlightRect.bottom + gap + 200 <= window.innerHeight) {
    groupLeft = Math.max(pad, Math.min(highlightRect.left, window.innerWidth - groupW - pad));
    groupTop = highlightRect.bottom + gap;
  }
  // Try above
  else if (highlightRect.top - gap - 200 >= 0) {
    groupLeft = Math.max(pad, Math.min(highlightRect.left, window.innerWidth - groupW - pad));
    groupTop = highlightRect.top - gap - 200;
  }
  // Fallback: bottom-right
  else {
    groupLeft = window.innerWidth - groupW - pad;
    groupTop = window.innerHeight - 200 - pad;
  }

  return (
    <div className="fixed inset-0 z-[60]" style={{ pointerEvents: "none" }}>
      {/* Highlight box with box-shadow overlay */}
      <div
        className="absolute transition-all duration-300 ease-out"
        style={{
          left: highlightRect.left - pad,
          top: highlightRect.top - pad,
          width: highlightRect.width + pad * 2,
          height: highlightRect.height + pad * 2,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
          background: "rgba(255,255,255,0.06)",
          border: "2px solid rgba(255,255,255,0.85)",
          pointerEvents: "none",
        }}
      />

      {/* Avatar + speech bubble side by side */}
      <div
        className="absolute flex items-start gap-4"
        style={{ left: groupLeft, top: groupTop, pointerEvents: "auto" }}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <AvatarGuide className="h-72 drop-shadow-lg" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
        </div>

        {/* Speech bubble + controls */}
        <div className="bg-white border border-neutral-300 shadow-2xl p-5 max-w-[380px] relative rounded-2xl">
          {/* Arrow pointing left to avatar */}
          <div className="absolute -left-[7px] top-7 h-3.5 w-3.5 bg-white border-l border-b border-neutral-300 rotate-45 rounded-bl-sm" />
          {/* Label */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#B50E30]">
              {stepData.title}
            </span>
            <span className="text-[9px] font-black text-neutral-300">
              {step + 1}/{total}
            </span>
          </div>
          {/* Text */}
          <p className="text-xs text-neutral-700 leading-relaxed font-semibold">
            {stepData.text}
          </p>
          {/* Controls */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1.5">
              {Array.from({ length: total }).map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 transition-all duration-200 ${
                    i === step ? "bg-[#B50E30] w-4" : "bg-neutral-200 w-1.5"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onPrev}
                disabled={step === 0}
                className="px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-neutral-500 hover:text-black border border-neutral-200 hover:border-neutral-400 transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Anterior
              </button>
              <button
                type="button"
                onClick={onNext}
                className="px-4 py-1.5 text-[9px] font-black uppercase tracking-wider text-white transition hover:opacity-80 cursor-pointer"
                style={{ background: "#B50E30" }}
              >
                {step < total - 1 ? "Siguiente →" : "Comenzar →"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-7 w-7 flex items-center justify-center text-neutral-400 hover:text-neutral-900 border border-neutral-200 hover:border-neutral-400 transition cursor-pointer"
                title="Cerrar guía"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Route Generator Overlay — animated generation sequence
   ============================================================ */

const GENERATION_STEPS = [
  { icon: Brain,     text: "Analizando tus brechas detectadas por la IA…",     dur: 900 },
  { icon: Target,    text: "Priorizando skills críticos para la vacante…",      dur: 800 },
  { icon: Sparkles,  text: "Asignando recursos y rutas de aprendizaje…",        dur: 900 },
  { icon: Map,       text: "Generando tu ruta personalizada paso a paso…",      dur: 700 },
  { icon: CheckCircle, text: "¡Tu ruta está lista!",                            dur: 600 },
];

function RouteGeneratorOverlay({ targetRole, onComplete }: { targetRole: string; onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let elapsed = 0;
    const total = GENERATION_STEPS.reduce((s, x) => s + x.dur, 0);
    let idx = 0;

    function runStep() {
      if (idx >= GENERATION_STEPS.length) {
        setDone(true);
        setTimeout(onComplete, 700);
        return;
      }
      setStepIdx(idx);
      const dur = GENERATION_STEPS[idx].dur;
      const start = performance.now();

      function tick(now: number) {
        const dt = now - start;
        const stepProgress = Math.min(dt / dur, 1);
        setProgress(Math.round(((elapsed + stepProgress * dur) / total) * 100));
        if (stepProgress < 1) {
          requestAnimationFrame(tick);
        } else {
          elapsed += dur;
          idx++;
          runStep();
        }
      }
      requestAnimationFrame(tick);
    }

    runStep();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center px-6">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg,#B50E30 0,#B50E30 1px,transparent 0,transparent 50%)",
          backgroundSize: "10px 10px"
        }}
      />
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-[#B50E30] flex items-center justify-center">
            <Sparkles className="h-9 w-9 text-[#B50E30]" style={{ animation: done ? "none" : "spin 2s linear infinite" }} />
          </div>
          {!done && (
            <div className="absolute inset-0 border border-[#B50E30]/30" style={{ animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite" }} />
          )}
          <style>{`
            @keyframes ping { 75%, 100% { transform: scale(1.6); opacity: 0; } }
            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
          `}</style>
        </div>
        <div className="text-center space-y-1">
          <p className="text-[10px] font-black text-[#B50E30] uppercase tracking-widest">IA generando</p>
          <h2 className="text-2xl font-black text-neutral-900 uppercase tracking-wide leading-tight">Tu Ruta Personalizada</h2>
          <p className="text-xs text-neutral-500 font-semibold">Para: <span className="text-neutral-900 font-black">{targetRole}</span></p>
        </div>
        <div className="w-full space-y-2">
          <div className="w-full h-1 bg-neutral-200 overflow-hidden">
            <div className="h-1 bg-[#B50E30] transition-none" style={{ width: `${progress}%`, transition: "width 0.1s linear" }} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">{done ? "Completado" : "Procesando…"}</span>
            <span className="text-[9px] font-black text-[#B50E30]">{progress}%</span>
          </div>
        </div>
        <div className="w-full space-y-2">
          {GENERATION_STEPS.map((step, i) => {
            const Icon = step.icon;
            const visible = i <= stepIdx;
            const active = i === stepIdx && !done;
            const checked = i < stepIdx || done;
            return (
              <div key={i} className="flex items-center gap-3 transition-all duration-300" style={{ opacity: visible ? 1 : 0.15 }}>
                <div className={`w-6 h-6 flex items-center justify-center shrink-0 transition-colors duration-300 ${checked ? "bg-[#B50E30]" : active ? "bg-neutral-100 border border-[#B50E30]" : "bg-neutral-100"}`}>
                  {checked
                    ? <CheckCircle className="h-3.5 w-3.5 text-white" />
                    : <Icon className={`h-3.5 w-3.5 ${active ? "text-[#B50E30]" : "text-neutral-400"}`} />
                  }
                </div>
                <span className={`text-xs font-semibold transition-colors duration-300 ${checked ? "text-neutral-400 line-through" : active ? "text-neutral-900 font-black" : "text-neutral-500"}`}>
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
  onNavigateToRuta?: () => void;
  profile?: UserProfile;
}

export default function CvAnalyzerPanel({
  targetRole,
  onAnalysisResult: _onAnalysisResult,
  savedAnalysis,
  cvInfo,
  cvText: incomingCvText,
  gaps: incomingGaps,
  currentSkills: incomingSkills,
  onNavigateToDiagnostico,
  onNavigateToRuta,
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

  const [activeTab, setActiveTab] = useState<"mejoras" | "keywords" | "informe">("mejoras");
  const [cvCopied, setCvCopied] = useState(false);

  /* Guide overlay state */
  const [showRouteOverlay, setShowRouteOverlay] = useState(false);
  const [guideActive, setGuideActive] = useState(true);
  const [guideStep, setGuideStep] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const cvCardRef = useRef<HTMLDivElement>(null);
  const stepGuideRef = useRef<HTMLDivElement>(null);
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const stepRefs = [headerRef, cvCardRef, stepGuideRef, scoreCardRef, statusRef, skillsRef];
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);

  const updateHighlight = useCallback(() => {
    if (!guideActive) return;
    const el = stepRefs[guideStep]?.current;
    if (el) setHighlightRect(el.getBoundingClientRect());
  }, [guideActive, guideStep]);

  useEffect(() => {
    updateHighlight();
    const onScroll = () => updateHighlight();
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [updateHighlight]);

  useEffect(() => {
    window.addEventListener("resize", updateHighlight);
    return () => window.removeEventListener("resize", updateHighlight);
  }, [updateHighlight]);

  useEffect(() => {
    if (!guideActive) return;
    const el = stepRefs[guideStep]?.current;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [guideStep, guideActive]);

  const handleGuideNext = () => {
    if (guideStep < 5) {
      setGuideStep(prev => prev + 1);
    } else {
      setGuideActive(false);
    }
  };

  const handleGuidePrev = () => {
    if (guideStep > 0) setGuideStep(prev => prev - 1);
  };

  const handleGuideClose = () => setGuideActive(false);
  const handleCreateRoute = () => setShowRouteOverlay(true);
  const handleRouteComplete = () => {
    setShowRouteOverlay(false);
    onNavigateToRuta?.();
  };

  const getStructured = () => {
    const stored = localStorage.getItem("sp_cv_structured");
    if (!stored) return null;
    try { return JSON.parse(stored); } catch { return null; }
  };

  const getCvData = () => {
    const structured = getStructured();
    return {
      name: profile?.name || "Estudiante UTP",
      career: profile?.career || "",
      email: profile?.email,
      phone: profile?.phone,
      linkedin: profile?.linkedin,
      hardSkills: incomingSkills || skills,
      softSkills: profile?.softSkills ?? structured?.softSkills,
      experienceLevel: profile?.experienceLevel,
      targetRole: targetRole,
      cvResumen: structured?.cvResumen,
      formacionUniversidad: structured?.formacion?.universidad,
      formacionCarrera: structured?.formacion?.carrera,
      formacionCiclo: structured?.formacion?.ciclo,
      formacionFechaInicio: structured?.formacion?.fechaInicio,
      formacionFechaFin: structured?.formacion?.fechaFin,
      formacionLogros: structured?.formacion?.logros,
      experiencia: structured?.experiencia,
      proyectos: structured?.proyectos,
    };
  };

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
    { key: "mejoras", label: "Mejoras" },
    { key: "keywords", label: "Keywords" },
    { key: "informe", label: "Informe" }
  ] as const;

  return (
    <div className="space-y-6">
      {/* ==================== HEADER ==================== */}
      <div ref={headerRef} className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className="heading-lg text-black flex items-center gap-2">
              <FileText className="h-5.5 w-5.5 text-[#B50E30]" />
              CV Analyzer IA &mdash; Escaneo ATS
            </h2>
            <button
              type="button"
              onClick={handleCreateRoute}
              className="bg-[#B50E30] hover:bg-[#85061B] active:bg-[#B50E30] text-white font-black uppercase tracking-wider rounded-none text-[11px] px-5 py-2.5 flex items-center gap-2 transition cursor-pointer shrink-0"
            >
              <Route className="h-4 w-4" />
              Generar mi ruta
            </button>
          </div>
          <p className="text-neutral-500 text-sm font-semibold leading-relaxed">
            Tu CV ya fue analizado. La IA detectó todo lo que necesitas mejorar para llegar a la entrevista.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* -------- 1. CV current card -------- */}
          <div ref={cvCardRef} className="bg-white rounded-none border border-utp-border p-4">
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
          <div ref={stepGuideRef} className="bg-white rounded-none border border-utp-border p-5">
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
          <div ref={scoreCardRef} className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-4 border-b border-utp-border">
                <Sparkles className="h-4 w-4 text-[#B50E30] fill-[#B50E30]" />
                Análisis IA del CV
              </h3>

              <div className="flex flex-col sm:flex-row items-stretch gap-6 pt-5">
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
                <div ref={statusRef} className="flex-1 space-y-3">
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

          <div className="bg-white rounded-none border border-utp-border">
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

            <div className="p-6">
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

                </div>
              )}

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

        <div className="space-y-4">
          {/* -------- Skills & Brechas -------- */}
          <div ref={skillsRef} className="bg-white rounded-none border border-utp-border p-6">
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

      {/* Guide overlay */}
      {guideActive && highlightRect && (
        <GuideOverlay
          step={guideStep}
          highlightRect={highlightRect}
          stepData={GUIDE_STEPS_DATA[guideStep]}
          onNext={handleGuideNext}
          onPrev={handleGuidePrev}
          onClose={handleGuideClose}
          total={GUIDE_STEPS_DATA.length}
        />
      )}

      {/* Route generator overlay */}
      {showRouteOverlay && (
        <RouteGeneratorOverlay
          targetRole={targetRole}
          onComplete={handleRouteComplete}
        />
      )}
    </div>
  );
}
