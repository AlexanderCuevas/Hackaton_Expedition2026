import React from "react";
import { UserProfile, SkillGap, CareerMission } from "../types";
import { 
  Trophy, Award, BookOpen, AlertCircle, ArrowRight, CheckCircle, Lock, Play, Zap,
  CheckSquare, Calendar, ChevronRight, Check
} from "lucide-react";
import { motion } from "motion/react";
import { CERTIFICATIONS_AND_COURSES, UNIVERSITY_EVENTS } from "../data";

interface RouteDashboardProps {
  profile: UserProfile;
  gaps: SkillGap[];
  missions: CareerMission[];
  onCompleteSubtask: (missionId: string, subtaskIndex: number) => void;
  onNavigateToView: (view: string) => void;
  onCompleteMissionDirectly: (missionId: string) => void;
}

export default function RouteDashboard({
  profile,
  gaps,
  missions,
  onCompleteSubtask,
  onNavigateToView,
  onCompleteMissionDirectly
}: RouteDashboardProps) {

  // Calculate mission completion percentage
  const totalMissions = missions.length;
  const completedMissionsCount = missions.filter(m => m.status === "completado").length;
  const missionProgressPercent = totalMissions > 0 ? Math.round((completedMissionsCount / totalMissions) * 100) : 0;

  // Group gaps by priority for quick indicators
  const highPriorityGapsCount = gaps.filter(g => g.priority === "alta" && g.status !== "completado").length;

  return (
    <div className="space-y-6">
      {/* Target Role & Quick Progress Header */}
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Subtle Diagonal Pattern Left Accents */}
        <div className="absolute top-0 right-0 w-32 h-full utp-diagonal-pattern opacity-30 select-none pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#B50E30] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none">
              Puesto Objetivo
            </span>
            <span className="text-black font-semibold text-xs uppercase tracking-wide">Ciclo {profile.semester}º Universidades UTP</span>
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight uppercase">
            {profile.targetRole || "Diagnóstico Pendiente"}
          </h2>
          <p className="text-neutral-600 text-xs max-w-xl font-medium leading-relaxed">
            Tu mentor digital ha estructurado esta ruta interactiva basada en perfiles reales contratados en empresas líderes y egresados de la UTP.
          </p>
        </div>

        {/* Level and Score Indicator */}
        <div className="flex items-center gap-6 divide-x divide-utp-border bg-neutral-50 p-4 border border-utp-border rounded-none self-start md:self-center relative z-10 shadow-none">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2.5 rounded-none flex items-center justify-center">
              <Trophy className="h-5 w-5 text-[#B50E30]" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">Nivel de Carrera</div>
              <div className="text-base font-black text-black uppercase">LVL {profile.level}</div>
            </div>
          </div>
          <div className="pl-6 flex items-center gap-3">
            <div className="bg-[#B50E30] text-white p-2.5 rounded-none flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">Compatibilidad</div>
              <div className="text-base font-black text-[#B50E30]">{profile.employabilityScore}%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Learning Road */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-none border border-utp-border p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-utp-border">
              <div>
                <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#B50E30] fill-[#B50E30]" />
                  Misiones de Empleabilidad UTP
                </h3>
                <p className="text-xs text-neutral-500 mt-1">Completa desafíos estratégicos y gana experiencia profesional (XP)</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-[#B50E30] uppercase tracking-wider">{missionProgressPercent}% COMPLETADO</span>
                <div className="w-24 bg-neutral-100 h-2 rounded-none p-0.5 mt-1 border border-utp-border">
                  <div 
                    className="bg-[#B50E30] h-full transition-all duration-550" 
                    style={{ width: `${missionProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Path List */}
            <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-utp-border">
              {missions.map((mission, idx) => {
                const isCompleted = mission.status === "completado";
                const isLocked = mission.status === "bloqueado";
                const isAvailable = mission.status === "disponible";

                return (
                  <motion.div 
                    key={mission.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative"
                  >
                    {/* Node Bullet (Professional linear design) */}
                    <div className={`absolute -left-[24px] top-1.5 h-6 w-6 rounded-none flex items-center justify-center transition-all duration-300 z-10 border ${
                      isCompleted 
                        ? "bg-black text-white border-black" 
                        : isAvailable 
                          ? "bg-[#B50E30] text-white border-[#B50E30] animate-pulse" 
                          : "bg-white text-neutral-450 border-utp-border"
                    }`}>
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <span className="text-[10px] font-black">{idx + 1}</span>}
                    </div>

                    <div className={`rounded-none border p-5 transition-all duration-200 ${
                      isCompleted 
                        ? "bg-neutral-50/50 border-utp-border opacity-75" 
                        : isAvailable 
                          ? "bg-white border-black shadow-none" 
                          : "bg-neutral-50/20 border-utp-border"
                    }`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className={`font-extrabold text-sm uppercase tracking-wide ${isLocked ? "text-neutral-450" : "text-black"}`}>
                              {mission.title}
                            </h4>
                            <span className="text-[9px] font-black bg-black text-[#B50E30] border border-[#B50E30]/20 px-2 py-0.5 rounded-none uppercase">
                              +{mission.xpValue} XP
                            </span>
                          </div>
                          <p className={`text-xs font-medium leading-relaxed ${isLocked ? "text-neutral-400" : "text-neutral-600"}`}>
                            {mission.description}
                          </p>
                        </div>

                        {/* Status tag */}
                        {isLocked && <Lock className="h-4 w-4 text-neutral-300 shrink-0 mt-0.5" />}
                      </div>

                      {/* Subtasks block */}
                      {!isLocked && (
                        <div className="mt-4 p-4 bg-neutral-50 border border-utp-border rounded-none space-y-3">
                          <div className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-[#B50E30]"></span>
                            Subtareas Requeridas
                          </div>
                          <div className="space-y-1.5">
                            {mission.subtasks.map((sub, sIdx) => (
                              <button
                                type="button"
                                key={sIdx}
                                onClick={() => !isCompleted && onCompleteSubtask(mission.id, sIdx)}
                                className={`w-full text-left flex items-center gap-2.5 text-xs py-1 px-1 rounded-none transition ${
                                  isCompleted 
                                    ? "cursor-default text-neutral-400" 
                                    : "hover:bg-neutral-100 cursor-pointer text-black"
                                }`}
                              >
                                <div className={`h-4.5 w-4.5 rounded-none flex items-center justify-center transition border ${
                                  sub.done 
                                    ? "bg-black border-black text-white" 
                                    : "border-neutral-400 bg-white text-transparent"
                                }`}>
                                  <Check className="h-3 w-3 stroke-[3]" />
                                </div>
                                <span className={`font-semibold ${sub.done ? "line-through text-neutral-450" : "text-black"}`}>
                                  {sub.text}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      {isAvailable && (
                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-utp-border pt-3">
                          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                            {mission.subtasks.filter(s=>s.done).length} de {mission.subtasks.length} completados
                          </span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (mission.type === "documento") onNavigateToView("cvanalyzer");
                                else if (mission.type === "simulacion") onNavigateToView("interviewer");
                                else if (mission.type === "networking") onNavigateToView("community");
                                else onNavigateToView("resources");
                              }}
                              className="bg-[#B50E30] text-white text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-[#85061B] transition flex items-center gap-1.5 shadow-none rounded-none cursor-pointer"
                            >
                              <Play className="h-3 w-3 fill-white" />
                              {mission.actionLabel}
                            </button>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs text-black font-extrabold uppercase">
                          <CheckCircle className="h-4 w-4 text-[#B50E30]" />
                          Misión Completada (+{mission.xpValue} XP agregados)
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Gaps, Events, Hackathons */}
        <div className="space-y-6">
          {/* Detectores de Brechas Summary */}
          <div className="bg-white rounded-none border border-utp-border p-6">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-utp-border">
              <h3 className="text-xs font-black text-black uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#B50E30]" />
                Brechas por Superar
              </h3>
              {highPriorityGapsCount > 0 && (
                <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 rounded-none uppercase">
                  {highPriorityGapsCount} Críticas
                </span>
              )}
            </div>

            {gaps.length === 0 ? (
              <div className="text-center py-8 px-4">
                <AlertCircle className="h-8 w-8 text-[#B50E30] mx-auto mb-3" />
                <p className="text-black text-xs font-extrabold uppercase tracking-wide">Sin diagnóstico registrado</p>
                <button
                  type="button"
                  onClick={() => onNavigateToView("diagnostico")}
                  className="mt-3 inline-flex items-center gap-1 text-[#B50E30] text-xs font-black uppercase tracking-wider hover:underline"
                >
                  Ir al diagnóstico
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {gaps.map((gap, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-none border border-utp-border text-xs space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-black uppercase tracking-tight truncate">{gap.skillName}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-none uppercase shrink-0 ${
                        gap.priority === "alta" 
                          ? "bg-[#B50E30] text-white" 
                          : gap.priority === "media" 
                            ? "bg-black text-white" 
                            : "bg-neutral-200 text-black"
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-neutral-600 text-[11px] leading-relaxed font-medium">
                      {gap.description}
                    </p>
                    <div className="bg-white p-2.5 rounded-none border border-utp-border space-y-1">
                      <div className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider">Recurso Recomendado</div>
                      <div className="text-[11px] text-black font-extrabold flex items-center justify-between">
                        <span className="truncate pr-1">{gap.recommendedResource}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-black shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hackathons & Events */}
          <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
            <div className="pb-2 border-b border-utp-border flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#B50E30]" />
              <h3 className="text-xs font-black text-black uppercase tracking-widest">Eventos & Hackathons de Interés</h3>
            </div>
            <div className="space-y-4">
              {UNIVERSITY_EVENTS.map((evt, idx) => (
                <div key={idx} className="space-y-1.5 group cursor-pointer" onClick={() => onNavigateToView("resources")}>
                  <div className="flex items-center justify-between">
                    <span className="bg-[#B50E30]/10 text-[#B50E30] border border-[#B50E30]/20 font-black text-[9px] px-2 py-0.5 uppercase tracking-wider">
                      {evt.type}
                    </span>
                    <span className="text-[10px] text-neutral-450 font-bold">{evt.date}</span>
                  </div>
                  <h4 className="font-black text-xs text-black uppercase group-hover:text-[#B50E30] transition">
                    {evt.title}
                  </h4>
                  <p className="text-[11px] text-neutral-600 font-medium leading-relaxed">
                    {evt.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
