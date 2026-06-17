import React, { useState, useEffect, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { UserProfile, SkillGap, CareerMission, CvAnalysis, InterviewSession, EnrolledCourse, CvMeta } from "./types";
import { 
  Trophy, Award, BookOpen, AlertCircle, ArrowRight, CheckCircle, Lock, Play, Zap,
  Briefcase, GraduationCap, FileText, MessageSquare, Users, PhoneCall, ChevronRight, ChevronLeft,
  Menu, X, Sparkles, LogOut, CheckSquare, Bell, Calendar, User, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
import avatarImg from "./components/assets/usuario.png";
import sidebarImg from "./components/assets/Img.png";

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
import CourseFilters from "./components/CourseFilters";
import { Logo } from "./components/ui/logo";

// Mock Data
import { CERTIFICATIONS_AND_COURSES, INITIAL_VACANCIES, UNIVERSITY_EVENTS } from "./data";
import { integrateRouteWithCourses, syncMissionsWithEnrollments, unlockSequentialMissions } from "./utils/courseMatcher";
import { MockStudent } from "./mockStudents";
import { getStudentCareerBundle } from "./cvMockData";
import { EMPTY_APP_PROFILE } from "./studentProfileData";

const MOCK_INITIAL_PROFILE = EMPTY_APP_PROFILE;
const MOCK_INITIAL_GAPS: SkillGap[] = [];
const BASE_INITIAL_MISSIONS: CareerMission[] = [];
const MOCK_CV_ANALYSIS: CvAnalysis | null = null;
const MOCK_CV_META: CvMeta | null = null;

const { gaps: MOCK_INITIAL_GAPS_ENRICHED, missions: MOCK_INITIAL_MISSIONS } =
  integrateRouteWithCourses(MOCK_INITIAL_GAPS, BASE_INITIAL_MISSIONS);

const APP_NAV_ITEMS: { navKey: string; id: string; label: string; icon: LucideIcon }[] = [
  { navKey: "profile", id: "profile", label: "Mi Perfil", icon: User },
  { navKey: "cvanalyzer", id: "cvanalyzer", label: "Análisis", icon: FileText },
  { navKey: "dashboard", id: "dashboard", label: "Mi Ruta", icon: Trophy },
  { navKey: "resources", id: "resources", label: "Capacitaciones", icon: Award },
  { navKey: "interviewer", id: "interviewer", label: "Entrevistas IA", icon: MessageSquare },
  { navKey: "jobs-match", id: "jobs", label: "Vacantes & Match", icon: Briefcase },
  { navKey: "community", id: "community", label: "Networking", icon: Users },
  { navKey: "whatsapp", id: "whatsapp", label: "WhatsApp Tutor", icon: PhoneCall },
];

export default function App() {
  const [view, setView] = useState<string>("dashboard");
  const [profile, setProfile] = useState<UserProfile>(MOCK_INITIAL_PROFILE);
  const [gaps, setGaps] = useState<SkillGap[]>(MOCK_INITIAL_GAPS_ENRICHED);
  const [missions, setMissions] = useState<CareerMission[]>(MOCK_INITIAL_MISSIONS);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [catalogCompanyFilter, setCatalogCompanyFilter] = useState("todas");
  const [catalogSortOrder, setCatalogSortOrder] = useState<"asc" | "desc">("asc");
  const [catalogSearchTerm, setCatalogSearchTerm] = useState("");
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);
  const [diagnosisCompleted, setDiagnosisCompleted] = useState(false);
  const [routeGenerated, setRouteGenerated] = useState(false);
  const [cvAnalysis, setCvAnalysis] = useState<CvAnalysis | null>(MOCK_CV_ANALYSIS);
  const [cvMeta, setCvMeta] = useState<CvMeta | null>(MOCK_CV_META);
  const [cvText, setCvText] = useState<string>("");
  const [interviewSession, setInterviewSession] = useState<InterviewSession | undefined>(undefined);
  const [currentStudentCode, setCurrentStudentCode] = useState<string | null>(null);

  const catalogLogos: Record<string, string> = {
    "Google": "https://e7.pngegg.com/pngimages/704/688/png-clipart-google-google-thumbnail.png",
    "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/3840px-Microsoft_logo.svg.png",
    "UTP": "https://i.scdn.co/image/ab6765630000ba8af770691237911d7e512de37c",
  };

  const catalogUniqueCompanies = useMemo(() => {
    const companies = new Set<string>();
    CERTIFICATIONS_AND_COURSES.forEach((c) => companies.add(c.provider));
    return Array.from(companies).sort();
  }, []);

  const filteredCerts = CERTIFICATIONS_AND_COURSES
    .filter((cert) => {
      if (catalogCompanyFilter !== "todas" && cert.provider !== catalogCompanyFilter) return false;
      if (catalogSearchTerm) {
        const q = catalogSearchTerm.toLowerCase();
        const match = cert.title.toLowerCase().includes(q) || cert.provider.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    })
    .sort((a, b) =>
      catalogSortOrder === "asc"
        ? a.pointsAwarded - b.pointsAwarded
        : b.pointsAwarded - a.pointsAwarded
    );

  useEffect(() => {
    const savedProfile = localStorage.getItem("sp_profile");
    const savedGaps = localStorage.getItem("sp_gaps");
    const savedMissions = localStorage.getItem("sp_missions");
    const savedCourses = localStorage.getItem("sp_enrolled_courses");
    const savedCvAnalysis = localStorage.getItem("sp_cv_analysis");
    const savedCvMeta = localStorage.getItem("sp_cv_meta");
    const authenticated = localStorage.getItem("sp_authenticated") === "true";
    const diagnosisDone = localStorage.getItem("sp_diagnosis_completed") === "true";
    const routeDone = localStorage.getItem("sp_route_generated") === "true";
    const savedStudentCode = localStorage.getItem("sp_student_code");

    if (savedStudentCode) setCurrentStudentCode(savedStudentCode);

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
    setRouteGenerated(routeDone);
    if (savedCvAnalysis) setCvAnalysis(JSON.parse(savedCvAnalysis));
    else setCvAnalysis(null);
    if (savedCvMeta) setCvMeta(JSON.parse(savedCvMeta));
    else setCvMeta(null);
    setCvText(localStorage.getItem("sp_cv_text") || "");

    const savedInterview = localStorage.getItem("sp_interview_session");
    if (savedInterview) setInterviewSession(JSON.parse(savedInterview));
    else setInterviewSession(undefined);

    if (authenticated) {
      if (!diagnosisDone) setView("diagnostico");
      else if (!routeDone) setView("cvanalyzer");
      else setView("dashboard");
    }

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setMobileNavOpen(false);
    setShowLogoutMenu(false);
  }, [view]);

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

  const handleCompleteMission = (missionId: string) => {
    let xpAwarded = 0;
    let didLevelUp = false;
    let newLevel = profile.level;
    let isMissionCompleted = false;

    const updatedMissions = missions.map((m) => {
      if (m.id !== missionId) return m;
      if (m.status === "completado") return m;

      const updatedSubtasks = m.subtasks.map((sub) => ({ ...sub, done: true }));
      isMissionCompleted = true;
      xpAwarded = m.xpValue;

      return {
        ...m,
        subtasks: updatedSubtasks,
        status: "completado" as const,
      };
    });

    const finalMissions = unlockSequentialMissions(updatedMissions);

    let newXp = profile.xp + xpAwarded;
    let nextLevelProgress = profile.progressToNextLevel + (xpAwarded / 2);

    if (nextLevelProgress >= 100) {
      didLevelUp = true;
      newLevel += 1;
      nextLevelProgress = nextLevelProgress - 100;
    }

    const updatedProfile = {
      ...profile,
      xp: newXp,
      level: newLevel,
      progressToNextLevel: Math.min(nextLevelProgress, 100),
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
    const code = currentStudentCode || localStorage.getItem("sp_student_code");
    const bundle = code ? getStudentCareerBundle(code) : undefined;

    let finalProfile = updatedProfile;
    let finalMeta = meta;

    if (bundle) {
      finalProfile = {
        ...updatedProfile,
        targetRole: bundle.targetRole,
        currentSkills: bundle.cv.hardSkills,
        softSkills: bundle.cv.softSkills,
        experienceLevel: bundle.cv.experienceLevel,
        employabilityScore: bundle.initialEmployabilityScore,
        interests: bundle.cv.specializations.length > 0
          ? bundle.cv.specializations
          : updatedProfile.interests,
      };
      finalMeta = { ...bundle.cvMeta, targetRole: bundle.targetRole };

      setCvAnalysis(bundle.cvAnalysis);
      setGaps(bundle.skillGaps);
      localStorage.setItem("sp_cv_analysis", JSON.stringify(bundle.cvAnalysis));
      localStorage.setItem("sp_gaps", JSON.stringify(bundle.skillGaps));
    }

    setProfile(finalProfile);
    localStorage.setItem("sp_profile", JSON.stringify(finalProfile));
    localStorage.setItem("sp_cv_text", cvText);
    localStorage.setItem("sp_cv_meta", JSON.stringify(finalMeta));
    localStorage.setItem("sp_diagnosis_completed", "true");
    setDiagnosisCompleted(true);
    setRouteGenerated(false);
    localStorage.removeItem("sp_route_generated");
    setCvMeta(finalMeta);
    setCvText(cvText);
    setView("cvanalyzer");
    triggerNotification(
      bundle
        ? `✅ Análisis listo para ${bundle.studentName}. Revisa tu score y genera tu ruta.`
        : "✅ Diagnóstico completado. Continúa en la sección Análisis."
    );
  };

  const handleRouteGenerated = () => {
    const code = currentStudentCode || localStorage.getItem("sp_student_code");
    const bundle = code ? getStudentCareerBundle(code) : undefined;

    if (bundle) {
      const { gaps: enrichedGaps, missions } = integrateRouteWithCourses(
        bundle.skillGaps,
        bundle.careerMissions
      );
      const updatedProfile: UserProfile = {
        ...profile,
        targetRole: bundle.targetRole,
        currentSkills: bundle.cv.hardSkills,
        softSkills: bundle.cv.softSkills,
        employabilityScore: Math.min(100, bundle.cvAnalysis.score + 6),
      };
      saveState(updatedProfile, enrichedGaps, missions);
    } else if (gaps.length === 0 || missions.length === 0) {
      const { gaps: enrichedGaps, missions } = integrateRouteWithCourses(
        MOCK_INITIAL_GAPS,
        BASE_INITIAL_MISSIONS
      );
      saveState(profile, enrichedGaps, missions);
    }

    setRouteGenerated(true);
    localStorage.setItem("sp_route_generated", "true");
    setView("dashboard");
    triggerNotification("🎯 ¡Tu ruta personalizada está lista! Explora tus misiones.");
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
      localStorage.setItem("sp_student_code", student.code);
      setGaps([]);
      setMissions([]);
      setEnrolledCourses([]);
      setDiagnosisCompleted(false);
      setRouteGenerated(false);
      setCvAnalysis(null);
      setCvMeta(null);
      setCvText("");

      localStorage.setItem("sp_profile", JSON.stringify(studentProfile));
      localStorage.setItem("sp_gaps", JSON.stringify([]));
      localStorage.setItem("sp_missions", JSON.stringify([]));
      localStorage.setItem("sp_enrolled_courses", JSON.stringify([]));
      localStorage.removeItem("sp_diagnosis_completed");
      localStorage.removeItem("sp_route_generated");
      localStorage.removeItem("sp_cv_analysis");
      localStorage.removeItem("sp_cv_meta");
      localStorage.removeItem("sp_cv_text");

      setView("diagnostico");
      const bundle = getStudentCareerBundle(student.code);
      triggerNotification(
        bundle
          ? `👋 ¡Bienvenido, ${student.name}! Usa "Extraer con IA" para cargar tu CV simulado.`
          : `👋 ¡Bienvenido, ${student.name}! Usa "Extraer con IA" para cargar tus datos simulados.`
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
      if (student?.code) localStorage.setItem("sp_student_code", student.code);
      else localStorage.removeItem("sp_student_code");
      setGaps([]);
      setMissions([]);
      setEnrolledCourses([]);
      localStorage.setItem("sp_profile", JSON.stringify(studentProfile));
      localStorage.setItem("sp_gaps", JSON.stringify([]));
      localStorage.setItem("sp_missions", JSON.stringify([]));
      localStorage.setItem("sp_enrolled_courses", JSON.stringify([]));
      localStorage.removeItem("sp_diagnosis_completed");
      localStorage.removeItem("sp_route_generated");
      localStorage.removeItem("sp_cv_analysis");
      localStorage.removeItem("sp_cv_meta");
      localStorage.removeItem("sp_cv_text");
      setDiagnosisCompleted(false);
      setRouteGenerated(false);
      setCvAnalysis(null);
      setCvMeta(null);
      setCvText("");
      setView("diagnostico");
      const bundle = student?.code ? getStudentCareerBundle(student.code) : undefined;
      triggerNotification(
        bundle
          ? `🎉 ¡Bienvenido, ${studentProfile.name}! Usa "Extraer con IA" para cargar tu CV simulado.`
          : `🎉 ¡Bienvenido, ${studentProfile.name}! Completa tu diagnóstico para continuar.`
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
    if (student?.code) localStorage.setItem("sp_student_code", student.code);

    const diagnosisDone = localStorage.getItem("sp_diagnosis_completed") === "true";
    const routeDone = localStorage.getItem("sp_route_generated") === "true";
    setDiagnosisCompleted(diagnosisDone);
    setRouteGenerated(routeDone);
    if (!diagnosisDone) setView("diagnostico");
    else if (!routeDone) setView("cvanalyzer");
    else setView("dashboard");
    triggerNotification(`👋 ¡Hola de nuevo, ${merged.name}! ${diagnosisDone ? (routeDone ? "Retoma tu ruta." : "Genera tu ruta en Análisis.") : "Termina tu diagnóstico."}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("sp_student_code");
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
    <div className="min-h-screen bg-[#FFFFFF] text-black flex flex-col font-sans overflow-x-hidden">
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
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} fixed left-0 top-0 h-screen bg-[#1C1C1F] text-[#F2F2F2] border-r border-[#222226] flex flex-col justify-between p-4 hidden md:flex transition-all duration-300 z-40 group shadow-[2px_0_20px_rgba(0,0,0,0.18)]`}>
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B50E30]" aria-hidden />

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 h-7 w-7 bg-[#B50E30] text-[#F2F2F2] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10 shadow-md hover:scale-105 hover:bg-[#85061B]"
          >
            {sidebarOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>

          <div className="flex flex-col flex-1 min-h-0 gap-4">
            {/* Brand */}
            <div className={`shrink-0 pb-4 border-b border-[#222226] ${sidebarOpen ? 'pl-1' : 'flex justify-center'}`}>
              <Logo variant="sidebar" showText={sidebarOpen} />
            </div>

            {/* Navigation */}
            <nav className={`flex-1 min-h-0 overflow-y-auto scrollbar-none space-y-1 ${sidebarOpen ? 'pl-1' : 'px-0'}`}>
              {APP_NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                const isActive = view === item.id;
                const isLocked = item.id === "dashboard" && !routeGenerated;
                return (
                    <button
                      key={item.navKey}
                      type="button"
                      disabled={isLocked}
                      onClick={() => {
                        if (isLocked) return;
                        setView(item.id);
                      }}
                      title={isLocked ? "Genera tu ruta en Análisis para desbloquear" : undefined}
                      className={`w-full flex items-center ${sidebarOpen ? 'gap-3 px-3' : 'justify-center px-1'} py-2.5 rounded-xl text-[11px] font-bold font-sans uppercase tracking-wider transition-all duration-200 select-none ${
                        isLocked
                          ? "opacity-35 cursor-not-allowed text-[#A3A3A3]"
                          : isActive
                            ? "bg-[#B50E30] text-[#F2F2F2] shadow-md cursor-pointer"
                            : "text-[#A3A3A3] hover:bg-[#222226] hover:text-[#F2F2F2] cursor-pointer"
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="h-4 w-4 shrink-0" />
                      ) : (
                        <IconComponent className="h-4 w-4 shrink-0" />
                      )}
                      <span className={`${sidebarOpen ? 'inline' : 'hidden'}`}>{item.label}</span>
                    </button>
                );
              })}
            </nav>
          </div>

          {/* Video footer */}
          <div className={`shrink-0 ${sidebarOpen ? 'block' : 'hidden'}`}>
            <img
              src={sidebarImg}
              alt="Sidebar"
              className="w-full object-contain"
            />
          </div>
        </div>

        {/* Mobile navigation drawer */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 md:hidden"
                onClick={() => setMobileNavOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 320 }}
                className="fixed inset-y-0 left-0 z-[51] w-[min(280px,85vw)] bg-[#1C1C1F] text-[#F2F2F2] border-r border-[#222226] flex flex-col justify-between p-4 md:hidden shadow-2xl"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B50E30]" aria-hidden />
                <div className="flex flex-col flex-1 min-h-0 gap-4">
                  <div className="shrink-0 pb-4 border-b border-[#222226] pl-1 flex items-center justify-between">
                    <Logo variant="sidebar" showText />
                    <button
                      type="button"
                      onClick={() => setMobileNavOpen(false)}
                      className="p-1.5 text-[#A3A3A3] hover:text-[#F2F2F2] cursor-pointer"
                      aria-label="Cerrar menú"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <nav className="flex-1 min-h-0 overflow-y-auto scrollbar-none space-y-1 pl-1">
                    {APP_NAV_ITEMS.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = view === item.id;
                      const isLocked = item.id === "dashboard" && !routeGenerated;
                      return (
                        <button
                          key={item.navKey}
                          type="button"
                          disabled={isLocked}
                          onClick={() => {
                            if (isLocked) return;
                            setView(item.id);
                            setMobileNavOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[11px] font-bold font-sans uppercase tracking-wider transition-all duration-200 select-none ${
                            isLocked
                              ? "opacity-35 cursor-not-allowed text-[#A3A3A3]"
                              : isActive
                                ? "bg-[#B50E30] text-[#F2F2F2] shadow-md cursor-pointer"
                                : "text-[#A3A3A3] hover:bg-[#222226] hover:text-[#F2F2F2] cursor-pointer"
                          }`}
                        >
                          {isLocked ? (
                            <Lock className="h-4 w-4 shrink-0" />
                          ) : (
                            <IconComponent className="h-4 w-4 shrink-0" />
                          )}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Page Content viewport */}
        <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
          {/* Universal Header Layout */}
          <header className="bg-white border-b border-utp-border px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-20 shadow-none gap-3">
            {/* Left elements */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="md:hidden p-2 -ml-1 text-neutral-600 hover:text-black cursor-pointer shrink-0"
                aria-label="Abrir menú"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="md:hidden shrink-0 scale-[0.92] origin-left">
                <Logo showText />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs text-neutral-650 font-bold font-sans flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-utp-red"></span>
                  Ecosistema Académico: <strong className="text-black font-extrabold">Universidad Tecnológica del Perú (UTP)</strong>
                </div>
              </div>
            </div>

            {/* Right side — notification bell & avatar dropdown */}
            <div className="flex items-center gap-2">
              <NotificationBell onClick={() => setNotifDrawerOpen(true)} />
              <div className="w-px h-6 bg-black hidden sm:block" />
              <div className="relative flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-black leading-tight">{profile.name}</p>
                  <p className="text-[10px] text-neutral-500 leading-tight">LVL {profile.level} · {profile.xp} XP</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <div className="size-8 overflow-hidden border border-neutral-200 hover:border-[#B50E30] transition rounded-full">
                    <Avatar className="size-full rounded-none">
                      <AvatarImage src={profile.avatarUrl || avatarImg} />
                      <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-neutral-500 transition-transform duration-200 ${showLogoutMenu ? 'rotate-180' : ''}`} />
                </button>
                {showLogoutMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowLogoutMenu(false)} />
                    <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-neutral-200 shadow-xl min-w-[160px]">
                      <button
                        type="button"
                        onClick={() => { setShowLogoutMenu(false); setView("profile"); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-[#B50E30] hover:bg-neutral-50 transition cursor-pointer"
                      >
                        <User className="h-3.5 w-3.5" />
                        Mi Perfil
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-[#B50E30] hover:bg-neutral-50 transition cursor-pointer"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Cerrar sesión
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          <NotificationDrawer open={notifDrawerOpen} onClose={() => setNotifDrawerOpen(false)} />

          {/* Active Work Flow Rendering Frame */}
          <main className="flex-grow p-4 sm:p-6 pb-8 overflow-x-hidden overflow-y-auto max-w-6xl w-full mx-auto flex flex-col justify-between min-w-0">
            <AnimatePresence mode="wait">
              {view === "dashboard" && routeGenerated && (
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
                    onCompleteMissionDirectly={handleCompleteMission}
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
                    studentCode={currentStudentCode}
                    appProfile={profile}
                    missions={missions}
                    enrolledCoursesCount={enrolledCourses.length}
                    onNavigateToMyCourses={() => setView("mycourses")}
                    onAvatarChange={(url) => {
                      setProfile((p) => {
                        const updated = { ...p, avatarUrl: url };
                        localStorage.setItem("sp_profile", JSON.stringify(updated));
                        return updated;
                      });
                    }}
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
                    cvInfo={cvMeta ?? undefined}
                    cvText={cvText}
                    savedAnalysis={cvAnalysis ?? undefined}
                    onNavigateToDiagnostico={() => setView("diagnostico")}
                    onNavigateToRuta={handleRouteGenerated}
                    routeGenerated={routeGenerated}
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
                    avatarUrl={profile.avatarUrl}
                    savedSession={interviewSession}
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
                  <div className="bg-white rounded-none border border-utp-border p-4 sm:p-6 relative overflow-hidden">
                    <div>
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
                      <h2 className="heading-md text-black tracking-widest flex items-center gap-2">
                        <Award className="h-5 w-5 text-[#B50E30] shrink-0" />
                        Capacitaciones & Cursos
                      </h2>
                      <p className="text-[#64748B] text-xs font-semibold mt-1 sm:ml-7">
                        Para mitigar las brechas del mercado, hemos convenido con plataformas líderes estos accesos gratuitos con tu cuenta universitaria:
                      </p>
                    </div>
                  </div>

                  <CourseFilters
                    uniqueCompanies={catalogUniqueCompanies}
                    companyFilter={catalogCompanyFilter}
                    onCompanyFilterChange={setCatalogCompanyFilter}
                    sortOrder={catalogSortOrder}
                    onSortOrderChange={setCatalogSortOrder}
                    searchTerm={catalogSearchTerm}
                    onSearchTermChange={setCatalogSearchTerm}
                  />

                  {filteredCerts.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white border border-utp-border p-10 text-center space-y-4"
                    >
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <BookOpen className="h-10 w-10 text-neutral-300 mx-auto" />
                      </motion.div>
                      <p className="text-sm font-black uppercase text-black">
                        Ningún curso coincide
                      </p>
                      <p className="text-xs text-neutral-500 font-medium max-w-sm mx-auto">
                        No hay cursos con los filtros seleccionados. Prueba con otras opciones o
                        <button
                          type="button"
                          onClick={() => setCatalogCompanyFilter("todas")}
                          className="text-[#B50E30] font-black hover:underline mx-1 cursor-pointer"
                        >
                          restablece los filtros
                        </button>
                        .
                      </p>
                    </motion.div>
                  ) : (
                    <AnimatePresence mode="popLayout">
                      <div key="catalog-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCerts.map((cert, idx) => {
                          const isEnrolled = enrolledCourses.some((c) => c.courseId === cert.id && c.source === "internal");
                          const enrollment = enrolledCourses.find((c) => c.courseId === cert.id);
                          return (
                            <motion.div
                              key={cert.id}
                              layout
                              initial={{ opacity: 0, y: 24 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.85, y: -12 }}
                              transition={{ duration: 0.25, delay: idx * 0.035 }}
                              className="bg-white border border-neutral-200 shadow-sm flex flex-col"
                            >
                              <div className="h-64 w-full overflow-hidden bg-neutral-200">
                                {cert.image && <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />}
                              </div>
                              <div className="p-5 flex-grow">
                                <div className="flex items-center justify-between mb-3">
                                  {catalogLogos[cert.provider] ? (
                                    <img src={catalogLogos[cert.provider]} alt={cert.provider} className="h-6 object-contain" />
                                  ) : (
                                    <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest">{cert.provider}</span>
                                  )}
                                  <motion.span
                                    whileHover={{ scale: 1.1 }}
                                    className="bg-[#B50E30] text-white font-black text-[9px] px-2 py-0.5 uppercase tracking-widest"
                                  >
                                    +{cert.pointsAwarded} XP
                                  </motion.span>
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
                            </motion.div>
                          );
                        })}
                      </div>
                    </AnimatePresence>
                  )}
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
                <span className="text-neutral-500 font-medium">Plataforma de carrera UTP</span>
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
