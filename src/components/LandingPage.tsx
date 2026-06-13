import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, Shield, GraduationCap, Briefcase, FileText, ChevronRight, TrendingUp, X } from "lucide-react";
import { UserProfile } from "../types";

interface LandingPageProps {
  onStart: (profileData?: Partial<UserProfile>) => void;
  currentProfileName: string;
}

export default function LandingPage({ onStart, currentProfileName }: LandingPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState(currentProfileName || "");
  const [career, setCareer] = useState("Ingeniería de Sistemas");
  const [semester, setSemester] = useState<number>(7);
  const [targetRole, setTargetRole] = useState("Junior Client Side Web Engineer");
  const [email, setEmail] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    setTimeout(() => {
      onStart({
        name: name.trim() || "Estudiante UTP",
        career,
        semester,
        targetRole: targetRole || "Junior Full Stack Developer",
        employabilityScore: 68,
        xp: 320,
        level: 2,
        progressToNextLevel: 60
      });
      setIsSubmitted(false);
      setIsModalOpen(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col justify-between selection:bg-[#B50E30]/20 selection:text-[#B50E30]">

      <header className="bg-white border-b border-neutral-100 px-6 py-4 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8.5 w-8.5 bg-[#B50E30] flex items-center justify-center text-white rounded">
              <Sparkles className="h-4.5 w-4.5 text-white fill-white" />
            </div>
            <span className="text-black font-black text-xl tracking-tight uppercase">
              SkillPath <span className="text-[#B50E30]">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-black text-xs font-bold uppercase tracking-wider hover:text-[#B50E30] transition duration-200 cursor-pointer hidden sm:inline-block px-3 py-1.5"
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#B50E30] text-white text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-md hover:bg-[#85061B] transition duration-200 shadow-sm inline-block cursor-pointer border-0"
            >
              Regístrate
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">

        <section className="relative pt-12 pb-20 md:py-24 px-6 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-[#B50E30]/5 via-transparent to-transparent rounded-full -mr-48 -mt-24 pointer-events-none blur-3xl" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-[#B50E30]/10 border border-[#B50E30]/20 px-3 py-1 text-[10px] font-black text-[#B50E30] uppercase tracking-widest rounded-full">
                <Shield className="h-3.5 w-3.5 fill-[#B50E30]/10 text-[#B50E30]" />
                Validado por el Decanato de Ingeniería
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#000000] tracking-tight leading-[1.1] uppercase">
                Transforma tu perfil universitario en un candidato <span className="text-[#B50E30] underline decoration-[#B50E30]/30 decoration-wavy">altamente competitivo.</span>
              </h1>

              <p className="text-neutral-750 text-sm sm:text-base font-medium leading-relaxed max-w-xl">
                SkillPath AI es tu mentor digital de carrera impulsado por Inteligencia Artificial. Descubre qué habilidades te faltan, optimiza tu currículun para filtros ATS y conecta con las mejores vacantes corporativas del país.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#B50E30] hover:bg-[#85061B] text-white text-center text-xs font-black uppercase tracking-widest px-6 py-4 rounded-md transition duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer border-0"
                >
                  Comienza tu Ruta Gratis
                  <ChevronRight className="h-4 w-4" />
                </button>

                <a
                  href="#ecosystem"
                  className="bg-white border border-neutral-300 text-black text-center hover:bg-neutral-50 text-xs font-black uppercase tracking-widest px-6 py-4 rounded-md transition duration-200"
                >
                  Explorar Beneficios
                </a>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-neutral-150 max-w-md">
                <div>
                  <div className="text-xl font-black text-black">92%</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Tasa de Contratación</div>
                </div>
                <div>
                  <div className="text-xl font-black text-black">1500+</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Estudiantes Activos</div>
                </div>
                <div>
                  <div className="text-xl font-black text-black">20+</div>
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Empresas Aliadas</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-[#B50E30]/2 rounded-3xl -rotate-2 scale-105 pointer-events-none" />

              <div className="bg-white border border-neutral-200 p-6 rounded-2xl shadow-xl relative z-10 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 bg-black text-white flex items-center justify-center text-[10px] font-black rounded">UTP</span>
                    <span className="text-[10px] font-black tracking-widest text-black">SKILLPATH PLATFORM</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-[#B50E30] animate-pulse" />
                </div>

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-150 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-[#B50E30] uppercase tracking-widest block">ÍNDICE DE EMPLEABILIDAD</span>
                    <h4 className="text-base font-black text-black">Valeria Alva</h4>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">Sistemas • 7º Ciclo</p>
                  </div>

                  <div className="relative h-16 w-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" className="stroke-neutral-200" strokeWidth="6" fill="transparent" />
                      <circle cx="32" cy="32" r="28" className="stroke-[#B50E30]" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="45" />
                    </svg>
                    <span className="absolute text-xs font-black text-black">84%</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block">Misiones de Ruta STAR</span>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-white border border-neutral-100 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#B50E30]" />
                        <span className="text-[11px] font-bold text-neutral-800 uppercase tracking-tight">Escanear primer Currículum</span>
                      </div>
                      <span className="text-[9px] bg-neutral-100 font-extrabold text-[#B50E30] px-2 py-0.5 rounded uppercase">+60 XP</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-50/50 border border-neutral-100 rounded-lg opacity-80">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full border border-neutral-300" />
                        <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-tight">Simular Entrevista Técnica</span>
                      </div>
                      <span className="text-[9px] bg-neutral-100 font-extrabold text-neutral-500 px-2 py-0.5 rounded uppercase">+120 XP</span>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-black text-white p-3 rounded-lg border border-neutral-800 shadow-lg flex items-center gap-2.5 max-w-[200px] animate-bounce">
                  <div className="h-5 w-5 bg-[#B50E30] rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="h-3 w-3 text-white fill-white" />
                  </div>
                  <div className="text-[9px] leading-tight font-extrabold uppercase text-white">
                    ¡Match con Interbank! <span className="text-[#B50E30]">92% compatible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-20 px-6 relative border-t border-b border-neutral-200 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10 mb-16">
            <span className="text-[#B50E30] text-[10px] md:text-xs uppercase font-black tracking-widest block">
              Cómo funciona SkillPath AI
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight uppercase leading-none">
              De estudiante a empleable — <span className="text-[#B50E30]">paso a paso.</span>
            </h2>
            <div className="w-16 h-1 bg-[#B50E30] mx-auto mt-4" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative z-10">

              <div className="flex flex-col items-start text-left bg-neutral-50 border border-neutral-200 p-6 rounded-none relative">
                <div className="absolute right-3 top-3 text-neutral-200 font-black text-4xl select-none font-mono pointer-events-none">
                  01
                </div>
                <div className="h-10 w-10 bg-[#B50E30]/10 flex items-center justify-center text-[#B50E30] mb-4">
                  <Sparkles className="h-5 w-5 fill-[#B50E30]/10" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-black mb-2">Descubre tus Competencias</h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Completa nuestra evaluación gamificada para mapear tus fortalezas y brechas en 8 dimensiones universales de competencia.
                </p>
              </div>

              <div className="flex flex-col items-start text-left bg-neutral-50 border border-neutral-200 p-6 rounded-none relative">
                <div className="absolute right-3 top-3 text-neutral-200 font-black text-4xl select-none font-mono pointer-events-none">
                  02
                </div>
                <div className="h-10 w-10 bg-[#B50E30]/10 flex items-center justify-center text-[#B50E30] mb-4">
                  <Briefcase className="h-5 w-5 fill-[#B50E30]/10" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-black mb-2">Construye Experiencia Real</h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Únete a proyectos universitarios reales que coinciden con tu carrera y tus brechas de habilidades. Trabaja con pares guiados por mentores.
                </p>
              </div>

              <div className="flex flex-col items-start text-left bg-neutral-50 border border-neutral-200 p-6 rounded-none relative">
                <div className="absolute right-3 top-3 text-neutral-200 font-black text-4xl select-none font-mono pointer-events-none">
                  03
                </div>
                <div className="h-10 w-10 bg-[#B50E30]/10 flex items-center justify-center text-[#B50E30] mb-4">
                  <Shield className="h-5 w-5 fill-[#B50E30]/10" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-black mb-2">Valida tus Competencias</h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Cada proyecto completado genera competencias verificadas por mentores. Construye un portafolio de experiencia auténtica que los empleadores confían.
                </p>
              </div>

              <div className="flex flex-col items-start text-left bg-neutral-50 border border-neutral-200 p-6 rounded-none relative">
                <div className="absolute right-3 top-3 text-neutral-200 font-black text-4xl select-none font-mono pointer-events-none">
                  04
                </div>
                <div className="h-10 w-10 bg-[#B50E30]/10 flex items-center justify-center text-[#B50E30] mb-4">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-black mb-2">Sé Empleable</h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Monitorea tu Índice de Empleabilidad, exporta tu portafolio verificado y llega a las entrevistas con evidencia real, no solo promesas.
                </p>
              </div>

            </div>
          </div>
        </section>

        <section id="ecosystem" className="py-20 bg-neutral-50 border-t border-b border-neutral-200 px-6">
          <div className="max-w-7xl mx-auto space-y-12">

            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[#B50E30] text-[10px] md:text-xs uppercase font-black tracking-widest block">Potencia tus competencias</span>
              <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight uppercase leading-none">
                ¿Por qué usar <span className="text-[#B50E30]">SkillPath AI?</span>
              </h2>
              <div className="w-16 h-1 bg-[#B50E30] mx-auto mt-4" />
              <p className="text-neutral-500 text-xs sm:text-sm font-semibold max-w-lg mx-auto leading-relaxed pt-2">
                Nuestra arquitectura curricular analiza de forma constante tus requerimientos académicos y los empareja en tiempo real con las mejores competencias corporativas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white border border-neutral-200 p-6 rounded-none hover:border-[#B50E30] transition duration-300 space-y-4">
                <div className="h-10 w-10 bg-[#B50E30]/10 flex items-center justify-center text-[#B50E30]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-black mb-2">
                  Diagnóstico IA de Brechas
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Realiza un escaneo inmediato de tu progreso académico. Identifica vacíos específicos en tus conocimientos de código, metodologías ágiles o habilidades interpersonales exigidas en el mercado laboral peruano.
                </p>
              </div>

              <div className="bg-white border border-neutral-200 p-6 rounded-none hover:border-[#B50E30] transition duration-300 space-y-4">
                <div className="h-10 w-10 bg-[#B50E30]/10 flex items-center justify-center text-[#B50E30]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-black mb-2">
                  Ruta STAR Personalizada
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Accede a un plan de juego interactivo gamificado. Cumple misiones de oratoria en video, supera exámenes simulados diseñados por reclutadores y avanza en tu nivel de experiencia acumulando puntos de XP.
                </p>
              </div>

              <div className="bg-white border border-neutral-200 p-6 rounded-none hover:border-[#B50E30] transition duration-300 space-y-4">
                <div className="h-10 w-10 bg-[#B50E30]/10 flex items-center justify-center text-[#B50E30]">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-extrabold uppercase tracking-wide text-black mb-2">
                  Analizador de CV ATS
                </h3>
                <p className="text-neutral-500 text-xs leading-relaxed font-semibold">
                  Optimiza tu currículun vitae estructurándolo según los estándares de lectura automática de grandes firmas. Asegura los verbos de acción precisos para destacar inmediatamente en los procesos de selección.
                </p>
              </div>

            </div>
          </div>
        </section>

        <section className="bg-black text-white py-24 px-6 relative border-t border-b border-neutral-900 text-center">
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
                Deja de buscar oportunidades.
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#B50E30] tracking-tight uppercase leading-none">
                Empieza a construir experiencia.
              </h2>
            </div>

            <p className="text-neutral-400 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              Únete a más de 14,200 estudiantes que construyen experiencia verificable antes de su primera solicitud de prácticas profesionales.
            </p>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#B50E30] hover:bg-[#85061B] text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-md transition duration-200 inline-flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer border-0"
            >
              <span>Crea tu cuenta gratuita</span>
              <ArrowRight className="h-4.5 w-4.5 text-white" />
            </button>
          </div>
        </section>

      </main>

      <footer className="bg-[#000000] text-white py-12 px-6 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-white font-black text-lg tracking-tight uppercase block">
              SkillPath <span className="text-[#B50E30]">AI</span>
            </span>
            <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-wider">
              Solución inteligente para la ruta formativa de egreso
            </span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 text-white font-black text-xs px-5 py-2.5 uppercase tracking-widest flex items-center gap-2">
            <span>Hackathon UTP+</span>
            <span className="text-[#B50E30]">|</span>
            <span>Reto 2: Ruta de Empleabilidad</span>
          </div>

          <p className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] text-center md:text-right">
            © 2026 SkillPath AI - Todos los derechos reservados • UTP Perú
          </p>
        </div>
      </footer>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="bg-white border border-neutral-200 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden transform transition-all duration-300">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#B50E30]" />

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black hover:bg-neutral-100 p-1.5 rounded-full transition cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            <div className="p-8">
              <div className="space-y-1 mb-6">
                <span className="text-[#B50E30] text-[9px] uppercase font-black tracking-widest block">Acceso inmediato</span>
                <h2 className="text-xl font-black text-black uppercase tracking-tight">Únete a la plataforma</h2>
                <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider">
                  Configura tu simulación estudiantil con la cuenta académica UTP+
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-black tracking-wider block">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Valeria Alva"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white px-3 py-2.5 border border-neutral-300 rounded-md text-xs font-semibold focus:border-black outline-none transition text-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-black tracking-wider block">Correo Institucional UTP</label>
                  <input
                    type="email"
                    required
                    placeholder="u21345678@utp.edu.pe"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white px-3 py-2.5 border border-neutral-300 rounded-md text-xs font-semibold focus:border-black outline-none transition text-black font-mono font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-black tracking-wider block">Carrera Profesional</label>
                    <select
                      value={career}
                      onChange={(e) => setCareer(e.target.value)}
                      className="w-full bg-white px-3 py-2.5 border border-neutral-300 rounded-md text-xs font-semibold focus:border-black outline-none text-black font-bold h-10"
                    >
                      <option value="Ingeniería de Sistemas">Ingeniería de Sistemas</option>
                      <option value="Ingeniería de Software">Ingeniería de Software</option>
                      <option value="Diseño Publicitario">Diseño Publicitario</option>
                      <option value="Psicología Organizacional">Psicología Organizacional</option>
                      <option value="Negocios Internacionales">Negocios Internacionales</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-black tracking-wider block">Ciclo Académico</label>
                    <select
                      value={semester}
                      onChange={(e) => setSemester(Number(e.target.value))}
                      className="w-full bg-white px-3 py-2.5 border border-neutral-300 rounded-md text-xs font-semibold focus:border-black outline-none text-black font-bold h-10"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                        <option key={s} value={s}>{s}º Ciclo</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-black tracking-wider block">Puesto Objetivo Recomendado</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Junior Full Stack Developer, Reclutador..."
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-white px-3 py-2.5 border border-neutral-300 rounded-md text-xs font-semibold focus:border-black outline-none transition text-black"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full mt-4 bg-[#B50E30] hover:bg-[#85061B] text-white text-xs font-black uppercase tracking-widest py-3 rounded-md transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-md border-0"
                >
                  {isSubmitted ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Generando Ruta UTP+ ...
                    </>
                  ) : (
                    <>
                      Comenzar Simulación UTP+
                      <ArrowRight className="h-4 w-4 text-white" />
                    </>
                  )}
                </button>

                <p className="text-[9px] text-neutral-400 font-extrabold text-center uppercase tracking-wider leading-tight">
                  Al registrarte, declaras pertenecer activamente a la comunidad de egreso de la UTP.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
