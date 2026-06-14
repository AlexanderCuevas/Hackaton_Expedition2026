import { CareerMission, EnrolledCourse, SkillGap } from "../types";
import {
  CERTIFICATIONS_AND_COURSES,
  EXTERNAL_COURSE_SUGGESTIONS,
} from "../data";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchByKeywords(gapNorm: string, target: string): boolean {
  const targetNorm = normalize(target);
  if (gapNorm.includes(targetNorm) || targetNorm.includes(gapNorm)) return true;

  const keywords: [string, string[]][] = [
    ["sql", ["sql", "base de datos", "bases de datos", "datos"]],
    ["aws", ["aws", "cloud", "nube", "certified cloud"]],
    ["scrum", ["scrum", "agil", "agile", "metodolog"]],
    ["figma", ["figma", "ux", "ui", "diseño", "diseno"]],
    ["comunicacion", ["comunicacion", "storytelling", "oratoria"]],
  ];

  for (const [, terms] of keywords) {
    const gapHit = terms.some((t) => gapNorm.includes(t));
    const targetHit = terms.some((t) => targetNorm.includes(t));
    if (gapHit && targetHit) return true;
  }

  return false;
}

export function matchInternalCourse(gap: SkillGap) {
  const gapNorm = normalize(gap.skillName);
  const resourceNorm = normalize(gap.recommendedResource);

  return CERTIFICATIONS_AND_COURSES.find((course) => {
    if (course.linkedGap && matchByKeywords(gapNorm, course.linkedGap)) return true;
    if (matchByKeywords(gapNorm, course.title)) return true;
    if (matchByKeywords(resourceNorm, course.title)) return true;
    if (course.linkedGap && matchByKeywords(resourceNorm, course.linkedGap)) return true;
    return false;
  });
}

export function matchExternalSuggestion(gap: SkillGap) {
  const gapNorm = normalize(gap.skillName);

  return EXTERNAL_COURSE_SUGGESTIONS.find((suggestion) => {
    if (matchByKeywords(gapNorm, suggestion.linkedGap)) return true;
    if (matchByKeywords(gapNorm, suggestion.title)) return true;
    return false;
  });
}

function createLearningMissionFromCourse(
  course: (typeof CERTIFICATIONS_AND_COURSES)[number],
  gap: SkillGap
): CareerMission {
  return {
    id: `m_learn_${course.id}`,
    title: `Curso: ${course.title}`,
    description: `Cierra tu brecha en "${gap.skillName}". ${course.description}`,
    xpValue: Math.round(course.pointsAwarded / 2),
    type: "aprendizaje",
    status: "bloqueado",
    order: 0,
    actionLabel: "Ir al curso",
    courseId: course.id,
    subtasks: [
      { text: `Inscribirte en "${course.title}"`, done: false },
      { text: "Completar al menos 2 lecciones del módulo", done: false },
      { text: "Alcanzar 50% de progreso en el curso", done: false },
    ],
  };
}

function createExternalLearningMission(
  suggestion: (typeof EXTERNAL_COURSE_SUGGESTIONS)[number],
  gap: SkillGap
): CareerMission {
  return {
    id: `m_ext_${suggestion.id}`,
    title: `${suggestion.platform}: ${suggestion.title}`,
    description: `Sugerencia externa para cerrar "${gap.skillName}". ${suggestion.highlight}`,
    xpValue: 60,
    type: "aprendizaje",
    status: "bloqueado",
    order: 0,
    actionLabel: `Ver en ${suggestion.platform}`,
    externalSuggestionId: suggestion.id,
    subtasks: [
      { text: `Revisar el curso en ${suggestion.platform}`, done: false },
      { text: "Guardar el curso en Mis Cursos", done: false },
      { text: "Completar al menos el 30% del contenido", done: false },
    ],
  };
}

export function integrateRouteWithCourses(
  gaps: SkillGap[],
  aiMissions: CareerMission[]
): { gaps: SkillGap[]; missions: CareerMission[] } {
  const enrichedGaps = gaps.map((gap) => {
    const internal = matchInternalCourse(gap);
    const external = internal ? undefined : matchExternalSuggestion(gap);

    let recommendedResource = gap.recommendedResource;
    if (internal) {
      recommendedResource = `${internal.title} — ${internal.provider} (${internal.cost})`;
    } else if (external) {
      recommendedResource = `${external.title} — ${external.platform} (${external.price})`;
    }

    return { ...gap, recommendedResource };
  });

  const learningMissions: CareerMission[] = [];
  const usedCourseIds = new Set<string>();
  const usedExternalIds = new Set<string>();

  const sortedGaps = [...enrichedGaps].sort((a, b) => {
    const priority = { alta: 0, media: 1, baja: 2 };
    return priority[a.priority] - priority[b.priority];
  });

  for (const gap of sortedGaps) {
    const internal = matchInternalCourse(gap);
    if (internal && !usedCourseIds.has(internal.id)) {
      usedCourseIds.add(internal.id);
      learningMissions.push(createLearningMissionFromCourse(internal, gap));
      continue;
    }

    const external = matchExternalSuggestion(gap);
    if (external && !usedExternalIds.has(external.id)) {
      usedExternalIds.add(external.id);
      learningMissions.push(createExternalLearningMission(external, gap));
    }
  }

  const aiSorted = [...aiMissions].sort((a, b) => a.order - b.order);
  const firstMission = aiSorted[0] ? [aiSorted[0]] : [];
  const remainingMissions = aiSorted.slice(1);
  const merged = [...firstMission, ...learningMissions, ...remainingMissions];

  const missions = merged.map((mission, idx) => ({
    ...mission,
    order: idx + 1,
    status: (idx === 0 ? "disponible" : "bloqueado") as CareerMission["status"],
  }));

  return { gaps: enrichedGaps, missions };
}

export function shortenMissionLabel(title: string, maxLength = 26): string {
  const upper = title.toUpperCase();
  if (upper.length <= maxLength) return upper;
  return `${upper.slice(0, maxLength - 1)}…`;
}

export interface RouteNetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  missionId?: string;
  defaultStatus?: CareerMission["status"];
}

const FOUNDATION_NODES: Omit<RouteNetworkNode, "x" | "y">[] = [
  { id: "adn", label: "ADN PROFESIONAL", defaultStatus: "completado" },
  { id: "marca", label: "MARCA PERSONAL", defaultStatus: "completado" },
];

const NODE_SPACING_X = 210;
const CANVAS_START_X = 110;
const CANVAS_CENTER_Y = 155;
const CANVAS_HEIGHT = 400;
const Y_WAVE = 36;

export function buildNetworkFromMissions(missions: CareerMission[]): {
  nodes: RouteNetworkNode[];
  edges: [string, string][];
  canvasWidth: number;
} {
  const sorted = [...missions].sort((a, b) => a.order - b.order);
  const totalNodes = FOUNDATION_NODES.length + sorted.length;

  const foundationNodes: RouteNetworkNode[] = FOUNDATION_NODES.map((node, idx) => ({
    ...node,
    x: CANVAS_START_X + idx * NODE_SPACING_X,
    y: CANVAS_CENTER_Y + (idx % 2 === 0 ? Y_WAVE * 0.4 : -Y_WAVE * 0.4),
  }));

  const missionNodes: RouteNetworkNode[] = sorted.map((mission, idx) => {
    const globalIdx = FOUNDATION_NODES.length + idx;
    const wave = idx % 2 === 0 ? -Y_WAVE : Y_WAVE;
    const yOffset = idx % 3 === 1 ? wave * 0.55 : wave;

    return {
      id: `node_${mission.id}`,
      label: shortenMissionLabel(mission.title, 22),
      x: CANVAS_START_X + globalIdx * NODE_SPACING_X,
      y: CANVAS_CENTER_Y + yOffset,
      missionId: mission.id,
    };
  });

  const nodes = [...foundationNodes, ...missionNodes];
  const edges: [string, string][] = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push([nodes[i].id, nodes[i + 1].id]);
  }

  const canvasWidth = CANVAS_START_X + (totalNodes - 1) * NODE_SPACING_X + CANVAS_START_X;

  return { nodes, edges, canvasWidth };
}

export const ROUTE_NETWORK_CANVAS_HEIGHT = CANVAS_HEIGHT;

export function unlockSequentialMissions(missions: CareerMission[]): CareerMission[] {
  return missions.map((mission, idx) => {
    if (mission.status !== "bloqueado") return mission;
    const prev = missions[idx - 1];
    if (prev?.status === "completado") {
      return { ...mission, status: "disponible" };
    }
    return mission;
  });
}

export function syncMissionsWithEnrollments(
  missions: CareerMission[],
  enrolledCourses: EnrolledCourse[]
): { missions: CareerMission[]; newlyCompleted: CareerMission[] } {
  const newlyCompleted: CareerMission[] = [];

  const updated = missions.map((mission) => {
    if (mission.type !== "aprendizaje") return mission;

    const enrollment = mission.courseId
      ? enrolledCourses.find((e) => e.courseId === mission.courseId && e.source === "internal")
      : mission.externalSuggestionId
        ? enrolledCourses.find(
            (e) => e.courseId === mission.externalSuggestionId && e.source === "external"
          )
        : undefined;

    if (!enrollment) return mission;

    const lessonCount = enrollment.completedLessons.length;
    const progress = enrollment.progress;

    let subtasks = mission.subtasks;
    if (mission.courseId) {
      if (progress >= 100) {
        subtasks = mission.subtasks.map((sub) => ({ ...sub, done: true }));
      } else {
        subtasks = mission.subtasks.map((sub, idx) => {
          if (idx === 0) return { ...sub, done: true };
          if (idx === 1) return { ...sub, done: lessonCount >= 2 };
          if (idx === 2) return { ...sub, done: progress >= 50 };
          return sub;
        });
      }
    } else if (mission.externalSuggestionId) {
      subtasks = mission.subtasks.map((sub, idx) => {
        if (idx === 0) return { ...sub, done: lessonCount >= 1 || progress > 0 };
        if (idx === 1) return { ...sub, done: true };
        if (idx === 2) return { ...sub, done: progress >= 30 };
        return sub;
      });
    }

    const allDone = subtasks.every((s) => s.done);
    const wasCompleted = mission.status === "completado";
    const status = allDone ? "completado" : mission.status;

    const nextMission = { ...mission, subtasks, status };
    if (allDone && !wasCompleted) {
      newlyCompleted.push(nextMission);
    }
    return nextMission;
  });

  return {
    missions: unlockSequentialMissions(updated),
    newlyCompleted,
  };
}
