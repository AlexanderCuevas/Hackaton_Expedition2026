import React, { useState, useEffect, useRef } from "react";
import { InterviewMessage, InterviewSession } from "../types";
import { 
  MessageSquare, Sparkles, AlertCircle, Play, Send, Award, Trash2, 
  User, CheckCircle2, ChevronRight, BookOpen, Clock, HeartHandshake, Cpu,
  Volume2, VolumeX, Mic, MicOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

interface InterviewPanelProps {
  targetRole: string;
  onSessionComplete: (score: number) => void;
  savedSession?: InterviewSession;
  avatarUrl?: string;
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
  savedSession,
  avatarUrl
}: InterviewPanelProps) {
  const [role, setRole] = useState(targetRole || "");
  const [isStarted, setIsStarted] = useState(!!savedSession);
  const [messages, setMessages] = useState<InterviewMessage[]>(savedSession?.messages || []);
  const [inputText, setInputText] = useState("");
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<InterviewSession["evaluation"] | undefined>(savedSession?.evaluation);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const startTimeRef = useRef<number>(0);
  const endOfChatRef = useRef<HTMLDivElement>(null);
  const sendVoiceMsgRef = useRef<(text: string) => void>(() => {});

  useEffect(() => {
    endOfChatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMsg]);

  // Setup voice (STT) and speech (TTS)
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      setTtsSupported(true);
      synthRef.current = window.speechSynthesis;
    }

    const SpeechRecognitionAPI =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const rec = new SpeechRecognitionAPI();
      rec.lang = "es";
      rec.interimResults = false;
      rec.continuous = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        if (text.trim()) {
          sendVoiceMsgRef.current(text.trim());
        }
      };
      rec.onerror = (err: any) => {
        setIsListening(false);
        setErrorStr("Error de micrófono: " + (err.error || "permiso denegado"));
      };

      recognitionRef.current = rec;
    }

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  // Función actualizada para ctrl el micrófono
  const toggleListening = () => {
    if (!recognitionRef.current) {
      setErrorStr("Tu navegador no soporta entrada de voz. Usa Chrome.");
      return;
    }

    if (isListening || isSpeaking) {
      // Detener todo antes de iniciar
      try { recognitionRef.current.stop(); }
      catch {}
      setIsListening(false);
      stopSpeaking();
    }

    if (isListening) {
      // Si ya estaba escuchando, detén
      try { recognitionRef.current.stop(); }
      catch {}
      setIsListening(false);
    } else {
      // Preparar e iniciar
      startTimeRef.current = Date.now();
      setIsListening(true);
      try { recognitionRef.current.start(); }
      catch (err) {
        setIsListening(false);
        setErrorStr("No se pudo activar el micrófono. Revisa los permisos.");
      }
    }
  };

  const speakResponse = (text: string) => {
    if (!ttsSupported || !ttsEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[*#_`\[\]]/g, "");
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = "es";
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Helper to send a voice message through the same flow as written messages
  const sendVoiceMessage = async (text: string) => {
    if (loadingMsg) return;
    const userMsg: InterviewMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setLoadingMsg(true);
    setErrorStr(null);
    try {
      const conversation = [...updatedMessages, { role: "user", content: text }];
      const convoText = conversation.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n');
      const prompt = `[ROL Y CONTEXTO]
Eres un Reclutador Virtual Senior y Mentor de Empleabilidad. El puesto es: ${role}.

[REGLAS CRÍTICAS DE ENTORNO DE VOZ - OBLIGATORIAS]
1. BREVEDAD EXTREMA: Máximo 1 a 3 oraciones cortas (40 palabras como tope).
2. TONO TELEFÓNICO: Natural, fluido, profesional pero cercano. Como una conversación real.
3. DINÁMICA PING-PONG: Relaciona brevemente lo que dijo el candidato y haz UNA sola pregunta corta para devolverle el turno.
4. PROHIBIDO: Negritas, cursivas, viñetas, listas, guiones, emojis. Solo texto plano.

[METODOLOGÍA STAR]
Si el candidato da una respuesta vaga sin Situación, Tarea, Acción o Resultado, haz una pregunta de seguimiento corta para que profundice.

Conversación hasta ahora:
${convoText}

Interviewer:`;
      const mod = await import('../api/ai');
      const data = await mod.queryAi(prompt, { max_words: 60 });
      const reply = (data && (data.text as string)) || 'Cuéntame más sobre eso, ¿qué aprendiste en el proceso?';
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
      speakResponse(reply);
    } catch {
      setErrorStr("Fallo en la comunicación. Reintenta.");
    } finally {
      setLoadingMsg(false);
    }
  };

  sendVoiceMsgRef.current = sendVoiceMessage;

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
      const SYSTEM_PROMPT = `[ROL Y CONTEXTO]
Eres un Reclutador Virtual Senior y Mentor de Empleabilidad. Tu objetivo es realizar una simulación de entrevista de trabajo interactiva y hablada en tiempo real para el puesto específico que el usuario elija. El usuario te estará hablando principalmente a través de su micrófono (Voz a Texto) y tus respuestas serán leídas en voz alta por un motor de Síntesis de Voz (Texto a Voz).

[REGLAS CRÍTICAS DE ENTORNO DE VOZ - OBLIGATORIAS]
1. BREVEDAD EXTREMA: Cada una de tus intervenciones debe tener un límite estricto de 1 a 3 oraciones cortas (máximo 40 palabras). Las respuestas largas arruinan la experiencia auditiva.
2. TONO TELEFÓNICO: Habla de forma natural, fluida, profesional pero cercana. Actúa exactamente como un reclutador real conversando por teléfono o videollamada. Evita saludos robóticos repetitivos en cada turno como "¡Hola! ¿En qué te ayudo hoy?".
3. DINÁMICA PING-PONG: No acapares la conversación ni hagas preguntas múltiples a la vez. Haz una sola pregunta corta por turno, espera la respuesta del candidato, relaciónala brevemente con lo que te dijo, y lanza la siguiente pregunta.
4. PROHIBICIÓN ABSOLUTA DE FORMATO: Está terminantemente prohibido usar texto en negrita (**), cursiva, listas con viñetas (* o -), guiones, enumeraciones, subtítulos o emojis. El motor de Texto a Voz comete errores graves de entonación o hace pausas raras al leer estos caracteres. Genera exclusivamente texto plano.

[METODOLOGÍA DE EVALUACIÓN COGNITIVA]
- Evalúa de forma implícita si el candidato utiliza la estructura STAR (Situación, Tarea, Acción, Resultado).
- Si el candidato da una respuesta muy vaga, haz una pregunta de seguimiento corta para obligarlo a profundizar en sus acciones o resultados, tal como lo haría un entrevistador real.

[EJEMPLO DE INTERACCIÓN CORRECTA]
- Candidato: "Trabajé en un proyecto de software escolar donde lideré al equipo backend."
- Reclutador IA: "Suena como un gran reto. ¿Qué tecnologías específicas decidieron implementar en el backend y cuál fue tu mayor desafío técnico en ese proyecto?"

Puesto: ${role}. Inicia la entrevista con un saludo breve y una primera pregunta sobre su experiencia.`;

      const mod = await import('../api/ai');
      const data = await mod.queryAi(SYSTEM_PROMPT, { max_words: 60 });
      const reply = (data && (data.text as string)) || `Cuéntame sobre tu experiencia más relevante para este puesto de ${role}.`;
      setMessages([{ role: "assistant", content: reply }]);
      speakResponse(reply);
    } catch (err: any) {
      console.error(err);
      setMessages([{ 
        role: "assistant", 
        content: `Hola, cuéntame sobre tus proyectos y qué te motivó a postular a ${role}.` 
      }]);
      speakResponse(`Hola, cuéntame sobre tus proyectos y qué te motivó a postular a ${role}.`);
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
      // Build a compact conversation prompt for the mentor AI
      const conversation = [...updatedMessages, { role: 'user', content: inputText }];
      const convoText = conversation.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n');
      const prompt = `[ROL Y CONTEXTO]
Eres un Reclutador Virtual Senior y Mentor de Empleabilidad. El puesto es: ${role}.

[REGLAS CRÍTICAS DE ENTORNO DE VOZ - OBLIGATORIAS]
1. BREVEDAD EXTREMA: Máximo 1 a 3 oraciones cortas (40 palabras como tope).
2. TONO TELEFÓNICO: Natural, fluido, profesional pero cercano. Como una conversación real.
3. DINÁMICA PING-PONG: Relaciona brevemente lo que dijo el candidato y haz UNA sola pregunta corta para devolverle el turno.
4. PROHIBIDO: Negritas, cursivas, viñetas, listas, guiones, emojis. Solo texto plano.

[METODOLOGÍA STAR]
Si el candidato da una respuesta vaga sin Situación, Tarea, Acción o Resultado, haz una pregunta de seguimiento corta para que profundice.

Conversación hasta ahora:
${convoText}

Interviewer:`;

      const mod = await import('../api/ai');
      const data = await mod.queryAi(prompt, { max_words: 60 });
      const reply = (data && (data.text as string)) || 'Cuéntame más sobre eso, ¿qué aprendiste en el proceso?';
      setMessages([...updatedMessages, { role: "assistant", content: reply }]);
      speakResponse(reply);
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
              <div className="flex items-center gap-2">
                {ttsSupported && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isSpeaking) stopSpeaking();
                      else setTtsEnabled(!ttsEnabled);
                    }}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider cursor-pointer transition"
                    title={ttsEnabled ? "Silenciar voz" : "Activar voz"}
                  >
                    {isSpeaking ? (
                      <Volume2 className="h-3.5 w-3.5 text-[#B50E30] animate-pulse" />
                    ) : ttsEnabled ? (
                      <Volume2 className="h-3.5 w-3.5 text-neutral-500" />
                    ) : (
                      <VolumeX className="h-3.5 w-3.5 text-neutral-400" />
                    )}
                  </button>
                )}
                <Clock className="h-3.5 w-3.5 text-[#B50E30]" />
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Simulador Activo</span>
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
                        avatarUrl
                          ? <img src={avatarUrl} alt="AI" className="h-full w-full object-cover" />
                          : <Cpu className="h-4 w-4" />
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
                  <div className="h-8 w-8 rounded-none bg-black border border-black text-[#B50E30] flex items-center justify-center shrink-0 overflow-hidden">
                    {avatarUrl
                      ? <img src={avatarUrl} alt="AI" className="h-full w-full object-cover" />
                      : <Cpu className="h-4 w-4 animate-spin" />
                    }
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
                placeholder="Escribe tu respuesta o usa el micrófono..."
                className="flex-1 px-4 py-3 bg-white border border-utp-border outline-none rounded-none focus:border-black text-xs font-semibold text-black transition"
              />
              <button
                type="button"
                onClick={toggleListening}
                disabled={loadingMsg}
                className={`h-10 w-10 flex items-center justify-center rounded-none transition shrink-0 border cursor-pointer ${
                  isListening
                    ? "bg-[#B50E30] text-white border-[#B50E30] animate-pulse"
                    : "bg-white text-black border-utp-border hover:border-black"
                } ${loadingMsg ? "opacity-50 cursor-not-allowed" : ""}`}
                title={isListening ? "Detener grabación" : "Hablar con el reclutador"}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
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
