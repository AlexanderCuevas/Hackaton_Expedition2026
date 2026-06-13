import React, { useState, useEffect } from "react";
import { UserProfile, SkillGap, CareerMission, CvAnalysis, InterviewSession, EnrolledCourse } from "./types";
import { 
  Trophy, Award, BookOpen, AlertCircle, ArrowRight, CheckCircle, Lock, Play, Zap,
  Briefcase, GraduationCap, FileText, MessageSquare, Users, PhoneCall, ChevronRight,
  Menu, X, Sparkles, LogOut, CheckSquare, Bell, Calendar, User, Library
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Components
import RouteDashboard from "./components/RouteDashboard";
import DiagnosticoWizard from "./components/DiagnosticoWizard";
import CvAnalyzerPanel from "./components/CvAnalyzerPanel";
import InterviewPanel from "./components/InterviewPanel";
import SocialHub from "./components/SocialHub";
import WhatsAppPreview from "./components/WhatsAppPreview";
import UserProfilePanel from "./components/UserProfilePanel";
import LandingPage from "./components/LandingPage";
import MyCoursesPanel from "./components/MyCoursesPanel";

// Mock Data
import { INITIAL_VACANCIES, CERTIFICATIONS_AND_COURSES, UNIVERSITY_EVENTS } from "./data";
import { integrateRouteWithCourses, syncMissionsWithEnrollments, unlockSequentialMissions } from "./utils/courseMatcher";

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
  progressToNextLevel: 60
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

  useEffect(() => {
    const savedProfile = localStorage.getItem("sp_profile");
    const savedGaps = localStorage.getItem("sp_gaps");
    const savedMissions = localStorage.getItem("sp_missions");
    const savedCourses = localStorage.getItem("sp_enrolled_courses");
    const authenticated = localStorage.getItem("sp_authenticated") === "true";
    const diagnosisCompleted = localStorage.getItem("sp_diagnosis_completed") === "true";

    if (savedProfile) setProfile(JSON.parse(savedProfile));
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

    if (authenticated) {
      setView(diagnosisCompleted ? "dashboard" : "diagnostico");
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

  const handleAnalysisSuccess = (updatedProfile: UserProfile, updatedGaps: SkillGap[], updatedMissions: CareerMission[]) => {
    saveState(updatedProfile, updatedGaps, updatedMissions);
    localStorage.setItem("sp_diagnosis_completed", "true");
    setView("dashboard");
    triggerNotification("🚀 ¡Diagnóstico procesado! Tu ruta incluye cursos personalizados según tus brechas.");
  };

  const handleApplicationCompleted = (company: string, roleName: string) => {
    triggerNotification(`📬 ¡Candidatura enviada a ${company} como ${roleName}!`);
    handleAddXpDirectly(50);
  };

  const handleLandingStart = (profileData: Partial<UserProfile>, isNewUser: boolean) => {
    localStorage.setItem("sp_authenticated", "true");
    setIsAuthenticated(true);

    if (isNewUser) {
      const freshProfile: UserProfile = {
        name: profileData.name || "Estudiante UTP",
        career: profileData.career || "",
        semester: profileData.semester || 1,
        experienceLevel: "",
        targetRole: profileData.targetRole || "",
        currentSkills: [],
        interests: [],
        employabilityScore: 0,
        xp: 0,
        level: 1,
        progressToNextLevel: 0,
      };

      setProfile(freshProfile);
      setGaps([]);
      setMissions([]);
      setEnrolledCourses([]);
      localStorage.setItem("sp_profile", JSON.stringify(freshProfile));
      localStorage.setItem("sp_gaps", JSON.stringify([]));
      localStorage.setItem("sp_missions", JSON.stringify([]));
      localStorage.setItem("sp_enrolled_courses", JSON.stringify([]));
      localStorage.removeItem("sp_diagnosis_completed");
      setView("diagnostico");
      triggerNotification(
        `🎉 ¡Bienvenido, ${freshProfile.name}! Completa tu Diagnóstico IA para generar tu plan personalizado.`
      );
      return;
    }

    const diagnosisCompleted = localStorage.getItem("sp_diagnosis_completed") === "true";
    setView(diagnosisCompleted ? "dashboard" : "diagnostico");
    triggerNotification(`👋 ¡Hola de nuevo! ${diagnosisCompleted ? "Retoma tu ruta." : "Termina tu Diagnóstico IA."}`);
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

  return (
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
      <div className="flex flex-1">
        {/* Sidebar Container */}
        <div className="w-64 bg-black text-white/75 border-r border-[#1a1a1a] flex flex-col justify-between p-5 shrink-0 hidden md:flex">
          <div className="space-y-6">
            {/* Signature Brand Header */}
            <div className="flex items-center gap-2.5 pb-5 border-b border-[#1a1a1a]">
              <div className="h-9 w-9 bg-utp-red flex items-center justify-center text-white rounded">
                <Sparkles className="h-5 w-5 fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-white text-base tracking-tight leading-none uppercase">SkillPath AI</span>
                <span className="text-[10px] text-utp-red font-bold tracking-widest mt-1">HACKATHON UTP+</span>
              </div>
            </div>

            {/* Menu Sections Navigation */}
            <nav className="space-y-1">
              {[
                { id: "dashboard", label: "Mi Ruta", icon: Trophy },
                { id: "profile", label: "Mi Perfil", icon: User },
                { id: "diagnostico", label: "Diagnóstico IA", icon: GraduationCap },
                { id: "cvanalyzer", label: "CV Analyzer ATS", icon: FileText },
                { id: "interviewer", label: "Entrevistas IA", icon: MessageSquare },
                { id: "jobs", label: "Vacantes & Match", icon: Briefcase },
                { id: "resources", label: "Certificados", icon: Award },
                { id: "mycourses", label: "Mis Cursos", icon: Library },
                { id: "community", label: "Feed / Networking", icon: Users },
                { id: "whatsapp", label: "WhatsApp Tutor", icon: PhoneCall },
              ].map((item) => {
                const IconComponent = item.icon;
                const isActive = view === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-none text-xs font-bold font-sans uppercase tracking-wider transition cursor-pointer select-none ${
                      isActive
                        ? "bg-utp-red text-white"
                        : "hover:bg-[#121212] text-white/80 hover:text-white"
                    }`}
                  >
                    <IconComponent className={`h-4 w-4 ${isActive ? "text-white" : "text-neutral-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Logged Info Capsule */}
          <div className="bg-[#121212] p-4 rounded-none space-y-3.5 border border-[#1a1a1a]">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold text-white max-w-[120px] truncate">{profile.name}</div>
              <span className="bg-utp-red text-white font-black text-[9px] px-2 py-0.5 rounded-none uppercase">
                LVL {profile.level}
              </span>
            </div>

            <div className="space-y-1.5">
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
              <LogOut className="h-3.5 w-3.5" />
              Cerrar sesión
            </button>
          </div>
        </div>

        {/* Page Content viewport */}
        <div className="flex-1 flex flex-col min-w-0">
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

            {/* Right Stats panel */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-black text-white rounded-none px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
                <Zap className="h-3.5 w-3.5 fill-utp-red text-utp-red" />
                <span>{profile.xp} XP</span>
              </div>

              <div className="flex items-center gap-1.5 border border-black rounded-none px-3 py-1 text-xs font-black text-black uppercase tracking-wider">
                <Award className="h-3.5 w-3.5 text-utp-red" />
                <span>Score: {profile.employabilityScore}%</span>
              </div>
            </div>
          </header>

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

              {view === "profile" && (
                <motion.div
                  key="profile_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <UserProfilePanel 
                    profile={profile}
                    onUpdateProfile={(updated) => {
                      setProfile(updated);
                      localStorage.setItem("sp_profile", JSON.stringify(updated));
                    }}
                    gaps={gaps}
                    missions={missions}
                  />
                </motion.div>
              )}

              {view === "diagnostico" && (
                <motion.div
                  key="diagnostico_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <DiagnosticoWizard 
                    currentProfile={profile}
                    onAnalysisSuccess={handleAnalysisSuccess}
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
                    targetRole={profile.targetRole}
                    career={profile.career}
                    semester={profile.semester}
                    onAnalysisResult={(res) => {
                      // Boost score based on CV results dynamically
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
                <motion.div
                  key="jobs_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
                    <h2 className="text-base font-black text-black uppercase tracking-widest flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-[#B50E30]" />
                      Match Inteligente de Vacantes UTP+
                    </h2>
                    <p className="text-[#64748B] text-xs font-semibold mt-1">
                      Solo mostramos vacantes acordes a tu carrera de {profile.career || "Sistemas"}. El porcentaje indica tu nivel de compatibilidad.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {INITIAL_VACANCIES.map((vac) => {
                      return (
                        <div key={vac.id} className="bg-white rounded-none border border-utp-border p-6 flex flex-col justify-between gap-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="bg-black text-white font-black text-[9px] px-2 py-0.5 rounded-none uppercase tracking-wider">
                                  {vac.company}
                                </span>
                                <h3 className="font-extrabold text-sm text-black uppercase tracking-tight mt-1.5">{vac.role}</h3>
                                <p className="text-[10px] text-neutral-400 font-extrabold uppercase mt-0.5 tracking-wider">Ubicación: {vac.location} • {vac.salary}</p>
                              </div>
                              <span className="bg-[#B50E30] text-white font-black text-xs px-2.5 py-1 rounded-none uppercase tracking-wider">
                                {vac.matchScore}% Match
                              </span>
                            </div>

                            <p className="text-xs text-neutral-700 leading-relaxed font-semibold">
                              {vac.description}
                            </p>

                            <div className="space-y-1.5">
                              <span className="text-[9px] font-black text-[#B50E30] uppercase tracking-widest block">Habilidades por adquirir:</span>
                              <div className="flex flex-wrap gap-1">
                                {vac.skillsMissing.map((sk) => (
                                  <span key={sk} className="bg-neutral-50 border border-utp-border text-black text-[9px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded-none">
                                    {sk}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="border-t border-utp-border pt-4 flex items-center justify-between text-xs gap-3">
                            <span className="text-[10px] text-neutral-400 leading-tight font-bold uppercase tracking-tight max-w-[50%]">
                              💡 Tip: {vac.tipsForApplying.slice(0, 75)}...
                            </span>
                            <button
                              type="button"
                              onClick={() => handleApplicationCompleted(vac.company, vac.role)}
                              className="bg-black hover:bg-neutral-900 border border-black text-white font-black uppercase tracking-widest text-[10px] py-2 px-4 rounded-none transition cursor-pointer"
                            >
                              Postular con un clic
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {view === "resources" && (
                <motion.div
                  key="resources_view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
                    <h2 className="text-base font-black text-black uppercase tracking-widest flex items-center gap-2">
                      <Award className="h-5 w-5 text-[#B50E30]" />
                      Beca UTP+: Certificaciones & Cursos
                    </h2>
                    <p className="text-[#64748B] text-xs font-semibold mt-1">
                      Para mitigar las brechas del mercado, hemos convenido con plataformas líderes estos accesos gratuitos con tu cuenta universitaria:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CERTIFICATIONS_AND_COURSES.map((cert) => (
                      <div key={cert.id} className="bg-white rounded-none border border-utp-border p-6 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest">{cert.provider}</span>
                            <span className="bg-[#B50E30] text-white font-black text-[9px] px-2 py-0.5 rounded-none uppercase tracking-widest">
                              +{cert.pointsAwarded} XP
                            </span>
                          </div>
                          <h3 className="font-extrabold text-sm text-black uppercase tracking-tight mt-1">{cert.title}</h3>
                          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Duración: {cert.duration} • Beneficio: {cert.cost}</p>
                          {cert.linkedGap && (
                            <p className="text-[10px] text-[#B50E30] font-bold uppercase tracking-tight">
                              Cierra brecha: {cert.linkedGap}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleEnrollCourse(cert.id)}
                          className="w-full py-2.5 bg-black hover:bg-neutral-900 text-white font-black uppercase tracking-widest text-xs rounded-none transition cursor-pointer flex items-center justify-center gap-1 border border-black"
                        >
                          {enrolledCourses.some((c) => c.courseId === cert.id && c.source === "internal")
                            ? "Continuar curso"
                            : "Llevar curso"}
                          <ChevronRight className="h-4 w-4 text-[#B50E30]" />
                        </button>
                      </div>
                    ))}
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
                <span className="font-extrabold text-black uppercase tracking-widest text-[11px]">SkillPath AI</span>
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
  );
}
