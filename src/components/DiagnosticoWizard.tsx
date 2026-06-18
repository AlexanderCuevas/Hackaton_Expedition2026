import React, { useCallback, useRef, useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { UserProfile, CvMeta, CvExperiencia } from "../types";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  ChevronDown,
  X,
  Plus,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Sparkles,
  Loader2,
  ScrollText,
  Shield,
  Brain,
  Target,
  TrendingUp,
  Mountain,
  Briefcase,
  GraduationCap,
  Circle,
  ChevronUp,
  Code2,
  Users,
  ClipboardCheck,
  CheckCircle2,
  LineChart,
  Settings2,
  Linkedin,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import UvpIcon from "./ui/UvpIcon";
import { Logo } from "./ui/logo";
import {
  extractTextFromPdf,
  buildHarvardCvText,
  extractProfileHintsFromCv,
} from "../utils/cvParser";
import {
  CAREER_TYPICAL_SKILLS,
  CAREER_SPECIALIZATION_TAGS,
  GENERIC_SOFT_SKILLS,
} from "../data";
import { getCvMockData } from "../cvMockData";
import cargarcvImg from "./assets/cargarcv.png";
import KairosGuide, { getKairosWizardCards } from "./ui/KairosGuide";

const MONTHS = [
  { v: "01", l: "Enero" }, { v: "02", l: "Febrero" }, { v: "03", l: "Marzo" },
  { v: "04", l: "Abril" }, { v: "05", l: "Mayo" }, { v: "06", l: "Junio" },
  { v: "07", l: "Julio" }, { v: "08", l: "Agosto" }, { v: "09", l: "Setiembre" },
  { v: "10", l: "Octubre" }, { v: "11", l: "Noviembre" }, { v: "12", l: "Diciembre" },
];
const YEARS = Array.from({ length: 21 }, (_, i) => String(2015 + i));

function CvUploadIllustration() {
  return (
    <div className="hidden md:flex shrink-0 w-[140px] lg:w-[170px] items-center justify-center" aria-hidden>
      <img
        src={cargarcvImg}
        alt=""
        className="w-full h-auto object-contain drop-shadow-sm select-none"
        draggable={false}
      />
    </div>
  );
}

function CvUploadBenefitsPanel() {
  const items = [
    {
      icon: Brain,
      title: "Análisis inteligente",
      desc: "Nuestra IA identifica tus habilidades, experiencia y fortalezas.",
    },
    {
      icon: Target,
      title: "Mejores oportunidades",
      desc: "Te conectamos con vacantes que realmente se ajustan a tu perfil.",
    },
    {
      icon: TrendingUp,
      title: "Crecimiento continuo",
      desc: "Recibe recomendaciones personalizadas para seguir mejorando.",
    },
  ];

  return (
    <aside className="bg-neutral-950 border border-neutral-800 rounded-2xl p-5 flex flex-col gap-4">
      <h3 className="text-sm font-black text-white uppercase tracking-wide flex items-center gap-2">
        <span className="w-1 h-4 bg-[#B50E30] rounded-full shrink-0" />
        ¿Por qué subir tu CV?
      </h3>
      <ul className="space-y-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <li key={title} className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-full bg-[#B50E30] flex items-center justify-center">
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">{title}</p>
              <p className="text-[11px] text-white leading-relaxed mt-0.5">{desc}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-3 border-t border-neutral-800 relative overflow-hidden rounded-lg">
        <p className="text-[11px] font-semibold text-white leading-relaxed pr-8">
          Cada paso te acerca a tu mejor versión profesional.
        </p>
        <Mountain className="absolute -right-1 bottom-0 h-10 w-10 text-white/15" aria-hidden />
      </div>
    </aside>
  );
}

function ContactFields({
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  contactLinkedin,
  setContactLinkedin,
}: {
  contactEmail: string;
  setContactEmail: (v: string) => void;
  contactPhone: string;
  setContactPhone: (v: string) => void;
  contactLinkedin: string;
  setContactLinkedin: (v: string) => void;
}) {
  return (
    <div className="bg-white border-2 border-neutral-200 rounded-xl p-4 sm:p-5 space-y-3">
      <h3 className="text-base font-black text-black flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#B50E30] shrink-0">
          <Mail className="h-4 w-4 text-white" />
        </span>
        Información de contacto
      </h3>
      <p className="text-xs text-neutral-500 leading-relaxed">
        Tus datos de contacto. El correo se completa automáticamente con tu código UTP.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email *</label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="ejemplo@utp.edu.pe"
            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-[#B50E30] focus:ring-1 focus:ring-[#B50E30]/30"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
            <Phone className="h-3 w-3 text-neutral-400" />
            Teléfono
          </label>
          <input
            type="tel"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+51 999 888 777"
            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-[#B50E30] focus:ring-1 focus:ring-[#B50E30]/30"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            LinkedIn <span className="text-neutral-300 font-normal">(opcional)</span>
          </label>
          <input
            type="url"
            value={contactLinkedin}
            onChange={(e) => setContactLinkedin(e.target.value)}
            placeholder="linkedin.com/in/tuperfil"
            className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-[#B50E30] focus:ring-1 focus:ring-[#B50E30]/30"
          />
        </div>
      </div>
    </div>
  );
}

function MySelect({ value, onChange, label }: {
  value: string; onChange: (v: string) => void; label: string;
}) {
  const [year, month] = value ? value.split("-") : ["", ""];
  const setMonth = (m: string) => {
    if (!m) onChange("");
    else if (year) onChange(`${year}-${m}`);
    else onChange(`-${m}`);
  };
  const setYear = (y: string) => {
    if (!y) onChange("");
    else if (month) onChange(`${y}-${month}`);
    else onChange(`${y}-`);
  };
  return (
    <div className="flex gap-2">
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="flex-1 mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30] bg-white"
      >
        <option value="">Mes</option>
        {MONTHS.map((m) => (
          <option key={m.v} value={m.v}>{m.l}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="flex-1 mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30] bg-white"
      >
        <option value="">Año</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <span className="sr-only">{label}</span>
    </div>
  );
}

interface DiagnosticoWizardProps {
  currentProfile: UserProfile;
  onComplete: (profile: UserProfile, cvText: string, cvMeta: CvMeta) => void;
  studentCode?: string;
}

const TOTAL_STEPS = 5;

const EXPERIENCE_OPTIONS = [
  {
    id: "primer-empleo",
    title: "Mi primer empleo",
    description: "Estoy buscando mi primera oportunidad laboral. Sin experiencia previa.",
    icon: Circle,
  },
  {
    id: "practicas-pre",
    title: "Prácticas pre-profesionales",
    description: "Tengo experiencia en proyectos académicos o voluntariados y busco prácticas.",
    icon: GraduationCap,
  },
  {
    id: "profesionales",
    title: "Experiencia profesional",
    description: "Ya tengo experiencia laboral formal o prácticas profesionales completadas.",
    icon: Briefcase,
  },
] as const;

const EXPERIENCE_BARS = [
  { height: "h-[52px] sm:h-[64px]" },
  { height: "h-[76px] sm:h-[92px]" },
  { height: "h-[100px] sm:h-[120px]" },
  { height: "h-[124px] sm:h-[148px]" },
] as const;

const EXPERIENCE_LEVEL_BAR: Record<string, number> = {
  "primer-empleo": 0,
  "practicas-pre": 1,
  "profesionales": 3,
};

const EXPERIENCE_SUMMARY: Record<string, { short: string; sub: string }> = {
  "primer-empleo": { short: "Primer empleo", sub: "Buscando 1ra oportunidad" },
  "practicas-pre": { short: "Prácticas pre-prof.", sub: "Proyectos académicos o voluntariado" },
  "profesionales": { short: "Experiencia profesional", sub: "Trayectoria laboral formal" },
};

function formatLinkedinDisplay(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  const match = trimmed.match(/linkedin\.com(\/in\/[^/?#]+)/i);
  if (match) return match[1];
  return trimmed.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

function ExperienceStairsIllustration({ experienceLevel }: { experienceLevel: string }) {
  const activeIndex =
    experienceLevel in EXPERIENCE_LEVEL_BAR ? EXPERIENCE_LEVEL_BAR[experienceLevel] : null;
  const pinIndex = activeIndex ?? 3;

  return (
    <div className="flex-1 flex w-full mt-6 lg:mt-8 min-h-[200px] sm:min-h-[240px]" aria-hidden>
      <div className="flex-1 flex items-center justify-center rounded-2xl bg-neutral-50 border border-neutral-100 px-4 py-10 sm:px-8 sm:py-12">
        <div className="flex items-end justify-center gap-3 sm:gap-5 md:gap-6">
          {EXPERIENCE_BARS.map((bar, index) => {
            const isFilled = activeIndex !== null && index <= activeIndex;
            const isCurrent = index === pinIndex;

            return (
              <div key={index} className="flex flex-col items-center">
                <div className="mb-2 sm:mb-3 h-8 sm:h-9 w-8 sm:w-9 flex items-center justify-center">
                  {pinIndex === index && (
                    <motion.div
                      layoutId="experience-pin"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B50E30] flex items-center justify-center shadow-[0_4px_12px_rgba(181,14,48,0.35)]"
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                    >
                      <motion.div
                        animate={{ y: isCurrent && activeIndex !== null ? [0, -3, 0] : 0 }}
                        transition={
                          isCurrent && activeIndex !== null
                            ? { duration: 0.5, ease: "easeOut" }
                            : { duration: 0 }
                        }
                      >
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-white stroke-[3]" />
                      </motion.div>
                    </motion.div>
                  )}
                </div>
                <motion.div
                  className={`w-12 sm:w-16 md:w-[72px] lg:w-20 rounded-2xl origin-bottom ${bar.height}`}
                  initial={false}
                  animate={{
                    backgroundColor: isFilled ? "#B50E30" : "#D4D4D4",
                    scaleY: isCurrent && activeIndex !== null ? 1.06 : 1,
                    scaleX: isCurrent && activeIndex !== null ? 1.04 : 1,
                    boxShadow: isFilled
                      ? "0 8px 20px rgba(181, 14, 48, 0.25)"
                      : "0 0 0 rgba(0,0,0,0)",
                  }}
                  transition={{
                    backgroundColor: { duration: 0.35, delay: isFilled ? index * 0.1 : 0 },
                    scaleY: { type: "spring", stiffness: 320, damping: 22 },
                    scaleX: { type: "spring", stiffness: 320, damping: 22 },
                    boxShadow: { duration: 0.3, delay: isFilled ? index * 0.1 : 0 },
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GoalsTargetIllustration({ specializationCount }: { specializationCount: number }) {
  const prevCountRef = useRef(specializationCount);
  const [shotKey, setShotKey] = useState(0);
  const [isHitting, setIsHitting] = useState(false);

  useEffect(() => {
    if (specializationCount > prevCountRef.current) {
      setShotKey((k) => k + 1);
      setIsHitting(true);
      const timer = window.setTimeout(() => setIsHitting(false), 720);
      prevCountRef.current = specializationCount;
      return () => window.clearTimeout(timer);
    }
    prevCountRef.current = specializationCount;
  }, [specializationCount]);

  const activeMarker =
    specializationCount > 0 ? (specializationCount - 1) % 4 : -1;

  const markers = [
    { x: 93, y: 10, w: 14, h: 22 },
    { x: 168, y: 93, w: 22, h: 14 },
    { x: 93, y: 168, w: 14, h: 22 },
    { x: 10, y: 93, w: 22, h: 14 },
  ];

  return (
    <div
      className="flex-1 flex w-full mt-6 lg:mt-8 min-h-[180px] sm:min-h-[220px] items-center justify-center"
      aria-hidden
    >
      <motion.div
        className="relative w-[70%] max-w-[220px] sm:max-w-[260px] aspect-square"
        animate={
          isHitting
            ? { x: [0, -3, 3, -2, 2, 0], y: [0, 2, -2, 1, 0] }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
          <circle cx="100" cy="100" r="78" stroke="#E8E8E8" strokeWidth="14" />
          <circle cx="100" cy="100" r="48" stroke="#E8E8E8" strokeWidth="12" />
          <motion.circle
            cx="100"
            cy="100"
            r="20"
            animate={{
              fill: isHitting ? "#B50E30" : specializationCount > 0 ? "#D4D4D4" : "#E8E8E8",
              scale: isHitting ? [1, 1.35, 1] : 1,
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{ transformOrigin: "100px 100px" }}
          />
          {markers.map((m, i) => (
            <motion.rect
              key={i}
              x={m.x}
              y={m.y}
              width={m.w}
              height={m.h}
              rx={4}
              fill="#B50E30"
              animate={{
                scale: isHitting && activeMarker === i ? [1, 1.4, 1] : 1,
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ transformOrigin: `${m.x + m.w / 2}px ${m.y + m.h / 2}px` }}
            />
          ))}
        </svg>

        <AnimatePresence>
          {isHitting && (
            <motion.div
              key={`shot-${shotKey}`}
              className="absolute inset-0 pointer-events-none overflow-visible"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <motion.div
                className="absolute left-1/2 top-1/2 z-10"
                initial={{
                  x: "-155%",
                  y: "115%",
                  opacity: 0,
                  rotate: -38,
                  scale: 0.55,
                }}
                animate={{
                  x: ["-155%", "-50%"],
                  y: ["115%", "-50%"],
                  opacity: [0, 1, 1],
                  rotate: -38,
                  scale: [0.55, 1, 0.92],
                }}
                transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              >
                <svg width="52" height="14" viewBox="0 0 52 14" fill="none" aria-hidden>
                  <line x1="2" y1="7" x2="38" y2="7" stroke="#B50E30" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M38 7 L32 3 M38 7 L32 11" stroke="#B50E30" strokeWidth="2" strokeLinecap="round" />
                  <path d="M40 7 L50 7 L40 2 Z" fill="#B50E30" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#B50E30]"
                initial={{ width: 18, height: 18, opacity: 0.85 }}
                animate={{ width: 110, height: 110, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.28, ease: "easeOut" }}
              />
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B50E30]/20"
                initial={{ width: 10, height: 10, opacity: 0.9 }}
                animate={{ width: 44, height: 44, opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {specializationCount > 0 && !isHitting && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 22 }}
          >
            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" aria-hidden>
              <line x1="0" y1="5" x2="18" y2="5" stroke="#85061B" strokeWidth="2" strokeLinecap="round" />
              <path d="M18 5 L14 2 M18 5 L14 8" stroke="#85061B" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M19 5 L27 5 L19 1.5 Z" fill="#85061B" />
            </svg>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

function ProfileReviewIllustration() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setPulse((p) => p + 1), 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="flex-1 flex w-full mt-6 lg:mt-8 min-h-[200px] sm:min-h-[240px] items-center justify-center"
      aria-hidden
    >
      <motion.div
        className="relative w-[72%] max-w-[240px] sm:max-w-[280px]"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        {[
          { top: "-6%", right: "8%", size: "h-4 w-4", delay: 0 },
          { top: "12%", right: "-4%", size: "h-3 w-3", delay: 0.4 },
          { top: "4%", left: "-2%", size: "h-3.5 w-3.5", delay: 0.8 },
        ].map((s, i) => (
          <motion.div
            key={i}
            className={`absolute ${s.size} text-[#B50E30]/70`}
            style={{ top: s.top, right: s.right, left: s.left }}
            animate={{
              opacity: [0.25, 1, 0.25],
              scale: [0.75, 1.15, 0.75],
              rotate: [0, 12, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: s.delay,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-full h-full" />
          </motion.div>
        ))}

        <motion.div
          className="relative bg-white border-2 border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="space-y-2.5">
            <motion.div
              className="h-2.5 bg-neutral-200 rounded-full"
              style={{ width: "68%" }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity }}
            />
            <div className="h-2 bg-neutral-100 rounded-full w-full" />
            <div className="h-2 bg-neutral-100 rounded-full w-[92%]" />
            <div className="h-2 bg-neutral-100 rounded-full w-[78%]" />
            <div className="pt-1 flex gap-2">
              <div className="h-2 bg-neutral-100 rounded-full flex-1" />
              <div className="h-2 bg-neutral-100 rounded-full flex-1" />
            </div>
          </div>

          <motion.div
            key={pulse}
            className="absolute left-0 right-0 h-px bg-[#B50E30]/30 pointer-events-none"
            initial={{ top: "28%", opacity: 0 }}
            animate={{ top: ["28%", "82%"], opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div
          className="absolute -bottom-3 -right-2 sm:-right-3 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#B50E30] flex items-center justify-center shadow-[0_6px_20px_rgba(181,14,48,0.4)] z-10"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 20, delay: 0.35 }}
        >
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Check className="h-6 w-6 sm:h-7 sm:w-7 text-white stroke-[3]" />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute -bottom-1 -right-1 sm:right-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#B50E30]/25 pointer-events-none"
          initial={{ scale: 0.6, opacity: 0.6 }}
          animate={{ scale: [0.6, 1.35, 0.6], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
        />
      </motion.div>
    </div>
  );
}

function SkillsTerminalIllustration({ skillsCount }: { skillsCount: number }) {
  const prevCountRef = useRef(skillsCount);
  const [isAdding, setIsAdding] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  useEffect(() => {
    if (skillsCount > prevCountRef.current) {
      setPulseKey((k) => k + 1);
      setIsAdding(true);
      const timer = window.setTimeout(() => setIsAdding(false), 720);
      prevCountRef.current = skillsCount;
      return () => window.clearTimeout(timer);
    }
    prevCountRef.current = skillsCount;
  }, [skillsCount]);

  return (
    <div
      className="flex-1 flex w-full mt-6 lg:mt-8 min-h-[180px] sm:min-h-[220px] items-center justify-center relative"
      aria-hidden
    >
      <motion.div
        className="absolute w-28 h-28 rounded-full border border-neutral-200/80 -left-2 bottom-4"
        animate={isAdding ? { scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] } : { scale: 1, opacity: 0.6 }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="absolute w-16 h-16 rounded-full border border-neutral-200/80 right-6 top-8"
        animate={isAdding ? { scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] } : { scale: 1, opacity: 0.5 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      />

      <motion.div
        className="relative w-full max-w-[260px]"
        animate={
          isAdding
            ? { x: [0, -2, 2, -1, 0], y: [0, 1, -1, 0] }
            : { x: 0, y: 0 }
        }
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <motion.div
          className="relative rounded-2xl bg-neutral-100 border-2 p-4 sm:p-5 shadow-sm overflow-hidden"
          animate={{
            borderColor: isAdding ? "#B50E30" : "#E5E5E5",
            boxShadow: isAdding
              ? "0 8px 24px rgba(181, 14, 48, 0.15)"
              : "0 1px 3px rgba(0,0,0,0.06)",
          }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex gap-1.5 mb-4">
            <motion.span
              className="w-2 h-2 rounded-full bg-neutral-300"
              animate={isAdding ? { backgroundColor: "#B50E30" } : { backgroundColor: "#D4D4D4" }}
            />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
            <span className="w-2 h-2 rounded-full bg-neutral-300" />
          </div>
          <div className="font-mono text-sm sm:text-base leading-relaxed min-h-[44px]">
            <motion.p
              className="font-bold text-[#B50E30] tracking-tight"
              animate={
                isAdding
                  ? { opacity: [1, 0.25, 1, 0.25, 1] }
                  : { opacity: 1 }
              }
              transition={{ duration: 0.55 }}
            >
              &gt;_
            </motion.p>
            <AnimatePresence mode="wait">
              {isAdding ? (
                <motion.p
                  key={`line-${pulseKey}`}
                  initial={{ opacity: 0, y: 6, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.28, delay: 0.12 }}
                  className="text-[#B50E30] font-semibold mt-1.5"
                >
                  + habilidad añadida
                </motion.p>
              ) : skillsCount > 0 ? (
                <motion.p
                  key="saved"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.45 }}
                  className="text-neutral-500 text-xs mt-1.5"
                >
                  {skillsCount} {skillsCount === 1 ? "registro" : "registros"} en stack
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {isAdding && (
              <motion.div
                key={`scan-${pulseKey}`}
                className="absolute left-0 right-0 h-0.5 bg-[#B50E30]/40"
                initial={{ top: "30%", opacity: 0.8 }}
                animate={{ top: ["30%", "85%"], opacity: [0.8, 0] }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          className="absolute -right-3 sm:-right-5 bottom-2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center shadow-md z-10"
          animate={
            isAdding
              ? {
                  scale: [1, 1.18, 1],
                  backgroundColor: ["#ffffff", "#B50E30", "#ffffff"],
                  borderColor: ["#E5E5E5", "#B50E30", "#E5E5E5"],
                }
              : { scale: 1, backgroundColor: "#ffffff", borderColor: "#E5E5E5" }
          }
          transition={{ duration: 0.45 }}
        >
          <motion.div
            animate={isAdding ? { rotate: [0, 90, 0] } : { rotate: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Plus
              className={`h-5 w-5 stroke-[2.5] transition-colors ${
                isAdding ? "text-white" : "text-[#B50E30]"
              }`}
            />
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isAdding && (
            <motion.div
              key={`fly-${pulseKey}`}
              className="absolute -right-1 sm:right-0 bottom-6 z-20 pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: -72, y: -48, opacity: 0, scale: 0.35 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="w-7 h-7 rounded-full bg-[#B50E30] flex items-center justify-center shadow-lg">
                <Plus className="h-4 w-4 text-white stroke-[3]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default function DiagnosticoWizard({
  currentProfile,
  onComplete,
  studentCode,
}: DiagnosticoWizardProps) {
  const [step, setStep] = useState(1);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const specInputRef = useRef<HTMLInputElement>(null);
  const hardInputRef = useRef<HTMLInputElement>(null);
  const softInputRef = useRef<HTMLInputElement>(null);

  const name = currentProfile.name;
  const career = currentProfile.career;
  const semester = currentProfile.semester;

  const careerSkills = CAREER_TYPICAL_SKILLS[career] ?? [];
  const specializationPool = CAREER_SPECIALIZATION_TAGS[career] ?? [];

  const [cvMode, setCvMode] = useState<"upload" | "harvard">("upload");
  const [cvFileName, setCvFileName] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvParsing, setCvParsing] = useState(false);
  const [harvardOpen, setHarvardOpen] = useState({ resumen: true, formacion: false, proyectos: false, experiencia: false });
  const [harvardForm, setHarvardForm] = useState({
    resumen: "",
    formacionCarrera: career,
    formacionCiclo: `${semester}° ciclo`,
    formacionFechaInicio: "",
    formacionFechaFin: "",
    formacionLogros: "",
  });

  const [proyectos, setProyectos] = useState([
    { id: 1, nombre: "", fechaInicio: "", fechaFin: "", descripcion: "", logros: [""] },
  ]);
  const nextProyectoId = useRef(2);

  const [completed, setCompleted] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [experiencias, setExperiencias] = useState<CvExperiencia[]>([
    { rol: "", descripcion: "", ubicacion: "", fechaInicio: "", fechaFin: "", logros: [""] },
  ]);

  const [contactEmail, setContactEmail] = useState(currentProfile.email || "");
  const [contactPhone, setContactPhone] = useState(currentProfile.phone || "");
  const [contactLinkedin, setContactLinkedin] = useState(currentProfile.linkedin || "");

  const [experienceLevel, setExperienceLevel] = useState("");

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState("");

  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [hardInput, setHardInput] = useState("");
  const [softInput, setSoftInput] = useState("");
  const [skillsTab, setSkillsTab] = useState<"hard" | "soft">("hard");
  const [kairosOpen, setKairosOpen] = useState(true);
  const [kairosCardIndex, setKairosCardIndex] = useState(0);

  const kairosCards = useMemo(
    () => getKairosWizardCards(step, cvMode, skillsTab),
    [step, cvMode, skillsTab],
  );

  useEffect(() => {
    setKairosCardIndex(0);
    setKairosOpen(true);
  }, [step, cvMode, skillsTab]);

  const resolveCvText = useCallback(() => {
    if (cvMode === "harvard") {
      const proyTexto = proyectos
        .filter((p) => p.nombre || p.descripcion)
        .map(
          (p) =>
            `${p.nombre}${p.fechaInicio || p.fechaFin ? ` (${p.fechaInicio || "?"} - ${p.fechaFin || "Presente"})` : ""}: ${p.descripcion}`
        )
        .join("\n\n");

      return buildHarvardCvText({
        resumen: harvardForm.resumen,
        formacion: `Universidad Tecnológica del Perú (UTP) — ${harvardForm.formacionCarrera}, ${harvardForm.formacionCiclo}${harvardForm.formacionFechaInicio || harvardForm.formacionFechaFin ? ` (${harvardForm.formacionFechaInicio || "?"} - ${harvardForm.formacionFechaFin || "Presente"})` : ""}${harvardForm.formacionLogros ? `\nLogros: ${harvardForm.formacionLogros}` : ""}`,
        proyectos: proyTexto,
        name,
        career,
      });
    }
    return cvText;
  }, [cvMode, cvText, harvardForm, name, career, proyectos]);

  const applyCvHints = useCallback(
    (text: string) => {
      const hints = extractProfileHintsFromCv(
        text,
        career,
        careerSkills,
        specializationPool,
        GENERIC_SOFT_SKILLS
      );
      setHardSkills(hints.hardSkills);
      setSoftSkills(hints.softSkills);
      setSpecializations(hints.specializations);
    },
    [career, careerSkills, specializationPool]
  );

  const loadMockCvData = useCallback((code: string) => {
    const data = getCvMockData(code);
    if (!data) return;

    setContactEmail(data.email);
    setContactPhone(data.phone);
    setContactLinkedin(data.linkedin);

    setHarvardForm((prev) => ({
      ...prev,
      resumen: data.resumen,
      formacionFechaInicio: data.formacion.fechaInicio,
      formacionFechaFin: data.formacion.fechaFin,
      formacionLogros: data.formacion.logros,
    }));

    if (data.experiencias.length > 0) {
      setExperiencias(data.experiencias);
    }

    if (data.proyectos.length > 0) {
      setProyectos(
        data.proyectos.map((p, i) => ({
          id: i + 1,
          nombre: p.nombre,
          fechaInicio: p.fechaInicio,
          fechaFin: p.fechaFin,
          descripcion: p.descripcion,
          logros: [...p.logros],
        }))
      );
    }

    setHardSkills([...data.hardSkills]);
    setSoftSkills([...data.softSkills]);
    setSpecializations([...data.specializations]);
    setExperienceLevel(data.experienceLevel);

    setCvMode("harvard");
    setCvFileName("");
    setCvText("");
    setErrorStr(null);
  }, []);

  const handleCvFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setErrorStr("Solo se aceptan archivos PDF.");
      return;
    }
    setCvParsing(true);
    setErrorStr(null);
    try {
      const text = await extractTextFromPdf(file);
      if (text.length < 20) {
        throw new Error("No se pudo extraer texto del PDF. Verifica que no sea una imagen escaneada.");
      }
      setCvText(text);
      setCvFileName(file.name);
      setCvMode("upload");
      applyCvHints(text);
    } catch (err: unknown) {
      setErrorStr(err instanceof Error ? err.message : "Error al leer el PDF.");
    } finally {
      setCvParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleCvFile(file);
  };

  const toggleTag = (list: string[], setList: (v: string[]) => void, tag: string) => {
    setList(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  const addCustomTag = (
    input: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    const trimmed = input.trim();
    if (!trimmed || list.includes(trimmed)) return;
    setList([...list, trimmed]);
    setInput("");
  };

  const addSpecTag = () => {
    addCustomTag(specInput, setSpecInput, specializations, setSpecializations);
    setErrorStr(null);
  };

  const handleSpecKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSpecTag();
    }
  };

  const addHardSkillTag = () => {
    addCustomTag(hardInput, setHardInput, hardSkills, setHardSkills);
    setErrorStr(null);
  };

  const addSoftSkillTag = () => {
    addCustomTag(softInput, setSoftInput, softSkills, setSoftSkills);
    setErrorStr(null);
  };

  const handleHardKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addHardSkillTag();
    }
  };

  const handleSoftKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSoftSkillTag();
    }
  };

  const removeTag = (list: string[], setList: (v: string[]) => void, tag: string) => {
    setList(list.filter((t) => t !== tag));
  };

  const validateStep = (current: number): boolean => {
    if (current === 1) {
      const text = resolveCvText();
      if (text.length < 20) {
        setErrorStr("Sube tu CV en PDF o completa la plantilla Harvard.");
        return false;
      }
      if (cvMode === "harvard") applyCvHints(text);
      return true;
    }
    if (current === 2 && !experienceLevel) {
      setErrorStr("Selecciona tu nivel de experiencia.");
      return false;
    }
    if (current === 3 && specializations.length === 0) {
      setErrorStr("Selecciona al menos un área de especialización.");
      return false;
    }
    if (current === 4 && (hardSkills.length === 0 || softSkills.length === 0)) {
      setErrorStr("Confirma al menos una habilidad técnica y una blanda.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setErrorStr(null);
    setStep((s) => s + 1);
  };

  const handleFinish = () => {
    if (!validateStep(5)) return;
    if (isGenerating) return;

    setIsGenerating(true);

    const finalCvText = resolveCvText();
    const experienceLabel =
      EXPERIENCE_OPTIONS.find((o) => o.id === experienceLevel)?.title ?? experienceLevel;
    const targetRole = specializations[0] ?? currentProfile.targetRole;
    const proysTexto = proyectos
      .filter((p) => p.nombre || p.descripcion || (p.logros && p.logros.some(l => l.trim())))
      .map((p) => ({
        nombre: p.nombre,
        fechaInicio: p.fechaInicio,
        fechaFin: p.fechaFin,
        descripcion: p.descripcion,
        logros: p.logros?.filter(l => l.trim()),
      }));

    const expTexto = experiencias
      .filter((e) => e.rol)
      .map((e) => ({
        rol: e.rol,
        descripcion: e.descripcion,
        ubicacion: e.ubicacion,
        fechaInicio: e.fechaInicio,
        fechaFin: e.fechaFin,
        logros: e.logros?.filter(l => l.trim()),
      }));

    const updatedProfile: UserProfile = {
      ...currentProfile,
      experienceLevel: experienceLabel,
      targetRole,
      currentSkills: hardSkills,
      softSkills,
      interests: specializations,
      employabilityScore: currentProfile.employabilityScore || 0,
      email: contactEmail || undefined,
      phone: contactPhone || undefined,
      linkedin: contactLinkedin || undefined,
    };

    const cvMeta: CvMeta = {
      fileName: cvMode === "upload" ? cvFileName || "CV_cargado.pdf" : "CV_Plantilla_Harvard.txt",
      format: cvMode === "upload" ? "PDF" : "Plantilla Harvard",
      source: "Diagnóstico Inicial",
      status: "Pendiente de análisis",
      targetRole: specializations.join(", ") || career,
      analysisDate: new Date().toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    // Build structured data before the delay
    const cvStructured = {
      cvResumen: harvardForm.resumen,
      formacion: {
        universidad: "Universidad Tecnológica del Perú (UTP)",
        carrera: harvardForm.formacionCarrera,
        ciclo: harvardForm.formacionCiclo,
        fechaInicio: harvardForm.formacionFechaInicio,
        fechaFin: harvardForm.formacionFechaFin,
        logros: harvardForm.formacionLogros,
      },
      experiencia: expTexto,
      proyectos: proysTexto,
      hardSkills,
      softSkills,
    };

    // Simulate generation delay
    setTimeout(() => {
      localStorage.setItem("sp_profile", JSON.stringify(updatedProfile));
      localStorage.setItem("sp_cv_text", finalCvText);
      localStorage.setItem("sp_cv_meta", JSON.stringify(cvMeta));
      localStorage.setItem("sp_cv_structured", JSON.stringify(cvStructured));
      localStorage.setItem("sp_diagnosis_completed", "true");
      setCompleted(true);
      setIsGenerating(false);
    }, 1200);
  };

  const handleContinueToAnalysis = () => {
    const finalCvText = resolveCvText();
    const updatedProfile: UserProfile = {
      ...currentProfile,
      experienceLevel,
      targetRole: specializations[0] ?? currentProfile.targetRole,
      currentSkills: hardSkills,
      softSkills,
      interests: specializations,
      employabilityScore: currentProfile.employabilityScore || 0,
      email: contactEmail || undefined,
      phone: contactPhone || undefined,
      linkedin: contactLinkedin || undefined,
    };
    const cvMeta: CvMeta = {
      fileName: cvMode === "upload" ? cvFileName || "CV_cargado.pdf" : "CV_Plantilla_Harvard.txt",
      format: cvMode === "upload" ? "PDF" : "Plantilla Harvard",
      source: "Diagnóstico Inicial",
      status: "Pendiente de análisis",
      targetRole: specializations.join(", ") || career,
      analysisDate: new Date().toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" }),
    };
    onComplete(updatedProfile, finalCvText, cvMeta);
  };

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!completed) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [completed]);

  const successModal = (
    <AnimatePresence>
      {completed && (
        <>
          <motion.div
            key="diagnosis-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-lg"
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="diagnosis-success-title"
          >
            <motion.div
              key="diagnosis-modal"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 sm:p-8 text-center space-y-6 my-auto"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 ring-4 ring-emerald-100">
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 id="diagnosis-success-title" className="text-2xl font-black text-black">
                  ¡Diagnóstico completado!
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Tu perfil profesional ha sido registrado y tu CV está listo para ser analizado.
                  Nuestra IA identificará oportunidades para mejorar tu empleabilidad.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-50 rounded-xl p-3 text-center border border-neutral-100">
                  <p className="text-lg font-black text-black">{hardSkills.length}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Habilidades</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3 text-center border border-neutral-100">
                  <p className="text-lg font-black text-black">{specializations.length}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Áreas</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3 text-center border border-neutral-100">
                  <p className="text-lg font-black text-black">{proyectos.filter((p) => p.nombre).length}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Proyectos</p>
                </div>
              </div>

              <div className="bg-[#B50E30]/5 border border-[#B50E30]/15 rounded-xl p-3.5 text-left">
                <p className="text-xs font-bold text-black flex items-start gap-2">
                  <UvpIcon name="creatividad-innovacion" size={14} className="text-[#B50E30] shrink-0 mt-0.5" />
                  Tu CV se generará automáticamente con estos datos. Luego podrás descargarlo desde Análisis.
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinueToAnalysis}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#B50E30] text-white text-sm font-black rounded-xl hover:bg-[#85061B] transition shadow-lg shadow-[#B50E30]/20 cursor-pointer"
              >
                <UvpIcon name="test-evaluaciones" size={16} className="text-white" />
                Continuar al Análisis
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  const reserveKairosSpace = !completed && kairosOpen;

  return (
    <>
    <div className={`min-h-screen bg-gray-50 flex flex-col relative ${completed ? "h-screen overflow-hidden" : ""}`}>
      <div className={completed ? "blur-md brightness-[0.97] pointer-events-none select-none" : ""}>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <Logo />
          <div className="flex-1 w-full sm:max-w-xs sm:mx-4 order-3 sm:order-none">
            <div className="flex items-center gap-1">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    step >= n ? (step === n ? "bg-[#B50E30]" : "bg-black") : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-neutral-400 font-semibold text-center mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
              <UvpIcon name={["plantillas-cv","desarrollo-competencias","metas-profesionales","habilidades-blandas","test-evaluaciones"][step-1]} size={12} className="text-neutral-400" />
              Paso {step} de {TOTAL_STEPS}
            </p>
          </div>
          <span className="text-xs font-semibold text-neutral-600 bg-gray-100 px-3 py-1.5 rounded-full self-start sm:self-auto shrink-0">
            Hola, {name.split(" ")[0]}
          </span>
        </div>
      </header>

      <div
        className={`flex-1 ${reserveKairosSpace ? "pb-44 sm:pb-52 lg:pb-0" : ""}`}
      >
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-10 flex flex-col lg:flex-row lg:items-start lg:gap-8 xl:gap-10">
          {reserveKairosSpace && (
            <aside className="hidden lg:flex w-[280px] xl:w-[300px] shrink-0 sticky top-28 self-start">
              <KairosGuide
                placement="docked"
                cards={kairosCards}
                cardIndex={kairosCardIndex}
                onCardIndexChange={setKairosCardIndex}
                open={kairosOpen}
                onClose={() => setKairosOpen(false)}
                onOpen={() => {
                  setKairosOpen(true);
                  setKairosCardIndex(0);
                }}
              />
            </aside>
          )}

          <main className="flex-1 min-w-0 flex justify-center">
            <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 md:p-10 space-y-6"
            >
              {step === 1 && (
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-10 h-10 rounded-full bg-white border-2 border-[#B50E30] flex items-center justify-center">
                      <ScrollText className="h-5 w-5 text-[#B50E30]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black">
                        Tu currículum <span className="text-[#B50E30]">vitae</span>
                      </h2>
                      <p className="text-sm text-neutral-600 mt-1 leading-relaxed">
                        Si ya tienes un CV actualizado, súbelo. Si es tu primera vez, completa la{" "}
                        <button
                          type="button"
                          onClick={() => setCvMode("harvard")}
                          className="text-[#B50E30] font-bold hover:underline"
                        >
                          plantilla Harvard
                        </button>
                        .
                      </p>
                    </div>
                  </div>

                  {cvMode === "upload" && (
                    <>
                      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5 items-stretch">
                        <div className="border-2 border-dashed border-neutral-300 hover:border-[#B50E30] rounded-2xl bg-neutral-50/50 p-5 sm:p-6 transition-colors">
                          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-6">
                            <CvUploadIllustration />

                            <div className="flex-1 w-full min-w-0 space-y-4">
                              <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className="rounded-xl border-2 border-neutral-200 bg-white hover:border-[#B50E30] hover:shadow-[0_0_0_1px_#B50E30] p-6 sm:p-8 text-center cursor-pointer transition group"
                              >
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="application/pdf"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleCvFile(file);
                                  }}
                                />
                                {cvParsing ? (
                                  <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="h-8 w-8 text-[#B50E30] animate-spin" />
                                    <p className="text-sm font-semibold text-neutral-600">Leyendo tu PDF...</p>
                                  </div>
                                ) : cvFileName ? (
                                  <div className="space-y-2">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-black flex items-center justify-center">
                                      <UvpIcon name="plantillas-cv" size={28} className="text-[#B50E30]" />
                                    </div>
                                    <p className="font-bold text-black text-sm">{cvFileName}</p>
                                    <p className="text-xs text-[#B50E30] font-semibold group-hover:underline">
                                      Haz clic para reemplazar el archivo
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-3">
                                    <div className="mx-auto w-12 h-12 rounded-full bg-black flex items-center justify-center">
                                      <Upload className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                      <p className="font-bold text-black text-sm sm:text-base">
                                        Sube tu CV actual en PDF
                                      </p>
                                      <p className="text-xs text-black mt-1">
                                        Arrastra y suelta tu archivo aquí o{" "}
                                        <span className="text-black font-semibold">haz clic para seleccionar</span>
                                      </p>
                                    </div>
                                    <p className="inline-flex items-center gap-1.5 text-[10px] text-black font-medium">
                                      <Shield className="h-3.5 w-3.5 shrink-0 text-black" />
                                      Tu información está segura con nosotros
                                    </p>
                                  </div>
                                )}
                              </div>

                              {studentCode && getCvMockData(studentCode) && (
                                <div className="space-y-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      loadMockCvData(studentCode);
                                    }}
                                    className="w-full py-3.5 bg-[#B50E30] text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl hover:bg-[#85061B] transition flex items-center justify-center gap-2 shadow-sm"
                                  >
                                    <Sparkles className="h-4 w-4" />
                                    Extraer datos con IA
                                  </button>
                                  <p className="text-[10px] text-center text-neutral-500 leading-relaxed px-2">
                                    Nuestra IA analizará tu CV y completará tu información automáticamente.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <CvUploadBenefitsPanel />
                      </div>

                      <ContactFields
                        contactEmail={contactEmail}
                        setContactEmail={setContactEmail}
                        contactPhone={contactPhone}
                        setContactPhone={setContactPhone}
                        contactLinkedin={contactLinkedin}
                        setContactLinkedin={setContactLinkedin}
                      />

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-[11px] text-neutral-400 text-center shrink-0">
                          O si es tu primera vez buscando empleo...
                        </span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <button
                        type="button"
                        onClick={() => setCvMode("harvard")}
                        className="w-full py-3.5 border-2 border-black text-black text-sm font-bold rounded-xl hover:bg-black hover:text-white transition"
                      >
                        Crear mi primer CV (Formato Harvard)
                      </button>
                    </>
                  )}

                  {cvMode === "harvard" && (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => setCvMode("upload")}
                        className="text-xs font-bold text-[#B50E30] hover:underline flex items-center gap-1"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Volver a subir PDF
                      </button>

                      <ContactFields
                        contactEmail={contactEmail}
                        setContactEmail={setContactEmail}
                        contactPhone={contactPhone}
                        setContactPhone={setContactPhone}
                        contactLinkedin={contactLinkedin}
                        setContactLinkedin={setContactLinkedin}
                      />

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setHarvardOpen((p) => ({ ...p, resumen: !p.resumen }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 text-left"
                        >
                          <span className="text-base font-black text-black flex items-center gap-2.5">
                            <UvpIcon name="orientacion-profesional" size={18} className="text-[#B50E30]" />
                            Resumen Profesional
                          </span>
                          <motion.span animate={{ rotate: harvardOpen.resumen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {harvardOpen.resumen && (
                            <motion.div
                              key="resumen-content"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <div className="p-3 border-t border-gray-200 space-y-2">
                            <div className="text-[11px] text-neutral-500 font-medium space-y-1">
                              <p>Escribe 3-4 líneas que resuman <strong>quién eres, qué buscas y qué ofreces</strong>. Esto será lo primero que lea un reclutador.</p>
                              <ul className="list-disc pl-4 text-[10.5px]">
                                <li>Tu carrera, ciclo y universidad</li>
                                <li>Tu área de interés o puesto deseado</li>
                                <li>Tu principal fortaleza o diferenciador</li>
                                <li>Qué tipo de oportunidad buscas (prácticas, empleo, etc.)</li>
                              </ul>
                              <p className="text-[#B50E30] font-bold">Ej: "Estudiante de Ingeniería de Sistemas, 7mo ciclo, apasionado por el desarrollo backend con Java y Spring Boot. Busco integrarme a un equipo ágil donde pueda aportar mis conocimientos en bases de datos y APIs REST mientras desarrollo habilidades profesionales en un entorno real."</p>
                            </div>
                            <textarea
                              value={harvardForm.resumen}
                              onChange={(e) => setHarvardForm((p) => ({ ...p, resumen: e.target.value }))}
                              placeholder="Estudiante de ... con interés en ... Apasionado por ..."
                              rows={4}
                              className="w-full px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30]"
                            />
                          </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setHarvardOpen((p) => ({ ...p, formacion: !p.formacion }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 text-left"
                        >
                          <span className="text-base font-black text-black flex items-center gap-2.5">
                            <UvpIcon name="capacitacion-talleres" size={18} className="text-[#B50E30]" />
                            Formación Académica
                          </span>
                          <motion.span animate={{ rotate: harvardOpen.formacion ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {harvardOpen.formacion && (
                            <motion.div
                              key="formacion-content"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <div className="p-3 border-t border-gray-200 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Universidad</label>
                                <input
                                  type="text"
                                  value="Universidad Tecnológica del Perú (UTP)"
                                  disabled
                                  className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-neutral-500 outline-none cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Carrera</label>
                                <input
                                  type="text"
                                  value={harvardForm.formacionCarrera}
                                  disabled
                                  className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-neutral-500 outline-none cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Ciclo</label>
                                <input
                                  type="text"
                                  value={harvardForm.formacionCiclo}
                                  disabled
                                  className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-neutral-500 outline-none cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mes y año de inicio</label>
                                <MySelect
                                  value={harvardForm.formacionFechaInicio}
                                  onChange={(v) => setHarvardForm((p) => ({ ...p, formacionFechaInicio: v }))}
                                  label="formación inicio"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mes y año de fin</label>
                                <MySelect
                                  value={harvardForm.formacionFechaFin}
                                  onChange={(v) => setHarvardForm((p) => ({ ...p, formacionFechaFin: v }))}
                                  label="formación fin"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Logros / detalles adicionales</label>
                              <textarea
                                value={harvardForm.formacionLogros}
                                onChange={(e) => setHarvardForm((p) => ({ ...p, formacionLogros: e.target.value }))}
                                placeholder="Menciona logros académicos, cursos destacados, premios, etc."
                                rows={3}
                                className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30]"
                              />
                            </div>
                          </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setHarvardOpen((p) => ({ ...p, experiencia: !p.experiencia }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 text-left"
                        >
                          <span className="text-base font-black text-black flex items-center gap-2.5">
                            <UvpIcon name="bolsa-trabajo" size={18} className="text-[#B50E30]" />
                            Experiencia Profesional
                          </span>
                          <motion.span animate={{ rotate: harvardOpen.experiencia ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {harvardOpen.experiencia && (
                            <motion.div
                              key="experiencia-content"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <div className="p-3 border-t border-gray-200 space-y-4">
                            <p className="text-[11px] text-neutral-500 font-medium">
                              Agrega hasta 2 experiencias: prácticas, trabajos, voluntariados o proyectos relevantes.
                            </p>
                            {experiencias.map((exp, idx) => (
                              <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-black flex items-center gap-2">
                                    <UvpIcon name="bolsa-trabajo" size={14} className="text-[#B50E30]" />
                                    Experiencia #{idx + 1}
                                  </span>
                                  {experiencias.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setExperiencias((p) => p.filter((_, i) => i !== idx))}
                                      className="text-[#B50E30] hover:text-[#85061B] transition cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Rol / Puesto</label>
                                    <input
                                      type="text"
                                      value={exp.rol}
                                      onChange={(e) => {
                                        const updated = [...experiencias];
                                        updated[idx] = { ...updated[idx], rol: e.target.value };
                                        setExperiencias(updated);
                                      }}
                                      placeholder="Ej. Desarrollador Backend"
                                      className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-[#B50E30] focus:ring-1 focus:ring-[#B50E30]/30"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Empresa / Contexto</label>
                                    <input
                                      type="text"
                                      value={exp.descripcion}
                                      onChange={(e) => {
                                        const updated = [...experiencias];
                                        updated[idx] = { ...updated[idx], descripcion: e.target.value };
                                        setExperiencias(updated);
                                      }}
                                      placeholder="Ej. Proyectos académicos y personales"
                                      className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-[#B50E30] focus:ring-1 focus:ring-[#B50E30]/30"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Ubicación</label>
                                    <input
                                      type="text"
                                      value={exp.ubicacion}
                                      onChange={(e) => {
                                        const updated = [...experiencias];
                                        updated[idx] = { ...updated[idx], ubicacion: e.target.value };
                                        setExperiencias(updated);
                                      }}
                                      placeholder="Ej. Chimbote, Perú"
                                      className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-[#B50E30] focus:ring-1 focus:ring-[#B50E30]/30"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Inicio</label>
                                      <MySelect
                                        value={exp.fechaInicio}
                                        onChange={(v) => {
                                          const updated = [...experiencias];
                                          updated[idx] = { ...updated[idx], fechaInicio: v };
                                          setExperiencias(updated);
                                        }}
                                        label="exp inicio"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Fin</label>
                                      <MySelect
                                        value={exp.fechaFin}
                                        onChange={(v) => {
                                          const updated = [...experiencias];
                                          updated[idx] = { ...updated[idx], fechaFin: v };
                                          setExperiencias(updated);
                                        }}
                                        label="exp fin"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                    <UvpIcon name="logros-inspiran" size={12} className="text-[#B50E30]" />
                                    Logros y responsabilidades (uno por línea)
                                  </label>
                                  <textarea
                                    value={exp.logros?.join("\n") || ""}
                                    onChange={(e) => {
                                      const lines = e.target.value.split("\n");
                                      const updated = [...experiencias];
                                      updated[idx] = { ...updated[idx], logros: lines };
                                      setExperiencias(updated);
                                    }}
                                    placeholder={"• Desarrollo de APIs RESTful con Spring Boot\n• Configuración de Docker y Linux para despliegue\n• Implementación de autenticación JWT"}
                                    rows={3}
                                    className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30] font-mono"
                                  />
                                </div>
                              </div>
                            ))}
                            {experiencias.length < 2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExperiencias((p) => [
                                    ...p,
                                    { rol: "", descripcion: "", ubicacion: "", fechaInicio: "", fechaFin: "", logros: [""] },
                                  ])
                                }
                                className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 text-sm font-bold rounded-xl hover:border-[#B50E30] hover:text-[#B50E30] transition cursor-pointer"
                              >
                                <Plus className="h-4 w-4 inline mr-1" />
                                Agregar otra experiencia
                              </button>
                            )}
                          </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Proyectos Destacados */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setHarvardOpen((p) => ({ ...p, proyectos: !p.proyectos }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 text-left"
                        >
                          <span className="text-base font-black text-black flex items-center gap-2.5">
                            <UvpIcon name="creatividad-innovacion" size={18} className="text-[#B50E30]" />
                            Proyectos Destacados
                          </span>
                          <motion.span animate={{ rotate: harvardOpen.proyectos ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {harvardOpen.proyectos && (
                            <motion.div
                              key="proyectos-content"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <div className="p-3 border-t border-gray-200 space-y-4">
                            <p className="text-[11px] text-neutral-500 font-medium">
                              Agrega hasta 3 proyectos académicos, personales o voluntariados.
                            </p>
                            {proyectos.map((proy, idx) => (
                              <div key={proy.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-black flex items-center gap-2">
                                    <UvpIcon name="creatividad-innovacion" size={14} className="text-[#B50E30]" />
                                    Proyecto #{idx + 1}
                                  </span>
                                  {proyectos.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setProyectos((p) => p.filter((_, i) => i !== idx))}
                                      className="text-[#B50E30] hover:text-[#85061B] transition cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Nombre del proyecto</label>
                                  <input
                                    type="text"
                                    value={proy.nombre}
                                    onChange={(e) => {
                                      const updated = [...proyectos];
                                      updated[idx] = { ...updated[idx], nombre: e.target.value };
                                      setProyectos(updated);
                                    }}
                                    placeholder="Ej. Dashboard de Ventas con Power BI"
                                    className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg text-sm outline-none focus:border-[#B50E30] focus:ring-1 focus:ring-[#B50E30]/30"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mes y año inicio</label>
                                    <MySelect
                                      value={proy.fechaInicio}
                                      onChange={(v) => {
                                        const updated = [...proyectos];
                                        updated[idx] = { ...updated[idx], fechaInicio: v };
                                        setProyectos(updated);
                                      }}
                                      label="proyecto inicio"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mes y año fin</label>
                                    <MySelect
                                      value={proy.fechaFin}
                                      onChange={(v) => {
                                        const updated = [...proyectos];
                                        updated[idx] = { ...updated[idx], fechaFin: v };
                                        setProyectos(updated);
                                      }}
                                      label="proyecto fin"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Contexto (opcional)</label>
                                  <textarea
                                    value={proy.descripcion}
                                    onChange={(e) => {
                                      const updated = [...proyectos];
                                      updated[idx] = { ...updated[idx], descripcion: e.target.value };
                                      setProyectos(updated);
                                    }}
                                    placeholder="Ej. Proyecto académico del curso de Desarrollo Web"
                                    rows={2}
                                    className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Logros / aportes (uno por línea)</label>
                                  <textarea
                                    value={proy.logros?.join("\n") || ""}
                                    onChange={(e) => {
                                      const lines = e.target.value.split("\n");
                                      const updated = [...proyectos];
                                      updated[idx] = { ...updated[idx], logros: lines };
                                      setProyectos(updated);
                                    }}
                                    placeholder={"• Diseñé e implementé APIs REST con Spring Boot\n• Configuré base de datos PostgreSQL con Flyway"}
                                    rows={3}
                                    className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30] font-mono"
                                  />
                                </div>
                              </div>
                            ))}
                            {proyectos.length < 3 && (
                              <button
                                type="button"
                                  onClick={() =>
                                    setProyectos((p) => [
                                      ...p,
                                      { id: nextProyectoId.current++, nombre: "", fechaInicio: "", fechaFin: "", descripcion: "", logros: [""] },
                                    ])
                                  }
                                className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 text-sm font-bold rounded-xl hover:border-[#B50E30] hover:text-[#B50E30] transition cursor-pointer"
                              >
                                <Plus className="h-4 w-4 inline mr-1" />
                                Agregar otro proyecto
                              </button>
                            )}
                          </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PASO 2: Experiencia */}
              {step === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-stretch">
                  <div className="flex flex-col min-h-0 lg:min-h-[520px]">
                    <div className="inline-flex items-center gap-2.5 self-start bg-white border border-neutral-200 rounded-full px-3 py-1.5 shadow-sm">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-xs font-black shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-black">{name}</span>
                      <span className="text-neutral-300 hidden sm:inline">|</span>
                      <span className="text-xs text-neutral-500 hidden sm:inline">
                        {career} · {semester}° Ciclo
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 sm:hidden">
                      {career} · {semester}° Ciclo
                    </p>

                    <h2 className="mt-6 sm:mt-8 text-3xl sm:text-4xl font-black tracking-tight leading-[1.05] text-black">
                      Nivel de
                      <br />
                      <span className="text-[#B50E30]">Experiencia</span>
                    </h2>
                    <p className="text-sm text-neutral-500 mt-4 leading-relaxed max-w-sm">
                      Considerando tu ciclo actual, cuéntanos cuál es tu experiencia práctica para
                      personalizar tus oportunidades.
                    </p>

                    <ExperienceStairsIllustration experienceLevel={experienceLevel} />
                  </div>

                  <div className="flex flex-col gap-4">
                    {errorStr && (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                        {errorStr}
                      </div>
                    )}

                    <motion.div
                      className="space-y-3 flex-1"
                      variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                      initial="hidden"
                      animate="visible"
                    >
                      {EXPERIENCE_OPTIONS.map((opt) => {
                        const selected = experienceLevel === opt.id;
                        const Icon = opt.icon;
                        return (
                          <motion.button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setExperienceLevel(opt.id);
                              setErrorStr(null);
                            }}
                            variants={{
                              hidden: { opacity: 0, x: 16 },
                              visible: { opacity: 1, x: 0 },
                            }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full p-4 sm:p-5 rounded-xl border-2 text-left transition flex items-start gap-4 ${
                              selected
                                ? "border-black bg-white shadow-sm"
                                : "border-neutral-200 hover:border-neutral-300 bg-white"
                            }`}
                          >
                            <div className="shrink-0 w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center">
                              <Icon
                                className={`h-5 w-5 ${
                                  opt.id === "primer-empleo" ? "text-neutral-400" : "text-neutral-500"
                                }`}
                                strokeWidth={opt.id === "primer-empleo" ? 1.5 : 2}
                              />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                              <p
                                className={`font-black text-sm sm:text-base ${
                                  selected ? "text-[#B50E30]" : "text-black"
                                }`}
                              >
                                {opt.title}
                              </p>
                              <p className="text-xs sm:text-sm text-neutral-500 mt-1 leading-relaxed">
                                {opt.description}
                              </p>
                            </div>
                            {selected && (
                              <motion.span
                                className="shrink-0 w-7 h-7 rounded-full bg-[#B50E30] flex items-center justify-center mt-0.5"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                              >
                                <Check className="h-4 w-4 text-white stroke-[3]" />
                              </motion.span>
                            )}
                          </motion.button>
                        );
                      })}
                    </motion.div>

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorStr(null);
                          setStep(1);
                        }}
                        className="flex items-center gap-1.5 text-sm font-bold text-black hover:text-neutral-600 transition"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition"
                      >
                        Siguiente
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3: Especialización */}
              {step === 3 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-stretch">
                  <div className="flex flex-col min-h-0 lg:min-h-[520px]">
                    <div className="inline-flex items-center gap-2.5 self-start bg-white border border-neutral-200 rounded-full px-3 py-1.5 shadow-sm">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-xs font-black shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-black">{name}</span>
                      <span className="text-neutral-300 hidden sm:inline">|</span>
                      <span className="text-xs text-neutral-500 hidden sm:inline">{career}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 sm:hidden">{career}</p>

                    <div className="flex items-center gap-2.5 mt-6 sm:mt-8">
                      <Target className="h-6 w-6 sm:h-7 sm:w-7 text-[#B50E30] shrink-0" />
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                        Tus metas
                      </h2>
                    </div>
                    <p className="text-sm text-neutral-500 mt-4 leading-relaxed max-w-sm">
                      ¿En qué áreas te gustaría especializarte? Puedes seleccionar las sugerencias
                      basadas en tu carrera o añadir nuevas.
                    </p>

                    <GoalsTargetIllustration specializationCount={specializations.length} />
                  </div>

                  <div className="flex flex-col gap-5">
                    {errorStr && (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                        {errorStr}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h3 className="text-sm font-black text-black">Áreas seleccionadas</h3>
                        <div className="min-h-[110px] sm:min-h-[120px] rounded-2xl border-2 border-neutral-200 bg-white p-3 sm:p-4">
                          {specializations.length > 0 ? (
                            <div className="flex flex-wrap gap-2 items-start content-start">
                              <AnimatePresence mode="popLayout">
                                {specializations.map((s) => (
                                  <motion.span
                                    key={s}
                                    layout
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ duration: 0.15 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-full"
                                  >
                                    {s}
                                    <button
                                      type="button"
                                      onClick={() => removeTag(specializations, setSpecializations, s)}
                                      className="hover:text-neutral-300 transition"
                                      aria-label={`Quitar ${s}`}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </motion.span>
                                ))}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-400 leading-relaxed">
                              Aún no has seleccionado áreas. Elige una sugerencia o escribe la tuya abajo.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="spec-custom-input"
                          className="text-xs font-bold text-neutral-600"
                        >
                          Añadir área personalizada
                        </label>
                        <input
                          id="spec-custom-input"
                          ref={specInputRef}
                          value={specInput}
                          onChange={(e) => setSpecInput(e.target.value)}
                          onKeyDown={handleSpecKeyDown}
                          placeholder="Escribe y presiona Enter..."
                          className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 bg-white text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black/10"
                        />
                        <p className="text-[11px] text-neutral-400">
                          Presiona &apos;Enter&apos; o coma para añadir un área personalizada.
                        </p>
                      </div>
                    </div>

                    {specializationPool.filter((tag) => !specializations.includes(tag)).length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                          <p className="text-sm font-bold text-black">Sugerencias para tu perfil</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {specializationPool
                            .filter((tag) => !specializations.includes(tag))
                            .map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => {
                                  toggleTag(specializations, setSpecializations, tag);
                                  setErrorStr(null);
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black transition"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                {tag}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorStr(null);
                          setStep(2);
                        }}
                        className="flex items-center gap-1.5 text-sm font-bold text-black hover:text-neutral-600 transition"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition"
                      >
                        Siguiente
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 4: Habilidades */}
              {step === 4 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-stretch">
                  <div className="flex flex-col min-h-0 lg:min-h-[520px]">
                    <div className="inline-flex items-center gap-2.5 self-start bg-white border border-neutral-200 rounded-full px-3 py-1.5 shadow-sm">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-black text-white text-xs font-black shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-sm font-bold text-black">{name}</span>
                      <span className="text-neutral-300 hidden sm:inline">|</span>
                      <span className="text-xs text-neutral-500 hidden sm:inline">{career}</span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-2 sm:hidden">{career}</p>

                    <div className="flex items-center gap-2.5 mt-6 sm:mt-8">
                      <Brain className="h-6 w-6 sm:h-7 sm:w-7 text-[#B50E30] shrink-0" />
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                        Tus Habilidades
                      </h2>
                    </div>
                    <p className="text-sm text-neutral-500 mt-4 leading-relaxed max-w-sm">
                      Hemos extraído estas habilidades de tu CV. Afínalas: quita las que no apliquen,
                      añade nuevas y confirma tu selección.
                    </p>

                    <SkillsTerminalIllustration skillsCount={hardSkills.length + softSkills.length} />
                  </div>

                  <div className="flex flex-col gap-5">
                    {errorStr && (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                        {errorStr}
                      </div>
                    )}

                    <div className="flex gap-2 p-1 bg-neutral-100 rounded-full w-fit">
                      <button
                        type="button"
                        onClick={() => setSkillsTab("hard")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                          skillsTab === "hard"
                            ? "bg-black text-white shadow-sm"
                            : "text-neutral-600 hover:text-black"
                        }`}
                      >
                        <Code2 className="h-4 w-4 shrink-0" />
                        Técnicas
                      </button>
                      <button
                        type="button"
                        onClick={() => setSkillsTab("soft")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition ${
                          skillsTab === "soft"
                            ? "bg-black text-white shadow-sm"
                            : "text-neutral-600 hover:text-black"
                        }`}
                      >
                        <Users className="h-4 w-4 shrink-0" />
                        Blandas
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h3 className="text-sm font-black text-black">
                          {skillsTab === "hard"
                            ? "Habilidades Técnicas seleccionadas"
                            : "Habilidades Blandas seleccionadas"}
                        </h3>
                        <div className="min-h-[110px] sm:min-h-[120px] rounded-2xl border-2 border-neutral-200 bg-white p-3 sm:p-4">
                          {(skillsTab === "hard" ? hardSkills : softSkills).length > 0 ? (
                            <div className="flex flex-wrap gap-2 items-start content-start">
                              <AnimatePresence mode="popLayout">
                                {(skillsTab === "hard" ? hardSkills : softSkills).map((s) => (
                                  <motion.span
                                    key={s}
                                    layout
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ duration: 0.15 }}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-bold rounded-full"
                                  >
                                    {s}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (skillsTab === "hard") {
                                          removeTag(hardSkills, setHardSkills, s);
                                        } else {
                                          removeTag(softSkills, setSoftSkills, s);
                                        }
                                      }}
                                      className="hover:text-neutral-300 transition"
                                      aria-label={`Quitar ${s}`}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </motion.span>
                                ))}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <p className="text-sm text-neutral-400 leading-relaxed">
                              Aún no has seleccionado habilidades. Elige una sugerencia o escribe la tuya
                              abajo.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor={skillsTab === "hard" ? "hard-skill-input" : "soft-skill-input"}
                          className="text-xs font-bold text-neutral-600"
                        >
                          Añadir habilidad personalizada
                        </label>
                        {skillsTab === "hard" ? (
                          <input
                            id="hard-skill-input"
                            ref={hardInputRef}
                            value={hardInput}
                            onChange={(e) => setHardInput(e.target.value)}
                            onKeyDown={handleHardKeyDown}
                            placeholder="Escribe y presiona Enter..."
                            className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 bg-white text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black/10"
                          />
                        ) : (
                          <input
                            id="soft-skill-input"
                            ref={softInputRef}
                            value={softInput}
                            onChange={(e) => setSoftInput(e.target.value)}
                            onKeyDown={handleSoftKeyDown}
                            placeholder="Escribe y presiona Enter..."
                            className="w-full px-4 py-3 rounded-2xl border-2 border-neutral-200 bg-white text-sm text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black/10"
                          />
                        )}
                        <p className="text-[11px] text-neutral-400">
                          Presiona &apos;Enter&apos; o coma para añadir una habilidad personalizada.
                        </p>
                      </div>

                      {(() => {
                        const pool =
                          skillsTab === "hard"
                            ? careerSkills.filter((s) => !hardSkills.includes(s))
                            : GENERIC_SOFT_SKILLS.filter((s) => !softSkills.includes(s));
                        if (pool.length === 0) return null;
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                              <p className="text-sm font-bold text-black">Sugerencias de tu perfil</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {pool.slice(0, 8).map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    if (skillsTab === "hard") {
                                      setHardSkills([...hardSkills, tag]);
                                    } else {
                                      setSoftSkills([...softSkills, tag]);
                                    }
                                    setErrorStr(null);
                                  }}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full border border-neutral-200 bg-white text-neutral-600 hover:border-black hover:text-black transition"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-auto border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorStr(null);
                          setStep(3);
                        }}
                        className="flex items-center gap-1.5 text-sm font-bold text-black hover:text-neutral-600 transition"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Atrás
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition"
                      >
                        Siguiente
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 5: Resumen y finalizar */}
              {step === 5 && !completed && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 lg:items-stretch">
                  <div className="flex flex-col min-h-0 lg:min-h-[520px]">
                    <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black uppercase tracking-wider">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      Paso final
                    </span>

                    <div className="flex items-center gap-2.5 mt-6 sm:mt-8">
                      <ClipboardCheck className="h-6 w-6 sm:h-7 sm:w-7 text-[#B50E30] shrink-0" />
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                        Resume tu Perfil
                      </h2>
                    </div>
                    <p className="text-sm text-neutral-500 mt-4 leading-relaxed max-w-sm">
                      Revisa que todo esté correcto antes de continuar. Luego generaremos tu CV
                      profesional y pasaremos al análisis ATS inteligente.
                    </p>

                    <ProfileReviewIllustration />
                  </div>

                  <div className="flex flex-col gap-4">
                    {errorStr && (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">
                        {errorStr}
                      </div>
                    )}

                    <div className="rounded-2xl border-2 border-neutral-200 bg-white p-4 sm:p-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-black text-white flex items-center justify-center text-lg font-black">
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-base sm:text-lg font-black text-black leading-tight">{name}</p>
                          <p className="text-sm font-bold text-[#B50E30] mt-0.5">
                            {career} · {semester}° Ciclo
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-600">
                        {contactEmail && (
                          <span className="inline-flex items-center gap-1.5 min-w-0">
                            <Mail className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            <span className="truncate">{contactEmail}</span>
                          </span>
                        )}
                        {contactPhone && (
                          <span className="inline-flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 text-neutral-400 shrink-0" />
                            {contactPhone}
                          </span>
                        )}
                        {contactLinkedin && (
                          <span className="inline-flex items-center gap-1.5 min-w-0">
                            <Linkedin className="h-3.5 w-3.5 text-[#0A66C2] shrink-0" />
                            <span className="truncate">{formatLinkedinDisplay(contactLinkedin)}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl border-2 border-neutral-200 bg-white p-4 space-y-3">
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                          <LineChart className="h-3.5 w-3.5 shrink-0" />
                          Experiencia
                        </p>
                        <div className="flex items-center gap-3">
                          {(() => {
                            const opt = EXPERIENCE_OPTIONS.find((o) => o.id === experienceLevel);
                            const Icon = opt?.icon ?? Circle;
                            return (
                              <div className="shrink-0 w-9 h-9 rounded-full border-2 border-neutral-200 flex items-center justify-center">
                                <Icon className="h-4 w-4 text-neutral-400" strokeWidth={1.75} />
                              </div>
                            );
                          })()}
                          <div className="min-w-0">
                            <p className="text-sm font-black text-black leading-tight">
                              {EXPERIENCE_SUMMARY[experienceLevel]?.short ??
                                EXPERIENCE_OPTIONS.find((o) => o.id === experienceLevel)?.title ??
                                "Sin definir"}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                              {EXPERIENCE_SUMMARY[experienceLevel]?.sub ??
                                EXPERIENCE_OPTIONS.find((o) => o.id === experienceLevel)?.description ??
                                ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border-2 border-neutral-200 bg-white p-4 space-y-3">
                        <p className="text-[10px] font-black text-[#B50E30] uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="h-3.5 w-3.5 shrink-0" />
                          Especialización
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {specializations.map((s) => (
                            <span
                              key={s}
                              className="px-2.5 py-1 text-[11px] font-semibold rounded-full border border-neutral-200 bg-white text-neutral-700"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-neutral-200 bg-white p-4 sm:p-5 space-y-4">
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Settings2 className="h-3.5 w-3.5 shrink-0" />
                        Stack y habilidades
                      </p>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Técnicas
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {hardSkills.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[11px] font-bold rounded-full"
                            >
                              <span className="font-mono text-[10px] opacity-80">&gt;_</span>
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Blandas
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {softSkills.map((s) => (
                            <span
                              key={s}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-full border border-neutral-200 bg-white text-neutral-700"
                            >
                              <Users className="h-3 w-3 text-neutral-400 shrink-0" />
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-auto border-t border-neutral-100">
                      <button
                        type="button"
                        onClick={() => {
                          setErrorStr(null);
                          setStep(4);
                        }}
                        className="flex items-center gap-1.5 text-sm font-bold text-black hover:text-neutral-600 transition"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Atrás
                      </button>
                      <motion.button
                        type="button"
                        onClick={handleFinish}
                        disabled={isGenerating}
                        whileTap={isGenerating ? {} : { scale: 0.97 }}
                        className={`flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-black rounded-full transition shadow-[0_4px_14px_rgba(181,14,48,0.35)] ${
                          isGenerating
                            ? "bg-[#B50E30]/70 text-white/80 cursor-not-allowed"
                            : "bg-[#B50E30] text-white hover:bg-[#85061B]"
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generando CV...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 shrink-0" />
                            Generar CV y continuar
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}

              {!completed && step !== 2 && step !== 3 && step !== 4 && step !== 5 && (
                <>
              {errorStr && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">{errorStr}</div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setErrorStr(null);
                    setStep((s) => Math.max(1, s - 1));
                  }}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition disabled:opacity-30 disabled:hover:bg-black"
                >
                  <UvpIcon name="informacion" size={16} className="text-current" />
                  Atrás
                </button>

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition"
                  >
                    Siguiente
                    <UvpIcon name="buscar" size={16} className="text-white" />
                  </button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleFinish}
                    disabled={isGenerating}
                    whileTap={isGenerating ? {} : { scale: 0.97 }}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-black rounded-xl transition ${
                      isGenerating
                        ? "bg-[#B50E30]/70 text-white/80 cursor-not-allowed"
                        : "bg-[#B50E30] text-white hover:bg-[#85061B]"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generando CV...
                      </>
                    ) : (
                      <>
                        <UvpIcon name="crecimiento-personal" size={16} className="text-white" />
                        Generar CV y continuar
                        <UvpIcon name="buscar" size={16} className="text-white" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
              </>
              )}
            </motion.div>
            </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
      </div>
    </div>

    {portalReady && createPortal(successModal, document.body)}
    {portalReady && !completed && createPortal(
      <KairosGuide
        placement="floating"
        cards={kairosCards}
        cardIndex={kairosCardIndex}
        onCardIndexChange={setKairosCardIndex}
        open={kairosOpen}
        onClose={() => setKairosOpen(false)}
        onOpen={() => {
          setKairosOpen(true);
          setKairosCardIndex(0);
        }}
      />,
      document.body,
    )}
    </>
  );
}
