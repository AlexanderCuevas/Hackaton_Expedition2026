import React, { useState } from "react";
import { UserProfile, SkillGap, CareerMission } from "../types";
import { 
  Sparkles, Check, ArrowRight, ArrowLeft, GraduationCap, ChevronRight,
  TrendingUp, User, Cpu, Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DiagnosticoWizardProps {
  currentProfile: UserProfile;
  onAnalysisSuccess: (profile: UserProfile, gaps: SkillGap[], missions: CareerMission[]) => void;
}

const CAREERS = [
  "Ingeniería de Sistemas",
  "Administración",
  "Marketing",
  "Diseño Gráfico / UX-UI",
  "Arquitectura",
  "Derecho",
  "Negocios Internacionales",
  "Ciencias de la Comunicación"
];

const EXPERIENCES = [
  "Sin experiencia (Buscando mi primera práctica)",
  "Proyectos personales o académicos de alta exigencia",
  "Prácticas pre-profesionales iniciales",
  "Experiencia laboral general fuera de mi carrera"
];

const TYPICAL_SKILLS: Record<string, string[]> = {
  "Ingeniería de Sistemas": ["HTML/CSS", "JavaScript", "SQL Server", "TypeScript", "Python", "React", "Node.js", "Git/GitHub", "Metodologías Ágiles", "AWS Basic"],
  "Administración": ["Excel Intermedio", "Power BI básico", "Gestión de Proyectos", "Presupuestos", "Scrum", "Inglés Intermedio", "Liderazgo"],
  "Marketing": ["Google Analytics", "Facebook Ads", "Copywriting", "SEO/SEM", "Canva/Photoshop", "Email Marketing", "Estrategia Digital"],
  "Diseño Gráfico / UX-UI": ["Figma", "Adobe Illustrator", "Prototipado", "Design Thinking", "Adobe Photoshop", "User Research", "Wireframing"],
  "Arquitectura": ["AutoCAD", "Revit", "Sketchup", "Renderizado 3D", "Control de Obras", "Diseño Sostenible"],
  "Derecho": ["Redacción Jurídica", "Litigación Oral", "Investigación Legal", "Mediación", "Derecho Corporativo"],
  "Negocios Internacionales": ["Excel Financiero", "Logística Internacional", "Aduanas", "Inglés Comercial", "Negociación"],
  "Ciencias de la Comunicación": ["Redacción Creativa", "Edición de Video", "Community Management", "Relaciones Públicas", "Fotografía"]
};

const SUGGESTED_ROLES: Record<string, string[]> = {
  "Ingeniería de Sistemas": ["Full Stack Developer Junior", "Analista de Datos", "Backend Developer Trainee", "DevOps Enginner Junior", "QA Analyst"],
  "Administración": ["Analista de Procesos", "Asistente de Recursos Humanos", "Project Manager Junior", "Administrador de Operaciones"],
  "Marketing": ["Social Media Analyst", "Growth Marketing Specialist", "Asistente de Marketing Digital", "SEO Copywriter"],
  "Diseño Gráfico / UX-UI": ["Diseñador UX/UI Trainee", "Product Designer Junior", "Diseñador Gráfico Digital", "Content Creator"],
  "Arquitectura": ["Asistente de Diseñor Arquitectónico", "Modelador BIM Junior", "Supervisor de Obras Junior"],
  "Derecho": ["Asistente Legal Corporativo", "Consultor Contractual Junior", "Secigra / Practicante Judicial"],
  "Negocios Internacionales": ["Asistente de Comercio Exterior", "Analista de Inteligencia Comercial", "Supply Chain Trainee"],
  "Ciencias de la Comunicación": ["Redactor Creativo", "Especialista en PR / Comunicaciones", "Coordinador de Audiovisuales"]
};

export default function DiagnosticoWizard({
  currentProfile,
  onAnalysisSuccess
}: DiagnosticoWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorStr, setErrorStr] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(currentProfile.name || "");
  const [career, setCareer] = useState(currentProfile.career || "");
  const [semester, setSemester] = useState<number>(currentProfile.semester || 1);
  const [experienceLevel, setExperienceLevel] = useState(currentProfile.experienceLevel || "");
  const [targetRole, setTargetRole] = useState(currentProfile.targetRole || "");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(currentProfile.currentSkills || []);
  const [interestsText, setInterestsText] = useState(currentProfile.interests.join(", ") || "");

  const handleToggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleCareerSelect = (chosen: string) => {
    setCareer(chosen);
    const initialSkills = TYPICAL_SKILLS[chosen] ? TYPICAL_SKILLS[chosen].slice(0, 3) : [];
    setSelectedSkills(initialSkills);
    const initialRole = SUGGESTED_ROLES[chosen] ? SUGGESTED_ROLES[chosen][0] : "";
    setTargetRole(initialRole);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorStr(null);

    const payload = {
      name: name || "Estudiante UTP",
      career,
      semester,
      experienceLevel,
      targetRole,
      currentSkills: selectedSkills,
      interests: interestsText.split(",").map(i => i.trim()).filter(Boolean)
    };

    try {
      const response = await fetch("/api/profile/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Error en la conexión con el servidor");
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const updatedProfile: UserProfile = {
        name: name || "Estudiante UTP",
        career,
        semester,
        experienceLevel,
        targetRole,
        currentSkills: selectedSkills,
        interests: payload.interests,
        employabilityScore: data.employabilityScore || 50,
        xp: currentProfile.xp,
        level: currentProfile.level,
        progressToNextLevel: currentProfile.progressToNextLevel
      };

      const gaps: SkillGap[] = (data.skillGaps || []).map((sg: any) => ({
        ...sg,
        status: "pendiente"
      }));

      const missions: CareerMission[] = (data.recommendedMissions || []).map((rm: any, idx: number) => ({
        ...rm,
        status: idx === 0 ? "disponible" : "bloqueado",
        order: idx + 1
      }));

      onAnalysisSuccess(updatedProfile, gaps, missions);
    } catch (err: any) {
      console.error(err);
      setErrorStr(err.message || "Ocurrió un error inesperado al procesar con IA. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-none border border-utp-border shadow-none overflow-hidden">
      {/* Top Wizard Steps Tracker */}
      <div className="bg-neutral-50 border-b border-utp-border px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-[#B50E30]" />
          <span className="font-extrabold text-black text-xs tracking-wider uppercase">DIAGNÓSTICO ACADÉMICO IA</span>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((stepIdx) => (
            <div 
              key={stepIdx} 
              className={`h-1.5 transition-all duration-300 rounded-none ${
                step >= stepIdx 
                  ? stepIdx === step ? "w-8 bg-[#B50E30]" : "w-4 bg-black" 
                  : "w-2 bg-neutral-250"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-8">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 text-center space-y-4"
            >
              <div className="relative h-16 w-16 mx-auto">
                <div className="absolute inset-0 rounded-none border-2 border-neutral-100" />
                <div className="absolute inset-0 rounded-none border-2 border-[#B50E30] border-t-transparent animate-spin" />
                <Sparkles className="h-6 w-6 text-[#B50E30] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black text-black uppercase tracking-wider">Analizando Compatibilidad con IA</h3>
                <p className="text-neutral-500 text-xs max-w-sm mx-auto leading-relaxed font-semibold">
                  Nuestro motor corporativo está evaluando tu perfil frente a las vacantes de empleabilidad real vigentes en el mercado nacional...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* STEP 1: Datos Personales y Carrera */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-black uppercase tracking-wider">Cuéntanos sobre ti</h2>
                    <p className="text-xs text-neutral-500 font-semibold">¿Cuál es tu nombre y carrera universitaria en curso?</p>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <User className="h-4 w-4 text-[#B50E30]" />
                        Nombre Completo o Iniciales
                      </label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ej. Valeria Alva"
                        className="w-full px-4 py-3 bg-white rounded-none border border-utp-border outline-none focus:border-black text-xs font-semibold text-black transition"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-black">Selecciona tu carrera profesional</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {CAREERS.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleCareerSelect(c)}
                            className={`p-3.5 rounded-none border text-left text-xs font-bold uppercase tracking-tight transition ${
                              career === c 
                                ? "bg-black border-black text-white" 
                                : "bg-white border-utp-border text-black hover:border-black"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Ciclo y Experiencia */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-black uppercase tracking-wider">Etapa de estudios y ciclo</h2>
                    <p className="text-xs text-neutral-500 font-semibold">Para calibrar las metas de tus primeras simulaciones de entrevista y vacantes recomendadas.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3 bg-neutral-50 p-4 border border-utp-border">
                      <label className="text-[10px] font-black uppercase tracking-wider text-black flex justify-between items-center">
                        <span>¿Qué ciclo académico estás cursando?</span>
                        <span className="bg-[#B50E30] text-white font-black px-2.5 py-1 text-xs">{semester}º CICLO</span>
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        step="1"
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="w-full h-2 bg-[#E5E5E5] outline-none appearance-none cursor-pointer rounded-none"
                        style={{ accentColor: '#B50E30' }}
                      />
                      <div className="flex justify-between text-[10px] text-black font-extrabold uppercase tracking-widest">
                        <span>1º</span>
                        <span>5º (Estudios Generales)</span>
                        <span>10º (Egreso)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-black">Nivel de experiencia profesional acumulada</label>
                      <div className="space-y-2">
                        {EXPERIENCES.map((exp) => (
                          <button
                            key={exp}
                            type="button"
                            onClick={() => setExperienceLevel(exp)}
                            className={`w-full p-4 rounded-none border text-left text-xs font-bold transition flex items-center justify-between ${
                              experienceLevel === exp 
                                ? "bg-black border-black text-white" 
                                : "bg-white border-utp-border text-black hover:bg-neutral-50"
                            }`}
                          >
                            <span>{exp.toUpperCase()}</span>
                            {experienceLevel === exp && (
                              <Check className="h-4 w-4 text-[#B50E30] stroke-[3]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Puesto Objetivo e Intereses */}
              {step === 3 && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-black uppercase tracking-wider">Sectores e Intereses Profesionales</h2>
                    <p className="text-xs text-neutral-500 font-semibold">Define los roles favoritos que consideras prioritarios para tu plan de vida.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-black">Perfiles recomendados para tu carrera:</label>
                      <div className="flex flex-wrap gap-2">
                        {career && SUGGESTED_ROLES[career]?.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setTargetRole(role)}
                            className={`px-3.5 py-2 rounded-none border text-[11px] font-black uppercase tracking-wider transition ${
                              targetRole === role 
                                ? "bg-[#B50E30] border-[#B50E30] text-white" 
                                : "bg-white border-utp-border text-black hover:border-black"
                            }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4 text-[#B50E30]" />
                        Escribe tu puesto objetivo de preferencia:
                      </label>
                      <input 
                        type="text" 
                        value={targetRole}
                        onChange={(e) => setTargetRole(e.target.value)}
                        placeholder="Ej: Practicante de Cloud Engineering"
                        className="w-full px-4 py-3 bg-white rounded-none border border-utp-border outline-none focus:border-black text-xs font-semibold text-black transition font-mono"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-black">Intereses o Tecnologías Clave (separados por comas)</label>
                      <input 
                        type="text" 
                        value={interestsText}
                        onChange={(e) => setInterestsText(e.target.value)}
                        placeholder="Ej: Inteligencia Artificial, Servicios de red, Consultoría"
                        className="w-full px-4 py-3 bg-white rounded-none border border-utp-border outline-none focus:border-black text-xs font-semibold text-black transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Skills Checklist */}
              {step === 4 && (
                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <h2 className="text-lg font-black text-black uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-[#B50E30]" />
                      Habilidades e Inventario Profesional
                    </h2>
                    <p className="text-xs text-neutral-500 font-semibold">Selecciona aquellas tecnologías con las cuales ya has completado proyectos o laboratorios.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-neutral-50 border border-utp-border text-xs rounded-none flex items-center gap-3">
                      <div className="bg-[#B50E30] text-white p-2 shrink-0">
                        <Award className="h-4 w-4 text-white" />
                      </div>
                      <p className="text-black font-semibold leading-relaxed">
                        Evaluaremos tu nivel basándonos en tu ciclo formativo e inventario tecnológico para proponer talleres y certificados oficiales gratis del programa.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-black">Habilidades Técnicas sugeridas para {career || "esta área"}:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {career && TYPICAL_SKILLS[career]?.map((skill) => {
                          const hasSkill = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => handleToggleSkill(skill)}
                              className={`p-3 rounded-none border text-left text-xs font-bold tracking-tight cursor-pointer transition flex items-center justify-between ${
                                hasSkill 
                                  ? "bg-black border-black text-white" 
                                  : "bg-white border-utp-border text-black hover:border-black"
                              }`}
                            >
                              <span className="truncate">{skill}</span>
                              {hasSkill && <Check className="h-3.5 w-3.5 text-[#B50E30] shrink-0 stroke-[3]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Errors Block */}
              {errorStr && (
                <div className="p-3.5 bg-neutral-50 border-l-4 border-[#B50E30] text-xs text-black font-extrabold uppercase tracking-wide">
                  {errorStr}
                </div>
              )}

              {/* Navigation Actions */}
              <div className="pt-5 border-t border-utp-border flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(prev => Math.max(1, prev - 1))}
                  disabled={step === 1}
                  className={`px-5 py-2.5 rounded-none border text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition ${
                    step === 1 
                      ? "text-neutral-300 border-neutral-150 bg-neutral-50 cursor-not-allowed" 
                      : "text-black border-black hover:bg-neutral-50 cursor-pointer"
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Atrás
                </button>

                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (step === 1 && !career) {
                        setErrorStr("Por favor selecciona tu carrera profesional de la lista.");
                        return;
                      }
                      if (step === 2 && !experienceLevel) {
                        setErrorStr("Por favor selecciona tu nivel de experiencia laboral.");
                        return;
                      }
                      if (step === 3 && !targetRole) {
                        setErrorStr("Por favor especifica tu puesto o área de aspiración.");
                        return;
                      }
                      setErrorStr(null);
                      setStep(prev => prev + 1);
                    }}
                    className="px-6 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-neutral-900 transition flex items-center gap-1.5 cursor-pointer shadow-none rounded-none"
                  >
                    Siguiente
                    <ArrowRight className="h-3.5 w-3.5 text-[#B50E30]" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-[#B50E30] text-white text-xs font-black uppercase tracking-widest hover:bg-[#85061B] transition flex items-center gap-2 cursor-pointer shadow-none rounded-none"
                  >
                    <Sparkles className="h-3.5 w-3.5 fill-white" />
                    Generar Ruta con IA
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
