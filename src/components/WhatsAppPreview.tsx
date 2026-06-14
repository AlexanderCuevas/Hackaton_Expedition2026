import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SCRIPT: { sender: "user" | "ai"; content: string }[] = [
  { sender: "ai", content: "🔍 Nueva vacante: Practicante Backend en Alicorp — 84% match con tu perfil. ¿Te postulo?" },
  { sender: "user", content: "Sí, postúlame por favor 🙌" },
  { sender: "ai", content: "✅ Postulación enviada a Alicorp. Además te recomiendo el curso 'Scrum desde Cero' (+50 XP). ¿Lo agrego a tu ruta?" },
  { sender: "user", content: "Agrégalo, ¿qué más hay?" },
  { sender: "ai", content: "🎯 Agregado! También hay 'Testing con Jest' (+70 XP) y una vacante Trainee Data en BCP (82% match). ¿Te interesa alguna?" },
  { sender: "user", content: "Mándame la de BCP y el curso de Jest" },
  { sender: "ai", content: "✅ Postulación a BCP enviada y Jest agregado a tu ruta. También tienes una Hackathon UTP+ este finde con 92% match. ¿Aseguro tu lugar?" },
];

const TYPING_DELAY = 800;
const MESSAGE_DELAY = 1200;

export default function WhatsAppPreview() {
  const [phone, setPhone] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("desafios");
  const [testSendLoading, setTestSendLoading] = useState(false);

  const [msgIndex, setMsgIndex] = useState(0);
  const [showTyping, setShowTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "ai" | "system"; content: string }[]
  >([
    {
      sender: "system",
      content: "🛡️ Bienvenido a la Ruta de Empleabilidad UTP. Mentor IA enlazado.",
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let canceled = false;
    const total = SCRIPT.length;

    if (msgIndex > 0 && msgIndex % total === 0) {
      setChatMessages([
        {
          sender: "system",
          content: "🛡️ Bienvenido a la Ruta de Empleabilidad UTP. Mentor IA enlazado.",
        },
      ]);
    }

    const step = () => {
      if (canceled) return;
      const item = SCRIPT[msgIndex % total];

      if (item.sender === "ai") {
        setShowTyping(true);
        loopRef.current = setTimeout(() => {
          if (canceled) return;
          setShowTyping(false);
          setChatMessages((prev) => [
            ...prev,
            { sender: "ai", content: item.content },
          ]);
          setMsgIndex((i) => i + 1);
        }, TYPING_DELAY + MESSAGE_DELAY);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "user", content: item.content },
        ]);
        loopRef.current = setTimeout(() => {
          if (canceled) return;
          setMsgIndex((i) => i + 1);
        }, MESSAGE_DELAY);
      }
    };

    const idle = setTimeout(step, MESSAGE_DELAY * 1.5);
    return () => {
      canceled = true;
      if (loopRef.current) clearTimeout(loopRef.current);
      clearTimeout(idle);
    };
  }, [msgIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, showTyping]);

  const handleSendTestMessage = () => {
    setTestSendLoading(true);
    setTimeout(() => {
      let content = "";
      if (selectedTopic === "desafios") {
        content =
          "🎯 DESAFÍO DIARIO: Responde '¿Cómo manejas plazos ajustados?' en el simulador STAR. +50 XP extra hoy.";
      } else if (selectedTopic === "alertas") {
        content =
          "🚨 ALERTA HACKATHON: Faltan 24h para la Hackathon UTP+. Match 92%. ¡Asegura tu equipo!";
      } else {
        content =
          "🌟 VACANTE: Alicorp busca Practicante Backend. Perfil compatible 84%. ¡Postula ya!";
      }
      setChatMessages((prev) => [...prev, { sender: "ai", content }]);
      setTestSendLoading(false);
    }, 900);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings Form Column */}
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white rounded-none border border-utp-border p-4 sm:p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="heading-sm text-black tracking-widest flex items-center gap-2">
              <MessageCircle className="h-4.5 w-4.5 text-[#B50E30]" />
              Sincronización con WhatsApp
            </h2>
            <p className="text-neutral-500 text-xs font-semibold leading-relaxed">
              Recibe microconsejos, alertas de hackathons con alta compatibilidad y recordatorios diarios directamente en tu chat de WhatsApp.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-black">Tu Número de Celular (Perú)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+51 987 654 321"
                className="w-full px-4 py-3 bg-white border border-utp-border outline-none rounded-none text-xs font-semibold focus:border-black transition font-mono text-black"
              />
              <span className="text-[9px] text-neutral-400 block font-bold uppercase tracking-wider">
                🔒 Certificado oficial de protección de datos de la UTP.
              </span>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-wider text-black">Temas de Notificación</label>
              <div className="space-y-2">
                {[
                  { id: "desafios", label: "Desafíos diarios de oratoria y STAR" },
                  { id: "alertas", label: "Alertas de Hackathons y Ferias de la UTP" },
                  { id: "vacantes", label: "Matches automáticos de prácticas (Alicorp/BCP)" },
                ].map((top) => (
                  <button
                    key={top.id}
                    type="button"
                    onClick={() => setSelectedTopic(top.id)}
                    className={`w-full p-3.5 rounded-none border text-left text-xs transition flex items-center justify-between font-bold uppercase tracking-tight ${
                      selectedTopic === top.id
                        ? "bg-black border-black text-white"
                        : "bg-white border-utp-border text-black hover:bg-neutral-50"
                    }`}
                  >
                    <span>{top.label}</span>
                    {selectedTopic === top.id && (
                      <Check className="h-4 w-4 text-[#B50E30] stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-none border border-utp-border flex items-start gap-2.5">
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                className="h-4 w-4 rounded-none border-neutral-300 mt-0.5 cursor-pointer accent-[#B50E30]"
                id="opt-in-check"
              />
              <label htmlFor="opt-in-check" className="text-xs text-neutral-500 leading-normal select-none cursor-pointer font-semibold">
                Deseo activar notificaciones inteligentes push vía WhatsApp.
              </label>
            </div>

            <button
              type="button"
              onClick={handleSendTestMessage}
              disabled={testSendLoading}
              className="w-full bg-[#B50E30] hover:bg-[#85061B] text-white font-black uppercase tracking-widest text-xs py-3.5 rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
            >
              {testSendLoading ? (
                "Simulando envío de mensaje..."
              ) : (
                <>
                  <BellRing className="h-4 w-4 shrink-0 text-white fill-white" />
                  Enviar notificación de prueba
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Animated Chat Messages */}
      <div className="lg:col-span-6 flex items-center justify-center">
        <div
          ref={scrollRef}
          className="w-full max-h-[520px] overflow-y-auto space-y-3 scrollbar-none"
        >
          {chatMessages.map((msg, i) => {
            if (msg.sender === "system") {
              return (
                <div key={i} className="text-center">
                  <span className="inline-block bg-black/10 border border-black/5 text-black font-bold text-[10px] px-3 py-1.5 max-w-[90%] leading-relaxed uppercase tracking-wider">
                    {msg.content}
                  </span>
                </div>
              );
            }
            const isUser = msg.sender === "user";
            return (
              <motion.div
                key={`chat-${i}`}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 22, mass: 0.8 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-3 text-sm leading-relaxed max-w-[80%] font-semibold shadow-sm ${
                    isUser
                      ? "bg-[#dcf8c6] text-black rounded-[12px] rounded-tr-[2px]"
                      : "bg-white text-black rounded-[12px] rounded-tl-[2px]"
                  }`}
                >
                  {msg.content}
                  <span className="text-[8px] text-neutral-400 block text-right mt-1 font-bold uppercase tracking-wider">
                    Ahora
                  </span>
                </div>
              </motion.div>
            );
          })}

          <AnimatePresence>
            {showTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="flex justify-start"
              >
                <div className="bg-white rounded-[12px] rounded-tl-[2px] px-4 py-3.5 shadow-sm flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2.5 w-2.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2.5 w-2.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function BellRing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
