import React, { useCallback, useRef, useState } from "react";
import { UserProfile, CvMeta } from "../types";
import {
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  ChevronDown,
  X,
  Plus,
  Target,
  Brain,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
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

interface DiagnosticoWizardProps {
  currentProfile: UserProfile;
  onComplete: (profile: UserProfile, cvText: string, cvMeta: CvMeta) => void;
}

const TOTAL_STEPS = 4;

const EXPERIENCE_OPTIONS = [
  {
    id: "basico",
    title: "Básico",
    description: "Busco mis primeras prácticas pre-profesionales. Cero experiencia formal.",
  },
  {
    id: "intermedio",
    title: "Intermedio",
    description: "Tengo experiencia en proyectos académicos aplicados o voluntariados.",
  },
  {
    id: "avanzado",
    title: "Avanzado",
    description: "Ya he realizado prácticas o trabajo actualmente.",
  },
];

export default function DiagnosticoWizard({
  currentProfile,
  onComplete,
}: DiagnosticoWizardProps) {
  const [step, setStep] = useState(1);
  const [errorStr, setErrorStr] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const name = currentProfile.name;
  const career = currentProfile.career;
  const semester = currentProfile.semester;

  const careerSkills = CAREER_TYPICAL_SKILLS[career] ?? [];
  const specializationPool = CAREER_SPECIALIZATION_TAGS[career] ?? [];

  // Paso 1 — CV
  const [cvMode, setCvMode] = useState<"upload" | "harvard">("upload");
  const [cvFileName, setCvFileName] = useState("");
  const [cvText, setCvText] = useState("");
  const [cvParsing, setCvParsing] = useState(false);
  const [harvardOpen, setHarvardOpen] = useState({ resumen: true, formacion: false, proyectos: false });
  const [harvardForm, setHarvardForm] = useState({ resumen: "", formacion: "", proyectos: "" });

  // Paso 2 — Experiencia
  const [experienceLevel, setExperienceLevel] = useState("");

  // Paso 3 — Especialización (multi-select)
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [specInput, setSpecInput] = useState("");

  // Paso 4 — Habilidades
  const [hardSkills, setHardSkills] = useState<string[]>([]);
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [hardInput, setHardInput] = useState("");
  const [softInput, setSoftInput] = useState("");

  const resolveCvText = useCallback(() => {
    if (cvMode === "harvard") {
      return buildHarvardCvText({
        ...harvardForm,
        name,
        career,
      });
    }
    return cvText;
  }, [cvMode, cvText, harvardForm, name, career]);

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
    if (!validateStep(4)) return;
    const finalCvText = resolveCvText();
    const experienceLabel =
      EXPERIENCE_OPTIONS.find((o) => o.id === experienceLevel)?.title ?? experienceLevel;

    const updatedProfile: UserProfile = {
      ...currentProfile,
      experienceLevel: experienceLabel,
      targetRole: specializations[0] ?? currentProfile.targetRole,
      currentSkills: hardSkills,
      softSkills,
      interests: specializations,
      employabilityScore: currentProfile.employabilityScore || 0,
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

    onComplete(updatedProfile, finalCvText, cvMeta);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header fijo */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="font-black text-sm tracking-tight">
            <span className="text-black">SkillPath </span>
            <span className="text-[#B50E30]">AI</span>
          </div>
          <div className="flex-1 max-w-xs mx-4">
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
            <p className="text-[10px] text-neutral-400 font-semibold text-center mt-1 uppercase tracking-wider">
              Paso {step} de {TOTAL_STEPS}
            </p>
          </div>
          <span className="text-xs font-semibold text-neutral-600 bg-gray-100 px-3 py-1.5 rounded-full">
            Hola, {name.split(" ")[0]}
          </span>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6"
            >
              {/* PASO 1: CV */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="heading-lg text-black">Tu currículum vitae</h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      Sube tu CV en PDF. Si es tu primera búsqueda de empleo, usa la plantilla Harvard.
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
                            <FileText className="h-10 w-10 text-[#B50E30] mx-auto" />
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
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setCvMode("upload")}
                        className="text-xs font-bold text-[#B50E30] hover:underline"
                      >
                        ← Volver a subir PDF
                      </button>
                      {(
                        [
                          { key: "resumen", label: "Resumen Profesional", ph: "Describe tu perfil y objetivo..." },
                          { key: "formacion", label: "Formación Académica", ph: "Universidad, carrera, ciclo, logros..." },
                          { key: "proyectos", label: "Proyectos Destacados", ph: "Proyectos, prácticas o voluntariados..." },
                        ] as const
                      ).map(({ key, label, ph }) => (
                        <div key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setHarvardOpen((p) => ({ ...p, [key]: !p[key] }))}
                            className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left"
                          >
                            <span className="text-sm font-bold text-black">{label}</span>
                            <ChevronDown className={`h-4 w-4 transition ${harvardOpen[key] ? "rotate-180" : ""}`} />
                          </button>
                          {harvardOpen[key] && (
                            <textarea
                              value={harvardForm[key]}
                              onChange={(e) =>
                                setHarvardForm((p) => ({ ...p, [key]: e.target.value }))
                              }
                              placeholder={ph}
                              rows={4}
                              className="w-full px-4 py-3 text-sm outline-none resize-none border-t border-gray-200"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PASO 2: Experiencia */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="heading-lg text-black">Nivel de experiencia</h2>
                    <p className="text-sm text-neutral-500 mt-1">
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

                  <div className="space-y-3">
                    {EXPERIENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setExperienceLevel(opt.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition ${
                          experienceLevel === opt.id
                            ? "border-[#B50E30] bg-[#B50E30]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-black text-black">{opt.title}</span>
                          {experienceLevel === opt.id && (
                            <Check className="h-5 w-5 text-[#B50E30]" />
                          )}
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">{opt.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* PASO 3: Especialización */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="heading-lg text-black flex items-center gap-2">
                      <Target className="h-5 w-5 text-[#B50E30]" />
                      Áreas de especialización
                    </h2>
                    <p className="text-sm text-neutral-500 mt-1">
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
                    <h2 className="heading-lg text-black">Revisa tus habilidades</h2>
                    <p className="text-sm text-neutral-500 mt-1">
                      Extraídas de tu CV. Ajústalas a tu realidad: quita, añade o confirma.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Técnicas */}
                    <div className="space-y-3 p-4 border border-gray-200 rounded-xl">
                      <h3 className="text-sm font-black flex items-center gap-2">
                        <Brain className="h-4 w-4 text-[#B50E30]" />
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
                        <Users className="h-4 w-4 text-[#B50E30]" />
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
                  <ArrowLeft className="h-4 w-4" />
                  Atrás
                </button>

                {step < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-sm font-bold rounded-xl hover:bg-neutral-800 transition"
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="flex items-center gap-2 px-6 py-3 bg-[#B50E30] text-white text-sm font-black rounded-xl hover:bg-[#85061B] transition"
                  >
                    <Sparkles className="h-4 w-4 fill-white" />
                    Continuar al Análisis
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
