
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  ArrowRight, X, Instagram, Linkedin, MessageCircle, Mail,
  ChevronDown, Play,
  Eye, EyeOff, ShieldAlert, ShieldCheck, CheckCircle, AlertTriangle, Info, Heart
} from "lucide-react";
import principalImg from "./assets/Imagen-landingPage.png";
import sofiaImg from "./assets/Sofia.jpeg";
import juanImg from "./assets/Juan.jpeg";
import { ImageGallery, ImageGalleryHandle } from "./ui/carousel-circular-image-gallery";
import { UserProfile } from "../types";
import { findStudentByCode, MockStudent } from "../mockStudents";

// ─── TYPES ─────────────────────────────────────────────────────────────────
interface LandingPageProps {
  onStart: (profileData: Partial<UserProfile>, isNewUser: boolean, hasCv?: boolean, student?: MockStudent) => void;
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

const STORY_CARDS = [
  {
    id: 1,
    name: "Juan Carlos Chávez Pérez",
    roleTag: "Estudiante de Ingeniería de Sistemas e Informática UTP Chimbote",
    achievementLines: ["Investigador", "Renacyt Nivel", "VII"],
    description:
      "Mientras aún era estudiante, se convirtió en Investigador RENACYT, un logro que pocos alcanzan tan temprano. Su historia demuestra que la investigación, la disciplina y la pasión pueden abrir puertas increíbles desde la universidad.",
    quote: "La constancia de hoy, es el logro de mañana.",
    photo: juanImg,
    accent: "#B50E30",
    accentLight: "#FDF2F4",
  },
  {
    id: 2,
    name: "Sofía Flores Davelouis",
    roleTag: "Egresada de Ingeniería Industrial UTP Chimbote",
    achievementLines: ["Logró su", "Primer gran", "paso", "Profesional"],
    description:
      "Destacó por su excelencia académica, obtuvo la Beca de Excelencia y participó en el programa Generación Top, fortaleciendo sus competencias con el apoyo del servicio de Empleabilidad UTP. Al egresar, ingresó a laborar en Pesquera Austral Group S.A.A. en el área de Logística.",
    quote: "Prepárate hoy, el mundo necesita tu talento.",
    photo: sofiaImg,
    accent: "#155434",
    accentLight: "#EEF6F1",
  },
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
        <p
          className={`font-black text-[15px] uppercase tracking-tight leading-none ${dark ? "text-white" : "text-black"}`}>
          Despega <span className="text-[#B50E30]">UTP</span>
        </p>
        <p className={`text-[9px] font-bold uppercase tracking-widest mt-0.5 ${dark ? "text-white/30" : "text-neutral-400"}`}>
         Tu ruta de empleabilidad
        </p>
      </div>
    </div>
  );
}

// ─── STORIES SECTION (inline) ──────────────────────────────────────────────
function TitleDecorator() {
  return (
    <div className="mb-3 flex items-center justify-center gap-3">
      <span className="h-0.5 w-10 rounded-full bg-[#B50E30]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#B50E30]" />
      <span className="h-0.5 w-10 rounded-full bg-[#B50E30]" />
    </div>
  );
}

function AchievementBadge({ lines, color }: { lines: readonly string[]; color: string }) {
  return (
    <div className="relative flex h-[104px] w-[104px] shrink-0 items-center justify-center sm:h-[112px] sm:w-[112px]">
      <svg viewBox="0 0 112 112" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
        <path
          d="M34 78 C24 66 20 50 26 36 C30 26 36 18 42 12"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M78 78 C88 66 92 50 86 36 C82 26 76 18 70 12"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M28 58 C22 48 20 38 24 28 M84 58 C90 48 92 38 88 28"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M46 18 L56 8 L66 18"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M34 86 Q56 98 78 86"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <div className="relative z-10 flex max-w-[72px] flex-col items-center justify-center rounded-md bg-white/90 px-1 py-0.5 text-center">
        {lines.map((line) => (
          <span
            key={line}
            className="block text-[8px] font-black uppercase leading-[1.2] tracking-wide sm:text-[9px]"
            style={{ color }}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

function StoryCard({ story }: { story: (typeof STORY_CARDS)[number] }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
      <div className="flex flex-1 flex-col gap-5 p-6 sm:flex-row sm:items-start sm:gap-5 sm:p-7">
        <div className="relative mx-auto h-44 w-32 shrink-0 sm:mx-0 sm:h-48 sm:w-36">
          <div
            className="absolute bottom-2 left-1/2 h-[7.5rem] w-[7.5rem] -translate-x-1/2 rounded-full sm:h-[8.5rem] sm:w-[8.5rem]"
            style={{ backgroundColor: story.accent }}
          />
          <img
            src={story.photo}
            alt={story.name}
            className="relative z-10 h-full w-full object-contain object-bottom"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-start justify-between gap-4">
            <h3 className="min-w-0 flex-1 text-base font-black uppercase leading-tight tracking-tight text-black sm:text-lg">
              {story.name}
            </h3>
            <AchievementBadge lines={story.achievementLines} color={story.accent} />
          </div>

          <span
            className="mb-4 inline-block rounded-full px-3.5 py-2 text-[10px] font-bold uppercase leading-snug tracking-wide text-white sm:text-[11px]"
            style={{ backgroundColor: story.accent }}
          >
            {story.roleTag}
          </span>

          <p className="font-sans text-sm font-normal leading-relaxed text-[#4B5563] sm:text-[15px]">{story.description}</p>
        </div>
      </div>

      <div
        className="flex items-center gap-3 px-6 py-3.5 sm:px-7"
        style={{ backgroundColor: story.accentLight }}
      >
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
          style={{ backgroundColor: story.accent }}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
        <p className="text-xs font-semibold leading-snug text-neutral-800 sm:text-sm">{story.quote}</p>
      </div>
    </article>
  );
}

function StoriesSection({ onCtaClick }: { onCtaClick?: () => void }) {
  const { ref, inView } = useInView(0.1);

  return (
    <section
      ref={ref}
      id="historias"
      className="relative overflow-hidden px-6 py-16 md:py-20"
      style={{
        background: "#FFF5F6",
        backgroundImage:
          "linear-gradient(to right, rgba(181,14,48,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(181,14,48,0.06) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-8 text-center"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)", transition: "all 0.6s ease" }}
        >
          <TitleDecorator />
          <h2 className="text-2xl font-black uppercase leading-tight tracking-tight text-black sm:text-3xl md:text-[2rem]">
            Historias que <span className="text-[#B50E30]">inspiran</span>, metas que se cumplen
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm font-medium text-neutral-700 md:text-[15px]">
            Estudiantes UTP que están construyendo su futuro desde hoy.
          </p>
        </div>

        <div
          className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.15s" }}
        >
          {STORY_CARDS.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>

        <div
          className="flex flex-col items-stretch gap-5 rounded-3xl bg-[#B50E30] px-6 py-6 text-white md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 md:py-7"
          style={{ opacity: inView ? 1 : 0, transition: "opacity 0.8s ease 0.25s" }}
        >
          <div className="flex items-center gap-3 md:min-w-0 md:flex-1">
            <Heart className="h-5 w-5 shrink-0 fill-white text-white" />
            <p className="text-sm font-black uppercase leading-snug tracking-wide md:text-base">
              En UTP, tu éxito es nuestra misión
            </p>
          </div>

          <div className="hidden h-10 w-px shrink-0 bg-white/30 md:block" />

          <p className="text-sm font-medium leading-relaxed text-white/90 md:max-w-xs md:flex-1 lg:max-w-md">
            Te acompañamos en cada paso para que conviertas tus sueños en logros reales.
          </p>

          <button
            type="button"
            onClick={onCtaClick}
            className="shrink-0 rounded-full bg-white px-6 py-2.5 text-xs font-black uppercase tracking-widest text-black transition-colors hover:bg-neutral-100 cursor-pointer border-0"
          >
            Conoce más
          </button>
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
  onStart: (profileData: Partial<UserProfile>, isNewUser: boolean, hasCv?: boolean, student?: MockStudent) => void;
}) {
  const [studentCode, setStudentCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [codeErr, setCodeErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [toast, setToast] = useState<{msg: string; type: "success" | "info" | "error"} | null>(null);

  const handleSubmit = () => {
    let err = false;
    const student = findStudentByCode(studentCode);
    if (!studentCode.trim()) {
      setCodeErr("El código de estudiante es obligatorio.");
      err = true;
    } else if (!student) {
      setCodeErr("Código no encontrado. Prueba U22223419, U20198765 o U20245678.");
      err = true;
    } else setCodeErr("");
    if (!password) { setPwErr("La contraseña es obligatoria."); err = true; }
    else setPwErr("");
    if (err || !student) return;
    setToast({ msg: "Recuperando datos académicos desde el sistema UTP...", type: "info" });
    setTimeout(() => {
      setToast({ msg: "Acceso concedido. Redirigiendo...", type: "success" });
      setTimeout(() => {
        const isNew = localStorage.getItem("sp_diagnosis_completed") !== "true";
        const defaultEmail = `${student.code}@utp.edu.pe`;
        handleStart(
          {
            name: student.name,
            career: student.career,
            semester: student.semester,
            targetRole: student.targetRole || "",
            email: student.email || defaultEmail,
            phone: student.phone || "",
            linkedin: student.linkedin || "",
            github: student.github || "",
          },
          isNew,
          student.hasCv,
          student
        );
        onClose();
      }, 1200);
    }, 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSubmit(); }
  };

  const clearErr = () => { setCodeErr(""); setPwErr(""); };

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
            <p className="font-black text-[15px] uppercase tracking-tight leading-none text-black">
              Ruta de <span className="text-[#B50E30]">Empleabilidad</span>
            </p>
          </div>
          <h1 className="text-[34px] sm:text-[40px] font-black tracking-tighter text-center leading-tight text-slate-900 mt-6">
            Accede con tu código UTP
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-2 tracking-wide uppercase">Recuperaremos tu nombre, carrera y ciclo automáticamente</p>

          {/* Form */}
          <div className="w-full space-y-5 mt-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900 tracking-tight block">Código o correo UTP</label>
              <input type="text" autoFocus value={studentCode} onChange={(e) => { setStudentCode(e.target.value); clearErr(); }} onKeyDown={handleKeyDown}
                className={`w-full px-3.5 py-3 bg-white border ${codeErr ? "border-rose-500" : "border-slate-300"} rounded-[4px] text-slate-900 text-base outline-none font-medium transition-colors`}
                placeholder="Ej. U22223419 o U22223419@utp.edu.pe" />
              {codeErr && (
                <div className="text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{codeErr}</span>
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
                <span>Usa tu <strong>código UTP</strong> o correo institucional (ej. U20198765@utp.edu.pe). El sistema cargará tu nombre, carrera y ciclo académico.</span>
              </p>
            </div>

            <button type="button" onClick={handleSubmit}
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
      {/* ── GLOBAL ANIMATIONS ── */}
      <style>{`
        * { box-sizing: border-box; }

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

        .btn-primary {
          transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(181,14,48,0.35);
        }
        .btn-primary:active { transform: translateY(0); }

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
          className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 sm:py-4 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-100" : "bg-white border-b border-neutral-100"}`}>
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
        <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 bg-cover overflow-hidden"
          style={{ backgroundImage: `url(${principalImg})`, backgroundPosition: "center center" }}>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-black/65 pointer-events-none" />
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(181,14,48,0.15) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(181,14,48,0.12) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }} />

          <div className="max-w-7xl mx-auto w-full relative z-10">

            <div className="space-y-7 max-w-2xl">
              {/* Headline */}
              <div className="space-y-1">
                <h1 className="hero-text-1 display text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight text-white"
                 >
                  Tu futuro
                </h1>
                <h1 className="hero-text-2 display text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight text-[#B50E30]"
                 >
                  comienza
                </h1>
                <h1 className="hero-text-3 display text-6xl sm:text-7xl md:text-8xl font-black uppercase leading-[0.9] tracking-tight text-white"
                 >
                  ahora.
                </h1>
              </div>

              <p className="hero-text-2 text-neutral-500 text-base sm:text-lg font-medium leading-relaxed max-w-md">
              Diagnostica tus brechas, optimiza tu CV para pasar filtros y conecta tu perfil verificado con las mejores empresas del Perú.
              </p>

              {/* CTAs */}
              <div className="hero-cta flex flex-col sm:flex-row gap-3">
                <button onClick={() => openModal("register")}
                  className="btn-primary group bg-[#B50E30] text-white text-sm font-black uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-3 cursor-pointer border-0 shadow-xl shadow-[#B50E30]/25">
                  Crea tu perfil gratis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
                <a href="#historias"
                  className="group border-2 border-white/30 hover:border-white text-white text-sm font-black uppercase tracking-widest px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
                  Ver historias
                  <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-1" />
                </a>
              </div>

              {/* Mini stats */}
              <div className="hero-stats flex items-center gap-8 pt-3 border-t border-white/20">
                {[{ val: "1,500+", label: "Estudiantes" }, { val: "92%", label: "Contratados" }, { val: "20+", label: "Empresas" }].map((s) => (
                  <div key={s.label}>
                    <p className="text-2xl font-black text-white">{s.val}</p>
                    <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Scroll arrow */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50">
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

        {/* ══ STORIES ════════════════════════════════════════════════════ */}
        <StoriesSection onCtaClick={() => openModal("register")} />

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
                <p className="text-4xl sm:text-5xl font-black text-white leading-none"
                 >
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
                <h2 className="text-4xl sm:text-5xl font-black uppercase text-white tracking-tight leading-[0.95]"
                 >
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
              <h2 className="text-6xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight leading-[0.9] text-black mb-6"
               >
                Construye tu<br /><span className="text-[#B50E30]">futuro</span> hoy.
              </h2>
              <p className="text-neutral-500 text-base font-medium max-w-md mx-auto leading-relaxed mb-10">
                Únete a los estudiantes UTP que consiguen empleo antes de graduarse. Gratis, real, verificado.
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