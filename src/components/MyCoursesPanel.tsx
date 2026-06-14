import React, { useMemo, useState } from "react";
import {
  BookOpen, ChevronRight, ExternalLink, Play, Check, Clock,
  Sparkles, ArrowLeft, Tag, Star, Users, Download, MessageCircle,
  FileText, ChevronDown, ChevronUp, SearchX, SlidersHorizontal, X, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  CourseCatalogItem,
  EnrolledCourse,
  ExternalCourseSuggestion,
  SkillGap,
} from "../types";
import { CERTIFICATIONS_AND_COURSES, EXTERNAL_COURSE_SUGGESTIONS } from "../data";
import UvpIcon from "./ui/UvpIcon";
import CourseFilters from "./CourseFilters";

interface MyCoursesPanelProps {
  enrolledCourses: EnrolledCourse[];
  gaps: SkillGap[];
  onCompleteLesson: (courseId: string, lessonId: string, xpReward: number) => void;
  onEnrollExternal: (suggestionId: string) => void;
  onNavigateToCatalog: () => void;
}

function getTotalLessons(course: CourseCatalogItem): number {
  return course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
}

function getCatalogCourse(courseId: string): CourseCatalogItem | undefined {
  return CERTIFICATIONS_AND_COURSES.find((c) => c.id === courseId);
}

function getExternalSuggestion(suggestionId: string): ExternalCourseSuggestion | undefined {
  return EXTERNAL_COURSE_SUGGESTIONS.find((s) => s.id === suggestionId);
}

const logos: Record<string, string> = {
  "Google": "https://e7.pngegg.com/pngimages/704/688/png-clipart-google-google-thumbnail.png",
  "Microsoft": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/3840px-Microsoft_logo.svg.png",
  "UTP": "https://i.scdn.co/image/ab6765630000ba8af770691237911d7e512de37c",
};

export default function MyCoursesPanel({
  enrolledCourses,
  gaps,
  onCompleteLesson,
  onEnrollExternal,
  onNavigateToCatalog,
}: MyCoursesPanelProps) {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(
    enrolledCourses[0]?.courseId ?? null
  );
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"descripcion" | "materiales" | "discusion">("descripcion");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [companyFilter, setCompanyFilter] = useState<string>("todas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const activeGaps = gaps.filter((g) => g.status !== "completado");

  const relevantSuggestions = useMemo(() => {
    const gapNames = activeGaps.map((g) => g.skillName);
    return EXTERNAL_COURSE_SUGGESTIONS.filter((s) => gapNames.includes(s.linkedGap));
  }, [activeGaps]);

  const uniqueCompanies = useMemo(() => {
    const companies = new Set<string>();
    CERTIFICATIONS_AND_COURSES.forEach((c) => companies.add(c.provider));
    EXTERNAL_COURSE_SUGGESTIONS.forEach((s) => companies.add(s.platform));
    return Array.from(companies).sort();
  }, []);

  const enrolledInternal = enrolledCourses.filter((e) => e.source === "internal");
  const enrolledExternal = enrolledCourses.filter((e) => e.source === "external");

  const filterBySearch = (title: string, provider: string): boolean => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return title.toLowerCase().includes(q) || provider.toLowerCase().includes(q);
  };

  const filteredInternal = enrolledInternal
    .filter((e) => {
      const course = getCatalogCourse(e.courseId);
      if (!course) return false;
      if (companyFilter !== "todas" && course.provider !== companyFilter) return false;
      if (!filterBySearch(course.title, course.provider)) return false;
      return true;
    })
    .sort((a, b) => {
      const ca = getCatalogCourse(a.courseId);
      const cb = getCatalogCourse(b.courseId);
      if (!ca || !cb) return 0;
      return sortOrder === "asc"
        ? ca.pointsAwarded - cb.pointsAwarded
        : cb.pointsAwarded - ca.pointsAwarded;
    });

  const filteredExternal = enrolledExternal.filter((e) => {
    const suggestion = getExternalSuggestion(e.courseId);
    if (!suggestion) return false;
    if (companyFilter !== "todas" && suggestion.platform !== companyFilter) return false;
    if (!filterBySearch(suggestion.title, suggestion.platform)) return false;
    return true;
  });

  const filteredSuggestions = relevantSuggestions.filter((s) => {
    if (companyFilter !== "todas" && s.platform !== companyFilter) return false;
    if (!filterBySearch(s.title, s.platform)) return false;
    return true;
  });

  const filtersActive = companyFilter !== "todas";

  const activeCourse = activeCourseId ? getCatalogCourse(activeCourseId) : null;
  const activeEnrollment = enrolledCourses.find((e) => e.courseId === activeCourseId);

  const handleSelectCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    const course = getCatalogCourse(courseId);
    const enrollment = enrolledCourses.find((e) => e.courseId === courseId);
    if (course && enrollment) {
      const firstIncomplete = course.modules
        .flatMap((m) => m.lessons)
        .find((l) => !enrollment.completedLessons.includes(l.id));
      setActiveLessonId(firstIncomplete?.id ?? course.modules[0]?.lessons[0]?.id ?? null);
    }
  };

  const handleCompleteLesson = () => {
    if (!activeCourseId || !activeLessonId || !activeCourse) return;
    onCompleteLesson(activeCourseId, activeLessonId, 15);

    const enrollment = enrolledCourses.find((e) => e.courseId === activeCourseId);
    const completedSet = new Set([...(enrollment?.completedLessons ?? []), activeLessonId]);
    const allLessons = activeCourse.modules.flatMap((m) => m.lessons);
    const nextLesson = allLessons.find((l) => !completedSet.has(l.id));
    setActiveLessonId(nextLesson?.id ?? activeLessonId);
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const renderCourseViewer = () => {
    if (!activeCourse || !activeEnrollment) return null;

    const allLessons = activeCourse.modules.flatMap((m) => m.lessons);
    const activeLesson = allLessons.find((l) => l.id === activeLessonId);
    const isLessonDone = activeLesson
      ? activeEnrollment.completedLessons.includes(activeLesson.id)
      : false;
    const activeModule = activeCourse.modules.find(m => m.lessons.some(l => l.id === activeLessonId));

    return (
      <motion.div
        key="course-viewer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <button
          type="button"
          onClick={() => {
            setActiveCourseId(null);
            setActiveLessonId(null);
          }}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver a mis cursos
        </button>

        <div className="bg-white border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-neutral-100 relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                  {activeCourse.provider}
                </span>
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  {activeCourse.title}
                </h2>
                {activeModule && (
                  <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wide">
                    Módulo actual: {activeModule.title}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-black text-[#B50E30] uppercase tracking-wider block">
                  {activeEnrollment.progress}% completado
                </span>
                <div className="w-32 bg-neutral-100 h-2 mt-1">
                  <div
                    className="bg-[#B50E30] h-full transition-all"
                    style={{ width: `${activeEnrollment.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[500px]">
            <div className="lg:col-span-2 border-r border-neutral-100 bg-neutral-50/50 p-4 space-y-3 overflow-y-auto max-h-[580px]">
              {activeCourse.modules.map((mod) => {
                const completedInModule = mod.lessons.filter(l => activeEnrollment.completedLessons.includes(l.id)).length;
                const isExpanded = expandedModules[mod.id] !== false;
                return (
                  <div key={mod.id} className="space-y-1 bg-white border border-neutral-200 shadow-sm">
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between px-3 py-3 text-left cursor-pointer hover:bg-neutral-50 transition"
                    >
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-black">
                          {mod.title}
                        </h4>
                        <span className="text-[9px] font-bold text-neutral-500">
                          {completedInModule}/{mod.lessons.length} lecciones
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-200 h-1.5">
                          <div
                            className="bg-[#B50E30] h-full transition-all"
                            style={{ width: `${(completedInModule / mod.lessons.length) * 100}%` }}
                          />
                        </div>
                        {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-neutral-400" /> : <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="pb-1">
                        {mod.lessons.map((lesson) => {
                          const done = activeEnrollment.completedLessons.includes(lesson.id);
                          const isActive = activeLessonId === lesson.id;
                          return (
                            <button
                              key={lesson.id}
                              type="button"
                              onClick={() => setActiveLessonId(lesson.id)}
                              className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 text-xs transition cursor-pointer ${
                                isActive
                                  ? "bg-black text-white"
                                  : "hover:bg-neutral-100 text-black"
                              }`}
                            >
                              <div
                                className={`h-4 w-4 shrink-0 flex items-center justify-center border ${
                                  done
                                    ? "bg-[#B50E30] border-[#B50E30] text-white"
                                    : isActive
                                      ? "border-white/50"
                                      : "border-neutral-300"
                                }`}
                              >
                                {done && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                              </div>
                              <span className="font-semibold flex-1 truncate">{lesson.title}</span>
                              <span
                                className={`text-[9px] font-bold shrink-0 ${
                                  isActive ? "text-white/70" : "text-neutral-400"
                                }`}
                              >
                                {lesson.duration}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-3 flex flex-col">
              <div className="p-6 flex-1">
                {activeLesson ? (
                  <div className="space-y-4">
                    <div className="aspect-video bg-gradient-to-br from-neutral-900 via-black to-neutral-800 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `linear-gradient(rgba(181, 14, 48, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(181, 14, 48, 0.08) 1px, transparent 1px)`,
                        backgroundSize: '48px 48px'
                      }} />
                      <div className="text-center space-y-3 relative z-10">
                        <div className="h-16 w-16 bg-[#B50E30] mx-auto flex items-center justify-center cursor-pointer hover:bg-[#85061B] transition">
                          <Play className="h-7 w-7 text-white fill-white" />
                        </div>
                        <p className="text-white text-xs font-bold uppercase tracking-wider">
                          Aula Virtual UTP+
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 border-b border-neutral-100">
                      {(["descripcion", "materiales", "discusion"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className={`text-[10px] font-black uppercase tracking-widest px-4 py-3 transition cursor-pointer border-b-2 ${
                            activeTab === tab
                              ? "text-[#B50E30] border-[#B50E30]"
                              : "text-neutral-400 border-transparent hover:text-black"
                          }`}
                        >
                          {tab === "descripcion" && "Descripción"}
                          {tab === "materiales" && "Materiales"}
                          {tab === "discusion" && "Discusión"}
                        </button>
                      ))}
                    </div>

                    {activeTab === "descripcion" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm uppercase text-black tracking-tight">
                            {activeLesson.title}
                          </h3>
                          <span className="text-[9px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {activeLesson.duration}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                          Contenido interactivo del módulo. Completa la lección para avanzar en tu ruta
                          de empleabilidad y sumar XP hacia tu certificación.
                        </p>
                        <div className="bg-neutral-50 border border-neutral-200 p-4 space-y-2">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-black">Objetivos</h4>
                          <ul className="space-y-1.5">
                            {["Comprender los fundamentos teóricos", "Aplicar conceptos en casos prácticos", "Evaluar tu conocimiento con ejercicios"].map((obj, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-neutral-600 font-medium">
                                <Check className="h-3.5 w-3.5 text-[#B50E30] mt-0.5 shrink-0" />
                                {obj}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {activeTab === "materiales" && (
                      <div className="space-y-2">
                        {[
                          { name: "Guía de estudio - Lección 4.pdf", size: "2.4 MB", type: "PDF" },
                          { name: "Ejercicios prácticos - Sesión 4.docx", size: "1.1 MB", type: "Documento" },
                          { name: "Video complementario - Casos de uso.mp4", size: "45 MB", type: "Video" },
                        ].map((mat, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 transition cursor-pointer">
                            <div className="flex items-center gap-3">
                              <FileText className="h-4 w-4 text-[#B50E30]" />
                              <div>
                                <p className="text-xs font-bold text-black">{mat.name}</p>
                                <p className="text-[9px] text-neutral-500 font-semibold">{mat.size} • {mat.type}</p>
                              </div>
                            </div>
                            <Download className="h-4 w-4 text-neutral-400 hover:text-[#B50E30] transition" />
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === "discusion" && (
                      <div className="space-y-3">
                        <div className="p-4 bg-neutral-50 border border-neutral-200 text-center space-y-2">
                          <MessageCircle className="h-6 w-6 text-[#B50E30] mx-auto" />
                          <p className="text-xs font-bold text-black">Foro de discusión de la lección</p>
                          <p className="text-[10px] text-neutral-500 font-medium">
                            Participa con tus compañeros y mentores. Las preguntas y respuestas quedarán
                            registradas para futuros estudiantes.
                          </p>
                          <button
                            type="button"
                            className="text-[10px] font-black uppercase tracking-widest border border-black px-4 py-2 hover:bg-black hover:text-white transition cursor-pointer"
                          >
                            Escribir mensaje
                          </button>
                        </div>
                        {[
                          { author: "Carlos M.", text: "¿Alguien ha aplicado esto en un proyecto real?", time: "Hace 2 horas" },
                          { author: "Docente IA", text: "Excelente pregunta. Te recomiendo el caso práctico del módulo 2.", time: "Hace 1 hora", isTeacher: true },
                        ].map((msg, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-white border border-neutral-200">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase shrink-0 ${msg.isTeacher ? "bg-[#B50E30] text-white" : "bg-neutral-200 text-black"}`}>
                              {msg.author[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold text-black">{msg.author}</span>
                                {msg.isTeacher && <span className="text-[8px] font-black text-[#B50E30] uppercase tracking-widest">Instructor</span>}
                                <span className="text-[9px] text-neutral-400">{msg.time}</span>
                              </div>
                              <p className="text-xs text-neutral-600 font-medium mt-1">{msg.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-100 mt-4">
                      <span className="text-[10px] font-bold text-neutral-500 uppercase">
                        {isLessonDone ? "Lección completada" : "Marca como completada para +15 XP"}
                      </span>
                      <button
                        type="button"
                        disabled={isLessonDone}
                        onClick={handleCompleteLesson}
                        className={`text-xs font-black uppercase tracking-widest px-5 py-2.5 transition cursor-pointer ${
                          isLessonDone
                            ? "bg-neutral-100 text-neutral-400 cursor-default"
                            : "bg-[#B50E30] hover:bg-[#85061B] text-white"
                        }`}
                      >
                        {isLessonDone ? "Completada" : "Completar lección"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 font-medium">
                    Selecciona una lección del menú lateral para comenzar.
                  </p>
                )}
              </div>

              {activeLesson && (
                <div className="border-t border-neutral-100 bg-neutral-50/50 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="w-full bg-neutral-200 h-1.5">
                        <div
                          className="bg-[#B50E30] h-full transition-all"
                          style={{ width: `${activeEnrollment.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-[#B50E30] whitespace-nowrap">
                      {activeEnrollment.progress}% del curso
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="h-8 w-8 border border-neutral-300 flex items-center justify-center hover:bg-white transition cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 fill-black text-black" />
                      </button>
                      <span className="text-[10px] font-bold text-neutral-500">
                        {allLessons.findIndex(l => l.id === activeLessonId) + 1} / {allLessons.length}
                      </span>
                      <button
                        type="button"
                        className="h-8 w-8 border border-neutral-300 flex items-center justify-center hover:bg-white transition cursor-pointer"
                      >
                        <Play className="h-3.5 w-3.5 fill-black text-black rotate-180" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCourseList = () => (
    <div className="space-y-6">
                      <CourseFilters
                        uniqueCompanies={uniqueCompanies}
                        companyFilter={companyFilter}
                        onCompanyFilterChange={setCompanyFilter}
                        sortOrder={sortOrder}
                        onSortOrderChange={setSortOrder}
                        searchTerm={searchTerm}
                        onSearchTermChange={setSearchTerm}
                      />

      {enrolledInternal.length === 0 && enrolledExternal.length === 0 ? (
        <div className="bg-white border border-utp-border p-10 text-center space-y-4">
          <BookOpen className="h-10 w-10 text-[#B50E30] mx-auto" />
          <p className="text-sm font-black uppercase text-black">
            Aún no tienes cursos inscritos
          </p>
          <p className="text-xs text-neutral-500 font-medium max-w-sm mx-auto">
            Explora el catálogo de certificaciones UTP+ o revisa las sugerencias externas
            personalizadas según tus brechas.
          </p>
          <button
            type="button"
            onClick={onNavigateToCatalog}
            className="inline-flex items-center gap-1.5 bg-[#B50E30] text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 hover:bg-[#85061B] transition cursor-pointer"
          >
            Ver catálogo
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      ) : filteredInternal.length === 0 && filteredExternal.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-utp-border p-10 text-center space-y-4"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <SearchX className="h-10 w-10 text-neutral-300 mx-auto" />
          </motion.div>
          <p className="text-sm font-black uppercase text-black">
            Ningún curso coincide
          </p>
          <p className="text-xs text-neutral-500 font-medium max-w-sm mx-auto">
            No hay cursos con los filtros seleccionados. Prueba con otras opciones o
            <button
              type="button"
              onClick={() => setCompanyFilter("todas")}
              className="text-[#B50E30] font-black hover:underline mx-1 cursor-pointer"
            >
              restablece los filtros
            </button>
            .
          </p>
        </motion.div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div key="course-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInternal.map((enrollment, idx) => {
              const course = getCatalogCourse(enrollment.courseId);
              if (!course) return null;

              const completedLessons = enrollment.completedLessons.length;
              const totalLessons = getTotalLessons(course);

              return (
                <motion.div
                  key={enrollment.courseId}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -12 }}
                  transition={{ duration: 0.25, delay: idx * 0.035 }}
                  className="bg-white border border-neutral-200 shadow-sm flex flex-col"
                >
                  <div className="h-32 w-full overflow-hidden bg-neutral-200 relative">
                    {course.image && <img src={course.image} alt={course.title} className="w-full h-full object-cover" />}
                    <div className="absolute top-2 right-2">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="bg-[#B50E30] text-white font-black text-[9px] px-2 py-0.5 uppercase tracking-widest inline-block"
                      >
                        +{course.pointsAwarded} XP
                      </motion.span>
                    </div>
                  </div>
                  <div className="p-5 flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      {logos[course.provider] ? (
                        <img src={logos[course.provider]} alt={course.provider} className="h-5 object-contain" />
                      ) : (
                        <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest">{course.provider}</span>
                      )}
                    </div>
                    <h3 className="font-black text-sm text-black uppercase tracking-tight leading-snug">{course.title}</h3>
                    <p className="text-[11px] font-bold text-neutral-600 mt-2 uppercase">
                      {course.duration}{course.modality ? ` | ${course.modality}` : ""}
                    </p>
                    {course.speaker && (
                      <p className="text-[11px] font-semibold text-neutral-500 mt-1">{course.speaker}</p>
                    )}
                  </div>
                  <div className="px-5 pb-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-neutral-500">{enrollment.progress}%</span>
                      <span className="text-[9px] font-bold text-neutral-400">{completedLessons}/{totalLessons} lecciones</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 mb-3">
                      <div className="bg-[#D35400] h-full transition-all" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectCourse(enrollment.courseId)}
                      className="w-full bg-[#B50E30] hover:bg-[#85061B] text-white py-2 text-xs font-black uppercase transition cursor-pointer border-0"
                    >
                      Continuar curso
                    </button>
                  </div>
                </motion.div>
              );
            })}

            {filteredExternal.map((enrollment, idx) => {
              const suggestion = getExternalSuggestion(enrollment.courseId);
              if (!suggestion) return null;

              return (
                <motion.div
                  key={enrollment.courseId}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -12 }}
                  transition={{ duration: 0.25, delay: (filteredInternal.length + idx) * 0.035 }}
                  className="bg-white border border-utp-border p-5 flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-black text-white font-extrabold uppercase px-2 py-0.5">
                        {suggestion.platform} • Externo
                      </span>
                      <span className="text-[10px] font-black text-[#B50E30]">
                        {suggestion.price}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm text-black uppercase tracking-tight">
                      {suggestion.title}
                    </h3>
                    <p className="text-[10px] text-neutral-500 font-medium">
                      Guardado para cerrar brecha: {suggestion.linkedGap}
                    </p>
                  </div>
                  <a
                    href={suggestion.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-[#B50E30] hover:bg-[#85061B] text-white font-black uppercase tracking-widest text-xs transition flex items-center justify-center gap-1"
                  >
                    Ir a {suggestion.platform}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      )}

      {filteredSuggestions.length > 0 && (
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 text-[#B50E30]" />
            <h3 className="text-xs font-black text-black uppercase tracking-widest">
              Sugerencias externas para tus brechas
            </h3>
          </motion.div>
          <p className="text-xs text-neutral-500 font-medium -mt-2">
            Cursos de plataformas como Udemy o LinkedIn Learning que complementan el catálogo UTP+
            y te ayudan a cerrar brechas detectadas por la IA.
          </p>

          <AnimatePresence>
            <div className="space-y-3">
              {filteredSuggestions.map((suggestion, idx) => {
                const gap = activeGaps.find((g) => g.skillName === suggestion.linkedGap);
                const alreadySaved = enrolledExternal.some((e) => e.courseId === suggestion.id);

                return (
                  <motion.div
                    key={suggestion.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.25, delay: idx * 0.04 }}
                    className="bg-white border border-utp-border p-5 space-y-3 relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#B50E30]" />
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pl-2">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-black text-white text-[9px] font-black px-2 py-0.5 uppercase">
                            {suggestion.platform}
                          </span>
                          {gap && (
                            <span className="text-[9px] font-black text-[#B50E30] uppercase tracking-wider flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              Cierra brecha: {gap.skillName}
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-sm text-black uppercase tracking-tight">
                          {suggestion.title}
                        </h4>
                        <p className="text-xs text-neutral-600 font-medium leading-relaxed">
                          {suggestion.highlight}
                        </p>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-neutral-500 uppercase">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-[#B50E30] fill-[#B50E30]" />
                            {suggestion.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {suggestion.students}
                          </span>
                          <span className="text-black font-black">{suggestion.price}</span>
                          {suggestion.originalPrice && (
                            <span className="line-through text-neutral-400">
                              {suggestion.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <a
                          href={suggestion.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#B50E30] hover:bg-[#85061B] text-white text-[10px] font-black uppercase tracking-widest px-4 py-2.5 transition flex items-center justify-center gap-1.5"
                        >
                          Ver en {suggestion.platform}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        {!alreadySaved && (
                          <button
                            type="button"
                            onClick={() => onEnrollExternal(suggestion.id)}
                            className="border border-black text-black text-[10px] font-black uppercase tracking-widest px-4 py-2.5 hover:bg-neutral-50 transition cursor-pointer"
                          >
                            Guardar en Mis Cursos
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
        <h2 className="heading-lg text-black tracking-widest flex items-center gap-2">
          <UvpIcon name="capacitacion-talleres" size={20} className="text-[#B50E30]" />
          Mis Cursos
        </h2>
        <p className="text-[#64748B] text-xs font-semibold mt-1">
          Cursos UTP+ en los que estás inscrito y sugerencias externas personalizadas según tus
          brechas de empleabilidad.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {activeCourseId && getCatalogCourse(activeCourseId)
          ? renderCourseViewer()
          : renderCourseList()}
      </AnimatePresence>
    </div>
  );
}
