import { useState, useEffect, useRef } from "react";
import { MessageSquare, Sparkles, Send, User, Cpu, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { queryAi } from "../api";

interface ChatMentorProps {
  cvId?: string;
  targetRole?: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "¿Qué habilidades debería reforzar según mi perfil?",
  "¿Cómo prepararme para una entrevista técnica?",
  "¿Qué certificaciones me recomiendas?",
  "¿Cómo mejorar mi CV para pasar filtros ATS?",
];

export default function ChatMentor({ cvId, targetRole }: ChatMentorProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setStarted(true);
    const userMsg: ChatMessage = { role: "user", content: msg };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await queryAi(msg, {
        cvId,
        maxWords: 400,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: reply.text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lo siento, no pude conectar con el mentor IA. Verifica que el backend esté disponible o intenta de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setStarted(false);
    setInput("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <h2 className="heading-lg text-black flex items-center gap-2">
              <Sparkles className="h-5.5 w-5.5 text-[#B50E30] fill-[#B50E30]" />
              Mentor IA SkillPath
            </h2>
            <p className="text-neutral-500 text-xs font-semibold">
              Haz cualquier pregunta sobre tu empleabilidad, CV, preparación de entrevistas o ruta de carrera.
              {cvId && " El mentor conoce tu CV y puede darte respuestas contextuales."}
            </p>
          </div>
          {started && (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 border border-black hover:bg-[#B50E30] hover:text-white hover:border-[#B50E30] text-black font-black uppercase tracking-wider rounded-none text-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Nueva conversación
            </button>
          )}
        </div>
      </div>

      {!started ? (
        <div className="max-w-2xl mx-auto bg-white rounded-none border border-utp-border p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xs font-black text-black uppercase tracking-widest">
              ¿En qué puedo ayudarte hoy?
            </h3>
            <p className="text-xs text-neutral-500 font-semibold">
              Soy tu mentor de empleabilidad IA. Puedo ayudarte con:
            </p>
            <ul className="text-xs font-semibold text-black space-y-1.5 pt-1">
              <li className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#B50E30] shrink-0 mt-0.5" />
                <span>Análisis de brechas de habilidades para tu puesto objetivo</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#B50E30] shrink-0 mt-0.5" />
                <span>Consejos para optimizar tu CV y pasar filtros ATS</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#B50E30] shrink-0 mt-0.5" />
                <span>Recomendaciones de cursos y certificaciones</span>
              </li>
              <li className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-[#B50E30] shrink-0 mt-0.5" />
                <span>Preparación para entrevistas técnicas y comportamentales</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-black">
              Preguntas rápidas
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSend(s)}
                  className="px-3.5 py-2 bg-neutral-50 border border-utp-border text-xs font-bold text-black hover:bg-black hover:text-white transition rounded-none uppercase tracking-tight"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[10px] font-black uppercase tracking-wider text-black mb-2">
              O escribe tu consulta
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ej. ¿Qué skills me faltan para ser full stack?"
                className="flex-1 px-4 py-3 bg-white border border-utp-border outline-none rounded-none focus:border-black text-xs font-semibold text-black transition font-mono"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="bg-[#B50E30] text-white hover:bg-[#85061B] disabled:bg-neutral-200 h-10 w-10 flex items-center justify-center rounded-none transition shrink-0 cursor-pointer shadow-none"
              >
                <Send className="h-4 w-4 fill-white text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-none border border-utp-border flex flex-col h-[520px]">
            <div className="px-6 py-4 border-b border-utp-border flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#B50E30] fill-[#B50E30]" />
                <span className="text-xs font-black text-black uppercase tracking-wider">MENTOR IA SKILLPATH</span>
              </div>
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                {cvId ? "Contexto: CV cargado" : "Consulta general"}
              </span>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[400px]">
              {messages.map((msg, idx) => {
                const isAI = msg.role === "assistant";
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${isAI ? "" : "flex-row-reverse"}`}
                  >
                    <div className={`h-8 w-8 rounded-none flex items-center justify-center shrink-0 border ${
                      isAI ? "bg-black text-[#B50E30] border-black" : "bg-[#B50E30] text-white border-[#B50E30]"
                    }`}>
                      {isAI ? <Cpu className="h-4 w-4" /> : <User className="h-4 w-4" />}
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

              {loading && (
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
                    <span>Mentor IA pensando...</span>
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 border-t border-utp-border bg-white flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder="Escribe tu pregunta aquí..."
                className="flex-1 px-4 py-3 bg-white border border-utp-border outline-none rounded-none focus:border-black text-xs font-semibold text-black transition"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-[#B50E30] text-white hover:bg-[#85061B] disabled:bg-neutral-200 h-10 w-10 flex items-center justify-center rounded-none transition shrink-0 cursor-pointer shadow-none"
              >
                <Send className="h-4 w-4 fill-white text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
