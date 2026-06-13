

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight, X, Instagram, Linkedin, MessageCircle, Mail,
  Sparkles, FileText, Briefcase, Target, Zap, Award,
  ChevronDown, Check, MapPin, Building2, Play, Star,
  TrendingUp, BarChart3, Shield, ChevronRight, ChevronLeft,
  Eye, EyeOff, ShieldAlert, ShieldCheck, CheckCircle, AlertTriangle, Info
} from "lucide-react";
import principalImg from "./assets/Principal.png";
import { ImageGallery, ImageGalleryHandle } from "./ui/carousel-circular-image-gallery";
import { UserProfile } from "../types";
import { UTP_CAREERS, getDefaultTargetRole } from "../data";

// ─── TYPES ─────────────────────────────────────────────────────────────────
interface LandingPageProps {
  onStart: (profileData: Partial<UserProfile>, isNewUser: boolean) => void;
  currentProfileName: string;
}

// ─── HOOK: intersection observer ───────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── HOOK: animated counter ────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const step = target / (duration / 16);
    let cur = 0;
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(Math.floor(cur));
      if (cur >= target) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return val;
}

// ─── DATA ──────────────────────────────────────────────────────────────────
const COMPANIES = ["Interbank", "BCP", "BBVA", "Rimac", "Scotiabank", "Repsol", "Telefónica", "Belcorp", "Gloria", "Alicorp", "Intercorp", "Falabella", "Cencosud", "Inkafarma"];

const STORIES = [
  {
    id: 1, name: "Valentina Ríos", career: "Ing. de Software", age: 22, location: "Lima",
    company: "BCP", role: "Junior Developer", result: "Oferta antes de graduarse",
    photo: "https://images.unsplash.com/photo-1630939687530-241d630735df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    badge: "RENACYT · Investigadora", badgeIcon: "🔬",
    bio: "Egresada UTP · Ing. de Software. Hoy investigadora RENACYT y desarrolladora de innovación en el BCP. Publicó su primer paper sobre fintech en 2025.",
    journey: [
      { icon: "😰", label: "El problema", text: "8° ciclo sin experiencia laboral ni portafolio. Sentía que el mercado era inalcanzable." },
      { icon: "🎯", label: "Lo que hizo", text: "Completó el diagnóstico IA, optimizó su CV para ATS y practicó entrevistas con el simulador." },
      { icon: "🏆", label: "El resultado", text: "BCP la contrató como Junior Developer antes de terminar el ciclo. Hoy registrada en RENACYT." },
    ],
    tags: ["CV ATS optimizado", "Simulador de entrevistas", "Portafolio verificado"],
    stat: "3 meses",
    statLabel: "de la plataforma a su primer empleo",
  },
  {
    id: 2, name: "Carlos Mendoza", career: "Ing. de Sistemas", age: 23, location: "Lima",
    company: "Interbank", role: "Full Stack Dev", result: "Contratado en empresa top",
    photo: "https://images.unsplash.com/photo-1716471453667-94383b1e4859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    badge: "RENACYT · Investigador", badgeIcon: "💻",
    bio: "Egresado UTP · Ing. de Sistemas. Full Stack Developer en Interbank y miembro RENACYT. Lidera automatización que impacta a +50,000 clientes.",
    journey: [
      { icon: "😰", label: "El problema", text: "9° ciclo con buen promedio pero sin experiencia real ni habilidades de entrevista." },
      { icon: "🎯", label: "Lo que hizo", text: "Realizó misiones de proyectos reales, acumuló XP y usó el simulador de entrevistas STAR." },
      { icon: "🏆", label: "El resultado", text: "Interbank lo contrató como Full Stack Dev. Hoy su proyecto impacta a más de 50,000 clientes." },
    ],
    tags: ["Proyectos reales", "Método STAR", "Match de vacantes"],
    stat: "4 meses",
    statLabel: "de la plataforma a su primer empleo",
  },
  {
    id: 3, name: "Diego Farfán", career: "Diseño Digital", age: 24, location: "Lima",
    company: "Startup Lima", role: "UX/UI Designer", result: "Portafolio verificado",
    photo: "https://images.unsplash.com/photo-1603764377193-75b991876878?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    badge: "RENACYT · Investigador", badgeIcon: "🎨",
    bio: "Egresado UTP · Diseño Digital. UX/UI Designer en startup con +10K usuarios activos. Investigador RENACYT en inclusión digital.",
    journey: [
      { icon: "😰", label: "El problema", text: "Proyectos universitarios buenos pero sin visibilidad. Ningún empleador los conocía." },
      { icon: "🎯", label: "Lo que hizo", text: "Convirtió sus proyectos en portafolio verificado por mentores y activó el match de vacantes." },
      { icon: "🏆", label: "El resultado", text: "Una startup lo contrató antes de graduarse. Su app hoy tiene más de 10,000 usuarios activos." },
    ],
    tags: ["Portafolio verificado", "Mentores expertos", "Match directo"],
    stat: "2 meses",
    statLabel: "de la plataforma a su primer empleo",
  },
];

const STEPS = [
  { n: "01", title: "Diagnóstico IA", desc: "Mapeamos tus competencias en 8 dimensiones y detectamos tus brechas frente al mercado laboral real.", icon: <Sparkles className="h-5 w-5" /> },
  { n: "02", title: "Ruta Personalizada", desc: "Plan gamificado con misiones, simulacros de entrevista y proyectos reales adaptados a tu carrera.", icon: <Target className="h-5 w-5" /> },
  { n: "03", title: "Portafolio Verificado", desc: "Proyectos completados generan badges avalados por mentores que los empleadores reconocen y confían.", icon: <Award className="h-5 w-5" /> },
  { n: "04", title: "Conexión Laboral", desc: "Accede a +20 empresas aliadas que contratan perfiles verificados UTP directamente desde la plataforma.", icon: <Briefcase className="h-5 w-5" /> },
];

const FEATURES = [
  { icon: <Sparkles className="h-6 w-6" />, title: "Diagnóstico IA", desc: "Escaneo inmediato de tu perfil. Identifica vacíos en código, metodologías ágiles y habilidades blandas." },
  { icon: <FileText className="h-6 w-6" />, title: "CV ATS Optimizer", desc: "Optimiza tu currículum para superar los filtros automáticos de las grandes empresas del Perú." },
  { icon: <Zap className="h-6 w-6" />, title: "Simulador de Entrevistas", desc: "Practica con escenarios reales. Feedback instantáneo con IA entrenada por reclutadores expertos." },
  { icon: <Target className="h-6 w-6" />, title: "Ruta STAR Gamificada", desc: "Misiones, XP y niveles que convierten tu desarrollo profesional en un juego que sí importa." },
  { icon: <Award className="h-6 w-6" />, title: "Portafolio Verificado", desc: "Credenciales avaladas por mentores reales. Diferénciate con evidencia, no con promesas." },
  { icon: <Shield className="h-6 w-6" />, title: "Match de Vacantes", desc: "Tu perfil verificado conecta directamente con empresas que ya confían en el sistema UTP." },
];

// ─── ANIMATED SECTION WRAPPER ──────────────────────────────────────────────
function Appear({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={className} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(32px)",
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ─── LOGO ──────────────────────────────────────────────────────────────────
function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" className="h-9 w-9 shrink-0">
        <g fill="none" stroke="#B50E30" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 40,210 C 40,160 80,160 80,130 L 80,105" />
          <path d="M 55,105 C 55,125 105,125 105,105" />
          <polygon points="80,45 135,65 80,85 25,65" fill={dark ? "#111" : "#fff"} strokeWidth="10" />
          <path d="M 108,75 L 120,85 C 122,88 122,95 120,98" strokeWidth="8" />
        </g>
        <circle cx="120" cy="102" r="7" fill="#B50E30" />
      </svg>
      <div>
        <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          className={`font-black text-[15px] uppercase tracking-tight leading-none ${dark ? "text-white" : "text-black"}`}>
          Ruta de <span className="text-[#B50E30]">Empleabilidad</span>
        </p>
        <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${dark ? "text-white/30" : "text-neutral-400"}`}>
          Plataforma de Crecimiento Profesional
        </p>
      </div>
    </div>
  );
}

// ─── STORIES SECTION (inline) ──────────────────────────────────────────────
function StoriesSection() {
  const [active, setActive] = useState(0);
  const s = STORIES[active];
  const { ref, inView } = useInView(0.1);
  const galleryRef = useRef<ImageGalleryHandle>(null);

  const handlePrev = () => {
    galleryRef.current?.prev();
    setActive((i) => (i - 1 + STORIES.length) % STORIES.length);
  };
  const handleNext = () => {
    galleryRef.current?.next();
    setActive((i) => (i + 1) % STORIES.length);
  };

  return (
    <section ref={ref} className="bg-white border-t border-neutral-100 py-24 px-6 overflow-hidden" id="historias">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)", transition: "all 0.6s ease" }}>
          <div>
            <p className="text-[#B50E30] text-[10px] font-black uppercase tracking-[0.22em] mb-2">Historias reales · Servicio de Empleabilidad</p>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              className="text-4xl md:text-5xl font-black uppercase text-black leading-none tracking-tight">
              Ellos ya<br /><span className="text-[#B50E30]">lo lograron.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handlePrev}
              className="h-11 w-11 rounded-full border-2 border-neutral-200 hover:border-[#B50E30] text-neutral-400 hover:text-[#B50E30] flex items-center justify-center transition-all cursor-pointer bg-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={handleNext}
              className="h-11 w-11 rounded-full bg-[#B50E30] hover:bg-[#85061B] text-white flex items-center justify-center transition-all cursor-pointer">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.15s" }}>

          {/* Circular image gallery */}
          <div className="relative w-full flex items-center justify-center overflow-hidden rounded-3xl" style={{ minHeight: "320px" }}>
            <ImageGallery ref={galleryRef} onActiveChange={(i) => setActive(i)} />
          </div>

          {/* Content right */}
          <div className="flex flex-col gap-3 py-1">

            {/* Name + badge header */}
            <div className="border-b border-neutral-100 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[#B50E30] text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">{s.career} · {s.age} años · {s.location}</p>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    className="text-xl font-black uppercase text-black tracking-tight leading-none">{s.name}</h3>
                  <p className="text-neutral-400 text-[11px] font-medium mt-0.5 leading-snug">{s.bio}</p>
                </div>
                <span className="shrink-0 border border-[#B50E30] text-[#B50E30] text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap">{s.badge}</span>
              </div>
            </div>

            {/* Big stat */}
            <div className="flex items-end gap-3 border-b border-neutral-100 pb-3">
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                className="text-4xl font-black text-black leading-none">{s.stat}</p>
              <div className="mb-1 space-y-0.5">
                <div className="h-px w-14 bg-[#B50E30]" />
                <p className="text-neutral-400 text-[10px] font-medium">{s.statLabel}</p>
              </div>
            </div>

            {/* Journey — numbered */}
            <div className="space-y-0">
              {s.journey.map((step, i) => (
                <div key={i} className="flex gap-3 py-2 border-b border-neutral-100 last:border-0">
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                    className="text-[10px] font-black text-neutral-300 shrink-0 mt-0.5 w-4">0{i + 1}</span>
                  <div>
                    <p className="text-[#B50E30] text-[8px] font-black uppercase tracking-widest mb-0.5">{step.label}</p>
                    <p className="text-neutral-600 text-[11px] font-medium leading-snug">{step.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tags + nav */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex flex-wrap gap-1">
                {s.tags.map((tag) => (
                  <span key={tag} className="bg-neutral-100 text-neutral-500 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {STORIES.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className="rounded-full transition-all duration-300 cursor-pointer"
                    style={{ width: i === active ? 20 : 7, height: 7, background: i === active ? "#B50E30" : "#e5e7eb" }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS COUNTER ─────────────────────────────────────────────────────────
function StatNum({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const { ref, inView } = useInView(0.3);
  const val = useCounter(target, 1600, inView);
  return (
    <span ref={ref as React.Ref<any>}>
      {prefix}{val}{suffix}
    </span>
  );
}

// ─── MODAL ─────────────────────────────────────────────────────────────────
function Modal({
  onClose,
  onStart: handleStart,
}: {
  onClose: () => void;
  onStart: (profileData: Partial<UserProfile>, isNewUser: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [emailErr, setEmailErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [toast, setToast] = useState<{msg: string; type: "success" | "info" | "error"} | null>(null);

  const isValidUtp = (e: string) => /^[a-zA-Z0-9._%+-]+@(utp\.edu\.pe|utp\.pe)$/i.test(e.trim());

  const handleSubmit = () => {
    let err = false;
    if (!email.trim()) { setEmailErr("El correo electrónico es obligatorio."); err = true; }
    else if (!isValidUtp(email)) { setEmailErr("Introduce un correo institucional válido (@utp.edu.pe o @utp.pe)"); err = true; }
    else setEmailErr("");
    if (!password) { setPwErr("La contraseña es obligatoria."); err = true; }
    else setPwErr("");
    if (err) return;
    setToast({ msg: "Verificando identidad en el servidor UTP...", type: "info" });
    setTimeout(() => {
      setToast({ msg: "Acceso Concedido. Redirigiendo a tu Ruta de Empleabilidad...", type: "success" });
      setTimeout(() => {
        handleStart({ name: "Estudiante UTP", career: "", semester: 1, targetRole: "" }, false);
        onClose();
      }, 1200);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
  };

  const clearErr = () => { setEmailErr(""); setPwErr(""); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: "modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <div className="h-1 bg-[#B50E30]" />
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 bg-neutral-100 hover:bg-neutral-200 rounded-full flex items-center justify-center text-neutral-500 hover:text-black transition cursor-pointer z-10">
          <X className="h-3.5 w-3.5" />
        </button>
        <div className="p-7 flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-default">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" className="h-9 w-9 shrink-0">
              <g fill="none" stroke="#B50E30" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 40,210 C 40,160 80,160 80,130 L 80,105" />
                <path d="M 55,105 C 55,125 105,125 105,105" />
                <polygon points="80,45 135,65 80,85 25,65" fill="#fff" strokeWidth="10" />
                <path d="M 108,75 L 120,85 C 122,88 122,95 120,98" strokeWidth="8" />
              </g>
              <circle cx="120" cy="102" r="7" fill="#B50E30" />
            </svg>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="font-black text-[15px] uppercase tracking-tight leading-none text-black">
              Ruta de <span className="text-[#B50E30]">Empleabilidad</span>
            </p>
          </div>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-[34px] sm:text-[40px] font-black tracking-tighter text-center leading-tight text-slate-900 mt-6">
            ¡Hola de nuevo!
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-2 tracking-wide uppercase">Portal de Acceso UTP</p>

          {/* Form */}
          <div className="w-full space-y-5 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 tracking-tight block">Correo electrónico institucional</label>
              <input type="email" autoFocus value={email} onChange={(e) => { setEmail(e.target.value); clearErr(); }} onKeyDown={handleKeyDown}
                className={`w-full px-3.5 py-3 bg-white border ${emailErr ? "border-rose-500" : "border-slate-300"} rounded-[4px] text-slate-900 text-base outline-none font-medium transition-colors`}
                placeholder="nombre@utp.edu.pe" />
              {emailErr && (
                <div className="text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{emailErr}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-900 tracking-tight">Contraseña institucional</label>
                <span className="text-xs font-semibold text-[#B50E30] hover:underline cursor-pointer">¿Olvidaste tu contraseña?</span>
              </div>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); clearErr(); }} onKeyDown={handleKeyDown}
                  className={`w-full pl-3.5 pr-11 py-3 bg-white border ${pwErr ? "border-rose-500" : "border-slate-300"} rounded-[4px] text-slate-900 text-base outline-none font-medium transition-colors`}
                  placeholder="Ingresa tu contraseña" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-950 transition-colors cursor-pointer">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {pwErr && (
                <div className="text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{pwErr}</span>
                </div>
              )}
            </div>

            <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg">
              <p className="text-xs text-slate-500 leading-normal flex gap-2">
                <ShieldAlert className="w-4 h-4 text-[#B50E30] shrink-0" />
                <span>Acceso exclusivo para estudiantes y docentes con cuentas de dominio <strong>@utp.edu.pe</strong> o <strong>@utp.pe</strong>.</span>
              </p>
            </div>

            <button onClick={handleSubmit}
              className="w-full bg-[#B50E30] hover:bg-[#85061B] text-white font-bold py-3.5 px-6 rounded-full transition-all duration-200 active:scale-95 text-base tracking-normal shadow-sm flex items-center justify-center gap-2 cursor-pointer border-0">
              <span>Iniciar Sesión</span>
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-4 left-4 right-4 z-20">
            <div className={`p-4 rounded-lg flex items-center gap-3 text-sm font-semibold shadow-xl border bg-white ${toast.type === "success" ? "border-emerald-100" : toast.type === "error" ? "border-rose-100" : "border-slate-200"}`}>
              {toast.type === "success" ? <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" /> : toast.type === "error" ? <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" /> : <Info className="w-5 h-5 text-[#B50E30] shrink-0" />}
              <span className="text-slate-800 flex-1">{toast.msg}</span>
              <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-900 cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
export default function LandingPage({ onStart, currentProfileName }: LandingPageProps) {
  const [modal, setModal] = useState(false);
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [videoOpen, setVideoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const openModal = useCallback((mode: "register" | "login") => {
    setAuthMode(mode);
    setModal(true);
  }, []);
  const close = useCallback(() => setModal(false), []);

  const { ref: statsRef, inView: statsInView } = useInView(0.3);

  return (
    <>
      {/* ── FONTS + GLOBAL ANIMATIONS ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * { box-sizing: border-box; }

        body, html {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .landing-page {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
        }

        .display {
          font-family: 'Bricolage Grotesque', system-ui, sans-serif;
        }

        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }

        @keyframes floatA {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(1deg); }
        }

        @keyframes floatB {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }

        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(181,14,48,0.4); }
          70%  { box-shadow: 0 0 0 10px rgba(181,14,48,0); }
          100% { box-shadow: 0 0 0 0 rgba(181,14,48,0); }
        }

        @keyframes shimmer {
          from { background-position: -200% 0; }
          to   { background-position: 200% 0; }
        }

        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes badgePop {
          0%   { opacity: 0; transform: scale(0.7) translateY(8px); }
          70%  { transform: scale(1.06) translateY(-2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        .hero-text-1 { animation: heroFade 0.8s ease 0.1s both; }
        .hero-text-2 { animation: heroFade 0.8s ease 0.25s both; }
        .hero-text-3 { animation: heroFade 0.8s ease 0.4s both; }
        .hero-cta    { animation: heroFade 0.8s ease 0.55s both; }
        .hero-stats  { animation: heroFade 0.8s ease 0.7s both; }
        .hero-card   { animation: heroFade 0.9s ease 0.3s both; }

        .float-a { animation: floatA 4s ease-in-out infinite; }
        .float-b { animation: floatB 3.2s ease-in-out infinite; }
        .float-c { animation: floatB 5s ease-in-out infinite 1s; }

        .badge-pop-1 { animation: badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.9s both; }
        .badge-pop-2 { animation: badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.1s both; }
        .badge-pop-3 { animation: badgePop 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.3s both; }

        .pulse-dot { animation: pulseRing 2s ease-in-out infinite; }

        .card-hover {
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(181,14,48,0.08);
          border-color: rgba(181,14,48,0.3);
        }

        .btn-primary {
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(181,14,48,0.35);
        }
        .btn-primary:active { transform: translateY(0); }

        .step-card {
          transition: transform 0.3s ease, background 0.3s ease;
        }
        .step-card:hover { transform: translateX(6px); background: #fafafa; }

        ::-webkit-scrollbar { width: 0; }

        @keyframes playPulse {
          0%   { box-shadow: 0 0 0 0 rgba(181,14,48,0.5); }
          70%  { box-shadow: 0 0 0 24px rgba(181,14,48,0); }
          100% { box-shadow: 0 0 0 0 rgba(181,14,48,0); }
        }
        .play-btn { animation: playPulse 2.2s ease-in-out infinite; }
        .play-btn:hover { transform: scale(1.1) !important; }
      `}</style>

      <div className="landing-page min-h-screen bg-white text-black">

        {/* ══ NAVBAR ══════════════════════════════════════════════════════ */}
        <header style={{ transition: "all 0.3s ease" }}
          className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100" : "bg-white border-b border-neutral-100"}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Logo />
            <nav className="hidden md:flex items-center gap-8" />
            <div className="flex items-center gap-3">
              <button onClick={() => openModal("login")} className="bg-[#B50E30] hover:bg-[#85061B] text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-xl cursor-pointer border-0 shadow-md shadow-[#B50E30]/20">
                Iniciar sesión
              </button>
            </div>
          </div>
        </header>

        {/* ══ HERO ════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 bg-white overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(181,14,48,0.07) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(181,14,48,0.05) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />
          {/* Dot grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(#000 1.5px, transparent 1.5px)", backgroundSize: "28px 28px" }} />

          <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT */}
            <div className="space-y-7">
              {/* Headline */}
              <div className="space-y-1">
                <h1 className="hero-text-1 display text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight text-black"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Tu primer
                </h1>
                <h1 className="hero-text-2 display text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight text-[#B50E30]"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  empleo
                </h1>
                <h1 className="hero-text-3 display text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight text-black"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  empieza aquí.
                </h1>
              </div>

              <p className="hero-text-2 text-neutral-500 text-base sm:text-lg font-medium leading-relaxed max-w-md">
                IA que diagnostica tus brechas, optimiza tu CV para filtros ATS y conecta tu perfil verificado con las mejores empresas del Perú.
              </p>

              {/* CTAs */}
              <div className="hero-cta flex flex-col sm:flex-row gap-3">
                <button onClick={() => openModal("register")}
                  className="btn-primary group bg-[#B50E30] text-white text-sm font-black uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer border-0 shadow-xl shadow-[#B50E30]/25">
                  Crea tu perfil gratis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a href="#historias"
                  className="group border-2 border-neutral-200 hover:border-neutral-400 text-black text-sm font-black uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
                  Ver historias
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                </a>
              </div>

              {/* Mini stats */}
              <div className="hero-stats flex items-center gap-8 pt-3 border-t border-neutral-100">
                {[{ val: "1,500+", label: "Estudiantes" }, { val: "92%", label: "Contratados" }, { val: "20+", label: "Empresas" }].map((s) => (
                  <div key={s.label}>
                    <p className="display text-2xl font-black text-black" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{s.val}</p>
                    <p className="text-neutral-400 text-[9px] font-bold uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Principal image */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(181,14,48,0.08) 0%, transparent 65%)", filter: "blur(40px)", transform: "scale(1.15)" }} />
              <img
                src={principalImg}
                alt="Ecosistema de Competencias Ruta de Empleabilidad"
                className="hero-card relative w-full h-auto object-contain"
                style={{
                  maxHeight: "1000px",
                  animation: "floatA 5s ease-in-out infinite",
                  filter: "drop-shadow(0 20px 40px rgba(181,14,48,0.12))",
                }}
              />
            </div>
          </div>

          {/* Scroll arrow */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-neutral-300">
            <span className="text-[9px] font-bold uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-4 w-4" style={{ animation: "floatB 1.8s ease-in-out infinite" }} />
          </div>
        </section>

        {/* ══ COMPANIES TICKER ════════════════════════════════════════════ */}
        <div className="border-y border-neutral-100 bg-neutral-50 py-5 overflow-hidden">
          <p className="text-center text-[9px] text-neutral-300 font-black uppercase tracking-[0.3em] mb-4">
            Empresas que confían en nuestros perfiles verificados
          </p>
          <div className="flex overflow-hidden">
            <div className="flex gap-14 items-center whitespace-nowrap" style={{ animation: "ticker 28s linear infinite" }}>
              {[...COMPANIES, ...COMPANIES].map((c, i) => (
                <span key={i} className="text-neutral-400 text-sm font-black uppercase tracking-widest hover:text-[#B50E30] transition-colors cursor-default shrink-0">{c}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ══ HOW IT WORKS ════════════════════════════════════════════════ */}
        <section className="py-28 px-6 relative overflow-hidden" style={{ background: "#FFF5F6", backgroundImage: "linear-gradient(to right, rgba(181,14,48,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(181,14,48,0.06) 1px, transparent 1px)", backgroundSize: "48px 48px" }}>
          <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Left sticky */}
            <div className="lg:sticky lg:top-28">
              <Appear>
                <p className="text-[#B50E30] text-[10px] font-black uppercase tracking-[0.22em] mb-3">Cómo funciona</p>
                <h2 className="display text-5xl font-black uppercase text-black tracking-tight leading-[0.95]"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  De estudiante<br />a empleable<br /><span className="text-[#B50E30]">en 4 pasos.</span>
                </h2>
                <p className="text-neutral-500 text-sm font-medium leading-relaxed max-w-sm mt-5 mb-8">
                  Metodología que combina IA, gamificación y verificación por mentores para resultados reales.
                </p>
                <button onClick={() => openModal("register")} className="btn-primary group bg-black hover:bg-[#B50E30] text-white text-xs font-black uppercase tracking-widest px-7 py-3.5 rounded-2xl flex items-center gap-2 cursor-pointer border-0 w-fit">
                  Comenzar ahora <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Appear>
            </div>

            {/* Right steps */}
            <div className="space-y-1 pt-2">
              {STEPS.map((step, i) => (
                <Appear key={step.n} delay={i * 80}>
                  <div className="step-card flex gap-5 py-7 px-4 -mx-4 rounded-2xl border border-transparent hover:border-neutral-100 cursor-default group">
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <div className="h-12 w-12 bg-neutral-100 group-hover:bg-[#B50E30] text-neutral-500 group-hover:text-white rounded-2xl flex items-center justify-center transition-all duration-300">
                        {step.icon}
                      </div>
                      {i < STEPS.length - 1 && <div className="w-px flex-1 bg-neutral-100 min-h-[20px]" />}
                    </div>
                    <div className="pt-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-300">{step.n}</span>
                      <h3 className="display text-xl font-black uppercase text-black tracking-tight mt-0.5 mb-1.5"
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{step.title}</h3>
                      <p className="text-neutral-500 text-sm font-medium leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </Appear>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STORIES ════════════════════════════════════════════════════ */}
        <StoriesSection />

        {/* ══ FEATURES BENTO ═════════════════════════════════════════════ */}
        <section className="border-t border-neutral-100 py-28 px-6" style={{ background: "#F7F8FA" }}>
          <div className="max-w-7xl mx-auto space-y-14">
            <Appear>
              <p className="text-[#B50E30] text-[10px] font-black uppercase tracking-[0.22em] mb-3">Herramientas incluidas</p>
              <h2 className="display text-5xl font-black uppercase text-black tracking-tight leading-[0.95]"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Todo lo que necesitas<br />para ser <span className="text-[#B50E30]">contratado.</span>
              </h2>
            </Appear>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((f, i) => (
                <Appear key={i} delay={i * 60}>
                  <div className="card-hover bg-white border border-neutral-200 rounded-2xl p-6 h-full group relative overflow-hidden cursor-default">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#B50E30] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />
                    <div className="h-12 w-12 bg-black group-hover:bg-[#B50E30] text-white rounded-2xl flex items-center justify-center mb-5 transition-all duration-300">
                      {f.icon}
                    </div>
                    <h3 className="display font-black text-base uppercase tracking-tight text-black mb-2"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>{f.title}</h3>
                    <p className="text-neutral-500 text-sm font-medium leading-relaxed">{f.desc}</p>
                  </div>
                </Appear>
              ))}
            </div>
          </div>
        </section>

        {/* ══ STATS RED BAND ═════════════════════════════════════════════ */}
        <section className="bg-[#B50E30] py-16 px-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div ref={statsRef as React.Ref<any>} className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center relative z-10">
            {[
              { target: 1500, suffix: "+", label: "Estudiantes activos" },
              { target: 92, suffix: "%", label: "Tasa de contratación" },
              { target: 3, suffix: " meses", label: "Tiempo promedio" },
              { target: 20, suffix: "+", label: "Empresas aliadas" },
            ].map((s) => (
              <div key={s.label}>
                <p className="display text-4xl sm:text-5xl font-black text-white leading-none"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  <StatNum target={s.target} suffix={s.suffix} />
                </p>
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-wider mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ══ VIDEO SECTION ══════════════════════════════════════════════ */}
        <section className="py-24 px-6 relative overflow-hidden" style={{ background: "#0D0D0D" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(181,14,48,0.12) 0%, transparent 65%)" }} />
          <div className="max-w-5xl mx-auto relative z-10">
            <Appear>
              <div className="text-center mb-10">
                <p className="text-[#B50E30] text-[10px] font-black uppercase tracking-[0.25em] mb-3">Mira cómo funciona</p>
                <h2 className="display text-4xl sm:text-5xl font-black uppercase text-white tracking-tight leading-[0.95]"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Ve la plataforma<br /><span className="text-[#B50E30]">en acción.</span>
                </h2>
              </div>

              {/* Video thumbnail */}
              <div
                className="relative rounded-3xl overflow-hidden cursor-pointer group"
                style={{ aspectRatio: "16/9" }}
                onClick={() => setVideoOpen(true)}
              >
                <img
                  src="https://img.youtube.com/vi/tpICKO8vUn8/maxresdefault.jpg"
                  alt="Ver video de Ruta de Empleabilidad"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

                {/* Red gradient bottom */}
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(181,14,48,0.3) 0%, transparent 50%)" }} />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="play-btn h-20 w-20 bg-[#B50E30] rounded-full flex items-center justify-center transition-transform duration-200"
                    style={{ animation: "playPulse 2.2s ease-in-out infinite" }}
                  >
                    <Play className="h-8 w-8 text-white fill-white ml-1" />
                  </div>
                </div>

                {/* Bottom label */}
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#B50E30] rounded-full animate-pulse" />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">Haz clic para reproducir</span>
                </div>
              </div>
            </Appear>
          </div>

          {/* Video lightbox */}
          {videoOpen && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
              onClick={() => setVideoOpen(false)}>
              <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}
                style={{ animation: "modalIn 0.3s ease" }}>
                <button
                  onClick={() => setVideoOpen(false)}
                  className="absolute -top-12 right-0 h-9 w-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition cursor-pointer z-10"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src="https://www.youtube.com/embed/tpICKO8vUn8?autoplay=1&rel=0"
                    title="Ruta de Empleabilidad"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                    style={{ border: "none" }}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ══ CTA FINAL ══════════════════════════════════════════════════ */}
        <section className="border-t border-neutral-100 py-32 px-6 relative overflow-hidden" style={{ background: "#F7F8FA" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(181,14,48,0.07) 0%, transparent 65%)" }} />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Appear>
              <p className="text-[#B50E30] text-[10px] font-black uppercase tracking-[0.25em] mb-5">¿Listo para empezar?</p>
              <h2 className="display text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-[0.9] text-black mb-6"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                Construye tu<br /><span className="text-[#B50E30]">futuro</span> hoy.
              </h2>
              <p className="text-neutral-500 text-base font-medium max-w-md mx-auto leading-relaxed mb-10">
                Únete a los estudiantes UTP que consiguen empleo antes de graduarse. Gratis, real, verificado.
              </p>
              <button onClick={() => openModal("register")}
                className="btn-primary group bg-[#B50E30] text-white text-sm font-black uppercase tracking-widest px-12 py-5 rounded-2xl inline-flex items-center gap-3 cursor-pointer border-0 shadow-2xl shadow-[#B50E30]/25">
                Crea tu cuenta gratis
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-neutral-300 text-[10px] font-bold uppercase tracking-widest mt-5">
                Sin costo · Solo correo UTP
              </p>
            </Appear>
          </div>
        </section>

        {/* ══ FOOTER ═════════════════════════════════════════════════════ */}
        <footer className="bg-[#111111] text-white py-16 px-6 border-t border-neutral-800">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" className="h-9 w-9 shrink-0">
                    <g fill="none" stroke="#B50E30" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M 40,210 C 40,160 80,160 80,130 L 80,105" />
                      <path d="M 55,105 C 55,125 105,125 105,105" />
                      <polygon points="80,45 135,65 80,85 25,65" fill="#FFFFFF" strokeWidth="10" />
                      <path d="M 108,75 L 120,85 C 122,88 122,95 120,98" strokeWidth="8" />
                    </g>
                    <circle cx="120" cy="102" r="7" fill="#B50E30" />
                  </svg>
                  <span className="font-bold text-lg tracking-tight">Ruta de Empleabilidad</span>
                </div>
                <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                  Mentor digital de empleabilidad impulsado por IA. Transformamos estudiantes universitarios en candidatos competitivos.
                </p>
                <div className="flex gap-3">
                  <Instagram className="w-6 h-6 text-neutral-500 hover:text-white cursor-pointer transition" />
                  <Linkedin className="w-6 h-6 text-neutral-500 hover:text-white cursor-pointer transition" />
                  <MessageCircle className="w-6 h-6 text-neutral-500 hover:text-white cursor-pointer transition" />
                  <Mail className="w-6 h-6 text-neutral-500 hover:text-white cursor-pointer transition" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Producto</h4>
                <ul className="space-y-3 text-neutral-400 text-sm cursor-pointer">
                  <li className="hover:text-white transition">Diagnóstico de perfil</li>
                  <li className="hover:text-white transition">Ruta personalizada</li>
                  <li className="hover:text-white transition">CV Analyzer</li>
                  <li className="hover:text-white transition">Simulador de entrevistas</li>
                  <li className="hover:text-white transition">Match de vacantes</li>
                  <li className="hover:text-white transition">Comunidad</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Empresa</h4>
                <ul className="space-y-3 text-neutral-400 text-sm cursor-pointer">
                  <li className="hover:text-white transition">Sobre Ruta de Empleabilidad</li>
                  <li className="hover:text-white transition">Blog</li>
                  <li className="hover:text-white transition">Eventos</li>
                  <li className="hover:text-white transition">Para empresas</li>
                  <li className="hover:text-white transition">Contacto</li>
                  <li className="hover:text-white transition">Prensa</li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Legal</h4>
                <ul className="space-y-3 text-neutral-400 text-sm cursor-pointer">
                  <li className="hover:text-white transition">Términos y condiciones</li>
                  <li className="hover:text-white transition">Política de privacidad</li>
                  <li className="hover:text-white transition">Cookies</li>
                  <li className="hover:text-white transition">Ayuda</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
              <p>© 2026 Ruta de Empleabilidad. Hackathon UTP + Xpedition.</p>
              <p>Creado para transformar la empleabilidad estudiantil.</p>
            </div>
          </div>
        </footer>

        {/* ══ MODAL ══════════════════════════════════════════════════════ */}
        {modal && (
          <Modal
            onClose={close}
            onStart={onStart}
          />
        )}

      </div>
    </>
  );
}