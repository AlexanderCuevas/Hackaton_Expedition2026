import React, { useState } from "react";
import { Sparkles, ArrowRight, Shield, GraduationCap, Briefcase, FileText, ChevronRight, TrendingUp, X, Instagram, Linkedin, MessageCircle, Mail } from "lucide-react";
import principalImg from "./assets/Principal.png";


// Declaración de tipos local para asegurar que el compilador resuelva correctamente
export interface UserProfile {
  name: string;
  career: string;
  semester: number;
  targetRole: string;
  employabilityScore: number;
  xp: number;
  level: number;
  progressToNextLevel: number;
}

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

      {}
      <header className="bg-white border-b border-neutral-100 px-6 py-4 sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" className="h-10 w-10 shrink-0">
              <g fill="none" stroke="#C42828" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 40,210 C 40,160 80,160 80,130 L 80,105" />
                <path d="M 55,105 C 55,125 105,125 105,105" />
                <polygon points="80,45 135,65 80,85 25,65" fill="#FFFFFF" strokeWidth="10" />
                <path d="M 108,75 L 120,85 C 122,88 122,95 120,98" strokeWidth="8" />
              </g>
              <circle cx="120" cy="102" r="7" fill="#C42828" />
            </svg>
            <div className="flex flex-col leading-tight">
              <span className="text-black font-black text-xl tracking-tight uppercase -mt-3">
                Ruta de <span className="text-[#B50E30]">Empleabilidad</span>
              </span>
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider -mt-1">Plataforma de Crecimiento Profesional</span>
            </div>
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

        {}
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
                Ruta de Empleabilidad es tu mentor digital de carrera impulsado por Inteligencia Artificial. Descubre qué habilidades te faltan, optimiza tu currículun para filtros ATS y conecta con las mejores vacantes corporativas del país.
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

            {}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Resplandor sutil de fondo en base al color institucional */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#B50E30]/10 to-transparent rounded-full blur-3xl scale-95 opacity-85 pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-[460px] sm:max-w-md lg:max-w-none transition-all duration-500 hover:scale-[1.02]">
                <img 
                  src={principalImg} 
                  alt="Ecosistema de Competencias Ruta de Empleabilidad" 
                  className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(181,14,48,0.12)]"
                  onError={(e) => {
                    // Fallback en caso de que la ruta local de VSCode sea diferente durante el desarrollo offline
                    e.currentTarget.src = "./assets/Principal.png";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {}
        <section className="bg-white py-20 px-6 relative border-t border-b border-neutral-200 overflow-hidden">
          <div className="max-w-7xl mx-auto text-center space-y-3 relative z-10 mb-16">
            <span className="text-[#B50E30] text-[10px] md:text-xs uppercase font-black tracking-widest block">
              Cómo funciona Ruta de Empleabilidad
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

        {}
        <section id="ecosystem" className="py-20 bg-neutral-50 border-t border-b border-neutral-200 px-6">
          <div className="max-w-7xl mx-auto space-y-12">

            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[#B50E30] text-[10px] md:text-xs uppercase font-black tracking-widest block">Potencia tus competencias</span>
              <h2 className="text-3xl md:text-4xl font-black text-black tracking-tight uppercase leading-none">
                ¿Por qué usar <span className="text-[#B50E30]">Ruta de Empleabilidad?</span>
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

        {}
        <section className="bg-white text-black py-24 px-6 relative border-t border-b border-neutral-100 text-center">
          <div className="max-w-4xl mx-auto space-y-8 relative z-10">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase leading-none">
                Deja de buscar oportunidades.
              </h2>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#B50E30] tracking-tight uppercase leading-none">
                Empieza a construir experiencia.
              </h2>
            </div>

            <p className="text-neutral-600 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
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

      {}
      <footer className="bg-[#111111] text-white py-16 px-6 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 250" className="h-9 w-9 shrink-0">
                  <g fill="none" stroke="#B50E30" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 40,210 C 40,160 80,160 80,130 L 80,105" />
                    <path d="M 55,105 C 55,125 105,125 105,105" />
                    <polygon points="80,45 135,65 80,85 25,65" fill="#FFFFFF" strokeWidth="10" />
                    <path d="M 108,75 L 120,85 C 122,88 122,95 120,98" strokeWidth="8" />
                  </g>
                  <circle cx="120" cy="102" r="7" fill="#B50E30" />
                </svg>
                <span className="font-bold text-lg tracking-tight">Ruta de Empleabilidad</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                Mentor digital de empleabilidad impulsado por IA. Transformamos estudiantes universitarios en candidatos competitivos.
              </p>
              <div className="flex gap-3">
                <Instagram className="w-6 h-6 text-neutral-500 hover:text-white cursor-pointer" />
                <Linkedin className="w-6 h-6 text-neutral-500 hover:text-white cursor-pointer" />
                <MessageCircle className="w-6 h-6 text-neutral-500 hover:text-white cursor-pointer" />
                <Mail className="w-6 h-6 text-neutral-500 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Producto</h4>
              <ul className="space-y-3 text-neutral-400 text-sm cursor-pointer">
                <li className="hover:text-white transition">Diagnóstico de perfil</li>
                <li className="hover:text-white transition">Ruta personalizada</li>
                <li className="hover:text-white transition">CV Analyzer</li>
                <li className="hover:text-white transition">Simulador de entrevistas</li>
                <li className="hover:text-white transition">Match de vacantes</li>
                <li className="hover:text-white transition">Comunidad</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Empresa</h4>
              <ul className="space-y-3 text-neutral-400 text-sm cursor-pointer">
                <li className="hover:text-white transition">Sobre Ruta de Empleabilidad</li>
                <li className="hover:text-white transition">Blog</li>
                <li className="hover:text-white transition">Eventos</li>
                <li className="hover:text-white transition">Para empresas</li>
                <li className="hover:text-white transition">Contacto</li>
                <li className="hover:text-white transition">Prensa</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-2">Legal</h4>
              <ul className="space-y-3 text-neutral-400 text-sm cursor-pointer">
                <li className="hover:text-white transition">Términos y condiciones</li>
                <li className="hover:text-white transition">Política de privacidad</li>
                <li className="hover:text-white transition">Cookies</li>
                <li className="hover:text-white transition">Ayuda</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
            <p>© 2026 Ruta de Empleabilidad. Hackathon UTP + Xpedition.</p>
            <p>Creado para transformar la empleabilidad estudiantil.</p>
          </div>
        </div>
      </footer>

      {}
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