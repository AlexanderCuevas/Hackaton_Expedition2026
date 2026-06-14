import React, { useCallback, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { UserProfile, CvMeta, CvExperiencia } from "../types";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  ChevronDown,
  X,
  Plus,
  Mail,
  Phone,
  Calendar,
  Trash2,
  Sparkles,
  Loader2,
  ScrollText,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import UvpIcon from "./ui/UvpIcon";
import { Logo } from "./ui/logo";
import {
  extractTextFromPdf,
  buildHarvardCvText,
  extractProfileHintsFromCv,
} from "../utils/cvParser";
import {
  CAREER_TYPICAL_SKILLS,
  CAREER_SPECIALIZATION_TAGS,
  GENERIC_SOFT_SKILLS,
} from "../data";
import { getCvMockData } from "../cvMockData";

const MONTHS = [
  { v: "01", l: "Enero" }, { v: "02", l: "Febrero" }, { v: "03", l: "Marzo" },
  { v: "04", l: "Abril" }, { v: "05", l: "Mayo" }, { v: "06", l: "Junio" },
  { v: "07", l: "Julio" }, { v: "08", l: "Agosto" }, { v: "09", l: "Setiembre" },
  { v: "10", l: "Octubre" }, { v: "11", l: "Noviembre" }, { v: "12", l: "Diciembre" },
];
const YEARS = Array.from({ length: 21 }, (_, i) => String(2015 + i));

function MySelect({ value, onChange, label }: {
  value: string; onChange: (v: string) => void; label: string;
}) {
  const [year, month] = value ? value.split("-") : ["", ""];
  const setMonth = (m: string) => {
    if (!m) onChange("");
    else if (year) onChange(`${year}-${m}`);
    else onChange(`-${m}`);
  };
  const setYear = (y: string) => {
    if (!y) onChange("");
    else if (month) onChange(`${y}-${month}`);
    else onChange(`${y}-`);
  };
  return (
    <div className="flex gap-2">
      <select
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        className="flex-1 mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30] bg-white"
      >
        <option value="">Mes</option>
        {MONTHS.map((m) => (
          <option key={m.v} value={m.v}>{m.l}</option>
        ))}
      </select>
      <select
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="flex-1 mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30] bg-white"
      >
        <option value="">Año</option>
        {YEARS.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <span className="sr-only">{label}</span>
    </div>
  );
}

interface DiagnosticoWizardProps {
  currentProfile: UserProfile;
  onComplete: (profile: UserProfile, cvText: string, cvMeta: CvMeta) => void;
  studentCode?: string;
}

const TOTAL_STEPS = 5;

const EXPERIENCE_OPTIONS = [
  {
    id: "primer-empleo",
    title: "Mi primer empleo",
    description: "Estoy buscando mi primera oportunidad laboral. Sin experiencia previa.",
  },
  {
    id: "practicas-pre",
    title: "Prácticas pre-profesionales",
    description: "Tengo experiencia en proyectos académicos o voluntariados y busco prácticas.",
  },
  {
    id: "profesionales",
    title: "Experiencia profesional",
    description: "Ya tengo experiencia laboral formal o prácticas profesionales completadas.",
  },
];

export default function DiagnosticoWizard({
  currentProfile,
  onComplete,
  studentCode,
}: DiagnosticoWizardProps) {
  const [step, setStep] = useState(1);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const name = currentProfile.name;
  const career = currentProfile.career;
  const semester = currentProfile.semester;

  const careerSkills = CAREER_TYPICAL_SKILLS[career] ?? [];
  const specializationPool = CAREER_SPECIALIZATION_TAGS[career] ?? [];

  const [cvMode, setCvMode] = useState<"upload" | "harvard">("upload");
  const [cvFileName, setCvFileName] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvParsing, setCvParsing] = useState(false);
  const [harvardOpen, setHarvardOpen] = useState({ resumen: true, formacion: false, proyectos: false, experiencia: false });
  const [harvardForm, setHarvardForm] = useState({
    resumen: "",
    formacionCarrera: career,
    formacionCiclo: `${semester}° ciclo`,
    formacionFechaInicio: "",
    formacionFechaFin: "",
    formacionLogros: "",
  });

  const [proyectos, setProyectos] = useState([
    { id: 1, nombre: "", fechaInicio: "", fechaFin: "", descripcion: "", logros: [""] },
  ]);
  const nextProyectoId = useRef(2);

  const [completed, setCompleted] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [experiencias, setExperiencias] = useState<CvExperiencia[]>([
    { rol: "", descripcion: "", ubicacion: "", fechaInicio: "", fechaFin: "", logros: [""] },
  ]);

  const [contactEmail, setContactEmail] = useState(currentProfile.email || "");
  const [contactPhone, setContactPhone] = useState(currentProfile.phone || "");
  const [contactLinkedin, setContactLinkedin] = useState(currentProfile.linkedin || "");

  const [experienceLevel, setExperienceLevel] = useState("");

  const [specializations, setSpecializations] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState("");

  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [hardInput, setHardInput] = useState("");
  const [softInput, setSoftInput] = useState("");

  const resolveCvText = useCallback(() => {
    if (cvMode === "harvard") {
      const proyTexto = proyectos
        .filter((p) => p.nombre || p.descripcion)
        .map(
          (p) =>
            `${p.nombre}${p.fechaInicio || p.fechaFin ? ` (${p.fechaInicio || "?"} - ${p.fechaFin || "Presente"})` : ""}: ${p.descripcion}`
        )
        .join("\n\n");

      return buildHarvardCvText({
        resumen: harvardForm.resumen,
        formacion: `Universidad Tecnológica del Perú (UTP) — ${harvardForm.formacionCarrera}, ${harvardForm.formacionCiclo}${harvardForm.formacionFechaInicio || harvardForm.formacionFechaFin ? ` (${harvardForm.formacionFechaInicio || "?"} - ${harvardForm.formacionFechaFin || "Presente"})` : ""}${harvardForm.formacionLogros ? `\nLogros: ${harvardForm.formacionLogros}` : ""}`,
        proyectos: proyTexto,
        name,
        career,
      });
    }
    return cvText;
  }, [cvMode, cvText, harvardForm, name, career, proyectos]);

  const applyCvHints = useCallback(
    (text: string) => {
      const hints = extractProfileHintsFromCv(
        text,
        career,
        careerSkills,
        specializationPool,
        GENERIC_SOFT_SKILLS
      );
      setHardSkills(hints.hardSkills);
      setSoftSkills(hints.softSkills);
      setSpecializations(hints.specializations);
    },
    [career, careerSkills, specializationPool]
  );

  const loadMockCvData = useCallback((code: string) => {
    const data = getCvMockData(code);
    if (!data) return;

    setContactEmail(data.email);
    setContactPhone(data.phone);
    setContactLinkedin(data.linkedin);

    setHarvardForm((prev) => ({
      ...prev,
      resumen: data.resumen,
      formacionFechaInicio: data.formacion.fechaInicio,
      formacionFechaFin: data.formacion.fechaFin,
      formacionLogros: data.formacion.logros,
    }));

    if (data.experiencias.length > 0) {
      setExperiencias(data.experiencias);
    }

    if (data.proyectos.length > 0) {
      setProyectos(
        data.proyectos.map((p, i) => ({
          id: i + 1,
          nombre: p.nombre,
          fechaInicio: p.fechaInicio,
          fechaFin: p.fechaFin,
          descripcion: p.descripcion,
          logros: [...p.logros],
        }))
      );
    }

    setHardSkills([...data.hardSkills]);
    setSoftSkills([...data.softSkills]);
    setSpecializations([...data.specializations]);
    setExperienceLevel(data.experienceLevel);

    setCvMode("harvard");
    setCvFileName("");
    setCvText("");
    setErrorStr(null);
  }, []);

  const handleCvFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setErrorStr("Solo se aceptan archivos PDF.");
      return;
    }
    setCvParsing(true);
    setErrorStr(null);
    try {
      const text = await extractTextFromPdf(file);
      if (text.length < 20) {
        throw new Error("No se pudo extraer texto del PDF. Verifica que no sea una imagen escaneada.");
      }
      setCvText(text);
      setCvFileName(file.name);
      setCvMode("upload");
      applyCvHints(text);
    } catch (err: unknown) {
      setErrorStr(err instanceof Error ? err.message : "Error al leer el PDF.");
    } finally {
      setCvParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleCvFile(file);
  };

  const toggleTag = (list: string[], setList: (v: string[]) => void, tag: string) => {
    setList(list.includes(tag) ? list.filter((t) => t !== tag) : [...list, tag]);
  };

  const addCustomTag = (
    input: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) => {
    const trimmed = input.trim();
    if (!trimmed || list.includes(trimmed)) return;
    setList([...list, trimmed]);
    setInput("");
  };

  const removeTag = (list: string[], setList: (v: string[]) => void, tag: string) => {
    setList(list.filter((t) => t !== tag));
  };

  const validateStep = (current: number): boolean => {
    if (current === 1) {
      const text = resolveCvText();
      if (text.length < 20) {
        setErrorStr("Sube tu CV en PDF o completa la plantilla Harvard.");
        return false;
      }
      if (cvMode === "harvard") applyCvHints(text);
      return true;
    }
    if (current === 2 && !experienceLevel) {
      setErrorStr("Selecciona tu nivel de experiencia.");
      return false;
    }
    if (current === 3 && specializations.length === 0) {
      setErrorStr("Selecciona al menos un área de especialización.");
      return false;
    }
    if (current === 4 && (hardSkills.length === 0 || softSkills.length === 0)) {
      setErrorStr("Confirma al menos una habilidad técnica y una blanda.");
      return false;
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setErrorStr(null);
    setStep((s) => s + 1);
  };

  const handleFinish = () => {
    if (!validateStep(5)) return;
    if (isGenerating) return;

    setIsGenerating(true);

    const finalCvText = resolveCvText();
    const experienceLabel =
      EXPERIENCE_OPTIONS.find((o) => o.id === experienceLevel)?.title ?? experienceLevel;
    const targetRole = specializations[0] ?? currentProfile.targetRole;
    const proysTexto = proyectos
      .filter((p) => p.nombre || p.descripcion || (p.logros && p.logros.some(l => l.trim())))
      .map((p) => ({
        nombre: p.nombre,
        fechaInicio: p.fechaInicio,
        fechaFin: p.fechaFin,
        descripcion: p.descripcion,
        logros: p.logros?.filter(l => l.trim()),
      }));

    const expTexto = experiencias
      .filter((e) => e.rol)
      .map((e) => ({
        rol: e.rol,
        descripcion: e.descripcion,
        ubicacion: e.ubicacion,
        fechaInicio: e.fechaInicio,
        fechaFin: e.fechaFin,
        logros: e.logros?.filter(l => l.trim()),
      }));

    const updatedProfile: UserProfile = {
      ...currentProfile,
      experienceLevel: experienceLabel,
      targetRole,
      currentSkills: hardSkills,
      softSkills,
      interests: specializations,
      employabilityScore: currentProfile.employabilityScore || 0,
      email: contactEmail || undefined,
      phone: contactPhone || undefined,
      linkedin: contactLinkedin || undefined,
    };

    const cvMeta: CvMeta = {
      fileName: cvMode === "upload" ? cvFileName || "CV_cargado.pdf" : "CV_Plantilla_Harvard.txt",
      format: cvMode === "upload" ? "PDF" : "Plantilla Harvard",
      source: "Diagnóstico Inicial",
      status: "Pendiente de análisis",
      targetRole: specializations.join(", ") || career,
      analysisDate: new Date().toLocaleDateString("es-PE", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    // Build structured data before the delay
    const cvStructured = {
      cvResumen: harvardForm.resumen,
      formacion: {
        universidad: "Universidad Tecnológica del Perú (UTP)",
        carrera: harvardForm.formacionCarrera,
        ciclo: harvardForm.formacionCiclo,
        fechaInicio: harvardForm.formacionFechaInicio,
        fechaFin: harvardForm.formacionFechaFin,
        logros: harvardForm.formacionLogros,
      },
      experiencia: expTexto,
      proyectos: proysTexto,
      hardSkills,
      softSkills,
    };

    // Simulate generation delay
    setTimeout(() => {
      localStorage.setItem("sp_profile", JSON.stringify(updatedProfile));
      localStorage.setItem("sp_cv_text", finalCvText);
      localStorage.setItem("sp_cv_meta", JSON.stringify(cvMeta));
      localStorage.setItem("sp_cv_structured", JSON.stringify(cvStructured));
      localStorage.setItem("sp_diagnosis_completed", "true");
      setCompleted(true);
      setIsGenerating(false);
    }, 1200);
  };

  const handleContinueToAnalysis = () => {
    const finalCvText = resolveCvText();
    const updatedProfile: UserProfile = {
      ...currentProfile,
      experienceLevel,
      targetRole: specializations[0] ?? currentProfile.targetRole,
      currentSkills: hardSkills,
      softSkills,
      interests: specializations,
      employabilityScore: currentProfile.employabilityScore || 0,
      email: contactEmail || undefined,
      phone: contactPhone || undefined,
      linkedin: contactLinkedin || undefined,
    };
    const cvMeta: CvMeta = {
      fileName: cvMode === "upload" ? cvFileName || "CV_cargado.pdf" : "CV_Plantilla_Harvard.txt",
      format: cvMode === "upload" ? "PDF" : "Plantilla Harvard",
      source: "Diagnóstico Inicial",
      status: "Pendiente de análisis",
      targetRole: specializations.join(", ") || career,
      analysisDate: new Date().toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" }),
    };
    onComplete(updatedProfile, finalCvText, cvMeta);
  };

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!completed) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [completed]);

  const successModal = (
    <AnimatePresence>
      {completed && (
        <>
          <motion.div
            key="diagnosis-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] bg-black/55 backdrop-blur-lg"
            aria-hidden="true"
          />
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="diagnosis-success-title"
          >
            <motion.div
              key="diagnosis-modal"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 sm:p-8 text-center space-y-6 my-auto"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 ring-4 ring-emerald-100">
                <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>

              <div className="space-y-2">
                <h2 id="diagnosis-success-title" className="text-2xl font-black text-black">
                  ¡Diagnóstico completado!
                </h2>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Tu perfil profesional ha sido registrado y tu CV está listo para ser analizado.
                  Nuestra IA identificará oportunidades para mejorar tu empleabilidad.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="bg-neutral-50 rounded-xl p-3 text-center border border-neutral-100">
                  <p className="text-lg font-black text-black">{hardSkills.length}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Habilidades</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3 text-center border border-neutral-100">
                  <p className="text-lg font-black text-black">{specializations.length}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Áreas</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3 text-center border border-neutral-100">
                  <p className="text-lg font-black text-black">{proyectos.filter((p) => p.nombre).length}</p>
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Proyectos</p>
                </div>
              </div>

              <div className="bg-[#B50E30]/5 border border-[#B50E30]/15 rounded-xl p-3.5 text-left">
                <p className="text-xs font-bold text-black flex items-start gap-2">
                  <UvpIcon name="creatividad-innovacion" size={14} className="text-[#B50E30] shrink-0 mt-0.5" />
                  Tu CV se generará automáticamente con estos datos. Luego podrás descargarlo desde Análisis.
                </p>
              </div>

              <button
                type="button"
                onClick={handleContinueToAnalysis}
                className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#B50E30] text-white text-sm font-black rounded-xl hover:bg-[#85061B] transition shadow-lg shadow-[#B50E30]/20 cursor-pointer"
              >
                <UvpIcon name="test-evaluaciones" size={16} className="text-white" />
                Continuar al Análisis
              </button>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
    <div className={`min-h-screen bg-gray-50 flex flex-col relative ${completed ? "h-screen overflow-hidden" : ""}`}>
      <div className={completed ? "blur-md brightness-[0.97] pointer-events-none select-none" : ""}>
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <Logo />
          <div className="flex-1 w-full sm:max-w-xs sm:mx-4 order-3 sm:order-none">
            <div className="flex items-center gap-1">
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
                <div
                  key={n}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    step >= n ? (step === n ? "bg-[#B50E30]" : "bg-black") : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-[10px] text-neutral-400 font-semibold text-center mt-1 uppercase tracking-wider flex items-center justify-center gap-1">
              <UvpIcon name={["plantillas-cv","desarrollo-competencias","metas-profesionales","habilidades-blandas","test-evaluaciones"][step-1]} size={12} className="text-neutral-400" />
              Paso {step} de {TOTAL_STEPS}
            </p>
          </div>
          <span className="text-xs font-semibold text-neutral-600 bg-gray-100 px-3 py-1.5 rounded-full self-start sm:self-auto shrink-0">
            Hola, {name.split(" ")[0]}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-8 md:p-10 space-y-6"
            >
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="heading-lg text-black flex items-center gap-2.5">
                      <ScrollText className="h-6 w-6 text-[#B50E30] shrink-0" />
                      Tu currículum vitae
                    </h2>
                    <p className="text-[15px] text-neutral-500 mt-1.5 leading-relaxed">
                      Si ya tienes un CV actualizado, súbelo. Si es tu primera vez, completa la plantilla Harvard.
                    </p>
                  </div>

                  {cvMode === "upload" && (
                    <>
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-200 hover:border-[#B50E30] rounded-2xl p-12 text-center cursor-pointer transition bg-gray-50"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCvFile(file);
                          }}
                        />
                        {cvParsing ? (
                          <p className="text-sm text-neutral-500">Leyendo PDF...</p>
                        ) : cvFileName ? (
                          <div className="space-y-2">
                            <UvpIcon name="plantillas-cv" size={40} className="text-[#B50E30] mx-auto" />
                            <p className="font-bold text-black">{cvFileName}</p>
                            <p className="text-xs text-neutral-400">Clic para reemplazar</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-10 w-10 text-neutral-300 mx-auto" />
                            <p className="font-bold text-black">Sube tu CV actual en PDF</p>
                            <p className="text-xs text-neutral-400">Arrastra y suelta o haz clic</p>
                          </div>
                        )}
                      </div>

                      {studentCode && getCvMockData(studentCode) && (
                        <button
                          type="button"
                          onClick={() => loadMockCvData(studentCode)}
                          className="w-full py-3.5 bg-gradient-to-r from-[#B50E30] to-[#85061B] text-white text-sm font-bold rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2"
                        >
                          <Sparkles className="h-5 w-5" />
                          Extraer datos con IA
                        </button>
                      )}

                      {/* Contacto — visible en ambos modos, aquí en upload */}
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                        <h3 className="text-base font-black text-black flex items-center gap-2">
                          <Mail className="h-5 w-5 text-[#B50E30]" />
                          Información de contacto
                        </h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Tus datos de contacto. El correo se completa automáticamente con tu código UTP.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email *</label>
                            <input
                              type="email"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="ejemplo@utp.edu.pe"
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                              <Phone className="h-3 w-3 text-neutral-400" />
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              placeholder="+51 999 888 777"
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                              LinkedIn <span className="text-neutral-300 font-normal">(opcional)</span>
                            </label>
                            <input
                              type="url"
                              value={contactLinkedin}
                              onChange={(e) => setContactLinkedin(e.target.value)}
                              placeholder="linkedin.com/in/tuperfil"
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-neutral-400">O si es tu primera vez buscando empleo...</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>

                      <button
                        type="button"
                        onClick={() => setCvMode("harvard")}
                        className="w-full py-3.5 bg-[#B50E30] text-white text-sm font-bold rounded-xl hover:bg-[#85061B] transition"
                      >
                        Crear mi primer CV (Formato Harvard)
                      </button>
                    </>
                  )}

                  {cvMode === "harvard" && (
                    <div className="space-y-4">
                      <button
                        type="button"
                        onClick={() => setCvMode("upload")}
                        className="text-xs font-bold text-[#B50E30] hover:underline"
                      >
                        ← Volver a subir PDF
                      </button>

                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                        <h3 className="text-base font-black text-black flex items-center gap-2">
                          <Mail className="h-5 w-5 text-[#B50E30]" />
                          Información de contacto
                        </h3>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Tus datos de contacto. El correo se completa automáticamente con tu código UTP.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Email *</label>
                            <input
                              type="email"
                              value={contactEmail}
                              onChange={(e) => setContactEmail(e.target.value)}
                              placeholder="ejemplo@utp.edu.pe"
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                              <Phone className="h-3 w-3 text-neutral-400" />
                              Teléfono
                            </label>
                            <input
                              type="tel"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                              placeholder="+51 999 888 777"
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                              LinkedIn <span className="text-neutral-300 font-normal">(opcional)</span>
                            </label>
                            <input
                              type="url"
                              value={contactLinkedin}
                              onChange={(e) => setContactLinkedin(e.target.value)}
                              placeholder="linkedin.com/in/tuperfil"
                              className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setHarvardOpen((p) => ({ ...p, resumen: !p.resumen }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 text-left"
                        >
                          <span className="text-base font-black text-black flex items-center gap-2.5">
                            <UvpIcon name="orientacion-profesional" size={18} className="text-[#B50E30]" />
                            Resumen Profesional
                          </span>
                          <motion.span animate={{ rotate: harvardOpen.resumen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {harvardOpen.resumen && (
                            <motion.div
                              key="resumen-content"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <div className="p-3 border-t border-gray-200 space-y-2">
                            <div className="text-[11px] text-neutral-500 font-medium space-y-1">
                              <p>Escribe 3-4 líneas que resuman <strong>quién eres, qué buscas y qué ofreces</strong>. Esto será lo primero que lea un reclutador.</p>
                              <ul className="list-disc pl-4 text-[10.5px]">
                                <li>Tu carrera, ciclo y universidad</li>
                                <li>Tu área de interés o puesto deseado</li>
                                <li>Tu principal fortaleza o diferenciador</li>
                                <li>Qué tipo de oportunidad buscas (prácticas, empleo, etc.)</li>
                              </ul>
                              <p className="text-[#B50E30] font-bold">Ej: "Estudiante de Ingeniería de Sistemas, 7mo ciclo, apasionado por el desarrollo backend con Java y Spring Boot. Busco integrarme a un equipo ágil donde pueda aportar mis conocimientos en bases de datos y APIs REST mientras desarrollo habilidades profesionales en un entorno real."</p>
                            </div>
                            <textarea
                              value={harvardForm.resumen}
                              onChange={(e) => setHarvardForm((p) => ({ ...p, resumen: e.target.value }))}
                              placeholder="Estudiante de ... con interés en ... Apasionado por ..."
                              rows={4}
                              className="w-full px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30]"
                            />
                          </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setHarvardOpen((p) => ({ ...p, formacion: !p.formacion }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 text-left"
                        >
                          <span className="text-base font-black text-black flex items-center gap-2.5">
                            <UvpIcon name="capacitacion-talleres" size={18} className="text-[#B50E30]" />
                            Formación Académica
                          </span>
                          <motion.span animate={{ rotate: harvardOpen.formacion ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {harvardOpen.formacion && (
                            <motion.div
                              key="formacion-content"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <div className="p-3 border-t border-gray-200 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Universidad</label>
                                <input
                                  type="text"
                                  value="Universidad Tecnológica del Perú (UTP)"
                                  disabled
                                  className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-neutral-500 outline-none cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Carrera</label>
                                <input
                                  type="text"
                                  value={harvardForm.formacionCarrera}
                                  disabled
                                  className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-neutral-500 outline-none cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Ciclo</label>
                                <input
                                  type="text"
                                  value={harvardForm.formacionCiclo}
                                  disabled
                                  className="w-full mt-1 px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-neutral-500 outline-none cursor-not-allowed"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mes y año de inicio</label>
                                <MySelect
                                  value={harvardForm.formacionFechaInicio}
                                  onChange={(v) => setHarvardForm((p) => ({ ...p, formacionFechaInicio: v }))}
                                  label="formación inicio"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mes y año de fin</label>
                                <MySelect
                                  value={harvardForm.formacionFechaFin}
                                  onChange={(v) => setHarvardForm((p) => ({ ...p, formacionFechaFin: v }))}
                                  label="formación fin"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Logros / detalles adicionales</label>
                              <textarea
                                value={harvardForm.formacionLogros}
                                onChange={(e) => setHarvardForm((p) => ({ ...p, formacionLogros: e.target.value }))}
                                placeholder="Menciona logros académicos, cursos destacados, premios, etc."
                                rows={3}
                                className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30]"
                              />
                            </div>
                          </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setHarvardOpen((p) => ({ ...p, experiencia: !p.experiencia }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 text-left"
                        >
                          <span className="text-base font-black text-black flex items-center gap-2.5">
                            <UvpIcon name="bolsa-trabajo" size={18} className="text-[#B50E30]" />
                            Experiencia Profesional
                          </span>
                          <motion.span animate={{ rotate: harvardOpen.experiencia ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {harvardOpen.experiencia && (
                            <motion.div
                              key="experiencia-content"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <div className="p-3 border-t border-gray-200 space-y-4">
                            <p className="text-[11px] text-neutral-500 font-medium">
                              Agrega hasta 2 experiencias: prácticas, trabajos, voluntariados o proyectos relevantes.
                            </p>
                            {experiencias.map((exp, idx) => (
                              <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-black flex items-center gap-2">
                                    <UvpIcon name="bolsa-trabajo" size={14} className="text-[#B50E30]" />
                                    Experiencia #{idx + 1}
                                  </span>
                                  {experiencias.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setExperiencias((p) => p.filter((_, i) => i !== idx))}
                                      className="text-[#B50E30] hover:text-[#85061B] transition cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Rol / Puesto</label>
                                    <input
                                      type="text"
                                      value={exp.rol}
                                      onChange={(e) => {
                                        const updated = [...experiencias];
                                        updated[idx] = { ...updated[idx], rol: e.target.value };
                                        setExperiencias(updated);
                                      }}
                                      placeholder="Ej. Desarrollador Backend"
                                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Empresa / Contexto</label>
                                    <input
                                      type="text"
                                      value={exp.descripcion}
                                      onChange={(e) => {
                                        const updated = [...experiencias];
                                        updated[idx] = { ...updated[idx], descripcion: e.target.value };
                                        setExperiencias(updated);
                                      }}
                                      placeholder="Ej. Proyectos académicos y personales"
                                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Ubicación</label>
                                    <input
                                      type="text"
                                      value={exp.ubicacion}
                                      onChange={(e) => {
                                        const updated = [...experiencias];
                                        updated[idx] = { ...updated[idx], ubicacion: e.target.value };
                                        setExperiencias(updated);
                                      }}
                                      placeholder="Ej. Chimbote, Perú"
                                      className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div>
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Inicio</label>
                                      <MySelect
                                        value={exp.fechaInicio}
                                        onChange={(v) => {
                                          const updated = [...experiencias];
                                          updated[idx] = { ...updated[idx], fechaInicio: v };
                                          setExperiencias(updated);
                                        }}
                                        label="exp inicio"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Fin</label>
                                      <MySelect
                                        value={exp.fechaFin}
                                        onChange={(v) => {
                                          const updated = [...experiencias];
                                          updated[idx] = { ...updated[idx], fechaFin: v };
                                          setExperiencias(updated);
                                        }}
                                        label="exp fin"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                                    <UvpIcon name="logros-inspiran" size={12} className="text-[#B50E30]" />
                                    Logros y responsabilidades (uno por línea)
                                  </label>
                                  <textarea
                                    value={exp.logros?.join("\n") || ""}
                                    onChange={(e) => {
                                      const lines = e.target.value.split("\n");
                                      const updated = [...experiencias];
                                      updated[idx] = { ...updated[idx], logros: lines };
                                      setExperiencias(updated);
                                    }}
                                    placeholder={"• Desarrollo de APIs RESTful con Spring Boot\n• Configuración de Docker y Linux para despliegue\n• Implementación de autenticación JWT"}
                                    rows={3}
                                    className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30] font-mono"
                                  />
                                </div>
                              </div>
                            ))}
                            {experiencias.length < 2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setExperiencias((p) => [
                                    ...p,
                                    { rol: "", descripcion: "", ubicacion: "", fechaInicio: "", fechaFin: "", logros: [""] },
                                  ])
                                }
                                className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 text-sm font-bold rounded-xl hover:border-[#B50E30] hover:text-[#B50E30] transition cursor-pointer"
                              >
                                <Plus className="h-4 w-4 inline mr-1" />
                                Agregar otra experiencia
                              </button>
                            )}
                          </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Proyectos Destacados */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setHarvardOpen((p) => ({ ...p, proyectos: !p.proyectos }))}
                          className="w-full flex items-center justify-between px-4 py-3.5 bg-gray-50 text-left"
                        >
                          <span className="text-base font-black text-black flex items-center gap-2.5">
                            <UvpIcon name="creatividad-innovacion" size={18} className="text-[#B50E30]" />
                            Proyectos Destacados
                          </span>
                          <motion.span animate={{ rotate: harvardOpen.proyectos ? 180 : 0 }} transition={{ duration: 0.2 }}>
                            <ChevronDown className="h-4 w-4" />
                          </motion.span>
                        </button>
                        <AnimatePresence initial={false}>
                          {harvardOpen.proyectos && (
                            <motion.div
                              key="proyectos-content"
                              initial={{ opacity: 0, y: -6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -6 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                            <div className="p-3 border-t border-gray-200 space-y-4">
                            <p className="text-[11px] text-neutral-500 font-medium">
                              Agrega hasta 3 proyectos académicos, personales o voluntariados.
                            </p>
                            {proyectos.map((proy, idx) => (
                              <div key={proy.id} className="p-3 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-black flex items-center gap-2">
                                    <UvpIcon name="creatividad-innovacion" size={14} className="text-[#B50E30]" />
                                    Proyecto #{idx + 1}
                                  </span>
                                  {proyectos.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => setProyectos((p) => p.filter((_, i) => i !== idx))}
                                      className="text-[#B50E30] hover:text-[#85061B] transition cursor-pointer"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Nombre del proyecto</label>
                                  <input
                                    type="text"
                                    value={proy.nombre}
                                    onChange={(e) => {
                                      const updated = [...proyectos];
                                      updated[idx] = { ...updated[idx], nombre: e.target.value };
                                      setProyectos(updated);
                                    }}
                                    placeholder="Ej. Dashboard de Ventas con Power BI"
                                    className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#B50E30]"
                                  />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mes y año inicio</label>
                                    <MySelect
                                      value={proy.fechaInicio}
                                      onChange={(v) => {
                                        const updated = [...proyectos];
                                        updated[idx] = { ...updated[idx], fechaInicio: v };
                                        setProyectos(updated);
                                      }}
                                      label="proyecto inicio"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Mes y año fin</label>
                                    <MySelect
                                      value={proy.fechaFin}
                                      onChange={(v) => {
                                        const updated = [...proyectos];
                                        updated[idx] = { ...updated[idx], fechaFin: v };
                                        setProyectos(updated);
                                      }}
                                      label="proyecto fin"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Contexto (opcional)</label>
                                  <textarea
                                    value={proy.descripcion}
                                    onChange={(e) => {
                                      const updated = [...proyectos];
                                      updated[idx] = { ...updated[idx], descripcion: e.target.value };
                                      setProyectos(updated);
                                    }}
                                    placeholder="Ej. Proyecto académico del curso de Desarrollo Web"
                                    rows={2}
                                    className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Logros / aportes (uno por línea)</label>
                                  <textarea
                                    value={proy.logros?.join("\n") || ""}
                                    onChange={(e) => {
                                      const lines = e.target.value.split("\n");
                                      const updated = [...proyectos];
                                      updated[idx] = { ...updated[idx], logros: lines };
                                      setProyectos(updated);
                                    }}
                                    placeholder={"• Diseñé e implementé APIs REST con Spring Boot\n• Configuré base de datos PostgreSQL con Flyway"}
                                    rows={3}
                                    className="w-full mt-1 px-3 py-2.5 text-sm outline-none resize-none border border-gray-200 rounded-lg focus:border-[#B50E30] font-mono"
                                  />
                                </div>
                              </div>
                            ))}
                            {proyectos.length < 3 && (
                              <button
                                type="button"
                                  onClick={() =>
                                    setProyectos((p) => [
                                      ...p,
                                      { id: nextProyectoId.current++, nombre: "", fechaInicio: "", fechaFin: "", descripcion: "", logros: [""] },
                                    ])
                                  }
                                className="w-full py-2.5 border-2 border-dashed border-gray-300 text-gray-500 text-sm font-bold rounded-xl hover:border-[#B50E30] hover:text-[#B50E30] transition cursor-pointer"
                              >
                                <Plus className="h-4 w-4 inline mr-1" />
                                Agregar otro proyecto
                              </button>
                            )}
                          </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* PASO 2: Experiencia */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="heading-lg text-black flex items-center gap-2">
                      <UvpIcon name="desarrollo-competencias" size={20} className="text-[#B50E30]" />
                      Nivel de experiencia
                    </h2>
                    <p className="text-[15px] text-neutral-500 mt-1.5 leading-relaxed">
                      Considerando que estás en el{" "}
                      <strong className="text-black">{semester}° ciclo</strong> de{" "}
                      <strong className="text-black">{career}</strong>, ¿cuál es tu nivel de experiencia práctica?
                    </p>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="h-10 w-10 bg-black text-white flex items-center justify-center rounded-xl text-sm font-black">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-black text-sm">{name}</p>
                      <p className="text-xs text-neutral-500">
                        {career} · {semester}° Ciclo
                      </p>
                    </div>
                  </div>

                  <motion.div
                    className="space-y-3"
                    variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
                    initial="hidden"
                    animate="visible"
                  >
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.id}
                        type="button"
                        onClick={() => setExperienceLevel(opt.id)}
                        variants={{
                          hidden: { opacity: 0, x: -24 },
                          visible: { opacity: 1, x: 0 },
                        }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={`w-full p-4 rounded-xl border-2 text-left transition ${
                          experienceLevel === opt.id
                            ? "border-[#B50E30] bg-[#B50E30]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-black">{opt.title}</span>
                          {experienceLevel === opt.id && (
                            <motion.span
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            >
                              <Check className="h-5 w-5 text-[#B50E30]" />
                            </motion.span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">{opt.description}</p>
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* PASO 3: Especialización */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="heading-lg text-black flex items-center gap-2">
                      <UvpIcon name="metas-profesionales" size={20} className="text-[#B50E30]" />
                      Áreas de especialización
                    </h2>
                    <p className="text-[15px] text-neutral-500 mt-1.5 leading-relaxed">
                      ¿En qué áreas de <strong className="text-black">{career}</strong> te gustaría especializarte?
                      Selecciona varias o escribe una nueva.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      value={specInput}
                      onChange={(e) => setSpecInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomTag(specInput, setSpecInput, specializations, setSpecializations);
                        }
                      }}
                      placeholder="Escribe y presiona Enter..."
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#B50E30]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        addCustomTag(specInput, setSpecInput, specializations, setSpecializations)
                      }
                      className="px-4 py-2.5 bg-black text-white rounded-xl"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  {specializations.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {specializations.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#B50E30] text-white text-xs font-bold rounded-full"
                        >
                          {s}
                          <button type="button" onClick={() => removeTag(specializations, setSpecializations, s)}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {specializationPool.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(specializations, setSpecializations, tag)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full border transition ${
                          specializations.includes(tag)
                            ? "bg-black text-white border-black"
                            : "bg-white text-black border-gray-200 hover:border-black"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PASO 4: Habilidades */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="heading-lg text-black flex items-center gap-2">
                      <UvpIcon name="habilidades-blandas" size={20} className="text-[#B50E30]" />
                      Revisa tus habilidades
                    </h2>
                    <p className="text-[15px] text-neutral-500 mt-1.5 leading-relaxed">
                      Extraídas de tu CV. Ajústalas a tu realidad: quita, añade o confirma.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Técnicas */}
                    <div className="space-y-3 p-4 border border-gray-200 rounded-xl">
                      <h3 className="text-base font-black flex items-center gap-2">
                        <UvpIcon name="habilidades-tecnicas" size={16} className="text-[#B50E30]" />
                        Habilidades técnicas
                      </h3>
                      <div className="flex flex-wrap gap-1.5 min-h-[60px]">
                        {hardSkills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs font-semibold rounded-lg"
                          >
                            {s}
                            <button type="button" onClick={() => removeTag(hardSkills, setHardSkills, s)}>
                              <X className="h-3 w-3 text-neutral-400" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <input
                          value={hardInput}
                          onChange={(e) => setHardInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomTag(hardInput, setHardInput, hardSkills, setHardSkills);
                            }
                          }}
                          placeholder="Añadir habilidad..."
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomTag(hardInput, setHardInput, hardSkills, setHardSkills)}
                          className="px-2 bg-black text-white rounded-lg text-xs"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {careerSkills
                          .filter((s) => !hardSkills.includes(s))
                          .slice(0, 6)
                          .map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setHardSkills([...hardSkills, s])}
                              className="px-2 py-0.5 text-[10px] border border-gray-200 rounded hover:border-black"
                            >
                              + {s}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Blandas */}
                    <div className="space-y-3 p-4 border border-gray-200 rounded-xl">
                      <h3 className="text-sm font-black flex items-center gap-2">
                        <UvpIcon name="habilidades-blandas" size={16} className="text-[#B50E30]" />
                        Habilidades blandas
                      </h3>
                      <div className="flex flex-wrap gap-1.5 min-h-[60px]">
                        {softSkills.map((s) => (
                          <span
                            key={s}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-xs font-semibold rounded-lg"
                          >
                            {s}
                            <button type="button" onClick={() => removeTag(softSkills, setSoftSkills, s)}>
                              <X className="h-3 w-3 text-neutral-400" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <input
                          value={softInput}
                          onChange={(e) => setSoftInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addCustomTag(softInput, setSoftInput, softSkills, setSoftSkills);
                            }
                          }}
                          placeholder="Añadir habilidad..."
                          className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => addCustomTag(softInput, setSoftInput, softSkills, setSoftSkills)}
                          className="px-2 bg-black text-white rounded-lg text-xs"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {GENERIC_SOFT_SKILLS.filter((s) => !softSkills.includes(s))
                          .slice(0, 5)
                          .map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSoftSkills([...softSkills, s])}
                              className="px-2 py-0.5 text-[10px] border border-gray-200 rounded hover:border-black"
                            >
                              + {s}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 5: Resumen y finalizar */}
              {step === 5 && !completed && (
                <div className="space-y-5">
                  <div>
                    <h2 className="heading-lg text-black flex items-center gap-2">
                      <UvpIcon name="test-evaluaciones" size={20} className="text-[#B50E30]" />
                      Resume tu perfil
                    </h2>
                    <p className="text-[15px] text-neutral-500 mt-1.5 leading-relaxed">
                      Revisa que todo esté correcto antes de continuar. Luego generarás tu CV y pasarás al análisis ATS.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Tarjeta de datos personales */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <UvpIcon name="perfil" size={14} className="text-[#B50E30]" />
                        Datos personales
                      </p>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 bg-black text-white flex items-center justify-center rounded-xl text-sm font-black">
                          {name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-black text-sm">{name}</p>
                          <p className="text-xs text-neutral-500">{career} · {semester}° Ciclo</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {contactEmail && <div><span className="font-bold text-neutral-400">Email:</span> <span className="text-black">{contactEmail}</span></div>}
                        {contactPhone && <div><span className="font-bold text-neutral-400">Tel:</span> <span className="text-black">{contactPhone}</span></div>}
                        {contactLinkedin && <div className="col-span-2"><span className="font-bold text-neutral-400">LinkedIn:</span> <span className="text-black">{contactLinkedin}</span></div>}
                      </div>
                    </div>

                    {/* Experiencia */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                          <UvpIcon name="desarrollo-competencias" size={14} className="text-[#B50E30]" />
                          Nivel de experiencia
                        </p>
                        <p className="text-[15px] font-bold text-black mt-1">
                          {EXPERIENCE_OPTIONS.find((o) => o.id === experienceLevel)?.title ?? experienceLevel}
                        </p>
                      </div>
                      <Check className="h-5 w-5 text-[#B50E30]" />
                    </div>

                    {/* Experiencia Profesional estructurada */}
                    {experiencias.some(e => e.rol) && (
                      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
                          <UvpIcon name="bolsa-trabajo" size={14} className="text-[#B50E30]" />
                          Experiencia Profesional
                        </p>
                        {experiencias.filter(e => e.rol).map((exp, i) => (
                          <div key={i} className="text-xs text-black">
                            <p className="font-bold">{exp.rol}{exp.descripcion ? ` — ${exp.descripcion}` : ""}</p>
                            {exp.ubicacion && <p className="text-neutral-500">{exp.ubicacion}</p>}
                            {(exp.fechaInicio || exp.fechaFin) && <p className="text-neutral-400 text-[10px]">{exp.fechaInicio || "?"} - {exp.fechaFin || "Actualidad"}</p>}
                            {exp.logros && exp.logros.some(l => l.trim()) && (
                              <ul className="list-disc pl-4 mt-1 text-[10px] text-neutral-600">
                                {exp.logros.filter(l => l.trim()).slice(0, 2).map((l, j) => <li key={j}>{l}</li>)}
                                {exp.logros.filter(l => l.trim()).length > 2 && <li className="text-[#B50E30] font-bold">+{exp.logros.filter(l => l.trim()).length - 2} más</li>}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Especializaciones */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <UvpIcon name="metas-profesionales" size={14} className="text-[#B50E30]" />
                        Áreas de especialización
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {specializations.map((s) => (
                          <span key={s} className="px-2.5 py-1 bg-[#B50E30] text-white text-xs font-bold rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>

                    {/* Habilidades */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <UvpIcon name="habilidades-tecnicas" size={14} className="text-[#B50E30]" />
                        Habilidades
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {hardSkills.map((s) => (
                          <span key={s} className="px-2.5 py-1 bg-black text-white text-xs font-bold rounded-full">{s}</span>
                        ))}
                        {softSkills.map((s) => (
                          <span key={s} className="px-2.5 py-1 bg-neutral-400 text-white text-xs font-bold rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#B50E30]/5 border border-[#B50E30]/10 rounded-xl p-4 text-sm">
                    <p className="font-bold text-black">
                      <UvpIcon name="creatividad-innovacion" size={16} className="text-[#B50E30] inline mr-1" />
                      Tu CV se generará automáticamente con estos datos.
                    </p>
                    <p className="text-neutral-600 text-xs mt-1">
                      Luego podrás descargarlo desde la sección Análisis.
                    </p>
                  </div>
                </div>
              )}

              {!completed && (
                <>
              {errorStr && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl">{errorStr}</div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setErrorStr(null);
                    setStep((s) => Math.max(1, s - 1));
                  }}
                  disabled={step === 1}
                  className="flex items-center gap-1.5 text-sm font-bold text-neutral-400 disabled:opacity-30 hover:text-black transition"
                >
                  <UvpIcon name="informacion" size={16} className="text-neutral-400" />
                  Atrás
                </button>

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition"
                  >
                    Siguiente
                    <UvpIcon name="buscar" size={16} className="text-white" />
                  </button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleFinish}
                    disabled={isGenerating}
                    whileTap={isGenerating ? {} : { scale: 0.97 }}
                    className={`flex items-center gap-2 px-6 py-3 text-sm font-black rounded-xl transition ${
                      isGenerating
                        ? "bg-[#B50E30]/70 text-white/80 cursor-not-allowed"
                        : "bg-[#B50E30] text-white hover:bg-[#85061B]"
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generando CV...
                      </>
                    ) : (
                      <>
                        <UvpIcon name="crecimiento-personal" size={16} className="text-white" />
                        Generar CV y continuar
                        <UvpIcon name="buscar" size={16} className="text-white" />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
              </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      </div>
    </div>

    {portalReady && createPortal(successModal, document.body)}
    </>
  );
}
