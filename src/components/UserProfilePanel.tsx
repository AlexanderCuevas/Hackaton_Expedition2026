import React, { useState, useRef } from "react";
import { 
  User, Edit3, Check, Plus, Trash2, Code, Compass, 
  GraduationCap, Target, Zap, Sparkles, BrainCircuit, LineChart,
  Camera, Info, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfile, SkillGap, CareerMission } from "../types";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from "recharts";

interface UserProfilePanelProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  gaps: SkillGap[];
  missions: CareerMission[];
  onNavigateToMyCourses?: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" as const } }
};

export default function UserProfilePanel({ profile, onUpdateProfile, gaps, missions, onNavigateToMyCourses }: UserProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [editedName, setEditedName] = useState(profile.name);
  const [editedCareer, setEditedCareer] = useState(profile.career);
  const [editedRole, setEditedRole] = useState(profile.targetRole);
  const [editedSemester, setEditedSemester] = useState(profile.semester);
  const [editedExpLevel, setEditedExpLevel] = useState(profile.experienceLevel);
  
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  const handleSave = () => {
    onUpdateProfile({
      ...profile,
      name: editedName,
      career: editedCareer,
      targetRole: editedRole,
      semester: editedSemester,
      experienceLevel: editedExpLevel
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpdateProfile({ ...profile, avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || profile.currentSkills.includes(newSkill.trim().toUpperCase())) return;
    onUpdateProfile({ ...profile, currentSkills: [...profile.currentSkills, newSkill.trim().toUpperCase()] });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdateProfile({ ...profile, currentSkills: profile.currentSkills.filter(s => s !== skillToRemove) });
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim() || profile.interests.includes(newInterest.trim().toUpperCase())) return;
    onUpdateProfile({ ...profile, interests: [...profile.interests, newInterest.trim().toUpperCase()] });
    setNewInterest("");
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    onUpdateProfile({ ...profile, interests: profile.interests.filter(i => i !== interestToRemove) });
  };

  const cognitiveData = profile.cognitiveProfile ?? [];
  const traits = profile.personalityTraits ?? [];

  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === "completado").length;
  const completedSkillsCount = gaps.filter(g => g.status === "completado" || g.status === "en_progreso").length;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="bg-white rounded-none border-2 border-black p-6 relative overflow-hidden shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[6px_6px_0_rgba(181,14,48,0.2)] group/header"
      >
        <div className="absolute right-0 top-0 w-32 h-full bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] opacity-80 pointer-events-none" />
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 -right-4 w-14 h-14 bg-[#B50E30] border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.15)] flex items-center justify-center z-20"
        >
          <Sparkles className="h-7 w-7 text-white" />
        </motion.div>
        <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-[#B50E30] group-hover/header:w-3 transition-all duration-300" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pl-2">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-black uppercase tracking-wider flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
              >
                <User className="h-6 w-6 text-[#B50E30]" />
              </motion.span>
              Perfil Analítico del Estudiante
            </h2>
            <p className="text-neutral-500 text-sm font-bold">
              Visualización de competencias cognitivas y ajuste al perfil profesional.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-none transition-all flex items-center gap-2 cursor-pointer border-2 ${
                isEditing 
                  ? "bg-black border-black text-white hover:bg-neutral-800 shadow-[4px_4px_0_#B50E30]" 
                  : "bg-white border-black text-black hover:bg-neutral-50 shadow-[4px_4px_0_#000] hover:shadow-[4px_4px_0_#B50E30]"
              }`}
            >
              {isEditing ? (
                <><Check className="h-4 w-4 text-green-400" /> Guardar Cambios</>
              ) : (
                <><Edit3 className="h-4 w-4 text-[#B50E30]" /> Editar Perfil</>
              )}
            </motion.button>
            {onNavigateToMyCourses && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={onNavigateToMyCourses}
                className="px-6 py-2.5 text-xs font-black uppercase tracking-widest rounded-none transition-all flex items-center gap-2 cursor-pointer bg-[#B50E30] border-2 border-[#B50E30] text-white hover:bg-[#85061B] shadow-[4px_4px_0_#000] hover:shadow-[4px_4px_0_#B50E30]"
              >
                <BookOpen className="h-4 w-4" /> Mis Cursos
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="relative grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [-3, 3, -3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-5 -left-5 w-10 h-10 bg-black border-2 border-[#B50E30] shadow-[3px_3px_0_#B50E30] flex items-center justify-center z-10 hidden xl:flex"
        >
          <Zap className="h-5 w-5 text-white fill-white" />
        </motion.div>

        <div className="xl:col-span-4 space-y-8">
          
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-none border-2 border-black p-6 space-y-6 shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#B50E30]"
          >
            <div className="text-center space-y-4 pt-2">
              <div className="relative inline-block group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex h-28 w-28 bg-black text-white items-center justify-center text-4xl font-black rounded-none border-4 border-black transition-shadow group-hover:shadow-[0_0_20px_rgba(181,14,48,0.3)] overflow-hidden"
                >
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    profile.name.split(" ").slice(0,2).map(w => w[0]).join("")
                  )}
                </motion.div>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  className="absolute -bottom-3 -right-3 bg-[#B50E30] text-white text-[10px] font-black px-3 py-1.5 border-2 border-black uppercase tracking-wider shadow-[2px_2px_0_#000]"
                >
                  ACTIVO
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -top-3 -right-3 bg-white p-1.5 border-2 border-black text-black opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neutral-100 cursor-pointer"
                  title="Subir foto de perfil"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </div>

              <div className="pt-2">
                {isEditing ? (
                  <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} className="w-full text-center bg-white text-black border-2 border-black font-black uppercase px-2 py-1.5 text-base outline-none focus:border-[#B50E30]" />
                ) : (
                  <h3 className="text-lg font-black text-black uppercase tracking-tight">{profile.name}</h3>
                )}
                <p className="text-xs text-[#B50E30] font-bold uppercase tracking-wider mt-1">{profile.career}</p>
              </div>
            </div>

            <div className="border-t-2 border-neutral-100 pt-5 space-y-4">
              <CompactInfo icon={<Target />} label="Puesto Objetivo" value={profile.targetRole} editing={isEditing} editValue={editedRole} onEdit={setEditedRole} />
              <CompactInfo icon={<GraduationCap />} label="Nivel Académico" value={`${profile.semester}º Ciclo Universitario`} />
              <CompactInfo icon={<Code />} label="Sustento Laboral" value={profile.experienceLevel} editing={isEditing} editValue={editedExpLevel} onEdit={setEditedExpLevel} isSelect selectOptions={[
                "Sin experiencia previa",
                "Proyectos personales o académicos de alta exigencia",
                "Prácticas previas"
              ]} />
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <SkillSection
              title="Tech Skills"
              icon={<Code className="h-4 w-4 text-[#B50E30]" />}
              items={profile.currentSkills}
              onAdd={handleAddSkill}
              onRemove={handleRemoveSkill}
              inputValue={newSkill}
              setInputValue={setNewSkill}
              placeholder="Ej. REACT, PYTHON..."
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <SkillSection
              title="Áreas Clave"
              icon={<Compass className="h-4 w-4 text-[#B50E30]" />}
              items={profile.interests}
              onAdd={handleAddInterest}
              onRemove={handleRemoveInterest}
              inputValue={newInterest}
              setInputValue={setNewInterest}
              placeholder="Ej. DEVOPS, AI..."
            />
          </motion.div>

        </div>

        <div className="xl:col-span-8 space-y-8">
          
          {cognitiveData.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white rounded-none border-2 border-black overflow-hidden shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[6px_6px_0_#B50E30]"
            >
              <div className="p-4 border-b-2 border-black bg-neutral-50 flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5 text-[#B50E30]" />
                  Habilidades de Razonamiento
                </h3>
                <div className="flex gap-4 p-2 bg-white border border-neutral-200">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-black uppercase">
                    <div className="w-2.5 h-2.5 bg-[#B50E30] border border-black" />
                    Tú
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-black uppercase">
                    <div className="w-2.5 h-2.5 bg-neutral-800 border border-black" />
                    Promedio
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 space-y-5">
                  <p className="text-xs font-bold text-neutral-600 leading-relaxed">
                    Estas métricas reflejan tu capacidad general para procesar información, aprender lógicamente y resolver problemas en entornos laborales reales.
                  </p>
                  <div className="space-y-3 p-4 bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center gap-2 text-xs font-black text-black uppercase">
                      <div className="w-3 h-3 bg-[#B50E30] border border-black" />
                      Tu puntaje
                    </div>
                    <div className="flex items-center gap-2 text-xs font-black text-black uppercase">
                      <div className="w-3 h-3 border-2 border-dashed border-neutral-800 bg-transparent" />
                      Puntaje Promedio
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 h-[320px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={cognitiveData}>
                      <PolarGrid stroke="#e5e5e5" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#000', fontSize: 10, fontWeight: 900 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Tu Perfil" dataKey="A" stroke="#B50E30" fill="#B50E30" fillOpacity={0.25} strokeWidth={3} />
                      <Radar name="Promedio" dataKey="B" stroke="#111827" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '2px solid #000', borderRadius: 0, color: '#000', fontSize: '11px', fontWeight: 'bold' }}
                        itemStyle={{ color: '#000', fontWeight: 'bold' }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {traits.length > 0 && (
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="bg-white rounded-none border-2 border-black overflow-hidden shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[6px_6px_0_#B50E30]"
            >
              <div className="p-4 border-b-2 border-black bg-neutral-50 flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[#B50E30]" />
                  Rasgos Cognitivos y Emocionales
                </h3>
                <div className="hidden sm:flex gap-4 p-2 bg-white border border-neutral-200">
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-black uppercase">
                    <div className="w-2.5 h-2.5 bg-[#B50E30] border border-black" />
                    Tú
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-black text-black uppercase">
                    <div className="w-2.5 h-2.5 bg-neutral-800 border border-black" />
                    Promedio
                  </div>
                </div>
              </div>

              <div className="p-0">
                {traits.map((trait, idx) => (
                  <div
                    key={idx}
                    className={`p-6 md:p-8 space-y-4 border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-200 group ${idx === traits.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black text-black uppercase tracking-wide flex items-center gap-2">
                        {trait.name}
                        <Info className="w-3.5 h-3.5 text-[#B50E30] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </h4>
                      <span className="text-lg font-black text-[#B50E30]">{trait.userScore}%</span>
                    </div>

                    <div className="relative w-full h-3 bg-neutral-200 border-y border-neutral-300 my-4">
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-neutral-400 z-0" />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 z-10 bg-neutral-800"
                        style={{ left: `${trait.averageScore}%` }}
                        title={`Promedio General: ${trait.averageScore}%`}
                      />
                      <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: `${trait.userScore}%` }}
                        transition={{ duration: 1, delay: idx * 0.15, type: "spring", stiffness: 60 }}
                        whileHover={{ scale: 1.3 }}
                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 z-20 bg-[#B50E30] border-2 border-white shadow-[2px_2px_0_rgba(0,0,0,0.3)] cursor-crosshair"
                        title={`Tu perfil: ${trait.userScore}%`}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-neutral-500 font-bold uppercase">
                      <span className="w-1/3 text-left leading-tight group-hover:text-black transition-colors">{trait.leftLabel}</span>
                      <span className="w-1/3 text-right leading-tight group-hover:text-black transition-colors">{trait.rightLabel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="bg-white rounded-none border-2 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_#B50E30]"
          >
            <h4 className="text-sm font-black text-black uppercase tracking-widest pb-3 flex items-center gap-2 border-b-2 border-neutral-100 mb-4">
              <BookOpen className="h-5 w-5 text-[#B50E30]" />
              Compromiso Académico Logrado
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatBox label="Retos resueltos" value={`${completedMissions}/${totalMissions}`} />
              <StatBox label="Capacitaciones" value={`${completedSkillsCount}/${gaps.length}`} />
              <StatBox label="En espera" value={totalMissions - completedMissions} />
              <StatBox label="Nivel Actual" value={`Lvl ${profile.level}`} highlight />
            </div>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
}

function CompactInfo({ icon, label, value, editing, editValue, onEdit, isSelect, selectOptions }: {
  icon: React.ReactElement<{ className?: string }>;
  label: string;
  value: string;
  editing?: boolean;
  editValue?: string;
  onEdit?: (v: string) => void;
  isSelect?: boolean;
  selectOptions?: string[];
}) {
  return (
    <motion.div
      whileHover={{ x: 3 }}
      className="p-3.5 bg-neutral-50 border border-neutral-200 hover:border-black transition-all duration-200 group cursor-default"
    >
      <span className="text-[9px] uppercase font-black text-neutral-400 block mb-1">{label}</span>
      {editing && onEdit && editValue !== undefined ? (
        isSelect && selectOptions ? (
          <select value={editValue} onChange={e => onEdit(e.target.value)} className="w-full bg-white text-black border border-black font-bold uppercase px-2 py-1 text-xs outline-none focus:border-[#B50E30]">
            {selectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input type="text" value={editValue} onChange={e => onEdit(e.target.value)} className="w-full bg-white text-black border border-black font-bold uppercase px-2 py-1 text-xs outline-none focus:border-[#B50E30]" />
        )
      ) : (
        <div className="font-extrabold text-black text-sm flex items-start gap-2">
          <span className="text-[#B50E30] opacity-80 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
            {React.cloneElement(icon, { className: "w-4 h-4" })}
          </span>
          <span className="break-words whitespace-pre-wrap leading-snug">{value}</span>
        </div>
      )}
    </motion.div>
  );
}

function SkillSection({ title, icon, items, onAdd, onRemove, inputValue, setInputValue, placeholder }: {
  title: string;
  icon: React.ReactNode;
  items: string[];
  onAdd: (e: React.FormEvent) => void;
  onRemove: (item: string) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  placeholder: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-none border-2 border-black p-5 space-y-4 shadow-[6px_6px_0_rgba(0,0,0,0.1)] transition-all duration-200 hover:shadow-[6px_6px_0_#B50E30]"
    >
      <h4 className="text-sm font-black text-black uppercase tracking-widest flex items-center justify-between border-b-2 border-neutral-100 pb-2">
        <span>{title} <span className="text-neutral-400 text-[11px]">({items.length})</span></span>
        {icon}
      </h4>
      <form onSubmit={onAdd} className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 bg-neutral-50 border-2 border-black outline-none focus:border-[#B50E30] text-sm font-bold transition-colors"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="px-3 bg-black hover:bg-[#B50E30] text-white transition-colors cursor-pointer border-2 border-black shadow-[2px_2px_0_rgba(0,0,0,0.2)] flex items-center"
        >
          <Plus className="h-4 w-4" />
        </motion.button>
      </form>
      <div className="flex flex-wrap gap-2 pt-1">
        <AnimatePresence>
          {items.map((item: string) => (
            <motion.span
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              key={item}
              onClick={() => onRemove(item)}
              className="group relative bg-white text-black border-2 border-black text-xs font-bold uppercase tracking-tight px-3 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer overflow-hidden shadow-[2px_2px_0_rgba(0,0,0,0.15)]"
              title="Haz clic para remover"
            >
              <span className="relative z-10 group-hover:text-white transition-colors">{item}</span>
              <div className="absolute inset-0 bg-[#B50E30] translate-y-full group-hover:translate-y-0 transition-transform duration-200 ease-out" />
              <Trash2 className="h-3 w-3 text-[#B50E30] group-hover:text-white relative z-10 shrink-0 opacity-50 group-hover:opacity-100" />
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function StatBox({ label, value, highlight = false }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.04, y: -3 }}
      className={`p-4 text-center border-2 transition-all duration-200 ${highlight ? "bg-black border-black text-white hover:shadow-[4px_4px_0_#B50E30]" : "bg-neutral-50 border-neutral-200 hover:border-black hover:shadow-[4px_4px_0_rgba(0,0,0,0.1)]"}`}
    >
      <span className={`text-[9px] uppercase font-black block mb-1.5 ${highlight ? "text-neutral-400" : "text-neutral-500"}`}>{label}</span>
      <span className={`text-xl font-black leading-none block ${highlight ? "text-[#B50E30]" : "text-black"}`}>{value}</span>
    </motion.div>
  );
}
