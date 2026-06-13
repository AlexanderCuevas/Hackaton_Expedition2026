import React, { useMemo, useState, useRef, useEffect } from "react";
import { UserProfile, SkillGap, CareerMission } from "../types";
import {
  Trophy, Award, BookOpen, AlertCircle, ArrowRight, CheckCircle, Lock, Play, Zap,
  Calendar, ChevronRight, Check, ArrowLeft, FileText, MessageSquare, Users, GraduationCap,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { UNIVERSITY_EVENTS } from "../data";
import { buildNetworkFromMissions, RouteNetworkNode, ROUTE_NETWORK_CANVAS_HEIGHT } from "../utils/courseMatcher";

interface RouteDashboardProps {
  profile: UserProfile;
  gaps: SkillGap[];
  missions: CareerMission[];
  onCompleteSubtask: (missionId: string, subtaskIndex: number) => void;
  onNavigateToView: (view: string) => void;
  onStartCourseFromMission: (mission: CareerMission) => void;
  onCompleteMissionDirectly: (missionId: string) => void;
}

type NodeStatus = "completado" | "disponible" | "bloqueado";

function getMissionIcon(type: CareerMission["type"]) {
  switch (type) {
    case "documento":
      return FileText;
    case "simulacion":
      return MessageSquare;
    case "networking":
      return Users;
    case "aprendizaje":
      return GraduationCap;
    default:
      return BookOpen;
  }
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
}: RouteDashboardProps) {
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });

  const { nodes: networkNodes, edges: networkEdges, canvasWidth } = useMemo(
    () => buildNetworkFromMissions(missions),
    [missions]
  );

  useEffect(() => {
    const activeNode = networkNodes.find((node) => {
      if (!node.missionId) return false;
      const mission = missions.find((m) => m.id === node.missionId);
      return mission?.status === "disponible";
    });

    const targetNode = activeNode ?? networkNodes[networkNodes.length - 1];
    if (!targetNode || !scrollContainerRef.current) return;

    const scrollTarget = Math.max(0, targetNode.x - scrollContainerRef.current.clientWidth * 0.35);
    scrollContainerRef.current.scrollTo({ left: scrollTarget, behavior: "smooth" });
  }, [networkNodes, missions]);

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
  }, [canvasWidth]);

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

  const totalMissions = missions.length;
  const completedMissionsCount = missions.filter((m) => m.status === "completado").length;
  const missionProgressPercent =
    totalMissions > 0 ? Math.round((completedMissionsCount / totalMissions) * 100) : 0;

  const highPriorityGapsCount = gaps.filter(
    (g) => g.priority === "alta" && g.status !== "completado"
  ).length;

  const getNodeStatus = (node: RouteNetworkNode): NodeStatus => {
    if (node.missionId) {
      const mission = missions.find((m) => m.id === node.missionId);
      return mission?.status ?? node.defaultStatus ?? "bloqueado";
    }
    return node.defaultStatus ?? "bloqueado";
  };

  const selectedMission = selectedMissionId
    ? missions.find((m) => m.id === selectedMissionId)
    : null;

  const handleNodeClick = (node: RouteNetworkNode) => {
    if (dragRef.current.moved) {
      dragRef.current.moved = false;
      return;
    }

    if (!node.missionId) return;

    const mission = missions.find((m) => m.id === node.missionId);
    if (!mission) return;

    const status = getNodeStatus(node);
    if (status === "disponible") {
      handleMissionAction(mission, onNavigateToView, onStartCourseFromMission);
      return;
    }

    if (status === "completado") {
      setSelectedMissionId(node.missionId);
    }
  };

  const renderMissionDetail = (mission: CareerMission) => {
    const isCompleted = mission.status === "completado";
    const completedSubtasks = mission.subtasks.filter((s) => s.done).length;

    return (
      <motion.div
        key="mission-detail"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        <button
          type="button"
          onClick={() => setSelectedMissionId(null)}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a la red neuronal
        </button>

        <div className="rounded-none border border-black bg-white p-5 shadow-none">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-sm uppercase tracking-wide text-black">
                  {mission.title}
                </h4>
                <span className="text-[9px] font-black bg-black text-[#B50E30] border border-[#B50E30]/20 px-2 py-0.5 rounded-none uppercase">
                  +{mission.xpValue} XP
                </span>
                {mission.type === "aprendizaje" && (
                  <span className="text-[9px] font-black bg-[#B50E30] text-white px-2 py-0.5 rounded-none uppercase">
                    {mission.courseId ? "Curso UTP+" : "Sugerencia externa"}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium leading-relaxed text-neutral-600">
                {mission.description}
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-neutral-50 border border-utp-border rounded-none space-y-3">
            <div className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#B50E30]" />
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
                  <div
                    className={`h-4.5 w-4.5 rounded-none flex items-center justify-center transition border ${
                      sub.done
                        ? "bg-black border-black text-white"
                        : "border-neutral-400 bg-white text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <span
                    className={`font-semibold ${
                      sub.done ? "line-through text-neutral-450" : "text-black"
                    }`}
                  >
                    {sub.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {!isCompleted && (
            <div className="mt-4 flex items-center justify-between gap-2 border-t border-utp-border pt-3">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                {completedSubtasks} de {mission.subtasks.length} completados
              </span>
              <button
                type="button"
                onClick={() =>
                  handleMissionAction(mission, onNavigateToView, onStartCourseFromMission)
                }
                className="bg-[#B50E30] text-white text-xs font-black uppercase tracking-widest px-4 py-2 hover:bg-[#85061B] transition flex items-center gap-1.5 shadow-none rounded-none cursor-pointer"
              >
                {mission.type === "aprendizaje" && mission.externalSuggestionId ? (
                  <ExternalLink className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3 fill-white" />
                )}
                {mission.actionLabel}
              </button>
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
  };

  const renderGrowthNetwork = () => (
    <motion.div
      key="growth-network"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="relative border border-utp-border rounded-none bg-neutral-50/50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-utp-border bg-white">
        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">
          Progreso de ruta
        </span>
        <span className="text-[9px] font-bold uppercase tracking-wider text-[#B50E30]">
          Arrastra hacia la derecha →
        </span>
      </div>

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
        <div
          className="relative shrink-0"
          style={{ width: `${canvasWidth}px`, height: `${ROUTE_NETWORK_CANVAS_HEIGHT}px` }}
        >
          <svg
            width={canvasWidth}
            height={ROUTE_NETWORK_CANVAS_HEIGHT}
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
          >
            {networkEdges.map(([fromId, toId]) => {
              const from = networkNodes.find((n) => n.id === fromId);
              const to = networkNodes.find((n) => n.id === toId);
              if (!from || !to) return null;

              const fromStatus = getNodeStatus(from);
              const toStatus = getNodeStatus(to);
              const isActivePath =
                fromStatus === "completado" ||
                fromStatus === "disponible" ||
                toStatus === "disponible";

              return (
                <line
                  key={`${fromId}-${toId}`}
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={isActivePath ? "#B50E30" : "#D4D4D4"}
                  strokeWidth={isActivePath ? 2.5 : 1.5}
                  strokeDasharray={isActivePath ? "8 5" : "none"}
                  opacity={isActivePath ? 0.75 : 0.45}
                />
              );
            })}
          </svg>

          {networkNodes.map((node) => {
            const status = getNodeStatus(node);
            const isCompleted = status === "completado";
            const isAvailable = status === "disponible";
            const isLocked = status === "bloqueado";
            const isClickable = isAvailable || isCompleted;
            const mission = node.missionId
              ? missions.find((m) => m.id === node.missionId)
              : null;
            const NodeIcon = mission ? getMissionIcon(mission.type) : Check;

            return (
              <button
                key={node.id}
                type="button"
                data-route-node
                disabled={!isClickable}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => handleNodeClick(node)}
                className={`absolute flex flex-col items-center gap-2 -translate-x-1/2 -translate-y-1/2 transition-transform z-10 ${
                  isClickable
                    ? "pointer-events-auto cursor-pointer hover:scale-105"
                    : "pointer-events-none"
                } ${isDragging ? "cursor-grabbing" : ""}`}
                style={{ left: `${node.x}px`, top: `${node.y}px` }}
              >
                <div
                  className={`relative h-14 w-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                    isCompleted
                      ? "bg-black text-white border-black"
                      : isAvailable
                        ? "bg-white text-[#B50E30] border-[#B50E30] shadow-[0_0_20px_rgba(181,14,48,0.35)]"
                        : "bg-white text-neutral-300 border-neutral-200"
                  }`}
                >
                  {isAvailable && (
                    <span className="absolute inset-0 rounded-full border-2 border-[#B50E30] animate-ping opacity-30" />
                  )}
                  {isCompleted ? (
                    <Check className="h-5 w-5 stroke-[3]" />
                  ) : isLocked ? (
                    <Lock className="h-5 w-5" />
                  ) : (
                    <NodeIcon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={`text-[9px] font-black uppercase tracking-tight text-center max-w-[110px] leading-tight ${
                    isAvailable
                      ? "text-[#B50E30]"
                      : isCompleted
                        ? "text-black"
                        : "text-neutral-400"
                  }`}
                >
                  {node.label}
                </span>
              </button>
            );
          })}

          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-neutral-50/90 to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-32 h-full utp-diagonal-pattern opacity-30 select-none pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2">
            <span className="bg-[#B50E30] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none">
              Puesto Objetivo
            </span>
            <span className="text-black font-semibold text-xs uppercase tracking-wide">
              Ciclo {profile.semester}º Universidades UTP
            </span>
          </div>
          <h2 className="text-2xl font-black text-black tracking-tight uppercase">
            {profile.targetRole || "Diagnóstico Pendiente"}
          </h2>
          <p className="text-neutral-600 text-xs max-w-xl font-medium leading-relaxed">
            Tu mentor digital ha estructurado esta ruta interactiva basada en perfiles reales
            contratados en empresas líderes y egresados de la UTP.
          </p>
        </div>

        <div className="flex items-center gap-6 divide-x divide-utp-border bg-neutral-50 p-4 border border-utp-border rounded-none self-start md:self-center relative z-10 shadow-none">
          <div className="flex items-center gap-3">
            <div className="bg-black text-white p-2.5 rounded-none flex items-center justify-center">
              <Trophy className="h-5 w-5 text-[#B50E30]" />
            </div>
            <div>
              <div className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">
                Nivel de Carrera
              </div>
              <div className="text-base font-black text-black uppercase">LVL {profile.level}</div>
            </div>
          </div>
          <div className="pl-6 flex items-center gap-3">
            <div className="bg-[#B50E30] text-white p-2.5 rounded-none flex items-center justify-center">
              <Award className="h-5 w-5" />
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
          <div className="bg-white rounded-none border border-utp-border p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-utp-border">
              <div>
                <h3 className="text-sm font-black text-black uppercase tracking-widest flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[#B50E30] fill-[#B50E30]" />
                  Misiones de Empleabilidad UTP
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Completa desafíos estratégicos y gana experiencia profesional (XP)
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-[#B50E30] uppercase tracking-wider">
                  {missionProgressPercent}% COMPLETADO
                </span>
                <div className="w-24 bg-neutral-100 h-2 rounded-none p-0.5 mt-1 border border-utp-border">
                  <div
                    className="bg-[#B50E30] h-full transition-all duration-550"
                    style={{ width: `${missionProgressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
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
              ) : selectedMission ? (
                renderMissionDetail(selectedMission)
              ) : (
                renderGrowthNetwork()
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-6">
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
                <p className="text-black text-xs font-extrabold uppercase tracking-wide">
                  Sin diagnóstico registrado
                </p>
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
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 rounded-none border border-utp-border text-xs space-y-2 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-black uppercase tracking-tight truncate">
                        {gap.skillName}
                      </span>
                      <span
                        className={`text-[8px] font-black px-1.5 py-0.5 rounded-none uppercase shrink-0 ${
                          gap.priority === "alta"
                            ? "bg-[#B50E30] text-white"
                            : gap.priority === "media"
                              ? "bg-black text-white"
                              : "bg-neutral-200 text-black"
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </div>
                    <p className="text-neutral-600 text-[11px] leading-relaxed font-medium">
                      {gap.description}
                    </p>
                    <div className="bg-white p-2.5 rounded-none border border-utp-border space-y-1">
                      <div className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider">
                        Recurso Recomendado
                      </div>
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

          <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
            <div className="pb-2 border-b border-utp-border flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#B50E30]" />
              <h3 className="text-xs font-black text-black uppercase tracking-widest">
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
