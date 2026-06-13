import React, { useMemo, useState } from "react";
import {
  BookOpen, ChevronRight, ExternalLink, Play, Check, Clock,
  Sparkles, ArrowLeft, Tag, Star, Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  CourseCatalogItem,
  EnrolledCourse,
  ExternalCourseSuggestion,
  SkillGap,
} from "../types";
import { CERTIFICATIONS_AND_COURSES, EXTERNAL_COURSE_SUGGESTIONS } from "../data";

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

  const activeGaps = gaps.filter((g) => g.status !== "completado");

  const relevantSuggestions = useMemo(() => {
    const gapNames = activeGaps.map((g) => g.skillName);
    return EXTERNAL_COURSE_SUGGESTIONS.filter((s) => gapNames.includes(s.linkedGap));
  }, [activeGaps]);

  const enrolledInternal = enrolledCourses.filter((e) => e.source === "internal");
  const enrolledExternal = enrolledCourses.filter((e) => e.source === "external");

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

  const renderCourseViewer = () => {
    if (!activeCourse || !activeEnrollment) return null;

    const allLessons = activeCourse.modules.flatMap((m) => m.lessons);
    const activeLesson = allLessons.find((l) => l.id === activeLessonId);
    const isLessonDone = activeLesson
      ? activeEnrollment.completedLessons.includes(activeLesson.id)
      : false;

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

        <div className="bg-white border border-utp-border rounded-none overflow-hidden">
          <div className="p-6 border-b border-utp-border relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">
                  {activeCourse.provider}
                </span>
                <h2 className="text-lg font-black text-black uppercase tracking-tight">
                  {activeCourse.title}
                </h2>
                <p className="text-xs text-neutral-600 font-medium max-w-xl">
                  {activeCourse.description}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-black text-[#B50E30] uppercase tracking-wider block">
                  {activeEnrollment.progress}% completado
                </span>
                <div className="w-32 bg-neutral-100 h-2 border border-utp-border mt-1">
                  <div
                    className="bg-[#B50E30] h-full transition-all"
                    style={{ width: `${activeEnrollment.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[360px]">
            <div className="lg:col-span-2 border-r border-utp-border bg-neutral-50/50 p-4 space-y-3 overflow-y-auto max-h-[420px]">
              {activeCourse.modules.map((mod) => (
                <div key={mod.id} className="space-y-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-black px-2 pt-2">
                    {mod.title}
                  </h4>
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
                            : "hover:bg-white text-black"
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
              ))}
            </div>

            <div className="lg:col-span-3 p-6 flex flex-col justify-between">
              {activeLesson ? (
                <>
                  <div className="space-y-4">
                    <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 utp-diagonal-pattern opacity-10" />
                      <div className="text-center space-y-3 relative z-10">
                        <div className="h-14 w-14 bg-[#B50E30] mx-auto flex items-center justify-center">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                        <p className="text-white text-xs font-bold uppercase tracking-wider">
                          Aula Virtual UTP+
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm uppercase text-black tracking-tight">
                        {activeLesson.title}
                      </h3>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Duración: {activeLesson.duration}
                      </p>
                      <p className="text-xs text-neutral-600 font-medium mt-3 leading-relaxed">
                        Contenido interactivo del módulo. Completa la lección para avanzar en tu ruta
                        de empleabilidad y sumar XP hacia tu certificación.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-4 border-t border-utp-border mt-4">
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
                </>
              ) : (
                <p className="text-xs text-neutral-500 font-medium">
                  Selecciona una lección del menú lateral para comenzar.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderCourseList = () => (
    <div className="space-y-6">
      {enrolledInternal.length === 0 && enrolledExternal.length === 0 ? (
        <div className="bg-white border border-utp-border p-10 text-center space-y-4">
          <BookOpen className="h-10 w-10 text-[#B50E30] mx-auto" />
          <p className="text-sm font-extrabold uppercase text-black">
            Aún no tienes cursos inscritos
          </p>
          <p className="text-xs text-neutral-500 font-medium max-w-sm mx-auto">
            Explora el catálogo de certificaciones UTP+ o revisa las sugerencias externas
            personalizadas según tus brechas.
          </p>
          <button
            type="button"
            onClick={onNavigateToCatalog}
            className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-black uppercase tracking-widest px-5 py-2.5 hover:bg-neutral-900 transition cursor-pointer"
          >
            Ver catálogo
            <ChevronRight className="h-4 w-4 text-[#B50E30]" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enrolledInternal.map((enrollment) => {
            const course = getCatalogCourse(enrollment.courseId);
            if (!course) return null;
            const totalLessons = getTotalLessons(course);
            const completedCount = enrollment.completedLessons.length;

            return (
              <div
                key={enrollment.courseId}
                className="bg-white border border-utp-border p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-neutral-400 font-extrabold uppercase tracking-widest">
                      {course.provider}
                    </span>
                    <span className="bg-[#B50E30] text-white font-black text-[9px] px-2 py-0.5 uppercase">
                      +{course.pointsAwarded} XP
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-black uppercase tracking-tight">
                    {course.title}
                  </h3>
                  <p className="text-[10px] text-neutral-500 font-bold uppercase">
                    {completedCount}/{totalLessons} lecciones • {course.duration}
                  </p>
                  <div className="w-full bg-neutral-100 h-1.5 border border-utp-border">
                    <div
                      className="bg-[#B50E30] h-full transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectCourse(enrollment.courseId)}
                  className="w-full py-2.5 bg-black hover:bg-neutral-900 text-white font-black uppercase tracking-widest text-xs transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Play className="h-3.5 w-3.5 fill-white" />
                  Continuar curso
                </button>
              </div>
            );
          })}

          {enrolledExternal.map((enrollment) => {
            const suggestion = getExternalSuggestion(enrollment.courseId);
            if (!suggestion) return null;

            return (
              <div
                key={enrollment.courseId}
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
              </div>
            );
          })}
        </div>
      )}

      {relevantSuggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#B50E30]" />
            <h3 className="text-xs font-black text-black uppercase tracking-widest">
              Sugerencias externas para tus brechas
            </h3>
          </div>
          <p className="text-xs text-neutral-500 font-medium -mt-2">
            Cursos de plataformas como Udemy o LinkedIn Learning que complementan el catálogo UTP+
            y te ayudan a cerrar brechas detectadas por la IA.
          </p>

          <div className="space-y-3">
            {relevantSuggestions.map((suggestion) => {
              const gap = activeGaps.find((g) => g.skillName === suggestion.linkedGap);
              const alreadySaved = enrolledExternal.some((e) => e.courseId === suggestion.id);

              return (
                <div
                  key={suggestion.id}
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
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-none border border-utp-border p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-full utp-diagonal-pattern opacity-10 pointer-events-none" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />
        <h2 className="text-base font-black text-black uppercase tracking-widest flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#B50E30]" />
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
