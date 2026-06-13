import React, { useState, useEffect, useRef } from "react";
import { InterviewMessage, InterviewSession } from "../types";
import { 
  MessageSquare, Sparkles, AlertCircle, Play, Send, Award, Trash2, 
  User, CheckCircle2, ChevronRight, BookOpen, Clock, HeartHandshake, Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { AIVoiceInput } from "./ui/ai-voice-input";

interface InterviewPanelProps {
  targetRole: string;
  onSessionComplete: (score: number) => void;
  savedSession?: InterviewSession;
}

const DEFAULT_ROLES = [
  "Full Stack Developer Junior",
  "Asistente Legal Corporativo",
  "Analista de Marketing Digital",
  "Project Manager Junior",
  "Analista de Finanzas Trainee"
];

export default function InterviewPanel({
  targetRole,
  onSessionComplete,
  savedSession
}: InterviewPanelProps) {
  const [role, setRole] = useState(targetRole || "");
  const [isStarted, setIsStarted] = useState(!!savedSession);
  const [messages, setMessages] = useState<InterviewMessage[]>(savedSession?.messages || []);
  const [inputText, setInputText] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewSession["evaluation"] | undefined>(savedSession?.evaluation);
  const [errorStr, setErrorStr] = useState<string | null>(null);

  const endOfChatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMsg]);

  const handleStart = async () => {
    if (!role.trim()) {
      setErrorStr("Por favor especifica o selecciona un cargo objetivo para preparar tu entrevista.");
      return;
    }

    setIsStarted(true);
    setLoadingMsg(true);
    setErrorStr(null);
    setMessages([]);
    setEvaluation(undefined);

    try {
      const response = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName: role, messages: [] })
      });

      if (!response.ok) {
        throw new Error("Fallo en la comunicación con la plataforma.");
      }

      const data = await response.json();
      setMessages([{ role: "assistant", content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setMessages([{ 
        role: "assistant", 
        content: `Hola Valeria, un placer conversar contigo. Iniciemos tu entrenamiento personalizado para el puesto de **${role}**. Cuéntame, ¿podrías darme un breve resumen de tus proyectos clave y qué te motivó a postular a esta vacante?` 
      }]);
    } finally {
      setLoadingMsg(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loadingMsg) return;

    const userMsg: InterviewMessage = { role: "user", content: inputText };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setInputText("");
    setLoadingMsg(true);
    setErrorStr(null);

    try {
      const response = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName: role, messages: updatedMessages })
      });

      if (!response.ok) {
        throw new Error("Fallo al obtener respuesta de la IA.");
      }

      const data = await response.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setErrorStr("Fallo en la comunicación con Gemini. Por favor re-envía el mensaje.");
    } finally {
      setLoadingMsg(false);
    }
  };

  const handleEvaluate = async () => {
    if (messages.length < 2) {
      setErrorStr("Por favor responde al menos una pregunta antes de solicitar evaluación.");
      return;
    }

    setEvaluating(true);
    setErrorStr(null);

    try {
      const response = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleName: role, messages })
      });

      if (!response.ok) {
        throw new Error("No pudimos contactar al sistema de evaluación.");
      }

      const data = await response.json();
      setEvaluation({
        score: data.score || 70,
        strengths: data.strengths || [],
        improvements: data.improvements || [],
        feedbackMessage: data.feedbackMessage || ""
      });
      onSessionComplete(data.score || 70);
    } catch (err: any) {
      console.error(err);
      setErrorStr("Fallo al procesar evaluación de la entrevista.");
    } finally {
      setEvaluating(false);
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setMessages([]);
    setEvaluation(undefined);
    setErrorStr(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <h2 className="heading-lg text-black flex items-center gap-2">
              <MessageSquare className="h-5.5 w-5.5 text-[#B50E30]" />
              Entrevista de Trabajo IA - Simulación STAR
            </h2>
            <p className="text-neutral-500 text-xs font-semibold">
              Practica tus respuestas frente al reclutador corporativo y obtén tu calificación por competencias con apoyo de IA.
            </p>
          </div>
          {isStarted && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-black hover:bg-[#B50E30] hover:text-white hover:border-[#B50E30] text-black font-black uppercase tracking-wider rounded-none text-xs transition flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Reiniciar simulación
            </button>
          )}
        </div>
      </div>

      {!isStarted ? (
        /* Starter Setup Panel */
        <div className="max-w-2xl mx-auto bg-white rounded-none border border-utp-border p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-black uppercase tracking-widest">1. Selecciona el Cargo de Postulación</h3>
            <p className="text-xs text-neutral-500 font-semibold">¿Para qué puesto te gustaría simular la ronda de preguntas hoy?</p>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {DEFAULT_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`px-3.5 py-2 rounded-none border text-xs font-bold uppercase transition ${
                    role === r 
                      ? "bg-black border-black text-white" 
                      : "bg-neutral-50 border-utp-border text-black hover:bg-neutral-100"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider text-black">O escribe tu vacante a medida:</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Ej. Practicante de Big Data / Alicorp"
              className="w-full px-4 py-3 bg-white border border-utp-border outline-none rounded-none focus:border-black text-xs font-semibold text-black transition font-mono"
            />
          </div>

          {errorStr && (
            <div className="p-3 bg-neutral-50 border-l-4 border-[#B50E30] text-xs font-extrabold text-black uppercase tracking-wide">
              {errorStr}
            </div>
          )}

          <button
            type="button"
            onClick={handleStart}
            className="w-full bg-[#B50E30] text-white hover:bg-[#85061B] text-xs font-black uppercase tracking-widest py-3.5 rounded-none transition flex items-center justify-center gap-2 cursor-pointer shadow-none"
          >
            <Play className="h-4 w-4 fill-white shrink-0" />
            Comenzar Entrenamiento
          </button>
        </div>
      ) : !evaluation ? (
        /* Chat Session Active */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Panel Column */}
          <div className="lg:col-span-2 bg-white rounded-none border border-utp-border flex flex-col h-[520px]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-utp-border flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-[#B50E30] animate-ping" />
                <span className="text-xs font-black text-black uppercase tracking-wider">RECLUTADOR VIRTUAL UTP</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5 text-[#B50E30]" />
                <span>Simulador Activo</span>
              </div>
            </div>

            {/* Message History */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[400px]">
              {messages.map((msg, idx) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${isAI ? "" : "flex-row-reverse"}`}
                  >
                    {/* Icon identifier */}
                    <div className={`h-8 w-8 rounded-none flex items-center justify-center shrink-0 border ${
                      isAI ? "bg-black text-[#B50E30] border-black" : "bg-[#B50E30] text-white border-[#B50E30]"
                    }`}>
                      {isAI ? (
                        <Cpu className="h-4 w-4" />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>

                    <div className={`p-4 rounded-none max-w-[80%] text-xs leading-relaxed font-semibold border ${
                      isAI 
                        ? "bg-neutral-50 text-black border-utp-border" 
                        : "bg-black text-white border-black"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {loadingMsg && (
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 rounded-none bg-black border border-black text-[#B50E30] flex items-center justify-center shrink-0">
                    <Cpu className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-none border border-utp-border max-w-[80%] text-xs text-neutral-500 flex items-center gap-2 font-bold uppercase tracking-wider">
                    <div className="flex space-x-1">
                      <div className="h-1.5 w-1.5 bg-[#B50E30] animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="h-1.5 w-1.5 bg-black animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="h-1.5 w-1.5 bg-neutral-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span>Reclutador analizando...</span>
                  </div>
                </div>
              )}

              <div ref={endOfChatRef} />
            </div>

            {/* Input Footer Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-utp-border bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loadingMsg}
                placeholder="Escribe tu respuesta detallada aquí para evaluación..."
                className="flex-1 px-4 py-3 bg-white border border-utp-border outline-none rounded-none focus:border-black text-xs font-semibold text-black transition"
              />
              <AIVoiceInput
                compact
                onStart={() => console.log("Voice recording started")}
                onStop={(duration) => console.log("Voice recording stopped, duration:", duration)}
              />
              <button
                type="submit"
                disabled={!inputText.trim() || loadingMsg}
                className="bg-[#B50E30] text-white hover:bg-[#85061B] disabled:bg-neutral-200 h-10 w-10 flex items-center justify-center rounded-none transition shrink-0 cursor-pointer shadow-none"
              >
                <Send className="h-4 w-4 fill-white text-white" />
              </button>
            </form>
          </div>

          {/* Quick Assistant instructions sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <div>
                <h3 className="text-xs font-black text-black uppercase tracking-widest">¿Cómo responder?</h3>
                <p className="text-[10px] text-neutral-400 font-extrabold uppercase">Metodología STAR Profesional:</p>
              </div>

              <div className="space-y-3 text-[11px] text-black font-semibold">
                <div className="p-2.5 bg-neutral-50 border border-utp-border rounded-none">
                  <span className="font-extrabold text-black uppercase tracking-wider text-[10px] block text-[#B50E30] mb-0.5">S - Situación</span>
                  Describe brevemente el reto o proyecto universitario.
                </div>
                <div className="p-2.5 bg-neutral-50 border border-utp-border rounded-none">
                  <span className="font-extrabold text-black uppercase tracking-wider text-[10px] block text-[#B50E30] mb-0.5">T - Tarea</span>
                  Especifica cuál era tu rol y los objetivos asignados.
                </div>
                <div className="p-2.5 bg-neutral-50 border border-utp-border rounded-none">
                  <span className="font-extrabold text-black uppercase tracking-wider text-[10px] block text-[#B50E30] mb-0.5">A - Acción</span>
                  Explica qué tecnologías o estrategias usaste para solucionarlo.
                </div>
                <div className="p-2.5 bg-neutral-50 border border-utp-border rounded-none">
                  <span className="font-extrabold text-black uppercase tracking-wider text-[10px] block text-[#B50E30] mb-0.5">R - Resultado</span>
                  Enumera el logro final con un dato medible o aprobación de docente.
                </div>
              </div>

              {errorStr && (
                <div className="p-3 bg-neutral-50 border-l-4 border-[#B50E30] text-[10px] text-black font-bold uppercase tracking-wider">
                  {errorStr}
                </div>
              )}

              <button
                type="button"
                onClick={handleEvaluate}
                disabled={evaluating || messages.length < 2}
                className="w-full bg-black text-white hover:bg-neutral-900 border border-black font-black uppercase tracking-widest text-xs py-3 rounded-none transition flex items-center justify-center gap-2 cursor-pointer shadow-none"
              >
                {evaluating ? (
                  <>
                    <div className="h-4 w-4 rounded-none border-2 border-white border-t-transparent animate-spin" />
                    Generando Reporte...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 text-[#B50E30] shrink-0 fill-[#B50E30]" />
                    Finalizar y Evaluar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Evaluation Report Panel */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Assessment score section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-none border border-utp-border p-6 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-full utp-diagonal-pattern opacity-15 pointer-events-none" />
              
              {/* Score Counter */}
              <div className="relative h-24 w-28 shrink-0 flex items-center justify-center bg-black rounded-none border border-black">
                <div className="text-center">
                  <span className="text-3xl font-black text-white block leading-none">{evaluation.score}</span>
                  <span className="text-[9px] text-[#B50E30] font-black uppercase tracking-widest block mt-1">SCORE STAR</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="bg-[#B50E30] text-white text-[9px] font-black px-2.5 py-0.5 rounded-none uppercase tracking-widest">
                  Evaluación de Desempeño
                </span>
                <h3 className="text-lg font-bold text-black uppercase tracking-wider">
                  {evaluation.score >= 80 ? "¡Excelente, dominas el discurso corporativo!" : evaluation.score >= 60 ? "¡Demuestras solidez, pero afina la precisión técnica!" : "¡Requiere práctica, enfócate en ordenar tus ejemplos!"}
                </h3>
                <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                  Este informe califica la claridad narrativa de tus respuestas, la concordancia con el puesto {role} y la estructura STAR.
                </p>
              </div>
            </div>

            {/* Markdown Report Message */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <h4 className="heading-sm text-black pb-2 border-b border-utp-border tracking-widest flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-[#B50E30]" />
                Giga-Informe del Mentor IA
              </h4>
              <div className="text-black text-xs leading-relaxed space-y-3 font-semibold">
                <ReactMarkdown>{evaluation.feedbackMessage}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Strengths & Weaknesses checklists for interview */}
          <div className="space-y-6">
            {/* Strengths */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-3">
              <h4 className="text-[10px] font-black text-black uppercase tracking-widest pb-2 border-b border-utp-border flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#B50E30]" />
                Aciertos Identificados
              </h4>
              <ul className="space-y-2">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx} className="p-3 bg-neutral-50 border border-utp-border text-xs text-black font-semibold leading-relaxed flex items-start gap-2">
                    <span className="text-[#B50E30] font-black">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-3">
              <h4 className="text-[10px] font-black text-[#B50E30] uppercase tracking-widest pb-2 border-b border-[#B50E30]/20 flex items-center gap-2">
                <HeartHandshake className="h-4 w-4 text-[#B50E30]" />
                Recomendaciones Clave
              </h4>
              <ul className="space-y-2">
                {evaluation.improvements.map((imp, idx) => (
                  <li key={idx} className="p-3 bg-[#B50E30]/5 border border-[#B50E30]/15 text-xs text-black font-semibold leading-relaxed flex items-start gap-2">
                    <span className="text-[#B50E30] font-black">•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
