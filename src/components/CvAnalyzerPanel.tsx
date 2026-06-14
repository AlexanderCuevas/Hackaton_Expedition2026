import { useState, useEffect, useRef, useCallback } from "react";
import { CvAnalysis, SkillGap, CvMeta, UserProfile } from "../types";
import {
  FileText, Sparkles, AlertCircle, CheckCircle,
  BookOpen, AlertTriangle, TrendingUp, X,
  ArrowRight, Check, Shield, Route,
  Brain, Target, Map, ListOrdered, Zap
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
  generalFeedback: `## Informe detallado del análisis del CV

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
    evidence: "CV optimizado en formato profesional",
    nextMission: "Simular entrevista técnico-comportamental"
  };
};

const FLOW_STEPS = [
  { icon: FileText, label: "CV cargado", state: "done" as const },
  { icon: Sparkles, label: "IA analizó brechas", state: "done" as const },
  { icon: TrendingUp, label: "Mejora tu CV", state: "current" as const },
] as const;

function FlowStepper() {
  return (
    <div className="flex items-center gap-0 sm:gap-1">
      {FLOW_STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isDone = step.state === "done";
        const isCurrent = step.state === "current";
        return (
          <div key={step.label} className="flex flex-1 items-center min-w-0">
            <div className="flex flex-1 items-center gap-2 min-w-0 py-1">
              <div
                className={`h-7 w-7 shrink-0 flex items-center justify-center rounded-full border ${
                  isCurrent
                    ? "bg-[#B50E30] border-[#B50E30] text-white"
                    : isDone
                      ? "bg-[#B50E30]/10 border-[#B50E30]/25 text-[#B50E30]"
                      : "bg-neutral-50 border-neutral-200 text-neutral-400"
                }`}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </div>
              <p
                className={`text-xs font-semibold truncate ${
                  isCurrent ? "text-[#B50E30]" : isDone ? "text-neutral-700" : "text-neutral-400"
                }`}
              >
                {step.label}
              </p>
            </div>
            {idx < FLOW_STEPS.length - 1 && (
              <div
                className={`hidden sm:block h-px w-4 lg:w-8 shrink-0 mx-1 ${
                  isDone ? "bg-[#B50E30]/30" : "bg-neutral-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: SkillGap["priority"] }) {
  const styles: Record<SkillGap["priority"], string> = {
    alta: "bg-[#B50E30] text-white",
    media: "bg-amber-100 text-amber-900 border border-amber-200",
    baja: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  };
  const labels: Record<SkillGap["priority"], string> = {
    alta: "Alta",
    media: "Media",
    baja: "Baja",
  };
  return (
    <span className={`text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wide shrink-0 ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}

function CategoryBadge({ category }: { category: SkillGap["category"] }) {
  const label = category === "tecnica" ? "Técnica" : category === "blanda" ? "Blanda" : "Certificación";
  return (
    <span className="text-[10px] font-medium text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
      {label}
    </span>
  );
}

function GapMiniCard({ gap }: { gap: SkillGap }) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-neutral-50/60 p-3 space-y-1.5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold text-neutral-900 leading-snug">{gap.skillName}</p>
        <PriorityBadge priority={gap.priority} />
      </div>
      <CategoryBadge category={gap.category} />
      {gap.recommendedResource && (
        <p className="text-[11px] text-neutral-500 leading-relaxed pt-1">
          <span className="font-medium text-neutral-700">Recurso: </span>
          {gap.recommendedResource}
        </p>
      )}
    </div>
  );
}

function SkillChip({ skill }: { skill: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-neutral-800 text-white text-xs font-medium px-2.5 py-1 rounded-md">
      <CheckCircle className="h-3 w-3 text-[#B50E30]" />
      {skill}
    </span>
  );
}

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
    title: "Resumen",
    bubblePosition: "right" as const,
    text: "Aquí ves el estado de tu análisis y el botón para generar tu ruta de empleabilidad. También puedes descargar o copiar tu CV desde los accesos discretos del encabezado."
  },
  {
    id: "step-guide",
    title: "Tu progreso",
    bubblePosition: "right" as const,
    text: "Esta guía resume el flujo: ya cargaste tu CV, la IA detectó brechas y ahora toca mejorar tu perfil con las prioridades que verás abajo."
  },
  {
    id: "score",
    title: "Diagnóstico",
    bubblePosition: "right" as const,
    text: "El bloque principal reúne tu score actual, el potencial optimizado y el problema que más te frena. Es lo primero que debes revisar."
  },
  {
    id: "skills",
    title: "Skills y brechas",
    bubblePosition: "right" as const,
    text: "Aquí contrastamos tus fortalezas detectadas con las brechas por prioridad. Cada brecha incluye un recurso para cerrarla."
  },
  {
    id: "priorities",
    title: "Prioridades",
    bubblePosition: "right" as const,
    text: "Esta lista te indica qué hacer primero, por qué importa y el impacto estimado. Úsala como checklist de mejora."
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
  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const isNarrow = vw < 640;
  const groupW = isNarrow ? vw - pad * 2 : 520;

  let groupLeft: number;
  let groupTop: number;

  if (isNarrow) {
    groupLeft = pad;
    groupTop = Math.max(pad, vh - 300);
  }
  // Try right of highlight
  else if (highlightRect.right + gap + groupW <= vw) {
    groupLeft = highlightRect.right + gap;
    groupTop = Math.max(pad, Math.min(highlightRect.top, vh - 240));
  }
  // Try left of highlight (for sections on the right edge)
  else if (highlightRect.left - gap - groupW >= 0) {
    groupLeft = highlightRect.left - gap - groupW - 40;
    groupTop = Math.max(pad, Math.min(highlightRect.top, vh - 240));
  }
  // Try below
  else if (highlightRect.bottom + gap + 200 <= vh) {
    groupLeft = Math.max(pad, Math.min(highlightRect.left, vw - groupW - pad));
    groupTop = highlightRect.bottom + gap;
  }
  // Try above
  else if (highlightRect.top - gap - 200 >= 0) {
    groupLeft = Math.max(pad, Math.min(highlightRect.left, vw - groupW - pad));
    groupTop = highlightRect.top - gap - 200;
  }
  // Fallback: bottom-right
  else {
    groupLeft = vw - groupW - pad;
    groupTop = vh - 200 - pad;
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
        className={`absolute flex items-start gap-3 sm:gap-4 ${isNarrow ? "flex-col items-stretch w-[calc(100vw-20px)]" : ""}`}
        style={{ left: groupLeft, top: groupTop, pointerEvents: "auto", maxWidth: isNarrow ? vw - pad * 2 : undefined }}
      >
        {/* Avatar */}
        <div className={`relative shrink-0 ${isNarrow ? "flex justify-center" : ""}`}>
          <AvatarGuide className={`${isNarrow ? "h-20" : "h-72"} drop-shadow-lg`} />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 border-2 border-white rounded-full animate-pulse" />
        </div>

        {/* Speech bubble + controls */}
        <div className="bg-white border border-neutral-300 shadow-2xl p-4 sm:p-5 max-w-[380px] relative rounded-2xl w-full">
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
  routeGenerated?: boolean;
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
  routeGenerated = false,
  profile
}: CvAnalyzerPanelProps) {
  const analysis = savedAnalysis ?? SIMULATED_ANALYSIS;
  const optimizedScore = savedAnalysis
    ? Math.min(95, Math.max(analysis.score + 15, analysis.score + Math.round((100 - analysis.score) * 0.35)))
    : SIMULATED_OPTIMIZED_SCORE;
  const routeImpact = getRouteImpactData(analysis.score, optimizedScore);

  const gaps = incomingGaps && incomingGaps.length > 0 ? incomingGaps : SIMULATED_GAPS;
  const skills = incomingSkills ?? SIMULATED_SKILLS;
  const displayInfo = cvInfo ?? {
    ...SIMULATED_CV,
    targetRole: targetRole || SIMULATED_CV.targetRole,
  };

  const [activeTab, setActiveTab] = useState<"mejoras" | "keywords" | "informe">("mejoras");
  const [cvCopied, setCvCopied] = useState(false);

  /* Guide overlay state */
  const [showRouteOverlay, setShowRouteOverlay] = useState(false);
  const [guideActive, setGuideActive] = useState(() => !localStorage.getItem("sp_guide_seen"));
  const [guideStep, setGuideStep] = useState(0);

  const headerRef = useRef<HTMLDivElement>(null);
  const stepGuideRef = useRef<HTMLDivElement>(null);
  const scoreCardRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const prioritiesRef = useRef<HTMLDivElement>(null);

  const stepRefs = [headerRef, stepGuideRef, scoreCardRef, skillsRef, prioritiesRef];
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

  const dismissGuide = () => {
    setGuideActive(false);
    localStorage.setItem("sp_guide_seen", "true");
  };

  const handleGuideNext = () => {
    if (guideStep < stepRefs.length - 1) {
      setGuideStep(prev => prev + 1);
    } else {
      dismissGuide();
    }
  };

  const handleGuidePrev = () => {
    if (guideStep > 0) setGuideStep(prev => prev - 1);
  };

  const handleGuideClose = dismissGuide;
  const handleCreateRoute = () => {
    dismissGuide();
    setShowRouteOverlay(true);
  };
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

  const statusLabel =
    analysis.score >= 80 ? "CV sobresaliente" : analysis.score >= 60 ? "Requiere ajustes" : "CV en riesgo";
  const mainProblem = analysis.weaknesses[0] ?? "Faltan keywords técnicas y logros medibles.";
  const nextStepHint =
    analysis.weaknesses[1] ?? "Aplicar formato profesional y agregar logros con números.";
  const gapsAlta = gaps.filter((g) => g.priority === "alta");
  const gapsMedia = gaps.filter((g) => g.priority === "media");
  const gapsBaja = gaps.filter((g) => g.priority === "baja");

  return (
    <div className="space-y-5 min-w-0 overflow-x-hidden">
      {/* A. Encabezado compacto */}
      <div ref={headerRef} className="bg-white rounded-xl border border-neutral-200/80 shadow-sm px-5 py-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#B50E30]" />
                CV Analyzer IA
              </h2>
              {routeGenerated && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  Ruta generada
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Tu CV fue analizado. Revisa tus brechas y prioridades de mejora.
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500">
              <span className="truncate max-w-[200px] sm:max-w-none">{displayInfo.fileName}</span>
              <span className="text-neutral-300 hidden sm:inline">·</span>
              <span>Score {analysis.score}%</span>
              <span className="text-neutral-300 hidden sm:inline">·</span>
              <span className="no-print flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintCv}
                  className="text-neutral-600 hover:text-[#B50E30] font-medium transition cursor-pointer"
                  title="Imprimir o guardar como PDF"
                >
                  PDF
                </button>
                <span className="text-neutral-300">·</span>
                <button
                  type="button"
                  onClick={handleCopyCvText}
                  className="text-neutral-600 hover:text-[#B50E30] font-medium transition cursor-pointer"
                >
                  {cvCopied ? "Copiado" : "Texto"}
                </button>
              </span>
            </div>
          </div>
          {!routeGenerated && (
            <button
              type="button"
              onClick={handleCreateRoute}
              className="bg-[#B50E30] hover:bg-[#85061B] text-white font-semibold rounded-lg text-sm px-5 py-2.5 flex items-center justify-center gap-2 transition cursor-pointer shrink-0 shadow-sm"
            >
              <Route className="h-4 w-4" />
              Generar mi ruta
            </button>
          )}
        </div>
      </div>

      {/* B. Stepper compacto */}
      <div ref={stepGuideRef} className="px-1 sm:px-2">
        <FlowStepper />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
        {/* C. Resumen del análisis */}
        <div
          ref={scoreCardRef}
          className="lg:col-span-3 order-1 bg-white rounded-xl border border-neutral-200/80 shadow-sm p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="h-4 w-4 text-[#B50E30]" />
            <h3 className="text-base font-semibold text-neutral-900">Resumen del análisis</h3>
          </div>

          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 shrink-0">
              <div className="text-center">
                <ScoreCircleAnimated score={analysis.score} label="actual" color="stroke-[#B50E30]" />
                <p className="text-xs text-neutral-500 mt-2">Score actual</p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <TrendingUp className="h-4 w-4 text-[#B50E30]" />
                <span className="text-sm font-bold text-[#B50E30]">
                  +<DeltaBadge value={optimizedScore - analysis.score} />%
                </span>
                <span className="text-[10px] text-neutral-400">Impacto</span>
              </div>
              <div className="text-center">
                <ScoreCircleAnimated score={optimizedScore} label="óptimo" color="stroke-neutral-700" />
                <p className="text-xs text-neutral-500 mt-2">Score optimizado</p>
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-4 md:border-l md:border-neutral-100 md:pl-6">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
                <div>
                  <span className="text-neutral-500">Estado: </span>
                  <span className="font-semibold text-neutral-900">{statusLabel}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Potencial: </span>
                  <span className="font-semibold text-[#B50E30]">{optimizedScore}%</span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-[#B50E30] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800">Problema principal</p>
                    <p className="text-neutral-600 mt-0.5 leading-relaxed">{mainProblem}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-[#B50E30] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-neutral-800">Siguiente paso</p>
                    <p className="text-neutral-600 mt-0.5 leading-relaxed">{nextStepHint}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* D. Skills y brechas + impacto + evaluación IA */}
        <div className="lg:col-span-2 order-2 lg:row-span-2 flex flex-col gap-4">
          <div ref={skillsRef} className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-5">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="text-base font-semibold text-neutral-900 flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#B50E30]" />
                Skills y brechas
              </h3>
              {gapsAlta.filter((g) => g.status !== "completado").length > 0 && (
                <span className="bg-[#B50E30] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0">
                  {gapsAlta.filter((g) => g.status !== "completado").length} críticas
                </span>
              )}
            </div>

            {skills.length > 0 && (
              <div className="mb-4 pb-4 border-b border-neutral-100">
                <p className="text-xs font-medium text-neutral-700 mb-2">Fortalezas detectadas en tu CV</p>
                <p className="text-[11px] text-neutral-500 mb-2.5">La IA identificó estas habilidades en tu perfil.</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <SkillChip key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            )}

            {gaps.length === 0 ? (
              <div className="text-center py-6 px-3 rounded-lg bg-neutral-50">
                <AlertCircle className="h-5 w-5 text-[#B50E30] mx-auto mb-2" />
                <p className="text-sm font-medium text-neutral-800">Sin diagnóstico registrado</p>
                {onNavigateToDiagnostico && (
                  <button
                    type="button"
                    onClick={onNavigateToDiagnostico}
                    className="mt-2 inline-flex items-center gap-1 text-[#B50E30] text-xs font-medium hover:underline cursor-pointer"
                  >
                    Ir al diagnóstico
                    <ArrowRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {gapsAlta.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-[#B50E30] mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Brechas críticas
                    </p>
                    <div className="space-y-2">
                      {gapsAlta.map((gap, idx) => (
                        <GapMiniCard key={`alta-${gap.skillName}-${idx}`} gap={gap} />
                      ))}
                    </div>
                  </div>
                )}
                {gapsMedia.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-amber-800 mb-2">Brechas medias</p>
                    <div className="space-y-2">
                      {gapsMedia.map((gap, idx) => (
                        <GapMiniCard key={`media-${gap.skillName}-${idx}`} gap={gap} />
                      ))}
                    </div>
                  </div>
                )}
                {gapsBaja.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-emerald-800 mb-2">Brechas bajas</p>
                    <div className="space-y-2">
                      {gapsBaja.map((gap, idx) => (
                        <GapMiniCard key={`baja-${gap.skillName}-${idx}`} gap={gap} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {routeImpact && (
            <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-4">
              <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-[#B50E30]" />
                Impacto en tu ruta
              </h4>
              <div className="flex items-center gap-3 text-sm mb-3">
                <span className="font-bold text-neutral-500">{routeImpact.compatibilityBefore}%</span>
                <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#B50E30] rounded-full"
                    style={{ width: `${Math.min(routeImpact.compatibilityAfter, 100)}%` }}
                  />
                </div>
                <span className="font-bold text-[#B50E30]">{routeImpact.compatibilityAfter}%</span>
              </div>
              <p className="text-xs text-neutral-600">
                Mejora esperada: <span className="font-semibold text-[#B50E30]">+{routeImpact.impact}%</span>
              </p>
              <p className="text-xs text-neutral-500 mt-2 flex items-start gap-1.5">
                <ArrowRight className="h-3.5 w-3.5 text-[#B50E30] shrink-0 mt-0.5" />
                <span>Próximo: {routeImpact.nextMission}</span>
              </p>
            </div>
          )}

          <div className="rounded-xl border border-neutral-100 bg-neutral-50/80 p-4">
            <h4 className="text-sm font-semibold text-neutral-800 mb-2">¿Qué evalúa la IA?</h4>
            <ul className="space-y-2 text-xs text-neutral-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong className="font-medium text-neutral-800">Estructura</strong> — legibilidad y organización.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong className="font-medium text-neutral-800">Palabras clave</strong> — herramientas del mercado.</span>
              </li>
              <li className="flex items-start gap-2">
                <Shield className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong className="font-medium text-neutral-800">Formato</strong> — claridad del perfil profesional.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* E. Prioridades + tabs */}
        <div className="lg:col-span-3 order-3 flex flex-col gap-5">
          {gaps.length > 0 && (
            <div ref={prioritiesRef} className="bg-white rounded-xl border border-neutral-200/80 shadow-sm p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-1">
                <ListOrdered className="h-4 w-4 text-[#B50E30]" />
                <h3 className="text-base font-semibold text-neutral-900">Prioridades de mejora</h3>
              </div>
              <p className="text-xs text-neutral-500 mb-4">Acciones recomendadas según las brechas detectadas.</p>
              <ol className="space-y-3">
                {gaps.slice(0, 4).map((gap, idx) => (
                  <li
                    key={`${gap.skillName}-${idx}`}
                    className="flex gap-3 rounded-lg border border-neutral-100 bg-neutral-50/50 p-3.5"
                  >
                    <span className="h-6 w-6 shrink-0 rounded-full bg-[#B50E30] text-white text-xs font-semibold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-semibold text-neutral-900">{gap.skillName}</p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        <span className="font-medium text-neutral-700">Qué hacer: </span>
                        {gap.description || `Refuerza ${gap.skillName} en tu CV y perfil profesional.`}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Impacto estimado:{" "}
                        <span
                          className={`font-semibold ${
                            gap.priority === "alta"
                              ? "text-[#B50E30]"
                              : gap.priority === "media"
                                ? "text-amber-700"
                                : "text-emerald-700"
                          }`}
                        >
                          {gap.priority === "alta" ? "Alto" : gap.priority === "media" ? "Medio" : "Bajo"}
                        </span>
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="bg-white rounded-xl border border-neutral-200/80 shadow-sm overflow-hidden">
            <div className="flex border-b border-neutral-100 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`shrink-0 sm:flex-1 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium transition cursor-pointer whitespace-nowrap ${
                    activeTab === tab.key
                      ? "text-[#B50E30] border-b-2 border-[#B50E30] bg-white"
                      : "text-neutral-500 hover:text-neutral-800 bg-neutral-50/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 sm:p-6">
              {activeTab === "mejoras" && (
                <div className="space-y-3">
                  <p className="text-xs text-neutral-500 pb-2 border-b border-neutral-100">
                    Acciones para elevar tu score.
                  </p>
                  {[
                    { title: "Adaptar a formato profesional", que: "Ordena tu CV en secciones claras.", por: "Ayuda al reclutador a leer tu perfil.", impacto: "+8%" },
                    { title: "Agregar logros medibles", que: "Incluye resultados con números, porcentajes o tiempos.", por: "Los reclutadores buscan impacto medible.", impacto: "+10%" },
                    { title: "Alinear habilidades con la vacante", que: "Agrega keywords técnicas y metodologías del puesto.", por: "Sin ellas tu CV no pasa el filtro automático.", impacto: "+12%" },
                  ].map((rec, idx) => (
                    <div key={idx} className="rounded-lg border border-neutral-100 p-3.5 space-y-2">
                      <p className="text-sm font-semibold text-neutral-900">{rec.title}</p>
                      <p className="text-xs text-neutral-600"><span className="font-medium">Qué hacer: </span>{rec.que}</p>
                      <p className="text-xs text-neutral-600"><span className="font-medium">Por qué importa: </span>{rec.por}</p>
                      <p className="text-xs font-semibold text-[#B50E30]">Impacto: {rec.impacto}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "keywords" && (
                <div className="space-y-4">
                  <p className="text-xs text-neutral-500 pb-2 border-b border-neutral-100">
                    Palabras clave que fortalecen tu perfil.
                  </p>
                  <div>
                    <p className="text-xs font-medium text-neutral-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="h-3.5 w-3.5 text-[#B50E30]" />
                      Encontradas ({Math.min(5, analysis.keywordsFound.length)})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.keywordsFound.slice(0, 5).map((kw, idx) => (
                        <span key={idx} className="bg-neutral-800 text-white text-xs font-medium px-2.5 py-1 rounded-md">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-[#B50E30] mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Faltantes ({Math.min(5, analysis.keywordsMissing.length)})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.keywordsMissing.slice(0, 5).map((kw, idx) => (
                        <span key={idx} className="bg-[#B50E30]/8 text-[#B50E30] border border-[#B50E30]/20 text-xs font-medium px-2.5 py-1 rounded-md">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Tienes {analysis.keywordsFound.length} de {analysis.keywordsFound.length + analysis.keywordsMissing.length} términos clave identificados.
                  </p>
                </div>
              )}

              {activeTab === "informe" && (
                <div className="space-y-4 text-sm text-neutral-700 leading-relaxed">
                  <p className="text-xs text-neutral-500 pb-2 border-b border-neutral-100">
                    Detalle completo del análisis.
                  </p>
                  <h4 className="text-sm font-semibold text-neutral-900 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-[#B50E30]" />
                    Informe detallado
                  </h4>
                  <div>
                    <p className="text-xs font-medium text-neutral-800 mb-1">1. Estructura del CV</p>
                    <p className="text-xs text-neutral-600">El CV tiene una base útil, pero necesita mayor jerarquía visual y organización por secciones.</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-800 mb-1">2. Contenido</p>
                    <ul className="space-y-1 list-disc list-inside text-xs text-neutral-600">
                      <li><strong>Perfil profesional:</strong> falta un resumen inicial orientado al puesto.</li>
                      <li><strong>Educación:</strong> correcta, pero puede reforzarse con logros académicos.</li>
                      <li><strong>Experiencia:</strong> mencionada de forma genérica, sin métricas.</li>
                      <li><strong>Habilidades:</strong> listadas, pero sin contexto de aplicación.</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-800 mb-1">3. Recomendaciones clave</p>
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
