import React, { useState } from "react";
import { SocialPost, NetworkingContact } from "../types";
import { useNotification } from "../context/NotificationContext";
import { 
  Users, MessageSquare, ThumbsUp, Sparkles, Send, Tag, Share2, 
  Search, PlusCircle, Check, Briefcase, GraduationCap, Trophy,
  User, HeartHandshake, X, List
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { INITIAL_COMMUNITY_POSTS, INITIAL_NETWORKING_CONTACTS } from "../data";
import { NavBar } from "./ui/tubelight-navbar";
import { FeedView } from "./ui/feed-view";
import { Button } from "./ui/button";


const COMMUNITY_USER_PROFILES: Record<string, any> = {
  "Diego Alva": {
    name: "Diego Alva",
    career: "Ingeniería de Sistemas",
    semester: 8,
    avatarColor: "bg-black text-[#B50E30] border-black",
    targetRole: "Backend Developer Trainee",
    bio: "Apasionado por la optimización de código y la arquitectura de datos relacionales en SQL Server. Busco oportunidades corporativas de desarrollo.",
    skills: ["React", "NodeJS", "TypeScript", "SQL Server", "Git", "Jest"],
    level: 3,
    xp: 480,
    type: "Estudiante UTP"
  },
  "Valeria Ruiz": {
    name: "Valeria Ruiz",
    career: "Diseño Publicitario",
    semester: 6,
    avatarColor: "bg-[#B50E30] text-white border-[#B50E30]",
    targetRole: "UX/UI Designer Junior",
    bio: "Fascinada por el diseño centrado en el usuario, el prototipado rápido en Figma y las arquitecturas de la nube aplicadas a productos digitales.",
    skills: ["Figma", "User Research", "Adobe Illustrator", "Storytelling", "AWS Cloud"],
    level: 2,
    xp: 290,
    type: "Estudiante UTP"
  },
  "Jose Sandoval": {
    name: "Jose Sandoval",
    career: "Negocios Internacionales",
    semester: 9,
    avatarColor: "bg-black text-white border-black",
    targetRole: "Analista de Proyectos Comerciales",
    bio: "Líder de equipos orientado al logro de indicadores de mercado. Disfruto uniendo tecnología y estrategia comercial para acelerar startups.",
    skills: ["Design Thinking", "Gestión de Proyectos", "Scrum", "Business Strategy", "English"],
    level: 4,
    xp: 610,
    type: "Estudiante UTP"
  },
  "Carlos Mendoza": {
    name: "Ing. Carlos Mendoza",
    career: "Sistemas & Software (Alumni)",
    semester: 10,
    avatarColor: "bg-[#B50E30] text-white border-[#B50E30]",
    targetRole: "Staff Backend Architect @ Globant",
    bio: "Más de 10 años diseñando microservicios robustos a gran escala en Latinoamérica. Apasionado de la mentoría técnica universitaria.",
    skills: ["Kubernetes", "AWS Cloud", "NodeJS", "TypeScript", "Java Spring Boot", "Scrum"],
    level: 8,
    xp: 4500,
    type: "Mentor Destacado"
  },
  "Andrea Salazar": {
    name: "Lic. Andrea Salazar",
    career: "Psicología Organizacional",
    semester: 10,
    avatarColor: "bg-black text-[#B50E30] border-black",
    targetRole: "Senior Talent Acquisition Specialist @ Belcorp",
    bio: "Comprometida con la identificación de perfiles de alto valor integrando metodologías ágiles y evaluaciones STAR de impacto.",
    skills: ["Selección de Talento IT", "LinkedIn Recruiting", "Método STAR", "Oratoria de Impacto"],
    level: 7,
    xp: 3200,
    type: "Reclutador Corporativo"
  },
  "Diana Tello": {
    name: "Diana Tello",
    career: "Ingeniería de Software (Alumni UTP)",
    semester: 10,
    avatarColor: "bg-black text-white border-black",
    targetRole: "Co-fundadora & CTO @ Xpedition Studio",
    bio: "Ex-alumna apasionada de hackathons académicas. Dispuesta a orientar estudiantes en el armado de portafolios disruptivos.",
    skills: ["React Native", "Firebase", "Startup Funding", "Python", "Agile Leadership"],
    level: 9,
    xp: 5900,
    type: "Mentor Destacado"
  },
  "Mateo Cáceres": {
    name: "Mateo Cáceres",
    career: "Ingeniería de Sistemas",
    semester: 9,
    avatarColor: "bg-[#B50E30] text-white border-[#B50E30]",
    targetRole: "DevOps Engineer Trainee @ BBVA Perú",
    bio: "Apasionado por la automatización de procesos, Infraestructura como Código y contenedores híbridos con Docker.",
    skills: ["GitLab CI", "AWS Foundations", "Docker", "Sistemas Operativos", "Bash Scripting"],
    level: 3,
    xp: 520,
    type: "Alumni Junior"
  }
};

export default function SocialHub() {
  const { addNotification } = useNotification();
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_COMMUNITY_POSTS);
  const [contacts, setContacts] = useState<NetworkingContact[]>(INITIAL_NETWORKING_CONTACTS);
  
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);
  
  const [connectedProfiles, setConnectedProfiles] = useState<Record<string, boolean>>({});

  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState<SocialPost["category"]>("proyecto");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [activeCategory, setActiveCategory] = useState<"todo" | SocialPost["category"]>("todo");

  const [activeSegment, setActiveSegment] = useState<"comunidad" | "networking">("comunidad");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  const openProfile = (name: string, fallbackData?: any) => {
    let cleanName = name.replace(" (Tú)", "").trim();
    if (cleanName === "Tú" || cleanName === "Valeria Alva (Tú)" || cleanName === "Valeria Alva") {
      setSelectedUserProfile({
        name: "Valeria Alva (Tú)",
        career: "Ingeniería de Sistemas",
        semester: 7,
        avatarColor: "bg-black text-white border-black",
        targetRole: "Junior Full Stack Developer",
        bio: "Estudiante motivada y apasionada de la UTP. Optimizando el uso del método STAR y desarrollando habilidades cloud y de bases de datos.",
        skills: ["HTML/CSS", "JavaScript", "SQL Server", "TypeScript", "React"],
        level: 2,
        xp: 320,
        type: "Tú (Estudiante)"
      });
      return;
    }

    const matched = COMMUNITY_USER_PROFILES[cleanName] || COMMUNITY_USER_PROFILES[name];
    if (matched) {
      setSelectedUserProfile(matched);
    } else {
      setSelectedUserProfile({
        name: cleanName,
        career: fallbackData?.career || "Ingeniería de Sistemas",
        semester: fallbackData?.semester || 7,
        avatarColor: fallbackData?.avatarColor || "bg-[#B50E30] text-white border-[#B50E30]",
        targetRole: fallbackData?.targetRole || "Estudiante UTP",
        bio: "Colaborador activo de la comunidad académica aportando ideas para desafíos de ingeniería.",
        skills: ["Bases de Datos", "Metodologías Ágiles", "Frontend Core"],
        level: 2,
        xp: 180,
        type: "Estudiante UTP"
      });
    }
  };

  const handleUserProfileConnect = (username: string) => {
    setConnectedProfiles(prev => ({ ...prev, [username]: true }));
    
    setContacts(prev =>
      prev.map(c => {
        if (c.name.includes(username) || username.includes(c.name)) {
          return { ...c, isConnected: true };
        }
        return c;
      })
    );

    addNotification({
      type: "connection_accepted",
      title: "Conexión establecida",
      description: `Ahora estás conectado con ${username.replace(" (Tú)", "").trim()}`,
      actorName: username,
    });
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(p => {
        if (p.id === postId) {
          const liked = !p.likedByUser;
          return {
            ...p,
            likedByUser: liked,
            likes: liked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: SocialPost = {
      id: `p_${Date.now()}`,
      authorName: "Valeria Alva (Tú)",
      authorCareer: "Ingeniería de Sistemas",
      authorSemester: 7,
      avatarColor: "bg-black text-[#B50E30]",
      content: newPostContent,
      category: newPostCategory,
      date: "Hace unos instantes",
      likes: 0,
      likedByUser: false,
      comments: []
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setShowCreateModal(false);
  };

  const handleConnect = (contactId: string) => {
    let contactName = "";
    setContacts(prev =>
      prev.map(c => {
        if (c.id === contactId) {
          if (!c.isConnected && !c.isPending) {
            contactName = c.name;
            return { ...c, isPending: true };
          }
        }
        return c;
      })
    );

    if (contactName) {
      addNotification({
        type: "connection_request",
        title: "Solicitud de conexión enviada",
        description: `Has solicitado conectar con ${contactName}`,
        actorName: contactName,
      });
    }
  };

  const filteredPosts = activeCategory === "todo" 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Tab Select Controller */}
      <div className="bg-white rounded-none border border-utp-border p-2 flex select-none">
        <button
          type="button"
          onClick={() => setActiveSegment("comunidad")}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === "comunidad"
              ? "bg-[#B50E30] text-white"
              : "text-black hover:bg-neutral-50"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Foro de Estudiantes UTP+
        </button>
        <button
          type="button"
          onClick={() => setActiveSegment("networking")}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-none transition flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === "networking"
              ? "bg-[#B50E30] text-white"
              : "text-black hover:bg-neutral-50"
          }`}
        >
          <Users className="h-4 w-4" />
          Networking con Reclutadores
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSegment === "comunidad" ? (
          /* COMMUNITY FORUM BLOCK */
          <motion.div
            key="comunidad"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Posts feed list */}
            <div className="lg:col-span-2 space-y-4">
              {/* Category Filter Pills & Create Post Trigger */}
              <div className="bg-white rounded-none border border-utp-border p-4 flex flex-wrap items-center justify-between gap-3">
                <NavBar
                  items={[
                    { name: "todo", icon: <List className="h-3.5 w-3.5" /> },
                    { name: "proyecto", icon: <Briefcase className="h-3.5 w-3.5" /> },
                    { name: "logro", icon: <Trophy className="h-3.5 w-3.5" /> },
                    { name: "ayuda", icon: <HeartHandshake className="h-3.5 w-3.5" /> },
                    { name: "evento", icon: <Sparkles className="h-3.5 w-3.5" /> },
                    { name: "general", icon: <Tag className="h-3.5 w-3.5" /> },
                  ]}
                  activeTab={activeCategory}
                  onTabChange={(name) => setActiveCategory(name as "todo" | "proyecto" | "logro" | "ayuda" | "evento" | "general")}
                />

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(true)}
                    className="bg-[#B50E30] hover:bg-[#85061B] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 flex items-center gap-1.5 transition cursor-pointer rounded-none"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Compartir un logro
                  </button>
                </div>
              </div>

              {/* POST WRITE PANEL IN-LINE CARD IF TRIGGERED */}
              {showCreateModal && (
                <motion.form
                  onSubmit={handleCreatePost}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-white text-black rounded-none p-6 border border-gray-200 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest font-black text-[#B50E30] flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 fill-[#B50E30] text-[#B50E30]" />
                      Anuncia tu crecimiento a la red académica
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="text-xs text-gray-500 hover:text-black font-extrabold uppercase tracking-wide"
                    >
                      Cancelar
                    </button>
                  </div>

                  <textarea
                    required
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Comparte tu avance corporativo, un proyecto académico de la UTP o solicita retroalimentación de verbos en el CV..."
                    className="w-full p-4 bg-white text-black text-xs font-semibold outline-none rounded-none border border-gray-200 focus:border-[#B50E30] placeholder-gray-400 font-mono"
                    rows={4}
                  />

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] uppercase font-black text-gray-500">Categoría:</span>
                      <select
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value as SocialPost["category"])}
                        className="bg-white border border-gray-200 text-xs text-black rounded-none px-2.5 py-1.5 uppercase font-bold"
                      >
                        <option value="proyecto">PROYECTO</option>
                        <option value="logro">LOGRO FORMATIVO</option>
                        <option value="ayuda">SOLICITAR FEEDBACK</option>
                        <option value="evento">EVENTO/HACKATHON</option>
                        <option value="general">GENERAL</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#B50E30] hover:bg-[#85061B] px-5 py-2 rounded-none text-xs font-black uppercase tracking-widest transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Publicar ahora
                    </button>
                  </div>
                </motion.form>
              )}

              {/* FEED VIEW — único diseño oficial */}
              {filteredPosts.length === 0 ? (
              <div className="bg-white rounded-none border border-utp-border p-8 text-center space-y-4">
                <div className="text-neutral-300 mx-auto">
                  {activeCategory === "todo" ? (
                    <MessageSquare className="h-10 w-10 mx-auto" />
                  ) : activeCategory === "proyecto" ? (
                    <Briefcase className="h-10 w-10 mx-auto" />
                  ) : activeCategory === "logro" ? (
                    <Trophy className="h-10 w-10 mx-auto" />
                  ) : activeCategory === "ayuda" ? (
                    <HeartHandshake className="h-10 w-10 mx-auto" />
                  ) : activeCategory === "evento" ? (
                    <Sparkles className="h-10 w-10 mx-auto" />
                  ) : (
                    <Tag className="h-10 w-10 mx-auto" />
                  )}
                </div>
                <p className="text-xs font-black uppercase text-neutral-400">
                  {activeCategory === "todo"
                    ? "Aún no hay publicaciones en el foro"
                    : `No hay publicaciones en "${activeCategory}"`}
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-1.5 bg-[#B50E30] hover:bg-[#85061B] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2.5 transition cursor-pointer rounded-none"
                >
                  <PlusCircle className="h-4 w-4" />
                  Compartir un logro
                </button>
              </div>
              ) : (
              <FeedView
                posts={filteredPosts}
                onLike={handleLike}
                onComment={(id, text) => {
                  setPosts((prev) =>
                    prev.map((p) => {
                      if (p.id === id) {
                        return {
                          ...p,
                          comments: [
                            ...p.comments,
                            { authorName: "Valeria Alva (Tú)", content: text, date: "Ahora mismo" },
                          ],
                        };
                      }
                      return p;
                    })
                  );
                }}
                onOpenProfile={(name) => openProfile(name)}
              />
            )}
            </div>

            {/* Micro networking sidebar inside community */}
            <div className="space-y-6">
              <div className="bg-white rounded-none border border-utp-border p-6 space-y-4">
                <h3 className="heading-sm text-black tracking-widest flex items-center gap-2 pb-2 border-b border-utp-border">
                  <Trophy className="h-4 w-4 text-[#B50E30]" />
                  Egresados Destacados
                </h3>
                <div className="space-y-4">
                  {contacts.slice(0, 2).map((cont) => (
                    <div 
                      key={cont.id} 
                      onClick={() => openProfile(cont.name)}
                      className="p-3 bg-neutral-50 hover:bg-neutral-100 border border-utp-border rounded-none space-y-2 transition cursor-pointer group"
                      title="Ver Perfil Completo"
                    >
                      <div className="space-y-1">
                        <span className="text-[8px] font-black text-white bg-black px-2 py-0.5 rounded-none uppercase tracking-wide">
                          {cont.type}
                        </span>
                        <h4 className="heading-md text-black group-hover:text-[#B50E30] transition-colors">{cont.name}</h4>
                        <p className="text-[11px] text-neutral-550 font-bold uppercase">
                          {cont.role} en <strong className="text-black">{cont.company}</strong>
                        </p>
                      </div>
                      <p className="text-[10px] text-neutral-500 leading-relaxed font-semibold italic border-l-2 border-[#B50E30] pl-2">
                        "{cont.bio.slice(0, 75)}..."
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* NETWORKING CONNECTIONS SEGMENT — VacanciesPanel card design */
          <motion.div
            key="networking"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {contacts.map((c) => (
                <motion.div
                  key={c.id}
                  variants={cardVariants}
                  whileHover={{ y: -4 }}
                  className="relative group bg-white border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-400 ease-out p-6 md:p-7 overflow-hidden flex flex-col"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#B50E30] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

                  <div className="flex justify-between items-start mb-4 gap-3">
                    <span className={`text-[10px] md:text-xs font-bold px-3 py-1 uppercase tracking-widest mt-1 shadow-sm shrink-0 ${
                      c.type === "mentor"
                        ? "bg-black text-[#B50E30]"
                        : c.type === "reclutador"
                          ? "bg-[#B50E30] text-white"
                          : "bg-black text-white"
                    }`}>
                      {c.type}
                    </span>
                  </div>

                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-black leading-tight mb-2 group-hover:text-[#B50E30] transition-colors duration-300">
                    {c.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-3 text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-wider mb-4">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#B50E30]" />
                      {c.role} @ <strong className="text-black font-extrabold">{c.company}</strong>
                    </span>
                  </div>

                  <p className="text-gray-600 font-medium leading-relaxed text-xs md:text-sm mb-5 line-clamp-2">
                    {c.bio}
                  </p>

                  <div className="mb-5">
                    <span className="text-[10px] font-black text-[#B50E30] uppercase tracking-widest block mb-2">
                      Compatibilidad:
                    </span>
                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-black font-bold uppercase text-[10px] px-3 py-2">
                      <Sparkles className="h-4 w-4 text-[#B50E30] shrink-0 fill-[#B50E30]" />
                      <span>{c.compatibilityText}</span>
                    </div>
                  </div>

                  <hr className="border-gray-200 mb-5 group-hover:border-[#B50E30]/20 transition-colors" />

                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openProfile(c.name)}
                      className="text-xs font-black uppercase tracking-wider rounded-lg border-gray-200 text-gray-700 hover:text-[#B50E30] hover:border-[#B50E30]"
                    >
                      Ver Perfil
                    </Button>

                    {c.isConnected ? (
                      <div className="w-full md:w-auto bg-neutral-100 text-neutral-500 border border-neutral-200 text-xs font-black uppercase tracking-widest px-6 py-3 flex items-center justify-center gap-2 shrink-0 select-none">
                        <Check className="h-4 w-4 text-[#B50E30] stroke-[3]" />
                        Conectado
                      </div>
                    ) : c.isPending ? (
                      <div className="w-full md:w-auto bg-neutral-50 text-neutral-400 border border-gray-200 text-xs font-black uppercase tracking-widest px-6 py-3 flex items-center justify-center gap-2 shrink-0 select-none">
                        Solicitado
                      </div>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={() => handleConnect(c.id)}
                        whileTap={{ scale: 0.97 }}
                        className="group/btn w-full md:w-auto bg-black text-white font-black uppercase tracking-widest text-[11px] px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#B50E30] hover:shadow-[0_8px_20px_rgba(181,14,48,0.3)] transition-all duration-300 shrink-0 cursor-pointer"
                      >
                        Conectar
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFESSIONAL PROFILE POPUP MODAL */}
      <AnimatePresence>
        {selectedUserProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelectedUserProfile(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-[98vw] max-w-6xl"
            >
              <div className="w-full bg-white shadow-2xl border border-neutral-200 relative overflow-hidden">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedUserProfile(null)}
                  className="absolute top-3 right-3 z-20 h-8 w-8 flex items-center justify-center bg-white/90 backdrop-blur-sm text-neutral-500 hover:text-black hover:bg-white border border-neutral-200 transition-all duration-200 cursor-pointer shadow-sm"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Cover Banner */}
                <div className="h-32 relative overflow-hidden bg-black">
                  <img
                    src={`https://images.unsplash.com/photo-${
                      selectedUserProfile.type?.includes("Reclutador")
                        ? "1573496359142-b8d87734a5a2?w=1000&q=80"
                        : selectedUserProfile.type?.includes("Mentor")
                        ? "1522071820081-009f0129c71c?w=1000&q=80"
                        : "1517245386807-bb43f82c33c4?w=1000&q=80"
                    }`}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 utp-diagonal-pattern opacity-[0.05]" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B50E30] via-[#B50E30]/60 to-transparent" />
                </div>

                {/* Avatar - overlapping cover */}
                <div className="relative px-10">
                  <div className="flex items-end gap-6 -mt-14">
                    <motion.div
                      initial={{ scale: 0, rotate: -8 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", damping: 13, stiffness: 230, delay: 0.1 }}
                      className="relative shrink-0"
                    >
                      <div className="absolute -inset-[4px] bg-gradient-to-br from-[#B50E30] via-white/30 to-black rounded-full shadow-2xl" />
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUserProfile.name.replace(" (Tú)", "").replace("Ing. ", "").replace("Lic. ", ""))}&background=000&color=fff&size=200&bold=true&font-size=0.35`}
                        alt={selectedUserProfile.name}
                        className="relative h-28 w-28 rounded-full border-[4px] border-white bg-white object-cover shadow-xl"
                      />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 10, stiffness: 180, delay: 0.35 }}
                        className="absolute -bottom-1 -right-1 h-9 w-9 bg-gradient-to-br from-[#B50E30] to-black flex items-center justify-center text-sm font-black text-white shadow-lg border-[3px] border-white rounded-full"
                      >
                        {selectedUserProfile.level}
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.45 }}
                        className="absolute top-1 right-1 h-3.5 w-3.5 bg-emerald-500 border-[3px] border-white rounded-full shadow-lg"
                      />
                    </motion.div>

                    <div className="min-w-0 flex-1 pt-10 pb-1">
                      <motion.h2
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl font-black text-black truncate tracking-tight"
                      >
                        {selectedUserProfile.name}
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="text-sm font-black text-[#B50E30] mt-0.5 truncate"
                      >
                        {selectedUserProfile.targetRole}
                      </motion.p>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-3 mt-0.5"
                      >
                        <span className="text-xs text-neutral-500 font-semibold">
                          {selectedUserProfile.career} • {selectedUserProfile.semester}º Ciclo
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400">ID: UTP-{selectedUserProfile.xp + 1092}</span>
                      </motion.div>
                    </div>
                  </div>

                  {/* Badge + Status row */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 mt-3 pb-4 border-b border-neutral-200"
                  >
                    <span className={`text-[11px] font-black tracking-widest px-4 py-1.5 ${
                      selectedUserProfile.type?.includes("Reclutador")
                        ? "bg-[#B50E30] text-white"
                        : selectedUserProfile.type?.includes("Mentor")
                        ? "bg-black text-white"
                        : "bg-neutral-700 text-white"
                    }`}>
                      {selectedUserProfile.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 border border-emerald-200/60">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Disponible para conectar
                    </span>
                  </motion.div>
                </div>

                {/* Content */}
                <div className="px-10 pt-5 pb-3 grid grid-cols-1 md:grid-cols-5 gap-6">
                  {/* Left col — Bio + Skills + Social */}
                  <div className="md:col-span-3 space-y-5">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <h4 className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <InfoSvg className="h-3.5 w-3.5 text-[#B50E30]" />
                        Acerca de
                      </h4>
                      <div className="bg-neutral-50 p-4 border-l-[3px] border-[#B50E30]">
                        <p className="text-sm text-neutral-700 leading-relaxed font-[425] italic">
                          &ldquo;{selectedUserProfile.bio}&rdquo;
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="text-[10px] text-black font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <SkillsSvg className="h-3.5 w-3.5 text-[#B50E30]" />
                        Habilidades
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedUserProfile.skills.map((s: string) => (
                          <motion.span
                            key={s}
                            whileHover={{ scale: 1.06, y: -2 }}
                            className="bg-white text-black border border-neutral-300 text-[10px] font-bold px-3 py-1.5 transition-all duration-200 hover:bg-[#B50E30] hover:text-white hover:border-[#B50E30] hover:shadow-md cursor-default"
                          >
                            {s}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      <h4 className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <Share2 className="h-3.5 w-3.5 text-[#B50E30]" />
                        Redes
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="inline-flex items-center gap-1 bg-[#0077B5]/10 text-[#0077B5] border border-[#0077B5]/20 text-[10px] font-bold px-2.5 py-1 hover:bg-[#0077B5] hover:text-white transition-all duration-200 cursor-default">
                          <ProfileSvg className="h-3 w-3" /> LinkedIn
                        </span>
                        <span className="inline-flex items-center gap-1 bg-neutral-100 text-neutral-700 border border-neutral-200 text-[10px] font-bold px-2.5 py-1 hover:bg-neutral-800 hover:text-white transition-all duration-200 cursor-default">
                          <ConfigSvg className="h-3 w-3" /> GitHub
                        </span>
                        <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold px-2.5 py-1 hover:bg-purple-700 hover:text-white transition-all duration-200 cursor-default">
                          <DownloadSvg className="h-3 w-3" /> Portafolio
                        </span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right col — Stats + Activity + CTA */}
                  <div className="md:col-span-2 space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="grid grid-cols-2 gap-3"
                    >
                      <div className="bg-neutral-50 border border-neutral-200 p-4 text-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
                        <GrowthSvg className="h-6 w-6 text-[#B50E30] mx-auto" />
                        <div className="text-xl font-black text-black">{selectedUserProfile.xp}</div>
                        <div className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">XP Total</div>
                      </div>
                      <div className="bg-neutral-50 border border-neutral-200 p-4 text-center space-y-1 shadow-sm hover:shadow-md transition-shadow">
                        <StarSvg className="h-6 w-6 text-[#B50E30] mx-auto" />
                        <div className="text-xl font-black text-[#B50E30]">LVL {selectedUserProfile.level}</div>
                        <div className="text-[9px] text-neutral-400 font-black uppercase tracking-widest">Rango</div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-neutral-50 border border-neutral-200 p-4 space-y-3 shadow-sm"
                    >
                      <h4 className="text-[9px] text-neutral-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Briefcase className="h-3 w-3 text-[#B50E30]" />
                        Actividad
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Proyectos", value: posts.filter(p => p.category === "proyecto" && p.authorName.includes(selectedUserProfile.name.replace(" (Tú)", "").trim())).length, icon: <TargetSvg className="h-4 w-4 text-[#B50E30]" /> },
                          { label: "Logros", value: posts.filter(p => p.category === "logro" && p.authorName.includes(selectedUserProfile.name.replace(" (Tú)", "").trim())).length, icon: <StarSvg className="h-4 w-4 text-[#B50E30]" /> },
                          { label: "Conexiones", value: contacts.filter(c => c.isConnected).length, icon: <NetworkSvg className="h-4 w-4 text-[#B50E30]" /> },
                        ].map((item, i) => (
                          <div key={i} className="text-center py-2.5 bg-white border border-neutral-100 hover:border-[#B50E30]/30 transition-colors">
                            <div className="mb-1 flex justify-center">{item.icon}</div>
                            <span className="text-base font-black text-black block">{item.value}</span>
                            <span className="text-[8px] text-neutral-400 font-black uppercase tracking-widest">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                    >
                      {selectedUserProfile.name.includes("Tú") ? (
                        <div className="w-full py-2.5 bg-neutral-100 text-neutral-400 border border-neutral-200 text-[10px] font-black tracking-wider text-center select-none">
                          Tú (Estudiante)
                        </div>
                      ) : connectedProfiles[selectedUserProfile.name] || selectedUserProfile.name.includes("Andrea Salazar") ? (
                        <div className="w-full py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black tracking-wider flex items-center justify-center gap-2 select-none">
                          <Check className="h-3.5 w-3.5 text-emerald-600 stroke-[3]" />
                          Conectados
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleUserProfileConnect(selectedUserProfile.name)}
                          className="w-full py-2.5 bg-gradient-to-r from-[#B50E30] to-[#85061B] hover:from-[#85061B] hover:to-black text-white text-[10px] font-black tracking-wider flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg"
                        >
                          <HeartHandshake className="h-3.5 w-3.5" />
                          Conectar
                        </button>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="px-10 py-3 flex justify-end border-t border-neutral-200 bg-neutral-50/50"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedUserProfile(null)}
                    className="px-4 py-2 border border-neutral-300 text-[10px] font-black tracking-wider text-neutral-500 hover:bg-white hover:text-black hover:border-neutral-400 transition-all duration-200 cursor-pointer"
                  >
                    Cerrar
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Inline SVG icon components (from iconos-empleabilidad-utp) ── */
function InfoSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>;
}
function SkillsSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4V2 M20 12h2 M4 12H2 M12 22v-2" />
    <path d="M11 7H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h4" />
    <path d="M18 11v5a2 2 0 0 1-2 2h-5" />
    <path d="M14 4h4a2 2 0 0 1 2 2v5" />
    <rect x="11" y="10" width="4" height="4" rx="1" />
  </svg>;
}
function GrowthSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="14" width="3" height="7" rx="0.5" />
    <rect x="9" y="10" width="3" height="11" rx="0.5" />
    <rect x="15" y="5" width="3" height="16" rx="0.5" />
    <path d="M4 11l6-5 6 4 5-8" />
    <polyline points="17 2 21 2 21 6" />
  </svg>;
}
function StarSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="9" r="6" />
    <path d="M8.5 14.5L6 21l6-3 6 3-2.5-6.5" />
    <polygon points="12 6 13 8 15 8 13.5 9.5 14 11.5 12 10.5 10 11.5 10.5 9.5 9 8 11 8" />
  </svg>;
}
function TargetSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
    <path d="M22 2l-7.5 7.5" />
    <polygon points="22 2 18 2 22 6 22 2" />
  </svg>;
}
function NetworkSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <circle cx="4" cy="4" r="2" />
    <circle cx="20" cy="4" r="2" />
    <circle cx="4" cy="20" r="2" />
    <circle cx="20" cy="20" r="2" />
    <line x1="6" y1="6" x2="9.5" y2="9.5" />
    <line x1="18" y1="6" x2="14.5" y2="9.5" />
    <line x1="6" y1="20" x2="9.5" y2="14.5" />
    <line x1="18" y1="20" x2="14.5" y2="14.5" />
  </svg>;
}
function ProfileSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>;
}
function ConfigSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>;
}
function DownloadSvg({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>;
}
