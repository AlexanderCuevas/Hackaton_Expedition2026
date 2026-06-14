import React, { useState, useEffect } from "react";
import { UserProfile, SkillGap, CareerMission, CvAnalysis, InterviewSession, EnrolledCourse, CvMeta } from "./types";
import { 
  Trophy, Award, BookOpen, AlertCircle, ArrowRight, CheckCircle, Lock, Play, Zap,
  Briefcase, GraduationCap, FileText, MessageSquare, Users, PhoneCall, ChevronRight, ChevronLeft,
  Menu, X, Sparkles, LogOut, CheckSquare, Bell, Calendar, User
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
import avatarImg from "./components/assets/usuario.png";

// Components
import RouteDashboard from "./components/RouteDashboard";
import DiagnosticoWizard from "./components/DiagnosticoWizard";
import CvAnalyzerPanel from "./components/CvAnalyzerPanel";
import InterviewPanel from "./components/InterviewPanel";
import SocialHub from "./components/SocialHub";
import NotificationBell from "./components/NotificationBell";
import NotificationDrawer from "./components/NotificationDrawer";
import { NotificationProvider } from "./context/NotificationContext";
import WhatsAppPreview from "./components/WhatsAppPreview";
import UserProfilePanel from "./components/UserProfilePanel";
import VacanciesPanel from "./components/VacanciesPanel";
import LandingPage from "./components/LandingPage";
import MyCoursesPanel from "./components/MyCoursesPanel";

// Mock Data
import { INITIAL_VACANCIES, CERTIFICATIONS_AND_COURSES, UNIVERSITY_EVENTS } from "./data";
import { integrateRouteWithCourses, syncMissionsWithEnrollments, unlockSequentialMissions } from "./utils/courseMatcher";
import { MockStudent } from "./mockStudents";


// Preloaded state for Hackathon demo so that it's highly populated instantly
const MOCK_INITIAL_PROFILE: UserProfile = {
  name: "Valeria Alva",
  career: "Ingeniería de Sistemas",
  semester: 7,
  experienceLevel: "Proyectos personales o académicos de alta exigencia",
  targetRole: "Junior Full Stack Developer",
  currentSkills: ["HTML/CSS", "JavaScript", "SQL Server", "TypeScript", "React"],
  interests: ["Inteligencia Artificial", "Cloud Computing"],
  employabilityScore: 68,
  xp: 320,
  level: 2,
  progressToNextLevel: 60,
  cognitiveProfile: [
    { subject: 'Razonamiento Lógico', A: 85, B: 65, fullMark: 100 },
    { subject: 'Razonamiento Verbal', A: 65, B: 70, fullMark: 100 },
    { subject: 'Razonamiento Numérico', A: 90, B: 60, fullMark: 100 },
    { subject: 'Resolución de Problemas', A: 80, B: 68, fullMark: 100 },
    { subject: 'Pensamiento Crítico', A: 75, B: 65, fullMark: 100 },
  ],
  personalityTraits: [
    { name: "Apertura a la experiencia", userScore: 82, averageScore: 65, leftLabel: "Convencional, concreto", rightLabel: "Curioso, abstracto" },
    { name: "Responsabilidad", userScore: 88, averageScore: 70, leftLabel: "Descuidado, indisciplinado", rightLabel: "Meticuloso, orientado a metas" },
    { name: "Disposición al riesgo", userScore: 45, averageScore: 60, leftLabel: "Tiende a ser cauteloso", rightLabel: "Propenso a tomar riesgos" },
    { name: "Reconocimiento emocional", userScore: 75, averageScore: 68, leftLabel: "Dificultad para identificar", rightLabel: "Gran habilidad de lectura" }
  ]
};

const MOCK_INITIAL_GAPS: SkillGap[] = [
  {
    skillName: "Modelamiento de Bases de Datos SQL",
    category: "tecnica",
    priority: "alta",
    description: "Es indispensable consolidar bases de datos estructuradas y realizar consultas complejas multi-tabla para resolver requisitos backend en BCP o Interbank.",
    recommendedResource: "Curso Práctico de SQL en SkillPath Academy",
    status: "pendiente"
  },
  {
    skillName: "Metodologías Ágiles (Scrum)",
    category: "blanda",
    priority: "media",
    description: "Muy demandado en equipos interdisciplinarios para entregas semanales de productos en sprints ágiles.",
    recommendedResource: "Fundamentos de Scrum en LinkedIn Learning",
    status: "pendiente"
  },
  {
    skillName: "AWS Certified Cloud Practitioner",
    category: "certificacion",
    priority: "alta",
    description: "Saber estructurar y desplegar arquitecturas en la nube te otorgará distinción competitiva frente a otros egresados.",
    recommendedResource: "Ruta AWS Foundations AWS Academy",
    status: "pendiente"
  }
];

const BASE_INITIAL_MISSIONS: CareerMission[] = [
  {
    id: "m_cv_01",
    title: "Optimizar CV para filtros ATS",
    description: "Asegura términos óptimos exigidos por los escáneres de contratación automáticos.",
    xpValue: 80,
    type: "documento",
    status: "disponible",
    order: 1,
    actionLabel: "Ir al Analizador de CV",
    subtasks: [
      { text: "Copiar tu currículum en el CV Analyzer", done: false },
      { text: "Implementar las palabras clave exigidas", done: false },
      { text: "Lograr un score ATS mayor a 75%", done: false }
    ]
  },
  {
    id: "m_int_01",
    title: "Simular Entrevista Técnico-Comportamental",
    description: "Practica respuestas clave con nuestro Mentor Reclutador IA.",
    xpValue: 120,
    type: "simulacion",
    status: "bloqueado",
    order: 2,
    actionLabel: "Empezar simulación",
    subtasks: [
      { text: "Contactar con el simulador interactivo", done: false },
      { text: "Responder al menos 3 preguntas de la IA", done: false },
      { text: "Obtener feedback aprobatorio", done: false }
    ]
  },
  {
    id: "m_net_01",
    title: "Conectar con 2 Mentores Especializados",
    description: "Propulsa tu red de contactos interactuando con egresados profesionales.",
    xpValue: 100,
    type: "networking",
    status: "bloqueado",
    order: 3,
    actionLabel: "Buscar en Comunidad",
    subtasks: [
      { text: "Enviar solicitud a un mentor en el campus", done: false },
      { text: "Comentar en una publicación del feed de proyectos", done: false }
    ]
  }
];

const { gaps: MOCK_INITIAL_GAPS_ENRICHED, missions: MOCK_INITIAL_MISSIONS } =
  integrateRouteWithCourses(MOCK_INITIAL_GAPS, BASE_INITIAL_MISSIONS);

export default function App() {
  const [view, setView] = useState<string>("dashboard");
  const [profile, setProfile] = useState<UserProfile>(MOCK_INITIAL_PROFILE);
  const [gaps, setGaps] = useState<SkillGap[]>(MOCK_INITIAL_GAPS_ENRICHED);
  const [missions, setMissions] = useState<CareerMission[]>(MOCK_INITIAL_MISSIONS);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [diagnosisCompleted, setDiagnosisCompleted] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CvAnalysis | null>(null);
  const [cvMeta, setCvMeta] = useState<CvMeta | null>(null);
  const [cvText, setCvText] = useState<string>("");
  const [currentStudentCode, setCurrentStudentCode] = useState<string | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem("sp_profile");
    const savedGaps = localStorage.getItem("sp_gaps");
    const savedMissions = localStorage.getItem("sp_missions");
    const savedCourses = localStorage.getItem("sp_enrolled_courses");
    const savedCvAnalysis = localStorage.getItem("sp_cv_analysis");
    const savedCvMeta = localStorage.getItem("sp_cv_meta");
    const authenticated = localStorage.getItem("sp_authenticated") === "true";
    const diagnosisDone = localStorage.getItem("sp_diagnosis_completed") === "true";

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile({ ...MOCK_INITIAL_PROFILE, ...parsed });
    }
    if (savedGaps) setGaps(JSON.parse(savedGaps));

    const loadedCourses: EnrolledCourse[] = savedCourses ? JSON.parse(savedCourses) : [];
    let loadedMissions: CareerMission[] = savedMissions
      ? JSON.parse(savedMissions)
      : MOCK_INITIAL_MISSIONS;

    if (loadedCourses.length > 0) {
      loadedMissions = syncMissionsWithEnrollments(loadedMissions, loadedCourses).missions;
    }

    setMissions(loadedMissions);
    setEnrolledCourses(loadedCourses);
    setIsAuthenticated(authenticated);
    setDiagnosisCompleted(diagnosisDone);
    if (savedCvAnalysis) setCvAnalysis(JSON.parse(savedCvAnalysis));
    if (savedCvMeta) setCvMeta(JSON.parse(savedCvMeta));
    setCvText(localStorage.getItem("sp_cv_text") || "");

    if (authenticated) {
      setView(diagnosisDone ? "dashboard" : "diagnostico");
    }

    setIsHydrated(true);
  }, []);

  // Save changes to state
  const saveEnrolledCourses = (courses: EnrolledCourse[]) => {
    setEnrolledCourses(courses);
    localStorage.setItem("sp_enrolled_courses", JSON.stringify(courses));
  };

  const applyMissionXp = (xpAwarded: number) => {
    let newLevel = profile.level;
    let nextLevelProgress = profile.progressToNextLevel + xpAwarded / 2;
    let didLevelUp = false;

    if (nextLevelProgress >= 100) {
      didLevelUp = true;
      newLevel += 1;
      nextLevelProgress -= 100;
    }

    const updatedProfile = {
      ...profile,
      xp: profile.xp + xpAwarded,
      level: newLevel,
      progressToNextLevel: Math.min(nextLevelProgress, 100),
    };

    return { updatedProfile, didLevelUp, newLevel };
  };

  const syncAndSaveMissions = (
    currentMissions: CareerMission[],
    courses: EnrolledCourse[],
    notify = true
  ) => {
    const { missions: syncedMissions, newlyCompleted } = syncMissionsWithEnrollments(
      currentMissions,
      courses
    );

    const missionsChanged =
      JSON.stringify(syncedMissions) !== JSON.stringify(currentMissions);

    if (!missionsChanged && newlyCompleted.length === 0) {
      return syncedMissions;
    }

    if (newlyCompleted.length === 0) {
      saveState(profile, gaps, syncedMissions);
      return syncedMissions;
    }

    const totalXp = newlyCompleted.reduce((sum, m) => sum + m.xpValue, 0);
    const { updatedProfile, didLevelUp, newLevel } = applyMissionXp(totalXp);
    saveState(updatedProfile, gaps, syncedMissions);

    if (notify) {
      for (const mission of newlyCompleted) {
        triggerNotification(`🎉 ¡Misión completada: "${mission.title}"! +${mission.xpValue} XP`);
      }
      if (didLevelUp) {
        setTimeout(() => {
          triggerNotification(`🌟 ¡FELICIDADES! Subiste al Nivel de Empleabilidad Lvl ${newLevel}!`);
        }, 1500);
      }
    }

    return syncedMissions;
  };

  const handleEnrollCourse = (courseId: string) => {
    if (enrolledCourses.some((c) => c.courseId === courseId && c.source === "internal")) {
      syncAndSaveMissions(missions, enrolledCourses, false);
      setView("mycourses");
      return;
    }

    const course = CERTIFICATIONS_AND_COURSES.find((c) => c.id === courseId);
    if (!course) return;

    const newEnrollment: EnrolledCourse = {
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      source: "internal",
    };

    const updatedCourses = [...enrolledCourses, newEnrollment];
    saveEnrolledCourses(updatedCourses);
    handleAddXpDirectly(50);
    syncAndSaveMissions(missions, updatedCourses);
    setView("mycourses");
    triggerNotification(`📖 Inscripción confirmada en "${course.title}". ¡Continúa en Mis Cursos!`);
  };

  const handleEnrollExternalCourse = (suggestionId: string) => {
    if (enrolledCourses.some((c) => c.courseId === suggestionId)) {
      triggerNotification("Este curso ya está guardado en Mis Cursos.");
      return;
    }

    const newEnrollment: EnrolledCourse = {
      courseId: suggestionId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      completedLessons: [],
      source: "external",
    };

    saveEnrolledCourses([...enrolledCourses, newEnrollment]);
    syncAndSaveMissions(missions, [...enrolledCourses, newEnrollment]);
    triggerNotification("✅ Curso externo guardado en Mis Cursos.");
  };

  const handleCompleteLesson = (courseId: string, lessonId: string, xpReward: number) => {
    const course = CERTIFICATIONS_AND_COURSES.find((c) => c.id === courseId);
    if (!course) return;

    const updatedCourses = enrolledCourses.map((enrollment) => {
      if (enrollment.courseId !== courseId) return enrollment;

      if (enrollment.completedLessons.includes(lessonId)) return enrollment;

      const completedLessons = [...enrollment.completedLessons, lessonId];
      const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const progress = Math.round((completedLessons.length / totalLessons) * 100);

      return { ...enrollment, completedLessons, progress };
    });

    saveEnrolledCourses(updatedCourses);

    const { missions: syncedMissions, newlyCompleted } = syncMissionsWithEnrollments(
      missions,
      updatedCourses
    );
    const missionXp = newlyCompleted.reduce((sum, m) => sum + m.xpValue, 0);
    const totalXp = xpReward + missionXp;

    let newLevel = profile.level;
    let nextLevelProgress = profile.progressToNextLevel + totalXp / 2;
    let didLevelUp = false;

    if (nextLevelProgress >= 100) {
      didLevelUp = true;
      newLevel += 1;
      nextLevelProgress -= 100;
    }

    const updatedProfile = {
      ...profile,
      xp: profile.xp + totalXp,
      level: newLevel,
      progressToNextLevel: Math.min(nextLevelProgress, 100),
    };

    saveState(updatedProfile, gaps, syncedMissions);
    triggerNotification(`🎯 ¡Ganaste +${xpReward} XP por completar la lección!`);

    for (const mission of newlyCompleted) {
      triggerNotification(`🎉 ¡Misión completada: "${mission.title}"! +${mission.xpValue} XP`);
    }
    if (didLevelUp) {
      setTimeout(() => {
        triggerNotification(`🌟 ¡FELICIDADES! Subiste al Nivel de Empleabilidad Lvl ${newLevel}!`);
      }, 1500);
    }
  };

  const saveState = (updatedProfile: UserProfile, updatedGaps: SkillGap[], updatedMissions: CareerMission[]) => {
    setProfile(updatedProfile);
    setGaps(updatedGaps);
    setMissions(updatedMissions);
    localStorage.setItem("sp_profile", JSON.stringify(updatedProfile));
    localStorage.setItem("sp_gaps", JSON.stringify(updatedGaps));
    localStorage.setItem("sp_missions", JSON.stringify(updatedMissions));
  };

  const handleCompleteSubtask = (missionId: string, subtaskIndex: number) => {
    let xpAwarded = 0;
    let didLevelUp = false;
    let newLevel = profile.level;
    let isMissionCompleted = false;

    const updatedMissions = missions.map((m) => {
      if (m.id === missionId) {
        const updatedSubtasks = m.subtasks.map((sub, sIdx) => {
          if (sIdx === subtaskIndex) {
            return { ...sub, done: !sub.done };
          }
          return sub;
        });

        const allDone = updatedSubtasks.every(s => s.done);
        let nextStatus = m.status;
        if (allDone && m.status !== "completado") {
          nextStatus = "completado";
          xpAwarded = m.xpValue;
          isMissionCompleted = true;
        }

        return {
          ...m,
          subtasks: updatedSubtasks,
          status: nextStatus
        };
      }
      return m;
    });

    const finalMissions = unlockSequentialMissions(updatedMissions);

    let newXp = profile.xp + xpAwarded;
    let nextLevelProgress = profile.progressToNextLevel + (xpAwarded / 2); // incremental scale

    if (nextLevelProgress >= 100) {
      didLevelUp = true;
      newLevel += 1;
      nextLevelProgress = nextLevelProgress - 100;
    }

    const updatedProfile = {
      ...profile,
      xp: newXp,
      level: newLevel,
      progressToNextLevel: Math.min(nextLevelProgress, 100)
    };

    saveState(updatedProfile, gaps, finalMissions);

    if (isMissionCompleted) {
      triggerNotification(`🎉 ¡Misión completada! Ganaste +${xpAwarded} puntos de XP.`);
    }
    if (didLevelUp) {
      setTimeout(() => {
        triggerNotification(`🌟 ¡FELICIDADES! Subiste al Nivel de Empleabilidad Lvl ${newLevel}!`);
      }, 1500);
    }
  };

  const handleAddXpDirectly = (xp: number) => {
    let nextLevelProgress = profile.progressToNextLevel + (xp / 2);
    let newLevel = profile.level;
    let didLevelUp = false;

    if (nextLevelProgress >= 100) {
      didLevelUp = true;
      newLevel += 1;
      nextLevelProgress = nextLevelProgress - 100;
    }

    const updatedProfile = {
      ...profile,
      xp: profile.xp + xp,
      level: newLevel,
      progressToNextLevel: Math.min(nextLevelProgress, 100)
    };

    saveState(updatedProfile, gaps, missions);
    triggerNotification(`🎯 ¡Ganaste +${xp} XP por participar!`);

    if (didLevelUp) {
      setTimeout(() => {
        triggerNotification(`🌟 ¡Subiste al Nivel ${newLevel}! ¡Sigue creciendo!`);
      }, 1500);
    }
  };

  const triggerNotification = (text: string) => {
    setActiveNotification(text);
    setTimeout(() => {
      setActiveNotification(null);
    }, 4000);
  };

  const handleStartCourseFromMission = (mission: CareerMission) => {
    if (mission.courseId) {
      handleEnrollCourse(mission.courseId);
      setView("mycourses");
      return;
    }

    if (mission.externalSuggestionId) {
      handleEnrollExternalCourse(mission.externalSuggestionId);
      setView("mycourses");
    }
  };

  const handleDiagnosisComplete = (
    updatedProfile: UserProfile,
    cvText: string,
    meta: CvMeta
  ) => {
    setProfile(updatedProfile);
    localStorage.setItem("sp_profile", JSON.stringify(updatedProfile));
    localStorage.setItem("sp_cv_text", cvText);
    localStorage.setItem("sp_cv_meta", JSON.stringify(meta));
    localStorage.setItem("sp_diagnosis_completed", "true");
    setDiagnosisCompleted(true);
    setCvMeta(meta);
    setCvText(cvText);
    setView("cvanalyzer");
    triggerNotification("✅ Diagnóstico completado. Continúa en la sección Análisis.");
  };

  const handleApplicationCompleted = (company: string, roleName: string) => {
    triggerNotification(`📬 ¡Candidatura enviada a ${company} como ${roleName}!`);
    handleAddXpDirectly(50);
  };

  const handleLandingStart = (profileData: Partial<UserProfile>, isNewUser: boolean, hasCv?: boolean, student?: MockStudent) => {
    localStorage.setItem("sp_authenticated", "true");
    setIsAuthenticated(true);

    // ── Caso 1: Usuario con CV ya cargado (hasCv = true) — va al wizard con datos simulados ──
    if (hasCv && student) {
      const studentProfile: UserProfile = {
        name: student.name,
        career: student.career,
        semester: student.semester,
        experienceLevel: "",
        targetRole: student.targetRole || "",
        currentSkills: [],
        softSkills: [],
        interests: student.interests || [],
        employabilityScore: 0,
        xp: 0,
        level: 1,
        progressToNextLevel: 0,
        email: student.email,
        phone: student.phone,
        linkedin: student.linkedin,
        github: student.github,
      };

      setProfile(studentProfile);
      setCurrentStudentCode(student.code);
      setGaps([]);
      setMissions([]);
      setEnrolledCourses([]);
      setDiagnosisCompleted(false);
      setCvAnalysis(null);
      setCvMeta(null);
      setCvText("");

      localStorage.setItem("sp_profile", JSON.stringify(studentProfile));
      localStorage.setItem("sp_gaps", JSON.stringify([]));
      localStorage.setItem("sp_missions", JSON.stringify([]));
      localStorage.setItem("sp_enrolled_courses", JSON.stringify([]));
      localStorage.removeItem("sp_diagnosis_completed");
      localStorage.removeItem("sp_cv_analysis");
      localStorage.removeItem("sp_cv_meta");
      localStorage.removeItem("sp_cv_text");

      setView("diagnostico");
      triggerNotification(
        `👋 ¡Bienvenido, ${student.name}! Usa "Extraer con IA" para cargar tus datos simulados.`
      );
      return;
    }

    // ── Caso 2: Usuario nuevo sin CV ──
    const studentProfile: UserProfile = {
      name: profileData.name || "Estudiante UTP",
      career: profileData.career || "",
      semester: profileData.semester || 1,
      experienceLevel: "",
      targetRole: profileData.targetRole || "",
      currentSkills: [],
      softSkills: [],
      interests: [],
      employabilityScore: 0,
      xp: 0,
      level: 1,
      progressToNextLevel: 0,
      email: profileData.email,
      phone: profileData.phone,
      linkedin: profileData.linkedin,
      github: profileData.github,
    };

    if (isNewUser) {
      setProfile(studentProfile);
      setCurrentStudentCode(student?.code || null);
      setGaps([]);
      setMissions([]);
      setEnrolledCourses([]);
      localStorage.setItem("sp_profile", JSON.stringify(studentProfile));
      localStorage.setItem("sp_gaps", JSON.stringify([]));
      localStorage.setItem("sp_missions", JSON.stringify([]));
      localStorage.setItem("sp_enrolled_courses", JSON.stringify([]));
      localStorage.removeItem("sp_diagnosis_completed");
      localStorage.removeItem("sp_cv_analysis");
      localStorage.removeItem("sp_cv_meta");
      localStorage.removeItem("sp_cv_text");
      setDiagnosisCompleted(false);
      setCvAnalysis(null);
      setCvMeta(null);
      setCvText("");
      setView("diagnostico");
      triggerNotification(
        `🎉 ¡Bienvenido, ${studentProfile.name}! Completa tu diagnóstico para continuar.`
      );
      return;
    }

    // ── Caso 3: Usuario recurrente ──
    const savedProfile = localStorage.getItem("sp_profile");
    const merged = savedProfile
      ? { ...JSON.parse(savedProfile), name: studentProfile.name, career: studentProfile.career, semester: studentProfile.semester }
      : studentProfile;
    setProfile({ ...MOCK_INITIAL_PROFILE, ...merged });
    setCurrentStudentCode(student?.code || null);

    const diagnosisDone = localStorage.getItem("sp_diagnosis_completed") === "true";
    setDiagnosisCompleted(diagnosisDone);
    setView(diagnosisDone ? "dashboard" : "diagnostico");
    triggerNotification(`👋 ¡Hola de nuevo, ${merged.name}! ${diagnosisDone ? "Retoma tu ruta." : "Termina tu diagnóstico."}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("sp_authenticated");
    setIsAuthenticated(false);
    setView("dashboard");
  };

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <LandingPage
        onStart={handleLandingStart}
        currentProfileName={profile.name !== MOCK_INITIAL_PROFILE.name ? profile.name : ""}
      />
    );
  }

  if (!diagnosisCompleted) {
    return (
      <>
        <AnimatePresence>
          {activeNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 16, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-0 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
            >
              <div className="bg-black border-l-4 border-utp-red text-white p-4 rounded-none shadow-xl flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-utp-red fill-utp-red shrink-0" />
                <p className="text-xs font-semibold leading-relaxed text-white">{activeNotification}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <DiagnosticoWizard
          currentProfile={profile}
          onComplete={handleDiagnosisComplete}
          studentCode={currentStudentCode ?? undefined}
        />
      </>
    );
  }

  return (
    <NotificationProvider>
    <div className="min-h-screen bg-[#FFFFFF] text-black flex flex-col font-sans">
      {/* Absolute Dynamic Celebrations Banner */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 16, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50 max-w-md w-full px-4"
          >
            <div className="bg-black border-l-4 border-utp-red text-white p-4 rounded-none shadow-xl flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-utp-red fill-utp-red shrink-0" />
              <p className="text-xs font-semibold leading-relaxed text-white">{activeNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Framework Wrapper */}
      <div className="flex min-h-screen">
        {/* Sidebar Container - Fixed, full height */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} fixed left-0 top-0 h-screen bg-black text-white/75 border-r border-[#1a1a1a] flex flex-col justify-between p-5 hidden md:flex transition-all duration-300 z-40 group`}>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-[#B50E30] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10 shadow-md"
          >
            {sidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </button>
          <div className="space-y-6">
            {/* Signature Brand Header */}
            <div className={`flex items-center gap-2.5 pb-5 border-b border-[#1a1a1a] ${sidebarOpen ? '' : 'justify-center'}`}>
              <div className="h-9 w-9 bg-utp-red flex items-center justify-center text-white rounded">
                <Sparkles className="h-5 w-5 fill-white" />
              </div>
              <div className={`flex-col ${sidebarOpen ? 'flex' : 'hidden'}`}>
                <span className="font-black text-white text-base tracking-tight leading-none uppercase">Despega UTP</span>
                <span className="text-[10px] text-utp-red font-bold tracking-widest mt-1">HACKATHON UTP+</span>
              </div>
            </div>

            {/* Menu Sections Navigation */}
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Mi Ruta", icon: Trophy },
                { id: "profile", label: "Mi Perfil", icon: User },
                { id: "diagnostico", label: "Diagnóstico IA", icon: GraduationCap },
                { id: "cvanalyzer", label: "Análisis", icon: FileText },
                { id: "interviewer", label: "Entrevistas IA", icon: MessageSquare },
                { id: "jobs", label: "Vacantes & Match", icon: Briefcase },
                { id: "resources", label: "Capacitaciones", icon: Award },
                { id: "community", label: "Networking", icon: Users },
                { id: "whatsapp", label: "WhatsApp Tutor", icon: PhoneCall },
              ]
                .filter((item) => !(item.id === "diagnostico" && diagnosisCompleted))
                .map((item) => {
                const IconComponent = item.icon;
                const isActive = view === item.id;
                return (
                    <button
                      key={item.id}
                      onClick={() => setView(item.id)}
                      className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3.5' : 'justify-center px-1'} py-2.5 rounded-none text-xs font-bold font-sans uppercase tracking-wider transition cursor-pointer select-none ${
                        isActive
                          ? "bg-utp-red text-white"
                          : "hover:bg-[#121212] text-white/80 hover:text-white"
                      }`}
                    >
                      <IconComponent className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-neutral-400"}`} />
                    <span className={`${sidebarOpen ? 'inline' : 'hidden'}`}>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Logged Info Capsule */}
          <div className={`${sidebarOpen ? 'p-4' : 'p-2'} bg-[#121212] rounded-none space-y-3.5 border border-[#1a1a1a]`}>
            <div className={`flex items-center ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
              <div className={`text-xs font-extrabold text-white max-w-[120px] truncate ${sidebarOpen ? 'block' : 'hidden'}`}>{profile.name}</div>
              <span className="bg-utp-red text-white font-black text-[9px] px-2 py-0.5 rounded-none uppercase">
                LVL {profile.level}
              </span>
            </div>

            <div className={`space-y-1.5 ${sidebarOpen ? 'block' : 'hidden'}`}>
              <div className="flex items-center justify-between text-[9px] text-neutral-400 uppercase font-bold tracking-wider">
                <span>XP: {profile.xp}</span>
                <span>{profile.progressToNextLevel}%</span>
              </div>
              <div className="w-full bg-[#1e1e1e] h-1 rounded-none overflow-hidden">
                <div
                  className="bg-utp-red h-full transition-all duration-300"
                  style={{ width: `${profile.progressToNextLevel}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-wider text-neutral-400 hover:text-white transition cursor-pointer pt-1"
            >
              <LogOut className="h-3.5 w-3.5 shrink-0" />
              <span className={sidebarOpen ? 'inline' : 'hidden'}>Cerrar sesión</span>
            </button>
          </div>
        </div>

        {/* Page Content viewport */}
        <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
          {/* Universal Header Layout */}
          <header className="bg-white border-b border-utp-border px-6 py-4 flex items-center justify-between z-20 shadow-none">
            {/* Left elements */}
            <div className="flex items-center gap-4">
              <div className="md:hidden flex items-center gap-1.5">
                <span className="h-8 w-8 bg-utp-red text-white flex items-center justify-center font-bold text-xs rounded">SP</span>
                <span className="font-bold text-black text-sm uppercase tracking-tight">SkillPath</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-xs text-neutral-650 font-bold font-sans flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-utp-red"></span>
                  Ecosistema Académico: <strong className="text-black font-extrabold">Universidad Tecnológica del Perú (UTP)</strong>
                </div>
              </div>
            </div>

            {/* Right side — notification bell & profile */}
            <div className="flex items-center gap-2">
              <NotificationBell onClick={() => setNotifDrawerOpen(true)} />
              <button
                type="button"
                key={profile.avatarUrl || 'default'}
                onClick={() => setView("profile")}
                className="size-8 overflow-hidden cursor-pointer border border-neutral-200 hover:border-[#B50E30] transition rounded-full"
              >
                <Avatar className="size-full rounded-none">
                  <AvatarImage src={profile.avatarUrl || avatarImg} />
                  <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </button>
            </div>
          </header>

          <NotificationDrawer open={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} />

          {/* Active Work Flow Rendering Frame */}
          <main className="flex-grow p-6 overflow-y-auto max-w-6xl w-full mx-auto flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {view === "dashboard" && (
                <motion.div
                  key="dashboard_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <RouteDashboard 
                    profile={profile}
                    gaps={gaps}
                    missions={missions}
                    onCompleteSubtask={handleCompleteSubtask}
                    onNavigateToView={setView}
                    onStartCourseFromMission={handleStartCourseFromMission}
                    onCompleteMissionDirectly={(id) => handleCompleteSubtask(id, 0)}
                  />
                </motion.div>
              )}

              {view === "diagnostico" && diagnosisCompleted && (
                <motion.div
                  key="diagnostico_redirect"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-20"
                >
                  <p className="text-sm font-bold text-neutral-500">Ya completaste tu diagnóstico inicial.</p>
                  <button
                    type="button"
                    onClick={() => setView("cvanalyzer")}
                    className="mt-4 px-6 py-2 bg-[#B50E30] text-white text-xs font-black uppercase tracking-wider"
                  >
                    Ir a Análisis
                  </button>
                </motion.div>
              )}

              {view === "profile" && (
                <motion.div
                  key="profile_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UserProfilePanel
                    onNavigateToMyCourses={() => setView("mycourses")}
                    onAvatarChange={(url) => setProfile((p) => ({ ...p, avatarUrl: url }))}
                  />
                </motion.div>
              )}

              {view === "cvanalyzer" && (
                <motion.div
                  key="cv_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <CvAnalyzerPanel 
                    profile={profile}
                    targetRole={profile.targetRole}
                    gaps={gaps}
                    currentSkills={profile.currentSkills}
                    savedAnalysis={cvAnalysis ?? undefined}
                    onNavigateToDiagnostico={() => setView("diagnostico")}
                    onNavigateToRuta={() => setView("dashboard")}
                    onAnalysisResult={(res) => {
                      setCvAnalysis(res);
                      localStorage.setItem("sp_cv_analysis", JSON.stringify(res));
                      const scoreIncrease = Math.max(0, Math.floor((res.score - profile.employabilityScore) / 4));
                      if (scoreIncrease > 0) {
                        const newScore = Math.min(100, profile.employabilityScore + scoreIncrease);
                        setProfile(prev => ({ ...prev, employabilityScore: newScore }));
                        localStorage.setItem("sp_profile", JSON.stringify({ ...profile, employabilityScore: newScore }));
                      }
                      handleAddXpDirectly(60);
                    }}
                  />
                </motion.div>
              )}

              {view === "interviewer" && (
                <motion.div
                  key="interview_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <InterviewPanel 
                    targetRole={profile.targetRole}
                    onSessionComplete={(newScore) => {
                      const scoreIncrease = Math.max(0, Math.floor((newScore - profile.employabilityScore) / 4));
                      if (scoreIncrease > 0) {
                        const updatedScore = Math.min(100, profile.employabilityScore + scoreIncrease);
                        setProfile(prev => ({ ...prev, employabilityScore: updatedScore }));
                        localStorage.setItem("sp_profile", JSON.stringify({ ...profile, employabilityScore: updatedScore }));
                      }
                      handleAddXpDirectly(100);
                    }}
                  />
                </motion.div>
              )}

              {view === "jobs" && (
                <VacanciesPanel
                  vacancies={INITIAL_VACANCIES}
                  career={profile.career || "Sistemas"}
                  onApply={handleApplicationCompleted}
                />
              )}

              {view === "resources" && (
                <motion.div
                  key="resources_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden flex items-center justify-between">
                    <div>
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
                      <h2 className="heading-md text-black tracking-widest flex items-center gap-2">
                        <Award className="h-5 w-5 text-[#B50E30]" />
                        Capacitaciones & Cursos
                      </h2>
                      <p className="text-[#64748B] text-xs font-semibold mt-1 ml-7">
                        Para mitigar las brechas del mercado, hemos convenido con plataformas líderes estos accesos gratuitos con tu cuenta universitaria:
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CERTIFICATIONS_AND_COURSES.map((cert) => {
                      const isEnrolled = enrolledCourses.some((c) => c.courseId === cert.id && c.source === "internal");
                      const enrollment = enrolledCourses.find((c) => c.courseId === cert.id);
                      const logos: Record<string, string> = {
                        "Google": "https://e7.pngegg.com/pngimages/704/688/png-clipart-google-google-thumbnail.png",
                        "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/3840px-Microsoft_logo.svg.png",
                        "UTP": "https://i.scdn.co/image/ab6765630000ba8af770691237911d7e512de37c",
                      };
                      return (
                        <div key={cert.id} className="bg-white border border-neutral-200 shadow-sm flex flex-col">
                          <div className="h-64 w-full overflow-hidden bg-neutral-200">
                            {cert.image && <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />}
                          </div>
                          <div className="p-5 flex-grow">
                            <div className="flex items-center justify-between mb-3">
                              {logos[cert.provider] ? (
                                <img src={logos[cert.provider]} alt={cert.provider} className="h-6 object-contain" />
                              ) : (
                                <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest">{cert.provider}</span>
                              )}
                              <span className="bg-[#B50E30] text-white font-black text-[9px] px-2 py-0.5 rounded-none uppercase tracking-widest">
                                +{cert.pointsAwarded} XP
                              </span>
                            </div>
                            <h3 className="font-black text-sm text-black uppercase tracking-tight leading-snug">{cert.title}</h3>
                            <p className="text-[11px] font-bold text-neutral-600 mt-2 uppercase">{cert.duration}{cert.modality ? ` | ${cert.modality}` : ""}</p>
                            {cert.speaker && (
                              <p className="text-[11px] font-semibold text-neutral-500 mt-1">{cert.speaker}</p>
                            )}
                          </div>
                          <div className="px-5 pb-5">
                            {isEnrolled && enrollment && (
                              <div className="w-full bg-neutral-200 h-1.5 mb-3 relative">
                                <div className="bg-[#D35400] h-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                                <span className="absolute -top-5 text-[10px] font-black text-[#D35400]" style={{ left: `${Math.max(0, enrollment.progress - 5)}%` }}>
                                  {enrollment.progress}%
                                </span>
                              </div>
                            )}
                            <button
                              onClick={() => handleEnrollCourse(cert.id)}
                              className="w-full bg-[#B50E30] hover:bg-[#85061B] text-white py-2 text-xs font-black uppercase transition cursor-pointer border-0"
                            >
                              {isEnrolled ? "Continuar curso" : "Llevar curso"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {view === "mycourses" && (
                <motion.div
                  key="mycourses_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <MyCoursesPanel
                    enrolledCourses={enrolledCourses}
                    gaps={gaps}
                    onCompleteLesson={handleCompleteLesson}
                    onEnrollExternal={handleEnrollExternalCourse}
                    onNavigateToCatalog={() => setView("resources")}
                  />
                </motion.div>
              )}

              {view === "community" && (
                <motion.div
                  key="community_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SocialHub />
                </motion.div>
              )}

              {view === "whatsapp" && (
                <motion.div
                  key="whatsapp_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <WhatsAppPreview />
                </motion.div>
              )}
            </AnimatePresence>

            {/* HACKATHON UTP+ FOOTER */}
            <footer className="mt-16 border-t border-utp-border pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-black uppercase tracking-widest text-[11px]">Despega UTP</span>
                <span className="text-neutral-300">|</span>
                <span className="text-neutral-500 font-medium">Plataforma de Crecimiento & Empleabilidad</span>
              </div>
              
              {/* UTP Hackathon branding */}
              <div className="flex items-center gap-2.5 bg-black py-1.5 px-3.5 border border-neutral-900">
                <span className="text-[10px] font-black tracking-widest text-white uppercase">HACKATHON</span>
                <span className="text-[10px] font-black text-white bg-[#B50E30] px-2 py-0.5 animate-pulse">UTP+</span>
              </div>

              <div className="text-[10px] text-neutral-450 font-mono tracking-tight">
                Desarrollado para la Selección Hackathon • Universidad Tecnológica del Perú
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
    </NotificationProvider>
  );
}
