import React, { useState } from "react";
import { CvAnalysis } from "../types";
import { 
  FileText, Sparkles, AlertCircle, CheckCircle, HelpCircle, ArrowUpRight,
  TrendingDown, ThumbsUp, ThumbsDown, BookOpen, AlertTriangle, RefreshCw
} from "lucide-react";
import { motion } from "motion/react";
import ReactMarkdown from "react-markdown";

interface CvAnalyzerPanelProps {
  targetRole: string;
  onAnalysisResult: (analysis: CvAnalysis) => void;
  savedAnalysis?: CvAnalysis;
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

export default function CvAnalyzerPanel({
  targetRole,
  onAnalysisResult,
  savedAnalysis
}: CvAnalyzerPanelProps) {
  const [cvText, setCvText] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CvAnalysis | undefined>(savedAnalysis);

  const handleLoadTemplate = (content: string) => {
    setCvText(content);
    setErrorStr(null);
  };

  const handleAnalyze = async () => {
    if (!cvText.trim() || cvText.length < 30) {
      setErrorStr("Por favor ingresa un texto de CV válido de al menos 30 caracteres.");
      return;
    }

    setLoading(true);
    setErrorStr(null);

    try {
      const response = await fetch("/api/cv/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText, targetRole })
      });

      if (!response.ok) {
        throw new Error("Fallo en la comunicación con el servidor");
      }

      const data: CvAnalysis = await response.json();
      setAnalysis(data);
      onAnalysisResult(data);
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
  };

  return (
    <div className="space-y-6">
      {/* Introduction Module */}
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
                  disabled={loading}
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
                      Analizar mi CV con IA
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
                <p className="text-[11px] text-neutral-500 mt-1 font-semibold">Carga formatos desfavorables para simular la evaluación ATS y ver el poder de optimización de la IA:</p>
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
                  <span><strong>Compatibilidad ATS</strong>: Legibilidad analógica y organización del currículum.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                  <span><strong>Palabras Clave</strong>: Integración de lenguajes o herramientas esenciales en el mercado.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Report View Block */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Assessment Detailed Report */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Banner */}
            <div className="bg-white rounded-none border border-utp-border p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
              
              {/* Circular Gauge */}
              <div className="relative h-28 w-28 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-neutral-100 fill-transparent"
                    strokeWidth="8"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="48"
                    className="stroke-[#B50E30] fill-transparent transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 48}`}
                    strokeDashoffset={`${2 * Math.PI * 48 * (1 - analysis.score / 100)}`}
                    strokeLinecap="square"
                  />
                </svg>
                <div className="absolute font-sans text-center">
                  <span className="text-2xl font-black text-black">{analysis.score}</span>
                  <span className="text-[10px] text-neutral-400 font-extrabold block">ATS %</span>
                </div>
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#B50E30] flex items-center gap-1.5 justify-center sm:justify-start">
                  Score de Compatibilidad ATS
                </div>
                <h3 className="text-lg font-bold text-black uppercase tracking-wide">
                  {analysis.score >= 80 ? "¡Tu CV está en nivel sobresaliente!" : analysis.score >= 60 ? "¡Nivel promedio aceptable, requiere ajustes puntuales!" : "¡Alerta: Tu CV podría ser descartado por sistemas ATS!"}
                </h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                  Los robots lectores de CVs valoran el orden directo, los verbos activos y la inclusión correcta de herramientas específicas del puesto objetivo.
                </p>
              </div>
            </div>

            {/* Markdown Feedback Report */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <h3 className="text-xs font-black text-black uppercase tracking-widest pb-2 border-b border-utp-border flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-[#B50E30]" />
                Informe Detallado de Mejora
              </h3>
              <div className="text-black text-xs leading-relaxed space-y-3 font-semibold">
                <ReactMarkdown>{analysis.generalFeedback}</ReactMarkdown>
              </div>
            </div>

            {/* AI Template Re-write Suggester */}
            {analysis.atsFormattedCvAdvice && (
              <div className="bg-black text-white rounded-none p-6 space-y-4 border border-neutral-900">
                <div className="flex items-center gap-1.5 text-white bg-[#B50E30] self-start px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="h-4 w-4 fill-white text-white" />
                  Propuesta de Extracto optimizado con IA
                </div>
                <div className="p-4 bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono text-xs leading-relaxed whitespace-pre-line select-all">
                  {analysis.atsFormattedCvAdvice}
                </div>
                <p className="text-[10px] text-neutral-450 uppercase font-bold tracking-wider">
                  💡 Tip: Copia este extracto e incorpóralo en tu CV o en tu perfil estelar de LinkedIn.
                </p>
              </div>
            )}
          </div>

          {/* Strengths / Weaknesses / Keyword Sidebars */}
          <div className="space-y-6">
            {/* Strengths Block */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-3">
              <h4 className="text-[10px] font-black text-black flex items-center gap-1.5 uppercase tracking-widest pb-2 border-b border-utp-border">
                <ThumbsUp className="h-4 w-4 text-[#B50E30]" />
                Fortalezas de tu CV ({analysis.strengths.length})
              </h4>
              <ul className="space-y-2">
                {analysis.strengths.map((str, idx) => (
                  <li key={idx} className="p-3 bg-neutral-50 border border-utp-border text-[11px] text-black leading-relaxed font-semibold flex items-start gap-2">
                    <span className="text-[#B50E30] font-black">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses Block */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-3">
              <h4 className="text-[10px] font-black text-black flex items-center gap-1.5 uppercase tracking-widest pb-2 border-b border-utp-border">
                <ThumbsDown className="h-4 w-4 text-[#B50E30]" />
                Áreas de Alerta ({analysis.weaknesses.length})
              </h4>
              <ul className="space-y-2">
                {analysis.weaknesses.map((weak, idx) => (
                  <li key={idx} className="p-3 bg-[#B50E30]/5 border border-[#B50E30]/10 text-[11px] text-[#B50E30] leading-relaxed font-bold flex items-start gap-2">
                    <span className="text-[#B50E30] font-black">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords Tracker */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <div className="space-y-1">
                <h4 className="text-xs font-black text-black uppercase tracking-widest">Giga-Scanner de Palabras Clave</h4>
                <p className="text-[10px] text-neutral-400 font-semibold uppercase">Términos buscados por el robot evaluador argentino, peruano y global.</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Found */}
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-black uppercase tracking-wider">Estrategias Incorporadas:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.keywordsFound.map((kw, idx) => (
                      <span key={idx} className="bg-black text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-tight">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing */}
                <div className="space-y-2 border-t border-utp-border pt-3">
                  <div className="text-[10px] font-black text-[#B50E30] uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-[#B50E30]" />
                    DEBES AGREGAR:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.keywordsMissing.map((kw, idx) => (
                      <span key={idx} className="bg-[#B50E30]/10 text-[#B50E30] border border-[#B50E30]/25 text-[10px] font-bold px-2.5 py-1 uppercase tracking-tight">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
