import React, { useState, useRef, useEffect } from "react";
import {
  User, Edit3, Check, Plus, Trash2, Code, Compass,
  GraduationCap, Target, Sparkles, BrainCircuit,
  Camera, BookOpen, TrendingUp, Award, ChevronRight,
  Briefcase, MapPin, X, Flame, Shield, Star,
  BarChart2, Layers, Trophy, Cpu, FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CognitivePoint { subject: string; A: number; B: number }
interface PersonalityTrait {
  name: string; userScore: number; averageScore: number;
  leftLabel: string; rightLabel: string; icon: React.ReactNode;
}
interface Achievement { id: string; label: string; icon: React.ReactNode; unlocked: boolean; xp: number }
interface UserProfile {
  name: string; career: string; targetRole: string; bio: string;
  semester: number; experienceLevel: string; location: string;
  avatarUrl?: string; currentSkills: string[]; interests: string[];
  cognitiveProfile: CognitivePoint[]; personalityTraits: PersonalityTrait[];
  achievements: Achievement[];
  level: number; xp: number; xpToNext: number;
  completedCourses: number; completedMissions: number; totalMissions: number;
  streak: number;
}

interface UserProfilePanelProps {
  onNavigateToMyCourses?: () => void;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_PROFILE: UserProfile = {
  name: "Valeria Alva",
  career: "Ingeniería de Sistemas",
  targetRole: "Junior Full Stack Developer",
  bio: "Apasionada por la tecnología y el desarrollo de software. Busco especializarme en desarrollo full stack y contribuir a proyectos de alto impacto. Me motiva aprender nuevas tecnologías y aplicarlas a problemas reales.",
  semester: 7,
  experienceLevel: "Proyectos personales o académicos de alta exigencia",
  location: "Lima, Perú",
  currentSkills: ["HTML/CSS", "JavaScript", "TypeScript", "React", "SQL Server"],
  interests: ["Inteligencia Artificial", "Cloud Computing", "Desarrollo Web"],
  cognitiveProfile: [
    { subject: "Lógica", A: 85, B: 65 },
    { subject: "Analítico", A: 78, B: 60 },
    { subject: "Memoria", A: 70, B: 68 },
    { subject: "Verbal", A: 65, B: 72 },
    { subject: "Numérico", A: 90, B: 63 },
    { subject: "Espacial", A: 60, B: 58 },
  ],
  personalityTraits: [
    { name: "Apertura a la experiencia", userScore: 75, averageScore: 55, leftLabel: "Convencional", rightLabel: "Innovador", icon: <Sparkles className="h-3.5 w-3.5" /> },
    { name: "Responsabilidad", userScore: 82, averageScore: 60, leftLabel: "Flexible", rightLabel: "Metódico", icon: <Shield className="h-3.5 w-3.5" /> },
    { name: "Tolerancia al riesgo", userScore: 58, averageScore: 50, leftLabel: "Conservador", rightLabel: "Arriesgado", icon: <Flame className="h-3.5 w-3.5" /> },
    { name: "Trabajo en equipo", userScore: 70, averageScore: 65, leftLabel: "Independiente", rightLabel: "Colaborativo", icon: <Layers className="h-3.5 w-3.5" /> },
  ],
  achievements: [
    { id: "a1", label: "Primera lección", icon: <Star className="h-4 w-4" />, unlocked: true, xp: 50 },
    { id: "a2", label: "Racha 7 días", icon: <Flame className="h-4 w-4" />, unlocked: true, xp: 100 },
    { id: "a3", label: "Curso completado", icon: <Trophy className="h-4 w-4" />, unlocked: true, xp: 300 },
    { id: "a4", label: "SQL Master", icon: <Cpu className="h-4 w-4" />, unlocked: false, xp: 500 },
    { id: "a5", label: "Top 10%", icon: <Award className="h-4 w-4" />, unlocked: false, xp: 750 },
    { id: "a6", label: "Certificado UTP+", icon: <Shield className="h-4 w-4" />, unlocked: false, xp: 1000 },
  ],
  level: 2, xp: 320, xpToNext: 500,
  completedCourses: 1, completedMissions: 2, totalMissions: 8, streak: 5,
};

const SKILL_LEVELS: Record<string, number> = {
  "HTML/CSS": 85, JavaScript: 70, TypeScript: 60, React: 65, "SQL Server": 55,
};

type Tab = "perfil" | "habilidades" | "analisis" | "logros";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "perfil", label: "Perfil", icon: <User className="h-4 w-4" /> },
  { id: "habilidades", label: "Habilidades", icon: <Code className="h-4 w-4" /> },
  { id: "analisis", label: "Análisis", icon: <BrainCircuit className="h-4 w-4" /> },
  { id: "logros", label: "Logros", icon: <Trophy className="h-4 w-4" /> },
];

// ─── Progress ring ────────────────────────────────────────────────────────────

function ProgressRing({ percent, size = 110, stroke = 6, color = "#B50E30", children }: {
  percent: number; size?: number; stroke?: number; color?: string; children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const [p, setP] = useState(0);
  useEffect(() => { const t = setTimeout(() => setP(percent), 120); return () => clearTimeout(t); }, [percent]);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={circ - (circ * p) / 100}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

// ─── Trait slider ─────────────────────────────────────────────────────────────

function TraitSlider({ trait, index }: { trait: PersonalityTrait; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="group p-4 rounded-lg border border-transparent hover:border-neutral-200 hover:bg-white transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`text-[#B50E30] transition-transform duration-300 ${hovered ? "scale-125" : ""}`}>{trait.icon}</div>
          <span className="text-xs font-black uppercase tracking-wide text-black">{trait.name}</span>
        </div>
        <motion.span animate={{ color: hovered ? "#B50E30" : "#9ca3af" }} className="text-sm font-black">
          {trait.userScore}%
        </motion.span>
      </div>
      <div className="relative h-2 bg-neutral-100 rounded-full overflow-visible mb-2">
        <div className="absolute top-1/2 -translate-y-1/2 w-2 h-4 bg-neutral-300 z-10 rounded-sm"
          style={{ left: `calc(${trait.averageScore}% - 4px)` }} />
        <motion.div initial={{ width: 0 }} animate={{ width: `${trait.userScore}%` }}
          transition={{ duration: 1, delay: index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute h-full bg-gradient-to-r from-[#B50E30]/60 to-[#B50E30] rounded-full" />
        <motion.div initial={{ left: 0 }} animate={{ left: `calc(${trait.userScore}% - 8px)` }}
          transition={{ duration: 1, delay: index * 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          whileHover={{ scale: 1.4 }}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#B50E30] border-2 border-white shadow-lg z-20 rounded-full cursor-pointer" />
      </div>
      <div className="flex justify-between text-[9px] font-bold uppercase text-neutral-400">
        <span>{trait.leftLabel}</span><span>{trait.rightLabel}</span>
      </div>
    </motion.div>
  );
}

// ─── Skill bar ────────────────────────────────────────────────────────────────

function SkillBar({ skill, index, onRemove }: { skill: string; index: number; onRemove: () => void }) {
  const level = SKILL_LEVELS[skill] ?? Math.floor(Math.random() * 40 + 40);
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.06 }}
      onHoverStart={() => setHovered(true)} onHoverEnd={() => setHovered(false)}
      className="group flex items-center gap-3"
    >
      <div className="w-20 text-[10px] font-black uppercase text-right text-neutral-600 shrink-0">{skill}</div>
      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${level}%` }}
          transition={{ duration: 0.9, delay: index * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
          className={`h-full rounded-full transition-all ${hovered ? "bg-[#B50E30]" : "bg-gradient-to-r from-neutral-400 to-neutral-600"}`} />
      </div>
      <div className="w-8 text-[10px] font-black text-neutral-500 shrink-0">{level}%</div>
      <motion.button initial={{ opacity: 0 }} animate={{ opacity: hovered ? 1 : 0 }} type="button"
        onClick={onRemove} className="text-neutral-400 hover:text-[#B50E30] transition-colors cursor-pointer">
        <X className="h-3.5 w-3.5" />
      </motion.button>
    </motion.div>
  );
}

// ─── Achievement badge ────────────────────────────────────────────────────────

function AchievementBadge({ achievement, delay }: { achievement: Achievement; delay: number }) {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", bounce: 0.4 }}
      className="relative flex flex-col items-center gap-2"
      onHoverStart={() => setShowTooltip(true)} onHoverEnd={() => setShowTooltip(false)}
    >
      <motion.div whileHover={{ scale: 1.15, y: -4 }} whileTap={{ scale: 0.95 }}
        className={`h-14 w-14 flex items-center justify-center border-2 cursor-pointer transition-all ${
          achievement.unlocked ? "bg-[#B50E30] border-[#B50E30] text-white shadow-lg shadow-[#B50E30]/30" : "bg-neutral-100 border-neutral-200 text-neutral-300"
        }`}>
        {achievement.icon}
      </motion.div>
      <span className={`text-[9px] font-black uppercase tracking-wide text-center leading-tight max-w-[60px] ${achievement.unlocked ? "text-black" : "text-neutral-400"}`}>
        {achievement.label}
      </span>
      <AnimatePresence>
        {showTooltip && (
          <motion.div initial={{ opacity: 0, y: 4, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-bold px-2 py-1 whitespace-nowrap z-50 pointer-events-none">
            {achievement.unlocked ? `+${achievement.xp} XP desbloqueado` : `Necesitas +${achievement.xp} XP`}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function UserProfilePanel({ onNavigateToMyCourses }: UserProfilePanelProps) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<Tab>("perfil");
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(profile.bio);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xpPercent = Math.round((profile.xp / profile.xpToNext) * 100);

  const handleSave = () => {
    setProfile((p) => ({ ...p, bio: editedBio }));
    setIsEditing(false);
  };
  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newSkill.trim().toUpperCase();
    if (!val || profile.currentSkills.includes(val)) return;
    setProfile((p) => ({ ...p, currentSkills: [...p.currentSkills, val] }));
    setNewSkill("");
  };
  const addInterest = (e: React.FormEvent) => {
    e.preventDefault();
    const val = newInterest.trim().toUpperCase();
    if (!val || profile.interests.includes(val)) return;
    setProfile((p) => ({ ...p, interests: [...p.interests, val] }));
    setNewInterest("");
  };

  return (
    <div className="w-full flex-1 flex flex-col -m-6">
      <div className="max-w-6xl w-full mx-auto space-y-5 flex-1 py-6 px-6">

        {/* ── Hero banner ───────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white border border-neutral-200 overflow-hidden relative shadow-sm"
        >
          {/* Animated top bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{ originX: 0 }}
            className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#B50E30] via-[#e0173a] to-[#B50E30]"
          />

          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-start gap-6">

              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1, type: "spring", bounce: 0.3 }}
                className="relative shrink-0"
              >
                <ProgressRing percent={xpPercent} size={110} stroke={6} color="#B50E30">
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="h-20 w-20 bg-neutral-100 overflow-hidden border-2 border-neutral-200 cursor-pointer relative group rounded-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {profile.avatarUrl
                      ? <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-2xl font-black text-neutral-600 bg-gradient-to-br from-neutral-100 to-neutral-200">{profile.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}</div>
                    }
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-[#B50E30]/70 flex items-center justify-center"
                    >
                      <Camera className="h-4 w-4 text-white" />
                    </motion.div>
                  </motion.div>
                </ProgressRing>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const r = new FileReader();
                  r.onload = (ev) => setProfile((p) => ({ ...p, avatarUrl: ev.target?.result as string }));
                  r.readAsDataURL(f);
                }} />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", bounce: 0.5 }}
                  className="absolute -bottom-1 -right-1"
                >
                  <motion.div
                    animate={{ boxShadow: ["0 0 0 0 rgba(181,14,48,0.4)", "0 0 0 6px rgba(181,14,48,0)", "0 0 0 0 rgba(181,14,48,0)"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    className="bg-[#B50E30] text-white text-[9px] font-black px-2 py-0.5 border border-white"
                  >
                    LVL {profile.level}
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Identidad + XP */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="min-w-0 space-y-1"
              >
                <>
                  <motion.h1
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-black text-black uppercase tracking-tight"
                  >
                    {profile.name}
                  </motion.h1>
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
                    className="text-neutral-500 text-[11px] font-bold">
                    {profile.career} · {profile.semester}° Ciclo
                  </motion.p>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.34 }}
                    className="flex items-center gap-1.5 text-[#B50E30] text-[11px] font-bold">
                    <Target className="h-3 w-3 shrink-0" /> {profile.targetRole}
                  </motion.div>
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 text-[10px] font-bold text-neutral-400">
                    <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{profile.location}</span>
                    <motion.span
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                      className="flex items-center gap-1 text-orange-400"
                    >
                      <Flame className="h-2.5 w-2.5" />{profile.streak} días
                    </motion.span>
                  </motion.div>
                </>

                {/* XP bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="pt-1 space-y-0.5 w-52"
                >
                  <div className="flex justify-between text-[9px] font-black uppercase">
                    <span className="text-neutral-400">XP — {profile.xp.toLocaleString()} / {profile.xpToNext.toLocaleString()}</span>
                    <span className="text-[#B50E30]">{xpPercent}%</span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${xpPercent}%` }}
                      transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#B50E30] to-[#e0173a] rounded-full relative"
                    >
                      <motion.div
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="hidden md:block w-px bg-neutral-100 self-stretch mx-1"
              />

              {/* Acerca de mí */}
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.25 }}
                className="hidden md:flex flex-col justify-center flex-1 space-y-1.5"
              >
                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-[#B50E30]" /> Acerca de mí
                </p>
                {isEditing ? (
                  <textarea value={editedBio} onChange={(e) => setEditedBio(e.target.value)} rows={4}
                    className="w-full text-xs text-neutral-700 font-medium leading-relaxed border border-neutral-200 focus:border-[#B50E30] outline-none bg-neutral-50 p-2 resize-none transition-colors" />
                ) : (
                  <p className="text-xs text-neutral-500 font-medium leading-relaxed">{profile.bio}</p>
                )}
              </motion.div>

              {/* Botones */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col gap-2 shrink-0 items-end"
              >
                {isEditing ? (
                  <>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      type="button" onClick={handleSave}
                      className="flex items-center gap-1.5 bg-[#B50E30] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 cursor-pointer hover:bg-[#9a0b28] transition whitespace-nowrap">
                      <Check className="h-3.5 w-3.5" /> Guardar
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      type="button" onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 border border-neutral-300 text-neutral-500 text-[10px] font-black uppercase px-4 py-2.5 cursor-pointer hover:border-neutral-400 transition whitespace-nowrap">
                      <X className="h-3.5 w-3.5" /> Cancelar
                    </motion.button>
                  </>
                ) : (
                  <>
                    <motion.button whileHover={{ scale: 1.03, borderColor: "#000" }} whileTap={{ scale: 0.97 }}
                      type="button" onClick={() => setIsEditing(true)}
                      className="flex items-center gap-1.5 border border-neutral-300 text-neutral-600 text-[10px] font-black uppercase tracking-widest px-4 py-2.5 cursor-pointer hover:text-black transition whitespace-nowrap">
                      <Edit3 className="h-3.5 w-3.5" /> Editar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03, backgroundColor: "#9a0b28" }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={onNavigateToMyCourses}
                      className="flex items-center gap-1.5 bg-[#B50E30] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 cursor-pointer transition whitespace-nowrap">
                      <BookOpen className="h-3.5 w-3.5" /> Mis Cursos
                    </motion.button>
                  </>
                )}
              </motion.div>

            </div>
          </div>

          {/* Stats strip */}
          <div className="border-t border-neutral-100 grid grid-cols-4">
            {[
              { label: "Cursos", value: profile.completedCourses, icon: <BookOpen className="h-3.5 w-3.5" /> },
              { label: "Misiones", value: `${profile.completedMissions}/${profile.totalMissions}`, icon: <Award className="h-3.5 w-3.5" /> },
              { label: "Racha", value: `${profile.streak}d`, icon: <Flame className="h-3.5 w-3.5 text-orange-500" /> },
              { label: "Nivel", value: `Lvl ${profile.level}`, icon: <TrendingUp className="h-3.5 w-3.5 text-[#B50E30]" />, accent: true },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
                whileHover={{ backgroundColor: (s as any).accent ? "rgba(181,14,48,0.08)" : "#f9fafb" }}
                className={`px-4 py-3.5 flex items-center gap-2.5 border-r border-neutral-100 last:border-r-0 cursor-default transition-colors ${(s as any).accent ? "bg-[#B50E30]/5" : ""}`}
              >
                <motion.span
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-neutral-400"
                >
                  {s.icon}
                </motion.span>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{s.label}</p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.07 }}
                    className={`text-sm font-black ${(s as any).accent ? "text-[#B50E30]" : "text-black"}`}
                  >
                    {s.value}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Tabs ─────────────────────────────────────────────────────────── */}
        <div className="bg-white border border-neutral-200 flex overflow-hidden">
          {TABS.map((tab) => (
            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 flex items-center justify-center gap-2 py-3.5 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-colors ${
                activeTab === tab.id ? "text-[#B50E30] bg-white" : "text-neutral-400 hover:text-black bg-neutral-50"
              }`}>
              {activeTab === tab.id && <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B50E30]" />}
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab content ──────────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>

            {/* PERFIL */}
            {activeTab === "perfil" && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white border border-neutral-200 p-5 space-y-3">
                    <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-3 border-b border-neutral-100">
                      <User className="h-3.5 w-3.5 text-[#B50E30]" /> Información académica
                    </h3>
                    {[
                      { icon: <GraduationCap className="h-4 w-4" />, label: "Ciclo", value: `${profile.semester}° Ciclo Universitario` },
                      { icon: <Briefcase className="h-4 w-4" />, label: "Experiencia", value: profile.experienceLevel },
                      { icon: <Target className="h-4 w-4" />, label: "Objetivo", value: profile.targetRole },
                      { icon: <MapPin className="h-4 w-4" />, label: "Ubicación", value: profile.location },
                    ].map((item, i) => (
                      <motion.div key={item.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        whileHover={{ x: 4 }} className="flex items-center gap-3 p-3 bg-neutral-50 border border-neutral-100 hover:border-neutral-300 transition-all cursor-default">
                        <div className="text-[#B50E30] shrink-0">{item.icon}</div>
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">{item.label}</p>
                          <p className="text-xs font-bold text-black mt-0.5">{item.value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="bg-white border border-neutral-200 p-5 space-y-4">
                    <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-3 border-b border-neutral-100">
                      <Compass className="h-3.5 w-3.5 text-[#B50E30]" /> Áreas de interés
                    </h3>
                    <form onSubmit={addInterest} className="flex gap-2">
                      <input value={newInterest} onChange={(e) => setNewInterest(e.target.value)} placeholder="Añadir área..."
                        className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 focus:border-[#B50E30] outline-none text-xs font-bold transition-colors" />
                      <button type="submit" className="px-3 bg-black hover:bg-[#B50E30] text-white transition-colors cursor-pointer flex items-center">
                        <Plus className="h-4 w-4" />
                      </button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence>
                        {profile.interests.map((item) => (
                          <motion.span key={item} layout initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.7, opacity: 0 }}
                            whileHover={{ scale: 1.08 }}
                            onClick={() => setProfile((p) => ({ ...p, interests: p.interests.filter((x) => x !== item) }))}
                            className="group relative inline-flex items-center gap-1.5 bg-[#B50E30] text-white text-[10px] font-black uppercase px-3 py-1.5 cursor-pointer overflow-hidden">
                            <span className="relative z-10">{item}</span>
                            <X className="h-3 w-3 relative z-10 opacity-40 group-hover:opacity-100 text-black transition-opacity stroke-[3]" />
                            <div className="absolute inset-0 bg-[#85061B] translate-y-full group-hover:translate-y-0 transition-transform duration-200" />
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.005 }}
                  onClick={onNavigateToMyCourses}
                  className="bg-white border border-neutral-200 hover:border-[#B50E30]/30 p-5 flex items-center justify-between gap-4 cursor-pointer group transition-all">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-[#B50E30] flex items-center justify-center shrink-0">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Siguiente paso recomendado por IA</p>
                      <p className="text-sm font-black text-black mt-0.5">Completa "SQL y Gestión de Datos" para +350 XP</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5 font-medium">67% restante · 4 lecciones pendientes</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-black uppercase text-[#B50E30] group-hover:underline">Ir al curso</span>
                    <ChevronRight className="h-4 w-4 text-[#B50E30] group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              </div>
            )}

            {/* HABILIDADES */}
            {activeTab === "habilidades" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white border border-neutral-200 p-5 space-y-4">
                  <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-3 border-b border-neutral-100">
                    <BarChart2 className="h-3.5 w-3.5 text-[#B50E30]" /> Tech Skills
                  </h3>
                  <div className="space-y-4">
                    <AnimatePresence>
                      {profile.currentSkills.map((s, i) => (
                        <SkillBar key={s} skill={s} index={i}
                          onRemove={() => setProfile((p) => ({ ...p, currentSkills: p.currentSkills.filter((x) => x !== s) }))} />
                      ))}
                    </AnimatePresence>
                  </div>
                  <form onSubmit={addSkill} className="flex gap-2 pt-2 border-t border-neutral-100">
                    <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Nueva skill..."
                      className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 focus:border-[#B50E30] outline-none text-xs font-bold transition-colors" />
                    <button type="submit" className="px-3 bg-black hover:bg-[#B50E30] text-white transition-colors cursor-pointer flex items-center">
                      <Plus className="h-4 w-4" />
                    </button>
                  </form>
                </div>
                <div className="bg-white border border-neutral-200 p-5 space-y-3">
                  <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-3 border-b border-neutral-100">
                    <Target className="h-3.5 w-3.5 text-[#B50E30]" /> Skills por desarrollar
                  </h3>
                  {[
                    { skill: "MACHINE LEARNING", pct: 20, priority: "Alta" },
                    { skill: "SPARK", pct: 10, priority: "Media" },
                    { skill: "LOOKER", pct: 15, priority: "Media" },
                    { skill: "DBT", pct: 5, priority: "Baja" },
                  ].map((item, i) => (
                    <motion.div key={item.skill} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-3 group">
                      <div className="w-28 text-[10px] font-black uppercase text-neutral-500 shrink-0 group-hover:text-black transition-colors">{item.skill}</div>
                      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 0.8, delay: i * 0.07 }}
                          className="h-full bg-neutral-300 rounded-full" />
                      </div>
                      <span className={`text-[9px] font-black uppercase shrink-0 ${item.priority === "Alta" ? "text-[#B50E30]" : item.priority === "Media" ? "text-amber-500" : "text-neutral-400"}`}>
                        {item.priority}
                      </span>
                    </motion.div>
                  ))}
                  <div className="pt-3 border-t border-neutral-100 mt-2">
                    <button type="button"
                      className="w-full py-2.5 border border-dashed border-neutral-300 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:border-[#B50E30] hover:text-[#B50E30] transition-all cursor-pointer">
                      + Ver plan de desarrollo completo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ANÁLISIS */}
            {activeTab === "analisis" && (
              <div className="space-y-5">
                <div className="bg-white border border-neutral-200 p-5">
                  <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-3 border-b border-neutral-100 mb-4">
                    <BrainCircuit className="h-3.5 w-3.5 text-[#B50E30]" /> Razonamiento cognitivo
                  </h3>
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-full md:w-1/2 h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={profile.cognitiveProfile}>
                          <PolarGrid stroke="#f0f0f0" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#000", fontSize: 10, fontWeight: 900 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar name="Tú" dataKey="A" stroke="#B50E30" fill="#B50E30" fillOpacity={0.15} strokeWidth={2.5} />
                          <Radar name="Promedio" dataKey="B" stroke="#d1d5db" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
                          <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e5e5e5", borderRadius: 0, fontSize: 11, fontWeight: "bold" }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 space-y-3">
                      {profile.cognitiveProfile.map((d, i) => (
                        <motion.div key={d.subject} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="space-y-1 group">
                          <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-black group-hover:text-[#B50E30] transition-colors">{d.subject}</span>
                            <span className="text-neutral-400">{d.A}% <span className="text-neutral-300 font-medium">/ avg {d.B}%</span></span>
                          </div>
                          <div className="relative h-1.5 bg-neutral-100 rounded-full">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${d.B}%` }} transition={{ duration: 0.6, delay: i * 0.07 }}
                              className="absolute h-full bg-neutral-200 rounded-full" />
                            <motion.div initial={{ width: 0 }} animate={{ width: `${d.A}%` }} transition={{ duration: 0.9, delay: i * 0.07, ease: [0.34, 1.56, 0.64, 1] }}
                              className="absolute h-full bg-[#B50E30] rounded-full" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 p-5">
                  <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-3 border-b border-neutral-100 mb-2">
                    <Layers className="h-3.5 w-3.5 text-[#B50E30]" /> Rasgos personales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    {profile.personalityTraits.map((t, i) => <TraitSlider key={t.name} trait={t} index={i} />)}
                  </div>
                </div>
              </div>
            )}

            {/* LOGROS */}
            {activeTab === "logros" && (
              <div className="space-y-5">
                <div className="bg-white border border-neutral-200 p-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 pb-3 border-b border-neutral-100 mb-6">
                    <Trophy className="h-3.5 w-3.5 text-[#B50E30]" /> Insignias desbloqueadas
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {profile.achievements.map((a, i) => <AchievementBadge key={a.id} achievement={a} delay={i * 0.08} />)}
                  </div>
                </div>
                <div className="bg-white border border-neutral-200 p-5 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-2 pb-3 border-b border-neutral-100">
                    <TrendingUp className="h-3.5 w-3.5 text-[#B50E30]" /> Historial de actividad
                  </h3>
                  <div className="space-y-2">
                    {[
                      { action: "Completaste 'Tipos de datos y restricciones'", xp: "+15 XP", date: "Hoy" },
                      { action: "Completaste 'Introducción al modelamiento relacional'", xp: "+15 XP", date: "Ayer" },
                      { action: "Inscripción a SQL y Gestión de Datos", xp: "+50 XP", date: "Hace 3 días" },
                      { action: "Lograste la misión: 'Primer contacto'", xp: "+100 XP", date: "Hace 5 días" },
                    ].map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                        className="flex items-center justify-between gap-3 p-3 bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-all">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-[#B50E30] shrink-0" />
                          <p className="text-xs font-bold text-black truncate">{item.action}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[10px] font-black text-[#B50E30]">{item.xp}</p>
                          <p className="text-[9px] text-neutral-400 font-bold">{item.date}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
