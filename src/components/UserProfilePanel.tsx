import React, { useState } from "react";
import { UserProfile, SkillGap, CareerMission } from "../types";
import { 
  User, Award, Edit3, Check, Plus, Trash2, Code, Compass, 
  GraduationCap, Zap, Sparkles, Trophy, BookOpen, Key
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UserProfilePanelProps {
  profile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  gaps: SkillGap[];
  missions: CareerMission[];
}

export default function UserProfilePanel({
  profile,
  onUpdateProfile,
  gaps,
  missions
}: UserProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (profile.currentSkills.includes(newSkill.trim())) return;
    
    onUpdateProfile({
      ...profile,
      currentSkills: [...profile.currentSkills, newSkill.trim()]
    });
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onUpdateProfile({
      ...profile,
      currentSkills: profile.currentSkills.filter(s => s !== skillToRemove)
    });
  };

  const handleAddInterest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInterest.trim()) return;
    if (profile.interests.includes(newInterest.trim())) return;

    onUpdateProfile({
      ...profile,
      interests: [...profile.interests, newInterest.trim()]
    });
    setNewInterest("");
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    onUpdateProfile({
      ...profile,
      interests: profile.interests.filter(i => i !== interestToRemove)
    });
  };

  // Stats
  const totalMissions = missions.length;
  const completedMissions = missions.filter(m => m.status === "completado").length;
  const missionProgressPercent = totalMissions > 0 ? Math.round((completedMissions / totalMissions) * 100) : 0;
  
  const pendingGaps = gaps.filter(g => g.status === "pendiente").length;
  const completedSkillsCount = gaps.filter(g => g.status === "completado" || g.status === "en_progreso").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-20 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-1.5">
            <h2 className="text-lg font-black text-black uppercase tracking-wider flex items-center gap-2">
              <User className="h-5.5 w-5.5 text-[#B50E30]" />
              Mi Perfil & Progreso Profesional UTP
            </h2>
            <p className="text-neutral-500 text-xs font-semibold">
              Administra la configuración de tu cuenta y monitorea las métricas en tiempo real de tu ruta formativa.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setIsEditing(true);
              }
            }}
            className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-none transition flex items-center gap-1.5 cursor-pointer border ${
              isEditing 
                ? "bg-black border-black text-white hover:bg-neutral-900" 
                : "bg-white border-black text-black hover:bg-neutral-55"
            }`}
          >
            {isEditing ? (
              <>
                <Check className="h-4 w-4 text-[#B50E30]" />
                Guardar Perfil
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5 text-[#B50E30]" />
                Editar Perfil
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Essential Profile Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-none border border-utp-border p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 utp-diagonal-pattern opacity-10 pointer-events-none" />

            <div className="text-center space-y-3 pt-4">
              <div className="inline-flex h-20 w-20 bg-black text-white items-center justify-center text-xl font-black rounded-none border-2 border-black">
                {profile.name.split(" ").map(w => w[0]).join("")}
              </div>
              <div>
                <h3 className="text-base font-black text-black uppercase tracking-tight">{profile.name}</h3>
                <p className="text-[10px] text-neutral-400 font-extrabold uppercase">Estudiante Activo - UTP</p>
              </div>
              <div className="inline-block bg-[#B50E30] text-white text-[10px] font-black px-3 py-1 rounded-none uppercase tracking-widest">
                Lvl {profile.level} • {profile.xp} XP
              </div>
            </div>

            <div className="border-t border-utp-border pt-4 space-y-4 text-xs">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-black block">Nombre Completo</label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-utp-border rounded-none outline-none focus:border-black font-semibold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-black block">Carrera Profesional</label>
                    <input
                      type="text"
                      value={editedCareer}
                      onChange={(e) => setEditedCareer(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-utp-border rounded-none outline-none focus:border-black font-semibold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-wider text-black block">Puesto Objetivo</label>
                    <input
                      type="text"
                      value={editedRole}
                      onChange={(e) => setEditedRole(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-utp-border rounded-none outline-none focus:border-black font-semibold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-black block">Ciclo Escolar</label>
                      <select
                        value={editedSemester}
                        onChange={(e) => setEditedSemester(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-utp-border rounded-none text-xs font-semibold focus:border-black outline-none"
                      >
                        {[1,2,3,4,5,6,7,8,9,10].map(s => (
                          <option key={s} value={s}>{s}º Ciclo</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase tracking-wider text-black block">Nivel Experiencia</label>
                      <select
                        value={editedExpLevel}
                        onChange={(e) => setEditedExpLevel(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-utp-border rounded-none text-xs font-semibold focus:border-black outline-none"
                      >
                        <option value="Sin experiencia previa">Sin experiencia</option>
                        <option value="Proyectos personales o académicos de alta exigencia">Proyectos académicos</option>
                        <option value="Prácticas pre-profesionales previas">Prácticas previas</option>
                        <option value="Experiencia laboral regular">Experiencia laboral</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3.5 bg-neutral-50 border border-utp-border rounded-none">
                    <div className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">Carrera Académica</div>
                    <div className="font-extrabold text-black text-xs uppercase mt-1 flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-[#B50E30] shrink-0" />
                      <span>{profile.career} ({profile.semester}º Ciclo)</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-50 border border-utp-border rounded-none">
                    <div className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">Puesto Profesional Recomendado</div>
                    <div className="font-extrabold text-black text-xs uppercase mt-1 flex items-center gap-1.5">
                      <Compass className="h-4 w-4 text-[#B50E30] shrink-0" />
                      <span>{profile.targetRole}</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-neutral-50 border border-utp-border rounded-none">
                    <div className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block">Sustento Laboral</div>
                    <div className="font-extrabold text-black text-xs uppercase mt-1 flex items-center gap-1.5">
                      <Code className="h-4 w-4 text-[#B50E30] shrink-0" />
                      <span className="truncate">{profile.experienceLevel}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Columns: Competency metrics, lists and progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Progression Detail */}
          <div className="bg-white rounded-none border border-utp-border p-6 space-y-5">
            <h3 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-utp-border">
              <Zap className="h-4.5 w-4.5 text-[#B50E30] fill-[#B50E30]" />
              Tu Gamificación Profesional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-neutral-50 border border-utp-border rounded-none text-center space-y-1">
                <span className="text-[9px] text-neutral-400 uppercase font-black">Nivel</span>
                <div className="text-xl font-black text-black">LVL {profile.level}</div>
                <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wide">Puesto de Inicialización</div>
              </div>

              <div className="p-4 bg-neutral-50 border border-utp-border rounded-none text-center space-y-1">
                <span className="text-[9px] text-neutral-400 uppercase font-black font-semibold">Experiencia</span>
                <div className="text-xl font-black text-black flex items-center justify-center gap-1">
                  <Trophy className="h-4 w-4 text-[#B50E30] fill-[#B50E30]" />
                  {profile.xp} XP
                </div>
                <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wide">Acumulados UTP</div>
              </div>

              <div className="p-4 bg-neutral-50 border border-utp-border rounded-none text-center space-y-1">
                <span className="text-[9px] text-neutral-400 uppercase font-black">Match Laboral</span>
                <div className="text-xl font-black text-[#B50E30]">{profile.employabilityScore}%</div>
                <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wide">Estadísticas Nacionales</div>
              </div>
            </div>

            <div className="space-y-2 pb-1 bg-neutral-50/50 p-4 border border-utp-border">
              <div className="flex justify-between items-center text-xs font-black text-black uppercase tracking-tight">
                <span>Progreso hacia Nivel {profile.level + 1}</span>
                <span className="text-[#B50E30]">{profile.progressToNextLevel}%</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-200 rounded-none p-0.5">
                <div 
                  className="bg-[#B50E30] h-full transition-all duration-550"
                  style={{ width: `${profile.progressToNextLevel}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-500 font-semibold block leading-relaxed mt-1">
                💡 Cada misión completada, desafío superado y ronda de simulación STAR incrementará tus puntos XP de forma dinámica para catapultarte hacia las vacantes autorizadas por el decanato de la UTP.
              </span>
            </div>
          </div>

          {/* Declared Skills and Interests lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Habilidades check board */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <h4 className="text-xs font-black text-black uppercase tracking-widest flex items-center justify-between pb-2 border-b border-utp-border">
                <span>🎯 Mis Skills ({profile.currentSkills.length})</span>
                <Sparkles className="h-4 w-4 text-[#B50E30]" />
              </h4>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ej. TypeScript, Node.js..."
                  className="flex-1 px-3 py-2 bg-white border border-utp-border outline-none rounded-none text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="p-2 bg-black hover:bg-neutral-900 text-white rounded-none transition cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-white" />
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {profile.currentSkills.map((sk) => (
                  <span
                    key={sk}
                    className="bg-neutral-50 text-black border border-utp-border text-[10px] font-bold uppercase tracking-tight px-2.5 py-1 rounded-none flex items-center gap-1.5 hover:bg-[#B50E30] hover:text-white hover:border-[#B50E30] transition group cursor-pointer"
                    onClick={() => handleRemoveSkill(sk)}
                    title="Remover Skill"
                  >
                    <span>{sk}</span>
                    <Trash2 className="h-3 w-3 text-neutral-400 group-hover:text-white shrink-0" />
                  </span>
                ))}
              </div>
            </div>

            {/* Campos de Interés check board */}
            <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
              <h4 className="text-xs font-black text-black uppercase tracking-widest flex items-center justify-between pb-2 border-b border-utp-border">
                <span>💡 Áreas Clave ({profile.interests.length})</span>
                <Compass className="h-4 w-4 text-[#B50E30]" />
              </h4>

              <form onSubmit={handleAddInterest} className="flex gap-2">
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Ej. Big Data, DevOps..."
                  className="flex-1 px-3 py-2 bg-white border border-utp-border outline-none rounded-none text-xs font-semibold"
                />
                <button
                  type="submit"
                  className="p-2 bg-black hover:bg-neutral-900 text-white rounded-none transition cursor-pointer"
                >
                  <Plus className="h-4 w-4 text-white" />
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {profile.interests.map((int) => (
                  <span
                    key={int}
                    className="bg-neutral-50 text-black border border-utp-border text-[10px] font-bold uppercase tracking-tight px-2.5 py-1 rounded-none flex items-center gap-1.5 hover:bg-[#B50E30] hover:text-white hover:border-[#B50E30] transition group cursor-pointer"
                    onClick={() => handleRemoveInterest(int)}
                    title="Remover Área"
                  >
                    <span>{int}</span>
                    <Trash2 className="h-3 w-3 text-neutral-400 group-hover:text-white shrink-0" />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Micro stats report logs */}
          <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
            <h4 className="text-xs font-black text-black uppercase tracking-widest pb-1 flex items-center gap-2">
              <BookOpen className="h-4.5 w-4.5 text-[#B50E30]" />
              Compromiso Académico Logrado
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
              <div className="p-4 bg-neutral-50 border border-utp-border rounded-none">
                <span className="text-[8px] text-neutral-400 uppercase font-black block">Retos resueltos</span>
                <span className="text-base font-black text-black leading-none block mt-1.5">{completedMissions}/{totalMissions}</span>
              </div>

              <div className="p-4 bg-neutral-50 border border-utp-border rounded-none">
                <span className="text-[8px] text-neutral-400 uppercase font-black block">Capacitaciones</span>
                <span className="text-base font-black text-black leading-none block mt-1.5">{completedSkillsCount} de {gaps.length}</span>
              </div>

              <div className="p-4 bg-neutral-50 border border-utp-border rounded-none">
                <span className="text-[8px] text-neutral-400 uppercase font-black block">Retos en espera</span>
                <span className="text-base font-black text-black leading-none block mt-1.5">{totalMissions - completedMissions}</span>
              </div>

              <div className="p-4 bg-neutral-50 border border-utp-border rounded-none">
                <span className="text-[8px] text-neutral-400 uppercase font-black block">Nivel Decanato</span>
                <span className="text-base font-black text-black leading-none block mt-1.5">LVL {profile.level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
