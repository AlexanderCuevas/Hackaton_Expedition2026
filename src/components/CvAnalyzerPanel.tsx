import { useState } from "react";
import { CvAnalysis, SkillGap } from "../types";
import {
  FileText, Sparkles, AlertCircle, CheckCircle,
  BookOpen, AlertTriangle, TrendingUp, ChevronRight, X,
  ArrowRight, Check, Shield, ThumbsUp, ThumbsDown, Copy, Save,
  RefreshCw
} from "lucide-react";
import ReactMarkdown from "react-markdown";

/* ============================================================
   Simulated data for MVP — no file upload, no API calls
   ============================================================ */

const SIMULATED_CV_INFO = {
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
    "Sólida formación académica en ingeniería de sistemas e informática.",
    "Experiencia en soporte técnico y herramientas de diseño.",
    "Buena disposición al aprendizaje autónomo y trabajo en equipo."
  ],
  weaknesses: [
    "No se mencionan tecnologías específicas de backend (SQL, APIs, Git).",
    "Faltan logros medibles y resultados cuantificables.",
    "Redacción genérica sin orientación al puesto objetivo."
  ],
  keywordsFound: ["SQL", "React", "soporte técnico", "organización", "desarrollo web"],
  keywordsMissing: ["Git/GitHub", "APIs REST", "Scrum", "CI/CD", "testing"],
  generalFeedback: `## Informe detallado del análisis ATS

### Estructura del CV
El CV presentado tiene una estructura básica que puede mejorarse significativamente. La información está presente pero desorganizada y sin jerarquía visual clara.

### Contenido
- **Perfil profesional**: No hay un resumen inicial que oriente al reclutador.
- **Educación**: Correcta pero sin detalles de logros académicos.
- **Experiencia**: Mencionada de forma genérica, sin métricas ni resultados.
- **Habilidades**: Listadas pero sin contexto de aplicación.

### Recomendaciones clave
1. Agregar un perfil profesional de 3-4 líneas orientado al puesto.
2. Incluir proyectos prácticos con tecnologías backend.
3. Cuantificar logros con números y porcentajes.
4. Agregar sección de certificaciones y cursos.
5. Incluir enlaces a LinkedIn y GitHub.`,
  atsFormattedCvAdvice: "Estudiante de Ingeniería de Sistemas e Informática de ciclo avanzado, orientado al desarrollo backend y análisis de datos. Cuenta con conocimientos en SQL, desarrollo web y construcción de soluciones digitales. Interesado en fortalecer experiencia en APIs REST, control de versiones y metodologías ágiles, aportando capacidad de análisis, aprendizaje autónomo y resolución de problemas."
};

const SIMULATED_OPTIMIZED_SCORE = 85;

const SIMULATED_RECOMMENDATIONS = [
  {
    title: "Adaptar al formato Harvard",
    description: "Ordena el CV en secciones claras: perfil, educación, experiencia, habilidades y logros.",
    impact: "+8%"
  },
  {
    title: "Agregar logros medibles",
    description: "Incluye resultados con números, porcentajes, tiempos o impacto.",
    impact: "+10%"
  },
  {
    title: "Alinear habilidades con la vacante",
    description: "Agrega palabras clave como SQL, APIs REST, Git/GitHub y metodologías ágiles si aplican al puesto.",
    impact: "+12%"
  }
];

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
  gaps?: SkillGap[];
  currentSkills?: string[];
  onNavigateToDiagnostico?: () => void;
}

/* ============================================================
   Component
   ============================================================ */

export default function CvAnalyzerPanel({
  targetRole,
  onAnalysisResult,
  savedAnalysis,
  gaps: incomingGaps,
  currentSkills: incomingSkills,
  onNavigateToDiagnostico
}: CvAnalyzerPanelProps) {
  /* --- simulated state --- */
  const analysis = savedAnalysis ?? SIMULATED_ANALYSIS;
  const optimizedScore = SIMULATED_OPTIMIZED_SCORE;
  const routeImpact = getRouteImpactData(analysis.score, optimizedScore);

  /* --- UI state --- */
  const [showDetails, setShowDetails] = useState(false);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [showStrengths, setShowStrengths] = useState(false);
  const [copiedExtract, setCopiedExtract] = useState(false);
  const [copiedExtractShort, setCopiedExtractShort] = useState(false);
  const [evidenceSaved, setEvidenceSaved] = useState(false);

  /* ================ RENDER ================ */

  return (
    <div className="space-y-6">
      {/* -------- Header -------- */}
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="relative z-10 space-y-1">
          <h2 className="text-lg font-black text-black uppercase tracking-wider flex items-center gap-2">
            <FileText className="h-5.5 w-5.5 text-[#B50E30]" />
            CV Analyzer IA &mdash; Escaneo ATS
          </h2>
          <p className="text-neutral-500 text-xs font-semibold">
            El CV ya fue cargado desde tu perfil. Aquí la IA te muestra cómo optimizarlo
            para tu vacante objetivo y adaptarlo a un formato profesional tipo Harvard.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ===================================================== */}
        {/* LEFT COLUMN (2/3)                                      */}
        {/* ===================================================== */}
        <div className="lg:col-span-2 space-y-6">

          {/* -------- 1. CV current card -------- */}
          <div className="bg-white rounded-none border border-utp-border p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-12 w-12 bg-black flex items-center justify-center shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-xs font-black text-black uppercase tracking-wider flex items-center gap-2">
                    CV actual cargado
                    <CheckCircle className="h-3.5 w-3.5 text-[#B50E30]" />
                  </p>
                  <p className="text-[11px] font-extrabold text-black truncate">
                    {SIMULATED_CV_INFO.fileName}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">
                    <span>{SIMULATED_CV_INFO.format}</span>
                    <span className="w-1 h-1 bg-neutral-300" />
                    <span>Fuente: {SIMULATED_CV_INFO.source}</span>
                    <span className="w-1 h-1 bg-neutral-300" />
                    <span>Estado: {SIMULATED_CV_INFO.status}</span>
                    <span className="w-1 h-1 bg-neutral-300" />
                    <span>Vacante: {SIMULATED_CV_INFO.targetRole}</span>
                    <span className="w-1 h-1 bg-neutral-300" />
                    <span>Análisis: {SIMULATED_CV_INFO.analysisDate}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="px-3 py-2 border border-black hover:bg-neutral-50 text-black font-black uppercase tracking-wider rounded-none text-[10px] flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                <RefreshCw className="h-3 w-3" />
                Actualizar desde Mi Perfil
              </button>
            </div>
          </div>

          {/* -------- 2. IA Analysis Summary -------- */}
          <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
            <div className="relative z-10 space-y-5">
              <h3 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2 pb-3 border-b border-utp-border">
                <Sparkles className="h-4 w-4 text-[#B50E30] fill-[#B50E30]" />
                Análisis IA del CV
              </h3>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Score rings */}
                <div className="flex items-center gap-5 shrink-0">
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" className="stroke-neutral-100 fill-transparent" strokeWidth="7" />
                      <circle cx="48" cy="48" r="40" className="stroke-[#B50E30] fill-transparent transition-all duration-1000" strokeWidth="7" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysis.score / 100)}`} strokeLinecap="square" />
                    </svg>
                    <div className="absolute font-sans text-center">
                      <span className="text-xl font-black text-black">{analysis.score}</span>
                      <span className="text-[9px] text-neutral-400 font-extrabold block">actual</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <TrendingUp className="h-5 w-5 text-black" />
                    <span className="text-[8px] font-black text-black uppercase tracking-wider mt-0.5">+{optimizedScore - analysis.score}%</span>
                  </div>
                  <div className="relative h-24 w-24 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" className="stroke-neutral-100 fill-transparent" strokeWidth="7" />
                      <circle cx="48" cy="48" r="40" className="stroke-black fill-transparent transition-all duration-1000" strokeWidth="7" strokeDasharray={`${2 * Math.PI * 40}`} strokeDashoffset={`${2 * Math.PI * 40 * (1 - optimizedScore / 100)}`} strokeLinecap="square" />
                    </svg>
                    <div className="absolute font-sans text-center">
                      <span className="text-xl font-black text-black">{optimizedScore}</span>
                      <span className="text-[9px] text-neutral-400 font-extrabold block">óptimo</span>
                    </div>
                  </div>
                </div>

                {/* Status details */}
                <div className="flex-1 w-full space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                    <div className="flex items-center justify-between border-b border-utp-border pb-1">
                      <span className="text-neutral-500 font-semibold">Estado</span>
                      <span className={`font-extrabold ${analysis.score >= 60 ? 'text-black' : 'text-[#B50E30]'}`}>
                        {analysis.score >= 80 ? "CV sobresaliente" : analysis.score >= 60 ? "CV aceptable, requiere ajustes" : "CV en riesgo de ser descartado"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-utp-border pb-1">
                      <span className="text-neutral-500 font-semibold">Score optimizado</span>
                      <span className="font-extrabold text-black">{optimizedScore}%</span>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-50 border border-utp-border space-y-1.5">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-[#B50E30] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-wider">Mayor problema detectado</p>
                        <p className="text-[11px] text-neutral-600 font-semibold mt-0.5">Faltan palabras clave técnicas y evidencias alineadas a la vacante.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 pt-1.5 border-t border-utp-border">
                      <Sparkles className="h-4 w-4 text-[#B50E30] shrink-0 fill-[#B50E30] mt-0.5" />
                      <div>
                        <p className="text-[10px] font-black text-black uppercase tracking-wider">Próxima mejor acción</p>
                        <p className="text-[11px] text-neutral-600 font-semibold mt-0.5">Adaptar el CV al formato Harvard y agregar logros medibles.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------- 3. 3 Priority Improvements -------- */}
          <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
            <h3 className="text-xs font-black text-black uppercase tracking-widest pb-2 border-b border-utp-border flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#B50E30] fill-[#B50E30]" />
              Tus 3 mejoras prioritarias
            </h3>
            <div className="space-y-2">
              {SIMULATED_RECOMMENDATIONS.map((rec, idx) => (
                <div key={idx} className="p-3 bg-neutral-50 border border-utp-border flex items-start gap-3">
                  <div className="h-6 w-6 bg-black flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[10px] font-black">{idx + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-black uppercase tracking-tight">{rec.title}</p>
                    <p className="text-[11px] text-neutral-600 font-semibold mt-0.5 leading-relaxed">{rec.description}</p>
                    <span className="inline-block mt-1.5 text-[9px] font-black text-[#B50E30] uppercase tracking-wider">
                      Impacto estimado: {rec.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* -------- 4. Harvard Format Recommendation -------- */}
          <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
            <h3 className="text-xs font-black text-black uppercase tracking-widest pb-2 border-b border-utp-border flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#B50E30]" />
              Formato Harvard recomendado para tu CV
            </h3>
            <p className="text-[11px] text-neutral-500 font-semibold leading-relaxed">
              Este formato permite presentar tu perfil de forma clara, ordenada y profesional,
              maximizando la compatibilidad con filtros ATS y la lectura por reclutadores.
            </p>
            <div className="space-y-2">
              {[
                { num: "1", title: "Encabezado profesional", desc: "Nombre, correo, teléfono, LinkedIn, GitHub o portafolio." },
                { num: "2", title: "Perfil profesional", desc: "Resumen breve orientado a la vacante objetivo." },
                { num: "3", title: "Educación", desc: "Carrera, universidad, ciclo o año académico." },
                { num: "4", title: "Experiencia / Proyectos", desc: "Experiencias, prácticas, proyectos académicos o personales relevantes." },
                { num: "5", title: "Habilidades", desc: "Habilidades técnicas y blandas alineadas al puesto." },
                { num: "6", title: "Certificaciones", desc: "Cursos, talleres, certificaciones o eventos relevantes." },
                { num: "7", title: "Logros o evidencias", desc: "Resultados medibles, proyectos publicados, portafolio o evidencias." }
              ].map((section) => (
                <div key={section.num} className="flex items-start gap-3 p-2.5 bg-neutral-50 border border-utp-border">
                  <div className="h-5 w-5 bg-black flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-white text-[8px] font-black">{section.num}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-extrabold text-black uppercase tracking-tight">{section.title}</p>
                    <p className="text-[10px] text-neutral-500 font-semibold">{section.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* -------- 5. Optimized Extract -------- */}
          <div className="bg-black text-white rounded-none p-6 border border-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 fill-[#B50E30] text-[#B50E30]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Extracto optimizado para formato Harvard</span>
              </div>
            </div>
            <div className="py-4 text-neutral-300 font-mono text-xs leading-relaxed select-all">
              {analysis.atsFormattedCvAdvice}
            </div>
            <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(analysis.atsFormattedCvAdvice || "");
                  setCopiedExtract(true);
                  setTimeout(() => setCopiedExtract(false), 2500);
                }}
                className="bg-white text-black font-black text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-neutral-200 transition cursor-pointer flex items-center gap-1.5"
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
                className="border border-neutral-700 text-neutral-300 font-black text-[10px] uppercase tracking-wider px-4 py-2 hover:bg-neutral-800 transition cursor-pointer flex items-center gap-1.5"
              >
                {evidenceSaved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                {evidenceSaved ? "Guardado" : "Guardar como evidencia"}
              </button>
            </div>
          </div>

          {/* -------- 6. Accordion sections -------- */}
          {/* Reporte detallado */}
          <div className="bg-white rounded-none border border-utp-border">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full p-5 flex items-center justify-between text-left transition hover:bg-neutral-50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#B50E30]" />
                <span className="text-xs font-black text-black uppercase tracking-widest">Ver informe detallado</span>
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

          {/* Antes / Después */}
          <div className="bg-white rounded-none border border-utp-border">
            <button
              type="button"
              onClick={() => setShowBeforeAfter(!showBeforeAfter)}
              className="w-full p-5 flex items-center justify-between text-left transition hover:bg-neutral-50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#B50E30]" />
                <span className="text-xs font-black text-black uppercase tracking-widest">Ver comparación antes / después</span>
              </div>
              <ChevronRight className={`h-4 w-4 text-black transition-transform ${showBeforeAfter ? "rotate-90" : ""}`} />
            </button>
            {showBeforeAfter && (
              <div className="px-5 pb-5 pt-0 border-t border-utp-border">
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 border border-utp-border space-y-1">
                    <span className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-[#B50E30]" />
                      Antes
                    </span>
                    <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed italic">
                      &ldquo;Estudiante de Ingeniería de Sistemas con soporte técnico y diseño,
                      busca aprender programación.&rdquo;
                    </p>
                  </div>
                  <div className="p-3 bg-black border border-neutral-800 space-y-1">
                    <span className="text-[9px] font-black text-white uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white" />
                      Después
                    </span>
                    <p className="text-[11px] text-neutral-300 font-semibold leading-relaxed italic">
                      &ldquo;Estudiante de Ingeniería de Sistemas, ciclo avanzado, con experiencia
                      en soporte técnico y desarrollo de soluciones digitales. Orientado al backend.&rdquo;
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 p-2.5 bg-[#B50E30]/5 border border-[#B50E30]/10">
                  <Sparkles className="h-3.5 w-3.5 text-[#B50E30] shrink-0 fill-[#B50E30]" />
                  <p className="text-[10px] text-black font-bold uppercase tracking-wider">
                    Impacto: +{optimizedScore - analysis.score}% en filtros ATS
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Fortalezas y alertas */}
          <div className="bg-white rounded-none border border-utp-border">
            <button
              type="button"
              onClick={() => setShowStrengths(!showStrengths)}
              className="w-full p-5 flex items-center justify-between text-left transition hover:bg-neutral-50 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-[#B50E30]" />
                <span className="text-xs font-black text-black uppercase tracking-widest">Ver fortalezas y alertas</span>
              </div>
              <ChevronRight className={`h-4 w-4 text-black transition-transform ${showStrengths ? "rotate-90" : ""}`} />
            </button>
            {showStrengths && (
              <div className="px-5 pb-5 pt-0 border-t border-utp-border">
                <div className="pt-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-black text-black uppercase tracking-wider flex items-center gap-1 mb-2">
                      <ThumbsUp className="h-3.5 w-3.5 text-[#B50E30]" />
                      Fortalezas ({analysis.strengths.length})
                    </span>
                    <ul className="space-y-1">
                      {analysis.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] font-semibold text-black">
                          <span className="text-[#B50E30] font-black mt-0.5">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="border-t border-utp-border pt-3">
                    <span className="text-[10px] font-black text-[#B50E30] uppercase tracking-wider flex items-center gap-1 mb-2">
                      <ThumbsDown className="h-3.5 w-3.5 text-[#B50E30]" />
                      Alertas ({analysis.weaknesses.length})
                    </span>
                    <ul className="space-y-1">
                      {analysis.weaknesses.map((w, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] font-bold text-[#B50E30]">
                          <span className="font-black mt-0.5">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===================================================== */}
        {/* RIGHT COLUMN (1/3)                                     */}
        {/* ===================================================== */}
        <div className="space-y-4">
          {/* -------- Skills & Brechas -------- */}
          <div className="bg-white rounded-none border border-utp-border p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-utp-border">
              <h3 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#B50E30]" />
                Skills & Brechas
              </h3>
              {incomingGaps && incomingGaps.filter(g => g.priority === "alta" && g.status !== "completado").length > 0 && (
                <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 rounded-none uppercase">
                  {incomingGaps.filter(g => g.priority === "alta" && g.status !== "completado").length} Críticas
                </span>
              )}
            </div>

            <p className="text-[10px] text-neutral-500 font-semibold mb-4 leading-relaxed">
              Estas brechas afectan la compatibilidad de tu CV con la vacante objetivo.
            </p>

            {incomingSkills && incomingSkills.length > 0 && (
              <div className="mb-4">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-2">Tus habilidades actuales</p>
                <div className="flex flex-wrap gap-1.5">
                  {incomingSkills.map((skill) => (
                    <span key={skill} className="bg-black text-white text-[9px] font-bold px-2 py-1 uppercase tracking-tight">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!incomingGaps || incomingGaps.length === 0 ? (
              <div className="text-center py-6 px-4">
                <AlertCircle className="h-6 w-6 text-[#B50E30] mx-auto mb-2" />
                <p className="text-black text-[11px] font-extrabold uppercase tracking-wide">
                  Sin diagnóstico registrado
                </p>
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
                {incomingGaps.map((gap, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-none border border-utp-border text-xs space-y-1.5 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-black uppercase tracking-tight text-[11px]">{gap.skillName}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-none uppercase shrink-0 ${
                        gap.priority === "alta"
                          ? "bg-[#B50E30] text-white"
                          : gap.priority === "media"
                            ? "bg-black text-white"
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
                      <div className="text-[9px] text-neutral-400 font-semibold">
                        Recurso: {gap.recommendedResource}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* -------- Keywords -------- */}
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
                  {analysis.keywordsFound.slice(0, 5).map((kw, idx) => (
                    <span key={idx} className="bg-black text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-tight">{kw}</span>
                  ))}
                </div>
              </div>
              <div className="border-t border-utp-border pt-3">
                <div className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3 text-[#B50E30]" />
                  Faltantes ({analysis.keywordsMissing.length})
                </div>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywordsMissing.slice(0, 5).map((kw, idx) => (
                    <span key={idx} className="bg-[#B50E30]/10 text-[#B50E30] border border-[#B50E30]/25 text-[9px] font-bold px-2 py-0.5 uppercase tracking-tight">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* -------- Route Impact -------- */}
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
                  <span className="text-neutral-500 font-semibold">Evidencia</span>
                  <span className="font-extrabold text-black flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-[#B50E30]" />
                    {routeImpact.evidence}
                  </span>
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
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-utp-border text-[11px]">
                <ArrowRight className="h-3.5 w-3.5 text-[#B50E30] shrink-0" />
                <span className="text-neutral-500 font-semibold">Siguiente:</span>
                <span className="font-extrabold text-black">{routeImpact.nextMission}</span>
              </div>
            </div>
          )}

          {/* -------- ¿Qué evalúa la IA? -------- */}
          <div className="bg-neutral-50 rounded-none border border-utp-border p-5 space-y-3">
            <h4 className="text-[10px] font-black text-black uppercase tracking-wider">¿Qué evalúa la IA?</h4>
            <ul className="space-y-2 text-black text-[11px] font-semibold">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong>Compatibilidad ATS</strong>: Legibilidad analógica y organización del currículum.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong>Palabras Clave</strong>: Integración de lenguajes o herramientas esenciales en el mercado.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Shield className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                <span><strong>Escaneo ATS</strong>: Detección de formato óptimo para filtros automatizados.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
