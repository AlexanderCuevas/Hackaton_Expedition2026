import React, { useState } from "react";
import { MessageSquare, Calendar, ChevronRight, Check, Send, PhoneCall, Sparkles, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function WhatsAppPreview() {
  const [phone, setPhone] = useState("");
  const [optIn, setOptIn] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("desafios");
  const [testSendLoading, setTestSendLoading] = useState(false);

  // Simulated WhatsApp Bubbles
  const [chatBubbles, setChatBubbles] = useState([
    {
      sender: "system",
      content: "🛡️ Bienvenido a la Ruta de Empleabilidad de UTP. Tu Mentor de Inteligencia Artificial está enlazado.",
      time: "10:30 AM"
    },
    {
      sender: "ai",
      content: "¡Hola Valeria! 👋 Veo que estás preparándote para postular como Junior Full Stack Developer. ¡Excelente motivación!",
      time: "10:31 AM"
    },
    {
      sender: "ai",
      content: "💡 Tip del día: Los motores de escaneo ATS descartan el 62% de formatos por no tener las keywords del mercado. Tu CV para este puesto necesita incluir 'Metodologías Ágiles (Scrum)'. ¿Quieres que lo optimicemos de inmediato?",
      time: "10:32 AM"
    }
  ]);

  const handleSendTestMessage = () => {
    setTestSendLoading(true);

    setTimeout(() => {
      let customBubble = {
        sender: "ai",
        content: "",
        time: "Hace un momento"
      };

      if (selectedTopic === "desafios") {
        customBubble.content = "🎯 DESAFÍO DIARIO: Practica tu oratoria respondiendo a la pregunta: '¿Cómo manejas los plazos ajustados?' en nuestro simulador STAR. ¡Te otorgará +50 XP adicionales hoy!";
      } else if (selectedTopic === "alertas") {
        customBubble.content = "🚨 ALERTA DE HACKATHON: Faltan solo 24 horas para iniciar la Hackathon UTP+ de este fin de semana. Tienes un score de compatibilidad del 92%. ¡Asegura tu equipo ya!";
      } else {
        customBubble.content = "🌟 RECOMENDACIÓN DE VACANTE: Alicorp acaba de abrir una plaza de Practicante Backend. Tienes un perfil compatible del 84%, ¡inicia tu postulación!";
      }

      setChatBubbles(prev => [...prev, customBubble]);
      setTestSendLoading(false);
    }, 900);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Settings Form Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-none border border-utp-border p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
              <PhoneCall className="h-4.5 w-4.5 text-[#B50E30]" />
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
                  { id: "vacantes", label: "Matches automáticos de prácticas (Alicorp/BCP)" }
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

      {/* Mock SmartPhone WhatsApp Chat Preview Column */}
      <div className="lg:col-span-7 bg-neutral-50 p-4 sm:p-6 rounded-none border border-utp-border flex items-center justify-center">
        <div className="w-full max-w-sm bg-black rounded-[40px] p-3 border-4 border-neutral-800 shadow-none relative">
          
          {/* Smartphone Speaker notch */}
          <div className="absolute top-[18px] left-1/2 -translate-x-1/2 bg-black w-24 h-4 rounded-full z-15 flex items-center justify-center">
            <div className="h-1 w-8 bg-neutral-800 rounded-full" />
          </div>

          {/* Internal Phone Display */}
          <div className="bg-[#efeae2] rounded-[32px] overflow-hidden flex flex-col h-[480px] max-h-[480px] border border-neutral-900">
            {/* WhatsApp Header bar */}
            <div className="bg-black text-white pt-6 pb-2.5 px-4 flex items-center gap-2">
              <div className="bg-[#B50E30] h-8 w-8 rounded-none border border-white/20 flex items-center justify-center font-black text-white text-[10px] uppercase shadow-none mt-1">
                UTP
              </div>
              <div className="flex flex-col mt-1">
                <span className="text-[11px] font-black uppercase tracking-wider leading-none">Mentor UTP+ 🌟</span>
                <span className="text-[9px] text-[#B50E30] font-bold uppercase tracking-widest leading-none mt-1">En línea</span>
              </div>
            </div>

            {/* Bubble Containers */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3 flex flex-col justify-end bg-gradient-to-b from-[#efeae2]/10 via-[#efeae2]/80 to-[#efeae2]">
              {chatBubbles.map((bub, bIdx) => {
                const isAI = bub.sender === "ai";
                const isSys = bub.sender === "system";

                if (isSys) {
                  return (
                    <div key={bIdx} className="text-center">
                      <span className="inline-block bg-black/10 border border-black/5 text-black font-semibold text-[9px] px-3 py-1.5 rounded-none max-w-[90%] leading-relaxed uppercase">
                        {bub.content}
                      </span>
                    </div>
                  );
                }

                return (
                  <motion.div
                    key={bIdx}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`flex ${isAI ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`p-3 rounded-none shadow-none text-[11px] leading-relaxed max-w-[85%] font-semibold border ${
                      isAI 
                        ? "bg-white text-black border-neutral-250/50 rounded-tl-none" 
                        : "bg-[#dcf8c6] text-black border-emerald-300/30 rounded-tr-none text-right"
                    }`}>
                      {bub.content}
                      <span className="text-[8px] text-neutral-400 font-sans block text-right mt-1 font-bold uppercase tracking-wider">{bub.time}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mock Bottom Input */}
            <div className="p-2.5 bg-neutral-100 border-t border-neutral-200/80 flex items-center gap-2">
              <div className="flex-1 bg-white border border-neutral-300/80 rounded-full px-3 py-1.5 text-[10px] text-neutral-400 font-semibold uppercase">
                Escribe un mensaje...
              </div>
              <div className="h-8 w-8 bg-black rounded-full flex items-center justify-center">
                <Send className="h-3 w-3 text-white fill-white" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
