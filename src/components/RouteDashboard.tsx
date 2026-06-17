import React, { useMemo, useState, useRef, useEffect } from "react";
import { UserProfile, SkillGap, CareerMission } from "../types";
import {
  BookOpen, AlertCircle, ArrowRight, CheckCircle, Lock, Play, Zap,
  Calendar, Check, TrendingUp, Star,
  Users, GraduationCap, ExternalLink,
  Search, BarChart3, BadgeCheck, BriefcaseBusiness, Database, UserRound,
  FileSearch, FolderKanban, Mic, Target, Megaphone, Sparkles, Mail, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UNIVERSITY_EVENTS } from "../data";
import UvpIcon from "./ui/UvpIcon";

interface RouteDashboardProps {
  profile: UserProfile;
  gaps: SkillGap[];
  missions: CareerMission[];
  onCompleteSubtask: (missionId: string, subtaskIndex: number) => void;
  onNavigateToView: (view: string) => void;
  onStartCourseFromMission: (mission: CareerMission) => void;
  onCompleteMissionDirectly: (missionId: string) => void;
}



function CurrentMissionPin() {
  return (
    <div className="relative pointer-events-none select-none flex flex-col items-center">
      <div className="rounded-full border-2 border-[#B50E30] bg-white shadow-[0_3px_10px_rgba(181,14,48,0.2)] flex items-center justify-center w-[36px] h-[36px]">
        <div className="bg-[#B50E30] rounded-full flex items-center justify-center w-[26px] h-[26px]">
          <UserRound className="h-3.5 w-3.5 text-white stroke-[2.5]" />
        </div>
      </div>
      <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-[#B50E30] -mt-px" />
    </div>
  );
}

function getMissionIcon(mission: CareerMission) {
  const title = mission.title.toLowerCase();
  if (mission.type === "documento" || title.includes("cv") || title.includes("curriculum") || title.includes("ats") || title.includes("hoja de vida")) return FileSearch;
  if (title.includes("star") || title.includes("simulación")) return Star;
  if (title.includes("entrevista") || title.includes("mock") || title.includes("speaking")) return Mic;
  if (title.includes("networking") || title.includes("evento") || title.includes("comunidad")) return Users;
  if (mission.type === "simulacion") return BadgeCheck;
  if (title.includes("analytics") || title.includes("certific") || title.includes("datos") || title.includes("sql") || title.includes("power bi") || title.includes("tableau") || title.includes("google")) return BarChart3;
  if (title.includes("postular") || title.includes("vacante") || title.includes("empleo") || title.includes("trabajo")) return BriefcaseBusiness;
  if (title.includes("sql") || title.includes("base de datos") || title.includes("database")) return Database;
  if (title.includes("portafolio")) return FolderKanban;
  if (title.includes("campaña") || title.includes("marketing")) return TrendingUp;
  if (mission.type === "aprendizaje") return GraduationCap;
  return BookOpen;
}

function handleMissionAction(
  mission: CareerMission,
  onNavigateToView: (view: string) => void,
  onStartCourseFromMission: (mission: CareerMission) => void
) {
  if (mission.type === "aprendizaje") {
    onStartCourseFromMission(mission);
    return;
  }

  if (mission.type === "documento") onNavigateToView("cvanalyzer");
  else if (mission.type === "simulacion") onNavigateToView("interviewer");
  else if (mission.type === "networking") onNavigateToView("community");
  else onNavigateToView("resources");
}

export default function RouteDashboard({
  profile,
  gaps,
  missions,
  onCompleteSubtask,
  onNavigateToView,
  onStartCourseFromMission,
  onCompleteMissionDirectly,
}: RouteDashboardProps) {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [selectedGapIdx, setSelectedGapIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const totalMissions = missions.length;
  const completedMissionsCount = missions.filter((m) => m.status === "completado").length;
  const missionProgressPercent =
    totalMissions > 0 ? Math.round((completedMissionsCount / totalMissions) * 100) : 0;

  const highPriorityGapsCount = gaps.filter(
    (g) => g.priority === "alta" && g.status !== "completado"
  ).length;

  const sortedMissions = useMemo(() => [...missions].sort((a, b) => a.order - b.order), [missions]);

  const selectedMission = selectedMissionId
    ? missions.find((m) => m.id === selectedMissionId)
    : null;

  const currentMissionIdx = sortedMissions.findIndex(m => m.status === "disponible");

  useEffect(() => {
    if (!scrollContainerRef.current || sortedMissions.length === 0) return;
    const idx = currentMissionIdx >= 0 ? currentMissionIdx : sortedMissions.length - 1;
    if (idx < 0) return;
    const NODE_GAP = 240;
    const PADDING_X = 100;
    const scrollTarget = Math.max(0, PADDING_X + idx * NODE_GAP - scrollContainerRef.current.clientWidth * 0.35);
    scrollContainerRef.current.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }, [sortedMissions, currentMissionIdx]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      if (container.scrollWidth <= container.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  });

  useEffect(() => {
    if (!selectedMissionId) return;
    const mission = missions.find((m) => m.id === selectedMissionId);
    if (mission?.status === "completado") {
      const timer = setTimeout(() => setSelectedMissionId(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [missions, selectedMissionId]);

  const endDrag = () => {
    dragRef.current.active = false;
    setIsDragging(false);
  };

  const handleScrollPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || e.button !== 0) return;
    if ((e.target as HTMLElement).closest("[data-route-node]")) return;

    dragRef.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: container.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
    container.setPointerCapture(e.pointerId);
  };

  const handleScrollPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!dragRef.current.active || !container) return;

    const delta = e.clientX - dragRef.current.startX;
    if (Math.abs(delta) > 4) dragRef.current.moved = true;
    container.scrollLeft = dragRef.current.scrollLeft - delta;
  };

  const handleScrollPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (container?.hasPointerCapture(e.pointerId)) {
      container.releasePointerCapture(e.pointerId);
    }
    endDrag();
  };

  const handleMissionNodeClick = (mission: CareerMission) => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }
    if (mission.status === "bloqueado") return;
    setSelectedMissionId(mission.id);
  };

  const renderMissionDetail = (mission: CareerMission) => {
    const isCompleted = mission.status === "completado";
    const completedSubtasks = mission.subtasks.filter((s) => s.done).length;
    const MissionIcon = getMissionIcon(mission);

    return (
      <div className="border-t border-neutral-200/60">
        <div className="bg-[#FDF8F9] border border-red-100/60 rounded-xl p-4 mt-4">
          {/* Header: icon + title + XP */}
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-[#B50E30]/10 p-2 shrink-0 mt-0.5">
              <MissionIcon className="h-4 w-4 text-[#B50E30]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-sm uppercase tracking-wide text-black">
                  {mission.title}
                </h4>
                <span className="text-[9px] font-black bg-black text-[#B50E30] px-2 py-0.5 uppercase shrink-0">
                  +{mission.xpValue} XP
                </span>
                {mission.type === "aprendizaje" && (
                  <span className="text-[9px] font-black bg-[#B50E30] text-white px-2 py-0.5 uppercase">
                    {mission.courseId ? "Curso UTP+" : "Sugerencia externa"}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">
                {mission.description}
              </p>
            </div>
          </div>

          {/* Subtasks */}
          <div className="mt-3.5 space-y-2">
            <div className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B50E30]" />
              Subtareas Requeridas
            </div>
            {!isCompleted && (
              <p className="text-[10px] text-neutral-500 leading-relaxed">
                Marca cada subtarea para avanzar en la ruta.
              </p>
            )}
            <div className="space-y-1">
              {mission.subtasks.map((sub, sIdx) => (
                <button
                  type="button"
                  key={sIdx}
                  onClick={() => !isCompleted && onCompleteSubtask(mission.id, sIdx)}
                  className={`w-full text-left flex items-center gap-2.5 text-[11px] py-1.5 px-2 rounded-lg transition ${
                    isCompleted
                      ? "cursor-default text-neutral-400"
                      : "hover:bg-red-50/60 cursor-pointer text-black"
                  }`}
                >
                  <div
                    className={`h-4.5 w-4.5 rounded flex items-center justify-center transition border shrink-0 ${
                      sub.done
                        ? "bg-[#009F5A] border-[#009F5A] text-white"
                        : "border-neutral-400 bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span
                    className={`font-semibold ${
                      sub.done ? "line-through text-neutral-400" : "text-black"
                    }`}
                  >
                    {sub.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          {!isCompleted && (
            <div className="mt-3.5 pt-3.5 border-t border-red-100/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                {completedSubtasks} de {mission.subtasks.length} completados
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onCompleteMissionDirectly(mission.id)}
                  className="border border-[#B50E30] text-[#B50E30] text-[10px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-[#B50E30]/5 transition rounded-lg cursor-pointer"
                >
                  Completar misión
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleMissionAction(mission, onNavigateToView, onStartCourseFromMission)
                  }
                  className="bg-[#B50E30] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 hover:bg-[#85061B] transition flex items-center gap-1.5 rounded-lg cursor-pointer"
                >
                  {mission.type === "aprendizaje" && mission.externalSuggestionId ? (
                    <ExternalLink className="h-2.5 w-2.5" />
                  ) : (
                    <Play className="h-2.5 w-2.5 fill-white" />
                  )}
                  {mission.actionLabel}
                </button>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="mt-3 pt-3 border-t border-green-100/40 flex items-center gap-1.5 text-[11px] text-[#00B86B] font-extrabold">
              <CheckCircle className="h-3.5 w-3.5" />
              Misión Completada (+{mission.xpValue} XP)
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderMissionRoadmap = () => {
    const sorted = sortedMissions;
    const total = sorted.length;

    const NODE_R = 32;
    const NODE_GAP = 190;
    const PADDING_X = 80;
    const NODE_Y = 160;
    const NUM_OFFSET_Y = 62;
    const PIN_OFFSET_Y = NODE_Y - NUM_OFFSET_Y - 56;
    const width = total > 0 ? (total - 1) * NODE_GAP + PADDING_X * 2 + NODE_R * 2 : 400;
    const currentIdx = currentMissionIdx;

    const completadoMain = "#00B86B";
    const completadoBg = "#E6FFF2";
    const completadoBorder = "#A8EDC8";

    const statusColors: Record<string, string> = {
      completado: completadoMain,
      disponible: "#B50E30",
      siguiente: "#6366F1",
      bloqueado: "#D4D4D4",
    };

    const getStatusInfo = (idx: number) => {
      const mission = sorted[idx];
      if (!mission) return { type: "bloqueado" as const, bg: "bg-neutral-100", border: "border-neutral-300", textColor: "text-neutral-400", badgeColor: "bg-neutral-50 text-neutral-500 border border-neutral-200", badge: "Bloqueado", icon: "lock", isInteractive: false, numBg: "bg-neutral-100", numBorder: "border-neutral-200", numText: "text-neutral-300" };
      const status = mission.status;
      if (status === "completado") return { type: "completado" as const, bg: "bg-[#00B86B]", border: "border-[#00B86B]", textColor: "text-[#00B86B]", badgeColor: "bg-[#E6FFF2] text-[#00B86B] border border-[#A8EDC8]", badge: "Completado", icon: "check", isInteractive: true, numBg: "bg-[#E6FFF2]", numBorder: "border-[#A8EDC8]", numText: "text-[#00B86B]" };
      if (status === "disponible") return { type: "disponible" as const, bg: "bg-[#B50E30]", border: "border-[#B50E30]", textColor: "text-[#B50E30]", badgeColor: "bg-red-50 text-[#B50E30] border border-red-200", badge: "En curso", icon: "mission", isInteractive: true, isCurrent: true as const, numBg: "bg-red-50", numBorder: "border-red-200", numText: "text-[#B50E30]" };
      const isNext = currentIdx >= 0 && idx === currentIdx + 1;
      if (isNext) return { type: "siguiente" as const, bg: "bg-indigo-500", border: "border-indigo-500", textColor: "text-indigo-600", badgeColor: "bg-indigo-50 text-indigo-600 border border-indigo-200", badge: "Siguiente", icon: "lock", isInteractive: false, numBg: "bg-indigo-50", numBorder: "border-indigo-200", numText: "text-indigo-600" };
      return { type: "bloqueado" as const, bg: "bg-neutral-100", border: "border-neutral-300", textColor: "text-neutral-400", badgeColor: "bg-neutral-50 text-neutral-500 border border-neutral-200", badge: "Bloqueado", icon: "lock", isInteractive: false, numBg: "bg-neutral-100", numBorder: "border-neutral-200", numText: "text-neutral-300" };
    };

    return (
      <motion.div
        key="mission-roadmap"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          ref={scrollContainerRef}
          onPointerDown={handleScrollPointerDown}
          onPointerMove={handleScrollPointerMove}
          onPointerUp={handleScrollPointerUp}
          onPointerCancel={handleScrollPointerUp}
          className={`w-full overflow-x-auto overflow-y-hidden scrollbar-none touch-pan-x select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <div className="relative shrink-0" style={{ width: `${width}px`, height: "320px", paddingTop: "10px" }}>
            {/* SVG Path */}
            <svg width={width} height="320" className="absolute inset-0 pointer-events-none z-0" aria-hidden="true">
              {sorted.map((_, idx) => {
                if (idx === total - 1) return null;
                const x1 = PADDING_X + idx * NODE_GAP + NODE_R;
                const x2 = PADDING_X + (idx + 1) * NODE_GAP - NODE_R;
                const y = NODE_Y;
                const dx = x2 - x1;
                const wave = idx % 2 === 0 ? 16 : -16;

                const prevInfo = getStatusInfo(idx);
                const isActive = prevInfo.type === "completado" || prevInfo.type === "disponible";
                const strokeColor = isActive ? statusColors[prevInfo.type] : "#D4D4D4";

                return (
                  <path
                    key={idx}
                    d={`M ${x1} ${y} C ${x1 + dx / 3} ${y - wave}, ${x2 - dx / 3} ${y + wave}, ${x2} ${y}`}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={isActive ? 2 : 1.5}
                    strokeDasharray={isActive ? "8 6" : "5 7"}
                    opacity={isActive ? 0.55 : 0.25}
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Wave rings behind each node */}
            {sorted.map((mission, idx) => {
              const info = getStatusInfo(idx);
              const cx = PADDING_X + idx * NODE_GAP;
              const cy = NODE_Y;
              const color = statusColors[info.type] || "#D4D4D4";

              return (
                <svg
                  key={`wave-${mission.id}`}
                  className="absolute pointer-events-none z-[1]"
                  style={{ left: cx - 38, top: cy - 38, width: 76, height: 76 }}
                  viewBox="0 0 76 76"
                  aria-hidden="true"
                >
                  <circle cx="38" cy="38" r="34" fill="none" stroke={color} strokeWidth="0.6" opacity="0.1" />
                  <circle cx="38" cy="38" r="37" fill="none" stroke={color} strokeWidth="0.4" opacity="0.05" />
                  {info.type === "disponible" && (
                    <motion.circle
                      cx="38" cy="38" r="30"
                      fill="none" stroke={color} strokeWidth="1.2"
                      opacity="0.2"
                      initial={{ r: 30 }}
                      animate={{ r: [30, 35, 30] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  {info.type === "completado" && (
                    <circle cx="38" cy="38" r="30" fill="none" stroke={color} strokeWidth="0.8" opacity="0.12" />
                  )}
                  {info.type === "siguiente" && (
                    <circle cx="38" cy="38" r="30" fill="none" stroke={color} strokeWidth="0.6" opacity="0.1" />
                  )}
                </svg>
              );
            })}

            {/* Number circles */}
            {sorted.map((mission, idx) => {
              const info = getStatusInfo(idx);
              const centerX = PADDING_X + idx * NODE_GAP;
              const numY = NODE_Y - NUM_OFFSET_Y;

              return (
                <div
                  key={`num-${mission.id}`}
                  className="absolute z-10 -translate-x-1/2"
                  style={{ left: `${centerX}px`, top: `${numY}px` }}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${info.numBg} ${info.numBorder} ${info.numText} shadow-sm`}>
                    {idx + 1}
                  </div>
                </div>
              );
            })}

            {/* Pin marker above the current mission's number */}
            {currentIdx >= 0 && (
              <div
                className="absolute z-20 pointer-events-none -translate-x-1/2"
                style={{
                  left: `${PADDING_X + currentIdx * NODE_GAP}px`,
                  top: `${PIN_OFFSET_Y}px`,
                }}
              >
                <CurrentMissionPin />
              </div>
            )}

            {/* Nodes */}
            {sorted.map((mission, idx) => {
              const info = getStatusInfo(idx);
              const centerX = PADDING_X + idx * NODE_GAP;
              const centerY = NODE_Y;
              const MissionIcon = getMissionIcon(mission);

              return (
                <button
                  key={mission.id}
                  type="button"
                  data-route-node
                  disabled={!info.isInteractive}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => handleMissionNodeClick(mission)}
                  className={`absolute flex flex-col items-center -translate-x-1/2 transition-transform z-10 ${
                    info.isInteractive
                      ? "pointer-events-auto cursor-pointer hover:scale-105"
                      : "pointer-events-none"
                  } ${isDragging ? "cursor-grabbing" : ""}`}
                  style={{ left: `${centerX}px`, top: `${centerY - NODE_R}px` }}
                >
                  {/* Circle node */}
                  <div className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                    info.bg} ${info.border} shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${
                    selectedMissionId === mission.id ? "ring-2 ring-[#B50E30]/40 ring-offset-2" : ""
                  }`}>
 {info.type === "disponible" && (
                      <span className="absolute inset-0 rounded-full border-2 border-[#B50E30] animate-ping opacity-25" />
                    )}
                    {info.type === "completado" ? (
                      <Check className="h-6 w-6 text-white stroke-[3]" />
                    ) : info.type === "bloqueado" || info.type === "siguiente" ? (
                      <Lock className="h-6 w-6 text-white/80" />
                    ) : (
                      <MissionIcon className="h-6 w-6 text-white" />
                    )}
                  </div>

                  {/* Title */}
                  <span className={`mt-3 w-[160px] text-[11px] font-bold tracking-tight text-center leading-snug line-clamp-2 ${
                    info.isInteractive ? "text-black" : "text-neutral-400"
                  }`}>
                    {mission.title}
                  </span>

                  {/* Badge */}
                  <span className={`mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${info.badgeColor}`}>
                    {info.badge}
                  </span>

                  {/* XP */}
                  <span className={`mt-1.5 text-[10px] font-bold ${info.textColor}`}>
                    +{mission.xpValue} XP
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-full utp-diagonal-pattern opacity-30 select-none pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#B50E30] text-white heading-xs px-2 py-0.5 rounded-none">
              Puesto Objetivo
            </span>
            <span className="text-black font-semibold text-xs uppercase tracking-wide">
              Ciclo {profile.semester}º Universidades UTP
            </span>
          </div>
          <h2 className="heading-xl text-black">
            {profile.targetRole || "Diagnóstico Pendiente"}
          </h2>
          <p className="text-neutral-600 text-xs max-w-xl font-medium leading-relaxed">
            Tu mentor digital ha estructurado esta ruta interactiva basada en perfiles reales
            contratados en empresas líderes y egresados de la UTP.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 bg-neutral-50 p-4 border border-utp-border rounded-none self-stretch md:self-center relative z-10 shadow-none">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2.5 rounded-none flex items-center justify-center shrink-0">
              <UvpIcon name="metas-profesionales" size={20} className="text-[#B50E30]" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                Nivel de Carrera
              </div>
              <div className="text-base font-black text-black uppercase">LVL {profile.level}</div>
            </div>
          </div>
          <div className="sm:pl-6 sm:border-l sm:border-utp-border flex items-center gap-3">
            <div className="bg-[#B50E30] text-white p-2.5 rounded-none flex items-center justify-center">
              <UvpIcon name="crecimiento-personal" size={20} />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                Compatibilidad
              </div>
              <div className="text-base font-black text-[#B50E30]">
                {profile.employabilityScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200/60 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-sm font-black text-black tracking-widest flex items-center gap-2">
                  <Zap className="h-4.5 w-4.5 text-[#B50E30] fill-[#B50E30]" />
                  Misiones Despega UTP
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Completa desafíos estratégicos y gana experiencia profesional (XP)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#B50E30]">
                  {missionProgressPercent}% completado
                </span>
                <div className="w-24 bg-neutral-100 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div
                    className="bg-[#B50E30] h-full rounded-full transition-all duration-550"
                    style={{ width: `${missionProgressPercent}%` }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400 font-semibold mt-1">
                  {completedMissionsCount} de {totalMissions} misiones
                </p>
              </div>
            </div>

            <div className="flex flex-col">
              {missions.length === 0 ? (
                <div className="text-center py-12 px-6 border border-dashed border-utp-border bg-neutral-50/50">
                  <GraduationCap className="h-10 w-10 text-[#B50E30] mx-auto mb-4" />
                  <p className="text-sm font-extrabold uppercase text-black">
                    Tu ruta aún no está generada
                  </p>
                  <p className="text-xs text-neutral-500 font-medium mt-2 max-w-sm mx-auto">
                    Completa el Diagnóstico IA para que analicemos tu perfil de{" "}
                    {profile.career || "tu carrera"} y armemos tu plan con cursos personalizados.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateToView("diagnostico")}
                    className="mt-5 inline-flex items-center gap-1.5 bg-[#B50E30] hover:bg-[#85061B] text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 transition cursor-pointer"
                  >
                    Ir al Diagnóstico IA
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  {renderMissionRoadmap()}
                  <AnimatePresence>
                    {selectedMission && (
                      <motion.div
                        key="mission-detail-panel"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.25 }}
                      >
                        {renderMissionDetail(selectedMission)}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200/60 shadow-sm p-5 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-black tracking-widest flex items-center gap-2">
                <Target className="h-4 w-4 text-[#B50E30]" />
                Skills & Brechas
              </h3>
              {highPriorityGapsCount > 0 && (
                <span className="bg-red-50 text-[#B50E30] border border-red-200 text-[9px] font-black px-2 py-0.5 rounded-md uppercase">
                  {highPriorityGapsCount} {highPriorityGapsCount === 1 ? "Crítica" : "Críticas"}
                </span>
              )}
            </div>

            {/* Current Skills */}
            {profile.currentSkills.length > 0 && (
              <div>
                <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Tus skills actuales</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.currentSkills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 bg-white border border-neutral-200 text-neutral-700 text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      <Check className="h-2.5 w-2.5 text-[#009F5A] stroke-[3]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-neutral-200/60" />

            {/* Recommendations */}
            <div>
              <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider mb-2.5">Recomendaciones para ti</p>
              {gaps.length === 0 ? (
                <div className="text-center py-6 px-4">
                  <AlertCircle className="h-7 w-7 text-[#B50E30] mx-auto mb-2" />
                  <p className="text-black text-[11px] font-extrabold uppercase tracking-wide">
                    Sin diagnóstico registrado
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigateToView("diagnostico")}
                    className="mt-2 inline-flex items-center gap-1 text-[#B50E30] text-[10px] font-black uppercase tracking-wider hover:underline"
                  >
                    Ir al diagnóstico
                    <ArrowRight className="h-2.5 w-2.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {gaps.map((gap, idx) => {
                    const name = gap.skillName.toLowerCase();
                    const isSelected = selectedGapIdx === idx;
                    const RecIcon = name.includes("google") || name.includes("analytics") ? BarChart3
                      : name.includes("meta") || name.includes("ads") || name.includes("campañas") ? Megaphone
                      : name.includes("storytelling") || name.includes("dato") ? Sparkles
                      : name.includes("email") || name.includes("crm") || name.includes("mail") ? Mail
                      : gap.category === "tecnica" ? BarChart3
                      : gap.category === "blanda" ? Star
                      : BookOpen;

                    const iconBg = name.includes("google") || name.includes("analytics") ? "bg-amber-50 text-amber-600"
                      : name.includes("meta") || name.includes("ads") || name.includes("campañas") ? "bg-blue-50 text-blue-600"
                      : name.includes("storytelling") || name.includes("dato") ? "bg-purple-50 text-purple-600"
                      : name.includes("email") || name.includes("crm") || name.includes("mail") ? "bg-sky-50 text-sky-600"
                      : gap.category === "tecnica" ? "bg-blue-50 text-blue-600"
                      : "bg-amber-50 text-amber-600";

                    const priorityBadge = gap.priority === "alta"
                      ? "bg-red-50 text-[#B50E30] border border-red-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200";

                    return (
                      <div
                        key={idx}
                        className={`group flex items-center gap-3 bg-white border rounded-xl p-3 transition cursor-pointer ${
                          isSelected
                            ? "border-[#B50E30]/40 bg-red-50/40 shadow-sm"
                            : "border-neutral-200/70 hover:border-neutral-300 hover:shadow-sm"
                        }`}
                        onClick={() => setSelectedGapIdx(isSelected ? null : idx)}
                      >
                        <div className={`rounded-lg p-2 shrink-0 ${iconBg}`}>
                          <RecIcon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[11px] font-bold text-black leading-snug">
                            {gap.skillName}
                          </h4>
                          <p className="text-[10px] text-neutral-500 mt-0.5 leading-relaxed line-clamp-1">
                            {gap.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${priorityBadge}`}>
                            {gap.priority === "alta" ? "ALTA" : "MEDIA"}
                          </span>
                          <ChevronRight className={`h-3.5 w-3.5 transition ${isSelected ? "text-[#B50E30] rotate-90" : "text-neutral-300 group-hover:text-neutral-500"}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Feedback panel for selected recommendation */}
              {selectedGapIdx !== null && gaps[selectedGapIdx] && (
                <div className="mt-3">
                  {(() => {
                    const gap = gaps[selectedGapIdx];
                    const name = gap.skillName.toLowerCase();
                    const RecIcon = name.includes("google") || name.includes("analytics") ? BarChart3
                      : name.includes("meta") || name.includes("ads") || name.includes("campañas") ? Megaphone
                      : name.includes("storytelling") || name.includes("dato") ? Sparkles
                      : name.includes("email") || name.includes("crm") || name.includes("mail") ? Mail
                      : gap.category === "tecnica" ? BarChart3
                      : gap.category === "blanda" ? Star
                      : BookOpen;

                    const iconBg = name.includes("google") || name.includes("analytics") ? "bg-amber-50 text-amber-600"
                      : name.includes("meta") || name.includes("ads") || name.includes("campañas") ? "bg-blue-50 text-blue-600"
                      : name.includes("storytelling") || name.includes("dato") ? "bg-purple-50 text-purple-600"
                      : name.includes("email") || name.includes("crm") || name.includes("mail") ? "bg-sky-50 text-sky-600"
                      : gap.category === "tecnica" ? "bg-blue-50 text-blue-600"
                      : "bg-amber-50 text-amber-600";

                    const borderColor = gap.priority === "alta" ? "border-l-red-500" : "border-l-amber-400";

                    const getActionInfo = () => {
                      if (name.includes("google") || name.includes("analytics")) return { label: "Ir a certificación", view: "resources" as const };
                      if (name.includes("meta") || name.includes("ads") || name.includes("campañas")) return { label: "Ver ruta de Meta Ads", view: "resources" as const };
                      if (name.includes("storytelling") || name.includes("dato")) return { label: "Practicar storytelling", view: "interviewer" as const };
                      if (name.includes("email") || name.includes("crm") || name.includes("mail")) return { label: "Ver curso recomendado", view: "resources" as const };
                      if (gap.category === "tecnica") return { label: "Ver curso recomendado", view: "resources" as const };
                      return { label: "Explorar recursos", view: "resources" as const };
                    };

                    const action = getActionInfo();
                    const catLabel = gap.category === "tecnica" ? "CERTIFICACION" : gap.category === "blanda" ? "BLANDA" : "GENERAL";

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white border border-neutral-200/70 rounded-xl shadow-sm p-4 border-l-4 ${borderColor}`}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className={`rounded-lg p-2 shrink-0 ${iconBg}`}>
                              <RecIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-black uppercase tracking-wide">
                                {gap.skillName}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                  gap.priority === "alta"
                                    ? "bg-red-50 text-[#B50E30] border border-red-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}>
                                  {gap.priority === "alta" ? "ALTA" : "MEDIA"}
                                </span>
                                <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider">
                                  #{catLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedGapIdx(null)}
                            className="text-neutral-300 hover:text-neutral-600 transition cursor-pointer shrink-0"
                          >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <path d="M3 3L11 11M11 3L3 11" />
                            </svg>
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-neutral-600 leading-relaxed mt-3">
                          {gap.description}
                        </p>

                        {/* Recommended resource */}
                        {gap.recommendedResource && (
                          <div className="mt-3 text-[10px] font-semibold text-neutral-500">
                            Recurso sugerido:{" "}
                            <span className="text-black font-bold">{gap.recommendedResource}</span>
                          </div>
                        )}

                        {/* Action button */}
                        <div className="mt-3.5 pt-3 border-t border-neutral-200/60 flex justify-end">
                          <button
                            type="button"
                            onClick={() => onNavigateToView(action.view)}
                            className="inline-flex items-center gap-1.5 bg-[#B50E30] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-[#85061B] transition"
                          >
                            {action.label}
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })()}
                </div>
              )}
            </div>

            {/* Footer CTA */}
            {gaps.length > 0 && (
              <button
                type="button"
                onClick={() => onNavigateToView("cvanalyzer")}
                className="w-full flex items-center justify-center gap-2 border border-[#B50E30] text-[#B50E30] text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-red-50/60 transition"
              >
                <GraduationCap className="h-3.5 w-3.5" />
                Ver todas las recomendaciones
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>

          <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
            <div className="pb-2 border-b border-utp-border flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#B50E30]" />
              <h3 className="heading-sm text-black tracking-widest">
                Eventos & Hackathons de Interés
              </h3>
            </div>
            <div className="space-y-4">
              {UNIVERSITY_EVENTS.map((evt, idx) => (
                <div
                  key={idx}
                  className="space-y-1.5 group cursor-pointer"
                  onClick={() => onNavigateToView("resources")}
                >
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
